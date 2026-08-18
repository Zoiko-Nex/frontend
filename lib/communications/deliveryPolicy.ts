/**
 * ZoikoNex Email Communications System
 * Section 03: Message Classes and Delivery Policy
 * Baseline Specification v1.0 - Section 03
 */

export type MessageClassLevel = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export interface DeliveryPolicy {
  classLevel: MessageClassLevel;
  className: string;
  timing: string;
  repeatRule: string;
  targetAudience: string;
  channels: ('Email' | 'SMS' | 'Push' | 'Webhook' | 'Service Desk' | 'In-Product')[];
  description: string;
  badgeColor: string;
}

export const DELIVERY_CLASSES: Record<MessageClassLevel, DeliveryPolicy> = {
  P0: {
    classLevel: 'P0',
    className: 'Security / Revenue / Service Critical',
    timing: 'Immediate (0-second SLA)',
    repeatRule: 'No digest permitted; immediate escalation',
    targetAudience: 'Authorized security roles + multi-level escalation chain',
    channels: ['Email', 'SMS', 'Webhook', 'Service Desk', 'In-Product'],
    description: 'Account takeover, charging fallback, mediation gap, revenue leakage, platform service suspension.',
    badgeColor: 'bg-red-100 text-red-800 border-red-300'
  },
  P1: {
    classLevel: 'P1',
    className: 'Action Required',
    timing: 'Immediate or Strict Policy SLA',
    repeatRule: 'Repeat with controlled escalation intervals',
    targetAudience: 'Named owner + designated approver',
    channels: ['Email', 'In-Product', 'SMS'],
    description: 'Failed SIM activation, failed payment, rejected regulatory filing, readiness blocker.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  P2: {
    classLevel: 'P2',
    className: 'Transactional Confirmation',
    timing: 'Near-real-time (< 30s)',
    repeatRule: 'Strictly idempotent; no unnecessary repetition',
    targetAudience: 'Direct event participant / subscriber',
    channels: ['Email', 'In-Product'],
    description: 'Invoice issued, payment received, eSIM ready, commercial agreement signed.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  P3: {
    classLevel: 'P3',
    className: 'Operational Notice',
    timing: 'Scheduled or Event-driven',
    repeatRule: 'Digest permitted where safe',
    targetAudience: 'Affected operational/platform role',
    channels: ['Email', 'In-Product'],
    description: 'Scheduled maintenance, job completion, export ready, product launch.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  P4: {
    classLevel: 'P4',
    className: 'Commercial Lifecycle',
    timing: 'Consent / Relationship governed',
    repeatRule: 'Cadence controlled (e.g. 90d, 30d, 7d)',
    targetAudience: 'Commercial decision-maker or account executive',
    channels: ['Email'],
    description: 'Demonstrations, proposals, contract renewal milestones, support entitlements.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  P5: {
    classLevel: 'P5',
    className: 'Promotional',
    timing: 'Explicit opt-in consent governed',
    repeatRule: 'Strictly frequency capped',
    targetAudience: 'Opted-in subscriber audience',
    channels: ['Email', 'SMS', 'Push'],
    description: 'Promotional offers, seasonal campaigns, add-on promotions.',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300'
  }
};

/**
 * Resolves the delivery policy for a given template classification and ID
 */
export function resolveDeliveryPolicy(classification: string, templateId: string): DeliveryPolicy {
  const lower = (classification || '').toLowerCase();
  const idLower = (templateId || '').toLowerCase();

  // P0 conditions
  if (
    lower.includes('critical') || 
    lower.includes('security critical') || 
    lower.includes('revenue assurance critical') ||
    lower.includes('operational critical') ||
    lower.includes('service critical') ||
    idLower.includes('risk-002') || 
    idLower.includes('risk-007') || 
    idLower.includes('risk-009') || 
    idLower.includes('sub-009') ||
    idLower.includes('usg-009') ||
    idLower.includes('sup-013')
  ) {
    return DELIVERY_CLASSES.P0;
  }

  // P1 conditions
  if (
    lower.includes('alert') || 
    lower.includes('action required') || 
    lower.includes('security alert') || 
    lower.includes('mandatory') ||
    lower.includes('escalation') ||
    lower.includes('dispute') ||
    lower.includes('failed') ||
    lower.includes('human-in-command')
  ) {
    return DELIVERY_CLASSES.P1;
  }

  // P2 conditions
  if (
    lower.includes('transactional') || 
    lower.includes('milestone') || 
    lower.includes('signed') ||
    lower.includes('ready') ||
    lower.includes('completed') ||
    lower.includes('received') ||
    lower.includes('confirmed')
  ) {
    return DELIVERY_CLASSES.P2;
  }

  // P4 conditions
  if (
    lower.includes('commercial') || 
    lower.includes('renewal') || 
    lower.includes('proposal') ||
    lower.includes('lifecycle')
  ) {
    return DELIVERY_CLASSES.P4;
  }

  // P5 conditions
  if (lower.includes('promotional') || lower.includes('marketing')) {
    return DELIVERY_CLASSES.P5;
  }

  // Default to P3 Operational Notice
  return DELIVERY_CLASSES.P3;
}
