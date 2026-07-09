"use client";

import { useState } from "react";

const FORMS_API_URL = "http://localhost:8099";

const inputCls =
  "w-full rounded-[6px] border bg-white px-4 text-[14px] text-[#1A2B4A] placeholder-[#A0AEC0] outline-none transition focus:ring-2 focus:ring-[#1778C8]/15";

const labelCls =
  "block mb-[6px] text-[11px] font-bold uppercase tracking-[1.8px] text-[#4B5563]";

interface FormState {
  fullName: string;
  organization: string;
  inquiryType: string;
  deadline: string;
  details: string;
}

interface FormErrors {
  fullName?: string;
  deadline?: string;
  details?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const initialState: FormState = {
  fullName: "",
  organization: "",
  inquiryType: "Interview Request",
  deadline: "",
  details: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Full name is required.";
  if (!values.deadline) errors.deadline = "Deadline is required.";
  if (!values.details.trim()) errors.details = "Inquiry details are required.";
  return errors;
}

// datetime-local -> RFC3339 UTC (deadline is entered as UTC)
function toUtcIso(deadline: string): string {
  if (!deadline) return "";
  return deadline.length === 16 ? `${deadline}:00Z` : `${deadline}Z`;
}

export function MediaInquiryForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const setField = (name: keyof FormState, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors(validate(next));
  };

  const handleBlur = (name: keyof FormState) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  const fieldBorder = (name: keyof FormErrors) =>
    touched[name] && errors[name]
      ? "border-[#DC2626] focus:border-[#DC2626]"
      : "border-[#D1D9E0] focus:border-[#1778C8]";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ fullName: true, deadline: true, details: true });
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch(`${FORMS_API_URL}/v1/press-media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.fullName.trim(),
          organization: values.organization.trim(),
          inquiry_type: values.inquiryType,
          deadline_utc: toUtcIso(values.deadline),
          details: values.details.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
      setValues(initialState);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section className="bg-[#EAEEF3] py-12 font-['Plus_Jakarta_Sans',sans-serif] lg:py-20">
      <div className="mx-auto max-w-[820px] px-4 sm:px-6">

        {/* White card */}
        <div className="rounded-2xl bg-white px-5 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.07)] sm:px-10 sm:py-10 lg:px-14 lg:py-[52px]">

          {/* Card header */}
          <div className="mb-6 text-center sm:mb-8">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[3px] text-[#1778C8]">
              Media Inquiry
            </p>
            <h2 className="text-[24px] font-extrabold leading-[1.15] text-[#1A2B4A] sm:text-[34px]">
              Connect with Media Relations
            </h2>
            <p className="mt-3 text-[15px] text-[#64748B]">
              Accredited journalists and media organizations receive priority routing.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-[8px] border border-[#BBF7D0] bg-[#F0FDF4] px-5 py-6 text-center">
              <p className="text-[15px] font-bold text-[#166534]">
                Your inquiry has been received.
              </p>
              <p className="mt-1 text-[14px] text-[#15803D]">
                Our media relations team will respond shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 text-[13px] font-bold uppercase tracking-[1.5px] text-[#1778C8] underline-offset-2 hover:underline"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" noValidate onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className={labelCls}>
                  Full Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="text"
                  value={values.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="e.g. Sarah Jenkins"
                  style={{ height: "44px" }}
                  className={`${inputCls} ${fieldBorder("fullName")}`}
                />
                {touched.fullName && errors.fullName && (
                  <p className="mt-1 text-[12px] text-[#DC2626]">{errors.fullName}</p>
                )}
              </div>

              {/* Organization */}
              <div>
                <label className={labelCls}>Organization</label>
                <input
                  type="text"
                  value={values.organization}
                  onChange={(e) => setField("organization", e.target.value)}
                  placeholder="e.g. Global Tech Daily"
                  style={{ height: "44px" }}
                  className={`${inputCls} border-[#D1D9E0] focus:border-[#1778C8]`}
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <label className={labelCls}>Inquiry Type</label>
                <div className="relative">
                  <select
                    value={values.inquiryType}
                    onChange={(e) => setField("inquiryType", e.target.value)}
                    style={{ height: "44px" }}
                    className={`${inputCls} appearance-none border-[#D1D9E0] pr-10 focus:border-[#1778C8]`}
                  >
                    <option>Interview Request</option>
                    <option>Press Release</option>
                    <option>Data / Statistics</option>
                    <option>Executive Quote</option>
                    <option>Product Briefing</option>
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]"
                  >
                    <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Deadline — calendar */}
              <div>
                <label className={labelCls}>
                  Deadline (UTC) <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={values.deadline}
                  onChange={(e) => setField("deadline", e.target.value)}
                  onBlur={() => handleBlur("deadline")}
                  style={{ height: "44px" }}
                  className={`${inputCls} ${fieldBorder("deadline")}`}
                />
                {touched.deadline && errors.deadline && (
                  <p className="mt-1 text-[12px] text-[#DC2626]">{errors.deadline}</p>
                )}
              </div>

              {/* Inquiry Details — full width */}
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Inquiry Details <span className="text-[#DC2626]">*</span>
                </label>
                <textarea
                  rows={5}
                  value={values.details}
                  onChange={(e) => setField("details", e.target.value)}
                  onBlur={() => handleBlur("details")}
                  placeholder="Please provide specific questions or context..."
                  className={`${inputCls} resize-none py-3 ${fieldBorder("details")}`}
                />
                {touched.details && errors.details && (
                  <p className="mt-1 text-[12px] text-[#DC2626]">{errors.details}</p>
                )}
              </div>

              {/* Server error */}
              {status === "error" && serverError && (
                <div className="sm:col-span-2">
                  <p className="rounded-[6px] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#DC2626]">
                    {serverError}
                  </p>
                </div>
              )}

              {/* Submit — full width */}
              <div className="pt-2 sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  style={{
                    height: "52px",
                    backgroundColor: "#1A4E72",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                  className="w-full px-8 text-white transition hover:bg-[#154060] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}

export default MediaInquiryForm;