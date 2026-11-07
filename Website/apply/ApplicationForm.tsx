"use client";

import { useState, useRef, useEffect } from "react";
import { User, FileText, Globe, Upload } from "lucide-react";

const FORMS_API_URL =
  process.env.NEXT_PUBLIC_FORMS_API_URL ?? "http://localhost:8099";

const MAX_RESUME_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTS = [".pdf", ".doc", ".docx"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputCls =
  "w-full rounded-[8px] border border-[#D1D9E0] bg-white px-4 text-[14px] text-[#1C1D31] placeholder-[#A0AEC0] outline-none transition focus:border-[#2B83C6] focus:ring-2 focus:ring-[#2B83C6]/15";

const labelCls =
  "block mb-[6px] font-mono text-[11px] font-semibold uppercase tracking-[1.5px] text-[#374151]";

// Red required marker appended to a field label.
function Req() {
  return <span className="text-red-500"> *</span>;
}

// Phone is valid when it has 7–15 digits (E.164 tops out at 15) and contains
// only digits and the usual separators (+, spaces, dashes, parentheses, dots).
function isValidPhone(v: string): boolean {
  if (!/^[+\d\s().-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  experience: string;
  motivation: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  resume?: string;
  experience?: string;
  motivation?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  portfolio: "",
  experience: "",
  motivation: "",
};

function fileExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

// Read a File as pure base64 (strips the "data:...;base64," prefix).
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const comma = result.indexOf(",");
      resolve(comma === -1 ? result : result.slice(comma + 1));
    };
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

export default function ApplicationForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [role, setRole] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Capture the position applied for from the apply-page URL:
  //   /apply?role=Telecom+Solution+Architect
  // Read on the client only (avoids SSR/hydration mismatch).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRole((params.get("role") ?? "").trim());
  }, []);

  const fileName = resumeFile?.name ?? null;

  function validate(vals: FormState, file: File | null): FormErrors {
    const e: FormErrors = {};

    if (!vals.fullName.trim()) e.fullName = "Full name is required.";

    if (!vals.email.trim()) e.email = "Email address is required.";
    else if (!EMAIL_RE.test(vals.email.trim()))
      e.email = "Enter a valid email address.";

    if (!vals.phone.trim()) e.phone = "Phone number is required.";
    else if (!isValidPhone(vals.phone.trim()))
      e.phone = "Enter a valid phone number (7–15 digits).";

    if (!vals.linkedin.trim()) e.linkedin = "LinkedIn profile is required.";

    if (!file) {
      e.resume = "A résumé (PDF, DOC, or DOCX) is required.";
    } else if (!ALLOWED_EXTS.includes(fileExt(file.name))) {
      e.resume = "Résumé must be a PDF, DOC, or DOCX file.";
    } else if (file.size > MAX_RESUME_BYTES) {
      e.resume = "Résumé exceeds the 10MB limit.";
    }

    if (!vals.experience.trim())
      e.experience = "Please tell us about your experience.";

    if (!vals.motivation.trim())
      e.motivation = "Please tell us what interests you about ZoikoNex.";

    return e;
  }

  const setField = (name: keyof FormState, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors(validate(next, resumeFile));
  };

  const handleBlur = (name: string) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values, resumeFile));
  };

  const applyFile = (file: File | null) => {
    setResumeFile(file);
    setTouched((t) => ({ ...t, resume: true }));
    setErrors(validate(values, file));
  };

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    applyFile(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) applyFile(e.dataTransfer.files[0]);
  }

  const fieldBorder = (name: keyof FormErrors) =>
    touched[name] && errors[name]
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
      : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(values, resumeFile);
    setErrors(found);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      linkedin: true,
      resume: true,
      experience: true,
      motivation: true,
    });
    if (!agreed || Object.keys(found).length > 0 || !resumeFile) return;

    setStatus("submitting");
    setServerError("");
    try {
      const resumeBase64 = await toBase64(resumeFile);

      const res = await fetch(`${FORMS_API_URL}/v1/careers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          linkedin_url: values.linkedin.trim(),
          portfolio_url: values.portfolio.trim(),
          experience: values.experience.trim(),
          motivation: values.motivation.trim(),
          role: role,
          resume_filename: resumeFile.name,
          resume_content_type: resumeFile.type,
          resume_base64: resumeBase64,
          consent: agreed,
        }),
      });

      let data: {
        career_application_id?: string;
        mail_status?: string;
        mail_error?: string;
        message?: string;
      } | null = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      // The backend persists the application (résumé included) first, then
      // attempts the admin email. A 201 with an id means the data is safe —
      // even if mail_status = NOT_SENT. Only a failed save shows red.
      const saved = res.ok && !!data?.career_application_id;

      if (saved) {
        if (data?.mail_status === "NOT_SENT") {
          console.warn(
            "Career application saved but admin email was not sent:",
            data?.mail_error
          );
        }
        setStatus("success");
        setValues(initialState);
        setResumeFile(null);
        setAgreed(false);
        setTouched({});
      } else {
        setStatus("error");
        setServerError(
          data?.message || `Something went wrong (${res.status}). Please try again.`
        );
      }
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6FF] text-[#2B83C6]">
            <FileText size={22} strokeWidth={2.2} />
          </span>
          <h2 className="text-[18px] font-bold text-[#1C1D31]">
            Application received.
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-[1.6] text-[#4B5563]">
            Thanks for applying to ZoikoNex. Our team will review your submission and
            reach out if there&rsquo;s a fit.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[1.5px] text-[#2B83C6] underline-offset-4 hover:underline"
          >
            Submit another application
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
    >
      {/* ── Personal Information ── */}
      <section className="border-b border-[#EEF2F7] px-4 py-5 sm:px-8 sm:py-7">
        {role && (
          <div className="mb-6 rounded-[8px] border border-[#D7ECFB] bg-[#EAF6FF] px-4 py-3">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[1.5px] text-[#2B83C6]">
              Applying for
            </span>
            <p className="mt-1 text-[15px] font-bold text-[#1C1D31]">{role}</p>
          </div>
        )}
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF6FF] text-[#2B83C6]">
            <User size={13} strokeWidth={2.3} />
          </span>
          <h2 className="text-[15px] font-bold text-[#1C1D31]">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>
              Full Name
              <Req />
            </label>
            <input
              type="text"
              value={values.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="e.g., Alexander Vance"
              style={{ height: "44px" }}
              className={`${inputCls} ${fieldBorder("fullName")}`}
            />
            {touched.fullName && errors.fullName && (
              <p className="mt-1.5 text-[12px] text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              Email Address
              <Req />
            </label>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="alexander@sovereign.io"
              style={{ height: "44px" }}
              className={`${inputCls} ${fieldBorder("email")}`}
            />
            {touched.email && errors.email && (
              <p className="mt-1.5 text-[12px] text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              Phone Number
              <Req />
            </label>
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              placeholder="+1 (555) 000-0000"
              style={{ height: "44px" }}
              className={`${inputCls} ${fieldBorder("phone")}`}
            />
            {touched.phone && errors.phone && (
              <p className="mt-1.5 text-[12px] text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              LinkedIn Profile
              <Req />
            </label>
            <input
              type="url"
              value={values.linkedin}
              onChange={(e) => setField("linkedin", e.target.value)}
              onBlur={() => handleBlur("linkedin")}
              placeholder="linkedin.com/in/username"
              style={{ height: "44px" }}
              className={`${inputCls} ${fieldBorder("linkedin")}`}
            />
            {touched.linkedin && errors.linkedin && (
              <p className="mt-1.5 text-[12px] text-red-600">{errors.linkedin}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>GitHub / Portfolio URL</label>
            <input
              type="url"
              value={values.portfolio}
              onChange={(e) => setField("portfolio", e.target.value)}
              placeholder="github.com/username or personal site"
              style={{ height: "44px" }}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* ── Resume / CV ── */}
      <section className="border-b border-[#EEF2F7] px-8 py-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF6FF] text-[#2B83C6]">
            <FileText size={13} strokeWidth={2.3} />
          </span>
          <h2 className="text-[15px] font-bold text-[#1C1D31]">
            Resume / CV
            <Req />
          </h2>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-[10px] border-[1.5px] border-dashed text-center transition hover:border-[#2B83C6] hover:bg-[#EFF7FF] ${
            touched.resume && errors.resume
              ? "border-red-400 bg-[#FEF2F2]"
              : "border-[#CBD5E1] bg-[#F8FAFD]"
          }`}
          style={{ padding: "40px 24px" }}
        >
          <Upload
            className="mx-auto mb-3 text-[#94A3B8]"
            size={30}
            strokeWidth={1.4}
          />
          {fileName ? (
            <p className="text-[13px] font-semibold text-[#2B83C6]">{fileName}</p>
          ) : (
            <>
              <p className="text-[14px] font-medium text-[#475569]">
                Click to upload or drag and drop
              </p>
              <p className="mt-1.5 text-[12px] text-[#94A3B8]">
                PDF, DOC, DOCX up to 10MB
              </p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFile}
          />
        </div>
        {touched.resume && errors.resume && (
          <p className="mt-2 text-[12px] text-red-600">{errors.resume}</p>
        )}
      </section>

      {/* ── Technical Background ── */}
      <section className="border-b border-[#EEF2F7] px-8 py-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF6FF] text-[#2B83C6]">
            <Globe size={13} strokeWidth={2.3} />
          </span>
          <h2 className="text-[15px] font-bold text-[#1C1D31]">Technical Background</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelCls}>
              Tell us about your experience with Tier-1 telecom infrastructure
              <Req />
            </label>
            <textarea
              rows={4}
              value={values.experience}
              onChange={(e) => setField("experience", e.target.value)}
              onBlur={() => handleBlur("experience")}
              placeholder="Detail your experience with BSS/OSS systems, low-latency protocols, and global scaling..."
              className={`${inputCls} resize-none py-3 ${fieldBorder("experience")}`}
            />
            {touched.experience && errors.experience && (
              <p className="mt-1.5 text-[12px] text-red-600">{errors.experience}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>
              What interests you about ZoikoNex?
              <Req />
            </label>
            <textarea
              rows={4}
              value={values.motivation}
              onChange={(e) => setField("motivation", e.target.value)}
              onBlur={() => handleBlur("motivation")}
              placeholder="Share why you're aligned with our mission of Sovereign Control and precision..."
              className={`${inputCls} resize-none py-3 ${fieldBorder("motivation")}`}
            />
            {touched.motivation && errors.motivation && (
              <p className="mt-1.5 text-[12px] text-red-600">{errors.motivation}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Consent + Submit ── */}
      <section className="px-4 py-5 sm:px-8 sm:py-7">
        {/* Consent */}
        <label className="mb-7 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#CBD5E1] accent-[#2B83C6]"
          />
          <span className="text-[13.5px] leading-[1.65] text-[#4B5563]">
            I agree to the processing of my personal data by ZoikoNex for recruitment
            purposes. I have read and understand the{" "}
            <a href="/privacy-policy" className="text-[#2B83C6] hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-[#2B83C6] hover:underline">
              Terms of Sovereignty
            </a>
            .
          </span>
        </label>

        {/* Server error */}
        {status === "error" && serverError && (
          <p className="mb-5 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
            {serverError}
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!agreed || status === "submitting"}
            style={{
              height: "52px",
              backgroundColor: "#1A4E72",
              borderRadius: "10px",
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
            }}
            className="flex w-full items-center justify-center gap-3 text-white shadow-md transition hover:bg-[#153D61] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-65"
          >
            {status === "submitting" ? "Submitting…" : "Submit Application"}
            {status !== "submitting" && <span style={{ fontSize: "14px" }}>▷</span>}
          </button>
        </div>
      </section>
    </form>
  );
}