-- ==============================================================================
-- HỆ THỐNG QUẢN TRỊ DÂN CƯ SỐ THÔN AN TRẠCH (XÃ HÒA TIẾN, ĐÀ NẴNG)
-- SUPABASE POSTGRESQL COMPLETE DATABASE SCHEMA, RLS POLICIES, FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 1. BẬT CÁC EXTENSION CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 2. TẠO CÁC ENUM TYPE
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'super_admin',      -- Quản trị viên tối cao
      'admin',            -- Quản trị viên hệ thống
      'truong_thon',      -- Trưởng thôn (Toàn quyền quản lý dân cư & hộ khẩu)
      'to_truong',        -- Tổ trưởng tổ dân cư (Tổ 1 - 8)
      'can_bo_y_te',      -- Cán bộ y tế thôn/xã
      'cong_an_vien',     -- Công an viên phụ trách thôn
      'can_bo_xa'         -- Cán bộ UBND xã giám sát
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM (
      'pending_approval', -- Chờ duyệt
      'active',           -- Đã kích hoạt
      'blocked'           -- Đang bị khóa
    );
  END IF;
END $$;

-- ==============================================================================
-- 3. ĐỊNH NGHĨA CÁC BẢNG DỮ LIỆU CHÍNH
-- ==============================================================================

-- 3.1. Bảng PROFILES (Hồ sơ Cán bộ & Quản trị viên)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  ho_ten TEXT NOT NULL,
  so_dien_thoai TEXT,
  vai_tro user_role NOT NULL DEFAULT 'to_truong',
  to_phu_trach TEXT NOT NULL DEFAULT 'Tổ 1', -- 'Toàn thôn', 'Tổ 1', ..., 'Tổ 8'
  trang_thai user_status NOT NULL DEFAULT 'pending_approval',
  avatar_url TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.2. Bảng HO_KHAU (Sổ Hộ Khẩu Gia Đình)
