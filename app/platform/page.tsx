import PlatformHero from "./sections/PlatformHero";
import ComparisonSection from "./sections/ComparisonSection";
import CapabilitiesGrid from "./sections/CapabilitiesGrid";
import DeploymentModels from "./sections/DeploymentModels";
import PlatformCTA from "./sections/PlatformCTA";
import CoreDifferentiation from "./sections/CoreDifferentiation";

export const metadata = {
  title: "Platform | Zoiko Nex",
  description:
    "Explore the ZoikoNex GTMI platform — governed telecom monetization infrastructure with 18 unified domains, real-time jurisdiction packs, and AI-controlled intelligence.",
};

export default function PlatformPage() {
  return (
    <>
      <PlatformHero />
      <ComparisonSection />
      <CoreDifferentiation />
      <CapabilitiesGrid />
      <DeploymentModels />
      <PlatformCTA />
    </>
  );
}