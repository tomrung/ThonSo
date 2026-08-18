import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Sparkles, 
  Table, 
  Minus, 
  CheckSquare, 
  HelpCircle,
  X,
  Play,
  Maximize2
} from 'lucide-react';
import { RichContentRenderer, YoutubeIcon } from './RichContentRenderer';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung chi tiết của bản tin thông báo...',
  minHeight = '240px'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeMode, setActiveMode] = useState<'edit' | 'preview'>('edit');
  
  // Modal states for inserting complex media
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [youtubeCaption, setYoutubeCaption] = useState('');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageCaption, setImageCaption] = useState('');

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Helper to insert markdown/tags around or at cursor position
  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultPlaceholder;

    const before = value.substring(0, start);
    const after = value.substring(end);

    const newContent = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  const handleInsertYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrlInput.trim()) return;

    // Standardize YouTube url to embed syntax: [youtube:URL|Caption]
    const tag = `\n\n[youtube:${youtubeUrlInput.trim()}|${youtubeCaption.trim() || 'Video từ YouTube'}]\n\n`;
    insertFormatting(tag, '', '');
    setYoutubeUrlInput('');
    setYoutubeCaption('');
    setIsYoutubeModalOpen(false);
  };

  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    const tag = `\n\n![${imageCaption.trim() || 'Hình ảnh đính kèm'}](${imageUrlInput.trim()})\n\n`;
    insertFormatting(tag, '', '');
    setImageUrlInput('');
    setImageCaption('');
    setIsImageModalOpen(false);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    const tag = `[${linkText.trim() || linkUrl.trim()}](${linkUrl.trim()})`;
    insertFormatting(tag, '', '');
    setLinkText('');
    setLinkUrl('');
    setIsLinkModalOpen(false);
  };

  const handleInsertCallout = (type: 'info' | 'warning' | 'success') => {
    let tag = '';
    if (type === 'info') tag = `\n> ℹ️ **LƯU Ý QUAN TRỌNG:**\n> Điền nội dung ghi chú hướng dẫn cho bà con tại đây...\n\n`;
    if (type === 'warning') tag = `\n> ⚠️ **CẢNH BÁO / KHẨN CẤP:**\n> Điền nội dung nhắc nhở chấp hành quy định...\n\n`;
    if (type === 'success') tag = `\n> ✅ **THÔNG TIN CHÍNH SÁCH / KẾT QUẢ:**\n> Điền nội dung kết quả thực hiện...\n\n`;
    insertFormatting(tag, '', '');
  };

  const handleInsertTable = () => {
    const tableTemplate = `\n\n| STT | Nội dung / Tiêu chí | Thời gian | Địa điểm |\n|---|---|---|---|\n| 01 | Rà soát thông tin cư trú | 08h00 - 11h30 | Nhà văn hóa thôn |\n| 02 | Hỗ trợ cấp định danh VNeID | 13h30 - 17h00 | Trụ sở thôn |\n\n`;
    insertFormatting(tableTemplate, '', '');
  };

  const handleInsertSampleTemplate = (type: 'bhyt' | 'hop_thon' | 'vneid') => {
    if (type === 'bhyt') {
      const template = `## Kế Hoạch Rà Soát Thẻ BHYT Hộ Gia Đình Năm 2026\n\nThực hiện chỉ đạo của UBND Xã Hòa Tiến, Ban nhân dân Thôn An Trạch triển khai kế hoạch rà soát và gia hạn thẻ Bảo hiểm y tế (BHYT) cho 2.308 nhân khẩu trên địa bàn thôn.\n\n> ℹ️ **THỜI GIAN VÀ ĐỊA ĐIỂM TIẾP NHẬN:**\n> - **Thời gian:** Từ ngày 15/08/2026 đến hết ngày 30/08/2026 (Buổi sáng 07h30 - 11h30, Buổi chiều 13h30 - 17h00)\n> - **Địa điểm:** Nhà Văn Hóa Thôn An Trạch (gặp Cán bộ Y tế và các Tổ trưởng)\n\n### 1. Thành Phần Hồ Sơ Cần Mang Theo\n- Thẻ CCCD gắn chip (hoặc ứng dụng VNeID mức 2 đã kích hoạt).\n- Thẻ BHYT hiện tại (hoặc mã số BHYT in trên sổ hộ gia đình).\n- Giấy xác nhận học sinh/sinh viên (đối với con em đang theo học các trường).\n\n### 2. Video Hướng Dẫn Tra Cứu Thẻ BHYT Trên Ứng Dụng VNeID\n[youtube:https://www.youtube.com/watch?v=dQw4w9WgXcQ|Hướng dẫn liên kết và xuất trình thẻ BHYT điện tử trên VNeID]\n\n| Tổ Dân Cư | Cán Bộ Phụ Trách | Số Điện Thoại Liên Hệ |\n|---|---|---|\n| Tổ 1, Tổ 2 | Bác sĩ Đinh Thị Lan | 0905 112 233 |\n| Tổ 3, Tổ 4 | Trưởng thôn Lê Văn A | 0905 445 566 |\n| Tổ 5 đến Tổ 8 | Đại diện Trạm Y Tế Xã | 0236 388 9999 |\n\nKính đề nghị toàn thể bà con nhân dân sắp xếp thời gian đến hoàn tất thủ tục để đảm bảo quyền lợi khám chữa bệnh!\n`;
      onChange(template);
    } else if (type === 'hop_thon') {
      const template = `## Giấy Triệu Tập Họp Nhân Dân Thôn An Trạch Tháng 8/2026\n\nBan Nhân Dân Thôn An Trạch trân trọng kính mời đại diện các hộ gia đình thuộc 8 Tổ dân cư đến tham dự buổi sinh hoạt định kỳ tháng 8/2026.\n\n> ⚠️ **NỘI DUNG CHÍNH CUỘC HỌP:**\n> 1. Báo cáo tình hình an ninh trật tự, vệ sinh môi trường nông thôn mới.\n> 2. Công khai các chỉ tiêu thu nộp quỹ và đóng góp xây dựng đường liên tổ.\n> 3. Lấy ý kiến nhân dân về phương án số hóa sổ hộ khẩu và thu thập dữ liệu định danh.\n\n[youtube:https://www.youtube.com/watch?v=dQw4w9WgXcQ|Video giới thiệu hệ thống Quản lý dân cư số Thôn An Trạch]\n\nKính mong các hộ gia đình có mặt đúng giờ để buổi họp đạt kết quả tốt nhất!\n`;
      onChange(template);
    } else if (type === 'vneid') {
      const template = `## Thông Báo Khẩn: Chiến Dịch Kích Hoạt Định Danh Điện Tử VNeID Mức 2\n\nThực hiện Đề án 06 của Chính phủ, Công an Xã Hòa Tiến phối hợp Ban Nhân dân Thôn An Trạch tổ chức đợt cao điểm hướng dẫn kích hoạt tài khoản định danh điện tử VNeID mức độ 2 cho công dân từ đủ 14 tuổi trở lên.\n\n> ✅ **QUYỀN LỢI KHI CÓ VNEID MỨC 2:**\n> - Thay thế hoàn toàn CCCD vật lý khi đi máy bay, khám chữa bệnh BHYT.\n> - Tích hợp Giấy phép lái xe, Đăng ký xe, Thông tin cư trú 2.308 nhân khẩu.\n\n[youtube:https://www.youtube.com/watch?v=dQw4w9WgXcQ|Clip hướng dẫn các bước cài đặt và tích hợp giấy tờ trên VNeID]\n`;
      onChange(template);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-2xs flex flex-col focus-within:border-sky-500 transition-all">
      
      {/* Top Toolbar Header */}
      <div className="bg-slate-100/90 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left: Formatting Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold, Italic, Underline */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'chữ in đậm')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="In đậm (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'chữ in nghiêng')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="In nghiêng (Italic)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('<u>', '</u>', 'gạch chân')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Gạch chân (Underline)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => insertFormatting('\n# ', '\n', 'Tiêu đề cấp 1')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Tiêu đề lớn (H1)"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n## ', '\n', 'Tiêu đề cấp 2')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Tiêu đề vừa (H2)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n### ', '\n', 'Tiêu đề cấp 3')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Tiêu đề nhỏ (H3)"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists & Quote */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => insertFormatting('\n- ', '', 'Mục danh sách')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Danh sách gạch đầu dòng"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n1. ', '', 'Mục số thứ tự')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Danh sách có đánh số"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n> ', '', 'Nội dung trích dẫn')}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Trích dẫn (Quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Rich Media Buttons */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5 shadow-2xs gap-0.5">
            {/* YouTube Embed Button */}
            <button
              type="button"
              onClick={() => setIsYoutubeModalOpen(true)}
              className="px-2 py-1 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
              title="Nhúng Video YouTube vào bài viết"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span>Video YouTube</span>
            </button>

            {/* Image Embed Button */}
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="p-1.5 rounded-lg hover:bg-sky-50 text-sky-700 hover:text-sky-800"
              title="Chèn hình ảnh từ đường dẫn"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Link Embed Button */}
            <button
              type="button"
              onClick={() => setIsLinkModalOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Chèn liên kết (Hyperlink)"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            {/* Table Button */}
            <button
              type="button"
              onClick={handleInsertTable}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900"
              title="Chèn bảng biểu thống kê"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Callout Boxes */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200/80 p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => handleInsertCallout('info')}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
              title="Khung Lưu ý quan trọng (Xanh dương)"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertCallout('warning')}
              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600"
              title="Khung Cảnh báo khẩn (Cam)"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertCallout('success')}
              className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
              title="Khung Kết quả / Chính sách (Xanh lá)"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Mode Switcher & Quick Templates */}
        <div className="flex items-center gap-1.5">
          {/* Quick Templates Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleInsertSampleTemplate(e.target.value as any);
                e.target.value = '';
              }
            }}
            className="text-[11px] font-bold px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-purple-300"
          >
            <option value="">📝 Mẫu Soạn Sẵn</option>
            <option value="bhyt">Mẫu BHYT Toàn Dân</option>
            <option value="hop_thon">Mẫu Lịch Họp Thôn</option>
            <option value="vneid">Mẫu Định Danh VNeID</option>
          </select>

          {/* Edit / Preview Toggle */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('edit')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeMode === 'edit' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>Soạn Thảo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('preview')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                activeMode === 'preview' ? 'bg-white text-sky-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Xem Trước</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      {activeMode === 'edit' ? (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full p-4 text-xs sm:text-sm text-slate-900 bg-white font-sans leading-relaxed resize-y outline-hidden focus:ring-0 placeholder:text-slate-400"
          />
          <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Hỗ trợ Markdown, Video YouTube, Bảng và Chú thích</span>
            <span>{value.length} ký tự</span>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 bg-slate-50/50 overflow-y-auto max-h-[500px]" style={{ minHeight }}>
          {value.trim() ? (
            <RichContentRenderer content={value} />
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs italic">
              Chưa có nội dung để hiển thị xem trước. Hãy chuyển sang tab "Soạn Thảo" để viết bài!
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: INSERT YOUTUBE VIDEO ================= */}
      {isYoutubeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm">
                <YoutubeIcon className="w-5 h-5" />
                <span>Nhúng Video YouTube Vào Bài Viết</span>
              </div>
              <button
                type="button"
                onClick={() => setIsYoutubeModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertYoutube} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường dẫn Video YouTube (URL) *
                </label>
                <input
                  type="text"
                  value={youtubeUrlInput}
                  onChange={(e) => setYoutubeUrlInput(e.target.value)}
                  placeholder="VD: https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:bg-white focus:border-red-500"
                  required
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Hệ thống tự động chuyển đổi thành khung phát video 16:9 chuẩn HD cho bà con xem trực tiếp.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề / Chú thích Video (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={youtubeCaption}
                  onChange={(e) => setYoutubeCaption(e.target.value)}
                  placeholder="VD: Video hướng dẫn cài đặt ứng dụng VNeID..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsYoutubeModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Chèn Video</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSERT IMAGE ================= */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sky-700 font-extrabold text-sm">
                <ImageIcon className="w-5 h-5" />
                <span>Chèn Hình Ảnh Vào Bài Viết</span>
              </div>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường dẫn Hình ảnh (Image URL) *
                </label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... hoặc link ảnh"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:bg-white"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chú thích ảnh (Caption)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="VD: Cán bộ y tế phát thẻ BHYT tại nhà văn hóa..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-sm"
                >
                  Chèn Hình Ảnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: INSERT LINK ================= */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-purple-700 font-extrabold text-sm">
                <LinkIcon className="w-5 h-5" />
                <span>Chèn Siêu Liên Kết (Link)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Văn bản hiển thị *
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="VD: Cổng Dịch Vụ Công Quốc Gia..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường dẫn (URL) *
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://dichvucong.danang.gov.vn"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm"
                >
                  Chèn Liên Kết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
