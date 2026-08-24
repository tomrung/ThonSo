import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  NhanKhau, 
  HoKhau, 
  SanXuatRecord, 
  CongVan, 
  ThongBao, 
  BinhLuanThongBao, 
  VillageOfficer, 
  UserProfile,
  AuditLog,
  AiKnowledgeItem
} from '../types';
import { VillageGeoJsonData } from '../data/anTrachGeoJsonData';

export interface CloudStatus {
  isConfigured: boolean;
  isConnected: boolean;
  tableCounts: {
    nhanKhau: number;
    hoKhau: number;
    sanXuat: number;
    congVan: number;
    thongBao: number;
    canBo: number;
    boundaries: number;
    profiles: number;
    aiKnowledge: number;
  };
  errorMessage?: string;
}

// Kiểm tra trạng thái kết nối và số lượng bản ghi trên Cloud
export async function checkCloudStatus(): Promise<CloudStatus> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      isConfigured: false,
      isConnected: false,
      tableCounts: { nhanKhau: 0, hoKhau: 0, sanXuat: 0, congVan: 0, thongBao: 0, canBo: 0, boundaries: 0, profiles: 0, aiKnowledge: 0 },
      errorMessage: 'Chưa cấu hình Supabase URL hoặc Anon Key trong .env'
    };
  }

  try {
    const getCount = async (tableName: string) => {
      try {
        const { count, error } = await supabase!
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        if (error) {
          console.warn(`Lỗi đếm bảng ${tableName}:`, error.message);
          return 0;
        }
        return count || 0;
      } catch (err) {
        return 0;
      }
    };

    const [nhanKhau, hoKhau, sanXuat, congVan, thongBao, canBo, boundaries, profiles, aiKnowledge] = await Promise.all([
      getCount('nhan_khau'),
      getCount('ho_khau'),
      getCount('san_xuat_nong_nghiep'),
      getCount('cong_van'),
      getCount('thong_bao'),
      getCount('can_bo_thon'),
      getCount('gis_boundaries'),
      getCount('profiles'),
      getCount('ai_knowledge'),
    ]);

    return {
      isConfigured: true,
      isConnected: true,
      tableCounts: { nhanKhau, hoKhau, sanXuat, congVan, thongBao, canBo, boundaries, profiles, aiKnowledge }
    };
  } catch (error: any) {
    return {
      isConfigured: true,
      isConnected: false,
      tableCounts: { nhanKhau: 0, hoKhau: 0, sanXuat: 0, congVan: 0, thongBao: 0, canBo: 0, boundaries: 0, profiles: 0, aiKnowledge: 0 },
      errorMessage: error?.message || 'Không thể kết nối đến Supabase'
    };
  }
}

// --------------------------------------------------------------------------
// 1. TẢI DỮ LIỆU TỪ SUPABASE CLOUD (FETCH)
// --------------------------------------------------------------------------

// Phân trang tự động để tải trọn vẹn danh sách lớn (vd: 2.308 nhân khẩu)
async function fetchAllRows<T>(tableName: string, pageSize = 1000): Promise<T[]> {
  if (!supabase) return [];
  let allData: T[] = [];
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .range(from, to);

    if (error) {
      console.error(`Lỗi tải bảng ${tableName}:`, error);
      break;
    }

    if (data && data.length > 0) {
      allData = allData.concat(data as T[]);
      if (data.length < pageSize) {
        hasMore = false;
      } else {
        page++;
      }
    } else {
      hasMore = false;
    }
  }

  return allData;
}

