import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { NhanKhau, HoKhau, ThongBao, BinhLuanThongBao, SystemNotification, VillageOfficer, CongVan, SanXuatRecord, GiongLuaMeta, LichThoiVuNongNghiep, XuDongMeta, AiKnowledgeItem, AiSystemConfig } from '../types';
import { SEED_NHAN_KHAU, SEED_HO_KHAU } from '../data/residentData';
import { INITIAL_ANNOUNCEMENTS, INITIAL_BINH_LUAN, INITIAL_SYSTEM_NOTIFICATIONS } from '../data/defaultData';
import { INITIAL_VILLAGE_OFFICERS } from '../data/officerHierarchyData';
import { INITIAL_CONG_VAN } from '../data/congVanData';
import { SEED_SAN_XUAT, SEED_GIONG_LUA, SEED_LICH_THOI_VU, SEED_XU_DONG } from '../data/sanXuatData';
import { INITIAL_AI_KNOWLEDGE_LIST, INITIAL_AI_SYSTEM_CONFIG } from '../data/initialAiKnowledge';
import { convertHouseholdsToGeoJson, AN_TRACH_TO_BOUNDARIES_GEOJSON, VillageGeoJsonData, ToBoundaryFeature } from '../data/anTrachGeoJsonData';
import { computeCccdDetails } from '../lib/utils';
import { 
  XU_DONG_POLYGONS_GEOJSON, 
  PARCELS_GEOJSON, 
  CANALS_GEOJSON, 
  IRRIGATION_POINTS_GEOJSON,
  XuDongGeoFeature,
  ParcelGeoFeature,
  CanalGeoFeature,
  IrrigationPointFeature
} from '../data/anTrachAgriculturalGeoJson';
import { useAuth } from './AuthContext';

export interface FilterOptions {
  searchQuery: string;
  selectedTo: string;
  selectedNhomTuoi: string;
  selectedCuTru: string;
  selectedGiayTo: string;
  selectedBHYT: string;
  selectedGioiTinh: string;
  selectedDacThu: string;
}

interface DataContextType {
  nhanKhauList: NhanKhau[];
  hoKhauList: HoKhau[];
  thongBaoList: ThongBao[];
  binhLuanList: BinhLuanThongBao[];
  canBoList: VillageOfficer[];
  congVanList: CongVan[];
  sanXuatList: SanXuatRecord[];
  giongLuaList: GiongLuaMeta[];
  xuDongList: XuDongMeta[];
  lichThoiVuList: LichThoiVuNongNghiep[];
  systemNotifications: SystemNotification[];
  unreadNotificationCount: number;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  filteredNhanKhau: NhanKhau[];
  visibleNhanKhau: NhanKhau[];
  addCanBo: (officer: Omit<VillageOfficer, 'id'>) => Promise<VillageOfficer>;
  updateCanBo: (id: string, data: Partial<VillageOfficer>) => Promise<void>;
  deleteCanBo: (id: string) => Promise<void>;
  addCongVan: (cv: Omit<CongVan, 'id' | 'created_at'>) => Promise<CongVan>;
  updateCongVan: (id: string, data: Partial<CongVan>) => Promise<void>;
  deleteCongVan: (id: string) => Promise<void>;
  addSanXuatRecord: (record: Omit<SanXuatRecord, 'id'>) => Promise<SanXuatRecord>;
  updateSanXuatRecord: (id: string, data: Partial<SanXuatRecord>) => Promise<void>;
  deleteSanXuatRecord: (id: string) => Promise<void>;
  importSanXuatExcel: (records: SanXuatRecord[]) => void;
  resetSanXuatToSeed: () => void;
  addXuDong: (xuDong: Omit<XuDongMeta, 'ma_xu_dong'> & { ma_xu_dong?: string }) => Promise<void>;
  updateXuDong: (ma_xu_dong: string, updates: Partial<XuDongMeta>) => Promise<void>;
  deleteXuDong: (ma_xu_dong: string) => Promise<void>;
  resetXuDongToDefault: () => void;
  // Agricultural GIS Spatial GeoJSON Suite
  agriZonesGeoJson: { type: 'FeatureCollection'; features: XuDongGeoFeature[] };
  agriParcelsGeoJson: { type: 'FeatureCollection'; features: ParcelGeoFeature[] };
  agriCanalsGeoJson: { type: 'FeatureCollection'; features: CanalGeoFeature[] };
  agriPointsGeoJson: { type: 'FeatureCollection'; features: IrrigationPointFeature[] };
  addAgriZoneFeature: (feat: XuDongGeoFeature) => void;
  updateAgriZoneFeature: (id: string, properties: Partial<XuDongGeoFeature['properties']>, coordinates?: [number, number][][]) => void;
  deleteAgriZoneFeature: (id: string) => void;
  addAgriParcelFeature: (feat: ParcelGeoFeature) => void;
  updateAgriParcelFeature: (id: string, properties: Partial<ParcelGeoFeature['properties']>, coordinates?: [number, number][][]) => void;
  deleteAgriParcelFeature: (id: string) => void;
  exportAgriGeoJsonBackup: () => string;
  restoreAgriGeoJson: (geoJsonString: string) => { success: boolean; count: number; message: string };
  resetAgriGeoJsonToDefault: () => void;
  assignCongVan: (
    id: string,
    assignment: {
      nguoi_chu_tri_id: string;
      nguoi_chu_tri_ten: string;
      nguoi_chu_tri_chuc_vu: string;
      can_bo_phoi_hop: string[];
      chi_dao_xu_ly: string;
      han_xu_ly: string;
    }
  ) => Promise<void>;
  updateCongVanProgress: (
    id: string,
    progress: number,
    ketQua?: string,
    status?: CongVan['trang_thai']
  ) => Promise<void>;
  exportGisGeoJson: () => string;
  restoreGisGeoJson: (geoJsonString: string) => { success: boolean; count: number; message: string };
  boundariesData: VillageGeoJsonData;
  addBoundary: (boundary: ToBoundaryFeature) => void;
  updateBoundary: (boundaryId: string, properties: Partial<ToBoundaryFeature['properties']>, coordinates?: [number, number][][]) => void;
  deleteBoundary: (boundaryId: string) => void;
  resetBoundariesToDefault: () => void;
  addNhanKhau: (resident: Omit<NhanKhau, 'id'>) => Promise<NhanKhau>;
  updateNhanKhau: (id: string, data: Partial<NhanKhau>) => Promise<void>;
  deleteNhanKhau: (id: string) => Promise<void>;
  addHoKhau: (household: Omit<HoKhau, 'id'>) => Promise<HoKhau>;
  updateHoKhau: (id: string, data: Partial<HoKhau>) => Promise<void>;
  updateHouseholdLocation: (maHo: string, lat: number, lng: number) => Promise<void>;
  updateHouseholdSpatialData: (maHo: string, data: Partial<HoKhau>) => Promise<void>;
  addThongBao: (announcement: Omit<ThongBao, 'id' | 'created_at'>) => Promise<ThongBao>;
  updateThongBao: (id: string, data: Partial<ThongBao>) => Promise<void>;
  deleteThongBao: (id: string) => Promise<void>;
  toggleGhimThongBao: (id: string) => Promise<void>;
  increaseViewCount: (id: string) => void;
  toggleLikeThongBao: (id: string) => void;
  addBinhLuan: (comment: Omit<BinhLuanThongBao, 'id' | 'created_at'>) => Promise<void>;
  replyBinhLuan: (commentId: string, replyContent: string) => Promise<void>;
  deleteBinhLuan: (commentId: string) => Promise<void>;
  addSystemNotification: (notif: Omit<SystemNotification, 'id' | 'created_at' | 'is_read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  importExcelData: (residents: NhanKhau[]) => void;
  clearAllNhanKhau: () => void;
  resetNhanKhauToSeed: () => void;
  clearAllSanXuat: () => void;
  // An Trạch AI Knowledge Hub & RAG System
  aiKnowledgeList: AiKnowledgeItem[];
  aiConfig: AiSystemConfig;
  addAiKnowledge: (item: Omit<AiKnowledgeItem, 'id' | 'updatedAt'>) => Promise<AiKnowledgeItem>;
  updateAiKnowledge: (id: string, data: Partial<AiKnowledgeItem>) => Promise<void>;
  deleteAiKnowledge: (id: string) => Promise<void>;
  updateAiConfig: (config: Partial<AiSystemConfig>) => void;
  syncSystemKnowledge: () => number;
  resetAiKnowledgeToDefault: () => void;
  importAiKnowledgeBatch: (items: AiKnowledgeItem[]) => number;
  kpiStats: {
    totalResidents: number;
    thuongTru: number;
    namThuongTru: number;
    nuThuongTru: number;
    treEm: number;
    laoDong: number;
    caoTuoi: number;
    coCCCD: number;
    coBHYT: number;
    coPhone: number;
    totalHouseholds: number;
  };
}

const defaultFilters: FilterOptions = {
  searchQuery: '',
  selectedTo: 'ALL',
  selectedNhomTuoi: 'ALL',
  selectedCuTru: 'ALL',
  selectedGiayTo: 'ALL',
  selectedBHYT: 'ALL',
  selectedGioiTinh: 'ALL',
  selectedDacThu: 'ALL',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, canViewResident, logActivity } = useAuth();

  const [aiKnowledgeList, setAiKnowledgeList] = useState<AiKnowledgeItem[]>(() => {
    try {
      const saved = localStorage.getItem('antrach_ai_knowledge_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading ai knowledge from storage', e);
    }
    return INITIAL_AI_KNOWLEDGE_LIST;
  });

