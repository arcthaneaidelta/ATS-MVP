import React, { useState } from 'react';
import { useDemoStore } from '../../../store/demoStore';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Check, Compass, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomBuildPreview: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const { addLead } = useDemoStore();
  const [lotStatus, setLotStatus] = useState('I already own my lot / acreage');
  const [acreage, setAcreage] = useState('1.2 Acres (Wooded, Septic Approved)');
  const [budgetTier, setBudgetTier] = useState('$750k – $950k');
  const [county, setCounty] = useState('Mecklenburg / Union County');
  const [architectStage, setArchitectStage] = useState('Need custom architectural design');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      addLead({
        name,
        phone,
        email,
        communityName: 'Custom & On-Your-Lot Builds',
        communityId: 'custom-builds',
        planName: 'Custom Architectural Design',
        budgetRange: budgetTier,
        timeline: 'Within 3 months',
        score: 'Hot',
        stage: 'design_consult',
        source: 'Google Search',
        notes: [`Owns acreage: ${acreage} in ${county}. Desires architect feasibility walk.`],
        tags: ['Custom Division', 'High Ticket', 'Landowner Qualified', 'Assigned to Tom Becker'],
      });
    }, 600);
  };

  return (
    <div className="space-y-6 text-[#1F2A27]">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="clay">Custom Design-Build Division</Badge>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-medium leading-tight">
          Build on Your Land in the Carolinas
        </h2>
        <p className="text-xs text-[#4A5550] max-w-lg mx-auto">
          Full-service architectural design and construction management on your acreage
          across Mecklenburg, Union, and York Counties.
        </p>
      </div>

      {/* Discovery Checklist */}
      <div className="bg-white p-6 rounded-[14px] border border-[#DDD6C8] shadow-2xs">
        {submitted ? (
          <div className="text-center space-y-3 py-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-[#E3EEE4] text-[#4C7A57] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium">
              Consultation Scheduled, {name}!
            </h3>
            <p className="text-xs text-[#4A5550] max-w-sm mx-auto">
              Tom Becker has been assigned to your custom build project. You will receive a
              confirmation text and our Site Feasibility & Septic Checklist shortly.
            </p>
            <div className="pt-2">
              <Link to="/app/pipeline">
                <Button variant="clay" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Inspect Custom Lead in Pipeline
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center pb-2 border-b border-[#EDE8DD]">
              <h3 className="font-serif text-base text-[#1F2A27] font-medium">
                Schedule a 15-Minute Site Feasibility Consultation
              </h3>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                Land Ownership Status
              </label>
              <select
                value={lotStatus}
                onChange={(e) => setLotStatus(e.target.value)}
                className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none"
              >
                <option>I already own my lot / acreage</option>
                <option>I am currently under contract on land</option>
                <option>I am looking for land in Greater Charlotte</option>
              </select>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
              <div>
                <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                  Target County / Location
                </label>
                <input
                  type="text"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  placeholder="e.g. Weddington / Mint Hill"
                  className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                  Estimated Build Budget
                </label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none"
                >
                  <option>$650k – $800k</option>
                  <option>$750k – $950k</option>
                  <option>$1,000,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                Your Contact Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kevin Patel"
                  className="text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(704) 555-0183"
                  className="text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kpatel@example.com"
                  className="text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="clay" className="w-full" isLoading={isSubmitting}>
                Submit Feasibility Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
