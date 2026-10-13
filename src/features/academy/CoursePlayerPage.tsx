import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  FileText,
  FileCheck,
  Check,
} from 'lucide-react';

export const CoursePlayerPage: React.FC = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const { courses, completedLessonIds, markLessonComplete } = useAcademyStore();
  const { toast } = useToast();

  const course = courses.find((c) => c.slug === slug) || courses[0];

  // Find active lesson
  let currentLesson = course.modules[0]?.lessons[0];
  let currentModuleTitle = course.modules[0]?.title;

  for (const mod of course.modules) {
    const found = mod.lessons.find((l) => l.id === id);
    if (found) {
      currentLesson = found;
      currentModuleTitle = mod.title;
      break;
    }
  }

  const isCompleted = completedLessonIds.includes(currentLesson.id);

  // Video playback simulation state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTimeSec, setCurrentTimeSec] = useState(42);
  const totalDurationSec = 14 * 60; // 14 minutes
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'transcript'>('notes');
  const [noteContent, setNoteContent] = useState(
    'Key takeaway: Always verify station line checks 60 minutes prior to doors open.'
  );
  const [isSavedNote, setIsSavedNote] = useState(true);

  // Real-time scrubber animation loop when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec((t) => {
          if (t >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }
          return t + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDurationSec]);

  // Keyboard navigation shortcuts per Section 7.6
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        setCurrentTimeSec((t) => Math.min(totalDurationSec, t + 5));
      } else if (e.code === 'ArrowLeft') {
        setCurrentTimeSec((t) => Math.max(0, t - 5));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [totalDurationSec]);

  const handleMarkComplete = () => {
    markLessonComplete(currentLesson.id);
    toast('Lesson marked complete! Progress synchronized.', 'success');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto text-left space-y-6 font-sans">
      {/* Breadcrumb top bar */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => navigate('/academy/app')}
            className="text-ink-3 hover:text-ink font-medium"
          >
            ← Student Dashboard
          </button>
          <span className="text-line-2">/</span>
          <span className="text-ink-2 font-serif font-bold">{course.title}</span>
          <span className="text-line-2">/</span>
          <span className="text-slate font-medium">{currentLesson.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ok-tint text-ok text-xs font-semibold">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Completed</span>
            </span>
          ) : (
            <Button variant="primary" size="sm" onClick={handleMarkComplete} className="bg-slate text-white">
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* 70/30 Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): 16:9 Video Canvas & Interactive Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* 16:9 Video Player Frame */}
          <div className="aspect-video w-full rounded-2xl bg-ink text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
            {/* Video Canvas Backdrop with Animated Pacing Rings */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#17231F] to-[#121B18] select-none">
              <div className="text-center space-y-2 p-6 z-10">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate/80">
                  LESSON VIDEO LECTURE
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-surface">
                  {currentLesson.title}
                </h3>
                <p className="text-xs text-surface/70 font-mono">
                  Instructor: {course.instructor} · High-Definition Masterclass
                </p>
                {/* Visual Audio Waveform Simulation */}
                <div className="flex items-center justify-center gap-1 h-8 pt-2">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-slate/60 rounded-full transition-all duration-150"
                      style={{
                        height: isPlaying ? `${Math.sin(i + currentTimeSec) * 12 + 16}px` : '4px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Video Controls Bar */}
            <div className="relative z-20 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent space-y-2">
              {/* Scrubber Bar */}
              <div
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group-hover:h-2 transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setCurrentTimeSec(Math.round(pct * totalDurationSec));
                }}
              >
                <div
                  className="h-full bg-clay transition-all"
                  style={{ width: `${(currentTimeSec / totalDurationSec) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-xs text-white/90">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 rounded hover:text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <span className="font-mono text-[11px] text-white/70">
                    {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  {/* Speed toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const speeds = [0.75, 1, 1.25, 1.5];
                      const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(next);
                      toast(`Playback speed set to ${next}x`, 'info');
                    }}
                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20"
                  >
                    {playbackSpeed}x
                  </button>

                  <button className="p-1 hover:text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Metadata */}
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-line">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate tracking-wider">
                  {currentModuleTitle}
                </span>
                <h2 className="font-serif text-2xl font-bold text-ink mt-0.5">
                  {currentLesson.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleMarkComplete}
                  className="bg-slate text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Mark Complete</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive Notes & Transcript Tabs */}
          <div className="p-6 rounded-2xl bg-elevated border border-line space-y-4">
            <div className="flex border-b border-line text-xs font-sans">
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-2 px-4 border-b-2 font-medium ${
                  activeTab === 'notes' ? 'border-slate text-slate font-bold' : 'border-transparent text-ink-3'
                }`}
              >
                Personal Notes (Autosaved)
              </button>
              <button
                onClick={() => setActiveTab('transcript')}
                className={`py-2 px-4 border-b-2 font-medium ${
                  activeTab === 'transcript' ? 'border-slate text-slate font-bold' : 'border-transparent text-ink-3'
                }`}
              >
                Lesson Transcript
              </button>
            </div>

            {activeTab === 'notes' ? (
              <div className="space-y-2">
                <textarea
                  value={noteContent}
                  onChange={(e) => {
                    setNoteContent(e.target.value);
                    setIsSavedNote(false);
                    setTimeout(() => setIsSavedNote(true), 600);
                  }}
                  rows={4}
                  placeholder="Record key shift insights here..."
                  className="w-full p-3 rounded-xl bg-surface border border-line text-xs font-sans text-ink outline-none focus:border-slate"
                />
                <div className="flex justify-between items-center text-[11px] text-ink-3 font-mono">
                  <span>Markdown formatting supported</span>
                  <span className={isSavedNote ? 'text-ok font-semibold' : 'text-warn'}>
                    {isSavedNote ? '✓ Notes Saved' : 'Saving...'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-ink-2 leading-relaxed max-h-48 overflow-y-auto">
                <p>
                  <strong>00:00</strong> — Welcome to Module 3. Today we focus on pacing kitchen lines during Friday evening covers without degrading guest ticket standards.
                </p>
                <p>
                  <strong>04:20</strong> — When examining KDS ticket variance, notice how tickets at the 12-minute threshold indicate an expo station bottleneck rather than grill lag.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Curriculum Rail & Completion Ticks */}
        <div className="lg:col-span-4 bg-surface rounded-2xl border border-line p-5 space-y-4 sticky top-16">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <h3 className="font-serif text-lg font-bold text-ink">Curriculum Rail</h3>
            <span className="font-mono text-xs text-slate font-bold">
              {completedLessonIds.length} Ticked
            </span>
          </div>

          <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {course.modules.map((mod) => (
              <div key={mod.id} className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
                  {mod.title}
                </span>

                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isLesCompleted = completedLessonIds.includes(les.id);
                    const isLesActive = les.id === currentLesson.id;

                    return (
                      <div
                        key={les.id}
                        onClick={() =>
                          navigate(`/academy/app/courses/${course.slug}/lessons/${les.id}`)
                        }
                        className={`p-2.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                          isLesActive
                            ? 'bg-elevated border-slate shadow-xs text-slate font-bold'
                            : 'bg-bg/60 border-line hover:bg-elevated text-ink-2'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isLesCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0 stroke-[2.5]" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-line shrink-0" />
                          )}
                          <span className="truncate text-xs">{les.title}</span>
                        </div>
                        <span className="font-mono text-[10px] text-ink-3 shrink-0 ml-2">
                          {les.duration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-line">
            <Button
              variant="primary"
              size="sm"
              block
              onClick={() => navigate('/academy/app/quiz')}
              className="bg-slate text-white"
            >
              <span>Take Assessment Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
