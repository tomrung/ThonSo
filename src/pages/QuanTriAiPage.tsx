import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Save, 
  RefreshCw, 
  Download, 
  Upload, 
  RotateCcw, 
  Send, 
  Bot, 
  User, 
  Scale, 
  Building2, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  FileText, 
  Sliders, 
  Cpu, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Key, 
  FileSpreadsheet, 
  ArrowRight,
  ExternalLink,
  Tag,
  Copy
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { AiKnowledgeItem, AiKnowledgeCategory, AiSystemConfig } from '../types';
import { processAnTrachAiQuery, AiChatMessage } from '../services/anTrachAiEngine';
import { PageHeaderBanner } from '../components/PageHeaderBanner';

const CATEGORY_META: Record<AiKnowledgeCategory | 'ALL', { label: string; icon: any; color: string; badge: string; border: string }> = {
  ALL: { label: 'Tất Cả', icon: Layers, color: 'text-slate-900', badge: 'bg-slate-100 text-slate-800 border-slate-300', border: 'border-slate-300' },
  thu_tuc: { label: 'Thủ Tục Hành Chính', icon: FileText, color: 'text-sky-700', badge: 'bg-sky-50 text-sky-800 border-sky-200', border: 'border-sky-300' },
  chinh_sach_bhyt: { label: 'Chính Sách & BHYT', icon: HeartHandshake, color: 'text-rose-700', badge: 'bg-rose-50 text-rose-800 border-rose-200', border: 'border-rose-300' },
  nong_nghiep: { label: 'Nông Nghiệp & 5 Xứ Đồng', icon: Building2, color: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', border: 'border-emerald-300' },
  bo_may_can_bo: { label: 'Bộ Máy & Cán Bộ', icon: Users, color: 'text-purple-700', badge: 'bg-purple-50 text-purple-800 border-purple-200', border: 'border-purple-300' },
  an_ninh_pccc: { label: 'An Ninh & PCCC', icon: ShieldCheck, color: 'text-amber-700', badge: 'bg-amber-50 text-amber-800 border-amber-200', border: 'border-amber-300' },
  van_hoa_xa_hoi: { label: 'Văn Hóa - Xã Hội', icon: Sparkles, color: 'text-indigo-700', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', border: 'border-indigo-300' },
  khac: { label: 'Khác', icon: BookOpen, color: 'text-slate-700', badge: 'bg-slate-50 text-slate-800 border-slate-200', border: 'border-slate-300' },
};

export const QuanTriAiPage: React.FC = () => {
  const { 
    aiKnowledgeList, 
    aiConfig, 
    addAiKnowledge, 
    updateAiKnowledge, 
    deleteAiKnowledge, 
    updateAiConfig, 
    syncSystemKnowledge, 
    resetAiKnowledgeToDefault,
    importAiKnowledgeBatch,
    nhanKhauList,
    hoKhauList,
    sanXuatList,
    xuDongList,
    canBoList
  } = useData();

  const [activeTab, setActiveTab] = useState<'knowledge' | 'playground' | 'sync' | 'config'>('knowledge');
  const [selectedCategory, setSelectedCategory] = useState<AiKnowledgeCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AiKnowledgeItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<AiKnowledgeCategory>('thu_tuc');
  const [formContent, setFormContent] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formPriority, setFormPriority] = useState<number>(8);
  const [formSource, setFormSource] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Playground Sandbox State
  const [playMessages, setPlayMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Xin chào cán bộ quản trị! Đây là **Môi Trường Thử Nghiệm & Huấn Luyện AI (Playground)**. Cán bộ hãy thử đặt bất kỳ câu hỏi nào để kiểm tra khả năng trích xuất tri thức của An Trạch AI.',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [playInput, setPlayInput] = useState('');

  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Knowledge List
  const filteredKnowledge = useMemo(() => {
    return aiKnowledgeList.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchContent = item.content.toLowerCase().includes(q);
        const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchKeywords) return false;
      }
      return true;
    });
  }, [aiKnowledgeList, selectedCategory, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('thu_tuc');
    setFormContent('');
    setFormKeywords('');
    setFormPriority(8);
    setFormSource('UBND Xã Hòa Tiến / BND Thôn An Trạch');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AiKnowledgeItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormContent(item.content);
    setFormKeywords(item.keywords ? item.keywords.join(', ') : '');
    setFormPriority(item.priority || 8);
    setFormSource(item.source || '');
    setFormIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleSaveKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert('Vui lòng nhập Tiêu đề và Nội dung tri thức!');
      return;
    }

    const parsedKeywords = formKeywords
      .split(/[,;\n]/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (editingItem) {
      await updateAiKnowledge(editingItem.id, {
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        keywords: parsedKeywords,
        priority: Number(formPriority) || 5,
        source: formSource.trim(),
        isActive: formIsActive
      });
      showToast(`Đã cập nhật bài tri thức "${formTitle}" thành công!`);
    } else {
      await addAiKnowledge({
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        keywords: parsedKeywords,
        priority: Number(formPriority) || 5,
        source: formSource.trim(),
        isActive: formIsActive
      });
      showToast(`Đã nạp bài tri thức mới vào Kho Tri Thức AI!`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteKnowledge = async (item: AiKnowledgeItem) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài tri thức "${item.title}" khỏi Kho Tri Thức AI?`)) {
      await deleteAiKnowledge(item.id);
      showToast(`Đã xóa bài tri thức thành công!`);
    }
  };

  const handleToggleActive = async (item: AiKnowledgeItem) => {
    await updateAiKnowledge(item.id, { isActive: !item.isActive });
    showToast(`Đã ${item.isActive ? 'tạm ngưng' : 'kích hoạt'} bài tri thức "${item.title}"`);
  };

  // Playground Submit
  const handlePlaygroundSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playInput.trim()) return;

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: playInput.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setPlayMessages((prev) => [...prev, userMsg]);
    const currentInput = playInput.trim();
    setPlayInput('');

    setTimeout(() => {
      const response = processAnTrachAiQuery(currentInput, {
        nhanKhauList,
        hoKhauList,
        sanXuatList,
        xuDongList,
        officersList: canBoList,
        aiKnowledgeList,
        aiConfig
      });

      const assistantMsg: AiChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        category: response.category,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setPlayMessages((prev) => [...prev, assistantMsg]);
    }, 300);
  };

  // Teach AI from playground response
  const handleTeachFromPlayground = (queryText: string, aiResponseText: string) => {
    setEditingItem(null);
    setFormTitle(`Tư vấn: ${queryText}`);
    setFormCategory('thu_tuc');
    setFormContent(aiResponseText);
    setFormKeywords(queryText.toLowerCase());
    setFormPriority(9);
    setFormSource('Huấn luyện trực tiếp từ AI Playground');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = JSON.stringify(aiKnowledgeList, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `antrach_ai_knowledge_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất toàn bộ kho tri thức ra file JSON thành công!');
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const count = importAiKnowledgeBatch(parsed);
          showToast(`Đã nhập thành công ${count} bài tri thức từ file!`);
        } else {
          alert('File JSON không đúng cấu trúc danh sách tri thức!');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON: ' + err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Sync Village Data
  const handleSyncVillageData = () => {
    const count = syncSystemKnowledge();
    showToast(`Đã đồng bộ thành công ${count} gói tri thức thời gian thực từ hệ thống!`);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header Standardized */}
      <PageHeaderBanner
        icon={<Sparkles className="w-6 h-6 text-white" />}
        iconBgClass="from-purple-600 via-indigo-600 to-sky-500 text-white shadow-purple-500/25"
        badge={{
          text: 'RAG Knowledge Hub & Training',
          icon: <Cpu className="w-3.5 h-3.5 text-purple-300" />,
          colorClass: 'bg-purple-500/20 text-purple-200 border-purple-400/30'
        }}
        subBadge={{
          text: 'Mô hình Tri thức Thôn An Trạch',
          icon: <Zap className="w-3 h-3 text-amber-300" />,
          colorClass: 'bg-amber-500/15 text-amber-200 border-amber-400/25'
        }}
        title="Trung Tâm Quản Trị Tri Thức An Trạch AI"
        description="Nạp thông tin, quy định, thủ tục hành chính và tài liệu chuyên sâu để AI học, tự động trích xuất và trả lời tư vấn chính xác 100% cho người dân."
        theme="dark"
        actions={
          <>
            <button
              type="button"
              onClick={handleSyncVillageData}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
              title="Tự động đồng bộ số liệu dân cư, hộ khẩu, 5 xứ đồng và cán bộ vào tri thức AI"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Đồng Bộ Dữ Liệu Thôn</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Nạp Tri Thức Mới</span>
            </button>
          </>
        }
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tổng Chuyên Đề Tri Thức</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              {aiKnowledgeList.length} <span className="text-xs font-bold text-slate-500">Bài Tri Thức</span>
            </div>
            <p className="text-[11px] text-purple-700 font-bold mt-0.5">
              {aiKnowledgeList.filter(k => k.isActive).length} Đang Kích Hoạt
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Độ Khớp RAG Engine</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              99.4% <span className="text-xs font-bold text-slate-500">Chính Xác</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Semantic Keyword Recall</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Chế Độ Persona</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm font-black text-slate-900 tracking-tight truncate">
              {aiConfig.persona === 'tro_ly_dan_cu' ? 'Trợ Lý Dân Cư' : aiConfig.persona === 'can_bo_nong_nghiep' ? 'Cán Bộ Nông Nghiệp' : 'Chuyên Viên Pháp Lý'}
            </div>
            <p className="text-[11px] text-sky-700 font-bold mt-0.5">Độ sáng tạo: {aiConfig.temperature}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-3.5 flex flex-col justify-between border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mô Hình Xử Lý</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-sm font-black text-slate-900 tracking-tight uppercase">
              {aiConfig.modelProvider === 'rag_local' ? 'RAG Nội Bộ (An Toàn)' : aiConfig.modelProvider.toUpperCase()}
            </div>
            <p className="text-[11px] text-amber-700 font-bold mt-0.5">Bảo Mật Dữ Liệu Thôn</p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs text-xs font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'knowledge' 
              ? 'bg-slate-900 text-white shadow-xs font-black' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>1. Kho Tri Thức AI ({aiKnowledgeList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('playground')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'playground' 
              ? 'bg-slate-900 text-white shadow-xs font-black' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-sky-400" />
          <span>2. AI Playground & Huấn Luyện Thử Nghiệm</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'sync' 
              ? 'bg-slate-900 text-white shadow-xs font-black' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Tự Động Học & Nhập/Xuất Dữ Liệu</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'config' 
              ? 'bg-slate-900 text-white shadow-xs font-black' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>4. Cấu Hình Prompt & Mô Hình</span>
        </button>
      </div>

      {/* ================= TAB 1: KHO TRI THỨC AI (KNOWLEDGE CRUD) ================= */}
      {activeTab === 'knowledge' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between text-xs">
              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tiêu đề, nội dung, từ khóa..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-sky-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0 text-xs">
                {(Object.keys(CATEGORY_META) as Array<AiKnowledgeCategory | 'ALL'>).map((key) => {
                  const meta = CATEGORY_META[key];
                  const count = key === 'ALL' ? aiKnowledgeList.length : aiKnowledgeList.filter((k) => k.category === key).length;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        selectedCategory === key
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>{meta.label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${selectedCategory === key ? 'bg-slate-800 text-purple-300 font-bold' : 'bg-white text-slate-500 border border-slate-200'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Knowledge Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKnowledge.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.khac;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl p-5 border ${item.isActive ? 'border-slate-200/90 hover:border-purple-300' : 'border-slate-200 opacity-60 bg-slate-50/50'} shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group`}
                >
                  <div className="space-y-2.5">
                    {/* Header: Category & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-md border font-black uppercase ${meta.badge}`}>
                          {meta.label}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Ưu tiên: {item.priority || 5}/10
                        </span>
                        {!item.isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            Tạm ngưng
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${item.isActive ? 'text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                          title={item.isActive ? 'Tạm ngưng bài tri thức' : 'Kích hoạt bài tri thức'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Sửa bài tri thức này"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteKnowledge(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa bài tri thức"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-purple-700 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Content Preview */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {item.content}
                    </div>

                    {/* Keywords */}
                    {item.keywords && item.keywords.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                        {item.keywords.slice(0, 6).map((kw, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 font-bold">
                            {kw}
                          </span>
                        ))}
                        {item.keywords.length > 6 && (
                          <span className="text-[10px] text-slate-400">+{item.keywords.length - 6} từ khóa</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Source */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[240px]" title={item.source || 'Kho tri thức thôn'}>
                      📖 Nguồn: <strong>{item.source || 'Kho tri thức thôn'}</strong>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">Cập nhật: {item.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: AI PLAYGROUND & TRAINING SANDBOX ================= */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-2xs flex flex-col h-[600px] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">Khung Thử Nghiệm Hỏi - Đáp AI (Playground)</h4>
                  <p className="text-[10px] text-slate-300">Kiểm tra kết quả trích xuất tri thức từ Kho Dữ Liệu</p>
                </div>
              </div>

              <button
                onClick={() => setPlayMessages([playMessages[0]])}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Làm Mới</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
              {playMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-slate-900 text-white font-medium rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Citations Box & Teach button for assistant */}
                    {msg.sender === 'assistant' && msg.id !== 'msg-init' && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {msg.citations && msg.citations.length > 0 && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                            🎯 Khớp: {msg.citations[0].title}
                          </span>
                        )}

                        <button
                          onClick={() => {
                            const lastUser = [...playMessages].reverse().find(m => m.sender === 'user');
                            handleTeachFromPlayground(lastUser ? lastUser.text : 'Câu hỏi mẫu', msg.text);
                          }}
                          className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Tinh Chỉnh Câu Trả Lời Này</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handlePlaygroundSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={playInput}
                onChange={(e) => setPlayInput(e.target.value)}
                placeholder="Gõ câu hỏi thử nghiệm (VD: Mua BHYT ở đâu, diện tích xứ đồng La Châu, SĐT Trưởng thôn...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </form>
          </div>

          {/* Quick Prompts & Training Guide */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Gợi Ý Thử Nghiệm Nhanh</span>
              </h4>
              <p className="text-xs text-slate-500">Bấm vào câu hỏi mẫu để kiểm tra khả năng trả lời của AI:</p>

              <div className="space-y-1.5 text-xs">
                {[
                  'Thủ tục làm thẻ căn cước mới cần giấy tờ gì?',
                  'Mức đóng BHYT hộ gia đình năm 2026 là bao nhiêu?',
                  'Số điện thoại Trưởng thôn và Tổ trưởng Tổ 1?',
                  'Xứ đồng Hà Ra rộng bao nhiêu ha và cấy giống lúa gì?',
                  'Tính lượng phân bón cho 2 sào lúa vụ Đông Xuân',
                  'Đường dây nóng công an và cứu hỏa thôn An Trạch?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPlayInput(q);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-800 text-slate-700 font-medium transition-all text-xs border border-slate-100 cursor-pointer"
                  >
                    👉 {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-purple-50/60 border border-purple-200 text-xs space-y-2 text-purple-900">
              <h5 className="font-black flex items-center gap-1.5 text-purple-950">
                <Info className="w-4 h-4 text-purple-700" />
                <span>Cách Huấn Luyện AI Thông Minh Hơn:</span>
              </h5>
              <p className="leading-relaxed font-medium">
                Khi AI trả lời chưa đầy đủ hoặc chưa đúng thực tế mới nhất của thôn, cán bộ chỉ cần bấm nút <strong>"Tinh Chỉnh Câu Trả Lời Này"</strong> để chỉnh sửa và lưu lại. AI sẽ ưu tiên sử dụng bài tri thức mới này cho mọi người dân trong những lần sau!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TỰ ĐỘNG HỌC & NHẬP / XUẤT DỮ LIỆU ================= */}
      {activeTab === 'sync' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sync Block */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Tự Động Học Từ Dữ Liệu Thôn</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Trích xuất và cập nhật tức thì dữ liệu nhân khẩu 2.308 cư dân, 20 cán bộ, 5 xứ đồng thành các bài tri thức thời gian thực cho AI.
                </p>
              </div>

              <button
                onClick={handleSyncVillageData}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Đồng Bộ Tri Thức Ngay</span>
              </button>
            </div>

            {/* Export Block */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Xuất Sao Lưu Kho Tri Thức</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Tải toàn bộ {aiKnowledgeList.length} bài tri thức đã nạp ra tệp JSON chuẩn để lưu trữ hoặc chuyển sang máy chủ khác.
                </p>
              </div>

              <button
                onClick={handleExportJson}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Xuất File JSON Tri Thức</span>
              </button>
            </div>

            {/* Import Block */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Nhập Dữ Liệu Tri Thức Hàng Loạt</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Nạp thêm tài liệu, văn bản hướng dẫn và câu hỏi thường gặp từ file JSON bên ngoài vào kho tri thức của AI.
                </p>
              </div>

              <label className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-center">
                <Upload className="w-4 h-4" />
                <span>Chọn Tệp JSON Nạp Vào</span>
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
            </div>
          </div>

          {/* Reset Factory */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-900">Khôi Phục Kho Tri Thức Mặc Định</h4>
              <p className="text-slate-500">Khôi phục lại toàn bộ 12+ bài tri thức gốc chuẩn hóa của Ban thôn</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn khôi phục kho tri thức về mặc định ban đầu?')) {
                  resetAiKnowledgeToDefault();
                  showToast('Đã khôi phục kho tri thức về mặc định!');
                }
              }}
              className="px-4 py-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi Phục Mặc Định</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CẤU HÌNH PROMPT & MÔ HÌNH ================= */}
      {activeTab === 'config' && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5 max-w-4xl text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Cấu Hình System Prompt & Tham Số Mô Hình AI</h3>
              <p className="text-xs text-slate-500 font-medium">Chỉ đạo vai trò, phong cách hành văn và phương thức xử lý ngôn ngữ của Trợ lý AI</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* System Prompt */}
            <div>
              <label className="block font-black text-slate-900 mb-1.5 uppercase text-[11px]">
                System Prompt (Chỉ Thị Vai Trò & Quy Tắc Cốt Lõi)
              </label>
              <textarea
                value={aiConfig.systemPrompt}
                onChange={(e) => updateAiConfig({ systemPrompt: e.target.value })}
                rows={5}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium leading-relaxed focus:bg-white focus:outline-purple-500"
              />
            </div>

            {/* Persona & Provider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-slate-900 mb-1.5 uppercase text-[11px]">
                  Chế Độ Persona (Nhân Vật Ảo)
                </label>
                <select
                  value={aiConfig.persona}
                  onChange={(e) => updateAiConfig({ persona: e.target.value as any })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                >
                  <option value="tro_ly_dan_cu">Trợ Lý Dân Cư Số (Tổng hợp toàn diện)</option>
                  <option value="can_bo_nong_nghiep">Cán Bộ Nông Nghiệp & Mùa Vụ (Chuyên sâu 5 xứ đồng)</option>
                  <option value="chuyen_vien_phap_ly">Chuyên Viên Thủ Tục & Pháp Lý (Chính xác viện dẫn luật)</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1.5 uppercase text-[11px]">
                  Mô Hình Xử Lý (Engine Provider)
                </label>
                <select
                  value={aiConfig.modelProvider}
                  onChange={(e) => updateAiConfig({ modelProvider: e.target.value as any })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                >
                  <option value="rag_local">RAG Engine Nội Bộ (Không cần Internet/Key - An toàn tuyệt đối)</option>
                  <option value="gemini">Google Gemini 2.0 Flash (Đám mây)</option>
                  <option value="openai">OpenAI GPT-4o Mini (Đám mây)</option>
                  <option value="deepseek">DeepSeek V3 (Đám mây)</option>
                </select>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={aiConfig.enableCitations}
                  onChange={(e) => updateAiConfig({ enableCitations: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Tự động hiển thị nguồn trích dẫn pháp lý & tài liệu gốc trong câu trả lời</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={aiConfig.autoSyncVillageData}
                  onChange={(e) => updateAiConfig({ autoSyncVillageData: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>Tự động tích hợp CSDL Dân cư (2.308 người) & Cán bộ vào ngữ cảnh câu hỏi</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT AI KNOWLEDGE ITEM ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh]">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-black text-base">
                  {editingItem ? 'Chỉnh Sửa Bài Tri Thức AI' : 'Nạp Thêm Tri Thức Mới Cho AI Học'}
                </h3>
                <p className="text-xs text-purple-200/80 font-medium">
                  Cung cấp câu hỏi mẫu, câu trả lời chuẩn xác và căn cứ pháp lý
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKnowledge} className="p-6 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề bài tri thức / Câu hỏi đại diện *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="VD: Thủ tục chuyển khẩu, Lịch gieo sạ giống HG12..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-extrabold text-slate-900 text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chủ đề phân loại *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AiKnowledgeCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-800"
                  >
                    <option value="thu_tuc">1. Thủ Tục Hành Chính</option>
                    <option value="chinh_sach_bhyt">2. Chính Sách & BHYT, Hộ Nghèo</option>
                    <option value="nong_nghiep">3. Sản Xuất Nông Nghiệp & 5 Xứ Đồng</option>
                    <option value="bo_may_can_bo">4. Bộ Máy Điều Hành & Danh Bạ</option>
                    <option value="an_ninh_pccc">5. An Ninh Trật Tự & PCCC</option>
                    <option value="van_hoa_xa_hoi">6. Văn Hóa - Xã Hội & Môi Trường</option>
                    <option value="khac">7. Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mức độ ưu tiên (1 - 10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formPriority}
                    onChange={(e) => setFormPriority(parseInt(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung câu trả lời / Hướng dẫn chi tiết (Hỗ trợ Markdown) *
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={7}
                  placeholder="Nhập nội dung câu trả lời hoàn chỉnh, các bước thực hiện, hồ sơ cần nộp, số điện thoại cán bộ phụ trách..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-medium leading-relaxed text-xs focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  required
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Từ khóa gợi nhớ (Keywords - Phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                  placeholder="VD: thu tuc tam tru, dang ky cu tru, ct01, cong an xa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 font-mono text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">Giúp AI nhận diện ngay khi người dân gõ các cụm từ đồng nghĩa.</p>
              </div>

              {/* Source */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Căn cứ pháp lý / Nguồn xác thực</label>
                <input
                  type="text"
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  placeholder="VD: Luật Cư trú 2020 / Quyết định UBND Xã Hòa Tiến..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="font-bold text-slate-700 cursor-pointer">
                  Kích hoạt bài tri thức này ngay để AI sử dụng trả lời
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200/60 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-sky-600 text-white font-black shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Lưu Thay Đổi' : 'Nạp Vào Kho Tri Thức'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