CREATE TABLE IF NOT EXISTS public.ho_khau (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_ho TEXT NOT NULL UNIQUE,
  chu_ho_id UUID,
  ten_chu_ho TEXT NOT NULL,
  so_cmnd_chu_ho TEXT,
  so_dien_thoai TEXT,
  dia_chi TEXT NOT NULL,
  to_dan_cu TEXT NOT NULL,
  so_nhan_khau INTEGER NOT NULL DEFAULT 1,
  ghi_chu TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES public.profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_ho_khau_to ON public.ho_khau(to_dan_cu);
CREATE INDEX IF NOT EXISTS idx_ho_khau_ma_ho ON public.ho_khau(ma_ho);

-- 3.3. Bảng NHAN_KHAU (2.308 Hồ Sơ Nhân Khẩu Chi Tiết)
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
  search_tsv TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_by UUID REFERENCES public.profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_nhan_khau_ma_ho ON public.nhan_khau(ma_ho);
CREATE INDEX IF NOT EXISTS idx_nhan_khau_to ON public.nhan_khau(to_dan_cu);
CREATE INDEX IF NOT EXISTS idx_nhan_khau_cccd ON public.nhan_khau(so_cmnd_cccd);
CREATE INDEX IF NOT EXISTS idx_nhan_khau_bhyt ON public.nhan_khau(ma_the_bhyt);
CREATE INDEX IF NOT EXISTS idx_nhan_khau_cu_tru ON public.nhan_khau(trang_thai_cu_tru);
CREATE INDEX IF NOT EXISTS idx_nhan_khau_nam_sinh ON public.nhan_khau(nam_sinh);
CREATE INDEX IF NOT EXISTS idx_nhan_khau_search ON public.nhan_khau USING GIN(search_tsv);

-- 3.4. Bảng NHAT_KY_THAO_TAC (Audit Log Tự Động)
CREATE TABLE IF NOT EXISTS public.nhat_ky_thao_tac (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  user_email TEXT,
  user_name TEXT,
  hanh_dong TEXT NOT NULL,     -- 'INSERT', 'UPDATE', 'DELETE', 'IMPORT_EXCEL', 'EXPORT_EXCEL', 'APPROVE_USER'
  bang_du_lieu TEXT NOT NULL,  -- 'nhan_khau', 'ho_khau', 'profiles'
  ban_ghi_id TEXT,
  du_lieu_cu JSONB,
  du_lieu_moi JSONB,
  mo_ta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.nhat_ky_thao_tac(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.nhat_ky_thao_tac(user_id);

-- 3.5. Bảng THONG_BAO (Bản Tin & Thông Báo Thôn)
CREATE TABLE IF NOT EXISTS public.thong_bao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tieu_de TEXT NOT NULL,
  noi_dung TEXT NOT NULL,
  loai_tin TEXT NOT NULL DEFAULT 'thong_bao_chung', -- 'thong_bao_chung', 'khancap', 'lichhop', 'y_te', 'chinh_sach'
  pham_vi TEXT NOT NULL DEFAULT 'Toàn thôn',         -- 'Toàn thôn', 'Tổ 1'..'Tổ 8'
  is_ghim BOOLEAN NOT NULL DEFAULT false,
  is_cong_khai BOOLEAN NOT NULL DEFAULT true,
  nguoi_dang_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nguoi_dang_ten TEXT,
  nguoi_dang_vai_tro TEXT,
  hinh_anh_url TEXT,
  tep_dinh_kem_url TEXT,
  luot_xem INT NOT NULL DEFAULT 0,
  so_luot_thich INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3.6. Bảng BINH_LUAN_THONG_BAO (Hỏi Đáp & Tương Tác Của Người Dân)
CREATE TABLE IF NOT EXISTS public.binh_luan_thong_bao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thong_bao_id UUID NOT NULL REFERENCES public.thong_bao(id) ON DELETE CASCADE,
  ho_ten_nguoi_gui TEXT NOT NULL,
  so_dien_thoai TEXT,
  to_dan_cu TEXT,
  noi_dung TEXT NOT NULL,
  is_can_bo BOOLEAN NOT NULL DEFAULT false,
  chuc_danh_can_bo TEXT,
  avatar_url TEXT,
  da_tra_loi BOOLEAN NOT NULL DEFAULT false,
  tra_loi_noi_dung TEXT,
  tra_loi_boi_ten TEXT,
  tra_loi_boi_chuc_danh TEXT,
  tra_loi_luc TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_binh_luan_thong_bao ON public.binh_luan_thong_bao(thong_bao_id);
CREATE INDEX IF NOT EXISTS idx_binh_luan_created ON public.binh_luan_thong_bao(created_at DESC);

-- 3.7. Bảng CAN_BO_THON (Bộ Máy Hành Chính & Cán Bộ Cơ Sở)
CREATE TABLE IF NOT EXISTS public.can_bo_thon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ho_ten TEXT NOT NULL,
  chuc_vu TEXT NOT NULL,
  khoi TEXT NOT NULL, -- 'chi_bo', 'ban_nhan_dan', 'to_dan_cu', 'nghiep_vu', 'mat_tran_doan_the'
  to_phu_trach TEXT NOT NULL DEFAULT 'Toàn thôn',
  so_dien_thoai TEXT NOT NULL,
  email TEXT NOT NULL,
  nam_sinh INT,
  trinh_do TEXT,
  nhiem_vu_chinh TEXT NOT NULL,
  quyen_han TEXT NOT NULL,
  can_cu_phap_ly TEXT NOT NULL,
  avatar_url TEXT,
  ngay_bo_nhiem DATE,
  trang_thai TEXT NOT NULL DEFAULT 'active', -- 'active', 'leave', 'transferred'
  so_ho_phu_trach INT DEFAULT 0,
  so_dan_phu_trach INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_can_bo_khoi ON public.can_bo_thon(khoi);
CREATE INDEX IF NOT EXISTS idx_can_bo_to ON public.can_bo_thon(to_phu_trach);

-- 3.8. Bảng CONG_VAN (Quản Lý Công Văn & Phân Công Nhiệm Vụ)
CREATE TABLE IF NOT EXISTS public.cong_van (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  so_ky_hieu TEXT NOT NULL,
  trich_yeu TEXT NOT NULL,
  loai_cong_van TEXT NOT NULL DEFAULT 'van_ban_den', -- 'van_ban_den', 'van_ban_di', 'noi_bo', 'to_trinh', 'chi_dao'
  co_quan_ban_hanh TEXT NOT NULL,
  ngay_ban_hanh DATE NOT NULL,
  ngay_tiep_nhan DATE NOT NULL,
  do_khan TEXT NOT NULL DEFAULT 'thuong',             -- 'thuong', 'khan', 'hoa_toc'
  do_mat TEXT NOT NULL DEFAULT 'thuong',              -- 'thuong', 'mat', 'tuyet_mat'
  han_xu_ly DATE,
  trang_thai TEXT NOT NULL DEFAULT 'dang_xu_ly',      -- 'cho_phan_cong', 'dang_xu_ly', 'hoan_thanh', 'qua_han', 'luu_tru'
  nguoi_chu_tri_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nguoi_chu_tri_ten TEXT,
  nguoi_chu_tri_chuc_vu TEXT,
  can_bo_phoi_hop TEXT[] DEFAULT '{}',
  chi_dao_xu_ly TEXT,
  tien_do_phan_tram INT NOT NULL DEFAULT 0,
  ket_qua_xu_ly TEXT,
  file_url TEXT,
  file_name TEXT,
  nguoi_tao_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nguoi_tao_ten TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cong_van_loai ON public.cong_van(loai_cong_van);
CREATE INDEX IF NOT EXISTS idx_cong_van_trang_thai ON public.cong_van(trang_thai);
CREATE INDEX IF NOT EXISTS idx_cong_van_han_xu_ly ON public.cong_van(han_xu_ly);

-- 3.9. Bảng GIS_BOUNDARIES (Ranh Giới Không Gian Địa Lý GeoJSON)
CREATE TABLE IF NOT EXISTS public.gis_boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_vung TEXT NOT NULL UNIQUE,       -- 'thon_an_trach', 'to_1' .. 'to_8'
  ten_vung TEXT NOT NULL,
  loai_vung TEXT NOT NULL DEFAULT 'to_dan_cu', -- 'thon', 'to_dan_cu'
  to_truong TEXT,
  so_dien_thoai TEXT,
  so_ho INT DEFAULT 0,
  so_dan INT DEFAULT 0,
  dien_tich_ha NUMERIC(10,2) DEFAULT 0,
  color TEXT DEFAULT '#0284c7',
  fill_color TEXT DEFAULT '#38bdf8',
  geojson_geometry JSONB NOT NULL,    -- GeoJSON Geometry Polygon
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gis_ma_vung ON public.gis_boundaries(ma_vung);

-- 3.10. Bảng SAN_XUAT_NONG_NGHIEP (Sổ Bộ Sản Xuất & Mùa Vụ Nông Nghiệp Thôn An Trạch)
CREATE TABLE IF NOT EXISTS public.san_xuat_nong_nghiep (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stt INTEGER,
  dot_phan_bo TEXT NOT NULL DEFAULT 'HG12-T9',
  giong_lua TEXT NOT NULL DEFAULT 'HG12',
  xu_dong TEXT NOT NULL DEFAULT 'Tổ 9',
  lo_thua_dat TEXT NOT NULL,
  chu_dat TEXT NOT NULL,
  ho_san_xuat TEXT NOT NULL,
  la_chinh_chu BOOLEAN NOT NULL DEFAULT true,
  dien_tich_m2 NUMERIC(12, 2) NOT NULL DEFAULT 0,
  giong_cap_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
  mua_them_kg NUMERIC(10, 2) DEFAULT 0,
  don_gia NUMERIC(12, 2) DEFAULT 0,
  thanh_tien NUMERIC(15, 2) DEFAULT 0,
  ky_nhan TEXT DEFAULT 'Đã nhận giống',
  to_dan_cu TEXT DEFAULT 'Tổ 1',
  trang_thai_canh_tac TEXT DEFAULT 'chuan_bi_dat',
  ghi_chu TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_san_xuat_xu_dong ON public.san_xuat_nong_nghiep(xu_dong);
CREATE INDEX IF NOT EXISTS idx_san_xuat_giong_lua ON public.san_xuat_nong_nghiep(giong_lua);
CREATE INDEX IF NOT EXISTS idx_san_xuat_chu_dat ON public.san_xuat_nong_nghiep(chu_dat);
CREATE INDEX IF NOT EXISTS idx_san_xuat_ho_sx ON public.san_xuat_nong_nghiep(ho_san_xuat);
CREATE INDEX IF NOT EXISTS idx_san_xuat_to_dan_cu ON public.san_xuat_nong_nghiep(to_dan_cu);

-- ==============================================================================
-- 4. HÀM BẢO MẬT & HELPER CHỐNG ĐỆ QUY RLS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT vai_tro::text FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND vai_tro IN ('super_admin', 'admin')
      AND trang_thai = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_my_to()
RETURNS TEXT LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT to_phu_trach FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_active_member()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
      AND trang_thai = 'active'
  );
$$;

-- Hàm tự động tạo vector tìm kiếm tiếng Việt không dấu
CREATE OR REPLACE FUNCTION public.generate_nhan_khau_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_tsv := to_tsvector('simple', unaccent(
    COALESCE(NEW.ho_ten, '') || ' ' ||
    COALESCE(NEW.so_cmnd_cccd, '') || ' ' ||
    COALESCE(NEW.ma_the_bhyt, '') || ' ' ||
    COALESCE(NEW.ma_ho, '') || ' ' ||
    COALESCE(NEW.chu_ho, '') || ' ' ||
    COALESCE(NEW.dien_thoai, '') || ' ' ||
    COALESCE(NEW.to_dan_cu, '') || ' ' ||
    COALESCE(NEW.dia_chi, '')
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_nhan_khau_search_vector
  BEFORE INSERT OR UPDATE ON public.nhan_khau
  FOR EACH ROW EXECUTE FUNCTION public.generate_nhan_khau_search_vector();

-- ==============================================================================
-- 5. TRIGGERS TỰ ĐỘNG HÓA AUTH & AUDIT LOG
-- ==============================================================================

-- 5.1. Trigger tự tạo Profile khi người dùng đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, ho_ten, vai_tro, to_phu_trach, trang_thai)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'ho_ten', split_part(new.email, '@', 1)),
    'to_truong',
    'Tổ 1',
    'pending_approval'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5.2. Trigger tự động ghi Audit Log khi thay đổi Nhân khẩu
CREATE OR REPLACE FUNCTION public.log_nhan_khau_activity()
RETURNS TRIGGER AS $$
DECLARE
  curr_uid UUID;
  curr_email TEXT;
  curr_name TEXT;
BEGIN
  curr_uid := auth.uid();
  SELECT email, ho_ten INTO curr_email, curr_name FROM public.profiles WHERE id = curr_uid;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.nhat_ky_thao_tac (user_id, user_email, user_name, hanh_dong, bang_du_lieu, ban_ghi_id, du_lieu_moi, mo_ta)
    VALUES (curr_uid, curr_email, curr_name, 'INSERT', 'nhan_khau', NEW.id::text, row_to_json(NEW)::jsonb, 'Thêm mới nhân khẩu: ' || NEW.ho_ten);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.nhat_ky_thao_tac (user_id, user_email, user_name, hanh_dong, bang_du_lieu, ban_ghi_id, du_lieu_cu, du_lieu_moi, mo_ta)
    VALUES (curr_uid, curr_email, curr_name, 'UPDATE', 'nhan_khau', NEW.id::text, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, 'Cập nhật nhân khẩu: ' || NEW.ho_ten);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO public.nhat_ky_thao_tac (user_id, user_email, user_name, hanh_dong, bang_du_lieu, ban_ghi_id, du_lieu_cu, mo_ta)
    VALUES (curr_uid, curr_email, curr_name, 'DELETE', 'nhan_khau', OLD.id::text, row_to_json(OLD)::jsonb, 'Xóa nhân khẩu: ' || OLD.ho_ten);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_audit_nhan_khau ON public.nhan_khau;
CREATE TRIGGER trg_audit_nhan_khau
  AFTER INSERT OR UPDATE OR DELETE ON public.nhan_khau
  FOR EACH ROW EXECUTE FUNCTION public.log_nhan_khau_activity();

-- ==============================================================================
-- 6. CHÍNH SÁCH ROW LEVEL SECURITY (RLS POLICIES)
-- ==============================================================================

-- 6.1. Bật RLS trên tất cả các bảng
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ho_khau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nhan_khau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nhat_ky_thao_tac ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thong_bao ENABLE ROW LEVEL SECURITY;

-- 6.2. Chính sách cho bảng PROFILES
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin() OR public.get_my_role() = 'truong_thon');

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 6.3. Chính sách cho bảng NHAN_KHAU
CREATE POLICY "nhan_khau_select_policy" ON public.nhan_khau
  FOR SELECT TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_y_te', 'cong_an_vien', 'can_bo_xa') OR
      public.get_my_to() = 'Toàn thôn' OR
      public.get_my_to() = to_dan_cu
    )
  );

CREATE POLICY "nhan_khau_insert_policy" ON public.nhan_khau
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() = 'truong_thon' OR
      (public.get_my_role() = 'to_truong' AND (public.get_my_to() = 'Toàn thôn' OR public.get_my_to() = to_dan_cu))
    )
  );

