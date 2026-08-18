import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Droplets, 
  Layers, 
  Users, 
  MapPin, 
  Wheat, 
  Scale, 
  ChevronRight, 
  X, 
  FileSpreadsheet, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Info,
  Clock,
  Phone,
  RefreshCw,
  Award,
  Building2,
  Handshake,
  Map as MapIcon,
  Compass,
  Check,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  FileCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { SanXuatRecord, GiongLuaType, DotPhanBoType, NhanKhau, XuDongMeta } from '../types';
import { SanXuatExcelModal } from '../components/SanXuatExcelModal';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

export const normalizeXuDong = (name?: string): string => {
  if (!name) return 'Tổ 9';
  const n = name.toLowerCase().trim();
  if (n.includes('tổ 9') || n.includes('to 9') || n === 'tổ 9') return 'Tổ 9';
  if (n.includes('hà ra') || n.includes('ha ra') || n === 'hà ra') return 'Hà Ra';
  if (n.includes('la châu') || n.includes('la chau') || n === 'la châu') return 'La Châu';
  if (n.includes('la bông') || n.includes('la bong') || n.includes('lb tây') || n.includes('lb tay')) return 'La Bông Tây';
  if (n.includes('gò') || n.includes('ổi') || n.includes('oi') || n.includes('go oi')) return 'Gò Ổi';
  return name;
};

interface NongNghiepPageProps {
  onSelectResident?: (resident: NhanKhau) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const NongNghiepPage: React.FC<NongNghiepPageProps> = ({
  onSelectResident,
  onNavigateToTab,
}) => {
  const { 
    sanXuatList, 
    giongLuaList, 
    xuDongList,
    lichThoiVuList, 
    addSanXuatRecord, 
    updateSanXuatRecord, 
    deleteSanXuatRecord,
    resetSanXuatToSeed,
    nhanKhauList,
    hoKhauList
  } = useData();

  const { isAdmin } = useAuth();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'directory' | 'map_xu_dong' | 'varieties' | 'timeline' | 'irrigation' | 'export'>('directory');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedXuDong, setSelectedXuDong] = useState<string>('ALL');
  const [selectedVariety, setSelectedVariety] = useState<string>('ALL');
  const [selectedOwnership, setSelectedOwnership] = useState<string>('ALL'); // 'ALL' | 'CHINH_CHU' | 'THUE_MUON'
  const [selectedTo, setSelectedTo] = useState<string>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SanXuatRecord | null>(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // Form State
  const [formChuDat, setFormChuDat] = useState('');
  const [formHoSanXuat, setFormHoSanXuat] = useState('');
  const [formXuDong, setFormXuDong] = useState('Tổ 9');
  const [formLoThua, setFormLoThua] = useState('Lô 1');
  const [formDienTich, setFormDienTich] = useState<number>(500);
  const [formDot, setFormDot] = useState<string>('HG12-T9');
  const [formGiong, setFormGiong] = useState<string>('HG12');
  const [formTo, setFormTo] = useState<string>('Tổ 1');
  const [formMuaThem, setFormMuaThem] = useState<number>(0);
  const [formDonGia, setFormDonGia] = useState<number>(18000);
  const [formKyNhan, setFormKyNhan] = useState<string>('Đã nhận giống');
  const [formGhiChu, setFormGhiChu] = useState<string>('');

  // Total Summary Stats
  const totalAreaM2 = useMemo(() => {
    return (sanXuatList || []).reduce((sum, r) => sum + (Number(r?.dien_tich_m2) || 0), 0);
  }, [sanXuatList]);

  const totalSeedKg = useMemo(() => {
    return (sanXuatList || []).reduce((sum, r) => sum + (Number(r?.giong_cap_kg) || 0), 0);
  }, [sanXuatList]);

  const uniqueFarmersCount = useMemo(() => {
    const set = new Set<string>();
    (sanXuatList || []).forEach((r) => {
      if (r?.chu_dat) set.add(String(r.chu_dat).trim().toUpperCase());
      if (r?.ho_san_xuat) set.add(String(r.ho_san_xuat).trim().toUpperCase());
    });
    return set.size;
  }, [sanXuatList]);

  const chinhChuCount = useMemo(() => {
    return (sanXuatList || []).filter((r) => r?.la_chinh_chu !== false).length;
  }, [sanXuatList]);

  const thueMuonCount = useMemo(() => {
    return (sanXuatList || []).filter((r) => r?.la_chinh_chu === false).length;
  }, [sanXuatList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return (sanXuatList || []).filter((item) => {
      if (!item) return false;
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const chuDat = String(item.chu_dat || '').toLowerCase();
        const hoSanXuat = String(item.ho_san_xuat || '').toLowerCase();
        const loThua = String(item.lo_thua_dat || '').toLowerCase();
        const xuDong = String(item.xu_dong || '').toLowerCase();
        const giong = String(item.giong_lua || '').toLowerCase();
        const to = String(item.to_dan_cu || '').toLowerCase();

        const match = 
          chuDat.includes(q) ||
          hoSanXuat.includes(q) ||
          loThua.includes(q) ||
          xuDong.includes(q) ||
          giong.includes(q) ||
          to.includes(q);
        if (!match) return false;
      }

      if (selectedXuDong !== 'ALL' && normalizeXuDong(item.xu_dong) !== normalizeXuDong(selectedXuDong)) return false;
      if (selectedVariety !== 'ALL' && item.giong_lua !== selectedVariety) return false;
      if (selectedOwnership === 'CHINH_CHU' && item.la_chinh_chu === false) return false;
      if (selectedOwnership === 'THUE_MUON' && item.la_chinh_chu !== false) return false;
      if (selectedTo !== 'ALL' && item.to_dan_cu !== selectedTo) return false;

      return true;
    });
  }, [sanXuatList, searchQuery, selectedXuDong, selectedVariety, selectedOwnership, selectedTo]);

