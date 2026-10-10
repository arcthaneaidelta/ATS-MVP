import React from 'react'
import { Button } from '@/components/ui/Button'
import { StatusPill } from '@/components/ui/StatusPill'
import { Input } from '@/components/ui/Input'
import { CustomOrderStatus } from '@/mock/types'

export const DevTokensPage: React.FC = () => {
  const statuses: CustomOrderStatus[] = [
    'awaiting-intake',
    'in-production',
    'client-review',
    'revisions-requested',
    'delivered',
  ]

  const colors = [
    { name: '--color-primary', hex: '#17323A', text: '#F6F3EC' },
    { name: '--color-secondary', hex: '#5E7F78', text: '#FFFFFF' },
    { name: '--color-accent', hex: '#B8864B', text: '#FFFFFF' },
    { name: '--color-accent-text', hex: '#8A5F2B', text: '#FFFFFF' },
    { name: '--color-bg', hex: '#F6F3EC', text: '#1B2625' },
    { name: '--color-surface', hex: '#FBF9F4', text: '#1B2625' },
    { name: '--color-border', hex: '#E3DDD0', text: '#1B2625' },
    { name: '--color-border-strong', hex: '#CFC7B6', text: '#1B2625' },
    { name: '--color-success', hex: '#3E7A5B', text: '#FFFFFF' },
    { name: '--color-warning', hex: '#B7791F', text: '#FFFFFF' },
    { name: '--color-error', hex: '#A94438', text: '#FFFFFF' },
    { name: '--color-info', hex: '#3F6C8C', text: '#FFFFFF' },
  ]

  return (
    <div className="max-w-[1100px] mx-auto p-10 space-y-12">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#17323A]">
          TenderVantage Design Tokens & Verification
        </h1>
        <p className="text-sm text-[#4A5755] mt-1">
          Internal token audit verifying hex values, typography scale, inputs, and the 5 custom order statuses.
        </p>
      </div>

      {/* Colors Swatches */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl text-[#17323A]">1. Color System Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {colors.map((c) => (
            <div
              key={c.name}
              className="p-3 rounded-[8px] border border-[#E3DDD0] flex flex-col justify-between h-24"
              style={{ backgroundColor: c.hex, color: c.text }}
            >
              <span className="font-mono text-[10px] font-bold">{c.name}</span>
              <span className="font-mono text-xs">{c.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5 Custom Statuses */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl text-[#17323A]">
          2. The Five Custom Order Statuses (Exact 12% tint / 28% border)
        </h2>
        <div className="flex flex-wrap items-center gap-4 p-5 bg-white rounded-[12px] border border-[#E3DDD0]">
          {statuses.map((st) => (
            <div key={st} className="flex flex-col items-center gap-2">
              <StatusPill status={st} size="md" />
              <span className="text-[10px] font-mono text-[#6F7A78]">{st}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl text-[#17323A]">3. Typography Scale</h2>
        <div className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] space-y-5">
          <div>
            <span className="text-xs font-mono text-[#6F7A78]">H1 (Newsreader 400)</span>
            <h1 className="type-h1 text-[#17323A]">Tenders written to be scored.</h1>
          </div>
          <div>
            <span className="text-xs font-mono text-[#6F7A78]">H2 (Newsreader 400)</span>
            <h2 className="type-h2 text-[#17323A]">Five decisions between invitation and award.</h2>
          </div>
          <div>
            <span className="text-xs font-mono text-[#6F7A78]">H3 (Newsreader 500)</span>
            <h3 className="type-h3 text-[#17323A]">Technical Proposal Writing</h3>
          </div>
          <div>
            <span className="text-xs font-mono text-[#6F7A78]">Body (Hanken Grotesk 400)</span>
            <p className="type-body text-[#1B2625] max-w-[68ch]">
              We prepare compliant, persuasive tender submissions for Botswana’s contractors and suppliers, from the first read of the documents to the final signed pack.
            </p>
          </div>
        </div>
      </section>

      {/* Buttons and Inputs */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl text-[#17323A]">4. Interactive Elements</h2>
        <div className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="primary" isLoading>
              Loading...
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            <Input label="Company Name" placeholder="e.g. Kgosi Mining Supplies (Pty) Ltd" isRequired />
            <Input label="CIPA Number" placeholder="BW0000189421" error="Enter a valid CIPA registration number" />
          </div>
        </div>
      </section>
    </div>
  )
}
