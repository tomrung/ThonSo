import React, { useState } from 'react';
import { 
  Menu, 
  QrCode, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Shield, 
  Home, 
  ChevronRight, 
  Layers, 
  Users, 
  Building2, 
  Map as MapIcon, 
  FileText, 
  UserCheck, 
  Radio, 
  Key,
  Compass,
  Smartphone,
  Download,
  Bot,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigateToTab: (tab: string) => void;
  onToggleMobileMenu: () => void;
  onOpenQRScanner: () => void;
  onOpenExcelModal: () => void;
  onOpenThongBaoModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenNotificationCenter: () => void;
  onOpenPwaModal?: () => void;
  onOpenAiModal?: () => void;
}

interface PageMeta {
  category: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
}

const tabTitles: Record<string, PageMeta> = {
  home: { 
    category: 'Điều Hành', 
    title: 'Trang Chủ', 
    subtitle: 'Cổng thông tin & tổng quan dân cư số Thôn An Trạch, Xã Hòa Tiến',
    badge: 'Toàn Thôn',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  dashboard: { 
    category: 'Điều Hành', 
    title: 'Dashboard', 
    subtitle: 'Báo cáo giám sát 6 chỉ số dân số, bảo hiểm y tế & căn cước công dân',
    badge: 'Live Thống Kê',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  'ban-do': { 
    category: 'Điều Hành', 
    title: 'Bản đồ số GIS', 
    subtitle: 'Không gian địa lý 614 hộ gia đình & 8 phân vùng ranh giới tổ dân cư',
    badge: 'Vệ Tinh ESRI',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  'cong-van': { 
    category: 'Điều Hành', 
    title: 'Công văn', 
    subtitle: 'Số hóa văn thư, phân công nhiệm vụ và theo dõi tiến độ xử lý',
    badge: 'Nghị Định 30',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  'nong-nghiep': { 
    category: 'Điều Hành', 
    title: 'Nông nghiệp', 
    subtitle: 'Quản lý sản xuất 647 thửa đất, 5,26 tấn lúa giống & mùa vụ Đông Xuân 2025 - 2026',
    badge: 'Vụ ĐX 25-26',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  'nhan-khau': { 
    category: 'Dân Cư & Cán Bộ', 
    title: 'Dân cư', 
    subtitle: 'Danh bạ 2.308 cư dân, tra cứu CCCD, đối tượng chính sách & bảo hiểm y tế',
    badge: '2.308 Cư Dân',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  'ho-khau': { 
    category: 'Dân Cư & Cán Bộ', 
    title: 'Sổ Hộ Khẩu', 
    subtitle: 'Danh bạ 614 hộ gia đình, diện tích khuôn viên đất & tọa độ định vị',
    badge: '614 Hộ Gia Đình',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200'
  },
  'can-bo': { 
    category: 'Dân Cư & Cán Bộ', 
    title: 'Bộ máy điều hành', 
    subtitle: 'Cơ cấu tổ chức & chức năng nhiệm vụ 4 khối trụ cột Thôn An Trạch',
    badge: '4 Khối Trụ Cột',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  'thong-bao': { 
    category: 'Tiện Ích & Truyền Thông', 
    title: 'Thông báo thôn', 
    subtitle: 'Kênh truyền thông, chính sách nông thôn mới và lịch sinh hoạt thôn',
    badge: 'Kênh Tin Tức',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  admin: { 
    category: 'Quản Trị Cấp Cao', 
    title: 'Hệ thống', 
    subtitle: 'Quản lý thành viên, kiểm soát truy cập Supabase RLS & tọa độ đa điểm GIS',
    badge: 'RLS Active',
    badgeColor: 'bg-purple-50 text-purple-900 border-purple-300'
  },
  profile: { 
    category: 'Tài Khoản', 
    title: 'Hồ Sơ Cán Bộ', 
    subtitle: 'Thông tin định danh cá nhân, vai trò phụ trách và bảo mật mật khẩu',
    badge: 'Cá Nhân',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200'
  },
};

const roleNames: Record<UserRole, { label: string; badgeColor: string }> = {
  super_admin: { label: 'Super Admin', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
  admin: { label: 'Quản Trị Viên', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  truong_thon: { label: 'Trưởng Thôn', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  to_truong: { label: 'Tổ Trưởng', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200' },
  can_bo_y_te: { label: 'Cán Bộ Y Tế', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200' },
  cong_an_vien: { label: 'Công An Viên', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
  can_bo_xa: { label: 'Cán Bộ Xã', badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
};

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigateToTab,
  onToggleMobileMenu,
  onOpenQRScanner,
  onOpenExcelModal,
  onOpenThongBaoModal,
  onOpenAuthModal,
  onOpenNotificationCenter,
  onOpenPwaModal,
  onOpenAiModal,
}) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { unreadNotificationCount, isCloudConnected, isCloudSyncing, pullFromCloud, isCloudConfigured } = useData();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const pageInfo = tabTitles[currentTab] || tabTitles.home;
  const roleInfo = currentUser
    ? roleNames[currentUser.vai_tro]
    : { label: 'Khách', badgeColor: 'bg-slate-50 text-slate-600 border-slate-200' };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between gap-4">
      
      {/* Left: Mobile Toggle & High-Tech Breadcrumb Navigation */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Beautiful Breadcrumb Path Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold flex-wrap">
            
            {/* Root: Thôn An Trạch */}
            <button
              onClick={() => onNavigateToTab('home')}
              className="flex items-center gap-1 text-slate-500 hover:text-sky-700 hover:bg-slate-100 px-1.5 py-0.5 rounded-lg transition-all cursor-pointer group"
              title="Về Trang Chủ Thôn An Trạch"
            >
              <Home className="w-3.5 h-3.5 text-sky-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">An Trạch</span>
            </button>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

            {/* Category Crumb */}
            <span className="text-slate-400 font-bold hidden sm:inline-block">
              {pageInfo.category}
            </span>

            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 hidden sm:inline-block" />

            {/* Current Active Page Title & Badge */}
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate">
                {pageInfo.title}
              </h1>

              {pageInfo.badge && (
                <span className={`hidden md:inline-flex text-[10px] font-black px-2 py-0.5 rounded-md border shrink-0 ${pageInfo.badgeColor || 'bg-sky-50 text-sky-800 border-sky-200'}`}>
                  {pageInfo.badge}
                </span>
              )}
            </div>
          </div>

          {/* Page Subtitle Description */}
          <p className="text-[11px] text-slate-500 font-medium hidden md:block truncate mt-0.5">
            {pageInfo.subtitle}
          </p>
        </nav>
      </div>

      {/* Right: Quick Actions (Cloud Sync, AI Copilot, Cài App, Quét CCCD, Notification, Officer Profile) */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Cloud Sync Status Pill */}
        {isCloudConfigured && (
          <button
            onClick={() => pullFromCloud()}
            disabled={isCloudSyncing}
            title={
              isCloudConnected
                ? "Cloud Supabase: Đang đồng bộ thời gian thực 2 chiều (Bấm để tải lại)"
                : "Cloud Supabase: Chưa kết nối (Bấm để thử lại)"
            }
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all duration-200 cursor-pointer active:scale-95 shadow-2xs ${
              isCloudConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isCloudSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            ) : isCloudConnected ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="hidden xl:inline text-[11px]">
              {isCloudSyncing ? 'Đang sync...' : isCloudConnected ? 'Cloud Sync' : 'Offline'}
            </span>
          </button>
        )}

        {/* An Trạch AI Copilot Button */}
        {onOpenAiModal && (
          <button
            onClick={onOpenAiModal}
            title="Trợ Lý Ảo An Trạch AI Copilot (Hỏi đáp & Soạn thảo)"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600 hover:from-indigo-700 hover:to-sky-700 text-white font-extrabold text-xs shadow-sm hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer group"
          >
            <Bot className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">An Trạch AI</span>
          </button>
        )}

        {/* PWA App Install Button */}
        {onOpenPwaModal && (
          <button
            onClick={onOpenPwaModal}
            title="Cài đặt App An Trạch Số lên màn hình điện thoại"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-teal-500/10 hover:from-sky-500/20 hover:to-teal-500/20 text-sky-800 border border-sky-200/80 hover:border-sky-300 hover:shadow-xs transition-all duration-200 flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer active:scale-95 group"
          >
            <Smartphone className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Cài App</span>
          </button>
        )}

        {/* Quét Mã QR CCCD Button */}
        <button
          onClick={onOpenQRScanner}
          title="Quét mã QR Thẻ Căn Cước Công Dân (CCCD)"
          className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200/90 hover:border-sky-300 hover:shadow-xs transition-all duration-200 flex items-center gap-1.5 text-xs font-black shadow-2xs cursor-pointer active:scale-95 group"
        >
          <QrCode className="w-4 h-4 text-sky-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200" />
          <span className="hidden sm:inline">Quét CCCD</span>
        </button>

        {/* Global Notification Bell Button */}
        <button
          onClick={onOpenNotificationCenter}
          title="Trung tâm thông báo & biến động hệ thống"
          className="relative p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200/90 hover:border-amber-300 hover:shadow-xs transition-all duration-200 shadow-2xs group cursor-pointer active:scale-95"
        >
          <Bell className="w-4 h-4 text-amber-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse shadow-xs">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Officer Profile Button with Hover and Click Support */}
        {currentUser ? (
          <div 
            className="relative ml-1 group"
            onMouseEnter={() => setShowProfileDropdown(true)}
            onMouseLeave={() => setShowProfileDropdown(false)}
          >
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              title={`Hồ sơ cán bộ: ${currentUser.ho_ten} - ${currentUser.vai_tro === 'to_truong' ? `Tổ trưởng ${currentUser.to_phu_trach}` : roleInfo.label}`}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-2xl border border-slate-200/90 group-hover:border-sky-400 group-hover:bg-sky-50/40 group-hover:shadow-sm transition-all duration-200 text-left bg-white shadow-2xs cursor-pointer active:scale-98"
            >
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt=""
                  className="w-7 h-7 rounded-xl object-cover border border-slate-200 group-hover:scale-105 transition-transform duration-200"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-black text-slate-800 truncate max-w-[120px] leading-tight group-hover:text-sky-700 transition-colors duration-150">
                  {currentUser.ho_ten}
                </div>
                <div className="text-[10px] text-slate-500 font-medium leading-tight">
                  {currentUser.vai_tro === 'to_truong' ? currentUser.to_phu_trach : roleInfo.label}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-y-0.5 transition-all duration-200 shrink-0" />
            </button>

            {/* Clean Hoverable Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-float border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt=""
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-black text-slate-900 text-xs truncate block">{currentUser.ho_ten}</span>
                      <span className="text-[10px] text-slate-500 truncate block font-mono">{currentUser.email}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-black ${roleInfo.badgeColor}`}>
                          {currentUser.vai_tro === 'to_truong' ? `Tổ trưởng ${currentUser.to_phu_trach}` : roleInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-semibold">
                  <button
                    onClick={() => {
                      onNavigateToTab('profile');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left p-2 rounded-xl text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all duration-150 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <User className="w-4 h-4 text-sky-600" />
                    <span>Hồ Sơ Cán Bộ</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigateToTab('admin');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-all duration-150 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span>Quản Trị Hệ Thống RLS</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileDropdown(false);
                      onNavigateToTab('home');
                    }}
                    className="w-full text-left p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-150 flex items-center gap-2 font-black cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-3.5 py-1.5 rounded-xl gradient-gov hover:brightness-110 text-white font-black text-xs flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer active:scale-95 transition-all duration-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng Nhập</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
