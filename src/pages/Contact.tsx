import React, { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Select, Textarea } from '../components/ui/FormControls';
import { Button } from '../components/ui/Button';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Please provide your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Valid email is required.';
    if (!message.trim()) newErrors.message = 'Please enter your message or query.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-content mx-auto text-left">
      <div className="space-y-2 mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
          Windhoek Depot & Support
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-ink">
          Talk to us
        </h1>
        <p className="text-sm sm:text-base text-ink-2 max-w-2xl leading-relaxed">
          Questions about Namibian gravel routes, camping equipment, or vehicle availability? Reach out by message, email, or WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact details & static map graphic (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-border shadow-sh-1 space-y-5">
            <h3 className="font-serif text-xl font-normal text-ink pb-2 border-b border-border">
              Contact Information
            </h3>

            <div className="space-y-4 text-xs text-ink-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Windhoek Depot & Office</strong>
                  14 Bismarck Street, Windhoek, Namibia<br />
                  <span className="text-ink-3">Hosea Kutako Airport handovers available 24/7</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Telephone Support</strong>
                  +264 61 240 910 (Office Landline)<br />
                  +264 81 234 5678 (24/7 Emergency Breakdown)
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Email Enquiries</strong>
                  rentals@futureshuttles.com.na
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Depot Opening Hours</strong>
                  Mon – Fri: 07:30 – 17:30<br />
                  Sat – Sun: 08:00 – 14:00
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/264812345678?text=Hello%20Future%20Shuttles,%20I%20would%20like%20to%20enquire%20about%20vehicle%20rental"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  icon={<MessageSquare className="w-4 h-4 text-accent" />}
                >
                  Direct WhatsApp Chat
                </Button>
              </a>
            </div>
          </div>

          {/* Static Map Graphic Card per PRD §26.7 */}
          <div className="bg-surface rounded-xl overflow-hidden border border-border shadow-sh-1">
            <div className="aspect-[16/9] bg-sand-soft relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Windhoek city location map placeholder"
                className="w-full h-full object-cover grayscale contrast-125 opacity-75"
              />
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-surface/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-border text-xs font-semibold text-ink flex items-center gap-1.5 shadow-sh-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Windhoek Depot Location</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-surface-elevated flex items-center justify-between text-xs">
              <span className="text-ink-3">Central Windhoek Hub</span>
              <a
                href="https://maps.google.com/?q=Windhoek,Namibia"
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Contact form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-1">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-success/15 border border-success/30 mx-auto flex items-center justify-center text-success">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-ink">
                  Thank you, {name}
                </h3>
                <p className="text-sm text-ink-2 max-w-sm mx-auto">
                  Your message has been received. Our team will reply to <strong>{email}</strong> shortly.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <h3 className="font-serif text-xl font-normal text-ink pb-2 border-b border-border">
                  Send an Enquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Tuyeni Nghidinwa"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    error={errors.name}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. name@example.com"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone / WhatsApp (Optional)"
                    placeholder="e.g. +264 81..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  <Select
                    label="Enquiry Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    <option value="general">General Safari Advice</option>
                    <option value="availability">Vehicle Availability Check</option>
                    <option value="equipment">Camping Equipment & Rooftop Tents</option>
                    <option value="corporate">Corporate or Long-term Hire</option>
                  </Select>
                </div>

                <Textarea
                  label="Your Message"
                  placeholder="How can we assist with your Namibian travel plans?"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setErrors((prev) => ({ ...prev, message: '' }));
                  }}
                  error={errors.message}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={submitting}
                    className="w-full"
                    icon={<Send className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
