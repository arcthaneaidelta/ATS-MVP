import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { DateRangePicker } from '../ui/DateRangePicker';
import { Input } from '../ui/Input';
import { Select, Textarea } from '../ui/FormControls';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useNavigate } from 'react-router-dom';
import { Info, Send, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuoteFormProps {
  initialVehicleId?: string;
  initialFrom?: string;
  initialTo?: string;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  initialVehicleId,
  initialFrom,
  initialTo,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { vehicles, searchContext, addQuotation } = useDemoStore();

  const [from, setFrom] = useState(initialFrom || searchContext.from || '');
  const [to, setTo] = useState(initialTo || searchContext.to || '');
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(
    initialVehicleId ? [initialVehicleId] : []
  );
  const [driverCount, setDriverCount] = useState(1);
  const [pickup, setPickup] = useState('Windhoek Hosea Kutako Airport');
  const [dropoff, setDropoff] = useState('Windhoek Hosea Kutako Airport');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleVehicle = (id: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!from || !to) newErrors.dates = 'Please specify your travel dates.';
    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Valid email is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const { reference } = addQuotation({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerCountry: country || 'International',
        startDate: from,
        endDate: to,
        vehiclePreference: selectedVehicles.length > 0 ? selectedVehicles : ['hilux-dc'],
        driverCount,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        message,
        status: 'new',
      });

      setLoading(false);
      toast({
        type: 'success',
        title: 'Quotation Request Sent',
        message: `Reference ${reference} received. We will respond within 4 business hours.`,
      });

      navigate(`/quote/sent/${reference}`);
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Notice Banner */}
      <div className="p-4 bg-info-soft rounded-lg border border-info/20 flex items-start gap-3">
        <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
        <div className="text-xs text-ink leading-relaxed">
          <strong className="block text-sm font-medium mb-0.5">
            No vehicle is reserved until you accept our quote
          </strong>
          Requesting a quotation does not place a hold or charge any fees. Our team will verify exact availability, compile any requested extras (rooftop tents, child seats, camping kits), and email your itemised proposal.
        </div>
      </div>

      {/* Dates & Duration */}
      <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
        <h4 className="font-serif text-lg font-normal text-ink pb-2 border-b border-border">
          1. Travel Dates & Route
        </h4>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-2 mb-1.5">
            Rental Dates <span className="text-accent">*</span>
          </label>
          <DateRangePicker
            startDate={from}
            endDate={to}
            onChange={(s, e) => {
              setFrom(s);
              setTo(e);
              setErrors((prev) => ({ ...prev, dates: '' }));
            }}
          />
          {errors.dates && <p className="text-xs text-error mt-1">{errors.dates}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Select
            label="Pick-up Location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          >
            <option value="Windhoek Hosea Kutako Airport">
              Windhoek Hosea Kutako Airport (WDH)
            </option>
            <option value="Windhoek City Centre Depot">
              Windhoek City Centre Depot
            </option>
            <option value="Swakopmund Branch Depot">
              Swakopmund Branch Depot
            </option>
          </Select>

          <Select
            label="Drop-off Location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          >
            <option value="Windhoek Hosea Kutako Airport">
              Windhoek Hosea Kutako Airport (WDH)
            </option>
            <option value="Windhoek City Centre Depot">
              Windhoek City Centre Depot
            </option>
            <option value="Swakopmund Branch Depot">
              Swakopmund Branch Depot
            </option>
          </Select>
        </div>
      </div>

      {/* Vehicle Preference */}
      <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
        <h4 className="font-serif text-lg font-normal text-ink pb-2 border-b border-border">
          2. Vehicle Preference & Drivers
        </h4>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-2 mb-2">
            Select vehicles you are considering (Optional - you can select multiple)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {vehicles.map((v) => {
              const isSelected = selectedVehicles.includes(v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => toggleVehicle(v.id)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-md border text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-accent-soft/40 text-ink font-medium'
                      : 'border-border bg-white text-ink-2 hover:bg-sand-soft/40'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 text-white',
                      isSelected ? 'bg-primary border-primary' : 'border-border-strong bg-white'
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{v.name}</div>
                    <div className="text-[10px] text-ink-3">
                      {v.type} · {v.seats} seats
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <Select
            label="Number of Permitted Drivers"
            value={driverCount}
            onChange={(e) => setDriverCount(Number(e.target.value))}
          >
            <option value={1}>1 Driver</option>
            <option value={2}>2 Drivers (Shared safari driving)</option>
            <option value={3}>3 Drivers</option>
            <option value={4}>4+ Drivers</option>
          </Select>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
        <h4 className="font-serif text-lg font-normal text-ink pb-2 border-b border-border">
          3. Your Contact Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Hannah Whitcombe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. hannah@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone / WhatsApp (with country code)"
            type="tel"
            placeholder="e.g. +44 7911 123456 or +264 81..."
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <Input
            label="Country of Residence"
            placeholder="e.g. United Kingdom, Germany, South Africa"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        <Textarea
          label="Tell us about your itinerary, group, or special needs"
          placeholder="e.g. Family of 4 planning Etosha and Sossusvlei loop. Flexible on dates. Would like rooftop tent and 40L fridge."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        type="submit"
        loading={loading}
        className="w-full"
        icon={<Send className="w-4 h-4" />}
        iconPosition="right"
      >
        Submit Quotation Request
      </Button>
    </form>
  );
};
