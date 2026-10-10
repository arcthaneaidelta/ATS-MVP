import React from 'react'
import { Layers, CheckCircle2 } from 'lucide-react'

export const BuildMapTab: React.FC = () => {
  const mapItems = [
    {
      component: '7 Public Marketing Pages',
      wpTech: 'Elementor Pro Templates + Theme Builder',
      details: 'Built with Elementor Pro global containers, dynamic tags, and single template overrides matching client HTML design references and brand tokens.',
    },
    {
      component: '10 Fixed-Price Services',
      wpTech: 'WooCommerce Core (Virtual Services)',
      details: 'Virtual, non-downloadable, non-shipping products. Single quantity enforced per service. Botswana Pula (BWP) currency symbol configuration.',
    },
    {
      component: 'Payment Gateway',
      wpTech: 'DPO Group WooCommerce Gateway via Direct API',
      details: 'Direct API credentials (Company Token & Service Type) configured without iframe lock-in. Hosted redirect, webhook verification, and instant callback handling.',
    },
    {
      component: '5 Custom Order Statuses',
      wpTech: 'Programmatic PHP in Child Theme (functions.php)',
      details: 'Registered via wc_register_order_status() with wc_order_statuses filter: Awaiting Intake, In Production, Client Review, Revisions Requested, Delivered.',
    },
    {
      component: 'Client Portal',
      wpTech: 'WP Customer Area Pro',
      details: 'Private customer dashboard, isolated files vault, private page assignments per user account, and strict non-disclosure access controls.',
    },
    {
      component: '3 Intake Forms with Logic',
      wpTech: 'WPForms Pro + Add-ons',
      details: 'Multi-step pagination, conditional field visibility (rush notices, PPADB status, site visit dates), secure file upload restrictions, and consent checkboxes.',
    },
    {
      component: 'Email Notifications',
      wpTech: 'WP Mail SMTP + Google Workspace API',
      details: 'Clean transactional HTML templates dispatched through authenticated Google Workspace OAuth/SMTP to ensure zero spam folder misdirection.',
    },
    {
      component: 'Automated Automation Webhooks',
      wpTech: 'WooCommerce Webhook Hookshot → n8n',
      details: '4 discrete JSON payloads dispatched on order creation, status transitions, intake form submission, and final document delivery.',
    },
    {
      component: 'SEO & Performance',
      wpTech: 'Yoast SEO + WP Rocket + Object Cache',
      details: 'Granular Botswana tender schema markup, OpenGraph tags, XML sitemap generation, WebP image serving, and LiteSpeed/cPanel server caching.',
    },
  ]

  return (
    <div className="space-y-4 text-xs">
      <div className="bg-[#FBF9F4] p-3.5 rounded-[10px] border border-[#E3DDD0]">
        <div className="flex items-center gap-2 text-[#17323A] font-semibold text-sm mb-1">
          <Layers className="w-4 h-4 text-[#B8864B]" />
          <span>WordPress Architecture Alignment</span>
        </div>
        <p className="text-[#4A5755] leading-relaxed">
          This prototype proves exact alignment with your planned WordPress, Elementor, and WooCommerce stack. Toggle the <strong>Build Map</strong> in the Guide tab to see live markers across every screen.
        </p>
      </div>

      <div className="space-y-2.5">
        {mapItems.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-white rounded-[8px] border border-[#E3DDD0] space-y-1 hover:border-[#17323A] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#17323A] text-xs">
                {item.component}
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#EFEADF] text-[#8A5F2B] px-2 py-0.5 rounded">
                {item.wpTech}
              </span>
            </div>
            <p className="text-[11px] text-[#4A5755] leading-normal pt-1 border-t border-[#E3DDD0]/50">
              {item.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
