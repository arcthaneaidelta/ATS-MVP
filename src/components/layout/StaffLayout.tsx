import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { DEMO_ACCOUNTS } from '@/data/accounts'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { FloatingGuideTrigger } from '@/components/guide/FloatingGuideTrigger'
import { DemoGuideDrawer } from '@/components/guide/DemoGuideDrawer'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export const StaffLayout: React.FC = () => {
  const { currentUser, switchAccount } = useStore()

  useEffect(() => {
    if (currentUser?.role !== 'staff') {
      const staffAccount = DEMO_ACCOUNTS.find((a) => a.role === 'staff')
      if (staffAccount) {
        switchAccount(staffAccount.id)
      }
    }
  }, [currentUser, switchAccount])

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#1B2625]">
      {/* Staff Header */}
      <header className="h-14 bg-[#17323A] text-[#F6F3EC] px-6 flex items-center justify-between sticky top-0 z-40 border-b border-[#224752]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase font-bold tracking-wider">
              Staff Delivery Desk
            </span>
          </div>
          <span className="text-[#CFC7B6] text-xs">|</span>
          <span className="text-xs text-[#CFC7B6]">TenderVantage Internal Desk</span>
          <BuildMapTag
            label="Staff Desk"
            wpEquivalent="Custom Admin Dashboard / Desk"
            position="inline"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/portal"
            className="flex items-center gap-1.5 text-xs text-[#B8864B] hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Client Portal</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-[1360px] mx-auto w-full">
        <Outlet />
      </main>

      <ToastContainer />
      <FloatingGuideTrigger />
      <DemoGuideDrawer />
    </div>
  )
}
