import React, { useState } from 'react';
import type { MeetingTrace, StageId } from '../../types';
import { Tabs } from '../ui/Tabs';
import { LogLine } from './LogLine';
import { useDemoStore } from '../../store/useDemoStore';
import { AlertTriangle, Plus, Check, FileCode, Webhook, Bot, Clock } from 'lucide-react';
import { Button } from '../ui/Button';

interface EvidencePanelProps {
  trace: MeetingTrace;
  activeStageId?: StageId;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ trace }) => {
  const [activeTab, setActiveTab] = useState<string>('timeline');
  const { toggleFindingInScope, includedFindingIds, addToast } = useDemoStore();

  const isFindingAlreadyInScope = trace.rootCauseCallout.findingIdRef
    ? includedFindingIds.includes(trace.rootCauseCallout.findingIdRef)
    : false;

  const handleAddFinding = () => {
    if (trace.rootCauseCallout.findingIdRef) {
      toggleFindingInScope(trace.rootCauseCallout.findingIdRef);
      addToast({
        type: 'success',
        title: isFindingAlreadyInScope ? 'Removed from Scope' : 'Added to Scope Gate',
        message: `${trace.rootCauseCallout.title} updated in scope checklist.`
      });
    } else {
      addToast({
        type: 'info',
        title: 'Diagnostic Finding',
        message: 'This finding is already registered in the written report.'
      });
    }
  };

  const tabs = [
    { id: 'timeline', label: 'Timeline Logs', icon: <Clock className="w-4 h-4" />, badge: trace.timelineLogs.length },
    { id: 'bot_config', label: 'Recall.ai Bot Config', icon: <Bot className="w-4 h-4" /> },
    { id: 'webhooks', label: 'Webhook Logs', icon: <Webhook className="w-4 h-4" />, badge: trace.webhookLogs.length },
    { id: 'extraction', label: 'LLM Extraction Output', icon: <FileCode className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Root Cause Callout Card (Clay Tint per PRD) */}
      <div className="rounded-[16px] bg-[#F3E3D8] border border-[#E6C7B6] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-[#E6C7B6]/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#B4643C] text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B4643C] font-bold">
                Proven Diagnosis · Confidence: {trace.rootCauseCallout.confidence}
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
                {trace.rootCauseCallout.title}
              </h3>
            </div>
          </div>

          {trace.rootCauseCallout.findingIdRef && (
            <Button
              variant={isFindingAlreadyInScope ? 'secondary' : 'accent'}
              size="sm"
              onClick={handleAddFinding}
              leftIcon={isFindingAlreadyInScope ? <Check className="w-3.5 h-3.5 text-[#3F7D5B]" /> : <Plus className="w-3.5 h-3.5" />}
            >
              {isFindingAlreadyInScope ? 'Included in Scope' : 'Add to Fix Scope'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
          <div>
            <span className="font-semibold text-[#1E2A2B] block uppercase text-[10px] tracking-wider mb-1">
              Root Cause Evidence
            </span>
            <p className="text-[#4A5757] leading-relaxed">
              {trace.rootCauseCallout.diagnosis}
            </p>
          </div>
          <div className="bg-white/60 rounded-[8px] p-3 border border-[#E6C7B6]">
            <span className="font-semibold text-[#B4643C] block uppercase text-[10px] tracking-wider mb-1">
              Smallest Reasonable Fix (No Rebuild)
            </span>
            <p className="text-[#1E2A2B] font-medium leading-relaxed">
              {trace.rootCauseCallout.smallestFix}
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Inspection Tabs & Container */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] overflow-hidden shadow-[0_1px_2px_rgba(30,42,43,0.06)]">
        <div className="px-5 pt-4 bg-[#FBF9F6] border-b border-[#E2DDD3]">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-4 sm:p-5">
          {/* TAB 1: Timeline Logs */}
          {activeTab === 'timeline' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-2 text-[11px] text-[#7B8786] border-b border-[#E2DDD3] px-3 font-mono">
                <span>TIMESTAMP & SYSTEM</span>
                <span>EVENT LOG & DETAILS</span>
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {trace.timelineLogs.map((log) => (
                  <LogLine key={log.id} entry={log} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Bot Config */}
          {activeTab === 'bot_config' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                  <span className="text-[10px] uppercase font-mono text-[#7B8786] block">Recall Bot ID</span>
                  <span className="font-mono text-xs font-semibold text-[#1E2A2B]">{trace.botConfig.botId}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                  <span className="text-[10px] uppercase font-mono text-[#7B8786] block">Lobby Timeout</span>
                  <span className="font-mono text-xs font-semibold text-[#B4643C]">
                    {trace.botConfig.waitingRoomTimeoutSeconds} seconds (10m)
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                  <span className="text-[10px] uppercase font-mono text-[#7B8786] block">Speech Provider</span>
                  <span className="font-mono text-xs font-semibold text-[#1E2A2B]">
                    {trace.botConfig.transcriptionProvider}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                  <span className="text-[10px] uppercase font-mono text-[#7B8786] block">OAuth Scope Granted</span>
                  <span className={`font-mono text-xs font-semibold ${trace.botConfig.oauthScopeGranted ? 'text-[#3F7D5B]' : 'text-[#A8433A]'}`}>
                    {trace.botConfig.oauthScopeGranted ? 'Yes (meeting:write)' : 'No (Expired 401)'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                  <span className="text-[10px] uppercase font-mono text-[#7B8786] block">OAuth Expiration</span>
                  <span className="font-mono text-xs text-[#1E2A2B]">{trace.botConfig.tokenExpiresAt}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                  <span className="text-[10px] uppercase font-mono text-[#7B8786] block">Meeting Target URL</span>
                  <span className="font-mono text-xs text-[#1F4B4A] truncate block">{trace.botConfig.meetingUrl}</span>
                </div>
              </div>

              <div className="p-3 bg-[#E3EDEB] rounded-lg text-xs text-[#1F4B4A] flex items-center justify-between">
                <span>Config inspected directly from Recall.ai REST API dispatch parameters.</span>
                <span className="font-mono text-[11px]">API: v1/bot</span>
              </div>
            </div>
          )}

          {/* TAB 3: Webhook Logs */}
          {activeTab === 'webhooks' && (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E2DDD3] text-[#7B8786] font-mono text-[11px]">
                      <th className="py-2 px-3">TIMESTAMP</th>
                      <th className="py-2 px-3">EVENT</th>
                      <th className="py-2 px-3">STATUS</th>
                      <th className="py-2 px-3">RETRIES</th>
                      <th className="py-2 px-3">IDEMPOTENCY KEY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trace.webhookLogs.map((wh) => (
                      <tr key={wh.id} className="border-b border-[#E2DDD3]/60 hover:bg-[#FBF9F6]">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#7B8786]">{wh.timestamp}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#1E2A2B]">{wh.event}</td>
                        <td className="py-2.5 px-3 font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              wh.httpStatus === 200
                                ? 'bg-[#E1EEE6] text-[#3F7D5B]'
                                : 'bg-[#F5DEDA] text-[#A8433A]'
                            }`}
                          >
                            HTTP {wh.httpStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#4A5757]">{wh.retries}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-[#1F4B4A]">{wh.idempotencyKey}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                <span className="text-[10px] font-mono uppercase text-[#7B8786] block mb-1">
                  Last Inbound Payload Preview
                </span>
                <pre className="font-mono text-[11px] text-[#1E2A2B] bg-[#FFFFFF] p-2.5 rounded border border-[#E2DDD3] overflow-x-auto">
                  {trace.webhookLogs[0]?.payloadPreview || '// No payload received'}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: LLM Extraction */}
          {activeTab === 'extraction' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FBF9F6] border border-[#E2DDD3] rounded-lg text-xs">
                <div>
                  <span className="text-[#7B8786] block text-[10px] uppercase font-mono">Status & Model</span>
                  <span className="font-semibold text-[#1E2A2B]">
                    {trace.extractionOutput.model} ({trace.extractionOutput.promptVersion})
                  </span>
                </div>
                <div>
                  <span className="text-[#7B8786] block text-[10px] uppercase font-mono">Latency</span>
                  <span className="font-mono text-[#1E2A2B]">{trace.extractionOutput.executionTimeMs} ms</span>
                </div>
                <div>
                  <span className="text-[#7B8786] block text-[10px] uppercase font-mono">Tokens Used</span>
                  <span className="font-mono text-[#1E2A2B]">{trace.extractionOutput.tokensUsed.total} tokens</span>
                </div>
                <div>
                  <span className="text-[#7B8786] block text-[10px] uppercase font-mono">Extracted Signals</span>
                  <span className="font-semibold text-[#1F4B4A]">
                    {trace.extractionOutput.extractedSignalsCount} signals
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#7B8786] uppercase block mb-1.5">
                  LLM Structured Output JSON
                </span>
                <pre className="p-3 rounded-lg bg-[#1E2A2B] text-[#F6F3EE] font-mono text-xs overflow-x-auto max-h-[220px]">
                  {trace.extractionOutput.rawJsonSnippet}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
