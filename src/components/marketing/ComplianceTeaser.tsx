import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ShieldCheck, Moon, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const ComplianceTeaser: React.FC = () => {
  const points = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#4C7A57]" />,
      title: 'TCPA & 10DLC Brand Verification',
      description: 'Carrier-registered A2P 10DLC messaging prevents carrier spam filtering and legal exposure with automated STOP/HELP opt-out compliance.',
    },
    {
      icon: <Moon className="w-5 h-5 text-[#B4684A]" />,
      title: 'Automated Quiet Hours Guard',
      description: 'Texts are held automatically between 9:00 PM and 8:00 AM Eastern time, protecting your builder license against state and federal texting violations.',
    },
    {
      icon: <FileText className="w-5 h-5 text-[#2F4A3F]" />,
      title: 'Fair Housing Safe Copy Safeguards',
      description: 'Ad copy and funnel templates comply with Federal Fair Housing Act rules, avoiding discriminatory targeting or prohibited demographic wording.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#4B6A82]" />,
      title: 'Email SPF, DKIM & DMARC Health',
      description: 'Complete domain authentication ensures your VIP Lookbooks and pricing sheets land in buyer primary inboxes, not spam folders.',
    },
  ];

  return (
    <section className="py-20 bg-[#F6F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
              US Telephony & Housing Regulations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal mt-2">
              Built for Strict US Compliance
            </h2>
            <p className="text-sm text-[#4A5550] mt-2 max-w-xl">
              Most generic CRM setups leave home builders vulnerable to $1,500/text TCPA penalties.
              Groundwork is engineered with carrier-verified safeguards from day one.
            </p>
          </div>
          <Link to="/compliance">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test Compliance Guard (/compliance)
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, i) => (
            <div
              key={i}
              className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-3"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#EDE8DD] flex items-center justify-center">
                {pt.icon}
              </div>
              <h3 className="font-serif text-lg text-[#1F2A27] font-medium">{pt.title}</h3>
              <p className="text-xs text-[#4A5550] leading-relaxed">{pt.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
