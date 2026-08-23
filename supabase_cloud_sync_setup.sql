-- ==============================================================================
-- CẤU HÌNH SUPABASE CLOUD REALTIME SYNC HOÀN CHỈNH CHO THÔN SỐ AN TRẠCH
-- Tự động tạo đầy đủ bảng dữ liệu, gỡ khóa ngoại cứng, mở RLS & kích hoạt Realtime
-- ==============================================================================

-- 1. BẬT EXTENSION CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TẠO CÁC BẢNG NẾU CHƯA CÓ (CREATE TABLES IF NOT EXISTS)

-- 2.1 Bảng PROFILES (Hồ sơ Cán bộ & Tài khoản)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  ho_ten TEXT NOT NULL,
  so_dien_thoai TEXT,
  vai_tro TEXT NOT NULL DEFAULT 'to_truong',
  to_phu_trach TEXT NOT NULL DEFAULT 'Tổ 1',
  trang_thai TEXT NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  password_hash TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 Bảng HO_KHAU (Sổ Hộ Khẩu Gia Đình)
CREATE TABLE IF NOT EXISTS public.ho_khau (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_ho TEXT NOT NULL UNIQUE,
  ten_chu_ho TEXT NOT NULL,
  so_cmnd_chu_ho TEXT,
  so_dien_thoai TEXT,
  dia_chi TEXT NOT NULL,
  to_dan_cu TEXT NOT NULL,
  so_nhan_khau INTEGER NOT NULL DEFAULT 1,
  ghi_chu TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 Bảng NHAN_KHAU (2.308 Hồ Sơ Nhân Khẩu Chi Tiết)
CREATE TABLE IF NOT EXISTS public.nhan_khau (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt_excel INTEGER,
  ma_ho TEXT NOT NULL,
  chu_ho TEXT NOT NULL,
  quan_he_chu_ho TEXT NOT NULL,
  ho_ten TEXT NOT NULL,
  gioi_tinh TEXT NOT NULL,
  ngay_thang_nam_sinh TEXT,
  nam_sinh INTEGER,
  tuoi INTEGER,
  nhom_tuoi TEXT,
  so_cmnd_cccd TEXT,
  loai_giay_to TEXT,
  dien_thoai TEXT,
  ho_ten_cha TEXT,
  ho_ten_me TEXT,
  ma_the_bhyt TEXT,
  nhom_bhyt TEXT,
  nghe_nghiep TEXT,
  dia_chi TEXT NOT NULL,
  to_dan_cu TEXT NOT NULL,
  trang_thai_cu_tru TEXT NOT NULL DEFAULT 'Đang thường trú',
  doi_tuong_dac_thu TEXT DEFAULT 'Bình thường',
  ghi_chu TEXT,
  nguon_dong_bo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 Bảng SAN_XUAT_NONG_NGHIEP (647 Thửa Đất Sản Xuất & Mùa Vụ)
CREATE TABLE IF NOT EXISTS public.san_xuat_nong_nghiep (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt INTEGER,
  dot_phan_bo TEXT,
  giong_lua TEXT,
  xu_dong TEXT,
  lo_thua_dat TEXT,
  chu_dat TEXT,
  ho_san_xuat TEXT,
  la_chinh_chu BOOLEAN DEFAULT true,
  dien_tich_m2 NUMERIC DEFAULT 0,
  giong_cap_kg NUMERIC DEFAULT 0,
  mua_them_kg NUMERIC DEFAULT 0,
  don_gia NUMERIC DEFAULT 0,
  thanh_tien NUMERIC DEFAULT 0,
  ky_nhan TEXT DEFAULT 'Đã nhận',
  to_dan_cu TEXT DEFAULT 'Tổ 1',
  trang_thai_canh_tac TEXT DEFAULT 'chuan_bi_dat',
  ghi_chu TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 Bảng CONG_VAN (Văn Thư & Điều Hành)
CREATE TABLE IF NOT EXISTS public.cong_van (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  so_ky_hieu TEXT NOT NULL,
  trich_yeu TEXT NOT NULL,
  loai_cong_van TEXT NOT NULL DEFAULT 'chi_dao',
  co_quan_ban_hanh TEXT NOT NULL,
  ngay_ban_hanh TEXT,
  ngay_tiep_nhan TEXT,
  do_khan TEXT DEFAULT 'thuong',
  do_mat TEXT DEFAULT 'thuong',
  han_xu_ly TEXT,
  trang_thai TEXT DEFAULT 'dang_xu_ly',
  nguoi_chu_tri_ten TEXT,
  nguoi_chu_tri_chuc_vu TEXT,
  can_bo_phoi_hop TEXT[] DEFAULT '{}',
  chi_dao_xu_ly TEXT,
  tien_do_phan_tram INTEGER DEFAULT 0,
  ket_qua_xu_ly TEXT,
  file_url TEXT,
  file_name TEXT,
  nguoi_tao_ten TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 Bảng THONG_BAO (Bản Tin & Thông Báo)
CREATE TABLE IF NOT EXISTS public.thong_bao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tieu_de TEXT NOT NULL,
  noi_dung TEXT NOT NULL,
  loai_tin TEXT NOT NULL DEFAULT 'thong_bao_chung',
  pham_vi TEXT NOT NULL DEFAULT 'Toàn thôn',
  is_ghim BOOLEAN NOT NULL DEFAULT false,
  is_cong_khai BOOLEAN NOT NULL DEFAULT true,
  nguoi_dang_ten TEXT,
  nguoi_dang_vai_tro TEXT,
  hinh_anh_url TEXT,
  tep_dinh_kem_url TEXT,
  luot_xem INT NOT NULL DEFAULT 0,
  so_luot_thich INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 Bảng BINH_LUAN_THONG_BAO
CREATE TABLE IF NOT EXISTS public.binh_luan_thong_bao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thong_bao_id UUID,
  ho_ten_nguoi_gui TEXT NOT NULL,
  so_dien_thoai TEXT,
  to_dan_cu TEXT,
  noi_dung TEXT NOT NULL,
  is_can_bo BOOLEAN DEFAULT false,
  chuc_danh_can_bo TEXT,
  avatar_url TEXT,
  da_tra_loi BOOLEAN DEFAULT false,
  tra_loi_noi_dung TEXT,
  tra_loi_boi_ten TEXT,
  tra_loi_boi_chuc_danh TEXT,
  tra_loi_luc TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.8 Bảng CAN_BO_THON (20 Cán Bộ Trụ Cột)
CREATE TABLE IF NOT EXISTS public.can_bo_thon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ho_ten TEXT NOT NULL,
  chuc_vu TEXT NOT NULL,
  khoi TEXT NOT NULL DEFAULT 'ban_nhan_dan',
  to_phu_trach TEXT,
  so_dien_thoai TEXT,
  email TEXT,
  nam_sinh INTEGER,
  trinh_do TEXT,
  nhiem_vu_chinh TEXT,
  quyen_han TEXT,
  can_cu_phap_ly TEXT,
  avatar_url TEXT,
  ngay_bo_nhiem TEXT,
  trang_thai TEXT DEFAULT 'active',
  so_ho_phu_trach INTEGER DEFAULT 0,
  so_dan_phu_trach INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.9 Bảng GIS_BOUNDARIES (Ranh Giới 8 Tổ Dân Cư)
CREATE TABLE IF NOT EXISTS public.gis_boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_vung TEXT NOT NULL UNIQUE,
  ten_vung TEXT NOT NULL,
  loai_vung TEXT DEFAULT 'to_dan_cu',
  to_truong TEXT,
  so_dien_thoai TEXT,
  so_ho INTEGER DEFAULT 0,
  so_dan INTEGER DEFAULT 0,
  dien_tich_ha NUMERIC DEFAULT 0,
  color TEXT DEFAULT '#0284c7',
  fill_color TEXT DEFAULT '#38bdf8',
  geojson_geometry JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.10 Bảng NHAT_KY_THAO_TAC (Audit Logs)
CREATE TABLE IF NOT EXISTS public.nhat_ky_thao_tac (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  hanh_dong TEXT NOT NULL,
  bang_du_lieu TEXT NOT NULL,
  ban_ghi_id TEXT,
  du_lieu_cu JSONB,
  du_lieu_moi JSONB,
  mo_ta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.11 Bảng AI_KNOWLEDGE (Cơ Sở Tri Thức An Trạch AI)
CREATE TABLE IF NOT EXISTS public.ai_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  source TEXT,
  applicable_to TEXT DEFAULT 'Toàn thôn',
  tags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. GỠ BỎ RÀNG BUỘC KHÓA NGOẠI CỨNG ĐỂ CLIENT WEB SYNC TỰ DO
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE IF EXISTS public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE IF EXISTS public.nhan_khau DROP CONSTRAINT IF EXISTS nhan_khau_ma_ho_fkey;
ALTER TABLE IF EXISTS public.nhan_khau DROP CONSTRAINT IF EXISTS nhan_khau_updated_by_fkey;
ALTER TABLE IF EXISTS public.ho_khau DROP CONSTRAINT IF EXISTS ho_khau_updated_by_fkey;
ALTER TABLE IF EXISTS public.ho_khau DROP CONSTRAINT IF EXISTS ho_khau_chu_ho_id_fkey;
ALTER TABLE IF EXISTS public.thong_bao DROP CONSTRAINT IF EXISTS thong_bao_nguoi_dang_id_fkey;
ALTER TABLE IF EXISTS public.binh_luan_thong_bao DROP CONSTRAINT IF EXISTS binh_luan_thong_bao_thong_bao_id_fkey;
ALTER TABLE IF EXISTS public.nhat_ky_thao_tac DROP CONSTRAINT IF EXISTS nhat_ky_thao_tac_user_id_fkey;

-- 4. MỞ CHÍNH SÁCH RLS ĐỒNG BỘ CHO CLIENT (ANON + AUTHENTICATED)
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN (
        'profiles', 'nhan_khau', 'ho_khau', 'san_xuat_nong_nghiep', 
        'cong_van', 'thong_bao', 'binh_luan_thong_bao', 'can_bo_thon', 
        'gis_boundaries', 'nhat_ky_thao_tac', 'ai_knowledge'
      )
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', tbl || '_sync_all_policy', tbl);
      EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);', tbl || '_sync_all_policy', tbl);
    EXCEPTION WHEN OTHERS THEN 
      NULL;
    END;
  END LOOP;
END $$;

-- 5. KÍCH HOẠT SUPABASE REALTIME REPLICATION CHO TẤT CẢ CÁC BẢNG
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN (
        'profiles', 'nhan_khau', 'ho_khau', 'san_xuat_nong_nghiep', 
        'cong_van', 'thong_bao', 'binh_luan_thong_bao', 'can_bo_thon', 
        'gis_boundaries', 'nhat_ky_thao_tac', 'ai_knowledge'
      )
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', tbl);
    EXCEPTION WHEN OTHERS THEN 
      NULL;
    END;
  END LOOP;
END $$;
