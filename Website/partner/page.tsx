import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export default function PartnerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-[#FAF9F6] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 flex flex-col items-start gap-[40px]">
            {/* Top Text Group */}
            <div className="flex flex-col items-start gap-4 w-full">
              <div className="px-3 py-1 bg-cyan-700 rounded-sm flex justify-start items-start">
                <div className="text-white text-xs font-semibold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">
                  PARTNERS & ECOSYSTEM
                </div>
              </div>

              <h1 className="w-full text-zinc-900 text-5xl lg:text-6xl font-bold font-['Hanken_Grotesk'] leading-[1.1] sm:whitespace-nowrap">
                Sovereign Collaboration.<br />Global Interoperability.
              </h1>

              <p className="w-full max-w-[672px] text-zinc-700 text-lg font-normal font-['Inter'] leading-7 mt-2">
                The ZoikoNex ecosystem brings together global technology leaders, system integrators, and network operators to accelerate the transition to governed telecom monetization.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-start items-start gap-4 pt-4">
              <Link href="/partner/apply" className="px-8 py-4 bg-cyan-700 rounded-sm flex flex-col justify-center items-center hover:bg-cyan-800 transition">
                <span className="text-center text-white text-sm font-semibold font-['Inter'] leading-4">Become a Partner</span>
              </Link>
              <Link href="/request-a-demo" className="px-8 py-4 rounded-sm outline outline-1 outline-offset-[-1px] outline-zinc-500 flex flex-col justify-center items-center hover:bg-gray-50 transition">
                <span className="text-center text-zinc-900 text-sm font-semibold font-['Inter'] leading-4">Request a Demo</span>
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full flex justify-end">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/partner/hero.jpg"
                alt="Partners shaking hands"
                className="object-cover w-full h-full"
                width={1600}
                height={1200}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Columns Section */}
      <section className="w-full bg-white py-24 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="self-stretch p-8 bg-white outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-zinc-100 flex justify-center items-center">
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/partner/institutional-trust.svg" alt="Technology Partners" width={24} height={24} />
              </div>
            </div>
            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Technology Partners</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start flex-1">
              <div className="self-stretch justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                Hyperscalers and security<br />providers providing the raw<br />infrastructure for sovereign<br />nodes.
              </div>
            </div>
            <a href="#" className="pt-2 flex justify-start items-center gap-2 group cursor-pointer mt-auto">
              <div className="justify-center text-black text-base font-normal font-['Inter'] leading-6 group-hover:text-[#2370A0] transition-colors">Explore</div>
              <div className="flex flex-col justify-start items-start group-hover:translate-x-1 transition-transform">
                <Image src="/image/partner/explore-arrow.svg" alt="Explore arrow" width={10} height={10} />
              </div>
            </a>
          </div>

          {/* Card 2 */}
          <div className="self-stretch p-8 bg-white outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-zinc-100 flex justify-center items-center">
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/partner/channel-partners.svg" alt="System Integrators" width={24} height={24} />
              </div>
            </div>
            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">System Integrators</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start flex-1">
              <div className="self-stretch justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                Global consulting firms<br />specializing in Tier-1<br />telecom<br />migrations and digital<br />transformations.
              </div>
            </div>
            <a href="#" className="pt-2 flex justify-start items-center gap-2 group cursor-pointer mt-auto">
              <div className="justify-center text-black text-base font-normal font-['Inter'] leading-6 group-hover:text-[#2370A0] transition-colors">Explore</div>
              <div className="flex flex-col justify-start items-start group-hover:translate-x-1 transition-transform">
                <Image src="/image/partner/explore-arrow.svg" alt="Explore arrow" width={10} height={10} />
              </div>
            </a>
          </div>

          {/* Card 3 */}
          <div className="self-stretch p-8 bg-white outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-zinc-100 flex justify-center items-center">
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/partner/stratis-cloud.svg" alt="Channel Partners" width={24} height={24} />
              </div>
            </div>
            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Channel Partners</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start flex-1">
              <div className="self-stretch justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                Regional experts and<br />resellers driving localized<br />growth across diverse<br />global<br />markets.
              </div>
            </div>
            <a href="#" className="pt-2 flex justify-start items-center gap-2 group cursor-pointer mt-auto">
              <div className="justify-center text-black text-base font-normal font-['Inter'] leading-6 group-hover:text-[#2370A0] transition-colors">Explore</div>
              <div className="flex flex-col justify-start items-start group-hover:translate-x-1 transition-transform">
                <Image src="/image/partner/explore-arrow.svg" alt="Explore arrow" width={10} height={10} />
              </div>
            </a>
          </div>

          {/* Card 4 */}
          <div className="self-stretch p-8 bg-white outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-zinc-100 flex justify-center items-center">
              <div className="flex flex-col justify-start items-start">
                <Image src="/image/partner/vantage-telco.svg" alt="Network Operators" width={24} height={24} />
              </div>
            </div>
            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Network Operators</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start flex-1">
              <div className="self-stretch justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                Carriers and MVNOs<br />leveraging the ZoikoNex<br />stack for operational<br />excellence.
              </div>
            </div>
            <a href="#" className="pt-2 flex justify-start items-center gap-2 group cursor-pointer mt-auto">
              <div className="justify-center text-black text-base font-normal font-['Inter'] leading-6 group-hover:text-[#2370A0] transition-colors">Explore</div>
              <div className="flex flex-col justify-start items-start group-hover:translate-x-1 transition-transform">
                <Image src="/image/partner/explore-arrow.svg" alt="Explore arrow" width={10} height={10} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Engineered for Mutual Growth */}
      <section className="w-full py-28 bg-stone-50 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] px-6 flex flex-col justify-start items-center gap-16">
          <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
            <div className="self-stretch flex flex-col justify-start items-center">
              <div className="text-center justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Engineered for Mutual Growth</div>
            </div>
            <div className="w-full max-w-[672px] flex flex-col justify-start items-center">
              <div className="text-center justify-center text-zinc-700 text-lg font-normal font-['Inter'] leading-7">
                Collaboration is hard-coded into the ZoikoNex protocol, ensuring every partner<br className="hidden md:block" />gains technical and commercial advantage.
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col lg:flex-row justify-center items-start gap-12">

            {/* Card 1 */}
            <div className="w-full lg:w-96 flex flex-col justify-start items-center gap-4">
              <div className="px-4 pt-4 pb-5 bg-zinc-100 rounded-xl flex justify-center items-start">
                <Image src="/image/partner/network-operators.svg" alt="Technical Interoperability" width={28} height={28} />
              </div>
              <div className="self-stretch pt-2 flex flex-col justify-start items-center">
                <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Technical Interoperability</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                  Built on an Open API first philosophy. Our SDKs<br className="hidden lg:block" />and technical specifications ensure seamless<br className="hidden lg:block" />integration with any legacy or greenfield<br className="hidden lg:block" />environment.
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-full lg:w-96 flex flex-col justify-start items-center gap-4">
              <div className="px-4 pt-4 pb-5 bg-zinc-100 rounded-xl flex justify-center items-start">
                <Image src="/image/partner/technical-interoperability.svg" alt="Commercial Alignment" width={32} height={24} />
              </div>
              <div className="self-stretch pt-2 flex flex-col justify-start items-center">
                <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Commercial Alignment</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                  Lucrative revenue share models and<br className="hidden lg:block" />performance-based growth incentives designed<br className="hidden lg:block" />to reward early adopters and high-scale<br className="hidden lg:block" />integrators.
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-full lg:w-96 flex flex-col justify-start items-center gap-4">
              <div className="px-4 pt-4 pb-5 bg-zinc-100 rounded-xl flex justify-center items-start">
                <Image src="/image/partner/commercial-alignment.svg" alt="Institutional Trust" width={24} height={28} />
              </div>
              <div className="self-stretch pt-2 flex flex-col justify-start items-center">
                <div className="text-center justify-center text-zinc-900 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8">Institutional Trust</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center">
                <div className="text-center justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">
                  Our governed evidence ledger provides<br className="hidden lg:block" />immutable proof of service and compliance,<br className="hidden lg:block" />establishing absolute transparency between<br className="hidden lg:block" />partners.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ecosystem Directory */}
      <section className="w-full bg-white py-28 px-6 flex flex-col justify-center items-center">
        <div className="w-full max-w-[1280px] flex flex-col justify-start items-start gap-12">

          <div className="self-stretch flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Ecosystem Directory</div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-start">
                <div className="justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Search our global network of certified ZoikoNex partners.</div>
              </div>
            </div>

            <div className="w-full md:w-96 flex flex-col justify-start items-start">
              <div className="self-stretch relative flex flex-col justify-start items-start">
                <div className="self-stretch pl-12 pr-4 py-3.5 bg-stone-50 rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex justify-center items-start overflow-hidden">
                  <div className="flex-1 flex flex-col justify-start items-start overflow-hidden">
                    <input type="text" placeholder="Search partners, services..." className="self-stretch justify-center text-gray-500 text-base font-normal font-['Inter'] bg-transparent outline-none w-full" />
                  </div>
                </div>
                <div className="h-6 left-[16px] top-[12.74px] absolute flex flex-col justify-start items-start pointer-events-none">
                  <Search className="w-4 h-4 text-zinc-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="self-stretch flex flex-col lg:flex-row justify-start items-start gap-12">

            {/* Sidebar */}
            <div className="w-full lg:w-64 pb-72 flex flex-col justify-start items-start">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <button className="self-stretch px-4 py-2 bg-cyan-700 rounded-sm flex justify-start items-center">
                  <div className="justify-center text-white text-base font-normal font-['Inter'] leading-6">All Partners</div>
                </button>
                <button className="self-stretch px-4 py-2 rounded-sm flex justify-start items-center hover:bg-gray-50 transition">
                  <div className="justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Cloud Infrastructure</div>
                </button>
                <button className="self-stretch px-4 py-2 rounded-sm flex justify-start items-center hover:bg-gray-50 transition">
                  <div className="justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Security & Compliance</div>
                </button>
                <button className="self-stretch px-4 py-2 rounded-sm flex justify-start items-center hover:bg-gray-50 transition">
                  <div className="justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">BSS/OSS Integrations</div>
                </button>
                <button className="self-stretch px-4 py-2 rounded-sm flex justify-start items-center hover:bg-gray-50 transition">
                  <div className="justify-center text-zinc-700 text-base font-normal font-['Inter'] leading-6">Regional Operations</div>
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">

              {/* Card 1 */}
              <div className="self-stretch p-6 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-1 hover:shadow-lg transition cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-sm flex justify-center items-center outline outline-1 outline-stone-100">
                  <Image src="/image/partner/system-integrators.svg" alt="Stratis Cloud" width={20} height={16} />
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-900 text-sm font-semibold font-['Hanken_Grotesk'] leading-4">Stratis Cloud</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-700 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Cloud Infrastructure</div>
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start flex-1">
                  <div className="self-stretch justify-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">
                    Global edge computing nodes with<br className="hidden xl:block" />native ZoikoNex sovereign protocol<br className="hidden xl:block" />support.
                  </div>
                </div>
                <div className="self-stretch pt-3 flex justify-start items-start gap-2 mt-auto">
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">GOLD</div>
                  </div>
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">GLOBAL</div>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="self-stretch p-6 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-1 hover:shadow-lg transition cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-sm flex justify-center items-center outline outline-1 outline-stone-100">
                  <Image src="/image/partner/vaultshield-sec.svg" alt="VaultShield Sec" width={16} height={20} />
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-900 text-sm font-semibold font-['Hanken_Grotesk'] leading-4">VaultShield Sec</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-700 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Security & Compliance</div>
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start flex-1">
                  <div className="self-stretch justify-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">
                    Advanced cryptographic key<br className="hidden xl:block" />management and institutional<br className="hidden xl:block" />governance audit tools.
                  </div>
                </div>
                <div className="self-stretch pt-3 flex justify-start items-start gap-2 mt-auto">
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">PREMIUM</div>
                  </div>
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">EMEA</div>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="self-stretch p-6 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-1 hover:shadow-lg transition cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-sm flex justify-center items-center outline outline-1 outline-stone-100">
                  <Image src="/image/partner/nodal-systems.svg" alt="Nodal Systems" width={20} height={16} />
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-900 text-sm font-semibold font-['Hanken_Grotesk'] leading-4">Nodal Systems</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-700 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">BSS/OSS Integrations</div>
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start flex-1">
                  <div className="self-stretch justify-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">
                    Legacy system decommissioning<br className="hidden xl:block" />and modern sovereign migration<br className="hidden xl:block" />specialists.
                  </div>
                </div>
                <div className="self-stretch pt-3 flex justify-start items-start gap-2 mt-auto">
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">PLATINUM</div>
                  </div>
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">APAC</div>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="self-stretch p-6 bg-white rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300 flex flex-col justify-start items-start gap-1 hover:shadow-lg transition cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-sm flex justify-center items-center outline outline-1 outline-stone-100">
                  <Image src="/image/partner/vantage-telco.svg" alt="Vantage Telco" width={20} height={20} />
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-900 text-sm font-semibold font-['Hanken_Grotesk'] leading-4">Vantage Telco</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-center text-zinc-700 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">Regional Operations</div>
                </div>
                <div className="self-stretch pt-3 flex flex-col justify-start items-start flex-1">
                  <div className="self-stretch justify-center text-zinc-700 text-sm font-normal font-['Inter'] leading-5">
                    Deep regulatory expertise and local<br className="hidden xl:block" />distribution in LATAM markets.
                  </div>
                </div>
                <div className="self-stretch pt-3 flex justify-start items-start gap-2 mt-auto">
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">SILVER</div>
                  </div>
                  <div className="px-2 py-0.5 bg-zinc-100 rounded-sm flex flex-col justify-start items-start">
                    <div className="justify-center text-zinc-900 text-[10px] font-normal font-['JetBrains_Mono'] leading-4">LATAM</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ZoikoNex Certified Architect Program */}
      <section className="w-full bg-gray-800 py-28 px-6 flex flex-col justify-start items-center overflow-hidden">
        <div className="w-full max-w-[1280px] flex flex-col lg:flex-row justify-center items-center gap-16">
          <div className="flex-1 flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-stone-50 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">ZoikoNex Certified Architect<br className="hidden lg:block" />Program</div>
            </div>
            <div className="self-stretch pb-[0.60px] flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-gray-500 text-lg font-normal font-['Inter'] leading-7">Equip your technical teams with the skills to design, deploy, and<br className="hidden xl:block" />govern sovereign telecom infrastructures. Our rigorous certification<br className="hidden xl:block" />ensures excellence at every tier.</div>
            </div>
            <div className="self-stretch pt-4 flex flex-col justify-start items-start gap-8">

              <div className="self-stretch flex justify-start items-start gap-6">
                <div className="w-12 h-12 shrink-0 bg-gray-900 rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex justify-center items-center">
                  <div className="flex flex-col justify-start items-start">
                    <div className="justify-center text-cyan-700 text-base font-normal font-['JetBrains_Mono'] leading-6">01</div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-4">Associate Tier</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-500 text-base font-normal font-['Inter'] leading-6">Foundational knowledge of sovereign protocol and API structures.<br className="hidden xl:block" />Ideal for sales and project leads.</div>
                  </div>
                </div>
              </div>

              <div className="self-stretch flex justify-start items-start gap-6">
                <div className="w-12 h-12 shrink-0 bg-gray-900 rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex justify-center items-center">
                  <div className="flex flex-col justify-start items-start">
                    <div className="justify-center text-cyan-700 text-base font-normal font-['JetBrains_Mono'] leading-6">02</div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-4">Professional Tier</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-500 text-base font-normal font-['Inter'] leading-6">Full deployment competency. Mastering migration pathways and<br className="hidden xl:block" />node orchestration.</div>
                  </div>
                </div>
              </div>

              <div className="self-stretch flex justify-start items-start gap-6">
                <div className="w-12 h-12 shrink-0 bg-gray-900 rounded-sm outline outline-1 outline-offset-[-1px] outline-stone-300/20 flex justify-center items-center">
                  <div className="flex flex-col justify-start items-start">
                    <div className="justify-center text-cyan-700 text-base font-normal font-['JetBrains_Mono'] leading-6">03</div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-cyan-700 text-sm font-semibold font-['Hanken_Grotesk'] leading-4">Sovereign Expert</div>
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="justify-center text-gray-500 text-base font-normal font-['Inter'] leading-6">Architectural mastery. Capability to design custom governance<br className="hidden xl:block" />frameworks and ledger integration.</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="w-full lg:w-[566px] flex-none p-8 bg-white/70 rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-200/50 backdrop-blur-[10px] flex flex-col justify-start items-start gap-8">
            <Image className="self-stretch h-auto md:h-[502px] object-cover relative rounded-sm" src="/image/partner/certified-architect.jpg" alt="Certified Architect" width={502} height={502} />
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-center">
                <div className="text-center justify-center text-cyan-700 text-2xl font-semibold font-['Hanken_Grotesk'] leading-8 cursor-pointer hover:text-cyan-600 transition">Start Your Path</div>
              </div>
              <div className="self-stretch pb-2 flex flex-col justify-start items-center">
                <div className="text-center justify-center text-slate-600 text-base font-normal font-['Inter'] leading-6">Enroll in the next cohort starting Q3 2024.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="w-full px-6 pt-20 pb-16 bg-stone-50 flex flex-col justify-start items-center">
        <div className="w-full max-w-[1280px] p-8 bg-zinc-100 rounded-lg flex flex-col lg:flex-row justify-start items-center gap-12">
          <div className="flex-1 flex flex-col justify-start items-start w-full">
            <Image className="self-stretch w-full h-auto lg:h-80 object-cover relative rounded-lg shadow-2xl" src="/image/partner/success-story.jpg" alt="Success Story" width={640} height={320} />
          </div>
          <div className="flex-1 flex flex-col justify-start items-start gap-4 w-full">
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-lime-800 text-xs font-bold font-['JetBrains_Mono'] leading-3 tracking-wider uppercase">SUCCESS STORY</div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-900 text-4xl font-semibold font-['Hanken_Grotesk'] leading-[48px]">Global Carrier Transformation</div>
            </div>
            <div className="self-stretch pt-2 flex flex-col justify-start items-start">
              <div className="self-stretch justify-center text-zinc-700 text-lg font-normal font-['Inter'] leading-7">"By partnering with Stratis Cloud and leveraging the ZoikoNex<br className="hidden xl:block" />infrastructure, we successfully migrated 40M subscribers to a<br className="hidden xl:block" />sovereign billing node in under 12 months, reducing operational<br className="hidden xl:block" />leakage by 22%."</div>
            </div>
            <div className="self-stretch pt-4 flex justify-start items-center gap-4">
              <div className="w-12 h-12 shrink-0 bg-stone-300 rounded-xl"></div>
              <div className="flex flex-col justify-start items-start">
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="justify-center text-zinc-900 text-base font-normal font-['Inter'] leading-6">Marcus Thorne</div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="justify-center text-zinc-700 text-xs font-normal font-['JetBrains_Mono'] leading-4">CTO, GLOBAL CONNECT OPERATOR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Sovereign Ecosystem */}
      <section className="w-full bg-[#1A1C24] py-32 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Join the Sovereign Ecosystem
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Become part of the global movement towards governed, sovereign telecom
            infrastructure. Leverage the tools, the network, and the trust.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link href="/partner/apply" className="px-8 py-4 bg-[#C7F25D] text-gray-900 font-bold rounded-sm hover:bg-[#b5e04e] transition">
              Apply for Partnership
            </Link>
            <Link href="/request-a-demo" className="px-8 py-4 bg-transparent border border-gray-600 text-white font-bold rounded-sm hover:bg-white/5 transition">
              Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