CREATE POLICY "nhan_khau_update_policy" ON public.nhan_khau
  FOR UPDATE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_y_te', 'cong_an_vien') OR
      (public.get_my_role() = 'to_truong' AND (public.get_my_to() = 'Toàn thôn' OR public.get_my_to() = to_dan_cu))
    )
  )
  WITH CHECK (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_y_te', 'cong_an_vien') OR
      (public.get_my_role() = 'to_truong' AND (public.get_my_to() = 'Toàn thôn' OR public.get_my_to() = to_dan_cu))
    )
  );

CREATE POLICY "nhan_khau_delete_policy" ON public.nhan_khau
  FOR DELETE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR public.get_my_role() = 'truong_thon'
    )
  );

-- 6.4. Chính sách cho bảng HO_KHAU
CREATE POLICY "ho_khau_select_policy" ON public.ho_khau
  FOR SELECT TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_y_te', 'cong_an_vien', 'can_bo_xa') OR
      public.get_my_to() = 'Toàn thôn' OR
      public.get_my_to() = to_dan_cu
    )
  );

CREATE POLICY "ho_khau_insert_update_policy" ON public.ho_khau
  FOR ALL TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() = 'truong_thon' OR
      (public.get_my_role() = 'to_truong' AND (public.get_my_to() = 'Toàn thôn' OR public.get_my_to() = to_dan_cu))
    )
  );

