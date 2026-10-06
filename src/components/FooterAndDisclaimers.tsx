import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../utils/cn';

interface AIDisclaimerProps {
  className?: string;
  variant?: 'subtle' | 'compact' | 'badge';
}

export const AIDisclaimer: React.FC<AIDisclaimerProps> = ({
  className,
  variant = 'subtle',
}) => {
  if (variant === 'badge') {
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20", className)}>
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        L'IA aide à qualifier. La décision finale appartient à l'agence.
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm',
        className
      )}
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span className="font-normal text-slate-300">
        L'IA aide à qualifier. La décision finale appartient à l'agence.
      </span>
    </div>
  );
};

export const FooterInstitutional: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 sm:px-8 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md text-xs text-slate-400 transition-colors">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-medium text-slate-300 tracking-wide">
          Ce MVP a été conçu et développé par IZEMX
        </span>
        <span className="text-[11px] text-slate-400">
          AM PROD Group Holding © 2026 • Plateforme Multi-Marques ERP & Agent SEO
        </span>
      </div>
    </footer>
  );
};
