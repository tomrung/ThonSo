---
name: smart-village-management
description: >-
  Comprehensive guide and architecture standards for developing Smart Village & Digital Government web applications (An Trạch Model). Covers population management (Đề án 06), agriculture & season planning, GIS spatial mapping (2D/3D GeoJSON), RAG AI knowledge hubs, Excel data engines, React state sanitizers, and PageHeaderBanner UI design systems.
---

# Smart Village & Digital Government Development Guide (Mô Hình Thôn Số An Trạch)

## 1. Overview & Architecture Scope

This skill documents the full-stack architecture, design patterns, and engineering standards distilled from the **An Trạch Smart Village & Digital Government System** (`c:/Antigravity20/DataThon`). Use this skill whenever building, modifying, or extending digital governance, civic administration, rural development, demographic registry, agricultural scheduling, or local GIS mapping platforms.

---

## 2. Core Functional Domains & Data Models

### 2.1. Demographic & Population Management (Đề Án 06 CSDL Dân Cư)
- **Scale**: 2,308 residents (`NhanKhau`), 614 households (`HoKhau`), 8 residential groups (`to_dan_cu`).
- **Core Entities**:
  - `NhanKhau`: ID, `ho_ten`, `so_cmnd_cccd` (12-digit chip CCCD / 9-digit CMND), `ngay_sinh`, `tuoi`, `gioi_tinh`, `ma_ho`, `quan_he_chu_ho`, `ma_the_bhyt`, `nhom_bhyt`, `doi_tuong_dac_thu` (Chính sách, Người cao tuổi ≥60, Khuyết tật), `trang_thai_cu_tru` (Thường trú, Tạm trú, Chuyển đi).
  - `HoKhau`: `ma_ho`, `ten_chu_ho`, `so_cmnd_chu_ho`, `dia_chi`, `to_dan_cu`, `so_nhan_khau`, `lat`, `lng`, `loai_ho` (Chuẩn, Hộ nghèo, Chính sách, Vùng ngập lụt, Kinh doanh).
- **Key Modules**:
  - Zxing QR Code Scanner for scanning chip-based Citizen Identity Cards (`so_cmnd_cccd`).
  - Search engine supporting Vietnamese accent-free normalization (`removeVietnameseTones`).

### 2.2. Agricultural Production & Irrigation (Quản Lý Sản Xuất & Mùa Vụ)
- **Scale**: 647 rice parcels (`SanXuatRecord`), 5 farming zones / xứ đồng (`XuDongMeta`: Tổ 9, Hà Ra, La Châu, La Bông Tây, Gò Ổi), 43.86 ha total paddy land, 5.26 tons distributed seeds per season (Vụ Đông Xuân / Vụ Hè Thu).
- **Core Entities**:
  - `SanXuatRecord`: `ma_ho`, `chu_ho`, `ma_thua_dat`, `so_to_ban_do`, `so_thua`, `xu_dong`, `dien_tich_m2`, `giong_lua` (BC15, ĐV108, TBR225, Thiên Ưu 8, HN6), `giong_cap_kg`, `dot_phan_bo`, `trang_thai_ky_nhan`.
  - `XuDongMeta`: `ma_xu_dong`, `ten_xu_dong`, `vi_tri`, `dien_tich_m2`, `so_thua`, `giong_chinh`, `nguon_nuoc`, `mau_sac`.
- **Key Workflows**:
  - Standard seed calculation: `giong_cap_kg = round(dien_tich_m2 * 0.012)`.
  - Water intake scheduling based on Sông Yên pumping station and canal gates.

### 2.3. Spatial GIS & GeoJSON 2D/3D Mapping
- **Scale**: Multi-point polygons for 8 residential boundaries and 647 agricultural parcels.
- **Layers**: ESRI Satellite Imagery HD, OpenStreetMap Road Network, CartoDB Terrain.
- **Capabilities**:
  - Interactive Leaflet 2D map with custom SVG markers and color-coded polygons.
  - Geo3D topographic terrain simulation.
  - GeoJSON polygon drawing, vertex editing, backup, and restore.

### 2.4. Local RAG AI Knowledge Hub (An Trạch AI)
- **Engine**: Local semantic search + vector keyword retrieval for village regulations, administrative procedures, healthcare policies, and real-time village data sync.
- **Interactive Sandbox / Playground**: In-browser training and verification prompt runner.

### 2.5. Grassroots Administration & Digital Secretariat
- **Cadre Directory (`canBoList`)**: 20 officers across 5 blocks (Chi bộ Đảng, Ban Nhân dân thôn, 8 Tổ Dân Cư, Khối Nghiệp vụ, Mặt trận Đoàn thể).
- **Official Documents (`CongVan`)**: Incoming/outgoing correspondence under Decree 30/2020/NĐ-CP, task assignment, progress tracking.
- **Interactive Village Board (`ThongBao`)**: Two-way official announcements, public commenting, and officer replies.

---

## 3. UI/UX Design Standards: The `PageHeaderBanner` System

