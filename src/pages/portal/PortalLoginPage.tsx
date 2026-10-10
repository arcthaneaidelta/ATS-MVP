import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { DEMO_ACCOUNTS } from '@/data/accounts'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserCheck } from 'lucide-react'

export const PortalLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setCurrentUser, addToast } = useStore()

  const [email, setEmail] = useState('naledi@kgosimining.example')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    setTimeout(() => {
      setIsLoading(false)
      const foundUser = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      )

      if (foundUser) {
        setCurrentUser(foundUser)
        addToast({
          type: 'success',
          title: `Welcome back, ${foundUser.name}`,
          message: `${foundUser.companyName} portal active.`,
        })
        if (foundUser.role === 'staff') {
          navigate('/staff')
        } else {
          navigate('/portal')
        }
      } else {
        setErrorMessage('That email and password do not match any demo account.')
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 240)
      }
    }, 700)
  }

  const handleSelectDemoAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword('demo1234')
    setCurrentUser(acc)
    addToast({
      type: 'info',
      title: `Logged in as ${acc.name}`,
      message: `${acc.companyName} (${acc.role})`,
    })
    if (acc.role === 'staff') {
      navigate('/staff')
    } else {
      navigate('/portal')
    }
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setForgotSent(true)
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white rounded-[16px] border border-[#E3DDD0] shadow-[0_24px_48px_-16px_rgba(23,50,58,0.22)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Quiet Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#17323A] text-[#F6F3EC] p-8 sm:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <div className="w-12 h-12 rounded-[10px] bg-[#224752] flex items-center justify-center p-2.5">
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
            </Link>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-normal leading-tight">
                TenderVantage Client Portal
              </h1>
              <p className="text-sm text-[#CFC7B6] leading-relaxed">
                Everything for your order, in one place.
              </p>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 space-y-2 text-xs text-[#CFC7B6] font-mono">
            <div>· Isolated Encrypted Vaults</div>
            <div>· 5-Stage Live Order Timeline</div>
            <div>· Direct Senior Writer Messaging</div>
          </div>
        </div>

        {/* Right Form & Demo Switcher (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-8">
          <div>
            <h2 className="font-serif text-2xl font-medium text-[#17323A]">
              Sign in to your portal
            </h2>
            <p className="text-xs text-[#6F7A78] mt-1">
              Access your tender deliverables, upload compliance intake, and track drafts.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className={`space-y-4 ${isShaking ? 'animate-shake' : ''}`}
            noValidate
          >
            {errorMessage && (
              <div className="p-3 rounded-[6px] bg-[#A94438]/10 border border-[#A94438] text-xs text-[#A94438] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. naledi@kgosimining.example"
              isRequired
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#17323A]">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-[#B8864B] hover:text-[#8A5F2B] underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-[8px] bg-white border border-[#CFC7B6] px-3.5 pr-10 text-base text-[#1B2625] focus:outline-none focus:border-[#17323A]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F7A78] hover:text-[#17323A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[#4A5755] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#CFC7B6] accent-[#17323A]"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              loadingText="Signing in..."
              className="w-full shadow-sm"
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Accounts Explorer */}
          <div className="pt-6 border-t border-[#E3DDD0] space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#17323A] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#B8864B]" />
              <span>Or explore with a demo account</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleSelectDemoAccount(acc)}
                  className="w-full text-left p-3 rounded-[8px] bg-[#FBF9F4] border border-[#E3DDD0] hover:border-[#17323A] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-xs text-[#17323A] flex items-center gap-2">
                      <span>{acc.name}</span>
                      <span className="font-normal text-[#6F7A78]">· {acc.companyName}</span>
                    </div>
                    <div className="text-[11px] text-[#4A5755] mt-0.5">
                      {acc.situationDescription}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6F7A78] group-hover:text-[#17323A] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false)
          setForgotSent(false)
        }}
        title="Reset your portal password"
        description="Enter the email associated with your company account."
      >
        {forgotSent ? (
          <div className="space-y-4 text-center py-4">
            <p className="text-sm text-[#3E7A5B] font-medium">
              If an account exists for {forgotEmail || email}, a secure reset link has been dispatched to your email.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setForgotModalOpen(false)
                setForgotSent(false)
              }}
            >
              Back to login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              value={forgotEmail || email}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="e.g. naledi@kgosimining.example"
              isRequired
            />
            <Button type="submit" variant="primary" size="md" className="w-full">
              Send password reset link
            </Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
