import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Call, CallOutcome } from '../../data/types';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { 
  PhoneCall, PhoneIncoming, PhoneOutgoing, CheckCircle2, 
  Clock, ShieldCheck, Sparkles, Code2, ChevronDown, 
  ChevronUp, Play, Pause, RotateCcw, AlertCircle, Info 
} from 'lucide-react';

export const Voice: React.FC = () => {
  const { calls, addCallRecord, addToast } = useAppStore();

  const [selectedCallId, setSelectedCallId] = useState<string>(calls[0]?.id || 'call-1');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
  const [isScopeDrawerOpen, setIsScopeDrawerOpen] = useState(false);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  // Live Simulated Call playback
  const [isPlayingSim, setIsPlayingSim] = useState(false);
  const [simLineIdx, setSimLineIdx] = useState(0);

  const selectedCall = calls.find(c => c.id === selectedCallId) || calls[0];

  const simulatedCallLines = [
    { speaker: 'agent' as const, timeSec: 0, text: 'Hello, this is Finch Assist with Alder & Finch Home Studio. Am I speaking with Liam?' },
    { speaker: 'caller' as const, timeSec: 3, text: 'Hi! Yes, Liam here. We just bought a 1918 Craftsman in Sellwood and need to remodel the kitchen.' },
    { speaker: 'agent' as const, timeSec: 9, text: 'Congratulations on your new home, Liam! Are you planning a full gut renovation with new cabinetry and layout changes?' },
    { speaker: 'caller' as const, timeSec: 16, text: 'Yes, full layout overhaul. We want to remove a partition wall and install soapstone counters.' },
    { speaker: 'agent' as const, timeSec: 22, text: 'Sounds wonderful. Do you have an estimated investment range set aside for this scope?' },
    { speaker: 'caller' as const, timeSec: 27, text: 'Our target budget is around $65,000 to $75,000, ready to start design immediately.' },
    { speaker: 'agent' as const, timeSec: 34, text: 'That fits our architectural projects seamlessly. I have an opening for an in-home design consultation this Thursday at 2:00 PM with Dana Whitfield. Does that suit you?' },
    { speaker: 'caller' as const, timeSec: 42, text: 'Thursday at 2 PM is perfect. Please send me the confirmation.' },
    { speaker: 'agent' as const, timeSec: 46, text: 'Confirmed! You will receive a text and email shortly. Thank you, Liam!' },
  ];

  useEffect(() => {
    let timer: any;
    if (isPlayingSim && simLineIdx < simulatedCallLines.length) {
      timer = setTimeout(() => {
        setSimLineIdx(prev => prev + 1);
      }, 1600);
    } else if (isPlayingSim && simLineIdx >= simulatedCallLines.length) {
      setIsPlayingSim(false);
      // Add the completed call to the store
      const newCall: Call = {
        id: `call-sim-${Date.now()}`,
        contactId: 'contact-liam',
        callerName: 'Liam O’Connor',
        phone: '+1 (503) 555-0187',
        direction: 'outbound',
        outcome: 'booked',
        durationSec: 168,
        timestamp: 'Just now',
        summary: 'Speed-to-lead voice qualification for 1918 Sellwood Craftsman. Verified budget $65k-$75k and booked in-home consultation for Thursday 2 PM.',
        transcript: simulatedCallLines,
        extractedFields: {
          project_type: 'Historic Kitchen Gut Remodel',
          budget_band: '$50k–$75k',
          start_window: 'Now',
          owner_occupied: 'true',
          zip_code: '97202',
          booking_status: 'confirmed',
          call_outcome: 'qualified_and_booked',
        },
        resultInGhl: {
          stageMoved: 'consultation_booked',
          tagsAdded: ['Voice Qualified', 'Retell Booked', 'Sellwood'],
          taskCreated: 'Prepare Sellwood property dossier for Dana',
          bookingCreated: true,
        },
      };
      addCallRecord(newCall);
      setSelectedCallId(newCall.id);
      addToast({
        title: 'Voice Call Sync Completed',
        message: 'Retell AI webhook delivered. Liam O’Connor moved to Consultation Booked.',
        type: 'success',
      });
    }
    return () => clearTimeout(timer);
  }, [isPlayingSim, simLineIdx, addCallRecord, addToast]);

  const startSimCall = () => {
    setSimLineIdx(0);
    setIsPlayingSim(true);
  };

  const filteredCalls = calls.filter(c => {
    if (outcomeFilter === 'all') return true;
    return c.outcome === outcomeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Integration Health Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-text">Voice Agent Console</h1>
            <span className="px-2 py-0.5 rounded-chip text-[11px] font-semibold bg-primary-soft text-primary">
              Retell AI + Twilio
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Real-time inbound call overflow, AI qualifying transcripts, and two-way GoHighLevel custom field sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={startSimCall}
            disabled={isPlayingSim}
            icon={isPlayingSim ? <Pause className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
          >
            {isPlayingSim ? `Playing Call (${simLineIdx}/${simulatedCallLines.length})...` : 'Simulate 20s AI Call'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsScopeDrawerOpen(true)}
            icon={<Code2 className="w-3.5 h-3.5 text-accent" />}
          >
            Itemized Scope
          </Button>
        </div>
      </div>

      {/* Integration Status Ribbon */}
      <div className="bg-surface rounded-card p-3 border border-border flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-text-muted">Webhook Endpoint:</span>
            <span className="font-semibold text-text">Healthy (200 OK)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-text-muted">Twilio Number:</span>
            <span className="font-semibold text-text">+1 (503) 555-0194</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-text-muted">Sync Latency:</span>
            <span className="font-semibold text-text">1.2 seconds</span>
          </div>
        </div>

        <button
          onClick={() => setIsScopeDrawerOpen(true)}
          className="text-primary font-semibold hover:underline flex items-center gap-1 text-[11px]"
        >
          <span>View integration specifications →</span>
        </button>
      </div>

      {/* Two-Pane Voice Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Call List (4 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-modal border border-border p-4 space-y-3.5 shadow-sh-1">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-semibold text-text uppercase tracking-wider">
              Call Log ({calls.length})
            </span>
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value)}
              className="text-[11px] bg-sunken border border-border rounded px-2 py-0.5 text-text outline-none"
            >
              <option value="all">All Outcomes</option>
              <option value="qualified">Qualified</option>
              <option value="booked">Booked</option>
              <option value="callback_requested">Callback</option>
              <option value="voicemail">Voicemail</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredCalls.map((call) => {
              const isSelected = call.id === selectedCallId;
              const outcomeBadge = 
                call.outcome === 'booked' ? 'bg-success/15 text-success' :
                call.outcome === 'qualified' ? 'bg-primary-soft text-primary' :
                call.outcome === 'callback_requested' ? 'bg-warning/15 text-[#8F661B]' :
                'bg-sunken text-text-muted';

              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCallId(call.id)}
                  className={`p-3 rounded-card border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-surface-elevated border-primary shadow-sh-1 ring-1 ring-primary'
                      : 'bg-surface hover:bg-sunken/50 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-text">
                      {call.direction === 'inbound' ? (
                        <PhoneIncoming className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-accent" />
                      )}
                      <span>{call.callerName}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${outcomeBadge}`}>
                      {call.outcome.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>{call.timestamp}</span>
                    <span>{Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Selected Call Detail (8 cols) */}
        <div className="lg:col-span-8 bg-surface-elevated rounded-modal border border-border p-6 space-y-6 shadow-sh-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-text">{selectedCall.callerName}</h3>
                <span className="text-xs text-text-muted font-mono">{selectedCall.phone}</span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {selectedCall.direction.toUpperCase()} Call · {selectedCall.timestamp} · Duration: {Math.floor(selectedCall.durationSec / 60)}m {selectedCall.durationSec % 60}s
              </p>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-chip bg-primary-soft text-primary capitalize self-start sm:self-auto">
              Outcome: {selectedCall.outcome.replace('_', ' ')}
            </span>
          </div>

          {/* AI Summary */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-text uppercase tracking-wider">
              Executive AI Call Summary
            </span>
            <p className="text-xs text-text-2 bg-sunken/60 p-3.5 rounded-input border border-border leading-relaxed">
              {selectedCall.summary}
            </p>
          </div>

          {/* Field Extraction Table (Mapping to GHL Custom Fields) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text uppercase tracking-wider">
                Extracted Fields & GHL Custom Field Mapping
              </span>
              <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Auto-Synced via Webhook
              </span>
            </div>

            <div className="border border-border rounded-input overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-sunken border-b border-border text-[10px] text-text-muted uppercase">
                  <tr>
                    <th className="py-2 px-3">Retell AI Payload Key</th>
                    <th className="py-2 px-3">Target GHL Custom Field</th>
                    <th className="py-2 px-3">Extracted Value</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(selectedCall.extractedFields).map(([key, value]) => {
                    const ghlFieldMap: Record<string, string> = {
                      project_type: 'Project Type',
                      budget_band: 'Budget Band',
                      start_window: 'Start Window',
                      owner_occupied: 'Property Owner',
                      zip_code: 'Zip Code',
                      booking_status: 'Booking Status',
                      call_outcome: 'Last Call Outcome',
                    };

                    return (
                      <tr key={key} className="bg-surface hover:bg-sunken/30">
                        <td className="py-2 px-3 font-mono text-[11px] text-text-2">{key}</td>
                        <td className="py-2 px-3 font-semibold text-primary">{ghlFieldMap[key] || key}</td>
                        <td className="py-2 px-3 font-medium text-text">{value}</td>
                        <td className="py-2 px-3 text-right">
                          <span className="text-success font-bold text-[10px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Written
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Result in GHL Box */}
          <div className="p-4 bg-primary-soft/40 border border-primary/20 rounded-card space-y-2 text-xs">
            <span className="font-bold text-primary uppercase text-[11px] block">
              Automated Downstream Actions in GHL
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-2">
              {selectedCall.resultInGhl.stageMoved && (
                <div>• Moved pipeline stage to <strong className="capitalize">{selectedCall.resultInGhl.stageMoved.replace('_', ' ')}</strong></div>
              )}
              {selectedCall.resultInGhl.bookingCreated && (
                <div>• Booked calendar consultation slot</div>
              )}
              {selectedCall.resultInGhl.taskCreated && (
                <div>• Created task: <em>"{selectedCall.resultInGhl.taskCreated}"</em></div>
              )}
              {selectedCall.resultInGhl.tagsAdded && (
                <div>• Added tags: [{selectedCall.resultInGhl.tagsAdded.join(', ')}]</div>
              )}
            </div>
          </div>

          {/* Transcript Viewer */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-text uppercase tracking-wider block">
              Full Dialogue Transcript
            </span>
            <div className="space-y-2 max-h-[220px] overflow-y-auto p-3 bg-sunken rounded-input border border-border text-xs">
              {selectedCall.transcript.map((line, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={`font-bold uppercase ${
                      line.speaker === 'agent' ? 'text-primary' : 'text-accent'
                    }`}>
                      {line.speaker === 'agent' ? 'Finch Assist (AI)' : selectedCall.callerName}
                    </span>
                    <span className="text-text-muted">{line.timeSec}s</span>
                  </div>
                  <p className="text-text-2 pl-2 border-l border-border">{line.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Webhook Payload */}
          <div className="border border-border rounded-input overflow-hidden text-xs">
            <button
              onClick={() => setShowJsonPayload(!showJsonPayload)}
              className="w-full px-4 py-2.5 bg-surface flex items-center justify-between text-text font-semibold hover:bg-sunken"
            >
              <span className="flex items-center gap-2 text-[11px] uppercase">
                <Code2 className="w-3.5 h-3.5 text-text-muted" />
                Raw Retell Webhook JSON Payload (Redacted)
              </span>
              {showJsonPayload ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showJsonPayload && (
              <pre className="p-4 bg-[#1F2420] text-[#FBFAF7] font-mono text-[10px] overflow-x-auto leading-relaxed">
{JSON.stringify({
  event: "call_analyzed",
  call_id: selectedCall.id,
  customer_number: "+1 (503) 555-XXXX",
  agent_id: "agent_alder_finch_pdx",
  call_outcome: selectedCall.outcome,
  duration_seconds: selectedCall.durationSec,
  extracted_dynamic_variables: selectedCall.extractedFields,
  timestamp: selectedCall.timestamp
}, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Scope Drawer */}
      <Drawer
        isOpen={isScopeDrawerOpen}
        onClose={() => setIsScopeDrawerOpen(false)}
        title="Retell AI + Twilio Voice Integration Scope"
        subtitle="Itemized deliverable within the $1,000 fixed price"
        width="md"
      >
        <div className="space-y-5 text-xs text-text-2 leading-relaxed">
          <div className="p-4 bg-primary-soft rounded-card border border-primary/20 space-y-1">
            <div className="font-bold text-primary text-sm">Included in Fixed Bid: Milestone M4</div>
            <p className="text-[11px] text-text-2">
              Unlike generic agency setups, we deliver a bi-directional voice qualification loop that writes directly into your GHL pipeline.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-text uppercase text-[11px]">Technical Architecture Deliverables:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text">Twilio Elastic SIP Trunking:</strong> Provision local Portland phone number, setup caller ID verification, and route failovers to mobile.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text">Retell AI Agent Prompt Engineering:</strong> Craft conversational studio persona ("Finch Assist"), train room remodeling objections, budget qualification, and business hours logic.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text">GHL Webhook Receiver Workflow:</strong> Ingest post-call JSON payloads, extract structured variables, and write back into custom fields.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text">Live Calendar Slot Booking via Voice:</strong> Enable Finch Assist to query live openings and book consultations directly.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div>
                  <strong className="text-text">Retry & Error Resilience:</strong> Automatic fallback to SMS link if caller disconnects mid-call.
                </div>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-sunken rounded-input border border-border text-[11px] text-text-muted">
            <Info className="w-3.5 h-3.5 inline mr-1 text-accent" />
            Carrier usage fees (Twilio ~$0.013/min, Retell ~$0.08/min) are paid directly to your respective platform accounts with zero agency markup.
          </div>
        </div>
      </Drawer>
    </div>
  );
};
