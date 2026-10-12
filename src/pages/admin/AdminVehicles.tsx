import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { VehicleEditor } from '../../components/admin/VehicleEditor';

export const AdminVehicles: React.FC = () => {
  return (
    <AdminShell
      title="Fleet & Vehicle Specifications"
      subtitle="Manage self-drive models, photography, passenger capacity, and security deposit requirements."
    >
      <VehicleEditor />
    </AdminShell>
  );
};
