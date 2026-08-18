import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X, 
  Users, 
  Building2, 
  HelpCircle, 
  ShieldAlert, 
  FileText, 
  Database,
  ExternalLink,
  Clock,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SystemNotification, NotificationType } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

const TYPE_CONFIG: Record<NotificationType, { label: string; icon: any; color: string; bg: string }> = {
  dan_cu: { label: 'Biến Động Dân Cư', icon: Users, color: 'text-sky-700', bg: 'bg-sky-100 border-sky-200' },
  ho_khau: { label: 'Sổ Hộ & GPS', icon: Building2, color: 'text-indigo-700', bg: 'bg-indigo-100 border-indigo-200' },
  hoi_dap: { label: 'Hỏi Đáp Người Dân', icon: HelpCircle, color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200' },
  he_thong: { label: 'Hệ Thống & Cán Bộ', icon: ShieldAlert, color: 'text-rose-700', bg: 'bg-rose-100 border-rose-200' },
  ban_tin: { label: 'Bản Tin Thôn', icon: FileText, color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200' },
  dong_bo: { label: 'Đồng Bộ Excel', icon: Database, color: 'text-purple-700', bg: 'bg-purple-100 border-purple-200' },
};

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { 
    systemNotifications, 
    unreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    clearAllNotifications 
  } = useData();

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredNotifications = systemNotifications.filter((n) => {
    if (selectedFilter === 'UNREAD') return !n.is_read;
    if (selectedFilter !== 'ALL') return n.loai === selectedFilter;
    return true;
  });

  const handleNotificationClick = (notif: SystemNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.link_tab) {
      onNavigateToTab(notif.link_tab);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Floating Center Drawer / Popover */}
      <div className="fixed top-18 right-4 sm:right-6 lg:right-8 z-50 w-[94vw] sm:w-[480px] max-h-[85vh] bg-white rounded-3xl shadow-float border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base leading-tight">Trung Tâm Thông Báo</h3>
                {unreadNotificationCount > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold">
                    {unreadNotificationCount} mới
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                Cảnh báo & biến động thời gian thực toàn hệ thống
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-2.5 py-1 rounded-xl transition-all shrink-0 ${
                selectedFilter === 'ALL' ? 'bg-slate-900 text-white font-bold shadow-2xs' : 'hover:bg-slate-200'
              }`}
            >
              Tất cả ({systemNotifications.length})
            </button>
            <button
              onClick={() => setSelectedFilter('UNREAD')}
              className={`px-2.5 py-1 rounded-xl transition-all shrink-0 ${
                selectedFilter === 'UNREAD' ? 'bg-rose-600 text-white font-bold shadow-2xs' : 'hover:bg-slate-200'
              }`}
            >
              Chưa đọc ({unreadNotificationCount})
            </button>
            <button
              onClick={() => setSelectedFilter('dan_cu')}
              className={`px-2.5 py-1 rounded-xl transition-all shrink-0 ${
                selectedFilter === 'dan_cu' ? 'bg-sky-700 text-white font-bold shadow-2xs' : 'hover:bg-slate-200'
              }`}
            >
              Dân cư
            </button>
            <button
              onClick={() => setSelectedFilter('hoi_dap')}
              className={`px-2.5 py-1 rounded-xl transition-all shrink-0 ${
                selectedFilter === 'hoi_dap' ? 'bg-amber-700 text-white font-bold shadow-2xs' : 'hover:bg-slate-200'
              }`}
            >
              Hỏi đáp
            </button>
          </div>

          {unreadNotificationCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 shrink-0 hover:underline"
              title="Đánh dấu tất cả đã đọc"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đã đọc tất cả</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto stroke-1" />
              <p className="font-bold text-slate-700 text-xs">Không có thông báo nào</p>
              <p className="text-[11px] text-slate-400">Bạn đã xem hết các thông báo biến động dự án.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const cfg = TYPE_CONFIG[notif.loai] || TYPE_CONFIG.dan_cu;
              const Icon = cfg.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 sm:p-3.5 rounded-2xl transition-all cursor-pointer flex items-start justify-between gap-3 group ${
                    notif.is_read 
                      ? 'hover:bg-slate-50 opacity-85' 
                      : 'bg-sky-50/50 hover:bg-sky-50 border border-sky-200/60 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg}`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(notif.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-xs leading-snug group-hover:text-sky-700 transition-colors">
                        {notif.tieu_de}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-normal">
                        {notif.noi_dung}
                      </p>

                      {notif.nguoi_thuc_hien && (
                        <div className="text-[10px] text-slate-400">
                          Thực hiện bởi: <span className="font-semibold text-slate-600">{notif.nguoi_thuc_hien}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Xóa thông báo này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {systemNotifications.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 font-medium">
              Đồng bộ dữ liệu thời gian thực
            </span>
            <button
              onClick={clearAllNotifications}
              className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
