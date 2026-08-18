import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  ShieldAlert, 
  UserCheck, 
  Send, 
  Download, 
  Eye, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  X, 
  Building2, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileCheck, 
  TrendingUp, 
  Paperclip,
  Share2,
  Check,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CongVan, LoaiCongVan, DoKhanCongVan, DoMatCongVan, TrangThaiCongVan } from '../types';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

const LOAI_CONG_VAN_CONFIG: Record<LoaiCongVan, { label: string; icon: any; badge: string; color: string }> = {
  van_ban_den: { 
    label: 'Văn Bản Đến', 
    icon: ArrowDownLeft, 
    badge: 'bg-sky-50 text-sky-800 border-sky-200 font-extrabold', 
    color: 'text-sky-600' 
  },
  van_ban_di: { 
    label: 'Văn Bản Đi', 
    icon: ArrowUpRight, 
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold', 
    color: 'text-emerald-600' 
  },
  noi_bo: { 
    label: 'Văn Bản Nội Bộ', 
    icon: FileText, 
    badge: 'bg-purple-50 text-purple-800 border-purple-200 font-extrabold', 
    color: 'text-purple-600' 
  },
  to_trinh: { 
    label: 'Tờ Trình / Kiến Nghị', 
    icon: Send, 
    badge: 'bg-amber-50 text-amber-800 border-amber-200 font-extrabold', 
    color: 'text-amber-600' 
  },
  chi_dao: { 
    label: 'Chỉ Đạo Khẩn', 
    icon: Flame, 
    badge: 'bg-rose-50 text-rose-800 border-rose-200 font-extrabold', 
    color: 'text-rose-600' 
  },
};

const DO_KHAN_CONFIG: Record<DoKhanCongVan, { label: string; badge: string }> = {
  thuong: { label: 'Bình Thường', badge: 'bg-slate-100 text-slate-700 border-slate-200 font-medium' },
  khan: { label: 'Khẩn', badge: 'bg-amber-100 text-amber-900 border-amber-300 font-black' },
  hoa_toc: { label: 'Hỏa Tốc', badge: 'bg-rose-100 text-rose-900 border-rose-300 font-black animate-pulse' },
};

const TRANG_THAI_CONFIG: Record<TrangThaiCongVan, { label: string; badge: string; color: string }> = {
  cho_phan_cong: { label: 'Chờ Phân Công', badge: 'bg-slate-100 text-slate-800 border-slate-300', color: 'text-slate-500' },
  dang_xu_ly: { label: 'Đang Xử Lý', badge: 'bg-sky-50 text-sky-800 border-sky-300', color: 'text-sky-600' },
  hoan_thanh: { label: 'Đã Hoàn Thành', badge: 'bg-emerald-50 text-emerald-800 border-emerald-300', color: 'text-emerald-600' },
  qua_han: { label: 'Quá Hạn Xử Lý', badge: 'bg-rose-50 text-rose-800 border-rose-300', color: 'text-rose-600' },
  luu_tru: { label: 'Đã Lưu Trữ', badge: 'bg-indigo-50 text-indigo-800 border-indigo-300', color: 'text-indigo-600' },
};