export async function fetchNhanKhauCloud(): Promise<NhanKhau[]> {
  const rows = await fetchAllRows<any>('nhan_khau');
  return rows.map((r) => ({
    id: r.id,
    stt_excel: r.stt_excel,
    ma_ho: r.ma_ho,
    chu_ho: r.chu_ho,
    quan_he_chu_ho: r.quan_he_chu_ho,
    ho_ten: r.ho_ten,
    gioi_tinh: r.gioi_tinh,
    ngay_thang_nam_sinh: r.ngay_thang_nam_sinh,
    nam_sinh: r.nam_sinh,
    tuoi: r.tuoi,
    nhom_tuoi: r.nhom_tuoi,
    so_cmnd_cccd: r.so_cmnd_cccd,
    loai_giay_to: r.loai_giay_to,
    dien_thoai: r.dien_thoai,
    ho_ten_cha: r.ho_ten_cha,
    ho_ten_me: r.ho_ten_me,
    ma_the_bhyt: r.ma_the_bhyt,
    nhom_bhyt: r.nhom_bhyt,
    nghe_nghiep: r.nghe_nghiep,
    dia_chi: r.dia_chi,
    to_dan_cu: r.to_dan_cu,
    trang_thai_cu_tru: r.trang_thai_cu_tru,
    doi_tuong_dac_thu: r.doi_tuong_dac_thu,
    ghi_chu: r.ghi_chu,
    nguon_dong_bo: r.nguon_dong_bo,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));
}

export async function fetchHoKhauCloud(): Promise<HoKhau[]> {
  const rows = await fetchAllRows<any>('ho_khau');
  return rows.map((r) => ({
    id: r.id,
    ma_ho: r.ma_ho,
    ten_chu_ho: r.ten_chu_ho,
    so_cmnd_chu_ho: r.so_cmnd_chu_ho,
    so_dien_thoai: r.so_dien_thoai,
    dia_chi: r.dia_chi,
    to_dan_cu: r.to_dan_cu,
    so_nhan_khau: r.so_nhan_khau,
    ghi_chu: r.ghi_chu,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));
}

export async function fetchSanXuatCloud(): Promise<SanXuatRecord[]> {
  const rows = await fetchAllRows<any>('san_xuat_nong_nghiep');
  return rows.map((r) => ({
    id: r.id,
    stt: r.stt,
    dot_phan_bo: r.dot_phan_bo,
    giong_lua: r.giong_lua,
    xu_dong: r.xu_dong,
    lo_thua_dat: r.lo_thua_dat,
    chu_dat: r.chu_dat,
    ho_san_xuat: r.ho_san_xuat,
    la_chinh_chu: r.la_chinh_chu,
    dien_tich_m2: Number(r.dien_tich_m2) || 0,
    giong_cap_kg: Number(r.giong_cap_kg) || 0,
    mua_them_kg: Number(r.mua_them_kg) || 0,
    don_gia: Number(r.don_gia) || 0,
    thanh_tien: Number(r.thanh_tien) || 0,
    ky_nhan: r.ky_nhan,
    to_dan_cu: r.to_dan_cu,
    trang_thai_canh_tac: r.trang_thai_canh_tac,
    ghi_chu: r.ghi_chu,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));
}

export async function fetchCongVanCloud(): Promise<CongVan[]> {
  const rows = await fetchAllRows<any>('cong_van');
  return rows.map((r) => ({
    id: r.id,
    so_ky_hieu: r.so_ky_hieu,
    trich_yeu: r.trich_yeu,
    loai_cong_van: r.loai_cong_van,
    co_quan_ban_hanh: r.co_quan_ban_hanh,
    ngay_ban_hanh: r.ngay_ban_hanh,
    ngay_tiep_nhan: r.ngay_tiep_nhan,
    do_khan: r.do_khan,
    do_mat: r.do_mat,
    han_xu_ly: r.han_xu_ly,
    trang_thai: r.trang_thai,
    nguoi_chu_tri_id: r.nguoi_chu_tri_id,
    nguoi_chu_tri_ten: r.nguoi_chu_tri_ten,
    nguoi_chu_tri_chuc_vu: r.nguoi_chu_tri_chuc_vu,
    can_bo_phoi_hop: r.can_bo_phoi_hop || [],
    chi_dao_xu_ly: r.chi_dao_xu_ly,
    tien_do_phan_tram: r.tien_do_phan_tram || 0,
    ket_qua_xu_ly: r.ket_qua_xu_ly,
    file_url: r.file_url,
    file_name: r.file_name,
    nguoi_tao_id: r.nguoi_tao_id,
    nguoi_tao_ten: r.nguoi_tao_ten,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));
}

export async function fetchThongBaoCloud(): Promise<ThongBao[]> {
  const rows = await fetchAllRows<any>('thong_bao');
  return rows.map((r) => ({
    id: r.id,
    tieu_de: r.tieu_de,
    noi_dung: r.noi_dung,
    loai_tin: r.loai_tin,
    pham_vi: r.pham_vi,
    is_ghim: r.is_ghim,
    is_cong_khai: r.is_cong_khai,
    nguoi_dang_id: r.nguoi_dang_id,
    nguoi_dang_ten: r.nguoi_dang_ten,
    nguoi_dang_vai_tro: r.nguoi_dang_vai_tro,
    hinh_anh_url: r.hinh_anh_url,
    tep_dinh_kem_url: r.tep_dinh_kem_url,
    luot_xem: r.luot_xem || 0,
    so_luot_thich: r.so_luot_thich || 0,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));
}

export async function fetchBinhLuanCloud(): Promise<BinhLuanThongBao[]> {
  const rows = await fetchAllRows<any>('binh_luan_thong_bao');
  return rows.map((r) => ({
    id: r.id,
    thong_bao_id: r.thong_bao_id,
    ho_ten_nguoi_gui: r.ho_ten_nguoi_gui,
    so_dien_thoai: r.so_dien_thoai,
    to_dan_cu: r.to_dan_cu,
    noi_dung: r.noi_dung,
    is_can_bo: r.is_can_bo,
    chuc_danh_can_bo: r.chuc_danh_can_bo,
    avatar_url: r.avatar_url,
    da_tra_loi: r.da_tra_loi,
    tra_loi_noi_dung: r.tra_loi_noi_dung,
    tra_loi_boi_ten: r.tra_loi_boi_ten,
    tra_loi_boi_chuc_danh: r.tra_loi_boi_chuc_danh,
    tra_loi_luc: r.tra_loi_luc,
    created_at: r.created_at
  }));
}

export async function fetchCanBoCloud(): Promise<VillageOfficer[]> {
  const rows = await fetchAllRows<any>('can_bo_thon');
  return rows.map((r) => ({
    id: r.id,
    ho_ten: r.ho_ten,
    chuc_vu: r.chuc_vu,
    khoi: r.khoi,
    to_phu_trach: r.to_phu_trach,
    so_dien_thoai: r.so_dien_thoai,
    email: r.email,
    nam_sinh: r.nam_sinh,
    trinh_do: r.trinh_do,
    nhiem_vu_chinh: r.nhiem_vu_chinh,
    quyen_han: r.quyen_han,
    can_cu_phap_ly: r.can_cu_phap_ly,
    avatar_url: r.avatar_url,
    ngay_bo_nhiem: r.ngay_bo_nhiem,
    trang_thai: r.trang_thai,
    so_ho_phu_trach: r.so_ho_phu_trach,
    so_dan_phu_trach: r.so_dan_phu_trach
  }));
}

export async function fetchBoundariesCloud(): Promise<VillageGeoJsonData | null> {
  const rows = await fetchAllRows<any>('gis_boundaries');
  if (!rows || rows.length === 0) return null;
  
  const features = rows.map((r) => ({
    type: 'Feature',
    id: r.ma_vung,
    properties: {
      id: r.ma_vung,
      name: r.ten_vung,
      type: r.loai_vung,
      to_truong: r.to_truong,
      phone: r.so_dien_thoai,
      households: r.so_ho,
      population: r.so_dan,
      area_ha: Number(r.dien_tich_ha) || 0,
      color: r.color,
      fillColor: r.fill_color
    },
    geometry: r.geojson_geometry
  }));

  return {
    type: 'FeatureCollection',
    features: features as any
  };
}

export async function fetchProfilesCloud(): Promise<UserProfile[]> {
  const rows = await fetchAllRows<any>('profiles');
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    ho_ten: r.ho_ten,
    so_dien_thoai: r.so_dien_thoai,
    vai_tro: r.vai_tro,
    to_phu_trach: r.to_phu_trach,
    trang_thai: r.trang_thai,
    avatar_url: r.avatar_url,
    last_login: r.last_login,
    created_at: r.created_at
  }));
}

export async function fetchAiKnowledgeCloud(): Promise<AiKnowledgeItem[]> {
  const rows = await fetchAllRows<any>('ai_knowledge');
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    content: r.content,
    keywords: r.tags || [],
    priority: 5,
    source: r.source,
    isActive: true,
    updatedAt: r.updated_at || new Date().toISOString(),
    hitCount: 0,
    author: 'Cán Bộ Thôn'
  }));
}

