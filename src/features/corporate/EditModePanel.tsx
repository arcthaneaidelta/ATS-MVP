import React, { useState } from 'react';
import { useCmsStore } from '../../store/cms';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import {
  FileText,
  Search,
  History,
  CheckCircle2,
  Globe,
  Share2,
  X,
  UploadCloud,
} from 'lucide-react';

export const EditModePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'history'>('seo');
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const {
    heroLabel,
    setHeroLabel,
    heroHeadline,
    setHeroHeadline,
    heroLead,
    setHeroLead,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    canonicalUrl,
    setCanonicalUrl,
    history,
    restoreVersion,
    publishToStaging,
    lastPublishedAt,
  } = useCmsStore();

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 600));
    publishToStaging();
    setIsPublishing(false);
    toast('Published to staging environment!', 'success');
  };

  const checklist = [
    { label: 'Single H1 tag configured', passed: true },
    { label: 'Meta title within optimal limit (≤60 chars)', passed: seoTitle.length <= 60 && seoTitle.length > 10 },
    { label: 'Meta description within optimal limit (≤160 chars)', passed: seoDescription.length <= 160 && seoDescription.length > 20 },
    { label: 'JSON-LD Organization schema active', passed: true },
    { label: 'XML Sitemap & canonical tag mapped', passed: true },
  ];

  return (
    <div className="fixed top-20 right-6 bottom-24 z-40 w-96 bg-elevated rounded-xl border border-line shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-line flex items-center justify-between bg-surface/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
            <h3 className="text-xs uppercase tracking-wider font-bold text-ink">
              CMS & SEO Control Panel
            </h3>
          </div>
          <p className="text-[11px] text-ink-3">Live in-place editing enabled</p>
        </div>

        <Button
          variant="primary"
          size="sm"
          isLoading={isPublishing}
          onClick={handlePublish}
          icon={<UploadCloud className="w-3.5 h-3.5" />}
        >
          Publish
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line text-xs font-sans font-medium bg-bg">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'content'
              ? 'border-clay text-clay bg-elevated font-semibold'
              : 'border-transparent text-ink-3 hover:text-ink'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Content</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'seo'
              ? 'border-clay text-clay bg-elevated font-semibold'
              : 'border-transparent text-ink-3 hover:text-ink'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>SEO & Social</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-clay text-clay bg-elevated font-semibold'
              : 'border-transparent text-ink-3 hover:text-ink'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History ({history.length})</span>
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        {activeTab === 'content' && (
          <div className="space-y-3">
            <Input
              label="Hero Eyebrow Label"
              value={heroLabel}
              onChange={(e) => setHeroLabel(e.target.value)}
            />
            <Textarea
              label="Hero Display H1 Headline"
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              rows={2}
            />
            <Textarea
              label="Hero Subtitle / Lead Paragraph"
              value={heroLead}
              onChange={(e) => setHeroLead(e.target.value)}
              rows={4}
            />
            <div className="p-3 rounded-md bg-clay-tint/50 border border-clay/20 text-ink-2">
              <p className="font-semibold text-clay mb-0.5">Tip: In-line Clicking</p>
              <p className="text-[11px]">
                You can also click directly on the hero text on the homepage to edit content live!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <Input
                label="SEO Meta Title"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                hint={`${seoTitle.length}/60 recommended characters`}
              />
            </div>

            <div>
              <Textarea
                label="Meta Description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                charCount={seoDescription.length}
                maxChars={160}
                rows={3}
              />
            </div>

            <div>
              <Input
                label="Canonical URL"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />
            </div>

            {/* Google Search Snippet Preview */}
            <div className="p-3 rounded-lg border border-line bg-surface">
              <div className="flex items-center gap-1.5 text-[11px] text-ink-3 mb-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>Google Search Snippet Preview</span>
              </div>
              <div className="bg-white p-3 rounded border border-line text-left space-y-1">
                <div className="text-[11px] text-ink-3 truncate">
                  {canonicalUrl}
                </div>
                <div className="text-sm font-medium text-[#1a0dab] hover:underline line-clamp-1 leading-snug">
                  {seoTitle || 'BionicIQ Ecosystem'}
                </div>
                <div className="text-xs text-ink-2 line-clamp-2 leading-relaxed">
                  {seoDescription || 'Add a meta description to preview how your page appears in search results.'}
                </div>
              </div>
            </div>

            {/* Social Card Preview */}
            <div className="p-3 rounded-lg border border-line bg-surface">
              <div className="flex items-center gap-1.5 text-[11px] text-ink-3 mb-1.5 font-medium">
                <Share2 className="w-3.5 h-3.5 text-clay" />
                <span>OpenGraph Social Card Preview</span>
              </div>
              <div className="bg-white rounded border border-line overflow-hidden text-left">
                <div className="h-24 bg-primary text-surface p-3 flex flex-col justify-between">
                  <span className="font-serif text-lg leading-tight line-clamp-2">
                    {seoTitle}
                  </span>
                  <span className="text-[10px] text-clay-tint uppercase tracking-wider">
                    bioniciq.example
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-ink truncate">{seoTitle}</p>
                  <p className="text-[11px] text-ink-3 line-clamp-1 mt-0.5">{seoDescription}</p>
                </div>
              </div>
            </div>

            {/* Live SEO Checklist */}
            <div className="p-3 rounded-lg border border-line bg-bg space-y-1.5">
              <h4 className="text-[10px] uppercase tracking-wider font-bold text-ink-3 mb-2">
                SEO Technical Checklist
              </h4>
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="text-ink-2">{item.label}</span>
                  {item.passed ? (
                    <span className="flex items-center gap-1 text-ok font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      Pass
                    </span>
                  ) : (
                    <span className="text-warn text-[10px] font-bold">Review</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <p className="text-[11px] text-ink-3">
              Last published: {lastPublishedAt || 'Never'}
            </p>
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-line bg-surface space-y-1.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink text-xs">{item.timestamp}</span>
                  <button
                    type="button"
                    onClick={() => {
                      restoreVersion(idx);
                      toast('Version restored!', 'info');
                    }}
                    className="text-xs font-semibold text-clay hover:underline"
                  >
                    Restore
                  </button>
                </div>
                <p className="text-xs text-ink-2 line-clamp-1 italic">"{item.headline}"</p>
                <p className="text-[11px] text-ink-3 truncate">{item.seoTitle}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
