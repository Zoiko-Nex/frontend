"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Pre-defined key target telecommunication markets
const TELECOM_MARKETS = [
  "Multi-country / Global",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Singapore",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Brazil",
  "Mexico",
  "India"
];

const FORMS_API_URL = "https://forms.api.zoikonex.com";

const MAX_REQUIREMENTS = 1500;

export default function DeploymentPage() {
  // --- Country Search Dropdown State ---
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryContainerRef = useRef<HTMLDivElement>(null);

  // --- Form Field State ---
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [operatorType, setOperatorType] = useState("");
  const [projectRequirements, setProjectRequirements] = useState("");

  // --- Submission State ---
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Close dropdown menu automatically on clicking outside the selection container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryContainerRef.current &&
        !countryContainerRef.current.contains(event.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter country selection criteria instantly matching input string
  const filteredCountries = TELECOM_MARKETS.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // Client-side required-field guard (server validates authoritatively).
    const name = fullName.trim();
    const email = workEmail.trim();
    const org = organization.trim();
    const country = countrySearch.trim();

    if (!name || !email || !org || !country || !operatorType) {
      setSubmitStatus("error");
      setErrorMessage("Please complete all required fields marked with *.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitStatus("error");
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    setSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch(`${FORMS_API_URL}/v1/demo-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          work_email: email,
          organization: org,
          job_title: jobTitle.trim(),
          country: country,
          operator_type: operatorType,
          project_requirements: projectRequirements.trim(),
          source_page: "/request-a-demo"
        })
      });

      if (!res.ok) {
        let message = "Something went wrong submitting your request.";
        try {
          const data = await res.json();
          if (data && typeof data.message === "string") message = data.message;
        } catch {
          // non-JSON error body; keep the default message
        }
        setSubmitStatus("error");
        setErrorMessage(message);
        return;
      }

      // 201 Created — the submission is persisted. We intentionally do not
      // surface mail_status to the lead: even if the admin notification failed,
      // their request was saved and will be picked up.
      setSubmitStatus("success");
      setFullName("");
      setWorkEmail("");
      setOrganization("");
      setJobTitle("");
      setOperatorType("");
      setProjectRequirements("");
      setCountrySearch("");
    } catch {
      setSubmitStatus("error");
      setErrorMessage(
        "We couldn't reach the server. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Top Ambient Radial Glow from Figma (at 88% -8%) */}
      <div className="absolute inset-0 bg-radial-[at_88%_-8%] from-lime-500/10 via-transparent to-transparent pointer-events-none" />

      {/* SECTION 1: HERO & MAIN FORM PANEL */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDE: Core Platform Context Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-sky-900 to-sky-950 rounded-[32px] p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-[at_0%_0%] from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm shadow-[0_0_0_4px_rgba(123,193,68,0.18)]" />
                <span className="text-lime-500 text-xs font-semibold font-mono uppercase tracking-widest">
                  REQUEST A DEMO
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Why Operators Choose ZoikoNex for Governed Telecom Monetization
              </h1>

              {/* Description */}
              <p className="mt-5 text-slate-300 text-sm leading-relaxed">
                An infrastructure-grade OSS/BSS platform for real-time charging,
                revenue control, multi-tenant operations, eSIM enablement, and
                governed telecom monetization at scale.
              </p>

              {/* Feature Points Grid */}
              <div className="mt-10 space-y-6">
                
                {/* Feature 1 */}
                <div className="pt-6 border-t border-white/10 flex gap-4 items-start">
                  <span className="text-lime-500 text-xs font-semibold font-mono pt-0.5">01</span>
                  <div>
                    <h4 className="text-white text-base font-bold">Launch Faster</h4>
                    <p className="text-slate-300 text-sm mt-1 leading-normal">
                      Modular deployment pathways and pre-integrated telecom workflows.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="pt-6 border-t border-white/10 flex gap-4 items-start">
                  <span className="text-lime-500 text-xs font-semibold font-mono pt-0.5">02</span>
                  <div>
                    <h4 className="text-white text-base font-bold">Control Revenue Precisely</h4>
                    <p className="text-slate-300 text-sm mt-1 leading-normal">
                      Real-time rating, charging, taxation, settlement, and reconciliation.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="pt-6 border-t border-white/10 flex gap-4 items-start">
                  <span className="text-lime-500 text-xs font-semibold font-mono pt-0.5">03</span>
                  <div>
                    <h4 className="text-white text-base font-bold">Scale with Governance</h4>
                    <p className="text-slate-300 text-sm mt-1 leading-normal">
                      Multi-market, multi-tenant operations with jurisdiction-aware compliance.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Figma Initialization Request Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-[0_18px_48px_-22px_rgba(11,60,99,0.28)] relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-40 h-36 bg-slate-50 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold text-slate-800">
                Initialize Your Deployment
              </h2>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed max-w-2xl">
                Tell us what you are building, migrating, or modernizing. ZoikoNex will route your request to the right deployment, infrastructure, and commercial architecture team.
              </p>

              {submitStatus === "success" ? (
                /* Success Confirmation Panel */
                <div className="mt-8 rounded-2xl border border-lime-500/40 bg-lime-50 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm shadow-[0_0_0_4px_rgba(123,193,68,0.18)]" />
                    <span className="text-lime-700 text-xs font-semibold font-mono uppercase tracking-widest">
                      REQUEST RECEIVED
                    </span>
                  </div>
                  <h3 className="text-slate-800 text-lg font-bold">
                    Thanks — your request is in.
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    We've logged your deployment request and routed it to the team matched to your operator model. Expect to hear from a ZoikoNex architect shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitStatus("idle")}
                    className="mt-5 px-5 py-3 bg-sky-700 text-white text-sm font-bold rounded-xl hover:bg-sky-800 transition"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
                
                {/* Row 1: Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 text-xs font-semibold mb-1.5 flex items-center gap-0.5">
                      Full Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jordan Mensah"
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none text-slate-800 placeholder-slate-400 focus:border-sky-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 text-xs font-semibold mb-1.5 flex items-center gap-0.5">
                      Work Email <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="jordan@operator.com"
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none text-slate-800 placeholder-slate-400 focus:border-sky-600 transition"
                    />
                  </div>
                </div>

                {/* Row 2: Organization & Job Title */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-800 text-xs font-semibold mb-1.5 flex items-center gap-0.5">
                      Organization <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Operator, MVNE, enterprise, or partner"
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none text-slate-800 placeholder-slate-400 focus:border-sky-600 transition"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-slate-800 text-xs font-semibold">Job Title</label>
                      <span className="text-[9px] font-mono font-medium tracking-wider text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 uppercase">
                        RECOMMENDED
                      </span>
                    </div>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="CTO, Head of Product, Founder…"
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none text-slate-800 placeholder-slate-400 focus:border-sky-600 transition"
                    />
                  </div>
                </div>

                {/* Row 3: Country / Market (CUSTOM COMPONENT IMPLEMENTATION) */}
                <div className="relative" ref={countryContainerRef}>
                  <label className="block text-slate-800 text-xs font-semibold mb-1.5 flex items-center gap-0.5">
                    Country / Primary Market <span className="text-red-500 font-bold">*</span>
                  </label>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setIsCountryOpen(true);
                      }}
                      onFocus={() => setIsCountryOpen(true)}
                      placeholder="Search a country, or Multi-country / global"
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none text-slate-800 placeholder-slate-400 focus:border-sky-600 transition"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                      ▼
                    </div>
                  </div>

                  {/* Dropdown Floating Options Panel */}
                  {isCountryOpen && (
                    <div className="absolute left-0 z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-50">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCountrySearch(country);
                              setIsCountryOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-700 transition font-medium"
                          >
                            {country}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-400 italic">
                          No regions matched
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Row 4: Operator Select Dropdown */}
                <div>
                  <label className="block text-slate-800 text-xs font-semibold mb-1.5 flex items-center gap-0.5">
                    Operator Type <span className="text-sky-700 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={operatorType}
                      onChange={(e) => setOperatorType(e.target.value)}
                      className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none text-slate-800 appearance-none focus:border-sky-600 transition"
                    >
                      <option value="" disabled>Select your operator model…</option>
                      <option value="tier-1-mno">Tier-1 MNO</option>
                      <option value="tier-2-mno">Tier-2 MNO</option>
                      <option value="mvne">MVNE</option>
                      <option value="mvna">MVNA</option>
                      <option value="mvno">MVNO</option>
                      <option value="enterprise-iot">Enterprise / IoT Operator</option>
                      <option value="strategic-partner">Strategic Partner / Systems Integrator</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Row 5: Project Requirements */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-slate-800 text-xs font-semibold">Project Requirements</label>
                    <span className="text-[9px] font-mono font-medium tracking-wider text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-slate-50 uppercase">
                      OPTIONAL
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={projectRequirements}
                    onChange={(e) =>
                      setProjectRequirements(e.target.value.slice(0, MAX_REQUIREMENTS))
                    }
                    placeholder="Briefly describe your deployment objective, current platform, target launch timeline, migration need, or integration requirements."
                    className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none text-slate-800 placeholder-slate-400 resize-none focus:border-sky-600 transition"
                  />
                  <span className="block text-right text-[10px] text-slate-400 mt-1">
                    {projectRequirements.length} / {MAX_REQUIREMENTS}
                  </span>
                </div>

                {/* Inline Error Message */}
                {submitStatus === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                {/* Submit Block */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-sky-700 text-white font-bold py-4 rounded-xl shadow-[0_10px_22px_-10px_rgba(22,104,184,0.60)] hover:bg-sky-800 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>{submitting ? "Submitting…" : "Schedule Deployment Consultation"}</span>
                    {!submitting && <span>→</span>}
                  </button>
                  <p className="text-center text-[11px] text-slate-500 leading-normal">
                    By submitting this form, you agree that ZoikoNex may contact you about your request. See{" "}
                    <Link href="#" className="text-sky-700 hover:underline">Privacy Notice</Link>.
                  </p>
                </div>

              </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: AFTER YOU SUBMIT STEP FLOW */}
      <section className="bg-slate-50 py-16 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header Block */}
          <div className="space-y-2 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm" />
              <span className="text-sky-700 text-xs font-semibold font-mono uppercase tracking-widest">
                AFTER YOU SUBMIT
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">
              What happens after you request a demo
            </h2>
            <p className="text-slate-600 text-base max-w-3xl leading-relaxed">
              No generic sales call. Your request is qualified by operator model and routed to the team that can speak to your architecture, migration, and commercial path.
            </p>
          </div>

          {/* Cards Flex/Grid Block */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center bg-slate-50">
                <span className="text-sky-700 text-xs font-semibold font-mono">01</span>
              </div>
              <div>
                <h3 className="text-slate-800 text-base font-bold">Context review</h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  We review your operator model, primary market, scale, and deployment context the moment you submit — no back-and-forth to get started.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center bg-slate-50">
                <span className="text-sky-700 text-xs font-semibold font-mono">02</span>
              </div>
              <div>
                <h3 className="text-slate-800 text-base font-bold">Routed to the right team</h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  Your request reaches the pre-sales, solution architecture, and commercial team matched to your operator class — MNO, MVNE/MVNA, MVNO, enterprise, or partner.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center bg-slate-50">
                <span className="text-sky-700 text-xs font-semibold font-mono">03</span>
              </div>
              <div>
                <h3 className="text-slate-800 text-base font-bold">Tailored demo & consultation</h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  You get a technical demo plus a working session on architecture, migration, compliance, commercial model, and launch planning for your deployment.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: DARK ENGAGEMENT METRICS HERO */}
      <section className="bg-gradient-to-b from-sky-900 to-sky-950 text-white relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 bg-radial-[at_100%_-50%] from-lime-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Action Left details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-lime-500 rounded-sm relative">
                <div className="absolute inset-0 bg-lime-500 rounded-sm shadow-[0_0_0_4px_rgba(123,193,68,0.18)]" />
              </div>
              <span className="text-lime-500 text-xs font-semibold font-mono uppercase tracking-widest">
                SEE ZOIKONEX IN ACTION
              </span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-white max-w-xl">
              Every engagement is technical, structured, and aligned to your operator model.
            </h2>

            <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
              Run telecom like infrastructure — not software. Request a demo, or explore the platform architecture and standards first. Either way, we route you to the right team based on your context.
            </p>

            {/* Dynamic Button Rows */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="#"
                className="px-5 py-3.5 bg-sky-700 text-white text-sm font-bold rounded-xl shadow-[0_12px_24px_-12px_rgba(22,104,184,0.70)] hover:bg-sky-600 transition flex items-center gap-2"
              >
                <span>Request a Demo</span>
                <span>→</span>
              </Link>
              <Link
                href="/platform-architecture"
                className="px-5 py-3.5 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
              >
                View Platform Architecture
              </Link>
              <Link
                href="/technical-architecture"
                className="px-5 py-3.5 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition"
              >
                Start Technical Evaluation
              </Link>
            </div>

            {/* Direct Lines text */}
            <div className="text-sm text-slate-300 pt-2">
              Prefer to talk now?{" "}
              <span className="text-white font-medium mx-1">deployments@zoikonex.com</span>
              &nbsp;·&nbsp;
              <span className="text-white font-medium ml-1">+1 (800) 555-0100</span>
            </div>
          </div>

          {/* Metrics Right Block Grid */}
          <div className="lg:col-span-5 bg-slate-950/40 border border-white/10 rounded-2xl p-6 divide-y divide-white/10">
            
            {/* Metric Item 1 */}
            <div className="py-4 flex justify-between items-center first:pt-0">
              <span className="text-white text-xl font-semibold font-mono tracking-wide">18</span>
              <div className="text-right text-slate-400 text-xs leading-tight">
                Unified domains,<br />zero fragmentation
              </div>
            </div>

            {/* Metric Item 2 */}
            <div className="py-4 flex justify-between items-center">
              <div>
                <span className="text-white text-xl font-semibold font-mono tracking-wide">&lt;200</span>
                <span className="text-lime-500 text-lg font-semibold font-mono ml-0.5">ms</span>
              </div>
              <div className="text-right text-slate-400 text-xs leading-tight">
                Real-time charging<br />performance class
              </div>
            </div>

            {/* Metric Item 3 */}
            <div className="py-4 flex justify-between items-center">
              <span className="text-white text-xl font-semibold font-mono tracking-wide">Multi</span>
              <div className="text-right text-slate-400 text-xs leading-tight">
                Jurisdiction packs<br />at runtime
              </div>
            </div>

            {/* Metric Item 4 */}
            <div className="py-4 flex justify-between items-center last:pb-0">
              <span className="text-white text-xl font-semibold font-mono tracking-wide">4</span>
              <div className="text-right text-slate-400 text-xs leading-tight">
                Deployment models:<br />SaaS to sovereign
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}