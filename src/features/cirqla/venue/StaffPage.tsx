import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../components/ui/Toast';
import { Users, UserPlus, Shield, X, AlertCircle, Check } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Manager' | 'Kitchen' | 'Front of house';
  branches: string[];
  status: 'Active' | 'Invited';
  lastActive: string;
}

export const StaffPage: React.FC = () => {
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Manager' | 'Kitchen' | 'Front of house'>('Kitchen');
  const [inviteBranch, setInviteBranch] = useState('Central');

  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 'st-1', name: 'Daniyal Farooq', email: 'daniyal@kilnstreet.example', role: 'Owner', branches: ['Central', 'Riverside', 'Airport'], status: 'Active', lastActive: 'Just now' },
    { id: 'st-2', name: 'Chef Tariq Vance', email: 'tariq.v@kilnstreet.example', role: 'Kitchen', branches: ['Central'], status: 'Active', lastActive: '12m ago' },
    { id: 'st-3', name: 'Elena Rostova', email: 'elena@kilnstreet.example', role: 'Manager', branches: ['Riverside'], status: 'Active', lastActive: '1h ago' },
    { id: 'st-4', name: 'Zainab Qazi', email: 'zainab@kilnstreet.example', role: 'Front of house', branches: ['Central'], status: 'Active', lastActive: '3h ago' },
    { id: 'st-5', name: 'Alex Cooper', email: 'alex@kilnstreet.example', role: 'Kitchen', branches: ['Airport'], status: 'Invited', lastActive: 'Pending invite' },
  ]);

  const permissionSummaries = {
    Owner: 'Full administrative access: billing, bank payouts, delete branch, and invite staff.',
    Manager: 'Operational access: live orders, menu manager, analytics, refunds, and daily staff shift schedules.',
    Kitchen: 'Kitchen Display System access only: view tickets, fire station timers, mark orders ready.',
    'Front of house': 'Diner host stand access: view table assignments and mark ready orders collected.',
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: StaffMember = {
      id: `st-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      branches: [inviteBranch],
      status: 'Invited',
      lastActive: 'Invitation sent',
    };

    setStaff([...staff, newMember]);
    setShowInviteModal(false);
    setInviteEmail('');
    toast(`Invitation sent to ${newMember.email}`, 'success');
  };

  const handleRoleChange = (memberId: string, newRole: StaffMember['role']) => {
    const member = staff.find((s) => s.id === memberId);
    if (!member) return;

    if (member.role === 'Owner' && newRole !== 'Owner') {
      const ownerCount = staff.filter((s) => s.role === 'Owner').length;
      if (ownerCount <= 1) {
        toast('Cannot demote the sole account Owner.', 'error');
        return;
      }
    }

    const previousRole = member.role;
    setStaff(
      staff.map((s) => (s.id === memberId ? { ...s, role: newRole } : s))
    );

    toast(`Role updated to ${newRole} for ${member.name}`, 'info', {
      label: 'Undo',
      onClick: () => {
        setStaff(staff.map((s) => (s.id === memberId ? { ...s, role: previousRole } : s)));
        toast('Role change undone', 'info');
      },
    });
  };

  return (
    <div className="p-6 text-left space-y-6 max-w-[1600px] mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
            Staff Members & Role Permissions
          </h1>
          <p className="text-xs text-ink-3 mt-1">
            Manage granular access control across venue owners, general managers, and culinary line teams.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowInviteModal(true)}
          icon={<UserPlus className="w-4 h-4" />}
        >
          Invite Staff Member
        </Button>
      </div>

      {/* Staff Table */}
      <div className="bg-elevated rounded-2xl border border-line overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left divide-y divide-line">
            <thead className="bg-surface text-ink-3 text-[10px] uppercase tracking-wider font-mono">
              <tr>
                <th className="p-3">Staff Member</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Branch Access</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Active</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-surface/50 transition-colors">
                  <td className="p-3">
                    <p className="font-semibold text-ink text-xs">{member.name}</p>
                    <p className="text-[11px] text-ink-3">{member.email}</p>
                  </td>
                  <td className="p-3">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                      className="h-7 px-2 rounded bg-surface border border-line text-xs font-medium text-ink outline-none"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Manager">Manager</option>
                      <option value="Kitchen">Kitchen Line</option>
                      <option value="Front of house">Front of House</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className="text-xs text-ink-2">
                      {member.branches.join(', ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        member.status === 'Active'
                          ? 'bg-ok-tint text-ok'
                          : 'bg-warn-tint text-warn'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-ink-3">{member.lastActive}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        if (member.role === 'Owner') {
                          toast('Cannot remove owner account', 'error');
                          return;
                        }
                        setStaff(staff.filter((s) => s.id !== member.id));
                        toast(`Removed ${member.name} from staff list`, 'info');
                      }}
                      className="text-xs text-err hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Callout */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-serif text-lg font-bold text-ink">
            Role Capability Matrix
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-elevated border border-line space-y-1">
            <span className="font-bold text-primary block">Owner</span>
            <p className="text-ink-3 text-[11px] leading-relaxed">{permissionSummaries.Owner}</p>
          </div>
          <div className="p-3 rounded-xl bg-elevated border border-line space-y-1">
            <span className="font-bold text-clay block">Manager</span>
            <p className="text-ink-3 text-[11px] leading-relaxed">{permissionSummaries.Manager}</p>
          </div>
          <div className="p-3 rounded-xl bg-elevated border border-line space-y-1">
            <span className="font-bold text-warn block">Kitchen Line</span>
            <p className="text-ink-3 text-[11px] leading-relaxed">{permissionSummaries.Kitchen}</p>
          </div>
          <div className="p-3 rounded-xl bg-elevated border border-line space-y-1">
            <span className="font-bold text-ok block">Front of House</span>
            <p className="text-ink-3 text-[11px] leading-relaxed">{permissionSummaries['Front of house']}</p>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-elevated rounded-2xl border border-line p-6 shadow-2xl text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-line">
              <h3 className="font-serif text-lg font-bold text-ink">Invite Staff Member</h3>
              <button onClick={() => setShowInviteModal(false)}>
                <X className="w-4 h-4 text-ink-3" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@kilnstreet.example"
                required
              />

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-2 mb-1.5">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full h-11 px-3 bg-elevated border border-line-2 rounded-md text-xs font-sans text-ink outline-none"
                >
                  <option value="Manager">Manager</option>
                  <option value="Kitchen">Kitchen Line</option>
                  <option value="Front of house">Front of House</option>
                </select>
                <p className="mt-1 text-[11px] text-ink-3">
                  {permissionSummaries[inviteRole]}
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-ink-2 mb-1.5">
                  Branch Assignment
                </label>
                <select
                  value={inviteBranch}
                  onChange={(e) => setInviteBranch(e.target.value)}
                  className="w-full h-11 px-3 bg-elevated border border-line-2 rounded-md text-xs font-sans text-ink outline-none"
                >
                  <option value="Central">Central Branch</option>
                  <option value="Riverside">Riverside Branch</option>
                  <option value="Airport">Airport Branch</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Invite Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
