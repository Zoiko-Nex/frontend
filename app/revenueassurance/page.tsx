import RAHero from "./sections/RAHero";
import RACoreModules from "./sections/RACoreModules";
import RAConfidenceChain from "./sections/RAConfidenceChain";
import RAStats from "./sections/RAStats";
import RASovereignControl from "./sections/RASovereignControl";
import RACTA from "./sections/RACTA";

export const metadata = {
  title: "Revenue Assurance | ZoikoNex",
  description:
    "Detect and recover revenue gaps across usage, rating, billing, and settlement. ZoikoNex BSS-native engine ensures zero leakage and total assurance.",
};

export default function RevenueAssurancePage() {
  return (
    <>
      <RAHero />
      <RACoreModules />
      <RAConfidenceChain />
      <RAStats />
      <RASovereignControl />
      <RACTA />
    </>
  );
}
