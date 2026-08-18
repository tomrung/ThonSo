import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles, ChevronRight } from 'lucide-react';

interface PwaInstallBannerProps {
  onOpenModal: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ onOpenModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if in standalone
    const standalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true;
    
    setIsStandalone(standalone);

    // Check if user dismissed banner today
    const dismissedTime = localStorage.getItem('an_trach_pwa_dismissed');
    const isDismissed = dismissedTime && (Date.now() - Number(dismissedTime) < 86400000); // 24 hours

    if (!standalone && !isDismissed) {
      // Show after a slight delay
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible || isStandalone) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('an_trach_pwa_dismissed', Date.now().toString());
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 max-w-sm w-[calc(100%-1.5rem)] animate-in slide-in-from-bottom duration-300">
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-sky-500/30 flex items-center justify-between gap-3 relative overflow-hidden backdrop-blur-lg">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-400" />

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 shadow-md">
            <img src="/icon-192.svg" alt="App Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <strong className="text-xs font-black text-white truncate block">Cài Đặt App An Trạch Số</strong>
              <span className="px-1.5 py-0.2 rounded bg-sky-500/30 text-sky-300 text-[9px] font-bold shrink-0">PWA</span>
            </div>
            <p className="text-[11px] text-sky-200/80 truncate">Ghim lên màn hình chính điện thoại</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenModal}
            className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Cài App</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
