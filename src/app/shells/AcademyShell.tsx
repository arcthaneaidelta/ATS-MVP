import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Wordmark } from '../../components/brand/Wordmark';
import { ProductSwitcher } from '../../components/brand/ProductSwitcher';
import { DemoControls } from '../../components/brand/DemoControls';
import { CommandPalette } from '../../components/brand/CommandPalette';
import { useAcademyStore } from '../../store/academy';
import { Button } from '../../components/ui/Button';
import {
  GraduationCap,
  BookOpen,
  Award,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export const AcademyShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentName, enrolledCourseSlugs } = useAcademyStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStudentPortal = location.pathname.startsWith('/academy/app');
  const isAdminPortal = location.pathname.startsWith('/academy/admin');

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans text-ink selection:bg-slate/20">
      {/* 48px Product Bar */}
      <header className="h-12 bg-slate text-surface px-6 flex items-center justify-between text-xs border-b border-slate-hover shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/academy" className="flex items-center gap-1.5 font-serif text-base text-surface hover:text-white">
            <span className="font-serif">BionicIQ</span>
            <span className="font-sans text-xs uppercase tracking-wider font-bold bg-white/20 text-white px-1.5 py-0.5 rounded">
              Academy
            </span>
          </Link>
          <span className="text-surface/40 hidden sm:inline">|</span>
          <span className="text-[11px] text-surface/80 hidden sm:inline font-mono">
            {isAdminPortal ? 'Operations Console' : isStudentPortal ? `Student: ${studentName}` : 'Professional LMS'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {!isStudentPortal && !isAdminPortal ? (
            <div className="flex items-center gap-2">
              <Link
                to="/academy/courses"
                className="text-surface/90 hover:text-white px-2 py-1 rounded text-xs font-medium"
              >
                Browse Catalog
              </Link>
              <Link
                to="/academy/app"
                className="px-2.5 py-1 rounded bg-white text-slate font-semibold hover:bg-surface text-xs"
              >
                Student Portal
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isStudentPortal ? (
                <Link
                  to="/academy/admin"
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-surface text-[11px]"
                >
                  Admin Console
                </Link>
              ) : (
                <Link
                  to="/academy/app"
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-surface text-[11px]"
                >
                  View Student View
                </Link>
              )}
            </div>
          )}

          <ProductSwitcher />
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Student App Sidebar (if inside /academy/app) */}
        {isStudentPortal && (
          <aside className="w-56 bg-surface border-r border-line p-4 hidden md:flex flex-col justify-between shrink-0 text-left">
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-bg border border-line space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
                  Enrolled Student
                </span>
                <p className="font-serif text-sm font-bold text-ink">{studentName}</p>
                <p className="text-[10px] text-ink-3 font-mono">
                  {enrolledCourseSlugs.length} Active Courses
                </p>
              </div>

              <nav className="space-y-1 text-xs font-medium">
                <Link
                  to="/academy/app"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/academy/app'
                      ? 'bg-elevated text-slate font-bold border border-line shadow-xs'
                      : 'text-ink-2 hover:bg-bg hover:text-ink'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/academy/courses"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-ink-2 hover:bg-bg hover:text-ink transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-ink-3" />
                  <span>Course Catalog</span>
                </Link>
                <Link
                  to="/academy/app/certificates"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/academy/app/certificates')
                      ? 'bg-elevated text-slate font-bold border border-line shadow-xs'
                      : 'text-ink-2 hover:bg-bg hover:text-ink'
                  }`}
                >
                  <Award className="w-4 h-4 text-slate" />
                  <span>Certificates</span>
                </Link>
                <Link
                  to="/academy/app/quiz"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/academy/app/quiz')
                      ? 'bg-elevated text-slate font-bold border border-line shadow-xs'
                      : 'text-ink-2 hover:bg-bg hover:text-ink'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-slate" />
                  <span>Assessments</span>
                </Link>
              </nav>
            </div>

            <div className="pt-4 border-t border-line text-xs">
              <Link
                to="/academy"
                className="text-ink-3 hover:text-ink flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit to Academy Home</span>
              </Link>
            </div>
          </aside>
        )}

        {/* Admin Portal Sidebar (if inside /academy/admin) */}
        {isAdminPortal && (
          <aside className="w-56 bg-surface border-r border-line p-4 hidden md:flex flex-col justify-between shrink-0 text-left">
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-bg border border-line space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate tracking-wider block">
                  Admin Console
                </span>
                <p className="font-serif text-sm font-bold text-ink">BionicIQ School</p>
                <p className="text-[10px] text-ink-3 font-mono">Platform Admin</p>
              </div>

              <nav className="space-y-1 text-xs font-medium">
                <Link
                  to="/academy/admin"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-elevated text-slate font-bold border border-line shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Operations Overview</span>
                </Link>
                <Link
                  to="/academy/courses"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-ink-2 hover:bg-bg"
                >
                  <BookOpen className="w-4 h-4 text-ink-3" />
                  <span>Manage Courses</span>
                </Link>
              </nav>
            </div>

            <div className="pt-4 border-t border-line text-xs">
              <Link to="/academy/app" className="text-slate hover:underline font-medium">
                ← Open Student App
              </Link>
            </div>
          </aside>
        )}

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Demo Controls (Bottom Left) */}
      <DemoControls />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />
    </div>
  );
};
