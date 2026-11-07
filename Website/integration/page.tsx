import type { Metadata } from "next";
import IntegrationReferencePage from "../integration-reference/IntegrationReferencePage";

export const metadata: Metadata = {
  title: "Integration Reference | ZoikoNex",
  description:
    "Find integration patterns, compatibility context, schemas, security requirements and current runtime behavior for connecting ZoikoNex to telecom and enterprise systems.",
};

export default function Page() {
  return <IntegrationReferencePage />;
}
