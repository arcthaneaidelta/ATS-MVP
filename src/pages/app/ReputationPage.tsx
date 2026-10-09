import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  Star,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Send,
  User,
} from 'lucide-react';

export const ReputationPage: React.FC = () => {
  const { addToast } = useDemoStore();
  const [ratingInput, setRatingInput] = useState<number | null>(5);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const reviews = [
    {
      author: 'Brenda & Travis Vance',
      community: 'Marrow Ridge (Lot 04)',
      plan: 'The Vance',
      stars: 5,
      date: '2 weeks ago',
      text: 'From our first visit to handing over the keys, Robert and Dana made building our dream home feel effortless. The 2x6 construction and conditioned crawlspace make the house whisper quiet. Highly recommend Alder & Stone!',
    },
    {
      author: 'David & Sarah Jenkins',
      community: 'Harlow Creek (Lot 19)',
      plan: 'The Calder',
      stars: 5,
      date: '1 month ago',
      text: 'Priya was fantastic throughout our selections process. Moving into Fort Mill was the best decision for our kids, and the quality of finishes exceeded our expectations.',
    },
    {
      author: 'Walter & Ruth Kessler',
      community: 'Harlow Creek (Lot 22)',
      plan: 'The Linden',
      stars: 5,
      date: '2 months ago',
      text: 'Downsizing from a large home in South Charlotte was daunting, but the single-story Linden design gave us everything on one level with zero steps. Beautiful workmanship.',
    },
  ];

  const handleSimulateRating = (stars: number) => {
    setRatingInput(stars);
    setFeedbackSent(true);

    if (stars >= 4) {
      addToast(
        '5-Star Rating Received!',
        'Redirected buyer directly to Alder & Stone Google Business Profile review link.',
        'success'
      );
    } else {
      addToast(
        'Private Feedback Intercepted',
        '3-star score routed to Robert Alder for immediate executive resolution. Protected Google rating.',
        'warning'
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Reputation & Google Review Generator
            </h1>
            <Badge variant="clay">4.9 Star Aggregate</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Automated post-closing review request engine with smart sentiment filtering.
          </p>
        </div>
      </div>

      {/* Overview Rating Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F5EBD0] text-[#B98A2E] flex items-center justify-center font-bold text-lg">
            4.9
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#B98A2E]">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <div className="text-xs font-semibold text-[#1F2A27] mt-0.5">Google Business Rating</div>
            <p className="text-[10px] text-[#79827D]">Based on 58 verified reviews</p>
          </div>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8] space-y-1">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Review Request Conversion</div>
          <div className="font-serif text-2xl text-[#1F2A27] font-semibold">68.4%</div>
          <p className="text-[10px] text-[#4C7A57] font-medium">Homeowners who complete review via SMS</p>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8] space-y-1">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Sentiment Filter Protected</div>
          <div className="font-serif text-2xl text-[#2F4A3F] font-semibold">100%</div>
          <p className="text-[10px] text-[#79827D]">Sub-4 star ratings caught privately before Google</p>
        </div>
      </div>

      {/* Interactive Review Routing Simulator (PRD §10.10) */}
      <div className="bg-[#1F2A27] text-white p-6 sm:p-8 rounded-[16px] border border-[#3E4E49] space-y-5">
        <div className="border-b border-[#34423E] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-[#B4684A] tracking-wider">
              Smart Sentiment Filter Simulator
            </span>
          </div>
          <h3 className="font-serif text-2xl text-white font-medium mt-1">
            Test What Happens When a Homeowner Rates 1 to 5 Stars
          </h3>
          <p className="text-xs text-[#A7B3AE] mt-1 max-w-xl">
            14 days after closing, homeowners receive an automated text from Robert Alder asking how their
            experience was. Click a star rating below to see the intelligent branch logic:
          </p>
        </div>

        {/* Star Rating Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {[1, 2, 3, 4, 5].map((stars) => (
            <button
              key={stars}
              onClick={() => handleSimulateRating(stars)}
              className={`px-4 py-2.5 rounded-[10px] font-semibold text-xs flex items-center gap-1.5 transition-all ${
                ratingInput === stars
                  ? 'bg-[#B4684A] text-white ring-2 ring-white shadow-md'
                  : 'bg-[#263330] text-[#C5D5CC] hover:bg-[#34423E]'
              }`}
            >
              <span>{stars}</span>
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          ))}
        </div>

        {/* Branch Outcome Preview */}
        {ratingInput !== null && (
          <div className="bg-[#263330] p-4 rounded-[12px] border border-[#3E4E49] space-y-2 text-xs">
            {ratingInput >= 4 ? (
              <div className="space-y-1.5 text-[#E3EEE4]">
                <div className="flex items-center gap-2 text-[#4C7A57] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" /> 5-Star Outcome: Direct Google Business Profile Link
                </div>
                <p className="text-[#C5D5CC] leading-relaxed">
                  "Thank you so much! We are thrilled you love your new home. Would you take 60 seconds to copy this feedback to our Google Business Profile page? It means the world to our family business: aldr.st/review-google"
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 text-[#F3DEDA]">
                <div className="flex items-center gap-2 text-[#A5473B] font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" /> ≤3-Star Outcome: Private Feedback Form & Robert Alder Alert
                </div>
                <p className="text-[#C5D5CC] leading-relaxed">
                  "We are so sorry everything was not perfect. Robert Alder has been personally notified and will call you today to ensure any open punch-list items are resolved immediately. Please tell us what needs attention: aldr.st/vip-service"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Reviews Feed */}
      <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4">
        <h3 className="font-serif text-xl text-[#1F2A27] font-medium">Recent Homeowner Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2.5 text-xs shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-[#1F2A27]">{rev.author}</h4>
                  <span className="text-[10px] text-[#79827D] block">{rev.community}</span>
                </div>
                <div className="flex text-[#B98A2E]">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-[#4A5550] leading-relaxed italic">"{rev.text}"</p>
              <div className="text-[10px] text-[#79827D] pt-1 border-t border-[#F6F3EC]">
                {rev.date} • Verified Homeowner
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