export async function fetchAuditLogsCloud(): Promise<AuditLog[]> {
  const rows = await fetchAllRows<any>('nhat_ky_thao_tac');
  return rows.map((r) => ({
    id: r.id,
    user_id: r.user_id,
    user_email: r.user_email,
    user_name: r.user_name || 'Hệ thống',
    hanh_dong: r.hanh_dong,
    bang_du_lieu: r.bang_du_lieu,
    ban_ghi_id: r.ban_ghi_id,
    du_lieu_cu: r.du_lieu_cu,
    du_lieu_moi: r.du_lieu_moi,
    mo_ta: r.mo_ta,
    created_at: r.created_at
  }));
}

// --------------------------------------------------------------------------
// 2. ĐẨY TOÀN BỘ DỮ LIỆU LOCAL/SEED LÊN CLOUD (BATCH INSERT / SEED TO CLOUD)
// --------------------------------------------------------------------------

// Chuyển ID an toàn (hỗ trợ cả UUID lẫn TEXT ID nguyên bản)
export function ensureValidUuid(id: string): string {
  if (!id) return `gen-${Date.now()}`;
  return String(id);
}

async function batchInsert<T>(
  tableName: string, 
  items: T[], 
  transformFn: (item: T) => any, 
  batchSize = 100,
  onProgress?: (count: number, total: number) => void
) {
  if (!supabase || items.length === 0) return;
  const total = items.length;
  let inserted = 0;

  for (let i = 0; i < total; i += batchSize) {
    const chunk = items.slice(i, i + batchSize).map(transformFn);
    const { error } = await supabase
      .from(tableName)
      .upsert(chunk, { onConflict: 'id', ignoreDuplicates: false });

    if (error) {
      console.error(`[Supabase Error] Lỗi batch insert ${tableName} (lô ${i}-${i + chunk.length}):`, error);
    }
    inserted += chunk.length;
    if (onProgress) onProgress(inserted, total);
  }
}

