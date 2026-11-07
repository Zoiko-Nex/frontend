"use client";

import { SectionHeader, Card } from "./ui";

export default function ComingSoon({ title, summary }: { title: string; summary: string }) {
  return (
    <div>
      <SectionHeader title={title} subtitle="Scaffolded — follows the same integration template as the wired domains." />
      <Card style={{ padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>This domain is mapped, not yet wired.</div>
        <p style={{ fontSize: 13, color: "var(--ax-text-dim)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>{summary}</p>
      </Card>
    </div>
  );
}
