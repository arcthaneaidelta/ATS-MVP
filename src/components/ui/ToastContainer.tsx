import React from 'react'
import { useStore } from '@/store/useStore'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Link } from 'react-router-dom'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[80] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error'

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto bg-[#FFFFFF] border rounded-[12px] p-4 shadow-[0_24px_48px_-16px_rgba(23,50,58,0.22)] flex items-start gap-3 transition-all duration-280 animate-in slide-in-from-bottom-3',
              isError ? 'border-[#A94438]/50' : 'border-[#E3DDD0]'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-[#3E7A5B]" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-[#A94438]" />
              ) : (
                <Info className="w-5 h-5 text-[#3F6C8C]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-[#17323A] leading-tight">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-xs text-[#4A5755] mt-1 leading-normal line-clamp-2">
                  {toast.message}
                </p>
              )}
              {toast.actionLabel && toast.actionUrl && (
                <div className="mt-2">
                  {toast.actionUrl.startsWith('#') ? (
                    <button
                      type="button"
                      onClick={() => {
                        useStore.getState().setDemoGuideOpen(true)
                        if (toast.actionUrl === '#inbox') {
                          useStore.getState().setDemoGuideTab('inbox')
                        }
                        removeToast(toast.id)
                      }}
                      className="text-xs font-semibold text-[#B8864B] hover:text-[#8A5F2B] underline"
                    >
                      {toast.actionLabel}
                    </button>
                  ) : (
                    <Link
                      to={toast.actionUrl}
                      onClick={() => removeToast(toast.id)}
                      className="text-xs font-semibold text-[#B8864B] hover:text-[#8A5F2B] underline"
                    >
                      {toast.actionLabel}
                    </Link>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="w-6 h-6 rounded flex items-center justify-center text-[#6F7A78] hover:text-[#17323A] hover:bg-[#EFEADF] transition-colors shrink-0 -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
