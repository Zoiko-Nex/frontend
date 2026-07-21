import React from 'react';
import ImplementationTemplate from '../../components/ImplementationTemplate';

export default function TravelEsimBrandPage() {
    return (
        <ImplementationTemplate
            tags={['ESIM', 'GLOBAL ROAMING', 'MULTI-IMSI']}
            title="Travel eSIM Brand"
            description="Deployment of a multi-IMSI global roaming solution with real-time balance enforcement across 180 countries."
            challenge="A digital-first travel connectivity brand needed to deliver seamless data across 180 countries without bill shock. Prepaid balances had to be enforced in real time across dozens of underlying carrier networks, with instant eSIM provisioning at the moment of purchase and policy that adapts to each traveler's jurisdiction."
            approach={[
                "Multi-IMSI orchestration with automated network steering to the best available carrier",
                "Real-time rating and balance enforcement calculated at the moment of consumption",
                "SM-DP+ integration for remote, over-the-air eSIM provisioning",
                "Geofenced policy triggers that adjust plans and controls per jurisdiction",
                "Unified prepaid ledger reconciling usage across every underlying network"
            ]}
            outcomes={[
                { value: "180", label: "COUNTRIES COVERED" },
                { value: "<1s", label: "BALANCE ENFORCEMENT" },
                { value: "0.00%", label: "OVERAGE LEAKAGE" },
                { value: "99.999%", label: "PROVISIONING UPTIME" }
            ]}
        />
    );
}
