"use client";

/**
 * Inbound Request Forms — request-forms service (8099).
 *
 * The read side of the public marketing forms. Every one of these five forms
 * already POSTs from the public site (contact-us, press-media, request-a-demo,
 * apply, terms-and-services), but nothing in the platform could *read* the
 * submissions back — they went into a database and a mail queue and were
 * invisible from here. This is that missing half.
 *
 * Two things about this service are unlike every other console:
 *
 *   1. **Unauthenticated by design.** A prospect filling in a form has no
 *      tenant and no token, so every route is public. The list endpoints are
 *      public too, which is worth knowing: this screen is not what protects
 *      the data, the deployment's network policy is. Flagged in the UI rather
 *      than left as a surprise.
 *
 *   2. **Mail delivery is part of the record.** Each submission carries
 *      mail_status / mail_error, because the failure that actually matters is
 *      "the lead arrived but nobody was told". Failed delivery is surfaced as
 *      a tile and highlighted per row rather than buried in a detail panel.
 *
 * Résumés are fetched through GET /v1/careers/{id}/resume, which returns the
 * file rather than JSON — so it is opened via the proxy URL directly rather
 * than through the JSON client.
 */

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/admin/client";
import { errMessage } from "@/lib/admin/envelope";
import "../super-admin.css";

interface DemoRequest {
  demo_request_id: string;
  full_name: string;
  work_email: string;
  organization: string;
  job_title?: string;
  country: string;
  operator_type: string;
  mail_status: string;
  mail_error?: string;
  mailed_at?: string;
  created_at: string;
}

interface ContactInquiry {
  contact_us_id: string;
  inquiry_type: string;
  full_name: string;
  work_email: string;
  country: string;
  consent: boolean;
  mail_status: string;
  mail_error?: string;
  created_at: string;
}

interface CareerApplication {
  career_application_id: string;
  full_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  role?: string;
  resume_filename: string;
  resume_content_type: string;
  resume_size: number;
  consent: boolean;
  mail_status: string;
  mail_error?: string;
  created_at: string;
}

interface PressInquiry {
  press_inquiry_id: string;
  full_name: string;
  organization?: string;
  inquiry_type: string;
  deadline_utc: string;
  mail_status: string;
  mail_error?: string;
  created_at: string;
}

interface TermsRequest {
  terms_service_id: string;
  company: string;
  role: string;
  email: string;
  company_type: string;
  launch_market?: string;
  review_need: string;
  timeline?: string;
  consent: boolean;
  mail_status: string;
  mail_error?: string;
  created_at: string;
}

type FormKey = "demo" | "contact" | "careers" | "press" | "terms";

const TABS: { key: FormKey; label: string }[] = [
  { key: "demo", label: "Demo Requests" },
  { key: "contact", label: "Contact" },
  { key: "careers", label: "Careers" },
  { key: "press", label: "Press & Media" },
  { key: "terms", label: "Terms Review" },
];

/** Mail delivery is the failure that matters — a lead nobody was told about. */
function MailChip({ status, error }: { status: string; error?: string }) {
  const s = (status ?? "").toUpperCase();
  const tone = s === "SENT" || s === "DELIVERED" ? "c-green" : s === "FAILED" || s === "ERROR" ? "c-red" : "c-amber";
  return (
    <>
      <span className={`chip ${tone}`}>{status || "UNKNOWN"}</span>
      {error && <div style={{ fontSize: 10, color: "var(--danger)", marginTop: 4, whiteSpace: "normal", maxWidth: 200 }}>{error}</div>}
    </>
  );
}

function Rows({
  colSpan,
  loading,
  error,
  empty,
  emptyLabel,
}: {
  colSpan: number;
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
  emptyLabel: string;
}) {
  if (!loading && !error && !empty) return null;
  return (
    <tr>
      <td colSpan={colSpan} style={{ textAlign: "center", padding: "36px 12px", fontSize: 12 }}>
        {loading ? (
          <span style={{ opacity: 0.6 }}>Loading…</span>
        ) : error ? (
          <span style={{ color: "var(--danger)" }}>{errMessage(error, "Could not load submissions.")}</span>
        ) : (
          <span style={{ opacity: 0.6 }}>{emptyLabel}</span>
        )}
      </td>
    </tr>
  );
}