-- 6.5. Chính sách cho bảng NHAT_KY_THAO_TAC
CREATE POLICY "audit_insert_policy" ON public.nhat_ky_thao_tac
  FOR INSERT TO authenticated
  WITH CHECK (public.is_active_member());

CREATE POLICY "audit_select_policy" ON public.nhat_ky_thao_tac
  FOR SELECT TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR public.get_my_role() = 'truong_thon'
    )
  );

-- 6.6. Chính sách RLS cho bảng THONG_BAO (Bản Tin Thôn)
CREATE POLICY "thong_bao_select_policy" ON public.thong_bao
  FOR SELECT TO anon, authenticated
  USING (is_cong_khai = true OR (auth.role() = 'authenticated' AND public.is_active_member()));

CREATE POLICY "thong_bao_insert_policy" ON public.thong_bao
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_y_te', 'cong_an_vien', 'can_bo_xa') OR
      (public.get_my_role() = 'to_truong' AND (public.get_my_to() = 'Toàn thôn' OR public.get_my_to() = pham_vi))
    )
  );

CREATE POLICY "thong_bao_update_policy" ON public.thong_bao
  FOR UPDATE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() = 'truong_thon' OR
      nguoi_dang_id = auth.uid()
    )
  );

CREATE POLICY "thong_bao_delete_policy" ON public.thong_bao
  FOR DELETE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() = 'truong_thon' OR
      nguoi_dang_id = auth.uid()
    )
  );

