import { Link } from 'react-router-dom';
import { PackageX, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg text-ink-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Contour motif */}
      <div className="w-16 h-16 rounded-full bg-surface-sunken flex items-center justify-center text-ink-500 mb-4 border border-border">
        <PackageX className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h1 className="font-display text-3xl sm:text-4xl text-ink-900 mb-2 font-normal">
        This page isn't in the catalogue.
      </h1>

      <p className="text-xs text-ink-500 max-w-sm mb-6 font-mono">
        The requested URL reference does not map to any active screen or part record in Stratum.
      </p>

      <Link to="/app">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