export async function pushAllDataToCloud(
  data: {
    nhanKhauList: NhanKhau[];
    hoKhauList: HoKhau[];
    sanXuatList: SanXuatRecord[];
    congVanList: CongVan[];
    thongBaoList: ThongBao[];
    canBoList: VillageOfficer[];
    binhLuanList: BinhLuanThongBao[];
    boundariesData: VillageGeoJsonData;
    profiles?: UserProfile[];
    aiKnowledgeList?: AiKnowledgeItem[];
    auditLogs?: AuditLog[];
  },
  onProgress?: (status: { message: string; percent: number }) => void
): Promise<{ success: boolean; message: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, message: 'Supabase chưa được cấu hình hoặc không khả dụng.' };
  }

  try {
    // 1. Đồng bộ Cán bộ thôn
    if (onProgress) onProgress({ message: 'Đang đẩy hồ sơ cán bộ thôn...', percent: 10 });
    await batchInsert('can_bo_thon', data.canBoList, (c) => ({
      id: String(c.id),
      ho_ten: c.ho_ten,
      chuc_vu: c.chuc_vu,
      khoi: c.khoi,
      to_phu_trach: c.to_phu_trach,
      so_dien_thoai: c.so_dien_thoai,
      email: c.email,
      nam_sinh: c.nam_sinh,
      trinh_do: c.trinh_do,
      nhiem_vu_chinh: c.nhiem_vu_chinh,
      quyen_han: c.quyen_han,
      can_cu_phap_ly: c.can_cu_phap_ly,
      avatar_url: c.avatar_url,
      ngay_bo_nhiem: c.ngay_bo_nhiem,
      trang_thai: c.trang_thai,
      so_ho_phu_trach: c.so_ho_phu_trach || 0,
      so_dan_phu_trach: c.so_dan_phu_trach || 0
    }));

    // 2. Đồng bộ Hộ khẩu
    if (onProgress) onProgress({ message: 'Đang đẩy sổ hộ khẩu gia đình...', percent: 25 });
    await batchInsert('ho_khau', data.hoKhauList, (h) => ({
      id: String(h.id),
      ma_ho: h.ma_ho,
      ten_chu_ho: h.ten_chu_ho,
      so_cmnd_chu_ho: h.so_cmnd_chu_ho,
      so_dien_thoai: h.so_dien_thoai,
      dia_chi: h.dia_chi,
      to_dan_cu: h.to_dan_cu,
      so_nhan_khau: h.so_nhan_khau || 1,
      ghi_chu: h.ghi_chu
    }));

    // 3. Đồng bộ 2.308 Nhân khẩu
    if (onProgress) onProgress({ message: 'Đang đẩy 2.308 hồ sơ nhân khẩu master...', percent: 50 });
    await batchInsert('nhan_khau', data.nhanKhauList, (r) => ({
      id: String(r.id),
      stt_excel: r.stt_excel,
      ma_ho: r.ma_ho,
      chu_ho: r.chu_ho,
      quan_he_chu_ho: r.quan_he_chu_ho,
      ho_ten: r.ho_ten,
      gioi_tinh: r.gioi_tinh,
      ngay_thang_nam_sinh: r.ngay_thang_nam_sinh,
      nam_sinh: r.nam_sinh,
      tuoi: r.tuoi,
      nhom_tuoi: r.nhom_tuoi,
      so_cmnd_cccd: r.so_cmnd_cccd,
      loai_giay_to: r.loai_giay_to,
      dien_thoai: r.dien_thoai,
      ho_ten_cha: r.ho_ten_cha,
      ho_ten_me: r.ho_ten_me,
      ma_the_bhyt: r.ma_the_bhyt,
      nhom_bhyt: r.nhom_bhyt,
      nghe_nghiep: r.nghe_nghiep,
      dia_chi: r.dia_chi,
      to_dan_cu: r.to_dan_cu,
      trang_thai_cu_tru: r.trang_thai_cu_tru,
      doi_tuong_dac_thu: r.doi_tuong_dac_thu,
      ghi_chu: r.ghi_chu,
      nguon_dong_bo: r.nguon_dong_bo
    }));

    // 4. Đồng bộ Sản xuất nông nghiệp
    if (onProgress) onProgress({ message: 'Đang đẩy 647 thửa sản xuất nông nghiệp...', percent: 75 });
    await batchInsert('san_xuat_nong_nghiep', data.sanXuatList, (s) => ({
      id: String(s.id),
      stt: typeof s.stt === 'number' ? s.stt : parseInt(String(s.stt)) || 1,
      dot_phan_bo: s.dot_phan_bo,
      giong_lua: s.giong_lua,
      xu_dong: s.xu_dong,
      lo_thua_dat: s.lo_thua_dat,
      chu_dat: s.chu_dat,
      ho_san_xuat: s.ho_san_xuat,
      la_chinh_chu: s.la_chinh_chu ?? true,
      dien_tich_m2: s.dien_tich_m2,
      giong_cap_kg: s.giong_cap_kg,
      mua_them_kg: s.mua_them_kg,
      don_gia: s.don_gia,
      thanh_tien: s.thanh_tien,
      ky_nhan: String(s.ky_nhan || ''),
      to_dan_cu: s.to_dan_cu,
      trang_thai_canh_tac: s.trang_thai_canh_tac,
      ghi_chu: s.ghi_chu
    }));

    // 5. Đồng bộ Công văn & Văn thư
    if (onProgress) onProgress({ message: 'Đang đẩy sổ công văn & chỉ đạo...', percent: 88 });
    await batchInsert('cong_van', data.congVanList, (cv) => ({
      id: String(cv.id),
      so_ky_hieu: cv.so_ky_hieu,
      trich_yeu: cv.trich_yeu,
      loai_cong_van: cv.loai_cong_van,
      co_quan_ban_hanh: cv.co_quan_ban_hanh,
      ngay_ban_hanh: cv.ngay_ban_hanh,
      ngay_tiep_nhan: cv.ngay_tiep_nhan,
      do_khan: cv.do_khan,
      do_mat: cv.do_mat,
      han_xu_ly: cv.han_xu_ly,
      trang_thai: cv.trang_thai,
      nguoi_chu_tri_ten: cv.nguoi_chu_tri_ten,
      nguoi_chu_tri_chuc_vu: cv.nguoi_chu_tri_chuc_vu,
      can_bo_phoi_hop: cv.can_bo_phoi_hop || [],
      chi_dao_xu_ly: cv.chi_dao_xu_ly,
      tien_do_phan_tram: cv.tien_do_phan_tram || 0,
      ket_qua_xu_ly: cv.ket_qua_xu_ly,
      file_url: cv.file_url,
      file_name: cv.file_name,
      nguoi_tao_ten: cv.nguoi_tao_ten
    }));

    // 6. Đồng bộ Thông báo & Bản tin
    if (onProgress) onProgress({ message: 'Đang đẩy bản tin & thông báo thôn...', percent: 92 });
    await batchInsert('thong_bao', data.thongBaoList, (t) => ({
      id: String(t.id),
      tieu_de: t.tieu_de,
      noi_dung: t.noi_dung,
      loai_tin: t.loai_tin,
      pham_vi: t.pham_vi,
      is_ghim: t.is_ghim ?? false,
      is_cong_khai: t.is_cong_khai ?? true,
      nguoi_dang_ten: t.nguoi_dang_ten,
      nguoi_dang_vai_tro: t.nguoi_dang_vai_tro,
      hinh_anh_url: t.hinh_anh_url,
      tep_dinh_kem_url: t.tep_dinh_kem_url,
      luot_xem: t.luot_xem || 0,
      so_luot_thich: t.so_luot_thich || 0
    }));

    // 7. Đồng bộ GIS boundaries
    if (data.boundariesData && data.boundariesData.features) {
      if (onProgress) onProgress({ message: 'Đang đẩy ranh giới bản đồ GIS không gian...', percent: 94 });
      const gisList = data.boundariesData.features.map((f: any) => ({
        id: String(f.properties?.id || f.id || 'boundary'),
        ma_vung: String(f.properties?.id || f.id),
        ten_vung: f.properties?.name || 'Vùng',
        loai_vung: f.properties?.type || 'to_dan_cu',
        to_truong: f.properties?.to_truong,
        so_dien_thoai: f.properties?.phone,
        so_ho: f.properties?.households || 0,
        so_dan: f.properties?.population || 0,
        dien_tich_ha: f.properties?.area_ha || 0,
        color: f.properties?.color || '#0284c7',
        fill_color: f.properties?.fillColor || '#38bdf8',
        geojson_geometry: f.geometry
      }));
      await batchInsert('gis_boundaries', gisList, (g) => g);
    }

    // 8. Đồng bộ Tài khoản Cán bộ (profiles)
    if (data.profiles && data.profiles.length > 0) {
      if (onProgress) onProgress({ message: 'Đang đẩy danh sách tài khoản cán bộ...', percent: 96 });
      await batchInsert('profiles', data.profiles, (p) => ({
        id: String(p.id),
        email: p.email,
        ho_ten: p.ho_ten,
        so_dien_thoai: p.so_dien_thoai || '',
        vai_tro: p.vai_tro,
        to_phu_trach: p.to_phu_trach,
        trang_thai: p.trang_thai,
        avatar_url: p.avatar_url || ''
      }));
    }

    // 9. Đồng bộ Cơ sở Tri thức AI (ai_knowledge)
    if (data.aiKnowledgeList && data.aiKnowledgeList.length > 0) {
      if (onProgress) onProgress({ message: 'Đang đẩy dữ liệu tri thức An Trạch AI...', percent: 98 });
      await batchInsert('ai_knowledge', data.aiKnowledgeList, (k) => ({
        id: String(k.id),
        code: `AI-${k.id}`,
        title: k.title,
        category: k.category,
        content: k.content,
        source: k.source || 'Ban Nhân Dân Thôn',
        tags: k.keywords || [],
        applicable_to: 'Toàn thôn'
      }));
    }

    // 10. Đồng bộ Nhật ký thao tác (nhat_ky_thao_tac)
    if (data.auditLogs && data.auditLogs.length > 0) {
      await batchInsert('nhat_ky_thao_tac', data.auditLogs, (log) => ({
        id: String(log.id),
        user_name: log.user_name,
        user_email: log.user_email || 'admin@antrach.danang.gov.vn',
        hanh_dong: log.hanh_dong,
        bang_du_lieu: log.bang_du_lieu,
        mo_ta: log.mo_ta,
        created_at: log.created_at || new Date().toISOString()
      }));
    }

    if (onProgress) onProgress({ message: 'Đồng bộ hoàn tất 100%!', percent: 100 });
    return { success: true, message: 'Đã đồng bộ toàn bộ dữ liệu lên Cloud Supabase thành công!' };
  } catch (error: any) {
    console.error('Lỗi đẩy dữ liệu lên Cloud:', error);
    return { success: false, message: `Lỗi đồng bộ: ${error?.message || 'Không xác định'}` };
  }
}

