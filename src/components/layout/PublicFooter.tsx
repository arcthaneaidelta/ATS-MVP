import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { ContourBackdrop } from '@/components/scenes/ContourBackdrop'
import { Check, ArrowUpRight, Lock } from 'lucide-react'
import { BuildMapTag } from '@/components/ui/BuildMapTag'

export const PublicFooter: React.FC<{ hideCtaBand?: boolean }> = ({ hideCtaBand = false }) => {
  const navigate = useNavigate()
  const { setDemoGuideOpen, setDemoGuideTab, addToast } = useStore()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address.')
      return
    }
    setNewsletterError('')
    setNewsletterSubscribed(true)
    addToast({
      type: 'success',
      title: 'Subscribed to Tender Insights',
      message: 'Weekly Botswana procurement briefings dispatched every Monday.',
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openDeliveryStandards = () => {
    setDemoGuideOpen(true)
    setDemoGuideTab('handover')
  }

  return (
    <footer className="relative bg-[#17323A] text-[#F6F3EC] overflow-hidden select-none">
      {/* Closing CTA Band */}
      {!hideCtaBand && (
        <section className="relative py-20 px-6 sm:px-10 border-b border-white/10 overflow-hidden">
          <ContourBackdrop opacity={0.08} mirrored />
          <div className="relative max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 z-10">
            <div className="max-w-xl">
              <div className="w-16 h-[2px] bg-[#B8864B] mb-6" />
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] text-[#F6F3EC] leading-[1.1] font-normal">
                Have a tender closing soon?
              </h2>
              <p className="text-base sm:text-lg text-[#CFC7B6] mt-3 leading-relaxed font-sans">
                Tell us the date. We will tell you what is realistic.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/store')}
                className="h-12 px-7 rounded-[8px] bg-[#F6F3EC] text-[#17323A] font-semibold text-[15px] hover:bg-white active:bg-[#EFEADF] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse services</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <Link
                to="/contact"
                className="h-12 px-5 flex items-center justify-center text-[15px] font-semibold text-[#F6F3EC] hover:text-[#B8864B] transition-colors"
              >
                Or write to us →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Footer Links */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#224752] flex items-center justify-center p-1.5">
                <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                  <path
                    d="M7 10h8M11 10v12"
                    stroke="#F6F3EC"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 12l3.5 8L25 9"
                    stroke="#B8864B"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-serif text-2xl font-medium tracking-tight">
                TenderVantage
              </span>
            </div>

            <p className="text-sm text-[#CFC7B6] max-w-sm leading-relaxed">
              We prepare compliant, persuasive tender submissions for Botswana’s contractors and suppliers, from the first read of the documents to the final signed pack.
            </p>

            <div className="text-xs text-[#6F7A78] font-mono">
              Plot 54368 CBD · Gaborone, Botswana
            </div>

            {/* Newsletter input */}
            <form onSubmit={handleNewsletterSubmit} className="pt-2 max-w-sm">
              <label htmlFor="footer-newsletter" className="block text-xs font-semibold text-[#F6F3EC] mb-2 font-sans">
                Botswana Procurement Briefings
              </label>
              {newsletterSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#4ade80] py-2">
                  <Check className="w-4 h-4" />
                  <span>Subscribed. You will receive our next briefing.</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="footer-newsletter"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-10 px-3 bg-[#10252B] border border-[#224752] rounded-[6px] text-xs text-white placeholder:text-[#6F7A78] flex-1 focus:outline-none focus:border-[#B8864B]"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-[6px] bg-[#B8864B] text-white text-xs font-semibold hover:bg-[#9F7138] transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
              )}
              {newsletterError && (
                <p className="text-[11px] text-[#f87171] mt-1">{newsletterError}</p>
              )}
            </form>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#CFC7B6]">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-[#CFC7B6]">
              <li>
                <Link to="/store/technical-proposal-writing" className="hover:text-white transition-colors">
                  Technical Proposal Writing
                </Link>
              </li>
              <li>
                <Link to="/store/company-profile-capability-statement" className="hover:text-white transition-colors">
                  Company Profiles
                </Link>
              </li>
              <li>
                <Link to="/store/compliance-checklist-submission-pack" className="hover:text-white transition-colors">
                  Compliance Pack
                </Link>
              </li>
              <li>
                <Link to="/store/pricing-schedule-boq-review" className="hover:text-white transition-colors">
                  Pricing Schedule Review
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-[#B8864B] hover:underline font-medium">
                  View All 10 Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#CFC7B6]">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-[#CFC7B6]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About TenderVantage
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How Orders Work
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  Resources & Guides
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Portal */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#CFC7B6]">
              Portal
            </h4>
            <ul className="space-y-2 text-sm text-[#CFC7B6]">
              <li>
                <Link to="/portal" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Lock className="w-3.5 h-3.5 text-[#5E7F78]" />
                  <span>Client Login</span>
                </Link>
              </li>
              <li>
                <Link to="/portal/orders" className="hover:text-white transition-colors">
                  Track Active Orders
                </Link>
              </li>
              <li>
                <Link to="/portal/documents" className="hover:text-white transition-colors">
                  Secure Document Vault
                </Link>
              </li>
              <li>
                <Link to="/staff" className="text-xs text-[#6F7A78] hover:text-[#CFC7B6]">
                  Staff Delivery Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6F7A78]">
          <div className="flex flex-wrap items-center gap-6">
            <span>© 2026 TenderVantage (Pty) Ltd · Botswana</span>
            <Link to="/privacy" className="hover:text-[#CFC7B6] transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-[#CFC7B6] transition-colors">
              Terms
            </Link>
            <Link to="/refunds" className="hover:text-[#CFC7B6] transition-colors">
              Refunds
            </Link>
            <button
              type="button"
              onClick={openDeliveryStandards}
              className="text-[#B8864B] hover:text-[#e0a969] underline cursor-pointer font-medium"
            >
              Delivery standards
            </button>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="text-xs font-mono text-[#CFC7B6] hover:text-white transition-colors cursor-pointer py-1"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
