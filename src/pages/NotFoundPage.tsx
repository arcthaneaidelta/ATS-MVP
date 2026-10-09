import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F3EC] flex flex-col items-center justify-center p-6 text-center text-[#1F2A27]">
      <div className="w-16 h-16 rounded-[16px] bg-[#EDE8DD] border border-[#DDD6C8] flex items-center justify-center mb-4">
        <Home className="w-8 h-8 text-[#2F4A3F]" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-[#B4684A] font-bold">
        Error 404
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl font-medium mt-1 mb-2">
        Lot or Page Not Found
      </h1>
      <p className="text-sm text-[#79827D] max-w-sm mb-6 leading-relaxed">
        The destination you are looking for has been relocated or does not exist on the Alder & Stone system map.
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Groundwork Home
        </Button>
      </Link>
    </div>
  );
};
