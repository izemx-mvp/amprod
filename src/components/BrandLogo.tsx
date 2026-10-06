import React from 'react';
import { BrandId } from '../types';

interface BrandLogoProps {
  brandId: BrandId | string;
  variant?: 'icon' | 'full' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandId,
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  // Dimension definitions
  const dimensions = {
    sm: { icon: 24, fontTitle: 'text-xs', fontSub: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 32, fontTitle: 'text-sm', fontSub: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 42, fontTitle: 'text-base', fontSub: 'text-xs', gap: 'gap-3' },
    xl: { icon: 56, fontTitle: 'text-xl', fontSub: 'text-xs', gap: 'gap-3.5' },
  }[size];

  // Specific bespoke vector icons for each brand
  const renderIcon = () => {
    switch (brandId) {
      case 'cosmetics':
        return (
          <svg
            width={dimensions.icon}
            height={dimensions.icon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="cosmGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>
              <linearGradient id="cosmGold" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Hexagonal faceted gem background */}
            <rect x="2" y="2" width="44" height="44" rx="12" fill="#022C22" stroke="#059669" strokeWidth="1.5" />
            <path
              d="M24 8L38 16V32L24 40L10 32V16L24 8Z"
              fill="url(#cosmGrad)"
              fillOpacity="0.4"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Stylized Droplet / Diamond monogram */}
            <path
              d="M24 13C24 13 32 23 32 28C32 32.4183 28.4183 36 24 36C19.5817 36 16 32.4183 16 28C16 23 24 13 24 13Z"
              fill="url(#cosmGrad)"
            />
            {/* AM Geometric Inner Cut */}
            <path
              d="M20 31L24 19L28 31M21.5 28H26.5"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="34" cy="14" r="2" fill="url(#cosmGold)" />
          </svg>
        );

      case 'rehab':
        return (
          <svg
            width={dimensions.icon}
            height={dimensions.icon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="rehabGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#84CC16" />
                <stop offset="60%" stopColor="#65A30D" />
                <stop offset="100%" stopColor="#365314" />
              </linearGradient>
            </defs>
            {/* Organic rounded base */}
            <rect x="2" y="2" width="44" height="44" rx="12" fill="#1A2E05" stroke="#65A30D" strokeWidth="1.5" />
            {/* Zen Botanical Circle */}
            <circle cx="24" cy="24" r="16" stroke="#84CC16" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
            {/* Stylized Twin Botanical Leaves */}
            <path
              d="M24 11C18 16 16 24 19 32C22 36 24 37 24 37C24 37 26 36 29 32C32 24 30 16 24 11Z"
              fill="url(#rehabGrad)"
            />
            <path
              d="M24 14V34M24 22L19 19M24 26L29 23"
              stroke="#ECFCCB"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M14 27C14 27 16 21 21 21"
              stroke="#A3E635"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'huiles':
        return (
          <svg
            width={dimensions.icon}
            height={dimensions.icon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="huilesGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#15803D" />
                <stop offset="100%" stopColor="#14532D" />
              </linearGradient>
              <linearGradient id="amberGold" x1="20" y1="16" x2="30" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            {/* Deep forest shield */}
            <rect x="2" y="2" width="44" height="44" rx="12" fill="#052E16" stroke="#15803D" strokeWidth="1.5" />
            {/* Outer Olive/Extraction Ring */}
            <path
              d="M12 24C12 17.3726 17.3726 12 24 12C30.6274 12 36 17.3726 36 24"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            {/* Golden Droplet Center */}
            <path
              d="M24 14C24 14 33 24 33 29.5C33 34.4706 28.9706 38.5 24 38.5C19.0294 38.5 15 34.4706 15 29.5C15 24 24 14 24 14Z"
              fill="url(#huilesGrad)"
            />
            <path
              d="M24 19C24 19 30 26 30 30C30 33.3137 27.3137 36 24 36C20.6863 36 18 30 24 19Z"
              fill="url(#amberGold)"
              opacity="0.85"
            />
            <circle cx="21" cy="27" r="1.5" fill="#FEF3C7" />
          </svg>
        );

      case 'formations':
        return (
          <svg
            width={dimensions.icon}
            height={dimensions.icon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="formGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="50%" stopColor="#0F766E" />
                <stop offset="100%" stopColor="#134E4A" />
              </linearGradient>
            </defs>
            {/* Academic Corporate Shield */}
            <rect x="2" y="2" width="44" height="44" rx="12" fill="#042F2C" stroke="#0F766E" strokeWidth="1.5" />
            {/* Modern Mortarboard Cap & Academy Crest */}
            <path
              d="M24 12L38 19L24 26L10 19L24 12Z"
              fill="url(#formGrad)"
              stroke="#2DD4BF"
              strokeWidth="1.2"
            />
            <path
              d="M15 22.5V30C15 33 19 36 24 36C29 36 33 33 33 30V22.5"
              stroke="#5EEAD4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Tassel */}
            <path
              d="M38 19V29C38 30 36.5 31 35.5 31"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Open Book Wings below */}
            <path
              d="M18 36L24 33L30 36"
              stroke="#CCFBF1"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'seo':
      default:
        return (
          <svg
            width={dimensions.icon}
            height={dimensions.icon}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="seoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#312E81" />
              </linearGradient>
              <linearGradient id="aiPurple" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#7E22CE" />
              </linearGradient>
            </defs>
            {/* Neural Matrix Shield */}
            <rect x="2" y="2" width="44" height="44" rx="12" fill="#1E1B4B" stroke="#6366F1" strokeWidth="1.5" />
            {/* Hexagonal AI Nodes */}
            <path
              d="M24 10L36 17V31L24 38L12 31V17L24 10Z"
              stroke="url(#seoGrad)"
              strokeWidth="1.5"
              opacity="0.8"
            />
            {/* Upward Growth SEO Chart Line */}
            <path
              d="M17 29L22 23L27 26L31 18"
              stroke="#A5B4FC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="31" cy="18" r="2.5" fill="#38BDF8" />
            {/* Center Neural Pulse */}
            <circle cx="24" cy="24" r="3" fill="url(#aiPurple)" />
          </svg>
        );
    }
  };

  // Typographic details
  const getBrandDetails = () => {
    switch (brandId) {
      case 'cosmetics':
        return {
          title: 'AM PROD',
          highlight: 'COSMÉTIQUES',
          subtitle: 'Matières Premières & R&D',
          colorClass: 'text-emerald-400',
        };
      case 'rehab':
        return {
          title: 'REHAB',
          highlight: 'BIO',
          subtitle: 'Cosmétique Bio & Soins Naturels',
          colorClass: 'text-lime-400',
        };
      case 'huiles':
        return {
          title: 'AM PROD',
          highlight: 'HUILES VÉGÉTALES',
          subtitle: 'Pressage à Froid & Élixirs Purs',
          colorClass: 'text-green-400',
        };
      case 'formations':
        return {
          title: 'AM PROD',
          highlight: 'FORMATIONS',
          subtitle: 'Académie Professionnelle Certifiée',
          colorClass: 'text-teal-400',
        };
      case 'seo':
      default:
        return {
          title: 'AGENT CEO',
          highlight: 'GROUPE',
          subtitle: 'Direction Générale & Supervision Multi-Marques',
          colorClass: 'text-indigo-400',
        };
    }
  };

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  const details = getBrandDetails();

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center ${dimensions.gap} ${className}`}>
        {renderIcon()}
        <div className="flex flex-col text-left">
          <div className={`font-bold tracking-tight text-white ${dimensions.fontTitle} leading-none`}>
            {details.title}{' '}
            <span className={details.colorClass}>{details.highlight}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} ${className}`}>
      {renderIcon()}
      <div className="flex flex-col text-left">
        <div className={`font-black tracking-tight text-white ${dimensions.fontTitle} leading-tight`}>
          {details.title}{' '}
          <span className={details.colorClass}>{details.highlight}</span>
        </div>
        <span className={`font-medium tracking-wide uppercase text-slate-400 ${dimensions.fontSub} leading-none mt-0.5`}>
          {details.subtitle}
        </span>
      </div>
    </div>
  );
};
