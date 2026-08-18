import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Users, 
  Layers, 
  ShieldCheck, 
  QrCode, 
  FileSpreadsheet, 
  Bell, 
  ChevronDown, 
  PanelLeftClose,
  PanelLeftOpen,
  User,
  LogIn,
  LogOut,
  Shield,
  FileText,
  Map as MapIcon,
  Compass,
  FileCheck2,
  UserCheck,
  Sparkles,
  Radio,
  Sprout,
  Smartphone,
  Download,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onOpenThongBaoModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenPwaModal?: () => void;
  onOpenAiModal?: () => void;
}

const roleNames: Record<UserRole, { label: string; badgeColor: string }> = {
  super_admin: { label: 'Super Admin', badgeColor: 'bg-purple-100 text-purple-800 border-purple-300' },
  admin: { label: 'Quản Trị Viên', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  truong_thon: { label: 'Trưởng Thôn', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  to_truong: { label: 'Tổ Trưởng', badgeColor: 'bg-sky-100 text-sky-800 border-sky-300' },
  can_bo_y_te: { label: 'Cán Bộ Y Tế', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' },
  cong_an_vien: { label: 'Công An Viên', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' },
  can_bo_xa: { label: 'Cán Bộ Xã', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300' },
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  onOpenThongBaoModal,
  onOpenAuthModal,
  onOpenPwaModal,
  onOpenAiModal,
}) => {
  const { currentUser, logout, isAdmin, allProfiles } = useAuth();
  const { kpiStats, thongBaoList } = useData();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const pendingCount = allProfiles.filter((p) => p.trang_thai === 'pending_approval').length;
  const roleInfo = currentUser
    ? roleNames[currentUser.vai_tro]
    : { label: 'Khách', badgeColor: 'bg-slate-100 text-slate-700 border-slate-300' };

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  const isCompact = isCollapsed && !mobileOpen;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200/90 shadow-subtle transition-all duration-300 ease-in-out lg:static ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'}`}
      >
        {/* Brand Header */}
        <div className={`h-16 flex items-center border-b border-slate-100 ${isCompact ? 'justify-center px-2' : 'justify-between px-4'}`}>
          <div 
            onClick={() => {
              if (isCompact) setIsCollapsed(false);
              else handleNavClick('home');
            }}
            className={`flex items-center gap-3 cursor-pointer select-none overflow-hidden group ${isCompact ? 'justify-center' : ''}`}
            title={isCompact ? 'Bấm để mở rộng menu' : 'Trang chủ Thôn An Trạch'}
          >
            {/* Logo Emblem */}
            <div className="w-10 h-10 rounded-2xl gradient-gov flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>

            {!isCompact && (
              <div className="flex flex-col justify-center min-w-0 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="font-black text-slate-900 text-sm tracking-tight truncate">THÔN AN TRẠCH</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span className="truncate">Xã Hòa Tiến, Đà Nẵng</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          {!isCompact && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Thu gọn menu"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-none">
          
          {/* Quick Expand Button when collapsed */}
          {isCompact && (
            <div className="flex justify-center pb-2 border-b border-slate-100">
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-sky-50 text-slate-500 hover:text-sky-700 border border-slate-200/80 flex items-center justify-center transition-all group relative cursor-pointer"
                title="Mở rộng Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-1.5">
                  <span>Mở rộng menu</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              </button>
            </div>
          )}

          {/* ================= GROUP 1: ĐIỀU HÀNH & TỔNG QUAN ================= */}
          <div className="space-y-0.5">
            {!isCompact && (
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                <span>Điều Hành & Trợ Lý AI</span>
              </div>
            )}

            {/* AI Copilot Highlight Button */}
            {onOpenAiModal && (
              <div className="relative group mb-1.5">
                <button
                  onClick={onOpenAiModal}
                  className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-black transition-all relative cursor-pointer bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-emerald-500/10 text-indigo-900 border border-indigo-200/80 hover:border-indigo-400 hover:shadow-xs ${
                    isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                  }`}
                >
                  <Bot className="w-4 h-4 shrink-0 text-indigo-600 animate-pulse" />
                  {!isCompact && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>An Trạch AI</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-indigo-600 text-white font-black">
                        Copilot
                      </span>
                    </div>
                  )}
                </button>

                {isCompact && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                    <span>An Trạch AI Copilot</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                )}
              </div>
            )}

            {/* Item 1: Trang Chủ */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('home')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'home'
                    ? 'bg-sky-50 text-sky-800 font-black shadow-2xs border border-sky-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'home' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-sky-600" />
                )}
                <Home className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'home' ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                {!isCompact && <span>Trang Chủ</span>}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Trang Chủ</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 2: Dashboard */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'dashboard'
                    ? 'bg-sky-50 text-sky-800 font-black shadow-2xs border border-sky-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'dashboard' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-sky-600" />
                )}
                <Layers className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'dashboard' ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Dashboard</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-black">
                      Live
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Dashboard</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-black">Live</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 3: Bản đồ số GIS */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('ban-do')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'ban-do'
                    ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border border-emerald-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'ban-do' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-600" />
                )}
                <MapIcon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'ban-do' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Bản đồ số GIS</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-black">
                      614 Hộ & 8 Tổ
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Bản đồ số GIS (614 Hộ & 8 Tổ)</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 4: Công văn */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('cong-van')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'cong-van'
                    ? 'bg-sky-50 text-sky-800 font-black shadow-2xs border border-sky-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'cong-van' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-sky-600" />
                )}
                <FileText className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'cong-van' ? 'text-sky-600' : 'text-slate-400 group-hover:text-sky-600'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Công văn</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-sky-100 text-sky-800 font-extrabold">
                      NĐ 30
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Công văn & Chỉ đạo</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 5: Nông nghiệp & Mùa vụ */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('nong-nghiep')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'nong-nghiep'
                    ? 'bg-emerald-50 text-emerald-800 font-black shadow-2xs border border-emerald-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'nong-nghiep' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-emerald-600" />
                )}
                <Sprout className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'nong-nghiep' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Nông nghiệp</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-black">
                      43.86 ha
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Nông nghiệp & Mùa vụ (43.86 ha)</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 6: Bản Đồ Sản Xuất (Geo3D & GIS) */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('ban-do-san-xuat')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'ban-do-san-xuat'
                    ? 'bg-teal-50 text-teal-900 font-black shadow-2xs border border-teal-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'ban-do-san-xuat' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-teal-600" />
                )}
                <Compass className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'ban-do-san-xuat' ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-600'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Bản đồ sản xuất</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-teal-100 text-teal-800 font-black">
                      Geo3D
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Bản đồ sản xuất (Geo3D & GIS)</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>
          </div>

          {/* ================= GROUP 2: QUẢN LÝ DÂN CƯ & CÁN BỘ ================= */}
          <div className="space-y-0.5">
            {!isCompact && (
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                <span>Dân Cư & Cán Bộ</span>
              </div>
            )}

            {/* Item 1: Dân cư */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('nhan-khau')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'nhan-khau'
                    ? 'bg-sky-50 text-sky-800 font-black shadow-2xs border border-sky-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'nhan-khau' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-sky-600" />
                )}
                <Users className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'nhan-khau' ? 'text-sky-600' : 'text-slate-400 group-hover:text-sky-600'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Dân cư</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-sky-100 text-sky-800 font-black">
                      {kpiStats.totalResidents.toLocaleString('vi-VN')}
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Dân cư (Nhân khẩu)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500 text-white font-black">{kpiStats.totalResidents}</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 2: Sổ Hộ Khẩu */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('ho-khau')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'ho-khau'
                    ? 'bg-indigo-50 text-indigo-800 font-black shadow-2xs border border-indigo-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'ho-khau' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600" />
                )}
                <Building2 className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'ho-khau' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Sổ Hộ Khẩu</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-black">
                      {kpiStats.totalHouseholds}
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Sổ Hộ Khẩu</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500 text-white font-black">{kpiStats.totalHouseholds}</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 3: Bộ máy điều hành */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('can-bo')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'can-bo'
                    ? 'bg-purple-50 text-purple-800 font-black shadow-2xs border border-purple-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {currentTab === 'can-bo' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-purple-600" />
                )}
                <UserCheck className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'can-bo' ? 'text-purple-600' : 'text-slate-400 group-hover:text-purple-600'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Bộ máy điều hành</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800 font-black">
                      4 Khối
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Bộ máy điều hành cơ sở</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>
          </div>

          {/* ================= GROUP 3: TIỆN ÍCH & TRUYỀN THÔNG ================= */}
          <div className="space-y-0.5">
            {!isCompact && (
              <div className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                <span>Tiện Ích & Truyền Thông</span>
              </div>
            )}

            {/* Item 1: Thông báo thôn */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('thong-bao')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'thong-bao'
                    ? 'bg-amber-50 text-amber-900 font-black shadow-2xs border border-amber-200/80'
                    : 'text-slate-600 hover:text-amber-800 hover:bg-amber-50/70'
                }`}
              >
                {currentTab === 'thong-bao' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-500" />
                )}
                <Bell className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'thong-bao' ? 'text-amber-600' : 'text-amber-500'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Thông báo thôn</span>
                    {thongBaoList.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black">
                        {thongBaoList.length}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Thông báo thôn</span>
                  {thongBaoList.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-black">
                      {thongBaoList.length}
                    </span>
                  )}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>

            {/* Item 2: Quản Trị An Trạch AI */}
            <div className="relative group">
              <button
                onClick={() => handleNavClick('quan-tri-ai')}
                className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                } ${
                  currentTab === 'quan-tri-ai'
                    ? 'bg-purple-50 text-purple-900 font-black shadow-2xs border border-purple-200/80'
                    : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/70'
                }`}
              >
                {currentTab === 'quan-tri-ai' && !isCompact && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-purple-600" />
                )}
                <Sparkles className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${currentTab === 'quan-tri-ai' ? 'text-purple-600' : 'text-purple-500'}`} />
                {!isCompact && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>Quản Trị AI</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800 font-black">
                      RAG Hub
                    </span>
                  </div>
                )}
              </button>

              {isCompact && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                  <span>Quản Trị An Trạch AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500 text-white font-black">RAG</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}
            </div>
          </div>

          {/* ================= GROUP 4: QUẢN TRỊ CẤP CAO (ADMIN ONLY) ================= */}
          {isAdmin && (
            <div className="space-y-0.5 pt-2 border-t border-slate-100">
              {!isCompact && (
                <div className="px-3 text-[10px] font-black uppercase tracking-wider text-purple-900 mb-1 flex items-center justify-between">
                  <span>Hệ Thống</span>
                  <Shield className="w-3 h-3 text-purple-600" />
                </div>
              )}

              <div className="relative group">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full flex items-center gap-2.5 rounded-2xl text-xs font-bold transition-all relative cursor-pointer ${
                    isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'px-3 py-2'
                  } ${
                    currentTab === 'admin'
                      ? 'bg-purple-50 text-purple-900 font-black shadow-2xs border border-purple-200'
                      : 'text-purple-800 hover:bg-purple-50/70'
                  }`}
                >
                  {currentTab === 'admin' && !isCompact && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-purple-600" />
                  )}
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 group-hover:scale-110 transition-transform" />
                  {!isCompact && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>Hệ thống</span>
                      {pendingCount > 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black animate-pulse">
                          {pendingCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {isCompact && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-2">
                    <span>Hệ thống</span>
                    {pendingCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-white font-black">
                        {pendingCount} chờ duyệt
                      </span>
                    )}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer: PWA App & User Account Card */}
        <div className={`border-t border-slate-100 bg-slate-50/50 ${isCompact ? 'p-2' : 'p-2.5'}`}>
          {/* PWA Mobile App Card */}
          {!isCompact && onOpenPwaModal && (
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 border border-sky-100/80 mb-2 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-sky-900 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Cài App Di Động</span>
                </span>
                <span className="text-[8px] px-1.5 py-0.2 rounded bg-sky-200/80 text-sky-800 font-bold">PWA</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Dùng trên điện thoại không cần App Store</p>
              <button
                onClick={onOpenPwaModal}
                className="w-full mt-1 py-1 px-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Download className="w-3 h-3" />
                <span>Cài Đặt Lên Điện Thoại</span>
              </button>
            </div>
          )}

          {isCompact && onOpenPwaModal && (
            <div className="relative group mb-2 flex justify-center">
              <button
                onClick={onOpenPwaModal}
                className="w-10 h-10 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                title="Cài App di động PWA"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentUser ? (
            <div 
              className="relative group"
              onMouseEnter={() => setShowProfileDropdown(true)}
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`w-full flex items-center rounded-2xl border border-slate-200/90 bg-white hover:border-sky-300 hover:bg-sky-50/40 transition-all text-left shadow-2xs cursor-pointer ${
                  isCompact ? 'justify-center w-10 h-10 mx-auto p-0' : 'p-2 gap-2.5'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt=""
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                {!isCompact && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-slate-800 truncate leading-tight">
                      {currentUser.ho_ten}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {currentUser.to_phu_trach} • <span className="font-bold text-sky-700">{roleInfo.label}</span>
                    </div>
                  </div>
                )}

                {!isCompact && (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
                )}
              </button>

              {/* Hover Tooltip when collapsed */}
              {isCompact && (
                <div className="absolute left-full bottom-2 ml-3 px-3 py-1.5 bg-slate-900 text-white rounded-xl shadow-2xl text-xs font-bold whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-150 flex items-center gap-1.5">
                  <span>{currentUser.ho_ten} ({roleInfo.label})</span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              )}

              {/* Hoverable Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-3xl shadow-float border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentUser.avatar_url}
                        alt=""
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-black text-slate-900 text-xs truncate block">{currentUser.ho_ten}</span>
                        <span className="text-[10px] text-slate-500 truncate block font-mono">{currentUser.email}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${roleInfo.badgeColor}`}>
                            {currentUser.vai_tro === 'to_truong' ? `Tổ trưởng ${currentUser.to_phu_trach}` : roleInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-semibold">
                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left p-2 rounded-xl text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-sky-600" />
                      <span>Hồ Sơ Cán Bộ</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          handleNavClick('admin');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left p-2 rounded-xl text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition-colors flex items-center gap-2 cursor-pointer"
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
                        handleNavClick('home');
                      }}
                      className="w-full text-left p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Đăng Xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="w-full py-2 px-3 rounded-xl gradient-gov text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                {!isCompact && <span>Đăng Nhập</span>}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
