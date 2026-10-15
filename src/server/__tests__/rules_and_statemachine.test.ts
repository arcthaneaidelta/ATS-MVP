import { evaluateEligibility } from '../rules';
import {
  transitionToUnderReview,
  transitionToApproved,
  transitionToRejected,
  transitionToReconsideration,
  transitionToCompleted,
  canCompleteBooking,
  rollupPaymentStatus,
} from '../stateMachine';
import { Buyer, Quote, PlanDefinition, Booking } from '../../data/types';
import { SEED_PLANS, SEED_BUYERS, SEED_QUOTES, SEED_BOOKINGS } from '../../data/seed';

console.log('🧪 Starting Meridian ATS Rules & State Machine Verification...\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

// 1. Eligibility Rule 2: Free tier Explorer blocks booking
const explorerBuyer = SEED_BUYERS.find((b) => b.id === 'buyer-4')!; // Juniper (Explorer)
const validQuote = SEED_QUOTES.find((q) => q.id === 'quote-1')!;
const explorerPlan = SEED_PLANS.find((p) => p.id === 'explorer')!;
const proPlan = SEED_PLANS.find((p) => p.id === 'professional')!;

const resExplorer = evaluateEligibility(explorerBuyer, validQuote, explorerPlan, 'buyer');
assert(!resExplorer.allPassed, 'Explorer buyer cannot pass eligibility');
assert(
  resExplorer.checks.find((c) => c.ruleId === 2)?.status === 'fail',
  'Rule 2 explicitly fails with Explorer plan error'
);

// 2. Eligibility Rule 3: Expired quote fails
const expiredQuote = SEED_QUOTES.find((q) => q.id === 'quote-3')!; // Q-2041 expired 12 Oct 2026
const proBuyer = SEED_BUYERS.find((b) => b.id === 'buyer-1')!; // Northwind
const resExpired = evaluateEligibility(proBuyer, expiredQuote, proPlan, 'buyer');
assert(!resExpired.allPassed, 'Expired quote cannot pass eligibility');
assert(
  resExpired.checks.find((c) => c.ruleId === 3)?.status === 'fail',
  'Rule 3 explicitly fails with quote expiration message'
);

// 3. Eligibility: All 5 pass when Pro buyer has valid quote within volume
const eligibleBuyer: Buyer = {
  ...proBuyer,
  bookingsThisMonth: 2,
  valueThisMonth: 10000,
};
const matchingQuote: Quote = {
  ...validQuote,
  buyerId: eligibleBuyer.id,
  validityDate: '2026-10-30',
  status: 'issued',
};
const resPass = evaluateEligibility(eligibleBuyer, matchingQuote, proPlan, 'buyer');
assert(resPass.allPassed, 'All 5 eligibility rules pass for eligible buyer and valid quote');
assert(resPass.checks.every((c) => c.status === 'pass'), 'Checklist contains 5 passes');

// 4. State Machine: Reject requires at least 10 characters
const underReviewBooking = SEED_BOOKINGS.find((b) => b.id === 'bk-2602')!;
const shortReject = transitionToRejected(underReviewBooking, 'Too short', 'admin', 'Admin');
assert(!shortReject.success, 'Rejection with <10 characters is rejected by state machine');

const validReject = transitionToRejected(underReviewBooking, 'Certified guide quota exhausted for requested departure.', 'admin', 'Admin');
assert(validReject.success && validReject.booking?.status === 'rejected', 'Rejection with valid reason transitions to rejected');

// 5. State Machine: One-time reconsideration
const rejectedBooking = validReject.booking!;
const firstAppeal = transitionToReconsideration(
  rejectedBooking,
  'We confirmed alternative dates with client and hotel.',
  'buyer',
  'Elena'
);
assert(
  firstAppeal.success && firstAppeal.booking?.status === 'reconsideration_requested',
  'First reconsideration request succeeds'
);

// Second reconsideration must be blocked!
const secondAppeal = transitionToReconsideration(
  firstAppeal.booking!,
  'Trying a second time with another note.',
  'buyer',
  'Elena'
);
assert(!secondAppeal.success, 'Second reconsideration attempt is blocked (reconsiderationUsed is true)');

// 6. State Machine: Completion blocked unless all payments confirmed
const unconfirmedBooking = SEED_BOOKINGS.find((b) => b.id === 'bk-2608')!; // 3 not_paid lines
const completionCheck = canCompleteBooking(unconfirmedBooking);
assert(!completionCheck.allowed, 'Completion is blocked when payment lines are unconfirmed');
assert(completionCheck.pendingLines.length === 3, 'All 3 pending lines are reported');

const tryComplete = transitionToCompleted(unconfirmedBooking, 'admin', 'Sarah Jenkins');
assert(!tryComplete.success, 'transitionToCompleted returns failure with unconfirmed lines');

// All payments confirmed and booking is fully_paid
const fullyPaidBooking: Booking = {
  ...SEED_BOOKINGS.find((b) => b.id === 'bk-2610')!,
  status: 'fully_paid',
};
const allowComplete = canCompleteBooking(fullyPaidBooking);
assert(allowComplete.allowed, 'Completion is allowed when all payment lines are confirmed on a fully_paid booking');

const completeTransition = transitionToCompleted(fullyPaidBooking, 'admin', 'Sarah Jenkins');
assert(
  completeTransition.success && completeTransition.booking?.status === 'completed',
  'transitionToCompleted successfully marks fully_paid booking as completed'
);


console.log(`\nResults: ${passedTests} passed, ${failedTests} failed.`);
if (failedTests > 0) process.exit(1);
