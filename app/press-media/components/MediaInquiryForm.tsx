"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-[6px] border border-[#D1D9E0] bg-white px-4 text-[14px] text-[#1A2B4A] placeholder-[#A0AEC0] outline-none transition focus:border-[#1778C8] focus:ring-2 focus:ring-[#1778C8]/15";

const labelCls =
  "block mb-[6px] text-[11px] font-bold uppercase tracking-[1.8px] text-[#4B5563]";

export default function MediaInquiryForm() {
  const [inquiryType, setInquiryType] = useState("Interview Request");

  return (
    <section className="bg-[#EAEEF3] py-12 font-['Plus_Jakarta_Sans',sans-serif] lg:py-20">
      <div className="mx-auto max-w-205 px-4 sm:px-6">

        {/* White card */}
        <div className="rounded-2xl bg-white px-5 py-8 shadow-[0_2px_12px_rgba(0,0,0,0.07)] sm:px-10 sm:py-10 lg:px-14 lg:py-13">

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

          {/* Form */}
          <form className="space-y-5">
            {/* Row 1: Full Name + Deadline */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  style={{ height: "44px" }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Deadline (UTC)</label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy, --:-- --"
                  style={{ height: "44px" }}
                  className={`${inputCls} font-mono`}
                />
              </div>
            </div>

            {/* Row 2: Organization + Inquiry Details */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Global Tech Daily"
                  style={{ height: "44px" }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Inquiry Details</label>
                <textarea
                  rows={3}
                  placeholder="Please provide specific questions or context..."
                  className={`${inputCls} resize-none py-3`}
                />
              </div>
            </div>

            {/* Row 3: Inquiry Type */}
            <div className="sm:w-1/2 sm:pr-2.5">
              <label className={labelCls}>Inquiry Type</label>
              <div className="relative">
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  style={{ height: "44px" }}
                  className={`${inputCls} appearance-none pr-10`}
                >
                  <option>Interview Request</option>
                  <option>Press Release</option>
                  <option>Data / Statistics</option>
                  <option>Executive Quote</option>
                  <option>Product Briefing</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  ▾
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
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
                className="w-full px-8 text-white transition hover:bg-[#154060] sm:w-auto sm:min-w-50"
              >
                Submit Request
              </button>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}
