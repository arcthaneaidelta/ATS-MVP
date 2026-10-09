import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Workflow, WorkflowNode } from '../../data/types';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { 
  Workflow as WorkflowIcon, Zap, Clock, MessageSquare, 
  Mail, PhoneCall, CheckCircle2, ChevronRight, 
  HelpCircle, Eye, ShieldCheck, ArrowRight, CornerDownRight 
} from 'lucide-react';

export const Workflows: React.FC = () => {
  const { workflows, contacts } = useAppStore();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0].id);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('contact-priya');
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];
  const selectedLead = contacts.find(c => c.id === selectedLeadId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Automated Workflows</h1>
          <p className="text-xs text-text-muted mt-1">
            Visual node maps showing logic branches, quiet hours (8 AM–8 PM), and strict stop-on-reply conditions.
          </p>
        </div>

        {/* Lead Timeline Position Inspector */}
        <div className="flex items-center gap-2 bg-surface p-1.5 rounded-input border border-border text-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase">Inspect Lead Position:</span>
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="bg-sunken border border-border rounded px-2 py-0.5 text-xs text-text outline-none font-medium"
          >
            {contacts.slice(0, 8).map(c => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} ({c.stage.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5 Workflow Cards Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {workflows.map((wf) => {
          const isSelected = wf.id === selectedWorkflowId;
          return (
            <div
              key={wf.id}
              onClick={() => {
                setSelectedWorkflowId(wf.id);
                setSelectedNode(null);
              }}
              className={`p-3.5 rounded-card border cursor-pointer transition-all space-y-2 text-left ${
                isSelected
                  ? 'bg-surface-elevated border-primary shadow-sh-1 ring-1 ring-primary'
                  : 'bg-surface hover:bg-sunken border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-[10px] font-mono text-text-muted">{wf.nodes.length} Steps</span>
              </div>
              <h3 className="font-semibold text-xs text-text leading-snug line-clamp-2">
                {wf.name}
              </h3>
              <div className="flex items-center justify-between text-[10px] text-text-muted pt-1">
                <span>{wf.activeLeads} active leads</span>
                <span className="font-medium text-primary">View →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Workflow Node Map Canvas */}
      <div className="bg-surface-elevated rounded-modal border border-border p-6 shadow-sh-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
          <div>
            <h3 className="text-base font-bold text-text">{currentWorkflow.name}</h3>
            <p className="text-xs text-text-muted mt-0.5">{currentWorkflow.description}</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-text-muted">Trigger:</span>
            <span className="text-xs font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-chip">
              {currentWorkflow.trigger}
            </span>
          </div>
        </div>

        {/* Interactive SVG Node Flowchart (Horizontal scrollable) */}
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="flex items-center gap-4 min-w-[950px] py-4 px-2">
            {currentWorkflow.nodes.map((node, idx) => {
              const isSelected = selectedNode?.id === node.id;
              const isTrigger = node.type === 'trigger';
              const isCondition = node.type === 'condition';
              const isWait = node.type === 'wait';
              const isExit = node.type === 'exit';

              const icon = node.channel === 'sms' ? (
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
              ) : node.channel === 'email' ? (
                <Mail className="w-3.5 h-3.5 text-info" />
              ) : isWait ? (
                <Clock className="w-3.5 h-3.5 text-text-muted" />
              ) : isCondition ? (
                <Zap className="w-3.5 h-3.5 text-accent" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              );

              return (
                <React.Fragment key={node.id}>
                  {/* Node Box */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`w-[170px] p-3.5 rounded-card border cursor-pointer transition-all space-y-1.5 shrink-0 text-left ${
                      isSelected
                        ? 'bg-primary-soft/50 border-primary ring-2 ring-primary shadow-sh-2'
                        : isTrigger
                        ? 'bg-surface border-primary/30'
                        : isCondition
                        ? 'bg-accent-soft/30 border-accent/40'
                        : isWait
                        ? 'bg-sunken border-border'
                        : 'bg-surface border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        {icon}
                        <span>{node.type}</span>
                      </div>
                      <span className="text-[10px] text-text-muted">#{idx + 1}</span>
                    </div>

                    <div className="font-semibold text-xs text-text leading-tight">
                      {node.title}
                    </div>

                    {node.subtitle && (
                      <div className="text-[10px] text-text-2 leading-snug truncate">
                        {node.subtitle}
                      </div>
                    )}

                    {node.stopConditions && (
                      <div className="text-[9px] text-accent font-semibold pt-1">
                        ● {node.stopConditions.length} stop conditions
                      </div>
                    )}
                  </div>

                  {/* Flow Arrow */}
                  {idx < currentWorkflow.nodes.length - 1 && (
                    <div className="flex items-center justify-center text-border-strong shrink-0">
                      <ArrowRight className="w-4 h-4 stroke-[2]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Bar */}
        {selectedNode ? (
          <div className="p-5 bg-sunken rounded-card border border-border space-y-3 animate-in fade-in-50 duration-fast">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase text-primary">Node Inspection:</span>
                <span className="font-bold text-sm text-text">{selectedNode.title}</span>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-xs text-text-muted hover:text-text"
              >
                Close Details ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-2">
              <div>
                <span className="font-semibold text-text-muted uppercase text-[10px] block mb-1">
                  Send Window & Timing:
                </span>
                <div className="bg-surface p-2.5 rounded border border-border">
                  {selectedNode.sendWindow || 'Mon–Sun, 8:00 AM – 8:00 PM local time (Strict Quiet Hours)'}
                </div>
              </div>

              <div>
                <span className="font-semibold text-text-muted uppercase text-[10px] block mb-1">
                  Automatic Stop Rules:
                </span>
                <div className="bg-surface p-2.5 rounded border border-border">
                  {selectedNode.stopConditions ? (
                    <ul className="list-disc pl-4 space-y-0.5">
                      {selectedNode.stopConditions.map(cond => (
                        <li key={cond} className="font-medium text-accent">{cond}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>Exits automatically if lead replies or books.</span>
                  )}
                </div>
              </div>
            </div>

            {selectedNode.copy && (
              <div className="space-y-1 pt-1">
                <span className="font-semibold text-text-muted uppercase text-[10px] block">
                  Outbound Template Copy:
                </span>
                <pre className="p-3 bg-surface-elevated rounded border border-border font-sans text-xs text-text leading-relaxed whitespace-pre-wrap">
                  {selectedNode.copy}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-sunken/40 rounded-card border border-dashed border-border text-center text-xs text-text-muted">
            Click on any node above to inspect its message copy, quiet hours, and stop rules.
          </div>
        )}
      </div>
    </div>
  );
};
