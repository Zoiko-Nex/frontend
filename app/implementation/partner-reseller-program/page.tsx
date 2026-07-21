import React from 'react';
import ImplementationTemplate from '../../components/ImplementationTemplate';

export default function PartnerResellerProgramPage() {
    return (
        <ImplementationTemplate
            tags={['MVNE', 'WHITE-LABEL', 'CHANNEL']}
            title="Partner Reseller Program"
            description="White-labeling the BSS portal for sub-distributors with granular commission management and hierarchy controls."
            challenge="An operator set out to scale through a multi-tier reseller channel. Each partner needed a branded portal, isolated tenant data, and automated commission settlement across a distributor hierarchy — without adding operational overhead for the parent operator."
            approach={[
                "Multi-tenant, white-label BSS portals branded per partner",
                "Hierarchical ACLs and role-based access across the distributor tree",
                "Automated commission calculation and wholesale settlement",
                "Brand-specific product catalogs and currencies per tenant",
                "Self-service partner onboarding with governed guardrails"
            ]}
            outcomes={[
                { value: "Multi-tier", label: "HIERARCHY SUPPORT" },
                { value: "Automated", label: "COMMISSION SETTLEMENT" },
                { value: "Isolated", label: "BRAND TENANTS" },
                { value: "Faster", label: "PARTNER ONBOARDING" }
            ]}
        />
    );
}
