import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Contact } from '../../data/types';
import { exportToCsv } from '../../lib/csv';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { 
  Search, Filter, Download, Plus, Check, 
  ShieldCheck, ShieldAlert, Mail, Phone, Clock, 
  Tag as TagIcon, ArrowRight, UserCheck, MessageSquare 
} from 'lucide-react';

export const Contacts: React.FC = () => {
  const { contacts, tags, addTagToContact } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [optedOutOnly, setOptedOutOnly] = useState(false);

  // Selected contact for Drawer
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<'details' | 'compliance' | 'activity'>('details');
  const [newTagInput, setNewTagInput] = useState('');

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  // Filtered contacts
  const filteredContacts = contacts.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.phone.includes(searchQuery);
    const matchesTag = selectedTag === 'All' || c.tags.includes(selectedTag);
    const matchesSource = selectedSource === 'All' || c.source === selectedSource;
    const matchesOptOut = !optedOutOnly || c.dnd.sms;
    return matchesSearch && matchesTag && matchesSource && matchesOptOut;
  });

  const handleExportCsv = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Stage', 'Source', 'Zip', 'SMS Consent', 'Tags'];
    const rows = filteredContacts.map(c => [
      c.firstName,
      c.lastName,
      c.email,
      c.phone,
      c.stage,
      c.source,
      c.zip,
      c.dnd.sms ? 'OPTED_OUT' : 'CONSENTED',
      c.tags.join('; '),
    ]);
    exportToCsv('alder-and-finch-contacts.csv', headers, rows);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || !selectedContact) return;
    addTagToContact(selectedContact.id, newTagInput.trim());
    setNewTagInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Contacts Database</h1>
          <p className="text-xs text-text-muted mt-1">
            Complete customer profiles, TCPA opt-out audit records, and attribution tracking for {contacts.length} homeowners.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV ({filteredContacts.length})
          </Button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-surface p-3.5 rounded-card border border-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-transparent text-text placeholder:text-text-muted outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase">Tag:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-sunken border border-border rounded px-2 py-1 text-text outline-none text-xs"
            >
              <option value="All">All Tags</option>
              {tags.map(t => (
                <option key={t.id} value={t.name}>{t.name} ({t.count})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-sunken border border-border rounded px-2 py-1 text-text outline-none text-xs"
            >
              <option value="All">All Sources</option>
              <option value="Website Form">Website Form</option>
              <option value="Voice Agent">Voice Agent</option>
              <option value="Google Business Profile">Google Business</option>
              <option value="Referral">Referral</option>
              <option value="Facebook Ad">Facebook Ad</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer ml-1 select-none">
            <input
              type="checkbox"
              checked={optedOutOnly}
              onChange={(e) => setOptedOutOnly(e.target.checked)}
              className="rounded"
            />
            <span className="font-semibold text-error text-xs">Opted Out (DND)</span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-modal border border-border overflow-hidden shadow-sh-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text">
            <thead className="bg-sunken border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4">Consent Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className="hover:bg-sunken/40 cursor-pointer transition-colors"
                >
                  {/* Name + Initials */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-text">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-[11px] text-text-muted">{contact.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Tags */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 flex-wrap max-w-xs">
                      {contact.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-sunken text-text-2 border border-border">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="text-[10px] text-text-muted">+{contact.tags.length - 2}</span>
                      )}
                      {contact.mergedFrom && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-soft text-accent font-semibold">
                          Merged
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4 text-text-2">{contact.source}</td>

                  {/* Stage */}
                  <td className="py-3 px-4 capitalize font-medium">{contact.stage.replace('_', ' ')}</td>

                  {/* Last Touch */}
                  <td className="py-3 px-4 text-text-muted">{contact.lastTouch}</td>

                  {/* Consent Status Chips */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {contact.dnd.sms ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-error/15 text-error font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          Opted Out (DND)
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-success/15 text-success font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          SMS ✓
                        </span>
                      )}
                    </div>
                  </td>

                  {/* View action */}
                  <td className="py-3 px-4 text-right">
                    <span className="text-primary font-semibold hover:underline">Inspect →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Inspection Drawer */}
      <Drawer
        isOpen={Boolean(selectedContact)}
        onClose={() => setSelectedContactId(null)}
        title={selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : 'Contact Record'}
        subtitle={selectedContact ? `${selectedContact.phone} · Portland ${selectedContact.zip}` : undefined}
        width="md"
      >
        {selectedContact && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-1">
              {(['details', 'compliance', 'activity'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDrawerTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-input capitalize transition-colors ${
                    drawerTab === tab
                      ? 'bg-primary-soft text-primary'
                      : 'text-text-muted hover:text-text hover:bg-sunken'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: DETAILS */}
            {drawerTab === 'details' && (
              <div className="space-y-4 text-xs text-text-2">
                <div className="bg-sunken/60 p-4 rounded-card border border-border space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Email Address:</span>
                    <span className="font-semibold text-text">{selectedContact.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Phone Number:</span>
                    <span className="font-semibold text-text">{selectedContact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Location:</span>
                    <span className="font-semibold text-text">Portland, OR {selectedContact.zip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Property Ownership:</span>
                    <span className="font-semibold text-text">{selectedContact.ownerOccupied ? 'Owner Occupied' : 'Tenant'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Acquisition Source:</span>
                    <span className="font-semibold text-text">{selectedContact.source}</span>
                  </div>
                </div>

                {/* Tags management */}
                <div className="space-y-2">
                  <span className="font-semibold text-text uppercase text-[11px] block">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedContact.tags.map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-chip bg-sunken text-text-2 border border-border">
                        {t}
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddTag} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add new tag..."
                      className="flex-1 px-3 py-1.5 bg-sunken rounded-input border border-border text-xs outline-none"
                    />
                    <Button type="submit" variant="primary" size="sm">Add Tag</Button>
                  </form>
                </div>

                {selectedContact.mergedFrom && (
                  <div className="p-3 bg-accent-soft/40 border border-accent/30 rounded-input text-xs">
                    <strong className="text-accent font-semibold block">Deduplication History</strong>
                    <span>Merged duplicate inquiry submission on Oct 7. Retained historical timeline without double messaging.</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: COMPLIANCE & AUDIT */}
            {drawerTab === 'compliance' && (
              <div className="space-y-4 text-xs text-text-2">
                <div className="p-4 bg-surface rounded-card border border-border space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-semibold text-text uppercase text-[11px]">TCPA & 10DLC Record</span>
                    <ShieldCheck className="w-4 h-4 text-success" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-text-muted">Consent Capture Timestamp:</div>
                    <div className="font-mono text-text bg-sunken p-2 rounded text-[11px]">
                      {selectedContact.consent.timestamp}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-text-muted">Consent Text Displayed to Lead:</div>
                    <p className="text-[11px] text-text-2 italic bg-sunken p-2.5 rounded border border-border">
                      "{selectedContact.consent.text}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span>SMS Channel DND Status:</span>
                    <span className={`font-bold ${selectedContact.dnd.sms ? 'text-error' : 'text-success'}`}>
                      {selectedContact.dnd.sms ? 'DND Active (STOP Received)' : 'Deliverable (No DND)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ACTIVITY */}
            {drawerTab === 'activity' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-sunken rounded-card border border-border space-y-1">
                  <div className="font-semibold text-text">Last Touchpoint</div>
                  <p className="text-text-2">{selectedContact.lastTouch}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
