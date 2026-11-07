import CoreAPICapabilities from "./components/corecapabilities";
import NetworkAPIHero from "./components/networkapihero";
import ProgrammableMonetizationLayer from "./components/programmable";
import SovereignInfrastructure from "./components/sovereign";

export default function page(){
    return(
        <>
            <NetworkAPIHero/>    
            <CoreAPICapabilities/>
            <ProgrammableMonetizationLayer/>
            <SovereignInfrastructure/>   
        </>
    )
}