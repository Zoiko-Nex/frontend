import { Shapes, UserCircle2, ScanLine, BookOpen } from "lucide-react";
import { Download } from "lucide-react";

const assets = [
  {
    Icon: Shapes,
    title: "Logo Pack",
    format: "EPS, SVG, PNG (14MB)",
  },
  {
    Icon: UserCircle2,
    title: "Exec Headshots",
    format: "JPG, TIFF (42MB)",
  },
  {
    Icon: ScanLine,
    title: "Product UI",
    format: "4K PNG (185MB)",
  },
  {
    Icon: BookOpen,
    title: "Brand Guidelines",
    format: "PDF (8.5MB)",
  },
];

export default function MediaKitAssets() {
  return (
    <section className="bg-white py-12 font-['Plus_Jakarta_Sans',sans-serif] lg:py-20">
      <div className="mx-auto max-w-275 px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-4 text-center">
          <h2 className="text-[26px] font-bold text-[#1A2B4A] lg:text-[32px]">Media Kit Assets</h2>
          <p className="mx-auto mt-3 max-w-140 text-[15px] leading-[1.65] text-[#64748B]">
            Approved visual assets and guidelines for press use. All files are provided
            in vector and high-resolution raster formats.
          </p>
        </div>

        {/* 4-col grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {assets.map((asset) => {
            const Icon = asset.Icon;
            return (
              <div key={asset.title}>
                {/* Thumbnail box */}
                <div className="flex h-60 items-center justify-center rounded-xl bg-[#EBEEF2]">
                  <Icon size={44} className="text-[#2B83C6]" strokeWidth={1.4} />
                </div>

                {/* Info below */}
                <div className="mt-4 text-center">
                  <p className="font-mono text-[13.5px] font-bold text-[#1A2B4A]">
                    {asset.title}
                  </p>
                  <p className="mt-0.5 font-mono text-[12px] text-[#94A3B8]">
                    {asset.format}
                  </p>
                  <a
                    href="#"
                    className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1778C8] transition hover:text-[#1461A8]"
                  >
                    Download
                    <Download size={13} strokeWidth={2.2} />
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
