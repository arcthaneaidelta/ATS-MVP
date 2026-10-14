import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROPOSAL_DATA } from '../../data/proposal';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Activity,
  Copy
} from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';

export const ProposalPage: React.FC = () => {
  const { addToast } = useDemoStore();
  const [openQIndex, setOpenQIndex] = useState<number | null>(0); // Open Q1 by default

  const toggleAccordion = (idx: number) => {
    setOpenQIndex(openQIndex === idx ? null : idx);
  };

  const handleCopyProposal = () => {
    let text = `# Upwork Bid: Recall.ai Meeting Bot + AI Workflow Diagnostic\n\n`;
    PROPOSAL_DATA.forEach((item) => {
      text += `## ${item.qNumber}: ${item.question}\n\n`;
      text += `${item.answerText}\n\n`;
      text += `---\n\n`;
    });
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied All Proposal Answers',
      message: 'All 6 proposal answers copied with [YOUR_EXPERIENCE] placeholders ready for Upwork.'
    });
  };

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 max-w-[1000px] mx-auto w-full space-y-8">
        {/* Header Banner */}
        <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 sm:p-8 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#1F4B4A] bg-[#E3EDEB] px-2 py-0.5 rounded border border-[#CFC8BB]">
                RFP Bid Submission
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1E2A2B] mt-2">
                Proposal Answers: Questions 1 to 6
              </h1>
              <p className="text-xs sm:text-sm text-[#4A5757] mt-1.5 leading-relaxed">
                Direct, honest responses addressing your specific pipeline questions. Every answer links directly to an interactive screen in this prototype proving the methodology.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyProposal}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy Answers (.md)
              </Button>
              <Link to="/app/trace">
                <Button variant="primary" size="sm" rightIcon={<Activity className="w-4 h-4" />}>
                  Explore Trace Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-3.5 bg-[#F6F3EE] rounded-lg border border-[#E2DDD3] text-xs text-[#1E2A2B] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#3F7D5B] shrink-0 mt-0.5" />
            <div>
              <strong>Note on Experience:</strong> Sections marked with <code className="bg-white px-1 py-0.5 rounded border border-[#CFC8BB] text-[#B4643C] font-mono">[YOUR_EXPERIENCE]</code> and <code className="bg-white px-1 py-0.5 rounded border border-[#CFC8BB] text-[#B4643C] font-mono">[YOUR_RATE]</code> reflect real developer slots to be populated with verified portfolio proof before submitting to the client.
            </div>
          </div>
        </div>

        {/* 6 Accordion Questions */}
        <div className="space-y-4">
          {PROPOSAL_DATA.map((item, idx) => {
            const isOpen = openQIndex === idx;

            return (
              <div
                key={item.qNumber}
                className={`bg-[#FFFFFF] border rounded-[16px] transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#1F4B4A] shadow-[0_4px_16px_rgba(30,42,43,0.06)] ring-1 ring-[#1F4B4A]/10'
                    : 'border-[#CFC8BB] hover:border-[#1F4B4A]/60'
                }`}
              >
                {/* Accordion Bar */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className="p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#FBF9F6] transition-colors select-none"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-lg bg-[#E3EDEB] text-[#1F4B4A] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#CFC8BB]">
                      {item.qNumber}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#1E2A2B] leading-snug">
                        {item.question}
                      </h3>
                      <p className="text-xs text-[#4A5757] mt-1 italic font-serif">
                        "{item.summaryQuote}"
                      </p>
                    </div>
                  </div>

                  <div className="p-1 rounded text-[#7B8786] shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#E2DDD3] space-y-5 text-sm animate-in fade-in duration-150">
                    {/* Main Markdown Text */}
                    <div className="text-xs sm:text-sm text-[#1E2A2B] whitespace-pre-line leading-relaxed font-sans">
                      {item.answerText}
                    </div>

                    {/* Key Highlights Checklist */}
                    <div className="p-4 rounded-[12px] bg-[#FBF9F6] border border-[#E2DDD3] space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786] font-semibold block">
                        Core Commitments for This Question:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {item.keyHighlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3F7D5B] shrink-0 mt-0.5" />
                            <span className="text-[#4A5757]">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Links to Demo Screens Proving This Answer */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono text-[#7B8786]">Interactive Proof in Demo:</span>
                      {item.links.map((link) => (
                        <Link key={link.route} to={link.route}>
                          <Button
                            variant="secondary"
                            size="sm"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