// --------------------------------------------------------------------------
// 3. CÁC HÀM CRUD ĐỒNG BỘ ĐƠN LẺ (SINGLE MUTATIONS)
// --------------------------------------------------------------------------

export async function upsertNhanKhauCloud(r: NhanKhau) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('nhan_khau').upsert({
      id: String(r.id),
      stt_excel: r.stt_excel,
      ma_ho: r.ma_ho,
      chu_ho: r.chu_ho,
      quan_he_chu_ho: r.quan_he_chu_ho,
      ho_ten: r.ho_ten,
      gioi_tinh: r.gioi_tinh,
      ngay_thang_nam_sinh: r.ngay_thang_nam_sinh,
      nam_sinh: r.nam_sinh,
      tuoi: r.tuoi,
      nhom_tuoi: r.nhom_tuoi,
      so_cmnd_cccd: r.so_cmnd_cccd,
      loai_giay_to: r.loai_giay_to,
      dien_thoai: r.dien_thoai,
      ho_ten_cha: r.ho_ten_cha,
      ho_ten_me: r.ho_ten_me,
      ma_the_bhyt: r.ma_the_bhyt,
      nhom_bhyt: r.nhom_bhyt,
      nghe_nghiep: r.nghe_nghiep,
      dia_chi: r.dia_chi,
      to_dan_cu: r.to_dan_cu,
      trang_thai_cu_tru: r.trang_thai_cu_tru,
      doi_tuong_dac_thu: r.doi_tuong_dac_thu,
      ghi_chu: r.ghi_chu,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert nhan_khau:', error);
  } catch (e) {
    console.warn('Lỗi upsert nhan_khau lên cloud:', e);
  }
}