-- 6.7. Chính sách RLS cho bảng BINH_LUAN_THONG_BAO (Hỏi Đáp Người Dân)
ALTER TABLE public.binh_luan_thong_bao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "binh_luan_select_policy" ON public.binh_luan_thong_bao
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "binh_luan_insert_policy" ON public.binh_luan_thong_bao
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "binh_luan_officer_reply_policy" ON public.binh_luan_thong_bao
  FOR UPDATE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR public.get_my_role() IN ('truong_thon', 'to_truong', 'can_bo_y_te', 'cong_an_vien', 'can_bo_xa')
    )
  );

CREATE POLICY "binh_luan_delete_policy" ON public.binh_luan_thong_bao
  FOR DELETE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR public.get_my_role() = 'truong_thon'
    )
  );

-- 6.8. Chính sách RLS cho bảng CAN_BO_THON (Bộ Máy Hành Chính Cơ Sở)
ALTER TABLE public.can_bo_thon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "can_bo_select_policy" ON public.can_bo_thon
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "can_bo_insert_policy" ON public.can_bo_thon
  FOR INSERT TO authenticated
  WITH CHECK (public.is_active_member() AND public.is_admin());

CREATE POLICY "can_bo_update_policy" ON public.can_bo_thon
  FOR UPDATE TO authenticated
  USING (public.is_active_member() AND (public.is_admin() OR public.get_my_role() = 'truong_thon'));