  // Paginated List
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return (filteredList || []).slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil((filteredList || []).length / itemsPerPage) || 1;

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormChuDat('');
    setFormHoSanXuat('');
    setFormXuDong('Tổ 9');
    setFormLoThua('Lô 1');
    setFormDienTich(500);
    setFormDot('HG12-T9');
    setFormGiong('HG12');
    setFormTo('Tổ 1');
    setFormMuaThem(0);
    setFormDonGia(18000);
    setFormKyNhan('Đã nhận giống');
    setFormGhiChu('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (rec: SanXuatRecord) => {
    setEditingRecord(rec);
    setFormChuDat(rec.chu_dat);
    setFormHoSanXuat(rec.ho_san_xuat);
    setFormXuDong(rec.xu_dong || 'Tổ 9');
    setFormLoThua(rec.lo_thua_dat);
    setFormDienTich(rec.dien_tich_m2);
    setFormDot(rec.dot_phan_bo);
    setFormGiong(rec.giong_lua);
    setFormTo(rec.to_dan_cu || 'Tổ 1');
    setFormMuaThem(rec.mua_them_kg || 0);
    setFormDonGia(rec.don_gia || 18000);
    setFormKyNhan(String(rec.ky_nhan || 'Đã nhận giống'));
    setFormGhiChu(rec.ghi_chu || '');
    setIsModalOpen(true);
  };

