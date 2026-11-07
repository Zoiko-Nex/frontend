import CoreCapabilitiesSection from "./components/corecapabilities";
import MVNOLaunchHero from "./components/hero";
import LaunchBlueprint from "./components/launchblueprint";
import TechnicalSpecsCTA from "./components/technicalspecs";

export default function page(){
    return (
        <>
            <MVNOLaunchHero/>
            <CoreCapabilitiesSection/>
            <LaunchBlueprint/>
            <TechnicalSpecsCTA/>
        </>
    )
}