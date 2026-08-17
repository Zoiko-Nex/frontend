"use server";
import React from 'react';
import { render } from '@react-email/render';
import { CanonicalEmailPayload } from '../../emails/types/CanonicalEmail';
// ── COM ──
import DemoRequestReceivedEmail from '../../emails/templates/COM/DemoRequestReceived';
import DemoBookedEmail from '../../emails/templates/COM/DemoBooked';
import DemoReminderEmail from '../../emails/templates/COM/DemoReminder';
import DemoRescheduledEmail from '../../emails/templates/COM/DemoRescheduled';
import DemoCanceledEmail from '../../emails/templates/COM/DemoCanceled';
import SandboxRequestReceivedEmail from '../../emails/templates/COM/SandboxRequestReceived';
import SandboxApprovedEmail from '../../emails/templates/COM/SandboxApproved';
import SandboxExpiringEmail from '../../emails/templates/COM/SandboxExpiring';
import TrialStartedEmail from '../../emails/templates/COM/TrialStarted';
import TrialEndingEmail from '../../emails/templates/COM/TrialEnding';
import TrialExpiredEmail from '../../emails/templates/COM/TrialExpired';
import ProposalSharedEmail from '../../emails/templates/COM/ProposalShared';
import ProposalExpiringEmail from '../../emails/templates/COM/ProposalExpiring';

// ── IAM ──
import UserInvitationEmail from '../../emails/templates/IAM/UserInvitation';
import InvitationReminderEmail from '../../emails/templates/IAM/InvitationReminder';
import InvitationExpiredEmail from '../../emails/templates/IAM/InvitationExpired';
import AccountCreatedEmail from '../../emails/templates/IAM/AccountCreated';
import EmailVerificationEmail from '../../emails/templates/IAM/EmailVerification';
import EmailVerificationReminderEmail from '../../emails/templates/IAM/EmailVerificationReminder';
import PasswordCreatedEmail from '../../emails/templates/IAM/PasswordCreated';
import PasswordResetRequestedEmail from '../../emails/templates/IAM/PasswordResetRequested';
import PasswordChangedEmail from '../../emails/templates/IAM/PasswordChanged';
import MfaEnrollmentRequiredEmail from '../../emails/templates/IAM/MfaEnrollmentRequired';
import MfaEnabledEmail from '../../emails/templates/IAM/MfaEnabled';
import MfaDisabledEmail from '../../emails/templates/IAM/MfaDisabled';
import MfaRecoveryCodesRegeneratedEmail from '../../emails/templates/IAM/MfaRecoveryCodesRegenerated';
import NewDeviceSignInEmail from '../../emails/templates/IAM/NewDeviceSignIn';
import SuspiciousSignInBlockedEmail from '../../emails/templates/IAM/SuspiciousSignInBlocked';
import AccountLockedEmail from '../../emails/templates/IAM/AccountLocked';
import AccountUnlockedEmail from '../../emails/templates/IAM/AccountUnlocked';
import SessionsOrAccessRevokedEmail from '../../emails/templates/IAM/SessionsOrAccessRevoked';

// ── RBAC ──
import RoleAssignedEmail from '../../emails/templates/RBAC/RoleAssigned';
import RoleChangedEmail from '../../emails/templates/RBAC/RoleChanged';
import ElevatedAccessRequestedEmail from '../../emails/templates/RBAC/ElevatedAccessRequested';
import ElevatedAccessApprovedEmail from '../../emails/templates/RBAC/ElevatedAccessApproved';
import ElevatedAccessDeniedEmail from '../../emails/templates/RBAC/ElevatedAccessDenied';
import ElevatedAccessExpiringEmail from '../../emails/templates/RBAC/ElevatedAccessExpiring';
import PrivilegedAccessUsedEmail from '../../emails/templates/RBAC/PrivilegedAccessUsed';
import UserChangeApprovalRequiredEmail from '../../emails/templates/RBAC/UserChangeApprovalRequired';
import InactiveUserReviewEmail from '../../emails/templates/RBAC/InactiveUserReview';
import UserDeactivatedEmail from '../../emails/templates/RBAC/UserDeactivated';

// ── CRM ──
import SubscriberWelcomeEmail from '../../emails/templates/CRM/SubscriberWelcome';
import SubscriberEmailVerificationEmail from '../../emails/templates/CRM/SubscriberEmailVerification';
import CustomerProfileUpdatedEmail from '../../emails/templates/CRM/CustomerProfileUpdated';
import AccountOwnershipTransferCompletedEmail from '../../emails/templates/CRM/AccountOwnershipTransferCompleted';
import AccountMergeRequestedEmail from '../../emails/templates/CRM/AccountMergeRequested';
import AccountMergeCompletedEmail from '../../emails/templates/CRM/AccountMergeCompleted';
import IdentityInformationRequiredEmail from '../../emails/templates/CRM/IdentityInformationRequired';
import IdentityVerificationApprovedEmail from '../../emails/templates/CRM/IdentityVerificationApproved';
import IdentityVerificationRejectedEmail from '../../emails/templates/CRM/IdentityVerificationRejected';
import CustomerStatusChangedEmail from '../../emails/templates/CRM/CustomerStatusChanged';
import AccountReactivatedEmail from '../../emails/templates/CRM/AccountReactivated';
import AccountClosureRequestedEmail from '../../emails/templates/CRM/AccountClosureRequested';
import AccountClosureScheduledEmail from '../../emails/templates/CRM/AccountClosureScheduled';
import AccountClosedEmail from '../../emails/templates/CRM/AccountClosed';
import PersonalDataExportReadyEmail from '../../emails/templates/CRM/PersonalDataExportReady';
import DataCorrectionCompletedEmail from '../../emails/templates/CRM/DataCorrectionCompleted';
import ComplaintAcknowledgedEmail from '../../emails/templates/CRM/ComplaintAcknowledged';
import ComplaintResolvedEmail from '../../emails/templates/CRM/ComplaintResolved';