export async function deleteNhanKhauCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('nhan_khau').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete nhan_khau:', error);
  } catch (e) {
    console.warn('Lỗi xóa nhan_khau trên cloud:', e);
  }
}

export async function upsertHoKhauCloud(h: HoKhau) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('ho_khau').upsert({
      id: String(h.id),
      ma_ho: h.ma_ho,
      ten_chu_ho: h.ten_chu_ho,
      so_cmnd_chu_ho: h.so_cmnd_chu_ho,
      so_dien_thoai: h.so_dien_thoai,
      dia_chi: h.dia_chi,
      to_dan_cu: h.to_dan_cu,
      so_nhan_khau: h.so_nhan_khau,
      ghi_chu: h.ghi_chu,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert ho_khau:', error);
  } catch (e) {
    console.warn('Lỗi upsert ho_khau lên cloud:', e);
  }
}

export async function deleteHoKhauCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('ho_khau').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete ho_khau:', error);
  } catch (e) {
    console.warn('Lỗi xóa ho_khau trên cloud:', e);
  }
}

export async function upsertSanXuatCloud(s: SanXuatRecord) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('san_xuat_nong_nghiep').upsert({
      id: String(s.id),
      stt: typeof s.stt === 'number' ? s.stt : parseInt(String(s.stt)) || 1,
      dot_phan_bo: s.dot_phan_bo,
      giong_lua: s.giong_lua,
      xu_dong: s.xu_dong,
      lo_thua_dat: s.lo_thua_dat,
      chu_dat: s.chu_dat,
      ho_san_xuat: s.ho_san_xuat,
      la_chinh_chu: s.la_chinh_chu ?? true,
      dien_tich_m2: s.dien_tich_m2,
      giong_cap_kg: s.giong_cap_kg,
      mua_them_kg: s.mua_them_kg,
      don_gia: s.don_gia,
      thanh_tien: s.thanh_tien,
      ky_nhan: String(s.ky_nhan || ''),
      to_dan_cu: s.to_dan_cu,
      trang_thai_canh_tac: s.trang_thai_canh_tac,
      ghi_chu: s.ghi_chu,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert san_xuat:', error);
  } catch (e) {
    console.warn('Lỗi upsert san_xuat lên cloud:', e);
  }
}

