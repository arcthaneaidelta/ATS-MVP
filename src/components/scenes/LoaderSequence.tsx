import React, { useEffect, useState } from 'react'

export const LoaderSequence: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check if already loaded in this session
    const hasLoaded = sessionStorage.getItem('tv_loaded')
    if (hasLoaded) {
      if (onComplete) onComplete()
      return
    }

    setVisible(true)

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const p = Math.min(100, Math.floor((elapsed / 1200) * 100))
      setProgress(p)

      if (elapsed >= 1100) {
        clearInterval(interval)
        setExiting(true)
        sessionStorage.setItem('tv_loaded', 'true')
        setTimeout(() => {
          setVisible(false)
          if (onComplete) onComplete()
        }, 560)
      }
    }, 50)

    const handleSkip = () => {
      clearInterval(interval)
      setExiting(true)
      sessionStorage.setItem('tv_loaded', 'true')
      setTimeout(() => {
        setVisible(false)
        if (onComplete) onComplete()
      }, 200)
    }

    window.addEventListener('keydown', handleSkip)
    window.addEventListener('click', handleSkip)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleSkip)
      window.removeEventListener('click', handleSkip)
    }
  }, [onComplete])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-label="Loading TenderVantage"
      className={`fixed inset-0 z-[100] bg-[#17323A] flex flex-col items-center justify-center transition-transform duration-560 ease-in-out select-none cursor-pointer ${
        exiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Monogram TV */}
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            {/* T bar */}
            <path
              d="M16 26 H46 M31 26 V60"
              stroke="#F6F3EC"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700"
              style={{
                strokeDasharray: 90,
                strokeDashoffset: 0,
              }}
            />
            {/* V that closes into a tick */}
            <path
              d="M48 30 L58 54 L72 20"
              stroke="#B8864B"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 70,
                strokeDashoffset: 0,
              }}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="text-center">
          <h1 className="font-serif text-[28px] text-[#F6F3EC] tracking-tight font-normal">
            TenderVantage
          </h1>
          <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-[#CFC7B6] mt-1 font-semibold">
            Tenders Written to be Scored · Gaborone
          </p>
        </div>

        {/* Ochre Hairline progress bar */}
        <div className="w-40 h-[2px] bg-[#224752] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-[#B8864B] transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-[#6F7A78] mt-4 font-mono">
          Press any key or click to skip
        </span>
      </div>
    </div>
  )
}
