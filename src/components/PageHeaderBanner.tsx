import React, { ReactNode } from 'react';

export interface StatChip {
  label: string;
  value: string | number;
  icon?: ReactNode;
  colorClass?: string;
}

export interface PageHeaderBannerProps {
  icon: ReactNode;
  iconBgClass?: string;
  badge?: {
    text: string;
    icon?: ReactNode;
    colorClass?: string;
  };
  subBadge?: {
    text: string;
    icon?: ReactNode;
    colorClass?: string;
  };
  title: string;
  description: ReactNode | string;
  actions?: ReactNode;
  stats?: StatChip[];
  theme?: 'dark' | 'emerald' | 'blue' | 'purple' | 'amber' | 'slate';
  className?: string;
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  icon,
  iconBgClass = 'from-indigo-600 to-violet-600 text-white shadow-indigo-500/25',
  badge,
  subBadge,
  title,
  description,
  actions,
  stats,
  theme = 'dark',
  className = '',
}) => {
  // Theme Backgrounds
  const getThemeClasses = () => {
    switch (theme) {
      case 'emerald':
        return {
          wrapper: 'bg-gradient-to-br from-slate-900 via-emerald-950/80 to-slate-900 border-emerald-800/40 text-white shadow-xl',
          glow: 'bg-emerald-500/10',
          descText: 'text-emerald-100/80',
        };
      case 'blue':
        return {
          wrapper: 'bg-gradient-to-br from-slate-900 via-sky-950/80 to-slate-900 border-sky-800/40 text-white shadow-xl',
          glow: 'bg-sky-500/10',
          descText: 'text-sky-100/80',
        };
      case 'purple':
        return {
          wrapper: 'bg-gradient-to-br from-slate-900 via-purple-950/80 to-slate-900 border-purple-800/40 text-white shadow-xl',
          glow: 'bg-purple-500/10',
          descText: 'text-purple-100/80',
        };
      case 'amber':
        return {
          wrapper: 'bg-gradient-to-br from-slate-900 via-amber-950/80 to-slate-900 border-amber-800/40 text-white shadow-xl',
          glow: 'bg-amber-500/10',
          descText: 'text-amber-100/80',
        };
      case 'slate':
        return {
          wrapper: 'bg-white border-slate-200 text-slate-900 shadow-sm',
          glow: 'bg-slate-100',
          descText: 'text-slate-500',
        };
      case 'dark':
      default:
        return {
          wrapper: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/90 border-slate-800 text-white shadow-2xl',
          glow: 'bg-indigo-500/10',
          descText: 'text-slate-300',
        };
    }
  };

  const themeConfig = getThemeClasses();

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border relative overflow-hidden transition-all ${themeConfig.wrapper} ${className}`}>
      
      {/* Soft Decorative Ambient Radial Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${themeConfig.glow}`} />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* TOP SECTION: Left Icon + Info (Spacious, full width, no squishing) */}
      <div className="flex items-start sm:items-center gap-4 relative z-10 w-full">
        
        {/* Icon Badge 3D Container */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg border border-white/15 ${iconBgClass}`}>
          {icon}
        </div>

        {/* Text Content */}
        <div className="space-y-1.5 flex-1 min-w-0">
          
          {/* Badges / Tags Row */}
          {(badge || subBadge) && (
            <div className="flex flex-wrap items-center gap-2">
              {badge && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black border tracking-wide whitespace-nowrap shrink-0 ${badge.colorClass || 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30'}`}>
                  {badge.icon}
                  <span>{badge.text}</span>
                </span>
              )}
              {subBadge && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 ${subBadge.colorClass || 'bg-white/10 text-slate-200 border-white/15'}`}>
                  {subBadge.icon}
                  <span>{subBadge.text}</span>
                </span>
              )}
            </div>
          )}

          {/* Page Main Title */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white">
            {title}
          </h1>

          {/* Informational Guidance Description */}
          <div className={`text-xs font-medium leading-relaxed max-w-4xl ${themeConfig.descText}`}>
            {description}
          </div>

        </div>
      </div>

      {/* BOTTOM ACTION TOOLBAR SECTION: Single Unified Horizontal Row */}
      {(actions || (stats && stats.length > 0)) && (
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none relative z-10 w-full">
          
          {/* Actions Toolbar - ALL ON ONE SINGLE ROW */}
          {actions && (
            <div className="flex items-center gap-2 flex-nowrap shrink-0 overflow-x-auto scrollbar-none">
              {actions}
            </div>
          )}

          {/* Optional Stats Chips Strip */}
          {stats && stats.length > 0 && (
            <div className="flex items-center gap-2 text-xs flex-nowrap shrink-0">
              {stats.map((st, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 rounded-xl font-medium flex items-center gap-1.5 border backdrop-blur-sm whitespace-nowrap shrink-0 ${st.colorClass || 'bg-white/5 border-white/10 text-slate-300'}`}
                >
                  {st.icon}
                  <span className="text-slate-400 font-normal">{st.label}:</span>
                  <strong className="font-mono font-bold text-white">{st.value}</strong>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
