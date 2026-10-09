import React from 'react';

export const SitePlanBg: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.07,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover animate-site-plan"
      >
        {/* Curving Road Centerlines */}
        <path
          d="M-50 200 C 250 180, 450 350, 750 320 C 1000 290, 1150 480, 1300 450"
          stroke="#1F2A27"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <path
          d="M350 340 C 400 520, 600 680, 850 720"
          stroke="#1F2A27"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        {/* Road Outer Curbs */}
        <path
          d="M-50 180 C 250 160, 440 330, 740 300 C 990 270, 1140 460, 1300 430"
          stroke="#1F2A27"
          strokeWidth="0.8"
        />
        <path
          d="M-50 220 C 250 200, 460 370, 760 340 C 1010 310, 1160 500, 1300 470"
          stroke="#1F2A27"
          strokeWidth="0.8"
        />
        {/* Cul-de-sac Bulb */}
        <circle cx="850" cy="720" r="60" stroke="#1F2A27" strokeWidth="0.8" />
        <circle cx="850" cy="720" r="25" stroke="#1F2A27" strokeWidth="0.8" strokeDasharray="4 4" />

        {/* Subdivision Lot Boundaries */}
        {/* Top Tier Lots */}
        <polygon points="120,60 220,50 210,165 110,175" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="145" y="120" fill="#1F2A27" fontSize="10" fontFamily="sans-serif">LOT 11</text>

        <polygon points="220,50 320,45 315,160 210,165" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="250" y="115" fill="#1F2A27" fontSize="10" fontFamily="sans-serif">LOT 12</text>

        <polygon points="320,45 430,60 410,180 315,160" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="350" y="125" fill="#1F2A27" fontSize="10" fontFamily="sans-serif">LOT 13</text>

        <polygon points="430,60 550,90 515,225 410,180" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="460" y="150" fill="#B4684A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">LOT 14 (VIP)</text>

        <polygon points="550,90 670,140 620,270 515,225" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="580" y="190" fill="#1F2A27" fontSize="10" fontFamily="sans-serif">LOT 15</text>

        {/* South Cul-de-Sac Lots */}
        <polygon points="760,650 830,600 870,680 800,730" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="800" y="670" fill="#1F2A27" fontSize="9" fontFamily="sans-serif">LOT 19</text>

        <polygon points="870,680 940,650 960,740 890,760" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="900" y="715" fill="#1F2A27" fontSize="9" fontFamily="sans-serif">LOT 20</text>

        <polygon points="850,780 910,830 840,860 810,800" stroke="#1F2A27" strokeWidth="0.75" />
        <text x="835" y="825" fill="#1F2A27" fontSize="9" fontFamily="sans-serif">LOT 21</text>

        {/* Contour Elevation Lines */}
        <path d="M0,450 Q 200,430 400,500 T 800,480 T 1200,400" stroke="#1F2A27" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M0,520 Q 250,510 500,580 T 950,560 T 1200,500" stroke="#1F2A27" strokeWidth="0.5" strokeDasharray="3 3" />
        <path d="M0,600 Q 300,600 600,670 T 1050,650 T 1200,620" stroke="#1F2A27" strokeWidth="0.5" strokeDasharray="3 3" />

        {/* Architectural Setback Indicators */}
        <rect x="445" y="105" width="45" height="55" stroke="#2F4A3F" strokeWidth="1" strokeDasharray="2 2" />
        <text x="450" y="135" fill="#2F4A3F" fontSize="8" fontFamily="sans-serif">CALDER</text>
      </svg>
    </div>
  );
};
