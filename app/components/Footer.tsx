import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#10101D] text-white">
  <div className="max-w-[1440px] mx-auto px-36 pt-[66px] pb-4">

<div className="grid grid-cols-[280px_repeat(5,minmax(140px,1fr))] gap-3">
      {/* Logo Section */}
      <div>
        <Image
          src="/image/ZoikoNex_Logo_SVG-01 1.png"
          alt="ZoikoNex"
          width={250}
          height={100}
          
        />

        <p className="max-w-[256px] text-sm leading-6 text-white ">
          The infrastructure layer for governed telecom monetization. Built
          for operators who intend to scale globally and govern without
          compromise.
        </p>

        <div className="flex gap-3 mt-5">
          <span className="h-7 px-3 rounded-[20px] bg-sky-600/20 text-sky-400 text-xs font-semibold flex items-center">
            GTMI Platform
          </span>

          <span className="h-7 px-3 rounded-[20px] bg-lime-500/10 text-lime-400 text-xs font-semibold flex items-center">
            TM Forum Aligned
          </span>
        </div>
      </div>

      {/* Platform */}
      <div>
        <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
          Platform
        </h3>

                      <ul className="space-y-[10px] text-xs leading-5">
                    <li>
                  <Link href="/platform/architecture-overview">Architecture Overview</Link>
                </li>
                <li>
                  <Link href="/platform/18-domains">18 Domains</Link>
                </li>
                <li>
                  <Link href="/platform/jurisdiction-engine">Jurisdiction Engine</Link>
                </li>
                <li>
                  <Link href="/platform/evidence-ledger">Evidence Ledger</Link>
                </li>
                <li>
                  <Link href="/platform/ai-governance">AI Governance</Link>
                </li>
                <li>
                  <Link href="/platform/deployment-models">Deployment Models</Link>
                </li>
              </ul>
      </div>

      {/* Solutions */}
      <div>
        <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
          Solutions
        </h3>

        <ul className="space-y-[10px] text-xs leading-5">
            <li><Link href="/solutions/mvno-launch">MVNO Launch</Link></li>
            <li><Link href="/solutions/mvne-multi-brand">MVNE & Multi-Brand</Link></li>
            <li><Link href="/solutions/mno-modernization">MNO Modernization</Link></li>
            <li><Link href="/solutions/esim-iot">eSIM & IoT</Link></li>
            <li><Link href="/solutions/enterprise-b2b">Enterprise & B2B</Link></li>
            <li><Link href="/solutions/network-api">Network API</Link></li>
            </ul>
      </div>

      {/* Trust */}
      <div>
        <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
          Trust
        </h3>

                  <ul className="space-y-[10px] text-xs leading-5">
            <li><Link href="/trust/security">Security</Link></li>
            <li><Link href="/trust/compliance">Compliance</Link></li>
            <li><Link href="/trust/governance">Governance</Link></li>
            <li><Link href="/trust/evidence-architecture">Evidence Architecture</Link></li>
            <li><Link href="/trust/trust-center">Trust Center</Link></li>
          </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
          Resources
        </h3>

                  <ul className="space-y-[10px] text-xs leading-5">
            <li><Link href="/resources/documentation">Documentation</Link></li>
            <li><Link href="">API Reference</Link></li>
            <li><Link href="/resources/developer-portal">Developer Portal</Link></li>
            <li><Link href="/resources/case-studies">Case Studies</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/changelog">Changelog</Link></li>
          </ul>
      </div>
      
      {/* Company */}
      <div>
        <h3 className="text-lime-300 text-sm font-bold uppercase tracking-wider mb-5">
          Company
        </h3>

                  <ul className="space-y-[10px] text-xs leading-5">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/leadership">Leadership</Link></li>
            <li><Link href="/partners">Partners</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/press-media">Press & Media</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
      </div>
    </div>

    {/* Bottom Links */}
    <div className="border-t border-white/10 mt-14 pt-8">
      <div className="flex justify-center flex-wrap gap-8 text-sm text-white">
        <Link href="#">Privacy Policy</Link>
        <Link href="#">Terms of Service</Link>
        <Link href="#">Cookie Policy</Link>
        <Link href="#">Acceptable Use</Link>
        <Link href="#">Security</Link>
        <Link href="#">Accessibility</Link>
      </div>
    </div>
  </div>
</footer>
  );
}