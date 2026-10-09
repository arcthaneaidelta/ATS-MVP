import React, { useState, useEffect } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { academyChapters } from '../../data/chapters';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Volume2,
  Maximize2,
  RotateCcw,
  SkipForward,
  Sparkles,
} from 'lucide-react';

export const AcademyPage: React.FC = () => {
  const { completedChapters, toggleChapterComplete } = useDemoStore();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<'checklist' | 'transcript' | 'resources'>('checklist');

  const currentChapter = academyChapters[activeChapterIndex];
  const totalChapters = academyChapters.length;
  const completedCount = completedChapters.length;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  // Playback timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => {
          const maxSec = currentChapter.durationMinutes * 60;
          if (prev >= maxSec) {
            setIsPlaying(false);
            if (!completedChapters.includes(currentChapter.id)) {
              toggleChapterComplete(currentChapter.id);
            }
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentChapter, completedChapters, toggleChapterComplete]);

  // Keyboard shortcut listener (Space, Left/Right arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        setCurrentSeconds((s) => Math.min(currentChapter.durationMinutes * 60, s + 10));
      } else if (e.code === 'ArrowLeft') {
        setCurrentSeconds((s) => Math.max(0, s - 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pt-28 pb-20 bg-[#F6F3EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="clay">Deliverable #8</Badge>
              <span className="text-xs text-[#79827D] font-mono">60:00 Complete Handover</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1F2A27] font-normal mt-2">
              Alder & Stone Team Academy
            </h1>
            <p className="text-sm text-[#4A5550] mt-2 max-w-xl">
              A comprehensive 60-minute video training curriculum so your team can run the CRM,
              automate speed-to-lead, and manage tours without ongoing freelancer dependency.
            </p>
          </div>

          {/* Progress Ring Widget */}
          <div className="bg-[#FBF9F4] p-4 rounded-[14px] border border-[#DDD6C8] flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#DDD6C8" strokeWidth="3" fill="none" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#4C7A57"
                  strokeWidth="3"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-[#1F2A27]">
                {progressPercent}%
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1F2A27]">
                {completedCount} of {totalChapters} Chapters Completed
              </div>
              <p className="text-[11px] text-[#79827D]">Progress saved in browser storage</p>
            </div>
          </div>
        </div>

        {/* Video Player + Chapter List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column (8 cols): Custom 16:9 Video Player */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video w-full rounded-[16px] overflow-hidden bg-[#1F2A27] border border-[#3A4743] shadow-[0_16px_40px_rgba(31,42,39,0.18)] flex flex-col justify-between p-6 sm:p-8 select-none">
              {/* Top Bar inside Player */}
              <div className="flex items-center justify-between text-white relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold bg-[#B4684A] px-2 py-0.5 rounded">
                    CHAPTER {currentChapter.number}
                  </span>
                  <span className="text-xs text-[#C5D5CC] truncate max-w-xs sm:max-w-md">
                    {currentChapter.title}
                  </span>
                </div>
                <Badge variant="pine">1080p HD Video</Badge>
              </div>

              {/* Animated Screen-Recording Visual Simulation */}
              <div className="my-auto text-center relative z-10 space-y-3">
                <div
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B4684A] text-white flex items-center justify-center mx-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </div>
                <div className="text-white font-serif text-lg sm:text-xl font-medium">
                  {currentChapter.title}
                </div>
                <p className="text-xs text-[#A7B3AE] max-w-md mx-auto">
                  {isPlaying ? 'Video playing (Press Space to pause)' : 'Click play or press Spacebar'}
                </p>
              </div>

              {/* Video Player Controls Bar */}
              <div className="relative z-10 space-y-2 pt-4 border-t border-white/10">
                {/* Progress Scrubber */}
                <div
                  className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    setCurrentSeconds(pct * (currentChapter.durationMinutes * 60));
                  }}
                >
                  <div
                    className="h-full bg-[#B4684A] transition-all duration-100"
                    style={{
                      width: `${(currentSeconds / (currentChapter.durationMinutes * 60)) * 100}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#C5D5CC]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-[#B4684A]"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px]">
                      {formatTime(currentSeconds)} / {currentChapter.durationMinutes}:00
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Playback speed */}
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      {[1, 1.25, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-1.5 py-0.5 rounded ${
                            playbackSpeed === spd
                              ? 'bg-[#B4684A] text-white font-bold'
                              : 'text-[#A7B3AE] hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (!completedChapters.includes(currentChapter.id)) {
                          toggleChapterComplete(currentChapter.id);
                        }
                      }}
                      className="text-[11px] font-semibold text-[#4C7A57] bg-[#E3EEE4] px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Done
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Details Tabs (Checklist / Transcript / Resources) */}
            <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EDE8DD] pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                      activeTab === 'checklist'
                        ? 'bg-[#2F4A3F] text-white'
                        : 'text-[#4A5550] hover:bg-[#EDE8DD]'
                    }`}
                  >
                    Action Checklist
                  </button>
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                      activeTab === 'transcript'
                        ? 'bg-[#2F4A3F] text-white'
                        : 'text-[#4A5550] hover:bg-[#EDE8DD]'
                    }`}
                  >
                    Video Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                      activeTab === 'resources'
                        ? 'bg-[#2F4A3F] text-white'
                        : 'text-[#4A5550] hover:bg-[#EDE8DD]'
                    }`}
                  >
                    Downloadable SOPs
                  </button>
                </div>

                <span className="text-[11px] text-[#79827D] font-mono">
                  Runtime: {currentChapter.durationMinutes} min
                </span>
              </div>

              {activeTab === 'checklist' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2A27]">
                    Key Skills Mastered in Chapter {currentChapter.number}:
                  </h4>
                  <p className="text-xs text-[#4A5550] leading-relaxed">
                    {currentChapter.summary}
                  </p>
                  <div className="space-y-2 pt-1">
                    {currentChapter.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#2F4A3F]">
                        <CheckCircle2 className="w-4 h-4 text-[#4C7A57] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'transcript' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2A27]">
                    Exact Word-for-Word Audio Transcript:
                  </h4>
                  <div className="p-4 rounded-[10px] bg-white border border-[#DDD6C8] text-xs text-[#4A5550] leading-relaxed font-serif italic">
                    "{currentChapter.transcriptSnippet}"
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white rounded-[10px] border border-[#DDD6C8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#B4684A]" />
                      <div>
                        <div className="text-xs font-semibold text-[#1F2A27]">
                          Chapter {currentChapter.number} SOP Guide.pdf
                        </div>
                        <div className="text-[10px] text-[#79827D]">4-Page Printable PDF</div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="p-3.5 bg-white rounded-[10px] border border-[#DDD6C8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-[#2F4A3F]" />
                      <div>
                        <div className="text-xs font-semibold text-[#1F2A27]">
                          Role Cheat Sheet.pdf
                        </div>
                        <div className="text-[10px] text-[#79827D]">Laminated Desk Reference</div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Chapter List */}
          <div className="lg:col-span-4 bg-[#FBF9F4] p-5 rounded-[16px] border border-[#C5BCA9] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE8DD] pb-3">
              <div>
                <h3 className="font-serif text-lg text-[#1F2A27] font-medium">8 Training Chapters</h3>
                <p className="text-[11px] text-[#79827D]">60:00 Total Run Time</p>
              </div>
              <Badge variant="clay">Handover</Badge>
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {academyChapters.map((ch, idx) => {
                const isSelected = activeChapterIndex === idx;
                const isCompleted = completedChapters.includes(ch.id);

                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      setCurrentSeconds(0);
                    }}
                    className={`p-3.5 rounded-[12px] border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#2F4A3F] text-white border-[#243A31] shadow-xs'
                        : 'bg-white text-[#1F2A27] border-[#DDD6C8] hover:border-[#C5BCA9]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className={`font-mono text-[10px] font-semibold ${
                          isSelected ? 'text-[#C5D5CC]' : 'text-[#79827D]'
                        }`}
                      >
                        CHAPTER {ch.number}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono text-[10px] ${
                            isSelected ? 'text-[#C5D5CC]' : 'text-[#79827D]'
                          }`}
                        >
                          {ch.durationMinutes}:00
                        </span>
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleChapterComplete(ch.id);
                          }}
                          className="rounded text-[#4C7A57] cursor-pointer"
                        />
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold leading-snug">{ch.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
