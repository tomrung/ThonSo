import React from 'react';
import { Layers, HeartHandshake, Sparkles, ShieldCheck, RefreshCw, Sprout, Wheat, ArrowUpRight, MapPin, Scale, BarChart3, Activity } from 'lucide-react';
import { StatsOverview } from '../components/StatsOverview';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { useData } from '../context/DataContext';
import { NhanKhau } from '../types';

interface DashboardPageProps {
  onSelectResident: (resident: NhanKhau) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectResident, onNavigateToTab }) => {
  const { nhanKhauList, sanXuatList } = useData();

  // Thống kê nông nghiệp
  const totalAgriArea = sanXuatList.reduce((s, r) => s + (r.dien_tich_m2 || 0), 0);
  const totalAgriSeed = sanXuatList.reduce((s, r) => s + (r.giong_cap_kg || 0), 0);

  // Danh sách các trường hợp chính sách / sức khỏe đặc thù
  const specialResidents = nhanKhauList.filter(
    (r) => r.doi_tuong_dac_thu && r.doi_tuong_dac_thu !== 'Bình thường'
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner Header Standardized */}
      <PageHeaderBanner
        icon={<BarChart3 className="w-6 h-6 text-white" />}
        iconBgClass="from-emerald-600 via-teal-600 to-sky-600 text-white shadow-emerald-500/25"
        badge={{
          text: 'Trung Tâm Điều Hành & Giám Sát Dữ Liệu',
          icon: <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />,
          colorClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
        }}
        subBadge={{
          text: 'Live Data • Thời Gian Thực',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
          colorClass: 'bg-amber-500/15 text-amber-200 border-amber-400/25'
        }}
        title="Báo Cáo Phân Tích & Giám Sát Dân Số (BI Dashboard)"
        description="Tổng hợp chỉ số KPI nhân khẩu học, cơ cấu độ tuổi lao động, diện đối tượng an sinh BHYT và số liệu sản xuất nông nghiệp 5 xứ đồng."
        theme="emerald"
        actions={
          <>
            {onNavigateToTab && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('nhan-khau')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
                >
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Dân Cư (2.308)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToTab('nong-nghiep')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400"
                >
                  <Wheat className="w-4 h-4 text-slate-950" />
                  <span>Nông Nghiệp (647 Thửa)</span>
                </button>
              </>
            )}
          </>
        }
      />

      {/* Main Charts & Statistics */}
      <StatsOverview />

      {/* Agricultural Production Summary Section */}
      <div className="premium-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Sản Xuất Nông Nghiệp & Mùa Vụ (Vụ Đông Xuân 2025 - 2026)
              </h3>
              <p className="text-xs text-slate-500">
                Phối hợp BND Thôn An Trạch & HTX Hòa Tiến 2 điều phối 5,26 tấn lúa giống trên 43,86 ha đất lúa
              </p>
            </div>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('nong-nghiep')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span>Xem sổ bộ chi tiết</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Tổng diện tích lúa</span>
              <Wheat className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {(totalAgriArea / 10000).toFixed(2)} <span className="text-xs font-normal text-slate-500">ha</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold font-mono">
              {totalAgriArea.toLocaleString()} m² mặt ruộng
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Số lô thửa canh tác</span>
              <MapPin className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {sanXuatList.length} <span className="text-xs font-normal text-slate-500">thửa</span>
            </div>
            <div className="text-[10px] text-sky-700 font-bold">
              Phân bố trên 5 Xứ Đồng lớn
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Lúa giống HTX cấp</span>
              <Scale className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-slate-900">
              {(totalAgriSeed / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-500">tấn</span>
            </div>
            <div className="text-[10px] text-amber-700 font-bold">
              Định mức 12kg / 1.000m²
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Cơ cấu 3 giống lúa</span>
              <Sprout className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xs font-black text-slate-900 pt-1 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-emerald-700 font-bold">HG12:</span>
                <span>46.8% (20.5 ha)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700 font-bold">HG244:</span>
                <span>43.3% (19.0 ha)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700 font-bold">J02:</span>
                <span>9.9% (4.3 ha)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Policy Beneficiaries Section */}
      <div className="premium-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Đối Tượng Chính Sách & Sức Khỏe Đặc Thù ({specialResidents.length} người)
              </h3>
              <p className="text-xs text-slate-500">
                Người cao tuổi già yếu, hộ nghèo, thương binh, người già neo đơn cần hỗ trợ an sinh xã hội
              </p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-1 rounded-xl self-start sm:self-auto">
            Ưu Tiên An Sinh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {specialResidents.map((r) => (
            <div
              key={r.id}
              onClick={() => onSelectResident(r)}
              className="p-3.5 rounded-2xl border border-rose-100 hover:border-rose-300 bg-rose-50/30 hover:bg-white transition-all cursor-pointer space-y-2 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs group-hover:text-rose-700 transition-colors">
                  {r.ho_ten}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                  {r.to_dan_cu}
                </span>
              </div>

              <div className="inline-block text-[11px] text-rose-700 font-bold px-2 py-0.5 rounded-md bg-rose-100/60 border border-rose-200/60">
                {r.doi_tuong_dac_thu}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1.5 border-t border-rose-100/60">
                <span>{r.tuoi} tuổi ({r.nam_sinh})</span>
                <span className="font-mono font-semibold text-slate-700">{r.ma_ho}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
