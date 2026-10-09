import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowUpRight, Compass, Home, Layers, Check } from 'lucide-react';

export const FunnelsPreviewSection: React.FC = () => {
  const funnels = [
    {
      id: 'community',
      title: 'Community Inquiry Funnel',
      subtitle: 'Harlow Creek (Fort Mill, SC)',
      description: 'High-converting neighborhood landing page with interactive quick move-in inventory, starting pricing ($429,900), and instant VIP tour booking.',
      conversionRate: '14.8% Opt-in',
      features: ['TCPA Consent Checkbox', 'Move-In Inventory Cards', 'Split-View to CRM'],
      path: '/funnels/community',
      category: 'Master-Planned Communities',
    },
    {
      id: 'plan-quiz',
      title: 'Floor Plan Matcher Quiz',
      subtitle: 'Find Your Ideal Plan in 60 Seconds',
      description: '5-step quiz asking bedrooms, budget, must-haves, and timeline. Dynamically recommends The Calder or The Linden with instant tour capture.',
      conversionRate: '22.4% Completion',
      features: ['5-Step Progressive Disclosure', 'Dynamic Plan Scoring', 'Zero Form Friction'],
      path: '/funnels/plan-quiz',
      category: 'Interactive Lead Magnet',
    },
    {
      id: 'custom-build',
      title: 'Custom & On-Your-Lot Portal',
      subtitle: 'Greater Charlotte Acreage Builds',
      description: 'Engineered for buyers who own land or need acreage. Captures lot topography status, septic/well feasibility, and architecture stage.',
      conversionRate: '9.2% Qualified High-Ticket',
      features: ['Lot Status Verification', 'Budget Tier Qualification', 'Civil Feasibility Intake'],
      path: '/funnels/custom-build',
      category: 'Custom & High Ticket',
    },
  ];

  return (
    <section className="py-20 bg-[#F6F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
              Conversion Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal mt-2">
              Three Tailored Lead Funnels
            </h2>
            <p className="text-sm text-[#4A5550] mt-2 max-w-xl">
              Clean, mobile-optimized entry points designed specifically for new-construction buyers.
            </p>
          </div>
          <Link to="/funnels">
            <Button variant="secondary" size="md" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              Explore Funnel Gallery
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {funnels.map((f) => (
            <div
              key={f.id}
              className="bg-[#FBF9F4] rounded-[16px] border border-[#DDD6C8] hover:border-[#C5BCA9] hover:shadow-[0_4px_12px_rgba(31,42,39,0.08)] transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header Preview Area */}
              <div className="p-6 border-b border-[#EDE8DD] bg-[#F6F3EC]">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="clay">{f.category}</Badge>
                  <span className="font-mono text-xs font-semibold text-[#4C7A57] bg-[#E3EEE4] px-2 py-0.5 rounded-full">
                    {f.conversionRate}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#1F2A27] font-medium group-hover:text-[#2F4A3F] transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-[#79827D] mt-0.5">{f.subtitle}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#4A5550] leading-relaxed">{f.description}</p>

                <div className="space-y-1.5 pt-2">
                  {f.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#2F4A3F]">
                      <Check className="w-3.5 h-3.5 text-[#4C7A57]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#EDE8DD]">
                  <Link to={f.path} className="block">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full justify-between"
                      rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    >
                      Open Live Funnel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
