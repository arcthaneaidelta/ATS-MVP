import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-meridian-bg flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-2 p-8 space-y-5">
        <div className="mx-auto w-12 h-12 bg-meridian-surface-sunken text-meridian-primary rounded-full flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>

        <div>
          <span className="text-xs font-mono font-semibold uppercase text-meridian-text-muted">
            Error 404 • Lost Expedition
          </span>
          <h1 className="text-2xl font-serif font-medium text-meridian-text-primary mt-1">
            Waymarker Not Found
          </h1>
          <p className="text-xs text-meridian-text-secondary mt-2">
            The destination route you followed does not exist on this trade portal.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/')}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-full"
        >
          Return to Portal Overview
        </Button>
      </div>
    </div>
  );
};