  const [aiConfig, setAiConfig] = useState<AiSystemConfig>(() => {
    try {
      const saved = localStorage.getItem('antrach_ai_config_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_AI_SYSTEM_CONFIG;
  });

  const [nhanKhauList, setNhanKhauList] = useState<NhanKhau[]>(() => {
    const saved = localStorage.getItem('antrach_nhankhau');
    const rawList: NhanKhau[] = saved ? JSON.parse(saved) : SEED_NHAN_KHAU;
    return rawList.map((r) => {
      if (r.so_cmnd_cccd && (!r.ngay_cap_cccd || !r.noi_cap_cccd || !r.ngay_het_han_cccd)) {
        const details = computeCccdDetails(
          r.so_cmnd_cccd,
          r.nam_sinh,
          r.ngay_thang_nam_sinh,
          r.ngay_cap_cccd,
          r.noi_cap_cccd,
          r.ngay_het_han_cccd
        );
        return {
          ...r,
          ngay_cap_cccd: r.ngay_cap_cccd || details.ngay_cap_cccd,
          noi_cap_cccd: r.noi_cap_cccd || details.noi_cap_cccd,
          ngay_het_han_cccd: r.ngay_het_han_cccd || details.ngay_het_han_cccd
        };
      }
      return r;
    });
  });

  const [hoKhauList, setHoKhauList] = useState<HoKhau[]>(() => {
    const saved = localStorage.getItem('antrach_hokhau');
    return saved ? JSON.parse(saved) : SEED_HO_KHAU;
  });

  const [boundariesData, setBoundariesData] = useState<VillageGeoJsonData>(() => {
    const saved = localStorage.getItem('antrach_boundaries');
    return saved ? JSON.parse(saved) : AN_TRACH_TO_BOUNDARIES_GEOJSON;
  });

  const [thongBaoList, setThongBaoList] = useState<ThongBao[]>(() => {
    const saved = localStorage.getItem('antrach_thongbao');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [binhLuanList, setBinhLuanList] = useState<BinhLuanThongBao[]>(() => {
    const saved = localStorage.getItem('antrach_binhluan');
    return saved ? JSON.parse(saved) : INITIAL_BINH_LUAN;
  });

  const [canBoList, setCanBoList] = useState<VillageOfficer[]>(() => {
    const saved = localStorage.getItem('antrach_officers_hierarchy');
    return saved ? JSON.parse(saved) : INITIAL_VILLAGE_OFFICERS;
  });

  const [congVanList, setCongVanList] = useState<CongVan[]>(() => {
    const saved = localStorage.getItem('antrach_congvan');
    return saved ? JSON.parse(saved) : INITIAL_CONG_VAN;
  });

  const [sanXuatList, setSanXuatList] = useState<SanXuatRecord[]>(() => {
    try {
      const saved = localStorage.getItem('antrach_sanxuat_v4');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any, idx: number) => ({
            id: String(item?.id || `sx-seed-${idx + 1}`),
            stt: Number(item?.stt) || (idx + 1),
            dot_phan_bo: String(item?.dot_phan_bo || 'HG12-T9'),
            giong_lua: String(item?.giong_lua || 'HG12'),
            xu_dong: String(item?.xu_dong || 'Tổ 9'),
            lo_thua_dat: String(item?.lo_thua_dat || `Thửa ${idx + 1}`),
            chu_dat: String(item?.chu_dat || 'Chưa rõ'),
            ho_san_xuat: String(item?.ho_san_xuat || item?.chu_dat || 'Chưa rõ'),
            la_chinh_chu: item?.la_chinh_chu !== false,
            dien_tich_m2: Number(item?.dien_tich_m2) || 500,
            giong_cap_kg: Number(item?.giong_cap_kg) || Number(((Number(item?.dien_tich_m2) || 500) * 0.012).toFixed(2)),
            mua_them_kg: Number(item?.mua_them_kg) || 0,
            don_gia: Number(item?.don_gia) || 18000,
            thanh_tien: Number(item?.thanh_tien) || 0,
            ky_nhan: String(item?.ky_nhan || 'Đã nhận giống'),
            to_dan_cu: String(item?.to_dan_cu || 'Tổ 1'),
            trang_thai_canh_tac: item?.trang_thai_canh_tac || 'da_xuong_giong',
            ghi_chu: String(item?.ghi_chu || ''),
          }));
        }
      }
    } catch (e) {
      console.error('Error loading sanxuat from localstorage', e);
    }
    return SEED_SAN_XUAT;
  });

