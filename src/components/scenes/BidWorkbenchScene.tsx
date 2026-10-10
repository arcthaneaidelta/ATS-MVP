import React, { useState, useEffect } from 'react'
import { CheckCircle2, Clock, ShieldCheck, FileText } from 'lucide-react'

export const BidWorkbenchScene: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Gentle parallax within window
      const x = (e.clientX / window.innerWidth - 0.5) * 12
      const y = (e.clientY / window.innerHeight - 0.5) * 12
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      aria-label="Interactive Bid Workbench demonstration showing tender reading, compliance mapping, and final submission pack readiness"
      className="relative w-full max-w-[540px] h-[460px] sm:h-[500px] mx-auto select-none overflow-visible"
    >
      <style>{`
        @keyframes sceneMasterLoop {
          0%, 88% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }

        @keyframes cardAUnderlines {
          0%, 5% { width: 0%; opacity: 0; }
          15%, 88% { width: 100%; opacity: 1; }
          95%, 100% { width: 0%; opacity: 0; }
        }

        @keyframes cardBRows {
          0%, 25% { opacity: 0; transform: translateY(6px); }
          32%, 88% { opacity: 1; transform: translateY(0); }
          95%, 100% { opacity: 0; }
        }

        @keyframes cardCProgress {
          0%, 55% { width: 0%; }
          65%, 88% { width: 100%; }
          95%, 100% { width: 0%; }
        }
      `}</style>

      {/* Main Container running 16s keyframe cycle */}
      <div
        className="relative w-full h-full"
        style={{
          animation: 'sceneMasterLoop 16s cubic-bezier(0.2, 0, 0, 1) infinite',
        }}
      >
        {/* CARD A: Invitation to Tender (Back Card, Offset up-left) */}
        <div
          className="hidden sm:block absolute top-0 left-0 w-[420px] bg-white rounded-[12px] border border-[#E3DDD0] p-5 shadow-[0_6px_20px_-8px_rgba(23,50,58,0.14)] transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${-24 + mousePos.x * 0.4}px, ${-16 + mousePos.y * 0.4}px, 0)`,
            zIndex: 1,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD0]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#8A5F2B]" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#17323A]">
                MTC/2026/114 · Supply of ICT Equipment
              </span>
            </div>
            <span className="text-[10px] bg-[#EFEADF] px-2 py-0.5 rounded text-[#4A5755] font-mono">
              ITT Part II
            </span>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {/* Requirement line 1 */}
            <div className="relative">
              <div className="h-2.5 bg-[#EFEADF] rounded w-full" />
              <div
                className="absolute top-0 left-0 h-2.5 bg-[#B8864B]/35 rounded border-b border-[#B8864B]"
                style={{
                  animation: 'cardAUnderlines 16s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                  animationDelay: '0.4s',
                }}
              />
            </div>
            {/* Plain grey line */}
            <div className="h-2 bg-[#EFEADF]/60 rounded w-[85%]" />
            {/* Requirement line 2 */}
            <div className="relative">
              <div className="h-2.5 bg-[#EFEADF] rounded w-[92%]" />
              <div
                className="absolute top-0 left-0 h-2.5 bg-[#B8864B]/35 rounded border-b border-[#B8864B]"
                style={{
                  animation: 'cardAUnderlines 16s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                  animationDelay: '1.2s',
                }}
              />
            </div>
            <div className="h-2 bg-[#EFEADF]/60 rounded w-[75%]" />
            {/* Requirement line 3 */}
            <div className="relative">
              <div className="h-2.5 bg-[#EFEADF] rounded w-[88%]" />
              <div
                className="absolute top-0 left-0 h-2.5 bg-[#B8864B]/35 rounded border-b border-[#B8864B]"
                style={{
                  animation: 'cardAUnderlines 16s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                  animationDelay: '2.0s',
                }}
              />
            </div>
            <div className="h-2 bg-[#EFEADF]/60 rounded w-[60%]" />
            {/* Requirement line 4 */}
            <div className="relative">
              <div className="h-2.5 bg-[#EFEADF] rounded w-[95%]" />
              <div
                className="absolute top-0 left-0 h-2.5 bg-[#B8864B]/35 rounded border-b border-[#B8864B]"
                style={{
                  animation: 'cardAUnderlines 16s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                  animationDelay: '2.8s',
                }}
              />
            </div>
          </div>
        </div>

        {/* CARD B: Compliance Matrix (Middle Card) */}
        <div
          className="absolute top-10 sm:top-24 left-0 sm:left-12 w-full sm:w-[440px] bg-white rounded-[12px] border border-[#CFC7B6] p-5 shadow-[0_12px_28px_-10px_rgba(23,50,58,0.18)] transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)`,
            zIndex: 2,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD0]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3F6C8C]" />
              <h4 className="text-xs font-semibold tracking-wider uppercase text-[#17323A]">
                Stage 1 · Compliance Matrix
              </h4>
            </div>
            <span className="text-[10px] bg-[#E3DDD0] text-[#17323A] px-2 py-0.5 rounded font-mono font-medium">
              Live Audit
            </span>
          </div>

          <div className="mt-3 divide-y divide-[#E3DDD0]/50 text-xs">
            {[
              { label: 'Valid BURS Tax Clearance verification', delay: '4.2s' },
              { label: 'CIPA Certificate & 100% citizen shareholding', delay: '5.0s' },
              { label: 'PPADB Code 120 Sub-code 01 verification', delay: '5.8s' },
              { label: 'Technical specification response & datasheet', delay: '6.6s' },
              { label: 'Pricing schedule & 14% VAT arithmetic check', delay: '7.4s' },
            ].map((row, idx) => (
              <div
                key={idx}
                className="py-2 flex items-center justify-between gap-3"
                style={{
                  animation: 'cardBRows 16s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                  animationDelay: row.delay,
                }}
              >
                <span className="text-[#1B2625] font-medium truncate">{row.label}</span>
                <span className="flex items-center gap-1 text-[#3E7A5B] font-semibold text-[11px] shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-[#3E7A5B]/15" />
                  <span>Compliant</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD C: Submission Pack (Front Card, Offset down-right) */}
        <div
          className="absolute bottom-2 sm:bottom-6 right-0 sm:right-2 w-full sm:w-[380px] bg-[#FBF9F4] rounded-[12px] border-2 border-[#17323A] p-4.5 shadow-[0_20px_35px_-12px_rgba(23,50,58,0.24)] transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${20 + mousePos.x * 0.9}px, ${20 + mousePos.y * 0.9}px, 0)`,
            zIndex: 3,
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-[#17323A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3E7A5B]" />
              Submission Pack Ready
            </span>
            <div className="flex items-center gap-1 bg-[#17323A] text-[#F6F3EC] px-2 py-0.5 rounded-full text-[10px] font-medium font-mono">
              <Clock className="w-3 h-3 text-[#B8864B]" />
              <span>Closes 14 Nov · 11:00</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between text-xs mt-3">
            <span className="font-semibold text-[#17323A]">14 of 14 requirements met</span>
            <span className="font-mono text-[11px] text-[#5E7F78] font-bold">100% Score Ready</span>
          </div>

          {/* Progress rail */}
          <div className="w-full h-2 bg-[#E3DDD0] rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-[#5E7F78] rounded-full transition-all duration-500"
              style={{
                animation: 'cardCProgress 16s cubic-bezier(0.22, 1, 0.36, 1) infinite',
                animationDelay: '8.8s',
              }}
            />
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#E3DDD0] flex items-center justify-between text-[11px] text-[#6F7A78]">
            <span>Sealed 1 Original + 4 Copies</span>
            <span className="font-mono text-[#17323A] font-semibold">Tender Box Gaborone</span>
          </div>
        </div>
      </div>
    </div>
  )
}
