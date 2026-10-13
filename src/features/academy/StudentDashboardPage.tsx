import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import { ProgressRing } from '../../components/ui/ProgressRing';
import {
  GraduationCap,
  PlayCircle,
  Clock,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    studentName,
    enrolledCourseSlugs,
    completedLessonIds,
    weeklyHoursLearned,
    currentStreakDays,
    certificates,
    courses,
  } = useAcademyStore();

  const enrolledCourses = courses.filter((c) => enrolledCourseSlugs.includes(c.slug));
  const activeCourse = enrolledCourses[0] || courses[0];

  const totalLessonsInActive = activeCourse.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const completedInActive = activeCourse.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => completedLessonIds.includes(l.id)).length,
    0
  );
  const activeProgressPct = Math.round(
    (completedInActive / Math.max(1, totalLessonsInActive)) * 100
  );

  const weeklyDays = [
    { day: 'M', hours: 0.8 },
    { day: 'T', hours: 1.2 },
    { day: 'W', hours: 0.5 },
    { day: 'T', hours: 1.4 },
    { day: 'F', hours: 0.9, isToday: true },
    { day: 'S', hours: 0.0 },
    { day: 'S', hours: 0.0 },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-[1400px] mx-auto text-left space-y-8 font-sans">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
            Student Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
            Welcome back, {studentName}
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Track your weekly learning streaks, active modules, and accredited diplomas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/academy/app/quiz')}
            icon={<ShieldCheck className="w-4 h-4 text-slate" />}
          >
            Take 5-Question Quiz
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/academy/courses')}
            className="bg-slate text-white"
          >
            Browse New Tracks
          </Button>
        </div>
      </div>

      {/* 1. Continue Learning Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <ProgressRing
            progress={activeProgressPct}
            size={76}
            strokeWidth={6}
            color="var(--slate)"
          />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
              Resume In-Progress Course
            </span>
            <h2 className="font-serif text-2xl font-bold text-ink">{activeCourse.title}</h2>
            <p className="text-xs text-ink-3">
              Module 3: Kitchen Display System Synchronization · Lesson 11
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() =>
            navigate(
              `/academy/app/courses/${activeCourse.slug}/lessons/${
                activeCourse.modules[2]?.lessons[4]?.id || 'les-11'
              }`
            )
          }
          className="bg-slate text-white w-full md:w-auto"
        >
          <span>Resume Lesson 11</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      {/* 2. Three KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-elevated border border-line flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
              Courses in Progress
            </span>
            <span className="font-mono text-3xl font-bold text-ink">
              {enrolledCourses.length}
            </span>
            <span className="text-[10px] text-slate block mt-1">Operational tracks</span>
          </div>
          <BookOpen className="w-8 h-8 text-slate/40" />
        </div>

        <div className="p-5 rounded-2xl bg-elevated border border-line flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
              Hours Learned This Week
            </span>
            <span className="font-mono text-3xl font-bold text-primary">
              {weeklyHoursLearned}h
            </span>
            <span className="text-[10px] text-ok block mt-1">+1.2h vs target pace</span>
          </div>
          <Clock className="w-8 h-8 text-primary/40" />
        </div>

        <div className="p-5 rounded-2xl bg-elevated border border-line flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block">
              Current Learning Streak
            </span>
            <span className="font-mono text-3xl font-bold text-clay">
              {currentStreakDays} Days
            </span>
            <span className="text-[10px] text-clay block mt-1">Daily consistency streak 🔥</span>
          </div>
          <Flame className="w-8 h-8 text-clay/40" />
        </div>
      </div>

      {/* 3. Weekly Activity & Earned Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Weekly Activity Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-elevated border border-line space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-ink">Weekly Learning Activity</h3>
            <span className="text-xs text-ink-3 font-mono">{weeklyHoursLearned} hrs total</span>
          </div>

          <div className="flex items-end justify-between h-40 pt-6 px-4 border-b border-line">
            {weeklyDays.map((d) => {
              const heightPct = Math.round((d.hours / 1.5) * 100);
              return (
                <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-7 rounded-t-md transition-all duration-500 ${
                      d.isToday ? 'bg-primary' : 'bg-sage'
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${d.hours} hours`}
                  />
                  <span className={`text-[11px] font-mono ${d.isToday ? 'font-bold text-primary' : 'text-ink-3'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-ink-3">
            Today is highlighted in dark primary token. Maintaining pace unlocks end-of-module certification.
          </p>
        </div>

        {/* Right: Issued Certificates (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-elevated border border-line space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-ink">
              Earned Diplomas ({certificates.length})
            </h3>
            <button
              onClick={() => navigate('/academy/app/certificates')}
              className="text-xs font-semibold text-slate hover:underline"
            >
              View all →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => navigate('/academy/app/certificates')}
                className="p-4 rounded-xl bg-surface border border-line flex items-center justify-between cursor-pointer hover:border-slate transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-ok shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-ink">{cert.courseTitle}</h4>
                    <p className="text-[11px] font-mono text-ink-3">{cert.certificateNumber}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-ok-tint text-ok">
                  {cert.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-bg border border-line text-[11px] text-ink-3">
            Pass the 5-question timed quiz to automatically issue your second credential.
          </div>
        </div>
      </div>
    </div>
  );
};
