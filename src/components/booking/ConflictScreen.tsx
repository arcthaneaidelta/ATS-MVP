import React from 'react';
import { AlertTriangle, ArrowRight, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDemoStore } from '../../store/useDemoStore';
import { formatCurrency } from '../../lib/format';
import { useNavigate } from 'react-router-dom';

interface ConflictScreenProps {
  attemptedVehicleId: string;
  onResetDates: () => void;
}

export const ConflictScreen: React.FC<ConflictScreenProps> = ({
  attemptedVehicleId,
  onResetDates,
}) => {
  const navigate = useNavigate();
  const { vehicles, searchContext } = useDemoStore();

  const attemptedVehicle = vehicles.find((v) => v.id === attemptedVehicleId);
  const alternatives = vehicles.filter((v) => v.id !== attemptedVehicleId && v.active).slice(0, 2);

  const handleSelectAlternative = (altId: string) => {
    const query = new URLSearchParams({
      vehicle: altId,
      from: searchContext.from,
      to: searchContext.to,
    });
    navigate(`/book?${query.toString()}`);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-left space-y-6">
      <div className="bg-warning-soft/60 border border-warning/30 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2.5 text-warning font-semibold">
          <AlertTriangle className="w-6 h-6 shrink-0" />
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink">
            Vehicle Reserved by Another Customer
          </h3>
        </div>

        <p className="text-sm text-ink-2 leading-relaxed">
          While you were completing your details, another customer finalised payment for the{' '}
          <strong className="text-ink">{attemptedVehicle?.name}</strong> across your chosen dates.
        </p>

        <div className="p-3 bg-white/80 rounded-md border border-warning/20 text-xs text-ink-2">
          <strong>No funds were deducted from your card.</strong> Our real-time concurrency check prevented an accidental double-booking.
        </div>
      </div>

      {/* Available Alternatives */}
      <div className="space-y-3">
        <h4 className="font-serif text-lg font-normal text-ink">
          Recommended Available Alternatives for the Same Dates:
        </h4>

        <div className="space-y-3">
          {alternatives.map((alt) => (
            <div
              key={alt.id}
              className="bg-surface rounded-lg p-4 border border-border flex items-center justify-between gap-4 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={alt.images[0]}
                  alt={alt.name}
                  className="w-16 h-12 rounded object-cover border border-border"
                />
                <div>
                  <h5 className="font-serif text-base font-normal text-ink">{alt.name}</h5>
                  <div className="text-xs text-ink-3">
                    {alt.seats} seats · {alt.transmission} · {alt.fuel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="font-serif text-base font-semibold text-primary tabular-nums">
                    {formatCurrency(alt.brackets[0].dailyRate)}
                  </div>
                  <div className="text-[10px] text-ink-3">from / day</div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleSelectAlternative(alt.id)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={() => navigate('/fleet')}
          icon={<Calendar className="w-4 h-4" />}
        >
          View Full Fleet
        </Button>

        <Button variant="secondary" onClick={onResetDates}>
          Adjust Trip Dates
        </Button>
      </div>
    </div>
  );
};
