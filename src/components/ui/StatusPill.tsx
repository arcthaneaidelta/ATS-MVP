import React from 'react'
import { cn } from '@/lib/cn'
import { CustomOrderStatus } from '@/mock/types'
import { CircleDashed, Loader2, Eye, RotateCcw, Check } from 'lucide-react'

interface StatusConfig {
  label: string
  color: string
  bgTint: string
  borderTint: string
  icon: React.ComponentType<{ className?: string }>
}

const STATUS_CONFIGS: Record<CustomOrderStatus, StatusConfig> = {
  'awaiting-intake': {
    label: 'Awaiting Intake',
    color: '#6F7A78',
    bgTint: 'rgba(111, 122, 120, 0.12)',
    borderTint: 'rgba(111, 122, 120, 0.28)',
    icon: CircleDashed,
  },
  'in-production': {
    label: 'In Production',
    color: '#3F6C8C',
    bgTint: 'rgba(63, 108, 140, 0.12)',
    borderTint: 'rgba(63, 108, 140, 0.28)',
    icon: Loader2,
  },
  'client-review': {
    label: 'Client Review',
    color: '#B7791F',
    bgTint: 'rgba(183, 121, 31, 0.12)',
    borderTint: 'rgba(183, 121, 31, 0.28)',
    icon: Eye,
  },
  'revisions-requested': {
    label: 'Revisions Requested',
    color: '#A94438',
    bgTint: 'rgba(169, 68, 56, 0.12)',
    borderTint: 'rgba(169, 68, 56, 0.28)',
    icon: RotateCcw,
  },
  delivered: {
    label: 'Delivered',
    color: '#3E7A5B',
    bgTint: 'rgba(62, 122, 91, 0.12)',
    borderTint: 'rgba(62, 122, 91, 0.28)',
    icon: Check,
  },
}

interface StatusPillProps {
  status: CustomOrderStatus
  size?: 'sm' | 'md'
  className?: string
  pulseIcon?: boolean
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  className,
  pulseIcon = false,
}) => {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS['awaiting-intake']
  const IconComponent = config.icon

  const sizeClasses = {
    sm: 'h-6 px-2 text-xs gap-1.5',
    md: 'h-7 px-2.5 text-[13px] gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full select-none shrink-0 border transition-colors',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.bgTint,
        borderColor: config.borderTint,
        color: config.color,
      }}
    >
      <IconComponent
        className={cn(
          'shrink-0',
          size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5',
          status === 'in-production' && pulseIcon && 'animate-spin'
        )}
      />
      <span className="leading-none">{config.label}</span>
    </span>
  )
}
