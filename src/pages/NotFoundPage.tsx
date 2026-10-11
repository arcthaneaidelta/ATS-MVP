import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full border border-[#2C4A3E] relative flex items-center justify-center mb-6">
        <div className="w-7 h-[1.5px] bg-[#2C4A3E] -mt-1" />
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#B08A4E] mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420] mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-[#4A5650] max-w-sm mb-8">
        The requested resource does not exist or has been relocated within the platform.
      </p>
      <Link to="/app">
        <Button variant="primary">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};
