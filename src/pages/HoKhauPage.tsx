import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Users, 
  MapPin, 
  Phone, 
  Plus, 
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  List,
  FileDown,
  Wheat,
  ShieldCheck,
  Navigation,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { HoKhau } from '../types';
import { removeVietnameseTones } from '../lib/utils';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import * as XLSX from 'xlsx';

interface HoKhauPageProps {
  onSelectHoKhau: (household: HoKhau) => void;
  onAddNewHousehold: () => void;
}

const ITEMS_PER_PAGE = 24;

export const HoKhauPage: React.FC<HoKhauPageProps> = ({ onSelectHoKhau, onAddNewHousehold }) => {
  const { hoKhauList, nhanKhauList, sanXuatList } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTo, setSelectedTo] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Household KPI stats calculations
  const householdStats = useMemo(() => {
    const totalHo = hoKhauList.length || 1;
    const totalPop = nhanKhauList.length;
    const avgMembers = (totalPop / totalHo).toFixed(2);
    const gpsCount = hoKhauList.filter((h) => h.lat && h.lng).length;
    
    // Households engaged in agriculture
    const farmerHouseholds = new Set(
      sanXuatList.map((r) => r.ho_san_xuat?.trim().toUpperCase()).filter(Boolean)
    ).size;

    return { totalHo, totalPop, avgMembers, gpsCount, farmerHouseholds };
  }, [hoKhauList, nhanKhauList, sanXuatList]);

  // Export filtered households to Excel
  const handleExportHouseholdsExcel = () => {
    const exportRows = filteredHoKhau.map((h, idx) => {
      const members = nhanKhauList.filter((r) => r.ma_ho === h.ma_ho);
      return {
        'STT': idx + 1,
        'Mã Hộ': h.ma_ho,
        'Chủ Hộ Gia Đình': h.ten_chu_ho,
        'Số CCCD/CMND': h.so_cmnd_chu_ho || '',
        'Số Nhân Khẩu': members.length,
        'Tổ Dân Cư': h.to_dan_cu,
        'Địa Chỉ': h.dia_chi,
        'Điện Thoại': h.so_dien_thoai || '',
        'Tọa Độ Vĩ Độ (Lat)': h.lat || '',
        'Tọa Độ Kinh Độ (Lng)': h.lng || ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SoHoKhau');
    XLSX.writeFile(wb, `AnTrach_SoHoKhau_${selectedTo !== 'ALL' ? selectedTo : 'ToanThon'}_${filteredHoKhau.length}_Ho.xlsx`);
  };

  const filteredHoKhau = useMemo(() => {
    const q = removeVietnameseTones(searchQuery);

    return hoKhauList.filter((hk) => {
      if (q) {
        const maHoClean = hk.ma_ho.toLowerCase();
        const tenChuClean = removeVietnameseTones(hk.ten_chu_ho);
        const diaChiClean = removeVietnameseTones(hk.dia_chi);
        const cccdClean = (hk.so_cmnd_chu_ho || '').toLowerCase();
        const phoneClean = (hk.so_dien_thoai || '').toLowerCase();

        const match =
          maHoClean.includes(q) ||
          tenChuClean.includes(q) ||
          diaChiClean.includes(q) ||
          cccdClean.includes(q) ||
          phoneClean.includes(q);

        if (!match) return false;
      }

      if (selectedTo !== 'ALL' && hk.to_dan_cu !== selectedTo) {
        return false;
      }

      return true;
    });
  }, [hoKhauList, searchQuery, selectedTo]);

  const totalItems = filteredHoKhau.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedHoKhau = filteredHoKhau.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Top Banner Header Standardized */}
      <PageHeaderBanner
        icon={<Building2 className="w-6 h-6 text-white" />}
        iconBgClass="from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-indigo-500/25"
        badge={{
          text: 'Sổ Hộ Khẩu Điện Tử',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />,
          colorClass: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
        }}
        subBadge={{
          text: `${householdStats.totalHo} Hộ Gia Đình • 8 Tổ Dân Cư`,
          icon: <Users className="w-3.5 h-3.5 text-purple-300" />,
          colorClass: 'bg-white/10 text-slate-200 border-white/15'
        }}
        title="Quản Lý Sổ Hộ Khẩu Gia Đình Thôn An Trạch"
        description="Theo dõi toàn diện 614 hộ gia đình, thông tin chủ hộ, quan hệ thành viên, tọa độ nhà ở GIS và phân loại hộ sản xuất nông nghiệp."
        theme="purple"
        actions={
          <>
            <button
              type="button"
              onClick={handleExportHouseholdsExcel}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              title="Xuất file Excel danh sách sổ hộ khẩu"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>Xuất Excel ({totalItems} Hộ)</span>
            </button>

            <button
              type="button"
              onClick={onAddNewHousehold}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-indigo-400"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Tạo Sổ Hộ Khẩu Mới</span>
            </button>
          </>
        }
      />

      {/* 4 Top Household Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Tổng Số Hộ Gia Đình</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-indigo-700 font-mono">{householdStats.totalHo}</span>
              <span className="text-[11px] font-bold text-slate-500">sổ hộ</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Phân bổ trên 8 Tổ Dân Cư</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Quy Mô Hộ Bình Quân</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{householdStats.avgMembers}</span>
              <span className="text-[11px] font-bold text-slate-500">người/hộ</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Tổng {householdStats.totalPop.toLocaleString()} nhân khẩu</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Định Vị Tọa Độ GPS</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">{householdStats.gpsCount}</span>
              <span className="text-[11px] font-bold text-emerald-600">({((householdStats.gpsCount / householdStats.totalHo) * 100).toFixed(1)}%)</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Đã ghim vị trí nhà ở GIS</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Hộ Sản Xuất Nông Nghiệp</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-amber-700 font-mono">{householdStats.farmerHouseholds}</span>
              <span className="text-[11px] font-bold text-amber-600">hộ cấy lúa</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Vụ Đông Xuân 2025 - 2026</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <Wheat className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="premium-card p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo Mã Hộ (HK001...), Tên Chủ Hộ, Số CCCD, Địa chỉ, Số điện thoại..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Grid / Table Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Dạng thẻ (Cards Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Dạng bảng (Data Table)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Filter Pills (Tổ 1 - 8) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-extrabold text-slate-400 shrink-0 mr-1">TỔ:</span>
          {['ALL', 'Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8', 'Chưa rõ tổ'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTo(t);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-colors cursor-pointer ${
                selectedTo === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              {t === 'ALL' ? 'Tất cả hộ' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Households Grid or Table */}
      {paginatedHoKhau.length === 0 ? (
        <div className="premium-card p-12 rounded-3xl text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
          <h4 className="font-bold text-slate-800 text-base">Không tìm thấy sổ hộ khẩu nào</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi từ khóa hoặc bộ lọc tổ dân cư.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {paginatedHoKhau.map((hk) => {
            const memberCount = nhanKhauList.filter((r) => r.ma_ho === hk.ma_ho).length;
            const hasGps = !!(hk.lat && hk.lng);
            return (
              <div
                key={hk.id}
                onClick={() => onSelectHoKhau(hk)}
                className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-4 sm:p-4.5 cursor-pointer flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-xs font-mono shadow-md shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
                        {hk.ma_ho.replace('HK', '')}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                          {hk.ten_chu_ho}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-xs text-indigo-600 font-black">{hk.ma_ho}</span>
                          {hasGps && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>GPS</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      {hk.to_dan_cu}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-slate-500 truncate text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hk.dia_chi}</span>
                    </div>

                    {hk.so_dien_thoai && (
                      <div className="flex items-center gap-1.5 font-mono text-slate-700 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{hk.so_dien_thoai}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600 font-semibold">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span><strong className="text-slate-900 font-bold">{memberCount || hk.so_nhan_khau}</strong> nhân khẩu</span>
                  </div>

                  <div className="flex items-center gap-0.5 text-indigo-600 font-extrabold group-hover:translate-x-1 transition-transform text-[11px]">
                    <span>Xem sổ hộ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="premium-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Mã Hộ</th>
                  <th className="px-4 py-3">Chủ Hộ Gia Đình</th>
                  <th className="px-3 py-3">Số CCCD</th>
                  <th className="px-3 py-3">Tổ Dân Cư</th>
                  <th className="px-3 py-3">Nhân Khẩu</th>
                  <th className="px-3 py-3">Điện Thoại</th>
                  <th className="px-4 py-3">Địa Chỉ</th>
                  <th className="px-3 py-3 text-center">Tọa Độ GPS</th>
                  <th className="px-4 py-3 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedHoKhau.map((hk) => {
                  const memberCount = nhanKhauList.filter((r) => r.ma_ho === hk.ma_ho).length;
                  const hasGps = !!(hk.lat && hk.lng);
                  return (
                    <tr
                      key={hk.id}
                      onClick={() => onSelectHoKhau(hk)}
                      className="hover:bg-indigo-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-indigo-600">{hk.ma_ho}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{hk.ten_chu_ho}</td>
                      <td className="px-3 py-3 font-mono text-slate-600">{hk.so_cmnd_chu_ho || '-'}</td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {hk.to_dan_cu}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-bold text-slate-900">{memberCount || hk.so_nhan_khau}</span> người
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-600">{hk.so_dien_thoai || '-'}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{hk.dia_chi}</td>
                      <td className="px-3 py-3 text-center">
                        {hasGps ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>Đã ghim</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Chưa ghim</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-indigo-600 font-bold hover:underline">Chi tiết</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="premium-card p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Trang <strong className="text-slate-900 font-bold">{currentPage}</strong> / {totalPages} (Tổng {totalItems} hộ)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-xl">
              {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
