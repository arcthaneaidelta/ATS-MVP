import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { CustomFieldDefinition, TagDefinition } from '../../data/types';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { 
  Settings, Tags, Database, ShieldCheck, CheckCircle2, 
  Copy, Check, AlertCircle, Clock, ExternalLink, Plus 
} from 'lucide-react';

export const Setup: React.FC = () => {
  const { customFields, tags, sources, readiness, verifyReadinessStep, verifyAllReadiness, addToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'fields' | 'sources' | 'readiness'>('fields');
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<CustomFieldDefinition | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
    addToast({
      title: 'Copied to Clipboard',
      message: text,
      type: 'info',
    });
  };

  const handleRunVerifyAll = async () => {
    setIsVerifying(true);
    await verifyAllReadiness();
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Subaccount Setup & Readiness</h1>
          <p className="text-xs text-text-muted mt-1">
            Data models, tag taxonomy, domain DNS authentication records, and carrier approval timelines.
          </p>
        </div>

        <div className="inline-flex rounded-input border border-border bg-surface p-0.5 text-xs">
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'fields' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Fields & Tags</span>
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'sources' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <Tags className="w-3.5 h-3.5" />
            <span>Lead Sources</span>
          </button>
          <button
            onClick={() => setActiveTab('readiness')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'readiness' ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Go-Live Checklist</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FIELDS & TAGS */}
      {activeTab === 'fields' && (
        <div className="space-y-8">
          {/* Custom Fields Table */}
          <div className="bg-surface-elevated rounded-modal border border-border shadow-sh-1 overflow-hidden space-y-0">
            <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">Custom Fields Architecture</h3>
                <p className="text-[11px] text-text-muted">Standardized data attributes feeding pipelines and Retell voice webhooks</p>
              </div>
              <span className="text-xs font-mono text-primary font-bold">{customFields.length} Defined Fields</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text">
                <thead className="bg-sunken border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Field Name</th>
                    <th className="py-2.5 px-4">API Key</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Usage</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customFields.map(f => (
                    <tr key={f.id} className="hover:bg-sunken/40">
                      <td className="py-3 px-4 font-semibold text-text">{f.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-text-muted">{f.key}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-sunken font-mono text-[10px] text-text-2 uppercase">
                          {f.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-primary font-medium">Used in {f.usedInCount} automations</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedField(f)}
                          className="text-primary font-semibold hover:underline"
                        >
                          Inspect Usage →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tag Library by Category */}
          <div className="bg-surface-elevated rounded-modal border border-border p-6 shadow-sh-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">Tag Library & Taxonomy</h3>
                <p className="text-[11px] text-text-muted">Structured contact categorizations preventing naming collisions</p>
              </div>
              <span className="text-xs font-mono text-text-muted">{tags.length} Active Tags</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {(['Lifecycle', 'Intent', 'Compliance', 'Source'] as const).map(cat => (
                <div key={cat} className="p-3.5 rounded-card bg-sunken border border-border space-y-2">
                  <div className="font-bold text-text text-xs uppercase tracking-wider border-b border-border/60 pb-1.5">
                    {cat}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.filter(t => t.category === cat).map(t => (
                      <span key={t.id} className={`px-2 py-0.5 rounded-chip text-[11px] font-medium border ${t.color}`}>
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEAD SOURCES */}
      {activeTab === 'sources' && (
        <div className="bg-surface-elevated rounded-modal border border-border overflow-hidden shadow-sh-1">
          <div className="p-4 bg-surface border-b border-border">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">Lead Source & UTM Attribution Rules</h3>
            <p className="text-[11px] text-text-muted">Inbound attribution mapping from URLs and voice webhooks to CRM fields</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-text">
              <thead className="bg-sunken border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                <tr>
                  <th className="py-2.5 px-4">Channel Name</th>
                  <th className="py-2.5 px-4">Matched utm_source</th>
                  <th className="py-2.5 px-4">Total Leads</th>
                  <th className="py-2.5 px-4">Historical Win Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sources.map(s => (
                  <tr key={s.id} className="hover:bg-sunken/40">
                    <td className="py-3 px-4 font-semibold text-text">{s.source}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-primary">{s.utmSource}</td>
                    <td className="py-3 px-4 font-bold">{s.leadsCount}</td>
                    <td className="py-3 px-4 font-semibold text-success">{s.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GO-LIVE READINESS CHECKLIST */}
      {activeTab === 'readiness' && (
        <div className="space-y-6">
          <div className="p-4 bg-primary-soft/50 border border-primary/20 rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-text text-sm">Third-Party Verification Checklist</div>
              <div className="text-text-muted">
                Honest visibility into domain DNS records, phone provisioning, and carrier vetting dependencies.
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              loading={isVerifying}
              onClick={handleRunVerifyAll}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Verify Infrastructure DNS
            </Button>
          </div>

          <div className="space-y-3.5">
            {readiness.map(item => {
              const isVerified = item.status === 'verified';
              const isPendingCarrier = item.status === 'pending_external';

              return (
                <div
                  key={item.id}
                  className="bg-surface-elevated rounded-modal border border-border p-5 space-y-3 shadow-sh-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        isVerified ? 'bg-success' : 'bg-warning animate-pulse'
                      }`} />
                      <h4 className="font-bold text-sm text-text">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] text-text-muted">Owner: <strong>{item.owner}</strong></span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        isVerified ? 'bg-success/15 text-success' : 'bg-warning/15 text-[#8F661B]'
                      }`}>
                        {isPendingCarrier ? 'Pending Carrier Review' : item.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-text-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-text-muted">
                    <span>Typical turnaround: <strong>{item.typicalWait}</strong></span>
                  </div>

                  {/* DNS Records Table */}
                  {item.details?.records && (
                    <div className="pt-2 border-t border-border space-y-1.5">
                      <span className="text-[10px] font-semibold text-text-muted uppercase">DNS Resource Records:</span>
                      <div className="space-y-1.5">
                        {item.details.records.map((rec, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded bg-sunken text-xs font-mono flex items-center justify-between gap-2 text-text"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="px-1 py-0.5 bg-surface rounded text-[10px] font-bold text-primary">
                                {rec.type}
                              </span>
                              <span className="text-text-muted">{rec.host}</span>
                              <span className="truncate">{rec.value}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(rec.value, `${item.id}-${idx}`)}
                              className="text-text-muted hover:text-text shrink-0 p-1"
                              title="Copy record"
                            >
                              {copiedRecord === `${item.id}-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Honest External Dependency Note (e.g. A2P 10DLC) */}
                  {item.details?.notes && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-input text-xs text-[#8F661B] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span>{item.details.notes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Field Inspection Drawer */}
      <Drawer
        isOpen={Boolean(selectedField)}
        onClose={() => setSelectedField(null)}
        title={selectedField ? selectedField.name : 'Field Usage'}
        subtitle={selectedField ? `API Key: ${selectedField.key}` : undefined}
      >
        {selectedField && (
          <div className="space-y-4 text-xs text-text-2">
            <div className="bg-sunken p-3.5 rounded-card border border-border space-y-1.5">
              <div className="font-semibold text-text">Referenced Across {selectedField.usedInCount} Automations</div>
              <ul className="list-disc pl-4 space-y-1 text-text-2">
                {selectedField.locations.map(loc => (
                  <li key={loc}>{loc}</li>
                ))}
              </ul>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Standardized key consistency guarantees that whenever a lead enters from the website survey or Finch Assist voice calls, the value maps cleanly into this field.
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
};
