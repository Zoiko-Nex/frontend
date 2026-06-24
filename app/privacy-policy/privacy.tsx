import React from 'react';

export default function PrivacyTrustPage() {
    const privacyPillars = [
  {
    id: 1,
    title: 'What We Collect',
    desc: 'Structured mapping of identity, billing, and operational data telemetry.',
    icon:'/image/privacy/Icon.svg'
  },
  {
    id: 2,
    title: 'Why We Use It',
    desc: 'Optimizing platform uptime, network integrity, and governed AI automation.',
    icon:'/image/privacy/Icon (1).svg'
  },
  {
    id: 3,
    title: 'How We Protect It',
    desc: 'Multi-layered encryption, sovereign clusters, and SOC2 compliant storage.',
    icon:'/image/privacy/Icon (2).svg'
  },
  {
    id: 4,
    title: 'Who We Share It With',
    desc: 'Validated subprocessors and critical telecom ecosystem partners only.',
    icon:'/image/privacy/Icon (3).svg'
  },
  {
    id: 5,
    title: 'Your Choices',
    desc: 'Direct sovereign control over data portability and deletion rights.',
    icon:'/image/privacy/Icon (4).svg'
  }
];
const archetypes = [
  { id: 1, label: 'Website Visitors' },
  { id: 2, label: 'Prospects' },
  { id: 3, label: 'Platform Users' },
  { id: 4, label: 'Developers' },
  { id: 5, label: 'Partners' },
  { id: 6, label: 'Job Applicants' }
];
const taxonomyData = [
  {
    id: 1,
    category: 'Identity',
    elements: 'Legal Name, Corporate Identity, KYC Documentation.',
    archetype: 'RELATIONSHIP',
    badgeStyles: 'bg-slate-200 text-gray-900'
  },
  {
    id: 2,
    category: 'Telecom Operational',
    elements: 'SIM/eSIM identifiers, IMSI, ICCID, provisioning logs.',
    archetype: 'INFRASTRUCTURE',
    badgeStyles: 'bg-lime-300 text-lime-950'
  },
  {
    id: 3,
    category: 'Billing & Tax',
    elements: 'Invoicing history, VAT IDs, transaction metadata.',
    archetype: 'COMMERCE',
    badgeStyles: 'bg-slate-200 text-gray-900'
  },
  {
    id: 4,
    category: 'API Data',
    elements: 'Request headers, endpoint usage, developer tokens.',
    archetype: 'PLATFORM',
    badgeStyles: 'bg-sky-600 text-white'
  },
  {
    id: 5,
    category: 'AI-Assisted Workflow',
    elements: 'Model training inputs, decision-audit trails.',
    archetype: 'GOVERNED AI',
    badgeStyles: 'bg-lime-300 text-lime-950'
  }
];
const useCases = [
  {
    id: '01',
    title: 'Platform Operation',
    desc: 'Ensuring 99.99% availability of core commerce engines.'
  },
  {
    id: '02',
    title: 'Relationship Management',
    desc: 'Personalized portal access and administrative support.'
  },
  {
    id: '03',
    title: 'Security',
    desc: 'Threat detection, audit logging, and perimeter defense.'
  },
  {
    id: '04',
    title: 'Product Improvement',
    desc: 'Analytics-driven feature prioritization for MVNO scale.'
  },
  {
    id: '05',
    title: 'Compliance',
    desc: 'Meeting legal, tax, and telecom regulatory obligations.'
  },
  {
    id: '06',
    title: 'Payments',
    desc: 'Secure settlement of revenue-share and wholesale billing.'
  },
  {
    id: '07',
    title: 'Governed AI',
    desc: 'Anonymized training for sovereign predictive analytics.'
  }
];
const privacyRights = [
  {
    id: 1,
    title: 'Access',
    desc: 'Request a machine-readable export of all sovereign data associated with your identity.'
  },
  {
    id: 2,
    title: 'Correction',
    desc: 'Rectify inaccuracies in identity or billing parameters via the administrative console.'
  },
  {
    id: 3,
    title: 'Deletion',
    desc: 'Request permanent erasure of data where legal retention periods have expired.'
  },
  {
    id: 4,
    title: 'Portability',
    desc: 'Seamlessly migrate your data profiles to alternative sovereign clusters.'
  }
];
const policyTags = [
  { id: 1, label: 'Security', icon: '/image/privacy/Icon.png' },
  { id: 2, label: 'Compliance', icon: '/image/privacy/Icon (1).png' },
  { id: 3, label: 'AI Governance', icon: '/image/privacy/Icon (2).png' },
  { id: 4, label: 'Evidence Architecture', icon: '/image/privacy/Icon (3).png' },
  { id: 5, label: 'Cookie Policy', icon: '/image/privacy/Icon (4).png' }
];
  return (
    <>
    <section className="w-full bg-cyan-700 py-16 md:py-24 text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-[1180px] mx-auto px-4 flex flex-col items-center justify-center gap-5 text-center">
        
        {/* Main Heading */}
        <h2 className="max-w-5xl text-4xl md:text-5xl lg:text-6xl font-bold  leading-tight md:leading-[75px] tracking-tight">
          Privacy built for telecom-grade trust.
        </h2>
        
        {/* Description Copy */}
        <p className="max-w-4xl text-base md:text-lg text-cyan-50/90 font-normal leading-7">
          At ZoikoNex, we understand the sovereign importance of data for operators and MVNOs. 
          Our governed data handling protocols ensure infrastructure-grade reliability and absolute 
          transparency across global network orchestrations.
        </p>
        
      </div>
    </section>

     <section className="w-full  py-16 md:py-20 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ">
      <div className="w-full max-w-[1180px] mx-auto px-4">
        
        {/* Responsive Grid layout for 5 cards: 1 col on mobile, 3 cols on tablet, 5 cols on large desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {privacyPillars.map((pillar) => (
            <div 
              key={pillar.id}
              className="bg-white p-6 md:p-8 rounded-2xl flex flex-col gap-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-200 hover:shadow-md transition-shadow duration-200"
            >
              {/* Dynamic Sized Indicator Block from original design */}
              <img 
  className="w-6 h-6  rounded-md shrink-0" 
  src={pillar.icon} 
  alt={pillar.title} 
/>

              
              {/* Content Box with vertical flex to align content neatly */}
              <div className="flex flex-col flex-grow gap-2">
                <h3 className="text-black text-xl font-semibold leading-snug tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-zinc-700 text-sm leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
       <section className="w-full bg-stone-100 border-t border-b border-stone-300 py-16 md:py-24 ">
      <div className="w-full max-w-[1180px] mx-auto px-4 space-y-6 md:space-y-8">
        
        {/* Header Content Stack */}
        <div className="space-y-4 max-w-4xl text-left">
          <h2 className="text-zinc-900 text-3xl md:text-4xl font-semibold leading-tight">
            Scope of Applicability
          </h2>
          <p className="text-zinc-700 text-base md:text-lg font-normal leading-relaxed">
            This policy defines the governance standards for all data entities interacting with the Nexus Sovereign platform. 
            We maintain distinct data handling paths based on the relationship archetype.
          </p>
        </div>

        {/* Archetype Entry Rows Group — 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 border border-stone-200 rounded-xl overflow-hidden shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)]">
          {archetypes.map((item) => (
            <div 
              key={item.id}
              className="h-14 p-4 bg-white border-b border-r last:border-b-0 border-stone-200/60 flex items-center gap-4 hover:bg-stone-50/50 transition-colors duration-200"
            >
              {/* Green indicator square */}
              <img className="w-5 h-5  rounded-md shrink-0"
                    src="/image/privacy/Icon (5).svg"
                    alt="icon"
              />
              
              {/* Mono text label block */}
              <span className="text-zinc-900 text-xs font-semibold tracking-wider uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
     <section className="w-full max-w-[1280px] mx-auto px-4 md:px-13 py-16  space-y-12 bg-[#FFFFFF]">
      
      {/* Component Section Header */}
      <div className="w-full text-center">
        <h2 className="text-zinc-900 text-3xl md:text-4xl font-semibold  leading-tight tracking-tight">
          Data Taxonomy for Telecom Operations
        </h2>
      </div>

      {/* Overflow container enabling clean horizontal swipe scroll on narrow smartphone screens */}
      <div className="w-full border border-stone-300 rounded-xl overflow-hidden shadow-[0px_1px_2px_0px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            
            {/* Table Header Fields */}
            <thead>
              <tr className="bg-stone-200 border-b border-stone-300">
                <th className="p-5 md:p-6 text-zinc-900 text-xs font-semibold  tracking-wider uppercase w-1/4">
                  Category
                </th>
                <th className="p-5 md:p-6 text-zinc-900 text-xs font-semibold  tracking-wider uppercase w-1/2">
                  Data Elements
                </th>
                <th className="p-5 md:p-6 text-zinc-900 text-xs font-semibold  tracking-wider uppercase w-1/4">
                  Purpose Archetype
                </th>
              </tr>
            </thead>

            {/* Table Data Entries Body */}
            <tbody className="bg-white divide-y divide-stone-300">
              {taxonomyData.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50/40 transition-colors duration-150">
                  
                  {/* Category Title Cell */}
                  <td className="p-5 md:p-6 text-zinc-900 text-l md:text-xl font-semibold leading-snug">
                    {row.category}
                  </td>
                  
                  {/* Data Content Summary Cell */}
                  <td className="p-5 md:p-6 text-zinc-700 text-base font-normal leading-relaxed">
                    {row.elements}
                  </td>
                  
                  {/* Micro Badge Label Status Cell */}
                  <td className="p-5 md:p-6 vertical-middle">
                    <span className={`inline-block px-2.5 py-1 rounded-sm text-[10px] font-semibold  tracking-wider leading-none uppercase ${row.badgeStyles}`}>
                      {row.archetype}
                    </span>
                  </td>
                  
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </section>
    <section className="w-full bg-gray-900 py-16 md:py-18 text-white overflow-hidden">
  <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 space-y-12 md:space-y-16">
    
    {/* ==========================================
        SECTION HEADER
       ========================================== */}
    <div className="space-y-3.5 max-w-2xl text-left">
      <h2 className="text-white text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
        Governed Use Cases
      </h2>
      <p className="text-gray-400 text-base md:text-lg font-normal leading-relaxed">
        How your telemetry drives the sovereign ecosystem.
      </p>
    </div>

    {/* Updated Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      {useCases.map((item) => (
        <div 
          key={item.id}
          className="bg-gray-900 p-8 flex flex-col justify-start items-start gap-4 group hover:bg-gray-900/60 transition-colors duration-200"
        >
          {/* Step / Numeric Identifier */}
          <div className="text-sky-500 text-sm md:text-base font-medium leading-none">
            {item.id}
          </div>
          
          {/* Content Block */}
          <div className="space-y-2 mt-1">
            <h3 className="text-white text-xl md:text-2xl font-semibold leading-snug tracking-tight">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-normal leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
<section className="w-full bg-white py-16 md:py-10">
  <div className="w-full max-w-[1180px] mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center gap-12 lg:gap-16">
    
    {/* Centered Header */}
    <div className="w-full max-w-xl space-y-4">
      <h2 className="text-zinc-900 text-3xl md:text-4xl font-semibold leading-tight tracking-tight mb-8">
        Privacy Rights Center
      </h2>
    </div>

    {/* Centered Grid */}
    <div className=" w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
      {privacyRights.map((right) => (
        <div 
          key={right.id}
          className="bg-white p-6 md:p-8 flex flex-col justify-start items-start gap-4 hover:bg-slate-50/50 transition-colors duration-200"
        >
          {/* Feature Title Head */}
          <h3 className="text-zinc-900 text-xl md:text-2xl font-semibold leading-none tracking-tight">
            {right.title}
          </h3>
          
          {/* Feature Copy Block */}
          <p className="text-zinc-700 text-sm md:text-base font-normal leading-relaxed">
            {right.desc}
          </p>
        </div>
      ))}
    </div>

  </div>
</section>

 <section className="w-full bg-stone-100 border-t border-stone-300 py-12 font-['Inter']">
      <div className="w-full max-w-[1180px] mx-auto px-4">
        
        {/* Flexible container wrapping items gracefully into multiple rows */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {policyTags.map((tag) => (
            <div 
              key={tag.id}
              className="px-6 py-4 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(16,18,24,0.02)] border border-slate-200 flex items-center gap-3 hover:bg-slate-50/50 hover:border-slate-300/80 cursor-pointer transition-all duration-200"
            >
              {/* 2. Dynamic Image Icon Asset */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <img 
                  src={tag.icon} 
                  alt={tag.label} 
                  className="w-full h-full object-contain" 
                />
              </div>
              
              {/* Monospace framework tag label text */}
              <span className="text-zinc-900 text-xs font-semibold font-['JetBrains_Mono'] tracking-wider uppercase whitespace-nowrap">
                {tag.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>


    </>
  );
}
