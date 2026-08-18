import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  FileText, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Award, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Scale, 
  Shield, 
  UserCheck, 
  Layers, 
  HelpCircle,
  X,
  Save,
  Clock,
  Sparkles,
  MapPin,
  Flame,
  Wifi,
  Stethoscope,
  ChevronDown,
  UserPlus,
  ArrowRight,
  User,
  Check,
  RotateCcw,
  PhoneCall,
  Briefcase,
  GraduationCap,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { VillageOfficer, OfficerDepartment } from '../types';
import { VILLAGE_STRUCTURE_METADATA } from '../data/officerHierarchyData';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

const DEPARTMENT_CONFIG: Record<OfficerDepartment | 'ALL', { 
  label: string; 
  shortLabel: string;
  icon: any; 
  color: string; 
  badge: string; 
  border: string; 
  headerBg: string;
  cardBg: string;
  desc: string 
}> = {
  ALL: { 
    label: 'Toàn Bộ Hệ Thống', 
    shortLabel: 'Tất Cả',
    icon: Building2, 
    color: 'text-slate-900', 
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    border: 'border-slate-200',
    headerBg: 'from-slate-800 to-slate-900',
    cardBg: 'bg-slate-50',
    desc: 'Tổng thể 20 cán bộ và người hoạt động không chuyên trách Thôn An Trạch'
  },
  chi_bo: { 
    label: 'Khối Cấp Ủy & Chi Bộ', 
    shortLabel: 'Cấp Ủy - Chi Bộ',
    icon: Award, 
    color: 'text-red-700', 
    badge: 'bg-red-50 text-red-800 border-red-200 font-extrabold',
    border: 'border-red-300 hover:border-red-500',
    headerBg: 'from-red-600 to-rose-800',
    cardBg: 'bg-red-50/40',
    desc: 'Lãnh đạo toàn diện hệ thống chính trị và định hướng phát triển địa phương'
  },
  ban_nhan_dan: { 
    label: 'Khối Ban Nhân Dân', 
    shortLabel: 'Ban Nhân Dân',
    icon: Building2, 
    color: 'text-sky-700', 
    badge: 'bg-sky-50 text-sky-800 border-sky-200 font-extrabold',
    border: 'border-sky-300 hover:border-sky-500',
    headerBg: 'from-sky-600 to-blue-800',
    cardBg: 'bg-sky-50/40',
    desc: 'Chấp hành chính sách, quản lý 2.308 dân cư và đại diện cộng đồng'
  },
  to_dan_cu: { 
    label: 'Tổ Dân Cư', 
    shortLabel: 'Tổ Dân Cư',
    icon: Users, 
    color: 'text-emerald-700', 
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold',
    border: 'border-emerald-300 hover:border-emerald-500',
    headerBg: 'from-emerald-600 to-teal-800',
    cardBg: 'bg-emerald-50/40',
    desc: 'Cánh tay nối dài trực tiếp quản lý 614 hộ gia đình theo từng cụm dân cư'
  },
  nghiep_vu: { 
    label: 'Khối Nghiệp Vụ', 
    shortLabel: 'Khối Nghiệp Vụ',
    icon: ShieldCheck, 
    color: 'text-amber-700', 
    badge: 'bg-amber-50 text-amber-800 border-amber-200 font-extrabold',
    border: 'border-amber-300 hover:border-amber-500',
    headerBg: 'from-amber-600 to-orange-800',
    cardBg: 'bg-amber-50/40',
    desc: 'Lực lượng ANTT cơ sở (Luật 2024), Y tế thôn bản chăm sóc sức khỏe, Tổ Công nghệ số cộng đồng'
  },
  mat_tran_doan_the: { 
    label: 'Khối Mặt Trận', 
    shortLabel: 'Khối Mặt Trận',
    icon: HeartHandshake, 
    color: 'text-purple-700', 
    badge: 'bg-purple-50 text-purple-800 border-purple-200 font-extrabold',
    border: 'border-purple-300 hover:border-purple-500',
    headerBg: 'from-purple-600 to-indigo-800',
    cardBg: 'bg-purple-50/40',
    desc: 'Đại đoàn kết toàn dân: Mặt trận, Phụ nữ, Thanh niên, Cựu chiến binh, Nông dân, Người cao tuổi'
  },
};

