import React from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { FloatingGuideTrigger } from '@/components/guide/FloatingGuideTrigger'
import { DemoGuideDrawer } from '@/components/guide/DemoGuideDrawer'

export const StandaloneLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#1B2625]">
      <Outlet />
      <ToastContainer />
      <FloatingGuideTrigger />
      <DemoGuideDrawer />
    </div>
  )
}
