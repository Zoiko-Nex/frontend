import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, MapPin, Briefcase, Clock, Zap } from 'lucide-react';

export default function Careers() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-gray-900 overflow-hidden px-6 lg:px-28 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-600/20 via-sky-600/0 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col items-start gap-6">
            <div className="text-lime-300 text-xs font-bold font-mono uppercase tracking-wider">CAREERS AT ZOIKONEX</div>
            <h1 className="w-[685px] justify-center text-white text-6xl font-bold font-['Hanken_Grotesk'] leading-[75px]">
              Build the infrastructure<br/>behind modern telecom<br/>monetization.
            </h1>
            <div className="justify-center text-gray-500 text-lg font-normal font-['Inter'] leading-7">
              ZoikoNex is the sovereign platform for Tier-1 telecommunications. <br/>
              We engineer AI-powered OSS/BSS systems that manage high-frequency <br/>
              charging, billing, and global network operations with mathematical precision and infrastructure-grade reliability.
            </div>
            <div className="pt-4">
              <button className="px-8 py-4 rounded bg-transparent border border-gray-600 hover:bg-gray-800 transition-colors flex items-center gap-2 text-white text-sm font-semibold">
                View Open Roles <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full flex justify-center lg:justify-end opacity-90">
            <img src="/image/carrer/one.jpg" alt="Team working" className="w-full max-w-[500px] h-[542px] object-cover rounded-3xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="w-full bg-stone-50 px-6 lg:px-28 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <img src="/image/carrer/icon8.svg" alt="Build consequential infrastructure icon" className="h-6 w-auto object-contain self-start" />
            <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 mt-2">Build consequential<br/>infrastructure</h3>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Shape systems that process<br/>billions of global<br/>transactions, forming the<br/>backbone of modern<br/>connectivity.</p>
          </div>
          <div className="bg-white p-8 pb-14 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <img src="/image/carrer/icon9.svg" alt="Solve hard platform problems icon" className="h-6 w-auto object-contain self-start" />
            <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 mt-2">Solve hard platform<br/>problems</h3>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Tackle low-latency, high-<br/>availability challenges that<br/>require algorithmic precision<br/>and deep technical rigor.</p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <img src="/image/carrer/icon10.svg" alt="Operate with high standards icon" className="h-6 w-auto object-contain self-start" />
            <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 mt-2">Operate with high<br/>standards</h3>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Join a team that values<br/>documentation, security-first<br/>architecture, and peer-<br/>reviewed excellence over<br/>theatre.</p>
          </div>
          <div className="bg-white p-8 pb-14 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <img src="/image/carrer/icon11.svg" alt="Create commercial impact icon" className="h-6 w-auto object-contain self-start" />
            <h3 className="text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 mt-2">Create commercial<br/>impact</h3>
            <p className="text-zinc-700 text-base font-normal font-['Inter'] leading-6">Directly influence the<br/>revenue lifecycle of Tier-1<br/>telecom operators through<br/>sovereign automation.</p>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="w-full bg-gray-900 px-6 lg:px-28 py-24 flex justify-center">
        <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <span className="text-lime-300 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Culture of Precision</span>
              <h2 className="text-white text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">How We Work</h2>
            </div>
            <div className="flex flex-col gap-12 pt-4">
              <div className="flex gap-6">
                <span className="text-gray-500/30 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">01</span>
                <div className="flex flex-col gap-2">
                  <h4 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">High standards without theater</h4>
                  <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">We value actual technical outcomes over<br/>presentational flair. Truth lies in the logs.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-gray-500/30 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">02</span>
                <div className="flex flex-col gap-2">
                  <h4 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Speed with discipline</h4>
                  <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">We move fast, but we never bypass the safety<br/>checks. Infrastructure demands rigor.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <span className="text-gray-500/30 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">03</span>
                <div className="flex flex-col gap-2">
                  <h4 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Documentation is delivery</h4>
                  <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">A feature isn't shipped until its API contract and<br/>architecture are clearly documented.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white/5 p-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/10 flex gap-8">
              <span className="text-gray-500/30 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">04</span>
              <div className="flex flex-col gap-2">
                <h4 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">AI-assisted, human-accountable</h4>
                <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">We leverage state-of-the-art AI for velocity, but humans own the<br/>sovereign security and logic of the system.</p>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/10 flex gap-8">
              <span className="text-gray-500/30 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">05</span>
              <div className="flex flex-col gap-2">
                <h4 className="text-white text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Professional respect</h4>
                <p className="text-gray-500 text-base font-normal font-['Inter'] leading-6">We value deep expertise and foster an environment where technical<br/>logic and empirical data drive decisions.</p>
              </div>
            </div>
            <div className="h-48 relative bg-black/40 rounded-2xl border border-white/10"></div>
          </div>
        </div>
      </section>

      {/* The Pathway to Nexus */}
      <section className="w-full bg-stone-50 py-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-start gap-16">
          <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
            <div className="self-stretch flex flex-col justify-start items-center">
              <h2 className="text-center justify-center text-black text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">The Pathway to Nexus</h2>
            </div>
            <div className="w-full max-w-[672px] pb-[0.69px] flex flex-col justify-start items-center">
              <p className="text-center justify-center text-zinc-700 text-lg font-normal font-['Inter'] leading-7">Our hiring process is designed to be transparent, efficient, and technically<br/>rigorous.</p>
            </div>
          </div>
          <div className="self-stretch relative flex flex-col justify-start items-start">
            <div className="hidden lg:block w-full max-w-[1232px] mx-auto h-0.5 left-0 right-0 top-[40px] absolute bg-slate-200"></div>
            <div className="self-stretch flex flex-col lg:flex-row justify-center items-start gap-12 relative z-10 w-full max-w-[1232px] mx-auto">
              {/* Step 1 */}
              <div className="flex-1 flex flex-col justify-start items-center gap-2">
                <div className="w-20 h-20 bg-white rounded-xl outline outline-2 outline-offset-[-2px] outline-slate-200 flex justify-center items-center">
                  <img src="/image/carrer/icon12.svg" alt="Apply icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                  <div className="text-center text-zinc-700 text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">STEP 01</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center">
                  <h3 className="text-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Apply</h3>
                </div>
                <div className="self-stretch px-4 flex flex-col justify-start items-center">
                  <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">Submit your profile and<br/>relevant technical<br/>artifacts.</p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex-1 flex flex-col justify-start items-center gap-2">
                <div className="w-20 h-20 bg-white rounded-xl outline outline-2 outline-offset-[-2px] outline-slate-200 flex justify-center items-center">
                  <img src="/image/carrer/icon13.svg" alt="Initial Screen icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                  <div className="text-center text-zinc-700 text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">STEP 02</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center">
                  <h3 className="text-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Initial Screen</h3>
                </div>
                <div className="self-stretch px-4 flex flex-col justify-start items-center">
                  <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">A conversation about<br/>alignment and technical<br/>foundations.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex-1 flex flex-col justify-start items-center gap-2">
                <div className="w-20 h-20 bg-white rounded-xl outline outline-2 outline-offset-[-2px] outline-slate-200 flex justify-center items-center">
                  <img src="/image/carrer/icon14.svg" alt="Assessment icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                  <div className="text-center text-zinc-700 text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">STEP 03</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center">
                  <h3 className="text-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Assessment</h3>
                </div>
                <div className="self-stretch px-4 flex flex-col justify-start items-center">
                  <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">Hands-on evaluation<br/>focused on problem-<br/>solving rigor.</p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="flex-1 flex flex-col justify-start items-center gap-2 pb-5">
                <div className="w-20 h-20 bg-white rounded-xl outline outline-2 outline-offset-[-2px] outline-slate-200 flex justify-center items-center">
                  <img src="/image/carrer/icon15.svg" alt="Leadership icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                  <div className="text-center text-zinc-700 text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">STEP 04</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center">
                  <h3 className="text-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Leadership</h3>
                </div>
                <div className="self-stretch px-4 flex flex-col justify-start items-center">
                  <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">Deep-dive interviews with<br/>relevant domain leads.</p>
                </div>
              </div>
              {/* Step 5 */}
              <div className="flex-1 flex flex-col justify-start items-center gap-2 pb-5">
                <div className="w-20 h-20 bg-white rounded-xl outline outline-2 outline-offset-[-2px] outline-slate-200 flex justify-center items-center">
                  <img src="/image/carrer/icon16.svg" alt="Onboarding icon" className="w-6 h-6 object-contain" />
                </div>
                <div className="self-stretch pt-4 flex flex-col justify-start items-center">
                  <div className="text-center text-lime-800 text-xs font-semibold font-['JetBrains_Mono'] uppercase leading-3 tracking-wider">FINAL</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-center">
                  <h3 className="text-center text-black text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Onboarding</h3>
                </div>
                <div className="self-stretch px-4 flex flex-col justify-start items-center">
                  <p className="text-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">Welcome to the core team<br/>building the future of BSS.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="w-full bg-neutral-100 px-6 lg:px-28 py-20 pb-32">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header & Filters */}
          <div className="p-6 lg:p-8 bg-stone-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search roles by title or keyword..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-700 shadow-sm transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-4">
              <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">All Roles</button>
              <button className="px-4 py-2 bg-white text-zinc-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm font-medium rounded-xl">Engineering</button>
              <button className="px-4 py-2 bg-white text-zinc-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm font-medium rounded-xl">Architecture</button>
              <button className="px-4 py-2 bg-white text-zinc-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm font-medium rounded-xl">Product</button>
            </div>
          </div>

          {/* Role List */}
          <div className="flex flex-col">
            {/* Role 1 */}
            <div className="p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-black text-xl lg:text-2xl font-semibold group-hover:text-sky-700 transition-colors">Telecom Solution Architect</h3>
                  <span className="px-2 py-1 bg-lime-100 text-lime-700 text-[10px] font-mono font-bold uppercase rounded">FEATURED</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-zinc-600 text-sm">
                  <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> Telecom Architecture</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> London / Remote (UK)</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Hybrid</div>
                  <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-slate-400" /> Staff / Senior</div>
                </div>
              </div>
              <Link href="/apply?role=Telecom+Solution+Architect" className="px-6 py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-800 shrink-0 shadow-sm text-center">Apply Now</Link>
            </div>
            
            {/* Role 2 */}
            <div className="p-6 lg:p-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-black text-xl lg:text-2xl font-semibold group-hover:text-sky-700 transition-colors">Platform Engineer</h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-zinc-600 text-sm">
                  <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> Engineering & Platform</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> New York / Remote (US)</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> Remote</div>
                  <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-slate-400" /> L3 / Senior</div>
                </div>
              </div>
              <Link href="/apply?role=Platform+Engineer" className="px-6 py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-800 shrink-0 shadow-sm text-center">Apply Now</Link>
            </div>

            {/* Role 3 */}
            <div className="p-6 lg:p-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-black text-xl lg:text-2xl font-semibold group-hover:text-sky-700 transition-colors">Security Engineer</h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-zinc-600 text-sm">
                  <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> Security & Compliance</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> Berlin, Germany</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> On-site</div>
                  <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-slate-400" /> Senior</div>
                </div>
              </div>
              <Link href="/apply?role=Security+Engineer" className="px-6 py-3 bg-black text-white text-sm font-semibold rounded hover:bg-gray-800 shrink-0 shadow-sm text-center">Apply Now</Link>
            </div>
          </div>

          <div className="p-6 lg:p-8 bg-stone-50 border-t border-slate-200 flex flex-col items-center gap-2 text-center">
            <p className="text-zinc-600 text-base">Don't see your fit? We're always looking for high-caliber talent.</p>
            <a href="#" className="text-sky-600 text-base hover:underline font-medium hover:text-sky-700 transition-colors">Explore all 18 open positions →</a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full bg-neutral-100 px-6 lg:px-28 pb-32">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[32px] p-12 lg:p-24 flex flex-col items-center text-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/30 via-gray-900 to-gray-900"></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-white text-3xl lg:text-4xl font-semibold leading-tight">Ready to build telecom<br className="hidden lg:block"/>infrastructure that matters?</h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Join a disciplined, technically serious culture where engineering excellence is the primary metric of success.
            </p>
            <div className="pt-4">
              <button className="px-10 py-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white text-sm font-semibold shadow-sm backdrop-blur-sm">
                View Open Roles
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