  // Save Record (Add or Update)
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formChuDat.trim() || formDienTich <= 0) {
      alert('Vui lòng nhập tên chủ đất và diện tích hợp lệ!');
      return;
    }

    const giongCap = Number((formDienTich * 0.012).toFixed(2));
    const thanhTien = (Number(formMuaThem) || 0) * (Number(formDonGia) || 0);
    const hoSX = formHoSanXuat.trim() || formChuDat.trim();
    const laChinhChu = formChuDat.trim().toLowerCase() === hoSX.toLowerCase();

    if (editingRecord) {
      await updateSanXuatRecord(editingRecord.id, {
        chu_dat: formChuDat.trim(),
        ho_san_xuat: hoSX,
        la_chinh_chu: laChinhChu,
        xu_dong: formXuDong.trim(),
        lo_thua_dat: formLoThua.trim(),
        dien_tich_m2: Number(formDienTich),
        giong_cap_kg: giongCap,
        dot_phan_bo: formDot,
        giong_lua: formGiong,
        to_dan_cu: formTo,
        mua_them_kg: Number(formMuaThem) || 0,
        don_gia: Number(formDonGia) || 0,
        thanh_tien: thanhTien,
        ky_nhan: formKyNhan.trim(),
        ghi_chu: formGhiChu.trim(),
      });
    } else {
      await addSanXuatRecord({
        stt: sanXuatList.length + 1,
        chu_dat: formChuDat.trim(),
        ho_san_xuat: hoSX,
        la_chinh_chu: laChinhChu,
        xu_dong: formXuDong.trim(),
        lo_thua_dat: formLoThua.trim(),
        dien_tich_m2: Number(formDienTich),
        giong_cap_kg: giongCap,
        dot_phan_bo: formDot,
        giong_lua: formGiong,
        to_dan_cu: formTo,
        mua_them_kg: Number(formMuaThem) || 0,
        don_gia: Number(formDonGia) || 0,
        thanh_tien: thanhTien,
        ky_nhan: formKyNhan.trim(),
        ghi_chu: formGhiChu.trim(),
        trang_thai_canh_tac: 'chuan_bi_dat',
      });
    }

    setIsModalOpen(false);
  };

  // Delete Record
  const handleDeleteRecord = async (rec: SanXuatRecord) => {
    if (window.confirm(`Bạn có chắc muốn xóa bản ghi thửa "${rec.lo_thua_dat}" (Xứ đồng ${rec.xu_dong}) của chủ đất "${rec.chu_dat}"?`)) {
      await deleteSanXuatRecord(rec.id);
    }
  };

  // Find Resident Details by Name
  const handleViewResidentByName = (name: string) => {
    if (!name) return;
    const cleanName = name.trim().toUpperCase();
    const found = nhanKhauList.find((r) => r.ho_ten.toUpperCase() === cleanName);
    if (found && onSelectResident) {
      onSelectResident(found);
    } else {
      alert(`Không tìm thấy hồ sơ định danh "${name}" trong danh bạ 2.308 cư dân thôn An Trạch. (Có thể là chủ đất cũ hoặc người dân từ thôn khác canh tác liên vùng).`);
    }
  };

  // Export Master Excel
  const handleExportExcel = () => {
    const rows = sanXuatList.map((r, idx) => ({
      'STT': idx + 1,
      'Xứ Đồng': r.xu_dong || 'Tổ 9',
      'Lô / Thửa Đất': r.lo_thua_dat,
      'Chủ Đất (QSDĐ)': r.chu_dat,
      'Hộ Canh Tác': r.ho_san_xuat,
      'Hiện Trạng': r.la_chinh_chu !== false ? 'Chính chủ' : 'Thuê/Mượn',
      'Giống Lúa': r.giong_lua,
      'Diện Tích (m2)': r.dien_tich_m2,
      'Giống Cấp (kg)': r.giong_cap_kg,
      'Mua Thêm (kg)': r.mua_them_kg || 0,
      'Đơn Giá (đ)': r.don_gia || 0,
      'Thành Tiền (đ)': r.thanh_tien || 0,
      'Ký Nhận HTX': r.ky_nhan || 'Đã nhận giống',
      'Tổ Dân Cư': r.to_dan_cu || 'Tổ 1',
      'Đợt Phân Bổ': r.dot_phan_bo,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SoBo_SanXuat_DX2526');
    XLSX.writeFile(wb, 'SoBo_SanXuat_NongNghiep_AnTrach_DX2526.xlsx');
  };

  // Helper for Xứ đồng badge styling
  const getXuDongBadgeStyle = (xuDongName: string) => {
    const norm = normalizeXuDong(xuDongName);
    switch (norm) {
      case 'Tổ 9':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Hà Ra':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'La Châu':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'La Bông Tây':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Gò Ổi':
        return 'bg-pink-50 text-pink-800 border-pink-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300 pb-10">
      
      {/* ================= HERO EXECUTIVE BANNER ================= */}
      <PageHeaderBanner
        icon={<Wheat className="w-6 h-6 text-white" />}
        iconBgClass="from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-500/25"
        badge={{
          text: 'Vụ Đông Xuân 2025 - 2026',
          icon: <Sprout className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />,
          colorClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
        }}
        subBadge={{
          text: 'BND Thôn An Trạch & HTX Hòa Tiến 2',
          icon: <Handshake className="w-3.5 h-3.5 text-sky-300" />,
          colorClass: 'bg-sky-500/15 text-sky-200 border-sky-400/25'
        }}
        title="Quản Lý Sản Xuất & Mùa Vụ Nông Nghiệp"
        description="Số hóa quản lý 647 thửa ruộng trên 5 xứ đồng (Tổ 9, Hà Ra, La Châu, La Bông Tây, Gò Ổi), điều phối 5,26 tấn lúa giống và lịch thủy nông trên 43,86 ha đất lúa."
        theme="emerald"
        actions={
          <>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              >
                <Plus className="w-4 h-4 text-emerald-300" />
                <span>Thêm Thửa Mới</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsExcelModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400"
              title="Tải file mẫu Excel, Nạp dữ liệu, Xuất Master và Quản trị CSDL Nông nghiệp"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>Quản Lý CSDL & Excel</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Xuất Master Excel</span>
            </button>
          </>
        }
      />

      {/* ================= 6 RESPONSIVE KPI CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        
        {/* Card 1: Tổng Diện Tích */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Diện Tích Lúa</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>{((Number(totalAreaM2) || 0) / 10000).toFixed(2)}</span>
              <span className="text-xs font-bold text-slate-500">ha</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{(Number(totalAreaM2) || 0).toLocaleString()} m²</p>
          </div>
        </div>

        {/* Card 2: Quy Mô Thửa */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Quy Mô Thửa</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>{(sanXuatList || []).length}</span>
              <span className="text-xs font-bold text-slate-500">thửa</span>
            </div>
            <p className="text-[11px] text-sky-700 font-bold mt-0.5">5 Xứ Đồng Lớn</p>
          </div>
        </div>

        {/* Card 3: Nông Dân Canh Tác */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Hộ Nông Dân</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>{Number(uniqueFarmersCount) || 0}</span>
              <span className="text-xs font-bold text-slate-500">hộ</span>
            </div>
            <p className="text-[11px] text-indigo-700 font-bold mt-0.5">2.308 Dân cư</p>
          </div>
        </div>

        {/* Card 4: Lúa Giống Cấp */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Giống Lúa Cấp</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>{((Number(totalSeedKg) || 0) / 1000).toFixed(2)}</span>
              <span className="text-xs font-bold text-slate-500">tấn</span>
            </div>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5">12 kg / 1.000m²</p>
          </div>
        </div>

        {/* Card 5: Cơ Cấu 5 Xứ Đồng */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Xứ Đồng Lớn</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-teal-900 tracking-tight flex items-baseline gap-1">
              <span>5</span>
              <span className="text-xs font-bold text-slate-500">vùng</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5 truncate">Tổ 9 (23ha) • Hà Ra (10ha)</p>
          </div>
        </div>

        {/* Card 6: Chế Độ Canh Tác */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Chính Chủ Cấy</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-purple-900 tracking-tight flex items-baseline gap-1">
              <span>{Number(chinhChuCount) || 0}</span>
              <span className="text-xs font-bold text-slate-500">thửa</span>
            </div>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">Thuê/Mượn: {Number(thueMuonCount) || 0} thửa</p>
          </div>
        </div>

      </div>

      {/* ================= MAIN TABS NAVIGATION ================= */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-slate-900 text-white font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sổ Bộ Sản Xuất ({(sanXuatList || []).length} Thửa)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map_xu_dong')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'map_xu_dong'
              ? 'bg-slate-900 text-white font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-teal-400" />
          <span>Bản Đồ 5 Xứ Đồng (GIS)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('varieties')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'varieties'
              ? 'bg-slate-900 text-white font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Wheat className="w-3.5 h-3.5 text-amber-400" />
          <span>Cơ Cấu Giống & Kỹ Thuật</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-slate-900 text-white font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          <span>Lịch Mùa Vụ ĐX 25-26</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('irrigation')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'irrigation'
              ? 'bg-slate-900 text-white font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          <span>Thủy Nông & Nước Tưới</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'export'
              ? 'bg-slate-900 text-white font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-purple-400" />
          <span>Phân Bổ & Ký Nhận HTX</span>
        </button>
      </div>

      {/* ================= TAB 1: SỔ BỘ SẢN XUẤT 647 THỬA ĐẤT ================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          
          {/* Integrated Filter & Xứ Đồng Navigation Strip */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            
            {/* Row 1: Search + Quick Xứ Đồng Filter Pills */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              {/* Search input */}
              <div className="relative w-full lg:w-72 shrink-0">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm chủ đất, hộ cấy, lô, xứ đồng..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                />
              </div>

              {/* 5 Xứ Đồng Quick Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedXuDong('ALL');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                    selectedXuDong === 'ALL'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  Toàn Thôn ({(sanXuatList || []).length})
                </button>

                {(xuDongList || []).map((xd) => {
                  const xdName = String(xd?.ten_xu_dong || '').replace('Xứ Đồng ', '');
                  const isSelected = normalizeXuDong(selectedXuDong) === normalizeXuDong(xdName);
                  const countInXd = (sanXuatList || []).filter((r) => normalizeXuDong(r?.xu_dong) === normalizeXuDong(xdName)).length;

                  return (
                    <button
                      key={xd.ma_xu_dong}
                      type="button"
                      onClick={() => {
                        setSelectedXuDong(xdName);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>{xdName}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-white text-slate-500 border border-slate-200'}`}>
                        {countInXd}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Secondary Dropdowns + Result Counter */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Lọc theo Giống Lúa */}
                <select
                  value={selectedVariety}
                  onChange={(e) => {
                    setSelectedVariety(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 cursor-pointer text-xs"
                >
                  <option value="ALL">Tất cả giống lúa</option>
                  <option value="HG12">Giống HG12 (46,8%)</option>
                  <option value="HG244">Giống HG244 (43,3%)</option>
                  <option value="J02">Giống J02 Nhật Bản (9,9%)</option>
                </select>

                {/* Lọc theo Chế Độ Canh Tác */}
                <select
                  value={selectedOwnership}
                  onChange={(e) => {
                    setSelectedOwnership(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 cursor-pointer text-xs"
                >
                  <option value="ALL">Tất cả chế độ canh tác</option>
                  <option value="CHINH_CHU">🟢 Chính chủ tự canh tác ({Number(chinhChuCount) || 0})</option>
                  <option value="THUE_MUON">🟠 Mượn / Thuê / Nhận khoán ({Number(thueMuonCount) || 0})</option>
                </select>

                {/* Lọc theo Tổ Dân Cư */}
                <select
                  value={selectedTo}
                  onChange={(e) => {
                    setSelectedTo(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 cursor-pointer text-xs"
                >
                  <option value="ALL">Tất cả tổ dân cư</option>
                  {Array.from({ length: 8 }, (_, i) => `Tổ ${i + 1}`).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>

                {(searchQuery || selectedXuDong !== 'ALL' || selectedVariety !== 'ALL' || selectedOwnership !== 'ALL' || selectedTo !== 'ALL') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedXuDong('ALL');
                      setSelectedVariety('ALL');
                      setSelectedOwnership('ALL');
                      setSelectedTo('ALL');
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold flex items-center gap-1 transition-colors cursor-pointer text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt lại lọc</span>
                  </button>
                )}
              </div>
              <div>
                Đang hiển thị <strong className="text-slate-900">{(paginatedList || []).length}</strong> / <strong>{(filteredList || []).length}</strong> thửa đất sản xuất
              </div>
              <div className="font-mono text-emerald-700 font-extrabold">
                Tổng diện tích lọc: {(filteredList || []).reduce((s, r) => s + (Number(r?.dien_tich_m2) || 0), 0).toLocaleString()} m² ({(((filteredList || []).reduce((s, r) => s + (Number(r?.dien_tich_m2) || 0), 0)) / 10000).toFixed(2)} ha)
              </div>
            </div>
          </div>

          {/* Table Data Grid */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
                    <th className="py-3.5 px-3 text-center w-12">STT</th>
                    <th className="py-3.5 px-3">Xứ Đồng</th>
                    <th className="py-3.5 px-3">Lô / Thửa Đất</th>
                    <th className="py-3.5 px-3">Giống Lúa</th>
                    <th className="py-3.5 px-3">Chủ Đất (QSDĐ)</th>
                    <th className="py-3.5 px-3">Hộ Canh Tác</th>
                    <th className="py-3.5 px-3 text-center">Chế Độ</th>
                    <th className="py-3.5 px-3 text-right">Diện Tích (m²)</th>
                    <th className="py-3.5 px-3 text-center">Định Danh Cư Dân</th>
                    <th className="py-3.5 px-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-14 text-center">
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                            <Sprout className="w-7 h-7" />
                          </div>
                          {sanXuatList.length === 0 ? (
                            <div className="space-y-2">
                              <h4 className="text-base font-black text-slate-900">Cơ Sở Dữ Liệu Nông Nghiệp Đang Trống</h4>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Chưa có thửa ruộng nào trong hệ thống. Bạn có thể nạp dữ liệu từ file Excel hoặc khôi phục lại 647 thửa ruộng mẫu chuẩn của Thôn An Trạch.
                              </p>
                              <div className="flex items-center justify-center gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setIsExcelModalOpen(true)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <FileSpreadsheet className="w-4 h-4" />
                                  <span>Nạp / Import Excel</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={resetSanXuatToSeed}
                                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  <span>Khôi Phục 647 Thửa Mẫu</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <h4 className="text-base font-black text-slate-900">Không Tìm Thấy Thửa Đất Phù Hợp</h4>
                              <p className="text-xs text-slate-500 font-medium">
                                Không có thửa ruộng nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchQuery('');
                                  setSelectedXuDong('ALL');
                                  setSelectedVariety('ALL');
                                  setSelectedOwnership('ALL');
                                  setSelectedTo('ALL');
                                  setCurrentPage(1);
                                }}
                                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                              >
                                <RotateCcw className="w-4 h-4" />
                                <span>Đặt Lại Toàn Bộ Lọc</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map((rec, idx) => {
                      if (!rec) return null;
                      const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                      const isHG12 = rec.giong_lua === 'HG12';
                      const isHG244 = rec.giong_lua === 'HG244';
                      const isJ02 = rec.giong_lua === 'J02';
                      const isChinhChu = rec.la_chinh_chu !== false;

                      return (
                        <tr key={rec.id || idx} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                            {globalIdx}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`font-extrabold px-2.5 py-1 rounded-lg border text-xs inline-block ${getXuDongBadgeStyle(rec.xu_dong || 'Tổ 9')}`}>
                              {rec.xu_dong || 'Tổ 9'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <strong className="text-slate-900 font-bold text-xs block">{rec.lo_thua_dat || 'Thửa'}</strong>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-md font-black text-[10px] border inline-block ${
                                isHG12
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : isHG244
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-purple-50 text-purple-800 border-purple-200'
                              }`}
                            >
                              {rec.giong_lua || 'HG12'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-extrabold text-slate-800 block">{rec.chu_dat || 'Chưa rõ'}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-sky-800 block">{rec.ho_san_xuat || rec.chu_dat || 'Chưa rõ'}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isChinhChu ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block">
                                Chính chủ
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-block">
                                Mượn/Thuê
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            {(Number(rec.dien_tich_m2) || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {rec.chu_dat && (
                                <button
                                  type="button"
                                  onClick={() => handleViewResidentByName(rec.chu_dat)}
                                  className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer font-bold text-[10px]"
                                  title="Xem hồ sơ Chủ đất"
                                >
                                  Chủ đất
                                </button>
                              )}
                              {!isChinhChu && rec.ho_san_xuat && (
                                <button
                                  type="button"
                                  onClick={() => handleViewResidentByName(rec.ho_san_xuat)}
                                  className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-colors cursor-pointer font-bold text-[10px]"
                                  title="Xem hồ sơ Người canh tác"
                                >
                                  Hộ cấy
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() => handleOpenEditModal(rec)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                                    title="Chỉnh sửa thông tin thửa"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRecord(rec)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Xóa thửa này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="text-slate-500 font-medium">
                  Trang <strong className="text-slate-900">{currentPage}</strong> / <strong>{totalPages}</strong>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
                  >
                    Trước
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && currentPage > 3) {
                        pageNum = currentPage - 2 + i;
                        if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-slate-900 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: BẢN ĐỒ 5 XỨ ĐỒNG (GIS) ================= */}
      {activeTab === 'map_xu_dong' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-lg font-black flex items-center justify-center md:justify-start gap-2">
                <Compass className="w-5 h-5 text-teal-400" />
                <span>Bản Đồ Không Gian Số Hóa 647 Thửa & Geo3D Thôn An Trạch</span>
              </h3>
              <p className="text-xs text-slate-300">
                Khám phá bản đồ vệ tinh tương tác Leaflet 2D GIS, hệ thống kênh thủy nông sông Yên và mô phỏng 3D mặt ruộng.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('ban-do-san-xuat')}
              className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Mở Bản Đồ Sản Xuất (Geo3D & GIS)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(xuDongList || []).map((xd) => (
              <div
                key={xd.ma_xu_dong}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: xd.mau_sac || '#10b981' }} />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Xứ Đồng Canh Tác</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black text-white" style={{ backgroundColor: xd.mau_sac || '#10b981' }}>
                      {((Number(xd?.dien_tich_m2) || 0) / 10000).toFixed(2)} ha
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{xd.ten_xu_dong || 'Xứ Đồng'}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{xd.vi_tri || ''}</p>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diện tích mặt ruộng:</span>
                      <strong className="text-slate-900 font-mono font-extrabold">{(Number(xd?.dien_tich_m2) || 0).toLocaleString()} m²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quy mô thửa ruộng:</span>
                      <strong className="text-slate-800">{xd.so_thua || 0} thửa ({xd.cac_lo || ''})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Giống lúa cơ cấu:</span>
                      <strong className="text-emerald-700 font-extrabold">{xd.giong_chinh || 'HG12'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Nguồn cấp nước:</span>
                      <strong className="text-sky-700">{xd.nguon_nuoc || 'Đập dâng Sông Yên'}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Tổ quản lý:</span>
                  <span className="text-slate-800 font-bold">{xd.to_quan_ly || 'Tổ 1'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: CƠ CẤU GIỐNG LÚA & KỸ THUẬT ================= */}
      {activeTab === 'varieties' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(giongLuaList || []).map((giong) => (
              <div
                key={giong.ma_giong}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: giong.mau_nhan_dien || '#10b981' }} />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Giống Lúa Thuần</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black text-white" style={{ backgroundColor: giong.mau_nhan_dien || '#10b981' }}>
                      {giong.ty_trong_phan_tram || 0}% Diện tích
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{giong.ten_giong || 'Giống lúa'}</h3>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diện tích toàn thôn:</span>
                      <strong className="text-slate-900 font-mono font-extrabold">{(Number(giong.dien_tich_toan_thon) || 0).toLocaleString()} m²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thời gian sinh trưởng:</span>
                      <strong className="text-slate-800">{giong.thoi_gian_sinh_truong || ''}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Năng suất ước tính:</span>
                      <strong className="text-emerald-700 font-extrabold">{giong.nang_suat_uoc_tinh || ''}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Định mức gieo sạ:</span>
                      <strong className="text-slate-800">{giong.dinh_muc_giong_ha || '120 kg/ha'}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {giong.dac_tinh_noi_bat || ''}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Nguồn gốc:</span>
                  <span className="text-slate-700 font-bold truncate max-w-[180px]">{giong.xuat_xu || ''}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines Box */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Quy Chuẩn Bón Phân & Kỹ Thuật Canh Tác HTX Hòa Tiến 2</h3>
                <p className="text-xs text-slate-500 font-medium">Áp dụng cho 647 thửa lúa Vụ Đông Xuân 2025 - 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="font-extrabold text-emerald-900 text-sm">1. Bón Lót (Làm Đất)</div>
                <p className="text-emerald-800 font-medium leading-relaxed">
                  100% Vôi bột (25-30kg/sào) + 100% Phân Lân vi sinh + Phân chuồng hoai mục trước khi bừa cấy 3-5 ngày.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
                <div className="font-extrabold text-sky-900 text-sm">2. Bón Thúc Đợt 1 (Đẻ Nhánh)</div>
                <p className="text-sky-800 font-medium leading-relaxed">
                  Khi lúa ra 3-4 lá (12-15 ngày sau sạ): Bón 50% Đạm Urê + 50% Kaly Clorua, kết hợp tỉa dặm lúa đều hàng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                <div className="font-extrabold text-purple-900 text-sm">3. Bón Đón Đòng (Đợt 2)</div>
                <p className="text-purple-800 font-medium leading-relaxed">
                  Khi lúa thắt eo tượng đòng (40-45 ngày): Bón lượng Kaly còn lại và bổ sung vi lượng Canxi-Bo chống rụng hạt.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: LỊCH THỜI VỤ & TIẾN ĐỘ MÙA VỤ ================= */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">Khung Lịch Thời Vụ Vụ Đông Xuân 2025 - 2026</h3>
              <p className="text-xs text-slate-500 font-medium">Theo chỉ đạo thời vụ của UBND Xã Hòa Tiến và Chi cục Trồng trọt Đà Nẵng</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
              Vụ Đông Xuân (Chính Vụ)
            </span>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {(lichThoiVuList || []).map((step, idx) => {
              const isDone = step.trang_thai === 'hoan_thanh';
              const isRunning = step.trang_thai === 'dang_thuc_hien';

              return (
                <div key={step.id} className="relative flex items-start gap-4 pl-1 group">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 z-10 border-2 border-white shadow-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isRunning
                        ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-100'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 transition-all space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-black text-slate-900 text-sm sm:text-base">{step.giai_doan}</h4>
                      <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200 inline-block w-fit">
                        {step.thoi_gian}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {step.noi_dung_cong_viec}
                    </p>

                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                      <strong className="block font-bold">Khuyến cáo kỹ thuật:</strong>
                      <span>{step.khuyen_cao_ky_thuat}</span>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                      <span>Phụ trách: <strong>{step.can_bo_phu_trach}</strong></span>
                      <span
                        className={`font-black uppercase text-[9px] px-2 py-0.5 rounded-md border ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isRunning
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {isDone ? 'Đã hoàn thành' : isRunning ? 'Đang thực hiện' : 'Sắp tới'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 5: THỦY NÔNG & NƯỚC TƯỚI ================= */}
      {activeTab === 'irrigation' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-800">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">Hệ Thống Thủy Nông & Điều Tiết Nước Tưới Đập Dâng Sông Yên</h3>
                <p className="text-xs text-slate-500 font-medium">Trạm bơm An Trạch và mạng lưới kênh dẫn phục vụ 43,86 ha đất lúa</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="font-extrabold text-blue-900 text-sm">Trạm Bơm An Trạch 1 & 2</div>
                <p className="text-blue-800 font-medium leading-relaxed">
                  Công suất 4 máy bơm 2.500 m³/h, đảm bảo nguồn nước tưới tự chảy và bơm chuyền cho toàn bộ 8 tổ dân cư.
                </p>
                <div className="text-[11px] font-bold text-blue-900 pt-1">
                  Trực vận hành: 24/7 trong giai đoạn gieo sạ
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="font-extrabold text-teal-900 text-sm">Lịch Mở Nước Thau Rửa Đồng</div>
                <p className="text-teal-800 font-medium leading-relaxed">
                  Mở cống xả đập dâng sông Yên liên tục 10 ngày trước gieo sạ để đẩy mặn, giữ mực nước mặt ruộng 5-7cm.
                </p>
                <div className="text-[11px] font-bold text-teal-900 pt-1">
                  Độ mặn kiểm soát: Dưới 0.8 ‰
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                <div className="font-extrabold text-sky-900 text-sm">Tổ Thủy Nông Cơ Sở</div>
                <p className="text-sky-800 font-medium leading-relaxed">
                  Phân công 8 cán bộ thủy nông phụ trách đóng mở cống dẫn nước vào từng lô thửa ruộng theo ca trực.
                </p>
                <div className="text-[11px] font-bold text-sky-900 pt-1">
                  Đường dây nóng: 0905 888 999
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: PHÂN BỔ & KÝ NHẬN GIỐNG HTX ================= */}
      {activeTab === 'export' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg">Danh Sách Phân Bổ & Ký Nhận Lúa Giống HTX</h3>
              <p className="text-xs text-slate-500 font-medium">Bảng kê đối chiếu phục vụ các đợt phát lúa giống vụ Đông Xuân 2025 - 2026</p>
            </div>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-5 py-2.5 rounded-xl gradient-gov text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải File Excel Ký Nhận</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-400 text-[11px] font-bold">Tổng lượt nhận lúa giống</span>
              <div className="text-2xl font-black text-slate-900">{(sanXuatList || []).length} lượt</div>
              <p className="text-[11px] text-slate-500">Phân bổ đều cho 8 tổ dân cư</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-400 text-[11px] font-bold">Tổng khối lượng giống cấp</span>
              <div className="text-2xl font-black text-emerald-700">{((Number(totalSeedKg) || 0) / 1000).toFixed(2)} tấn</div>
              <p className="text-[11px] text-slate-500">Chuẩn bị sẵn tại kho HTX An Trạch</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-400 text-[11px] font-bold">Tỷ lệ hoàn thành ký nhận</span>
              <div className="text-2xl font-black text-sky-700">100%</div>
              <p className="text-[11px] text-slate-500">Sẵn sàng xuất kho gieo sạ</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ADD / EDIT RECORD ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingRecord ? 'Chỉnh Sửa Thửa Đất Sản Xuất' : 'Thêm Mới Thửa Đất Canh Tác'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Vụ Đông Xuân 2025 - 2026</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveRecord} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tên Chủ Đất (QSDĐ): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formChuDat}
                    onChange={(e) => setFormChuDat(e.target.value)}
                    placeholder="VD: Thái Thị Tuyết"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Hộ Trực Tiếp Canh Tác:
                  </label>
                  <input
                    type="text"
                    value={formHoSanXuat}
                    onChange={(e) => setFormHoSanXuat(e.target.value)}
                    placeholder="VD: Hồ Thị Vân"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Xứ Đồng:</label>
                  <select
                    value={formXuDong}
                    onChange={(e) => setFormXuDong(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700"
                  >
                    <option value="Tổ 9">Xứ Đồng Tổ 9</option>
                    <option value="Hà Ra">Xứ Đồng Hà Ra</option>
                    <option value="La Châu">Xứ Đồng La Châu</option>
                    <option value="La Bông Tây">Xứ Đồng La Bông Tây</option>
                    <option value="Gò Ổi">Xứ Đồng Gò Ổi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lô / Thửa Đất:</label>
                  <input
                    type="text"
                    required
                    value={formLoThua}
                    onChange={(e) => setFormLoThua(e.target.value)}
                    placeholder="VD: Lô 4(Thớt 1)"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Diện Tích (m²): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formDienTich}
                    onChange={(e) => setFormDienTich(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:bg-white focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giống Lúa:</label>
                  <select
                    value={formGiong}
                    onChange={(e) => setFormGiong(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700"
                  >
                    <option value="HG12">HG12 (Lúa thuần chất lượng cao)</option>
                    <option value="HG244">HG244 (Lúa cứng cây cao sản)</option>
                    <option value="J02">J02 (Lúa Nhật Bản đặc sản)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổ Dân Cư Quản Lý:</label>
                  <select
                    value={formTo}
                    onChange={(e) => setFormTo(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700"
                  >
                    {Array.from({ length: 8 }, (_, i) => `Tổ ${i + 1}`).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lúa Giống Cấp (Tự tính):</label>
                  <div className="w-full px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 font-mono font-black text-emerald-800">
                    {(formDienTich * 0.012).toFixed(2)} kg
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {editingRecord ? 'Lưu Thay Đổi' : 'Thêm Thửa Mới'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Excel Import / Export & Supabase Sync Modal */}
      <SanXuatExcelModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      />

    </div>
  );
};