export async function deleteSanXuatCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('san_xuat_nong_nghiep').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete san_xuat:', error);
  } catch (e) {
    console.warn('Lỗi xóa san_xuat trên cloud:', e);
  }
}

export async function upsertCongVanCloud(cv: CongVan) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('cong_van').upsert({
      id: String(cv.id),
      so_ky_hieu: cv.so_ky_hieu,
      trich_yeu: cv.trich_yeu,
      loai_cong_van: cv.loai_cong_van,
      co_quan_ban_hanh: cv.co_quan_ban_hanh,
      ngay_ban_hanh: cv.ngay_ban_hanh,
      ngay_tiep_nhan: cv.ngay_tiep_nhan,
      do_khan: cv.do_khan,
      do_mat: cv.do_mat,
      han_xu_ly: cv.han_xu_ly,
      trang_thai: cv.trang_thai,
      nguoi_chu_tri_ten: cv.nguoi_chu_tri_ten,
      nguoi_chu_tri_chuc_vu: cv.nguoi_chu_tri_chuc_vu,
      can_bo_phoi_hop: cv.can_bo_phoi_hop || [],
      chi_dao_xu_ly: cv.chi_dao_xu_ly,
      tien_do_phan_tram: cv.tien_do_phan_tram || 0,
      ket_qua_xu_ly: cv.ket_qua_xu_ly,
      file_url: cv.file_url,
      file_name: cv.file_name,
      nguoi_tao_ten: cv.nguoi_tao_ten,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert cong_van:', error);
  } catch (e) {
    console.warn('Lỗi upsert cong_van lên cloud:', e);
  }
}

export async function deleteCongVanCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('cong_van').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete cong_van:', error);
  } catch (e) {
    console.warn('Lỗi xóa cong_van trên cloud:', e);
  }
}

export async function upsertThongBaoCloud(t: ThongBao) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('thong_bao').upsert({
      id: String(t.id),
      tieu_de: t.tieu_de,
      noi_dung: t.noi_dung,
      loai_tin: t.loai_tin,
      pham_vi: t.pham_vi,
      is_ghim: t.is_ghim,
      is_cong_khai: t.is_cong_khai,
      nguoi_dang_ten: t.nguoi_dang_ten,
      nguoi_dang_vai_tro: t.nguoi_dang_vai_tro,
      hinh_anh_url: t.hinh_anh_url,
      tep_dinh_kem_url: t.tep_dinh_kem_url,
      luot_xem: t.luot_xem,
      so_luot_thich: t.so_luot_thich,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert thong_bao:', error);
  } catch (e) {
    console.warn('Lỗi upsert thong_bao lên cloud:', e);
  }
}

export async function deleteThongBaoCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('thong_bao').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete thong_bao:', error);
  } catch (e) {
    console.warn('Lỗi xóa thong_bao trên cloud:', e);
  }
}

export async function upsertCanBoCloud(c: VillageOfficer) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('can_bo_thon').upsert({
      id: String(c.id),
      ho_ten: c.ho_ten,
      chuc_vu: c.chuc_vu,
      khoi: c.khoi,
      to_phu_trach: c.to_phu_trach,
      so_dien_thoai: c.so_dien_thoai,
      email: c.email,
      nam_sinh: c.nam_sinh,
      trinh_do: c.trinh_do,
      nhiem_vu_chinh: c.nhiem_vu_chinh,
      quyen_han: c.quyen_han,
      can_cu_phap_ly: c.can_cu_phap_ly,
      avatar_url: c.avatar_url,
      ngay_bo_nhiem: c.ngay_bo_nhiem,
      trang_thai: c.trang_thai,
      so_ho_phu_trach: c.so_ho_phu_trach,
      so_dan_phu_trach: c.so_dan_phu_trach,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert can_bo_thon:', error);
  } catch (e) {
    console.warn('Lỗi upsert can_bo lên cloud:', e);
  }
}

export async function deleteCanBoCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('can_bo_thon').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete can_bo_thon:', error);
  } catch (e) {
    console.warn('Lỗi xóa can_bo trên cloud:', e);
  }
}

export async function upsertBinhLuanCloud(b: BinhLuanThongBao) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('binh_luan_thong_bao').upsert({
      id: String(b.id),
      thong_bao_id: String(b.thong_bao_id),
      ho_ten_nguoi_gui: b.ho_ten_nguoi_gui,
      so_dien_thoai: b.so_dien_thoai,
      to_dan_cu: b.to_dan_cu,
      noi_dung: b.noi_dung,
      is_can_bo: b.is_can_bo,
      chuc_danh_can_bo: b.chuc_danh_can_bo,
      avatar_url: b.avatar_url,
      da_tra_loi: b.da_tra_loi,
      tra_loi_noi_dung: b.tra_loi_noi_dung,
      tra_loi_boi_ten: b.tra_loi_boi_ten,
      tra_loi_boi_chuc_danh: b.tra_loi_boi_chuc_danh,
      tra_loi_luc: b.tra_loi_luc
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert binh_luan:', error);
  } catch (e) {
    console.warn('Lỗi upsert binh_luan lên cloud:', e);
  }
}

