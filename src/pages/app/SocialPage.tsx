import React, { useState } from 'react';
import { initialSocialPosts } from '../../data/posts';
import { SocialPost } from '../../types';
import { useDemoStore } from '../../store/demoStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Drawer } from '../../components/ui/Drawer';
import {
  Share2,
  Calendar,
  Plus,
  Sparkles,
  Bot,
  Heart,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { CommentToLeadMini } from '../../components/marketing/CommentToLeadMini';

export const SocialPage: React.FC = () => {
  const { addToast } = useDemoStore();
  const [posts, setPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'facebook' | 'google_business'>('instagram');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Model Home Tour');
  const [autopilotActive, setAutopilotActive] = useState(true);

  const evergreenQueues = [
    { title: 'Model Home Walkthroughs', count: 6, tag: 'Visual Aesthetic' },
    { title: 'Behind The Drywall (Quality)', count: 4, tag: 'Craftsmanship' },
    { title: 'Financing & Rate Buydowns', count: 5, tag: 'Movement Mortgage' },
    { title: 'Homeowner Testimonials', count: 4, tag: 'Social Proof' },
    { title: 'Community Greenways & Schools', count: 3, tag: 'Location' },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      platform: selectedPlatform,
      date: '2026-10-18',
      time: '01:30 PM',
      status: 'scheduled',
      caption,
      category,
      imageTheme: 'Architectural Exterior',
    };

    setPosts([newPost, ...posts]);
    setComposerOpen(false);
    setCaption('');
    addToast('Post Scheduled', `Added to ${selectedPlatform.toUpperCase()} queue for Oct 18.`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Social Media Planner & Lead Bots
            </h1>
            <Badge variant="clay">Evergreen Queue Active</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Auto-schedules 14–30 days of high-aesthetic builder posts with instant keyword lead capture.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Autopilot toggle (§10.8) */}
          <div className="flex items-center gap-2 bg-[#FBF9F4] p-2 rounded-[10px] border border-[#DDD6C8] text-xs">
            <span className="font-medium text-[#1F2A27]">Autopilot Mode:</span>
            <button
              onClick={() => {
                setAutopilotActive(!autopilotActive);
                addToast(
                  'Autopilot Toggled',
                  autopilotActive ? 'Autopilot paused.' : 'Autopilot queued 14 days of content.',
                  'info'
                );
              }}
              className={`px-2 py-0.5 rounded font-semibold text-xs ${
                autopilotActive ? 'bg-[#E3EEE4] text-[#4C7A57]' : 'bg-[#EDE8DD] text-[#79827D]'
              }`}
            >
              {autopilotActive ? 'Active (14 Days)' : 'Paused'}
            </button>
          </div>

          <Button
            variant="clay"
            size="sm"
            onClick={() => setComposerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create New Post
          </Button>
        </div>
      </div>

      {/* Special Ad Category: Housing Compliance Alert Chip (§10.8) */}
      <div className="p-3.5 bg-[#E1EAF0] border border-[#BFD4E4] rounded-[12px] flex items-center justify-between text-xs text-[#36566E]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4B6A82]" />
          <span>
            <strong>Special Ad Category: Housing:</strong> Meta and Google paid boost rules are
            automatically checked to prevent discriminatory ZIP code or age targeting.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase font-bold bg-white px-2 py-0.5 rounded">
          HUD Compliant
        </span>
      </div>

      {/* Social Calendar & Content Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): 14-Day Post Grid */}
        <div className="lg:col-span-8 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDE8DD]">
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2F4A3F]" /> October 2026 Scheduled Stream
            </h3>
            <span className="text-xs text-[#79827D]">Drag or tap to reschedule</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.map((post) => {
              const isPublished = post.status === 'published';

              return (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-3 shadow-2xs hover:border-[#C5BCA9] transition-all"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span
                      className={`font-bold font-mono px-2 py-0.5 rounded uppercase ${
                        post.platform === 'instagram'
                          ? 'bg-[#F0DFD5] text-[#9B553B]'
                          : post.platform === 'facebook'
                          ? 'bg-[#E1EAF0] text-[#36566E]'
                          : 'bg-[#E0E8E3] text-[#2F4A3F]'
                      }`}
                    >
                      {post.platform.replace('_', ' ')}
                    </span>
                    <span className="text-[#79827D] font-mono">
                      {post.date} • {post.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#1F2A27] line-clamp-3 leading-relaxed">
                    {post.caption}
                  </p>

                  <div className="pt-2 border-t border-[#F6F3EC] flex items-center justify-between text-[11px] text-[#79827D]">
                    <span className="font-medium text-[#2F4A3F]">{post.category}</span>
                    <span
                      className={`font-semibold ${
                        isPublished ? 'text-[#4C7A57]' : 'text-[#B4684A]'
                      }`}
                    >
                      {isPublished ? 'Published' : 'Scheduled'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Evergreen Content Queue */}
        <div className="lg:col-span-4 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#C5BCA9] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE8DD] pb-3">
            <h3 className="font-serif text-lg text-[#1F2A27] font-medium">Content Queue</h3>
            <Badge variant="clay">Autopilot</Badge>
          </div>

          <p className="text-xs text-[#79827D] leading-relaxed">
            The Groundwork content library cycles these 5 proven home-builder pillars so your channels
            never go dormant.
          </p>

          <div className="space-y-2.5">
            {evergreenQueues.map((eq, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-[#1F2A27]">{eq.title}</h4>
                  <span className="text-[10px] text-[#79827D]">{eq.tag}</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#2F4A3F] bg-[#E0E8E3] px-2 py-0.5 rounded">
                  {eq.count} Queued
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Live Comment-to-Lead Simulator Section */}
      <CommentToLeadMini />

      {/* Composer Drawer */}
      <Drawer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="Schedule New Post"
        subtitle="Multi-platform publishing to Instagram, Facebook & Google Business"
        width="lg"
      >
        <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#79827D] mb-1">
              Publishing Platforms
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['instagram', 'facebook', 'google_business'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`p-2.5 rounded-[8px] border text-center font-semibold capitalize transition-all ${
                    selectedPlatform === p
                      ? 'bg-[#2F4A3F] text-white border-[#243A31]'
                      : 'bg-white text-[#1F2A27] border-[#DDD6C8]'
                  }`}
                >
                  {p.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#79827D] mb-1">
              Content Pillar / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2.5 text-[#1F2A27] bg-white focus:outline-none"
            >
              <option>Model Home Tour</option>
              <option>Behind Drywall / Quality</option>
              <option>Rate Buydowns / Financing</option>
              <option>Buyer Testimonial</option>
              <option>Community Update</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#79827D] mb-1">
              Caption (Include keyword prompt like 'Comment "PRICE"')
            </label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Experience the natural light in The Calder gourmet kitchen... Comment 'PRICE' for instant lookbook link!"
              className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-3 text-[#1F2A27] bg-white focus:outline-none focus:border-[#2F4A3F]"
            />
          </div>

          <div className="p-3 bg-[#E1EAF0] rounded-[8px] border border-[#BFD4E4] text-[11px] text-[#36566E]">
            Suggested posting time: <strong>Today at 11:30 AM (Peak Carolinas Engagement)</strong>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setComposerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="clay" size="sm">
              Schedule Post
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