// ── BIL ──
import BillGenerationStartedEmail from '../../emails/templates/BIL/BillGenerationStarted';
import InvoiceIssuedEmail from '../../emails/templates/BIL/InvoiceIssued';
import InvoiceAvailableEmail from '../../emails/templates/BIL/InvoiceAvailable';
import ZeroBalanceStatementEmail from '../../emails/templates/BIL/ZeroBalanceStatement';
import InvoiceCorrectedEmail from '../../emails/templates/BIL/InvoiceCorrected';
import InvoiceCanceledEmail from '../../emails/templates/BIL/InvoiceCanceled';
import CreditNoteIssuedEmail from '../../emails/templates/BIL/CreditNoteIssued';
import DebitNoteIssuedEmail from '../../emails/templates/BIL/DebitNoteIssued';
import AdjustmentRequestedEmail from '../../emails/templates/BIL/AdjustmentRequested';
import AdjustmentApprovedEmail from '../../emails/templates/BIL/AdjustmentApproved';
import AdjustmentRejectedEmail from '../../emails/templates/BIL/AdjustmentRejected';
import ProratedChargeAppliedEmail from '../../emails/templates/BIL/ProratedChargeApplied';
import OneTimeChargeAppliedEmail from '../../emails/templates/BIL/OneTimeChargeApplied';
import RecurringChargeChangedEmail from '../../emails/templates/BIL/RecurringChargeChanged';
import TaxRecalculationCompletedEmail from '../../emails/templates/BIL/TaxRecalculationCompleted';
import BillingCycleChangedEmail from '../../emails/templates/BIL/BillingCycleChanged';
import ConsolidatedInvoiceAvailableEmail from '../../emails/templates/BIL/ConsolidatedInvoiceAvailable';
import MultiEntityInvoiceAvailableEmail from '../../emails/templates/BIL/MultiEntityInvoiceAvailable';
import InvoiceDeliveryFailedEmail from '../../emails/templates/BIL/InvoiceDeliveryFailed';
import InvoiceDownloadReadyEmail from '../../emails/templates/BIL/InvoiceDownloadReady';
import StatementReadyEmail from '../../emails/templates/BIL/StatementReady';
import BillShockReviewTriggeredEmail from '../../emails/templates/BIL/BillShockReviewTriggered';
import BillDisputeAcknowledgedEmail from '../../emails/templates/BIL/BillDisputeAcknowledged';
import BillDisputeResolvedEmail from '../../emails/templates/BIL/BillDisputeResolved';

// ── PAY ──
import PaymentDueSoonEmail from '../../emails/templates/PAY/PaymentDueSoon';
import PaymentDueTodayEmail from '../../emails/templates/PAY/PaymentDueToday';
import PaymentReceivedEmail from '../../emails/templates/PAY/PaymentReceived';
import PaymentPendingEmail from '../../emails/templates/PAY/PaymentPending';
import PaymentFailedEmail from '../../emails/templates/PAY/PaymentFailed';
import PaymentRetryScheduledEmail from '../../emails/templates/PAY/PaymentRetryScheduled';
import PaymentRetrySuccessfulEmail from '../../emails/templates/PAY/PaymentRetrySuccessful';
import PaymentRetryFailedEmail from '../../emails/templates/PAY/PaymentRetryFailed';
import PaymentMethodExpiringEmail from '../../emails/templates/PAY/PaymentMethodExpiring';
import PaymentMethodUpdatedEmail from '../../emails/templates/PAY/PaymentMethodUpdated';
import AutopayEnabledEmail from '../../emails/templates/PAY/AutopayEnabled';
import AutopayDisabledEmail from '../../emails/templates/PAY/AutopayDisabled';
import AutopayUpcomingEmail from '../../emails/templates/PAY/AutopayUpcoming';
import AutopaySuccessfulEmail from '../../emails/templates/PAY/AutopaySuccessful';
import AutopayFailedEmail from '../../emails/templates/PAY/AutopayFailed';
import PartialPaymentReceivedEmail from '../../emails/templates/PAY/PartialPaymentReceived';
import OverdueNoticeOneEmail from '../../emails/templates/PAY/OverdueNoticeOne';
import OverdueNoticeTwoEmail from '../../emails/templates/PAY/OverdueNoticeTwo';
import FinalDemandEmail from '../../emails/templates/PAY/FinalDemand';
import ServiceRestrictionWarningEmail from '../../emails/templates/PAY/ServiceRestrictionWarning';
import ServiceRestrictedEmail from '../../emails/templates/PAY/ServiceRestricted';
import PromiseToPayConfirmedEmail from '../../emails/templates/PAY/PromiseToPayConfirmed';
import PromiseToPayReminderEmail from '../../emails/templates/PAY/PromiseToPayReminder';
import RefundInitiatedEmail from '../../emails/templates/PAY/RefundInitiated';
import RefundCompletedEmail from '../../emails/templates/PAY/RefundCompleted';

// ── CMP ──
import TermsUpdatedEmail from '../../emails/templates/CMP/TermsUpdated';
import PrivacyNoticeUpdatedEmail from '../../emails/templates/CMP/PrivacyNoticeUpdated';
import ConsentRecordedEmail from '../../emails/templates/CMP/ConsentRecorded';
import ConsentChangedEmail from '../../emails/templates/CMP/ConsentChanged';
import ConsentWithdrawnEmail from '../../emails/templates/CMP/ConsentWithdrawn';
import DataProcessingAgreementReadyEmail from '../../emails/templates/CMP/DataProcessingAgreementReady';
import DataProcessingAgreementSignedEmail from '../../emails/templates/CMP/DataProcessingAgreementSigned';
import SubprocessorChangeNoticeEmail from '../../emails/templates/CMP/SubprocessorChangeNotice';
import DataResidencyChangeNoticeEmail from '../../emails/templates/CMP/DataResidencyChangeNotice';
import RetentionPeriodApproachingEmail from '../../emails/templates/CMP/RetentionPeriodApproaching';
import LegalHoldAppliedEmail from '../../emails/templates/CMP/LegalHoldApplied';
import RegulatoryInformationRequiredEmail from '../../emails/templates/CMP/RegulatoryInformationRequired';
import RegulatorySubmissionAcceptedEmail from '../../emails/templates/CMP/RegulatorySubmissionAccepted';
import RegulatorySubmissionRejectedEmail from '../../emails/templates/CMP/RegulatorySubmissionRejected';

