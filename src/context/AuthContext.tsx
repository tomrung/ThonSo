import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, UserStatus, AuditLog, NhanKhau, ThongBao } from '../types';
import { MOCK_PROFILES } from '../data/defaultData';
import { 
  fetchProfilesCloud, 
  upsertProfileCloud, 
  deleteProfileCloud, 
  fetchAuditLogsCloud, 
  insertAuditLogCloud,
  subscribeToRealtimeChanges
} from '../services/supabaseService';

interface AuthContextType {
  currentUser: UserProfile | null;
  allProfiles: UserProfile[];
  auditLogs: AuditLog[];
  switchUser: (userId: string) => void;
  login: (email: string) => Promise<boolean>;
  loginWithCredentials: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (name: string, email: string, phone: string, to: string) => Promise<void>;
  registerOfficer: (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    to: string;
    reason?: string;
  }) => Promise<{ success: boolean; message: string }>;
  resetPasswordRequest: (emailOrPhone: string) => Promise<{ success: boolean; message: string }>;
  updateCurrentProfile: (data: { ho_ten: string; so_dien_thoai: string; avatar_url?: string }) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  addOfficerUser: (data: Omit<UserProfile, 'id' | 'created_at'>) => Promise<UserProfile>;
  updateOfficerUser: (userId: string, data: Partial<UserProfile>) => Promise<void>;
  deleteOfficerUser: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: UserStatus, role?: UserRole, to?: string) => void;
  logActivity: (
    action: AuditLog['hanh_dong'],
    table: AuditLog['bang_du_lieu'],
    recordId?: string,
    oldData?: any,
    newData?: any,
    desc?: string
  ) => void;
  canEditResident: (resident: NhanKhau) => boolean;
  canDeleteResident: () => boolean;
  canViewResident: (resident: NhanKhau) => boolean;
  canManageUsers: () => boolean;
  canPostAnnouncement: (phamVi?: string) => boolean;
  canEditAnnouncement: (tb: ThongBao) => boolean;
  canDeleteAnnouncement: (tb: ThongBao) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isTruongThon: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('antrach_profiles');
    return saved ? JSON.parse(saved) : MOCK_PROFILES;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedId = localStorage.getItem('antrach_current_user_id');
    const found = profiles.find((p) => p.id === savedId);
    return found || profiles[0];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('antrach_audit_logs');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'log-1',
            user_name: 'Nguyễn Văn Quản Trị (Admin)',
            user_email: 'admin@antrach.danang.gov.vn',
            hanh_dong: 'IMPORT_EXCEL',
            bang_du_lieu: 'nhan_khau',
            mo_ta: 'Đồng bộ 2.308 nhân khẩu từ file Excel Master Thôn An Trạch',
            created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('antrach_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('antrach_current_user_id', currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('antrach_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Nạp tài khoản và nhật ký từ Supabase Cloud khi khởi động & lắng nghe Realtime
  useEffect(() => {
    const initAuthCloud = async () => {
      try {
        const cloudProfiles = await fetchProfilesCloud();
        if (cloudProfiles && cloudProfiles.length > 0) {
          setProfiles((prev) => {
            const map = new Map<string, UserProfile>();
            prev.forEach((p) => map.set(p.email.toLowerCase(), p));
            cloudProfiles.forEach((cp) => map.set(cp.email.toLowerCase(), cp));
            return Array.from(map.values());
          });
        }
        const cloudLogs = await fetchAuditLogsCloud();
        if (cloudLogs && cloudLogs.length > 0) {
          setAuditLogs(cloudLogs);
        }
      } catch (err) {
        console.warn('Không thể nạp profiles từ Supabase:', err);
      }
    };
    initAuthCloud();

    const unsub = subscribeToRealtimeChanges((tableName, payload) => {
      if (tableName === 'profiles') {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newRow: UserProfile = payload.new;
          setProfiles((prev) => {
            const idx = prev.findIndex((p) => p.email.toLowerCase() === newRow.email.toLowerCase());
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], ...newRow };
              return updated;
            }
            return [newRow, ...prev];
          });
        } else if (payload.eventType === 'DELETE') {
          setProfiles((prev) => prev.filter((p) => p.id !== payload.old?.id));
        }
      }
    });

    return () => unsub();
  }, []);

  const switchUser = (userId: string) => {
    const target = profiles.find((p) => p.id === userId);
    if (target) {
      setCurrentUser(target);
      logActivity('UPDATE', 'profiles', target.id, null, null, `Chuyển sang tài khoản demo: ${target.ho_ten}`);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    const target = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUser(target);
      logActivity('UPDATE', 'profiles', target.id, null, null, `Đăng nhập hệ thống: ${target.ho_ten}`);
      return true;
    }
    return false;
  };

  const loginWithCredentials = async (
    emailOrPhone: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const clean = emailOrPhone.trim().toLowerCase();
    const target = profiles.find(
      (p) => p.email.toLowerCase() === clean || (p.so_dien_thoai && p.so_dien_thoai.includes(clean))
    );

    if (!target) {
      return { success: false, message: 'Tài khoản hoặc số điện thoại không tồn tại trong hệ thống.' };
    }

    if (target.trang_thai === 'blocked') {
      return { success: false, message: 'Tài khoản của bạn đã bị khóa bởi Quản trị viên.' };
    }

    if (target.trang_thai === 'pending_approval') {
      return {
        success: false,
        message: 'Tài khoản đang chờ Quản trị viên phê duyệt. Vui lòng liên hệ Ban nhân dân thôn.',
      };
    }

    setCurrentUser(target);
    logActivity('UPDATE', 'profiles', target.id, null, null, `Đăng nhập thành công: ${target.ho_ten} (${target.email})`);
    return { success: true, message: 'Đăng nhập thành công!' };
  };

  const logout = () => {
    if (currentUser) {
      logActivity('UPDATE', 'profiles', currentUser.id, null, null, `Đăng xuất khỏi hệ thống: ${currentUser.ho_ten}`);
    }
    setCurrentUser(null);
    localStorage.removeItem('antrach_current_user_id');
  };

  const register = async (name: string, email: string, phone: string, to: string) => {
    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email,
      ho_ten: name,
      so_dien_thoai: phone,
      vai_tro: 'to_truong',
      to_phu_trach: to,
      trang_thai: 'pending_approval',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    };
    setProfiles((prev) => [newProfile, ...prev]);
    logActivity(
      'INSERT',
      'profiles',
      newProfile.id,
      null,
      newProfile,
      `Đăng ký tài khoản mới chờ duyệt: ${name} (${email})`
    );
  };

  const registerOfficer = async (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    to: string;
    reason?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const exists = profiles.some(
      (p) => p.email.toLowerCase() === data.email.toLowerCase() || p.so_dien_thoai === data.phone
    );

    if (exists) {
      return { success: false, message: 'Email hoặc số điện thoại này đã được đăng ký trước đó.' };
    }

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: data.email,
      ho_ten: data.name,
      so_dien_thoai: data.phone,
      vai_tro: data.role,
      to_phu_trach: data.to,
      trang_thai: 'pending_approval',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString(),
    };

    setProfiles((prev) => [newProfile, ...prev]);
    upsertProfileCloud(newProfile);
    logActivity(
      'INSERT',
      'profiles',
      newProfile.id,
      null,
      newProfile,
      `Đăng ký cán bộ mới (${data.role} - ${data.to}): ${data.name} (${data.email})`
    );

    return {
      success: true,
      message: 'Đăng ký thành công! Hồ sơ của bạn đã được gửi đến Quản trị viên Thôn An Trạch để phê duyệt.',
    };
  };

  const resetPasswordRequest = async (emailOrPhone: string): Promise<{ success: boolean; message: string }> => {
    const clean = emailOrPhone.trim().toLowerCase();
    const target = profiles.find(
      (p) => p.email.toLowerCase() === clean || (p.so_dien_thoai && p.so_dien_thoai.includes(clean))
    );

    if (!target) {
      return { success: false, message: 'Không tìm thấy tài khoản với Email hoặc SĐT này.' };
    }

    logActivity('UPDATE', 'profiles', target.id, null, null, `Yêu cầu đặt lại mật khẩu cho tài khoản: ${target.email}`);
    return {
      success: true,
      message: `Đã gửi mã xác thực khôi phục mật khẩu đến ${target.email}. Vui lòng kiểm tra hộp thư.`,
    };
  };

  const updateCurrentProfile = async (data: { ho_ten: string; so_dien_thoai: string; avatar_url?: string }) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ho_ten: data.ho_ten,
      so_dien_thoai: data.so_dien_thoai,
      avatar_url: data.avatar_url || currentUser.avatar_url,
    };
    setCurrentUser(updated);
    setProfiles((prev) => prev.map((p) => (p.id === currentUser.id ? updated : p)));
    upsertProfileCloud(updated);
    logActivity('UPDATE', 'profiles', currentUser.id, currentUser, updated, `Cập nhật thông tin cá nhân cán bộ: ${data.ho_ten}`);
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Bạn chưa đăng nhập.' };
    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
    }
    logActivity('UPDATE', 'profiles', currentUser.id, null, null, `Đổi mật khẩu tài khoản: ${currentUser.email}`);
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  };

  const addOfficerUser = async (data: Omit<UserProfile, 'id' | 'created_at'>): Promise<UserProfile> => {
    const newId = `user-${Date.now()}`;
    const newOfficer: UserProfile = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setProfiles((prev) => [newOfficer, ...prev]);
    upsertProfileCloud(newOfficer);
    logActivity('INSERT', 'profiles', newId, null, newOfficer, `Thêm cán bộ mới vào hệ thống: ${newOfficer.ho_ten} (${newOfficer.vai_tro})`);
    return newOfficer;
  };

  const updateOfficerUser = async (userId: string, data: Partial<UserProfile>) => {
    let oldObj: UserProfile | undefined;
    let updatedObj: UserProfile | undefined;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === userId) {
          oldObj = p;
          const updated = { ...p, ...data };
          updatedObj = updated;
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return p;
      })
    );
    if (updatedObj) {
      upsertProfileCloud(updatedObj);
    }
    if (oldObj) {
      logActivity('UPDATE', 'profiles', userId, oldObj, { ...oldObj, ...data }, `Quản trị viên cập nhật tài khoản cán bộ: ${data.ho_ten || oldObj.ho_ten}`);
    }
  };

  const deleteOfficerUser = async (userId: string) => {
    const target = profiles.find((p) => p.id === userId);
    if (target) {
      setProfiles((prev) => prev.filter((p) => p.id !== userId));
      deleteProfileCloud(userId);
      logActivity('DELETE', 'profiles', userId, target, null, `Xóa tài khoản cán bộ khỏi hệ thống: ${target.ho_ten} (${target.email})`);
    }
  };

  const updateUserStatus = (userId: string, status: UserStatus, role?: UserRole, to?: string) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === userId) {
          const updated: UserProfile = {
            ...p,
            trang_thai: status,
            vai_tro: role || p.vai_tro,
            to_phu_trach: to || p.to_phu_trach,
          };
          upsertProfileCloud(updated);
          logActivity(
            'APPROVE_USER',
            'profiles',
            userId,
            p,
            updated,
            `Cập nhật trạng thái người dùng ${p.ho_ten} -> ${status}`
          );
          return updated;
        }
        return p;
      })
    );
  };

  const logActivity = (
    action: AuditLog['hanh_dong'],
    table: AuditLog['bang_du_lieu'],
    recordId?: string,
    oldData?: any,
    newData?: any,
    desc?: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user_id: currentUser?.id,
      user_email: currentUser?.email || 'Hệ thống / Vãng lai',
      user_name: currentUser?.ho_ten || 'Khách vãng lai',
      hanh_dong: action,
      bang_du_lieu: table,
      ban_ghi_id: recordId,
      du_lieu_cu: oldData,
      du_lieu_moi: newData,
      mo_ta: desc,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
    insertAuditLogCloud(newLog);
  };

  const isSuperAdmin = currentUser?.vai_tro === 'super_admin' && currentUser?.trang_thai === 'active';
  const isAdmin =
    (currentUser?.vai_tro === 'admin' || currentUser?.vai_tro === 'super_admin') && currentUser?.trang_thai === 'active';
  const isTruongThon = currentUser?.vai_tro === 'truong_thon' && currentUser?.trang_thai === 'active';

  const canViewResident = (resident: NhanKhau): boolean => {
    if (!currentUser || currentUser.trang_thai !== 'active') return false;
    if (isAdmin || isTruongThon) return true;
    if (['can_bo_y_te', 'cong_an_vien', 'can_bo_xa'].includes(currentUser.vai_tro)) return true;
    if (currentUser.to_phu_trach === 'Toàn thôn') return true;
    return currentUser.to_phu_trach === resident.to_dan_cu;
  };

  const canEditResident = (resident: NhanKhau): boolean => {
    if (!currentUser || currentUser.trang_thai !== 'active') return false;
    if (isAdmin || isTruongThon) return true;
    if (['can_bo_y_te', 'cong_an_vien'].includes(currentUser.vai_tro)) return true;
    if (currentUser.vai_tro === 'to_truong') {
      return currentUser.to_phu_trach === 'Toàn thôn' || currentUser.to_phu_trach === resident.to_dan_cu;
    }
    return false;
  };

  const canDeleteResident = (): boolean => {
    if (!currentUser || currentUser.trang_thai !== 'active') return false;
    return isAdmin || isTruongThon;
  };

  const canManageUsers = (): boolean => {
    return isAdmin;
  };

  // Permissions for Announcements (Bản Tin Thôn)
  const canPostAnnouncement = (phamVi?: string): boolean => {
    if (!currentUser || currentUser.trang_thai !== 'active') return false;
    if (isAdmin || isTruongThon) return true;
    if (['can_bo_y_te', 'cong_an_vien', 'can_bo_xa'].includes(currentUser.vai_tro)) return true;
    if (currentUser.vai_tro === 'to_truong') {
      if (!phamVi || phamVi === currentUser.to_phu_trach || currentUser.to_phu_trach === 'Toàn thôn') {
        return true;
      }
    }
    return false;
  };

  const canEditAnnouncement = (tb: ThongBao): boolean => {
    if (!currentUser || currentUser.trang_thai !== 'active') return false;
    if (isAdmin || isTruongThon) return true;
    return tb.nguoi_dang_id === currentUser.id;
  };

  const canDeleteAnnouncement = (tb: ThongBao): boolean => {
    if (!currentUser || currentUser.trang_thai !== 'active') return false;
    if (isAdmin || isTruongThon) return true;
    return tb.nguoi_dang_id === currentUser.id;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allProfiles: profiles,
        auditLogs,
        switchUser,
        login,
        loginWithCredentials,
        logout,
        register,
        registerOfficer,
        resetPasswordRequest,
        updateCurrentProfile,
        changePassword,
        addOfficerUser,
        updateOfficerUser,
        deleteOfficerUser,
        updateUserStatus,
        logActivity,
        canEditResident,
        canDeleteResident,
        canViewResident,
        canManageUsers,
        canPostAnnouncement,
        canEditAnnouncement,
        canDeleteAnnouncement,
        isSuperAdmin,
        isAdmin,
        isTruongThon,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
