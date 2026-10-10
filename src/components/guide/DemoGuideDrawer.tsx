import React from 'react'
import { useStore } from '@/store/useStore'
import { Drawer } from '@/components/ui/Drawer'
import { Tabs } from '@/components/ui/Tabs'
import { GuideTab } from './GuideTab'
import { InboxTab } from './InboxTab'
import { WebhooksTab } from './WebhooksTab'
import { BuildMapTab } from './BuildMapTab'
import { HandoverTab } from './HandoverTab'

export const DemoGuideDrawer: React.FC = () => {
  const { demoGuideOpen, setDemoGuideOpen, demoGuideTab, setDemoGuideTab, emails } = useStore()

  const unreadEmailsCount = emails.filter((e) => !e.isRead).length

  const tabs = [
    { id: 'guide', label: 'Guide & Roles' },
    { id: 'inbox', label: 'Inbox', count: unreadEmailsCount > 0 ? unreadEmailsCount : undefined },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'buildmap', label: 'Build Map' },
    { id: 'handover', label: 'Handover QA' },
  ]

  return (
    <Drawer
      isOpen={demoGuideOpen}
      onClose={() => setDemoGuideOpen(false)}
      title="Reviewer Demo Guide"
      description="Proof of architecture, automated workflows, and delivery standards."
      width="lg"
    >
      <div className="flex flex-col h-full gap-4">
        <Tabs
          tabs={tabs}
          activeTabId={demoGuideTab}
          onChange={(id) => setDemoGuideTab(id as any)}
          variant="pills"
          className="pb-1"
        />

        <div className="flex-1 overflow-y-auto pt-2">
          {demoGuideTab === 'guide' && <GuideTab />}
          {demoGuideTab === 'inbox' && <InboxTab />}
          {demoGuideTab === 'webhooks' && <WebhooksTab />}
          {demoGuideTab === 'buildmap' && <BuildMapTab />}
          {demoGuideTab === 'handover' && <HandoverTab />}
        </div>
      </div>
    </Drawer>
  )
}
