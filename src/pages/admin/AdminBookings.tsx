import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { BookingsTable } from '../../components/admin/BookingsTable';

export const AdminBookings: React.FC = () => {
  return (
    <AdminShell
      title="Bookings & Reservations"
      subtitle="View, search, filter, and inspect detailed customer payments and security deposit holds."
    >
      <BookingsTable />
    </AdminShell>
  );
};