// ── PAR ──
import PartnerInvitationEmail from '../../emails/templates/PAR/PartnerInvitation';
import PartnerOnboardingStartedEmail from '../../emails/templates/PAR/PartnerOnboardingStarted';
import PartnerDueDiligenceRequiredEmail from '../../emails/templates/PAR/PartnerDueDiligenceRequired';
import PartnerApprovedEmail from '../../emails/templates/PAR/PartnerApproved';
import PartnerRejectedEmail from '../../emails/templates/PAR/PartnerRejected';
import CommercialAgreementReadyEmail from '../../emails/templates/PAR/CommercialAgreementReady';
import CommercialAgreementSignedEmail from '../../emails/templates/PAR/CommercialAgreementSigned';
import PartnerCredentialsReadyEmail from '../../emails/templates/PAR/PartnerCredentialsReady';
import DealerOrResellerAccountActivatedEmail from '../../emails/templates/PAR/DealerOrResellerAccountActivated';
import CommissionStatementReadyEmail from '../../emails/templates/PAR/CommissionStatementReady';
import CommissionAdjustmentEmail from '../../emails/templates/PAR/CommissionAdjustment';
import CommissionPaymentSentEmail from '../../emails/templates/PAR/CommissionPaymentSent';
import SettlementStatementReadyEmail from '../../emails/templates/PAR/SettlementStatementReady';
import SettlementVarianceDetectedEmail from '../../emails/templates/PAR/SettlementVarianceDetected';
import SettlementApprovedEmail from '../../emails/templates/PAR/SettlementApproved';
import WholesaleUsageFileReadyEmail from '../../emails/templates/PAR/WholesaleUsageFileReady';
import PartnerSlaBreachEmail from '../../emails/templates/PAR/PartnerSlaBreach';
import PartnerOffboardingCompletedEmail from '../../emails/templates/PAR/PartnerOffboardingCompleted';

// ── CAT ──
import ProductCreatedEmail from '../../emails/templates/CAT/ProductCreated';
import ProductApprovalRequestedEmail from '../../emails/templates/CAT/ProductApprovalRequested';
import ProductApprovedEmail from '../../emails/templates/CAT/ProductApproved';
import ProductRejectedEmail from '../../emails/templates/CAT/ProductRejected';
import PricePlanScheduledEmail from '../../emails/templates/CAT/PricePlanScheduled';
import PricePlanLiveEmail from '../../emails/templates/CAT/PricePlanLive';
import PromotionLaunchedEmail from '../../emails/templates/CAT/PromotionLaunched';
import PromotionEndingEmail from '../../emails/templates/CAT/PromotionEnding';
import ProductRetiredEmail from '../../emails/templates/CAT/ProductRetired';

// ── API ──
import DeveloperAccountInvitationEmail from '../../emails/templates/API/DeveloperAccountInvitation';
import ApiClientCreatedEmail from '../../emails/templates/API/ApiClientCreated';
import ApiSecretGeneratedEmail from '../../emails/templates/API/ApiSecretGenerated';
import ApiSecretRotatedEmail from '../../emails/templates/API/ApiSecretRotated';
import ApiSecretExpiringEmail from '../../emails/templates/API/ApiSecretExpiring';
import WebhookConfiguredEmail from '../../emails/templates/API/WebhookConfigured';
import WebhookVerificationFailedEmail from '../../emails/templates/API/WebhookVerificationFailed';
import WebhookDeliveryFailureEmail from '../../emails/templates/API/WebhookDeliveryFailure';
import WebhookDeliveryRecoveredEmail from '../../emails/templates/API/WebhookDeliveryRecovered';
import SftpCredentialsIssuedEmail from '../../emails/templates/API/SftpCredentialsIssued';
import BatchReceivedEmail from '../../emails/templates/API/BatchReceived';
import BatchValidationFailedEmail from '../../emails/templates/API/BatchValidationFailed';
import BatchProcessedEmail from '../../emails/templates/API/BatchProcessed';
import SchemaVersionDeprecationEmail from '../../emails/templates/API/SchemaVersionDeprecation';
import IntegrationCertificationStartedEmail from '../../emails/templates/API/IntegrationCertificationStarted';
import IntegrationCertificationPassedEmail from '../../emails/templates/API/IntegrationCertificationPassed';
import ProductionApiAccessApprovedEmail from '../../emails/templates/API/ProductionApiAccessApproved';
import IntegrationSuspendedEmail from '../../emails/templates/API/IntegrationSuspended';

// ── RISK ──
import FraudAlertOpenedEmail from '../../emails/templates/RISK/FraudAlertOpened';
import SuspectedAccountTakeoverEmail from '../../emails/templates/RISK/SuspectedAccountTakeover';
import SimSwapRiskHoldEmail from '../../emails/templates/RISK/SimSwapRiskHold';
import PaymentFraudHoldEmail from '../../emails/templates/RISK/PaymentFraudHold';
import IdentityMismatchEmail from '../../emails/templates/RISK/IdentityMismatch';
import UnusualUsagePatternEmail from '../../emails/templates/RISK/UnusualUsagePattern';
import RevenueLeakageAlertEmail from '../../emails/templates/RISK/RevenueLeakageAlert';
import RatingVarianceAlertEmail from '../../emails/templates/RISK/RatingVarianceAlert';
import MediationGapDetectedEmail from '../../emails/templates/RISK/MediationGapDetected';
import DuplicateChargeRiskEmail from '../../emails/templates/RISK/DuplicateChargeRisk';
import CreditLimitApproachingEmail from '../../emails/templates/RISK/CreditLimitApproaching';
import CreditLimitExceededEmail from '../../emails/templates/RISK/CreditLimitExceeded';
import RiskCaseResolvedEmail from '../../emails/templates/RISK/RiskCaseResolved';
import HighRiskActionApprovalRequiredEmail from '../../emails/templates/RISK/HighRiskActionApprovalRequired';

