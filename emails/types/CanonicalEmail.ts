export interface BrandRendering {
  display_name: string;
  logo_url: string;
  primary_color: string;
}

export interface SenderRendering {
  from_name: string;
  reply_to: string;
}

export interface SupportRendering {
  url: string;
}

export interface IdentityContract {
  tenant_id: string;
  operator_id: string;
  brand_id: string;
  environment_name: string;
  recipient_role: string;
  recipient_locale: string;
  recipient_time_zone: string;
}

export interface TraceabilityContract {
  event_type: string;
  event_version: string;
  event_id: string;
  correlation_id: string;
  message_reference: string;
  template_id: string;
  template_version: string;
}

export interface GovernanceContract {
  message_classification: string;
  message_legal_basis: string;
  message_preference_category: string;
  message_expiry_at?: string;
  message_sensitivity: string;
}

export interface LocalizedValuesContract {
  amount_formatted?: string;
  currency_code: string;
  date_local: string;
  date_utc: string;
  jurisdiction_code: string;
  language_code: string;
}

export interface CanonicalEmailPayload {
  identity: IdentityContract;
  traceability: TraceabilityContract;
  rendering: {
    brand: BrandRendering;
    sender: SenderRendering;
    support: SupportRendering;
  };
  governance: GovernanceContract;
  localizedValues: LocalizedValuesContract;
  
  // Specific event data goes here depending on the template
  eventData?: any;
}
