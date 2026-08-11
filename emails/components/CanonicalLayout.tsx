import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Link,
  Hr,
  Button
} from '@react-email/components';
import { CanonicalEmailPayload } from '../types/CanonicalEmail';

interface CanonicalLayoutProps {
  payload: CanonicalEmailPayload;
  subject: string;
  preheader: string;
  openingText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  children: React.ReactNode; // For the KeyFactsBlock and any extra content
}

export const CanonicalLayout: React.FC<CanonicalLayoutProps> = ({
  payload,
  subject,
  preheader,
  openingText,
  primaryCtaText,
  primaryCtaLink,
  children,
}) => {
  const { rendering, traceability, identity } = payload;
  const brandColor = rendering.brand.primary_color || '#000000';

  return (
    <Html>
      <Head>
        <title>{subject}</title>
      </Head>
      <Preview>{preheader}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* 1. Brand Context & Sender Identity */}
          <Section style={header}>
            {rendering.brand.logo_url && (
              <Img
                src={rendering.brand.logo_url}
                alt={rendering.brand.display_name}
                height="40"
                style={logo}
              />
            )}
          </Section>

          <Section style={content}>
            {/* 4. Plain-language opening */}
            <Text style={heading}>{subject}</Text>
            <Text style={paragraph}>{openingText}</Text>

            {/* 5. Key facts and specific content injected here */}
            {children}

            {/* 6. Primary CTA */}
            <Section style={ctaContainer}>
              <Button
                style={{ ...button, backgroundColor: brandColor }}
                href={primaryCtaLink}
              >
                {primaryCtaText}
              </Button>
            </Section>
            
            <Hr style={hr} />

            {/* 7. Security or customer-protection note */}
            <Text style={securityNote}>
              For your security, this email does not display full payment credentials, identity documents, SIM credentials or complete account identifiers.
              <br /><br />
              If you did not expect this activity, do not forward this email or share credentials. Use the verified ZoikoNex sign-in page or contact your authorized administrator immediately.
            </Text>

            {/* 8. Support route, message reference, tenant identity */}
            <Text style={footer}>
              Need help? Visit <Link href={rendering.support.url} style={link}>{rendering.support.url}</Link> or quote message reference {traceability.message_reference} when contacting support.
              <br />
              {rendering.brand.display_name}
              <br />
              Tenant ID: {identity.tenant_id}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '0 48px',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 48px',
};

const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
};

const ctaContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const securityNote = {
  fontSize: '12px',
  color: '#8898aa',
  lineHeight: '1.5',
};

const footer = {
  fontSize: '12px',
  color: '#8898aa',
  lineHeight: '1.5',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};
