import React from 'react';
import { 
  Users, 
  Building2, 
  CreditCard, 
  HeartHandshake, 
  Briefcase, 
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useData } from '../context/DataContext';

export const StatsOverview: React.FC = () => {
  const { nhanKhauList, kpiStats } = useData();

  // 1. Thống kê theo 8 Tổ
  const toData = [
    { name: 'Tổ 1', count: 0, thuongTru: 0 },
    { name: 'Tổ 2', count: 0, thuongTru: 0 },
    { name: 'Tổ 3', count: 0, thuongTru: 0 },
    { name: 'Tổ 4', count: 0, thuongTru: 0 },
    { name: 'Tổ 5', count: 0, thuongTru: 0 },
    { name: 'Tổ 6', count: 0, thuongTru: 0 },
    { name: 'Tổ 7', count: 0, thuongTru: 0 },
    { name: 'Tổ 8', count: 0, thuongTru: 0 },
    { name: 'Chưa rõ tổ', count: 0, thuongTru: 0 },
  ];

  nhanKhauList.forEach((r) => {
    const to = r.to_dan_cu || 'Chưa rõ tổ';
    const found = toData.find((t) => t.name === to || (to === 'Chưa rõ tổ' && t.name === 'Chưa rõ tổ'));
    if (found) {
      found.count++;
      if (r.trang_thai_cu_tru === 'Đang thường trú' || r.trang_thai_cu_tru?.includes('Trẻ mới sinh')) {
        found.thuongTru++;
      }
    }
  });

  // 2. Thống kê theo Nhóm tuổi
  const ageData = [
    { name: '0-5 tuổi', label: 'Mầm non', value: 0, color: '#38bdf8', icon: '👶' },
    { name: '6-14 tuổi', label: 'Tiểu học & THCS', value: 0, color: '#0284c7', icon: '🎒' },
    { name: '15-59 tuổi', label: 'Độ tuổi lao động', value: 0, color: '#10b981', icon: '💼' },
    { name: '60-74 tuổi', label: 'Người cao tuổi', value: 0, color: '#f59e0b', icon: '🧓' },
    { name: '75+ tuổi', label: 'Đại thọ & Trợ cấp', value: 0, color: '#8b5cf6', icon: '🎖️' },
  ];

  nhanKhauList.forEach((r) => {
    if (r.nam_sinh) {
      if (r.nam_sinh > 2020) ageData[0].value++;
      else if (r.nam_sinh > 2011) ageData[1].value++;
      else if (r.nam_sinh >= 1966) ageData[2].value++;
      else if (r.nam_sinh >= 1951) ageData[3].value++;
      else ageData[4].value++;
    }
  });

  // 3. Cơ cấu Giới tính
  const nuCount = nhanKhauList.filter((r) => r.gioi_tinh === 'Nữ').length;
  const namCount = nhanKhauList.filter((r) => r.gioi_tinh === 'Nam').length;
  const genderData = [
    { name: 'Nữ', value: nuCount, color: '#f43f5e' },
    { name: 'Nam', value: namCount, color: '#0284c7' },
  ];

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-800 text-xs backdrop-blur-md">
          <div className="font-extrabold text-sky-400 mb-1">{label}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                Tổng nhân khẩu:
              </span>
              <strong className="text-white font-bold">{payload[0]?.value} người</strong>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-300" />
                Thường trú thực tế:
              </span>
              <strong className="text-white font-bold">{payload[1]?.value} người</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 6 Metric KPI Highlight Cards - Perfectly Balanced & Ultra Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Card 1: Tổng Dân Số */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Tổng Dân Số
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
                {kpiStats.thuongTru.toLocaleString('vi-VN')}
              </strong>
            </div>
          </div>
        </div>

        {/* Card 2: Hộ Khẩu */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
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
              <span className="text-slate-500 font-medium">Bình quân:</span>
              <strong className="text-indigo-700 font-extrabold bg-indigo-50 px-1.5 py-0.2 rounded-md border border-indigo-100">
                3.76 <span className="font-normal text-[10px] text-slate-500">khẩu</span>
              </strong>
            </div>
          </div>
        </div>

        {/* Card 3: Lao động */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Lao Động
            </span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              {kpiStats.laoDong.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Tỷ lệ:</span>
              <strong className="text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-100">
                {Math.round((kpiStats.laoDong / kpiStats.totalResidents) * 100)}%
              </strong>
            </div>
          </div>
        </div>

        {/* Card 4: Cao tuổi */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Cao Tuổi (&gt;60)
            </span>
            <div className="w-8 h-8 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {kpiStats.caoTuoi.toLocaleString('vi-VN')}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Trợ cấp 75+:</span>
              <strong className="text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-100">
                191
              </strong>
            </div>
          </div>
        </div>

        {/* Card 5: Định danh CCCD */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Định Danh CCCD
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
              <span className="text-slate-500 font-medium">Bao phủ:</span>
              <strong className="text-purple-700 font-extrabold bg-purple-50 px-1.5 py-0.2 rounded-md border border-purple-100">
                {Math.round((kpiStats.coCCCD / kpiStats.totalResidents) * 100)}%
              </strong>
            </div>
          </div>
        </div>

        {/* Card 6: Bảo hiểm y tế */}
        <div className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[148px]">
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
              <span className="text-slate-500 font-medium">Đã cấp thẻ:</span>
              <strong className="text-rose-700 font-extrabold bg-rose-50 px-1.5 py-0.2 rounded-md border border-rose-100">
                {Math.round((kpiStats.coBHYT / kpiStats.totalResidents) * 100)}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Bar Chart (8 Tổ Dân Cư) */}
        <div className="lg:col-span-8 premium-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Phân Bổ Dân Cư Theo 8 Tổ Dân Cư</h4>
              <p className="text-xs text-slate-500">So sánh tổng nhân khẩu và số lượng thường trú thực tế</p>
            </div>
            <span className="text-[11px] font-extrabold text-sky-700 bg-sky-50 border border-sky-200/80 px-2.5 py-1 rounded-xl self-start sm:self-auto">
              8 Tổ Dân Cư
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={toData} 
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                  dy={6}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '10px', fontWeight: 600 }} 
                />
                <Bar dataKey="count" name="Tổng nhân khẩu" fill="url(#barGrad1)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="thuongTru" name="Thường trú" fill="url(#barGrad2)" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Donut Chart Giới tính & BHYT */}
        <div className="lg:col-span-4 premium-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Tỷ Lệ Giới Tính</h4>
              <span className="text-[11px] font-bold text-slate-400">2.308 nhân khẩu</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Cơ cấu Nữ / Nam Thôn An Trạch</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '14px', fontSize: '12px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-extrabold text-slate-900">52.0%</span>
              <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider">Tỷ lệ Nữ</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-rose-50/80 border border-rose-100 text-rose-950">
              <span className="text-[11px] text-rose-600 font-bold block">Nữ giới</span>
              <span className="font-extrabold text-base block">{nuCount}</span>
              <span className="text-[10px] text-rose-700 font-semibold">{Math.round((nuCount / kpiStats.totalResidents) * 100)}%</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-sky-50/80 border border-sky-100 text-sky-950">
              <span className="text-[11px] text-sky-600 font-bold block">Nam giới</span>
              <span className="font-extrabold text-base block">{namCount}</span>
              <span className="text-[10px] text-sky-700 font-semibold">{Math.round((namCount / kpiStats.totalResidents) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: 5 Age Groups Breakdown */}
      <div className="premium-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Cơ Cấu Dân Số Theo 5 Nhóm Độ Tuổi</h4>
            <p className="text-xs text-slate-500">Phục vụ công tác tiêm chủng mầm non, tuyển sinh giáo dục và chính sách an sinh xã hội</p>
          </div>
          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl self-start sm:self-auto">
            Tháp Độ Tuổi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ageData.map((item, idx) => {
            const pct = Math.round((item.value / kpiStats.totalResidents) * 100);
            return (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70 flex flex-col justify-between hover:border-sky-300 hover:bg-white transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {pct}%
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-[11px] text-slate-500 block truncate">{item.label}</span>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900">{item.value}</span>
                  <span className="text-[11px] text-slate-400">công dân</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