// ── OPS ──
import ScheduledReportReadyEmail from '../../emails/templates/OPS/ScheduledReportReady';
import DataExportReadyEmail from '../../emails/templates/OPS/DataExportReady';
import DataExportFailedEmail from '../../emails/templates/OPS/DataExportFailed';
import ReconciliationCompletedEmail from '../../emails/templates/OPS/ReconciliationCompleted';
import ReconciliationVarianceEmail from '../../emails/templates/OPS/ReconciliationVariance';
import ApprovalRequestEmail from '../../emails/templates/OPS/ApprovalRequest';
import ApprovalReminderEmail from '../../emails/templates/OPS/ApprovalReminder';
import ApprovalCompletedEmail from '../../emails/templates/OPS/ApprovalCompleted';
import ApprovalRejectedEmail from '../../emails/templates/OPS/ApprovalRejected';
import ScheduledJobFailedEmail from '../../emails/templates/OPS/ScheduledJobFailed';

// ── SUB ──
import SubscriptionActivatedEmail from '../../emails/templates/SUB/SubscriptionActivated';
import SubscriptionPlanChangedEmail from '../../emails/templates/SUB/SubscriptionPlanChanged';
import UsageOverageForecastEmail from '../../emails/templates/SUB/UsageOverageForecast';
import RenewalDueIn90DaysEmail from '../../emails/templates/SUB/RenewalDueIn90Days';
import RenewalDueIn30DaysEmail from '../../emails/templates/SUB/RenewalDueIn30Days';
import RenewalCompletedEmail from '../../emails/templates/SUB/RenewalCompleted';
import PlatformServiceSuspensionForNonpaymentEmail from '../../emails/templates/SUB/PlatformServiceSuspensionForNonpayment';
import ContractTerminationConfirmedEmail from '../../emails/templates/SUB/ContractTerminationConfirmed';

// ── NEXA ──
import NexaEnabledEmail from '../../emails/templates/NEXA/NexaEnabled';
import NexaAccessGrantedEmail from '../../emails/templates/NEXA/NexaAccessGranted';
import NexaRecommendationReadyEmail from '../../emails/templates/NEXA/NexaRecommendationReady';
import NexaActionApprovalRequiredEmail from '../../emails/templates/NEXA/NexaActionApprovalRequired';
import NexaApprovedActionCompletedEmail from '../../emails/templates/NEXA/NexaApprovedActionCompleted';
import NexaActionFailedEmail from '../../emails/templates/NEXA/NexaActionFailed';
import NexaPolicyViolationBlockedEmail from '../../emails/templates/NEXA/NexaPolicyViolationBlocked';


// Default fallback
import { Text } from '@react-email/components';

