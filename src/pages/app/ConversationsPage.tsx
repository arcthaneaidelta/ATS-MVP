import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Lead } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import {
  MessageSquare,
  Phone,
  Mail,
  Send,
  Bot,
  User,
  Pause,
  Play,
  Moon,
  Clock,
  Sparkles,
  PhoneCall,
  PhoneMissed,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const ConversationsPage: React.FC = () => {
  const { leads, addMessageToLead, addToast } = useDemoStore();

  const [selectedLeadId, setSelectedLeadId] = useState<string>('lead-1');
  const [activeChannel, setActiveChannel] = useState<'all' | 'sms' | 'email' | 'instagram'>('all');
  const [messageInput, setMessageInput] = useState('');
  const [automationPaused, setAutomationPaused] = useState(false);
  const [showTakeoverModal, setShowTakeoverModal] = useState(false);
  const [showMissedCallModal, setShowMissedCallModal] = useState(false);
  const [missedCallRingStep, setMissedCallRingStep] = useState<'idle' | 'ringing' | 'texted'>('idle');

  const lead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const quickReplies = [
    'Saturday at 11am works! Would you like me to reserve The Calder model for you?',
    'Here is our preferred lender link for Movement Mortgage’s 2-1 buydown: aldr.st/rates',
    'We currently have 4 wooded homesites available at Harlow Creek. Lookbook sent to your email!',
    'Free parking is available right in front of the model at 1042 Harlow Creek Way. Gate code #1042.',
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    addMessageToLead(lead.id, messageInput.trim(), 'agent', false);
    setMessageInput('');
    setAutomationPaused(true);
    addToast('Human Response Sent', `Paused automated bot sequences for ${lead.name}.`, 'info');
  };

  const handleSimulateMissedCall = () => {
    setShowMissedCallModal(true);
    setMissedCallRingStep('ringing');

    setTimeout(() => {
      setMissedCallRingStep('texted');
      addMessageToLead(
        lead.id,
        'Sorry we missed your call! This is Alder & Stone Homes. How can we help? Looking to tour a model home or ask about lot availability?',
        'system',
        true
      );
      addToast(
        'Missed-Call Text-Back Fired',
        `Dispatched recovery SMS within 3 seconds to ${lead.name}.`,
        'success'
      );
    }, 2500);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      {/* Top Header with Missed-Call Simulator Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Unified Communications Inbox
            </h1>
            <Badge variant="clay">Multi-Channel Hub</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            SMS, Email, Instagram DMs, and Google Business Messages unified in one real-time thread.
          </p>
        </div>

        {/* Missed-Call Text-Back Mini Simulator Action (§10.2) */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSimulateMissedCall}
          leftIcon={<PhoneMissed className="w-3.5 h-3.5 text-[#B4684A]" />}
        >
          Simulate Inbound Missed Call
        </Button>
      </div>

      {/* 3-Pane Inbox Container */}
      <div className="flex-1 min-h-0 bg-[#FBF9F4] rounded-[16px] border border-[#DDD6C8] overflow-hidden flex flex-col md:flex-row shadow-2xs">
        {/* Left Pane (Thread List) */}
        <div className="w-full md:w-80 border-r border-[#DDD6C8] flex flex-col bg-[#F6F3EC]/50 shrink-0">
          <div className="p-3 border-b border-[#DDD6C8] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1F2A27]">Active Conversations</span>
            <span className="font-mono text-[10px] text-[#79827D]">Live Synced</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#EDE8DD]">
            {leads.slice(0, 10).map((item) => {
              const isSelected = item.id === lead.id;
              const hasMessages = item.messages.length > 0;
              const lastMessage = hasMessages
                ? item.messages[item.messages.length - 1].text
                : 'Form submission received...';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedLeadId(item.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-[#B4684A]' : 'hover:bg-[#EDE8DD]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-[#1F2A27] truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#79827D] font-mono shrink-0">
                      {item.lastTouch}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#79827D] truncate">{lastMessage}</p>
                  <div className="flex items-center justify-between mt-1.5 text-[10px]">
                    <span className="text-[#2F4A3F] font-medium">{item.communityName}</span>
                    <span className="uppercase text-[9px] bg-[#EDE8DD] px-1.5 py-0.2 rounded font-mono text-[#79827D]">
                      SMS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Pane (Message Stream) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBF9F4]">
          {/* Thread Header */}
          <div className="p-3.5 border-b border-[#DDD6C8] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <Avatar
                initials={lead.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
                size="md"
              />
              <div>
                <h3 className="font-semibold text-xs text-[#1F2A27] leading-tight">
                  {lead.name}
                </h3>
                <p className="text-[10px] text-[#79827D]">
                  {lead.phone} • {lead.communityName} • Assigned to {lead.ownerName}
                </p>
              </div>
            </div>

            {/* Take Over from Automation Button (§10.5) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutomationPaused(!automationPaused)}
                className={`text-xs px-2.5 py-1 rounded-[6px] font-semibold flex items-center gap-1.5 transition-colors ${
                  automationPaused
                    ? 'bg-[#F0DFD5] text-[#9B553B] border border-[#DFC3B3]'
                    : 'bg-[#E3EEE4] text-[#4C7A57] border border-[#C2DEC5]'
                }`}
              >
                {automationPaused ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Automation Paused</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5" />
                    <span>Bot Active (Click to Take Over)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TCPA Quiet-Hours Warning Banner (§10.5) */}
          <div className="px-4 py-2 bg-[#F5EBD0] border-b border-[#E8D4A2] text-xs text-[#8C6418] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#B98A2E]" />
              <span>
                TCPA Window Safeguard Active: Messages are compliant with 8:00 AM – 9:00 PM local time.
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold">Safe Guard</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {lead.messages.length === 0 ? (
              <div className="text-center py-12 text-[#79827D] text-xs italic">
                No active conversation history. Send a text or simulate a missed call.
              </div>
            ) : (
              lead.messages.map((msg) => {
                const isBuyer = msg.sender === 'buyer';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-[12px] px-3.5 py-2.5 text-xs leading-relaxed ${
                        isBuyer
                          ? 'bg-[#2F4A3F] text-white rounded-br-none'
                          : 'bg-white text-[#1F2A27] border border-[#DDD6C8] rounded-bl-none shadow-2xs'
                      }`}
                    >
                      {!isBuyer && (
                        <div className="flex items-center gap-1.5 mb-1">
                          {msg.isAutomated ? (
                            <span className="text-[9px] font-bold text-[#B4684A] bg-[#F0DFD5] px-1.5 py-0.2 rounded flex items-center gap-1 font-mono">
                              <Bot className="w-2.5 h-2.5" /> BOT AUTOMATION
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-[#2F4A3F] bg-[#E0E8E3] px-1.5 py-0.2 rounded flex items-center gap-1 font-mono">
                              <User className="w-2.5 h-2.5" /> COUNSELOR (DANA)
                            </span>
                          )}
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-[#79827D] mt-0.5 px-1">{msg.timestamp}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Replies Strip */}
          <div className="px-4 py-2 border-t border-[#EDE8DD] bg-[#F6F3EC]/80 flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-[10px] font-bold uppercase text-[#79827D] shrink-0">
              Quick Replies:
            </span>
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => setMessageInput(qr)}
                className="text-[11px] bg-white border border-[#DDD6C8] hover:border-[#2F4A3F] text-[#1F2A27] px-2.5 py-1 rounded-full whitespace-nowrap truncate max-w-xs transition-colors shrink-0"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Send Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[#DDD6C8] bg-white flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type message to buyer (Sends via local 704 area-code A2P line)..."
              className="flex-1 text-xs border border-[#DDD6C8] rounded-[8px] px-3.5 py-2.5 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
            />
            <Button type="submit" variant="clay" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
              Send
            </Button>
          </form>
        </div>

        {/* Right Pane (Buyer Details & Homesite Notes) */}
        <div className="hidden lg:flex w-72 border-l border-[#DDD6C8] bg-white flex-col p-4 space-y-4 shrink-0 overflow-y-auto">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D] block mb-1">
              Buyer Profile
            </span>
            <h4 className="font-serif text-base font-semibold text-[#1F2A27]">{lead.name}</h4>
            <p className="text-xs text-[#79827D]">{lead.email}</p>
          </div>

          <div className="p-3 rounded-[10px] bg-[#F6F3EC] border border-[#DDD6C8] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#79827D]">Community:</span>
              <span className="font-semibold text-[#1F2A27]">{lead.communityName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#79827D]">Budget:</span>
              <span className="font-semibold text-[#1F2A27]">{lead.budgetRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#79827D]">Timeline:</span>
              <span className="font-semibold text-[#1F2A27]">{lead.timeline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#79827D]">Pre-Approved:</span>
              <span className={`font-semibold ${lead.preApproved ? 'text-[#4C7A57]' : 'text-[#A5473B]'}`}>
                {lead.preApproved ? 'Yes' : 'Needs Lender'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D] block mb-1.5">
              Active Tags
            </span>
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((t, idx) => (
                <Badge key={idx} variant="neutral">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#EDE8DD]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D] block mb-1">
              Counselor Notes
            </span>
            <p className="text-xs text-[#4A5550] leading-relaxed bg-[#FBF9F4] p-2.5 rounded border border-[#DDD6C8]">
              {lead.notes[0] || 'No notes logged yet.'}
            </p>
          </div>
        </div>
      </div>

      {/* Missed-Call Modal Simulator (§10.2) */}
      <Modal
        isOpen={showMissedCallModal}
        onClose={() => setShowMissedCallModal(false)}
        title="Simulated Inbound Missed Call"
        subtitle="Automatic 3-Second Text-Back Flow"
      >
        <div className="space-y-4 text-xs text-[#1F2A27]">
          {missedCallRingStep === 'ringing' ? (
            <div className="p-6 text-center space-y-3 bg-[#F6F3EC] rounded-[12px] border border-[#DDD6C8]">
              <div className="w-12 h-12 rounded-full bg-[#B4684A] text-white flex items-center justify-center mx-auto animate-bounce">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-semibold">Incoming Call from {lead.phone}</h4>
              <p className="text-xs text-[#79827D]">
                Sales counselors busy on model home tour... Call unanswered.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-[#E3EEE4] border border-[#C2DEC5] rounded-[12px] space-y-2">
              <div className="flex items-center gap-2 text-[#4C7A57] font-bold">
                <CheckCircle2 className="w-4 h-4" /> Missed-Call Text-Back Sent in 2.5s
              </div>
              <p className="text-xs text-[#1F2A27] bg-white p-3 rounded border border-[#C2DEC5]">
                "Sorry we missed your call! This is Alder & Stone Homes. How can we help? Looking to tour a model home or ask about lot availability?"
              </p>
              <p className="text-[11px] text-[#4C7A57] font-medium">
                Buyer can now reply with "Saturday" or "Lot pricing" to trigger smart slot bookings!
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setShowMissedCallModal(false)}>
              Close Simulator
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
