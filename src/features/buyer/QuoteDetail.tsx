import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Lock,
  RefreshCw,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Quote } from '../../data/types';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { LockedGate } from '../../components/LockedGate';
import { useToast } from '../../components/Toast';
import { Skeleton } from '../../components/Skeleton';

export const QuoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const buyers = useStore((s) => s.buyers);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);
  const isExplorer = currentBuyer?.planId === 'explorer';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    mockApi.getQuote(id).then((res) => {
      if (res.body) setQuote(res.body);
      setLoading(false);
    });
  }, [id, activeBuyerId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-8 text-center text-xs text-meridian-text-muted">
        Quote reference not found or access denied.
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(quote.validityDate).getTime() - new Date('2026-10-15').getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const isExpired = daysRemaining < 0 || quote.status === 'expired';
  const isBooked = quote.status === 'booked';

  const handleRefreshQuote = async () => {
    setRefreshing(true);
    const res = await mockApi.refreshQuote(quote.id);
    setRefreshing(false);
    if (res.status === 200 && res.body) {
      setQuote(res.body);
      addToast('success', 'Quote Refreshed', `Quote ${quote.reference} refreshed with 14-day validity.`);
    } else {
      addToast('error', 'Refresh Failed', res.error || 'Could not refresh quote.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/app/requests')}
        className="flex items-center gap-1.5 text-xs text-meridian-text-secondary hover:text-meridian-text-primary transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Requests & Quotes</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meridian-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-medium text-meridian-text-primary">
              Quote {quote.reference}
            </h1>
            <StatusChip
              kind="validity"
              daysRemaining={isExpired ? -1 : daysRemaining}
            />
            {isBooked && (
              <span className="text-xs bg-meridian-info-tint text-meridian-info px-2.5 py-0.5 rounded-full font-medium">
                Booked
              </span>
            )}
          </div>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Issued on {quote.issuedDate} • Validity deadline:{' '}
            <strong className="text-meridian-text-primary">{quote.validityDate}</strong>
          </p>
        </div>

        {/* Action Button States (PRD Section 6.3) */}
        <div className="flex items-center gap-3">
          {isExpired ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-meridian-error font-medium flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Expired Quote
              </span>
              <Button
                variant="accent"
                size="sm"
                loading={refreshing}
                onClick={handleRefreshQuote}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Request Refreshed Quote
              </Button>
            </div>
          ) : isBooked ? (
            <Button variant="secondary" size="sm" disabled disabledTooltip="Quote has already been booked">
              Already Booked
            </Button>
          ) : isExplorer ? (
            <LockedGate
              isLocked={true}
              requirement="Needs Professional plan to book quotes"
              fallbackAction={
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => navigate('/app/subscription')}
                >
                  Activate to Book
                </Button>
              }
            >
              <Button variant="accent" size="md">
                Book this quote
              </Button>
            </LockedGate>
          ) : (
            <Button
              variant="accent"
              size="md"
              onClick={() => navigate(`/app/book/${quote.id}`)}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Book this quote
            </Button>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Request Summary */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4">
            <h3 className="font-serif text-lg font-medium text-meridian-text-primary">
              Itinerary Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-meridian-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-meridian-text-muted">Tour Package</span>
                  <p className="font-semibold text-meridian-text-primary text-sm mt-0.5">
                    {quote.tourTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-meridian-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-meridian-text-muted">Travel Dates</span>
                  <p className="font-medium text-meridian-text-primary mt-0.5">
                    {quote.travelDates}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-meridian-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-meridian-text-muted">Group Configuration</span>
                  <p className="font-medium text-meridian-text-primary mt-0.5">
                    {quote.travellersCount} Confirmed Guests
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expiration Note */}
          {isExpired && (
            <div className="p-4 bg-meridian-error-tint/40 border border-meridian-error/30 rounded-card text-xs text-meridian-error space-y-1.5">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Quote Booking Disabled
              </p>
              <p className="text-[11px] leading-relaxed">
                Quote {quote.reference} expired on {quote.validityDate}. Operator pricing and supplier rate locks are no longer guaranteed. Click "Request Refreshed Quote" to generate current pricing.
              </p>
            </div>
          )}
        </div>

        {/* Right: Supplier Line Items Breakdown */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4 shadow-sh-1">
            <div className="flex items-center justify-between border-b border-meridian-border pb-3">
              <h3 className="font-serif text-lg font-medium text-meridian-text-primary">
                Supplier Cost Allocation
              </h3>
              <span className="text-xs font-mono text-meridian-text-muted">
                {quote.supplierLines.length} Independent Lines
              </span>
            </div>

            <div className="space-y-3">
              {quote.supplierLines.map((line) => (
                <div
                  key={line.id}
                  className="p-3.5 bg-meridian-surface-sunken rounded border border-meridian-border flex items-start justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-meridian-text-primary">
                      {line.supplierName}
                    </p>
                    <p className="text-[11px] text-meridian-text-secondary">
                      {line.serviceType}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-meridian-text-primary shrink-0">
                    ${line.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-meridian-border flex items-center justify-between">
              <div>
                <span className="text-xs text-meridian-text-muted">Total Net Payable</span>
                <p className="text-[11px] text-meridian-text-secondary">
                  Tracked and confirmed per supplier line
                </p>
              </div>
              <span className="font-serif text-2xl font-medium text-meridian-primary">
                ${quote.totalAmount.toLocaleString()} USD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
