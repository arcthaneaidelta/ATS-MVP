import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Check, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [legalModalTitle, setLegalModalTitle] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <footer className="relative bg-[#16201C] text-[#EDE9E1] pt-24 pb-16 px-6 sm:px-8 overflow-hidden text-left">
      {/* Large watermark SVG cropped at bottom right */}
      <div className="absolute -bottom-24 -right-24 w-[480px] h-[480px] pointer-events-none opacity-[0.04]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="10" y1="42" x2="90" y2="42" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Main CTA Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-[#2C3B34]">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-normal text-[#EDE9E1] leading-[1.1]">
              Fair by design.
              <br />
              Verifiable by anyone.
            </h2>
            <p className="text-base text-[#C7C1B3] max-w-lg leading-relaxed">
              Experience the future of transparent digital prize pools. Sign in with standard email credentials, fund automatically, and audit the math on-chain.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Start with email
              </Button>
              <Link to="/verify">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-[#EDE9E1] border-[#3B4D44] hover:bg-[#22332B]"
                >
                  Verify a draw
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-5 bg-[#1F2B26] border border-[#2C3B34] rounded-lg p-6 sm:p-7 shadow-lg">
            <h3 className="text-lg font-display font-medium text-[#EDE9E1] mb-1">
              Contact Platform Team
            </h3>
            <p className="text-xs text-[#A8B5AE] mb-5">
              Have questions regarding our Base L2 contracts, VRF integration, or custodial architecture?
            </p>

            {submitted ? (
              <div className="p-6 bg-[#2C3B34]/60 border border-[#3E7D5A]/40 rounded-md text-center space-y-2 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-[#3E7D5A] text-white mx-auto flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-[#EDE9E1]">Message Received</h4>
                <p className="text-xs text-[#C7C1B3]">
                  Thanks for reaching out. We will reply within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#A8B5AE] uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amara Okafor"
                    className="w-full h-10 px-3 bg-[#16201C] border border-[#2C3B34] rounded text-sm text-[#EDE9E1] placeholder:text-[#5E6D66] focus:outline-none focus:border-[#C9A769]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A8B5AE] uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amara@example.com"
                    className="w-full h-10 px-3 bg-[#16201C] border border-[#2C3B34] rounded text-sm text-[#EDE9E1] placeholder:text-[#5E6D66] focus:outline-none focus:border-[#C9A769]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A8B5AE] uppercase tracking-wider block mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What are you building or inquiry..."
                    className="w-full p-2.5 bg-[#16201C] border border-[#2C3B34] rounded text-sm text-[#EDE9E1] placeholder:text-[#5E6D66] focus:outline-none focus:border-[#C9A769]"
                  />
                </div>
                <Button
                  type="submit"
                  variant="accent"
                  isLoading={isSubmitting}
                  className="w-full mt-2"
                >
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 text-sm">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#A8B5AE] block">
              Product
            </span>
            <ul className="space-y-2 text-[#C7C1B3]">
              <li><Link to="/app/pools" className="hover:text-white transition-colors">Pools Browser</Link></li>
              <li><Link to="/verify" className="hover:text-white transition-colors">Public Verifier</Link></li>
              <li><Link to="/trust" className="hover:text-white transition-colors">Trust Center</Link></li>
              <li><Link to="/app" className="hover:text-white transition-colors">App Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#A8B5AE] block">
              Infrastructure
            </span>
            <ul className="space-y-2 text-[#C7C1B3]">
              <li><a href="https://base.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Base L2 Network</a></li>
              <li><a href="https://chain.link/vrf" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Chainlink VRF</a></li>
              <li><a href="https://openzeppelin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">OpenZeppelin Contracts</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#A8B5AE] block">
              Governance & Legal
            </span>
            <ul className="space-y-2 text-[#C7C1B3]">
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModalTitle('Terms of Participation')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Participation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModalTitle('Privacy & Data Governance')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModalTitle('Responsible Participation')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Responsible Participation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModalTitle('Jurisdiction & Eligibility Gate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jurisdiction & Eligibility (A5)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#A8B5AE] block">
              Security
            </span>
            <div className="p-3 bg-[#1F2B26] border border-[#2C3B34] rounded text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#C9A769] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Isolated HSM Keys</span>
              </div>
              <p className="text-[11px] text-[#A8B5AE]">
                Continuous monitoring and automated sweep detection active.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#2C3B34] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8B5AE]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#3E7D5A]" />
            <span>All systems operational · Base L2 Block 38,224,590</span>
          </div>

          <div className="text-center sm:text-right">
            <span>© 2026 Meridian · Interactive prototype · Settled on Base (simulated)</span>
          </div>
        </div>
      </div>

      {/* Legal Modal Placeholder */}
      <Modal
        isOpen={!!legalModalTitle}
        onClose={() => setLegalModalTitle(null)}
        title={legalModalTitle || ''}
      >
        <div className="space-y-3 text-sm text-[#4A5650] text-left">
          <p>
            This section represents the client policy document for <strong className="text-[#1B2420]">{legalModalTitle}</strong>.
          </p>
          <p>
            In accordance with Assumption A5 of the project specification, pooled-contribution prize products are governed by regional eligibility controls and local consumer protections.
          </p>
          <div className="p-3 bg-[#EDE9E1] rounded text-xs font-mono text-[#1B2420]">
            Policy Status: Active · UK / EU / US Tier 1 Accredited Sandbox Framework
          </div>
          <div className="pt-2 flex justify-end">
            <Button variant="primary" onClick={() => setLegalModalTitle(null)}>
              Acknowledge & Close
            </Button>
          </div>
        </div>
      </Modal>
    </footer>
  );
};
