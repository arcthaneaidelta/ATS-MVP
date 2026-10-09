import React from 'react';
import { CustomBuildPreview } from '../marketing/funnel-previews/CustomBuildPreview';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CustomBuildStandalonePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F3EC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between bg-[#FBF9F4] p-3.5 rounded-[14px] border border-[#DDD6C8] shadow-xs">
        <Link to="/funnels" className="text-xs text-[#79827D] hover:text-[#1F2A27] flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Funnels
        </Link>
        <span className="text-xs font-semibold text-[#1F2A27]">
          custom.alderstonehomes.com/consultation
        </span>
        <Link to="/app/pipeline">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
            Open Pipeline
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-[#FBF9F4] p-6 sm:p-10 rounded-[16px] border border-[#DDD6C8] shadow-sm">
        <CustomBuildPreview />
      </div>
    </div>
  );
};
