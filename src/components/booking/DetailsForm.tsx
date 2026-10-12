import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Select, Textarea, Checkbox } from '../ui/FormControls';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Globe, CreditCard, Plane, MapPin } from 'lucide-react';

export interface CustomerFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  driverLicence: string;
  licenceCountry: string;
  flightNumber: string;
  pickupLocation: string;
  notes: string;
  termsAccepted: boolean;
}

interface DetailsFormProps {
  initialData: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  onBack: () => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({
  initialData,
  onSubmit,
  onBack,
}) => {
  const [formData, setFormData] = useState<CustomerFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof CustomerFormData, value: any): string => {
    switch (field) {
      case 'fullName':
        if (!value || value.trim().length < 3) return 'Please enter your full legal name.';
        return '';
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please provide a valid email address.';
        return '';
      case 'phone':
        if (!value || value.trim().length < 6) return 'Please provide a valid phone number with country code.';
        return '';
      case 'country':
        if (!value || value.trim().length < 2) return 'Please select your country of residence.';
        return '';
      case 'driverLicence':
        if (!value || value.trim().length < 4) return 'Driver licence number is required for rental insurance.';
        return '';
      case 'licenceCountry':
        if (!value || value.trim().length < 2) return 'Please enter the country of issue for your licence.';
        return '';
      case 'termsAccepted':
        if (!value) return 'You must accept the rental terms and insurance agreement.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field: keyof CustomerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof CustomerFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as Array<keyof CustomerFormData>).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      country: true,
      driverLicence: true,
      licenceCountry: true,
      termsAccepted: true,
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
        <h4 className="font-serif text-lg font-normal text-ink pb-2 border-b border-border">
          Primary Driver & Contact Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Legal Name"
            placeholder="e.g. Tuyeni Nghidinwa or Marcus Rossi"
            required
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            error={errors.fullName}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. name@example.com"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            helperText="Booking confirmation and digital receipt will be sent here"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Mobile Phone (with country code)"
            type="tel"
            placeholder="e.g. +264 81 234 5678 or +49 171..."
            required
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            error={errors.phone}
            leftIcon={<Phone className="w-4 h-4" />}
            helperText="Used for handover WhatsApp coordination"
          />

          <Input
            label="Country of Residence"
            placeholder="e.g. Namibia, Germany, UK, South Africa"
            required
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            onBlur={() => handleBlur('country')}
            error={errors.country}
            leftIcon={<Globe className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="bg-surface rounded-lg p-6 border border-border space-y-4">
        <h4 className="font-serif text-lg font-normal text-ink pb-2 border-b border-border">
          Licence & Handover Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Driver Licence Number"
            placeholder="e.g. NA-9201948 or B829104"
            required
            value={formData.driverLicence}
            onChange={(e) => handleChange('driverLicence', e.target.value)}
            onBlur={() => handleBlur('driverLicence')}
            error={errors.driverLicence}
            leftIcon={<CreditCard className="w-4 h-4" />}
          />

          <Input
            label="Licence Issuing Country"
            placeholder="e.g. Namibia, Germany, UK"
            required
            value={formData.licenceCountry}
            onChange={(e) => handleChange('licenceCountry', e.target.value)}
            onBlur={() => handleBlur('licenceCountry')}
            error={errors.licenceCountry}
            leftIcon={<Globe className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Pick-up & Handover Location"
            value={formData.pickupLocation}
            onChange={(e) => handleChange('pickupLocation', e.target.value)}
          >
            <option value="Windhoek Hosea Kutako International Airport (WDH)">
              Windhoek Hosea Kutako Airport (WDH) — Free Handover
            </option>
            <option value="Windhoek City Centre Depot (14 Bismarck St)">
              Windhoek City Centre Depot (14 Bismarck St)
            </option>
            <option value="Swakopmund Branch Depot">
              Swakopmund Branch Depot (Coastal)
            </option>
          </Select>

          <Input
            label="Arrival Flight Number (Optional)"
            placeholder="e.g. LH4356, QR1373, 4Z120"
            value={formData.flightNumber}
            onChange={(e) => handleChange('flightNumber', e.target.value)}
            leftIcon={<Plane className="w-4 h-4" />}
            helperText="We monitor delayed flights for late-night handovers"
          />
        </div>

        <Textarea
          label="Trip Notes or Special Requests (Optional)"
          placeholder="Travelling with infants? Visiting specific areas like Kaokoland or Sossusvlei? Need extra spare wheel?"
          rows={3}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div className="bg-surface rounded-lg p-5 border border-border">
        <Checkbox
          checked={formData.termsAccepted}
          onChange={(e) => handleChange('termsAccepted', e.target.checked)}
          error={errors.termsAccepted}
          label={
            <span>
              I confirm that the primary driver is over 21 years old, holds a valid licence for at least 2 years, and I accept the{' '}
              <Link to="/terms" target="_blank" className="text-accent underline hover:text-accent-hover">
                Rental Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link to="/terms#security-deposit" target="_blank" className="text-accent underline hover:text-accent-hover">
                Security Deposit Pre-Authorisation Policy
              </Link>
              .
            </span>
          }
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" type="button" onClick={onBack}>
          ← Back to Cover Options
        </Button>
        <Button variant="primary" size="lg" type="submit">
          Continue to Payment →
        </Button>
      </div>
    </form>
  );
};
