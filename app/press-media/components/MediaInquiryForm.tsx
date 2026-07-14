"use client";

import { useState } from "react";
import Image from "next/image";

const FORMS_API_URL = "http://localhost:8099";

const inputCls =
  "w-full flex-1 bg-stone-50 px-4 py-3.5 text-base text-zinc-900 placeholder-gray-500 outline outline-1 outline-offset-[-1px] outline-slate-200 focus:outline-sky-600 transition-all";

const labelCls =
  "flex w-full flex-col justify-start items-start text-[10px] font-bold leading-4 tracking-wider text-zinc-700 mb-2 uppercase";

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

  const fieldOutline = (name: keyof FormErrors) =>
    touched[name] && errors[name]
      ? "outline-red-500 focus:outline-red-600"
      : "outline-slate-200 focus:outline-sky-600";

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
    <section className="bg-zinc-100 px-6 py-16 lg:px-48 lg:py-28 flex flex-col items-center justify-center">
      <div className="relative flex w-full max-w-[896px] flex-col items-start gap-12 bg-white p-8 lg:p-16 outline outline-1 outline-offset-[-1px] outline-slate-200 shadow-xl">
        
        {/* Card header */}
        <div className="flex w-full flex-col items-center gap-4 pt-2">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-sky-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            MEDIA INQUIRY
          </div>
          <div className="flex flex-col items-center pt-1">
            <h2 className="text-center text-3xl lg:text-4xl font-semibold leading-tight lg:leading-[48px] text-zinc-900" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              Connect with Media Relations
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-center text-base font-normal leading-6 text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              Accredited journalists and media organizations receive priority routing.
            </p>
          </div>
        </div>

        {status === "success" ? (
          <div className="flex w-full flex-col items-center rounded bg-green-50 px-6 py-12 outline outline-1 outline-green-200">
            <p className="text-lg font-semibold text-green-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your inquiry has been received.
            </p>
            <p className="mt-2 text-base text-green-700" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our media relations team will respond shortly.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 text-xs font-bold uppercase tracking-wider text-sky-700 underline-offset-4 hover:underline"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form className="flex w-full flex-col items-start" noValidate onSubmit={handleSubmit}>
            <div className="flex w-full flex-col gap-6">
              
              {/* Full Name */}
              <div className="flex w-full flex-col gap-2">
                <label className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={values.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  onBlur={() => handleBlur("fullName")}
                  placeholder="e.g. Sarah Jenkins"
                  className={`${inputCls} ${fieldOutline("fullName")}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {touched.fullName && errors.fullName && (
                  <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Organization */}
              <div className="flex w-full flex-col gap-2">
                <label className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  ORGANIZATION
                </label>
                <input
                  type="text"
                  value={values.organization}
                  onChange={(e) => setField("organization", e.target.value)}
                  placeholder="e.g. Global Tech Daily"
                  className={`${inputCls} outline-slate-200 focus:outline-sky-600`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Inquiry Type */}
              <div className="flex w-full flex-col gap-2">
                <label className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  INQUIRY TYPE
                </label>
                <div className="relative flex w-full">
                  <select
                    value={values.inquiryType}
                    onChange={(e) => setField("inquiryType", e.target.value)}
                    className={`${inputCls} appearance-none pr-10 outline-slate-200 focus:outline-sky-600`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option>Interview Request</option>
                    <option>Press Release</option>
                    <option>Data / Statistics</option>
                    <option>Executive Quote</option>
                    <option>Product Briefing</option>
                  </select>
                  <Image
                    src="/image/press/chevron-down.svg"
                    alt="Select option"
                    width={16}
                    height={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div className="flex w-full flex-col gap-2 pb-5">
                <label className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  DEADLINE (UTC)
                </label>
                <input
                  type="datetime-local"
                  value={values.deadline}
                  onChange={(e) => setField("deadline", e.target.value)}
                  onBlur={() => handleBlur("deadline")}
                  className={`${inputCls} ${fieldOutline("deadline")}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {touched.deadline && errors.deadline && (
                  <p className="mt-1 text-xs text-red-600">{errors.deadline}</p>
                )}
              </div>

              {/* Inquiry Details */}
              <div className="flex w-full flex-col gap-2 pb-1.5">
                <label className={labelCls} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  INQUIRY DETAILS
                </label>
                <textarea
                  rows={5}
                  value={values.details}
                  onChange={(e) => setField("details", e.target.value)}
                  onBlur={() => handleBlur("details")}
                  placeholder="Please provide specific questions or context..."
                  className={`${inputCls} resize-none pt-3 pb-14 ${fieldOutline("details")}`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                {touched.details && errors.details && (
                  <p className="mt-1 text-xs text-red-600">{errors.details}</p>
                )}
              </div>

              {/* Server error */}
              {status === "error" && serverError && (
                <div className="w-full">
                  <p className="rounded bg-red-50 px-4 py-3 text-sm text-red-600">
                    {serverError}
                  </p>
                </div>
              )}

              {/* Submit */}
              <div className="flex h-16 w-full items-end justify-start pt-4">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex flex-col items-center justify-center rounded-sm bg-cyan-700 px-12 py-4 transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-center text-sm font-semibold uppercase leading-4 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {status === "submitting" ? "Submitting..." : "Submit Request"}
                  </span>
                </button>
              </div>

            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default MediaInquiryForm;