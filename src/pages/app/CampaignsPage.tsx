import React, { useState } from 'react';
import { campaignTemplates } from '../../data/templates';
import { CampaignTemplate } from '../../types';
import { useDemoStore } from '../../store/demoStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  Mail,
  MessageSquare,
  Smartphone,
  Monitor,
  Send,
  Copy,
  CheckCircle2,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { addToast } = useDemoStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-stl-sms');
  const [channelFilter, setChannelFilter] = useState<'all' | 'email' | 'sms'>('all');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const selectedTemplate =
    campaignTemplates.find((t) => t.id === selectedTemplateId) || campaignTemplates[0];

  const filtered = campaignTemplates.filter((t) => {
    if (channelFilter !== 'all' && t.channel !== channelFilter) return false;
    return true;
  });

  const handleSendTest = () => {
    addToast(
      'Test Message Dispatched',
      `Sent test ${selectedTemplate.channel.toUpperCase()} to Robert Alder (704) 555-0101.`,
      'success'
    );
  };

  // Replace merge tags with sample values for live preview
  const previewBody = selectedTemplate.body
    .replace(/{{first_name}}/g, 'Marcus')
    .replace(/{{community}}/g, 'Harlow Creek')
    .replace(/{{community_address}}/g, '1042 Harlow Creek Way, Fort Mill, SC')
    .replace(/{{plan}}/g, 'The Calder')
    .replace(/{{agent_name}}/g, 'Dana Whitfield')
    .replace(/{{agent_phone}}/g, '(704) 555-0142')
    .replace(/{{tour_time}}/g, 'Saturday at 11:00 AM');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Email & SMS Template Library
            </h1>
            <Badge variant="clay">18 Builder Templates</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Pre-written, compliant copy tuned for home builders in the Carolinas. Live merge field testing.
          </p>
        </div>

        {/* Channel Filter */}
        <div className="flex items-center gap-2 bg-[#FBF9F4] p-1.5 rounded-[10px] border border-[#DDD6C8] text-xs">
          <button
            onClick={() => setChannelFilter('all')}
            className={`px-3 py-1.5 rounded-md font-semibold ${
              channelFilter === 'all'
                ? 'bg-[#2F4A3F] text-white'
                : 'text-[#4A5550] hover:text-[#1F2A27]'
            }`}
          >
            All (18)
          </button>
          <button
            onClick={() => setChannelFilter('email')}
            className={`px-3 py-1.5 rounded-md font-semibold ${
              channelFilter === 'email'
                ? 'bg-[#2F4A3F] text-white'
                : 'text-[#4A5550] hover:text-[#1F2A27]'
            }`}
          >
            Email Lookbooks
          </button>
          <button
            onClick={() => setChannelFilter('sms')}
            className={`px-3 py-1.5 rounded-md font-semibold ${
              channelFilter === 'sms'
                ? 'bg-[#2F4A3F] text-white'
                : 'text-[#4A5550] hover:text-[#1F2A27]'
            }`}
          >
            SMS Text Messages
          </button>
        </div>
      </div>

      {/* 2-Column: Template List on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Template Selector */}
        <div className="lg:col-span-5 bg-[#FBF9F4] p-4 rounded-[16px] border border-[#DDD6C8] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EDE8DD]">
            <span className="text-xs font-semibold text-[#1F2A27]">Templates by Journey Stage</span>
            <span className="text-[10px] font-mono text-[#79827D]">{filtered.length} Shown</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filtered.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplate.id;
              const isSms = tmpl.channel === 'sms';

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-3 rounded-[10px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#2F4A3F] text-white border-[#243A31] shadow-xs'
                      : 'bg-white text-[#1F2A27] border-[#DDD6C8] hover:border-[#C5BCA9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] uppercase font-bold font-mono px-1.5 py-0.2 rounded ${
                        isSelected
                          ? 'bg-[#3A5B4D] text-[#C5D5CC]'
                          : isSms
                          ? 'bg-[#F0DFD5] text-[#9B553B]'
                          : 'bg-[#E1EAF0] text-[#36566E]'
                      }`}
                    >
                      {tmpl.channel.toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? 'text-[#C5D5CC]' : 'text-[#79827D]'
                      }`}
                    >
                      {tmpl.stage}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold leading-snug">{tmpl.title}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 cols): Live Dynamic Preview with Desktop/Mobile Toggle */}
        <div className="lg:col-span-7 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#C5BCA9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE8DD] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={selectedTemplate.channel === 'sms' ? 'clay' : 'pine'}>
                  {selectedTemplate.channel.toUpperCase()}
                </Badge>
                <span className="text-xs text-[#79827D]">•</span>
                <span className="text-xs font-semibold text-[#1F2A27]">
                  {selectedTemplate.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Device Toggle */}
              <div className="flex items-center gap-1 bg-[#EDE8DD] p-1 rounded-md text-xs">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded ${
                    previewDevice === 'desktop' ? 'bg-white shadow-2xs' : 'text-[#79827D]'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded ${
                    previewDevice === 'mobile' ? 'bg-white shadow-2xs' : 'text-[#79827D]'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button variant="clay" size="sm" onClick={handleSendTest} leftIcon={<Send className="w-3 h-3" />}>
                Send Test
              </Button>
            </div>
          </div>

          {/* Merge Fields Chips Row (§10.7) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[#79827D] font-medium mr-1">Active Merge Chips:</span>
            {['{{first_name}}', '{{community}}', '{{plan}}', '{{agent_name}}'].map((tag) => (
              <span
                key={tag}
                className="bg-[#F0DFD5] text-[#9B553B] border border-[#DFC3B3] px-2 py-0.5 rounded font-mono text-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Template Details: Subject or Character Count */}
          {selectedTemplate.channel === 'email' ? (
            <div className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] text-xs space-y-1">
              <div>
                <span className="text-[#79827D] font-medium mr-2">Subject:</span>
                <strong className="text-[#1F2A27]">
                  {selectedTemplate.subject?.replace(/{{community}}/g, 'Harlow Creek')}
                </strong>
              </div>
              <div>
                <span className="text-[#79827D] font-medium mr-2">Preview Text:</span>
                <span className="text-[#4A5550]">{selectedTemplate.previewText}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 bg-white rounded-[10px] border border-[#DDD6C8] text-[11px] text-[#79827D]">
              <span>
                Length: <strong className="text-[#1F2A27] font-mono">{selectedTemplate.charCount} chars</strong>
              </span>
              <span>
                Segments: <strong className="text-[#1F2A27] font-mono">{selectedTemplate.segmentsCount || 1} segment</strong>
              </span>
              <span className="text-[#4C7A57] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> STOP Footer Compliant
              </span>
            </div>
          )}

          {/* Rendered Live Preview Screen */}
          <div
            className={`p-6 rounded-[14px] border border-[#DDD6C8] bg-white text-xs text-[#1F2A27] leading-relaxed transition-all ${
              previewDevice === 'mobile' ? 'max-w-sm mx-auto shadow-md rounded-[28px] border-4 border-[#1F2A27]' : ''
            }`}
          >
            <div className="whitespace-pre-line font-sans">{previewBody}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
