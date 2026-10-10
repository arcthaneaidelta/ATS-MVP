import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Users,
  KeyRound,
  Plus,
  UserCheck,
  Check,
  Eye,
  Edit,
  Lock,
} from 'lucide-react';
import { useStore, UserRole } from '../../store/useStore';
import { ENTITIES } from '../../config/brand';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import clsx from 'clsx';

export function AdminPage() {
  const { currentRole, setRole, permissionMatrix, cyclePermission, addToast } = useStore();
  const [activeTab, setActiveTab] = useState<'entities' | 'users' | 'matrix'>('matrix');

  // Invite user modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Sales');

  const users = [
    { name: 'Valeria Quispe', email: 'v.quispe@stratum.pe', role: 'Sales Lead', territory: 'Peru', status: 'Active' },
    { name: 'Chanda Mwila', email: 'c.mwila@stratum.zm', role: 'Senior Buyer', territory: 'Zambia', status: 'Active' },
    { name: 'Tomás Rivera', email: 't.rivera@stratum.pe', role: 'Finance Controller', territory: 'Peru', status: 'Active' },
    { name: 'Naledi Banda', email: 'n.banda@stratum-intl.com', role: 'Commercial Director', territory: 'All', status: 'Active' },
    { name: 'Ahmed Karim', email: 'a.karim@stratum-fze.ae', role: 'System Admin', territory: 'International', status: 'Active' },
  ];

  const modules = ['Parts', 'Pricing', 'RFQ', 'Orders', 'Finance', 'Admin'];
  const roles: UserRole[] = ['Sales', 'Buyer', 'Finance', 'Director', 'Admin'];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    addToast(`Invitation sent to ${inviteEmail} with ${inviteRole} role`, 'success');
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Entities & Role Access Control
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Manage multi-country legal subsidiaries, user delegations, and fine-grained CRUD module permissions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Invite team member
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'matrix', label: 'Permission Matrix (Interactive)' },
          { id: 'entities', label: 'Operating Subsidiaries', count: 3 },
          { id: 'users', label: 'Authorized Users', count: users.length },
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as any)}
      />

      {/* TAB 1: PERMISSION MATRIX (PRD Spec 12.9) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="p-4 bg-surface border border-border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-ink-900 block">Interactive Permission Grid</span>
              <span className="text-[11px] text-ink-500">
                Click any cell to cycle values (None → View → Edit → Approve). Changes persist immediately.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-ink-500">Simulate sidebar as:</span>
              <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-xs border border-border font-mono">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={clsx(
                      'px-2 py-0.5 rounded-xs transition-colors text-[11px]',
                      r === currentRole
                        ? 'bg-primary text-white font-bold shadow-xs'
                        : 'text-ink-500 hover:text-ink-900'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-sunken text-[11px] uppercase tracking-wider text-ink-700 font-semibold">
                    <th className="py-3 px-4 w-40">System Role</th>
                    {modules.map((m) => (
                      <th key={m} className="py-3 px-4 text-center">
                        {m} Module
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {roles.map((r) => {
                    const isCurrentRole = r === currentRole;
                    return (
                      <tr
                        key={r}
                        className={clsx(
                          'hover:bg-primary-tint/20 transition-colors',
                          isCurrentRole && 'bg-primary-tint/30'
                        )}
                      >
                        <td className="py-3 px-4 font-bold text-ink-900 flex items-center gap-2">
                          <span>{r}</span>
                          {isCurrentRole && (
                            <Badge variant="primary" size="sm">
                              Active View
                            </Badge>
                          )}
                        </td>

                        {modules.map((mod) => {
                          const perm = permissionMatrix[r]?.[mod] || 'None';
                          const permColors = {
                            None: 'bg-surface-sunken text-ink-300 border-border',
                            View: 'bg-info-tint text-info border-info/30',
                            Edit: 'bg-warning-tint text-warning border-warning/30 font-semibold',
                            Approve: 'bg-success-tint text-success border-success/30 font-bold',
                          }[perm];

                          return (
                            <td key={mod} className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => cyclePermission(r, mod)}
                                className={clsx(
                                  'w-20 py-1 rounded-xs border text-[11px] font-mono transition-transform active:scale-95 cursor-pointer shadow-xs',
                                  permColors
                                )}
                                title="Click to cycle permission level"
                              >
                                {perm}
                              </button>
                            </td>
                          );
                        })}

                        <td className="py-3 px-4 text-right">
                          <Button
                            variant={isCurrentRole ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setRole(r)}
                          >
                            {isCurrentRole ? 'Current' : 'Simulate'}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPERATING SUBSIDIARIES (ENTITIES) */}
      {activeTab === 'entities' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(ENTITIES)
            .filter(([k]) => k !== 'consolidated')
            .map(([k, ent]) => (
              <div
                key={k}
                className="p-5 bg-surface border border-border rounded-md shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="sm">
                    {ent.country}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-ink-500">
                    Prefix: {ent.prefix}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-ink-900">{ent.name}</h3>
                  <p className="text-xs text-ink-500 font-mono mt-0.5">{ent.taxId}</p>
                </div>
                <div className="space-y-1 text-xs text-ink-700 pt-2 border-t border-border">
                  <p>
                    <strong>Base Currency:</strong> {ent.baseCurrency}
                  </p>
                  <p>
                    <strong>Trading Currency:</strong> {ent.tradeCurrency}
                  </p>
                  <p>
                    <strong>City / Hub:</strong> {ent.city}
                  </p>
                  <p>
                    <strong>Headcount:</strong> {ent.userCount} users
                  </p>
                </div>
                <div className="pt-2 border-t border-border text-[10.5px] font-mono text-ink-500 truncate">
                  {ent.bankBlock}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 3: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-sunken text-[11px] uppercase tracking-wider text-ink-500">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Territory</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-surface-sunken/40">
                  <td className="py-2.5 px-3 font-semibold text-ink-900">{u.name}</td>
                  <td className="py-2.5 px-3 font-mono text-ink-700">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="neutral" size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-ink-500">{u.territory}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge variant="success" size="sm">
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        description="Grants multi-entity or role-scoped access to Stratum ERP."
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            placeholder="e.g. Jean-Luc Mwamba"
            required
          />
          <Input
            label="Corporate Email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="e.g. j.mwamba@stratum.zm"
            required
          />
          <Select
            label="Assigned Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
          >
            <option value="Sales">Sales (RFQ & Quotations)</option>
            <option value="Buyer">Buyer (Supplier Procurement)</option>
            <option value="Finance">Finance (Invoicing & Settlement)</option>
            <option value="Director">Director (Full Audit & Approval)</option>
            <option value="Admin">Admin (Full System Config)</option>
          </Select>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
