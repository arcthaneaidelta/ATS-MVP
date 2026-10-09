import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Heart, MessageCircle, Send, Bookmark, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommentToLeadMini: React.FC = () => {
  const { addLead } = useDemoStore();
  const [commentInput, setCommentInput] = useState('PRICE');
  const [commentList, setCommentList] = useState<Array<{ user: string; text: string; isBot?: boolean }>>([
    { user: 'carolina_curated', text: 'Stunning kitchen island layout! 😍' },
  ]);
  const [dmReceived, setDmReceived] = useState<string | null>(null);
  const [contactCreated, setContactCreated] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || isProcessing) return;

    setIsProcessing(true);
    const userText = commentInput.trim();

    // 1. Post user's comment
    setCommentList((prev) => [...prev, { user: 'you', text: userText }]);
    setCommentInput('');

    // 2. Automated Public Reply (after 1s)
    setTimeout(() => {
      setCommentList((prev) => [
        ...prev,
        {
          user: 'alderstonehomes',
          text: 'Just sent you a private DM with the complete Harlow Creek pricing sheet & floor plans!',
          isBot: true,
        },
      ]);
    }, 1000);

    // 3. Automated Private DM & CRM contact creation (after 2s)
    setTimeout(() => {
      setDmReceived(
        'Hey there! Thanks for asking about The Calder at Harlow Creek in Fort Mill. Starting from $449,900. Tap here to view the floor plan & virtual tour: aldr.st/calder-vip'
      );
      setContactCreated(true);
      setIsProcessing(false);

      // Ingest contact into store
      addLead({
        name: 'Instagram Buyer (@you)',
        phone: '(704) 555-0199',
        email: 'ig.buyer@instagram.mock',
        communityName: 'Harlow Creek',
        communityId: 'harlow-creek',
        planName: 'The Calder',
        planId: 'calder',
        budgetRange: '$450k – $520k',
        score: 'Warm',
        stage: 'new',
        source: 'Instagram Organic',
        notes: ['Converted via Instagram Comment-to-Lead keyword trigger: PRICE.'],
        tags: ['Instagram Lead', 'Comment-to-Lead', 'Keyword: PRICE'],
      });
    }, 2200);
  };

  const handleReset = () => {
    setCommentList([{ user: 'carolina_curated', text: 'Stunning kitchen island layout! 😍' }]);
    setCommentInput('PRICE');
    setDmReceived(null);
    setContactCreated(false);
  };

  return (
    <section className="py-20 bg-[#FBF9F4] border-t border-b border-[#DDD6C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Instagram Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm bg-white rounded-[16px] border border-[#DDD6C8] shadow-[0_4px_12px_rgba(31,42,39,0.08)] overflow-hidden">
              {/* Post Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-[#EDE8DD]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#2F4A3F] text-white flex items-center justify-center text-xs font-serif font-bold">
                    A&S
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1F2A27]">alderstonehomes</h4>
                    <p className="text-[10px] text-[#79827D]">Harlow Creek • Fort Mill, SC</p>
                  </div>
                </div>
                <Badge variant="pine">Verified Builder</Badge>
              </div>

              {/* Post Image Container */}
              <div className="w-full h-52 bg-[#EDE8DD] relative flex flex-col items-center justify-center p-6 text-center border-b border-[#DDD6C8]">
                {/* Architectural Blueprint Rendering */}
                <div className="w-16 h-16 rounded-full bg-[#E0E8E3] border border-[#C5D5CC] flex items-center justify-center text-[#2F4A3F] mb-2">
                  <Sparkles className="w-7 h-7 text-[#B4684A]" />
                </div>
                <div className="font-serif text-base text-[#1F2A27] font-medium">The Calder Model Home</div>
                <div className="text-[11px] text-[#79827D]">4 Bed • 3 Bath • 2,480 Sq Ft • Fort Mill, SC</div>
                <span className="mt-2 text-[9px] bg-white/90 text-[#2F4A3F] px-2 py-0.5 rounded-full font-mono border border-[#DDD6C8]">
                  From $449,900
                </span>
              </div>

              {/* Action Icons Bar */}
              <div className="px-3.5 pt-3 pb-2 flex items-center justify-between text-[#1F2A27]">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#A5473B] fill-current" />
                  <MessageCircle className="w-4 h-4" />
                  <Send className="w-4 h-4" />
                </div>
                <Bookmark className="w-4 h-4 text-[#79827D]" />
              </div>

              {/* Caption */}
              <div className="px-3.5 pb-2 text-xs leading-relaxed text-[#1F2A27]">
                <p>
                  <strong className="font-semibold mr-1.5">alderstonehomes</strong>
                  That natural Carolina sunlight streaming through The Calder kitchen ✨ Comment{' '}
                  <span className="font-bold text-[#B4684A] bg-[#F0DFD5] px-1 rounded">PRICE</span>{' '}
                  below and our team will DM you the floor plan and current lot availability! 🏡
                </p>
              </div>

              {/* Comments Feed */}
              <div className="px-3.5 py-2 max-h-36 overflow-y-auto space-y-1.5 text-[11px] bg-[#FBF9F4] border-t border-b border-[#EDE8DD]">
                {commentList.map((c, i) => (
                  <div key={i} className="leading-tight">
                    <span className="font-semibold text-[#1F2A27] mr-1.5">
                      {c.user === 'alderstonehomes' ? '@alderstonehomes' : `@${c.user}`}
                    </span>
                    <span className={c.isBot ? 'text-[#2F4A3F] font-medium' : 'text-[#4A5550]'}>
                      {c.text}
                    </span>
                    {c.isBot && (
                      <span className="ml-1 text-[8px] bg-[#E0E8E3] text-[#2F4A3F] px-1 py-0.2 rounded font-semibold">
                        BOT
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Post Comment Input */}
              <form onSubmit={handlePostComment} className="p-2.5 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder='Try typing "PRICE"...'
                  className="flex-1 text-xs border border-[#DDD6C8] rounded-full px-3 py-1.5 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="clay"
                  disabled={!commentInput.trim() || isProcessing}
                  isLoading={isProcessing}
                >
                  Post
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Explainer & CRM Result */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0E8E3] text-[#2F4A3F] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Social Media Automation
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal leading-tight">
                Turn Casual Instagram & Facebook Comments into Direct Pipeline Leads
              </h2>
              <p className="text-sm text-[#4A5550] mt-3 leading-relaxed">
                Most builders post photos that get likes, but zero booked tours. Groundwork monitors
                comments 24/7. When a buyer asks for pricing or a floor plan, the system instantly
                replies, sends a personalized DM, and automatically creates a tracked CRM contact.
              </p>
            </div>

            {/* Results Card */}
            <div className="bg-white p-5 rounded-[12px] border border-[#DDD6C8] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A5550] flex items-center justify-between">
                <span>Under The Hood Architecture:</span>
                {contactCreated && (
                  <span className="text-[#4C7A57] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Contact Ingested
                  </span>
                )}
              </h4>

              {dmReceived ? (
                <div className="bg-[#E3EEE4] border border-[#C2DEC5] p-3.5 rounded-[10px] space-y-2 animate-in fade-in duration-200">
                  <div className="text-xs font-semibold text-[#2F4A3F] flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Direct Message Dispatched via Meta API
                  </div>
                  <p className="text-xs text-[#1F2A27] bg-white p-2.5 rounded border border-[#C2DEC5]">
                    "{dmReceived}"
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#4C7A57] font-medium">
                      Tagged: Source: Instagram Organic • Stage: New Inquiry
                    </span>
                    <Link to="/app/pipeline">
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                        View in CRM Pipeline
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#79827D] italic">
                  Type "PRICE" in the comment box on the left to see the live bot trigger in action.
                </p>
              )}

              {contactCreated && (
                <div className="pt-2 text-right">
                  <button
                    onClick={handleReset}
                    className="text-xs text-[#79827D] hover:text-[#1F2A27] underline"
                  >
                    Reset Comment Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