Every page in the application MUST use the standardized 2-tier [`PageHeaderBanner`](file:///c:/Antigravity20/DataThon/src/components/PageHeaderBanner.tsx) to prevent vertical text-squeezing bugs and maintain executive visual hierarchy:

```tsx
import { PageHeaderBanner } from '../components/PageHeaderBanner';

<PageHeaderBanner
  icon={<IconComponent className="w-6 h-6 text-white" />}
  iconBgClass="from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-500/25"
  badge={{
    text: 'Tên Phân Hệ / Chuyên Đề',
    icon: <IconBadge className="w-3.5 h-3.5 text-emerald-300" />,
    colorClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
  }}
  subBadge={{
    text: 'Thông Tin Phụ / Phiên Bản',
    icon: <SubIcon className="w-3.5 h-3.5 text-sky-300" />,
    colorClass: 'bg-white/10 text-slate-200 border-white/15'
  }}
  title="Tiêu Đề Trang Chính (To, Rõ Ràng, Font-Black)"
  description="Đoạn văn bản mô tả chỉ dẫn xúc tích, định hướng nghiệp vụ cho cán bộ và nhân dân."
  theme="emerald" // 'dark' | 'emerald' | 'blue' | 'purple' | 'amber' | 'slate'
  actions={
    <>
      {/* All action buttons MUST have shrink-0 and stay on a single horizontal row */}
      <button type="button" className="px-3.5 py-2 rounded-xl ... shrink-0 whitespace-nowrap">
        Thao Tác 1
      </button>
      <button type="button" className="px-4 py-2.5 rounded-xl ... shrink-0 whitespace-nowrap">
        Thao Tác 2
      </button>
    </>
  }
/>
```

### Critical Rules for `PageHeaderBanner`:
1. **Never squeeze the Title block**: The top tier (Icon + Badges + Title + Description) must always have full spacious width (`w-full`, `flex-1 min-w-0`).
2. **Badges must never wrap vertically into circles**: Always add `whitespace-nowrap shrink-0` to all badge text.
3. **Action buttons must sit in the dedicated bottom row**: Place action buttons in the bottom toolbar container (`flex items-center gap-2 flex-nowrap shrink-0 overflow-x-auto scrollbar-none`).

---

## 4. Frontend Engineering & Stability Best Practices

### 4.1. Strict Adherence to React Rules of Hooks
> [!CAUTION]
> **NEVER** place conditional return statements (`if (!isOpen) return null;`) before any React Hook (`useState`, `useMemo`, `useEffect`, `useCallback`, `useRef`).
> 
> All hooks must be declared unconditionally at the very top of the component in the exact same order on every render. Place conditional returns immediately before the JSX return block.

### 4.2. LocalStorage Auto-Healing Sanitizer Pattern
When loading arrays from `localStorage` (`antrach_sanxuat_v4`, `antrach_nhankhau_v3`), ALWAYS pass each item through a sanitizer function to guarantee non-null numeric properties and avoid `TypeError: Cannot read properties of undefined (reading 'toLocaleString')`:

```typescript
const sanitizeSanXuat = (raw: any[]): SanXuatRecord[] => {
  return (raw || []).map((r, idx) => ({
    id: String(r.id || `sx-${idx + 1}`),
    ma_ho: String(r.ma_ho || ''),
    chu_ho: String(r.chu_ho || ''),
    dien_tich_m2: Number(r.dien_tich_m2) || 0,
    giong_cap_kg: Number(r.giong_cap_kg) || 0,
    xu_dong: String(r.xu_dong || 'Tổ 9'),
    so_thua: Number(r.so_thua) || 1,
    so_to_ban_do: Number(r.so_to_ban_do) || 1,
    giong_lua: r.giong_lua || 'BC15',
    dot_phan_bo: r.dot_phan_bo || 'Đợt 1',
    trang_thai_ky_nhan: Boolean(r.trang_thai_ky_nhan),
  }));
};
```

### 4.3. Excel Master Importer & Exporter (SheetJS / XLSX)
- **Import Strategy**:
  - Accept `.xlsx` / `.xls` via `FileReader` (`readAsBinaryString`).
  - Standardize column header mappings with accent-tolerant key matching.
  - Provide a preview modal with validation counts before committing to state/Supabase.
- **Export Strategy**:
  - Export multi-sheet workbooks with timestamped filenames: `AnTrach_Master_{Module}_{Count}_{Date}.xlsx`.

### 4.4. Defensive Null-Safe Calculations
Always guard math operations across arrays:
```typescript
const totalArea = (sanXuatList || []).reduce((acc, item) => acc + (Number(item?.dien_tich_m2) || 0), 0);
const formattedVal = (Number(value) || 0).toLocaleString('vi-VN');
```

---

## 5. Common Pitfalls & How to Avoid Them

| Pitfall | Cause | Solution |
|---|---|---|
| **White Screen / Runtime Hook Error** | Calling `useMemo` after `if (!isOpen) return null;` | Move all hooks to top of component, place early return right before JSX. |
| **Crashing on `toLocaleString()`** | Loading dirty/null numbers from LocalStorage | Run all LocalStorage loads through auto-healing sanitizers with `Number(...) \|\| 0`. |
| **Title text squeezed vertically** | Placing wide action toolbar in same row without flex wrap control | Use the 2-tier `PageHeaderBanner` with bottom action toolbar. |
| **Vite `process is not defined`** | Using `process.env.NODE_ENV` in browser runtime | Use `(import.meta as any)?.env?.PROD` or `import.meta.env.MODE`. |
| **Broken Leaflet Map Tiles** | Unhandled container resize during fullscreen toggle | Call `map.invalidateSize()` inside a short timeout after fullscreen toggles. |
