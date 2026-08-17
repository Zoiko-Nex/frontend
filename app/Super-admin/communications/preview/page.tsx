"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { renderPreviewEmail } from '../../../actions/renderPreviewEmail';
import { BrandRendering, SenderRendering, SupportRendering } from '../../../../emails/types/CanonicalEmail';

interface TemplateRegistryItem {
  id: string;
  name: string;
  family: string;
  classification: string;
  recipient: string;
}

const TEMPLATE_REGISTRY: TemplateRegistryItem[] = [
  // ── COM ────────────────────────────────────────────
  { id: 'ZNX-EM-COM-001', name: "Demo request received", family: 'COM', classification: "Commercial transactional", recipient: "Prospect" },
  { id: 'ZNX-EM-COM-002', name: "Demo booked", family: 'COM', classification: "Commercial transactional", recipient: "Prospect and attendees" },
  { id: 'ZNX-EM-COM-003', name: "Demo reminder", family: 'COM', classification: "Commercial transactional", recipient: "Prospect and attendees" },
  { id: 'ZNX-EM-COM-004', name: "Demo rescheduled", family: 'COM', classification: "Commercial transactional", recipient: "Prospect and attendees" },
  { id: 'ZNX-EM-COM-005', name: "Demo canceled", family: 'COM', classification: "Commercial transactional", recipient: "Prospect and attendees" },
  { id: 'ZNX-EM-COM-006', name: "Sandbox request received", family: 'COM', classification: "Commercial transactional", recipient: "Prospect technical contact" },
  { id: 'ZNX-EM-COM-007', name: "Sandbox approved", family: 'COM', classification: "Commercial transactional", recipient: "Prospect technical contact" },
  { id: 'ZNX-EM-COM-008', name: "Sandbox expiring", family: 'COM', classification: "Commercial transactional", recipient: "Sandbox users" },
  { id: 'ZNX-EM-COM-009', name: "Trial started", family: 'COM', classification: "Commercial transactional", recipient: "Evaluation account owner" },
  { id: 'ZNX-EM-COM-010', name: "Trial ending", family: 'COM', classification: "Commercial transactional", recipient: "Evaluation account owner" },
  { id: 'ZNX-EM-COM-011', name: "Trial expired", family: 'COM', classification: "Commercial transactional", recipient: "Evaluation account owner" },
  { id: 'ZNX-EM-COM-012', name: "Proposal shared", family: 'COM', classification: "Commercial transactional", recipient: "Commercial decision makers" },
  { id: 'ZNX-EM-COM-013', name: "Proposal expiring", family: 'COM', classification: "Commercial transactional", recipient: "Commercial decision makers" },
  // ── IAM ────────────────────────────────────────────
  { id: 'ZNX-EM-IAM-001', name: "User invitation", family: 'IAM', classification: "Security transactional", recipient: "Invited platform user" },
  { id: 'ZNX-EM-IAM-002', name: "Invitation reminder", family: 'IAM', classification: "Security transactional", recipient: "Invited platform user" },
  { id: 'ZNX-EM-IAM-003', name: "Invitation expired", family: 'IAM', classification: "Security transactional", recipient: "Invited platform user" },
  { id: 'ZNX-EM-IAM-004', name: "Account created", family: 'IAM', classification: "Security transactional", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-005', name: "Email verification", family: 'IAM', classification: "Security transactional", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-006', name: "Email verification reminder", family: 'IAM', classification: "Security transactional", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-007', name: "Password created", family: 'IAM', classification: "Security notice", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-008', name: "Password reset requested", family: 'IAM', classification: "Security transactional", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-009', name: "Password changed", family: 'IAM', classification: "Security notice", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-010', name: "MFA enrollment required", family: 'IAM', classification: "Security mandatory", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-011', name: "MFA enabled", family: 'IAM', classification: "Security notice", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-012', name: "MFA disabled", family: 'IAM', classification: "Security alert", recipient: "Platform user and tenant security admin" },
  { id: 'ZNX-EM-IAM-013', name: "MFA recovery codes regenerated", family: 'IAM', classification: "Security notice", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-014', name: "New device sign-in", family: 'IAM', classification: "Security alert", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-015', name: "Suspicious sign-in blocked", family: 'IAM', classification: "Security critical", recipient: "Platform user and tenant security admin" },
  { id: 'ZNX-EM-IAM-016', name: "Account locked", family: 'IAM', classification: "Security alert", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-017', name: "Account unlocked", family: 'IAM', classification: "Security notice", recipient: "Platform user" },
  { id: 'ZNX-EM-IAM-018', name: "Sessions or access revoked", family: 'IAM', classification: "Security notice", recipient: "Platform user" },
  // ── TEN ────────────────────────────────────────────
  { id: 'ZNX-EM-TEN-001', name: "Tenant provisioned", family: 'TEN', classification: "Operational transactional", recipient: "Tenant sponsor and platform owner" },
  { id: 'ZNX-EM-TEN-002', name: "Onboarding kickoff", family: 'TEN', classification: "Operational transactional", recipient: "Implementation team" },
  { id: 'ZNX-EM-TEN-003', name: "Onboarding task assigned", family: 'TEN', classification: "Operational task", recipient: "Task owner" },
  { id: 'ZNX-EM-TEN-004', name: "Onboarding task overdue", family: 'TEN', classification: "Operational escalation", recipient: "Task owner and project lead" },
  { id: 'ZNX-EM-TEN-005', name: "Legal entity information required", family: 'TEN', classification: "Compliance transactional", recipient: "Tenant legal or finance owner" },
  { id: 'ZNX-EM-TEN-006', name: "Billing profile verified", family: 'TEN', classification: "Operational notice", recipient: "Tenant finance owner" },
  { id: 'ZNX-EM-TEN-007', name: "Jurisdiction pack selected", family: 'TEN', classification: "Compliance notice", recipient: "Tenant compliance and implementation leads" },
  { id: 'ZNX-EM-TEN-008', name: "Jurisdiction pack changed", family: 'TEN', classification: "Compliance alert", recipient: "Tenant compliance and implementation leads" },
  { id: 'ZNX-EM-TEN-009', name: "Data residency confirmed", family: 'TEN', classification: "Compliance notice", recipient: "Tenant security, privacy and implementation leads" },
  { id: 'ZNX-EM-TEN-010', name: "Brand kit received", family: 'TEN', classification: "Operational notice", recipient: "Tenant brand and implementation leads" },
  { id: 'ZNX-EM-TEN-011', name: "Sender domain verification required", family: 'TEN', classification: "Technical transactional", recipient: "Tenant technical admin" },
  { id: 'ZNX-EM-TEN-012', name: "Sender domain verified", family: 'TEN', classification: "Technical notice", recipient: "Tenant technical admin" },
  { id: 'ZNX-EM-TEN-013', name: "Test tenant ready", family: 'TEN', classification: "Operational transactional", recipient: "Implementation and QA team" },
  { id: 'ZNX-EM-TEN-015', name: "Production readiness issues", family: 'TEN', classification: "Operational escalation", recipient: "Customer and ZoikoNex launch team" },
  { id: 'ZNX-EM-TEN-016', name: "Go-live approved", family: 'TEN', classification: "Operational milestone", recipient: "Executive sponsor and launch team" },
  { id: 'ZNX-EM-TEN-017', name: "Go-live scheduled", family: 'TEN', classification: "Operational milestone", recipient: "Executive sponsor and launch team" },
  { id: 'ZNX-EM-TEN-018', name: "Go-live completed", family: 'TEN', classification: "Operational milestone", recipient: "Executive sponsor, launch team and authorized users" },
  // ── RBAC ────────────────────────────────────────────
  { id: 'ZNX-EM-RBAC-001', name: "Role assigned", family: 'RBAC', classification: "Security notice", recipient: "Platform user" },
  { id: 'ZNX-EM-RBAC-002', name: "Role changed", family: 'RBAC', classification: "Security notice", recipient: "Platform user" },
  { id: 'ZNX-EM-RBAC-003', name: "Elevated access requested", family: 'RBAC', classification: "Security workflow", recipient: "Approver and requester" },
  { id: 'ZNX-EM-RBAC-004', name: "Elevated access approved", family: 'RBAC', classification: "Security workflow", recipient: "Requester" },
  { id: 'ZNX-EM-RBAC-005', name: "Elevated access denied", family: 'RBAC', classification: "Security workflow", recipient: "Requester" },
  { id: 'ZNX-EM-RBAC-006', name: "Elevated access expiring", family: 'RBAC', classification: "Security notice", recipient: "Requester" },
  { id: 'ZNX-EM-RBAC-007', name: "Privileged access used", family: 'RBAC', classification: "Security audit", recipient: "Tenant security admin and actor" },
  { id: 'ZNX-EM-RBAC-008', name: "User change approval required", family: 'RBAC', classification: "Security workflow", recipient: "Authorized approver" },
  { id: 'ZNX-EM-RBAC-009', name: "Inactive user review", family: 'RBAC', classification: "Security governance", recipient: "Tenant security admin" },
  { id: 'ZNX-EM-RBAC-010', name: "User deactivated", family: 'RBAC', classification: "Security notice", recipient: "Platform user and tenant admin" },
  // ── CRM ────────────────────────────────────────────
  { id: 'ZNX-EM-CRM-001', name: "Subscriber welcome", family: 'CRM', classification: "Customer transactional", recipient: "Subscriber or account contact (tenant-branded)" },
  { id: 'ZNX-EM-CRM-002', name: "Subscriber email verification", family: 'CRM', classification: "Customer security", recipient: "Subscriber or account contact (tenant-branded)" },
  { id: 'ZNX-EM-CRM-003', name: "Customer profile updated", family: 'CRM', classification: "Customer notice", recipient: "Subscriber or account contact (tenant-branded)" },
  { id: 'ZNX-EM-CRM-006', name: "Account ownership transfer completed", family: 'CRM', classification: "Customer transactional", recipient: "Former and new account owners" },
  { id: 'ZNX-EM-CRM-007', name: "Account merge requested", family: 'CRM', classification: "Customer transactional", recipient: "Account owner" },
  { id: 'ZNX-EM-CRM-008', name: "Account merge completed", family: 'CRM', classification: "Customer transactional", recipient: "Account owner" },
  { id: 'ZNX-EM-CRM-009', name: "Identity information required", family: 'CRM', classification: "Compliance transactional", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-CRM-010', name: "Identity verification approved", family: 'CRM', classification: "Compliance notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-CRM-011', name: "Identity verification rejected", family: 'CRM', classification: "Compliance alert", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-CRM-012', name: "Customer status changed", family: 'CRM', classification: "Customer notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-CRM-013', name: "Account reactivated", family: 'CRM', classification: "Customer transactional", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-CRM-014', name: "Account closure requested", family: 'CRM', classification: "Customer transactional", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-CRM-015', name: "Account closure scheduled", family: 'CRM', classification: "Customer transactional", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-CRM-016', name: "Account closed", family: 'CRM', classification: "Customer transactional", recipient: "Former subscriber or account contact" },
  { id: 'ZNX-EM-CRM-017', name: "Personal data export ready", family: 'CRM', classification: "Privacy transactional", recipient: "Data subject" },
  { id: 'ZNX-EM-CRM-018', name: "Data correction completed", family: 'CRM', classification: "Privacy transactional", recipient: "Data subject" },
  { id: 'ZNX-EM-CRM-019', name: "Complaint acknowledged", family: 'CRM', classification: "Regulatory customer care", recipient: "Complainant" },
  { id: 'ZNX-EM-CRM-020', name: "Complaint resolved", family: 'CRM', classification: "Regulatory customer care", recipient: "Complainant" },
  // ── ORD ────────────────────────────────────────────
  { id: 'ZNX-EM-ORD-001', name: "Order received", family: 'ORD', classification: "Order transactional", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-002', name: "Order pending validation", family: 'ORD', classification: "Order notice", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-003', name: "Order approved", family: 'ORD', classification: "Order notice", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-004', name: "Order requires action", family: 'ORD', classification: "Order alert", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-005', name: "Order canceled", family: 'ORD', classification: "Order transactional", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-006', name: "Order completed", family: 'ORD', classification: "Order milestone", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-007', name: "Service activation scheduled", family: 'ORD', classification: "Provisioning transactional", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-008', name: "Service activation started", family: 'ORD', classification: "Provisioning notice", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-009', name: "Service activation successful", family: 'ORD', classification: "Provisioning milestone", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-010', name: "Service activation failed", family: 'ORD', classification: "Provisioning alert", recipient: "Subscriber or business account contact and operations" },
  { id: 'ZNX-EM-ORD-011', name: "Provisioning delayed", family: 'ORD', classification: "Provisioning alert", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-012', name: "Physical SIM dispatched", family: 'ORD', classification: "Fulfillment transactional", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-013', name: "Physical SIM delivery update", family: 'ORD', classification: "Fulfillment transactional", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-014', name: "eSIM ready", family: 'ORD', classification: "Provisioning transactional", recipient: "Subscriber or authorized line user" },
  { id: 'ZNX-EM-ORD-015', name: "eSIM installation reminder", family: 'ORD', classification: "Provisioning reminder", recipient: "Subscriber or authorized line user" },
  { id: 'ZNX-EM-ORD-016', name: "eSIM installed", family: 'ORD', classification: "Provisioning notice", recipient: "Subscriber or authorized line user" },
  { id: 'ZNX-EM-ORD-017', name: "eSIM activation failed", family: 'ORD', classification: "Provisioning alert", recipient: "Subscriber or authorized line user" },
  { id: 'ZNX-EM-ORD-018', name: "SIM swap requested", family: 'ORD', classification: "Security transactional", recipient: "Subscriber or account owner" },
  { id: 'ZNX-EM-ORD-019', name: "SIM swap approved", family: 'ORD', classification: "Security transactional", recipient: "Subscriber or account owner" },
  { id: 'ZNX-EM-ORD-020', name: "SIM swap completed", family: 'ORD', classification: "Security notice", recipient: "Subscriber or account owner" },
  { id: 'ZNX-EM-ORD-021', name: "Number port request received", family: 'ORD', classification: "Porting transactional", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-022', name: "Number port scheduled", family: 'ORD', classification: "Porting transactional", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-023', name: "Number port completed", family: 'ORD', classification: "Porting milestone", recipient: "Subscriber or business account contact" },
  { id: 'ZNX-EM-ORD-024', name: "Number port failed", family: 'ORD', classification: "Porting alert", recipient: "Subscriber or business account contact and porting team" },
  // ── USG ────────────────────────────────────────────
  { id: 'ZNX-EM-USG-001', name: "Usage threshold 50 percent", family: 'USG', classification: "Usage notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-002', name: "Usage threshold 75 percent", family: 'USG', classification: "Usage notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-003', name: "Usage threshold 90 percent", family: 'USG', classification: "Usage alert", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-004', name: "Usage threshold 100 percent", family: 'USG', classification: "Usage alert", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-005', name: "Out-of-bundle charging started", family: 'USG', classification: "Charging alert", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-006', name: "Usage anomaly detected", family: 'USG', classification: "Security alert", recipient: "Subscriber or account contact and fraud team" },
  { id: 'ZNX-EM-USG-007', name: "Roaming usage started", family: 'USG', classification: "Roaming notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-008', name: "High roaming usage", family: 'USG', classification: "Roaming alert", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-010', name: "Prepaid balance low", family: 'USG', classification: "Balance notice", recipient: "Prepaid subscriber" },
  { id: 'ZNX-EM-USG-011', name: "Prepaid balance depleted", family: 'USG', classification: "Balance alert", recipient: "Prepaid subscriber" },
  { id: 'ZNX-EM-USG-012', name: "Allowance reset", family: 'USG', classification: "Usage notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-013', name: "Top-up successful", family: 'USG', classification: "Payment transactional", recipient: "Prepaid subscriber or account contact" },
  { id: 'ZNX-EM-USG-014', name: "Top-up failed", family: 'USG', classification: "Payment alert", recipient: "Prepaid subscriber or account contact" },
  { id: 'ZNX-EM-USG-015', name: "Bundle renewed", family: 'USG', classification: "Product transactional", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-USG-016', name: "Bundle renewal failed", family: 'USG', classification: "Product alert", recipient: "Subscriber or account contact" },
  // ── BIL ────────────────────────────────────────────
  { id: 'ZNX-EM-BIL-001', name: "Bill generation started", family: 'BIL', classification: "Operational notice", recipient: "Operator billing operations" },
  { id: 'ZNX-EM-BIL-002', name: "Invoice issued", family: 'BIL', classification: "Billing transactional", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-BIL-003', name: "Invoice available", family: 'BIL', classification: "Billing transactional", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-BIL-004', name: "Zero-balance statement", family: 'BIL', classification: "Billing transactional", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-BIL-005', name: "Invoice corrected", family: 'BIL', classification: "Billing transactional", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-BIL-006', name: "Invoice canceled", family: 'BIL', classification: "Billing notice", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-BIL-007', name: "Credit note issued", family: 'BIL', classification: "Billing transactional", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-BIL-008', name: "Debit note issued", family: 'BIL', classification: "Billing transactional", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-BIL-009', name: "Adjustment requested", family: 'BIL', classification: "Billing workflow", recipient: "Requester and billing operations" },
  { id: 'ZNX-EM-BIL-010', name: "Adjustment approved", family: 'BIL', classification: "Billing workflow", recipient: "Requester and billing operations" },
  { id: 'ZNX-EM-BIL-011', name: "Adjustment rejected", family: 'BIL', classification: "Billing workflow", recipient: "Requester" },
  { id: 'ZNX-EM-BIL-012', name: "Prorated charge applied", family: 'BIL', classification: "Billing notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-BIL-013', name: "One-time charge applied", family: 'BIL', classification: "Billing notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-BIL-014', name: "Recurring charge changed", family: 'BIL', classification: "Billing notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-BIL-015', name: "Tax recalculation completed", family: 'BIL', classification: "Operational notice", recipient: "Billing and tax operations" },
  { id: 'ZNX-EM-BIL-016', name: "Billing cycle changed", family: 'BIL', classification: "Billing notice", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-BIL-017', name: "Consolidated invoice available", family: 'BIL', classification: "Billing transactional", recipient: "Enterprise or group account billing contact" },
  { id: 'ZNX-EM-BIL-018', name: "Multi-entity invoice available", family: 'BIL', classification: "Billing transactional", recipient: "Group finance and entity billing contacts" },
  { id: 'ZNX-EM-BIL-019', name: "Invoice delivery failed", family: 'BIL', classification: "Operational alert", recipient: "Operator billing operations or account owner" },
  { id: 'ZNX-EM-BIL-020', name: "Invoice download ready", family: 'BIL', classification: "Billing transactional", recipient: "Authorized platform user" },
  { id: 'ZNX-EM-BIL-021', name: "Statement ready", family: 'BIL', classification: "Billing transactional", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-BIL-022', name: "Bill-shock review triggered", family: 'BIL', classification: "Customer protection alert", recipient: "Operator customer care and billing assurance" },
  { id: 'ZNX-EM-BIL-023', name: "Bill dispute acknowledged", family: 'BIL', classification: "Billing dispute", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-BIL-024', name: "Bill dispute resolved", family: 'BIL', classification: "Billing dispute", recipient: "Subscriber or account contact" },
  // ── PAY ────────────────────────────────────────────
  { id: 'ZNX-EM-PAY-001', name: "Payment due soon", family: 'PAY', classification: "Payment reminder", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-PAY-002', name: "Payment due today", family: 'PAY', classification: "Payment reminder", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-PAY-003', name: "Payment received", family: 'PAY', classification: "Payment transactional", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-004', name: "Payment pending", family: 'PAY', classification: "Payment transactional", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-005', name: "Payment failed", family: 'PAY', classification: "Payment alert", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-006', name: "Payment retry scheduled", family: 'PAY', classification: "Payment notice", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-007', name: "Payment retry successful", family: 'PAY', classification: "Payment transactional", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-008', name: "Payment retry failed", family: 'PAY', classification: "Payment alert", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-009', name: "Payment method expiring", family: 'PAY', classification: "Payment alert", recipient: "Account billing contact" },
  { id: 'ZNX-EM-PAY-010', name: "Payment method updated", family: 'PAY', classification: "Security notice", recipient: "Account billing contact" },
  { id: 'ZNX-EM-PAY-011', name: "Autopay enabled", family: 'PAY', classification: "Payment transactional", recipient: "Account billing contact" },
  { id: 'ZNX-EM-PAY-012', name: "Autopay disabled", family: 'PAY', classification: "Payment notice", recipient: "Account billing contact" },
  { id: 'ZNX-EM-PAY-013', name: "Autopay upcoming", family: 'PAY', classification: "Payment reminder", recipient: "Account billing contact" },
  { id: 'ZNX-EM-PAY-014', name: "Autopay successful", family: 'PAY', classification: "Payment transactional", recipient: "Account billing contact" },
  { id: 'ZNX-EM-PAY-015', name: "Autopay failed", family: 'PAY', classification: "Payment alert", recipient: "Account billing contact" },
  { id: 'ZNX-EM-PAY-016', name: "Partial payment received", family: 'PAY', classification: "Payment transactional", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-017', name: "Overdue notice one", family: 'PAY', classification: "Collections notice", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-PAY-018', name: "Overdue notice two", family: 'PAY', classification: "Collections escalation", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-PAY-019', name: "Final demand", family: 'PAY', classification: "Collections final", recipient: "Subscriber, enterprise account or partner billing contact" },
  { id: 'ZNX-EM-PAY-020', name: "Service restriction warning", family: 'PAY', classification: "Collections alert", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-PAY-021', name: "Service restricted", family: 'PAY', classification: "Collections critical", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-PAY-022', name: "Promise to pay confirmed", family: 'PAY', classification: "Collections transactional", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-PAY-023', name: "Promise to pay reminder", family: 'PAY', classification: "Collections reminder", recipient: "Subscriber or account contact" },
  { id: 'ZNX-EM-PAY-024', name: "Refund initiated", family: 'PAY', classification: "Refund transactional", recipient: "Payer and account billing contact" },
  { id: 'ZNX-EM-PAY-025', name: "Refund completed", family: 'PAY', classification: "Refund transactional", recipient: "Payer and account billing contact" },
  // ── CMP ────────────────────────────────────────────
  { id: 'ZNX-EM-CMP-001', name: "Terms updated", family: 'CMP', classification: "Legal notice", recipient: "Authorized customer or platform user" },
  { id: 'ZNX-EM-CMP-002', name: "Privacy notice updated", family: 'CMP', classification: "Privacy notice", recipient: "Data subjects and authorized users" },
  { id: 'ZNX-EM-CMP-003', name: "Consent recorded", family: 'CMP', classification: "Privacy transactional", recipient: "Data subject" },
  { id: 'ZNX-EM-CMP-004', name: "Consent changed", family: 'CMP', classification: "Privacy transactional", recipient: "Data subject" },
  { id: 'ZNX-EM-CMP-005', name: "Consent withdrawn", family: 'CMP', classification: "Privacy transactional", recipient: "Data subject" },
  { id: 'ZNX-EM-CMP-006', name: "Data processing agreement ready", family: 'CMP', classification: "Legal workflow", recipient: "Tenant legal and privacy contacts" },
  { id: 'ZNX-EM-CMP-007', name: "Data processing agreement signed", family: 'CMP', classification: "Legal milestone", recipient: "Tenant legal and privacy contacts" },
  { id: 'ZNX-EM-CMP-008', name: "Subprocessor change notice", family: 'CMP', classification: "Privacy notice", recipient: "Tenant privacy and legal contacts" },
  { id: 'ZNX-EM-CMP-009', name: "Data residency change notice", family: 'CMP', classification: "Compliance alert", recipient: "Tenant security, privacy and legal contacts" },
  { id: 'ZNX-EM-CMP-010', name: "Retention period approaching", family: 'CMP', classification: "Governance alert", recipient: "Tenant data governance owner" },
  { id: 'ZNX-EM-CMP-011', name: "Legal hold applied", family: 'CMP', classification: "Legal critical", recipient: "Authorized legal and data governance users" },
  { id: 'ZNX-EM-CMP-012', name: "Regulatory information required", family: 'CMP', classification: "Regulatory workflow", recipient: "Tenant compliance owner" },
  { id: 'ZNX-EM-CMP-013', name: "Regulatory submission accepted", family: 'CMP', classification: "Regulatory notice", recipient: "Tenant compliance owner" },
  { id: 'ZNX-EM-CMP-014', name: "Regulatory submission rejected", family: 'CMP', classification: "Regulatory alert", recipient: "Tenant compliance owner" },
  // ── PAR ────────────────────────────────────────────
  { id: 'ZNX-EM-PAR-001', name: "Partner invitation", family: 'PAR', classification: "Partner transactional", recipient: "Partner user" },
  { id: 'ZNX-EM-PAR-002', name: "Partner onboarding started", family: 'PAR', classification: "Partner transactional", recipient: "Partner sponsor and implementation contacts" },
  { id: 'ZNX-EM-PAR-003', name: "Partner due diligence required", family: 'PAR', classification: "Compliance transactional", recipient: "Partner legal or compliance contact" },
  { id: 'ZNX-EM-PAR-004', name: "Partner approved", family: 'PAR', classification: "Partner milestone", recipient: "Partner sponsor" },
  { id: 'ZNX-EM-PAR-005', name: "Partner rejected", family: 'PAR', classification: "Partner notice", recipient: "Partner sponsor" },
  { id: 'ZNX-EM-PAR-006', name: "Commercial agreement ready", family: 'PAR', classification: "Legal workflow", recipient: "Partner commercial and legal contacts" },
  { id: 'ZNX-EM-PAR-007', name: "Commercial agreement signed", family: 'PAR', classification: "Legal milestone", recipient: "Partner commercial and legal contacts" },
  { id: 'ZNX-EM-PAR-008', name: "Partner credentials ready", family: 'PAR', classification: "Technical transactional", recipient: "Partner technical and finance contacts" },
  { id: 'ZNX-EM-PAR-009', name: "Dealer or reseller account activated", family: 'PAR', classification: "Partner milestone", recipient: "Dealer or reseller administrator" },
  { id: 'ZNX-EM-PAR-010', name: "Commission statement ready", family: 'PAR', classification: "Finance transactional", recipient: "Dealer, reseller or agent finance contact" },
  { id: 'ZNX-EM-PAR-011', name: "Commission adjustment", family: 'PAR', classification: "Finance notice", recipient: "Dealer, reseller or agent finance contact" },
  { id: 'ZNX-EM-PAR-012', name: "Commission payment sent", family: 'PAR', classification: "Finance transactional", recipient: "Dealer, reseller or agent finance contact" },
  { id: 'ZNX-EM-PAR-013', name: "Settlement statement ready", family: 'PAR', classification: "Settlement transactional", recipient: "W holesale or partner finance contact" },
  { id: 'ZNX-EM-PAR-014', name: "Settlement variance detected", family: 'PAR', classification: "Settlement alert", recipient: "Partner and operator finance teams" },
  { id: 'ZNX-EM-PAR-015', name: "Settlement approved", family: 'PAR', classification: "Settlement workflow", recipient: "Partner and operator finance teams" },
  { id: 'ZNX-EM-PAR-016', name: "Wholesale usage file ready", family: 'PAR', classification: "W holesale transactional", recipient: "W holesale operations and finance contacts" },
  { id: 'ZNX-EM-PAR-017', name: "Partner SLA breach", family: 'PAR', classification: "Operational alert", recipient: "Partner and operator service owners" },
  { id: 'ZNX-EM-PAR-018', name: "Partner offboarding completed", family: 'PAR', classification: "Partner transactional", recipient: "Partner sponsor and internal owners" },
  // ── CAT ────────────────────────────────────────────
  { id: 'ZNX-EM-CAT-001', name: "Product created", family: 'CAT', classification: "Product workflow", recipient: "Product owner" },
  { id: 'ZNX-EM-CAT-002', name: "Product approval requested", family: 'CAT', classification: "Product workflow", recipient: "Product approver" },
  { id: 'ZNX-EM-CAT-003', name: "Product approved", family: 'CAT', classification: "Product workflow", recipient: "Product owner" },
  { id: 'ZNX-EM-CAT-004', name: "Product rejected", family: 'CAT', classification: "Product workflow", recipient: "Product owner" },
  { id: 'ZNX-EM-CAT-005', name: "Price plan scheduled", family: 'CAT', classification: "Product notice", recipient: "Product, billing and customer operations" },
  { id: 'ZNX-EM-CAT-006', name: "Price plan live", family: 'CAT', classification: "Product milestone", recipient: "Product, billing and customer operations" },
  { id: 'ZNX-EM-CAT-008', name: "Promotion launched", family: 'CAT', classification: "Product milestone", recipient: "Product, sales and customer operations" },
  { id: 'ZNX-EM-CAT-009', name: "Promotion ending", family: 'CAT', classification: "Customer notice", recipient: "Eligible subscriber or account contact" },
  { id: 'ZNX-EM-CAT-010', name: "Product retired", family: 'CAT', classification: "Product milestone", recipient: "Product, billing and customer operations" },
  // ── API ────────────────────────────────────────────
  { id: 'ZNX-EM-API-001', name: "Developer account invitation", family: 'API', classification: "Developer transactional", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-002', name: "API client created", family: 'API', classification: "Security transactional", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-003', name: "API secret generated", family: 'API', classification: "Security critical", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-004', name: "API secret rotated", family: 'API', classification: "Security notice", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-005', name: "API secret expiring", family: 'API', classification: "Security alert", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-006', name: "Webhook configured", family: 'API', classification: "Developer notice", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-007', name: "Webhook verification failed", family: 'API', classification: "Developer alert", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-008', name: "Webhook delivery failure", family: 'API', classification: "Operational alert", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-009', name: "Webhook delivery recovered", family: 'API', classification: "Operational notice", recipient: "Developer or integration engineer" },
  { id: 'ZNX-EM-API-010', name: "SFTP credentials issued", family: 'API', classification: "Security transactional", recipient: "Integration engineer" },
  { id: 'ZNX-EM-API-011', name: "Batch received", family: 'API', classification: "Integration transactional", recipient: "Integration engineer and data operations" },
  { id: 'ZNX-EM-API-012', name: "Batch validation failed", family: 'API', classification: "Integration alert", recipient: "Integration engineer and data operations" },
  { id: 'ZNX-EM-API-013', name: "Batch processed", family: 'API', classification: "Integration transactional", recipient: "Integration engineer and data operations" },
  { id: 'ZNX-EM-API-014', name: "Schema version deprecation", family: 'API', classification: "Developer governance", recipient: "Developer and technical owner" },
  { id: 'ZNX-EM-API-015', name: "Integration certification started", family: 'API', classification: "Developer workflow", recipient: "Integration team" },
  { id: 'ZNX-EM-API-016', name: "Integration certification passed", family: 'API', classification: "Developer milestone", recipient: "Integration team and sponsor" },
  { id: 'ZNX-EM-API-017', name: "Production API access approved", family: 'API', classification: "Security milestone", recipient: "Integration team and sponsor" },
  { id: 'ZNX-EM-API-018', name: "Integration suspended", family: 'API', classification: "Security critical", recipient: "Integration owner, tenant security and operations" },
  // ── RISK ────────────────────────────────────────────
  { id: 'ZNX-EM-RISK-001', name: "Fraud alert opened", family: 'RISK', classification: "Risk alert", recipient: "Fraud operations" },
  { id: 'ZNX-EM-RISK-002', name: "Suspected account takeover", family: 'RISK', classification: "Security critical", recipient: "Fraud operations and tenant security" },
  { id: 'ZNX-EM-RISK-003', name: "SIM swap risk hold", family: 'RISK', classification: "Risk alert", recipient: "Fraud operations and customer care" },
  { id: 'ZNX-EM-RISK-004', name: "Payment fraud hold", family: 'RISK', classification: "Risk alert", recipient: "Fraud and payment operations" },
  { id: 'ZNX-EM-RISK-005', name: "Identity mismatch", family: 'RISK', classification: "Risk alert", recipient: "Fraud, compliance or customer care" },
  { id: 'ZNX-EM-RISK-006', name: "Unusual usage pattern", family: 'RISK', classification: "Risk alert", recipient: "Fraud and network operations" },
  { id: 'ZNX-EM-RISK-007', name: "Revenue leakage alert", family: 'RISK', classification: "Revenue assurance critical", recipient: "Revenue assurance and billing operations" },
  { id: 'ZNX-EM-RISK-008', name: "Rating variance alert", family: 'RISK', classification: "Revenue assurance alert", recipient: "Rating and revenue assurance teams" },
  { id: 'ZNX-EM-RISK-009', name: "Mediation gap detected", family: 'RISK', classification: "Operational critical", recipient: "Mediation, rating and revenue assurance teams" },
  { id: 'ZNX-EM-RISK-010', name: "Duplicate charge risk", family: 'RISK', classification: "Customer protection alert", recipient: "Billing assurance and customer operations" },
  { id: 'ZNX-EM-RISK-011', name: "Credit limit approaching", family: 'RISK', classification: "Credit notice", recipient: "Subscriber or enterprise account contact" },
  { id: 'ZNX-EM-RISK-012', name: "Credit limit exceeded", family: 'RISK', classification: "Credit alert", recipient: "Subscriber or enterprise account contact and credit control" },
  { id: 'ZNX-EM-RISK-013', name: "Risk case resolved", family: 'RISK', classification: "Risk workflow", recipient: "Risk case participants" },
  { id: 'ZNX-EM-RISK-014', name: "High-risk action approval required", family: 'RISK', classification: "Risk workflow", recipient: "Authorized risk approver" },
  // ── SUP ────────────────────────────────────────────
  { id: 'ZNX-EM-SUP-001', name: "Support case created", family: 'SUP', classification: "Support transactional", recipient: "Requester" },
  { id: 'ZNX-EM-SUP-002', name: "Support case assigned", family: 'SUP', classification: "Support notice", recipient: "Requester and assignee" },
  { id: 'ZNX-EM-SUP-003', name: "Support case updated", family: 'SUP', classification: "Support notice", recipient: "Requester and participants" },
  { id: 'ZNX-EM-SUP-004', name: "Customer action required", family: 'SUP', classification: "Support alert", recipient: "Requester" },
  { id: 'ZNX-EM-SUP-005', name: "Support case escalated", family: 'SUP', classification: "Support escalation", recipient: "Requester and escalation team" },
  { id: 'ZNX-EM-SUP-006', name: "Support case resolved", family: 'SUP', classification: "Support transactional", recipient: "Requester and participants" },
  { id: 'ZNX-EM-SUP-007', name: "Support case closed", family: 'SUP', classification: "Support transactional", recipient: "Requester" },
  { id: 'ZNX-EM-SUP-008', name: "Support satisfaction request", family: 'SUP', classification: "Customer experience", recipient: "Requester" },
  { id: 'ZNX-EM-SUP-009', name: "Planned maintenance notice", family: 'SUP', classification: "Service notice", recipient: "Affected authorized users" },
  { id: 'ZNX-EM-SUP-010', name: "Maintenance reminder", family: 'SUP', classification: "Service notice", recipient: "Affected authorized users" },
  { id: 'ZNX-EM-SUP-011', name: "Maintenance started", family: 'SUP', classification: "Service alert", recipient: "Affected authorized users" },
  { id: 'ZNX-EM-SUP-012', name: "Maintenance completed", family: 'SUP', classification: "Service notice", recipient: "Affected authorized users" },
  { id: 'ZNX-EM-SUP-013', name: "Incident detected", family: 'SUP', classification: "Incident critical", recipient: "Affected tenant contacts" },
  { id: 'ZNX-EM-SUP-014', name: "Incident update", family: 'SUP', classification: "Incident update", recipient: "Affected tenant contacts" },
  { id: 'ZNX-EM-SUP-015', name: "Incident resolved", family: 'SUP', classification: "Incident resolved", recipient: "Affected tenant contacts" },
  { id: 'ZNX-EM-SUP-016', name: "Post-incident report ready", family: 'SUP', classification: "Incident governance", recipient: "Affected tenant service owners" },
  { id: 'ZNX-EM-SUP-017', name: "SLA breach notification", family: 'SUP', classification: "SLA notice", recipient: "Tenant service owner and commercial contact" },
  { id: 'ZNX-EM-SUP-018', name: "Support entitlement expiring", family: 'SUP', classification: "Commercial notice", recipient: "Tenant service owner and commercial contact" },
  // ── OPS ────────────────────────────────────────────
  { id: 'ZNX-EM-OPS-001', name: "Scheduled report ready", family: 'OPS', classification: "Reporting transactional", recipient: "Authorized report recipient" },
  { id: 'ZNX-EM-OPS-002', name: "Data export ready", family: 'OPS', classification: "Reporting transactional", recipient: "Authorized platform user" },
  { id: 'ZNX-EM-OPS-003', name: "Data export failed", family: 'OPS', classification: "Operational alert", recipient: "Authorized platform user and operations" },
  { id: 'ZNX-EM-OPS-004', name: "Reconciliation completed", family: 'OPS', classification: "Finance transactional", recipient: "Finance and operations users" },
  { id: 'ZNX-EM-OPS-005', name: "Reconciliation variance", family: 'OPS', classification: "Finance alert", recipient: "Finance and operations users" },
  { id: 'ZNX-EM-OPS-006', name: "Approval request", family: 'OPS', classification: "W orkflow transactional", recipient: "Authorized approver" },
  { id: 'ZNX-EM-OPS-007', name: "Approval reminder", family: 'OPS', classification: "W orkflow reminder", recipient: "Authorized approver" },
  { id: 'ZNX-EM-OPS-008', name: "Approval completed", family: 'OPS', classification: "W orkflow notice", recipient: "Requester and stakeholders" },
  { id: 'ZNX-EM-OPS-009', name: "Approval rejected", family: 'OPS', classification: "W orkflow notice", recipient: "Requester and stakeholders" },
  { id: 'ZNX-EM-OPS-010', name: "Scheduled job failed", family: 'OPS', classification: "Operational critical", recipient: "Job owner and platform operations" },
  // ── SUB ────────────────────────────────────────────
  { id: 'ZNX-EM-SUB-001', name: "Subscription activated", family: 'SUB', classification: "Commercial transactional", recipient: "Tenant commercial and finance contacts" },
  { id: 'ZNX-EM-SUB-002', name: "Subscription plan changed", family: 'SUB', classification: "Commercial notice", recipient: "Tenant commercial and finance contacts" },
  { id: 'ZNX-EM-SUB-003', name: "Usage overage forecast", family: 'SUB', classification: "Commercial alert", recipient: "Tenant finance and platform owner" },
  { id: 'ZNX-EM-SUB-004', name: "Renewal due in 90 days", family: 'SUB', classification: "Commercial notice", recipient: "Tenant executive, commercial and procurement contacts" },
  { id: 'ZNX-EM-SUB-005', name: "Renewal due in 30 days", family: 'SUB', classification: "Commercial alert", recipient: "Tenant executive, commercial and procurement contacts" },
  { id: 'ZNX-EM-SUB-007', name: "Renewal completed", family: 'SUB', classification: "Commercial milestone", recipient: "Tenant executive, commercial and procurement contacts" },
  { id: 'ZNX-EM-SUB-009', name: "Platform service suspension for nonpayment", family: 'SUB', classification: "Commercial critical", recipient: "Tenant executive, finance and platform owner" },
  { id: 'ZNX-EM-SUB-010', name: "Contract termination confirmed", family: 'SUB', classification: "Commercial legal", recipient: "Tenant executive, commercial, legal and platform owner" },
  // ── NEXA ────────────────────────────────────────────
  { id: 'ZNX-EM-NEXA-001', name: "Nexa enabled", family: 'NEXA', classification: "AI governance notice", recipient: "Tenant platform owner and authorized users" },
  { id: 'ZNX-EM-NEXA-002', name: "Nexa access granted", family: 'NEXA', classification: "AI governance notice", recipient: "Authorized platform user" },
  { id: 'ZNX-EM-NEXA-003', name: "Nexa recommendation ready", family: 'NEXA', classification: "AI advisory", recipient: "Authorized domain user" },
  { id: 'ZNX-EM-NEXA-004', name: "Nexa action approval required", family: 'NEXA', classification: "AI human-in-command", recipient: "Authorized human approver" },
  { id: 'ZNX-EM-NEXA-005', name: "Nexa approved action completed", family: 'NEXA', classification: "AI audit notice", recipient: "Approver and affected stakeholders" },
  { id: 'ZNX-EM-NEXA-006', name: "Nexa action failed", family: 'NEXA', classification: "AI operational alert", recipient: "Approver and operations" },
  { id: 'ZNX-EM-NEXA-007', name: "Nexa policy violation blocked", family: 'NEXA', classification: "AI governance alert", recipient: "Requester, approver and governance owner" },
];

export default function EmailPreviewPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('ZNX-EM-IAM-001');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [currentPayload, setCurrentPayload] = useState<any>(null);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const brand: BrandRendering = {
    display_name: 'ZoikoNex Telecom',
    logo_url: 'https://react.email/static/logo-v.png',
    primary_color: '#4f46e5',
  };

  const sender: SenderRendering = {
    from_name: 'ZoikoNex Platform Operations',
    reply_to: 'support@zoikonex.example',
  };

  const support: SupportRendering = {
    url: 'https://support.zoikonex.example',
  };

  const currentTemplate = TEMPLATE_REGISTRY.find(t => t.id === selectedTemplateId) || TEMPLATE_REGISTRY[0];

  useEffect(() => {
    startTransition(async () => {
      const result = await renderPreviewEmail(selectedTemplateId, brand, sender, support);
      if (result.success && result.html) {
        setRenderedHtml(result.html);
        setCurrentPayload(result.payload);
      }
    });
  }, [selectedTemplateId]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Sidebar for Template Selection */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 flex flex-col h-full overflow-y-auto shrink-0">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Communications</h1>
          <p className="text-xs text-gray-500 mt-1">290-Template Baseline Explorer</p>
        </div>
        
        <div className="space-y-6">
          {Array.from(new Set(TEMPLATE_REGISTRY.map(t => t.family))).map(family => (
            <div key={family}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Family: {family}
              </h2>
              <ul className="space-y-1">
                {TEMPLATE_REGISTRY.filter(t => t.family === family).map(template => (
                  <li key={template.id}>
                    <button
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        selectedTemplateId === template.id
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{template.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono ml-2 shrink-0">{template.id.split('-').pop()}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200">
                {currentTemplate.id}
              </span>
              <h2 className="text-lg font-bold text-gray-900">{currentTemplate.name}</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Class: <span className="font-medium text-gray-700">{currentTemplate.classification}</span> &bull; Recipient: <span className="font-medium text-gray-700">{currentTemplate.recipient}</span>
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {isPending && <span className="text-xs text-indigo-600 animate-pulse font-medium">Rendering...</span>}
            <button
              onClick={() => setShowJsonModal(true)}
              className="px-3.5 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
            >
              View JSON Payload
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto flex justify-center bg-gray-100">
          <div className="w-[750px] h-[820px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <iframe 
              srcDoc={renderedHtml} 
              className="w-full h-full border-0" 
              title="Canonical Email Live Preview"
            />
          </div>
        </main>
      </div>

      {/* JSON Payload Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-base font-bold text-gray-900">Canonical Contract Payload</h3>
                <p className="text-xs text-gray-500 mt-0.5">{currentTemplate.id} — Mandatory Contract Compliance</p>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="my-4 flex-1 overflow-y-auto bg-gray-900 text-emerald-400 p-4 rounded-lg font-mono text-xs leading-relaxed">
              <pre>{JSON.stringify(currentPayload, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-md hover:bg-gray-800"
              >
                Close Payload Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