CREATE POLICY "can_bo_delete_policy" ON public.can_bo_thon
  FOR DELETE TO authenticated
  USING (public.is_active_member() AND public.is_admin());

-- 6.9. Chính sách RLS cho bảng CONG_VAN (Quản Lý Công Văn & Phân Công Nhiệm Vụ)
ALTER TABLE public.cong_van ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cong_van_select_policy" ON public.cong_van
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "cong_van_insert_policy" ON public.cong_van
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_active_member() AND (
      public.is_admin() OR public.get_my_role() IN ('truong_thon', 'can_bo_xa', 'to_truong')
    )
  );

CREATE POLICY "cong_van_update_policy" ON public.cong_van
  FOR UPDATE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_xa') OR
      nguoi_chu_tri_id = auth.uid()
    )
  );

CREATE POLICY "cong_van_delete_policy" ON public.cong_van
  FOR DELETE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR public.get_my_role() = 'truong_thon'
    )
  );

-- 6.10. Chính sách RLS cho bảng GIS_BOUNDARIES (Ranh Giới Địa Lý GeoJSON)
ALTER TABLE public.gis_boundaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gis_boundaries_select_policy" ON public.gis_boundaries
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "gis_boundaries_insert_policy" ON public.gis_boundaries
  FOR INSERT TO authenticated
  WITH CHECK (public.is_active_member() AND public.is_admin());

CREATE POLICY "gis_boundaries_update_policy" ON public.gis_boundaries
  FOR UPDATE TO authenticated
  USING (public.is_active_member() AND (public.is_admin() OR public.get_my_role() = 'truong_thon'));

CREATE POLICY "gis_boundaries_delete_policy" ON public.gis_boundaries
  FOR DELETE TO authenticated
  USING (public.is_active_member() AND public.is_admin());

-- 6.11. Chính sách RLS cho bảng SAN_XUAT_NONG_NGHIEP (Sổ Bộ Sản Xuất & Mùa Vụ)
ALTER TABLE public.san_xuat_nong_nghiep ENABLE ROW LEVEL SECURITY;

