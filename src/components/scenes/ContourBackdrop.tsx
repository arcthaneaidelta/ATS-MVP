import React from 'react'

export const ContourBackdrop: React.FC<{ opacity?: number; mirrored?: boolean }> = ({
  opacity = 0.45,
  mirrored = false,
}) => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full object-cover transition-transform duration-1000 ${
          mirrored ? 'scale-x-[-1]' : ''
        }`}
      >
        <path
          d="M-100 200 C 200 120, 500 350, 900 220 C 1100 150, 1250 280, 1350 250"
          stroke="#CFC7B6"
          strokeWidth="1.2"
        />
        <path
          d="M-80 270 C 240 180, 520 420, 940 280 C 1120 220, 1280 340, 1370 310"
          stroke="#CFC7B6"
          strokeWidth="1.2"
        />
        <path
          d="M-60 340 C 280 240, 540 480, 980 350 C 1150 290, 1300 400, 1400 370"
          stroke="#CFC7B6"
          strokeWidth="1.2"
        />
        <path
          d="M-40 410 C 320 300, 560 550, 1020 410 C 1180 360, 1320 460, 1420 430"
          stroke="#CFC7B6"
          strokeWidth="1.2"
        />
        <path
          d="M-20 480 C 360 360, 600 620, 1060 480 C 1210 420, 1340 520, 1450 490"
          stroke="#CFC7B6"
          strokeWidth="1.2"
        />
        <path
          d="M0 550 C 400 420, 640 690, 1100 550 C 1240 490, 1360 580, 1480 550"
          stroke="#CFC7B6"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  )
}