export default function RequestFormsPage() {
  const [tab, setTab] = useState<FormKey>("demo");

  // Written out rather than generated in a loop: hooks must be called in a
  // stable order, and a helper that calls useQuery is one refactor away from
  // being called conditionally. Each service names its own envelope key.
  const demoQ = useQuery({
    queryKey: ["forms", "demo"],
    enabled: tab === "demo",
    queryFn: async () =>
      (await api.get<{ demo_requests?: DemoRequest[] }>("requestForms", "/v1/demo-requests")).demo_requests ?? [],
  });
  const contactQ = useQuery({
    queryKey: ["forms", "contact"],
    enabled: tab === "contact",
    queryFn: async () =>
      (await api.get<{ contact_us?: ContactInquiry[] }>("requestForms", "/v1/contact-us")).contact_us ?? [],
  });
  const careersQ = useQuery({
    queryKey: ["forms", "careers"],
    enabled: tab === "careers",
    queryFn: async () =>
      (await api.get<{ career_applications?: CareerApplication[] }>("requestForms", "/v1/careers")).career_applications ?? [],
  });
  const pressQ = useQuery({
    queryKey: ["forms", "press"],
    enabled: tab === "press",
    queryFn: async () =>
      (await api.get<{ press_media_inquiries?: PressInquiry[] }>("requestForms", "/v1/press-media")).press_media_inquiries ?? [],
  });
  const termsQ = useQuery({
    queryKey: ["forms", "terms"],
    enabled: tab === "terms",
    queryFn: async () =>
      (await api.get<{ terms_services?: TermsRequest[] }>("requestForms", "/v1/terms-and-services")).terms_services ?? [],
  });

  const active = { demo: demoQ, contact: contactQ, careers: careersQ, press: pressQ, terms: termsQ }[tab];
  const rows = (active.data ?? []) as { mail_status: string }[];
  const failedMail = rows.filter((r) => ["FAILED", "ERROR"].includes((r.mail_status ?? "").toUpperCase())).length;

  /**
   * The résumé endpoint returns a file, not JSON, so it cannot go through the
   * JSON client. It is posted to the proxy and opened as a blob.
   */
  const openResume = async (id: string, filename: string) => {
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ port: 8099, method: "GET", path: `/v1/careers/${id}/resume` }),
      });
      const payload = await res.json();
      if (!payload.ok) throw new Error(payload.data?.message ?? "Résumé download failed");
      // The proxy JSON-decodes what it can; a binary body comes back as text.
      const blob = new Blob([typeof payload.data === "string" ? payload.data : JSON.stringify(payload.data)]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `resume-${id}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(errMessage(e, "Could not download the résumé."));
    }
  };

  return (
    <main className="main" style={{ padding: 24 }}>
      <div className="headrow">
        <div>
          <div className="crumb">Platform / <b>Inbound Requests</b></div>
          <div className="ptitle">Request Forms</div>
          <div className="psub">
            Submissions from the public site. Every one of these forms already posts; this is the first place they can
            be read back.
          </div>
        </div>
      </div>

      {/* This service is public on purpose — worth stating, since a list of
          leads is not something most people expect to be unauthenticated. */}
      <div
        style={{
          background: "var(--bg-l)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 11,
          margin: "12px 0 16px",
        }}
      >
        <strong>request-forms is unauthenticated by design.</strong> A prospect filling in a form has no tenant and no
        token, so every route — including these list endpoints — is public at the service. Access control for this
        data is a network-policy concern, not something this screen enforces.
      </div>

      <div className="kpis" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="kpi">
          <div className="l">Submissions</div>
          <div className="v sm">{active.isLoading ? "…" : rows.length}</div>
        </div>
        <div className="kpi">
          <div className="l">Mail delivered</div>
          <div className="v sm">{active.isLoading ? "…" : rows.length - failedMail}</div>
        </div>
        <div className="kpi">
          <div className="l">Mail failed</div>
          <div className="v sm" style={{ color: failedMail ? "var(--danger)" : undefined }}>
            {active.isLoading ? "…" : failedMail}
          </div>
          <div className="d">
            <span className={`chip ${failedMail ? "c-red" : "c-green"}`}>
              {failedMail ? "Lead received, nobody notified" : "All notified"}
            </span>
          </div>
        </div>
      </div>

      <div className="filters" style={{ marginTop: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`btn btn-sm ${tab === t.key ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tablewrap" style={{ marginTop: 12 }}>
        {tab === "demo" && (
          <table>
            <thead><tr><th>Name</th><th>Organisation</th><th>Operator type</th><th>Country</th><th>Received</th><th>Mail</th></tr></thead>
            <tbody>
              <Rows colSpan={6} loading={demoQ.isLoading} error={demoQ.error} empty={(demoQ.data ?? []).length === 0} emptyLabel="No demo requests submitted." />
              {(demoQ.data ?? []).map((d) => (
                <tr key={d.demo_request_id}>
                  <td className="strong">
                    {d.full_name}
                    <div className="mono" style={{ fontSize: 10, opacity: 0.6 }}>{d.work_email}</div>
                    {d.job_title && <div style={{ fontSize: 10, opacity: 0.5 }}>{d.job_title}</div>}
                  </td>
                  <td>{d.organization}</td>
                  <td>{d.operator_type}</td>
                  <td className="mono">{d.country}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{new Date(d.created_at).toLocaleString()}</td>
                  <td><MailChip status={d.mail_status} error={d.mail_error} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "contact" && (
          <table>
            <thead><tr><th>Name</th><th>Inquiry type</th><th>Country</th><th>Consent</th><th>Received</th><th>Mail</th></tr></thead>
            <tbody>
              <Rows colSpan={6} loading={contactQ.isLoading} error={contactQ.error} empty={(contactQ.data ?? []).length === 0} emptyLabel="No contact inquiries submitted." />
              {(contactQ.data ?? []).map((c) => (
                <tr key={c.contact_us_id}>
                  <td className="strong">
                    {c.full_name}
                    <div className="mono" style={{ fontSize: 10, opacity: 0.6 }}>{c.work_email}</div>
                  </td>
                  <td>{c.inquiry_type}</td>
                  <td className="mono">{c.country}</td>
                  <td><span className={`chip ${c.consent ? "c-green" : "c-amber"}`}>{c.consent ? "GIVEN" : "NOT GIVEN"}</span></td>
                  <td className="mono" style={{ fontSize: 11 }}>{new Date(c.created_at).toLocaleString()}</td>
                  <td><MailChip status={c.mail_status} error={c.mail_error} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "careers" && (
          <table>
            <thead><tr><th>Applicant</th><th>Role</th><th>Links</th><th>Résumé</th><th>Received</th><th>Mail</th></tr></thead>
            <tbody>
              <Rows colSpan={6} loading={careersQ.isLoading} error={careersQ.error} empty={(careersQ.data ?? []).length === 0} emptyLabel="No applications submitted." />
              {(careersQ.data ?? []).map((a) => (
                <tr key={a.career_application_id}>
                  <td className="strong">
                    {a.full_name}
                    <div className="mono" style={{ fontSize: 10, opacity: 0.6 }}>{a.email}</div>
                    {a.phone && <div style={{ fontSize: 10, opacity: 0.5 }}>{a.phone}</div>}
                  </td>
                  <td>{a.role || "—"}</td>
                  <td style={{ fontSize: 10 }}>
                    {a.linkedin_url && <div><a href={a.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a></div>}
                    {a.portfolio_url && <div><a href={a.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a></div>}
                    {!a.linkedin_url && !a.portfolio_url && "—"}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openResume(a.career_application_id, a.resume_filename)}
                      title={`${a.resume_content_type} · ${Math.round(a.resume_size / 1024)} KB`}
                    >
                      {a.resume_filename || "download"}
                    </button>
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>{new Date(a.created_at).toLocaleString()}</td>
                  <td><MailChip status={a.mail_status} error={a.mail_error} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "press" && (
          <table>
            <thead><tr><th>Journalist</th><th>Organisation</th><th>Inquiry type</th><th>Deadline</th><th>Received</th><th>Mail</th></tr></thead>
            <tbody>
              <Rows colSpan={6} loading={pressQ.isLoading} error={pressQ.error} empty={(pressQ.data ?? []).length === 0} emptyLabel="No press inquiries submitted." />
              {(pressQ.data ?? []).map((p) => {
                // A press deadline in the past is the one thing on this screen
                // that is actionable purely by looking at it.
                const overdue = p.deadline_utc && new Date(p.deadline_utc) < new Date();
                return (
                  <tr key={p.press_inquiry_id}>
                    <td className="strong">{p.full_name}</td>
                    <td>{p.organization || "—"}</td>
                    <td>{p.inquiry_type}</td>
                    <td className="mono" style={{ fontSize: 11, color: overdue ? "var(--danger)" : undefined }}>
                      {p.deadline_utc ? new Date(p.deadline_utc).toLocaleString() : "—"}
                      {overdue && <div style={{ fontSize: 10 }}>passed</div>}
                    </td>
                    <td className="mono" style={{ fontSize: 11 }}>{new Date(p.created_at).toLocaleString()}</td>
                    <td><MailChip status={p.mail_status} error={p.mail_error} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {tab === "terms" && (
          <table>
            <thead><tr><th>Company</th><th>Contact</th><th>Review need</th><th>Market / timeline</th><th>Received</th><th>Mail</th></tr></thead>
            <tbody>
              <Rows colSpan={6} loading={termsQ.isLoading} error={termsQ.error} empty={(termsQ.data ?? []).length === 0} emptyLabel="No terms-review requests submitted." />
              {(termsQ.data ?? []).map((t) => (
                <tr key={t.terms_service_id}>
                  <td className="strong">
                    {t.company}
                    <div style={{ fontSize: 10, opacity: 0.5 }}>{t.company_type}</div>
                  </td>
                  <td>
                    {t.role}
                    <div className="mono" style={{ fontSize: 10, opacity: 0.6 }}>{t.email}</div>
                  </td>
                  <td>{t.review_need}</td>
                  <td style={{ fontSize: 11 }}>
                    {t.launch_market || "—"}
                    {t.timeline && <div style={{ opacity: 0.6 }}>{t.timeline}</div>}
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>{new Date(t.created_at).toLocaleString()}</td>
                  <td><MailChip status={t.mail_status} error={t.mail_error} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
