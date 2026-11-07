import React from 'react';
import Image from "next/image";
import Link from "next/link";


export default function TechnicalSpecsCTA() {
  const specs = [
    "Diameter/RADIUS Interconnect",
    "GTP Proxy Configuration"
  ];

  return (
    <section className="w-full bg-[#000000] py-15 px-4 md:px-36 flex flex-col items-center justify-center ">
      <div className="w-full max-w-[1280px] px-6 flex flex-col items-center gap-8">
        <Image
                                src="/image/mvno-launch/build.png"
                                alt="build"
                                width={46}
                                height={30}
                                />
        

        {/* Headings */}
        <div className="text-center flex flex-col items-center gap-4 max-w-[768px]">
          <h2 className="mt-4 text-white text-4xl font-semibold leading-[48px]">
            Built for Engineers, Controlled by You.
          </h2>
          <p className="text-[#78767C] text-lg font-normal leading-7">
            Access our full API documentation, SDKs for iOS/Android, and terraform providers to automate your entire MVNO lifecycle.
          </p>
        </div>

    

        {/* Action Elements */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link href="/api-reference" className="px-10 py-4 bg-[#2A78A1] hover:bg-[#226284] text-white text-sm font-semibold leading-4 rounded transition-colors duration-200 shadow-md text-center">
            Explore API Docs
          </Link>
          <Link href="/contact-us" className="px-10 py-4 bg-transparent hover:bg-white/5 text-white border border-white/20 text-sm font-semibold leading-4 rounded transition-colors duration-200 text-center">
            Contact Architecture Team
          </Link>
        </div>

      </div>
    </section>
  );
}