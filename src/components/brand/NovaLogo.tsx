import React from 'react';

interface NovaLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  logoUrl?: string;
}

export const NovaLogo: React.FC<NovaLogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  logoUrl,
}) => {
  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', sub: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="NOVA FX"
          className={`${sizeClasses.icon} object-contain`}
        />
      ) : (
        /* Transparent Vector NOVA FX Brand Emblem */
        <div className={`relative flex items-center justify-center ${sizeClasses.icon} group`}>
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#087BFF] to-[#00D9FF] rounded-xl blur-md opacity-40 group-hover:opacity-75 transition-opacity" />
          
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10 drop-shadow-[0_0_10px_rgba(8,123,255,0.7)]"
          >
            {/* Outer Geometric Hex Shield Frame */}
            <polygon
              points="50,4 92,26 92,74 50,96 8,74 8,26"
              stroke="url(#novaGradBorder)"
              strokeWidth="4"
              strokeLinejoin="round"
              fill="rgba(5, 9, 20, 0.6)"
            />

            {/* Stylized Apex Geometric 'N' & Upward Trading Vector */}
            <path
              d="M30 72 V28 L50 56 L70 28 V72"
              stroke="url(#novaGradPrimary)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Bullish Ascension Accent Spear */}
            <path
              d="M50 48 L72 26 M72 26 H56 M72 26 V42"
              stroke="#00E59B"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Central Energy Spark Node */}
            <circle cx="50" cy="56" r="4" fill="#00D9FF" />

            {/* Gradients */}
            <defs>
              <linearGradient id="novaGradPrimary" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#087BFF" />
                <stop offset="0.5" stopColor="#00D9FF" />
                <stop offset="1" stopColor="#00E59B" />
              </linearGradient>
              <linearGradient id="novaGradBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#087BFF" stopOpacity="0.8" />
                <stop offset="1" stopColor="#00D9FF" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-wider font-heading text-white ${sizeClasses.text}`}>
            NOVA
          </span>
          <span className={`font-extrabold tracking-wider font-heading bg-gradient-to-r from-[#087BFF] via-[#00D9FF] to-[#00E59B] bg-clip-text text-transparent ${sizeClasses.text}`}>
            FX
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
        </div>
        {showTagline && (
          <span className={`tracking-[0.25em] text-[#AAB5C5] font-semibold uppercase mt-0.5 ${sizeClasses.sub}`}>
            LEARN • TRADE • GROW
          </span>
        )}
      </div>
    </div>
  );
};
