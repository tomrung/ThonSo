import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Map as MapIcon, 
  Satellite, 
  Layers, 
  Search, 
  Crosshair, 
  Maximize2, 
  Minimize2,
  Download, 
  Upload, 
  Plus, 
  MapPin, 
  User, 
  Users, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Navigation, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Compass, 
  Sliders, 
  FileSpreadsheet,
  Droplets,
  Wheat,
  Scale,
  Building2,
  Handshake,
  RotateCcw,
  Check,
  Filter,
  Info,
  Box,
  Globe,
  FileDown,
  Edit3,
  Trash2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { PageHeaderBanner } from '../components/PageHeaderBanner';
import { SanXuatRecord, NhanKhau } from '../types';
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
import { SanXuatGeo3DViewer } from '../components/SanXuatGeo3DViewer';
import { AgriSpatialEditorModal } from '../components/AgriSpatialEditorModal';
import { normalizeXuDong } from './NongNghiepPage';

interface BanDoSanXuatPageProps {
  onSelectResident?: (resident: NhanKhau) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const BanDoSanXuatPage: React.FC<BanDoSanXuatPageProps> = ({
  onSelectResident,
  onNavigateToTab,
}) => {
  const { 
    sanXuatList, 
    nhanKhauList, 
    hoKhauList, 
    xuDongList,
    agriZonesGeoJson,
    agriParcelsGeoJson,
    agriCanalsGeoJson,
    agriPointsGeoJson,
    deleteAgriZoneFeature,
    deleteAgriParcelFeature,
    exportAgriGeoJsonBackup,
    restoreAgriGeoJson,
    resetAgriGeoJsonToDefault
  } = useData();
  const { isAdmin } = useAuth();

  // Mode: 2D Leaflet GIS vs 3D Spatial Geo3D
  const [viewMode, setViewMode] = useState<'2d_gis' | '3d_geo'>('2d_gis');

  // Multi-point Spatial Editor Modal state
  const [isSpatialModalOpen, setIsSpatialModalOpen] = useState(false);
  const [spatialModalMode, setSpatialModalMode] = useState<'zone' | 'parcel'>('zone');
  const [editingSpatialFeature, setEditingSpatialFeature] = useState<XuDongGeoFeature | ParcelGeoFeature | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<{
    zones?: L.GeoJSON;
    parcels?: L.GeoJSON;
    canals?: L.GeoJSON;
    points?: L.GeoJSON;
  }>({});

  // Map Basemap Tile Layer
  const [baseMapType, setBaseMapType] = useState<'google_satellite' | 'osm' | 'esri_imagery'>('google_satellite');

  // Layer Visibility Toggles
  const [showZones, setShowZones] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [showCanals, setShowCanals] = useState(true);
  const [showPumps, setShowPumps] = useState(true);

  // Styling & Color Modes
  const [colorBy, setColorBy] = useState<'variety' | 'ownership' | 'zone'>('variety');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedXuDong, setSelectedXuDong] = useState<string>('ALL');
  const [selectedVariety, setSelectedVariety] = useState<string>('ALL');
  const [selectedOwnership, setSelectedOwnership] = useState<string>('ALL'); // 'ALL' | 'CHINH_CHU' | 'THUE_MUON'

  // Selected Parcel for Inspector Drawer
  const [selectedParcel, setSelectedParcel] = useState<SanXuatRecord | null>(null);
  const [hoveredParcel, setHoveredParcel] = useState<SanXuatRecord | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Summary Metrics
  const totalAreaM2 = useMemo(() => {
    return (sanXuatList || []).reduce((sum, r) => sum + (Number(r?.dien_tich_m2) || 0), 0);
  }, [sanXuatList]);

  // Center Coordinates of An Trạch Village
  const AN_TRACH_CENTER: [number, number] = [15.9620, 108.1965];

