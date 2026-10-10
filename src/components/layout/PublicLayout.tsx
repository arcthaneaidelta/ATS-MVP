import React from 'react'
import { Outlet } from 'react-router-dom'
import { PublicNavbar } from './PublicNavbar'
import { PublicFooter } from './PublicFooter'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { FloatingGuideTrigger } from '@/components/guide/FloatingGuideTrigger'
import { DemoGuideDrawer } from '@/components/guide/DemoGuideDrawer'

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#1B2625]">
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#17323A] focus:text-white focus:rounded focus:ring-2 focus:ring-[#B8864B]"
      >
        Skip to main content
      </a>

      <PublicNavbar />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />

      <ToastContainer />
      <FloatingGuideTrigger />
      <DemoGuideDrawer />
    </div>
  )
}