export const CanBoPage: React.FC = () => {
  const { canBoList, addCanBo, updateCanBo, deleteCanBo } = useData();

  const [activeTab, setActiveTab] = useState<'chart' | 'directory' | 'legal'>('chart');
  const [selectedDept, setSelectedDept] = useState<OfficerDepartment | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected officer for modal detail view
  const [selectedOfficer, setSelectedOfficer] = useState<VillageOfficer | null>(null);

  // Edit / Add modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<VillageOfficer | null>(null);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDept, setFormDept] = useState<OfficerDepartment>('to_dan_cu');
  const [formTo, setFormTo] = useState('Tổ 1');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formEdu, setFormEdu] = useState('');
  const [formBirthYear, setFormBirthYear] = useState<number>(1975);
  const [formAppointDate, setFormAppointDate] = useState<string>('2023');
  const [formMission, setFormMission] = useState('');
  const [formAuthority, setFormAuthority] = useState('');
  const [formLegal, setFormLegal] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formHouseholds, setFormHouseholds] = useState<number>(80);
  const [formResidents, setFormResidents] = useState<number>(300);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filteredOfficers = canBoList.filter((officer) => {
    if (selectedDept !== 'ALL' && officer.khoi !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = officer.ho_ten.toLowerCase().includes(q) ||
                    officer.chuc_vu.toLowerCase().includes(q) ||
                    officer.to_phu_trach.toLowerCase().includes(q) ||
                    officer.so_dien_thoai.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingOfficer(null);
    setFormName('');
    setFormRole('Tổ Trưởng Dân Cư');
    setFormDept('to_dan_cu');
    setFormTo('Tổ 1');
    setFormPhone('');
    setFormEmail('');
    setFormEdu('Đại học / Cao đẳng');
    setFormBirthYear(1975);
    setFormAppointDate('2023');
    setFormMission('Quản lý nhân khẩu, hộ khẩu và an sinh xã hội trên địa bàn được phân công.');
    setFormAuthority('Xác nhận thông tin cư trú và tham gia các kỳ họp Ban thôn.');
    setFormLegal('Nghị định số 33/2023/NĐ-CP của Chính phủ.');
    setFormAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
    setFormHouseholds(80);
    setFormResidents(300);
    setSaveSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (officer: VillageOfficer) => {
    setEditingOfficer(officer);
    setFormName(officer.ho_ten);
    setFormRole(officer.chuc_vu);
    setFormDept(officer.khoi);
    setFormTo(officer.to_phu_trach);
    setFormPhone(officer.so_dien_thoai);
    setFormEmail(officer.email);
    setFormEdu(officer.trinh_do || 'Chuyên môn nghiệp vụ');
    setFormBirthYear(officer.nam_sinh || 1975);
    setFormAppointDate(officer.ngay_bo_nhiem || '2023');
    setFormMission(officer.nhiem_vu_chinh);
    setFormAuthority(officer.quyen_han);
    setFormLegal(officer.can_cu_phap_ly);
    setFormAvatar(officer.avatar_url);
    setFormHouseholds(officer.so_ho_phu_trach || 0);
    setFormResidents(officer.so_dan_phu_trach || 0);
    setSaveSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSaveOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim()) {
      alert('Vui lòng nhập đầy đủ Họ tên và Chức vụ cán bộ!');
      return;
    }

    try {
      if (editingOfficer) {
        await updateCanBo(editingOfficer.id, {
          ho_ten: formName.trim().toUpperCase(),
          chuc_vu: formRole.trim(),
          khoi: formDept,
          to_phu_trach: formTo,
          so_dien_thoai: formPhone.trim(),
          email: formEmail.trim(),
          trinh_do: formEdu.trim(),
          nam_sinh: Number(formBirthYear) || undefined,
          ngay_bo_nhiem: formAppointDate.trim(),
          nhiem_vu_chinh: formMission.trim(),
          quyen_han: formAuthority.trim(),
          can_cu_phap_ly: formLegal.trim(),
          avatar_url: formAvatar.trim() || editingOfficer.avatar_url,
          so_ho_phu_trach: Number(formHouseholds) || 0,
          so_dan_phu_trach: Number(formResidents) || 0,
        });

        if (selectedOfficer?.id === editingOfficer.id) {
          setSelectedOfficer({
            ...selectedOfficer,
            ho_ten: formName.trim().toUpperCase(),
            chuc_vu: formRole.trim(),
            khoi: formDept,
            to_phu_trach: formTo,
            so_dien_thoai: formPhone.trim(),
            email: formEmail.trim(),
            trinh_do: formEdu.trim(),
            nam_sinh: Number(formBirthYear) || undefined,
            ngay_bo_nhiem: formAppointDate.trim(),
            nhiem_vu_chinh: formMission.trim(),
            quyen_han: formAuthority.trim(),
            can_cu_phap_ly: formLegal.trim(),
            avatar_url: formAvatar.trim() || editingOfficer.avatar_url,
            so_ho_phu_trach: Number(formHouseholds) || 0,
            so_dan_phu_trach: Number(formResidents) || 0,
          });
        }
      } else {
        await addCanBo({
          ho_ten: formName.trim().toUpperCase(),
          chuc_vu: formRole.trim(),
          khoi: formDept,
          to_phu_trach: formTo,
          so_dien_thoai: formPhone.trim(),
          email: formEmail.trim(),
          trinh_do: formEdu.trim(),
          nam_sinh: Number(formBirthYear) || undefined,
          ngay_bo_nhiem: formAppointDate.trim() || new Date().getFullYear().toString(),
          nhiem_vu_chinh: formMission.trim(),
          quyen_han: formAuthority.trim(),
          can_cu_phap_ly: formLegal.trim(),
          avatar_url: formAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          trang_thai: 'active',
          so_ho_phu_trach: Number(formHouseholds) || 0,
          so_dan_phu_trach: Number(formResidents) || 0,
        });
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 600);
    } catch (err: any) {
      alert('Lỗi khi lưu thông tin cán bộ: ' + (err.message || 'Thao tác không thành công'));
    }
  };

  const handleDeleteOfficer = async (officer: VillageOfficer) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cán bộ "${officer.ho_ten}" (${officer.chuc_vu}) khỏi danh bạ bộ máy?`)) {
      await deleteCanBo(officer.id);
      if (selectedOfficer?.id === officer.id) {
        setSelectedOfficer(null);
      }
    }
  };

  // Group officers by departments
  const chiBoList = canBoList.filter((o) => o.khoi === 'chi_bo');
  const banNhanDanList = canBoList.filter((o) => o.khoi === 'ban_nhan_dan');
  const toDanCuList = canBoList.filter((o) => o.khoi === 'to_dan_cu');
  const nghiepVuList = canBoList.filter((o) => o.khoi === 'nghiep_vu');
  const matTranList = canBoList.filter((o) => o.khoi === 'mat_tran_doan_the');

  return (
    <div className="space-y-5 pb-16">
      {/* Master Top Header Banner Standardized */}
      <PageHeaderBanner
        icon={<ShieldCheck className="w-6 h-6 text-white" />}
        iconBgClass="from-red-600 via-rose-600 to-amber-600 text-white shadow-red-500/25"
        badge={{
          text: 'Hệ Thống Chính Trị & Bộ Máy Cơ Sở',
          icon: <Building2 className="w-3.5 h-3.5 text-red-300" />,
          colorClass: 'bg-red-500/20 text-red-200 border-red-400/30'
        }}
        subBadge={{
          text: `Cơ Cấu 2026 • ${canBoList.length} Cán Bộ`,
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
          colorClass: 'bg-amber-500/15 text-amber-200 border-amber-400/25'
        }}
        title="Bộ Máy Điều Hành & Cán Bộ Thôn An Trạch"
        description="Quản lý toàn diện hệ thống chính trị cơ sở: Chi bộ Đảng, Ban Nhân dân thôn, 8 Tổ Dân Cư, Khối Nghiệp vụ & Khối Mặt trận Đoàn thể."
        theme="dark"
        actions={
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-300 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-slate-950" />
            <span>Bổ Nhiệm Cán Bộ Mới</span>
          </button>
        }
      />

      {/* 4 Summary Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Tổng Nhân Sự */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tổng Cán Bộ</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              {canBoList.length} <span className="text-xs font-bold text-slate-500">Cán Bộ</span>
            </div>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">Chi bộ, Ban thôn, 8 Tổ</p>
          </div>
        </div>

        {/* Card 2: Tổ Dân Cư */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tổ Dân Cư</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              {VILLAGE_STRUCTURE_METADATA.totalUnits} <span className="text-xs font-bold text-slate-500">Tổ Dân Cư</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">{VILLAGE_STRUCTURE_METADATA.totalHouseholds} Hộ Gia Đình</p>
          </div>
        </div>

        {/* Card 3: Dân Số Phụ Trách */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Dân Số Toàn Thôn</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              {VILLAGE_STRUCTURE_METADATA.totalResidents.toLocaleString('vi-VN')} <span className="text-xs font-bold text-slate-500">Người</span>
            </div>
            <p className="text-[11px] text-sky-700 font-bold mt-0.5">100% Số Hóa Hồ Sơ</p>
          </div>
        </div>

        {/* Card 4: Các Khối Bộ Máy */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Khối Chức Năng</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              5 <span className="text-xs font-bold text-slate-500">Khối Cơ Sở</span>
            </div>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5 truncate">Chi Bộ • Ban Thôn • 8 Tổ • NV • MT</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('chart')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'chart' 
              ? 'bg-slate-900 text-white shadow-xs font-black' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>1. Sơ Đồ Bộ Máy Cơ Sở</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'directory' 
              ? 'bg-slate-900 text-white shadow-xs font-black' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>2. Danh Bạ Cán Bộ ({canBoList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('legal')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'legal' 
              ? 'bg-slate-900 text-white shadow-xs font-black' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>3. Quy Định Chức Năng & Pháp Lý</span>
        </button>
      </div>

      {/* ================= TAB 1: VISUAL HIERARCHY TREE ================= */}
      {activeTab === 'chart' && (
        <div className="space-y-6">
          {/* Top Tier: Chi Bộ & Ban Nhân Dân */}
          <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-200 inline-block shadow-2xs">
                TẦNG 1: LÃNH ĐẠO TOÀN DIỆN & QUẢN TRỊ TRUNG TÂM
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Chi Bộ Thôn An Trạch & Ban Nhân Dân Thôn
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {/* Box 1: Chi Bộ Thôn */}
              <div className="p-4 sm:p-5 rounded-2xl bg-red-50/30 border-2 border-red-200 shadow-2xs space-y-3.5 hover:border-red-400 transition-all">
                <div className="flex items-center justify-between pb-2.5 border-b border-red-100">
                  <div className="flex items-center gap-2 text-red-800 font-black text-xs uppercase">
                    <Award className="w-4 h-4 text-red-600" />
                    <span>Cấp Ủy - Chi Bộ Thôn</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-extrabold">{chiBoList.length} Lãnh đạo</span>
                </div>

                <div className="space-y-2.5">
                  {chiBoList.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-white hover:bg-red-50/80 border border-red-100 hover:border-red-300 transition-all flex items-center justify-between gap-3 shadow-2xs group"
                    >
                      <div 
                        onClick={() => setSelectedOfficer(o)}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      >
                        <img src={o.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-black text-xs text-slate-900 group-hover:text-red-700 truncate">{o.ho_ten}</div>
                          <div className="text-[11px] text-slate-500 font-bold truncate">{o.chuc_vu}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(o)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1 border border-amber-200 cursor-pointer"
                          title="Sửa thông tin cán bộ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Sửa</span>
                        </button>

                        <button
                          onClick={() => setSelectedOfficer(o)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Ban Nhân Dân Thôn */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/30 border-2 border-sky-200 shadow-2xs space-y-3.5 hover:border-sky-400 transition-all">
                <div className="flex items-center justify-between pb-2.5 border-b border-sky-100">
                  <div className="flex items-center gap-2 text-sky-800 font-black text-xs uppercase">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span>Ban Nhân Dân Thôn</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold">{banNhanDanList.length} Cán bộ</span>
                </div>

                <div className="space-y-2.5">
                  {banNhanDanList.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-white hover:bg-sky-50/80 border border-sky-100 hover:border-sky-300 transition-all flex items-center justify-between gap-3 shadow-2xs group"
                    >
                      <div 
                        onClick={() => setSelectedOfficer(o)}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                      >
                        <img src={o.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-black text-xs text-slate-900 group-hover:text-sky-700 truncate">{o.ho_ten}</div>
                          <div className="text-[11px] text-slate-500 font-bold truncate">{o.chuc_vu}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(o)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1 border border-amber-200 cursor-pointer"
                          title="Sửa thông tin cán bộ"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Sửa</span>
                        </button>

                        <button
                          onClick={() => setSelectedOfficer(o)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tier 2: 3 Specialized Wings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Wing 1: Tổ Dân Cư */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border-t-4 border-t-emerald-500 border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Tổ Dân Cư (8 Tổ Trưởng)</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">614 Hộ</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {toDanCuList.map((o) => (
                    <div
                      key={o.id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-xs group"
                    >
                      <div 
                        onClick={() => setSelectedOfficer(o)}
                        className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                      >
                        <img src={o.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 truncate group-hover:text-emerald-700">{o.ho_ten}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{o.to_phu_trach} • {o.so_ho_phu_trach} hộ</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenEditModal(o)}
                        className="p-1 rounded-lg hover:bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5 shrink-0"
                        title="Sửa thông tin"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wing 2: Khối Nghiệp Vụ */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border-t-4 border-t-amber-500 border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Khối Nghiệp Vụ (ANTT, Y Tế)</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold">{nghiepVuList.length} Cán bộ</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {nghiepVuList.map((o) => (
                    <div
                      key={o.id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between text-xs group"
                    >
                      <div 
                        onClick={() => setSelectedOfficer(o)}
                        className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                      >
                        <img src={o.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 group-hover:text-amber-700 truncate">{o.ho_ten}</div>
                          <div className="text-[10px] text-slate-500 truncate">{o.chuc_vu}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenEditModal(o)}
                        className="p-1 rounded-lg hover:bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5 shrink-0"
                        title="Sửa thông tin"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Wing 3: Khối Mặt Trận */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border-t-4 border-t-purple-500 border border-slate-200 shadow-2xs space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-purple-800 font-black text-xs uppercase">
                    <HeartHandshake className="w-4 h-4 text-purple-600" />
                    <span>Khối Mặt Trận & 5 Đoàn Thể</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold">{matTranList.length} Chi hội</span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {matTranList.map((o) => (
                    <div
                      key={o.id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 transition-all flex items-center justify-between text-xs group"
                    >
                      <div 
                        onClick={() => setSelectedOfficer(o)}
                        className="flex items-center gap-2 min-w-0 cursor-pointer flex-1"
                      >
                        <img src={o.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 truncate group-hover:text-purple-700">{o.ho_ten}</div>
                          <div className="text-[10px] text-slate-500 truncate">{o.chuc_vu}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenEditModal(o)}
                        className="p-1 rounded-lg hover:bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-0.5 shrink-0"
                        title="Sửa thông tin"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 2: OFFICERS DIRECTORY & PROFILE CARDS ================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between text-xs">
              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm họ tên, chức vụ, SĐT, tổ..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-sky-500"
                />
              </div>

              {/* Department Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0 text-xs">
                {(Object.keys(DEPARTMENT_CONFIG) as Array<OfficerDepartment | 'ALL'>).map((key) => {
                  const meta = DEPARTMENT_CONFIG[key];
                  const count = key === 'ALL' ? canBoList.length : canBoList.filter((o) => o.khoi === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDept(key)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        selectedDept === key
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>{meta.shortLabel}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${selectedDept === key ? 'bg-slate-800 text-sky-400 font-bold' : 'bg-white text-slate-500 border border-slate-200'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Officers Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredOfficers.map((o) => {
              const dept = DEPARTMENT_CONFIG[o.khoi] || DEPARTMENT_CONFIG.to_dan_cu;
              return (
                <div
                  key={o.id}
                  className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 hover:border-sky-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs group"
                >
                  <div className="space-y-3">
                    {/* Header Row: Avatar & Actions */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={o.avatar_url}
                            alt=""
                            className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-xs group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-sky-600 transition-colors truncate" title={o.ho_ten}>
                            {o.ho_ten}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-black inline-block mt-0.5 truncate max-w-full ${dept.badge}`} title={o.chuc_vu}>
                            {o.chuc_vu}
                          </span>
                        </div>
                      </div>

                      {/* Quick Edit Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(o);
                        }}
                        className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        title="Chỉnh sửa toàn bộ hồ sơ cán bộ"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                    </div>

                    {/* Metadata Table */}
                    <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Địa bàn:</span>
                        <strong className="text-slate-800 font-bold truncate">{o.to_phu_trach}</strong>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Trình độ:</span>
                        <span className="text-slate-700 font-medium truncate">{o.trinh_do || 'Chuyên môn'}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Quy mô:</span>
                        {o.so_ho_phu_trach && o.so_ho_phu_trach > 0 ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                            {o.so_ho_phu_trach} hộ • {o.so_dan_phu_trach} dân
                          </span>
                        ) : (
                          <span className="text-sky-700 font-bold bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200 text-[10px]">
                            Toàn Thôn
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mission Quote */}
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 min-h-[38px] flex items-center">
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {o.nhiem_vu_chinh}
                      </p>
                    </div>
                  </div>

                  {/* Footer Actions: Phone + Details Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs mt-1">
                    <a
                      href={`tel:${o.so_dien_thoai.replace(/\s/g, '')}`}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold flex items-center gap-1.5 transition-colors text-[11px] truncate font-mono"
                      title="Bấm để gọi ngay"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{o.so_dien_thoai}</span>
                    </a>

                    <button
                      onClick={() => setSelectedOfficer(o)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all text-xs cursor-pointer shrink-0"
                    >
                      <span>Chi Tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: LEGAL FRAMEWORK & MANDATES ================= */}
      {activeTab === 'legal' && (
        <div className="space-y-4">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Căn Cứ Pháp Lý & Quy Định Chức Năng Cấp Thôn
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Hệ thống văn bản pháp luật điều chỉnh tổ chức, hoạt động và chế độ đối với cán bộ thôn
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {VILLAGE_STRUCTURE_METADATA.legalBasis.map((law, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    0{idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-slate-900 text-xs">{law}</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Quy định quyền hạn, trách nhiệm giải trình, chế độ phụ cấp và mô hình tự quản của cộng đồng dân cư thôn.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICER DETAIL MODAL ================= */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border ${DEPARTMENT_CONFIG[selectedOfficer.khoi]?.badge || DEPARTMENT_CONFIG.to_dan_cu.badge}`}>
                  {DEPARTMENT_CONFIG[selectedOfficer.khoi]?.label || 'Tổ Dân Cư'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {selectedOfficer.to_phu_trach}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const officerToEdit = selectedOfficer;
                    setSelectedOfficer(null);
                    handleOpenEditModal(officerToEdit);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh Sửa Full</span>
                </button>

                <button
                  onClick={() => setSelectedOfficer(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Header profile info */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={selectedOfficer.avatar_url}
                  alt=""
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-slate-200 shadow-md shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">{selectedOfficer.ho_ten}</h3>
                  <div className="text-xs font-bold text-sky-700">{selectedOfficer.chuc_vu}</div>
                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px] pt-1">
                    <span>Năm sinh: {selectedOfficer.nam_sinh || 1975}</span>
                    <span>•</span>
                    <span>Bổ nhiệm: {selectedOfficer.ngay_bo_nhiem || '2023'}</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`tel:${selectedOfficer.so_dien_thoai.replace(/\s/g, '')}`}
                  className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2.5 font-mono"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Điện thoại: {selectedOfficer.so_dien_thoai}</span>
                </a>
                <a
                  href={`mailto:${selectedOfficer.email}`}
                  className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 font-bold flex items-center gap-2.5 font-mono text-[11px] truncate"
                >
                  <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="truncate">{selectedOfficer.email}</span>
                </a>
              </div>

              {/* Detail Boxes */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-900 block text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    Chức Năng & Nhiệm Vụ Cốt Lõi:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">{selectedOfficer.nhiem_vu_chinh}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-900 block text-xs flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" />
                    Quyền Hạn & Trách Nhiệm Được Giao:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">{selectedOfficer.quyen_han}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-extrabold text-slate-900 block text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    Căn Cứ Pháp Lý Điều Chỉnh:
                  </span>
                  <p className="text-slate-700 leading-relaxed font-mono text-[11px]">{selectedOfficer.can_cu_phap_ly}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleDeleteOfficer(selectedOfficer)}
                  className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Cán Bộ Này</span>
                </button>

                <button
                  onClick={() => setSelectedOfficer(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
                >
                  Đóng Hộp Thoại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT OFFICER FULL THÔNG TIN ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-black text-base">
                  {editingOfficer ? 'Chỉnh Sửa Full Hồ Sơ Cán Bộ' : 'Thêm Cán Bộ / Bổ Nhiệm Mới'}
                </h3>
                <p className="text-xs text-sky-200/80 font-medium">
                  Cập nhật đầy đủ thông tin nhân sự và quyền hạn vào cơ sở dữ liệu Supabase
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOfficer} className="p-6 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
              
              {saveSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Đã lưu và đồng bộ toàn bộ hồ sơ cán bộ thành công!</span>
                </div>
              )}

              {/* Group 1: Thông tin nhân sự */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-900 uppercase text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>I. Thông Tin Cá Nhân & Chức Vụ</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ và tên cán bộ *</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value.toUpperCase())}
                      placeholder="VD: NGUYỄN VĂN A..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-black text-slate-900 uppercase focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chức danh / Chức vụ cụ thể *</label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="VD: Tổ Trưởng Tổ 1 / Bí thư Chi bộ..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Khối bộ máy *</label>
                    <select
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value as OfficerDepartment)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="chi_bo">1. Khối Cấp Ủy & Chi Bộ</option>
                      <option value="ban_nhan_dan">2. Khối Ban Nhân Dân</option>
                      <option value="to_dan_cu">3. Tổ Dân Cư</option>
                      <option value="nghiep_vu">4. Khối Nghiệp Vụ (ANTT, Y Tế, CNS)</option>
                      <option value="mat_tran_doan_the">5. Khối Mặt Trận & 5 Đoàn Thể</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Địa bàn / Tổ phụ trách *</label>
                    <input
                      type="text"
                      value={formTo}
                      onChange={(e) => setFormTo(e.target.value)}
                      placeholder="VD: Tổ 1 / Toàn thôn..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Năm sinh</label>
                    <input
                      type="number"
                      value={formBirthYear}
                      onChange={(e) => setFormBirthYear(parseInt(e.target.value))}
                      placeholder="1975"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Trình độ chuyên môn</label>
                    <input
                      type="text"
                      value={formEdu}
                      onChange={(e) => setFormEdu(e.target.value)}
                      placeholder="Đại học / Trung cấp..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Liên hệ & Quy mô */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-900 uppercase text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>II. Liên Lạc & Quy Mô Phụ Trách</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="0905..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email công vụ</label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="canbo@antrach.danang.gov.vn"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số hộ gia đình phụ trách</label>
                    <input
                      type="number"
                      value={formHouseholds}
                      onChange={(e) => setFormHouseholds(parseInt(e.target.value))}
                      placeholder="80"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số nhân khẩu phụ trách</label>
                    <input
                      type="number"
                      value={formResidents}
                      onChange={(e) => setFormResidents(parseInt(e.target.value))}
                      placeholder="300"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-mono font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">URL ảnh đại diện (Avatar)</label>
                    <input
                      type="url"
                      value={formAvatar}
                      onChange={(e) => setFormAvatar(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Nhiệm vụ & Pháp lý */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-black text-slate-900 uppercase text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <Scale className="w-3.5 h-3.5 text-purple-600" />
                  <span>III. Nhiệm Vụ, Thẩm Quyền & Căn Cứ Pháp Lý</span>
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nhiệm vụ chính *</label>
                  <textarea
                    value={formMission}
                    onChange={(e) => setFormMission(e.target.value)}
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 leading-relaxed font-medium"
                    placeholder="Mô tả chức năng nhiệm vụ..."
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quyền hạn được giao</label>
                  <input
                    type="text"
                    value={formAuthority}
                    onChange={(e) => setFormAuthority(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 focus:bg-white border border-slate-200"
                    placeholder="Thẩm quyền giải quyết..."
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Căn cứ pháp lý bổ nhiệm</label>
                  <input
                    type="text"
                    value={formLegal}
                    onChange={(e) => setFormLegal(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 focus:bg-white border border-slate-200 font-mono text-[11px]"
                    placeholder="Nghị định 33/2023/NĐ-CP..."
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200/60 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-black shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingOfficer ? 'Lưu Thay Đổi' : 'Bổ Nhiệm Cán Bộ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
