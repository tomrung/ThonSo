import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  KeyRound, 
  History, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Lock, 
  Sparkles,
  Building2,
  Calendar,
  Layers,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const roleDetails: Record<UserRole, { title: string; desc: string; color: string }> = {
  super_admin: {
    title: 'Super Administrator',
    desc: 'Toàn quyền cấu hình hệ thống, quản trị phân quyền RLS, phân bổ dữ liệu toàn thôn.',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  admin: {
    title: 'Quản Trị Viên Hệ Thống',
    desc: 'Toàn quyền thêm, sửa, xóa, duyệt tài khoản cán bộ và xuất nhập file Excel.',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  truong_thon: {
    title: 'Trưởng Thôn An Trạch',
    desc: 'Giám sát 2.308 cư dân, 614 hộ, ban hành thông báo và quản lý biến động nhân khẩu toàn thôn.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  to_truong: {
    title: 'Tổ Trưởng Dân Cư',
    desc: 'Quản lý, rà soát và cập nhật thông tin nhân khẩu, hộ gia đình trong tổ dân cư phụ trách.',
    color: 'bg-sky-100 text-sky-800 border-sky-300',
  },
  can_bo_y_te: {
    title: 'Cán Bộ Y Tế Thôn',
    desc: 'Theo dõi thẻ BHYT, tiêm chủng trẻ em, chăm sóc người cao tuổi và đối tượng chính sách đặc thù.',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  cong_an_vien: {
    title: 'Công An Viên Thôn',
    desc: 'Quản lý tạm trú, tạm vắng, chuyển khẩu, định danh CCCD và an ninh trật tự địa bàn.',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  can_bo_xa: {
    title: 'Cán Bộ Xã Hòa Tiến',
    desc: 'Xem và giám sát báo cáo số liệu KPI dân số, bảo hiểm y tế và độ tuổi lao động.',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
  },
};

interface ProfilePageProps {
  onNavigateToHome?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateToHome }) => {
  const { currentUser, updateCurrentProfile, changePassword, logout, auditLogs } = useAuth();

  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'permissions' | 'logs'>('info');

  // Edit profile state
  const [name, setName] = useState(currentUser?.ho_ten || '');
  const [phone, setPhone] = useState(currentUser?.so_dien_thoai || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || '');

  // Change password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [alert, setAlert] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!currentUser) {
    return (
      <div className="premium-card p-12 rounded-3xl text-center space-y-4">
        <User className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Bạn chưa đăng nhập</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Vui lòng đăng nhập tài khoản cán bộ để xem hồ sơ và quản lý hệ thống.
        </p>
      </div>
    );
  }

  const roleMeta = roleDetails[currentUser.vai_tro] || roleDetails.to_truong;
  const myLogs = auditLogs.filter((l) => l.user_id === currentUser.id || l.user_email === currentUser.email);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setAlert({ text: 'Họ và tên không được để trống.', type: 'error' });
      return;
    }
    await updateCurrentProfile({ ho_ten: name, so_dien_thoai: phone, avatar_url: avatarUrl });
    setAlert({ text: 'Cập nhật hồ sơ cá nhân thành công!', type: 'success' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setAlert({ text: 'Mật khẩu xác nhận không khớp.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setAlert({ text: 'Mật khẩu mới phải từ 6 ký tự trở lên.', type: 'error' });
      return;
    }
    const res = await changePassword(oldPassword, newPassword);
    if (res.success) {
      setAlert({ text: res.message, type: 'success' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setAlert(null), 3000);
    } else {
      setAlert({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Profile Banner */}
      <div className="relative rounded-3xl overflow-hidden gradient-dark-gov text-white p-6 sm:p-8 shadow-float">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt=""
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-white/30 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{currentUser.ho_ten}</h2>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${roleMeta.color}`}>
                  {roleMeta.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono">{currentUser.email}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  Phụ trách: <strong className="text-white">{currentUser.to_phu_trach}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Tham gia: {new Date(currentUser.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              if (onNavigateToHome) onNavigateToHome();
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="premium-card rounded-3xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'info' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Thông Tin Cá Nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'password' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đổi Mật Khẩu</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'permissions' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quyền Hạn RLS</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-2xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'logs' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Nhật Ký Thao Tác Của Tôi ({myLogs.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {/* Notification Alert */}
          {alert && (
            <div
              className={`mb-4 p-3 rounded-2xl border text-xs font-medium flex items-center gap-2 animate-in zoom-in-95 ${
                alert.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {alert.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{alert.text}</span>
            </div>
          )}

          {/* TAB 1: INFO FORM */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên cán bộ</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email đăng nhập (Cố định)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đường dẫn ảnh đại diện (Avatar URL)</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl gradient-gov text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi Hồ Sơ</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD FORM */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="max-w-md space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl gradient-gov text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Cập Nhật Mật Khẩu Mới</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: RLS PERMISSIONS */}
          {activeTab === 'permissions' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Chính Sách Bảo Mật Supabase RLS Đang Áp Dụng:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{roleMeta.desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                  <span className="font-extrabold text-emerald-800 block text-xs">Quyền Xem Dữ Liệu</span>
                  <p className="text-[11px] text-emerald-700">
                    {currentUser.to_phu_trach === 'Toàn thôn'
                      ? 'Xem toàn bộ 2.308 cư dân của 8 tổ'
                      : `Chỉ xem cư dân thuộc ${currentUser.to_phu_trach}`}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/60 space-y-1">
                  <span className="font-extrabold text-sky-800 block text-xs">Quyền Thêm / Chỉnh Sửa</span>
                  <p className="text-[11px] text-sky-700">
                    {['super_admin', 'admin', 'truong_thon'].includes(currentUser.vai_tro)
                      ? 'Toàn quyền chỉnh sửa mọi bản ghi'
                      : `Chỉ chỉnh sửa cư dân trong ${currentUser.to_phu_trach}`}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/60 space-y-1">
                  <span className="font-extrabold text-purple-800 block text-xs">Quyền Xóa & Quản Trị</span>
                  <p className="text-[11px] text-purple-700">
                    {['super_admin', 'admin'].includes(currentUser.vai_tro)
                      ? 'Toàn quyền phê duyệt cán bộ và xóa hồ sơ'
                      : 'Không có quyền xóa bản ghi'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MY AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3 text-xs">
              {myLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>Chưa ghi nhận thao tác nào từ tài khoản của bạn.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {myLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 uppercase font-mono">
                            {log.hanh_dong}
                          </span>
                          <span className="font-bold text-slate-900">{log.bang_du_lieu}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{log.mo_ta}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(log.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
