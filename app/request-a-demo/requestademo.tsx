"use client";

import Image from "next/image";

export default function DeploymentPage() {
  return (
    <main>
    <section className="bg-[#f5f3f4] py-10">
      <div className="max-w-7xl mx-auto px-15   ">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div>
            <h1 className="text-5xl font-bold text-black leading-tight">
              Why Tier-1
              <br />
              Operators Choose
              <br />
              ZoikoNex
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-7 max-w-xl">
              The infrastructure-grade BSS platform designed for sovereign
              control, mathematical precision, and absolute reliability in
              hyper-scale environments.
            </p>

            {/* Features */}
            <div className="mt-6 space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0">
                  {/* Icon */}
                  <Image
                src="/image/request-a-demo/Background.png"
                alt="Dashboard"
                width={12}
                height={12}
                className="w-full border border-gray-300"
              />
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-black">
                    Unmatched Launch Speed
                  </h3>

                  <p className="text-gray-600 mt-2 leading-6 text-sm">
                    Reduce time-to-market from quarters to weeks with our
                    pre-integrated modular architecture and CI/CD pipelines.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0">
                  {/* Icon */}
                  <Image
                src="/image/request-a-demo/Background (1).png"
                alt="Dashboard"
                width={12}
                height={12}
                className="w-full border border-gray-300"
              />
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-black">
                    Granular Revenue Control
                  </h3>

                  <p className="text-gray-600 mt-2 leading-6 text-sm">
                    Eliminate leakage with real-time mediation and 100%
                    auditability across every transactional touchpoint.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0">
                  {/* Icon */}
                    <Image
                src="/image/request-a-demo/Background (2).png"
                alt="Dashboard"
                width={12}
                height={12}
                className="w-full border border-gray-300"
              />
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-black">
                    Sovereign Scaling
                  </h3>

                  <p className="text-gray-600 mt-2 leading-6 text-sm">
                    Multi-jurisdiction compliance built-in. Deploy on-prem,
                    cloud-native, or hybrid while maintaining data residency.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Image */}
            <div className="mt-12">
              <Image
                src="/image/request-a-demo/Data Visualization.png"
                alt="Dashboard"
                width={600}
                height={350}
                className="w-full border border-gray-300"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* Form Card */}
            <div className="bg-white border border-gray-300 p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-35 bg-gray-100 rounded-full translate-x-10 -translate-y-10"></div>

              <h2 className="text-3xl font-semibold text-black">
                Initialize Your Deployment
              </h2>

              <p className="mt-4 text-gray-600 text-xm">
                Complete the form below to schedule a technical walkthrough
                with our infrastructure architects.
              </p>

              <form className="mt-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs leading-3  uppercase text-gray-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full border border-gray-300 px-2 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs leading-3  uppercase text-gray-700 mb-2">
                      Work Email
                    </label>

                    <input
                      type="email"
                      placeholder="j.doe@operator.com"
                      className="w-full border border-gray-300 px-2 py-2 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs leading-3  uppercase text-gray-700 mb-2">
                    Organization
                  </label>

                  <input
                    type="text"
                    placeholder="Enterprise Corp"
                    className="w-full border border-gray-300 px-2 py-2 outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs leading-3  uppercase text-gray-700 mb-2">
                      Operator Type
                    </label>

                    <select className="w-full border border-gray-300 px-2 py-2 bg-white outline-none">
                      <option>Tier-1 MNO</option>
                      <option>Tier-2 MNO</option>
                      <option>MVNO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs leading-3  uppercase text-gray-700 mb-2">
                      Primary Use Case
                    </label>

                    <select className="w-full border border-gray-300 px-2 py-2 bg-white outline-none">
                      <option>Legacy Migration</option>
                      <option>Digital Transformation</option>
                      <option>MVNO Launch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs leading-3 uppercase text-gray-700 mb-2">
                    Project Requirements (Optional)
                  </label>

                  <textarea
                    rows={3}
                    placeholder="Tell us about your infrastructure goals..."
                    className="w-full border border-gray-300 px-4 py-4 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2D84B8] text-white text-xs py-5 font-semibold tracking-wider uppercase hover:bg-[#246e98] transition"
                >
                  Schedule Technical Consultation →
                </button>

                <p className="text-xs text-center text-gray-500 leading-6">
                  By submitting, you agree to our Terms of Service and Privacy
                  Policy. We process your data to facilitate the requested demo.
                </p>
              </form>
            </div>

            {/* Testimonial */}
            <div className="mt-8 bg-white border-l-4 border-[#2D84B8] p-5">
              <p className="italic text-gray-700 text-xm leading-6">
                "ZoikoNex transformed our billing cycle from a 48-hour batch
                process to real-time mediation within weeks. The sovereign
                control model is a game-changer for our multi-national
                compliance requirements.  
              </p>

              <p className="mt-5 font-bold text-xm text-gray-700">
                — CTA, Global Connect Tier-1
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="bg-[#F7F4F4] border-t border-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          <p className="text-xs font-semibold leading-3 tracking-wider text-zinc-700 uppercase">
            Certified Infrastructure Compliance
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {/* GDPR */}
            <div className="flex items-center gap-2">
              {/* Icon Here */}
              <Image
                src="/image/request-a-demo/Icon.png"
                alt="icon"
                width={22}
                height={12}
                
              />
              <span className="text-xl font-bold text-zinc-700">GDPR</span>
            </div>

            {/* ISO */}
            <div className="flex items-center gap-2">
              {/* Icon Here */}
              <Image
                src="/image/request-a-demo/Icon (1).png"
                alt="icon"
                width={22}
                height={12}
              />
              <span className="text-xl font-bold text-zinc-700">
                ISO 27001
              </span>
            </div>

            {/* PCI */}
            <div className="flex items-center gap-2">
              {/* Icon Here */}
              <Image
                src="/image/request-a-demo/Icon (2).png"
                alt="icon"
                width={22}
                height={12}
                
              />
              <span className="text-xl font-bold text-zinc-700">
                PCI-DSS
              </span>
            </div>

            {/* SOC2 */}
            <div className="flex items-center gap-2">
              {/* Icon Here */}
              <Image
                src="/image/request-a-demo/Icon (3).png"
                alt="icon"
                width={26}
                height={12}
              />
              <span className="text-xl font-bold text-zinc-700">
                SOC2
              </span>
            </div>

            {/* HIPAA */}
            <div className="flex items-center gap-2">
              {/* Icon Here */}
              <Image
                src="/image/request-a-demo/Icon (4).png"
                alt="icon"
                width={22}
                height={12}
              />
              <span className="text-xl font-bold text-zinc-700">
                HIPAA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    </main>
  );
}