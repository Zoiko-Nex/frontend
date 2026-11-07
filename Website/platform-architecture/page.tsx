import PlatformArchitecturePage from "../Home/platformarchitecture";
import BuildOnCoreSection from "./components/buildcore";
import DeploymentFlexibility from "./components/Deployment";
import GovernanceStandards from "./components/goverance";
import MonetizationCore from "./components/Monetization";
import UnifiedDomainsSection from "./components/platformsection";

export default function(){
    return(
        <>
            <UnifiedDomainsSection/>
            <MonetizationCore/>
            <DeploymentFlexibility/>
            <GovernanceStandards/>
            <BuildOnCoreSection/>
        </>
    )
}