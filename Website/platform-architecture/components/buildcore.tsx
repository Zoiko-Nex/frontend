"use client";

const resources = [
  {
    title: "Developer Docs",
    icon: "/image/platform-architecture/Icon (30).png",
  },
  {
    title: "SDK Reference",
    icon: "/image/platform-architecture/Icon (31).png",
  },
  {
    title: "Schema Explorer",
    icon: "/image/platform-architecture/Icon (32).png",
  },
];

export default function BuildOnCoreSection() {
  return (
    <section className="bg-[#F8F6F7] py-10 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-zinc-900 leading-[48px]">
            Build on the Core
          </h2>
        </div>

        {/* Cards */}
        <div className="max-w-[896px] mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((item, index) => (
              <div
                key={index}
                className="
                  bg-white
                  border border-stone-300/20
                  px-6
                  py-8
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  transition-all
                  duration-300
                  hover:shadow-md
                  hover:-translate-y-1
                "
              >
                {/* Replace with your icon */}
                <div className="mb-4">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-5 h-5 object-contain"
                  />
                </div>

                <h3 className="text-base font-bold text-zinc-900 leading-6">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}