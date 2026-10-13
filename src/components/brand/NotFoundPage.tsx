import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Wordmark } from './Wordmark';
import { ArrowLeft, Compass, Home, BookOpen, UtensilsCrossed } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between p-6 sm:p-12">
      <header className="flex items-center justify-between border-b border-line pb-6">
        <Link to="/" className="outline-none">
          <Wordmark size="md" />
        </Link>
        <span className="font-mono text-xs text-ink-3">HTTP 404 · Page Not Found</span>
      </header>

      <main className="max-w-xl mx-auto my-auto text-center py-16 space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-clay font-medium">Navigation Error</span>
        <h1 className="font-serif text-5xl sm:text-6xl text-ink leading-tight">
          This coordinate does not exist.
        </h1>
        <p className="text-ink-2 text-base leading-relaxed">
          The page or product route you are looking for has been relocated or was never registered within the BionicIQ ecosystem.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" size="md">
              <Home className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="ghost" size="md">
              <Compass className="w-4 h-4 mr-2" />
              Explore Products
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <Link 
            to="/academy" 
            className="p-4 rounded-lg border border-line bg-surface hover:border-line-2 transition-colors block group"
          >
            <div className="flex items-center gap-2 text-slate font-medium text-sm">
              <BookOpen className="w-4 h-4" />
              <span>BionicIQ Academy</span>
            </div>
            <p className="text-xs text-ink-3 mt-1">Explore hospitality and operations courses</p>
          </Link>

          <Link 
            to="/cirqla" 
            className="p-4 rounded-lg border border-line bg-surface hover:border-line-2 transition-colors block group"
          >
            <div className="flex items-center gap-2 text-clay font-medium text-sm">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Cirqla SaaS</span>
            </div>
            <p className="text-xs text-ink-3 mt-1">Scan, order, and live venue kitchen board</p>
          </Link>
        </div>
      </main>

      <footer className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-3 gap-2">
        <span>© 2026 BionicIQ Inc. All rights reserved.</span>
        <span className="font-mono">Demo Environment · Client Evaluation</span>
      </footer>
    </div>
  );
};
