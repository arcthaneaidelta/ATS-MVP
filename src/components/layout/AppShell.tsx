import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BottomTabBar } from './BottomTabBar';
import { ToastContainer } from '../ui/Toast';
import { CommandPalette } from '../domain/CommandPalette';
import { BRAND } from '../../config/brand';

export function AppShell() {
  return (
    <div className="flex h-screen bg-bg text-ink-900 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-7 pb-20 md:pb-8 max-w-[1440px] w-full mx-auto">
          <Outlet />

          {/* Prototype Sample Data Footer Bar (PRD Section 1.9 & 21) */}
          <footer className="mt-12 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-500 font-mono gap-2">
            <span>
              {BRAND.name} Commercial Parts Memory · {BRAND.footerDisclaimer}
            </span>
            <span className="text-[10px]">
              Simulated Base: 10 Oct 2026 · Multi-OEM Relational Core
            </span>
          </footer>
        </main>

        {/* Mobile Navigation */}
        <BottomTabBar />
      </div>

      {/* Global Overlays */}
      <ToastContainer />
      <CommandPalette />
    </div>
  );
}