  // Helper for Parcel Colors
  const getParcelStyle = (feature: any) => {
    const p = feature.properties;
    let fill = '#10b981';

    if (colorBy === 'variety') {
      if (p.giong_lua === 'HG12') fill = '#10b981'; // Green
      else if (p.giong_lua === 'HG244') fill = '#f59e0b'; // Amber
      else fill = '#a855f7'; // Purple (J02)
    } else if (colorBy === 'ownership') {
      fill = p.la_chinh_chu ? '#10b981' : '#f97316';
    } else if (colorBy === 'zone') {
      const norm = normalizeXuDong(p.xu_dong);
      if (norm === 'Tổ 9') fill = '#10b981';
      else if (norm === 'Hà Ra') fill = '#f59e0b';
      else if (norm === 'La Châu') fill = '#a855f7';
      else if (norm === 'La Bông Tây') fill = '#06b6d4';
      else fill = '#ec4899';
    }

    const isSelected = selectedParcel?.id === p.id;

    return {
      fillColor: fill,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#ffffff' : '#0f172a80',
      fillOpacity: isSelected ? 0.9 : 0.65,
    };
  };

  // Initialize Leaflet 2D Map
  useEffect(() => {
    if (viewMode !== '2d_gis' || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: AN_TRACH_CENTER,
      zoom: 16,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Basemaps Tile Layers
    const baseLayers: Record<string, L.TileLayer> = {
      google_satellite: L.tileLayer(
        'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        { maxZoom: 20, attribution: 'Google Hybrid Satellite' }
      ),
      osm: L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, attribution: '© OpenStreetMap' }
      ),
      esri_imagery: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Esri World Imagery' }
      ),
    };

    baseLayers[baseMapType]?.addTo(map);

    // 1. Add 5 Xứ Đồng Layer
    if (showZones) {
      const zonesLayer = L.geoJSON(agriZonesGeoJson as any, {
        style: (feature: any) => ({
          color: feature.properties.color,
          weight: 2.5,
          opacity: 0.9,
          fillColor: feature.properties.fillColor,
          fillOpacity: 0.15,
          dashArray: '6, 6',
        }),
        onEachFeature: (feature: any, layer: L.Layer) => {
          const p = feature.properties;
          layer.bindTooltip(
            `<strong>${p.ten_xu_dong}</strong><br/>${p.dien_tich_ha} ha • ${p.so_thua} thửa`,
            { permanent: true, direction: 'center', className: 'xu-dong-map-label' }
          );
        },
      }).addTo(map);
      layersGroupRef.current.zones = zonesLayer;
    }

