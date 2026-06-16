// import Image from "next/image";
// const steps = [
//   {
//     title: "Data Ingestion",
//     description: "Capture CDRs, xDRs, and logs from 300+ protocol adapters.",
//     active: false,
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
//         <rect x="3" y="4" width="14" height="18" rx="2" stroke="#C8F252" strokeWidth="1.5" />
//         <path d="M17 13h6M19 10l4 3-4 3" stroke="#C8F252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
//   {
//     title: "Cross-Reference",
//     description: "Multi-point validation against network, rating, and billing engines.",
//     active: false,
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
//         <path d="M6 9h14" stroke="#C8F252" strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M6 17h14" stroke="#C8F252" strokeWidth="1.6" strokeLinecap="round" />
//         <path d="M16 6L10 20" stroke="#C8F252" strokeWidth="1.5" strokeLinecap="round" />
//       </svg>
//     ),
//   },
//   {
//     title: "Anomaly Scoring",
//     description: "ML-driven categorization of leaks by dollar impact and root cause.",
//     active: false,
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
//         <path d="M13 4L24 22H2L13 4z" stroke="#C8F252" strokeWidth="1.5" strokeLinejoin="round" />
//         <path d="M13 11v5" stroke="#C8F252" strokeWidth="1.6" strokeLinecap="round" />
//         <circle cx="13" cy="19" r="0.8" fill="#C8F252" />
//       </svg>
//     ),
//   },
//   {
//     title: "ACR Closure",
//     description: "Automated Corrective Reporting and balance ledger finalization.",
//     active: true,
//     icon: (
//       <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
//         <circle cx="13" cy="13" r="9" stroke="#0E0E18" strokeWidth="1.5" />
//         <path d="M9 13l3 3 5-5" stroke="#0E0E18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     ),
//   },
// ];

// export default function RAConfidenceChain() {
//   return (
//     <section className="bg-[#10101D] py-24">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* Header — centered */}
//         <div className="text-center mb-20">
//           <h2
//             className="text-white font-bold mb-4"
//             style={{ fontSize: "clamp(1.75rem, 3vw, 2.6rem)" }}
//           >
//             The Revenue Confidence Chain
//           </h2>
//           <p className="text-[#6B7280] text-[0.9rem] max-w-[38rem] mx-auto leading-7">
//             From raw network events to financial closure, we maintain a cryptographic
//             audit trail for every dollar earned.
//           </p>
//         </div>

//         {/* Steps row */}
//         <div className="relative flex items-start gap-0">

//           {steps.map(({ title, description, active, icon }, i) => (
//             <div key={title} className="flex-1 flex flex-col items-start relative">

//               {/* Icon box + connector line */}
//               <div className="flex items-center w-full mb-8">

//                 {/* Icon box */}
//                 <div
//                   className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
//                   style={{
//                     backgroundColor: active ? "#6EC44A" : "#1A1D2E",
//                     border: active ? "none" : "1.5px solid #C8F252",
//                   }}
//                 >
//                   {icon}
//                 </div>

//                 {/* Connector line */}
//                 {i < steps.length - 1 && (
//                   <div className="flex-1 h-px bg-[#2A2E42]" />
//                 )}
//               </div>

//               {/* Text */}
//               <h3 className="text-white text-base font-bold mb-2">{title}</h3>
//               <p className="text-[#6B7280] text-[0.82rem] leading-[1.65] pr-6">
//                 {description}
//               </p>

//             </div>
//           ))}

//         </div>

//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";

const steps = [
  {
    title: "Data Ingestion",
    description:
      "Capture CDRs, xDRs, and logs from 300+ protocol adapters.",
    active: false,
    icon: "/image/Icon (7).svg",
  },
  {
    title: "Cross-Reference",
    description:
      "Multi-point validation against network, rating, and billing engines.",
    active: false,
    icon: "/image/Icon (6).svg",
  },
  {
    title: "Anomaly Scoring",
    description:
      "ML-driven categorization of leaks by dollar impact and root cause.",
    active: false,
    icon: "/image/Icon (5).svg",
  },
  {
    title: "ACR Closure",
    description:
      "Automated Corrective Reporting and balance ledger finalization.",
    active: true,
    icon: "/image/Icon (4).svg",
  },
];

export default function RAConfidenceChain() {
  return (
    <section className="bg-[#171724] py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-20">

        {/* Header */}
        <div className="w-[672px] mx-auto mb-16">
          <h2
            className="text-white"
            style={{
              fontFamily: "Hanken Grotesk",
              fontSize: "48px",
              fontWeight: 600,
              lineHeight: "48px",
            }}
          >
            The Revenue Confidence Chain
          </h2>

          <p
            className="mt-6 text-[#6B7280]"
            style={{
              fontFamily: "Inter",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          >
            From raw network events to financial closure, we maintain a cryptographic
            audit trail for
            <br />
            every dollar earned.
          </p>
        </div>

        {/* Process */}
        <div className="relative w-full">

          {/* Connector Line */}
          <div className="absolute left-0 right-0 top-[40px] h-px bg-stone-300/20" />

          <div className="grid grid-cols-4 gap-10 relative z-10">

            {steps.map((step, i) => (
              <div key={i} className="flex flex-col">

                {/* Icon */}
                <div className="w-20 h-24 pb-6">
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center"
                    style={{
                      background: step.active ? "#84CC3A" : "#1B1C2D",
                      border: step.active
                        ? "none"
                        : i === 0
                          ? "1px solid #84CC3A"
                          : "1px solid rgba(200,197,204,.15)",
                    }}
                  >
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={28}
                      height={28}
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="pb-2">
                  <h3
                    className="text-white"
                    style={{
                      fontSize: "32px",
                      fontWeight: 600,
                      lineHeight: "32px",
                    }}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className="text-gray-500 pr-4"
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  {step.description}
                </p>

              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}