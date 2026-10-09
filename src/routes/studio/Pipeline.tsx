import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Opportunity, StageId, Contact } from '../../data/types';
import { STAGES, TEAM } from '../../data/brand';
import { formatCurrency } from '../../lib/format';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { 
  Search, Filter, Plus, Phone, MessageSquare, Mail, 
  Clock, AlertCircle, CheckCircle2, ChevronRight, 
  ChevronLeft, Sparkles, Layers, List as ListIcon, 
  Calendar as CalendarIcon, User, Send 
} from 'lucide-react';

export const Pipeline: React.FC = () => {
  const { 
    opportunities, contacts, messages, calls, tasks, notes, 
    moveOpportunityStage, addNoteToContact, toggleTask, addTask, addOpportunity 
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [lostLaneExpanded, setLostLaneExpanded] = useState(false);

  // Selected Opportunity Drawer
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'timeline' | 'tasks' | 'notes'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Moving to Lost confirmation modal
  const [lostModalOppId, setLostModalOppId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState('Budget mismatch / below minimum');

  // New Opportunity Modal
  const [isNewOppModalOpen, setIsNewOppModalOpen] = useState(false);
  const [newOppName, setNewOppName] = useState('');
  const [newOppValue, setNewOppValue] = useState(45000);
  const [newOppProject, setNewOppProject] = useState('Kitchen Remodel');

  const selectedOpp = opportunities.find(o => o.id === selectedOppId);
  const selectedContact = selectedOpp ? contacts.find(c => c.id === selectedOpp.contactId) : null;

  // Filtered Opportunities
  const filteredOpps = opportunities.filter(opp => {
    const contact = contacts.find(c => c.id === opp.contactId);
    const fullName = contact ? `${contact.firstName} ${contact.lastName}` : '';
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          opp.projectType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === 'All' || (contact && contact.source === sourceFilter);
    return matchesSearch && matchesSource;
  });

  const handleStageMove = (oppId: string, newStage: StageId) => {
    if (newStage === 'lost') {
      setLostModalOppId(oppId);
      return;
    }
    moveOpportunityStage(oppId, newStage);
  };

  const handleConfirmLost = () => {
    if (lostModalOppId) {
      moveOpportunityStage(lostModalOppId, 'lost', lostReason);
      setLostModalOppId(null);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedOpp) return;
    addNoteToContact(selectedOpp.contactId, newNoteText.trim());
    setNewNoteText('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedOpp) return;
    addTask({
      contactId: selectedOpp.contactId,
      title: newTaskTitle.trim(),
      dueDate: 'Tomorrow, 5:00 PM',
      assigneeId: selectedOpp.assigneeId || 'user-dana',
      completed: false,
    });
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Pipeline Kanban</h1>
          <p className="text-xs text-text-muted mt-1">
            Drag opportunities across stages to trigger automated staff tasks, reminder flows, and notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-input border border-border bg-surface p-0.5">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 ${
                viewMode === 'board' ? 'bg-primary text-surface font-semibold' : 'text-text-muted hover:text-text'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-primary text-surface font-semibold' : 'text-text-muted hover:text-text'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewOppModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New Opportunity
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded-card border border-border">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, rooms, or neighborhoods..."
            className="w-full text-xs bg-transparent text-text placeholder:text-text-muted outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase">Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs bg-sunken border border-border rounded px-2.5 py-1 text-text outline-none"
          >
            <option value="All">All Sources</option>
            <option value="Website Form">Website Form</option>
            <option value="Voice Agent">Voice Agent</option>
            <option value="Google Business Profile">Google Business</option>
            <option value="Referral">Referral</option>
            <option value="Facebook Ad">Facebook Ad</option>
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' && (
        <div className="flex items-start gap-4 overflow-x-auto pb-6 pt-1">
          {STAGES.map((stage) => {
            if (stage.id === 'lost' && !lostLaneExpanded) {
              return (
                <div
                  key={stage.id}
                  onClick={() => setLostLaneExpanded(true)}
                  className="w-12 h-[600px] bg-sunken/60 border border-dashed border-border-strong rounded-card flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-sunken transition-colors shrink-0 text-text-muted hover:text-text"
                  title="Expand Lost / Closed Lane"
                >
                  <ChevronRight className="w-4 h-4 mb-2" />
                  <span className="[writing-mode:vertical-rl] text-xs font-semibold tracking-wider uppercase">
                    Lost ({opportunities.filter(o => o.stage === 'lost').length})
                  </span>
                </div>
              );
            }

            const laneOpps = filteredOpps.filter(o => o.stage === stage.id);
            const laneValue = laneOpps.reduce((acc, curr) => acc + curr.value, 0);

            return (
              <div
                key={stage.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const oppId = e.dataTransfer.getData('text/plain');
                  if (oppId) handleStageMove(oppId, stage.id);
                }}
                className={`w-[280px] bg-sunken/50 rounded-card border border-border flex flex-col shrink-0 max-h-[750px] transition-colors ${
                  stage.id === 'lost' ? 'bg-error/5 border-error/20' : ''
                }`}
              >
                {/* Lane Header */}
                <div className="p-3.5 border-b border-border bg-surface rounded-t-card space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                      {stage.name}
                    </h3>
                    <span className="text-xs font-bold text-text bg-sunken px-2 py-0.5 rounded-chip">
                      {laneOpps.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>{formatCurrency(laneValue)}</span>
                    <span className="text-[10px] text-primary font-medium">{stage.rulesCount} rules</span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                  {laneOpps.map((opp) => {
                    const contact = contacts.find(c => c.id === opp.contactId);
                    const task = tasks.find(t => t.contactId === opp.contactId && !t.completed);
                    const isOptedOut = contact?.dnd.sms;

                    return (
                      <div
                        key={opp.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', opp.id)}
                        onClick={() => setSelectedOppId(opp.id)}
                        className="p-3.5 bg-surface-elevated rounded-input border border-border shadow-sh-1 hover:shadow-sh-2 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                            {contact ? `${contact.firstName} ${contact.lastName}` : 'Lead'}
                          </span>
                          <span className="text-xs font-bold font-mono text-text">
                            {formatCurrency(opp.value)}
                          </span>
                        </div>

                        <div className="text-[11px] text-text-2">
                          {opp.projectType} · <span className="text-text-muted">{opp.budgetBand}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded bg-sunken text-text-muted text-[10px]">
                            {contact?.source || 'Website'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {isOptedOut && (
                              <span className="w-2 h-2 rounded-full bg-error" title="Opted out of SMS (TCPA STOP)" />
                            )}
                            <div className="w-5 h-5 rounded-full bg-primary-soft text-primary font-bold text-[9px] flex items-center justify-center">
                              DW
                            </div>
                          </div>
                        </div>

                        {task && (
                          <div className="pt-1.5 border-t border-border/60 text-[10px] text-text-muted flex items-center gap-1 truncate">
                            <Clock className="w-3 h-3 text-warning shrink-0" />
                            <span className="truncate">{task.title}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {laneOpps.length === 0 && (
                    <div className="py-8 text-center text-xs text-text-muted border border-dashed border-border rounded-input">
                      No opportunities
                    </div>
                  )}
                </div>

                {stage.id === 'lost' && (
                  <div className="p-2 border-t border-border text-center">
                    <button
                      onClick={() => setLostLaneExpanded(false)}
                      className="text-[10px] text-text-muted hover:text-text font-medium"
                    >
                      Collapse lane ←
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List View Alternative */}
      {viewMode === 'list' && (
        <div className="bg-surface rounded-modal border border-border overflow-hidden shadow-sh-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text">
              <thead className="bg-sunken border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                <tr>
                  <th className="py-3 px-4">Lead Name</th>
                  <th className="py-3 px-4">Project & Budget</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOpps.map((opp) => {
                  const contact = contacts.find(c => c.id === opp.contactId);
                  return (
                    <tr
                      key={opp.id}
                      onClick={() => setSelectedOppId(opp.id)}
                      className="hover:bg-sunken/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold">
                        {contact ? `${contact.firstName} ${contact.lastName}` : 'Lead'}
                      </td>
                      <td className="py-3 px-4 text-text-2">{opp.projectType}</td>
                      <td className="py-3 px-4 capitalize font-medium">{opp.stage.replace('_', ' ')}</td>
                      <td className="py-3 px-4 font-mono font-semibold">{formatCurrency(opp.value)}</td>
                      <td className="py-3 px-4">{contact?.source}</td>
                      <td className="py-3 px-4">Dana Whitfield</td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-primary font-semibold hover:underline">View Details →</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Opportunity Details Drawer */}
      <Drawer
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOppId(null)}
        title={selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : 'Opportunity Details'}
        subtitle={selectedOpp ? `${selectedOpp.projectType} · ${formatCurrency(selectedOpp.value)}` : undefined}
        width="lg"
      >
        {selectedOpp && selectedContact && (
          <div className="space-y-6">
            {/* Stage Selector Bar */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                Current Pipeline Stage
              </label>
              <select
                value={selectedOpp.stage}
                onChange={(e) => handleStageMove(selectedOpp.id, e.target.value as StageId)}
                className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs font-semibold text-text outline-none"
              >
                {STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Drawer Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-1">
              {(['overview', 'timeline', 'tasks', 'notes'] as const).map((tab) => (
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

            {/* TAB 1: OVERVIEW & CUSTOM FIELDS */}
            {drawerTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="bg-sunken/60 p-4 rounded-card border border-border space-y-3">
                  <h4 className="font-semibold text-text uppercase tracking-wider text-[11px]">
                    Extracted Custom Fields (GHL)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-text-2">
                    <div>
                      <span className="text-text-muted block text-[10px]">Project Type:</span>
                      <span className="font-medium text-text">{selectedOpp.projectType}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Budget Band:</span>
                      <span className="font-medium text-text">{selectedOpp.budgetBand}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Start Window:</span>
                      <span className="font-medium text-text">{selectedOpp.startWindow}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Homeowner Occupied:</span>
                      <span className="font-medium text-text">{selectedContact.ownerOccupied ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Zip Code:</span>
                      <span className="font-medium text-text">{selectedContact.zip}</span>
                    </div>
                    <div>
                      <span className="text-text-muted block text-[10px]">Lead Source:</span>
                      <span className="font-medium text-text">{selectedContact.source}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-text-muted uppercase">Project Notes from Lead</span>
                  <p className="text-xs text-text-2 bg-surface p-3 rounded-input border border-border leading-relaxed">
                    {selectedContact.projectDescription || 'No additional room notes submitted.'}
                  </p>
                </div>

                <div className="p-3 rounded-card bg-surface border border-border space-y-1.5">
                  <span className="text-[11px] font-semibold text-text uppercase">Consent & DND Status</span>
                  <div className="text-[11px] text-text-muted flex items-center justify-between">
                    <span>SMS Status:</span>
                    <span className={selectedContact.dnd.sms ? 'text-error font-bold' : 'text-success font-bold'}>
                      {selectedContact.dnd.sms ? 'DND Active (Opted Out)' : 'Consented (✓)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted flex items-center justify-between">
                    <span>Email Status:</span>
                    <span className="text-success font-bold">Consented (✓)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TIMELINE */}
            {drawerTab === 'timeline' && (
              <div className="space-y-3 text-xs">
                {messages.filter(m => m.contactId === selectedContact.id).map((msg) => (
                  <div key={msg.id} className="p-3 bg-sunken/40 rounded-card border border-border space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-text uppercase text-[10px]">
                        {msg.channel.toUpperCase()} · {msg.templateName}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        msg.status === 'sent' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-2">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: TASKS */}
            {drawerTab === 'tasks' && (
              <div className="space-y-4 text-xs">
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none"
                  />
                  <Button type="submit" variant="primary" size="sm">Add</Button>
                </form>

                <div className="space-y-2">
                  {tasks.filter(t => t.contactId === selectedContact.id).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-3 bg-surface rounded-card border border-border flex items-start gap-2.5 cursor-pointer hover:bg-sunken transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${task.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                          {task.title}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">Due: {task.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: NOTES */}
            {drawerTab === 'notes' && (
              <div className="space-y-4 text-xs">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Add a team note..."
                    className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none resize-none"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                      Post Note
                    </Button>
                  </div>
                </form>

                <div className="space-y-2">
                  {notes.filter(n => n.contactId === selectedContact.id).map((n) => (
                    <div key={n.id} className="p-3 bg-surface rounded-card border border-border space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-text-muted">
                        <span className="font-semibold text-text">{n.author}</span>
                        <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-text-2 leading-relaxed">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Moving to Lost Modal */}
      <Modal
        isOpen={Boolean(lostModalOppId)}
        onClose={() => setLostModalOppId(null)}
        title="Mark Opportunity as Lost"
        description="Select a reason. All scheduled automated outreach will be cancelled immediately."
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs text-text-2">
          <div className="space-y-1.5 text-left">
            <label className="font-semibold text-text uppercase text-[11px] block">
              Lost Reason:
            </label>
            <select
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs text-text outline-none"
            >
              <option value="Budget mismatch / below minimum">Budget mismatch / below minimum</option>
              <option value="Unresponsive to 7-day follow-up">Unresponsive to 7-day follow-up</option>
              <option value="Renter / landlord declined">Renter / landlord declined</option>
              <option value="Hired another general contractor">Hired another general contractor</option>
              <option value="Project postponed">Project postponed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => setLostModalOppId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmLost}>
              Halt Outreach & Move to Lost
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Opportunity Modal */}
      <Modal
        isOpen={isNewOppModalOpen}
        onClose={() => setIsNewOppModalOpen(false)}
        title="Create New Opportunity"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-text block">Lead Full Name</label>
            <input
              type="text"
              value={newOppName}
              onChange={(e) => setNewOppName(e.target.value)}
              placeholder="e.g. Samuel Adeyemi"
              className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text block">Project Type</label>
            <input
              type="text"
              value={newOppProject}
              onChange={(e) => setNewOppProject(e.target.value)}
              className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text block">Estimated Value ($)</label>
            <input
              type="number"
              value={newOppValue}
              onChange={(e) => setNewOppValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-sunken rounded-input border border-border text-xs outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => setIsNewOppModalOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (newOppName.trim()) {
                  addOpportunity({
                    contactId: 'contact-maya',
                    stage: 'new_inquiry',
                    value: newOppValue,
                    projectType: newOppProject,
                    budgetBand: '$50k–$75k',
                    startWindow: '1–3 months',
                    assigneeId: 'user-dana',
                  });
                  setIsNewOppModalOpen(false);
                }
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
