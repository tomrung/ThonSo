import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Pin, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  AlertTriangle, 
  HeartHandshake, 
  FileText, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  Clock, 
  Send,
  ThumbsUp,
  MessageSquare,
  Share2,
  CheckCircle2,
  CornerDownRight,
  HelpCircle,
  Phone,
  MapPin,
  Check
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ThongBao, BinhLuanThongBao } from '../types';
import { RichTextEditor } from '../components/RichTextEditor';
import { RichContentRenderer } from '../components/RichContentRenderer';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

const CATEGORIES: Record<string, { id: string; label: string; icon: any; color: string; badge: string }> = {
  ALL: { id: 'ALL', label: 'Tất cả tin tức', icon: Bell, color: 'text-sky-600', badge: 'bg-sky-100 text-sky-800' },
  khancap: { id: 'khancap', label: 'Khẩn Cấp', icon: AlertTriangle, color: 'text-rose-600', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
  lichhop: { id: 'lichhop', label: 'Lịch Họp Thôn', icon: Calendar, color: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  y_te: { id: 'y_te', label: 'Y Tế & Tiêm Chủng', icon: HeartHandshake, color: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  chinh_sach: { id: 'chinh_sach', label: 'Chính Sách & An Sinh', icon: FileText, color: 'text-purple-600', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
  thong_bao_chung: { id: 'thong_bao_chung', label: 'Thông Báo Chung', icon: Bell, color: 'text-amber-600', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
};

export const ThongBaoPage: React.FC = () => {
  const { 
    thongBaoList, 
    binhLuanList,
    addThongBao, 
    updateThongBao, 
    deleteThongBao, 
    toggleGhimThongBao, 
    increaseViewCount,
    toggleLikeThongBao,
    addBinhLuan,
    replyBinhLuan,
    deleteBinhLuan
  } = useData();

  const { currentUser, canPostAnnouncement, canEditAnnouncement, canDeleteAnnouncement, isAdmin, isTruongThon } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPhamVi, setSelectedPhamVi] = useState<string>('ALL');

  // Modal states
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ThongBao | null>(null);
  const [viewingPost, setViewingPost] = useState<ThongBao | null>(null);

  // Form states for Post
  const [formTieuDe, setFormTieuDe] = useState('');
  const [formNoiDung, setFormNoiDung] = useState('');
  const [formLoaiTin, setFormLoaiTin] = useState<ThongBao['loai_tin']>('thong_bao_chung');
  const [formPhamVi, setFormPhamVi] = useState('Toàn thôn');
  const [formIsGhim, setFormIsGhim] = useState(false);
  const [formIsCongKhai, setFormIsCongKhai] = useState(true);
  const [formHinhAnhUrl, setFormHinhAnhUrl] = useState('');

  // Form states for Citizen Question / Comment
  const [commentName, setCommentName] = useState(currentUser?.ho_ten || '');
  const [commentPhone, setCommentPhone] = useState(currentUser?.so_dien_thoai || '');
  const [commentTo, setCommentTo] = useState(currentUser?.to_phu_trach || 'Tổ 1');
  const [commentContent, setCommentContent] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter announcements
  const filteredList = thongBaoList.filter((tb) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = tb.tieu_de.toLowerCase().includes(q) || tb.noi_dung.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory !== 'ALL' && tb.loai_tin !== selectedCategory) {
      return false;
    }
    if (selectedPhamVi !== 'ALL' && tb.pham_vi !== selectedPhamVi) {
      return false;
    }
    return true;
  });

  const pinnedList = filteredList.filter((tb) => tb.is_ghim);
  const normalList = filteredList.filter((tb) => !tb.is_ghim);

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormTieuDe('');
    setFormNoiDung('');
    setFormLoaiTin('thong_bao_chung');
    setFormPhamVi(currentUser?.to_phu_trach !== 'Toàn thôn' ? currentUser?.to_phu_trach || 'Toàn thôn' : 'Toàn thôn');
    setFormIsGhim(false);
    setFormIsCongKhai(true);
    setFormHinhAnhUrl('');
    setIsPostModalOpen(true);
  };

  const handleOpenEditModal = (tb: ThongBao) => {
    setEditingPost(tb);
    setFormTieuDe(tb.tieu_de);
    setFormNoiDung(tb.noi_dung);
    setFormLoaiTin(tb.loai_tin);
    setFormPhamVi(tb.pham_vi);
    setFormIsGhim(tb.is_ghim);
    setFormIsCongKhai(tb.is_cong_khai);
    setFormHinhAnhUrl(tb.hinh_anh_url || '');
    setIsPostModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTieuDe.trim() || !formNoiDung.trim()) return;

    if (editingPost) {
      await updateThongBao(editingPost.id, {
        tieu_de: formTieuDe,
        noi_dung: formNoiDung,
        loai_tin: formLoaiTin,
        pham_vi: formPhamVi,
        is_ghim: formIsGhim,
        is_cong_khai: formIsCongKhai,
        hinh_anh_url: formHinhAnhUrl || null,
      });
    } else {
      await addThongBao({
        tieu_de: formTieuDe,
        noi_dung: formNoiDung,
        loai_tin: formLoaiTin,
        pham_vi: formPhamVi,
        is_ghim: formIsGhim,
        is_cong_khai: formIsCongKhai,
        hinh_anh_url: formHinhAnhUrl || null,
      });
    }
    setIsPostModalOpen(false);
  };

  const handleDelete = async (tb: ThongBao) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản tin "${tb.tieu_de}"?`)) {
      await deleteThongBao(tb.id);
      if (viewingPost?.id === tb.id) {
        setViewingPost(null);
      }
    }
  };

  const handleViewPost = (tb: ThongBao) => {
    increaseViewCount(tb.id);
    setViewingPost(tb);
    if (currentUser) {
      setCommentName(currentUser.ho_ten);
      setCommentPhone(currentUser.so_dien_thoai || '');
      setCommentTo(currentUser.to_phu_trach !== 'Toàn thôn' ? currentUser.to_phu_trach : 'Tổ 1');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingPost || !commentContent.trim() || !commentName.trim()) return;

    await addBinhLuan({
      thong_bao_id: viewingPost.id,
      ho_ten_nguoi_gui: commentName.trim(),
      so_dien_thoai: commentPhone.trim(),
      to_dan_cu: commentTo,
      noi_dung: commentContent.trim(),
    });

    setCommentContent('');
  };

  const handleSendOfficerReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    await replyBinhLuan(commentId, replyText.trim());
    setReplyingCommentId(null);
    setReplyText('');
  };

  const handleCopyShareLink = (tb: ThongBao) => {
    navigator.clipboard.writeText(`${window.location.origin}#thong-bao-${tb.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const canCreate = canPostAnnouncement();

  // Comments for currently viewing post
  const currentComments = viewingPost ? binhLuanList.filter((b) => b.thong_bao_id === viewingPost.id) : [];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner Header Standardized */}
      <PageHeaderBanner
        icon={<Bell className="w-6 h-6 text-white" />}
        iconBgClass="from-amber-500 via-orange-500 to-rose-600 text-white shadow-amber-500/25"
        badge={{
          text: 'Truyền Thông & Điều Hành Cơ Sở',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />,
          colorClass: 'bg-amber-500/20 text-amber-200 border-amber-400/30'
        }}
        subBadge={{
          text: `${thongBaoList.length} Bản Tin Điều Hành`,
          icon: <Calendar className="w-3.5 h-3.5 text-orange-300" />,
          colorClass: 'bg-white/10 text-slate-200 border-white/15'
        }}
        title="Bản Tin & Thông Báo Thôn An Trạch"
        description="Kênh truyền thông chính thống, phát thông báo khẩn cấp, lịch họp dân, chiến dịch y tế tiêm chủng và tương tác hỏi đáp hai chiều giữa Nhân dân và Ban Nhân Dân Thôn."
        theme="amber"
        actions={
          canCreate ? (
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Đăng Bản Tin Mới</span>
            </button>
          ) : (
            <div className="text-xs text-slate-300 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
              🔒 Đăng nhập tài khoản cán bộ để đăng bài
            </div>
          )
        }
      />

      {/* Filter & Search Bar */}
      <div className="premium-card p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bản tin theo tiêu đề, nội dung chính sách, lịch họp..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPhamVi}
              onChange={(e) => setSelectedPhamVi(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700"
            >
              <option value="ALL">Toàn bộ phạm vi</option>
              <option value="Toàn thôn">Phạm vi Toàn thôn</option>
              {['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.color}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: PINNED ANNOUNCEMENTS */}
      {pinnedList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-rose-600">
            <Pin className="w-4 h-4 fill-rose-600 rotate-45" />
            <span>Bản Tin Ghim Nổi Bật ({pinnedList.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedList.map((tb) => {
              const catMeta = CATEGORIES[tb.loai_tin] || CATEGORIES.thong_bao_chung;
              const commentCount = binhLuanList.filter((b) => b.thong_bao_id === tb.id).length;
              return (
                <div
                  key={tb.id}
                  className="p-5 rounded-3xl border-2 border-rose-200 bg-linear-to-br from-rose-50/60 via-white to-white shadow-card hover:border-rose-400 transition-all space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border ${catMeta.badge}`}>
                          {catMeta.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {tb.pham_vi}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-[10px] font-extrabold text-rose-700 uppercase">Ghim</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => handleViewPost(tb)}
                      className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      {tb.tieu_de}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{tb.noi_dung}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="font-bold text-slate-800">{tb.nguoi_dang_ten}</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <ThumbsUp className="w-3 h-3 text-sky-500" />
                        <span>{tb.so_luot_thich || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MessageSquare className="w-3 h-3 text-amber-500" />
                        <span>{commentCount} hỏi đáp</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {canEditAnnouncement(tb) && (
                        <button
                          onClick={() => handleOpenEditModal(tb)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-700 hover:bg-sky-50"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canDeleteAnnouncement(tb) && (
                        <button
                          onClick={() => handleDelete(tb)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                          title="Xóa tin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleViewPost(tb)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                      >
                        <span>Đọc & Đặt câu hỏi</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: ALL ANNOUNCEMENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Danh Sách Bản Tin ({normalList.length})</span>
        </div>

        {normalList.length === 0 && pinnedList.length === 0 ? (
          <div className="premium-card p-12 rounded-3xl text-center space-y-3">
            <Bell className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
            <h4 className="font-bold text-slate-800 text-base">Không tìm thấy bản tin nào</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục thể loại khác.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {normalList.map((tb) => {
              const catMeta = CATEGORIES[tb.loai_tin] || CATEGORIES.thong_bao_chung;
              const commentCount = binhLuanList.filter((b) => b.thong_bao_id === tb.id).length;
              return (
                <div
                  key={tb.id}
                  className="premium-card p-5 rounded-3xl space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border ${catMeta.badge}`}>
                        {catMeta.label}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {tb.pham_vi}
                      </span>
                    </div>

                    <h3
                      onClick={() => handleViewPost(tb)}
                      className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-sky-700 transition-colors cursor-pointer"
                    >
                      {tb.tieu_de}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{tb.noi_dung}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[130px]">
                        {tb.nguoi_dang_ten}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{new Date(tb.created_at).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="w-2.5 h-2.5 text-amber-500" />
                          {commentCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(isAdmin || isTruongThon) && (
                        <button
                          onClick={() => toggleGhimThongBao(tb.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          title="Ghim lên đầu trang"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canEditAnnouncement(tb) && (
                        <button
                          onClick={() => handleOpenEditModal(tb)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-700 hover:bg-sky-50"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {canDeleteAnnouncement(tb) && (
                        <button
                          onClick={() => handleDelete(tb)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                          title="Xóa tin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleViewPost(tb)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-xl font-bold text-[11px] transition-colors"
                      >
                        Đọc & Hỏi
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE / EDIT ANNOUNCEMENT ================= */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl gradient-gov text-white flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingPost ? 'Chỉnh Sửa Bản Tin' : 'Đăng Bản Tin Mới'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Phân quyền đăng tin theo chính sách Supabase RLS</p>
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bản tin *</label>
                <input
                  type="text"
                  value={formTieuDe}
                  onChange={(e) => setFormTieuDe(e.target.value)}
                  placeholder="VD: Thông báo lịch tiêm chủng mở rộng cho trẻ em tháng 8..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-900 text-xs focus:bg-white focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thể loại thông báo</label>
                  <select
                    value={formLoaiTin}
                    onChange={(e) => setFormLoaiTin(e.target.value as ThongBao['loai_tin'])}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800"
                  >
                    <option value="thong_bao_chung">Thông Báo Chung</option>
                    <option value="khancap">Khẩn Cấp</option>
                    <option value="lichhop">Lịch Họp Thôn</option>
                    <option value="y_te">Y Tế & Tiêm Chủng</option>
                    <option value="chinh_sach">Chính Sách & An Sinh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phạm vi thông báo</label>
                  <select
                    value={formPhamVi}
                    disabled={currentUser?.vai_tro === 'to_truong' && currentUser.to_phu_trach !== 'Toàn thôn'}
                    onChange={(e) => setFormPhamVi(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800 disabled:opacity-60"
                  >
                    <option value="Toàn thôn">Toàn thôn An Trạch</option>
                    {['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Nội dung chi tiết & Đa phương tiện *
                </label>
                <RichTextEditor
                  value={formNoiDung}
                  onChange={setFormNoiDung}
                  placeholder="Soạn nội dung chi tiết... Có thể nhúng video YouTube, hình ảnh, bảng biểu..."
                  minHeight="220px"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn hình ảnh minh họa (tùy chọn)</label>
                <input
                  type="text"
                  value={formHinhAnhUrl}
                  onChange={(e) => setFormHinhAnhUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                {(isAdmin || isTruongThon) && (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsGhim}
                      onChange={(e) => setFormIsGhim(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="font-bold text-slate-700">Ghim bản tin lên đầu trang</span>
                  </label>
                )}

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsCongKhai}
                    onChange={(e) => setFormIsCongKhai(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="font-bold text-slate-700">Công khai cho toàn dân</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl gradient-gov text-white font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{editingPost ? 'Cập Nhật Bản Tin' : 'Đăng Bản Tin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW DETAILS & CITIZEN Q&A ================= */}
      {viewingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border ${CATEGORIES[viewingPost.loai_tin]?.badge || CATEGORIES.thong_bao_chung.badge}`}>
                  {CATEGORIES[viewingPost.loai_tin]?.label || 'Thông Báo'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {viewingPost.pham_vi}
                </span>
              </div>
              <button
                onClick={() => setViewingPost(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Article Header */}
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {viewingPost.tieu_de}
                </h2>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Đăng bởi: <strong className="text-slate-800">{viewingPost.nguoi_dang_ten}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(viewingPost.created_at).toLocaleString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1 text-sky-700 font-bold">
                      <Eye className="w-3.5 h-3.5" />
                      {viewingPost.luot_xem || 1} lượt xem
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {viewingPost.hinh_anh_url && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs max-h-80">
                  <img
                    src={viewingPost.hinh_anh_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Body Text */}
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                <RichContentRenderer content={viewingPost.noi_dung} />
              </div>

              {/* Government Stamp Callout */}
              <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-sky-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Bản tin chính thống được ban hành bởi Ban Nhân Dân Thôn An Trạch.</span>
                </div>
              </div>

              {/* Interactive Reactions Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLikeThongBao(viewingPost.id)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-sky-600" />
                    <span>Hữu ích ({viewingPost.so_luot_thich || 0})</span>
                  </button>

                  <div className="px-3 py-1.5 rounded-xl bg-white text-slate-700 font-bold border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentComments.length} Ý kiến / Câu hỏi</span>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyShareLink(viewingPost)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Đã chép link' : 'Chia sẻ'}</span>
                </button>
              </div>

              {/* SECTION: CITIZEN Q&A (HỎI ĐÁP & Ý KIẾN BÀ CON) */}
              <div className="space-y-4 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        Hỏi Đáp & Ý Kiến Của Người Dân
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Bà con đặt câu hỏi sẽ được Ban Nhân Dân Thôn tiếp nhận và giải đáp trực tiếp
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-700 px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100">
                    {currentComments.length} câu hỏi
                  </span>
                </div>

                {/* Question Form for Citizens */}
                <form onSubmit={handleSubmitComment} className="p-4 rounded-2xl bg-linear-to-br from-indigo-50/40 via-white to-white border border-indigo-200/80 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Họ và tên của bạn *</label>
                      <input
                        type="text"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="VD: Đinh Thị Em..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                      <input
                        type="tel"
                        value={commentPhone}
                        onChange={(e) => setCommentPhone(e.target.value)}
                        placeholder="0905... (để nhận phản hồi)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tổ Dân Cư</label>
                      <select
                        value={commentTo}
                        onChange={(e) => setCommentTo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-400"
                      >
                        {['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nội dung câu hỏi / thắc mắc cần giải đáp *</label>
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Nhập câu hỏi hoặc thắc mắc của bạn về thông báo này (VD: Lịch làm việc của Tổ 3, giấy tờ cần mang theo...)"
                      rows={3}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 leading-relaxed focus:ring-2 focus:ring-indigo-400"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 italic">
                      Câu hỏi sẽ được chuyển đến Cán bộ phụ trách để giải đáp công khai.
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl gradient-gov text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Câu Hỏi</span>
                    </button>
                  </div>
                </form>

                {/* List of Questions & Official Answers */}
                <div className="space-y-3 pt-2">
                  {currentComments.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl space-y-1">
                      <p className="text-xs text-slate-500 font-medium">Chưa có câu hỏi nào cho bản tin này.</p>
                      <p className="text-[11px] text-slate-400">Bà con có thắc mắc hãy gửi câu hỏi ở khung phía trên.</p>
                    </div>
                  ) : (
                    currentComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs hover:border-indigo-200 transition-colors"
                      >
                        {/* Citizen Question */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {comment.ho_ten_nguoi_gui.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-xs">{comment.ho_ten_nguoi_gui}</span>
                                {comment.to_dan_cu && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                                    {comment.to_dan_cu}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(comment.created_at).toLocaleString('vi-VN')}
                                </span>
                              </div>
                              <p className="text-xs text-slate-800 mt-1 leading-relaxed">{comment.noi_dung}</p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1">
                            {comment.da_tra_loi ? (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Đã giải đáp
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Chờ giải đáp
                              </span>
                            )}

                            {(isAdmin || isTruongThon) && (
                              <button
                                onClick={() => deleteBinhLuan(comment.id)}
                                className="p-1 rounded-lg text-slate-300 hover:text-rose-600"
                                title="Xóa câu hỏi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Official Answer from Officer */}
                        {comment.da_tra_loi && comment.tra_loi_noi_dung && (
                          <div className="ml-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="font-extrabold text-emerald-950 text-xs">
                                  {comment.tra_loi_boi_ten}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/70 text-emerald-800 font-bold">
                                  {comment.tra_loi_boi_chuc_danh || 'Cán Bộ Thôn'}
                                </span>
                              </div>
                              {comment.tra_loi_luc && (
                                <span className="text-[10px] text-emerald-700/70 font-mono">
                                  {new Date(comment.tra_loi_luc).toLocaleString('vi-VN')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-emerald-900 leading-relaxed">{comment.tra_loi_noi_dung}</p>
                          </div>
                        )}

                        {/* Officer Reply Form Button */}
                        {currentUser && (
                          <div className="pt-1 flex items-center justify-end">
                            {replyingCommentId === comment.id ? (
                              <div className="w-full space-y-2 pt-2 border-t border-slate-100">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder={`Nhập nội dung giải đáp chính thức cho bà con ${comment.ho_ten_nguoi_gui}...`}
                                  rows={2}
                                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setReplyingCommentId(null)}
                                    className="px-3 py-1 rounded-lg text-slate-500 text-xs hover:bg-slate-100"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    onClick={() => handleSendOfficerReply(comment.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                                  >
                                    <CornerDownRight className="w-3.5 h-3.5" />
                                    <span>Gửi Giải Đáp Chính Thức</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setReplyingCommentId(comment.id);
                                  setReplyText(comment.tra_loi_noi_dung || '');
                                }}
                                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 hover:underline"
                              >
                                <CornerDownRight className="w-3.5 h-3.5" />
                                <span>{comment.da_tra_loi ? 'Sửa câu trả lời' : 'Trả lời câu hỏi này (Cán bộ)'}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
