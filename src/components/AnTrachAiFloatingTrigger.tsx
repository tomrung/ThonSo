import React from 'react';
import { Bot } from 'lucide-react';

interface AnTrachAiFloatingTriggerProps {
  onOpenAiModal: () => void;
}

export const AnTrachAiFloatingTrigger: React.FC<AnTrachAiFloatingTriggerProps> = ({ onOpenAiModal }) => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      <button
        onClick={onOpenAiModal}
        title="Trợ Lý Ảo An Trạch AI (Copilot)"
        className="group relative px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 border border-white/30 backdrop-blur-md"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="w-4 h-4 text-sky-200 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
        </div>
        <span className="font-extrabold text-xs tracking-tight">
          An Trạch AI
        </span>
      </button>
    </div>
  );
};