export async function deleteBinhLuanCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('binh_luan_thong_bao').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete binh_luan:', error);
  } catch (e) {
    console.warn('Lỗi xóa binh_luan trên cloud:', e);
  }
}

export async function upsertBoundaryCloud(f: any) {
  if (!supabase) return;
  try {
    const id = String(f.properties?.id || f.id || 'boundary');
    const { error } = await supabase.from('gis_boundaries').upsert({
      id,
      ma_vung: String(f.properties?.id || f.id),
      ten_vung: f.properties?.name || f.properties?.to_dan_cu || 'Vùng',
      loai_vung: f.properties?.type || 'to_dan_cu',
      to_truong: f.properties?.to_truong,
      so_dien_thoai: f.properties?.phone,
      so_ho: f.properties?.households || 0,
      so_dan: f.properties?.population || 0,
      dien_tich_ha: f.properties?.area_ha || 0,
      color: f.properties?.color || '#0284c7',
      fill_color: f.properties?.fillColor || '#38bdf8',
      geojson_geometry: f.geometry,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert gis_boundaries:', error);
  } catch (e) {
    console.warn('Lỗi upsert boundary lên cloud:', e);
  }
}

export async function deleteBoundaryCloud(boundaryId: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('gis_boundaries').delete().eq('id', String(boundaryId));
    if (error) console.error('[Supabase Error] delete gis_boundaries:', error);
  } catch (e) {
    console.warn('Lỗi xóa boundary trên cloud:', e);
  }
}

export async function upsertProfileCloud(p: UserProfile) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('profiles').upsert({
      id: String(p.id),
      email: p.email,
      ho_ten: p.ho_ten,
      so_dien_thoai: p.so_dien_thoai || '',
      vai_tro: p.vai_tro,
      to_phu_trach: p.to_phu_trach,
      trang_thai: p.trang_thai,
      avatar_url: p.avatar_url || '',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert profiles:', error);
  } catch (e) {
    console.warn('Lỗi upsert profile lên cloud:', e);
  }
}

export async function deleteProfileCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('profiles').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete profiles:', error);
  } catch (e) {
    console.warn('Lỗi xóa profile trên cloud:', e);
  }
}

export async function upsertAiKnowledgeCloud(k: AiKnowledgeItem) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('ai_knowledge').upsert({
      id: String(k.id),
      code: `AI-${k.id}`,
      title: k.title,
      category: k.category,
      content: k.content,
      source: k.source || 'Ban Nhân Dân Thôn',
      tags: k.keywords || [],
      applicable_to: 'Toàn thôn',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    if (error) console.error('[Supabase Error] upsert ai_knowledge:', error);
  } catch (e) {
    console.warn('Lỗi upsert ai_knowledge lên cloud:', e);
  }
}

export async function deleteAiKnowledgeCloud(id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('ai_knowledge').delete().eq('id', String(id));
    if (error) console.error('[Supabase Error] delete ai_knowledge:', error);
  } catch (e) {
    console.warn('Lỗi xóa ai_knowledge trên cloud:', e);
  }
}

export async function insertAuditLogCloud(log: AuditLog) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('nhat_ky_thao_tac').insert({
      id: String(log.id),
      user_name: log.user_name,
      user_email: log.user_email || 'admin@antrach.danang.gov.vn',
      hanh_dong: log.hanh_dong,
      bang_du_lieu: log.bang_du_lieu,
      ban_ghi_id: log.ban_ghi_id || null,
      mo_ta: log.mo_ta,
      created_at: log.created_at || new Date().toISOString()
    });
  } catch (e) {
    console.warn('Lỗi insert nhat_ky_thao_tac lên cloud:', e);
  }
}

// --------------------------------------------------------------------------
// 4. LẮNG NGHE REALTIME SUPABASE CHANNELS
// --------------------------------------------------------------------------

export function subscribeToRealtimeChanges(onTableChange: (tableName: string, payload: any) => void) {
  if (!supabase || !isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('public:all-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'nhan_khau' }, (payload) => {
      onTableChange('nhan_khau', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ho_khau' }, (payload) => {
      onTableChange('ho_khau', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'san_xuat_nong_nghiep' }, (payload) => {
      onTableChange('san_xuat_nong_nghiep', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cong_van' }, (payload) => {
      onTableChange('cong_van', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'thong_bao' }, (payload) => {
      onTableChange('thong_bao', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'binh_luan_thong_bao' }, (payload) => {
      onTableChange('binh_luan_thong_bao', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'can_bo_thon' }, (payload) => {
      onTableChange('can_bo_thon', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
      onTableChange('profiles', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_knowledge' }, (payload) => {
      onTableChange('ai_knowledge', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gis_boundaries' }, (payload) => {
      onTableChange('gis_boundaries', payload);
    })
    .subscribe();

  return () => {
    if (supabase) {
      supabase.removeChannel(channel);
    }
  };
}
