import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { CheckoutDrawer } from './CheckoutDrawer';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  Award,
  ChevronDown,
  Star,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { courses, enrolledCourseSlugs } = useAcademyStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor'>('curriculum');
  const [showCheckout, setShowCheckout] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState<number>(0);

  const course = courses.find((c) => c.slug === slug) || courses[0];
  const isEnrolled = enrolledCourseSlugs.includes(course.slug);

  return (
    <div className="py-12 md:py-16 max-w-container mx-auto px-6 text-left space-y-12 font-sans">
      <div>
        <button
          type="button"
          onClick={() => navigate('/academy/courses')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Course Catalog</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Details & Curriculum (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate/10 text-slate border border-slate/20">
                {course.level} Track
              </span>
              <span className="text-xs text-ink-3 font-mono">{course.category}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
              {course.title}
            </h1>

            <p className="text-base text-ink-2 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-ink-3 pt-2 border-t border-line">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate" />
                <span>{course.durationHours} Hours Video</span>
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate" />
                <span>{course.lessonCount} Modular Lessons</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-ok" />
                <span>Verifiable Diploma</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-line text-xs font-sans">
            {(['curriculum', 'overview', 'instructor'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`py-2 px-5 border-b-2 capitalize font-medium transition-colors ${
                  activeTab === t
                    ? 'border-slate text-slate font-bold'
                    : 'border-transparent text-ink-3 hover:text-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab: Curriculum Accordion */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-3 block">
                Syllabus Breakdown
              </span>

              {course.modules.length === 0 ? (
                <p className="text-xs text-ink-3 py-6">Curriculum syllabus currently in authoring review.</p>
              ) : (
                course.modules.map((mod, modIdx) => {
                  const isOpen = openModuleIndex === modIdx;
                  return (
                    <div
                      key={mod.id}
                      className="border border-line rounded-xl bg-surface overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenModuleIndex(isOpen ? -1 : modIdx)}
                        className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-ink hover:bg-elevated/50"
                      >
                        <div className="flex items-center gap-2">
                          <span>{mod.title}</span>
                          <span className="text-[10px] text-ink-3 font-mono font-normal">
                            ({mod.lessons.length} lessons)
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-ink-3 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-line/60 border-t border-line/60 bg-elevated text-xs font-sans">
                          {mod.lessons.map((les) => (
                            <div
                              key={les.id}
                              className="p-3.5 flex items-center justify-between hover:bg-surface/60 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {isEnrolled ? (
                                  <PlayCircle
                                    className="w-4 h-4 text-slate cursor-pointer"
                                    onClick={() =>
                                      navigate(`/academy/app/courses/${course.slug}/lessons/${les.id}`)
                                    }
                                  />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-ink-3" />
                                )}
                                <span className="font-medium text-ink">{les.title}</span>
                              </div>
                              <span className="font-mono text-[11px] text-ink-3">
                                {les.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs text-ink-2 leading-relaxed">
              <h3 className="font-serif text-xl font-bold text-ink">What You Will Master</h3>
              <p>
                This track provides real-world frameworks for running high-speed operations without burning out frontline talent. From pre-shift line checks to margin preservation during Friday dinner rushes, each lesson is designed for actionable workplace application.
              </p>
            </div>
          )}

          {/* Tab: Instructor */}
          {activeTab === 'instructor' && (
            <div className="p-6 rounded-2xl bg-surface border border-line flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-slate/20 text-slate font-serif font-bold text-xl flex items-center justify-center shrink-0">
                {course.instructor.charAt(0)}
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-serif text-lg font-bold text-ink">{course.instructor}</h3>
                <p className="text-slate font-medium">{course.instructorRole}</p>
                <p className="text-ink-2 text-[11px] leading-relaxed pt-1">
                  Over 15 years leading Michelin-caliber hospitality teams and enterprise food service consulting groups.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Card (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 self-start w-full">
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
                Tuition & Access
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-bold text-ink">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
                <span className="text-xs text-ink-3 font-mono">USD</span>
              </div>
            </div>

            {isEnrolled ? (
              <Button
                variant="primary"
                size="md"
                block
                onClick={() =>
                  navigate(
                    `/academy/app/courses/${course.slug}/lessons/${
                      course.modules[0]?.lessons[0]?.id || 'les-1'
                    }`
                  )
                }
                className="bg-slate text-white"
              >
                <span>Resume Lesson</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                block
                onClick={() => setShowCheckout(true)}
                className="bg-slate text-white"
              >
                <span>{course.price === 0 ? 'Enroll for Free' : 'Enroll in Track'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}

            <div className="space-y-2 text-xs text-ink-2 pt-4 border-t border-line">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0 stroke-[2.5]" />
                <span>Lifetime access across all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0 stroke-[2.5]" />
                <span>Integrated markdown note-taking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0 stroke-[2.5]" />
                <span>Accredited certificate upon quiz completion</span>
              </div>
            </div>

            <p className="text-[10px] text-ink-3 text-center pt-2">
              14-day refund guarantee · Simulated checkout available
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Drawer */}
      {showCheckout && (
        <CheckoutDrawer
          course={course}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            navigate(
              `/academy/app/courses/${course.slug}/lessons/${
                course.modules[0]?.lessons[0]?.id || 'les-1'
              }`
            );
          }}
        />
      )}
    </div>
  );
};