export const CongVanPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { congVanList, canBoList, addCongVan, updateCongVan, deleteCongVan, assignCongVan, updateCongVanProgress } = useData();

  const canManage = currentUser && ['super_admin', 'admin', 'truong_thon', 'can_bo_xa'].includes(currentUser.vai_tro);

  const [activeFilterTab, setActiveFilterTab] = useState<'ALL' | LoaiCongVan | 'dang_xu_ly' | 'hoan_thanh' | 'khan'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOfficerFilter, setSelectedOfficerFilter] = useState('ALL');

  // Modals
  const [selectedCongVan, setSelectedCongVan] = useState<CongVan | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCongVan, setEditingCongVan] = useState<CongVan | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Add / Edit Form State
  const [formSoKyHieu, setFormSoKyHieu] = useState('');
  const [formTrichYeu, setFormTrichYeu] = useState('');
  const [formLoai, setFormLoai] = useState<LoaiCongVan>('van_ban_den');
  const [formCoQuan, setFormCoQuan] = useState('UBND Xã Hòa Tiến');
  const [formNgayBanHanh, setFormNgayBanHanh] = useState(new Date().toISOString().split('T')[0]);
  const [formNgayTiepNhan, setFormNgayTiepNhan] = useState(new Date().toISOString().split('T')[0]);
  const [formDoKhan, setFormDoKhan] = useState<DoKhanCongVan>('thuong');
  const [formDoMat, setFormDoMat] = useState<DoMatCongVan>('thuong');
  const [formHanXuLy, setFormHanXuLy] = useState('');
  const [formFileName, setFormFileName] = useState('');

  // Assign Form State
  const [assignOfficerId, setAssignOfficerId] = useState('');
  const [assignCoordinators, setAssignCoordinators] = useState<string[]>([]);
  const [assignChiDao, setAssignChiDao] = useState('');
  const [assignDeadline, setAssignDeadline] = useState('');

  // Progress Form State
  const [progressPercent, setProgressPercent] = useState<number>(50);
  const [progressResult, setProgressResult] = useState('');
  const [progressStatus, setProgressStatus] = useState<TrangThaiCongVan>('dang_xu_ly');

  // Filtering
  const filteredCongVanList = useMemo(() => {
    return congVanList.filter((item) => {
      // Tab filter
      if (activeFilterTab === 'dang_xu_ly' && item.trang_thai !== 'dang_xu_ly' && item.trang_thai !== 'cho_phan_cong') return false;
      if (activeFilterTab === 'hoan_thanh' && item.trang_thai !== 'hoan_thanh') return false;
      if (activeFilterTab === 'khan' && item.do_khan === 'thuong') return false;
      if (['van_ban_den', 'van_ban_di', 'noi_bo', 'to_trinh', 'chi_dao'].includes(activeFilterTab) && item.loai_cong_van !== activeFilterTab) return false;

      // Officer filter
      if (selectedOfficerFilter !== 'ALL' && item.nguoi_chu_tri_id !== selectedOfficerFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          item.so_ky_hieu.toLowerCase().includes(q) ||
          item.trich_yeu.toLowerCase().includes(q) ||
          item.co_quan_ban_hanh.toLowerCase().includes(q) ||
          (item.nguoi_chu_tri_ten && item.nguoi_chu_tri_ten.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [congVanList, activeFilterTab, searchQuery, selectedOfficerFilter]);

  // KPIs
  const totalCount = congVanList.length;
  const incomingCount = congVanList.filter((c) => c.loai_cong_van === 'van_ban_den').length;
  const outgoingCount = congVanList.filter((c) => c.loai_cong_van === 'van_ban_di' || c.loai_cong_van === 'to_trinh').length;
  const processingCount = congVanList.filter((c) => c.trang_thai === 'dang_xu_ly' || c.trang_thai === 'cho_phan_cong').length;
  const urgentCount = congVanList.filter((c) => c.do_khan === 'hoa_toc' || c.do_khan === 'khan').length;

  // Handlers
  const handleOpenAddModal = () => {
    setEditingCongVan(null);
    setFormSoKyHieu('');
    setFormTrichYeu('');
    setFormLoai('van_ban_den');
    setFormCoQuan('UBND Xã Hòa Tiến');
    setFormNgayBanHanh(new Date().toISOString().split('T')[0]);
    setFormNgayTiepNhan(new Date().toISOString().split('T')[0]);
    setFormDoKhan('thuong');
    setFormDoMat('thuong');
    setFormHanXuLy('');
    setFormFileName('');
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (cv: CongVan) => {
    setEditingCongVan(cv);
    setFormSoKyHieu(cv.so_ky_hieu);
    setFormTrichYeu(cv.trich_yeu);
    setFormLoai(cv.loai_cong_van);
    setFormCoQuan(cv.co_quan_ban_hanh);
    setFormNgayBanHanh(cv.ngay_ban_hanh);
    setFormNgayTiepNhan(cv.ngay_tiep_nhan);
    setFormDoKhan(cv.do_khan);
    setFormDoMat(cv.do_mat);
    setFormHanXuLy(cv.han_xu_ly || '');
    setFormFileName(cv.file_name || '');
    setIsAddEditOpen(true);
  };

  const handleSaveCongVan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSoKyHieu.trim() || !formTrichYeu.trim()) return;

    if (editingCongVan) {
      await updateCongVan(editingCongVan.id, {
        so_ky_hieu: formSoKyHieu.trim(),
        trich_yeu: formTrichYeu.trim(),
        loai_cong_van: formLoai,
        co_quan_ban_hanh: formCoQuan.trim(),
        ngay_ban_hanh: formNgayBanHanh,
        ngay_tiep_nhan: formNgayTiepNhan,
        do_khan: formDoKhan,
        do_mat: formDoMat,
        han_xu_ly: formHanXuLy || undefined,
        file_name: formFileName.trim() || undefined,
      });
    } else {
      await addCongVan({
        so_ky_hieu: formSoKyHieu.trim(),
        trich_yeu: formTrichYeu.trim(),
        loai_cong_van: formLoai,
        co_quan_ban_hanh: formCoQuan.trim(),
        ngay_ban_hanh: formNgayBanHanh,
        ngay_tiep_nhan: formNgayTiepNhan,
        do_khan: formDoKhan,
        do_mat: formDoMat,
        han_xu_ly: formHanXuLy || undefined,
        trang_thai: 'cho_phan_cong',
        tien_do_phan_tram: 0,
        file_name: formFileName.trim() || `${formSoKyHieu.replace(/[\/\\]/g, '_')}.pdf`,
        file_url: 'https://ubnd-hoatien.danang.gov.vn/vanban/sample.pdf',
        nguoi_tao_id: currentUser?.id,
        nguoi_tao_ten: currentUser?.ho_ten || 'Trưởng Thôn',
      });
    }

    setIsAddEditOpen(false);
  };

  const handleDeleteCongVan = async (cv: CongVan) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa văn bản số "${cv.so_ky_hieu}"?`)) {
      await deleteCongVan(cv.id);
      if (selectedCongVan?.id === cv.id) {
        setSelectedCongVan(null);
      }
    }
  };

  const handleOpenAssignModal = (cv: CongVan) => {
    setSelectedCongVan(cv);
    setAssignOfficerId(cv.nguoi_chu_tri_id || (canBoList[0]?.id || ''));
    setAssignCoordinators(cv.can_bo_phoi_hop || []);
    setAssignChiDao(cv.chi_dao_xu_ly || '');
    setAssignDeadline(cv.han_xu_ly || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setIsAssignOpen(true);
  };

  const handleSaveAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCongVan) return;

    const chosenOfficer = canBoList.find((c) => c.id === assignOfficerId) || canBoList[0];
    if (!chosenOfficer) return;

    await assignCongVan(selectedCongVan.id, {
      nguoi_chu_tri_id: chosenOfficer.id,
      nguoi_chu_tri_ten: chosenOfficer.ho_ten,
      nguoi_chu_tri_chuc_vu: chosenOfficer.chuc_vu,
      can_bo_phoi_hop: assignCoordinators,
      chi_dao_xu_ly: assignChiDao.trim(),
      han_xu_ly: assignDeadline,
    });

    setIsAssignOpen(false);
  };

  const handleOpenProgressModal = (cv: CongVan) => {
    setSelectedCongVan(cv);
    setProgressPercent(cv.tien_do_phan_tram || 0);
    setProgressResult(cv.ket_qua_xu_ly || '');
    setProgressStatus(cv.trang_thai);
    setIsProgressOpen(true);
  };

  const handleSaveProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCongVan) return;

    await updateCongVanProgress(
      selectedCongVan.id,
      Number(progressPercent),
      progressResult.trim(),
      progressStatus
    );

    setIsProgressOpen(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Master Header Banner Standardized */}
      <PageHeaderBanner
        icon={<FileCheck className="w-6 h-6 text-white" />}
        iconBgClass="from-sky-600 via-indigo-600 to-blue-700 text-white shadow-sky-500/25"
        badge={{
          text: 'Văn Thư Số & Hồ Sơ Hành Chính',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
          colorClass: 'bg-amber-500/20 text-amber-200 border-amber-400/30'
        }}
        subBadge={{
          text: 'Nghị Định 30/2020/NĐ-CP',
          icon: <FileText className="w-3.5 h-3.5 text-sky-300" />,
          colorClass: 'bg-white/10 text-slate-200 border-white/15'
        }}
        title="Quản Lý Công Văn & Phân Công Nhiệm Vụ"
        description="Số hóa quy trình tiếp nhận văn bản đến, phát hành văn bản đi, phân công cán bộ chủ trì xử lý và giám sát tiến độ hoàn thành nhiệm vụ Thôn An Trạch."
        theme="dark"
        actions={
          canManage ? (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-300 shrink-0"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Tiếp Nhận Công Văn Mới</span>
            </button>
          ) : undefined
        }
      />

      {/* 5 Summary Stat Metric Cards - Balanced & Fluid Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Tổng Văn Bản */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-400 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-600 to-slate-800" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Tổng Văn Bản
            </span>
            <div className="w-8 h-8 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {totalCount.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Hệ thống:</span>
              <strong className="text-slate-700 font-extrabold bg-slate-50 px-1.5 py-0.2 rounded-md border border-slate-200">
                Sổ công văn số
              </strong>
            </div>
          </div>
        </div>

        {/* Card 2: Văn Bản Đến */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Văn Bản Đến
            </span>
            <div className="w-8 h-8 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight">
              {incomingCount.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Cơ quan gửi:</span>
              <strong className="text-sky-700 font-extrabold bg-sky-50 px-1.5 py-0.2 rounded-md border border-sky-100">
                Huyện, Xã, Trạm
              </strong>
            </div>
          </div>
        </div>

        {/* Card 3: Văn Bản Đi & Báo Cáo */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Văn Bản Đi & Báo Cáo
            </span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              {outgoingCount.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Ban hành:</span>
              <strong className="text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-100">
                Ban thôn An Trạch
              </strong>
            </div>
          </div>
        </div>

        {/* Card 4: Đang Xử Lý */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Đang Xử Lý
            </span>
            <div className="w-8 h-8 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {processingCount.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Tiến độ:</span>
              <strong className="text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-100">
                Đang theo dõi
              </strong>
            </div>
          </div>
        </div>

        {/* Card 5: Hỏa Tốc / Khẩn */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group col-span-2 sm:col-span-1 min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Hỏa Tốc / Khẩn
            </span>
            <div className="w-8 h-8 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight">
              {urgentCount.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Ưu tiên:</span>
              <strong className="text-rose-700 font-extrabold bg-rose-50 px-1.5 py-0.2 rounded-md border border-rose-100">
                Xử lý khẩn cấp
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Navigation Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo số ký hiệu, trích yếu, cơ quan, người chủ trì..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-sky-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-bold shrink-0">Chủ trì:</span>
            <select
              value={selectedOfficerFilter}
              onChange={(e) => setSelectedOfficerFilter(e.target.value)}
              className="w-full md:w-56 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="ALL">Tất cả cán bộ</option>
              {canBoList.map((cb) => (
                <option key={cb.id} value={cb.id}>
                  {cb.ho_ten} ({cb.chuc_vu})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {[
            { id: 'ALL', label: 'Tất Cả Văn Bản' },
            { id: 'van_ban_den', label: 'Văn Bản Đến' },
            { id: 'van_ban_di', label: 'Văn Bản Đi' },
            { id: 'to_trinh', label: 'Tờ Trình / Kiến Nghị' },
            { id: 'noi_bo', label: 'Nội Bộ' },
            { id: 'dang_xu_ly', label: 'Đang Xử Lý' },
            { id: 'hoan_thanh', label: 'Đã Hoàn Thành' },
            { id: 'khan', label: '🚨 Hỏa Tốc / Khẩn' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeFilterTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dispatches List (Interactive Cards) */}
      <div className="space-y-3.5">
        {filteredCongVanList.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center font-bold">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Không tìm thấy công văn phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc loại văn bản khác.
            </p>
          </div>
        ) : (
          filteredCongVanList.map((cv) => {
            const loaiConfig = LOAI_CONG_VAN_CONFIG[cv.loai_cong_van] || LOAI_CONG_VAN_CONFIG.van_ban_den;
            const khanConfig = DO_KHAN_CONFIG[cv.do_khan] || DO_KHAN_CONFIG.thuong;
            const statusConfig = TRANG_THAI_CONFIG[cv.trang_thai] || TRANG_THAI_CONFIG.dang_xu_ly;

            return (
              <div
                key={cv.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-sky-400 hover:shadow-md transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-black text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                      Số: {cv.so_ky_hieu}
                    </span>

                    <span className={`text-[10px] px-2.5 py-0.5 rounded-lg border ${loaiConfig.badge}`}>
                      {loaiConfig.label}
                    </span>

                    {cv.do_khan !== 'thuong' && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-lg border ${khanConfig.badge}`}>
                        {khanConfig.label}
                      </span>
                    )}

                    <span className={`text-[10px] px-2.5 py-0.5 rounded-lg border ${statusConfig.badge} font-bold`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Ngày nhận: <strong>{cv.ngay_tiep_nhan}</strong>
                    </span>
                    {cv.han_xu_ly && (
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        Hạn: {cv.han_xu_ly}
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    Cơ quan ban hành: <span className="text-slate-800 font-extrabold">{cv.co_quan_ban_hanh}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug hover:text-sky-700 transition-colors">
                    {cv.trich_yeu}
                  </h3>

                  {cv.chi_dao_xu_ly && (
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium space-y-1">
                      <div className="font-extrabold flex items-center gap-1.5 text-amber-800 text-[11px] uppercase tracking-wide">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        Chỉ đạo xử lý của Trưởng Thôn:
                      </div>
                      <p>{cv.chi_dao_xu_ly}</p>
                    </div>
                  )}

                  {/* Assignment & Progress Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-600" />
                        <span className="text-slate-500 font-medium">Chủ trì:</span>
                        {cv.nguoi_chu_tri_ten ? (
                          <strong className="text-slate-900 font-extrabold">
                            {cv.nguoi_chu_tri_ten} <span className="text-purple-700 font-bold">({cv.nguoi_chu_tri_chuc_vu})</span>
                          </strong>
                        ) : (
                          <span className="text-slate-400 italic">Chưa phân công</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-medium">Tiến độ:</span>
                        <strong className="text-sky-700 font-black">{cv.tien_do_phan_tram}%</strong>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          cv.tien_do_phan_tram >= 100 
                            ? 'bg-emerald-500' 
                            : cv.tien_do_phan_tram >= 60 
                            ? 'bg-sky-500' 
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${cv.tien_do_phan_tram}%` }}
                      />
                    </div>

                    {cv.ket_qua_xu_ly && (
                      <div className="text-slate-700 text-[11px] leading-relaxed pt-1 border-t border-slate-200/80 font-medium">
                        <strong>Báo cáo kết quả:</strong> {cv.ket_qua_xu_ly}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {cv.file_name && (
                      <a
                        href={cv.file_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 transition-colors text-[11px]"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[180px]">{cv.file_name}</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Progress Update Button */}
                    <button
                      onClick={() => handleOpenProgressModal(cv)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold flex items-center gap-1 transition-colors text-xs cursor-pointer border border-amber-200"
                      title="Báo cáo tiến độ hoàn thành"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>Báo Cáo Tiến Độ</span>
                    </button>

                    {/* Assignment Button */}
                    {canManage && (
                      <button
                        onClick={() => handleOpenAssignModal(cv)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold flex items-center gap-1 transition-colors text-xs cursor-pointer border border-purple-200"
                        title="Phân công cán bộ xử lý"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-purple-600" />
                        <span>Giao Việc</span>
                      </button>
                    )}

                    {/* Edit Button */}
                    {canManage && (
                      <button
                        onClick={() => handleOpenEditModal(cv)}
                        className="p-2 rounded-xl text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                        title="Chỉnh sửa văn bản"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Button */}
                    {canManage && (
                      <button
                        onClick={() => handleDeleteCongVan(cv)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa công văn"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT CONG VAN ================= */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">
                {editingCongVan ? 'Chỉnh Sửa Công Văn' : 'Tiếp Nhận / Soạn Công Văn Mới'}
              </h3>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCongVan} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số ký hiệu văn bản *</label>
                  <input
                    type="text"
                    value={formSoKyHieu}
                    onChange={(e) => setFormSoKyHieu(e.target.value)}
                    placeholder="VD: 142/UBND-NV..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại văn bản *</label>
                  <select
                    value={formLoai}
                    onChange={(e) => setFormLoai(e.target.value as LoaiCongVan)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                  >
                    <option value="van_ban_den">Văn Bản Đến</option>
                    <option value="van_ban_di">Văn Bản Đi</option>
                    <option value="to_trinh">Tờ Trình / Kiến Nghị</option>
                    <option value="noi_bo">Văn Bản Nội Bộ</option>
                    <option value="chi_dao">Chỉ Đạo Khẩn</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trích yếu nội dung *</label>
                <textarea
                  value={formTrichYeu}
                  onChange={(e) => setFormTrichYeu(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed font-medium"
                  placeholder="Tóm tắt nội dung chính của văn bản..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cơ quan ban hành *</label>
                  <input
                    type="text"
                    value={formCoQuan}
                    onChange={(e) => setFormCoQuan(e.target.value)}
                    placeholder="VD: UBND Xã Hòa Tiến..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Độ khẩn</label>
                  <select
                    value={formDoKhan}
                    onChange={(e) => setFormDoKhan(e.target.value as DoKhanCongVan)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                  >
                    <option value="thuong">Bình Thường</option>
                    <option value="khan">Khẩn</option>
                    <option value="hoa_toc">Hỏa Tốc</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày ban hành</label>
                  <input
                    type="date"
                    value={formNgayBanHanh}
                    onChange={(e) => setFormNgayBanHanh(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngày tiếp nhận</label>
                  <input
                    type="date"
                    value={formNgayTiepNhan}
                    onChange={(e) => setFormNgayTiepNhan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạn xử lý</label>
                  <input
                    type="date"
                    value={formHanXuLy}
                    onChange={(e) => setFormHanXuLy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-amber-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên tệp đính kèm (File Scan PDF)</label>
                <input
                  type="text"
                  value={formFileName}
                  onChange={(e) => setFormFileName(e.target.value)}
                  placeholder="VD: 142_UBND_NV_KeHoach.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-gov text-white font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  {editingCongVan ? 'Lưu Thay Đổi' : 'Tiếp Nhận Công Văn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ASSIGN TASK (PHÂN CÔNG XỬ LÝ) ================= */}
      {isAssignOpen && selectedCongVan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-wide">Phân công nhiệm vụ</span>
                <h3 className="font-black text-slate-900 text-base">
                  Giao việc: {selectedCongVan.so_ky_hieu}
                </h3>
              </div>
              <button
                onClick={() => setIsAssignOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssign} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                <strong>Trích yếu:</strong> {selectedCongVan.trich_yeu}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cán bộ chủ trì xử lý *</label>
                <select
                  value={assignOfficerId}
                  onChange={(e) => setAssignOfficerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 text-xs"
                  required
                >
                  {canBoList.map((cb) => (
                    <option key={cb.id} value={cb.id}>
                      {cb.ho_ten} — {cb.chuc_vu} ({cb.to_phu_trach})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cán bộ phối hợp thực hiện</label>
                <div className="max-h-36 overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  {canBoList
                    .filter((cb) => cb.id !== assignOfficerId)
                    .map((cb) => {
                      const isChecked = assignCoordinators.includes(`${cb.ho_ten} (${cb.chuc_vu})`);
                      return (
                        <label
                          key={cb.id}
                          className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg cursor-pointer text-slate-800"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const tag = `${cb.ho_ten} (${cb.chuc_vu})`;
                              if (e.target.checked) {
                                setAssignCoordinators([...assignCoordinators, tag]);
                              } else {
                                setAssignCoordinators(assignCoordinators.filter((t) => t !== tag));
                              }
                            }}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <span className="font-medium text-[11px]">{cb.ho_ten} ({cb.chuc_vu})</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ý kiến chỉ đạo của Trưởng Thôn *</label>
                <textarea
                  value={assignChiDao}
                  onChange={(e) => setAssignChiDao(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed font-medium"
                  placeholder="Nhập yêu cầu nhiệm vụ, thời hạn và cách thức triển khai..."
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hạn chót hoàn thành *</label>
                <input
                  type="date"
                  value={assignDeadline}
                  onChange={(e) => setAssignDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-amber-800 font-bold"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ban Hành Giao Việc</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROGRESS UPDATE (BÁO CÁO TIẾN ĐỘ) ================= */}
      {isProgressOpen && selectedCongVan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wide">Tiến độ thực hiện</span>
                <h3 className="font-black text-slate-900 text-base">
                  Báo Cáo: {selectedCongVan.so_ky_hieu}
                </h3>
              </div>
              <button
                onClick={() => setIsProgressOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Mức độ hoàn thành công việc</label>
                  <span className="text-base font-black text-sky-700">{progressPercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={progressPercent}
                  onChange={(e) => setProgressPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0% (Bắt đầu)</span>
                  <span>50% (Đang làm)</span>
                  <span>100% (Hoàn thành)</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái công văn</label>
                <select
                  value={progressStatus}
                  onChange={(e) => setProgressStatus(e.target.value as TrangThaiCongVan)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                >
                  <option value="dang_xu_ly">Đang Xử Lý</option>
                  <option value="hoan_thanh">Đã Hoàn Thành</option>
                  <option value="qua_han">Quá Hạn Xử Lý</option>
                  <option value="luu_tru">Đã Lưu Trữ Hồ Sơ</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Báo cáo kết quả xử lý chi tiết *</label>
                <textarea
                  value={progressResult}
                  onChange={(e) => setProgressResult(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed font-medium"
                  placeholder="Mô tả cụ thể các công việc đã thực hiện, số liệu đạt được..."
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProgressOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gradient-gov text-white font-bold shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  Cập Nhật Tiến Độ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
