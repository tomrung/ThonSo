import React from 'react';
import { Home, Users, Building2, QrCode, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQRScanner: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab, onOpenQRScanner }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 shadow-float">
      <div className="flex items-center justify-around">
        {/* Tab 1: Trang chủ */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'home' ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Trang chủ</span>
        </button>

        {/* Tab 2: Dân cư */}
        <button
          onClick={() => setCurrentTab('nhan-khau')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'nhan-khau' ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dân cư</span>
        </button>

        {/* Center Button: Quét QR CCCD */}
        <button
          onClick={onOpenQRScanner}
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full gradient-gov text-white flex items-center justify-center shadow-lg shadow-sky-500/40 active:scale-95 transition-transform border-2 border-white">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-sky-600 mt-0.5">Quét CCCD</span>
        </button>

        {/* Tab 3: Hộ khẩu */}
        <button
          onClick={() => setCurrentTab('ho-khau')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'ho-khau' ? 'text-sky-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Hộ khẩu</span>
        </button>

        {/* Tab 4: Quản trị */}
        <button
          onClick={() => setCurrentTab(isAdmin ? 'admin' : 'dashboard')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
            (currentTab === 'admin' || currentTab === 'dashboard')
              ? 'text-sky-600 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isAdmin ? 'Quản trị' : 'Thống kê'}</span>
        </button>
      </div>
    </div>
  );
};
