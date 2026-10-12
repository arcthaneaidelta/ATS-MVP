import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { QuotePipeline } from '../../components/admin/QuotePipeline';

export const AdminQuotations: React.FC = () => {
  return (
    <AdminShell
      title="Quotations Pipeline"
      subtitle="Inbound requests pipeline. Issue itemised proposals with custom discounts and confirm reservations."
    >
      <QuotePipeline />
    </AdminShell>
  );
};
