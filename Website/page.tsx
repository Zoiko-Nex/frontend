import CategoryDefinitionSection from "./Home/category";
import DomainArchitecturePage from "./Home/domainarchitecture";
import HomePage from "./Home/hero";
import PlatformArchitecturePage from "./Home/platformarchitecture";
import ProblemSection from "./Home/problemsection";
import WhyZoikoNexPage from "./Home/why-zoikonex";

export default function Home() {
  return (
    <>
        <HomePage/>
        <ProblemSection/>
        <CategoryDefinitionSection/>
        <PlatformArchitecturePage/>
        <DomainArchitecturePage/>
        <WhyZoikoNexPage/>
    </>
  );
}
