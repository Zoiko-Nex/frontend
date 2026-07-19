"use client";

/**
 * RolesManager — add / edit / delete roles.
 * Mounted by app/dashboard/roles/page.tsx.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { AccessControlClient } from "@/lib/access-control/api";
import { ApiRequestError } from "@/lib/access-control/api";
import type { Role } from "@/lib/access-control/types";
import {
  Badge,
  Button,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  Spinner,
  TextInput,
  Textarea,
  useToast,
} from "./ui";

type Draft = { id?: string; name: string; description: string };
const emptyDraft: Draft = { name: "", description: "" };

export function RolesManager({ client }: { client: AccessControlClient }) {
  const toast = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setRoles(await client.listRoles());
    } catch (e) {
      setLoadError(
        e instanceof ApiRequestError ? e.message : "Could not load roles."
      );
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setNameError(null);
    setDraft({ ...emptyDraft });
  };
  const openEdit = (r: Role) => {
    setNameError(null);
    setDraft({ id: r.id, name: r.name, description: r.description });
  };

  const save = async () => {
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) {
      setNameError("Give the role a name.");
      return;
    }
    setSaving(true);
    try {
      if (draft.id) {
        await client.updateRole(draft.id, {
          name,
          description: draft.description.trim(),
        });
        toast("success", `Role “${name}” updated.`);
      } else {
        await client.createRole({ name, description: draft.description.trim() });
        toast("success", `Role “${name}” created.`);
      }
      setDraft(null);
      await load();
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 409) {
        setNameError("A role with this name already exists.");
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
      await client.deleteRole(pendingDelete.id);
      toast("success", `Role “${pendingDelete.name}” deleted.`);
      setPendingDelete(null);
      await load();
    } catch (e) {
      toast("error", e instanceof ApiRequestError ? e.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const sorted = useMemo(
    () => [...roles].sort((a, b) => a.name.localeCompare(b.name)),
    [roles]
  );

  return (
    <div>
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Roles
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Named sets of access. Assign URLs to them on Route Access.
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          Add role
        </Button>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-gray-500 dark:text-gray-400">
          <Spinner className="h-4 w-4" /> Loading roles…
        </div>
      ) : loadError ? (
        <EmptyState
          title="Couldn’t load roles"
          body={loadError}
          action={<Button onClick={load}>Try again</Button>}
        />
      ) : sorted.length === 0 ? (
        <EmptyState
          title="No roles yet"
          body="Create your first role, then assign URLs to it on the Route Access screen."
          action={
            <Button variant="primary" onClick={openCreate}>
              Add role
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900/60 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {sorted.map((r) => (
                <tr key={r.id} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {r.description || (
                      <span className="text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" onClick={() => openEdit(r)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                        onClick={() => setPendingDelete(r)}
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
        title={draft?.id ? "Edit role" : "Add role"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDraft(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save} loading={saving}>
              {draft?.id ? "Save changes" : "Create role"}
            </Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-4">
            <Field label="Name" error={nameError}>
              <TextInput
                autoFocus
                value={draft.name}
                placeholder="e.g. Product Editor"
                onChange={(e) => {
                  setNameError(null);
                  setDraft({ ...draft, name: e.target.value });
                }}
              />
            </Field>
            <Field label="Description" hint="Optional — what this role is for.">
              <Textarea
                value={draft.description}
                placeholder="Can edit product pages"
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </Field>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete role"
        loading={deleting}
        body={
          <>
            Delete <Badge tone="indigo">{pendingDelete?.name}</Badge>? Any URL
            bindings pointing at it will be removed too. This can’t be undone.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default RolesManager;