function getPreviewEmailComponent(templateId: string, payload: CanonicalEmailPayload): React.ReactElement | null {
  let element: React.ReactElement | null = null;

  switch (templateId) {
    // ── COM ──
    case 'ZNX-EM-COM-001': element = React.createElement(DemoRequestReceivedEmail, { payload }); break;
    case 'ZNX-EM-COM-002': element = React.createElement(DemoBookedEmail, { payload }); break;
    case 'ZNX-EM-COM-003': element = React.createElement(DemoReminderEmail, { payload }); break;
    case 'ZNX-EM-COM-004': element = React.createElement(DemoRescheduledEmail, { payload }); break;
    case 'ZNX-EM-COM-005': element = React.createElement(DemoCanceledEmail, { payload }); break;
    case 'ZNX-EM-COM-006': element = React.createElement(SandboxRequestReceivedEmail, { payload }); break;
    case 'ZNX-EM-COM-007': element = React.createElement(SandboxApprovedEmail, { payload }); break;
    case 'ZNX-EM-COM-008': element = React.createElement(SandboxExpiringEmail, { payload }); break;
    case 'ZNX-EM-COM-009': element = React.createElement(TrialStartedEmail, { payload }); break;
    case 'ZNX-EM-COM-010': element = React.createElement(TrialEndingEmail, { payload }); break;
    case 'ZNX-EM-COM-011': element = React.createElement(TrialExpiredEmail, { payload }); break;
    case 'ZNX-EM-COM-012': element = React.createElement(ProposalSharedEmail, { payload }); break;
    case 'ZNX-EM-COM-013': element = React.createElement(ProposalExpiringEmail, { payload }); break;
    // ── IAM ──
    case 'ZNX-EM-IAM-001': element = React.createElement(UserInvitationEmail, { payload }); break;
    case 'ZNX-EM-IAM-002': element = React.createElement(InvitationReminderEmail, { payload }); break;
    case 'ZNX-EM-IAM-003': element = React.createElement(InvitationExpiredEmail, { payload }); break;
    case 'ZNX-EM-IAM-004': element = React.createElement(AccountCreatedEmail, { payload }); break;
    case 'ZNX-EM-IAM-005': element = React.createElement(EmailVerificationEmail, { payload }); break;
    case 'ZNX-EM-IAM-006': element = React.createElement(EmailVerificationReminderEmail, { payload }); break;
    case 'ZNX-EM-IAM-007': element = React.createElement(PasswordCreatedEmail, { payload }); break;
    case 'ZNX-EM-IAM-008': element = React.createElement(PasswordResetRequestedEmail, { payload }); break;
    case 'ZNX-EM-IAM-009': element = React.createElement(PasswordChangedEmail, { payload }); break;
    case 'ZNX-EM-IAM-010': element = React.createElement(MfaEnrollmentRequiredEmail, { payload }); break;
    case 'ZNX-EM-IAM-011': element = React.createElement(MfaEnabledEmail, { payload }); break;
    case 'ZNX-EM-IAM-012': element = React.createElement(MfaDisabledEmail, { payload }); break;
    case 'ZNX-EM-IAM-013': element = React.createElement(MfaRecoveryCodesRegeneratedEmail, { payload }); break;
    case 'ZNX-EM-IAM-014': element = React.createElement(NewDeviceSignInEmail, { payload }); break;
    case 'ZNX-EM-IAM-015': element = React.createElement(SuspiciousSignInBlockedEmail, { payload }); break;
    case 'ZNX-EM-IAM-016': element = React.createElement(AccountLockedEmail, { payload }); break;
    case 'ZNX-EM-IAM-017': element = React.createElement(AccountUnlockedEmail, { payload }); break;
    case 'ZNX-EM-IAM-018': element = React.createElement(SessionsOrAccessRevokedEmail, { payload }); break;
    // ── RBAC ──
    case 'ZNX-EM-RBAC-001': element = React.createElement(RoleAssignedEmail, { payload }); break;
    case 'ZNX-EM-RBAC-002': element = React.createElement(RoleChangedEmail, { payload }); break;
    case 'ZNX-EM-RBAC-003': element = React.createElement(ElevatedAccessRequestedEmail, { payload }); break;
    case 'ZNX-EM-RBAC-004': element = React.createElement(ElevatedAccessApprovedEmail, { payload }); break;
    case 'ZNX-EM-RBAC-005': element = React.createElement(ElevatedAccessDeniedEmail, { payload }); break;
    case 'ZNX-EM-RBAC-006': element = React.createElement(ElevatedAccessExpiringEmail, { payload }); break;
    case 'ZNX-EM-RBAC-007': element = React.createElement(PrivilegedAccessUsedEmail, { payload }); break;
    case 'ZNX-EM-RBAC-008': element = React.createElement(UserChangeApprovalRequiredEmail, { payload }); break;
    case 'ZNX-EM-RBAC-009': element = React.createElement(InactiveUserReviewEmail, { payload }); break;
    case 'ZNX-EM-RBAC-010': element = React.createElement(UserDeactivatedEmail, { payload }); break;
    // ── CRM ──
    case 'ZNX-EM-CRM-001': element = React.createElement(SubscriberWelcomeEmail, { payload }); break;
    case 'ZNX-EM-CRM-002': element = React.createElement(SubscriberEmailVerificationEmail, { payload }); break;
    case 'ZNX-EM-CRM-003': element = React.createElement(CustomerProfileUpdatedEmail, { payload }); break;
    case 'ZNX-EM-CRM-006': element = React.createElement(AccountOwnershipTransferCompletedEmail, { payload }); break;
    case 'ZNX-EM-CRM-007': element = React.createElement(AccountMergeRequestedEmail, { payload }); break;
    case 'ZNX-EM-CRM-008': element = React.createElement(AccountMergeCompletedEmail, { payload }); break;
    case 'ZNX-EM-CRM-009': element = React.createElement(IdentityInformationRequiredEmail, { payload }); break;
    case 'ZNX-EM-CRM-010': element = React.createElement(IdentityVerificationApprovedEmail, { payload }); break;
    case 'ZNX-EM-CRM-011': element = React.createElement(IdentityVerificationRejectedEmail, { payload }); break;
    case 'ZNX-EM-CRM-012': element = React.createElement(CustomerStatusChangedEmail, { payload }); break;
    case 'ZNX-EM-CRM-013': element = React.createElement(AccountReactivatedEmail, { payload }); break;
    case 'ZNX-EM-CRM-014': element = React.createElement(AccountClosureRequestedEmail, { payload }); break;
    case 'ZNX-EM-CRM-015': element = React.createElement(AccountClosureScheduledEmail, { payload }); break;
    case 'ZNX-EM-CRM-016': element = React.createElement(AccountClosedEmail, { payload }); break;
    case 'ZNX-EM-CRM-017': element = React.createElement(PersonalDataExportReadyEmail, { payload }); break;
    case 'ZNX-EM-CRM-018': element = React.createElement(DataCorrectionCompletedEmail, { payload }); break;
    case 'ZNX-EM-CRM-019': element = React.createElement(ComplaintAcknowledgedEmail, { payload }); break;
    case 'ZNX-EM-CRM-020': element = React.createElement(ComplaintResolvedEmail, { payload }); break;
    // ── BIL ──
    case 'ZNX-EM-BIL-001': element = React.createElement(BillGenerationStartedEmail, { payload }); break;
    case 'ZNX-EM-BIL-002': element = React.createElement(InvoiceIssuedEmail, { payload }); break;
    case 'ZNX-EM-BIL-003': element = React.createElement(InvoiceAvailableEmail, { payload }); break;
    case 'ZNX-EM-BIL-004': element = React.createElement(ZeroBalanceStatementEmail, { payload }); break;
    case 'ZNX-EM-BIL-005': element = React.createElement(InvoiceCorrectedEmail, { payload }); break;
    case 'ZNX-EM-BIL-006': element = React.createElement(InvoiceCanceledEmail, { payload }); break;
    case 'ZNX-EM-BIL-007': element = React.createElement(CreditNoteIssuedEmail, { payload }); break;
    case 'ZNX-EM-BIL-008': element = React.createElement(DebitNoteIssuedEmail, { payload }); break;
    case 'ZNX-EM-BIL-009': element = React.createElement(AdjustmentRequestedEmail, { payload }); break;
    case 'ZNX-EM-BIL-010': element = React.createElement(AdjustmentApprovedEmail, { payload }); break;
    case 'ZNX-EM-BIL-011': element = React.createElement(AdjustmentRejectedEmail, { payload }); break;
    case 'ZNX-EM-BIL-012': element = React.createElement(ProratedChargeAppliedEmail, { payload }); break;
    case 'ZNX-EM-BIL-013': element = React.createElement(OneTimeChargeAppliedEmail, { payload }); break;
    case 'ZNX-EM-BIL-014': element = React.createElement(RecurringChargeChangedEmail, { payload }); break;
    case 'ZNX-EM-BIL-015': element = React.createElement(TaxRecalculationCompletedEmail, { payload }); break;
    case 'ZNX-EM-BIL-016': element = React.createElement(BillingCycleChangedEmail, { payload }); break;
    case 'ZNX-EM-BIL-017': element = React.createElement(ConsolidatedInvoiceAvailableEmail, { payload }); break;
    case 'ZNX-EM-BIL-018': element = React.createElement(MultiEntityInvoiceAvailableEmail, { payload }); break;
    case 'ZNX-EM-BIL-019': element = React.createElement(InvoiceDeliveryFailedEmail, { payload }); break;
    case 'ZNX-EM-BIL-020': element = React.createElement(InvoiceDownloadReadyEmail, { payload }); break;
    case 'ZNX-EM-BIL-021': element = React.createElement(StatementReadyEmail, { payload }); break;
    case 'ZNX-EM-BIL-022': element = React.createElement(BillShockReviewTriggeredEmail, { payload }); break;
    case 'ZNX-EM-BIL-023': element = React.createElement(BillDisputeAcknowledgedEmail, { payload }); break;
    case 'ZNX-EM-BIL-024': element = React.createElement(BillDisputeResolvedEmail, { payload }); break;
    // ── PAY ──
    case 'ZNX-EM-PAY-001': element = React.createElement(PaymentDueSoonEmail, { payload }); break;
    case 'ZNX-EM-PAY-002': element = React.createElement(PaymentDueTodayEmail, { payload }); break;
    case 'ZNX-EM-PAY-003': element = React.createElement(PaymentReceivedEmail, { payload }); break;
    case 'ZNX-EM-PAY-004': element = React.createElement(PaymentPendingEmail, { payload }); break;
    case 'ZNX-EM-PAY-005': element = React.createElement(PaymentFailedEmail, { payload }); break;
    case 'ZNX-EM-PAY-006': element = React.createElement(PaymentRetryScheduledEmail, { payload }); break;
    case 'ZNX-EM-PAY-007': element = React.createElement(PaymentRetrySuccessfulEmail, { payload }); break;
    case 'ZNX-EM-PAY-008': element = React.createElement(PaymentRetryFailedEmail, { payload }); break;
    case 'ZNX-EM-PAY-009': element = React.createElement(PaymentMethodExpiringEmail, { payload }); break;
    case 'ZNX-EM-PAY-010': element = React.createElement(PaymentMethodUpdatedEmail, { payload }); break;
    case 'ZNX-EM-PAY-011': element = React.createElement(AutopayEnabledEmail, { payload }); break;
    case 'ZNX-EM-PAY-012': element = React.createElement(AutopayDisabledEmail, { payload }); break;
    case 'ZNX-EM-PAY-013': element = React.createElement(AutopayUpcomingEmail, { payload }); break;
    case 'ZNX-EM-PAY-014': element = React.createElement(AutopaySuccessfulEmail, { payload }); break;
    case 'ZNX-EM-PAY-015': element = React.createElement(AutopayFailedEmail, { payload }); break;
    case 'ZNX-EM-PAY-016': element = React.createElement(PartialPaymentReceivedEmail, { payload }); break;
    case 'ZNX-EM-PAY-017': element = React.createElement(OverdueNoticeOneEmail, { payload }); break;
    case 'ZNX-EM-PAY-018': element = React.createElement(OverdueNoticeTwoEmail, { payload }); break;
    case 'ZNX-EM-PAY-019': element = React.createElement(FinalDemandEmail, { payload }); break;
    case 'ZNX-EM-PAY-020': element = React.createElement(ServiceRestrictionWarningEmail, { payload }); break;
    case 'ZNX-EM-PAY-021': element = React.createElement(ServiceRestrictedEmail, { payload }); break;
    case 'ZNX-EM-PAY-022': element = React.createElement(PromiseToPayConfirmedEmail, { payload }); break;
    case 'ZNX-EM-PAY-023': element = React.createElement(PromiseToPayReminderEmail, { payload }); break;
    case 'ZNX-EM-PAY-024': element = React.createElement(RefundInitiatedEmail, { payload }); break;
    case 'ZNX-EM-PAY-025': element = React.createElement(RefundCompletedEmail, { payload }); break;
    // ── CMP ──
    case 'ZNX-EM-CMP-001': element = React.createElement(TermsUpdatedEmail, { payload }); break;
    case 'ZNX-EM-CMP-002': element = React.createElement(PrivacyNoticeUpdatedEmail, { payload }); break;
    case 'ZNX-EM-CMP-003': element = React.createElement(ConsentRecordedEmail, { payload }); break;
    case 'ZNX-EM-CMP-004': element = React.createElement(ConsentChangedEmail, { payload }); break;
    case 'ZNX-EM-CMP-005': element = React.createElement(ConsentWithdrawnEmail, { payload }); break;
    case 'ZNX-EM-CMP-006': element = React.createElement(DataProcessingAgreementReadyEmail, { payload }); break;
    case 'ZNX-EM-CMP-007': element = React.createElement(DataProcessingAgreementSignedEmail, { payload }); break;
    case 'ZNX-EM-CMP-008': element = React.createElement(SubprocessorChangeNoticeEmail, { payload }); break;
    case 'ZNX-EM-CMP-009': element = React.createElement(DataResidencyChangeNoticeEmail, { payload }); break;
    case 'ZNX-EM-CMP-010': element = React.createElement(RetentionPeriodApproachingEmail, { payload }); break;
    case 'ZNX-EM-CMP-011': element = React.createElement(LegalHoldAppliedEmail, { payload }); break;
    case 'ZNX-EM-CMP-012': element = React.createElement(RegulatoryInformationRequiredEmail, { payload }); break;
    case 'ZNX-EM-CMP-013': element = React.createElement(RegulatorySubmissionAcceptedEmail, { payload }); break;
    case 'ZNX-EM-CMP-014': element = React.createElement(RegulatorySubmissionRejectedEmail, { payload }); break;
    // ── PAR ──
    case 'ZNX-EM-PAR-001': element = React.createElement(PartnerInvitationEmail, { payload }); break;
    case 'ZNX-EM-PAR-002': element = React.createElement(PartnerOnboardingStartedEmail, { payload }); break;
    case 'ZNX-EM-PAR-003': element = React.createElement(PartnerDueDiligenceRequiredEmail, { payload }); break;
    case 'ZNX-EM-PAR-004': element = React.createElement(PartnerApprovedEmail, { payload }); break;
    case 'ZNX-EM-PAR-005': element = React.createElement(PartnerRejectedEmail, { payload }); break;
    case 'ZNX-EM-PAR-006': element = React.createElement(CommercialAgreementReadyEmail, { payload }); break;
    case 'ZNX-EM-PAR-007': element = React.createElement(CommercialAgreementSignedEmail, { payload }); break;
    case 'ZNX-EM-PAR-008': element = React.createElement(PartnerCredentialsReadyEmail, { payload }); break;
    case 'ZNX-EM-PAR-009': element = React.createElement(DealerOrResellerAccountActivatedEmail, { payload }); break;
    case 'ZNX-EM-PAR-010': element = React.createElement(CommissionStatementReadyEmail, { payload }); break;
    case 'ZNX-EM-PAR-011': element = React.createElement(CommissionAdjustmentEmail, { payload }); break;
    case 'ZNX-EM-PAR-012': element = React.createElement(CommissionPaymentSentEmail, { payload }); break;
    case 'ZNX-EM-PAR-013': element = React.createElement(SettlementStatementReadyEmail, { payload }); break;
    case 'ZNX-EM-PAR-014': element = React.createElement(SettlementVarianceDetectedEmail, { payload }); break;
    case 'ZNX-EM-PAR-015': element = React.createElement(SettlementApprovedEmail, { payload }); break;
    case 'ZNX-EM-PAR-016': element = React.createElement(WholesaleUsageFileReadyEmail, { payload }); break;
    case 'ZNX-EM-PAR-017': element = React.createElement(PartnerSlaBreachEmail, { payload }); break;
    case 'ZNX-EM-PAR-018': element = React.createElement(PartnerOffboardingCompletedEmail, { payload }); break;
    // ── CAT ──
    case 'ZNX-EM-CAT-001': element = React.createElement(ProductCreatedEmail, { payload }); break;
    case 'ZNX-EM-CAT-002': element = React.createElement(ProductApprovalRequestedEmail, { payload }); break;
    case 'ZNX-EM-CAT-003': element = React.createElement(ProductApprovedEmail, { payload }); break;
    case 'ZNX-EM-CAT-004': element = React.createElement(ProductRejectedEmail, { payload }); break;
    case 'ZNX-EM-CAT-005': element = React.createElement(PricePlanScheduledEmail, { payload }); break;
    case 'ZNX-EM-CAT-006': element = React.createElement(PricePlanLiveEmail, { payload }); break;
    case 'ZNX-EM-CAT-008': element = React.createElement(PromotionLaunchedEmail, { payload }); break;
    case 'ZNX-EM-CAT-009': element = React.createElement(PromotionEndingEmail, { payload }); break;
    case 'ZNX-EM-CAT-010': element = React.createElement(ProductRetiredEmail, { payload }); break;
    // ── API ──
    case 'ZNX-EM-API-001': element = React.createElement(DeveloperAccountInvitationEmail, { payload }); break;
    case 'ZNX-EM-API-002': element = React.createElement(ApiClientCreatedEmail, { payload }); break;
    case 'ZNX-EM-API-003': element = React.createElement(ApiSecretGeneratedEmail, { payload }); break;
    case 'ZNX-EM-API-004': element = React.createElement(ApiSecretRotatedEmail, { payload }); break;
    case 'ZNX-EM-API-005': element = React.createElement(ApiSecretExpiringEmail, { payload }); break;
    case 'ZNX-EM-API-006': element = React.createElement(WebhookConfiguredEmail, { payload }); break;
    case 'ZNX-EM-API-007': element = React.createElement(WebhookVerificationFailedEmail, { payload }); break;
    case 'ZNX-EM-API-008': element = React.createElement(WebhookDeliveryFailureEmail, { payload }); break;
    case 'ZNX-EM-API-009': element = React.createElement(WebhookDeliveryRecoveredEmail, { payload }); break;
    case 'ZNX-EM-API-010': element = React.createElement(SftpCredentialsIssuedEmail, { payload }); break;
    case 'ZNX-EM-API-011': element = React.createElement(BatchReceivedEmail, { payload }); break;
    case 'ZNX-EM-API-012': element = React.createElement(BatchValidationFailedEmail, { payload }); break;
    case 'ZNX-EM-API-013': element = React.createElement(BatchProcessedEmail, { payload }); break;
    case 'ZNX-EM-API-014': element = React.createElement(SchemaVersionDeprecationEmail, { payload }); break;
    case 'ZNX-EM-API-015': element = React.createElement(IntegrationCertificationStartedEmail, { payload }); break;
    case 'ZNX-EM-API-016': element = React.createElement(IntegrationCertificationPassedEmail, { payload }); break;
    case 'ZNX-EM-API-017': element = React.createElement(ProductionApiAccessApprovedEmail, { payload }); break;
    case 'ZNX-EM-API-018': element = React.createElement(IntegrationSuspendedEmail, { payload }); break;
    // ── RISK ──
    case 'ZNX-EM-RISK-001': element = React.createElement(FraudAlertOpenedEmail, { payload }); break;
    case 'ZNX-EM-RISK-002': element = React.createElement(SuspectedAccountTakeoverEmail, { payload }); break;
    case 'ZNX-EM-RISK-003': element = React.createElement(SimSwapRiskHoldEmail, { payload }); break;
    case 'ZNX-EM-RISK-004': element = React.createElement(PaymentFraudHoldEmail, { payload }); break;
    case 'ZNX-EM-RISK-005': element = React.createElement(IdentityMismatchEmail, { payload }); break;
    case 'ZNX-EM-RISK-006': element = React.createElement(UnusualUsagePatternEmail, { payload }); break;
    case 'ZNX-EM-RISK-007': element = React.createElement(RevenueLeakageAlertEmail, { payload }); break;
    case 'ZNX-EM-RISK-008': element = React.createElement(RatingVarianceAlertEmail, { payload }); break;
    case 'ZNX-EM-RISK-009': element = React.createElement(MediationGapDetectedEmail, { payload }); break;
    case 'ZNX-EM-RISK-010': element = React.createElement(DuplicateChargeRiskEmail, { payload }); break;
    case 'ZNX-EM-RISK-011': element = React.createElement(CreditLimitApproachingEmail, { payload }); break;
    case 'ZNX-EM-RISK-012': element = React.createElement(CreditLimitExceededEmail, { payload }); break;
    case 'ZNX-EM-RISK-013': element = React.createElement(RiskCaseResolvedEmail, { payload }); break;
    case 'ZNX-EM-RISK-014': element = React.createElement(HighRiskActionApprovalRequiredEmail, { payload }); break;
    // ── OPS ──
    case 'ZNX-EM-OPS-001': element = React.createElement(ScheduledReportReadyEmail, { payload }); break;
    case 'ZNX-EM-OPS-002': element = React.createElement(DataExportReadyEmail, { payload }); break;
    case 'ZNX-EM-OPS-003': element = React.createElement(DataExportFailedEmail, { payload }); break;
    case 'ZNX-EM-OPS-004': element = React.createElement(ReconciliationCompletedEmail, { payload }); break;
    case 'ZNX-EM-OPS-005': element = React.createElement(ReconciliationVarianceEmail, { payload }); break;
    case 'ZNX-EM-OPS-006': element = React.createElement(ApprovalRequestEmail, { payload }); break;
    case 'ZNX-EM-OPS-007': element = React.createElement(ApprovalReminderEmail, { payload }); break;
    case 'ZNX-EM-OPS-008': element = React.createElement(ApprovalCompletedEmail, { payload }); break;
    case 'ZNX-EM-OPS-009': element = React.createElement(ApprovalRejectedEmail, { payload }); break;
    case 'ZNX-EM-OPS-010': element = React.createElement(ScheduledJobFailedEmail, { payload }); break;
    // ── SUB ──
    case 'ZNX-EM-SUB-001': element = React.createElement(SubscriptionActivatedEmail, { payload }); break;
    case 'ZNX-EM-SUB-002': element = React.createElement(SubscriptionPlanChangedEmail, { payload }); break;
    case 'ZNX-EM-SUB-003': element = React.createElement(UsageOverageForecastEmail, { payload }); break;
    case 'ZNX-EM-SUB-004': element = React.createElement(RenewalDueIn90DaysEmail, { payload }); break;
    case 'ZNX-EM-SUB-005': element = React.createElement(RenewalDueIn30DaysEmail, { payload }); break;
    case 'ZNX-EM-SUB-007': element = React.createElement(RenewalCompletedEmail, { payload }); break;
    case 'ZNX-EM-SUB-009': element = React.createElement(PlatformServiceSuspensionForNonpaymentEmail, { payload }); break;
    case 'ZNX-EM-SUB-010': element = React.createElement(ContractTerminationConfirmedEmail, { payload }); break;
    // ── NEXA ──
    case 'ZNX-EM-NEXA-001': element = React.createElement(NexaEnabledEmail, { payload }); break;
    case 'ZNX-EM-NEXA-002': element = React.createElement(NexaAccessGrantedEmail, { payload }); break;
    case 'ZNX-EM-NEXA-003': element = React.createElement(NexaRecommendationReadyEmail, { payload }); break;
    case 'ZNX-EM-NEXA-004': element = React.createElement(NexaActionApprovalRequiredEmail, { payload }); break;
    case 'ZNX-EM-NEXA-005': element = React.createElement(NexaApprovedActionCompletedEmail, { payload }); break;
    case 'ZNX-EM-NEXA-006': element = React.createElement(NexaActionFailedEmail, { payload }); break;
    case 'ZNX-EM-NEXA-007': element = React.createElement(NexaPolicyViolationBlockedEmail, { payload }); break;

    default:
      console.warn(`Template ${templateId} not mapped in renderPreviewEmail.ts`);
      return React.createElement(Text, null, `Template ${templateId} is not registered.`);
  }

  return element;
}

