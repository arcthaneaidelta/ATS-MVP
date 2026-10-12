import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { TimelineCalendar } from '../../components/admin/TimelineCalendar';

export const AdminCalendar: React.FC = () => {
  return (
    <AdminShell
      title="Availability Calendar & Timeline"
      subtitle="Visual 30-day timeline across all vehicles. Click any cell to block dates or record offline bookings."
    >
      <TimelineCalendar />
    </AdminShell>
  );
};
