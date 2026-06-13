"use client";

import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";

export default function MVNOLaunchHero() {
  return (
    <section className="relative overflow-hidden bg-black py-20 lg:py-18 lg:px-10">
      {/* Background Glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(24,26,70,0.8) 0%, #000000 70%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Label */}
            <div
              className="
                inline-flex
                items-center
                px-4
                py-2
                bg-[#BCF0631A]
                border
                border-[#4768004D]
              "
            >
              <span
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  font-mono
                  text-[#2B7EC1]
                "
              >
                Sovereign MVNO Engine
              </span>
            </div>

            {/* Heading */}
            <h1
              className="
                mt-8
                text-5xl
                lg:text-5xl
                font-bold
                leading-tight
                text-white
              "
            >
              Launch Your{" "}
              <span className="text-lime-500">
                MVNO
              </span>
              <br />
              on Sovereign
              <br />
              Infrastructure.
            </h1>

            {/* Description */}
            <p
              className="
                mt-8
                max-w-[540px]
                text-lg
                leading-8
                text-[#848293]
              "
            >
              Move from plan design to customer activation in weeks,
              not quarters, with our pre-integrated monetization
              stack and cloud-native core.
            </p>

            {/* CTA */}
            <button
              className="
                mt-10
                inline-flex
                items-center
                gap-3
                px-8
                py-4
                bg-[#2B7EC1]
                text-white
                text-sm
                font-semibold
              "
            >
              Request a Demo
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Content */}
          <div className="relative">
            {/* Dashboard Card */}
            <div
              className="
                relative
                overflow-hidden
                rounded-lg
                border
                border-white/10
                bg-[#141629]
              "
            >
              <Image
                src="/image/mvno/dashboard.png"
                alt="MVNO Dashboard"
                width={600}
                height={500}
                className="w-full h-auto"
              />
            </div>

            {/* Floating Metric */}
            <div
              className="
                absolute
                left-0
                bottom-6
                bg-[#1A1A33]
                border
                border-white/10
                px-6
                py-5
              "
            >
              <div className="flex items-center gap-2">
                <Zap
                  size={14}
                  className="text-[#2B7EC1]"
                />

                <span
                  className="
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    font-mono
                    text-[#848293]
                  "
                >
                  Provisioning Time
                </span>
              </div>

              <p className="mt-3 text-2xl font-bold text-white">
                &lt; 400ms
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}