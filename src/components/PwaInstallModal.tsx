import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  QrCode, 
  X, 
  Zap, 
  WifiOff, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Wheat
} from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true;
    
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect Platform
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios');
    } else if (/android/i.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Để cài đặt: Trên trình duyệt Chrome/Cốc Cốc, bạn hãy nhấn vào biểu tượng dấu 3 chấm (⋮) ở góc trên và chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".');
      return;
    }

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.warn('Install prompt error:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  const currentUrl = window.location.origin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="relative bg-gradient-to-br from-slate-900 via-sky-950 to-emerald-950 text-white p-6 overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Smartphone className="w-36 h-36" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-lg flex items-center justify-center shrink-0">
                <img src="/icon-192.svg" alt="Logo An Trạch Số" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>Progressive Web App</span>
                </span>
                <h3 className="text-xl font-black text-white mt-1">Cài Đặt App An Trạch Số</h3>
                <p className="text-xs text-sky-200 font-medium">Trực tiếp lên màn hình điện thoại • Không cần App Store</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-xs leading-relaxed">
          
          {/* Status: Already Installed */}
          {isInstalled ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-sm font-bold block">Ứng dụng đã được cài đặt thành công!</strong>
                <span className="text-emerald-700">Bạn đang sử dụng phiên bản ứng dụng di động độc lập (*Standalone App*) với đầy đủ tính năng.</span>
              </div>
            </div>
          ) : (
            <>
              {/* Platform Specific Guides */}
              {platform === 'ios' ? (
                /* iOS Safari Step-by-Step Guide */
                <div className="space-y-3 bg-sky-50/60 p-4.5 rounded-2xl border border-sky-100">
                  <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                    <Smartphone className="w-4 h-4 text-sky-600" />
                    <span>Hướng dẫn cài đặt trên iPhone / iPad (Safari)</span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black shrink-0 text-xs">
                        1
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Bấm nút Chia sẻ (Share)</span>
                        <span className="text-slate-500">Tìm biểu tượng hình vuông mũi tên <Share className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> ở thanh dưới cùng Safari.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black shrink-0 text-xs">
                        2
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Chọn "Thêm vào MH chính"</span>
                        <span className="text-slate-500">Cuộn xuống danh sách tác vụ và nhấn vào <PlusSquare className="w-3.5 h-3.5 inline text-emerald-600 mx-0.5" /> <strong>"Thêm vào MH chính"</strong> (Add to Home Screen).</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black shrink-0 text-xs">
                        3
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Xác nhận "Thêm"</span>
                        <span className="text-slate-500">Nhấn nút <strong>"Thêm"</strong> ở góc trên bên phải. Biểu tượng App <strong>An Trạch Số</strong> sẽ xuất hiện trên màn hình điện thoại của bạn!</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : platform === 'android' ? (
                /* Android 1-Click Install Button or Guide */
                <div className="space-y-3 bg-emerald-50/60 p-4.5 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Cài đặt trên điện thoại Android (Chrome, Cốc Cốc, Samsung Internet)</span>
                  </div>

                  <p className="text-slate-600 text-xs">
                    Nhấn nút bên dưới để tải và ghim biểu tượng Ứng Dụng Thôn An Trạch trực tiếp lên màn hình chính.
                  </p>

                  <button
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white font-black text-sm shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-5 h-5 animate-bounce" />
                    <span>{isInstalling ? 'Đang kích hoạt...' : 'Cài Đặt Ứng Dụng Ngay (1 Chạm)'}</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    * Hoặc nhấn vào dấu 3 chấm <strong>⋮</strong> trên trình duyệt và chọn <strong>"Cài đặt ứng dụng"</strong>.
                  </p>
                </div>
              ) : (
                /* Desktop QR Code & Chrome Bar Prompt */
                <div className="space-y-4">
                  {deferredPrompt && (
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-sky-400" />
                      <span>Cài đặt App trên máy tính (Chrome / Edge)</span>
                    </button>
                  )}

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs shrink-0 flex flex-col items-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(currentUrl)}`}
                        alt="QR Cài đặt App Thôn An Trạch"
                        className="w-28 h-28 object-contain"
                      />
                      <span className="text-[9px] font-mono text-slate-400 mt-1 font-bold">Quét mở trên điện thoại</span>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-indigo-600" />
                        <span>Mở trên điện thoại cán bộ & bà con</span>
                      </h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Dùng camera điện thoại quét mã QR bên cạnh để mở trang web trên di động, sau đó bấm <strong>"Thêm vào màn hình chính"</strong> để dùng như App thật.
                      </p>
                      <div className="pt-1">
                        <span className="text-[10px] font-mono bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-500 font-bold block truncate">
                          {currentUrl}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* 4 Super Benefits of PWA App */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Lợi ích vượt trội khi cài đặt App:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium text-slate-700">Mở toàn màn hình, không vướng thanh URL</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Wheat className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-700">Xem bản đồ nông nghiệp & thửa ruộng mọi lúc</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-medium text-slate-700">Bộ nhớ đệm thông minh, xem mượt khi sóng yếu</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-medium text-slate-700">Dung lượng siêu nhẹ &lt;2MB, không tốn bộ nhớ</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs">
          <span className="text-[11px] text-slate-400 font-bold">UBND Xã Hòa Tiến • Thôn An Trạch</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all cursor-pointer"
          >
            Đã Hiểu & Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
