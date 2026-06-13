import MnoHero2 from "./sections/MnoHero2";
import ModernizationPillars from "./sections/ModernizationPillars";
import MigrationStrategy from "./sections/MigrationStrategy";
import MnoCTA2 from "./sections/MnoCTA2";

export const metadata = {
  title: "MNO Modernization | Zoiko Nex",
  description:
    "Phased BSS Modernization for Tier-1 Operators. De-risk your legacy transformation with a domain-by-domain migration pathway that ensures zero service disruption and absolute sovereign control.",
};

export default function MnoModernization2Page() {
  return (
    <>
      <MnoHero2 />
      <ModernizationPillars />
      <MigrationStrategy />
      <MnoCTA2 />
    </>
  );
}
