import Link from "next/link"; 
import Image from "next/image"; 
import { ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <Image
            src="/image/ZoikoNex_Logo_Official/SVG/ZoikoNex_Logo_SVG.svg"
            alt="ZoikoNex - Governed Telecom Monetization"
            width={152}
            height={48}
            priority
            className="h-auto w-[132px] sm:w-[152px]"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
        <Link href="/resources" className="flex items-center gap-1">
          Platform
          <ChevronDown size={14} />
        </Link>          
        <Link href="/resources" className="flex items-center gap-1">
          Solutions
          <ChevronDown size={14} />
        </Link>          
          <Link href="#">Operators</Link>
          <Link href="#">Deployment</Link>
          <Link href="#">Trust</Link>
          <Link href="/resources" className="flex items-center gap-1">
          Resources
          <ChevronDown size={14} />
        </Link>
          <Link href="#">Company</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-white text-black rounded-xl text-sm font-semibold shadow-md">
            View Platform Architecture
          </button>

          <button className="px-5 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-md">
            Request a Demo
          </button>
        </div>
      </div>
    </header>
  );
}
