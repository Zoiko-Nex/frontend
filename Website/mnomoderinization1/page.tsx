import MnoHero from "./sections/MnoHero";
import CoreInfraModules from "./sections/CoreInfraModules";
import SharedInfraGovernance from "./sections/SharedInfraGovernance";
import PhasedDeployment from "./sections/PhasedDeployment";
import MnoCTA from "./sections/MnoCTA";

export const metadata = {
  title: "MNO Modernization | Zoiko Nex",
  description:
    "Manage multiple MVNOs, resellers, and operator tenants from a single, governed orchestration layer. Scale your ecosystem without operational complexity.",
};

export default function MnoModernizationPage() {
  return (
    <>
      <MnoHero />
      <CoreInfraModules />
      <SharedInfraGovernance />
      <PhasedDeployment />
      <MnoCTA />
    </>
  );
}
