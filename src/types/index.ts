export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'truong_thon'
  | 'to_truong'
  | 'can_bo_y_te'
  | 'cong_an_vien'
  | 'can_bo_xa';

export type UserStatus = 'pending_approval' | 'active' | 'blocked';

export interface UserProfile {
  id: string;
  email: string;
  ho_ten: string;
  so_dien_thoai?: string;
  vai_tro: UserRole;
  to_phu_trach: string; // 'Toàn thôn', 'Tổ 1', ..., 'Tổ 8'
  trang_thai: UserStatus;
  avatar_url?: string;
  last_login?: string;
  created_at: string;
}

export interface NhanKhau {
  id: string;
  stt_excel?: number | null;
  ma_ho: string;
  chu_ho: string;
  quan_he_chu_ho: string;
  ho_ten: string;
  gioi_tinh: string; // 'Nam' | 'Nữ' | 'Chưa rõ'
  ngay_thang_nam_sinh?: string | null;
  nam_sinh?: number | null;
  tuoi?: number | null;
  nhom_tuoi?: string | null;
  so_cmnd_cccd?: string | null;
  loai_giay_to?: string | null;
  ngay_cap_cccd?: string | null;
  noi_cap_cccd?: string | null;
  ngay_het_han_cccd?: string | null;
  dien_thoai?: string | null;
  ho_ten_cha?: string | null;
  ho_ten_me?: string | null;
  ma_the_bhyt?: string | null;
  nhom_bhyt?: string | null;
  nghe_nghiep?: string | null;
  dia_chi: string;
  to_dan_cu: string; // 'Tổ 1' .. 'Tổ 8', 'Chưa rõ tổ'
  trang_thai_cu_tru: string;
  doi_tuong_dac_thu?: string | null;
  ghi_chu?: string | null;
  nguon_dong_bo?: string | null;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface HoKhau {
  id: string;
  ma_ho: string;
  ten_chu_ho: string;
  so_cmnd_chu_ho?: string | null;
  so_dien_thoai?: string | null;
  dia_chi: string;
  to_dan_cu: string;
  so_nhan_khau: number;
  lat?: number | null;
  lng?: number | null;
  toado_gps?: string | null;
  loai_ho?: 'chuan' | 'ho_ngheo' | 'chinh_sach' | 'vung_ngap_lut' | 'kinh_doanh';
  dien_tich_dat_m2?: number | null;
  polygon_thua_dat?: [number, number][] | null;
  ghi_chu?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  hanh_dong: 'INSERT' | 'UPDATE' | 'DELETE' | 'IMPORT_EXCEL' | 'EXPORT_EXCEL' | 'APPROVE_USER';
  bang_du_lieu: 'nhan_khau' | 'ho_khau' | 'profiles' | 'thong_bao' | 'can_bo_thon' | 'binh_luan_thong_bao' | 'cong_van';
  ban_ghi_id?: string;
  du_lieu_cu?: any;
  du_lieu_moi?: any;
  mo_ta?: string;
  created_at: string;
}

export interface ThongBao {
  id: string;
  tieu_de: string;
  noi_dung: string;
  loai_tin: 'thong_bao_chung' | 'khancap' | 'lichhop' | 'y_te' | 'chinh_sach';
  pham_vi: string; // 'Toàn thôn', 'Tổ 1'..'Tổ 8'
  is_ghim: boolean;
  is_cong_khai: boolean;
  nguoi_dang_id?: string;
  nguoi_dang_ten?: string;
  nguoi_dang_vai_tro?: string;
  hinh_anh_url?: string | null;
  tep_dinh_kem_url?: string | null;
  luot_xem?: number;
  so_luot_thich?: number;
  created_at: string;
  updated_at?: string;
}

export interface BinhLuanThongBao {
  id: string;
  thong_bao_id: string;
  ho_ten_nguoi_gui: string;
  so_dien_thoai?: string;
  to_dan_cu?: string;
  noi_dung: string;
  is_can_bo?: boolean;
  chuc_danh_can_bo?: string;
  avatar_url?: string;
  da_tra_loi?: boolean;
  tra_loi_noi_dung?: string;
  tra_loi_boi_ten?: string;
  tra_loi_boi_chuc_danh?: string;
  tra_loi_luc?: string;
  created_at: string;
}

export interface CCCDData {
  so_cccd: string;
  so_cmnd_cu?: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  dia_chi: string;
  ngay_cap?: string;
  noi_cap?: string;
  ngay_het_han?: string;
}

export type NotificationType = 'dan_cu' | 'ho_khau' | 'hoi_dap' | 'he_thong' | 'ban_tin' | 'dong_bo';

export interface SystemNotification {
  id: string;
  tieu_de: string;
  noi_dung: string;
  loai: NotificationType;
  link_tab?: 'nhan-khau' | 'ho-khau' | 'thong-bao' | 'admin' | 'dashboard' | 'profile' | 'can-bo' | 'cong-van' | 'nong-nghiep' | 'ban-do' | 'ban-do-san-xuat';
  target_id?: string;
  is_read: boolean;
  nguoi_thuc_hien?: string;
  created_at: string;
}

export type OfficerDepartment = 
  | 'chi_bo'
  | 'ban_nhan_dan'
  | 'to_dan_cu'
  | 'nghiep_vu'
  | 'mat_tran_doan_the';

export interface VillageOfficer {
  id: string;
  ho_ten: string;
  chuc_vu: string;
  khoi: OfficerDepartment;
  to_phu_trach: string;
  so_dien_thoai: string;
  email: string;
  nam_sinh?: number;
  trinh_do?: string;
  nhiem_vu_chinh: string;
  quyen_han: string;
  can_cu_phap_ly: string;
  avatar_url: string;
  ngay_bo_nhiem?: string;
  trang_thai: 'active' | 'leave' | 'transferred';
  so_ho_phu_trach?: number;
  so_dan_phu_trach?: number;
}

export type LoaiCongVan = 'van_ban_den' | 'van_ban_di' | 'noi_bo' | 'to_trinh' | 'chi_dao';
export type DoKhanCongVan = 'thuong' | 'khan' | 'hoa_toc';
export type DoMatCongVan = 'thuong' | 'mat' | 'tuyet_mat';
export type TrangThaiCongVan = 'cho_phan_cong' | 'dang_xu_ly' | 'hoan_thanh' | 'qua_han' | 'luu_tru';

export interface CongVan {
  id: string;
  so_ky_hieu: string;
  trich_yeu: string;
  loai_cong_van: LoaiCongVan;
  co_quan_ban_hanh: string;
  ngay_ban_hanh: string;
  ngay_tiep_nhan: string;
  do_khan: DoKhanCongVan;
  do_mat: DoMatCongVan;
  han_xu_ly?: string;
  trang_thai: TrangThaiCongVan;
  nguoi_chu_tri_id?: string;
  nguoi_chu_tri_ten?: string;
  nguoi_chu_tri_chuc_vu?: string;
  can_bo_phoi_hop?: string[];
  chi_dao_xu_ly?: string;
  tien_do_phan_tram: number; // 0 - 100
  ket_qua_xu_ly?: string;
  file_url?: string;
  file_name?: string;
  nguoi_tao_id?: string;
  nguoi_tao_ten?: string;
  created_at: string;
  updated_at?: string;
}

export type GiongLuaType = 'HG12' | 'HG244' | 'J02' | 'Khác';
export type DotPhanBoType = 'HG244-T9' | 'HG12-T9' | 'HG244-T10' | 'LBT-GO' | 'LaChau' | 'BoSung';

export interface SanXuatRecord {
  id: string;
  stt: string | number;
  dot_phan_bo: DotPhanBoType | string;
  giong_lua: GiongLuaType | string;
  xu_dong?: string; // Xứ đồng: Tổ 9, Hà Ra, Gò ổi, La Bông Tây, La Châu
  lo_thua_dat: string;
  chu_dat: string;
  ho_san_xuat: string;
  la_chinh_chu?: boolean; // true nếu chủ đất tự canh tác, false nếu cho thuê/mượn
  dien_tich_m2: number;
  giong_cap_kg: number;
  mua_them_kg?: number;
  don_gia?: number;
  thanh_tien?: number;
  ky_nhan?: string | number;
  to_dan_cu?: string; // Gắn với Tổ 1 -> Tổ 8
  ghi_chu?: string;
  trang_thai_canh_tac?: 'chuan_bi_dat' | 'da_xuong_giong' | 'de_nhanh' | 'lam_dong' | 'chin_thu_hoach';
  created_at?: string;
  updated_at?: string;
}

export interface XuDongMeta {
  ma_xu_dong: string;
  ten_xu_dong: string;
  vi_tri: string;
  dien_tich_m2: number;
  so_thua: number;
  cac_lo: string;
  giong_chinh: string;
  nguon_nuoc: string;
  to_quan_ly: string;
  mau_sac: string;
}

export interface GiongLuaMeta {
  ma_giong: GiongLuaType;
  ten_giong: string;
  xuat_xu: string;
  thoi_gian_sinh_truong: string;
  nang_suat_uoc_tinh: string;
  dinh_muc_giong_ha: string;
  dac_tinh_noi_bat: string;
  dien_tich_toan_thon: number; // m2
  ty_trong_phan_tram: number; // %
  mau_nhan_dien: string;
}

export interface LichThoiVuNongNghiep {
  id: string;
  giai_doan: string;
  thoi_gian: string;
  noi_dung_cong_viec: string;
  khuyen_cao_ky_thuat: string;
  trang_thai: 'sap_toi' | 'sap_den' | 'dang_thuc_hien' | 'hoan_thanh';
  can_bo_phu_trach: string;
}

export type AiKnowledgeCategory = 
  | 'thu_tuc' 
  | 'chinh_sach_bhyt' 
  | 'nong_nghiep' 
  | 'bo_may_can_bo' 
  | 'an_ninh_pccc' 
  | 'van_hoa_xa_hoi' 
  | 'khac';

export interface AiKnowledgeItem {
  id: string;
  title: string;
  category: AiKnowledgeCategory;
  content: string;
  keywords: string[];
  priority: number; // 1 - 10 (10 = highest)
  source?: string; // Căn cứ pháp lý / Nguồn xác thực
  isActive: boolean;
  updatedAt: string;
  hitCount?: number;
  author?: string;
}

export interface AiSystemConfig {
  systemPrompt: string;
  persona: 'tro_ly_dan_cu' | 'can_bo_nong_nghiep' | 'chuyen_vien_phap_ly';
  temperature: number; // 0.1 - 1.0
  modelProvider: 'rag_local' | 'gemini' | 'openai' | 'deepseek';
  apiKey?: string;
  enableCitations: boolean;
  autoSyncVillageData: boolean;
}
