import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { OPERATOR_GUIDE_CHAPTERS } from '../../mock/seed/misc';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { 
  ShieldCheck, BookOpen, Video, CheckCircle2, 
  HelpCircle, Play, Clock, Sparkles, Send, Check, 
  ArrowRight, FileText, ExternalLink 
} from 'lucide-react';

export const Handoff: React.FC = () => {
  const { qaLog, runQaSequence, addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'guide' | 'video' | 'qa' | 'support'>('qa');
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(0);
  const [isRunningQa, setIsRunningQa] = useState(false);

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');
  const [createdTickets, setCreatedTickets] = useState<{ id: string; subject: string; date: string }[]>([]);

  const handleRunQa = async () => {
    setIsRunningQa(true);
    await runQaSequence();
    setIsRunningQa(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    const newTicket = {
      id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      date: 'Just now',
    };

    setCreatedTickets([newTicket, ...createdTickets]);
    setTicketSubject('');
    setTicketDetails('');

    addToast({
      title: 'Support Ticket Logged',
      message: `Ticket ${newTicket.id} logged. Covered under 30-day post-launch warranty.`,
      type: 'success',
    });
  };

  const videoChapters = [
    { title: '01. Subaccount Overview & Navigation', time: '00:00' },
    { title: '02. Lead Intake Form & Field Taxonomy', time: '01:45' },
    { title: '03. Calendar & Appointment Settings', time: '03:30' },
    { title: '04. The 5 Core Workflows Explained', time: '05:15' },
    { title: '05. Stop-on-Reply & Deduplication Engine', time: '07:40' },
    { title: '06. Retell Voice Agent Webhook Sync', time: '09:50' },
    { title: '07. Pipeline Kanban & Task Delegation', time: '11:20' },
    { title: '08. Reporting & Ongoing Maintenance', time: '13:05' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Handoff Hub & Quality Assurance</h1>
          <p className="text-xs text-text-muted mt-1">
            Complete training documentation, video walkthrough chapters, live QA test matrix, and 30-day warranty support.
          </p>
        </div>

        <div className="inline-flex rounded-input border border-border bg-surface p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'qa' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>QA Test Suite</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Operator Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'video' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Walkthrough</span>
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'support' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>30-Day Support</span>
          </button>
        </div>
      </div>

      {/* TAB 1: QA TEST SUITE */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          <div className="p-4 bg-primary-soft/50 border border-primary/20 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-text text-sm">12-Point Automated Journey Verification</div>
              <div className="text-text-muted">
                Run our pre-handoff test suite to verify speed-to-lead, deduplication, and TCPA stop conditions.
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              loading={isRunningQa}
              onClick={handleRunQa}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Run Full Journey Test
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {qaLog.map((test) => {
              const isRunning = test.status === 'running';
              const isPassed = test.status === 'passed';

              return (
                <div
                  key={test.id}
                  className={`p-4 rounded-card border transition-all space-y-1.5 ${
                    isRunning
                      ? 'bg-primary-soft/40 border-primary ring-1 ring-primary'
                      : isPassed
                      ? 'bg-surface-elevated border-border'
                      : 'bg-surface border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${isPassed ? 'text-success' : 'text-text-muted'}`} />
                      {test.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sunken text-text-muted">
                      {test.runtime}
                    </span>
                  </div>

                  <p className="text-xs text-text-2 leading-relaxed">
                    {test.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-border/50">
                    <span>Category: <strong>{test.category}</strong></span>
                    <span>Verified by: <strong>{test.tester}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: OPERATOR GUIDE (In-app reader) */}
      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Table of contents (4 cols) */}
          <div className="lg:col-span-4 bg-surface rounded-modal border border-border p-4 space-y-2 shadow-sh-1">
            <span className="text-xs font-semibold text-text uppercase tracking-wider block mb-2 px-2">
              Operator Chapters
            </span>
            <div className="space-y-1">
              {OPERATOR_GUIDE_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapterIdx(idx)}
                  className={`w-full text-left px-3 py-2 rounded-input text-xs font-medium transition-all ${
                    selectedChapterIdx === idx
                      ? 'bg-primary text-surface font-semibold shadow-xs'
                      : 'text-text-2 hover:bg-sunken hover:text-text'
                  }`}
                >
                  {ch.title}
                </button>
              ))}
            </div>
          </div>

          {/* Reading View (8 cols) */}
          <div className="lg:col-span-8 bg-surface-elevated rounded-modal border border-border p-6 shadow-sh-2 space-y-4">
            <h3 className="font-serif text-xl font-bold text-text">
              {OPERATOR_GUIDE_CHAPTERS[selectedChapterIdx].title}
            </h3>
            <div className="text-xs sm:text-sm text-text-2 leading-relaxed whitespace-pre-line bg-sunken/40 p-4 rounded-card border border-border">
              {OPERATOR_GUIDE_CHAPTERS[selectedChapterIdx].content}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEO WALKTHROUGH */}
      {activeTab === 'video' && (
        <div className="space-y-6">
          <div className="bg-surface-elevated rounded-modal border border-border overflow-hidden shadow-sh-2">
            {/* Video Player Placeholder */}
            <div className="aspect-video bg-[#1F2420] text-white flex flex-col items-center justify-center p-6 text-center space-y-3 relative">
              <div className="w-16 h-16 rounded-full bg-accent/90 text-white flex items-center justify-center shadow-sh-2 cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </div>
              <div className="space-y-1 z-10">
                <h3 className="font-serif text-lg sm:text-xl font-medium">
                  GoHighLevel System Walkthrough & Staff Training
                </h3>
                <p className="text-xs text-[#CFC8BA] max-w-md">
                  Delivered on Milestone M5: 14-minute comprehensive screencast with step-by-step chapter navigation.
                </p>
              </div>
            </div>

            {/* Chapter markers list */}
            <div className="p-5 bg-surface border-t border-border">
              <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-3">
                Scrub to Key Topics (14:20 Total Duration)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {videoChapters.map((ch) => (
                  <div
                    key={ch.title}
                    className="p-2.5 rounded bg-surface-elevated border border-border flex items-center justify-between text-[11px] cursor-pointer hover:border-primary transition-colors"
                  >
                    <span className="font-medium text-text truncate mr-2">{ch.title}</span>
                    <span className="font-mono text-accent font-bold shrink-0">{ch.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 30-DAY SUPPORT */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-surface-elevated rounded-modal border border-border p-6 shadow-sh-2 space-y-5">
            <div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Warranty Protocol</span>
              <h3 className="font-serif text-xl font-bold text-text mt-0.5">30-Day Bug-Fix & Tuning Period</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Every buildout includes 30 calendar days of post-launch warranty support. If a trigger misses, a webhook fails, or an SMS template needs adjusting, we fix it within 1 business day.
              </p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text uppercase tracking-wider block">
                  Support Request Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Adjust quiet hours for weekend SMS notifications..."
                  className="w-full px-3.5 py-2 text-xs bg-sunken rounded-input border border-border outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text uppercase tracking-wider block">
                  Details / Steps to Reproduce
                </label>
                <textarea
                  rows={3}
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  placeholder="Describe what occurred or what adjustment you would like made..."
                  className="w-full px-3.5 py-2 text-xs bg-sunken rounded-input border border-border outline-none resize-none"
                />
              </div>

              <Button type="submit" variant="primary" size="md" icon={<Send className="w-3.5 h-3.5" />}>
                Submit Warranty Ticket
              </Button>
            </form>
          </div>

          {/* Right: What's covered & open tickets */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-surface rounded-modal border border-border p-5 space-y-3 text-xs">
              <h4 className="font-bold text-text uppercase text-[11px]">Included in 30-Day Support:</h4>
              <ul className="space-y-1.5 text-text-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Workflow trigger adjustments & bug fixes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Retell AI voice prompt fine-tuning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Twilio / Carrier delivery troubleshooting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Staff Q&A and recorded screen answers</span>
                </li>
              </ul>
            </div>

            {createdTickets.length > 0 && (
              <div className="bg-surface-elevated rounded-modal border border-border p-4 space-y-2">
                <span className="text-[11px] font-bold text-text uppercase tracking-wider">Logged Tickets</span>
                <div className="space-y-1.5">
                  {createdTickets.map(t => (
                    <div key={t.id} className="p-2.5 rounded bg-sunken border border-border text-xs flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-text">{t.subject}</div>
                        <div className="text-[10px] text-text-muted">{t.id} · {t.date}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary-soft text-primary font-bold">
                        Open
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
