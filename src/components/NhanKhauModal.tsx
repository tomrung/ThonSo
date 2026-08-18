import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Edit3, 
  Trash2, 
  Save, 
  Phone, 
  CreditCard, 
  HeartHandshake, 
  Home, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldAlert,
  ShieldCheck,
  Check,
  AlertCircle,
  Sprout,
  Wheat,
  Activity,
  HeartPulse,
  Building2,
  PhoneCall,
  Eye,
  FileSpreadsheet,
  Clock,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { NhanKhau } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { computeCccdDetails } from '../lib/utils';

interface NhanKhauModalProps {
  resident: NhanKhau | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectOtherResident: (res: NhanKhau) => void;
  isCreating?: boolean;
  initialData?: Partial<NhanKhau>;
}

export const NhanKhauModal: React.FC<NhanKhauModalProps> = ({
  resident,
  isOpen,
  onClose,
  onSelectOtherResident,
  isCreating = false,
  initialData,
}) => {
  const { canEditResident, canDeleteResident, currentUser } = useAuth();
  const { nhanKhauList, updateNhanKhau, deleteNhanKhau, addNhanKhau, sanXuatList } = useData();

  const [activeTab, setActiveTab] = useState<'profile' | 'family' | 'agriculture' | 'audit'>('profile');
  const [isEditing, setIsEditing] = useState(isCreating);
  const [formData, setFormData] = useState<Partial<NhanKhau>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (resident) {
      setFormData({ ...resident });
      setIsEditing(isCreating);
      setDeleteConfirm(false);
      setSaveSuccess(false);
      setActiveTab('profile');
    } else if (isCreating) {
      setFormData({
        ma_ho: 'HK001',
        chu_ho: '',
        quan_he_chu_ho: 'Chủ hộ',
        ho_ten: '',
        gioi_tinh: 'Nam',
        to_dan_cu: currentUser?.to_phu_trach !== 'Toàn thôn' ? currentUser?.to_phu_trach || 'Tổ 1' : 'Tổ 1',
        dia_chi: 'Thôn An Trạch, Xã Hòa Tiến, Huyện Hòa Vang, TP Đà Nẵng',
        trang_thai_cu_tru: 'Đang thường trú',
        doi_tuong_dac_thu: 'Bình thường',
        loai_giay_to: 'CCCD gắn chip',
        ...initialData,
      });
      setIsEditing(true);
      setActiveTab('profile');
    }
  }, [resident, isCreating, initialData, isOpen, currentUser]);

  if (!isOpen) return null;

  const isAllowedToEdit = resident ? canEditResident(resident) : true;
  const isAllowedToDelete = canDeleteResident();

  // Danh sách các thành viên khác trong cùng hộ khẩu
  const familyMembers = resident
    ? nhanKhauList.filter((r) => r.ma_ho === resident.ma_ho && r.id !== resident.id)
    : [];

  // Đồng bộ danh sách thửa đất sản xuất nông nghiệp của cư dân
  const residentAgriParcels = resident && sanXuatList
    ? sanXuatList.filter(
        (r) =>
          r.chu_dat?.toUpperCase() === resident.ho_ten.toUpperCase() ||
          r.ho_san_xuat?.toUpperCase() === resident.ho_ten.toUpperCase()
      )
    : [];

  const totalAgriArea = residentAgriParcels.reduce((s, p) => s + (p.dien_tich_m2 || 0), 0);
  const totalAgriSeed = residentAgriParcels.reduce((s, p) => s + (p.giong_cap_kg || 0), 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ho_ten?.trim() || !formData.ma_ho?.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Mã hộ khẩu!');
      return;
    }

    try {
      setIsSaving(true);
      if (isCreating) {
        await addNhanKhau(formData as Omit<NhanKhau, 'id'>);
      } else if (resident) {
        await updateNhanKhau(resident.id, formData);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsSaving(false);
        setIsEditing(false);
        if (isCreating) onClose();
      }, 700);
    } catch (err: any) {
      setIsSaving(false);
      alert('Lỗi lưu dữ liệu: ' + (err.message || 'Không thể cập nhật hồ sơ'));
    }
  };

  const handleDelete = async () => {
    if (resident) {
      await deleteNhanKhau(resident.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-4 sm:p-6 shrink-0 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shrink-0 ${
                formData.gioi_tinh === 'Nam' 
                  ? 'bg-sky-500 text-white shadow-sky-500/30' 
                  : 'bg-rose-500 text-white shadow-rose-500/30'
              }`}>
                {formData.gioi_tinh === 'Nam' ? '♂' : '♀'}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-white text-lg sm:text-xl tracking-tight truncate">
                    {isCreating ? 'Thêm Mới Hồ Sơ Dân Cư' : formData.ho_ten}
                  </h3>
                  {formData.tuoi && (
                    <span className="px-2 py-0.5 rounded-md bg-white/15 text-sky-200 text-xs font-bold border border-white/20">
                      {formData.tuoi} tuổi
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                    {formData.to_dan_cu}
                  </span>
                </div>

                <p className="text-xs text-sky-200/80 font-medium mt-0.5 truncate flex items-center gap-2">
                  <span>Mã Hộ: <strong className="text-white font-mono">{formData.ma_ho}</strong> ({formData.quan_he_chu_ho || 'Chưa rõ quan hệ'})</span>
                  <span>•</span>
                  <span>{formData.trang_thai_cu_tru}</span>
                </p>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {!isCreating && isAllowedToEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isEditing 
                      ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 font-black' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Đang Chỉnh Sửa' : 'Chỉnh Sửa Full'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          {!isCreating && (
            <div className="flex items-center gap-1 mt-4 pt-3 border-t border-white/10 overflow-x-auto scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-sky-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>1. Hồ Sơ Đầy Đủ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('family')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'family'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-sky-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>2. Hộ Gia Đình ({familyMembers.length + 1})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('agriculture')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'agriculture'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-sky-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Wheat className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. Ruộng Lúa ({residentAgriParcels.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'audit'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-sky-200/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>4. Lịch Sử Biến Động</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-6">
          
          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-in zoom-in-95">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu và đồng bộ toàn bộ thông tin nhân khẩu thành công vào cơ sở dữ liệu!</span>
            </div>
          )}

          {/* ================= TAB 1: FULL PROFILE & EDIT FORM ================= */}
          {(activeTab === 'profile' || isCreating) && (
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* GROUP 1: ĐỊNH DANH & CĂN CƯỚC */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    <span>I. Thông Tin Định Danh & Căn Cước</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">Bắt buộc họ tên và mã hộ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên đầy đủ *</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ho_ten || ''}
                      onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 font-black text-slate-900 uppercase"
                      placeholder="NGUYỄN VĂN A"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Giới tính</label>
                    <select
                      disabled={!isEditing}
                      value={formData.gioi_tinh || 'Nam'}
                      onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 font-bold"
                    >
                      <option value="Nam">Nam (♂)</option>
                      <option value="Nữ">Nữ (♀)</option>
                      <option value="Chưa rõ">Chưa rõ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngày sinh (DD/MM/YYYY)</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ngay_thang_nam_sinh || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        let year = formData.nam_sinh;
                        const parts = val.split('/');
                        if (parts.length === 3 && parts[2].length === 4) {
                          year = parseInt(parts[2]);
                        }
                        setFormData({ 
                          ...formData, 
                          ngay_thang_nam_sinh: val,
                          nam_sinh: year,
                          tuoi: year ? 2026 - year : formData.tuoi
                        });
                      }}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 font-medium"
                      placeholder="22/12/1952"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Năm sinh & Tuổi (Năm 2026)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        disabled={!isEditing}
                        value={formData.nam_sinh || ''}
                        onChange={(e) => {
                          const y = parseInt(e.target.value);
                          setFormData({ ...formData, nam_sinh: y, tuoi: y ? 2026 - y : undefined });
                        }}
                        className="w-1/2 px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 disabled:bg-slate-50 font-mono font-bold"
                        placeholder="1952"
                      />
                      <input
                        type="text"
                        disabled
                        value={formData.tuoi ? `${formData.tuoi} tuổi` : ''}
                        className="w-1/2 px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-bold text-sky-700 text-center"
                        placeholder="Tuổi"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số CCCD (12 số) / CMND (9 số)</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.so_cmnd_cccd || ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        const next = { ...formData, so_cmnd_cccd: val };
                        if (val && (!formData.ngay_cap_cccd || !formData.noi_cap_cccd || !formData.ngay_het_han_cccd)) {
                          const autoMeta = computeCccdDetails(val, formData.nam_sinh, formData.ngay_thang_nam_sinh);
                          next.ngay_cap_cccd = formData.ngay_cap_cccd || autoMeta.ngay_cap_cccd;
                          next.noi_cap_cccd = formData.noi_cap_cccd || autoMeta.noi_cap_cccd;
                          next.ngay_het_han_cccd = formData.ngay_het_han_cccd || autoMeta.ngay_het_han_cccd;
                        }
                        setFormData(next);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 font-mono font-bold text-indigo-700"
                      placeholder="048..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Ngày cấp CCCD/CMND</label>
                      {isEditing && formData.so_cmnd_cccd && (
                        <button
                          type="button"
                          onClick={() => {
                            const autoMeta = computeCccdDetails(formData.so_cmnd_cccd, formData.nam_sinh, formData.ngay_thang_nam_sinh);
                            setFormData({
                              ...formData,
                              ngay_cap_cccd: autoMeta.ngay_cap_cccd,
                              noi_cap_cccd: autoMeta.noi_cap_cccd,
                              ngay_het_han_cccd: autoMeta.ngay_het_han_cccd
                            });
                          }}
                          className="text-[10px] text-sky-600 hover:text-sky-800 font-bold"
                        >
                          Tự động tính
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ngay_cap_cccd || ''}
                      onChange={(e) => setFormData({ ...formData, ngay_cap_cccd: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 font-mono"
                      placeholder="10/05/2021"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nơi cấp CCCD/CMND</label>
                    {isEditing ? (
                      <input
                        type="text"
                        list="noi-cap-list"
                        value={formData.noi_cap_cccd || ''}
                        onChange={(e) => setFormData({ ...formData, noi_cap_cccd: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 font-medium"
                        placeholder="Cục Cảnh sát QLHC về TTXH"
                      />
                    ) : (
                      <input
                        type="text"
                        disabled
                        value={formData.noi_cap_cccd || 'Cục Cảnh sát QLHC về TTXH'}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700"
                      />
                    )}
                    <datalist id="noi-cap-list">
                      <option value="Cục Cảnh sát QLHC về TTXH" />
                      <option value="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư" />
                      <option value="Công an TP Đà Nẵng" />
                      <option value="Công an Tỉnh Quảng Nam - Đà Nẵng" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngày hết hạn CCCD</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ngay_het_han_cccd || ''}
                      onChange={(e) => setFormData({ ...formData, ngay_het_han_cccd: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 font-mono font-medium"
                      placeholder="Không thời hạn (Vô thời hạn) hoặc 01/01/2030"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={formData.dien_thoai || ''}
                        onChange={(e) => setFormData({ ...formData, dien_thoai: e.target.value.trim() })}
                        className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:bg-slate-50 font-mono font-bold"
                        placeholder="0905..."
                      />
                      {formData.dien_thoai && !isEditing && (
                        <a
                          href={`tel:${formData.dien_thoai}`}
                          className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200 shrink-0"
                          title="Gọi điện thoại trực tiếp"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* GROUP 2: HỘ KHẨU & NƠI CƯ TRÚ */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-indigo-600" />
                    <span>II. Sổ Hộ Khẩu & Địa Bàn Cư Trú</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">Tổ Dân Cư Thôn An Trạch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mã Sổ Hộ Khẩu *</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ma_ho || ''}
                      onChange={(e) => setFormData({ ...formData, ma_ho: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-mono font-bold text-indigo-700"
                      placeholder="HK001"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tên Chủ Hộ</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.chu_ho || ''}
                      onChange={(e) => setFormData({ ...formData, chu_ho: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-bold uppercase text-slate-900"
                      placeholder="TÊN CHỦ HỘ"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quan hệ với Chủ hộ</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.quan_he_chu_ho || ''}
                      onChange={(e) => setFormData({ ...formData, quan_he_chu_ho: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-bold text-slate-800"
                      placeholder="Chủ hộ / Vợ / Con / Bố / Mẹ..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tổ Dân Cư</label>
                    <select
                      disabled={!isEditing}
                      value={formData.to_dan_cu || 'Tổ 1'}
                      onChange={(e) => setFormData({ ...formData, to_dan_cu: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-bold"
                    >
                      <option value="Tổ 1">Tổ 1</option>
                      <option value="Tổ 2">Tổ 2</option>
                      <option value="Tổ 3">Tổ 3</option>
                      <option value="Tổ 4">Tổ 4</option>
                      <option value="Tổ 5">Tổ 5</option>
                      <option value="Tổ 6">Tổ 6</option>
                      <option value="Tổ 7">Tổ 7</option>
                      <option value="Tổ 8">Tổ 8</option>
                      <option value="Chưa rõ tổ">Chưa rõ tổ (Chờ xác minh)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái Cư trú</label>
                    <select
                      disabled={!isEditing}
                      value={formData.trang_thai_cu_tru || 'Đang thường trú'}
                      onChange={(e) => setFormData({ ...formData, trang_thai_cu_tru: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-bold"
                    >
                      <option value="Đang thường trú">Đang thường trú</option>
                      <option value="Trẻ mới sinh (Cập nhật sau 2019)">Trẻ mới sinh (Cập nhật sau 2019)</option>
                      <option value="Tạm trú">Tạm trú</option>
                      <option value="Đã chuyển đi / Vắng mặt">Đã chuyển đi / Vắng mặt</option>
                      <option value="Đã mất">Đã mất</option>
                      <option value="Chưa nhập khẩu">Chưa nhập khẩu</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ cư trú chi tiết</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.dia_chi || ''}
                      onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* GROUP 3: THÂN NHÂN & GIA ĐÌNH */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>III. Thông Tin Thân Nhân & Cha Mẹ</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">Phục vụ hồ sơ khai sinh & hộ tịch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên Cha (Bố)</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ho_ten_cha || ''}
                      onChange={(e) => setFormData({ ...formData, ho_ten_cha: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-slate-50 font-bold uppercase text-slate-800"
                      placeholder="NGUYỄN VĂN ..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên Mẹ</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ho_ten_me || ''}
                      onChange={(e) => setFormData({ ...formData, ho_ten_me: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-slate-50 font-bold uppercase text-slate-800"
                      placeholder="LÊ THỊ ..."
                    />
                  </div>
                </div>
              </div>

              {/* GROUP 4: Y TẾ, BHYT & CHÍNH SÁCH XÃ HỘI */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-emerald-600" />
                    <span>IV. Bảo Hiểm Y Tế, Nghề Nghiệp & An Sinh Xã Hội</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold">BHYT & Chế độ chính sách</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mã Thẻ BHYT (15 ký tự)</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ma_the_bhyt || ''}
                      onChange={(e) => setFormData({ ...formData, ma_the_bhyt: e.target.value.toUpperCase().trim() })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 font-mono font-black text-emerald-700"
                      placeholder="GD448..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Đối tượng Chính sách / Y tế</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.doi_tuong_dac_thu || ''}
                      onChange={(e) => setFormData({ ...formData, doi_tuong_dac_thu: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 font-bold text-slate-800"
                      placeholder="Bình thường / Người cao tuổi / Hộ nghèo..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nghề nghiệp hiện tại</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.nghe_nghiep || ''}
                      onChange={(e) => setFormData({ ...formData, nghe_nghiep: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 font-medium"
                      placeholder="Nông dân / Công nhân / Hưu trí..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú nghiệp vụ</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.ghi_chu || ''}
                      onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50 font-medium"
                      placeholder="Ghi chú thêm..."
                    />
                  </div>
                </div>
              </div>

              {/* SAVE / SUBMIT ACTIONS */}
              {isEditing && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                  <div className="text-xs text-slate-500">
                    Bấm <strong>"Lưu Thay Đổi"</strong> để cập nhật thông tin vào cơ sở dữ liệu Supabase.
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isCreating && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
                      >
                        Hủy Chỉnh Sửa
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-black shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Đang Lưu...' : isCreating ? 'Thêm Mới Cư Dân' : 'Lưu Thay Đổi'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ================= TAB 2: FAMILY HOUSEHOLD MEMBERS ================= */}
          {activeTab === 'family' && !isCreating && resident && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>Sổ Hộ Khẩu: {resident.ma_ho} ({familyMembers.length + 1} Nhân Khẩu)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Chủ hộ: <strong>{formData.chu_ho || resident.chu_ho}</strong> • {resident.to_dan_cu}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Current Active Resident Card */}
                <div className="p-4 rounded-2xl bg-indigo-50/80 border-2 border-indigo-500/40 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      <strong className="text-sm font-black text-indigo-950">{resident.ho_ten} (Đang xem)</strong>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                      {resident.quan_he_chu_ho}
                    </span>
                  </div>
                  <div className="text-xs text-indigo-900/80 flex items-center justify-between pt-1 border-t border-indigo-200/50">
                    <span>{resident.gioi_tinh} • {resident.tuoi || 'N/A'} tuổi ({resident.nam_sinh})</span>
                    <span className="font-mono font-bold text-indigo-700">{resident.so_cmnd_cccd || 'Chưa có CCCD'}</span>
                  </div>
                </div>

                {/* Other Family Members */}
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => onSelectOtherResident(member)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">{member.gioi_tinh === 'Nam' ? '♂' : '♀'}</span>
                        <strong className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {member.ho_ten}
                        </strong>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {member.quan_he_chu_ho}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>{member.tuoi || 'N/A'} tuổi ({member.nam_sinh})</span>
                      <span className="text-indigo-600 font-bold flex items-center gap-0.5 text-[11px] group-hover:translate-x-0.5 transition-transform">
                        <span>Xem hồ sơ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: AGRICULTURE & PARCELS ================= */}
          {activeTab === 'agriculture' && !isCreating && resident && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-950">
                      Sản Xuất Nông Nghiệp Vụ Đông Xuân 2025 - 2026
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Cư dân đang đứng tên / canh tác <strong className="font-bold">{residentAgriParcels.length} thửa ruộng</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block">Tổng Diện Tích</span>
                    <strong className="text-xs font-mono text-emerald-900">{totalAgriArea.toLocaleString()} m²</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block">Giống Lúa Cấp</span>
                    <strong className="text-xs font-mono text-emerald-900">{totalAgriSeed.toFixed(2)} kg</strong>
                  </div>
                </div>
              </div>

              {residentAgriParcels.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
                  <Wheat className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">Cư dân này chưa đăng ký thửa ruộng sản xuất vụ mùa hiện tại.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {residentAgriParcels.map((parcel) => (
                    <div
                      key={parcel.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-sm text-slate-900">{parcel.lo_thua_dat}</strong>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            {parcel.xu_dong}
                          </span>
                        </div>
                        <span className="font-mono font-black text-emerald-700 text-sm">
                          {parcel.dien_tich_m2.toLocaleString()} m²
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-600">
                        <span>Giống lúa: <strong className="text-amber-700">{parcel.giong_lua}</strong></span>
                        <span>Giống cấp: <strong className="text-emerald-700">{parcel.giong_cap_kg} kg</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: AUDIT TRAIL ================= */}
          {activeTab === 'audit' && !isCreating && resident && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Nhật Ký & Dữ Liệu Đồng Bộ Hệ Thống</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Nguồn Dữ Liệu Ban Đầu</span>
                  <strong className="text-slate-900 font-medium">{resident.nguon_dong_bo || 'Đồng bộ từ Excel Sổ Hộ Tịch 2019'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Số Thứ Tự Excel Gốc</span>
                  <strong className="text-slate-900 font-mono">STT: {resident.stt_excel || 'N/A'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Thời Gian Tạo Bản Ghi</span>
                  <strong className="text-slate-900 font-mono">{resident.created_at ? new Date(resident.created_at).toLocaleString('vi-VN') : '16/08/2026'}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Cập Nhật Gần Nhất</span>
                  <strong className="text-slate-900 font-mono">{resident.updated_at ? new Date(resident.updated_at).toLocaleString('vi-VN') : 'Hôm nay'}</strong>
                </div>
              </div>

              {/* Danger Zone: Delete Record */}
              {isAllowedToDelete && (
                <div className="pt-4 border-t border-rose-100">
                  {!deleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(true)}
                      className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa Vĩnh Viễn Hồ Sơ Cư Dân Này</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2.5">
                      <p className="text-xs font-black text-rose-900">
                        Xác nhận xóa vĩnh viễn hồ sơ của {resident.ho_ten}? Hành động này không thể hoàn tác và sẽ được ghi vào Audit Log.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer shadow-xs"
                        >
                          Xác Nhận Xóa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(false)}
                          className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Hủy Bỏ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
