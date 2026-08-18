import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Search, 
  QrCode, 
  FileSpreadsheet, 
  ShieldCheck, 
  Bell, 
  ChevronRight, 
  HeartHandshake, 
  CreditCard,
  Award,
  Sparkles,
  MapPin,
  PhoneCall,
  CheckCircle2,
  Lock,
  UserPlus,
  LogIn,
  KeyRound,
  Shield,
  Layers,
  Phone,
  Stethoscope,
  Wifi,
  Flame,
  Sprout
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { NhanKhau } from '../types';

interface HomePageProps {
  onNavigateToTab: (tab: string) => void;
  onOpenQRScanner: () => void;
  onSelectResident: (res: NhanKhau) => void;
  onOpenThongBao: () => void;
  onOpenAuthModal: (mode: 'login' | 'register' | 'forgot') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToTab,
  onOpenQRScanner,
  onSelectResident,
  onOpenThongBao,
  onOpenAuthModal,
}) => {
  const { kpiStats, thongBaoList, nhanKhauList } = useData();
  const { currentUser } = useAuth();
  const [quickSearch, setQuickSearch] = useState('');

  const searchResults = quickSearch.trim()
    ? nhanKhauList
        .filter((r) =>
          r.ho_ten.toLowerCase().includes(quickSearch.toLowerCase()) ||
          (r.so_cmnd_cccd && r.so_cmnd_cccd.includes(quickSearch)) ||
          r.ma_ho.toLowerCase().includes(quickSearch.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Hero Banner Chính Quyền Số */}
      <div className="relative rounded-3xl overflow-hidden gradient-gov text-white p-6 sm:p-10 shadow-float">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-sky-100 border border-white/20 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            Cổng Thông Tin Dân Cư Số • Thôn An Trạch, Xã Hòa Tiến
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Hệ Thống Quản Trị Dân Cư Số <br className="hidden sm:inline" />
            & Phân Quyền Row Level Security
          </h1>

          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed max-w-3xl">
            Quản trị toàn diện <strong className="text-white font-bold">2.308 nhân khẩu</strong> và <strong className="text-white font-bold">614 hộ khẩu</strong> trên nền tảng Supabase PostgreSQL bảo mật đa tầng, quét mã QR CCCD và giám sát biến động nhân khẩu thời gian thực.
          </p>

          {/* Quick Search Box directly on Hero */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Tra cứu nhanh họ tên, số CCCD/CMND, mã hộ (VD: Đinh Thị Em, 200321109, HK001)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium shadow-lg border-0 focus:ring-2 focus:ring-sky-400"
              />

              {/* Autocomplete Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Kết quả tìm kiếm nhanh ({searchResults.length}):
                  </div>
                  {searchResults.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => {
                        onSelectResident(res);
                        setQuickSearch('');
                      }}
                      className="p-2.5 rounded-xl hover:bg-sky-50 transition-colors flex items-center justify-between cursor-pointer text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 hover:text-sky-700">{res.ho_ten}</span>
                        <span className="text-slate-500 text-[11px] block">
                          {res.to_dan_cu} • Hộ: {res.ma_ho} ({res.quan_he_chu_ho}) • {res.tuoi} tuổi
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sky-700 text-[11px] block">{res.so_cmnd_cccd || 'Chưa CCCD'}</span>
                        <span className="text-[10px] text-slate-400">{res.trang_thai_cu_tru}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Pills - ALL ON ONE SINGLE ROW */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none flex-nowrap w-full pt-2">
            <button
              type="button"
              onClick={onOpenQRScanner}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white text-sky-800 hover:bg-sky-50 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <QrCode className="w-4 h-4 text-sky-600" />
              <span>Quét Mã QR CCCD</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('nhan-khau')}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>Danh Sách Dân Cư</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('nong-nghiep')}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/40 shrink-0 whitespace-nowrap"
            >
              <Sprout className="w-4 h-4 text-white" />
              <span>Nông Nghiệp (647 Thửa)</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToTab('dashboard')}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Building2 className="w-4 h-4" />
              <span>Báo Cáo KPI</span>
            </button>
            {!currentUser && (
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 text-slate-900" />
                <span>Đăng Nhập Cán Bộ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Portal Access Callout Card */}
      <div className="premium-card p-5 sm:p-6 rounded-3xl border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Cổng Quản Trị Dành Cho Cán Bộ & Ban Nhân Dân Thôn
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Đăng nhập tài khoản cán bộ để được cấp quyền RLS tương ứng với tổ dân cư phụ trách.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          {currentUser ? (
            <button
              onClick={() => onNavigateToTab('profile')}
              className="px-4 py-2 rounded-xl gradient-gov text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" />
              <span>Hồ Sơ Cán Bộ ({currentUser.ho_ten})</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-4 py-2 rounded-xl gradient-gov text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng Ký Cán Bộ</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('forgot')}
                className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:underline flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Quên Mật Khẩu</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4 Main Summary Cards - Balanced & Fluid Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Quy Mô Dân Số */}
        <div 
          onClick={() => onNavigateToTab('nhan-khau')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer min-h-[148px]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Quy Mô Dân Số
            </span>
            <div className="w-8 h-8 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {kpiStats.totalResidents.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Thường trú:</span>
              <strong className="text-sky-700 font-extrabold bg-sky-50 px-1.5 py-0.2 rounded-md border border-sky-100">
                {kpiStats.thuongTru.toLocaleString('vi-VN')} (92.5%)
              </strong>
            </div>
          </div>
        </div>

        {/* Card 2: Sổ Hộ Khẩu */}
        <div 
          onClick={() => onNavigateToTab('ho-khau')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer min-h-[148px]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Sổ Hộ Khẩu
            </span>
            <div className="w-8 h-8 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight">
              {kpiStats.totalHouseholds.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Địa bàn:</span>
              <strong className="text-indigo-700 font-extrabold bg-indigo-50 px-1.5 py-0.2 rounded-md border border-indigo-100">
                8 Tổ Dân Cư
              </strong>
            </div>
          </div>
        </div>

        {/* Card 3: Căn Cước Gắn Chip */}
        <div 
          onClick={() => onNavigateToTab('nhan-khau')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer min-h-[148px]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Căn Cước Gắn Chip
            </span>
            <div className="w-8 h-8 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              {kpiStats.coCCCD.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Tỷ lệ:</span>
              <strong className="text-purple-700 font-extrabold bg-purple-50 px-1.5 py-0.2 rounded-md border border-purple-100">
                {Math.round((kpiStats.coCCCD / kpiStats.totalResidents) * 100)}%
              </strong>
            </div>
          </div>
        </div>

        {/* Card 4: Bảo Hiểm Y Tế */}
        <div 
          onClick={() => onNavigateToTab('nhan-khau')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer min-h-[148px]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Bảo Hiểm Y Tế
            </span>
            <div className="w-8 h-8 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight">
              {kpiStats.coBHYT.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Bao phủ:</span>
              <strong className="text-rose-700 font-extrabold bg-rose-50 px-1.5 py-0.2 rounded-md border border-rose-100">
                {Math.round((kpiStats.coBHYT / kpiStats.totalResidents) * 100)}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SƠ ĐỒ BỘ MÁY ĐIỀU HÀNH CƠ SỞ (TRANG CHỦ - TRỰC QUAN KHÁCH VÃNG LAI) ================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xs space-y-6 relative overflow-hidden">
        {/* Header Block without 'Xem chi tiet' button */}
        <div className="text-center max-w-3xl mx-auto space-y-1.5 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-black">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>HỆ THỐNG CHÍNH TRỊ CƠ SỞ THÔN AN TRẠCH</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sơ Đồ Bộ Máy Điều Hành & Cán Bộ Phụ Trách
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Mô hình 5 khối trụ cột cơ sở • Khách vãng lai và nhân dân bấm trực tiếp vào số điện thoại để liên hệ
          </p>
        </div>

        {/* TẦNG 1: LÃNH ĐẠO & ĐIỀU HÀNH TRUNG TÂM (CHI BỘ & BAN THÔN) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Tầng 1: Lãnh Đạo Toàn Diện & Điều Hành Quản Lý Trung Tâm</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Khối 1: Cấp Ủy Chi Bộ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-red-50/40 border-2 border-red-200 shadow-2xs space-y-3.5 hover:border-red-400 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-red-100">
                <div className="flex items-center gap-2 text-red-800 font-black text-xs uppercase">
                  <Award className="w-4 h-4 text-red-600" />
                  <span>1. Khối Cấp Ủy & Chi Bộ Thôn</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold">Lãnh đạo toàn diện</span>
              </div>

              <div className="space-y-2.5">
                {/* Bí thư */}
                <div className="p-3 rounded-xl bg-white border border-red-100 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-black text-xs sm:text-sm text-slate-900">NGUYỄN VĂN TOÀN</div>
                      <div className="text-[11px] text-red-700 font-extrabold">Bí Thư Chi Bộ Thôn</div>
                    </div>
                  </div>
                  <a
                    href="tel:0905123456"
                    className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 font-mono font-bold text-xs flex items-center gap-1.5 border border-red-200 transition-all shrink-0"
                    title="Bấm gọi ngay"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                    <span>0905.123.456</span>
                  </a>
                </div>

                {/* Phó Bí thư */}
                <div className="p-3 rounded-xl bg-white border border-red-100 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-black text-xs sm:text-sm text-slate-900">LÊ THỊ MAI</div>
                      <div className="text-[11px] text-red-700 font-extrabold">Phó Bí Thư Chi Bộ • Trưởng Ban CTMT</div>
                    </div>
                  </div>
                  <a
                    href="tel:0905654999"
                    className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 font-mono font-bold text-xs flex items-center gap-1.5 border border-red-200 transition-all shrink-0"
                    title="Bấm gọi ngay"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                    <span>0905.654.999</span>
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium leading-relaxed pt-1">
                📌 <strong>Nhiệm vụ:</strong> Lãnh đạo định hướng chính trị, nghị quyết phát triển KT-XH và quản lý đảng viên cơ sở.
              </p>
            </div>

            {/* Khối 2: Ban Nhân Dân Thôn */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/40 border-2 border-sky-200 shadow-2xs space-y-3.5 hover:border-sky-400 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                <div className="flex items-center gap-2 text-sky-800 font-black text-xs uppercase">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <span>2. Khối Ban Nhân Dân Thôn</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold">Quản lý & Tự quản</span>
              </div>

              <div className="space-y-2.5">
                {/* Trưởng thôn */}
                <div className="p-3 rounded-xl bg-white border border-sky-100 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-black text-xs sm:text-sm text-slate-900">LÊ VĂN TRƯỞNG THÔN</div>
                      <div className="text-[11px] text-sky-700 font-extrabold">Trưởng Thôn An Trạch</div>
                    </div>
                  </div>
                  <a
                    href="tel:0905654321"
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-mono font-bold text-xs flex items-center gap-1.5 border border-sky-200 transition-all shrink-0"
                    title="Bấm gọi ngay"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                    <span>0905.654.321</span>
                  </a>
                </div>

                {/* Phó Trưởng thôn */}
                <div className="p-3 rounded-xl bg-white border border-sky-100 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" alt="" className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-black text-xs sm:text-sm text-slate-900">TRẦN ĐÌNH HÙNG</div>
                      <div className="text-[11px] text-sky-700 font-extrabold">Phó Trưởng Thôn An Trạch</div>
                    </div>
                  </div>
                  <a
                    href="tel:0913888777"
                    className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-mono font-bold text-xs flex items-center gap-1.5 border border-sky-200 transition-all shrink-0"
                    title="Bấm gọi ngay"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                    <span>0913.888.777</span>
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium leading-relaxed pt-1">
                📌 <strong>Nhiệm vụ:</strong> Đại diện cộng đồng, giải quyết thủ tục hành chính, điều hành 614 hộ & 2.308 cư dân.
              </p>
            </div>
          </div>
        </div>

        {/* TẦNG 2: 3 KHỐI CÁNH CHUYÊN MÔN & CƠ SỞ */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Tầng 2: Ba Khối Cánh Trực Tiếp Cơ Sở & Nghiệp Vụ Chuyên Môn</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Khối 3: 8 Tổ Dân Cư */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/30 border-2 border-emerald-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs uppercase">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>3. Khối 8 Tổ Dân Cư</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">614 Hộ</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  8 Tổ trưởng trực tiếp quản lý từng khu vực dân cư, nắm biến động nhân khẩu và an sinh:
                </p>

                {/* Grid 8 Tổ Trưởng Mini */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { to: 'Tổ 1', name: 'Nguyễn Văn An', phone: '0905.111.001', ho: 80 },
                    { to: 'Tổ 2', name: 'Trần Thị Bình', phone: '0905.111.002', ho: 75 },
                    { to: 'Tổ 3', name: 'Lê Văn Cường', phone: '0905.111.003', ho: 85 },
                    { to: 'Tổ 4', name: 'Phạm Văn Dũng', phone: '0905.111.004', ho: 70 },
                    { to: 'Tổ 5', name: 'Hoàng Thị Em', phone: '0905.111.005', ho: 78 },
                    { to: 'Tổ 6', name: 'Ngô Văn Phúc', phone: '0905.111.006', ho: 72 },
                    { to: 'Tổ 7', name: 'Đặng Thị Giang', phone: '0905.111.007', ho: 82 },
                    { to: 'Tổ 8', name: 'Bùi Văn Hùng', phone: '0905.111.008', ho: 72 },
                  ].map((t, idx) => (
                    <a
                      key={idx}
                      href={`tel:${t.phone.replace(/\./g, '')}`}
                      className="p-2 rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex flex-col justify-between group shadow-2xs"
                      title="Bấm gọi Tổ trưởng"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] text-emerald-800">{t.to}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.ho} hộ</span>
                      </div>
                      <div className="font-bold text-[11px] text-slate-800 truncate mt-0.5">{t.name}</div>
                      <div className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1 mt-1">
                        <Phone className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{t.phone}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Khối 4: Khối Nghiệp Vụ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/30 border-2 border-amber-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-100">
                  <div className="flex items-center gap-1.5 text-amber-800 font-black text-xs uppercase">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>4. Khối Nghiệp Vụ & ANTT, Y Tế</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold">3 Bộ Phận</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Lực lượng ANTT cơ sở (Luật 2024), Y tế thôn bản chăm sóc sức khỏe, Tổ Công nghệ số:
                </p>

                <div className="space-y-2">
                  {/* ANTT */}
                  <a
                    href="tel:0978112233"
                    className="p-2.5 rounded-xl bg-white border border-amber-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all flex items-center justify-between gap-2 shadow-2xs"
                    title="Bấm gọi Công an viên / ANTT"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">HOÀNG VĂN NAM</div>
                        <div className="text-[10px] text-amber-800 font-bold">Tổ Trưởng ANTT Cơ Sở</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 shrink-0">
                      0978.112.233
                    </span>
                  </a>

                  {/* Y Tế */}
                  <a
                    href="tel:0912345678"
                    className="p-2.5 rounded-xl bg-white border border-amber-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all flex items-center justify-between gap-2 shadow-2xs"
                    title="Bấm gọi Cán bộ Y tế thôn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">ĐINH THỊ LAN</div>
                        <div className="text-[10px] text-emerald-800 font-bold">Y Tế Thôn Bản • BHYT</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                      0912.345.678
                    </span>
                  </a>

                  {/* Tổ CNS */}
                  <a
                    href="tel:0905999111"
                    className="p-2.5 rounded-xl bg-white border border-amber-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all flex items-center justify-between gap-2 shadow-2xs"
                    title="Bấm gọi Tổ Công nghệ số"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold shrink-0">
                        <Wifi className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">NGUYỄN VĂN CƯỜNG</div>
                        <div className="text-[10px] text-sky-800 font-bold">Tổ Công Nghệ Số Cộng Đồng</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200 shrink-0">
                      0905.999.111
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Khối 5: Khối Mặt Trận */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/30 border-2 border-purple-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                  <div className="flex items-center gap-1.5 text-purple-800 font-black text-xs uppercase">
                    <HeartHandshake className="w-4 h-4 text-purple-600" />
                    <span>5. Khối Mặt Trận & Đoàn Thể</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold">5 Chi Hội</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Ban Công tác Mặt trận và các Chi hội đoàn thể tập hợp sức mạnh đại đoàn kết toàn dân:
                </p>

                <div className="space-y-1.5 text-xs">
                  {[
                    { role: 'Ban CT Mặt Trận', name: 'Lê Thị Mai', phone: '0905.654.999', icon: HeartHandshake, color: 'text-purple-700 bg-purple-100' },
                    { role: 'Chi Hội Phụ Nữ', name: 'Nguyễn Thị Hoa', phone: '0905.222.333', icon: Users, color: 'text-pink-700 bg-pink-100' },
                    { role: 'Chi Hội Nông Dân', name: 'Trần Văn Long', phone: '0905.333.444', icon: Award, color: 'text-emerald-700 bg-emerald-100' },
                    { role: 'Chi Hội Cựu Chiến Binh', name: 'Phan Văn Dũng', phone: '0905.444.555', icon: Shield, color: 'text-amber-700 bg-amber-100' },
                    { role: 'Chi Đoàn Thanh Niên', name: 'Lê Văn Khoa', phone: '0905.555.666', icon: Flame, color: 'text-sky-700 bg-sky-100' },
                  ].map((item, idx) => (
                    <a
                      key={idx}
                      href={`tel:${item.phone.replace(/\./g, '')}`}
                      className="p-2 rounded-xl bg-white border border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-between gap-2 shadow-2xs"
                      title="Bấm gọi Chi hội trưởng"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold shrink-0 ${item.color}`}>
                          <item.icon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[11px] text-slate-900 truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{item.role}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 shrink-0">
                        {item.phone}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Announcements & Village Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Announcements */}
        <div className="lg:col-span-2 premium-card p-5 sm:p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Bản Tin & Thông Báo Mới</h3>
                <p className="text-xs text-slate-500">Chính sách y tế, họp thôn và thông báo khẩn</p>
              </div>
            </div>
            <button
              onClick={onOpenThongBao}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              Xem tất cả ({thongBaoList.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {thongBaoList.slice(0, 3).map((tb) => (
              <div
                key={tb.id}
                onClick={onOpenThongBao}
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/30 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase">
                    {tb.loai_tin}
                  </span>
                  <span className="text-[11px] text-slate-400">{new Date(tb.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm hover:text-sky-700">{tb.tieu_de}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{tb.noi_dung}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Village Contact */}
        <div className="premium-card p-5 sm:p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Ban Nhân Dân Thôn An Trạch</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Địa chỉ: Nhà Sinh hoạt Cộng đồng Thôn An Trạch, Xã Hòa Tiến, Huyện Hòa Vang, TP Đà Nẵng.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Lê Văn Trưởng Thôn</span>
                  <span className="text-slate-500 text-[11px]">Trưởng Thôn</span>
                </div>
                <a href="tel:0905654321" className="p-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Hoàng Văn Nam</span>
                  <span className="text-slate-500 text-[11px]">Công An Viên</span>
                </div>
                <a href="tel:0978112233" className="p-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Đinh Thị Lan</span>
                  <span className="text-slate-500 text-[11px]">Cán Bộ Y Tế</span>
                </div>
                <a href="tel:0912345678" className="p-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200/70 text-sky-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Supabase Row Level Security (RLS) Active.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
