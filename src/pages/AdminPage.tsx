import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import * as XLSX from 'xlsx';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Unlock, 
  History, 
  Database, 
  Copy, 
  Check, 
  AlertCircle,
  FileText,
  UserPlus,
  Edit3,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Key,
  Shield,
  Layers,
  Sparkles,
  ChevronRight,
  Clock,
  UserX,
  Users,
  Settings,
  Terminal,
  Activity,
  Server,
  RefreshCw,
  X,
  Save,
  CheckSquare,
  Square,
  Map as MapIcon,
  Crosshair,
  Plus,
  PlusCircle,
  RotateCcw,
  Download,
  Upload,
  Navigation,
  Compass,
  Sliders,
  MapPin,
  Pentagon,
  Move,
  Phone,
  FileDown,
  CheckCheck,
  FileSpreadsheet,
  FileUp,
  Table,
  Building2,
  Wheat,
  Sprout,
  Scale,
  Droplets
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole, UserStatus, UserProfile, NhanKhau, SanXuatRecord, XuDongMeta } from '../types';
import { ToBoundaryFeature, AN_TRACH_CENTER } from '../data/anTrachGeoJsonData';
import { XuDongGeoFeature, ParcelGeoFeature } from '../data/anTrachAgriculturalGeoJson';
import { AgriSpatialEditorModal } from '../components/AgriSpatialEditorModal';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { exportNhanKhauToExcel } from '../lib/utils';

const roleMeta: Record<UserRole, { label: string; desc: string; badge: string; color: string }> = {
  super_admin: { 
    label: 'Super Admin', 
    desc: 'Toàn quyền tối cao hệ thống, quản trị database, phân quyền mọi cán bộ',
    badge: 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold',
    color: 'text-purple-600'
  },
  admin: { 
    label: 'Quản Trị Viên', 
    desc: 'Quản lý cán bộ, phê duyệt tài khoản, xuất nhập Excel và giám sát toàn thôn',
    badge: 'bg-indigo-100 text-indigo-900 border-indigo-300 font-extrabold',
    color: 'text-indigo-600'
  },
  truong_thon: { 
    label: 'Trưởng Thôn', 
    desc: 'Quản lý 2.308 nhân khẩu toàn thôn, duyệt hồ sơ cư trú và ban hành bản tin',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    color: 'text-emerald-600'
  },
  to_truong: { 
    label: 'Tổ Trưởng Dân Cư', 
    desc: 'Quản lý nhân khẩu và hộ khẩu theo đúng Tổ dân cư được phân công phụ trách',
    badge: 'bg-sky-100 text-sky-900 border-sky-300 font-bold',
    color: 'text-sky-600'
  },
  can_bo_y_te: { 
    label: 'Cán Bộ Y Tế', 
    desc: 'Quản lý thông tin thẻ BHYT, tiêm chủng, sức khỏe nhân dân toàn thôn',
    badge: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
    color: 'text-rose-600'
  },
  cong_an_vien: { 
    label: 'Công An Viên', 
    desc: 'Quản lý tạm trú, tạm vắng, CCCD gắn chip và an ninh trật tự địa bàn',
    badge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    color: 'text-amber-600'
  },
  can_bo_xa: { 
    label: 'Cán Bộ Xã', 
    desc: 'Tra cứu, giám sát và tổng hợp báo cáo chỉ số dân số cấp xã',
    badge: 'bg-teal-100 text-teal-900 border-teal-300 font-bold',
    color: 'text-teal-600'
  },
};

const PERMISSION_MATRIX = [
  { feature: 'Xem 2.308 nhân khẩu toàn thôn', super_admin: true, admin: true, truong_thon: true, to_truong: 'Theo tổ', can_bo_y_te: true, cong_an_vien: true, can_bo_xa: true },
  { feature: 'Thêm & Chỉnh sửa nhân khẩu', super_admin: true, admin: true, truong_thon: true, to_truong: 'Theo tổ', can_bo_y_te: 'BHYT', cong_an_vien: 'Cư trú', can_bo_xa: false },
  { feature: 'Xóa nhân khẩu khỏi sổ bộ', super_admin: true, admin: true, truong_thon: true, to_truong: false, can_bo_y_te: false, cong_an_vien: false, can_bo_xa: false },
  { feature: 'Ghim vị trí GPS & Sổ hộ khẩu', super_admin: true, admin: true, truong_thon: true, to_truong: 'Theo tổ', can_bo_y_te: false, cong_an_vien: true, can_bo_xa: false },
  { feature: 'Quản trị ranh giới & Đa điểm GIS', super_admin: true, admin: true, truong_thon: true, to_truong: false, can_bo_y_te: false, cong_an_vien: false, can_bo_xa: false },
  { feature: 'Đăng bản tin thôn & Trả lời bà con', super_admin: true, admin: true, truong_thon: true, to_truong: 'Theo tổ', can_bo_y_te: 'Y tế', cong_an_vien: 'An ninh', can_bo_xa: true },
  { feature: 'Xuất / Nhập Master Excel', super_admin: true, admin: true, truong_thon: true, to_truong: false, can_bo_y_te: false, cong_an_vien: false, can_bo_xa: false },
  { feature: 'Phê duyệt & Phân quyền cán bộ', super_admin: true, admin: true, truong_thon: false, to_truong: false, can_bo_y_te: false, cong_an_vien: false, can_bo_xa: false },
  { feature: 'Xem Audit Log & Cấu hình Supabase', super_admin: true, admin: true, truong_thon: 'Xem Log', to_truong: false, can_bo_y_te: false, cong_an_vien: false, can_bo_xa: false },
];

// Calculate area of polygon in square meters
const calculatePolygonAreaM2 = (coords: [number, number][]): number => {
  if (coords.length < 3) return 0;
  let area = 0;
  const rad = Math.PI / 180;
  const R = 6378137;

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    area += (p2[0] - p1[0]) * rad * (2 + Math.sin(p1[1] * rad) + Math.sin(p2[1] * rad));
  }
  area = Math.abs(area * R * R / 2.0);
  return Math.round(area);
};

