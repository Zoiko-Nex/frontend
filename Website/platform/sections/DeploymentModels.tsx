import Image from "next/image";

const models = [
  {
    title: "Shared SaaS",
    desc: "Multi-tenant, rapid-entry model for MVNOs and sub-brands seeking cloud-native speed.",
    active: true,
  },
  {
    title: "Dedicated Cloud",
    desc: "Sovereign instance in your VPC. Your keys, your data residency, total commercial isolation.",
    active: false,
  },
  {
    title: "Hybrid Mesh",
    desc: "Cloud orchestration with local-edge execution for low latency and distributed network operations.",
    active: false,
  },
  {
    title: "Sovereign On-Prem",
    desc: "Full physical control within your data center for national security and total regulatory compliance.",
    active: false,
  },
];

export default function DeploymentModels() {
  return (
    <section className="bg-[#06081B] py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Eyebrow */}
        <p className="uppercase text-[10px] tracking-[6px] text-[#2D9AE3] mb-8">
          DEPLOYMENT ARCHITECTURE
        </p>

        {/* Heading */}
        <h2 className="text-white text-4xl lg:text-6xl font-bold mb-20 leading-tight">
          One Architecture. Four
          <br />
          Deployment Models.
        </h2>

        <div className="grid lg:grid-cols-2 gap-0">

          {/* LEFT — stacked model list */}
          <div className="flex flex-col">
            {models.map((item, i) => (
              <div
                key={i}
                className={`
                  relative p-10 border-b border-white/5 bg-[#10162D]
                  ${item.active
                    ? "border-l-[3px] border-l-[#2D9AE3]"
                    : "border-l-[3px] border-l-transparent"
                  }
                `}
              >
                <h3 className="text-white text-2xl font-semibold mb-4">
                  {item.title}
                </h3>
                <p className="text-[#80869B] text-base leading-8">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT — image + floating card */}
          <div className="relative">
            <Image
              src="/deployment-image.jpg"
              width={700}
              height={850}
              alt="Deployment"
              className="object-cover w-full h-full"
            />

            {/* Floating compliance card — bottom-left of image */}
            <div className="absolute bottom-12 left-0 bg-[#3182B7] p-8 max-w-[260px]">
              <p className="text-white text-lg font-semibold leading-8">
                GDPR, SOC2, eIDAS
                <br />
                Compliant &amp; Legally
                <br />
                Defensible
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}