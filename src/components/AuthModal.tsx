import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  KeyRound,
  UserPlus,
  LogIn,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { loginWithCredentials, registerOfficer, resetPasswordRequest, allProfiles, switchUser } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('123456');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('123456');
  const [regRole, setRegRole] = useState<UserRole>('to_truong');
  const [regTo, setRegTo] = useState('Tổ 1');
  const [regReason, setRegReason] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setMessage({ text: 'Vui lòng nhập Email hoặc Số điện thoại đăng nhập.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);

    const res = await loginWithCredentials(loginIdentifier, loginPassword);
    setLoading(false);

    if (res.success) {
      setMessage({ text: 'Đăng nhập thành công!', type: 'success' });
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 800);
    } else {
      setMessage({ text: res.message || 'Đăng nhập thất bại.', type: 'error' });
    }
  };

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setMessage({ text: 'Vui lòng điền đầy đủ các thông tin bắt buộc.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);

    const res = await registerOfficer({
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: regRole,
      to: regRole === 'to_truong' ? regTo : 'Toàn thôn',
      reason: regReason,
    });
    setLoading(false);

    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
      setTimeout(() => {
        setMode('login');
        setLoginIdentifier(regEmail);
      }, 2000);
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  // Handle Forgot Password Submit
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setMessage({ text: 'Vui lòng nhập Email hoặc Số điện thoại.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);

    const res = await resetPasswordRequest(forgotEmail);
    setLoading(false);

    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-gov text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {mode === 'login' && 'Đăng Nhập Cán Bộ'}
                {mode === 'register' && 'Đăng Ký Tài Khoản Cán Bộ'}
                {mode === 'forgot' && 'Khôi Phục Mật Khẩu'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Hệ thống Quản trị Dân cư Thôn An Trạch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-slate-100/80 p-1 m-4 mb-0 rounded-2xl text-xs font-bold border border-slate-200/60">
          <button
            onClick={() => {
              setMode('login');
              setMessage(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>

          <button
            onClick={() => {
              setMode('register');
              setMessage(null);
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Notification Alert Message */}
          {message && (
            <div
              className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2 animate-in zoom-in-95 ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* ================= MODE: LOGIN ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email hoặc Số điện thoại</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="admin@antrach.danang.gov.vn hoặc 0905..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setMessage(null);
                    }}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl gradient-gov text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
              </button>

              {/* Fast Demo Accounts Picker */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Chọn nhanh tài khoản demo:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {allProfiles.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setLoginIdentifier(p.email);
                        setLoginPassword('123456');
                      }}
                      className="p-2 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-left transition-colors flex items-center gap-1.5"
                    >
                      <img src={p.avatar_url} alt="" className="w-5 h-5 rounded-md object-cover" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 truncate block text-[11px]">{p.ho_ten}</span>
                        <span className="text-[9px] text-slate-400 block truncate">{p.to_phu_trach}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* ================= MODE: REGISTER ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên cán bộ *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value.toUpperCase())}
                    placeholder="NGUYỄN VĂN AN"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email liên hệ *</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="canbo@antrach.danang.gov.vn"
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0905..."
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono font-medium focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chức danh / Vai trò</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  >
                    <option value="to_truong">Tổ Trưởng</option>
                    <option value="can_bo_y_te">Cán Bộ Y Tế</option>
                    <option value="cong_an_vien">Công An Viên</option>
                    <option value="can_bo_xa">Cán Bộ Xã</option>
                    <option value="truong_thon">Trưởng Thôn</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa bàn phụ trách</label>
                  <select
                    value={regTo}
                    disabled={regRole !== 'to_truong'}
                    onChange={(e) => setRegTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold disabled:opacity-50"
                  >
                    {['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8', 'Toàn thôn'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lý do đăng ký / Ghi chú</label>
                <textarea
                  value={regReason}
                  onChange={(e) => setRegReason(e.target.value)}
                  placeholder="Cán bộ phụ trách quản lý cư dân Tổ 1..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                🔒 <strong>Chính sách Bảo mật RLS:</strong> Tài khoản cán bộ mới sau khi đăng ký sẽ ở trạng thái <strong className="text-amber-800">Chờ Phê Duyệt</strong>. Quản trị viên thôn sẽ xác minh trước khi cấp quyền truy cập dữ liệu dân cư.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl gradient-gov text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Đang gửi hồ sơ...' : 'Gửi Đăng Ký Chờ Duyệt'}
              </button>
            </form>
          )}

          {/* ================= MODE: FORGOT PASSWORD ================= */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Nhập địa chỉ Email hoặc Số điện thoại cán bộ đã đăng ký để nhận liên kết / mã OTP khôi phục mật khẩu.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email hoặc Số điện thoại</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="email@antrach.danang.gov.vn"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl gradient-gov text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{loading ? 'Đang gửi mã...' : 'Khôi Phục Mật Khẩu'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setMessage(null);
                  }}
                  className="text-xs font-bold text-sky-600 hover:underline"
                >
                  ← Quay lại Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
