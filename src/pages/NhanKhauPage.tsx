import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  QrCode, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Users,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileDown,
  Activity,
  HeartPulse,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { NhanKhauCard } from '../components/NhanKhauCard';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { NhanKhau } from '../types';
import { exportNhanKhauToExcel } from '../lib/utils';

interface NhanKhauPageProps {
  onSelectResident: (resident: NhanKhau) => void;
  onOpenQRScanner: () => void;
  onOpenExcelModal: () => void;
  onOpenNewResidentModal: () => void;
  onSelectHoKhau: (maHo: string) => void;
}

const ITEMS_PER_PAGE = 24;

export const NhanKhauPage: React.FC<NhanKhauPageProps> = ({
  onSelectResident,
  onOpenQRScanner,
  onOpenExcelModal,
  onOpenNewResidentModal,
  onSelectHoKhau,
}) => {
  const { filteredNhanKhau, filters, setFilters, resetFilters, nhanKhauList, hoKhauList } = useData();
  const { currentUser } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Demographic KPI calculations
  const stats = useMemo(() => {
    const total = nhanKhauList.length || 1;
    const male = nhanKhauList.filter((r) => r.gioi_tinh === 'Nam').length;
    const female = nhanKhauList.filter((r) => r.gioi_tinh === 'Nữ').length;
    const cccd = nhanKhauList.filter((r) => r.so_cmnd_cccd && r.so_cmnd_cccd.length >= 9).length;
    const bhyt = nhanKhauList.filter((r) => !!r.ma_the_bhyt).length;
    const elderly = nhanKhauList.filter((r) => {
      if (!r.ngay_thang_nam_sinh) return false;
      const year = parseInt(r.ngay_thang_nam_sinh.slice(0, 4) || r.ngay_thang_nam_sinh.slice(-4));
      return year && (2026 - year >= 60);
    }).length;
    const labor = nhanKhauList.filter((r) => {
      if (!r.ngay_thang_nam_sinh) return false;
      const year = parseInt(r.ngay_thang_nam_sinh.slice(0, 4) || r.ngay_thang_nam_sinh.slice(-4));
      const age = 2026 - (year || 2000);
      return age >= 18 && age < 60;
    }).length;

    return { total, male, female, cccd, bhyt, elderly, labor };
  }, [nhanKhauList]);

  // Export current filtered residents to Excel
  const handleExportFilteredExcel = () => {
    const fileName = `AnTrach_NhanKhau_${filters.selectedTo !== 'ALL' ? filters.selectedTo : 'ToanThon'}_${filteredNhanKhau.length}_Nguoi.xlsx`;
    exportNhanKhauToExcel(filteredNhanKhau, fileName);
  };

  // Pagination calculation
  const totalItems = filteredNhanKhau.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedResidents = filteredNhanKhau.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.selectedTo !== 'ALL' ||
    filters.selectedNhomTuoi !== 'ALL' ||
    filters.selectedCuTru !== 'ALL' ||
    filters.selectedGiayTo !== 'ALL' ||
    filters.selectedBHYT !== 'ALL' ||
    filters.selectedGioiTinh !== 'ALL' ||
    filters.selectedDacThu !== 'ALL';

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Top Banner Header Standardized */}
      <PageHeaderBanner
        icon={<Users className="w-6 h-6 text-white" />}
        iconBgClass="from-blue-600 via-sky-600 to-indigo-700 text-white shadow-sky-500/25"
        badge={{
          text: 'Đề án 06 - CSDL Dân Cư Quốc Gia',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />,
          colorClass: 'bg-sky-500/20 text-sky-200 border-sky-400/30'
        }}
        subBadge={{
          text: `${stats.total.toLocaleString()} Cư Dân • 8 Tổ Dân Cư`,
          icon: <Building2 className="w-3.5 h-3.5 text-blue-300" />,
          colorClass: 'bg-white/10 text-slate-200 border-white/15'
        }}
        title="Quản Lý Dữ Liệu Nhân Khẩu Thôn An Trạch"
        description={`Số hóa quản lý hồ sơ 2.308 cư dân, định danh căn cước công dân gắn chip, độ tuổi lao động, chính sách an sinh BHYT${currentUser?.to_phu_trach !== 'Toàn thôn' ? ` • Phụ trách: ${currentUser?.to_phu_trach}` : ''}.`}
        theme="blue"
        actions={
          <>
            <button
              type="button"
              onClick={onOpenExcelModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400"
              title="Tải mẫu Excel, nạp dữ liệu, xuất Master và quản trị CSDL Dân cư"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>Quản Lý CSDL & Excel</span>
            </button>

            <button
              type="button"
              onClick={onOpenQRScanner}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              title="Quét mã QR thẻ Căn cước công dân gắn chip để tra cứu hoặc thêm mới"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>Quét QR CCCD</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewResidentModal}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-sky-300"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Thêm Cư Dân Mới</span>
            </button>
          </>
        }
      />

      {/* 4 Top Demographic Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Tổng Dân Số Thôn</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{stats.total.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-slate-500">người</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{stats.male} Nam • {stats.female} Nữ</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Định Danh CCCD</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-indigo-700 font-mono">{stats.cccd.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-indigo-600">({((stats.cccd / stats.total) * 100).toFixed(1)}%)</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Căn cước công dân gắn chip</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Bảo Hiểm Y Tế</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">{stats.bhyt.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-emerald-600">({((stats.bhyt / stats.total) * 100).toFixed(1)}%)</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Bao phủ an sinh y tế</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Độ Tuổi Lao Động</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-700 font-mono">{stats.labor.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-amber-600">({((stats.labor / stats.total) * 100).toFixed(1)}%)</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">{stats.elderly} người cao tuổi (≥60t)</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="premium-card p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                handleFilterChange('searchQuery', e.target.value);
              }}
              placeholder="Tìm kiếm tiếng Việt không dấu theo Họ tên, Số CCCD, BHYT, Điện thoại, Mã hộ, Địa chỉ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-900"
            />
            {filters.searchQuery && (
              <button
                onClick={() => handleFilterChange('searchQuery', '')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Toggle & View Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters || isFiltered
                  ? 'bg-sky-50 border-sky-300 text-sky-700'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Bộ lọc</span>
              {isFiltered && <span className="w-2 h-2 rounded-full bg-sky-600" />}
            </button>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Xóa toàn bộ bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            )}

            {/* Grid / Table Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng thẻ (Card Grid)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Dạng bảng (Data Table)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills (Tổ 1 - 8) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-[11px] font-extrabold text-slate-400 shrink-0 mr-1">TỔ:</span>
          {['ALL', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8', 'Chưa rõ tổ'].map((t) => (
            <button
              key={t}
              onClick={() => handleFilterChange('selectedTo', t)}
              className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-colors ${
                filters.selectedTo === t
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              {t === 'ALL' ? 'Tất cả 8 Tổ' : t}
            </button>
          ))}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Độ tuổi</label>
              <select
                value={filters.selectedNhomTuoi}
                onChange={(e) => handleFilterChange('selectedNhomTuoi', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="ALL">Tất cả độ tuổi</option>
                <option value="TRE_EM">Trẻ em (&lt;18 tuổi)</option>
                <option value="LAO_DONG">Độ tuổi lao động (18-59)</option>
                <option value="CAO_TUOI">Người cao tuổi (&gt;=60)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Cư trú</label>
              <select
                value={filters.selectedCuTru}
                onChange={(e) => handleFilterChange('selectedCuTru', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Đang thường trú">Đang thường trú</option>
                <option value="Trẻ mới sinh (Cập nhật sau 2019)">Trẻ mới sinh</option>
                <option value="Tạm trú">Tạm trú</option>
                <option value="Đã chuyển đi / Vắng mặt">Đã chuyển đi / Vắng mặt</option>
                <option value="Đã mất">Đã mất</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Căn cước công dân</label>
              <select
                value={filters.selectedGiayTo}
                onChange={(e) => handleFilterChange('selectedGiayTo', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="ALL">Tất cả</option>
                <option value="CO_CCCD">Đã có CCCD/CMND</option>
                <option value="CHUA_CO">Chưa có / Chưa cập nhật</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Bảo hiểm Y tế</label>
              <select
                value={filters.selectedBHYT}
                onChange={(e) => handleFilterChange('selectedBHYT', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="ALL">Tất cả</option>
                <option value="CO_BHYT">Đã có thẻ BHYT</option>
                <option value="CHUA_CO">Chưa có thẻ BHYT</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Giới tính</label>
              <select
                value={filters.selectedGioiTinh}
                onChange={(e) => handleFilterChange('selectedGioiTinh', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="ALL">Tất cả giới tính</option>
                <option value="Nam">Nam (♂)</option>
                <option value="Nữ">Nữ (♀)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Đối tượng chính sách</label>
              <select
                value={filters.selectedDacThu}
                onChange={(e) => handleFilterChange('selectedDacThu', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="ALL">Tất cả</option>
                <option value="DAC_BIET">Chính sách đặc thù</option>
                <option value="BINH_THUONG">Bình thường</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Resident Listing View */}
      {paginatedResidents.length === 0 ? (
        <div className="premium-card p-12 rounded-3xl text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
          <h4 className="font-bold text-slate-800 text-base">Không tìm thấy nhân khẩu phù hợp</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc bấm đặt lại bộ lọc để xem toàn bộ danh sách dân cư.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-sky-50 text-sky-700 font-bold text-xs rounded-xl hover:bg-sky-100"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {paginatedResidents.map((resident) => (
            <NhanKhauCard
              key={resident.id}
              resident={resident}
              onSelect={onSelectResident}
              onSelectHoKhau={onSelectHoKhau}
            />
          ))}
        </div>
      ) : (
        <div className="premium-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Họ và Tên</th>
                  <th className="px-3 py-3">Mã Hộ</th>
                  <th className="px-3 py-3">Quan Hệ</th>
                  <th className="px-3 py-3">Năm Sinh</th>
                  <th className="px-3 py-3">CCCD/CMND</th>
                  <th className="px-3 py-3">BHYT</th>
                  <th className="px-3 py-3">Tổ</th>
                  <th className="px-3 py-3">Cư Trú</th>
                  <th className="px-4 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedResidents.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => onSelectResident(r)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${r.gioi_tinh === 'Nam' ? 'bg-sky-500' : 'bg-rose-500'}`} />
                      {r.ho_ten}
                    </td>
                    <td className="px-3 py-3 font-mono text-sky-700 font-semibold">{r.ma_ho}</td>
                    <td className="px-3 py-3 text-slate-600">{r.quan_he_chu_ho}</td>
                    <td className="px-3 py-3 text-slate-600">{r.nam_sinh || 'N/A'} ({r.tuoi ? `${r.tuoi}t` : ''})</td>
                    <td className="px-3 py-3 font-mono">{r.so_cmnd_cccd || '-'}</td>
                    <td className="px-3 py-3 font-mono text-emerald-700">{r.ma_the_bhyt?.substring(0, 8) || '-'}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {r.to_dan_cu}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{r.trang_thai_cu_tru}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sky-600 font-bold hover:underline">Chi tiết</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="premium-card p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Trang <strong className="text-slate-900 font-bold">{currentPage}</strong> / {totalPages} (Tổng {totalItems} cư dân)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = currentPage;
              if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl font-bold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
