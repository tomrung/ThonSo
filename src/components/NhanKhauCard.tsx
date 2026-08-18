import React from 'react';
import { 
  User, 
  CreditCard, 
  HeartHandshake, 
  Phone, 
  Home, 
  MapPin, 
  Calendar,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { NhanKhau } from '../types';

interface NhanKhauCardProps {
  resident: NhanKhau;
  onSelect: (resident: NhanKhau) => void;
  onSelectHoKhau?: (maHo: string) => void;
}

export const NhanKhauCard: React.FC<NhanKhauCardProps> = ({ resident, onSelect, onSelectHoKhau }) => {
  const isChuHo = resident.quan_he_chu_ho?.toLowerCase().includes('chủ hộ');
  const hasCCCD = resident.so_cmnd_cccd && resident.so_cmnd_cccd.trim().length > 0;
  const hasBHYT = resident.ma_the_bhyt && resident.ma_the_bhyt.trim().length > 0;
  const isSpecial = resident.doi_tuong_dac_thu && resident.doi_tuong_dac_thu !== 'Bình thường';
  const isMale = resident.gioi_tinh === 'Nam';

  // Status color badge
  let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (resident.trang_thai_cu_tru?.includes('chuyển đi') || resident.trang_thai_cu_tru?.includes('Vắng mặt')) {
    statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (resident.trang_thai_cu_tru?.includes('Đã mất')) {
    statusBadge = 'bg-slate-100 text-slate-600 border-slate-300';
  } else if (resident.trang_thai_cu_tru?.includes('Tạm trú')) {
    statusBadge = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  return (
    <div 
      onClick={() => onSelect(resident)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-sky-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-4 sm:p-4.5 cursor-pointer flex flex-col justify-between overflow-hidden shadow-2xs"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {/* Gender Avatar Icon */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md shrink-0 transition-transform group-hover:scale-105 ${
              isMale 
                ? 'bg-gradient-to-tr from-sky-600 to-indigo-500 shadow-sky-500/20' 
                : 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-rose-500/20'
            }`}>
              {isMale ? '♂' : '♀'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-sky-600 transition-colors truncate">
                  {resident.ho_ten}
                </h4>
                {isChuHo && (
                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                    Chủ hộ
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                <span>{resident.quan_he_chu_ho}</span>
                {resident.tuoi ? (
                  <span> • <strong className="text-slate-700">{resident.tuoi}t</strong> ({resident.nam_sinh || 'N/A'})</span>
                ) : null}
              </p>
            </div>
          </div>

          {/* Tổ Dân Cư Badge */}
          <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
            {resident.to_dan_cu}
          </span>
        </div>

        {/* 2-Column Info Pills */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
          {/* CCCD / CMND */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <CreditCard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate font-mono font-bold text-[11px] text-slate-800">
              {hasCCCD ? resident.so_cmnd_cccd : <span className="text-slate-400 italic font-normal">Chưa CCCD</span>}
            </span>
          </div>

          {/* BHYT */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate font-mono font-bold text-[11px] text-slate-800">
              {hasBHYT ? (
                <span className="text-emerald-700">{resident.ma_the_bhyt?.substring(0, 7)}...</span>
              ) : (
                <span className="text-slate-400 italic font-normal">Chưa BHYT</span>
              )}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{resident.dia_chi}</span>
        </div>

        {/* Special Policy Warning Badge */}
        {isSpecial && (
          <div className="mt-2 text-[10px] px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="truncate">{resident.doi_tuong_dac_thu}</span>
          </div>
        )}
      </div>

      {/* Footer Details & Quick Action */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border truncate ${statusBadge}`}>
            {resident.trang_thai_cu_tru}
          </span>
          <span 
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectHoKhau) onSelectHoKhau(resident.ma_ho);
            }}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold border border-sky-200 transition-colors"
            title="Bấm để xem toàn bộ Sổ Hộ Khẩu"
          >
            {resident.ma_ho}
          </span>
        </div>

        <div className="flex items-center gap-0.5 text-sky-600 font-extrabold group-hover:translate-x-1 transition-transform text-[11px] shrink-0">
          <span>Xem chi tiết</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
