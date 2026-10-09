import React from 'react';
import { SpeedToLeadSimulator } from '../../components/marketing/SpeedToLeadSimulator';

export const SpeedToLeadPage: React.FC = () => {
  return (
    <div className="py-2">
      <SpeedToLeadSimulator isStandalonePage />
    </div>
  );
};
