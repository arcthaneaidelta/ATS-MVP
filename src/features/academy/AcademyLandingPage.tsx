import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Award,
  Video,
  FileCheck,
  ChevronDown,
  X,
  Lock,
} from 'lucide-react';

export const AcademyLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useAcademyStore();
  const { toast } = useToast();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuredCourses = courses.slice(0, 3);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (signInEmail === 'wrong@demo.com') {
      setIsSigningIn(true);
      await new Promise((r) => setTimeout(r, 600));
      setIsSigningIn(false);
      setSignInError('Invalid credentials. Check your email or try hira@dininggroup.example');
      return;
    }

    setIsSigningIn(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSigningIn(false);
    setShowSignInModal(false);
    toast('Welcome back, Hira Siddiqui!', 'success');
    navigate('/academy/app');
  };

  const faqs = [
    { q: 'How does assessment verification work?', a: 'Every issued certificate carries a cryptographic unique serial number (e.g. BIQ-2026-00391) and a tamper-proof QR code linking to our public verification portal.' },
    { q: 'Are certificates printable for venue compliance inspections?', a: 'Yes. Certificates render with print-optimized CSS formatting to standard A4-landscape diplomas with accredited inspector signature lines.' },
    { q: 'Can courses be managed directly by operations directors?', a: 'Yes. The Academy Admin console allows non-technical managers to author modules, publish courses, issue refunds, and audit completion percentages.' },
  ];

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-20 font-sans">
      {/* 1. Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate/10 text-slate text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Professional Hospitality & Operations LMS</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink font-normal leading-[1.08] tracking-tight">
            Learn the craft behind great operations.
          </h1>

          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl">
            Distraction-free learning engineered for shift managers, culinary leads, and floor directors. Video lessons, interactive notes, timed quizzes, and verifiable credentials.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/academy/courses')}
              className="bg-clay text-white"
            >
              <span>Browse Catalog (6 Courses)</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowSignInModal(true)}
            >
              <span>Sign In as Student</span>
            </Button>
          </div>
        </div>

        {/* Hero Right: 3-Card Overlapping Fan-Out */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-80 h-96 group cursor-pointer" onClick={() => navigate('/academy/courses')}>
            {/* Card 3 (Bottom) */}
            <div className="absolute inset-0 bg-surface rounded-2xl border border-line shadow-sm translate-y-6 scale-90 group-hover:translate-y-8 group-hover:scale-95 transition-all duration-300 p-5 space-y-3">
              <span className="text-[10px] font-bold text-slate uppercase">Intermediate</span>
              <h3 className="font-serif text-lg font-bold text-ink">Designing the Guest Experience</h3>
              <p className="text-xs text-ink-3">Priya Natarajan · 20 Lessons</p>
            </div>

            {/* Card 2 (Middle) */}
            <div className="absolute inset-0 bg-surface rounded-2xl border border-line shadow-md translate-y-3 scale-95 group-hover:translate-y-4 group-hover:scale-98 transition-all duration-300 p-5 space-y-3">
              <span className="text-[10px] font-bold text-slate uppercase">Intermediate</span>
              <h3 className="font-serif text-lg font-bold text-ink">Reading Your Numbers: Data Literacy</h3>
              <p className="text-xs text-ink-3">Omar Haddad · 18 Lessons</p>
            </div>

            {/* Card 1 (Top) */}
            <div className="absolute inset-0 bg-elevated rounded-2xl border-2 border-slate/30 shadow-xl group-hover:translate-y-0 transition-all duration-300 p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-line">
                <span className="text-[10px] font-bold text-slate uppercase">Enrolled Course</span>
                <span className="font-mono text-xs font-bold text-ok">46% Complete</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink">
                Restaurant Operations Essentials
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed">
                Dr. Sana Malik · Master line checklists, kitchen pacing, and variance tracking.
              </p>
              <div className="pt-2 flex justify-between items-center text-xs font-semibold text-slate">
                <span>Resume Lesson 11 →</span>
                <span className="font-mono">$79 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. How It Works: Learn, Assess, Certify */}
      <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-line space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-slate tracking-wider">
            Curriculum Architecture
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            The Complete Learning Loop in Two Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-elevated border border-line space-y-3">
            <Video className="w-6 h-6 text-slate" />
            <span className="font-mono text-xs font-bold text-ink-3">PHASE 01</span>
            <h3 className="font-serif text-xl font-bold text-ink">Focus Video Player</h3>
            <p className="text-xs text-ink-2 leading-relaxed">
              Looping high-definition video chapters, real-time scrubbing, speed controls, and persistent markdown notes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-elevated border border-line space-y-3">
            <CheckCircle2 className="w-6 h-6 text-clay" />
            <span className="font-mono text-xs font-bold text-ink-3">PHASE 02</span>
            <h3 className="font-serif text-xl font-bold text-ink">Timed Assessments</h3>
            <p className="text-xs text-ink-2 leading-relaxed">
              5-question interactive quizzes with 8-minute countdown timer, review flags, and instant animated score rings.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-elevated border border-line space-y-3">
            <Award className="w-6 h-6 text-ok" />
            <span className="font-mono text-xs font-bold text-ink-3">PHASE 03</span>
            <h3 className="font-serif text-xl font-bold text-ink">Verifiable Diplomas</h3>
            <p className="text-xs text-ink-2 leading-relaxed">
              A4-landscape certificates issued with cryptographic IDs and public verification URLs for health inspections.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Featured Courses Preview */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs uppercase font-bold text-ink-3 block mb-1">
              Popular Programs
            </span>
            <h2 className="font-serif text-3xl text-ink font-normal">
              Featured Operational Tracks
            </h2>
          </div>
          <button
            onClick={() => navigate('/academy/courses')}
            className="text-xs font-semibold text-slate hover:underline flex items-center gap-1"
          >
            <span>View all 6 courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/academy/courses/${c.slug}`)}
              className="p-6 rounded-xl bg-elevated border border-line hover:border-slate hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-xs pb-3 border-b border-line mb-3">
                  <span className="font-bold text-slate uppercase text-[10px]">{c.level}</span>
                  <span className="font-mono text-ink-3 text-[11px]">{c.lessonCount} Lessons</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink group-hover:text-slate transition-colors mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-ink-2 line-clamp-2 leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              <div className="pt-4 border-t border-line flex justify-between items-center">
                <span className="text-xs text-ink-3">{c.instructor}</span>
                <span className="font-mono font-bold text-sm text-ink">
                  {c.price === 0 ? 'Free' : `$${c.price}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FAQ Accordion */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="font-serif text-2xl text-ink text-center mb-6">Frequently Asked Questions</h3>
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-line rounded-xl bg-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-ink"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-ink-3 transition-transform ${
                  openFaq === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === idx && (
              <div className="p-4 pt-0 text-xs text-ink-2 leading-relaxed border-t border-line/40 bg-elevated/50">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-elevated rounded-2xl border border-line p-6 shadow-2xl text-left space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-line">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Student Sign In</h3>
                <p className="text-[11px] text-ink-3">Demo student: Hira Siddiqui</p>
              </div>
              <button onClick={() => setShowSignInModal(false)}>
                <X className="w-4 h-4 text-ink-3" />
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3">
              <Input
                label="Student Email"
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                placeholder="h.siddiqui@dininggroup.example"
                required
                hint="Tip: type wrong@demo.com to test error state"
              />

              <Input
                label="Password"
                type="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />

              {signInError && (
                <p className="text-xs text-err bg-err-tint p-2 rounded border border-err/30">
                  {signInError}
                </p>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  block
                  isLoading={isSigningIn}
                  className="bg-slate text-white"
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
