import OperatorsHero from "./sections/OperatorsHero";
import OperatorModels from "./sections/OperatorModels";
import MnoModernization from "./sections/MnoModernization";
import MvnoDigitalBrands from "./sections/MvnoDigitalBrands";
import CapabilityMatrix from "./sections/CapabilityMatrix";
import PathwaysToSovereignty from "./sections/PathwaysToSovereignty";
import TrustBanner from "./sections/TrustBanner";
import FaqSection from "./sections/FaqSection";
import OperatorsCta from "./sections/OperatorsCta";

export const metadata = {
  title: "Operator Models | ZoikoNex",
  description:
    "Explore ZoikoNex's unified sovereign infrastructure for MNOs, MVNOs, IoT, Enterprise, Digital Brands, and Public Sector operators. The global standard for telecom monetization.",
};

export default function OperatorsPage() {
  return (
    <>
      <OperatorsHero />
      <OperatorModels />
      <MnoModernization />
      <MvnoDigitalBrands />
      <CapabilityMatrix />
      <PathwaysToSovereignty />
      <TrustBanner />
      <FaqSection />
      <OperatorsCta />
    </>
  );
}
