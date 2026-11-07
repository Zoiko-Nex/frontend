"use client";

/**
 * RouteAccessManager — assign URLs (routes) to roles, with live duplicate
 * detection. Mounted by app/dashboard/route-access/page.tsx.
 *
 * The centerpiece: as the admin types a URL, we canonicalize it client-side
 * (lib/access-control/canonical.ts, a mirror of the Go backend) and check it
 * against existing bindings. If a structurally-different-but-equivalent route
 * already exists (e.g. /products/{id}/edit vs /products_edit/id), we surface the
 * saved binding *before* submit. On submit, the backend is the source of truth:
 * a 409 ROUTE_ALREADY_BOUND swaps the form to the "already assigned" view.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { AccessControlClient } from "@/lib/access-control/api";
import { ApiRequestError } from "@/lib/access-control/api";
import type { Role, RouteBinding } from "@/lib/access-control/types";
import { canonicalize } from "@/lib/access-control/canonical";
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  Spinner,
  TextInput,
  useToast,
} from "./ui";

type Draft = {
  id?: string;
  url: string;
  label: string;
  roleName: string;
};
const emptyDraft: Draft = { url: "", label: "", roleName: "" };

export function RouteAccessManager({ client }: { client: AccessControlClient }) {
  const toast = useToast();
  const [bindings, setBindings] = useState<RouteBinding[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // when a save (or the live check) finds an existing binding:
  const [conflict, setConflict] = useState<RouteBinding | null>(null);

  const [pendingDelete, setPendingDelete] = useState<RouteBinding | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [b, r] = await Promise.all([
        client.listBindings(),
        client.listRoles(),
      ]);
      setBindings(b);
      setRoles(r);
    } catch (e) {
      setLoadError(
        e instanceof ApiRequestError ? e.message : "Could not load route access."
      );
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Live duplicate detection ────────────────────────────────────────────
  // Recomputed on every keystroke; cheap (pure string work).
  const liveMatch = useMemo(() => {
    if (!draft || !draft.url.trim()) return null;
    const fp = canonicalize(draft.url);
    if (!fp.resource.length && !fp.host) return null;
    const hit = bindings.find(
      (b) => b.canonical_key === fp.key && b.id !== draft.id
    );
    return { fp, hit: hit ?? null };
  }, [draft, bindings]);

  const openCreate = () => {
    setFormError(null);
    setConflict(null);
    setDraft({ ...emptyDraft, roleName: roles[0]?.name ?? "" });
  };
  const openEdit = (b: RouteBinding) => {
    setFormError(null);
    setConflict(null);
    setDraft({ id: b.id, url: b.raw_url, label: b.label, roleName: b.role_name });
  };

  const save = async () => {
    if (!draft) return;
    const url = draft.url.trim();
    if (!url) return setFormError("Enter the URL to protect.");
    if (!draft.roleName) return setFormError("Pick a role to assign it to.");

    setSaving(true);
    setFormError(null);
    try {
      if (draft.id) {
        await client.updateBinding(draft.id, {
          url,
          label: draft.label.trim(),
          role_name: draft.roleName,
        });
        toast("success", "Route access updated.");
      } else {
        await client.createBinding({
          url,
          label: draft.label.trim(),
          role_name: draft.roleName,
        });
        toast("success", "Route assigned.");
      }
      setDraft(null);
      await load();
    } catch (e) {
      if (e instanceof ApiRequestError && e.conflict) {
        // Backend found an equivalent route — show the existing binding.
        setConflict(e.conflict.existing);
      } else {
        toast("error", e instanceof ApiRequestError ? e.message : "Save failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await client.deleteBinding(pendingDelete.id);
      toast("success", "Route access removed.");
      setPendingDelete(null);
      await load();
    } catch (e) {
      toast("error", e instanceof ApiRequestError ? e.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const visible = useMemo(() => {
    const list =
      roleFilter === "all"
        ? bindings
        : bindings.filter((b) => b.role_name === roleFilter);
    return [...list].sort((a, b) => a.canonical_key.localeCompare(b.canonical_key));
  }, [bindings, roleFilter]);

  const actionTone = (action: string) =>
    action === "delete"
      ? "red"
      : action === "edit" || action === "create"
      ? "amber"
      : action === "view" || action === "list"
      ? "green"
      : "gray";

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Route access
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Assign a URL to a role. Differently-written URLs for the same page
            are recognized as one.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} disabled={roles.length === 0}>
          Assign route
        </Button>
      </header>

      {roles.length === 0 && !loading && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:ring-amber-900">
          Create a role first on the Roles screen, then come back to assign URLs
          to it.
        </div>
      )}

      {/* Filter */}
      {bindings.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Filter by role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border-0 bg-white py-1.5 pl-2 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
          >
            <option value="all">All roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-gray-500 dark:text-gray-400">
          <Spinner className="h-4 w-4" /> Loading…
        </div>
      ) : loadError ? (
        <EmptyState
          title="Couldn’t load route access"
          body={loadError}
          action={<Button onClick={load}>Try again</Button>}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="No routes assigned"
          body="Assign a URL to a role to control who can reach it."
          action={
            roles.length > 0 ? (
              <Button variant="primary" onClick={openCreate}>
                Assign route
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900/60 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Recognized as</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {visible.map((b) => (
                <tr key={b.id} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {b.label || b.raw_url}
                    </div>
                    {b.label && (
                      <div className="mt-0.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                        {b.raw_url}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-600 dark:text-gray-300">
                        {b.resource_path || "—"}
                      </span>
                      <Badge tone={actionTone(b.action) as any}>{b.action}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="indigo">{b.role_name}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" onClick={() => openEdit(b)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                        onClick={() => setPendingDelete(b)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / edit modal */}
      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? "Edit route access" : "Assign route"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraft(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save} loading={saving}>
              {draft?.id ? "Save changes" : "Assign route"}
            </Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <Field
              label="URL"
              error={formError && !draft.url.trim() ? formError : null}
              hint="Paste the page URL. Use {id} for the changing part, e.g. mysite.com/products/{id}/edit"
            >
              <TextInput
                autoFocus
                value={draft.url}
                placeholder="mysite.com/products/{id}/edit"
                onChange={(e) => {
                  setFormError(null);
                  setDraft({ ...draft, url: e.target.value });
                }}
              />
            </Field>

            {/* Live canonical preview + duplicate warning */}
            {liveMatch && (
              <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs dark:bg-gray-800/60">
                <div className="text-gray-500 dark:text-gray-400">
                  Recognized as{" "}
                  <span className="font-mono text-gray-700 dark:text-gray-200">
                    {liveMatch.fp.resource.join("/") || "—"}
                  </span>{" "}
                  · <span className="font-medium">{liveMatch.fp.action}</span>
                </div>
                {liveMatch.hit && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                    <span>⚠</span>
                    <span>
                      Already assigned to{" "}
                      <span className="font-semibold">
                        {liveMatch.hit.role_name}
                      </span>{" "}
                      as “{liveMatch.hit.label || liveMatch.hit.raw_url}”.
                    </span>
                  </div>
                )}
              </div>
            )}

            <Field label="Route name" hint="Optional label so it’s easy to spot in the list.">
              <TextInput
                value={draft.label}
                placeholder="Product edit page"
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              />
            </Field>

            <Field
              label="Role"
              error={formError && !draft.roleName ? formError : null}
            >
              <select
                value={draft.roleName}
                onChange={(e) => setDraft({ ...draft, roleName: e.target.value })}
                className="block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}
      </Modal>

      {/* "Already assigned" form — shown when the backend returns 409 */}
      <Modal
        open={conflict !== null}
        onClose={() => setConflict(null)}
        title="This route is already assigned"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConflict(null)}>
              Keep existing
            </Button>
            {conflict && (
              <Button
                variant="primary"
                onClick={() => {
                  openEdit(conflict);
                  setConflict(null);
                }}
              >
                Edit the existing one
              </Button>
            )}
          </>
        }
      >
        {conflict && (
          <div className="space-y-3 text-sm">
            <p className="text-gray-600 dark:text-gray-300">
              The URL you entered points to the same page as a route that’s
              already assigned. We didn’t create a duplicate.
            </p>
            <dl className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-gray-500 dark:text-gray-400">Route</dt>
                <dd className="text-right font-medium text-gray-900 dark:text-gray-100">
                  {conflict.label || conflict.raw_url}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-gray-500 dark:text-gray-400">Original URL</dt>
                <dd className="text-right font-mono text-xs text-gray-700 dark:text-gray-200">
                  {conflict.raw_url}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-1">
                <dt className="text-gray-500 dark:text-gray-400">Assigned role</dt>
                <dd className="text-right">
                  <Badge tone="indigo">{conflict.role_name}</Badge>
                </dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove route access"
        loading={deleting}
        body={
          <>
            Remove access binding for{" "}
            <span className="font-medium">
              {pendingDelete?.label || pendingDelete?.raw_url}
            </span>
            ? The URL will no longer be tied to{" "}
            <Badge tone="indigo">{pendingDelete?.role_name}</Badge>.
          </>
        }
        confirmLabel="Remove"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default RouteAccessManager;
