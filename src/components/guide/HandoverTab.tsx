import React from 'react'
import { CheckCircle2, ShieldCheck, FileCheck, Terminal, Award } from 'lucide-react'

export const HandoverTab: React.FC = () => {
  const checklistSections = [
    {
      group: '1. Build Standards',
      items: [
        'All 7 core marketing pages faithfully implemented from HTML reference',
        'Mobile-first responsive fidelity tested across 360, 480, 768, 1024, and 1280px',
        'Strict design token palette enforced without unapproved color outliers',
        'Accessible color contrast ratios exceeding WCAG AA (≥ 4.5:1 text, ≥ 7:1 headings)',
      ],
    },
    {
      group: '2. WooCommerce Service Engine',
      items: [
        '10 fixed-price services catalogued in Botswana Pula (P) with 14% VAT computation',
        'Single service quantity enforcement (no physical product cart mechanisms)',
        'DPO Group gateway direct API integration (Success, Declined, Cancelled, & Timeout)',
        'Zero duplicate order generation on user reload or browser back navigation',
      ],
    },
    {
      group: '3. Five Custom Order Statuses',
      items: [
        'Awaiting Intake, In Production, Client Review, Revisions Requested, Delivered registered in PHP',
        'Consistent status pill styling with mandatory semantic icons across all views',
        'Automated state transition triggers linked to client actions and staff delivery desk',
      ],
    },
    {
      group: '4. WP Customer Area Client Portal',
      items: [
        'Strict customer directory isolation (Client A cannot see Client B files or orders)',
        'Document vault supporting PDF, DOCX, XLSX and ZIP with 20MB file validation',
        'Interactive order timeline with next-action guidance and direct writer messaging',
      ],
    },
    {
      group: '5. WPForms Pro Intake Logic',
      items: [
        'Forms A, B, and C with multi-step progress indicators and autosave simulation',
        'Demonstrated conditional fields (e.g. PPADB status, rush notices, site visit dates)',
        'Mandatory statutory consent checkboxes for document processing & confidentiality',
      ],
    },
    {
      group: '6. SMTP & n8n Webhook Hookshot',
      items: [
        'Authenticated Google Workspace SMTP configuration for all 8 notification triggers',
        '4 core webhooks logging JSON payloads with HMAC verification signatures',
        'Graceful 500 receiver error handling with automated retry protocol',
      ],
    },
    {
      group: '7. Performance, Security & SEO',
      items: [
        'Lighthouse mobile performance budget (Score ≥ 90, LCP < 2.5s on 4G)',
        'Yoast SEO meta titles, meta descriptions, and XML sitemaps for Botswana search queries',
        'Truehost Africa cPanel hosting configuration with PHP 8.2 and SSL certificate enforcement',
        'Security hardening: 2FA admin authentication, XML-RPC disabled, upload mime-type lockdown',
      ],
    },
    {
      group: '8. Owner Handover Deliverables',
      items: [
        'Non-technical administrator operating guide for adding services and updating prices',
        'Video walkthrough demonstrating how to advance orders and upload deliverables',
        'Secure password transfer protocol via Bitwarden / 1Password',
      ],
    },
  ]

  return (
    <div className="space-y-4 text-xs">
      <div className="bg-[#17323A] text-[#F6F3EC] p-3.5 rounded-[10px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#B8864B]" />
          <span className="font-semibold text-sm font-serif">Delivery & QA Handover Standards</span>
        </div>
        <span className="text-[10px] font-mono text-[#CFC7B6] uppercase">
          Client Brief v2.0 Ready
        </span>
      </div>

      <div className="space-y-3">
        {checklistSections.map((sec, idx) => (
          <div key={idx} className="bg-white rounded-[8px] border border-[#E3DDD0] p-3.5 space-y-2">
            <h4 className="font-semibold text-[#17323A] text-xs uppercase tracking-wider font-mono">
              {sec.group}
            </h4>
            <div className="space-y-1.5 pt-1 border-t border-[#E3DDD0]/60">
              {sec.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-[#4A5755]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3E7A5B] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
