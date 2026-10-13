import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppShell } from '@/components/app/AppShell';
import { PhoneFrame } from '@/components/app/PhoneFrame';
import { ArrowLeft } from 'lucide-react';
import { DemoControls } from '@/components/app/DemoControls';

export function AppPage() {
  const { tab } = useParams<{ tab?: string }>();
  const initialTab = (tab === 'connect' || tab === 'subscriptions' || tab === 'trials') ? tab : 'today';

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between items-center py-0 sm:py-8">
      {/* Top Banner on larger screens */}
      <header className="w-full max-w-md px-4 py-2 hidden sm:flex items-center justify-between text-xs text-ink-3">
        <Link to="/" className="flex items-center gap-1.5 hover:text-ink transition-colors font-medium">
          <ArrowLeft size={14} />
          <span>Back to landing page</span>
        </Link>
        <DemoControls />
      </header>

      {/* Main app viewport: full-screen on mobile, framed on sm+ */}
      <main className="w-full sm:w-auto flex-1 flex flex-col items-center justify-center">
        {/* Mobile: full-screen 100dvh */}
        <div className="w-full h-screen sm:hidden flex flex-col">
          <AppShell initialTab={initialTab} />
        </div>

        {/* Desktop: framed phone */}
        <div className="hidden sm:block">
          <PhoneFrame>
            <AppShell initialTab={initialTab} />
          </PhoneFrame>
        </div>
      </main>

      <footer className="w-full text-center py-3 hidden sm:block">
        <p className="text-[11px] text-ink-3">
          Save Me Prototype · Responsive container
        </p>
      </footer>
    </div>
  );
}
