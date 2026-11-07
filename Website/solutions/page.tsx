import CoreInfrastructureDifferentiators from "./components/CoreInfrastructure";
import FAQAndCTA from "./components/FAQ&CTASection";
import SovereignMonetizationHero from "./components/hero";
import OperatorModelSection from "./components/operatorsolution";
import ImplementationPathway from "./components/Pathway";
import RapidMarketEntrySection from "./components/RapidMarketEntry";
import EnterpriseSolutionsSection from "./components/SolutionCard";
import TrustGovernanceBand from "./components/TrustGoverance";

export default function Page() {
  return (
    <>
      <SovereignMonetizationHero />
      <OperatorModelSection/>
      <EnterpriseSolutionsSection/>
      <RapidMarketEntrySection/>
      <ImplementationPathway/>
      <CoreInfrastructureDifferentiators/>
      <TrustGovernanceBand/>
      <FAQAndCTA/>
    </>
  );
}