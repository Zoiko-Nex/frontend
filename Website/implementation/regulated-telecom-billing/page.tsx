import React from 'react';
import ImplementationTemplate from '../../components/ImplementationTemplate';

export default function RegulatedTelecomBillingPage() {
    return (
        <ImplementationTemplate
            tags={['COMPLIANCE', 'SOVEREIGN DATA', 'GOVERNMENT']}
            title="Regulated Telecom Billing"
            description="Complex tax engine integration and sovereign data compliance for high-security government contractors."
            challenge="A telecom serving government contractors faced multi-jurisdiction tax complexity alongside strict data-residency mandates. Every transaction required an immutable, auditable record, and processing could never leave the sovereign boundary of the jurisdiction it belonged to."
            approach={[
                "Jurisdiction Engine automating per-region tax computation and regulatory rules",
                "Sovereign data residency with in-region processing and storage",
                "Evidence Ledger recording immutable, traceable billing and audit trails",
                "Policy-driven governance controls applied as the operating model, not an add-on",
                "Controls aligned to SOC 2 Type II, ISO 27001, GDPR and PCI DSS L1"
            ]}
            outcomes={[
                { value: "100%", label: "AUDIT TRACEABILITY" },
                { value: "0", label: "RESIDENCY VIOLATIONS" },
                { value: "Multi", label: "JURISDICTION TAX AUTO" },
                { value: "24/7", label: "COMPLIANCE POSTURE" }
            ]}
        />
    );
}
