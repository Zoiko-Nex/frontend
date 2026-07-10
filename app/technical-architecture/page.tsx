import TechnicalSpecsCTA from "../mvnolaunch/components/technicalspecs";
import EvaluationRoadmap from "./components/evaluationroadmap";
import FinalCTASection from "./components/last-cta-section";
import TechnicalArchitectureHero from "./components/technical-architecturhero";
import TechnicalSpecsSection from "./components/technicalspecs";

export default function () {
    return (
        <>
            <TechnicalArchitectureHero />
            <EvaluationRoadmap />
            <TechnicalSpecsSection />
            <FinalCTASection />
        </>
    )
}