import React from 'react';
import { Button } from '../../components/ui/Button';
import { downloadMarkdownFile } from '../../lib/format';
import { useDemoStore } from '../../store/useDemoStore';
import {
  Copy,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Bell
} from 'lucide-react';

export const HandoffPage: React.FC = () => {
  const { addToast } = useDemoStore();

  const handoffMarkdown = `# Production Runbook & Handoff Guide: Meeting Bot & AI Extraction Pipeline
**System**: Northbeam / Base44 Meeting Intelligence  
**Author**: [YOUR_NAME / Diagnostic Engineer]  
**Revision Date**: October 2026 · Post-Fix Milestone

---

## 1. Summary of Changes Implemented
- **Expanded Recurring Calendar Sync**: Updated calendar webhook parser to inspect \`recurringEventId\` and \`originalStartTime\`. Bots are now scheduled per single occurrence ID.
- **Adjusted Recall.ai Lobby Timeout**: Increased \`waiting_room_timeout\` from 600s (10 min) to 1200s (20 min) to accommodate enterprise host arrival buffer.
- **Asynchronous Webhook Ingestion**: Inbound \`transcript.ready\` payloads return HTTP 200 immediately, placing the transcript processing onto an asynchronous queue with idempotency keys.
- **Context-Aware Structured LLM Schema**: Implemented strict JSON schema requiring \`evidence_quote\`, \`speaker_role\`, \`is_active_commitment\`, and few-shot negative prompts.
- **Automated OAuth Refresh Cron**: Daily scheduled check that queries tokens expiring within 48 hours and auto-renews Zoom and Google Workspace credentials.

---

## 2. Operator Runbook: 5-Step Checklist When a Call is Missed
If a Customer Success Manager reports a missed recording, follow this 5-minute diagnostic protocol:

1. **Step 1: Inspect Google Calendar Event Status**
   - Check if event was set to "Confirmed" vs "Tentative".
   - Check if the meeting URL was in the description or location field.
   - Run query: \`SELECT * FROM calendar_sync_logs WHERE event_id = '...' ORDER BY timestamp DESC;\`

2. **Step 2: Check Recall.ai Dashboard for Bot Job**
   - Search for the meeting link in the Recall.ai console.
   - If bot exists, verify the \`sub_code\` status (e.g., \`in_call\` vs \`waiting_room_timeout\` vs \`invalid_passcode\`).
   - If sub_code is \`waiting_room_timeout\`, check host admission timestamp.

3. **Step 3: Verify OAuth Token Status for Host CSM**
   - Inspect user token table: \`SELECT token_expires_at FROM oauth_tokens WHERE email = '...';\`
   - If expired, CSM must trigger quick re-auth in Settings.

4. **Step 4: Check Webhook Ingestion Dead-Letter Queue**
   - Verify if \`transcript.ready\` webhook reached the server.
   - Run query: \`SELECT * FROM failed_webhook_events WHERE resolved = FALSE;\`

5. **Step 5: Verify Monday.com Board Column Mapping**
   - Ensure the customer board column names have not been renamed or deleted.

---

## 3. Monitoring & Alerting Safeguards
- **Lobby Alert**: If Recall bot remains in waiting room > 180 seconds, automated Slack webhook pings the meeting host: *"Your bot is waiting in the lobby."*
- **Token Expiry Alert**: In-app banner triggers 7 days before an OAuth token expires.
- **Failed Ingestion Alert**: PagerDuty / Slack notification fires if any webhook returns HTTP 5xx or fails 3 retry attempts.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(handoffMarkdown);
    addToast({
      type: 'success',
      title: 'Runbook Copied',
      message: 'Full operator runbook copied as Markdown.'
    });
  };

  const handleDownload = () => {
    downloadMarkdownFile('OPERATOR_RUNBOOK_HANDOFF.md', handoffMarkdown);
    addToast({
      type: 'success',
      title: 'Downloaded File',
      message: 'OPERATOR_RUNBOOK_HANDOFF.md saved to your device.'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold">
            Zero Dependency Handoff
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B] mt-0.5">
            Operator Handoff Runbook
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            A concise, permanent runbook ensuring your internal team can operate, monitor, and diagnose this pipeline without indefinite developer reliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy} leftIcon={<Copy className="w-3.5 h-3.5" />}>
            Copy .md
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownload} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Download .md
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-3.5 h-3.5" />}>
            Print Runbook
          </Button>
        </div>
      </div>

      {/* Document Sheet (Editorial Paper Style per PRD) */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 sm:p-10 shadow-[0_4px_16px_rgba(30,42,43,0.06)] space-y-8 font-sans">
        {/* Document Title Header */}
        <div className="border-b border-[#E2DDD3] pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4643C] bg-[#F3E3D8] px-2 py-0.5 rounded border border-[#E6C7B6]">
              Standard Operating Procedure (SOP)
            </span>
            <span className="text-xs font-mono text-[#7B8786]">Doc ID: RUNBOOK-2026-v2</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1E2A2B]">
            Recall.ai Meeting Bot & AI Extraction Pipeline: Operator Runbook
          </h2>
          <p className="text-xs text-[#7B8786]">
            Prepared for: Northbeam / Base44 Customer Success Team · Deliverable for Post-Fix Independence
          </p>
        </div>

        {/* Section 1: What Changed */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#1F4B4A]">
            <CheckCircle2 className="w-5 h-5 text-[#3F7D5B]" />
            <h3 className="font-serif text-xl font-semibold text-[#1E2A2B]">
              1. What Changed in the System
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5757] leading-relaxed">
            The fixes implemented were purely targeted and avoided invasive architectural rewrites:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3] space-y-1">
              <span className="font-semibold text-[#1E2A2B] block">Recurring Instance Expansion</span>
              <p className="text-[#4A5757]">
                Google Calendar webhook now extracts individual sub-instance recurrence IDs, ensuring moved or adjusted weekly syncs schedule dedicated Recall bots.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3] space-y-1">
              <span className="font-semibold text-[#1E2A2B] block">Waiting Room 20-Minute Window</span>
              <p className="text-[#4A5757]">
                Bot parameter <code>waiting_room_timeout: 1200</code> prevents early departure when host arrives up to 15 minutes after start time.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3] space-y-1">
              <span className="font-semibold text-[#1E2A2B] block">Async Transcript Ingestion</span>
              <p className="text-[#4A5757]">
                Webhooks return HTTP 200 OK within 40ms and hand payloads to an asynchronous background worker with Redis idempotency deduplication.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3] space-y-1">
              <span className="font-semibold text-[#1E2A2B] block">Context-Aware JSON Schema</span>
              <p className="text-[#4A5757]">
                Replaced brittle keyword regex with structured JSON schema requiring speaker attribution, sentiment polarity, and customer commitment verification.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: 5-Step Operator Checklist */}
        <div className="space-y-4 pt-4 border-t border-[#E2DDD3]">
          <div className="flex items-center gap-2 text-[#1F4B4A]">
            <Clock className="w-5 h-5 text-[#1F4B4A]" />
            <h3 className="font-serif text-xl font-semibold text-[#1E2A2B]">
              2. 5-Step Checklist When a Call is Missed
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5757]">
            Follow this chronological checklist to isolate any reported failure in under 5 minutes:
          </p>

          <div className="space-y-3">
            {[
              {
                step: 'Step 1',
                title: 'Check Calendar Event Status',
                action: 'Verify event was marked "Confirmed" rather than "Tentative" in Google Calendar. Ensure video conference URL is intact.'
              },
              {
                step: 'Step 2',
                title: 'Verify Recall.ai Dashboard Status Code',
                action: 'Search Recall console by meeting URL. If status is `waiting_room_timeout`, host admitted bot after timeout limit.'
              },
              {
                step: 'Step 3',
                title: 'Inspect CSM OAuth Token Status',
                action: 'Check Settings → Integrations. If token expired, click "Re-authorize" to regenerate fresh 90-day credentials.'
              },
              {
                step: 'Step 4',
                title: 'Review Webhook Dead-Letter Queue',
                action: 'Check server logs for `failed_webhook_events`. Click "Replay" for any payload that experienced temporary network timeouts.'
              },
              {
                step: 'Step 5',
                title: 'Check Monday.com Column Mapping',
                action: 'Confirm that Monday board columns have not been deleted or renamed by users.'
              }
            ].map((item) => (
              <div key={item.step} className="p-3.5 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3] flex items-start gap-3">
                <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-[#E3EDEB] text-[#1F4B4A] border border-[#CFC8BB] shrink-0">
                  {item.step}
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-[#1E2A2B]">{item.title}</h4>
                  <p className="text-xs text-[#4A5757] leading-relaxed">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Monitoring & Alerting Safeguards */}
        <div className="space-y-3 pt-4 border-t border-[#E2DDD3]">
          <div className="flex items-center gap-2 text-[#1F4B4A]">
            <Bell className="w-5 h-5 text-[#B4643C]" />
            <h3 className="font-serif text-xl font-semibold text-[#1E2A2B]">
              3. Automated Monitoring & Alerts
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#4A5757]">
            Built-in guardrails so your team doesn't have to manually babysit meetings:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F3E3D8]/50 border border-[#E6C7B6]">
              <span className="font-semibold text-[#B4643C] block mb-1">Lobby Notification (3 min)</span>
              <p className="text-[#4A5757]">
                Slack bot notifies host: <em>"Your notetaker is in the waiting room. Please admit it."</em>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
              <span className="font-semibold text-[#1E2A2B] block mb-1">OAuth Expiry Warning (7 days)</span>
              <p className="text-[#4A5757]">
                In-app notification triggers if a CSM token fails automated background refresh.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#E1EEE6]/60 border border-[#C8E1D2]">
              <span className="font-semibold text-[#3F7D5B] block mb-1">Weekly Reliability Metric</span>
              <p className="text-[#4A5757]">
                One single number (target &gt;95%) sent every Monday morning to the founder.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
