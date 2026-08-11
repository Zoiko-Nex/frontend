import React from 'react';
import { Section, Text } from '@react-email/components';

interface Fact {
  label: string;
  value: string;
}

interface KeyFactsBlockProps {
  facts: Fact[];
}

export const KeyFactsBlock: React.FC<KeyFactsBlockProps> = ({ facts }) => {
  return (
    <Section style={container}>
      {facts.map((fact, index) => (
        <Text key={index} style={factText}>
          <strong style={label}>{fact.label}:</strong> {fact.value}
        </Text>
      ))}
    </Section>
  );
};

const container = {
  backgroundColor: '#f9fafb',
  borderRadius: '4px',
  padding: '16px',
  marginTop: '24px',
  marginBottom: '24px',
};

const factText = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#333333',
  margin: '4px 0',
};

const label = {
  color: '#555555',
  fontWeight: '600',
};
