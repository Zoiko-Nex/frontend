import ESIMHero from "./components/hero";
import EngineeredForScale from "./components/engineeredforscale";
import ScaleWithoutComplexity from "./components/scalewithoutcomplexity";
import SecureFoundationCTA from "./components/securefoundation";

export const metadata = {
  title: "eSIM & IoT | ZoikoNex – Enterprise Connectivity Platform",
  description:
    "Precision billing and lifecycle management for millions of eSIM profiles and global IoT fleets. Secure, sovereign control for infrastructure-grade reliability.",
};

export default function ESIMAndIOTPage() {
  return (
    <>
      <ESIMHero />
      <EngineeredForScale />
      <ScaleWithoutComplexity />
      <SecureFoundationCTA />
    </>
  );
}
