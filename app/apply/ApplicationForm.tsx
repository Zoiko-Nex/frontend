"use client";

import { useState, useRef } from "react";
import { User, FileText, Globe, Upload } from "lucide-react";

const inputCls =
  "w-full rounded-[8px] border border-[#D1D9E0] bg-white px-4 text-[14px] text-[#1C1D31] placeholder-[#A0AEC0] outline-none transition focus:border-[#2B83C6] focus:ring-2 focus:ring-[#2B83C6]/15";

const labelCls =
  "block mb-[6px] font-mono text-[11px] font-semibold uppercase tracking-[1.5px] text-[#374151]";

export default function ApplicationForm() {
  const [agreed, setAgreed] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) setFileName(e.target.files[0].name);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setFileName(e.dataTransfer.files[0].name);
  }

  return (
    <form className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">

      {/* ── Personal Information ── */}
      <section className="border-b border-[#EEF2F7] px-4 py-5 sm:px-8 sm:py-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF6FF] text-[#2B83C6]">
            <User size={13} strokeWidth={2.3} />
          </span>
          <h2 className="text-[15px] font-bold text-[#1C1D31]">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Full Name</label>
            <input
              type="text"
              placeholder="e.g., Alexander Vance"
              style={{ height: "44px" }}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Email Address</label>
            <input
              type="email"
              placeholder="alexander@sovereign.io"
              style={{ height: "44px" }}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Phone Number</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              style={{ height: "44px" }}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>LinkedIn Profile</label>
            <input
              type="url"
              placeholder="linkedin.com/in/username"
              style={{ height: "44px" }}
              className={inputCls}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>GitHub / Portfolio URL</label>
            <input
              type="url"
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
          <h2 className="text-[15px] font-bold text-[#1C1D31]">Resume / CV</h2>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="cursor-pointer rounded-[10px] border-[1.5px] border-dashed border-[#CBD5E1] bg-[#F8FAFD] text-center transition hover:border-[#2B83C6] hover:bg-[#EFF7FF]"
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
            </label>
            <textarea
              rows={4}
              placeholder="Detail your experience with BSS/OSS systems, low-latency protocols, and global scaling..."
              className={`${inputCls} resize-none py-3`}
            />
          </div>

          <div>
            <label className={labelCls}>What interests you about ZoikoNex?</label>
            <textarea
              rows={4}
              placeholder="Share why you're aligned with our mission of Sovereign Control and precision..."
              className={`${inputCls} resize-none py-3`}
            />
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!agreed}
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
            Submit Application
            <span style={{ fontSize: "14px" }}>▷</span>
          </button>
        </div>
      </section>
    </form>
  );
}