export async function renderPreviewEmail(
  templateId: string, 
  brandOverride?: Partial<CanonicalEmailPayload['rendering']['brand']>, 
  senderOverride?: Partial<CanonicalEmailPayload['rendering']['sender']>, 
  supportOverride?: Partial<CanonicalEmailPayload['rendering']['support']>
) {
  // Safe defaults mimicking CanonicalLayout defaults
  const brand: CanonicalEmailPayload['rendering']['brand'] = {
    display_name: 'ZoikoNex',
    logo_url: 'https://cdn.zoikonex.com/logo-light.png',
    primary_color: '#0052FF',
    ...brandOverride
  };
  
  const sender: CanonicalEmailPayload['rendering']['sender'] = {
    from_name: 'ZoikoNex',
    reply_to: 'no-reply@zoikonex.com',
    ...senderOverride
  };
  
  const support: CanonicalEmailPayload['rendering']['support'] = {
    url: 'https://support.zoikonex.com',
    ...supportOverride
  };

  const payload: CanonicalEmailPayload = {
    identity: {
      tenant_id: 't-123',
      operator_id: 'op-123',
      brand_id: 'b-123',
      environment_name: 'preview',
      recipient_role: 'subscriber',
      recipient_locale: 'en-US',
      recipient_time_zone: 'UTC'
    },
    traceability: {
      event_type: 'preview_generated',
      event_version: '1.0',
      event_id: 'evt-123',
      correlation_id: 'corr-123',
      message_reference: 'msg-123',
      template_id: templateId,
      template_version: '1.0'
    },
    rendering: { brand, sender, support },
    governance: {
      message_classification: 'P3 Operational Notice',
      message_legal_basis: 'Contract',
      message_preference_category: 'System',
      message_sensitivity: 'Normal'
    },
    localizedValues: {
      jurisdiction_code: 'US',
      language_code: 'en-US',
      currency_code: 'USD',
      date_local: 'Jul 24, 2026',
      date_utc: '2026-07-24T12:00:00Z'
    },
    eventData: {
      tenant_display_name: 'Acme Corp',
      environment_name: 'Production',
      event_occurred_at_local: 'Jul 24, 2026 12:00 PM'
    }
  };

  const element = getPreviewEmailComponent(templateId, payload);
  if (!element) {
    return { success: false, error: 'Template not found' };
  }

  const html = await render(element);
  return { success: true, html, payload };
}
