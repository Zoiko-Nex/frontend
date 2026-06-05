// export default function Hero() {
//   return (
//     <section className="bg-[#103A63] text-white h-[502px]">
//       <div className="max-w-[1440px] mx-auto h-full px-[80px]">

//         <div className="grid grid-cols-2 gap-12 h-full items-center">

//           {/* LEFT */}
//           <div>

//             <p className="text-[#9BE15D] text-[12px] font-semibold tracking-[2px] uppercase mb-4">
//               GTMI
//             </p>

//            <h1 className="text-[58px] leading-[64px] font-bold">
//   Telecom Monetization
// </h1>

// <h1 className="text-[58px] leading-[64px] font-bold text-[#8CC63F]">
//   Rebuilt as Infrastructure.
// </h1>

//             <p className="mt-6 text-[15px] leading-[26px] text-slate-300 max-w-[520px]">
//               ZoikoNex is the infrastructure layer powering the next
//               generation of telecom operators where charging,
//               billing, compliance, governance and monetization
//               converge in one unified platform.
//             </p>

//             <div className="flex gap-4 mt-8">

//               <button className="bg-[#8CC63F] text-[#0B1633] px-6 py-3 rounded-lg font-semibold text-sm">
//                 View Platform
//               </button>

//               <button className="border border-white/30 px-6 py-3 rounded-lg text-sm font-semibold">
//                 Request a Demo
//               </button>

//             </div>

//           </div>

//           {/* RIGHT CARD */}
//           <div className="flex justify-end">

//             <div className="w-[470px] rounded-[20px] bg-[#204E78] border border-[#37638A] p-8">

//               <p className="text-[#9BE15D] text-[12px] uppercase tracking-[2px] mb-4">
//                 GTMI
//               </p>

//               <h3 className="text-[28px] font-bold leading-[36px] mb-6">
//                 Governed Telecom
//                 Monetization
//                 Infrastructure
//               </h3>

//               <div className="space-y-3">

//                 <div className="bg-[#2A5A86] rounded-xl px-4 py-3 text-sm">
//                   Real-time monetization across every product type
//                 </div>

//                 <div className="bg-[#2A5A86] rounded-xl px-4 py-3 text-sm">
//                   Multi-jurisdiction control with governance
//                 </div>

//                 <div className="bg-[#2A5A86] rounded-xl px-4 py-3 text-sm">
//                   Flexible deployment from SaaS to sovereign hosting
//                 </div>

//                 <div className="bg-[#2A5A86] rounded-xl px-4 py-3 text-sm">
//                   Single institutional platform replacing OSS/BSS
//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     </section>
//   );
// }

export default function Hero() {
  return (
    <section className="bg-[#0D3B6E] text-white min-h-[500px]">
      <div className="max-w-[1440px] mx-auto h-full px-[80px] py-[60px]">

        <div className="grid grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            {/* Label */}
            <p className="text-[#9BE15D] text-[10px] font-semibold tracking-[2.5px] uppercase mb-4">
              ABOUT ZOIKONEX
            </p>

            {/* Badge pill */}
            <div className="inline-flex items-center border border-white/25 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[11px] text-white/80 tracking-wide font-medium">
                A ZOIKO TECH PLATFORM · PART OF ZOIKO GROUP INC.
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[52px] leading-[60px] font-bold tracking-tight">
              Telecom Monetization
            </h1>
            <h1 className="text-[52px] leading-[60px] font-bold tracking-tight text-[#8CC63F] mb-5">
              Rebuilt as Infrastructure.
            </h1>

            {/* Body */}
            <p className="text-[14.5px] leading-[26px] text-slate-300 max-w-[480px] mb-8">
              ZoikoNex is the infrastructure layer powering the next
              generation of telecom operators — where charging, billing,
              compliance, and governance converge in one unified system.
            </p>

            {/* CTAs */}
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-[#8CC63F] text-[#0B1633] px-6 py-3 rounded-lg font-semibold text-[13px]">
                View the Platform
                <span className="text-base">→</span>
              </button>
              <button className="border border-white/30 px-6 py-3 rounded-lg text-[13px] font-semibold text-white">
                Request a Demo
              </button>
            </div>

          </div>

          {/* RIGHT CARD */}
          <div className="flex justify-end">

            <div className="w-[460px] rounded-[18px] bg-[#1A4A72] border border-[#2E6090]/60 p-8">

              {/* Card label */}
              <p className="text-[#9BE15D] text-[10px] uppercase tracking-[2.5px] font-semibold mb-3">
                CATEGORY DEFINITION
              </p>

              {/* GTMI heading */}
              <h2 className="text-[42px] font-bold leading-none mb-1 tracking-tight">
                GTMI
              </h2>
              <p className="text-[13px] text-slate-300 mb-7">
                Governed Telecom Monetization Infrastructure
              </p>

              {/* Feature rows */}
              <div className="space-y-3">

                {/* Row 1 */}
                <div className="flex items-center gap-3 bg-[#1D527C] rounded-xl px-4 py-3">
                  <div className="w-7 h-7 rounded-md bg-[#8CC63F] flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B1633" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </div>
                  <span className="text-[13px] text-white/90">Real-time monetization across every product type</span>
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-3 bg-[#1D527C] rounded-xl px-4 py-3">
                  <div className="w-7 h-7 rounded-md bg-[#4A9FD4] flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <span className="text-[13px] text-white/90">Multi-jurisdiction control with evidence-grade governance</span>
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-3 bg-[#1D527C] rounded-xl px-4 py-3">
                  <div className="w-7 h-7 rounded-md bg-[#4A9FD4] flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <span className="text-[13px] text-white/90">Flexible deployment from shared SaaS to sovereign hosting</span>
                </div>

                {/* Row 4 */}
                <div className="flex items-center gap-3 bg-[#1D527C] rounded-xl px-4 py-3">
                  <div className="w-7 h-7 rounded-md bg-[#4A9FD4] flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                    </svg>
                  </div>
                  <span className="text-[13px] text-white/90">Single institutional platform replacing fragmented OSS/BSS</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}