import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  FileText, 
  Wheat, 
  Users, 
  Calculator, 
  RotateCcw,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { processAnTrachAiQuery, AiChatMessage } from '../services/anTrachAiEngine';

interface AnTrachAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onNavigateToTab?: (tab: string) => void;
}

export const AnTrachAiAssistantModal: React.FC<AnTrachAiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onNavigateToTab
}) => {
  const { nhanKhauList, hoKhauList, sanXuatList, xuDongList, canBoList, aiKnowledgeList, aiConfig } = useData();

  const [activeTab, setActiveTab] = useState<'chat' | 'doc_gen' | 'fertilizer'>('chat');
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Xin chào! Tôi là **Trợ Lý Ảo An Trạch AI (Copilot)**. Tôi có thể giúp gì cho cán bộ và bà con hôm nay?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fertilizer Calculator Tab states
  const [calcAreaM2, setCalcAreaM2] = useState<number>(1000);
  const [calcVariety, setCalcVariety] = useState<string>('HG12');

  // Document Generator Tab states
  const [docType, setDocType] = useState<'thong_bao' | 'to_trinh' | 'giay_moi'>('thong_bao');
  const [docTitle, setDocTitle] = useState('Lịch lấy nước đổ ải vụ Đông Xuân 2025 - 2026');
  const [docContentSummary, setDocContentSummary] = useState('Vận hành 2 trạm bơm An Trạch 1 & 2 từ ngày 20/03 để bà con đắp bờ giữ nước.');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialQuery && messages.length === 1) {
        handleSendMessage(initialQuery);
      }
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: AiChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const res = processAnTrachAiQuery(text, {
        nhanKhauList,
        hoKhauList,
        sanXuatList,
        xuDongList,
        officersList: canBoList,
        aiKnowledgeList,
        aiConfig
      });

      const aiMsg: AiChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        category: res.category,
        citations: res.citations,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ đọc giọng nói.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown for speech
    const cleanText = text.replace(/[*_#`]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Quick Prompt Pills
  const QUICK_PROMPTS = [
    { label: '🌾 5 Xứ Đồng Nông Nghiệp', query: 'Tổng quan diện tích 5 xứ đồng và giống lúa' },
    { label: '👥 Dân Số & BHYT Tổ 1', query: 'Thống kê nhân khẩu và BHYT Tổ 1' },
    { label: '🧮 Tính Phân Bón 1 Sào (500m²)', query: 'Tính lượng phân bón cho 500m2 ruộng' },
    { label: '📜 Soạn Thông Báo Lấy Nước', query: 'Soạn thông báo lịch lấy nước trạm bơm' },
    { label: '🏛️ Thủ Tục Cấp Thẻ CCCD', query: 'Hướng dẫn thủ tục cấp thẻ CCCD mới' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col h-[85vh] max-h-[720px] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-sky-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">An Trạch AI Copilot</h3>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Trực Tuyến</span>
                </span>
              </div>
              <p className="text-[11px] text-sky-200/80 font-medium">Trợ lý số thông minh thôn An Trạch • Xã Hòa Tiến</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            {onNavigateToTab && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTab('quan-tri-ai');
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 text-[11px] font-extrabold border border-purple-400/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Mở Trung tâm Quản trị Tri Thức để thêm/sửa/xóa tài liệu cho AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Quản Trị Tri Thức AI</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex items-center gap-1 text-xs shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Trò Chuyện & Tra Cứu AI</span>
          </button>

          <button
            onClick={() => setActiveTab('fertilizer')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'fertilizer'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tính Lượng Phân Bón</span>
          </button>

          <button
            onClick={() => setActiveTab('doc_gen')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'doc_gen'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Soạn Thảo Văn Bản NĐ 30</span>
          </button>
        </div>

        {/* Modal Body: Dynamic Tab View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col space-y-4 bg-slate-50/50">
          
          {/* TAB 1: AI CHAT CONVERSATION */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col space-y-3.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {msg.sender === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                            title={isSpeaking ? 'Dừng đọc' : 'Đọc giọng nói tiếng Việt'}
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                            title="Sao chép nội dung"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
                  <Bot className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span>An Trạch AI đang phân tích dữ liệu và suy nghĩ câu trả lời...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* TAB 2: FERTILIZER CALCULATOR */}
          {activeTab === 'fertilizer' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>Công Cụ Tính Toán Nhu Cầu Phân Bón Ruộng Lúa</span>
                </h4>
                <p className="text-slate-500">
                  Nhập diện tích thửa ruộng (m²) để AI tính toán tỷ lệ Đạm (N), Lân (P), Kali (K) theo quy trình kỹ thuật lúa thuần An Trạch.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Diện tích thửa đất (m²):</label>
                    <input
                      type="number"
                      value={calcAreaM2}
                      onChange={(e) => setCalcAreaM2(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Tương đương {(calcAreaM2 / 500).toFixed(2)} sào Trung Bộ</span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Giống lúa gieo cấy:</label>
                    <select
                      value={calcVariety}
                      onChange={(e) => setCalcVariety(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                    >
                      <option value="HG12">HG12 (Năng suất cao, chịu hạn)</option>
                      <option value="HG244">HG244 (Chất lượng gạo ngon)</option>
                      <option value="J02">J02 (Lúa Nhật chất lượng cao)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h5 className="font-bold text-emerald-800 mb-2">Bảng Phân Bón Khuyến Nghị:</h5>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                      <span className="text-[10px] text-sky-700 block font-bold">Đạm Urê (N)</span>
                      <strong className="text-base font-mono text-sky-900">{((calcAreaM2 / 500) * 10).toFixed(1)} kg</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <span className="text-[10px] text-amber-700 block font-bold">Lân Super (P)</span>
                      <strong className="text-base font-mono text-amber-900">{((calcAreaM2 / 500) * 20).toFixed(1)} kg</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                      <span className="text-[10px] text-rose-700 block font-bold">Kali Clorua (K)</span>
                      <strong className="text-base font-mono text-rose-900">{((calcAreaM2 / 500) * 8).toFixed(1)} kg</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(`Hướng dẫn quy trình bón phân chi tiết cho ${calcAreaM2} m2 giống ${calcVariety}`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Hỏi AI Hướng Dẫn Kỹ Thuật Chi Tiết</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENT GENERATOR */}
          {activeTab === 'doc_gen' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>Trợ Lý Soạn Thảo Văn Bản Thôn (Nghị Định 30/2020/NĐ-CP)</span>
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Loại văn bản:</label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                    >
                      <option value="thong_bao">Thông báo Ban Nhân dân Thôn</option>
                      <option value="to_trinh">Tờ trình gửi UBND Xã Hòa Tiến</option>
                      <option value="giay_moi">Giấy mời họp dân / họp cán bộ tổ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Trích yếu / Tiêu đề văn bản:</label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Tóm tắt nội dung chính cần phổ biến:</label>
                    <textarea
                      value={docContentSummary}
                      onChange={(e) => setDocContentSummary(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 resize-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(`Soạn dự thảo ${docType === 'thong_bao' ? 'thông báo' : docType === 'to_trinh' ? 'tờ trình' : 'giấy mời'} về việc: ${docTitle}. Nội dung tóm tắt: ${docContentSummary}`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sinh Dự Thảo Văn Bản Chuẩn Nghị Định 30</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Quick Prompt Pills (Only on Chat tab) */}
        {activeTab === 'chat' && (
          <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 text-xs">
            <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Gợi ý:</span>
            </span>
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 font-semibold shrink-0 transition-colors cursor-pointer text-[11px]"
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        {activeTab === 'chat' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi về dân cư, ruộng lúa, phân bón, văn bản..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-indigo-600 text-slate-900"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