  const [giongLuaList] = useState<GiongLuaMeta[]>(SEED_GIONG_LUA);
  const [xuDongList, setXuDongList] = useState<XuDongMeta[]>(() => {
    try {
      const saved = localStorage.getItem('antrach_xudong_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((xd: any, idx: number) => ({
            ma_xu_dong: String(xd?.ma_xu_dong || `xd-${idx + 1}`),
            ten_xu_dong: String(xd?.ten_xu_dong || `Xứ Đồng ${idx + 1}`),
            vi_tri: String(xd?.vi_tri || ''),
            dien_tich_m2: Number(xd?.dien_tich_m2) || 0,
            so_thua: Number(xd?.so_thua) || 0,
            cac_lo: String(xd?.cac_lo || ''),
            giong_chinh: String(xd?.giong_chinh || 'HG12'),
            nguon_nuoc: String(xd?.nguon_nuoc || 'Đập dâng Sông Yên'),
            to_quan_ly: String(xd?.to_quan_ly || 'Tổ 1'),
            mau_sac: String(xd?.mau_sac || '#10b981'),
          }));
        }
      }
    } catch (e) {
      console.error('Error loading xudong from localstorage', e);
    }
    return SEED_XU_DONG;
  });
  const [lichThoiVuList] = useState<LichThoiVuNongNghiep[]>(SEED_LICH_THOI_VU);

  const [agriZonesGeoJson, setAgriZonesGeoJson] = useState<{ type: 'FeatureCollection'; features: XuDongGeoFeature[] }>(() => {
    try {
      const saved = localStorage.getItem('antrach_agri_zones_geojson_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.type === 'FeatureCollection' && Array.isArray(parsed.features) && parsed.features.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading agri zones geojson from localStorage', e);
    }
    return XU_DONG_POLYGONS_GEOJSON;
  });

  const [agriParcelsGeoJson, setAgriParcelsGeoJson] = useState<{ type: 'FeatureCollection'; features: ParcelGeoFeature[] }>(() => {
    try {
      const saved = localStorage.getItem('antrach_agri_parcels_geojson_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.type === 'FeatureCollection' && Array.isArray(parsed.features) && parsed.features.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading agri parcels geojson from localStorage', e);
    }
    return PARCELS_GEOJSON;
  });

  const [agriCanalsGeoJson] = useState<{ type: 'FeatureCollection'; features: CanalGeoFeature[] }>(CANALS_GEOJSON);
  const [agriPointsGeoJson] = useState<{ type: 'FeatureCollection'; features: IrrigationPointFeature[] }>(IRRIGATION_POINTS_GEOJSON);

  const [systemNotifications, setSystemNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('antrach_system_notifications');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_NOTIFICATIONS;
  });

  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  useEffect(() => {
    localStorage.setItem('antrach_nhankhau', JSON.stringify(nhanKhauList));
  }, [nhanKhauList]);

  useEffect(() => {
    localStorage.setItem('antrach_hokhau', JSON.stringify(hoKhauList));
  }, [hoKhauList]);

  useEffect(() => {
    localStorage.setItem('antrach_boundaries', JSON.stringify(boundariesData));
  }, [boundariesData]);

  useEffect(() => {
    localStorage.setItem('antrach_sanxuat_v4', JSON.stringify(sanXuatList));
  }, [sanXuatList]);

  useEffect(() => {
    localStorage.setItem('antrach_xudong_v2', JSON.stringify(xuDongList));
  }, [xuDongList]);

  useEffect(() => {
    localStorage.setItem('antrach_agri_zones_geojson_v2', JSON.stringify(agriZonesGeoJson));
  }, [agriZonesGeoJson]);

  useEffect(() => {
    localStorage.setItem('antrach_agri_parcels_geojson_v2', JSON.stringify(agriParcelsGeoJson));
  }, [agriParcelsGeoJson]);

  useEffect(() => {
    localStorage.setItem('antrach_thongbao', JSON.stringify(thongBaoList));
  }, [thongBaoList]);

  useEffect(() => {
    localStorage.setItem('antrach_binhluan', JSON.stringify(binhLuanList));
  }, [binhLuanList]);

  useEffect(() => {
    localStorage.setItem('antrach_officers_hierarchy', JSON.stringify(canBoList));
  }, [canBoList]);

  useEffect(() => {
    localStorage.setItem('antrach_congvan', JSON.stringify(congVanList));
  }, [congVanList]);

  useEffect(() => {
    localStorage.setItem('antrach_system_notifications', JSON.stringify(systemNotifications));
  }, [systemNotifications]);

  useEffect(() => {
    localStorage.setItem('antrach_ai_knowledge_v1', JSON.stringify(aiKnowledgeList));
  }, [aiKnowledgeList]);

  useEffect(() => {
    localStorage.setItem('antrach_ai_config_v1', JSON.stringify(aiConfig));
  }, [aiConfig]);

  // AI Knowledge Management Handlers
  const addAiKnowledge = async (item: Omit<AiKnowledgeItem, 'id' | 'updatedAt'>) => {
    const newItem: AiKnowledgeItem = {
      ...item,
      id: `kb-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
      hitCount: 0,
    };
    setAiKnowledgeList((prev) => [newItem, ...prev]);
    logActivity('INSERT', 'thong_bao', newItem.id, null, newItem, `Thêm tri thức AI: ${newItem.title}`);
    return newItem;
  };

  const updateAiKnowledge = async (id: string, data: Partial<AiKnowledgeItem>) => {
    setAiKnowledgeList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...data, updatedAt: new Date().toISOString().split('T')[0] } : k))
    );
    logActivity('UPDATE', 'thong_bao', id, null, data, `Cập nhật tri thức AI: ${data.title || id}`);
  };

  const deleteAiKnowledge = async (id: string) => {
    setAiKnowledgeList((prev) => prev.filter((k) => k.id !== id));
    logActivity('DELETE', 'thong_bao', id, null, null, `Xóa tri thức AI: ${id}`);
  };

  const updateAiConfig = (config: Partial<AiSystemConfig>) => {
    setAiConfig((prev) => ({ ...prev, ...config }));
  };

  const resetAiKnowledgeToDefault = () => {
    setAiKnowledgeList(INITIAL_AI_KNOWLEDGE_LIST);
    setAiConfig(INITIAL_AI_SYSTEM_CONFIG);
    localStorage.setItem('antrach_ai_knowledge_v1', JSON.stringify(INITIAL_AI_KNOWLEDGE_LIST));
    localStorage.setItem('antrach_ai_config_v1', JSON.stringify(INITIAL_AI_SYSTEM_CONFIG));
  };

  const importAiKnowledgeBatch = (items: AiKnowledgeItem[]) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    setAiKnowledgeList((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const toAdd = items.filter((i) => !existingIds.has(i.id));
      return [...toAdd, ...prev];
    });
    return items.length;
  };

  const syncSystemKnowledge = () => {
    const totalPop = nhanKhauList.length;
    const totalHo = hoKhauList.length;
    const totalAreaM2 = sanXuatList.reduce((s, r) => s + (r.dien_tich_m2 || 0), 0);
    const bhytCount = nhanKhauList.filter((r) => !!r.ma_the_bhyt).length;

    const dynamicOfficerSummary = canBoList
      .map((o) => `* ${o.ho_ten} (${o.chuc_vu} - ${o.to_phu_trach}): 📞 ${o.so_dien_thoai}`)
      .join('\n');

    const syncedItems: AiKnowledgeItem[] = [
      {
        id: 'kb-sync-officers',
        title: 'Danh Bạ & Cơ Cấu 20 Cán Bộ Thôn An Trạch Thời Gian Thực',
        category: 'bo_may_can_bo',
        content: `🏛️ **DANH BẠ CÁN BỘ THÔN AN TRẠCH (ĐỒNG BỘ THỜI GIAN THỰC TỪ CƠ SỞ DỮ LIỆU)**\n\n${dynamicOfficerSummary}\n\n💡 *Dữ liệu đồng bộ tự động từ hệ thống quản lý bộ máy thôn.*`,
        keywords: ['danh ba can bo', 'so dien thoai can bo', 'truong thon', 'bi thu', 'to truong'],
        priority: 10,
        source: 'Cơ sở dữ liệu Cán bộ Thôn An Trạch',
        isActive: true,
        updatedAt: new Date().toISOString().split('T')[0],
      },
      {
        id: 'kb-sync-population',
        title: 'Báo Cáo Thống Kê Dân Số & Tỷ Lệ BHYT Toàn Thôn An Trạch',
        category: 'chinh_sach_bhyt',
        content: `📊 **BÁO CÁO DÂN CƯ & AN SINH XÃ HỘI THỜI GIAN THỰC**\n\n* 👥 **Tổng dân số**: **${totalPop.toLocaleString()} người**\n* 🏡 **Tổng số hộ**: **${totalHo.toLocaleString()} hộ** trên 8 Tổ Dân Cư\n* 🏥 **Tỷ lệ bao phủ BHYT**: **${((bhytCount / (totalPop || 1)) * 100).toFixed(1)}%** (${bhytCount.toLocaleString()} người có thẻ)\n* 🌾 **Quy mô đất lúa**: **43,86 ha** (${totalAreaM2.toLocaleString()} m² trên 5 xứ đồng)`,
        keywords: ['thong ke dan so', 'so luong ho', 'bao hiem y te', 'ty le bhyt', 'dien tich lua'],
        priority: 10,
        source: 'Hệ thống Quản trị Dân cư Số Thôn An Trạch',
        isActive: true,
        updatedAt: new Date().toISOString().split('T')[0],
      },
    ];

    setAiKnowledgeList((prev) => {
      const filtered = prev.filter((k) => !k.id.startsWith('kb-sync-'));
      return [...syncedItems, ...filtered];
    });

    return syncedItems.length;
  };

  const unreadNotificationCount = useMemo(() => {
    return systemNotifications.filter((n) => !n.is_read).length;
  }, [systemNotifications]);

  const addSystemNotification = (notif: Omit<SystemNotification, 'id' | 'created_at' | 'is_read'>) => {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setSystemNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setSystemNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setSystemNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const deleteNotification = (id: string) => {
    setSystemNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setSystemNotifications([]);
  };

  const resetFilters = () => setFilters(defaultFilters);

  // Thống kê KPI tổng quan cho toàn bộ 2.308 nhân khẩu
  const kpiStats = useMemo(() => {
    const total = nhanKhauList.length;
    let thuongTru = 0;
    let namThuongTru = 0;
    let nuThuongTru = 0;
    let treEm = 0;
    let laoDong = 0;
    let caoTuoi = 0;
    let coCCCD = 0;
    let coBHYT = 0;
    let coPhone = 0;

    for (const r of nhanKhauList) {
      const isTT = r.trang_thai_cu_tru === 'Đang thường trú' || r.trang_thai_cu_tru?.includes('Trẻ mới sinh');
      if (isTT) {
        thuongTru++;
        if (r.gioi_tinh === 'Nam') namThuongTru++;
        if (r.gioi_tinh === 'Nữ') nuThuongTru++;
      }
      if (r.nam_sinh && r.nam_sinh > 2008) treEm++;
      else if (r.nam_sinh && r.nam_sinh >= 1966) laoDong++;
      else if (r.nam_sinh && r.nam_sinh < 1966) caoTuoi++;

      if (r.so_cmnd_cccd && r.so_cmnd_cccd.trim()) coCCCD++;
      if (r.ma_the_bhyt && r.ma_the_bhyt.trim()) coBHYT++;
      if (r.dien_thoai && r.dien_thoai.trim()) coPhone++;
    }

    return {
      totalResidents: total,
      thuongTru,
      namThuongTru,
      nuThuongTru,
      treEm,
      laoDong,
      caoTuoi,
      coCCCD,
      coBHYT,
      coPhone,
      totalHouseholds: hoKhauList.length,
    };
  }, [nhanKhauList, hoKhauList]);

  // Bộ lọc dữ liệu nhân khẩu dựa trên filter options
  const filteredNhanKhau = useMemo(() => {
    return nhanKhauList.filter((r) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchName = r.ho_ten.toLowerCase().includes(q);
        const matchCCCD = r.so_cmnd_cccd?.toLowerCase().includes(q);
        const matchMaHo = r.ma_ho.toLowerCase().includes(q);
        const matchChuHo = r.chu_ho.toLowerCase().includes(q);
        const matchPhone = r.dien_thoai?.toLowerCase().includes(q);
        const matchBHYT = r.ma_the_bhyt?.toLowerCase().includes(q);
        if (!matchName && !matchCCCD && !matchMaHo && !matchChuHo && !matchPhone && !matchBHYT) {
          return false;
        }
      }

      // 2. Tổ Dân Cư
      if (filters.selectedTo !== 'ALL') {
        if (r.to_dan_cu !== filters.selectedTo) return false;
      }

      // 3. Giới tính
      if (filters.selectedGioiTinh !== 'ALL') {
        if (r.gioi_tinh !== filters.selectedGioiTinh) return false;
      }

      // 4. Nhóm tuổi
      if (filters.selectedNhomTuoi !== 'ALL') {
        if (filters.selectedNhomTuoi === 'TRE_EM' && (!r.nam_sinh || r.nam_sinh <= 2008)) return false;
        if (filters.selectedNhomTuoi === 'LAO_DONG' && (!r.nam_sinh || r.nam_sinh < 1966 || r.nam_sinh > 2008)) return false;
        if (filters.selectedNhomTuoi === 'CAO_TUOI' && (!r.nam_sinh || r.nam_sinh >= 1966)) return false;
      }

      // 5. Tình trạng cư trú
      if (filters.selectedCuTru !== 'ALL') {
        if (filters.selectedCuTru === 'THUONG_TRU' && !r.trang_thai_cu_tru.includes('thường trú')) return false;
        if (filters.selectedCuTru === 'TAM_TRU' && !r.trang_thai_cu_tru.includes('Tạm trú')) return false;
        if (filters.selectedCuTru === 'TAM_VANG' && !r.trang_thai_cu_tru.includes('Tạm vắng')) return false;
      }

      // 6. Giấy tờ CCCD
      if (filters.selectedGiayTo !== 'ALL') {
        if (filters.selectedGiayTo === 'CO_CCCD' && (!r.so_cmnd_cccd || !r.so_cmnd_cccd.trim())) return false;
        if (filters.selectedGiayTo === 'CHUA_CO_CCCD' && r.so_cmnd_cccd && r.so_cmnd_cccd.trim()) return false;
      }

      // 7. Thẻ BHYT
      if (filters.selectedBHYT !== 'ALL') {
        if (filters.selectedBHYT === 'CO_BHYT' && (!r.ma_the_bhyt || !r.ma_the_bhyt.trim())) return false;
        if (filters.selectedBHYT === 'CHUA_BHYT' && r.ma_the_bhyt && r.ma_the_bhyt.trim()) return false;
      }

      // 8. Đối tượng đặc thù
      if (filters.selectedDacThu !== 'ALL') {
        if (!r.doi_tuong_dac_thu?.includes(filters.selectedDacThu)) return false;
      }

      return true;
    });
  }, [nhanKhauList, filters]);

  // Danh sách nhân khẩu được phép xem theo RLS
  const visibleNhanKhau = useMemo(() => {
    return filteredNhanKhau.filter((r) => canViewResident(r));
  }, [filteredNhanKhau, canViewResident]);

  // Các thao tác CRUD dữ liệu
  const addNhanKhau = async (resident: Omit<NhanKhau, 'id'>): Promise<NhanKhau> => {
    const newId = `nk-${Date.now()}`;
    const cccdMeta = computeCccdDetails(
      resident.so_cmnd_cccd,
      resident.nam_sinh,
      resident.ngay_thang_nam_sinh,
      resident.ngay_cap_cccd,
      resident.noi_cap_cccd,
      resident.ngay_het_han_cccd
    );
    const newResident: NhanKhau = {
      ...resident,
      ngay_cap_cccd: resident.ngay_cap_cccd || cccdMeta.ngay_cap_cccd,
      noi_cap_cccd: resident.noi_cap_cccd || cccdMeta.noi_cap_cccd,
      ngay_het_han_cccd: resident.ngay_het_han_cccd || cccdMeta.ngay_het_han_cccd,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: currentUser?.id,
    };

    setNhanKhauList((prev) => [newResident, ...prev]);

    // Cập nhật số nhân khẩu của hộ
    setHoKhauList((prev) =>
      prev.map((hk) => {
        if (hk.ma_ho === resident.ma_ho) {
          return { ...hk, so_nhan_khau: hk.so_nhan_khau + 1 };
        }
        return hk;
      })
    );

    logActivity('INSERT', 'nhan_khau', newId, null, newResident, `Thêm nhân khẩu mới: ${newResident.ho_ten} (${newResident.to_dan_cu})`);
    
    // Đẩy thông báo biến động dân cư toàn dự án
    addSystemNotification({
      tieu_de: 'Thêm mới nhân khẩu',
      noi_dung: `Cư dân ${newResident.ho_ten} (${newResident.to_dan_cu}, Hộ ${newResident.ma_ho}) vừa được cập nhật vào cơ sở dữ liệu.`,
      loai: 'dan_cu',
      link_tab: 'nhan-khau',
      target_id: newId,
      nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ thôn',
    });

    return newResident;
  };

  const updateNhanKhau = async (id: string, data: Partial<NhanKhau>) => {
    let oldObj: NhanKhau | undefined;
    setNhanKhauList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldObj = item;
          const merged = { ...item, ...data };
          const cccdMeta = computeCccdDetails(
            merged.so_cmnd_cccd,
            merged.nam_sinh,
            merged.ngay_thang_nam_sinh,
            merged.ngay_cap_cccd,
            merged.noi_cap_cccd,
            merged.ngay_het_han_cccd
          );
          return {
            ...merged,
            ngay_cap_cccd: merged.ngay_cap_cccd || cccdMeta.ngay_cap_cccd,
            noi_cap_cccd: merged.noi_cap_cccd || cccdMeta.noi_cap_cccd,
            ngay_het_han_cccd: merged.ngay_het_han_cccd || cccdMeta.ngay_het_han_cccd,
            updated_at: new Date().toISOString(),
            updated_by: currentUser?.id,
          };
        }
        return item;
      })
    );

    if (oldObj) {
      logActivity('UPDATE', 'nhan_khau', id, oldObj, { ...oldObj, ...data }, `Cập nhật thông tin nhân khẩu: ${data.ho_ten || oldObj.ho_ten}`);
      
      addSystemNotification({
        tieu_de: 'Cập nhật thông tin cư dân',
        noi_dung: `Thông tin cư dân ${data.ho_ten || oldObj.ho_ten} (${oldObj.to_dan_cu}) vừa được chỉnh sửa bởi ${currentUser?.ho_ten || 'cán bộ'}.`,
        loai: 'dan_cu',
        link_tab: 'nhan-khau',
        target_id: id,
        nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ thôn',
      });
    }
  };

  const deleteNhanKhau = async (id: string) => {
    const target = nhanKhauList.find((r) => r.id === id);
    if (target) {
      setNhanKhauList((prev) => prev.filter((r) => r.id !== id));

      // Giảm số nhân khẩu của hộ
      setHoKhauList((prev) =>
        prev.map((hk) => {
          if (hk.ma_ho === target.ma_ho) {
            return { ...hk, so_nhan_khau: Math.max(0, hk.so_nhan_khau - 1) };
          }
          return hk;
        })
      );

      logActivity('DELETE', 'nhan_khau', id, target, null, `Xóa nhân khẩu: ${target.ho_ten} (${target.ma_ho})`);

      addSystemNotification({
        tieu_de: 'Xóa bản ghi nhân khẩu',
        noi_dung: `Cư dân ${target.ho_ten} (Hộ ${target.ma_ho}, ${target.to_dan_cu}) đã được xóa khỏi sổ bộ.`,
        loai: 'dan_cu',
        link_tab: 'nhan-khau',
        nguoi_thuc_hien: currentUser?.ho_ten || 'Ban Nhân Dân Thôn',
      });
    }
  };

  const clearAllNhanKhau = () => {
    setNhanKhauList([]);
    setHoKhauList([]);
    localStorage.setItem('antrach_nhankhau', JSON.stringify([]));
    localStorage.setItem('antrach_hokhau', JSON.stringify([]));
    logActivity('DELETE', 'nhan_khau', undefined, null, null, `Xóa sạch toàn bộ cơ sở dữ liệu dân cư và sổ hộ khẩu`);
    addSystemNotification({
      tieu_de: 'Đã xóa toàn bộ cơ sở dữ liệu Dân cư',
      noi_dung: 'Toàn bộ dữ liệu nhân khẩu và sổ hộ khẩu đã được xóa trắng theo lệnh của cán bộ quản trị.',
      loai: 'dan_cu',
      link_tab: 'nhan-khau',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const resetNhanKhauToSeed = () => {
    const rawList: NhanKhau[] = SEED_NHAN_KHAU.map((r) => {
      const details = computeCccdDetails(
        r.so_cmnd_cccd,
        r.nam_sinh,
        r.ngay_thang_nam_sinh,
        r.ngay_cap_cccd,
        r.noi_cap_cccd,
        r.ngay_het_han_cccd
      );
      return {
        ...r,
        ngay_cap_cccd: details.ngay_cap_cccd,
        noi_cap_cccd: details.noi_cap_cccd,
        ngay_het_han_cccd: details.ngay_het_han_cccd
      };
    });
    setNhanKhauList(rawList);
    setHoKhauList(SEED_HO_KHAU);
    localStorage.setItem('antrach_nhankhau', JSON.stringify(rawList));
    localStorage.setItem('antrach_hokhau', JSON.stringify(SEED_HO_KHAU));
    logActivity('UPDATE', 'nhan_khau', undefined, null, null, `Khôi phục toàn bộ CSDL 2.308 cư dân và 614 hộ về mặc định ban đầu`);
    addSystemNotification({
      tieu_de: 'Khôi phục cơ sở dữ liệu Dân cư gốc',
      noi_dung: 'Đã khôi phục thành công 2.308 nhân khẩu và 614 sổ hộ khẩu mẫu của Thôn An Trạch.',
      loai: 'dan_cu',
      link_tab: 'nhan-khau',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const addHoKhau = async (household: Omit<HoKhau, 'id'>): Promise<HoKhau> => {
    const newId = `hk-${Date.now()}`;
    const newHk: HoKhau = {
      ...household,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setHoKhauList((prev) => [newHk, ...prev]);
    logActivity('INSERT', 'ho_khau', newId, null, newHk, `Thêm sổ hộ khẩu mới: ${newHk.ma_ho} (${newHk.ten_chu_ho})`);
    
    addSystemNotification({
      tieu_de: 'Tạo sổ hộ khẩu mới',
      noi_dung: `Sổ hộ khẩu ${newHk.ma_ho} (Chủ hộ: ${newHk.ten_chu_ho}, ${newHk.to_dan_cu}) vừa được tạo mới.`,
      loai: 'ho_khau',
      link_tab: 'ho-khau',
      target_id: newHk.ma_ho,
      nguoi_thuc_hien: currentUser?.ho_ten || 'Ban Nhân Dân Thôn',
    });

    return newHk;
  };

  const updateHoKhau = async (id: string, data: Partial<HoKhau>) => {
    let oldObj: HoKhau | undefined;
    setHoKhauList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldObj = item;
          return { ...item, ...data, updated_at: new Date().toISOString() };
        }
        return item;
      })
    );
    if (oldObj) {
      logActivity('UPDATE', 'ho_khau', id, oldObj, { ...oldObj, ...data }, `Cập nhật sổ hộ khẩu: ${oldObj.ma_ho}`);
    }
  };

  const updateHouseholdLocation = async (maHo: string, lat: number, lng: number) => {
    let targetId: string | undefined;
    let oldObj: HoKhau | undefined;
    let newObj: HoKhau | undefined;

    setHoKhauList((prev) =>
      prev.map((item) => {
        if (item.ma_ho === maHo) {
          targetId = item.id;
          oldObj = item;
          newObj = {
            ...item,
            lat,
            lng,
            toado_gps: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            updated_at: new Date().toISOString(),
          };
          return newObj;
        }
        return item;
      })
    );

    if (targetId && newObj) {
      logActivity('UPDATE', 'ho_khau', targetId, oldObj, newObj, `Ghim vị trí GPS cho hộ ${maHo} -> (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
      
      addSystemNotification({
        tieu_de: 'Ghim vị trí GPS hộ gia đình',
        noi_dung: `Hộ ${maHo} (Chủ hộ: ${newObj.ten_chu_ho}, ${newObj.to_dan_cu}) đã được cập nhật tọa độ vị trí GPS trên bản đồ số.`,
        loai: 'ho_khau',
        link_tab: 'ho-khau',
        target_id: maHo,
        nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ thôn',
      });
    }
  };

  const updateHouseholdSpatialData = async (maHo: string, data: Partial<HoKhau>) => {
    let targetId: string | undefined;
    let oldObj: HoKhau | undefined;
    let newObj: HoKhau | undefined;

    setHoKhauList((prev) =>
      prev.map((item) => {
        if (item.ma_ho === maHo) {
          targetId = item.id;
          oldObj = item;
          newObj = {
            ...item,
            ...data,
            toado_gps: data.lat && data.lng ? `${data.lat.toFixed(6)}, ${data.lng.toFixed(6)}` : item.toado_gps,
            updated_at: new Date().toISOString(),
          };
          return newObj;
        }
        return item;
      })
    );

    if (targetId && newObj) {
      logActivity('UPDATE', 'ho_khau', targetId, oldObj, newObj, `Cập nhật thông tin không gian thửa đất cho hộ ${maHo}`);
      addSystemNotification({
        tieu_de: 'Cập nhật không gian thửa đất hộ dân',
        noi_dung: `Thông tin không gian, thửa đất và phân loại của hộ ${newObj.ten_chu_ho} (${maHo}) đã được cập nhật thành công.`,
        loai: 'ho_khau',
        link_tab: 'ho-khau',
        target_id: maHo,
        nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ thôn',
      });
    }
  };

  const addThongBao = async (announcement: Omit<ThongBao, 'id' | 'created_at'>): Promise<ThongBao> => {
    const newId = `tb-${Date.now()}`;
    const newTb: ThongBao = {
      ...announcement,
      id: newId,
      nguoi_dang_id: currentUser?.id,
      nguoi_dang_ten: currentUser?.ho_ten || 'Ban Nhân dân Thôn',
      nguoi_dang_vai_tro: currentUser?.vai_tro || 'admin',
      luot_xem: 0,
      so_luot_thich: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setThongBaoList((prev) => [newTb, ...prev]);
    logActivity('INSERT', 'thong_bao', newTb.id, null, newTb, `Đăng bản tin thôn: ${newTb.tieu_de} (${newTb.pham_vi})`);
    
    addSystemNotification({
      tieu_de: 'Bản tin thôn mới được ban hành',
      noi_dung: `"${newTb.tieu_de}" (Phạm vi: ${newTb.pham_vi}) vừa được ban hành bởi ${newTb.nguoi_dang_ten}.`,
      loai: 'ban_tin',
      link_tab: 'thong-bao',
      target_id: newId,
      nguoi_thuc_hien: newTb.nguoi_dang_ten,
    });

    return newTb;
  };

  const updateThongBao = async (id: string, data: Partial<ThongBao>) => {
    let oldObj: ThongBao | undefined;
    setThongBaoList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldObj = item;
          return { ...item, ...data, updated_at: new Date().toISOString() };
        }
        return item;
      })
    );
    if (oldObj) {
      logActivity('UPDATE', 'thong_bao', id, oldObj, { ...oldObj, ...data }, `Chỉnh sửa bản tin thôn: ${data.tieu_de || oldObj.tieu_de}`);
    }
  };

  const deleteThongBao = async (id: string) => {
    const target = thongBaoList.find((tb) => tb.id === id);
    if (target) {
      setThongBaoList((prev) => prev.filter((tb) => tb.id !== id));
      logActivity('DELETE', 'thong_bao', id, target, null, `Xóa bản tin thôn: ${target.tieu_de}`);
    }
  };

  const toggleGhimThongBao = async (id: string) => {
    let isGhimNew = false;
    setThongBaoList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          isGhimNew = !item.is_ghim;
          return { ...item, is_ghim: isGhimNew, updated_at: new Date().toISOString() };
        }
        return item;
      })
    );
    logActivity('UPDATE', 'thong_bao', id, null, null, `${isGhimNew ? 'Ghim' : 'Bỏ ghim'} bản tin thôn`);
  };

  const increaseViewCount = (id: string) => {
    setThongBaoList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, luot_xem: (item.luot_xem || 0) + 1 };
        }
        return item;
      })
    );
  };

  const toggleLikeThongBao = (id: string) => {
    setThongBaoList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, so_luot_thich: (item.so_luot_thich || 0) + 1 };
        }
        return item;
      })
    );
  };

  // Các hàm tương tác Hỏi Đáp / Bình Luận của người dân
  const addBinhLuan = async (comment: Omit<BinhLuanThongBao, 'id' | 'created_at'>) => {
    const newBl: BinhLuanThongBao = {
      ...comment,
      id: `bl-${Date.now()}`,
      is_can_bo: currentUser ? true : false,
      chuc_danh_can_bo: currentUser?.vai_tro,
      avatar_url: currentUser?.avatar_url,
      created_at: new Date().toISOString(),
    };
    setBinhLuanList((prev) => [newBl, ...prev]);
    logActivity('INSERT', 'thong_bao', newBl.id, null, newBl, `Người dân đặt câu hỏi trên bản tin: ${comment.ho_ten_nguoi_gui}`);
    
    // Đẩy thông báo câu hỏi mới vào trung tâm thông báo toàn hệ thống
    addSystemNotification({
      tieu_de: 'Câu hỏi mới từ người dân',
      noi_dung: `Bà con ${comment.ho_ten_nguoi_gui} (${comment.to_dan_cu || 'Tổ dân cư'}) vừa gửi câu hỏi thắc mắc cần Ban nhân dân thôn giải đáp.`,
      loai: 'hoi_dap',
      link_tab: 'thong-bao',
      target_id: comment.thong_bao_id,
      nguoi_thuc_hien: comment.ho_ten_nguoi_gui,
    });
  };

  const replyBinhLuan = async (commentId: string, replyContent: string) => {
    setBinhLuanList((prev) =>
      prev.map((bl) => {
        if (bl.id === commentId) {
          return {
            ...bl,
            da_tra_loi: true,
            tra_loi_noi_dung: replyContent,
            tra_loi_boi_ten: currentUser?.ho_ten || 'Ban Nhân Dân Thôn',
            tra_loi_boi_chuc_danh: currentUser?.vai_tro === 'to_truong' ? `Tổ trưởng ${currentUser.to_phu_trach}` : 'Cán Bộ Thôn',
            tra_loi_luc: new Date().toISOString(),
          };
        }
        return bl;
      })
    );
    logActivity('UPDATE', 'thong_bao', commentId, null, null, `Cán bộ giải đáp câu hỏi của người dân: ${currentUser?.ho_ten}`);

    addSystemNotification({
      tieu_de: 'Giải đáp câu hỏi người dân',
      noi_dung: `Cán bộ ${currentUser?.ho_ten || 'Ban nhân dân'} vừa gửi câu trả lời chính thức cho câu hỏi của bà con.`,
      loai: 'hoi_dap',
      link_tab: 'thong-bao',
      nguoi_thuc_hien: currentUser?.ho_ten,
    });
  };

  const deleteBinhLuan = async (commentId: string) => {
    setBinhLuanList((prev) => prev.filter((bl) => bl.id !== commentId));
  };

  const addCanBo = async (officer: Omit<VillageOfficer, 'id'>): Promise<VillageOfficer> => {
    const newId = `cb-${Date.now()}`;
    const newOfficer: VillageOfficer = {
      ...officer,
      id: newId,
    };
    setCanBoList((prev) => [newOfficer, ...prev]);
    logActivity('INSERT', 'can_bo_thon', newId, null, newOfficer, `Thêm cán bộ mới: ${newOfficer.ho_ten} (${newOfficer.chuc_vu})`);
    addSystemNotification({
      tieu_de: 'Bổ nhiệm cán bộ mới',
      noi_dung: `Đồng chí ${newOfficer.ho_ten} vừa được cập nhật chức vụ "${newOfficer.chuc_vu}" (${newOfficer.to_phu_trach}) vào cơ cấu bộ máy thôn.`,
      loai: 'he_thong',
      link_tab: 'can-bo',
      target_id: newId,
      nguoi_thuc_hien: currentUser?.ho_ten || 'Ban Nhân Dân Thôn',
    });
    return newOfficer;
  };

  const updateCanBo = async (id: string, data: Partial<VillageOfficer>) => {
    let oldObj: VillageOfficer | undefined;
    setCanBoList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldObj = item;
          return { ...item, ...data };
        }
        return item;
      })
    );
    if (oldObj) {
      logActivity('UPDATE', 'can_bo_thon', id, oldObj, { ...oldObj, ...data }, `Cập nhật hồ sơ cán bộ: ${data.ho_ten || oldObj.ho_ten}`);
      addSystemNotification({
        tieu_de: 'Cập nhật hồ sơ cán bộ',
        noi_dung: `Hồ sơ cán bộ ${data.ho_ten || oldObj.ho_ten} (${oldObj.chuc_vu}) vừa được chỉnh sửa thông tin.`,
        loai: 'he_thong',
        link_tab: 'can-bo',
        target_id: id,
        nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
      });
    }
  };

  const deleteCanBo = async (id: string) => {
    const target = canBoList.find((c) => c.id === id);
    if (target) {
      setCanBoList((prev) => prev.filter((c) => c.id !== id));
      logActivity('DELETE', 'can_bo_thon', id, target, null, `Xóa hồ sơ cán bộ: ${target.ho_ten} (${target.chuc_vu})`);
      addSystemNotification({
        tieu_de: 'Xóa hồ sơ cán bộ',
        noi_dung: `Cán bộ ${target.ho_ten} (${target.chuc_vu}) đã được xóa khỏi danh bạ bộ máy thôn.`,
        loai: 'he_thong',
        link_tab: 'can-bo',
        nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
      });
    }
  };

  const addCongVan = async (cv: Omit<CongVan, 'id' | 'created_at'>): Promise<CongVan> => {
    const newId = `cv-${Date.now()}`;
    const newCV: CongVan = {
      ...cv,
      id: newId,
      created_at: new Date().toISOString(),
    };
    setCongVanList((prev) => [newCV, ...prev]);
    logActivity('INSERT', 'cong_van', newId, null, newCV, `Tiếp nhận công văn mới: ${newCV.so_ky_hieu}`);
    addSystemNotification({
      tieu_de: `Văn bản mới: ${newCV.so_ky_hieu}`,
      noi_dung: `${newCV.trich_yeu.slice(0, 100)}... (${newCV.co_quan_ban_hanh})`,
      loai: 'he_thong',
      link_tab: 'cong-van',
      target_id: newId,
      nguoi_thuc_hien: currentUser?.ho_ten || 'Văn thư Ban thôn',
    });
    return newCV;
  };

  const updateCongVan = async (id: string, data: Partial<CongVan>) => {
    let oldObj: CongVan | undefined;
    setCongVanList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldObj = item;
          return { ...item, ...data, updated_at: new Date().toISOString() };
        }
        return item;
      })
    );
    if (oldObj) {
      logActivity('UPDATE', 'cong_van', id, oldObj, { ...oldObj, ...data }, `Cập nhật văn bản: ${data.so_ky_hieu || oldObj.so_ky_hieu}`);
      addSystemNotification({
        tieu_de: `Cập nhật công văn ${data.so_ky_hieu || oldObj.so_ky_hieu}`,
        noi_dung: `Nội dung công văn vừa được chỉnh sửa thông tin xử lý.`,
        loai: 'he_thong',
        link_tab: 'cong-van',
        target_id: id,
        nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
      });
    }
  };

  const deleteCongVan = async (id: string) => {
    const target = congVanList.find((c) => c.id === id);
    if (target) {
      setCongVanList((prev) => prev.filter((c) => c.id !== id));
      logActivity('DELETE', 'cong_van', id, target, null, `Xóa văn bản: ${target.so_ky_hieu}`);
      addSystemNotification({
        tieu_de: `Xóa công văn ${target.so_ky_hieu}`,
        noi_dung: `Văn bản số ${target.so_ky_hieu} đã được xóa khỏi hệ thống lưu trữ.`,
        loai: 'he_thong',
        link_tab: 'cong-van',
        nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
      });
    }
  };

  const assignCongVan = async (
    id: string,
    assignment: {
      nguoi_chu_tri_id: string;
      nguoi_chu_tri_ten: string;
      nguoi_chu_tri_chuc_vu: string;
      can_bo_phoi_hop: string[];
      chi_dao_xu_ly: string;
      han_xu_ly: string;
    }
  ) => {
    const target = congVanList.find((c) => c.id === id);
    if (target) {
      setCongVanList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...assignment,
                trang_thai: item.trang_thai === 'cho_phan_cong' ? 'dang_xu_ly' : item.trang_thai,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
      logActivity('UPDATE', 'cong_van', id, target, { ...target, ...assignment }, `Phân công xử lý công văn: ${target.so_ky_hieu} cho ${assignment.nguoi_chu_tri_ten}`);
      addSystemNotification({
        tieu_de: `Giao việc: Công văn ${target.so_ky_hieu}`,
        noi_dung: `Đồng chí ${assignment.nguoi_chu_tri_ten} được giao chủ trì xử lý văn bản: "${target.trich_yeu.slice(0, 80)}...". Hạn chót: ${assignment.han_xu_ly}`,
        loai: 'he_thong',
        link_tab: 'cong-van',
        target_id: id,
        nguoi_thuc_hien: currentUser?.ho_ten || 'Trưởng Thôn',
      });
    }
  };

  const updateCongVanProgress = async (
    id: string,
    progress: number,
    ketQua?: string,
    status?: CongVan['trang_thai']
  ) => {
    const target = congVanList.find((c) => c.id === id);
    if (target) {
      const newStatus = status || (progress >= 100 ? 'hoan_thanh' : 'dang_xu_ly');
      setCongVanList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                tien_do_phan_tram: progress,
                ket_qua_xu_ly: ketQua !== undefined ? ketQua : item.ket_qua_xu_ly,
                trang_thai: newStatus,
                updated_at: new Date().toISOString(),
              }
            : item
        )
      );
      logActivity('UPDATE', 'cong_van', id, target, { ...target, tien_do_phan_tram: progress, trang_thai: newStatus }, `Cập nhật tiến độ (${progress}%) công văn: ${target.so_ky_hieu}`);
      if (progress >= 100) {
        addSystemNotification({
          tieu_de: `Hoàn thành công văn ${target.so_ky_hieu}`,
          noi_dung: `Văn bản "${target.so_ky_hieu}" đã được báo cáo hoàn thành 100%.`,
          loai: 'he_thong',
          link_tab: 'cong-van',
          target_id: id,
          nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ xử lý',
        });
      }
    }
  };

  const importExcelData = (importedResidents: NhanKhau[]) => {
    setNhanKhauList(importedResidents);

    // Tự động đồng bộ số nhân khẩu từng hộ và bổ sung hộ mới nếu chưa có trong sổ bộ
    setHoKhauList((prevHouseholds) => {
      const hhMap = new Map<string, HoKhau>();
      prevHouseholds.forEach((hk) => {
        hhMap.set(hk.ma_ho, { ...hk, so_nhan_khau: 0 });
      });

      importedResidents.forEach((res) => {
        if (!res.ma_ho) return;
        if (hhMap.has(res.ma_ho)) {
          const current = hhMap.get(res.ma_ho)!;
          current.so_nhan_khau = (current.so_nhan_khau || 0) + 1;
          if (res.quan_he_chu_ho?.toLowerCase().includes('chủ hộ') || !current.ten_chu_ho) {
            current.ten_chu_ho = res.ho_ten;
            current.to_dan_cu = res.to_dan_cu || current.to_dan_cu;
          }
        } else {
          // Tạo sổ hộ khẩu mới tự động
          hhMap.set(res.ma_ho, {
            id: `hk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            ma_ho: res.ma_ho,
            ten_chu_ho: res.ho_ten,
            to_dan_cu: res.to_dan_cu || 'Tổ 1',
            dia_chi: res.dia_chi || 'Thôn An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng',
            so_nhan_khau: 1,
            lat: 15.9620 + (Math.random() - 0.5) * 0.008,
            lng: 108.2045 + (Math.random() - 0.5) * 0.008,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      });

      return Array.from(hhMap.values());
    });

    logActivity('IMPORT_EXCEL', 'nhan_khau', undefined, null, null, `Import & đồng bộ ${importedResidents.length} nhân khẩu và cập nhật sổ hộ khẩu`);
    
    addSystemNotification({
      tieu_de: 'Đồng bộ cơ sở dữ liệu Master Excel',
      noi_dung: `Đã import và đồng bộ thành công ${importedResidents.length} nhân khẩu vào hệ thống dữ liệu số.`,
      loai: 'dong_bo',
      link_tab: 'nhan-khau',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const exportGisGeoJson = (): string => {
    const geojson = convertHouseholdsToGeoJson(hoKhauList, nhanKhauList);
    logActivity('EXPORT_EXCEL', 'ho_khau', undefined, null, null, `Xuất file sao lưu dữ liệu GIS GeoJSON 614 hộ Thôn An Trạch`);
    return JSON.stringify(geojson, null, 2);
  };

  const restoreGisGeoJson = (geoJsonString: string): { success: boolean; count: number; message: string } => {
    try {
      const data = JSON.parse(geoJsonString);
      if (!data || !data.features || !Array.isArray(data.features)) {
        return { success: false, count: 0, message: 'File không đúng định dạng GeoJSON FeatureCollection hợp lệ.' };
      }

      let updateCount = 0;
      setHoKhauList((prev) => {
        const updated = [...prev];
        data.features.forEach((feat: any) => {
          if (feat.geometry && feat.geometry.type === 'Point' && feat.properties) {
            const maHo = feat.properties.ma_ho;
            const [lng, lat] = feat.geometry.coordinates;
            const idx = updated.findIndex((h) => h.ma_ho === maHo);
            if (idx !== -1 && typeof lat === 'number' && typeof lng === 'number') {
              updated[idx] = {
                ...updated[idx],
                lat,
                lng,
                toado_gps: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                updated_at: new Date().toISOString(),
              };
              updateCount++;
            }
          }
        });
        return updated;
      });

      logActivity('IMPORT_EXCEL', 'ho_khau', undefined, null, null, `Phục hồi tọa độ GIS thành công cho ${updateCount} hộ từ file GeoJSON`);
      addSystemNotification({
        tieu_de: 'Phục hồi dữ liệu GIS GeoJSON thành công',
        noi_dung: `Đã phục hồi thành công tọa độ không gian địa lý cho ${updateCount} hộ gia đình từ bản sao lưu GeoJSON.`,
        loai: 'ho_khau',
        link_tab: 'ho-khau',
        nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
      });

      return {
        success: true,
        count: updateCount,
        message: `Đã phục hồi thành công tọa độ cho ${updateCount} hộ gia đình.`,
      };
    } catch (err: any) {
      return { success: false, count: 0, message: `Lỗi đọc file: ${err.message || 'Cú pháp JSON không hợp lệ'}` };
    }
  };

  const updateBoundary = (
    boundaryId: string, 
    properties: Partial<ToBoundaryFeature['properties']>, 
    coordinates?: [number, number][][]
  ) => {
    setBoundariesData((prev) => {
      const newFeatures = prev.features.map((feat) => {
        if (feat.properties.id === boundaryId || feat.properties.to_dan_cu === boundaryId) {
          return {
            ...feat,
            properties: {
              ...feat.properties,
              ...properties,
            },
            geometry: {
              ...feat.geometry,
              coordinates: coordinates || feat.geometry.coordinates,
            },
          };
        }
        return feat;
      });
      return { ...prev, features: newFeatures };
    });

    logActivity('UPDATE', 'ho_khau', boundaryId, null, null, `Cập nhật ranh giới không gian địa lý ${boundaryId}`);
    addSystemNotification({
      tieu_de: 'Cập nhật ranh giới tổ dân cư',
      noi_dung: `Ranh giới không gian của ${boundaryId} đã được điều chỉnh thành công trên bản đồ GIS.`,
      loai: 'ho_khau',
      link_tab: 'ho-khau',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ quản trị',
    });
  };

  const addBoundary = (boundary: ToBoundaryFeature) => {
    setBoundariesData((prev) => ({
      ...prev,
      features: [...prev.features, boundary],
    }));
    logActivity('INSERT', 'ho_khau', boundary.properties.id, null, boundary, `Thêm phân vùng ranh giới mới: ${boundary.properties.to_dan_cu}`);
    addSystemNotification({
      tieu_de: 'Thêm ranh giới phân vùng mới',
      noi_dung: `Phân vùng "${boundary.properties.to_dan_cu}" vừa được khởi tạo trên bản đồ số GIS.`,
      loai: 'ho_khau',
      link_tab: 'ho-khau',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ quản trị',
    });
  };

  const deleteBoundary = (boundaryId: string) => {
    let deletedName = boundaryId;
    setBoundariesData((prev) => {
      const found = prev.features.find((f) => f.properties.id === boundaryId || f.properties.to_dan_cu === boundaryId);
      if (found) deletedName = found.properties.to_dan_cu;
      return {
        ...prev,
        features: prev.features.filter((f) => f.properties.id !== boundaryId && f.properties.to_dan_cu !== boundaryId),
      };
    });
    logActivity('DELETE', 'ho_khau', boundaryId, null, null, `Xóa phân vùng ranh giới: ${deletedName}`);
    addSystemNotification({
      tieu_de: 'Xóa phân vùng ranh giới',
      noi_dung: `Phân vùng "${deletedName}" đã được xóa khỏi bản đồ số GIS.`,
      loai: 'ho_khau',
      link_tab: 'ho-khau',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ quản trị',
    });
  };

  const resetBoundariesToDefault = () => {
    setBoundariesData(AN_TRACH_TO_BOUNDARIES_GEOJSON);
    logActivity('UPDATE', 'ho_khau', undefined, null, null, `Khôi phục ranh giới 8 tổ dân cư về mặc định`);
  };

  const addSanXuatRecord = async (record: Omit<SanXuatRecord, 'id'>): Promise<SanXuatRecord> => {
    const newId = `sx-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newRecord: SanXuatRecord = {
      ...record,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSanXuatList((prev) => [newRecord, ...prev]);
    logActivity('INSERT', 'nhan_khau', newId, null, newRecord, `Thêm thửa sản xuất: ${newRecord.chu_dat} (${newRecord.lo_thua_dat}, ${newRecord.dien_tich_m2}m²)`);

    addSystemNotification({
      tieu_de: 'Thêm mới thửa đất sản xuất',
      noi_dung: `Thửa ruộng ${newRecord.lo_thua_dat} (${newRecord.dien_tich_m2} m², giống ${newRecord.giong_lua}) của hộ ${newRecord.ho_san_xuat} vừa được ghi nhận.`,
      loai: 'dan_cu',
      link_tab: 'nong-nghiep',
      target_id: newId,
      nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ Nông nghiệp',
    });

    return newRecord;
  };

  const updateSanXuatRecord = async (id: string, data: Partial<SanXuatRecord>) => {
    let oldObj: SanXuatRecord | undefined;
    setSanXuatList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          oldObj = item;
          return {
            ...item,
            ...data,
            updated_at: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    if (oldObj) {
      logActivity('UPDATE', 'nhan_khau', id, oldObj, { ...oldObj, ...data }, `Chỉnh sửa thửa sản xuất: ${oldObj.lo_thua_dat} (${oldObj.chu_dat})`);
      addSystemNotification({
        tieu_de: 'Cập nhật thửa sản xuất mùa vụ',
        noi_dung: `Thông tin canh tác thửa ${oldObj.lo_thua_dat} (${oldObj.ho_san_xuat}) vừa được cập nhật.`,
        loai: 'dan_cu',
        link_tab: 'nong-nghiep',
        target_id: id,
        nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ Nông nghiệp',
      });
    }
  };

  const deleteSanXuatRecord = async (id: string) => {
    const target = sanXuatList.find((r) => r.id === id);
    if (target) {
      setSanXuatList((prev) => prev.filter((r) => r.id !== id));
      logActivity('DELETE', 'nhan_khau', id, target, null, `Xóa thửa sản xuất: ${target.lo_thua_dat} (${target.chu_dat})`);
      addSystemNotification({
        tieu_de: 'Xóa bản ghi thửa đất sản xuất',
        noi_dung: `Thửa ${target.lo_thua_dat} của hộ ${target.ho_san_xuat} đã được xóa khỏi sổ bộ vụ Đông Xuân.`,
        loai: 'dan_cu',
        link_tab: 'nong-nghiep',
        nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ Nông nghiệp',
      });
    }
  };

  const importSanXuatExcel = (records: SanXuatRecord[]) => {
    setSanXuatList(records);
    localStorage.setItem('antrach_sanxuat_v4', JSON.stringify(records));
    logActivity('IMPORT_EXCEL', 'nhan_khau', undefined, null, null, `Nhập Master Excel ${records.length} thửa sản xuất vụ mùa`);
    addSystemNotification({
      tieu_de: 'Đồng bộ cơ sở dữ liệu Master Sản xuất',
      noi_dung: `Đã nạp thành công ${records.length} thửa sản xuất vụ Đông Xuân vào hệ thống.`,
      loai: 'dong_bo',
      link_tab: 'nong-nghiep',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const resetSanXuatToSeed = () => {
    setSanXuatList(SEED_SAN_XUAT);
    localStorage.setItem('antrach_sanxuat_v4', JSON.stringify(SEED_SAN_XUAT));
    logActivity('UPDATE', 'nhan_khau', undefined, null, null, `Khôi phục danh sách sản xuất 647 thửa về mặc định`);
    addSystemNotification({
      tieu_de: 'Khôi phục sổ bộ Nông nghiệp gốc',
      noi_dung: 'Đã khôi phục thành công 647 thửa ruộng trên 5 xứ đồng vụ Đông Xuân của Thôn An Trạch.',
      loai: 'dan_cu',
      link_tab: 'nong-nghiep',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const clearAllSanXuat = () => {
    setSanXuatList([]);
    localStorage.setItem('antrach_sanxuat_v4', JSON.stringify([]));
    logActivity('DELETE', 'nhan_khau', undefined, null, null, `Xóa sạch toàn bộ sổ bộ 647 thửa sản xuất nông nghiệp`);
    addSystemNotification({
      tieu_de: 'Đã xóa toàn bộ cơ sở dữ liệu Nông nghiệp',
      noi_dung: 'Toàn bộ danh sách 647 thửa đất sản xuất mùa vụ đã được xóa trắng theo lệnh của cán bộ quản trị.',
      loai: 'dan_cu',
      link_tab: 'nong-nghiep',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const addXuDong = async (data: Omit<XuDongMeta, 'ma_xu_dong'> & { ma_xu_dong?: string }) => {
    const ma = data.ma_xu_dong || `XD-${Date.now().toString(36).toUpperCase()}`;
    const newZone: XuDongMeta = {
      ...data,
      ma_xu_dong: ma,
    };
    setXuDongList((prev) => [...prev, newZone]);
    logActivity('INSERT', 'nhan_khau', ma, null, newZone, `Thêm mới Vùng/Xứ đồng sản xuất: ${newZone.ten_xu_dong}`);
    addSystemNotification({
      tieu_de: 'Thêm mới Xứ Đồng Sản Xuất',
      noi_dung: `Đã thêm vùng sản xuất "${newZone.ten_xu_dong}" với diện tích ${(newZone.dien_tich_m2 / 10000).toFixed(2)} ha vào hệ thống.`,
      loai: 'dan_cu',
      link_tab: 'nong-nghiep',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const updateXuDong = async (ma_xu_dong: string, updates: Partial<XuDongMeta>) => {
    setXuDongList((prev) =>
      prev.map((z) => (z.ma_xu_dong === ma_xu_dong ? { ...z, ...updates } : z))
    );
    logActivity('UPDATE', 'nhan_khau', ma_xu_dong, null, updates, `Cập nhật thông tin Vùng/Xứ đồng: ${ma_xu_dong}`);
    addSystemNotification({
      tieu_de: 'Cập nhật Xứ Đồng Sản Xuất',
      noi_dung: `Đã cập nhật thông tin vùng sản xuất "${updates.ten_xu_dong || ma_xu_dong}".`,
      loai: 'dan_cu',
      link_tab: 'nong-nghiep',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
    });
  };

  const deleteXuDong = async (ma_xu_dong: string) => {
    const target = xuDongList.find((z) => z.ma_xu_dong === ma_xu_dong);
    setXuDongList((prev) => prev.filter((z) => z.ma_xu_dong !== ma_xu_dong));
    if (target) {
      logActivity('DELETE', 'nhan_khau', ma_xu_dong, target, null, `Xóa Vùng/Xứ đồng: ${target.ten_xu_dong}`);
      addSystemNotification({
        tieu_de: 'Xóa Xứ Đồng Sản Xuất',
        noi_dung: `Vùng sản xuất "${target.ten_xu_dong}" đã được xóa khỏi hệ thống quản trị.`,
        loai: 'dan_cu',
        link_tab: 'nong-nghiep',
        nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
      });
    }
  };

  const resetXuDongToDefault = () => {
    setXuDongList(SEED_XU_DONG);
    logActivity('UPDATE', 'nhan_khau', undefined, null, null, `Khôi phục danh sách 5 Xứ Đồng về mặc định`);
  };

  // ================= AGRICULTURAL GIS SPATIAL GEOJSON CRUD =================
  const addAgriZoneFeature = (feat: XuDongGeoFeature) => {
    setAgriZonesGeoJson((prev) => ({
      ...prev,
      features: [...prev.features, feat],
    }));
    logActivity('INSERT', 'nhan_khau', feat.id, null, feat, `Thêm phân vùng xứ đồng đa điểm GIS: ${feat.properties.ten_xu_dong}`);
    addSystemNotification({
      tieu_de: 'Tạo mới Phân Vùng Xứ Đồng GIS Đa Điểm',
      noi_dung: `Đã khởi tạo thành công phân vùng không gian đa điểm "${feat.properties.ten_xu_dong}" (${feat.properties.dien_tich_ha} ha).`,
      loai: 'dan_cu',
      link_tab: 'ban-do-san-xuat',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ GIS',
    });
  };

  const updateAgriZoneFeature = (
    id: string,
    properties: Partial<XuDongGeoFeature['properties']>,
    coordinates?: [number, number][][]
  ) => {
    setAgriZonesGeoJson((prev) => ({
      ...prev,
      features: prev.features.map((feat) => {
        if (feat.id === id || feat.properties.id === id || feat.properties.ma_xu_dong === id) {
          return {
            ...feat,
            properties: {
              ...feat.properties,
              ...properties,
            },
            geometry: {
              ...feat.geometry,
              coordinates: coordinates || feat.geometry.coordinates,
            },
          };
        }
        return feat;
      }),
    }));
    logActivity('UPDATE', 'nhan_khau', id, null, properties, `Cập nhật tọa độ đa điểm xứ đồng: ${properties.ten_xu_dong || id}`);
    addSystemNotification({
      tieu_de: 'Cập nhật Tọa Độ Đa Điểm Xứ Đồng GIS',
      noi_dung: `Đã lưu thay đổi tọa độ không gian đa giác cho xứ đồng "${properties.ten_xu_dong || id}".`,
      loai: 'dan_cu',
      link_tab: 'ban-do-san-xuat',
      nguoi_thuc_hien: currentUser?.ho_ten || 'Cán bộ GIS',
    });
  };

  const deleteAgriZoneFeature = (id: string) => {
    const target = agriZonesGeoJson.features.find((f) => f.id === id || f.properties.id === id || f.properties.ma_xu_dong === id);
    setAgriZonesGeoJson((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id && f.properties.id !== id && f.properties.ma_xu_dong !== id),
    }));
    if (target) {
      logActivity('DELETE', 'nhan_khau', id, target, null, `Xóa phân vùng đa điểm xứ đồng: ${target.properties.ten_xu_dong}`);
      addSystemNotification({
        tieu_de: 'Xóa Phân Vùng Xứ Đồng GIS',
        noi_dung: `Đã xóa phân vùng không gian "${target.properties.ten_xu_dong}" khỏi bản đồ số nông nghiệp.`,
        loai: 'dan_cu',
        link_tab: 'ban-do-san-xuat',
        nguoi_thuc_hien: currentUser?.ho_ten || 'Quản trị viên',
      });
    }
  };

  const addAgriParcelFeature = (feat: ParcelGeoFeature) => {
    setAgriParcelsGeoJson((prev) => ({
      ...prev,
      features: [...prev.features, feat],
    }));
    logActivity('INSERT', 'nhan_khau', feat.id, null, feat, `Thêm thửa đất đa điểm GIS: Thửa ${feat.properties.lo_thua_dat}`);
  };

  const updateAgriParcelFeature = (
    id: string,
    properties: Partial<ParcelGeoFeature['properties']>,
    coordinates?: [number, number][][]
  ) => {
    setAgriParcelsGeoJson((prev) => ({
      ...prev,
      features: prev.features.map((feat) => {
        if (feat.id === id || feat.properties.id === id) {
          return {
            ...feat,
            properties: {
              ...feat.properties,
              ...properties,
            },
            geometry: {
              ...feat.geometry,
              coordinates: coordinates || feat.geometry.coordinates,
            },
          };
        }
        return feat;
      }),
    }));
    logActivity('UPDATE', 'nhan_khau', id, null, properties, `Cập nhật hình học thửa đất đa điểm: ${properties.lo_thua_dat || id}`);
  };

  const deleteAgriParcelFeature = (id: string) => {
    setAgriParcelsGeoJson((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id && f.properties.id !== id),
    }));
    logActivity('DELETE', 'nhan_khau', id, null, null, `Xóa polygon thửa đất đa điểm: ${id}`);
  };

  const exportAgriGeoJsonBackup = (): string => {
    const combinedData = {
      type: 'FeatureCollection',
      features: [
        ...agriZonesGeoJson.features,
        ...agriParcelsGeoJson.features,
        ...agriCanalsGeoJson.features,
        ...agriPointsGeoJson.features,
      ],
    };
    logActivity('EXPORT_EXCEL', 'nhan_khau', undefined, null, null, `Xuất file GeoJSON toàn bộ không gian nông nghiệp An Trạch`);
    return JSON.stringify(combinedData, null, 2);
  };

  const restoreAgriGeoJson = (geoJsonString: string): { success: boolean; count: number; message: string } => {
    try {
      const data = JSON.parse(geoJsonString);
      if (!data || !data.features || !Array.isArray(data.features)) {
        return { success: false, count: 0, message: 'File không đúng định dạng GeoJSON FeatureCollection hợp lệ.' };
      }

      const newZones: XuDongGeoFeature[] = [];
      const newParcels: ParcelGeoFeature[] = [];

      data.features.forEach((feat: any) => {
        if (feat.properties?.ma_xu_dong || feat.id?.startsWith('xd-')) {
          newZones.push(feat);
        } else if (feat.properties?.lo_thua_dat || feat.id?.startsWith('thua-')) {
          newParcels.push(feat);
        }
      });

      if (newZones.length > 0) {
        setAgriZonesGeoJson({ type: 'FeatureCollection', features: newZones });
      }
      if (newParcels.length > 0) {
        setAgriParcelsGeoJson({ type: 'FeatureCollection', features: newParcels });
      }

      logActivity('IMPORT_EXCEL', 'nhan_khau', undefined, null, null, `Phục hồi GeoJSON không gian nông nghiệp thành công (${newZones.length} xứ đồng, ${newParcels.length} thửa đất)`);
      return {
        success: true,
        count: newZones.length + newParcels.length,
        message: `Phục hồi thành công ${newZones.length} xứ đồng và ${newParcels.length} thửa đất đa điểm.`,
      };
    } catch (err: any) {
      return { success: false, count: 0, message: `Lỗi đọc file: ${err.message}` };
    }
  };

  const resetAgriGeoJsonToDefault = () => {
    setAgriZonesGeoJson(XU_DONG_POLYGONS_GEOJSON);
    setAgriParcelsGeoJson(PARCELS_GEOJSON);
    logActivity('UPDATE', 'nhan_khau', undefined, null, null, `Khôi phục dữ liệu GeoJSON nông nghiệp về mặc định ban đầu`);
  };

  return (
    <DataContext.Provider
      value={{
        nhanKhauList,
        hoKhauList,
        thongBaoList,
        binhLuanList,
        canBoList,
        congVanList,
        sanXuatList,
        giongLuaList,
        xuDongList,
        lichThoiVuList,
        systemNotifications,
        unreadNotificationCount,
        filters,
        setFilters,
        resetFilters,
        filteredNhanKhau,
        visibleNhanKhau,
        addCanBo,
        updateCanBo,
        deleteCanBo,
        addCongVan,
        updateCongVan,
        deleteCongVan,
        addSanXuatRecord,
        updateSanXuatRecord,
        deleteSanXuatRecord,
        importSanXuatExcel,
        resetSanXuatToSeed,
        addXuDong,
        updateXuDong,
        deleteXuDong,
        resetXuDongToDefault,
        agriZonesGeoJson,
        agriParcelsGeoJson,
        agriCanalsGeoJson,
        agriPointsGeoJson,
        addAgriZoneFeature,
        updateAgriZoneFeature,
        deleteAgriZoneFeature,
        addAgriParcelFeature,
        updateAgriParcelFeature,
        deleteAgriParcelFeature,
        exportAgriGeoJsonBackup,
        restoreAgriGeoJson,
        resetAgriGeoJsonToDefault,
        assignCongVan,
        updateCongVanProgress,
        exportGisGeoJson,
        restoreGisGeoJson,
        boundariesData,
        addBoundary,
        updateBoundary,
        deleteBoundary,
        resetBoundariesToDefault,
        addNhanKhau,
        updateNhanKhau,
        deleteNhanKhau,
        addHoKhau,
        updateHoKhau,
        updateHouseholdLocation,
        updateHouseholdSpatialData,
        addThongBao,
        updateThongBao,
        deleteThongBao,
        toggleGhimThongBao,
        increaseViewCount,
        toggleLikeThongBao,
        addBinhLuan,
        replyBinhLuan,
        deleteBinhLuan,
        addSystemNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        importExcelData,
        clearAllNhanKhau,
        resetNhanKhauToSeed,
        clearAllSanXuat,
        // AI Knowledge System Exports
        aiKnowledgeList,
        aiConfig,
        addAiKnowledge,
        updateAiKnowledge,
        deleteAiKnowledge,
        updateAiConfig,
        syncSystemKnowledge,
        resetAiKnowledgeToDefault,
        importAiKnowledgeBatch,
        kpiStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
