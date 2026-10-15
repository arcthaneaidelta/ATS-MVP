import { Buyer, Quote, PlanDefinition, EligibilityResult, EligibilityCheckItem, UserRole } from '../data/types';

// Reference date for the ATS portal demo
export const DEMO_CURRENT_DATE = '2026-10-15';

/**
 * Section 5.3: 5 Eligibility Rules evaluated in this order:
 * 1. Role: requester is a buyer in the same account
 * 2. Subscription: plan is active and not Explorer
 * 3. Quote validity: quote status is Issued, validity date is today or later, not already booked
 * 4. Volume, count: bookings this month + 1 <= plan limit
 * 5. Volume, value: value this month + quote amount <= plan limit
 *
 * Always returns all five results so UI shows every rule and its reason.
 */
export function evaluateEligibility(
  buyer: Buyer,
  quote: Quote,
  plan: PlanDefinition,
  actorRole: UserRole = 'buyer'
): EligibilityResult {
  const checks: EligibilityCheckItem[] = [];

  // Rule 1: Role check
  const isBuyerRole = actorRole === 'buyer';
  const isMatchingAccount = quote.buyerId === buyer.id;
  if (isBuyerRole && isMatchingAccount) {
    checks.push({
      ruleId: 1,
      name: 'Account & Role Authorization',
      status: 'pass',
      message: `Verified buyer credentials for ${buyer.name} (${buyer.contactName}).`,
    });
  } else if (!isBuyerRole) {
    checks.push({
      ruleId: 1,
      name: 'Account & Role Authorization',
      status: 'fail',
      message: `Current role '${actorRole}' is not authorized to submit bookings. Must be a Buyer.`,
    });
  } else {
    checks.push({
      ruleId: 1,
      name: 'Account & Role Authorization',
      status: 'fail',
      message: `Quote ${quote.reference} does not belong to buyer account ${buyer.name}.`,
    });
  }

  // Rule 2: Subscription plan is active and not Explorer
  if (buyer.planId === 'explorer') {
    checks.push({
      ruleId: 2,
      name: 'Plan Booking Entitlement',
      status: 'fail',
      message: 'Your Explorer plan cannot submit bookings. Activate Professional to continue.',
      fixAction: {
        label: 'Activate Professional',
        actionType: 'activate_plan',
      },
    });
  } else if (buyer.subscriptionStatus === 'past_due') {
    checks.push({
      ruleId: 2,
      name: 'Plan Booking Entitlement',
      status: 'fail',
      message: `Subscription for ${buyer.name} is past due. Update payment method to unlock bookings.`,
      fixAction: {
        label: 'Manage Subscription',
        actionType: 'activate_plan',
      },
    });
  } else {
    checks.push({
      ruleId: 2,
      name: 'Plan Booking Entitlement',
      status: 'pass',
      message: `Active ${plan.name} plan tier confirmed. Direct booking enabled.`,
    });
  }

  // Rule 3: Quote validity
  const isIssued = quote.status === 'issued';
  const notExpired = quote.validityDate >= DEMO_CURRENT_DATE;
  if (quote.status === 'booked') {
    checks.push({
      ruleId: 3,
      name: 'Quote Validity & Status',
      status: 'fail',
      message: `Quote ${quote.reference} has already been converted into a booking.`,
    });
  } else if (!notExpired || quote.status === 'expired') {
    checks.push({
      ruleId: 3,
      name: 'Quote Validity & Status',
      status: 'fail',
      message: `Quote ${quote.reference} expired on ${quote.validityDate}. Request a refreshed quote.`,
      fixAction: {
        label: 'Request Refreshed Quote',
        actionType: 'refresh_quote',
      },
    });
  } else if (!isIssued) {
    checks.push({
      ruleId: 3,
      name: 'Quote Validity & Status',
      status: 'fail',
      message: `Quote ${quote.reference} is in '${quote.status}' status and cannot be booked.`,
    });
  } else {
    checks.push({
      ruleId: 3,
      name: 'Quote Validity & Status',
      status: 'pass',
      message: `Quote ${quote.reference} is valid through ${quote.validityDate}.`,
    });
  }

  // Rule 4: Volume, count
  const newBookingCount = buyer.bookingsThisMonth + 1;
  if (plan.bookingsPerMonth === 0) {
    checks.push({
      ruleId: 4,
      name: 'Monthly Booking Volume (Count)',
      status: 'fail',
      message: 'Explorer tier includes 0 monthly bookings.',
      fixAction: {
        label: 'Upgrade Plan',
        actionType: 'activate_plan',
      },
    });
  } else if (newBookingCount > plan.bookingsPerMonth) {
    checks.push({
      ruleId: 4,
      name: 'Monthly Booking Volume (Count)',
      status: 'fail',
      message: `Monthly allowance of ${plan.bookingsPerMonth} bookings reached (${buyer.bookingsThisMonth} used). Upgrade to Enterprise for higher volume.`,
      fixAction: {
        label: 'View Usage & Upgrade',
        actionType: 'view_usage',
      },
    });
  } else {
    checks.push({
      ruleId: 4,
      name: 'Monthly Booking Volume (Count)',
      status: 'pass',
      message: `Booking count allowance: ${buyer.bookingsThisMonth} of ${plan.bookingsPerMonth} used (${newBookingCount} with this booking).`,
    });
  }

  // Rule 5: Volume, value
  const newValue = buyer.valueThisMonth + quote.totalAmount;
  if (plan.bookingValuePerMonth === 0) {
    checks.push({
      ruleId: 5,
      name: 'Monthly Booking Value (USD)',
      status: 'fail',
      message: 'Explorer tier includes $0 monthly booking value.',
      fixAction: {
        label: 'Upgrade Plan',
        actionType: 'activate_plan',
      },
    });
  } else if (newValue > plan.bookingValuePerMonth) {
    checks.push({
      ruleId: 5,
      name: 'Monthly Booking Value (USD)',
      status: 'fail',
      message: `Monthly value limit of $${plan.bookingValuePerMonth.toLocaleString()} reached ($${buyer.valueThisMonth.toLocaleString()} used + $${quote.totalAmount.toLocaleString()} booking = $${newValue.toLocaleString()}).`,
      fixAction: {
        label: 'View Usage & Upgrade',
        actionType: 'view_usage',
      },
    });
  } else {
    checks.push({
      ruleId: 5,
      name: 'Monthly Booking Value (USD)',
      status: 'pass',
      message: `Value allowance: $${buyer.valueThisMonth.toLocaleString()} of $${plan.bookingValuePerMonth.toLocaleString()} used ($${newValue.toLocaleString()} with this booking).`,
    });
  }

  const allPassed = checks.every((c) => c.status === 'pass');
  return { allPassed, checks };
}
