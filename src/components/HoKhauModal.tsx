import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Users, 
  Plus, 
  CreditCard, 
  ChevronRight,
  Map as MapIcon,
  Compass,
  Navigation
} from 'lucide-react';
import { HoKhau, NhanKhau } from '../types';
import { useData } from '../context/DataContext';
import { HouseholdMap } from './HouseholdMap';

interface HoKhauModalProps {
  household: HoKhau | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectResident: (res: NhanKhau) => void;
  onAddNewMember: (maHo: string, toDanCu: string, diaChi: string, tenChuHo: string) => void;
}

export const HoKhauModal: React.FC<HoKhauModalProps> = ({
  household,
  isOpen,
  onClose,
  onSelectResident,
  onAddNewMember,
}) => {
  const { nhanKhauList } = useData();
  const [activeTab, setActiveTab] = useState<'members' | 'map'>('members');

  if (!isOpen || !household) return null;

  // Lấy toàn bộ thành viên thuộc mã hộ này
  const members = nhanKhauList.filter((r) => r.ma_ho === household.ma_ho);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">{household.ma_ho}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  {household.to_dan_cu}
                </span>
                {household.lat && household.lng && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Đã ghim GPS
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">Chủ hộ: {household.ten_chu_ho}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'members'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Thành Viên Trong Hộ ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Bản Đồ & Ghim Vị Trí GPS</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Household Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block">Chủ hộ:</span>
                <span className="font-bold text-slate-900 text-sm">{household.ten_chu_ho}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Số nhân khẩu:</span>
                <span className="font-bold text-indigo-700 text-sm">{members.length} người</span>
              </div>
              <div>
                <span className="text-slate-400 block">CCCD Chủ hộ:</span>
                <span className="font-mono font-medium text-slate-800">
                  {household.so_cmnd_chu_ho || 'Chưa cập nhật'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Điện thoại liên hệ:</span>
                <span className="font-mono font-medium text-slate-800">
                  {household.so_dien_thoai || 'Chưa có'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Địa chỉ thường trú:</span>
                <span className="font-medium text-slate-800">{household.dia_chi}</span>
              </div>
            </div>
          </div>

          {/* TAB 1: MEMBERS LIST */}
          {activeTab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Danh Sách Nhân Khẩu ({members.length}):</span>
                </h4>
                <button
                  onClick={() => {
                    onAddNewMember(household.ma_ho, household.to_dan_cu, household.dia_chi, household.ten_chu_ho);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm nhân khẩu
                </button>
              </div>

              <div className="space-y-2">
                {members.map((m) => {
                  const isChuHo = m.quan_he_chu_ho?.toLowerCase().includes('chủ hộ');
                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        onSelectResident(m);
                        onClose();
                      }}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          m.gioi_tinh === 'Nam' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {m.gioi_tinh === 'Nam' ? '♂' : '♀'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs hover:text-indigo-600">{m.ho_ten}</span>
                            {isChuHo && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                Chủ hộ
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {m.quan_he_chu_ho} • {m.tuoi} tuổi ({m.nam_sinh || 'N/A'}) • {m.trang_thai_cu_tru}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {m.so_cmnd_cccd && (
                          <span className="hidden sm:inline font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            {m.so_cmnd_cccd}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE MAP & GPS PINNING */}
          {activeTab === 'map' && (
            <HouseholdMap household={household} />
          )}
        </div>
      </div>
    </div>
  );
};
