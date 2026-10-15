import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  Mail,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Edit,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Buyer, Quote, Booking, PlanId } from '../../data/types';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { MeterBar } from '../../components/MeterBar';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { Skeleton } from '../../components/Skeleton';

export const BuyerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const plans = useStore((s) => s.plans);

  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'bookings' | 'activity'>('requests');

  // Change Plan on behalf modal (PRD 6.7)
  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('professional');
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([
      mockApi.getBuyer(id),
      mockApi.getQuotes(),
      mockApi.getBookings(),
    ]).then(([bRes, qRes, bkRes]) => {
      if (bRes.body) {
        setBuyer(bRes.body);
        setSelectedPlanId(bRes.body.planId);
      }
      if (qRes.body) {
        setQuotes(qRes.body.filter((q) => q.buyerId === id));
      }
      if (bkRes.body) {
        setBookings(bkRes.body.filter((b) => b.buyerId === id));
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="p-8 text-center text-xs text-meridian-text-muted">
        Buyer organization not found.
      </div>
    );
  }

  const currentPlan = plans.find((p) => p.id === buyer.planId) || plans[0];

  const handleChangePlanOnBehalf = async () => {
    setSavingPlan(true);
    const res = await mockApi.updateBuyerPlan(buyer.id, selectedPlanId);
    setSavingPlan(false);

    if (res.status === 200 && res.body) {
      setBuyer(res.body.buyer);
      setChangePlanModalOpen(false);
      addToast(
        'success',
        'Plan Updated on Behalf',
        `Changed ${buyer.name} tier to ${res.body.planActivated}. Logged in operator audit.`
      );
    } else {
      addToast('error', 'Update Failed', res.error || 'Failed to update plan.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/buyers')}
        className="flex items-center gap-1.5 text-xs text-meridian-text-secondary hover:text-meridian-text-primary font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Buyer Directory</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meridian-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-medium text-meridian-text-primary">
              {buyer.name}
            </h1>
            <StatusChip kind="plan" status={buyer.planId} />
            <StatusChip kind="subscription" status={buyer.subscriptionStatus} />
          </div>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Primary Contact: <strong className="text-meridian-text-primary">{buyer.contactName}</strong> ({buyer.email}) • {buyer.country} • Joined {buyer.joinedDate}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setChangePlanModalOpen(true)}
          icon={<Edit className="w-3.5 h-3.5" />}
        >
          Change Plan on Behalf
        </Button>
      </div>

      {/* Two Column Layout (PRD Section 6.7) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Subscription & Allowance Card */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-5 shadow-sh-1">
            <div className="flex items-center justify-between border-b border-meridian-border pb-3">
              <span className="text-xs font-mono uppercase text-meridian-text-muted">
                Tier & Usage
              </span>
              <span className="font-mono text-xs font-semibold text-meridian-primary">
                ${currentPlan.pricePerMonth} USD/mo
              </span>
            </div>

            <div className="space-y-4">
              <MeterBar
                label="Bookings Allowance"
                current={buyer.bookingsThisMonth}
                max={currentPlan.bookingsPerMonth}
                unitSuffix=" bookings"
              />

              <MeterBar
                label="Gross Booking Value"
                current={buyer.valueThisMonth}
                max={currentPlan.bookingValuePerMonth}
                unitPrefix="$"
              />
            </div>

            <div className="pt-2 border-t border-meridian-border space-y-1.5 text-xs text-meridian-text-secondary">
              <div className="flex justify-between">
                <span className="text-meridian-text-muted">Renewal Date:</span>
                <span className="font-mono font-medium">{buyer.renewalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-meridian-text-muted">Seats:</span>
                <span className="font-mono font-medium">{buyer.seatCount} of {currentPlan.seats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-meridian-text-muted">Last Activity:</span>
                <span className="font-mono font-medium">{buyer.lastActivity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs (Requests, Bookings, Activity) */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2 border-b border-meridian-border text-xs">
            {[
              { key: 'requests', label: `Quotes & Requests (${quotes.length})` },
              { key: 'bookings', label: `Bookings (${bookings.length})` },
              { key: 'activity', label: 'Activity Log' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === t.key
                    ? 'border-meridian-primary text-meridian-primary font-semibold'
                    : 'border-transparent text-meridian-text-muted hover:text-meridian-text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-2">
              {quotes.length === 0 ? (
                <div className="p-8 text-center text-xs text-meridian-text-muted bg-meridian-surface rounded-card border border-meridian-border">
                  This agency has no active requests or quotes on file.
                </div>
              ) : (
                quotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => navigate(`/app/requests/${q.id}`)}
                    className="p-3 bg-meridian-surface rounded-card border border-meridian-border hover:border-meridian-border-strong cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-meridian-primary text-xs">
                          {q.reference}
                        </span>
                        <span className="font-semibold text-xs text-meridian-text-primary">
                          {q.tourTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-meridian-text-muted mt-0.5">
                        {q.travellersCount} Guests • Valid thru {q.validityDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-meridian-text-primary block">
                        ${q.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase font-mono text-meridian-text-muted">
                        {q.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-2">
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-meridian-text-muted bg-meridian-surface rounded-card border border-meridian-border">
                  No direct bookings created by this agency yet.
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    className="p-3 bg-meridian-surface rounded-card border border-meridian-border hover:border-meridian-border-strong cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-meridian-primary text-xs">
                          {b.reference}
                        </span>
                        <span className="font-semibold text-xs text-meridian-text-primary">
                          {b.tourTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-meridian-text-muted mt-0.5">
                        {b.travellersCount} Pax • Updated {b.updatedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusChip kind="booking" status={b.status} />
                      <ArrowRight className="w-4 h-4 text-meridian-text-muted" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="bg-meridian-surface border border-meridian-border rounded-card p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-meridian-primary mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-meridian-text-primary">
                    Portal session active
                  </p>
                  <p className="text-[11px] text-meridian-text-muted">
                    {buyer.lastActivity} • IP Region {buyer.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-meridian-text-muted mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-meridian-text-primary">
                    Account Registered
                  </p>
                  <p className="text-[11px] text-meridian-text-muted">
                    {buyer.joinedDate} • Verified via Trade Portal Gateway
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Change Plan on Behalf (PRD 6.7) */}
      <Modal
        isOpen={changePlanModalOpen}
        onClose={() => setChangePlanModalOpen(false)}
        title={`Change Plan on Behalf of ${buyer.name}`}
        description="Override agency tier directly from operator desk. Action is logged."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setChangePlanModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              loading={savingPlan}
              onClick={handleChangePlanOnBehalf}
            >
              Confirm Plan Override
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-meridian-text-secondary">
            Select the new tier to assign to <strong>{buyer.name}</strong>:
          </p>
          <div className="space-y-2">
            {plans.map((p) => (
              <label
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-card border cursor-pointer transition-all ${
                  selectedPlanId === p.id
                    ? 'border-meridian-primary bg-meridian-primary-tint/30 font-semibold'
                    : 'border-meridian-border bg-meridian-surface-sunken hover:bg-meridian-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="planOverride"
                    checked={selectedPlanId === p.id}
                    onChange={() => setSelectedPlanId(p.id)}
                    className="text-meridian-primary focus:ring-meridian-primary"
                  />
                  <div>
                    <p className="text-xs text-meridian-text-primary">{p.name} Tier</p>
                    <p className="text-[11px] text-meridian-text-muted">
                      {p.bookingsPerMonth} Bookings • ${p.bookingValuePerMonth.toLocaleString()} USD/mo
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-meridian-text-primary">
                  ${p.pricePerMonth}/mo
                </span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
