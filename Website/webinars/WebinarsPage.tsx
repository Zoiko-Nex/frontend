"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Search,
  Check,
  ChevronDown,
  X,
  FileText,
  Layers,
  BookOpen,
  Video,
  Plus,
  RotateCcw,
  RotateCw,
  Briefcase,
  Code2,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Cpu,
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
  speakerImage: string;
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
    speakerImage: "/image/webinars/speaker-malderin.png",
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
    speakerImage: "/image/webinars/speaker-rokafor.png",
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
    speakerImage: "/image/webinars/speaker-sdevraj.png",
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
    imageSrc: "/image/webinars/learning-monetization.png",
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
    imageSrc: "/image/webinars/icon-executive.png",
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
    imageSrc: "/image/webinars/icon-architect.png",
    speaker: "E. Chen, Telco API Lead",
  },
];

const ROLES = [
  {
    id: "executive",
    label: "Executive",
    count: "6 sessions",
    icon: Briefcase,
  },
  {
    id: "cto-architect",
    label: "CTO / Architect",
    count: "11 sessions",
    icon: Cpu,
  },
  {
    id: "developer",
    label: "Developer",
    count: "9 sessions",
    icon: Code2,
  },
  {
    id: "commercial",
    label: "Commercial",
    count: "4 sessions",
    icon: TrendingUp,
  },
  {
    id: "finance",
    label: "Finance",
    count: "3 sessions",
    icon: DollarSign,
  },
  {
    id: "security",
    label: "Security",
    count: "5 sessions",
    icon: ShieldCheck,
  },
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

const CHAPTERS = [
  {
    id: 1,
    title: "Why evidence, not logs",
    time: "00:00",
    snippet:
      "Every financial and compliance event is written to a hash-chained ledger, so it can be verified independently of the system that produced it...",
  },
  {
    id: 2,
    title: "Hash-chained ledger design",
    time: "08:40",
    snippet:
      "Merkle tree checkpoints anchor state across distributed nodes with zero-knowledge proof exports.",
  },
  {
    id: 3,
    title: "Tamper-evidence in practice",
    time: "17:55",
    snippet:
      "Auditor verification protocols that detect unauthorized modification attempts in sub-second verification times.",
  },
  {
    id: 4,
    title: "Regulatory export packages",
    time: "27:10",
    snippet:
      "Pre-formatted, jurisdiction-certified bundles exported directly for fiscal authorities and telecom regulators.",
  },
  {
    id: 5,
    title: "Live Q&A",
    time: "33:30",
    snippet:
      "Lead architects address multi-tenant segregation, high-throughput rating benchmarks and cloud portability.",
  },
];

const FAQS = [
  {
    q: "How are session times shown?",
    a: "Every live session shows your localized date and time plus its named timezone. The canonical time and UTC offset are always available on the session detail page.",
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
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const filteredReplays = REPLAY_LIBRARY.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.speaker.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full bg-[#EEF2F7] text-slate-900 min-h-screen">
      {/* 1. HERO SECTION (Dark Navy `#08182B` with Overlay+Shadow.png) */}
      <section className="relative overflow-hidden bg-[#08182B] text-white pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase">
                <span className="w-4 h-[2px] bg-sky-400 inline-block" />
                WEBINARS
              </div>

              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight leading-tight lg:leading-[51.52px]">
                Live and recorded<br />
                sessions for governed<br />
                telecom operations.
              </h1>

              <p className="text-sm sm:text-[15px] text-slate-300 max-w-xl leading-relaxed">
                Explore approved ZoikoNex sessions for telecom monetization, architecture,
                integration, governance, operations and platform evaluation. See what&apos;s
                upcoming, watch available replays, and follow each session into current documentation
                or resources.
              </p>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549C29] text-white font-semibold transition-all duration-150 text-sm inline-flex items-center justify-center shadow-md cursor-pointer"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Right Visual Image (Overlay+Shadow.png) */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px]">
                <Image
                  src="/image/webinars/Overlay+Shadow.png"
                  alt="Live and recorded webinar conference session"
                  width={540}
                  height={440}
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING SESSIONS */}
      <section id="upcoming-sessions" className="py-14 sm:py-18 bg-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
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
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs">
                      <span className="text-base font-bold text-slate-900 leading-none">
                        {session.day}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight mt-0.5">
                        {session.month}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${session.badgeBg}`}
                    >
                      {session.statusText}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold text-slate-900 mb-2 leading-snug">
                    {session.title}
                  </h3>

                  <p className="text-xs text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                    {session.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-1.5 border-t border-slate-100 pt-3 mb-4 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {session.time} · {session.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-slate-400" />
                        {session.type} · {session.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 overflow-hidden relative">
                        <Image
                          src={session.speakerImage}
                          alt={session.speaker}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-800">
                        {session.speaker}
                      </span>
                    </div>

                    {session.status === "open" && (
                      <a
                        href="#register-section"
                        className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        Register
                      </a>
                    )}
                    {session.status === "waitlist" && (
                      <a
                        href="#register-section"
                        className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
                      >
                        Join waitlist
                      </a>
                    )}
                    {session.status === "rescheduled" && (
                      <a
                        href="#register-section"
                        className="px-3.5 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors shadow-xs"
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

      {/* 3. ON-DEMAND REPLAY LIBRARY (learning-monetization.png, icon-executive.png, icon-architect.png) */}
      <section id="on-demand" className="py-14 sm:py-18 bg-[#EEF2F7] border-t border-slate-200">
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

            <div className="flex items-center gap-2.5 w-full sm:w-auto text-xs text-slate-700">
              <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm transition-shadow">
                <span className="font-medium">Topic</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm transition-shadow">
                <span className="font-medium">Currentness</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm transition-shadow">
                <span className="font-medium">Sort: Newest</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Video Replay Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredReplays.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Thumbnail with overlay badges */}
                <div className="h-48 relative overflow-hidden bg-slate-900 group">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/20" />

                  {/* Top Left Badge */}
                  <span
                    className={`absolute top-3 left-3 text-[9px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm ${
                      item.currentness === "CURRENT"
                        ? "bg-[#16A34A]"
                        : item.currentness === "REVIEW DUE"
                        ? "bg-[#CA8A04]"
                        : "bg-[#475569]"
                    }`}
                  >
                    {item.currentness}
                  </span>

                  {/* Duration Bottom Right */}
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded">
                    {item.duration}
                  </span>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href="#replay-player"
                      className="w-10 h-10 rounded-full bg-black/60 border border-white/40 flex items-center justify-center text-white hover:scale-110 hover:bg-blue-600 transition-all cursor-pointer shadow-lg"
                    >
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 mb-1 leading-snug">
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
      <section className="py-14 sm:py-18 bg-[#EEF2F7] border-t border-slate-200">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.id;
              const IconComp = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-md"
                      : "bg-[#DDE4ED] border-slate-200/80 hover:bg-white hover:shadow-xs"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0D2137] text-white flex items-center justify-center mb-3 shadow-inner">
                    <IconComp className="w-5 h-5 text-sky-400" />
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
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedTopic === topic
                    ? "bg-[#0D2137] text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:shadow-xs"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-50/90 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-600 font-semibold">Active filters:</span>
            <span className="px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-200 inline-flex items-center gap-1.5 text-[11px] shadow-2xs">
              {ROLES.find((r) => r.id === selectedRole)?.label || "All Roles"}
              <X
                className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700"
                onClick={() => setSelectedRole("all")}
              />
            </span>
            {selectedTopic && (
              <span className="px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-200 inline-flex items-center gap-1.5 text-[11px] shadow-2xs">
                {selectedTopic}
                <X
                  className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700"
                  onClick={() => setSelectedTopic("")}
                />
              </span>
            )}
            <span className="px-2.5 py-1 rounded bg-white text-slate-800 border border-slate-200 inline-flex items-center gap-1.5 text-[11px] shadow-2xs">
              Language: English
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" />
            </span>
            <button
              onClick={() => {
                setSelectedRole("all");
                setSelectedTopic("");
              }}
              className="ml-auto text-blue-600 hover:underline text-xs font-semibold cursor-pointer"
            >
              Clear all
            </button>
          </div>
        </div>
      </section>

      {/* 5. FEATURED SERIES (icon-developer.png, icon-commercial.png, icon-finance.png) */}
      <section className="py-14 sm:py-18 bg-[#EEF2F7] border-t border-slate-200">
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
            {/* Card 1 - Monetization Foundations (icon-developer.png) */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-52 relative overflow-hidden bg-slate-900">
                  <Image
                    src="/image/webinars/icon-developer.png"
                    alt="Monetization Foundations"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full bg-[#0D2137]/90 text-white shadow backdrop-blur-sm">
                    LEARNING PATH · 3 SESSIONS
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">
                    Monetization Foundations
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    An ordered sequence for teams evaluating real-time charging, rating and revenue
                    assurance.
                  </p>
                </div>
              </div>

              {/* Segmented Progress bar: 3 segments, 2 active */}
              <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-1 bg-blue-600 rounded-full" />
                    <div className="h-1 bg-blue-600 rounded-full" />
                    <div className="h-1 bg-slate-200 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 text-[11px]">2 of 3 available</span>
                    <span className="text-slate-500 text-[11px]">CTO / Architect</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Multi-Jurisdiction Compliance (icon-commercial.png) */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-52 relative overflow-hidden bg-slate-900">
                  <Image
                    src="/image/webinars/icon-commercial.png"
                    alt="Multi-Jurisdiction Compliance"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full bg-[#0D2137]/90 text-white shadow backdrop-blur-sm">
                    LEARNING PATH · 4 SESSIONS
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">
                    Multi-Jurisdiction Compliance
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tax orchestration, evidence ledger and regulatory export sessions in sequence.
                  </p>
                </div>
              </div>

              {/* Segmented Progress bar: 4 segments, 1 active */}
              <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="h-1 bg-blue-600 rounded-full" />
                    <div className="h-1 bg-slate-200 rounded-full" />
                    <div className="h-1 bg-slate-200 rounded-full" />
                    <div className="h-1 bg-slate-200 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 text-[11px]">1 of 4 available</span>
                    <span className="text-slate-500 text-[11px]">Governance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Developer Enablement Collection (icon-finance.png) */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-52 relative overflow-hidden bg-slate-900">
                  <Image
                    src="/image/webinars/icon-finance.png"
                    alt="Developer Enablement Collection"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full bg-[#0D2137]/90 text-white shadow backdrop-blur-sm">
                    COLLECTION · 5 SESSIONS
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1.5">
                    Developer Enablement Collection
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Related technical sessions grouped by topic — no fixed order or completion
                    requirement.
                  </p>
                </div>
              </div>

              {/* Segmented Progress bar: 3 segments, all filled */}
              <div className="px-5 pb-5">
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-1 bg-blue-600 rounded-full" />
                    <div className="h-1 bg-blue-600 rounded-full" />
                    <div className="h-1 bg-blue-600 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 text-[11px]">5 of 5 available</span>
                    <span className="text-slate-500 text-[11px]">Developer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WEBINAR DETAIL & FORM */}
      <section id="register-section" className="py-14 sm:py-18 bg-[#EEF2F7] border-t border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-blue-600 inline-block" />
              WEBINAR DETAIL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              What you see before you register
            </h2>
          </div>

          <div className="rounded-2xl bg-[#08182B] text-white p-6 sm:p-10 shadow-2xl mb-8 border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-[#63B233] text-white shadow-xs">
                    LIVE WEBINAR
                  </span>
                  <span className="text-[10px] text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                    Registration required
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  Real-Time Charging at Operator Scale: Architecture Deep Dive
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A technical walkthrough of ZoikoNex&apos;s event-driven rating and charging core,
                  built for architects evaluating sub-200ms performance across prepaid, postpaid and
                  roaming flows.
                </p>

                {/* 4 dark tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60 shadow-inner">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      DATE & TIME
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      Sep 16, 2026 · 10:00 AM PT (17:00 UTC)
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60 shadow-inner">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      DURATION
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      45 minutes + live Q&A
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60 shadow-inner">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      ACCESS
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      Public — registration required
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#0F243A] border border-slate-700/60 shadow-inner">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      RECORDING
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      Session recorded; Q&A not published
                    </div>
                  </div>
                </div>

                {/* Checkmarks */}
                <ul className="space-y-2 text-xs text-slate-300 pt-2">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#63B233] mt-0.5 shrink-0" />
                    <span>Understand the event-driven charging model behind sub-200ms performance</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#63B233] mt-0.5 shrink-0" />
                    <span>See deterministic tariff snapshots applied across prepaid, postpaid and roaming</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#63B233] mt-0.5 shrink-0" />
                    <span>Walk through failure handling and replay-safe usage processing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#63B233] mt-0.5 shrink-0" />
                    <span>Ask the architecture team questions directly in live Q&A</span>
                  </li>
                </ul>
              </div>

              {/* Right Form Card */}
              <div className="lg:col-span-5 w-full">
                <form
                  onSubmit={handleRegister}
                  className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl space-y-3.5 border border-slate-100"
                >
                  <h4 className="text-base font-bold text-slate-900">Register to attend</h4>

                  <div className="p-2.5 rounded-lg bg-[#F0F7FF] border border-[#BAE6FD] text-[11px] text-[#0C4A6E] leading-relaxed">
                    Before you register: this session is recorded. Attendee names are not shown on
                    the replay. Captions are provided in English.
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Work email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Full name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jordan Reyes"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Company (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Company name"
                        value={regForm.company}
                        onChange={(e) => setRegForm({ ...regForm, company: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Question for speakers (optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ask ahead of time..."
                        value={regForm.question}
                        onChange={(e) => setRegForm({ ...regForm, question: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 resize-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5 pt-1 text-[10px] text-slate-600">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regForm.serviceEmails}
                          onChange={(e) =>
                            setRegForm({ ...regForm, serviceEmails: e.target.checked })
                          }
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <span>I agree to receive event-service emails about this session.</span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regForm.marketingEmails}
                          onChange={(e) =>
                            setRegForm({ ...regForm, marketingEmails: e.target.checked })
                          }
                          className="mt-0.5 rounded text-blue-600"
                        />
                        <span>Also send me occasional technical briefs (optional)</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    Confirm registration
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Exact Registration Confirmed Banner */}
          <div className="w-full p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-400/80 text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-0.5">
              <div className="text-[13px] font-bold text-slate-900">
                You&apos;re registered — confirmation sent.
              </div>
              <div className="text-xs text-slate-500">
                Sep 16, 2026 · 10:00 AM PT (17:00 UTC). We&apos;ll email a reminder 24 hours and 1 hour before the session.
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button className="px-4 py-1.5 bg-white border border-slate-300/80 rounded-lg text-slate-800 font-semibold text-xs hover:bg-slate-50 shadow-2xs cursor-pointer">
                Add to calendar
              </button>
              <button className="px-4 py-1.5 bg-white border border-slate-300/80 rounded-lg text-slate-800 font-semibold text-xs hover:bg-slate-50 shadow-2xs cursor-pointer">
                Cancel registration
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE JOIN & RECOVERY (Exact Match to Figma & Screenshot) */}
      <section className="w-full py-16 sm:py-20 bg-gray-50 flex flex-col justify-start items-center border-t border-slate-200">
        <div className="w-full max-w-[1180px] px-4 sm:px-8 flex flex-col justify-start items-start gap-7">
          {/* Header */}
          <div className="w-full flex flex-col justify-start items-start gap-3.5">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-500" />
              <div className="text-blue-500 text-xs font-bold uppercase tracking-widest">
                Live Join &amp; Recovery
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start">
              <h2 className="text-slate-900 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Status is always explicit — never assumed from a clock
              </h2>
            </div>
          </div>

          {/* Full-width Stepper */}
          <div className="self-stretch pt-2.5 flex justify-between items-center w-full">
            {/* Step 1 */}
            <div className="flex-1 relative flex flex-col justify-start items-center gap-2.5">
              <div className="w-full h-0.5 left-1/2 top-[17px] absolute bg-zinc-300 -z-0" />
              <div className="w-8 h-8 bg-neutral-100 rounded-full border-2 border-stone-300 flex justify-center items-center relative z-10">
                <span className="text-center text-gray-500 text-sm font-extrabold">1</span>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <span className="text-center text-slate-500 text-xs font-bold leading-5">
                  Too early
                </span>
              </div>
            </div>

            {/* Step 2 (Active) */}
            <div className="flex-1 relative flex flex-col justify-start items-center gap-2.5">
              <div className="w-full h-0.5 left-1/2 top-[17px] absolute bg-zinc-300 -z-0" />
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-blue-500 flex justify-center items-center relative z-10 shadow-sm">
                <span className="text-center text-white text-sm font-extrabold">2</span>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <span className="text-center text-slate-900 text-xs font-bold leading-5">
                  Join open
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex-1 relative flex flex-col justify-start items-center gap-2.5">
              <div className="w-full h-0.5 left-1/2 top-[17px] absolute bg-zinc-300 -z-0" />
              <div className="w-8 h-8 bg-neutral-100 rounded-full border-2 border-stone-300 flex justify-center items-center relative z-10">
                <span className="text-center text-gray-500 text-sm font-extrabold">3</span>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <span className="text-center text-slate-500 text-xs font-bold leading-5">
                  Live
                </span>
              </div>
            </div>

            {/* Step 4 (Warning) */}
            <div className="flex-1 relative flex flex-col justify-start items-center gap-2.5">
              <div className="w-full h-0.5 left-1/2 top-[17px] absolute bg-zinc-300 -z-0" />
              <div className="w-8 h-8 bg-rose-100 rounded-full border-2 border-red-500 flex justify-center items-center relative z-10">
                <span className="text-center text-red-500 text-sm font-extrabold">!</span>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <span className="text-center text-slate-500 text-xs font-bold leading-5">
                  Provider issue
                </span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex-1 flex flex-col justify-start items-center gap-2.5">
              <div className="w-8 h-8 bg-neutral-100 rounded-full border-2 border-stone-300 flex justify-center items-center relative z-10">
                <span className="text-center text-gray-500 text-sm font-extrabold">5</span>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <span className="text-center text-slate-500 text-xs font-bold leading-5">
                  Ended
                </span>
              </div>
            </div>
          </div>

          {/* Full-width Rescheduled Notice Box */}
          <div className="self-stretch p-5 bg-yellow-50 rounded-xl border border-orange-200 flex justify-start items-start gap-4 shadow-2xs">
            <div className="w-9 h-9 bg-white rounded-lg border border-amber-200 flex justify-center items-center shrink-0">
              <span className="text-center text-yellow-600 text-base font-normal">⏱</span>
            </div>
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="text-slate-900 text-sm font-extrabold leading-4">
                  Rescheduled: Sep 18 → Sep 30, 11:00 AM PT
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="text-yellow-900/90 text-xs font-normal leading-5">
                  Your calendar invite and registration have been updated automatically. No action needed — join link stays the same.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REPLAY PLAYER WITH TRANSCRIPTS (Exact Match to Screenshot 2) */}
      <section id="replay-player" className="py-14 sm:py-18 bg-white border-t border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-8">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase">
              <span className="w-3 h-[2px] bg-sky-400 inline-block" />
              REPLAY PLAYER
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Transcript, chapters and currentness — together
            </h2>
          </div>

          <div className="rounded-2xl bg-[#08182B] text-white overflow-hidden shadow-2xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left video area (icon-security.png) */}
              <div className="lg:col-span-8 p-0 flex flex-col justify-between min-h-[380px] lg:min-h-[440px] relative bg-slate-950">
                <Image
                  src="/image/webinars/icon-security.png"
                  alt="Evidence Ledger Walkthrough Code Environment"
                  fill
                  className="object-cover"
                />

                {/* Top overlay bar */}
                <div className="flex items-center justify-between z-10 text-xs bg-slate-950/60 px-5 py-3 backdrop-blur-xs border-b border-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-200 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Current as of Aug 4, 2026</span>
                  </div>
                  <Link
                    href="/evidence"
                    className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 text-xs"
                  >
                    View current documentation →
                  </Link>
                </div>

                {/* Center empty space / video area */}
                <div className="my-auto" />

                {/* Bottom Video Controls Bar */}
                <div className="z-10 bg-slate-950/80 px-4 py-2.5 backdrop-blur-xs border-t border-slate-800/80 space-y-2">
                  {/* Progress scrubber */}
                  <div className="w-full bg-slate-700/80 h-[3px] rounded-full overflow-hidden cursor-pointer">
                    <div className="bg-blue-500 h-full w-[38%]" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="text-white hover:text-sky-400 cursor-pointer transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>
                      <button className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700 font-medium">
                        1x
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700 font-medium">
                        CC
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">14:32 / 38:12</span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Chapters/Transcript */}
              <div className="lg:col-span-4 bg-[#0B1E36] p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
                <div>
                  <div className="flex border-b border-slate-800/80 pb-2 mb-4 text-xs">
                    <button
                      onClick={() => setActiveTab("chapters")}
                      className={`flex-1 py-1.5 text-center font-bold cursor-pointer transition-colors ${
                        activeTab === "chapters"
                          ? "text-sky-400 border-b-2 border-sky-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Chapters
                    </button>
                    <button
                      onClick={() => setActiveTab("transcript")}
                      className={`flex-1 py-1.5 text-center font-bold cursor-pointer transition-colors ${
                        activeTab === "transcript"
                          ? "text-sky-400 border-b-2 border-sky-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Transcript
                    </button>
                    <button
                      onClick={() => setActiveTab("captions")}
                      className={`flex-1 py-1.5 text-center font-bold cursor-pointer transition-colors ${
                        activeTab === "captions"
                          ? "text-sky-400 border-b-2 border-sky-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Captions
                    </button>
                  </div>

                  {/* Chapters List */}
                  {activeTab === "chapters" && (
                    <div className="space-y-3 text-xs text-slate-300 overflow-y-auto max-h-[290px] pr-1">
                      {CHAPTERS.map((ch, idx) => {
                        const isActive = activeChapterIndex === idx;
                        return (
                          <div
                            key={ch.id}
                            onClick={() => setActiveChapterIndex(idx)}
                            className="flex items-center justify-between cursor-pointer group py-1"
                          >
                            <span
                              className={`text-[12px] transition-colors ${
                                isActive
                                  ? "text-sky-400 font-semibold"
                                  : "text-slate-400 group-hover:text-slate-200"
                              }`}
                            >
                              {ch.title}
                            </span>
                            <span className="font-mono text-slate-500 text-[11px] shrink-0 ml-2">
                              {ch.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Transcript List */}
                  {activeTab === "transcript" && (
                    <div className="space-y-3 text-xs text-slate-300 overflow-y-auto max-h-[290px] pr-1 leading-relaxed">
                      {CHAPTERS.map((ch) => (
                        <div key={ch.id} className="py-1">
                          <div className="text-[10px] text-sky-400 font-mono mb-0.5">{ch.time}</div>
                          <p className="text-[11px] text-slate-300">{ch.snippet}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Captions List */}
                  {activeTab === "captions" && (
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-3 rounded bg-slate-900/40 border border-slate-800/80 space-y-2">
                        <div className="text-[11px] font-semibold text-white">
                          Available Subtitles
                        </div>
                        <div className="space-y-1.5 text-[11px] text-slate-300">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="cc"
                              defaultChecked
                              className="text-sky-500"
                            />
                            <span>English (Generated & Verified)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="cc" className="text-sky-500" />
                            <span>Spanish (Español)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom live subtitle snippet */}
                <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-800/80 mt-4 leading-relaxed">
                  <strong className="text-white font-bold">
                    {CHAPTERS[activeChapterIndex]?.time}
                  </strong>{" "}
                  — {CHAPTERS[activeChapterIndex]?.snippet}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOR BUILDERS */}
      <section className="py-14 sm:py-18 bg-[#EEF2F7] border-t border-slate-200">
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
            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                INTERMEDIATE
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Working with the Charging & Rating API
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assumes a sandbox tenant and familiarity with REST auth. Code shown links directly
                to current API reference.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                ADVANCED
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Webhook Retries & Dead-Letter Handling
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live coding session on idempotent webhook consumers using the Integration &
                Ecosystem domain.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                BEGINNER
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Your First Sandbox Tenant, Start to Finish
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Environment assumptions, auth setup and a first successful charging call in one
                session.
              </p>
            </div>
          </div>

          {/* 4 Bottom Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <Link
              href="/developer-portal"
              className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-2xs hover:shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              API Reference
            </Link>
            <Link
              href="/guides"
              className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-2xs hover:shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              Developer Guides
            </Link>
            <Link
              href="/glossary"
              className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-2xs hover:shadow-sm transition-all"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              Glossary
            </Link>
            <Link
              href="/changelog"
              className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2.5 font-semibold text-slate-800 shadow-2xs hover:shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              Release Notes
            </Link>
          </div>
        </div>
      </section>

      {/* 10. CTA BANNER */}
      <section className="py-12 bg-[#EEF2F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-[#08182B] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Ready to go deeper than a webinar?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                When a session answers your question, the next step is optional — no gate, no
                forced form.
              </p>
            </div>
            <Link
              href="/request-a-demo"
              className="px-6 py-3 rounded-md bg-[#63B233] hover:bg-[#549C29] text-white font-semibold text-xs sm:text-sm shadow-md whitespace-nowrap transition-all"
            >
              Request a demo
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION (Exact Match to Screenshot 3) */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-1 mb-10">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs tracking-wider uppercase">
              <span className="w-4 h-[2px] bg-sky-400 inline-block" />
              FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Common questions about Webinars.
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <X className="w-4 h-4 text-sky-500 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-sky-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
