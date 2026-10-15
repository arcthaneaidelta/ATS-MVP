import React from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCcw,
  Ban,
  FileCheck2,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { BookingStatus, PaymentLineStatus, PlanId, SubscriptionStatus } from '../data/types';

export type StatusChipType =
  | { kind: 'booking'; status: BookingStatus }
  | { kind: 'payment'; status: PaymentLineStatus }
  | { kind: 'plan'; status: PlanId }
  | { kind: 'validity'; daysRemaining: number }
  | { kind: 'subscription'; status: SubscriptionStatus };

export const StatusChip: React.FC<StatusChipType & { className?: string }> = (props) => {
  const { kind, className = '' } = props;

  let label = '';
  let icon: React.ReactNode = null;
  let colorClasses = '';

  if (kind === 'booking') {
    switch (props.status) {
      case 'submitted':
        label = 'Submitted';
        icon = <Clock className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-info-tint text-meridian-info border-meridian-info/20';
        break;
      case 'under_review':
        label = 'Under Review';
        icon = <Clock className="w-3.5 h-3.5 animate-pulse" />;
        colorClasses = 'bg-meridian-warning-tint text-meridian-warning border-meridian-warning/30';
        break;
      case 'approved':
        label = 'Approved';
        icon = <CheckCircle2 className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-success-tint text-meridian-success border-meridian-success/30';
        break;
      case 'rejected':
        label = 'Rejected';
        icon = <XCircle className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-error-tint text-meridian-error border-meridian-error/30';
        break;
      case 'reconsideration_requested':
        label = 'Appeal Pending';
        icon = <RotateCcw className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-accent-tint text-meridian-accent border-meridian-accent/30';
        break;
      case 'rejected_final':
        label = 'Rejected (Final)';
        icon = <Ban className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-surface-sunken text-meridian-text-secondary border-meridian-border-strong';
        break;
      case 'cancelled':
        label = 'Cancelled';
        icon = <Ban className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-surface-sunken text-meridian-text-muted border-meridian-border';
        break;
      case 'payment_pending':
        label = 'Payment Pending';
        icon = <DollarSign className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-warning-tint text-meridian-warning border-meridian-warning/30';
        break;
      case 'partially_paid':
        label = 'Partially Paid';
        icon = <Clock className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-accent-tint text-meridian-accent border-meridian-accent/30';
        break;
      case 'fully_paid':
        label = 'Fully Paid';
        icon = <CheckCircle2 className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-success-tint text-meridian-success border-meridian-success/30';
        break;
      case 'completed':
        label = 'Completed';
        icon = <ShieldCheck className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-primary text-white border-meridian-primary';
        break;
    }
  } else if (kind === 'payment') {
    switch (props.status) {
      case 'not_paid':
        label = 'Not Paid';
        icon = <DollarSign className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-surface-sunken text-meridian-text-secondary border-meridian-border';
        break;
      case 'proof_uploaded':
        label = 'Proof Uploaded';
        icon = <FileCheck2 className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-accent-tint text-meridian-accent border-meridian-accent/30';
        break;
      case 'confirmed':
        label = 'Confirmed';
        icon = <CheckCircle2 className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-success-tint text-meridian-success border-meridian-success/30';
        break;
      case 'disputed':
        label = 'Disputed';
        icon = <AlertCircle className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-error-tint text-meridian-error border-meridian-error/30';
        break;
    }
  } else if (kind === 'plan') {
    switch (props.status) {
      case 'explorer':
        label = 'Explorer';
        icon = <Clock className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-surface-sunken text-meridian-text-secondary border-meridian-border';
        break;
      case 'professional':
        label = 'Professional';
        icon = <Zap className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-primary-tint text-meridian-primary border-meridian-primary/30';
        break;
      case 'enterprise':
        label = 'Enterprise';
        icon = <Sparkles className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-accent-tint text-meridian-accent border-meridian-accent/30';
        break;
    }
  } else if (kind === 'validity') {
    const days = props.daysRemaining;
    if (days < 0) {
      label = 'Expired';
      icon = <XCircle className="w-3.5 h-3.5" />;
      colorClasses = 'bg-meridian-error-tint text-meridian-error border-meridian-error/30';
    } else if (days <= 3) {
      label = `Expiring in ${days} ${days === 1 ? 'day' : 'days'}`;
      icon = <AlertCircle className="w-3.5 h-3.5" />;
      colorClasses = 'bg-meridian-warning-tint text-meridian-warning border-meridian-warning/30 font-medium';
    } else {
      label = `Valid ${days} days`;
      icon = <CheckCircle2 className="w-3.5 h-3.5" />;
      colorClasses = 'bg-meridian-success-tint text-meridian-success border-meridian-success/20';
    }
  } else if (kind === 'subscription') {
    switch (props.status) {
      case 'active':
        label = 'Active';
        icon = <CheckCircle2 className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-success-tint text-meridian-success border-meridian-success/30';
        break;
      case 'past_due':
        label = 'Past Due';
        icon = <AlertCircle className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-error-tint text-meridian-error border-meridian-error/30';
        break;
      case 'free':
        label = 'Free Tier';
        icon = <Clock className="w-3.5 h-3.5" />;
        colorClasses = 'bg-meridian-surface-sunken text-meridian-text-secondary border-meridian-border';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200 ${colorClasses} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
