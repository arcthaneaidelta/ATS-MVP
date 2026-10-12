import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { InsuranceEditor } from '../../components/admin/InsuranceEditor';

export const AdminInsurance: React.FC = () => {
  return (
    <AdminShell
      title="Insurance & Damage Waivers"
      subtitle="Edit customer excess amounts, daily premiums, and included protections."
    >
      <InsuranceEditor />
    </AdminShell>
  );
};