export const AdminPage: React.FC = () => {
  const { 
    allProfiles, 
    updateUserStatus, 
    addOfficerUser, 
    updateOfficerUser, 
    deleteOfficerUser, 
    auditLogs, 
    currentUser 
  } = useAuth();

  const { 
    nhanKhauList, 
    hoKhauList, 
    thongBaoList, 
    binhLuanList,
    sanXuatList,
    boundariesData,
    addBoundary,
    updateBoundary,
    deleteBoundary,
    resetBoundariesToDefault,
    exportGisGeoJson,
    importExcelData,
    xuDongList,
    addXuDong,
    updateXuDong,
    deleteXuDong,
    resetXuDongToDefault,
    agriZonesGeoJson
  } = useData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'boundaries' | 'members' | 'excel' | 'san_xuat_zones' | 'matrix' | 'audit' | 'supabase'>('boundaries');
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Filters for Members
  const [searchMember, setSearchMember] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterTo, setFilterTo] = useState<string>('ALL');

  // Filters for Audit Log
  const [searchAudit, setSearchAudit] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  // Filters for Boundaries
  const [searchBoundary, setSearchBoundary] = useState('');

  // ================= XỨ ĐỒNG / VÙNG SẢN XUẤT STATES =================
  const [searchXuDong, setSearchXuDong] = useState('');
  const [isXuDongModalOpen, setIsXuDongModalOpen] = useState(false);
  const [editingXuDong, setEditingXuDong] = useState<XuDongMeta | null>(null);
  const [isAgriSpatialModalOpen, setIsAgriSpatialModalOpen] = useState(false);
  const [editingAgriSpatialFeature, setEditingAgriSpatialFeature] = useState<XuDongGeoFeature | null>(null);
  const [xdFormMa, setXdFormMa] = useState('');
  const [xdFormTen, setXdFormTen] = useState('');
  const [xdFormViTri, setXdFormViTri] = useState('');
  const [xdFormDienTichM2, setXdFormDienTichM2] = useState<number>(50000);
  const [xdFormSoThua, setXdFormSoThua] = useState<number>(50);
  const [xdFormCacLo, setXdFormCacLo] = useState('');
  const [xdFormGiongChinh, setXdFormGiongChinh] = useState('HG12 & HG244');
  const [xdFormNguonNuoc, setXdFormNguonNuoc] = useState('Trạm Bơm An Trạch 1');
  const [xdFormToQuanLy, setXdFormToQuanLy] = useState('Tổ Thủy Nông 1');
  const [xdFormMauSac, setXdFormMauSac] = useState('#10b981');

  // Excel Suite States
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importPreviewData, setImportPreviewData] = useState<NhanKhau[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Modal Member States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserProfile | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('to_truong');
  const [formTo, setFormTo] = useState('Tổ 1');
  const [formStatus, setFormStatus] = useState<UserStatus>('active');
  const [formAvatar, setFormAvatar] = useState('');

  // ================= BOUNDARY MULTI-POINT SUITE STATES =================
  const [isBoundaryModalOpen, setIsBoundaryModalOpen] = useState(false);
  const [editingBoundary, setEditingBoundary] = useState<ToBoundaryFeature | null>(null);
  const [bFormName, setBFormName] = useState('');
  const [bFormToTruong, setBFormToTruong] = useState('');
  const [bFormPhone, setBFormPhone] = useState('');
  const [bFormDienTich, setBFormDienTich] = useState<number>(10);
  const [bFormColor, setBFormColor] = useState('#0284c7');
  const [bFormMoTa, setBFormMoTa] = useState('');
  
  // Multi-point coordinates stored as array of [lng, lat]
  const [bFormPoints, setBFormPoints] = useState<[number, number][]>([]);
  
  // Point input fields
  const [newPointLat, setNewPointLat] = useState<string>('');
  const [newPointLng, setNewPointLng] = useState<string>('');
  const [bulkCoordsText, setBulkCoordsText] = useState<string>('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string>('');

  // Mini Map Reference
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<L.Map | null>(null);
  const miniMapPolygonRef = useRef<L.Polygon | null>(null);
  const miniMapMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  const pendingUsers = allProfiles.filter((p) => p.trang_thai === 'pending_approval');
  const activeUsers = allProfiles.filter((p) => p.trang_thai === 'active');
  const blockedUsers = allProfiles.filter((p) => p.trang_thai === 'blocked');

  // Filtered members list
  const filteredMembers = allProfiles.filter((user) => {
    if (searchMember.trim()) {
      const q = searchMember.toLowerCase();
      const match = user.ho_ten.toLowerCase().includes(q) || 
                    user.email.toLowerCase().includes(q) || 
                    (user.so_dien_thoai && user.so_dien_thoai.includes(q));
      if (!match) return false;
    }
    if (filterRole !== 'ALL' && user.vai_tro !== filterRole) return false;
    if (filterStatus !== 'ALL' && user.trang_thai !== filterStatus) return false;
    if (filterTo !== 'ALL' && user.to_phu_trach !== filterTo) return false;
    return true;
  });

  // Filtered audit logs
  const filteredLogs = auditLogs.filter((log) => {
    if (searchAudit.trim()) {
      const q = searchAudit.toLowerCase();
      const match = (log.user_name && log.user_name.toLowerCase().includes(q)) ||
                    (log.mo_ta && log.mo_ta.toLowerCase().includes(q)) ||
                    (log.bang_du_lieu && log.bang_du_lieu.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filterAction !== 'ALL' && log.hanh_dong !== filterAction) return false;
    return true;
  });

  // Filtered boundaries
  const filteredBoundaries = boundariesData.features.filter((f) => {
    if (searchBoundary.trim()) {
      const q = searchBoundary.toLowerCase();
      const match = f.properties.to_dan_cu.toLowerCase().includes(q) ||
                    f.properties.to_truong.toLowerCase().includes(q) ||
                    (f.properties.so_dien_thoai && f.properties.so_dien_thoai.includes(q)) ||
                    (f.properties.mo_ta && f.properties.mo_ta.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const totalBoundaryAreaHa = boundariesData.features.reduce((sum, f) => sum + (f.properties.dien_tich_ha || 0), 0);
  const totalBoundaryVertices = boundariesData.features.reduce((sum, f) => sum + (f.geometry?.coordinates?.[0]?.length || 0), 0);

  // Initialize & Update Mini Map inside Modal
  useEffect(() => {
    if (!isBoundaryModalOpen) {
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!miniMapContainerRef.current) return;
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.invalidateSize();
        return;
      }

      let centerLat = AN_TRACH_CENTER[0];
      let centerLng = AN_TRACH_CENTER[1];
      if (bFormPoints.length > 0) {
        centerLat = bFormPoints[0][1];
        centerLng = bFormPoints[0][0];
      }

      const map = L.map(miniMapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 16,
        zoomControl: true
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'ESRI World Imagery HD',
        maxZoom: 20
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      miniMapMarkersGroupRef.current = markersGroup;

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newPt: [number, number] = [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
        setBFormPoints((prev) => [...prev, newPt]);
      });

      miniMapInstanceRef.current = map;
      updateMiniMapLayers(map, bFormPoints, bFormColor);
    }, 250);

    return () => clearTimeout(timer);
  }, [isBoundaryModalOpen]);

  useEffect(() => {
    if (!miniMapInstanceRef.current) return;
    updateMiniMapLayers(miniMapInstanceRef.current, bFormPoints, bFormColor);
  }, [bFormPoints, bFormColor]);

  const updateMiniMapLayers = (map: L.Map, points: [number, number][], color: string) => {
    if (miniMapPolygonRef.current) {
      map.removeLayer(miniMapPolygonRef.current);
      miniMapPolygonRef.current = null;
    }
    if (miniMapMarkersGroupRef.current) {
      miniMapMarkersGroupRef.current.clearLayers();
    }

    if (points.length === 0) return;

    const latLngs = points.map(([lng, lat]) => [lat, lng] as [number, number]);

    if (points.length >= 3) {
      const polygon = L.polygon(latLngs, {
        color: color || '#0284c7',
        weight: 3,
        fillColor: color || '#38bdf8',
        fillOpacity: 0.4
      }).addTo(map);
      miniMapPolygonRef.current = polygon;
      map.fitBounds(polygon.getBounds(), { padding: [20, 20] });
    } else if (points.length > 1) {
      const polyline = L.polyline(latLngs, { color: color || '#0284c7', weight: 3, dashArray: '6, 6' }).addTo(map);
      miniMapPolygonRef.current = polyline as any;
      map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
    }

    points.forEach((pt, idx) => {
      const [lng, lat] = pt;
      const vertexIcon = L.divIcon({
        className: 'minimap-vertex-handle',
        html: `
          <div class="w-5 h-5 rounded-full bg-amber-500 text-slate-900 font-black text-[10px] flex items-center justify-center border-2 border-white shadow-md">
            ${idx + 1}
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([lat, lng], {
        icon: vertexIcon,
        draggable: true
      });

      marker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        const updated = [...points];
        updated[idx] = [Number(newPos.lng.toFixed(6)), Number(newPos.lat.toFixed(6))];
        setBFormPoints(updated);
      });

      miniMapMarkersGroupRef.current?.addLayer(marker);
    });
  };

  // Action: Open Add Boundary Modal
  const handleOpenAddBoundaryModal = () => {
    setEditingBoundary(null);
    const nextNum = boundariesData.features.length + 1;
    setBFormName(`Tổ ${nextNum}`);
    setBFormToTruong('');
    setBFormPhone('');
    setBFormDienTich(12.5);
    setBFormColor('#10b981');
    setBFormMoTa('Phân vùng quy hoạch mở rộng');
    
    const seedPoints: [number, number][] = [
      [108.1950, 15.9640],
      [108.1980, 15.9640],
      [108.1980, 15.9610],
      [108.1950, 15.9610],
    ];
    setBFormPoints(seedPoints);
    setNewPointLat('');
    setNewPointLng('');
    setBulkCoordsText('');
    setShowBulkInput(false);
    setGpsStatusMsg('');
    setIsBoundaryModalOpen(true);
  };

  // Action: Open Edit Boundary Modal
  const handleOpenEditBoundaryModal = (feat: ToBoundaryFeature) => {
    setEditingBoundary(feat);
    setBFormName(feat.properties.to_dan_cu);
    setBFormToTruong(feat.properties.to_truong);
    setBFormPhone(feat.properties.so_dien_thoai || '');
    setBFormDienTich(feat.properties.dien_tich_ha || 10);
    setBFormColor(feat.properties.color || '#0284c7');
    setBFormMoTa(feat.properties.mo_ta || '');
    
    const ring = feat.geometry?.coordinates?.[0] || [];
    setBFormPoints([...ring]);
    setNewPointLat('');
    setNewPointLng('');
    setBulkCoordsText('');
    setShowBulkInput(false);
    setGpsStatusMsg('');
    setIsBoundaryModalOpen(true);
  };

  // Action: Auto Capture Device GPS Coordinate
  const handleCaptureDeviceGPS = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ GPS định vị.');
      return;
    }
    setIsGpsLoading(true);
    setGpsStatusMsg('Đang lấy tọa độ GPS thực địa...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newPt: [number, number] = [Number(longitude.toFixed(6)), Number(latitude.toFixed(6))];
        setBFormPoints((prev) => [...prev, newPt]);
        setIsGpsLoading(false);
        setGpsStatusMsg(`✓ Đã thêm điểm GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Sai số ±${Math.round(accuracy || 5)}m)`);
        setTimeout(() => setGpsStatusMsg(''), 4000);
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsStatusMsg(`Lỗi GPS: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  // Action: Add Manual Single Point
  const handleAddManualPoint = () => {
    const lat = parseFloat(newPointLat.trim());
    const lng = parseFloat(newPointLng.trim());
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Vui lòng nhập vĩ độ (Lat: -90 đến 90) và kinh độ (Lng: -180 đến 180) hợp lệ.');
      return;
    }
    setBFormPoints((prev) => [...prev, [Number(lng.toFixed(6)), Number(lat.toFixed(6))]]);
    setNewPointLat('');
    setNewPointLng('');
  };

  // Action: Delete Single Point
  const handleDeletePoint = (index: number) => {
    setBFormPoints((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Action: Parse Bulk Paste Coordinates
  const handleParseBulkCoordinates = () => {
    if (!bulkCoordsText.trim()) return;
    try {
      const text = bulkCoordsText.trim();
      let parsedPoints: [number, number][] = [];

      if (text.startsWith('[') && text.endsWith(']')) {
        const jsonArr = JSON.parse(text);
        if (Array.isArray(jsonArr)) {
          jsonArr.forEach((item) => {
            if (Array.isArray(item) && item.length >= 2) {
              parsedPoints.push([Number(item[0]), Number(item[1])]);
            }
          });
        }
      } else {
        const lines = text.split('\n');
        lines.forEach((line) => {
          const parts = line.replace(/,/g, ' ').trim().split(/\s+/);
          if (parts.length >= 2) {
            const num1 = parseFloat(parts[0]);
            const num2 = parseFloat(parts[1]);
            if (!isNaN(num1) && !isNaN(num2)) {
              if (num1 < 50 && num2 > 50) {
                parsedPoints.push([Number(num2.toFixed(6)), Number(num1.toFixed(6))]);
              } else {
                parsedPoints.push([Number(num1.toFixed(6)), Number(num2.toFixed(6))]);
              }
            }
          }
        });
      }

      if (parsedPoints.length >= 3) {
        setBFormPoints(parsedPoints);
        setShowBulkInput(false);
        setBulkCoordsText('');
        alert(`Đã nhập thành công ${parsedPoints.length} điểm tọa độ vào phân vùng.`);
      } else {
        alert('Không tìm thấy đủ 3 điểm tọa độ hợp lệ trong văn bản dán.');
      }
    } catch (err: any) {
      alert(`Lỗi phân tích cú pháp tọa độ: ${err.message}`);
    }
  };

  // Action: Save Boundary Multi-Point Modal
  const handleSaveBoundaryModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bFormName.trim()) return;

    if (bFormPoints.length < 3) {
      alert('Phân vùng cần tối thiểu 3 điểm tọa độ để tạo thành đa giác khép kín.');
      return;
    }

    const closedPoints: [number, number][] = [...bFormPoints];
    if (closedPoints[0][0] !== closedPoints[closedPoints.length - 1][0] || 
        closedPoints[0][1] !== closedPoints[closedPoints.length - 1][1]) {
      closedPoints.push(closedPoints[0]);
    }

    const calculatedHa = Number((calculatePolygonAreaM2(closedPoints) / 10000).toFixed(1)) || bFormDienTich;

    if (editingBoundary) {
      updateBoundary(
        editingBoundary.properties.id,
        {
          to_dan_cu: bFormName.trim(),
          to_truong: bFormToTruong.trim(),
          so_dien_thoai: bFormPhone.trim(),
          dien_tich_ha: calculatedHa,
          color: bFormColor,
          fillColor: bFormColor,
          mo_ta: bFormMoTa.trim()
        },
        [closedPoints]
      );
      alert(`Đã lưu cập nhật phân vùng "${bFormName.trim()}" (${calculatedHa} ha, ${bFormPoints.length} điểm).`);
    } else {
      const newFeature: ToBoundaryFeature = {
        type: 'Feature',
        properties: {
          id: `boundary-${Date.now()}`,
          to_dan_cu: bFormName.trim(),
          to_truong: bFormToTruong.trim() || 'Chưa phân công',
          so_dien_thoai: bFormPhone.trim() || '',
          so_ho: 0,
          so_dan: 0,
          dien_tich_ha: calculatedHa,
          color: bFormColor,
          fillColor: bFormColor,
          fillOpacity: 0.35,
          mo_ta: bFormMoTa.trim()
        },
        geometry: {
          type: 'Polygon',
          coordinates: [closedPoints]
        }
      };
      addBoundary(newFeature);
      alert(`Đã khởi tạo thành công phân vùng mới "${bFormName.trim()}" (${calculatedHa} ha, ${bFormPoints.length} điểm).`);
    }

    setIsBoundaryModalOpen(false);
  };

  // Action: Delete Boundary
  const handleDeleteBoundaryFromAdmin = (feat: ToBoundaryFeature) => {
    if (window.confirm(`CẢNH BÁO XÓA PHÂN VÙNG:\nBạn có chắc chắn muốn xóa phân vùng ranh giới "${feat.properties.to_dan_cu}" khỏi cơ sở dữ liệu GIS không?`)) {
      deleteBoundary(feat.properties.id);
      alert(`Đã xóa phân vùng "${feat.properties.to_dan_cu}".`);
    }
  };

  // Action: Reset Boundaries
  const handleResetBoundaries = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại ranh giới 8 Tổ Dân Cư mặc định ban đầu của Thôn An Trạch không?')) {
      resetBoundariesToDefault();
      alert('Đã khôi phục lại 8 tổ dân cư mặc định.');
    }
  };

  // Action: Export Backup
  const handleExportGeoJsonBackup = () => {
    const geoJsonStr = exportGisGeoJson();
    const blob = new Blob([geoJsonStr], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnTrach_Boundaries_AdminBackup_${new Date().toISOString().split('T')[0]}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ================= XỨ ĐỒNG / VÙNG SẢN XUẤT HANDLERS =================
  const handleOpenAddXuDongModal = () => {
    setEditingXuDong(null);
    setXdFormMa(`XD-${Date.now().toString(36).toUpperCase()}`);
    setXdFormTen('');
    setXdFormViTri('');
    setXdFormDienTichM2(50000);
    setXdFormSoThua(50);
    setXdFormCacLo('');
    setXdFormGiongChinh('HG12 & HG244');
    setXdFormNguonNuoc('Trạm Bơm An Trạch 1');
    setXdFormToQuanLy('Tổ Thủy Nông 1');
    setXdFormMauSac('#10b981');
    setIsXuDongModalOpen(true);
  };

  const handleOpenEditXuDongModal = (zone: XuDongMeta) => {
    setEditingXuDong(zone);
    setXdFormMa(zone.ma_xu_dong);
    setXdFormTen(zone.ten_xu_dong);
    setXdFormViTri(zone.vi_tri);
    setXdFormDienTichM2(zone.dien_tich_m2);
    setXdFormSoThua(zone.so_thua);
    setXdFormCacLo(zone.cac_lo);
    setXdFormGiongChinh(zone.giong_chinh);
    setXdFormNguonNuoc(zone.nguon_nuoc);
    setXdFormToQuanLy(zone.to_quan_ly);
    setXdFormMauSac(zone.mau_sac);
    setIsXuDongModalOpen(true);
  };

  const handleSaveXuDong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xdFormTen.trim() || xdFormDienTichM2 <= 0) {
      alert('Vui lòng nhập tên xứ đồng và diện tích hợp lệ!');
      return;
    }

    if (editingXuDong) {
      await updateXuDong(editingXuDong.ma_xu_dong, {
        ten_xu_dong: xdFormTen.trim(),
        vi_tri: xdFormViTri.trim(),
        dien_tich_m2: Number(xdFormDienTichM2),
        so_thua: Number(xdFormSoThua),
        cac_lo: xdFormCacLo.trim(),
        giong_chinh: xdFormGiongChinh.trim(),
        nguon_nuoc: xdFormNguonNuoc.trim(),
        to_quan_ly: xdFormToQuanLy.trim(),
        mau_sac: xdFormMauSac,
      });
      alert(`Đã lưu cập nhật Vùng sản xuất "${xdFormTen.trim()}".`);
    } else {
      await addXuDong({
        ma_xu_dong: xdFormMa.trim(),
        ten_xu_dong: xdFormTen.trim(),
        vi_tri: xdFormViTri.trim(),
        dien_tich_m2: Number(xdFormDienTichM2),
        so_thua: Number(xdFormSoThua),
        cac_lo: xdFormCacLo.trim(),
        giong_chinh: xdFormGiongChinh.trim(),
        nguon_nuoc: xdFormNguonNuoc.trim(),
        to_quan_ly: xdFormToQuanLy.trim(),
        mau_sac: xdFormMauSac,
      });
      alert(`Đã tạo mới thành công Vùng sản xuất "${xdFormTen.trim()}".`);
    }

    setIsXuDongModalOpen(false);
  };

  const handleDeleteXuDongFromAdmin = async (zone: XuDongMeta) => {
    if (window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa Vùng sản xuất "${zone.ten_xu_dong}" (${zone.ma_xu_dong}) khỏi hệ thống?`)) {
      await deleteXuDong(zone.ma_xu_dong);
      alert(`Đã xóa vùng sản xuất "${zone.ten_xu_dong}".`);
    }
  };

  const handleResetXuDongFromAdmin = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại danh sách 5 Xứ Đồng sản xuất mặc định của Thôn An Trạch?')) {
      resetXuDongToDefault();
      alert('Đã khôi phục 5 xứ đồng mặc định.');
    }
  };

  const handleOpenEditZoneSpatial = (zone: XuDongMeta) => {
    const found = agriZonesGeoJson.features.find((f: any) => f.properties.ma_xu_dong === zone.ma_xu_dong || f.id === zone.ma_xu_dong);
    if (found) {
      setEditingAgriSpatialFeature(found as any);
    } else {
      setEditingAgriSpatialFeature(null);
    }
    setIsAgriSpatialModalOpen(true);
  };

  const handleOpenAddZoneSpatial = () => {
    setEditingAgriSpatialFeature(null);
    setIsAgriSpatialModalOpen(true);
  };

  // ================= EXCEL SUITE ACTIONS =================
  const handleExportMasterNhanKhau = () => {
    exportNhanKhauToExcel(nhanKhauList, `AnTrach_Master_NhanKhau_${nhanKhauList.length}_Nguoi_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportMasterHoKhau = () => {
    const exportRows = hoKhauList.map((h, idx) => ({
      'STT': idx + 1,
      'Mã Hộ Khẩu': h.ma_ho,
      'Chủ Hộ Gia Đình': h.ten_chu_ho,
      'Số CCCD/CMND Chủ Hộ': h.so_cmnd_chu_ho || '',
      'Địa Chỉ Nhà Ở': h.dia_chi,
      'Tổ Dân Cư': h.to_dan_cu,
      'Số Nhân Khẩu': h.so_nhan_khau,
      'Số Điện Thoại': h.so_dien_thoai || '',
      'Diện Tích Đất (m²)': h.dien_tich_dat_m2 || 120,
      'Vĩ Độ (Lat GPS)': h.lat || 15.9620,
      'Kinh Độ (Lng GPS)': h.lng || 108.1965,
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SoHoKhau');
    XLSX.writeFile(wb, `AnTrach_Master_SoHoKhau_${hoKhauList.length}_Ho_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleDownloadExcelTemplate = () => {
    const templateRows = [
      {
        'Mã Hộ': 'HK_001',
        'Chủ Hộ': 'NGUYỄN VĂN AN',
        'Quan Hệ': 'Chủ hộ',
        'Họ Và Tên': 'NGUYỄN VĂN AN',
        'Giới Tính': 'Nam',
        'Ngày Tháng Năm Sinh': '15/03/1980',
        'Năm Sinh': 1980,
        'Tuổi (2026)': 46,
        'Nhóm Tuổi': 'Độ tuổi lao động',
        'Số CCCD/CMND': '048080001234',
        'Loại Giấy Tờ': 'CCCD gắn chip',
        'Điện Thoại': '0905123456',
        'Họ Tên Bố': 'NGUYỄN VĂN BÌNH',
        'Họ Tên Mẹ': 'LÊ THỊ HOA',
        'Mã Thẻ BHYT': 'GD4480123456789',
        'Nhóm BHYT': 'Hộ gia đình',
        'Nghề Nghiệp': 'Nông nghiệp',
        'Địa Chỉ': 'Tổ 1, Thôn An Trạch, Xã Hòa Tiến',
        'Tổ Dân Cư': 'Tổ 1',
        'Trạng Thái Cư Trú': 'Đang thường trú',
        'Đối Tượng Đặc Thù': 'Bình thường',
        'Ghi Chú': 'Mẫu nhập liệu',
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BieuMauNhapLieu');
    XLSX.writeFile(wb, `BieuMau_NhapLieu_DanCu_AnTrach.xlsx`);
  };

  const handleFileUploadExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('Đang đọc cấu trúc tệp Excel...');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData = XLSX.utils.sheet_to_json(ws) as any[];

        if (rawData.length === 0) {
          setImportStatus('Lỗi: File Excel không có dữ liệu bản ghi.');
          setIsImporting(false);
          return;
        }

        const parsed: NhanKhau[] = rawData.map((row, idx) => ({
          id: `nk-admin-import-${Date.now()}-${idx}`,
          stt_excel: idx + 1,
          ma_ho: row['Mã Hộ'] || row['MaHo'] || `HK_${idx + 1}`,
          chu_ho: (row['Chủ Hộ'] || row['ChuHo'] || '').toUpperCase(),
          quan_he_chu_ho: row['Quan Hệ'] || row['QuanHeChuHo'] || 'Con',
          ho_ten: (row['Họ Và Tên'] || row['HoTen'] || row['Họ và tên'] || '').toUpperCase(),
          gioi_tinh: row['Giới Tính'] || row['GioiTinh'] || 'Nam',
          ngay_thang_nam_sinh: row['Ngày Tháng Năm Sinh'] || row['NgayThangNamSinh'] || '',
          nam_sinh: row['Năm Sinh'] || row['NamSinh'] ? parseInt(row['Năm Sinh'] || row['NamSinh']) : undefined,
          tuoi: row['Tuổi (2026)'] || row['Tuoi'] ? parseInt(row['Tuổi (2026)'] || row['Tuoi']) : undefined,
          nhom_tuoi: row['Nhóm Tuổi'] || row['NhomTuoi'] || '',
          so_cmnd_cccd: row['Số CCCD/CMND'] || row['So_CMND_CCCD'] || '',
          loai_giay_to: row['Loại Giấy Tờ'] || row['LoaiGiayTo'] || '',
          dien_thoai: row['Điện Thoại'] || row['DienThoai'] || '',
          ho_ten_cha: (row['Họ Tên Bố'] || row['HoTenCha'] || '').toUpperCase(),
          ho_ten_me: (row['Họ Tên Mẹ'] || row['HoTenMe'] || '').toUpperCase(),
          ma_the_bhyt: (row['Mã Thẻ BHYT'] || row['MaTheBHYT'] || '').toUpperCase(),
          nhom_bhyt: row['Nhóm BHYT'] || row['NhomBHYT'] || '',
          nghe_nghiep: row['Nghề Nghiệp'] || row['NgheNghiep'] || '',
          dia_chi: row['Địa Chỉ'] || row['DiaChi'] || 'Thôn An Trạch, Hòa Tiến',
          to_dan_cu: row['Tổ Dân Cư'] || row['ToDanCu'] || 'Tổ 1',
          trang_thai_cu_tru: row['Trạng Thái Cư Trú'] || row['TrangThaiCuTru'] || 'Đang thường trú',
          doi_tuong_dac_thu: row['Đối Tượng Đặc Thù'] || row['DoiTuongDacThu'] || 'Bình thường',
          ghi_chu: row['Ghi Chú'] || row['GhiChu'] || '',
        }));

        setImportPreviewData(parsed);
        setImportStatus(`Đã phân tích thành công ${parsed.length} bản ghi! Vui lòng bấm "Xác Nhận Nạp" để lưu vào cơ sở dữ liệu.`);
        setIsImporting(false);
      } catch (err: any) {
        setImportStatus(`Lỗi đọc file Excel: ${err.message}`);
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = () => {
    if (importPreviewData.length === 0) return;
    importExcelData(importPreviewData);
    alert(`Đã nạp thành công ${importPreviewData.length} hồ sơ nhân khẩu vào hệ thống dữ liệu Thôn An Trạch.`);
    setImportPreviewData([]);
    setImportStatus(null);
  };

  // Member CRUD actions
  const handleOpenAddMemberModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('to_truong');
    setFormTo('Tổ 1');
    setFormStatus('active');
    setFormAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMemberModal = (user: UserProfile) => {
    setEditingMember(user);
    setFormName(user.ho_ten);
    setFormEmail(user.email);
    setFormPhone(user.so_dien_thoai || '');
    setFormRole(user.vai_tro);
    setFormTo(user.to_phu_trach);
    setFormStatus(user.trang_thai);
    setFormAvatar(user.avatar_url || '');
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    if (editingMember) {
      await updateOfficerUser(editingMember.id, {
        ho_ten: formName.trim(),
        email: formEmail.trim(),
        so_dien_thoai: formPhone.trim(),
        vai_tro: formRole,
        to_phu_trach: formTo,
        trang_thai: formStatus,
        avatar_url: formAvatar.trim() || editingMember.avatar_url,
      });
    } else {
      await addOfficerUser({
        ho_ten: formName.trim(),
        email: formEmail.trim(),
        so_dien_thoai: formPhone.trim(),
        vai_tro: formRole,
        to_phu_trach: formTo,
        trang_thai: formStatus,
        avatar_url: formAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      });
    }
    setIsMemberModalOpen(false);
  };

  const handleDeleteMember = async (user: UserProfile) => {
    if (user.id === currentUser?.id) {
      alert('Bạn không thể xóa tài khoản của chính mình đang đăng nhập.');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${user.ho_ten}" (${user.email}) khỏi hệ thống?`)) {
      await deleteOfficerUser(user.id);
    }
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(`-- SUPABASE SCHEMA COMPLETE --\n-- File: c:/Antigravity20/DataThon/supabase_schema_complete.sql\n-- Bao gom: nhan_khau, ho_khau, profiles, thong_bao, binh_luan_thong_bao, nhat_ky_thao_tac`);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  return (
    <div className="space-y-4 pb-16">
      
      {/* 1. MASTER TOP BANNER - SLEEK & HIGH CONTRAST STANDARD */}
      <PageHeaderBanner
        icon={<ShieldCheck className="w-6 h-6 text-white" />}
        iconBgClass="from-purple-600 via-indigo-600 to-slate-900 text-white shadow-purple-500/25"
        badge={{
          text: 'Quản Trị Hệ Thống & Phân Quyền RLS',
          icon: <Shield className="w-3.5 h-3.5 text-purple-300" />,
          colorClass: 'bg-purple-500/20 text-purple-200 border-purple-400/30'
        }}
        subBadge={{
          text: 'Supabase RLS Security Active',
          icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />,
          colorClass: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/25'
        }}
        title="Hệ Thống Quản Trị Cấp Cao & An Ninh Dữ Liệu"
        description="Quản lý phân quyền cán bộ, kiểm soát bảo mật Supabase RLS, xuất nhập Master Excel và quản trị không gian số hóa đa điểm GIS toàn thôn."
        theme="dark"
        actions={
          <>
            <button
              type="button"
              onClick={() => setActiveTab('excel')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>Xuất & Nhập Excel</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddMemberModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-purple-300" />
              <span>Thêm Thành Viên</span>
            </button>
          </>
        }
      />

      {/* 2. 4 SUMMARY METRIC CARDS - BALANCED & RESPONSIVE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Tổng Thành Viên */}
        <div 
          onClick={() => setActiveTab('members')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[142px] cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Tổng Thành Viên
            </span>
            <div className="w-8 h-8 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              {allProfiles.length}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Hệ thống:</span>
              <strong className="text-purple-700 font-extrabold bg-purple-50 px-1.5 py-0.2 rounded-md border border-purple-100">
                Cán bộ & Quản trị
              </strong>
            </div>
          </div>
        </div>

        {/* Card 2: Đang Hoạt Động */}
        <div 
          onClick={() => setActiveTab('members')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[142px] cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Đang Hoạt Động
            </span>
            <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              {activeUsers.length}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Quyền hạn:</span>
              <strong className="text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-100">
                Đã cấp quyền RLS
              </strong>
            </div>
          </div>
        </div>

        {/* Card 3: Ranh Giới 8 Tổ GIS */}
        <div 
          onClick={() => setActiveTab('boundaries')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[142px] cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Ranh Giới 8 Tổ GIS
            </span>
            <div className="w-8 h-8 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all">
              <MapIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight">
              {boundariesData.features.length} <span className="text-xs font-bold text-slate-500">Phân Vùng</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Tổng diện tích:</span>
              <strong className="text-sky-700 font-extrabold bg-sky-50 px-1.5 py-0.2 rounded-md border border-sky-100">
                {totalBoundaryAreaHa.toFixed(1)} Hecta
              </strong>
            </div>
          </div>
        </div>

        {/* Card 4: Chờ Phê Duyệt */}
        <div 
          onClick={() => setActiveTab('members')}
          className="bg-white rounded-3xl p-4 flex flex-col justify-between border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group min-h-[142px] cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
              Chờ Phê Duyệt
            </span>
            <div className="w-8 h-8 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {pendingUsers.length}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Trạng thái:</span>
              <strong className="text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-100">
                Đăng ký mới
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MASTER TABS SWITCHER - CLEAN PILL DOCK */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold overflow-x-auto scrollbar-none border border-slate-200/80">
        <button
          onClick={() => setActiveTab('boundaries')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'boundaries' 
              ? 'bg-white text-sky-900 shadow-sm font-black border border-slate-200/60' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-sky-600" />
          <span>Quản Trị Ranh Giới ({boundariesData.features.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'members' 
              ? 'bg-white text-purple-900 shadow-sm font-black border border-slate-200/60' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Thành Viên & Phân Quyền ({allProfiles.length})</span>
          {pendingUsers.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
              {pendingUsers.length}
            </span>
          )}
        </button>

        {/* TAB MỚI: QUẢN TRỊ XUẤT NHẬP EXCEL DÀNH RIÊNG CHO ADMIN */}
        <button
          onClick={() => setActiveTab('excel')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'excel' 
              ? 'bg-white text-emerald-900 shadow-sm font-black border border-slate-200/60' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Xuất & Nhập Master Excel</span>
        </button>

        {/* TAB MỚI: QUẢN TRỊ VÙNG SẢN XUẤT NÔNG NGHIỆP */}
        <button
          onClick={() => setActiveTab('san_xuat_zones')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'san_xuat_zones' 
              ? 'bg-white text-teal-900 shadow-sm font-black border border-slate-200/60' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wheat className="w-3.5 h-3.5 text-teal-600" />
          <span>Vùng Sản Xuất Nông Nghiệp ({xuDongList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'matrix' 
              ? 'bg-white text-indigo-900 shadow-sm font-black border border-slate-200/60' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ma Trận Quyền RLS</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'audit' 
              ? 'bg-white text-slate-900 shadow-sm font-black border border-slate-200/60' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <History className="w-3.5 h-3.5 text-slate-600" />
          <span>Nhật Ký Thao Tác ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'supabase' 
              ? 'bg-white text-emerald-900 shadow-sm font-black border border-slate-200/60' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase SQL</span>
        </button>
      </div>

      {/* ================= TAB 1: QUẢN TRỊ RANH GIỚI & TỌA ĐỘ ĐA ĐIỂM GIS ================= */}
      {activeTab === 'boundaries' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          
          {/* Header Action Bar - Unified Height & Clean Controls */}
          <div className="p-3.5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchBoundary}
                onChange={(e) => setSearchBoundary(e.target.value)}
                placeholder="Tìm tên tổ, tổ trưởng, số điện thoại..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto justify-end">
              <button
                onClick={handleOpenAddBoundaryModal}
                className="px-3.5 py-2 rounded-xl gradient-gov text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Thêm Phân Vùng Mới</span>
              </button>

              <button
                onClick={handleResetBoundaries}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Khôi phục lại ranh giới 8 tổ mặc định ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Khôi Phục 8 Tổ Gốc</span>
              </button>

              <button
                onClick={handleExportGeoJsonBackup}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Xuất file GeoJSON ranh giới"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sao Lưu GeoJSON</span>
              </button>
            </div>
          </div>

          {/* Boundaries Grid Cards - Even Heights & Structured Key-Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredBoundaries.map((feat) => {
              const props = feat.properties;
              const vertexCount = feat.geometry?.coordinates?.[0]?.length || 0;

              return (
                <div
                  key={props.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-h-[235px]"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: props.color || '#0284c7' }} />
                  
                  <div>
                    {/* Title & Area Badge */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-3.5 h-3.5 rounded-full shrink-0 border border-white shadow-xs" style={{ backgroundColor: props.color || '#0284c7' }} />
                        <h4 className="font-black text-slate-900 text-sm truncate">{props.to_dan_cu}</h4>
                      </div>
                      <span className="text-[11px] font-mono font-extrabold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-lg shrink-0">
                        {props.dien_tich_ha} ha
                      </span>
                    </div>

                    {/* Structured Key-Value Table */}
                    <div className="mt-2.5 space-y-1.5 text-xs text-slate-600">
                      <div className="grid grid-cols-[68px_1fr] gap-1 items-center">
                        <span className="text-slate-400 font-medium text-[11px]">Tổ trưởng:</span>
                        <strong className="text-slate-900 font-bold truncate block" title={props.to_truong}>
                          {props.to_truong}
                        </strong>
                      </div>

                      <div className="grid grid-cols-[68px_1fr] gap-1 items-center">
                        <span className="text-slate-400 font-medium text-[11px]">Điện thoại:</span>
                        {props.so_dien_thoai ? (
                          <a href={`tel:${props.so_dien_thoai}`} className="text-sky-700 font-bold hover:underline truncate block">
                            {props.so_dien_thoai}
                          </a>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Chưa có SĐT</span>
                        )}
                      </div>

                      <div className="grid grid-cols-[68px_1fr] gap-1 items-center">
                        <span className="text-slate-400 font-medium text-[11px]">Tọa độ:</span>
                        <div>
                          <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 text-[10px]">
                            {vertexCount} Điểm Đỉnh
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 min-h-[42px] flex items-center">
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {props.mo_ta || 'Phân vùng quản trị dân cư cơ sở Thôn An Trạch.'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - Clean & No Line Breaks */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5 mt-3">
                    <button
                      onClick={() => handleOpenEditBoundaryModal(feat)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all whitespace-nowrap"
                    >
                      <Sliders className="w-3.5 h-3.5 text-sky-400" />
                      <span>Sửa Ranh Giới</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBoundaryFromAdmin(feat)}
                      className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                      title="Xóa phân vùng này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MEMBERS MANAGEMENT ================= */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {pendingUsers.length > 0 && (
            <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Có {pendingUsers.length} tài khoản cán bộ mới đang chờ bạn xét duyệt kích hoạt:</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="p-3.5 rounded-2xl bg-white border border-amber-200 flex flex-col justify-between space-y-3 shadow-2xs">
                    <div className="flex items-start gap-3">
                      <img src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs">{user.ho_ten}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{user.email} • {user.so_dien_thoai}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] px-2 py-0.2 rounded-md border ${roleMeta[user.vai_tro].badge}`}>
                            {roleMeta[user.vai_tro].label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold">
                            {user.to_phu_trach}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => updateUserStatus(user.id, 'blocked')}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                      >
                        Từ Chối
                      </button>
                      <button
                        onClick={() => updateUserStatus(user.id, 'active')}
                        className="px-4 py-1.5 rounded-xl gradient-gov text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Phê Duyệt Ngay</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Tìm tên cán bộ, email, số điện thoại..."
                className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-purple-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
              >
                <option value="ALL">Tất cả vai trò</option>
                {Object.entries(roleMeta).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="pending_approval">Chờ phê duyệt</option>
                <option value="blocked">Đã khóa</option>
              </select>

              <select
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
              >
                <option value="ALL">Tất cả tổ</option>
                <option value="Toàn thôn">Toàn thôn</option>
                {['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Cán Bộ / Thành Viên</th>
                    <th className="py-3 px-4">Vai Trò & Phân Quyền</th>
                    <th className="py-3 px-4">Địa Bàn Phụ Trách</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredMembers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                          <div>
                            <span className="font-black text-slate-900 block text-xs">{user.ho_ten}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2.5 py-1 rounded-md border font-extrabold inline-block ${roleMeta[user.vai_tro].badge}`}>
                          {roleMeta[user.vai_tro].label}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-800">
                        {user.to_phu_trach}
                      </td>

                      <td className="py-3 px-4">
                        {user.trang_thai === 'active' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        )}
                        {user.trang_thai === 'pending_approval' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Chờ duyệt
                          </span>
                        )}
                        {user.trang_thai === 'blocked' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Đã khóa
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditMemberModal(user)}
                            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
                            title="Chỉnh sửa phân quyền"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(user)}
                            className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Xóa thành viên"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3 [MỚI]: QUẢN TRỊ XUẤT & NHẬP MASTER EXCEL (ADMIN ONLY) ================= */}
      {activeTab === 'excel' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Top Banner KPI Excel */}
          <div className="p-5 rounded-3xl bg-emerald-950 text-white border border-emerald-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0 border border-emerald-400/30">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-black text-white text-base sm:text-lg">
                  Trung Tâm Xuất & Nhập Dữ Liệu Master Excel (Admin Suite)
                </h3>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Đồng bộ hai chiều dữ liệu 2.308 cư dân và 614 hộ khẩu theo chuẩn Nghị định 30 & CSDL Quốc Gia.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownloadExcelTemplate}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Tải tệp biểu mẫu Excel chuẩn để thu thập dữ liệu"
              >
                <FileText className="w-4 h-4 text-emerald-300" />
                <span>Tải Mẫu Excel Chuẩn</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Col: Master Export Actions (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-black text-slate-900 text-sm">Xuất Dữ Liệu Ra File Excel (.xlsx)</h4>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Sẵn sàng tải xuống
                </span>
              </div>

              <div className="space-y-3">
                {/* Export 1: Master Nhân Khẩu */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-3">
                  <div>
                    <span className="font-black text-slate-900 text-xs block">
                      Danh Bạ Master Nhân Khẩu ({nhanKhauList.length.toLocaleString('vi-VN')} Cư Dân)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Đầy đủ 25 trường dữ liệu định danh, BHYT, CCCD, quan hệ chủ hộ và tổ dân cư.
                    </p>
                  </div>
                  <button
                    onClick={handleExportMasterNhanKhau}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Excel</span>
                  </button>
                </div>

                {/* Export 2: Master Hộ Khẩu */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-center justify-between gap-3">
                  <div>
                    <span className="font-black text-slate-900 text-xs block">
                      Danh Sách Sổ Hộ Khẩu ({hoKhauList.length} Hộ Gia Đình)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Mã hộ, chủ hộ, địa chỉ, số thành viên, diện tích khuôn viên đất & tọa độ GPS.
                    </p>
                  </div>
                  <button
                    onClick={handleExportMasterHoKhau}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Excel</span>
                  </button>
                </div>

                {/* Export 3: GeoJSON Ranh Giới 8 Tổ */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex items-center justify-between gap-3">
                  <div>
                    <span className="font-black text-slate-900 text-xs block">
                      Cơ Sở Dữ Liệu Ranh Giới 8 Tổ GIS ({boundariesData.features.length} Phân Vùng)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Định dạng chuẩn GeoJSON WGS84 cho phần mềm QGIS, ArcGIS và Supabase PostGIS.
                    </p>
                  </div>
                  <button
                    onClick={handleExportGeoJsonBackup}
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>Tải GeoJSON</span>
                  </button>
                </div>

                {/* Export 4: Sổ Bộ Sản Xuất Nông Nghiệp 647 Thửa */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 hover:border-emerald-300 hover:bg-emerald-50 transition-all flex items-center justify-between gap-3">
                  <div>
                    <span className="font-black text-slate-900 text-xs block">
                      Sổ Bộ Sản Xuất & Mùa Vụ Nông Nghiệp (647 Thửa • 43,86 ha • 5 Xứ Đồng)
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Đầy đủ thông tin chủ đất, hộ cấy, diện tích m², giống cấp kg, liên kết 2.308 cư dân.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const rows = sanXuatList.map((r: SanXuatRecord, idx: number) => ({
                        'STT': idx + 1,
                        'Xứ Đồng': r.xu_dong || 'Tổ 9',
                        'Lô / Thửa Đất': r.lo_thua_dat,
                        'Chủ Đất (QSDĐ)': r.chu_dat,
                        'Hộ Canh Tác': r.ho_san_xuat,
                        'Hiện Trạng': r.la_chinh_chu !== false ? 'Chính chủ' : 'Thuê/Mượn',
                        'Giống Lúa': r.giong_lua,
                        'Diện Tích (m2)': r.dien_tich_m2,
                        'Giống Cấp (kg)': r.giong_cap_kg,
                        'Mua Thêm (kg)': r.mua_them_kg || 0,
                        'Đơn Giá (đ)': r.don_gia || 0,
                        'Thành Tiền (đ)': r.thanh_tien || 0,
                        'Ký Nhận HTX': r.ky_nhan || 'Đã nhận giống',
                        'Tổ Dân Cư': r.to_dan_cu || 'Tổ 1',
                      }));
                      const ws = XLSX.utils.json_to_sheet(rows);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, 'SoBo_SanXuat');
                      XLSX.writeFile(wb, 'SoBo_SanXuat_NongNghiep_AnTrach_Master.xlsx');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Xuất Sổ Bộ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Smart Import Engine (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <h4 className="font-black text-slate-900 text-sm">Nhập & Đồng Bộ File Excel Vào Hệ Thống</h4>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                    Smart Parser
                  </span>
                </div>

                {/* Upload Drag-Drop Box */}
                <div className="mt-3">
                  <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-3xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/60 hover:bg-purple-50/30 group">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <span className="font-extrabold text-slate-900 text-xs">
                      Nhấp để chọn hoặc kéo thả tệp Excel vào đây
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      Hỗ trợ định dạng .xlsx, .xls (Tối đa 50.000 dòng dữ liệu)
                    </span>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUploadExcel}
                      disabled={isImporting}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Status Message */}
                {importStatus && (
                  <div className={`mt-3 p-3 rounded-2xl text-xs font-bold ${
                    importStatus.includes('thành công') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    importStatus.includes('Lỗi') ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                    'bg-sky-50 text-sky-800 border border-sky-200'
                  }`}>
                    {importStatus}
                  </div>
                )}

                {/* Preview Table If Loaded */}
                {importPreviewData.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Xem trước 3 dòng đầu ({importPreviewData.length} bản ghi hợp lệ):</span>
                    </div>

                    <div className="rounded-xl border border-slate-200 overflow-x-auto max-h-36">
                      <table className="w-full text-left text-[10px]">
                        <thead className="bg-slate-50 text-slate-500 font-black">
                          <tr>
                            <th className="p-1.5">Mã Hộ</th>
                            <th className="p-1.5">Họ Tên</th>
                            <th className="p-1.5">CCCD</th>
                            <th className="p-1.5">Tổ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {importPreviewData.slice(0, 3).map((r, i) => (
                            <tr key={i}>
                              <td className="p-1.5">{r.ma_ho}</td>
                              <td className="p-1.5 font-sans font-bold">{r.ho_ten}</td>
                              <td className="p-1.5">{r.so_cmnd_cccd || '—'}</td>
                              <td className="p-1.5">{r.to_dan_cu}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Import Button */}
              {importPreviewData.length > 0 && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleConfirmImport}
                    className="px-5 py-2.5 rounded-xl gradient-gov text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Xác Nhận Nạp {importPreviewData.length} Bản Ghi Vào CSDL</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3.5: QUẢN TRỊ VÙNG SẢN XUẤT NÔNG NGHIỆP ================= */}
      {activeTab === 'san_xuat_zones' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Action Toolbar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchXuDong}
                onChange={(e) => setSearchXuDong(e.target.value)}
                placeholder="Tìm tên xứ đồng, giống lúa, tổ quản lý..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap w-full md:w-auto justify-end">
              <button
                onClick={handleOpenAddXuDongModal}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Vùng Sản Xuất</span>
              </button>

              <button
                onClick={handleOpenAddZoneSpatial}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Mở bản đồ vệ tinh để vẽ tọa độ đa điểm xứ đồng mới"
              >
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Vẽ Đa Điểm GIS</span>
              </button>

              <button
                onClick={handleResetXuDongFromAdmin}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Khôi phục lại danh sách 5 xứ đồng mặc định ban đầu"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Khôi Phục 5 Xứ Đồng Gốc</span>
              </button>
            </div>
          </div>

          {/* Zones Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Tổng Vùng Sản Xuất</span>
                <span className="text-2xl font-black text-slate-900">{xuDongList.length} Xứ Đồng</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Tổng Diện Tích Canh Tác</span>
                <span className="text-2xl font-black text-emerald-700">
                  {(xuDongList.reduce((s, z) => s + (z.dien_tich_m2 || 0), 0) / 10000).toFixed(2)} ha
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                <Wheat className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Quy Mô Thửa Ruộng</span>
                <span className="text-2xl font-black text-sky-700">
                  {xuDongList.reduce((s, z) => s + (z.so_thua || 0), 0)} Thửa
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Thủy Nông Sông Yên</span>
                <span className="text-2xl font-black text-blue-700">2 Trạm Bơm</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Zones Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {xuDongList
              .filter((z) => {
                if (!searchXuDong.trim()) return true;
                const q = searchXuDong.toLowerCase().trim();
                return (
                  z.ten_xu_dong.toLowerCase().includes(q) ||
                  z.giong_chinh.toLowerCase().includes(q) ||
                  z.to_quan_ly.toLowerCase().includes(q) ||
                  z.nguon_nuoc.toLowerCase().includes(q)
                );
              })
              .map((zone) => {
                const totalM2All = xuDongList.reduce((s, z) => s + (z.dien_tich_m2 || 0), 0) || 1;
                const percent = ((zone.dien_tich_m2 / totalM2All) * 100).toFixed(1);

                return (
                  <div
                    key={zone.ma_xu_dong}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group space-y-4"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: zone.mau_sac || '#10b981' }} />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{zone.ma_xu_dong}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                            style={{ backgroundColor: zone.mau_sac || '#10b981' }}
                          >
                            {(zone.dien_tich_m2 / 10000).toFixed(2)} ha
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                          {zone.ten_xu_dong}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{zone.vi_tri}</p>
                      </div>

                      {/* Detail Key-Values */}
                      <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Diện tích mặt ruộng:</span>
                          <strong className="text-slate-900 font-mono font-extrabold">{zone.dien_tich_m2.toLocaleString()} m² ({percent}%)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Quy mô thửa ruộng:</span>
                          <strong className="text-slate-800 font-bold">{zone.so_thua} thửa ({zone.cac_lo})</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Giống lúa cơ cấu:</span>
                          <strong className="text-emerald-700 font-extrabold">{zone.giong_chinh}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Nguồn cấp nước:</span>
                          <strong className="text-sky-700 font-bold">{zone.nguon_nuoc}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Tổ quản lý:</span>
                          <strong className="text-slate-800 font-bold">{zone.to_quan_ly}</strong>
                        </div>
                      </div>

                      {/* Progress Area Percentage */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span>Tỷ trọng diện tích toàn thôn</span>
                          <span className="text-slate-700">{percent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%`, backgroundColor: zone.mau_sac || '#10b981' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                      <button
                        onClick={() => handleOpenEditZoneSpatial(zone)}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Xem và chỉnh sửa các đỉnh tọa độ polygon đa điểm trên bản đồ vệ tinh"
                      >
                        <Compass className="w-3.5 h-3.5 text-teal-600" />
                        <span>Tọa Độ GIS</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditXuDongModal(zone)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-sky-700 font-bold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>

                      <button
                        onClick={() => handleDeleteXuDongFromAdmin(zone)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-rose-700 font-bold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}

      {/* ================= TAB 4: MA TRẬN PHÂN QUYỀN RLS ================= */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div>
            <h3 className="font-black text-slate-900 text-sm">Bảng Ma Trận Phân Quyền Chi Tiết (Role-Based Access Control)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quy định thẩm quyền cụ thể của từng vị trí cán bộ trong ban thôn An Trạch.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Chức Năng Nghiệp Vụ</th>
                  <th className="py-3 px-2 text-center text-purple-700">Super Admin</th>
                  <th className="py-3 px-2 text-center text-indigo-700">Quản Trị</th>
                  <th className="py-3 px-2 text-center text-emerald-700">Trưởng Thôn</th>
                  <th className="py-3 px-2 text-center text-sky-700">Tổ Trưởng</th>
                  <th className="py-3 px-2 text-center text-rose-700">Y Tế</th>
                  <th className="py-3 px-2 text-center text-amber-700">Công An</th>
                  <th className="py-3 px-2 text-center text-teal-700">Cán Bộ Xã</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {PERMISSION_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.feature}</td>
                    {['super_admin', 'admin', 'truong_thon', 'to_truong', 'can_bo_y_te', 'cong_an_vien', 'can_bo_xa'].map((col) => {
                      const val = (row as any)[col];
                      return (
                        <td key={col} className="py-3 px-2 text-center">
                          {val === true ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 inline-flex items-center justify-center font-black mx-auto">
                              ✓
                            </span>
                          ) : val === false ? (
                            <span className="text-slate-300 font-bold">—</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold inline-block">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                placeholder="Tìm người thao tác, hành động, bảng dữ liệu..."
                className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
              >
                <option value="ALL">Tất cả hành động</option>
                <option value="INSERT">INSERT (Thêm mới)</option>
                <option value="UPDATE">UPDATE (Chỉnh sửa)</option>
                <option value="DELETE">DELETE (Xóa bỏ)</option>
                <option value="APPROVE_USER">APPROVE (Phê duyệt)</option>
                <option value="IMPORT_EXCEL">IMPORT_EXCEL (Nhập file)</option>
                <option value="EXPORT_EXCEL">EXPORT_EXCEL (Xuất file)</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Thời Gian</th>
                    <th className="py-3 px-4">Cán Bộ Thực Hiện</th>
                    <th className="py-3 px-4">Hành Động</th>
                    <th className="py-3 px-4">Bảng Dữ Liệu</th>
                    <th className="py-3 px-4">Chi Tiết Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">
                        {log.user_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          log.hanh_dong === 'INSERT' ? 'bg-emerald-100 text-emerald-800' :
                          log.hanh_dong === 'DELETE' ? 'bg-rose-100 text-rose-800' :
                          log.hanh_dong === 'APPROVE_USER' ? 'bg-purple-100 text-purple-800' :
                          log.hanh_dong === 'IMPORT_EXCEL' ? 'bg-teal-100 text-teal-800' :
                          log.hanh_dong === 'EXPORT_EXCEL' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-sky-100 text-sky-800'
                        }`}>
                          {log.hanh_dong}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-purple-700 font-bold">
                        {log.bang_du_lieu}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-800">
                        {log.mo_ta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: SUPABASE SQL ================= */}
      {activeTab === 'supabase' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Cơ Sở Dữ Liệu Supabase & RLS Policies</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tệp SQL định nghĩa schema hoàn chỉnh, kích hoạt Row Level Security bảo mật cấp cao.</p>
            </div>
            <button
              onClick={handleCopySQL}
              className="px-3.5 py-2 rounded-xl gradient-gov text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {copiedSQL ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSQL ? 'Đã Sao Chép SQL' : 'Sao Chép SQL'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
            <pre>{`-- =========================================================================
-- SUPABASE POSTGRESQL SCHEMA COMPLETE FOR AN TRACH SMART VILLAGE GIS
-- =========================================================================

-- 1. BẢNG HỘ KHẨU (ho_khau)
CREATE TABLE IF NOT EXISTS public.ho_khau (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_ho VARCHAR(50) UNIQUE NOT NULL,
  ten_chu_ho VARCHAR(255) NOT NULL,
  to_dan_cu VARCHAR(100) NOT NULL,
  dia_chi TEXT NOT NULL,
  so_dien_thoai VARCHAR(20),
  loai_ho VARCHAR(50) DEFAULT 'chuan',
  dien_tich_dat_m2 NUMERIC DEFAULT 120,
  polygon_thua_dat JSONB,
  lat NUMERIC DEFAULT 15.9620,
  lng NUMERIC DEFAULT 108.1965,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. BẢNG NHÂN KHẨU (nhan_khau)
CREATE TABLE IF NOT EXISTS public.nhan_khau (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ma_ho VARCHAR(50) REFERENCES public.ho_khau(ma_ho) ON DELETE CASCADE,
  ho_ten VARCHAR(255) NOT NULL,
  quan_he_chu_ho VARCHAR(100) NOT NULL,
  nam_sinh INT,
  gioi_tinh VARCHAR(20),
  so_cmnd_cccd VARCHAR(50),
  ma_the_bhyt VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. KÍCH HOẠT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.ho_khau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nhan_khau ENABLE ROW LEVEL SECURITY;`}</pre>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD & EDIT MEMBER ================= */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-wide">Quản trị cán bộ</span>
                <h3 className="font-black text-white text-base">
                  {editingMember ? `Cập Nhật: ${editingMember.ho_ten}` : 'Tạo Tài Khoản Cán Bộ Mới'}
                </h3>
              </div>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và tên cán bộ *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="VD: Trần Văn Cán Bộ..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-900 text-xs focus:bg-white focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email đăng nhập *</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="canbo@antrach.gov.vn"
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0905..."
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vai trò & Phân quyền RLS *</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800 text-xs"
                  >
                    {Object.entries(roleMeta).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa bàn / Tổ phụ trách *</label>
                  <select
                    value={formTo}
                    onChange={(e) => setFormTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800 text-xs"
                  >
                    <option value="Toàn thôn">Toàn thôn An Trạch</option>
                    {['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trạng thái tài khoản</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as UserStatus)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800 text-xs"
                >
                  <option value="active">🟢 Đang hoạt động (Active - Được cấp quyền)</option>
                  <option value="pending_approval">🟡 Chờ phê duyệt (Pending Approval)</option>
                  <option value="blocked">🔴 Khóa tài khoản (Blocked - Chặn truy cập)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ảnh đại diện (Avatar URL)</label>
                <input
                  type="text"
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:bg-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl gradient-gov text-white font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMember ? 'Lưu Phân Quyền' : 'Tạo Thành Viên Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MULTI-POINT BOUNDARY SPATIAL SUITE ================= */}
      {isBoundaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-indigo-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center font-bold">
                  <MapIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide">
                    Hệ Thống Tọa Độ Đa Điểm GIS • Boundary Polygon Manager
                  </span>
                  <h3 className="font-black text-white text-base">
                    {editingBoundary ? `Cập Nhật: ${editingBoundary.properties.to_dan_cu}` : 'Khởi Tạo Phân Vùng Mới'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsBoundaryModalOpen(false)}
                className="p-1.5 rounded-full text-indigo-200 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <form onSubmit={handleSaveBoundaryModal} className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 text-xs">
              
              {/* Row 1: Basic Boundary Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Tổ / Phân vùng *</label>
                  <input
                    type="text"
                    value={bFormName}
                    onChange={(e) => setBFormName(e.target.value)}
                    placeholder="VD: Tổ 1..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 text-xs focus:outline-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổ trưởng / Phụ trách</label>
                  <input
                    type="text"
                    value={bFormToTruong}
                    onChange={(e) => setBFormToTruong(e.target.value)}
                    placeholder="Họ tên tổ trưởng..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 text-xs focus:outline-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    value={bFormPhone}
                    onChange={(e) => setBFormPhone(e.target.value)}
                    placeholder="0905 xxx xxx"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-900 text-xs focus:outline-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Mô tả đặc thù phân vùng</label>
                  <input
                    type="text"
                    value={bFormMoTa}
                    onChange={(e) => setBFormMoTa(e.target.value)}
                    placeholder="Khu dân cư nông nghiệp, ven sông Yên, giáp ranh..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-medium text-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Màu sắc hiển thị</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bFormColor}
                      onChange={(e) => setBFormColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-200 p-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bFormColor}
                      onChange={(e) => setBFormColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Multi-Point Coordinate Toolset & Live Mini Map Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left: Coordinate Points Table (7 Cols) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                        <Pentagon className="w-4 h-4 text-purple-600" />
                        <span>Danh Sách {bFormPoints.length} Điểm Tọa Độ Đỉnh WGS84</span>
                      </h4>
                      <span className="text-[10px] text-slate-500">Kéo các đỉnh trên Mini Map hoặc thêm điểm dưới đây</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleCaptureDeviceGPS}
                        disabled={isGpsLoading}
                        className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-extrabold text-[11px] flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                        title="Tự động lấy tọa độ GPS từ thiết bị hiện tại"
                      >
                        <Crosshair className={`w-3.5 h-3.5 text-sky-600 ${isGpsLoading ? 'animate-spin' : ''}`} />
                        <span>{isGpsLoading ? 'Đang lấy GPS...' : 'Lấy Tọa Độ GPS'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowBulkInput(!showBulkInput)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>Nhập Hàng Loạt</span>
                      </button>
                    </div>
                  </div>

                  {gpsStatusMsg && (
                    <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-[11px] font-bold text-sky-800 animate-in fade-in">
                      {gpsStatusMsg}
                    </div>
                  )}

                  {showBulkInput && (
                    <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-950 text-[11px]">Dán danh sách tọa độ (Lat, Lng hoặc JSON GeoJSON):</span>
                        <button
                          type="button"
                          onClick={() => setShowBulkInput(false)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        value={bulkCoordsText}
                        onChange={(e) => setBulkCoordsText(e.target.value)}
                        placeholder={`15.9621, 108.1965\n15.9630, 108.1970\n15.9615, 108.1980\n...`}
                        rows={3}
                        className="w-full p-2 rounded-xl bg-white border border-purple-200 font-mono text-[11px] text-slate-800"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleParseBulkCoordinates}
                          className="px-3 py-1 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs cursor-pointer"
                        >
                          Xác Nhận Nạp Đa Điểm
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual Single Point Input */}
                  <div className="p-2 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-1.5 flex-wrap">
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="number"
                        step="0.000001"
                        value={newPointLat}
                        onChange={(e) => setNewPointLat(e.target.value)}
                        placeholder="Vĩ độ (Lat: 15.96...)"
                        className="w-full px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="number"
                        step="0.000001"
                        value={newPointLng}
                        onChange={(e) => setNewPointLng(e.target.value)}
                        placeholder="Kinh độ (Lng: 108.19...)"
                        className="w-full px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddManualPoint}
                      className="px-3 py-1 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 shrink-0 cursor-pointer"
                    >
                      + Thêm Điểm
                    </button>
                  </div>

                  {/* Vertices List Table */}
                  <div className="rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-500">
                        <tr>
                          <th className="py-2 px-3">Điểm Đỉnh</th>
                          <th className="py-2 px-3">Vĩ Độ (Latitude)</th>
                          <th className="py-2 px-3">Kinh Độ (Longitude)</th>
                          <th className="py-2 px-3 text-right">Xóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                        {bFormPoints.map((pt, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-sans font-bold text-slate-800">
                              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 inline-flex items-center justify-center font-bold text-[10px] mr-1.5">
                                {idx + 1}
                              </span>
                              Đỉnh {idx + 1}
                            </td>
                            <td className="py-1.5 px-3 text-slate-700">{pt[1].toFixed(6)}</td>
                            <td className="py-1.5 px-3 text-slate-700">{pt[0].toFixed(6)}</td>
                            <td className="py-1.5 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeletePoint(idx)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Xóa điểm này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Live Interactive Mini Map Preview (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bản Đồ Vệ Tinh Trực Quan</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      Nhấp bản đồ để thêm điểm
                    </span>
                  </div>

                  <div 
                    ref={miniMapContainerRef} 
                    className="w-full h-64 sm:h-72 rounded-2xl border border-slate-300 shadow-inner overflow-hidden relative z-0" 
                  />
                  
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Diện tích ước tính:</span>
                    <strong className="text-emerald-700 font-extrabold text-xs">
                      {(calculatePolygonAreaM2(bFormPoints) / 10000).toFixed(2)} Hecta ({calculatePolygonAreaM2(bFormPoints).toLocaleString('vi-VN')} m²)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100 mt-1">
                <button
                  type="button"
                  onClick={() => setIsBoundaryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gradient-gov text-white font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBoundary ? 'Lưu Phân Vùng & Tọa Độ Đa Điểm' : 'Tạo Phân Vùng Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM / SỬA VÙNG SẢN XUẤT NÔNG NGHIỆP ================= */}
      {isXuDongModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700">
                  <Wheat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingXuDong ? `Chỉnh Sửa Vùng Sản Xuất: ${editingXuDong.ten_xu_dong}` : 'Thêm Mới Vùng Sản Xuất Nông Nghiệp'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý thông tin xứ đồng, diện tích mặt ruộng, cơ cấu giống và nguồn cấp nước.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsXuDongModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveXuDong} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Mã Xứ Đồng */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã Vùng Sản Xuất <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingXuDong}
                    value={xdFormMa}
                    onChange={(e) => setXdFormMa(e.target.value)}
                    placeholder="VD: XD-TO9, XD-HARA..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-teal-600 disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                {/* Tên Xứ Đồng */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên Xứ Đồng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={xdFormTen}
                    onChange={(e) => setXdFormTen(e.target.value)}
                    placeholder="VD: Xứ Đồng Cánh Bắc..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-teal-600"
                  />
                </div>

                {/* Diện Tích (m2) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Diện Tích Mặt Ruộng (m²) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={xdFormDienTichM2}
                    onChange={(e) => setXdFormDienTichM2(Number(e.target.value))}
                    placeholder="VD: 50000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-teal-600"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Tương đương: <strong className="text-teal-700">{(xdFormDienTichM2 / 10000).toFixed(2)} Hecta</strong>
                  </span>
                </div>

                {/* Số Thửa */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quy Mô (Số Thửa Ruộng)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={xdFormSoThua}
                    onChange={(e) => setXdFormSoThua(Number(e.target.value))}
                    placeholder="VD: 50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-teal-600"
                  />
                </div>

                {/* Vị Trí / Địa Bàn */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vị Trí Địa Lý / Mô Tả Phạm Vi
                  </label>
                  <input
                    type="text"
                    value={xdFormViTri}
                    onChange={(e) => setXdFormViTri(e.target.value)}
                    placeholder="VD: Phía Tây giáp Đập dâng Sông Yên, phía Nam giáp đường liên thôn..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-teal-600"
                  />
                </div>

                {/* Các Lô / Thửa Chính */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ký Hiệu Lô / Thửa Đất
                  </label>
                  <input
                    type="text"
                    value={xdFormCacLo}
                    onChange={(e) => setXdFormCacLo(e.target.value)}
                    placeholder="VD: Lô 1 đến Lô 10..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-teal-600"
                  />
                </div>

                {/* Giống Lúa Cơ Cấu */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giống Lúa Cơ Cấu Chủ Đạo
                  </label>
                  <input
                    type="text"
                    value={xdFormGiongChinh}
                    onChange={(e) => setXdFormGiongChinh(e.target.value)}
                    placeholder="VD: HG12, HG244, J02..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-teal-600"
                  />
                </div>

                {/* Nguồn Nước */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nguồn Cấp Nước Thủy Nông
                  </label>
                  <input
                    type="text"
                    value={xdFormNguonNuoc}
                    onChange={(e) => setXdFormNguonNuoc(e.target.value)}
                    placeholder="VD: Trạm Bơm An Trạch 1 / Đập dâng Sông Yên..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-teal-600"
                  />
                </div>

                {/* Tổ Quản Lý */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tổ Quản Lý Phụ Trách
                  </label>
                  <input
                    type="text"
                    value={xdFormToQuanLy}
                    onChange={(e) => setXdFormToQuanLy(e.target.value)}
                    placeholder="VD: Tổ 1 & Tổ 2, Tổ Thủy Nông 1..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-teal-600"
                  />
                </div>

                {/* Màu Sắc Nhận Diện */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Màu Sắc Nhận Diện Trên Bản Đồ
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={xdFormMauSac}
                      onChange={(e) => setXdFormMauSac(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={xdFormMauSac}
                      onChange={(e) => setXdFormMauSac(e.target.value)}
                      placeholder="#10b981"
                      className="w-32 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                    />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['#10b981', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#3b82f6', '#84cc16', '#6366f1'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setXdFormMauSac(c)}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-xs hover:scale-110 transition-transform cursor-pointer"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsXuDongModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer text-xs"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingXuDong ? 'Lưu Cập Nhật Vùng Sản Xuất' : 'Tạo Vùng Sản Xuất Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL BIÊN TẬP TỌA ĐỘ ĐA ĐIỂM GIS XỨ ĐỒNG ================= */}
      <AgriSpatialEditorModal
        isOpen={isAgriSpatialModalOpen}
        onClose={() => setIsAgriSpatialModalOpen(false)}
        mode="zone"
        editingFeature={editingAgriSpatialFeature}
      />
    </div>
  );
};
