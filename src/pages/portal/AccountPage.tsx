import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Shield, Download, Trash2, CheckCircle2, UserCheck } from 'lucide-react'

export const AccountPage: React.FC = () => {
  const { currentUser, addToast } = useStore()

  // Notification toggles with immediate toast
  const [notifyDeadlines, setNotifyDeadlines] = useState(true)
  const [notifyDrafts, setNotifyDrafts] = useState(true)
  const [notifyStatus, setNotifyStatus] = useState(true)
  const [notifyGazette, setNotifyGazette] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = (
    label: string,
    val: boolean,
    setter: (v: boolean) => void
  ) => {
    setter(val)
    addToast({
      type: 'success',
      title: 'Preferences saved',
      message: `${label} is now ${val ? 'enabled' : 'disabled'}.`,
    })
  }

  const handleDownloadData = () => {
    addToast({
      type: 'info',
      title: 'Data archive prepared',
      message: 'Client GDPR / Botswana DPA archive downloaded.',
    })
  }

  const handleDeleteConfirm = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      setDeleteModalOpen(false)
      addToast({
        type: 'info',
        title: 'Deletion requested',
        message: 'Your deletion request has been submitted to TenderVantage DPO.',
      })
    }, 1000)
  }

  return (
    <div className="space-y-10 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#E3DDD0] flex items-center justify-between">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
            SETTINGS & PREFERENCES
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#17323A] mt-1">
            Account
          </h1>
          <p className="text-xs text-[#6F7A78] mt-1">
            Manage your company profile, email notification thresholds, and security.
          </p>
        </div>

        <BuildMapTag
          label="Account Page"
          wpEquivalent="WP Customer Area Account Settings"
          position="top-right"
        />
      </div>

      {/* Profile Card */}
      <section className="bg-white rounded-[12px] border border-[#E3DDD0] p-6 space-y-4">
        <h2 className="font-serif text-xl font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
          Company Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#6F7A78] block">Authorized Contact:</span>
            <strong className="text-[#17323A] text-sm">{currentUser?.name}</strong>
          </div>
          <div>
            <span className="text-[#6F7A78] block">Registered Company:</span>
            <strong className="text-[#17323A] text-sm">{currentUser?.companyName}</strong>
          </div>
          <div>
            <span className="text-[#6F7A78] block">Primary Email:</span>
            <span className="text-[#17323A] font-mono">{currentUser?.email}</span>
          </div>
          <div>
            <span className="text-[#6F7A78] block">CIPA Registration:</span>
            <span className="text-[#17323A] font-mono font-semibold">{currentUser?.cipaNumber}</span>
          </div>
          <div>
            <span className="text-[#6F7A78] block">Location:</span>
            <span className="text-[#17323A]">{currentUser?.location}</span>
          </div>
          <div>
            <span className="text-[#6F7A78] block">Account Role:</span>
            <span className="text-[#8A5F2B] font-mono uppercase font-bold">{currentUser?.role}</span>
          </div>
        </div>
      </section>

      {/* Notification Preferences with role="switch" */}
      <section className="bg-white rounded-[12px] border border-[#E3DDD0] p-6 space-y-4">
        <h2 className="font-serif text-xl font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
          Notification Preferences
        </h2>

        <div className="divide-y divide-[#E3DDD0]">
          <Switch
            label="Tender closing deadline alerts"
            description="Receive reminders at 7 days, 3 days, and 24 hours before closing."
            checked={notifyDeadlines}
            onChange={(val) => handleToggle('Deadline alerts', val, setNotifyDeadlines)}
          />

          <Switch
            label="Draft ready for review alerts"
            description="Instant email notification when writer uploads a completed draft."
            checked={notifyDrafts}
            onChange={(val) => handleToggle('Draft alerts', val, setNotifyDrafts)}
          />

          <Switch
            label="Order status transitions"
            description="Real-time emails as your proposal moves through the five custom statuses."
            checked={notifyStatus}
            onChange={(val) => handleToggle('Status notifications', val, setNotifyStatus)}
          />

          <Switch
            label="Weekly Botswana Procurement Gazette briefing"
            description="Curated summary of newly published public tenders matching your sector."
            checked={notifyGazette}
            onChange={(val) => handleToggle('Gazette briefings', val, setNotifyGazette)}
          />
        </div>
      </section>

      {/* Data Protection & Privacy */}
      <section className="bg-[#FBF9F4] rounded-[12px] border border-[#E3DDD0] p-6 space-y-4 text-xs">
        <h2 className="font-serif text-lg font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
          Data Governance & Confidentiality
        </h2>

        <p className="text-[#4A5755] leading-relaxed">
          In compliance with Botswana Data Protection legislation, you have full ownership of your uploaded returnables and audit logs.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadData}
            leftIcon={<Download className="w-3.5 h-3.5 text-[#5E7F78]" />}
            className="bg-white"
          >
            Download my data archive
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-[#A94438]" />}
            className="text-[#A94438] hover:bg-[#A94438]/10"
          >
            Request account deletion
          </Button>
        </div>
      </section>

      {/* Deletion Confirm Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Request Account Deletion"
        description="Permanently delete your company profile, past proposal drafts, and private vault files."
      >
        <div className="space-y-4 pt-2 text-xs text-[#4A5755]">
          <p>
            This action triggers an administrative purge of all documents associated with <strong>{currentUser?.companyName}</strong>. Active orders will be paused.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
              loadingText="Submitting request..."
            >
              Confirm Deletion Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
