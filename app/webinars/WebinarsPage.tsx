"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Play,
  Search,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  X,
  FileText,
  Layers,
  BookOpen,
  Video,
  Check,
  Plus,
  Minus,
  Briefcase,
  Code2,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  MonitorCheck,
  Sparkles,
} from "lucide-react";

interface Webinar {
  id: string;
  date: string;
  day: string;
  month: string;
  title: string;
  description: string;
  time: string;
  duration: string;
  type: string;
  role: string;
  speaker: string;
  speakerRole: string;
  status: "open" | "waitlist" | "rescheduled";
  statusText: string;
  category: string;
  badgeBg: string;
}

interface ReplayItem {
  id: string;
  title: string;
  recordedDate: string;
  duration: string;
  category: string;
  currentness: "CURRENT" | "REVIEW DUE" | "SUPERSEDED";
  tags: string[];
  imageSrc: string;
  speaker: string;
}

const SPEAKER_IMAGES: Record<string, string> = {
  "M. Alderin": "/image/webinars/speaker-malderin.png",
  "R. Okafor": "/image/webinars/speaker-rokafor.png",
  "S. Devraj": "/image/webinars/speaker-sdevraj.png",
};

const UPCOMING_SESSIONS: Webinar[] = [
  {
    id: "rtc-arch",
    date: "Sep 16, 2026",
    day: "16",
    month: "SEP",
    title: "Real-Time Charging at Operator Scale: Architecture Deep Dive",
    description:
      "See how event-driven charging keeps sub-200ms performance across prepaid, postpaid and roaming.",
    time: "10:00 AM PT",
    duration: "45 min",
    type: "Live webinar",
    role: "CTO / Architect",
    speaker: "M. Alderin",
    speakerRole: "Chief Architect",
    status: "open",
    statusText: "REGISTRATION OPEN",
    category: "Monetization & billing",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "jurisdiction-packs",
    date: "Sep 23, 2026",
    day: "23",
    month: "SEP",
    title: "Jurisdiction Packs: Runtime Tax & Compliance Orchestration",
    description:
      "A walkthrough of activating markets without redeployment using runtime jurisdiction packs.",
    time: "9:00 AM ET",
    duration: "50 min",
    type: "Live webinar",
    role: "Governance",
    speaker: "R. Okafor",
    speakerRole: "VP Compliance",
    status: "waitlist",
    statusText: "WAITLIST",
    category: "Governance & evidence",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "ai-gov-rev",
    date: "Sep 30, 2026",
    day: "30",
    month: "SEP",
    title: "AI Governance in Revenue Systems: The Policy Guardrail Model",
    description:
      "Moved from Sep 18. How ZoikoNex scopes AI to recommend, score and flag — never act unsupervised.",
    time: "11:00 AM PT",
    duration: "40 min",
    type: "Live webinar",
    role: "Executive",
    speaker: "S. Devraj",
    speakerRole: "Head of AI Ethics",
    status: "rescheduled",
    statusText: "RESCHEDULED",
    category: "AI governance",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

const REPLAY_LIBRARY: ReplayItem[] = [
  {
    id: "evd-ledger-fund",
    title: "Evidence Ledger Fundamentals: Legally Defensible Billing",
    recordedDate: "Recorded Aug 4, 2026",
    duration: "38:12",
    category: "Security",
    currentness: "CURRENT",
    tags: ["CC: EN, ES", "Transcript"],
    imageSrc: "/image/webinars/evidence-thumb.png",
    speaker: "T. Vance, Lead Security Architect",
  },
  {
    id: "esim-lifecycle",
    title: "eSIM Lifecycle Management for MVNOs",
    recordedDate: "Recorded Jun 12, 2026",
    duration: "44:50",
    category: "eSIM / IoT",
    currentness: "REVIEW DUE",
    tags: ["CC: EN", "Transcript"],
    imageSrc: "/image/webinars/esim-thumb.png",
    speaker: "K. Lindqvist, IoT Infrastructure",
  },
  {
    id: "camara-api",
    title: "Network API Monetization with CAMARA",
    recordedDate: "Recorded Feb 2, 2026",
    duration: "51:03",
    category: "Network API",
    currentness: "SUPERSEDED",
    tags: ["CC: EN", "Transcript gated"],
    imageSrc: "/image/webinars/network-thumb.png",
    speaker: "E. Chen, Telco API Lead",
  },
];

const ROLES = [
  { id: "executive", label: "Executive", count: "6 sessions", iconSrc: "/image/webinars/icon-executive.png" },
  { id: "cto-architect", label: "CTO / Architect", count: "11 sessions", iconSrc: "/image/webinars/icon-architect.png" },
  { id: "developer", label: "Developer", count: "9 sessions", iconSrc: "/image/webinars/icon-developer.png" },
  { id: "commercial", label: "Commercial", count: "4 sessions", iconSrc: "/image/webinars/icon-commercial.png" },
  { id: "finance", label: "Finance", count: "3 sessions", iconSrc: "/image/webinars/icon-finance.png" },
  { id: "security", label: "Security", count: "5 sessions", iconSrc: "/image/webinars/icon-security.png" },
];

const TOPICS = [
  "Monetization & billing",
  "Architecture & deployment",
  "Integration & APIs",
  "Governance & evidence",
  "AI governance",
  "Security & compliance",
  "Launch & modernization",
  "eSIM / IoT / Network API",
];

const FAQS = [
  {
    q: "How are session times shown?",
    a: "Every live session shows your localized date and time plus its named timezone. The canonical time and UTC offset are always available on the session detail page and in the calendar file (.ics).",
  },
  {
    q: "Do I need to register to attend?",
    a: "Yes. Registration generates your secure, personal attendance token and grants direct access to live Q&A with the architecture and product team leads.",
  },
  {
    q: "Are webinars recorded, and can I watch older ones?",
    a: "All sessions are recorded and published to our On-Demand Library with full interactive transcripts, chapters, and versioned documentation citations within 24 hours.",
  },
  {
    q: "What happens if a session is rescheduled or cancelled?",
    a: "Your registration automatically migrates to the revised date, and your calendar invite is updated over CalDAV. If you cannot attend the new time, the on-demand replay is emailed directly to you.",
  },
  {
    q: "Are webinars a substitute for documentation or contracts?",
    a: "No. Webinars provide architectural context and engineering walkthroughs. Authoritative SLAs, API specifications, and compliance rules are defined in the canonical ZoikoNex documentation and executed contracts.",
  },
];

export default function WebinarsPage() {
  const [selectedRole, setSelectedRole] = useState("cto-architect");
  const [selectedTopic, setSelectedTopic] = useState("Monetization & billing");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chapters" | "transcript" | "captions">("chapters");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Registration form state
  const [regForm, setRegForm] = useState({
    email: "",
    name: "",
    company: "",
    question: "",
    serviceEmails: true,
    marketingEmails: false,
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regForm.email && regForm.name) {
      setIsRegistered(true);
    }
  };

  return (
    <div className="w-full bg-[#EEF2F7] text-slate-900 min-h-screen">
      {/* 1. HERO SECTION (Figma exact: Dark Navy `#08182B`) */}
      <section className="relative overflow-hidden bg-[#08182B] text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase">
                <span className="w-4 h-[2px] bg-sky-400 inline-block" />
                WEBINARS
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight lg:leading-[1.15]">
                Live and recorded sessions for governed telecom operations.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Explore approved ZoikoNex sessions for telecom monetization, architecture,
                integration, governance, operations and platform evaluation. See what&apos;s upcoming,
                watch available replays, and follow each session into current documentation or resources.
              </p>

              <div className="pt-2">
                <a
                  href="#upcoming-sessions"
                  className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549c29] text-white font-semibold transition-all duration-150 text-sm inline-flex items-center justify-center shadow-sm"
                >
                  Browse Sessions
                </a>
              </div>
            </div>

            {/* Right Visual Video Image */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                <div className="relative h-64 sm:h-80 w-full">
                  <Image
                    src="/image/webinars/hero-meeting.png"
                    alt="Hybrid Video Conference Meeting"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING SESSIONS */}
      <section id="upcoming-sessions" className="py-16 sm:py-20 bg-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
                <span className="w-3 h-[2px] bg-blue-600 inline-block" />
                UPCOMING LIVE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Scheduled sessions open for registration
              </h2>
            </div>
            <a
              href="#on-demand"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
            >
              View on-demand library <span className="text-sm">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UPCOMING_SESSIONS.map((session) => (
              <div
                key={session.id}
                className="rounded-xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-bold text-slate-900 leading-none">{session.day}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                        {session.month}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${session.badgeBg}`}
                    >
                      {session.statusText}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {session.title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                    {session.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-1.5 border-t border-slate-100 pt-3 mb-4 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {session.time} · {session.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3 text-slate-400" />
                        {session.type} · {session.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden relative">
                        {SPEAKER_IMAGES[session.speaker] ? (
                          <Image
                            src={SPEAKER_IMAGES[session.speaker]}
                            alt={session.speaker}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-xs font-bold text-slate-700">{session.speaker.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-800">{session.speaker}</span>
                    </div>

                    {session.status === "open" && (
                      <a
                        href="#register-section"
                        className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        Register
                      </a>
                    )}
                    {session.status === "waitlist" && (
                      <a
                        href="#register-section"
                        className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        Join waitlist
                      </a>
                    )}
                    {session.status === "rescheduled" && (
                      <a
                        href="#register-section"
                        className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                      >
                        View details
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ON-DEMAND REPLAY LIBRARY */}
      <section id="on-demand" className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-blue-600 inline-block" />
              ON-DEMAND LIBRARY
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Watch available replays
            </h2>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search replays by title, topic or speaker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto text-xs text-slate-700">
              <div className="px-4 py-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <span className="font-medium">Topic</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="px-4 py-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md transition-shadow">
                <span className="font-medium">Currentness</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Video Replay Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REPLAY_LIBRARY.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Thumbnail with overlay badges */}
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30" />

                  {/* Top Left Badge */}
                  <span
                    className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded text-white shadow-sm ${
                      item.currentness === "CURRENT"
                        ? "bg-emerald-600"
                        : item.currentness === "REVIEW DUE"
                        ? "bg-amber-600"
                        : "bg-slate-600"
                    }`}
                  >
                    {item.currentness}
                  </span>

                  {/* Duration Bottom Right */}
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded backdrop-blur">
                    {item.duration}
                  </span>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/60 border border-white/40 flex items-center justify-center text-white hover:scale-110 hover:bg-blue-600 transition-all cursor-pointer shadow-lg">
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 mb-2.5">
                      <span>{item.recordedDate}</span>
                      <span className="text-slate-700 font-medium">{item.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BROWSE BY AUDIENCE */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-blue-600 inline-block" />
              BROWSE BY AUDIENCE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Find sessions built for your role
            </h2>
          </div>

          {/* 6 Role Cards with Dark Navy Icon Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-white border-slate-300 ring-2 ring-blue-600/30 shadow-md"
                      : "bg-[#DDE4ED] border-slate-200 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0D2137] text-white flex items-center justify-center mb-3 relative p-2 shadow-inner">
                    <Image src={role.iconSrc} alt={role.label} width={22} height={22} className="object-contain" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">{role.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{role.count}</div>
                </button>
              );
            })}
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTopic === topic
                    ? "bg-[#0D2137] text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:shadow-sm"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-600 font-semibold">Active filters:</span>
            <span className="px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-200 inline-flex items-center gap-1.5 text-[11px]">
              {ROLES.find((r) => r.id === selectedRole)?.label}
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => setSelectedRole("all")} />
            </span>
            <span className="px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-200 inline-flex items-center gap-1.5 text-[11px]">
              {selectedTopic}
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => setSelectedTopic("")} />
            </span>
            <span className="px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-200 inline-flex items-center gap-1.5 text-[11px]">
              Language: English
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" />
            </span>
            <button
              onClick={() => {
                setSelectedRole("all");
                setSelectedTopic("");
              }}
              className="ml-auto text-blue-600 hover:underline text-xs font-semibold"
            >
              Clear all
            </button>
          </div>
        </div>
      </section>

      {/* 5. FEATURED SERIES */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-blue-600 inline-block" />
              FEATURED SERIES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Learning paths and grouped sessions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Monetization Foundations */}
            <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-52 relative overflow-hidden">
                  <Image
                    src="/image/webinars/learning-monetization.png"
                    alt="Monetization Foundations"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0D2137]/90 text-white shadow backdrop-blur-sm">
                    LEARNING PATH · 3 SESSIONS
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">Monetization Foundations</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    An ordered sequence for teams evaluating real-time charging, rating and revenue assurance.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-blue-200 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-blue-600 rounded-full"/>
                    </div>
                    <span className="text-slate-600">2 of 3 available</span>
                  </div>
                  <span className="text-slate-500">CTO / Architect</span>
                </div>
              </div>
            </div>

            {/* Card 2 - Multi-Jurisdiction Compliance */}
            <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-52 relative overflow-hidden">
                  <Image
                    src="/image/webinars/learning-compliance.png"
                    alt="Multi-Jurisdiction Compliance"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0D2137]/90 text-white shadow backdrop-blur-sm">
                    LEARNING PATH · 4 SESSIONS
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">Multi-Jurisdiction Compliance</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tax orchestration, evidence ledger and regulatory export sessions in sequence.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-blue-200 rounded-full overflow-hidden">
                      <div className="w-1/4 h-full bg-blue-600 rounded-full"/>
                    </div>
                    <span className="text-slate-600">1 of 4 available</span>
                  </div>
                  <span className="text-slate-500">Governance</span>
                </div>
              </div>
            </div>

            {/* Card 3 - Developer Enablement Collection */}
            <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-52 relative overflow-hidden">
                  <Image
                    src="/image/webinars/learning-dev.png"
                    alt="Developer Enablement Collection"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0D2137]/90 text-white shadow backdrop-blur-sm">
                    COLLECTION · 5 SESSIONS
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">Developer Enablement Collection</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Related technical sessions grouped by topic — built for integration coders.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-emerald-200 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-emerald-500 rounded-full"/>
                    </div>
                    <span className="text-slate-600">5 of 5 available</span>
                  </div>
                  <span className="text-slate-500">Developer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WEBINAR DETAIL & FORM */}
      <section id="register-section" className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-blue-600 inline-block" />
              WEBINAR DETAIL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              What you see before you register
            </h2>
          </div>

          <div className="rounded-2xl bg-[#08182B] text-white p-6 sm:p-10 shadow-2xl mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#63B233] text-white">
                    LIVE WEBINAR
                  </span>
                  <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    Registration required
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  Real-Time Charging at Operator Scale: Architecture Deep Dive
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A technical walkthrough of ZoikoNex&apos;s event-driven rating and charging core, built for architects evaluating sub-200ms performance across prepaid, postpaid and roaming flows.
                </p>

                {/* 4 dark tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">DATE & TIME</div>
                    <div className="text-xs font-bold text-white mt-0.5">Sep 16, 2026 · 10:00 AM PT (17:00 UTC)</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">DURATION</div>
                    <div className="text-xs font-bold text-white mt-0.5">45 minutes + live Q&A</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">ACCESS</div>
                    <div className="text-xs font-bold text-white mt-0.5">Public — registration required</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60">
                    <div className="text-[9px] font-bold text-slate-400 uppercase">RECORDING</div>
                    <div className="text-xs font-bold text-white mt-0.5">Session recorded; Q&A not published</div>
                  </div>
                </div>

                {/* Checkmarks */}
                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#63B233] mt-0.5 flex-shrink-0" />
                    <span>Understand the event-driven charging model behind sub-200ms performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#63B233] mt-0.5 flex-shrink-0" />
                    <span>See deterministic tariff snapshots applied across prepaid, postpaid and roaming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#63B233] mt-0.5 flex-shrink-0" />
                    <span>Walk through failure handling and replay-safe usage processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#63B233] mt-0.5 flex-shrink-0" />
                    <span>Ask the architecture team questions directly in live Q&A</span>
                  </li>
                </ul>
              </div>

              {/* Right Form Card */}
              <div className="lg:col-span-5 w-full">
                <form
                  onSubmit={handleRegister}
                  className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl space-y-3.5"
                >
                  <h4 className="text-base font-bold text-slate-900">Register to attend</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Before you register: this session is recorded. Attendee names are not shown on the replay. Captions are provided in English.
                  </p>

                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Work email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full name</label>
                      <input
                        type="text"
                        required
                        placeholder="Jordan Reyes"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company (optional)</label>
                      <input
                        type="text"
                        placeholder="Company name"
                        value={regForm.company}
                        onChange={(e) => setRegForm({ ...regForm, company: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Question for speakers (optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Ask ahead of time..."
                        value={regForm.question}
                        onChange={(e) => setRegForm({ ...regForm, question: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5 pt-1 text-[10px] text-slate-600">
                      <label className="flex items-start gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regForm.serviceEmails}
                          onChange={(e) => setRegForm({ ...regForm, serviceEmails: e.target.checked })}
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <span>I agree to receive event-service emails about this session.</span>
                      </label>
                      <label className="flex items-start gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regForm.marketingEmails}
                          onChange={(e) => setRegForm({ ...regForm, marketingEmails: e.target.checked })}
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <span>Also send me occasional technical briefs (optional)</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    Confirm registration
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Registration Confirmed Banner (Figma exact match) */}
          <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                <strong>You&apos;re registered — confirmation sent.</strong> Sep 16, 2026 · 10:00 AM PT (17:00 UTC). We&apos;ll email a reminder 24 hours and 1 hour before the session.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold text-[11px] hover:bg-slate-50">
                Add to calendar
              </button>
              <button className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 font-semibold text-[11px] hover:bg-slate-50">
                Cancel registration
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE JOIN & RECOVERY */}
      <section className="py-14 sm:py-16 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">— LIVE JOIN & RECOVERY</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Status is always explicit — never assumed from a clock
            </h2>
          </div>

          {/* Step circles line */}
          <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto text-center pt-2">
            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mx-auto">1</div>
              <div className="text-[10px] text-slate-500">Too early</div>
            </div>
            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-sm">2</div>
              <div className="text-[10px] font-bold text-blue-600">Join open</div>
            </div>
            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mx-auto">3</div>
              <div className="text-[10px] text-slate-500">Live</div>
            </div>
            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs mx-auto">!</div>
              <div className="text-[10px] text-rose-600">Provider issue</div>
            </div>
            <div className="space-y-1.5">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mx-auto">5</div>
              <div className="text-[10px] text-slate-500">Ended</div>
            </div>
          </div>

          {/* Notice banner */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 max-w-2xl mx-auto shadow-xs">
            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Rescheduled: Sep 18 → Sep 30, 11:00 AM PT.</strong> Your calendar invite has been updated automatically.
            </span>
          </div>
        </div>
      </section>

      {/* 8. REPLAY PLAYER WITH TRANSCRIPTS (Figma exact match) */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-blue-600 inline-block" />
              REPLAY PLAYER
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Transcript, chapters and currentness — together
            </h2>
          </div>

          <div className="rounded-2xl bg-[#08182B] text-white overflow-hidden shadow-2xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left video area */}
              <div className="lg:col-span-8 p-6 flex flex-col justify-between min-h-[380px] relative bg-slate-950">
                <Image
                  src="/image/webinars/hero-meeting.png"
                  alt="Evidence Ledger Walkthrough"
                  fill
                  className="object-cover opacity-20"
                />

                <div className="flex items-center justify-between z-10 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Current as of Aug 4, 2026</span>
                  </div>
                  <Link href="/documentation" className="text-sky-400 hover:underline font-semibold">
                    View current documentation →
                  </Link>
                </div>

                <div className="my-auto flex items-center justify-center z-10 py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 shadow-2xl cursor-pointer hover:scale-105 transition-all">
                    <Play className="w-6 h-6 ml-0.5 fill-current" />
                  </div>
                </div>

                <div className="space-y-2 z-10">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[38%]" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>14:32 / 38:12</span>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">1x</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">CC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Chapters/Transcript */}
              <div className="lg:col-span-4 bg-[#0B1E36] p-4 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
                <div className="flex border-b border-slate-800 pb-2 mb-3 text-xs">
                  <button
                    onClick={() => setActiveTab("chapters")}
                    className={`flex-1 py-1 text-center font-bold ${
                      activeTab === "chapters" ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-400"
                    }`}
                  >
                    Chapters
                  </button>
                  <button
                    onClick={() => setActiveTab("transcript")}
                    className={`flex-1 py-1 text-center font-bold ${
                      activeTab === "transcript" ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-400"
                    }`}
                  >
                    Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab("captions")}
                    className={`flex-1 py-1 text-center font-bold ${
                      activeTab === "captions" ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-400"
                    }`}
                  >
                    Captions
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-700/60 flex items-center justify-between">
                    <span>Why evidence, not logs</span>
                    <span className="font-mono text-slate-400 text-[10px]">00:00</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                    <span>Hash-chained ledger design</span>
                    <span className="font-mono text-slate-400 text-[10px]">08:40</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                    <span>Tamper-evidence in practice</span>
                    <span className="font-mono text-slate-400 text-[10px]">17:55</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                    <span>Regulatory export packages</span>
                    <span className="font-mono text-slate-400 text-[10px]">27:10</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                    <span>Live Q&A</span>
                    <span className="font-mono text-slate-400 text-[10px]">33:30</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-bold">00:14 — </span>Every financial and compliance event is written to an immutable hash-chained ledger...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOR BUILDERS */}
      <section className="py-16 sm:py-20 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-blue-600 inline-block" />
              FOR BUILDERS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Technical sessions, without duplicating the docs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                INTERMEDIATE
              </span>
              <h3 className="text-sm font-bold text-slate-900">Working with the Charging & Rating API</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assumes a sandbox tenant and familiarity with REST auth. Code shown links directly to current API reference.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                ADVANCED
              </span>
              <h3 className="text-sm font-bold text-slate-900">Webhook Retries & Dead-Letter Handling</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live coding session on idempotent webhook consumers using the Integration & Ecosystem domain.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                BEGINNER
              </span>
              <h3 className="text-sm font-bold text-slate-900">Your First Sandbox Tenant, Start to Finish</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Environment assumptions, auth setup and a first successful charging call in one session.
              </p>
            </div>
          </div>

          {/* 4 Bottom Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <Link href="/api-reference" className="p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
              <FileText className="w-4 h-4 text-blue-600" />
              API Reference
            </Link>
            <Link href="/guides" className="p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Developer Guides
            </Link>
            <Link href="/glossary" className="p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
              <Layers className="w-4 h-4 text-blue-600" />
              Glossary
            </Link>
            <Link href="/changelog" className="p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-xs">
              <Calendar className="w-4 h-4 text-blue-600" />
              Release Notes
            </Link>
          </div>
        </div>
      </section>

      {/* 10. CTA BANNER (Figma exact: `#08182B`) */}
      <section className="py-12 bg-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-[#08182B] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Ready to go deeper than a webinar?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                When a session answers your question, the next step is optional — no gate, no forced form.
              </p>
            </div>
            <Link
              href="/request-a-demo"
              className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549c29] text-white font-semibold text-xs sm:text-sm shadow-md whitespace-nowrap"
            >
              Request a demo
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-1 mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">— FAQ</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Common questions about Webinars.
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <Minus className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