    // 2. Add 647 Parcels Layer
    if (showParcels) {
      const parcelsLayer = L.geoJSON(agriParcelsGeoJson as any, {
        filter: (feature: any) => {
          const p = feature.properties;
          if (selectedXuDong !== 'ALL' && normalizeXuDong(p.xu_dong) !== normalizeXuDong(selectedXuDong)) return false;
          if (selectedVariety !== 'ALL' && p.giong_lua !== selectedVariety) return false;
          if (selectedOwnership === 'CHINH_CHU' && p.la_chinh_chu === false) return false;
          if (selectedOwnership === 'THUE_MUON' && p.la_chinh_chu !== false) return false;
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const match =
              p.chu_dat?.toLowerCase().includes(q) ||
              p.ho_san_xuat?.toLowerCase().includes(q) ||
              p.lo_thua_dat?.toLowerCase().includes(q) ||
              p.xu_dong?.toLowerCase().includes(q);
            if (!match) return false;
          }
          return true;
        },
        style: getParcelStyle,
        onEachFeature: (feature: any, layer: L.Layer) => {
          const p = feature.properties;
          
          layer.on({
            mouseover: (e: any) => {
              const target = e.target;
              target.setStyle({ weight: 3, color: '#38bdf8', fillOpacity: 0.9 });
              setHoveredParcel(p);
            },
            mouseout: (e: any) => {
              parcelsLayer.resetStyle(e.target);
              setHoveredParcel(null);
            },
            click: (e: any) => {
              L.DomEvent.stopPropagation(e);
              setSelectedParcel(p);
              // Zoom slightly to clicked parcel
              if (p.center) {
                map.flyTo(p.center, 18, { duration: 0.8 });
              }
            },
          });

          layer.bindTooltip(
            `<div class="text-xs font-sans">
              <strong class="text-emerald-700">${p.lo_thua_dat}</strong> (${p.xu_dong})<br/>
              <span class="text-slate-600">Chủ: <strong>${p.chu_dat}</strong></span><br/>
              <span class="text-slate-500">${p.dien_tich_m2} m² • Giống: <strong>${p.giong_lua}</strong></span>
            </div>`,
            { direction: 'top', sticky: true, opacity: 0.95 }
          );
        },
      }).addTo(map);
      layersGroupRef.current.parcels = parcelsLayer;
    }

    // 3. Add Canals Polyline Layer
    if (showCanals) {
      const canalsLayer = L.geoJSON(agriCanalsGeoJson as any, {
        style: (feature: any) => ({
          color: feature.properties.color,
          weight: feature.properties.width,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }),
        onEachFeature: (feature: any, layer: L.Layer) => {
          const p = feature.properties;
          layer.bindTooltip(
            `<strong>${p.ten_kenh}</strong><br/>Dài: ${p.chieu_dai_m}m • Lưu lượng: ${p.luu_luong_m3s} m³/s`,
            { sticky: true }
          );
        },
      }).addTo(map);
      layersGroupRef.current.canals = canalsLayer;
    }

    // 4. Add Pump Stations & Gates Points Layer
    if (showPumps) {
      const pointsLayer = L.geoJSON(agriPointsGeoJson as any, {
        pointToLayer: (feature: any, latlng: L.LatLng) => {
          const isPump = feature.properties.loai === 'tram_bom';
          const iconHtml = `
            <div class="w-8 h-8 rounded-full ${isPump ? 'bg-blue-600 ring-4 ring-blue-300' : 'bg-emerald-600 ring-4 ring-emerald-300'} text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </div>
          `;
          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-pump-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
          return L.marker(latlng, { icon: customIcon });
        },
        onEachFeature: (feature: any, layer: L.Layer) => {
          const p = feature.properties;
          layer.bindPopup(
            `<div class="p-2 space-y-1">
              <strong class="text-blue-700 text-sm">${p.ten_tram}</strong><br/>
              <span class="text-xs text-slate-600">Công suất: <strong>${p.cong_suat}</strong></span><br/>
              <span class="text-xs text-slate-500">Phụ trách: ${p.phu_trach} (${p.sdt})</span>
            </div>`
          );
        },
      }).addTo(map);
      layersGroupRef.current.points = pointsLayer;
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [viewMode, baseMapType, showZones, showParcels, showCanals, showPumps, colorBy, selectedXuDong, selectedVariety, selectedOwnership, searchQuery, selectedParcel, agriZonesGeoJson, agriParcelsGeoJson, agriCanalsGeoJson, agriPointsGeoJson]);

  // Action: Export Agri GeoJSON Backup
  const handleExportAgriGeoJson = () => {
    const geoJsonStr = exportAgriGeoJsonBackup();
    const blob = new Blob([geoJsonStr], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnTrach_NongNghiep_GeoJSON_Master_${new Date().toISOString().split('T')[0]}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Action: Import Agri GeoJSON
  const handleImportAgriGeoJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = restoreAgriGeoJson(content);
        if (res.success) {
          alert(`NẠP GEOJSON THÀNH CÔNG!\n${res.message}`);
        } else {
          alert(`LỖI NẠP GEOJSON: ${res.message}`);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Action: Reset Agri Spatial Data
  const handleResetAgriGeoJson = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại toàn bộ dữ liệu không gian GeoJSON 5 Xứ Đồng & 647 Thửa Đất về trạng thái chuẩn ban đầu không?')) {
      resetAgriGeoJsonToDefault();
      alert('Đã khôi phục dữ liệu không gian nông nghiệp chuẩn.');
    }
  };

  // Action: Open Add Zone Modal
  const handleOpenAddZoneModal = () => {
    setSpatialModalMode('zone');
    setEditingSpatialFeature(null);
    setIsSpatialModalOpen(true);
  };

  // Action: Open Add Parcel Modal
  const handleOpenAddParcelModal = () => {
    setSpatialModalMode('parcel');
    setEditingSpatialFeature(null);
    setIsSpatialModalOpen(true);
  };

  // Action: Edit Selected Parcel Multi-point Coordinates
  const handleEditSelectedParcelSpatial = () => {
    if (!selectedParcel) return;
    const found = agriParcelsGeoJson.features.find((f: any) => f.id === selectedParcel.id || f.properties.lo_thua_dat === selectedParcel.lo_thua_dat);
    if (found) {
      setSpatialModalMode('parcel');
      setEditingSpatialFeature(found as any);
      setIsSpatialModalOpen(true);
    } else {
      // Fallback
      setSpatialModalMode('parcel');
      setEditingSpatialFeature(null);
      setIsSpatialModalOpen(true);
    }
  };

  // Action: Delete Selected Parcel
  const handleDeleteSelectedParcelSpatial = () => {
    if (!selectedParcel) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa thửa đất "${selectedParcel.lo_thua_dat}" (${selectedParcel.chu_dat}) khỏi bản đồ GIS không?`)) {
      deleteAgriParcelFeature(selectedParcel.id);
      setSelectedParcel(null);
      alert(`Đã xóa thửa đất "${selectedParcel.lo_thua_dat}".`);
    }
  };

  // FlyTo Specific Xứ Đồng
  const handleFlyToXuDong = (xuDongName: string) => {
    setSelectedXuDong(xuDongName);
    if (!mapInstanceRef.current) return;

    if (xuDongName === 'ALL') {
      mapInstanceRef.current.flyTo(AN_TRACH_CENTER, 16, { duration: 1 });
      return;
    }

    const zone = agriZonesGeoJson.features.find(
      (z: any) => normalizeXuDong(z.properties.ten_xu_dong) === normalizeXuDong(xuDongName)
    );

    if (zone && zone.properties.center) {
      mapInstanceRef.current.flyTo(zone.properties.center, 17, { duration: 1 });
    }
  };

  // Find Resident Details by Name
  const handleViewResidentByName = (name: string) => {
    if (!name) return;
    const cleanName = name.trim().toUpperCase();
    const found = nhanKhauList.find((r) => r.ho_ten.toUpperCase() === cleanName);
    if (found && onSelectResident) {
      onSelectResident(found);
    } else {
      alert(`Không tìm thấy hồ sơ định danh "${name}" trong danh bạ 2.308 cư dân thôn An Trạch.`);
    }
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-3 space-y-0 h-screen flex flex-col' : ''}`}>
      
      {/* ================= COMPACT & SCIENTIFIC GIS CONTROL HEADER ================= */}
      <PageHeaderBanner
        icon={<Compass className="w-6 h-6 text-white animate-spin-slow" />}
        iconBgClass="from-teal-600 via-emerald-600 to-cyan-700 text-white shadow-teal-500/25"
        badge={{
          text: 'Không Gian Số Hóa Bản Đồ Nông Nghiệp',
          icon: <MapIcon className="w-3.5 h-3.5 text-teal-300" />,
          colorClass: 'bg-teal-500/20 text-teal-200 border-teal-400/30'
        }}
        subBadge={{
          text: '647 Thửa • 43,86 ha • 5 Xứ Đồng',
          icon: <Wheat className="w-3.5 h-3.5 text-emerald-300" />,
          colorClass: 'bg-white/10 text-slate-200 border-white/15'
        }}
        title="Bản Đồ Không Gian Sản Xuất & Thủy Nông (GIS & Geo3D)"
        description="Mô phỏng bản đồ đa giác 647 thửa ruộng, mạng lưới kênh dẫn sông Yên, trạm bơm thủy nông và mô hình địa hình ruộng 3D."
        theme="dark"
        actions={
          <>
            {/* 1. Xứ Đồng FlyTo Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 text-xs shrink-0">
              <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <select
                value={selectedXuDong}
                onChange={(e) => handleFlyToXuDong(e.target.value)}
                className="bg-transparent font-black text-white focus:outline-none cursor-pointer pr-1 text-xs max-w-[180px] sm:max-w-[240px] truncate"
              >
                <option value="ALL" className="bg-slate-900 text-white">Toàn Thôn (647 Thửa • 43,86 ha)</option>
                {xuDongList.map((xd) => {
                  const xdName = xd.ten_xu_dong.replace('Xứ Đồng ', '');
                  return (
                    <option key={xd.ma_xu_dong} value={xdName} className="bg-slate-900 text-white">
                      {xd.ten_xu_dong} ({xd.so_thua} Thửa • {((xd.dien_tich_m2 || 0) / 10000).toFixed(2)} ha)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Add Zone / Parcel Action Buttons */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20 text-xs shrink-0">
              <button
                type="button"
                onClick={handleOpenAddParcelModal}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="Vẽ thêm thửa ruộng mới đa điểm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Thửa</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddZoneModal}
                className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-black shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="Vẽ thêm ranh giới xứ đồng mới đa điểm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Xứ Đồng</span>
              </button>
            </div>

            {/* 3. GeoJSON Backup & Restore Buttons */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20 text-xs shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportAgriGeoJsonFile}
                accept=".geojson,.json"
                className="hidden"
              />

              <button
                type="button"
                onClick={handleExportAgriGeoJson}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-emerald-300 font-bold transition-colors cursor-pointer"
                title="Xuất file sao lưu GeoJSON 5 xứ đồng & 647 thửa đất"
              >
                <FileDown className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-purple-300 font-bold transition-colors cursor-pointer"
                title="Nạp file GeoJSON vào bản đồ"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetAgriGeoJson}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-rose-500/30 text-rose-300 font-bold transition-colors cursor-pointer"
                title="Khôi phục dữ liệu không gian ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. View Mode Switcher: 2D vs 3D */}
            <div className="bg-white/10 p-1 rounded-xl border border-white/20 flex items-center gap-1 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('2d_gis')}
                className={`px-2.5 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  viewMode === '2d_gis'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>2D GIS</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('3d_geo')}
                className={`px-2.5 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  viewMode === '3d_geo'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Geo3D</span>
              </button>
            </div>

            {/* 5. Link to Sổ Bộ Table */}
            <button
              type="button"
              onClick={() => onNavigateToTab && onNavigateToTab('nong-nghiep')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs shrink-0 whitespace-nowrap"
              title="Mở Sổ bộ sản xuất dạng bảng"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sổ Bộ</span>
            </button>

            {/* 6. Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shrink-0"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </>
        }
      />

      {/* ================= MAIN MAP WORKSPACE ================= */}
      <div className={`relative ${isFullscreen ? 'flex-1 h-full' : 'h-[640px] lg:h-[720px]'} rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100`}>
        
        {viewMode === '2d_gis' ? (
          <>
            {/* Leaflet Map DOM Container */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Top Left Floating Quick Filter Bar */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-sm">
              
              {/* Search Box */}
              <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 ml-1.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm chủ đất, lô thửa, xứ đồng..."
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Color Legend Badge */}
              <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-lg text-[11px] space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-100 pb-1">
                  <span>Phối màu hiển thị:</span>
                  <select
                    value={colorBy}
                    onChange={(e) => setColorBy(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 font-extrabold text-slate-800 cursor-pointer"
                  >
                    <option value="variety">Theo Giống lúa</option>
                    <option value="ownership">Theo Quyền canh tác</option>
                    <option value="zone">Theo 5 Xứ đồng</option>
                  </select>
                </div>

                {colorBy === 'variety' ? (
                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> HG12 (46,8%)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> HG244 (43,3%)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> J02 (9,9%)</span>
                  </div>
                ) : colorBy === 'ownership' ? (
                  <div className="flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Chính chủ (283)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Thuê/Mượn (364)</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Tổ 9</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Hà Ra</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> La Châu</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> LB Tây</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500" /> Gò Ổi</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Right Floating Layer Toggle Panel */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              
              {/* Basemap Switcher */}
              <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-1 text-xs">
                <button
                  onClick={() => setBaseMapType('google_satellite')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    baseMapType === 'google_satellite' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vệ tinh Google Hybrid"
                >
                  <Satellite className="w-3.5 h-3.5" />
                  <span>Vệ tinh</span>
                </button>
                <button
                  onClick={() => setBaseMapType('osm')}
                  className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    baseMapType === 'osm' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Bản đồ giao thông OSM"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Bản đồ</span>
                </button>
              </div>

              {/* Layer Visibility Toggles */}
              <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200 shadow-lg text-xs space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={showZones}
                    onChange={(e) => setShowZones(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>5 Ranh giới Xứ đồng</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={showParcels}
                    onChange={(e) => setShowParcels(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Lưới 647 Thửa đất</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={showCanals}
                    onChange={(e) => setShowCanals(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Kênh Thủy Nông Sông Yên</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={showPumps}
                    onChange={(e) => setShowPumps(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Trạm Bơm & Cống Xả</span>
                </label>
              </div>

            </div>

            {/* Bottom Right Floating Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                className="p-2.5 bg-white/95 hover:bg-white rounded-xl border border-slate-200 text-slate-700 shadow-md font-bold text-base active:scale-95 cursor-pointer"
                title="Phóng to"
              >
                +
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                className="p-2.5 bg-white/95 hover:bg-white rounded-xl border border-slate-200 text-slate-700 shadow-md font-bold text-base active:scale-95 cursor-pointer"
                title="Thu nhỏ"
              >
                -
              </button>
              <button
                onClick={() => handleFlyToXuDong('ALL')}
                className="p-2.5 bg-white/95 hover:bg-white rounded-xl border border-slate-200 text-slate-700 shadow-md active:scale-95 cursor-pointer"
                title="Toàn cảnh thôn An Trạch"
              >
                <Crosshair className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </>
        ) : (
          <SanXuatGeo3DViewer
            sanXuatList={sanXuatList}
            selectedXuDong={selectedXuDong}
            selectedVariety={selectedVariety}
            selectedOwnership={selectedOwnership}
            onSelectParcel={(rec) => setSelectedParcel(rec)}
            selectedParcelId={selectedParcel?.id}
          />
        )}

        {/* Selected Parcel Inspector Drawer */}
        {selectedParcel && (
          <div className="absolute bottom-4 left-4 z-30 w-full max-w-sm bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-3.5 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                  {selectedParcel.lo_thua_dat}
                </span>
                <span className="text-xs font-bold text-slate-500">Xứ đồng {selectedParcel.xu_dong}</span>
              </div>
              <button
                onClick={() => setSelectedParcel(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500">Chủ đất (QSDĐ):</span>
                <button
                  onClick={() => handleViewResidentByName(selectedParcel.chu_dat)}
                  className="font-extrabold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <span>{selectedParcel.chu_dat}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500">Hộ trực tiếp cấy:</span>
                <button
                  onClick={() => handleViewResidentByName(selectedParcel.ho_san_xuat)}
                  className="font-bold text-sky-800 hover:underline flex items-center gap-1"
                >
                  <span>{selectedParcel.ho_san_xuat}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block font-bold">Diện tích:</span>
                  <strong className="text-sm font-mono text-slate-900">{selectedParcel.dien_tich_m2} m²</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] block font-bold">Giống lúa:</span>
                  <strong className="text-sm font-bold text-emerald-700">{selectedParcel.giong_lua}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-500">Hiện trạng:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${selectedParcel.la_chinh_chu !== false ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                  {selectedParcel.la_chinh_chu !== false ? 'Chính chủ tự cấy' : 'Mượn / Thuê đất'}
                </span>
              </div>

              {/* Spatial Multi-point Actions for Selected Parcel */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={handleEditSelectedParcelSpatial}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Tọa Độ Đa Điểm</span>
                </button>

                <button
                  onClick={handleDeleteSelectedParcelSpatial}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold flex items-center justify-center gap-1 cursor-pointer text-xs transition-colors"
                  title="Xóa thửa đất khỏi bản đồ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal Multi-point Spatial Editor */}
      <AgriSpatialEditorModal
        isOpen={isSpatialModalOpen}
        onClose={() => setIsSpatialModalOpen(false)}
        mode={spatialModalMode}
        editingFeature={editingSpatialFeature}
        defaultXuDong={selectedXuDong === 'ALL' ? 'Tổ 9' : selectedXuDong}
      />

    </div>
  );
};
