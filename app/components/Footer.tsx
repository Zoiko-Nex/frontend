import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#10101D] text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-36 pt-[66px] pb-4">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_repeat(5,minmax(140px,1fr))] gap-10 lg:gap-3">

          {/* Logo Section - Full width layout across break-points */}
          <div className="flex flex-col items-start">
            <Image
              src="/image/ZoikoNex_Logo_Official/PNG/ZoikoNex_Logo_PNG.png"
              alt="ZoikoNex"
              width={250}
              height={100}
              className="object-contain"
            />

            <p className="max-w-[256px] text-sm leading-6 text-white mt-4">
              The infrastructure layer for governed telecom monetization. Built
              for operators who intend to scale globally and govern without
              compromise.
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <span className="h-7 px-3 rounded-[20px] bg-sky-600/20 text-sky-400 text-xs font-semibold flex items-center">
                GTMI Platform
              </span>
              <span className="h-7 px-3 rounded-[20px] bg-lime-500/10 text-lime-400 text-xs font-semibold flex items-center">
                TM Forum Aligned
              </span>
            </div>
          </div>

          {/* Dynamic subgrid context: Converts to 2 columns on mobile/tablet, expands inline on desktop screens */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:contents gap-8">

            {/* Platform */}
            <div>
              <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
                Platform
              </h3>
              <ul className="space-y-[10px] text-xs leading-5">
                <li><Link href="/platform-architecture" className="hover:text-lime-300 transition-colors">Architecture Overview</Link></li>
                <li><Link href="/18domains" className="hover:text-lime-300 transition-colors">18 Domains</Link></li>
                <li><Link href="/globaljurisdiction" className="hover:text-lime-300 transition-colors">Jurisdiction Engine</Link></li>
                <li><Link href="/evidence" className="hover:text-lime-300 transition-colors">Evidence Ledger</Link></li>
                <li><Link href="/platform/ai-governance" className="hover:text-lime-300 transition-colors">AI Governance</Link></li>
                <li><Link href="/deployment" className="hover:text-lime-300 transition-colors">Deployment Models</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
                Solutions
              </h3>
              <ul className="space-y-[10px] text-xs leading-5">
                <li><Link href="/mvnolaunch" className="hover:text-lime-300 transition-colors">MVNO Launch</Link></li>
                <li><Link href="/solutions/mvne-multi-brand" className="hover:text-lime-300 transition-colors">MVNE & Multi-Brand</Link></li>
                <li><Link href="/solutions/mno-modernization" className="hover:text-lime-300 transition-colors">MNO Modernization</Link></li>
                <li><Link href="/esim-and-iot" className="hover:text-lime-300 transition-colors">eSIM & IoT</Link></li>
                <li><Link href="/solutions/enterprise-b2b" className="hover:text-lime-300 transition-colors">Enterprise & B2B</Link></li>
                <li><Link href="/networkapi" className="hover:text-lime-300 transition-colors">Network API</Link></li>
              </ul>
            </div>

            {/* Trust */}
            <div>
              <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
                Trust
              </h3>
              <ul className="space-y-[10px] text-xs leading-5">
                <li><Link href="/security" className="hover:text-lime-300 transition-colors">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-lime-300 transition-colors">Compliance</Link></li>
                <li><Link href="/trust/governance" className="hover:text-lime-300 transition-colors">Governance</Link></li>
                <li><Link href="/trust/evidence-architecture" className="hover:text-lime-300 transition-colors">Evidence Architecture</Link></li>
                <li><Link href="/trust/trust-center" className="hover:text-lime-300 transition-colors">Trust Center</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
                Resources
              </h3>
              <ul className="space-y-[10px] text-xs leading-5">
                <li><Link href="/resources/documentation" className="hover:text-lime-300 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-lime-300 transition-colors">API Reference</Link></li>
                <li><Link href="/resources/developer-portal" className="hover:text-lime-300 transition-colors">Developer Portal</Link></li>
                <li><Link href="/resources/case-studies" className="hover:text-lime-300 transition-colors">Case Studies</Link></li>
                <li><Link href="/blog" className="hover:text-lime-300 transition-colors">Blog</Link></li>
                <li><Link href="/changelog" className="hover:text-lime-300 transition-colors">Changelog</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
                Company
              </h3>
              <ul className="space-y-[10px] text-xs leading-5">
                <li><Link href="/about" className="hover:text-lime-300 transition-colors">About</Link></li>
                <li><Link href="/leadership" className="hover:text-lime-300 transition-colors">Leadership</Link></li>
                <li><Link href="/partners" className="hover:text-lime-300 transition-colors">Partners</Link></li>
                <li><Link href="/careers" className="hover:text-lime-300 transition-colors">Careers</Link></li>
                <li><Link href="/press-media" className="hover:text-lime-300 transition-colors">Press & Media</Link></li>
                <li><Link href="/contact" className="hover:text-lime-300 transition-colors">Contact</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Metadata Layout */}
        <div className="border-t border-white/10 mt-14 pt-8">
          <div className="flex flex-wrap justify-start lg:justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-white">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Cookie Policy</Link>
            <Link href="#" className="hover:underline">Acceptable Use</Link>
            <Link href="#" className="hover:underline">Security</Link>
            <Link href="#" className="hover:underline">Accessibility</Link>
          </div>
          <div className="mt-8 space-y-3 text-left lg:text-center text-[11px] leading-5 text-white/65">
            <p>
              © 2026 ZoikoNex | ZoikoNex is an AI-powered telecom monetization, OSS/BSS and governed billing platform developed and operated by Zoiko Tech Inc., the technology arm of Zoiko Group Inc.
            </p>
            <p>
              Headquarters: 1401 21st Street, Suite R, Sacramento, CA 95811, USA. | European Headquarters: 167-169 Great Portland Street, 5th Floor, London W1W 5PF, United Kingdom.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}