CREATE POLICY "san_xuat_select_policy" ON public.san_xuat_nong_nghiep
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "san_xuat_insert_policy" ON public.san_xuat_nong_nghiep
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_xa') OR
      (public.get_my_role() = 'to_truong' AND (public.get_my_to() = 'Toàn thôn' OR public.get_my_to() = to_dan_cu))
    )
  );

CREATE POLICY "san_xuat_update_policy" ON public.san_xuat_nong_nghiep
  FOR UPDATE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR 
      public.get_my_role() IN ('truong_thon', 'can_bo_xa') OR
      (public.get_my_role() = 'to_truong' AND (public.get_my_to() = 'Toàn thôn' OR public.get_my_to() = to_dan_cu))
    )
  );

CREATE POLICY "san_xuat_delete_policy" ON public.san_xuat_nong_nghiep
  FOR DELETE TO authenticated
  USING (
    public.is_active_member() AND (
      public.is_admin() OR public.get_my_role() = 'truong_thon'
    )
  );

-- ==============================================================================
-- 7. VIEW THỐNG KÊ TỔNG HỢP (KPI PUBLIC VIEW)
-- ==============================================================================
CREATE OR REPLACE VIEW public.view_kpi_thon_an_trach AS
SELECT
  COUNT(*) AS tong_so_nhan_khau,
  COUNT(*) FILTER (WHERE trang_thai_cu_tru IN ('Đang thường trú', 'Trẻ mới sinh (Cập nhật sau 2019)')) AS thuong_tru,
  COUNT(*) FILTER (WHERE gioi_tinh = 'Nam' AND trang_thai_cu_tru IN ('Đang thường trú', 'Trẻ mới sinh (Cập nhật sau 2019)')) AS nam_thuong_tru,
  COUNT(*) FILTER (WHERE gioi_tinh = 'Nữ' AND trang_thai_cu_tru IN ('Đang thường trú', 'Trẻ mới sinh (Cập nhật sau 2019)')) AS nu_thuong_tru,
  COUNT(*) FILTER (WHERE nam_sinh > 2008) AS tre_em_duoi_18,
  COUNT(*) FILTER (WHERE nam_sinh BETWEEN 1966 AND 2008) AS do_tuoi_lao_dong,
  COUNT(*) FILTER (WHERE nam_sinh < 1966) AS nguoi_cao_tuoi,
  COUNT(*) FILTER (WHERE so_cmnd_cccd IS NOT NULL AND so_cmnd_cccd != '') AS da_co_cccd_cmnd,
  COUNT(*) FILTER (WHERE ma_the_bhyt IS NOT NULL AND ma_the_bhyt != '') AS da_co_bhyt,
  COUNT(*) FILTER (WHERE dien_thoai IS NOT NULL AND dien_thoai != '') AS co_so_dien_thoai,
  COUNT(DISTINCT ma_ho) AS tong_so_ho_khau
FROM public.nhan_khau;

-- 7.2. View Thống kê Nông Nghiệp & Mùa Vụ
CREATE OR REPLACE VIEW public.view_kpi_nong_nghiep_thon_an_trach AS
SELECT
  COUNT(*) AS tong_so_thua_ruong,
  SUM(dien_tich_m2) AS tong_dien_tich_m2,
  ROUND(SUM(dien_tich_m2) / 10000.0, 2) AS tong_dien_tich_ha,
  SUM(giong_cap_kg) AS tong_giong_cap_kg,
  SUM(mua_them_kg) AS tong_mua_them_kg,
  SUM(thanh_tien) AS tong_tien_mua_them,
  COUNT(*) FILTER (WHERE la_chinh_chu = true) AS so_thua_chinh_chu,
  COUNT(*) FILTER (WHERE la_chinh_chu = false) AS so_thua_thue_muon,
  COUNT(DISTINCT chu_dat) AS tong_so_chu_dat,
  COUNT(DISTINCT ho_san_xuat) AS tong_so_ho_canh_tac
FROM public.san_xuat_nong_nghiep;
