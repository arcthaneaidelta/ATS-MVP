import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { BracketEditor } from '../../components/admin/BracketEditor';

export const AdminPricing: React.FC = () => {
  return (
    <AdminShell
      title="Pricing & Duration Brackets"
      subtitle="Configure duration-based tiered rates per vehicle. Test changes live before saving."
    >
      <BracketEditor />
    </AdminShell>
  );
};
