import React, { useState } from 'react';
import { X, Bell, Pin, Plus, Calendar, ShieldCheck, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { RichTextEditor } from './RichTextEditor';
import { RichContentRenderer } from './RichContentRenderer';

interface ThongBaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThongBaoModal: React.FC<ThongBaoModalProps> = ({ isOpen, onClose }) => {
  const { thongBaoList, addThongBao } = useData();
  const { currentUser } = useAuth();

  const [isCreating, setIsCreating] = useState(false);
  const [tieuDe, setTieuDe] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [loaiTin, setLoaiTin] = useState<'thong_bao_chung' | 'khancap' | 'lichhop' | 'y_te' | 'chinh_sach'>('thong_bao_chung');
  const [phamVi, setPhamVi] = useState(currentUser?.to_phu_trach || 'Toàn thôn');
  const [isGhim, setIsGhim] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDe || !noiDung) return;

    await addThongBao({
      tieu_de: tieuDe,
      noi_dung: noiDung,
      loai_tin: loaiTin,
      pham_vi: phamVi,
      is_ghim: isGhim,
      is_cong_khai: true,
    });

    setTieuDe('');
    setNoiDung('');
    setIsCreating(false);
  };

  const getBadgeType = (type: string) => {
    switch (type) {
      case 'khancap': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'y_te': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'chinh_sach': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lichhop': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Bản Tin & Thông Báo Thôn An Trạch</h3>
              <p className="text-xs text-slate-500">Thông báo chính sách, y tế và hoạt động thôn</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Đăng tin mới
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Create Form */}
          {isCreating && (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-sky-900">Tạo Thông Báo Mới</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Hủy
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  value={tieuDe}
                  onChange={(e) => setTieuDe(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                  placeholder="Ví dụ: Lịch tiêm phòng BHYT trẻ em tháng 8..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Loại tin</label>
                  <select
                    value={loaiTin}
                    onChange={(e: any) => setLoaiTin(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="thong_bao_chung">Thông báo chung</option>
                    <option value="y_te">Y tế & BHYT</option>
                    <option value="chinh_sach">Chính sách xã hội</option>
                    <option value="lichhop">Lịch họp dân cư</option>
                    <option value="khancap">Khẩn cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phạm vi áp dụng</label>
                  <select
                    value={phamVi}
                    onChange={(e) => setPhamVi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Toàn thôn">Toàn thôn</option>
                    <option value="Tổ 1">Tổ 1</option>
                    <option value="Tổ 2">Tổ 2</option>
                    <option value="Tổ 3">Tổ 3</option>
                    <option value="Tổ 4">Tổ 4</option>
                    <option value="Tổ 5">Tổ 5</option>
                    <option value="Tổ 6">Tổ 6</option>
                    <option value="Tổ 7">Tổ 7</option>
                    <option value="Tổ 8">Tổ 8</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung chi tiết & Đa phương tiện *
                </label>
                <RichTextEditor
                  value={noiDung}
                  onChange={setNoiDung}
                  placeholder="Nhập nội dung thông báo... Có thể nhúng video YouTube, hình ảnh..."
                  minHeight="180px"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGhim}
                    onChange={(e) => setIsGhim(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  Ghim lên đầu bảng tin
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Đăng Thông Báo
                </button>
              </div>
            </form>
          )}

          {/* Announcement List */}
          <div className="space-y-3">
            {thongBaoList.map((tb) => (
              <div
                key={tb.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white shadow-subtle transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {tb.is_ghim && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        <Pin className="w-3 h-3" /> Đã ghim
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getBadgeType(tb.loai_tin)}`}>
                      {tb.loai_tin === 'y_te' ? 'Y tế & BHYT' : tb.loai_tin === 'chinh_sach' ? 'Chính sách' : 'Thông báo'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {tb.pham_vi}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {new Date(tb.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{tb.tieu_de}</h4>
                <div className="text-xs text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                  <RichContentRenderer content={tb.noi_dung} />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Người đăng: <strong className="text-slate-700 font-semibold">{tb.nguoi_dang_ten}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
