import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PartnerApplyPage() {
  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-6 lg:px-52 pt-12 pb-32 flex flex-col justify-start items-start">
        <div className="self-stretch flex flex-col justify-start items-start gap-12">
          
          {/* Section 1: Company Identity */}
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <h2 className="self-stretch text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">1. Company Identity</h2>
              <p className="self-stretch text-zinc-700 text-base font-normal font-['Inter'] leading-6">Establish your firm's legal standing and operational scale.</p>
            </div>
            
            <div className="self-stretch grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Legal Entity Name</label>
                <input type="text" placeholder="e.g., Global Telecom Systems Ltd." className="w-full px-4 py-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-zinc-700 placeholder-zinc-400" />
              </div>
              
              <div className="flex flex-col gap-2 relative">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Partner Category</label>
                <div className="relative">
                  <select className="w-full px-4 py-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-black appearance-none">
                    <option>Technology Partner</option>
                    <option>System Integrator</option>
                    <option>Cloud Provider</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <Image src="/image/partner/chevron-down.svg" alt="Dropdown" width={24} height={24} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">HQ Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Image src="/image/partner/location-pin.svg" alt="Location" width={16} height={20} />
                  </div>
                  <input type="text" placeholder="City, Country" className="w-full pl-12 pr-4 py-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-zinc-700 placeholder-zinc-400" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Year Founded</label>
                <input type="text" placeholder="YYYY" className="w-full px-4 py-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-zinc-700 placeholder-zinc-400" />
              </div>
            </div>

            <div className="self-stretch flex flex-col gap-2">
              <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Global Employee Count</label>
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex-1 min-w-[120px] py-3 bg-white rounded-sm border border-slate-200 text-zinc-900 text-sm font-semibold font-['Inter'] leading-5 hover:bg-slate-50 transition">1-50</button>
                <button className="flex-1 min-w-[120px] py-3 bg-white rounded-sm border border-slate-200 text-zinc-900 text-sm font-semibold font-['Inter'] leading-5 hover:bg-slate-50 transition">51-200</button>
                <button className="flex-1 min-w-[120px] py-3 bg-cyan-700 rounded-sm border border-lime-800 text-white text-sm font-semibold font-['Inter'] leading-5 transition">201-1000</button>
                <button className="flex-1 min-w-[120px] py-3 bg-white rounded-sm border border-slate-200 text-zinc-900 text-sm font-semibold font-['Inter'] leading-5 hover:bg-slate-50 transition">1000+</button>
              </div>
            </div>
          </div>

          {/* Section 2: Technical & Compliance */}
          <div className="self-stretch pt-12 border-t border-slate-200 flex flex-col justify-start items-start gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <h2 className="self-stretch text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">2. Technical & Compliance</h2>
              <p className="self-stretch text-zinc-700 text-base font-normal font-['Inter'] leading-6">Detail your organization's technical capabilities and security vetting.</p>
            </div>
            
            <div className="self-stretch flex flex-col gap-8 w-full">
              <div className="flex flex-col gap-4">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Security Certifications Held</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between p-4 bg-white rounded-sm border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                    <span className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">SOC 2 Type II</span>
                    <input type="checkbox" className="w-5 h-5 border-gray-500 rounded-sm text-cyan-700 focus:ring-cyan-700" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-white rounded-sm border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                    <span className="text-zinc-900 text-base font-semibold font-['Inter'] leading-6">ISO 27001</span>
                    <input type="checkbox" className="w-5 h-5 border-gray-500 rounded-sm text-cyan-700 focus:ring-cyan-700" />
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Primary Tech Stack Overview</label>
                <textarea rows={4} placeholder="Summarize your core infrastructure and integration capabilities..." className="w-full px-4 pt-4 pb-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-zinc-700 placeholder-zinc-400 resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Section 3: Point of Contact */}
          <div className="self-stretch pt-12 border-t border-slate-200 flex flex-col justify-start items-start gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <h2 className="self-stretch text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">3. Point of Contact</h2>
              <p className="self-stretch text-zinc-700 text-base font-normal font-['Inter'] leading-6">Designate an authorized representative for this application.</p>
            </div>
            
            <div className="self-stretch grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-zinc-700 placeholder-zinc-400" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Job Title</label>
                <input type="text" placeholder="Director of Partnerships" className="w-full px-4 py-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-zinc-700 placeholder-zinc-400" />
              </div>
              
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-black text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Business Email Address</label>
                <input type="email" placeholder="john.doe@company.com" className="w-full px-4 py-4 bg-white rounded-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2370A0] text-zinc-700 placeholder-zinc-400" />
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Footer Form Bar */}
      <div className="w-full bg-white border-t border-slate-200 py-6 px-6 lg:px-52 flex justify-between items-center z-10 sticky bottom-0">
        <Link href="/partner" className="px-10 py-3 bg-white border border-slate-300 text-zinc-900 font-semibold rounded-sm hover:bg-slate-50 transition">
          Save Draft
        </Link>
        <button className="px-10 py-3 bg-[#2370A0] text-white font-semibold rounded-sm hover:bg-[#1a557a] transition flex items-center gap-3">
          Submit Application
          <Image src="/image/partner/submit-arrow.svg" alt="Submit" width={12} height={10} className="mt-0.5" />
        </button>
      </div>
    </div>
  );
}
