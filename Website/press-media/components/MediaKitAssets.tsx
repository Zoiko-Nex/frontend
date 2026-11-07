import Image from "next/image";

const assets = [
  {
    icon: "/image/press/logo-pack.svg",
    title: "Logo Pack",
    format: "EPS, SVG, PNG (14MB)",
  },
  {
    icon: "/image/press/exec-headshots.svg",
    title: "Exec Headshots",
    format: "JPG, TIFF (42MB)",
  },
  {
    icon: "/image/press/product-ui.svg",
    title: "Product UI",
    format: "4K PNG (185MB)",
  },
  {
    icon: "/image/press/brand-guidelines.svg",
    title: "Brand Guidelines",
    format: "PDF (8.5MB)",
  },
];

export default function MediaKitAssets() {
  return (
    <section className="bg-white py-16 lg:py-28">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center gap-16 px-8">
        
        {/* Heading */}
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className="text-center text-4xl font-semibold leading-[48px] text-zinc-900" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
            Media Kit Assets
          </h2>
          <div className="flex max-w-[672px] flex-col items-center">
            <p className="text-center text-base font-normal leading-6 text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              Approved visual assets and guidelines for press use. All files are provided in vector and high-resolution raster formats.
            </p>
          </div>
        </div>

        {/* 4-col grid */}
        <div className="flex w-full flex-col md:flex-row items-start justify-center gap-6">
          {assets.map((asset) => {
            return (
              <div key={asset.title} className="flex flex-1 flex-col relative w-full mb-8 md:mb-0">
                
                {/* Thumbnail box */}
                <div className="flex w-full flex-col items-start pb-4">
                  <div className="flex w-full items-center justify-center bg-stone-200 py-28 transition-colors hover:bg-stone-300">
                    <Image src={asset.icon} alt={asset.title} width={36} height={36} />
                  </div>
                </div>

                {/* Info below */}
                <div className="flex w-full flex-col items-center mt-2 gap-1">
                  <div className="text-center text-xs font-semibold tracking-wider text-zinc-900" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {asset.title}
                  </div>
                  <div className="text-center text-xs font-normal leading-4 text-gray-500 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {asset.format}
                  </div>
                  <a
                    href="#"
                    className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                  >
                    <span className="text-center text-sm font-normal leading-6 text-sky-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Download
                    </span>
                    <Image src="/image/press/download.svg" alt="Download" width={12} height={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
