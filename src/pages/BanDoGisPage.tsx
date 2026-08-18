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
  CreditCard, 
  Heart, 
  CheckCircle2, 
  X, 
  Navigation, 
  ExternalLink, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Building2, 
  Home, 
  Compass, 
  Sliders, 
  HelpCircle,
  FileDown,
  FileUp,
  FileCheck,
  Edit3,
  Trash2,
  Check,
  Palette,
  RotateCcw,
  Move,
  PlusCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Filter,
  Info,
  CheckSquare,
  Square,
  Share2,
  AlertTriangle,
  Pentagon,
  MousePointerClick,
  Copy,
  CheckCheck,
  LayoutGrid,
  MapPinned,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { HoKhau, NhanKhau } from '../types';
import { 
  AN_TRACH_CENTER, 
  DEFAULT_MAP_ZOOM, 
  DEFAULT_TO_CENTROIDS,
  ToBoundaryFeature
} from '../data/anTrachGeoJsonData';

const TILE_LAYERS = {
  satellite: {
    name: 'Vệ Tinh ESRI',
    shortName: 'Vệ Tinh',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; ESRI World Imagery HD',
    maxZoom: 20
  },
  osm: {
    name: 'Giao Thông OSM',
    shortName: 'Giao Thông',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  },
  terrain: {
    name: 'Địa Hình',
    shortName: 'Địa Hình',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB Voyager',
    maxZoom: 20
  }
};

const LOAI_HO_CONFIG: Record<string, { label: string; color: string; badge: string; icon: any }> = {
  chuan: { label: 'Hộ Chuẩn', color: '#0284c7', badge: 'bg-sky-50 text-sky-800 border-sky-200', icon: Home },
  ho_ngheo: { label: 'Hộ Nghèo / Cận Nghèo', color: '#e11d48', badge: 'bg-rose-50 text-rose-800 border-rose-200 font-bold', icon: Heart },
  chinh_sach: { label: 'Gia Đình Chính Sách', color: '#9333ea', badge: 'bg-purple-50 text-purple-800 border-purple-200 font-bold', icon: ShieldCheck },
  vung_ngap_lut: { label: 'Vùng Nguy Cơ Ngập Lũ', color: '#d97706', badge: 'bg-amber-50 text-amber-900 border-amber-300 font-bold', icon: AlertTriangle },
  kinh_doanh: { label: 'Hộ Kinh Doanh / Làng Nghề', color: '#059669', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold', icon: Building2 },
};

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

export const BanDoGisPage: React.FC = () => {
  const { 
    hoKhauList, 
    nhanKhauList, 
    updateHouseholdLocation, 
    updateHouseholdSpatialData,
    exportGisGeoJson, 
    restoreGisGeoJson,
    boundariesData,
    addBoundary,
    updateBoundary,
    deleteBoundary,
    resetBoundariesToDefault
  } = useData();
  
  const { currentUser } = useAuth();
  const isAdmin = currentUser && ['admin', 'super_admin', 'truong_thon'].includes(currentUser.vai_tro);

  // PRIMARY MODE SWITCHER: 'HOUSEHOLD' (Quản lý 614 Hộ) vs 'BOUNDARY' (Ranh giới 8 Tổ) vs 'ALL' (Tổng hợp)
  const [activeGisMode, setActiveGisMode] = useState<'HOUSEHOLD' | 'BOUNDARY' | 'ALL'>('HOUSEHOLD');

  // Map references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const parcelsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const editBoundaryVertexGroupRef = useRef<L.LayerGroup | null>(null);
  const drawingLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Map display states
  const [currentMapType, setCurrentMapType] = useState<'satellite' | 'osm' | 'terrain'>('satellite');
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showHouseholdMarkers, setShowHouseholdMarkers] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [selectedToFilter, setSelectedToFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // UI/UX Panels & Fullscreen toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);

  // Selected Household for floating inspector & modal
  const [selectedHousehold, setSelectedHousehold] = useState<HoKhau | null>(null);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);

  // Selected Boundary for floating inspector & modal
  const [selectedBoundary, setSelectedBoundary] = useState<ToBoundaryFeature | null>(null);
  const [isBoundaryModalOpen, setIsBoundaryModalOpen] = useState(false);
  const [isAddBoundaryModalOpen, setIsAddBoundaryModalOpen] = useState(false);

  // Household Pin Mode
  const [isPinModeActive, setIsPinModeActive] = useState(false);
  const [householdToPin, setHouseholdToPin] = useState<HoKhau | null>(null);

  // Household Parcel Drawing Mode (CAD polygon)
  const [isDrawingParcelMode, setIsDrawingParcelMode] = useState(false);
  const [drawingHousehold, setDrawingHousehold] = useState<HoKhau | null>(null);
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);

  // Boundary Interactive Vertex Dragging Mode
  const [isEditingBoundaryMode, setIsEditingBoundaryMode] = useState(false);
  const [editingBoundaryId, setEditingBoundaryId] = useState<string>('');
  const [editingBoundaryName, setEditingBoundaryName] = useState<string>('Tổ 1');
  const [editingCoordinates, setEditingCoordinates] = useState<[number, number][]>([]);

  // Boundary Drawing Mode (Draw new boundary polygon interactively)
  const [isDrawingNewBoundaryMode, setIsDrawingNewBoundaryMode] = useState(false);
  const [drawnBoundaryPoints, setDrawnBoundaryPoints] = useState<[number, number][]>([]);

  // Household Form State in Modal
  const [formTenChuHo, setFormTenChuHo] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDiaChi, setFormDiaChi] = useState('');
  const [formToDanCu, setFormToDanCu] = useState('Tổ 1');
  const [formLoaiHo, setFormLoaiHo] = useState<'chuan' | 'ho_ngheo' | 'chinh_sach' | 'vung_ngap_lut' | 'kinh_doanh'>('chuan');
  const [formDienTichDat, setFormDienTichDat] = useState<number>(150);
  const [formLat, setFormLat] = useState<number>(15.9620);
  const [formLng, setFormLng] = useState<number>(108.1965);
  const [formGhiChu, setFormGhiChu] = useState('');
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Boundary Edit Form State in Modal
  const [editFormToName, setEditFormToName] = useState('');
  const [editFormToTruong, setEditFormToTruong] = useState('');
  const [editFormPhone, setEditFormPhone] = useState('');
  const [editFormDienTich, setEditFormDienTich] = useState<number>(10);
  const [editFormColor, setEditFormColor] = useState('#0284c7');
  const [editFormMoTa, setEditFormMoTa] = useState('');
  const [editFormRawGeoJson, setEditFormRawGeoJson] = useState('');

  // Add Boundary Form State
  const [addFormName, setAddFormName] = useState('');
  const [addFormToTruong, setAddFormToTruong] = useState('');
  const [addFormPhone, setAddFormPhone] = useState('');
  const [addFormDienTich, setAddFormDienTich] = useState<number>(12);
  const [addFormColor, setAddFormColor] = useState('#10b981');
  const [addFormMoTa, setAddFormMoTa] = useState('');

  // Backup & Restore state
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restoreStatusMsg, setRestoreStatusMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get members of the selected household
  const householdMembers = useMemo(() => {
    if (!selectedHousehold) return [];
    return nhanKhauList.filter((r) => r.ma_ho === selectedHousehold.ma_ho);
  }, [selectedHousehold, nhanKhauList]);

  // Filtered Households
  const filteredHouseholds = useMemo(() => {
    return hoKhauList.filter((h) => {
      if (selectedToFilter !== 'ALL' && h.to_dan_cu !== selectedToFilter) return false;
      if (selectedCategoryFilter !== 'ALL') {
        const loai = h.loai_ho || 'chuan';
        if (loai !== selectedCategoryFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          h.ten_chu_ho.toLowerCase().includes(q) ||
          h.ma_ho.toLowerCase().includes(q) ||
          (h.so_dien_thoai && h.so_dien_thoai.includes(q)) ||
          h.dia_chi.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [hoKhauList, selectedToFilter, selectedCategoryFilter, searchQuery]);

  // Adjust layer visibility based on active mode
  useEffect(() => {
    if (activeGisMode === 'HOUSEHOLD') {
      setShowBoundaries(true);
      setShowHouseholdMarkers(true);
      setShowParcels(true);
      setIsEditingBoundaryMode(false);
      setIsDrawingNewBoundaryMode(false);
      setSelectedBoundary(null);
    } else if (activeGisMode === 'BOUNDARY') {
      setShowBoundaries(true);
      setShowHouseholdMarkers(false);
      setShowParcels(false);
      setSelectedHousehold(null);
      setIsDrawingParcelMode(false);
      setIsPinModeActive(false);
    } else {
      setShowBoundaries(true);
      setShowHouseholdMarkers(true);
      setShowParcels(true);
    }
  }, [activeGisMode]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: AN_TRACH_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      minZoom: 13,
      maxZoom: 20,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tileConfig = TILE_LAYERS[currentMapType];
    const tileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer groups
    const parcelsGroup = L.layerGroup().addTo(map);
    parcelsLayerGroupRef.current = parcelsGroup;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    const editBoundaryGroup = L.layerGroup().addTo(map);
    editBoundaryVertexGroupRef.current = editBoundaryGroup;

    const drawingGroup = L.layerGroup().addTo(map);
    drawingLayerGroupRef.current = drawingGroup;

    // Click handler for Pin Mode, Parcel Drawing, and Boundary Drawing
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Pin Mode
      if (householdToPin) {
        updateHouseholdLocation(householdToPin.ma_ho, lat, lng);
        setHouseholdToPin(null);
        setIsPinModeActive(false);
        return;
      }

      // Drawing Household Parcel Mode
      if (isDrawingParcelMode && drawingHousehold) {
        setDrawnPoints((prev) => [...prev, [Number(lng.toFixed(6)), Number(lat.toFixed(6))]]);
        return;
      }

      // Drawing New Boundary Polygon Mode
      if (isDrawingNewBoundaryMode) {
        setDrawnBoundaryPoints((prev) => [...prev, [Number(lng.toFixed(6)), Number(lat.toFixed(6))]]);
        return;
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map size on layout changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [isSidebarOpen, isFullscreenMode, activeGisMode]);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileConfig = TILE_LAYERS[currentMapType];
    const newTileLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [currentMapType]);

  // Render GeoJSON Boundaries
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    if (!showBoundaries) return;

    const geoJsonLayer = L.geoJSON(boundariesData as any, {
      style: (feature: any) => {
        const props = feature.properties;
        const isSelected = (selectedToFilter !== 'ALL' && props.to_dan_cu === selectedToFilter) || (selectedBoundary?.properties.id === props.id);
        const isBeingEdited = isEditingBoundaryMode && (props.id === editingBoundaryId || props.to_dan_cu === editingBoundaryName);

        return {
          color: isBeingEdited ? '#f59e0b' : (props.color || '#0284c7'),
          weight: isBeingEdited ? 4.5 : (isSelected ? 3.5 : (activeGisMode === 'BOUNDARY' ? 3 : 2)),
          opacity: 0.95,
          fillColor: isBeingEdited ? '#fbbf24' : (props.fillColor || '#38bdf8'),
          fillOpacity: isBeingEdited ? 0.45 : (isSelected ? 0.45 : (activeGisMode === 'BOUNDARY' ? 0.35 : 0.2)),
          dashArray: isSelected || isBeingEdited ? undefined : '4, 4'
        };
      },
      onEachFeature: (feature: any, layer: L.Layer) => {
        const props = feature.properties;
        
        layer.bindTooltip(`
          <div class="p-1.5 text-xs">
            <strong class="text-slate-900 block font-bold">${props.to_dan_cu} (Thôn An Trạch)</strong>
            <span class="text-slate-600 font-medium">Tổ trưởng: ${props.to_truong}</span><br/>
            <span class="text-emerald-700 font-bold">${props.so_ho} hộ • ${props.so_dan} dân (${props.dien_tich_ha} ha)</span>
          </div>
        `, { sticky: true, direction: 'top' });

        layer.on('click', () => {
          setSelectedToFilter(props.to_dan_cu);
          setSelectedBoundary(feature);
          
          if (activeGisMode === 'BOUNDARY') {
            const centroid = DEFAULT_TO_CENTROIDS[props.to_dan_cu] || DEFAULT_TO_CENTROIDS['Tổ 1'];
            mapInstanceRef.current?.flyTo([centroid.lat, centroid.lng], 16, { animate: true });
          }
        });
      }
    }).addTo(mapInstanceRef.current);

    geoJsonLayerRef.current = geoJsonLayer;
  }, [showBoundaries, selectedToFilter, selectedBoundary, boundariesData, isEditingBoundaryMode, editingBoundaryId, editingBoundaryName, activeGisMode]);

  // Interactive Vertex Editing Layer on Map for Boundaries
  useEffect(() => {
    if (!mapInstanceRef.current || !editBoundaryVertexGroupRef.current) return;
    const vertexGroup = editBoundaryVertexGroupRef.current;
    vertexGroup.clearLayers();

    if (!isEditingBoundaryMode) return;

    const targetFeat = boundariesData.features.find(
      (f) => f.properties.id === editingBoundaryId || f.properties.to_dan_cu === editingBoundaryName
    );
    if (!targetFeat || !targetFeat.geometry || !targetFeat.geometry.coordinates[0]) return;

    const coords = editingCoordinates.length > 0 ? editingCoordinates : targetFeat.geometry.coordinates[0];

    // Fly to boundary centroid
    const centroid = DEFAULT_TO_CENTROIDS[targetFeat.properties.to_dan_cu] || DEFAULT_TO_CENTROIDS['Tổ 1'] || { lat: 15.9620, lng: 108.1965 };
    mapInstanceRef.current.flyTo([centroid.lat, centroid.lng], 17, { animate: true });

    // Render draggable handle markers for each vertex
    coords.forEach((coord, idx) => {
      const [lng, lat] = coord;
      const vertexIcon = L.divIcon({
        className: 'vertex-handle-icon',
        html: `
          <div class="w-6 h-6 rounded-full bg-amber-500 text-slate-900 font-black text-[11px] flex items-center justify-center border-2 border-white shadow-xl cursor-move hover:scale-125 transition-transform ring-2 ring-amber-300">
            ${idx + 1}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], {
        icon: vertexIcon,
        draggable: true
      });

      marker.on('drag', (e: any) => {
        const newPos = e.target.getLatLng();
        const updatedCoords = [...coords];
        updatedCoords[idx] = [Number(newPos.lng.toFixed(6)), Number(newPos.lat.toFixed(6))];
        
        // Keep polygon ring closed
        if (idx === 0) updatedCoords[updatedCoords.length - 1] = updatedCoords[0];
        if (idx === updatedCoords.length - 1) updatedCoords[0] = updatedCoords[updatedCoords.length - 1];

        setEditingCoordinates(updatedCoords);
        updateBoundary(targetFeat.properties.id, {}, [updatedCoords]);
      });

      marker.bindTooltip(`Đỉnh ${idx + 1} (${targetFeat.properties.to_dan_cu}) - Kéo chuột để nới rộng/thu hẹp ranh giới`, { direction: 'top' });
      vertexGroup.addLayer(marker);
    });

  }, [isEditingBoundaryMode, editingBoundaryId, editingBoundaryName, boundariesData]);

  // Live Drawing Layer (For both Household Parcel and New Boundary Polygon)
  useEffect(() => {
    if (!mapInstanceRef.current || !drawingLayerGroupRef.current) return;
    const drawingGroup = drawingLayerGroupRef.current;
    drawingGroup.clearLayers();

    // Household Parcel Drawing
    if (isDrawingParcelMode && drawnPoints.length > 0) {
      const latLngs = drawnPoints.map(([lng, lat]) => [lat, lng] as [number, number]);
      if (latLngs.length > 1) {
        const polyline = L.polyline(latLngs, { color: '#f59e0b', weight: 3, dashArray: '6, 6' });
        drawingGroup.addLayer(polyline);
      }
      drawnPoints.forEach((point, idx) => {
        const [lng, lat] = point;
        const vertexIcon = L.divIcon({
          className: 'drawing-vertex',
          html: `<div class="w-4 h-4 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white shadow-md">${idx + 1}</div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        const marker = L.marker([lat, lng], { icon: vertexIcon });
        drawingGroup.addLayer(marker);
      });
    }

    // New Boundary Drawing
    if (isDrawingNewBoundaryMode && drawnBoundaryPoints.length > 0) {
      const latLngs = drawnBoundaryPoints.map(([lng, lat]) => [lat, lng] as [number, number]);
      if (latLngs.length > 1) {
        const polyline = L.polyline(latLngs, { color: '#10b981', weight: 4, dashArray: '8, 8' });
        drawingGroup.addLayer(polyline);
      }
      drawnBoundaryPoints.forEach((point, idx) => {
        const [lng, lat] = point;
        const vertexIcon = L.divIcon({
          className: 'drawing-boundary-vertex',
          html: `<div class="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center border-2 border-white shadow-xl">${idx + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        const marker = L.marker([lat, lng], { icon: vertexIcon });
        drawingGroup.addLayer(marker);
      });
    }

  }, [isDrawingParcelMode, drawnPoints, isDrawingNewBoundaryMode, drawnBoundaryPoints]);

  // Render Household Footprint Parcels
  useEffect(() => {
    if (!mapInstanceRef.current || !parcelsLayerGroupRef.current) return;
    const parcelsGroup = parcelsLayerGroupRef.current;
    parcelsGroup.clearLayers();

    if (!showParcels) return;

    filteredHouseholds.forEach((h) => {
      let polygonCoords: [number, number][] | null = h.polygon_thua_dat || null;

      if (!polygonCoords && h.lat && h.lng) {
        const delta = 0.00008;
        polygonCoords = [
          [h.lng - delta, h.lat + delta],
          [h.lng + delta, h.lat + delta],
          [h.lng + delta, h.lat - delta],
          [h.lng - delta, h.lat - delta]
        ];
      }

      if (polygonCoords && polygonCoords.length >= 3) {
        const loaiConfig = LOAI_HO_CONFIG[h.loai_ho || 'chuan'] || LOAI_HO_CONFIG.chuan;
        const latLngs = polygonCoords.map(([lng, lat]) => [lat, lng] as [number, number]);
        const isSelected = selectedHousehold?.id === h.id;

        const polygon = L.polygon(latLngs, {
          color: isSelected ? '#f59e0b' : loaiConfig.color,
          weight: isSelected ? 3 : 1.5,
          fillColor: isSelected ? '#fbbf24' : loaiConfig.color,
          fillOpacity: isSelected ? 0.5 : 0.25,
        });

        polygon.bindTooltip(`
          <div class="p-1 text-xs">
            <strong class="block text-slate-900">${h.ten_chu_ho} (${h.ma_ho})</strong>
            <span class="text-slate-600">${loaiConfig.label}</span><br/>
            <span class="text-sky-700 font-bold">Thửa đất: ${h.dien_tich_dat_m2 || 120} m²</span>
          </div>
        `, { sticky: true });

        polygon.on('click', () => {
          setSelectedHousehold(h);
        });

        parcelsGroup.addLayer(polygon);
      }
    });
  }, [filteredHouseholds, selectedHousehold, showParcels]);

  // Render Household Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;

    const markersGroup = markersLayerGroupRef.current;
    markersGroup.clearLayers();

    if (!showHouseholdMarkers) return;

    filteredHouseholds.forEach((household) => {
      const defaultCoord = DEFAULT_TO_CENTROIDS[household.to_dan_cu] || DEFAULT_TO_CENTROIDS['Tổ 1'];
      const lat = household.lat || defaultCoord.lat;
      const lng = household.lng || defaultCoord.lng;

      const loaiConfig = LOAI_HO_CONFIG[household.loai_ho || 'chuan'] || LOAI_HO_CONFIG.chuan;
      const memberCount = nhanKhauList.filter((r) => r.ma_ho === household.ma_ho).length || 1;
      const isSelected = selectedHousehold?.id === household.id;

      const customIcon = L.divIcon({
        className: 'custom-house-pin',
        html: `
          <div class="relative group cursor-pointer transition-transform duration-200 hover:scale-125 ${isSelected ? 'scale-125 z-50' : ''}">
            <div class="w-7 h-7 rounded-full text-white shadow-lg flex items-center justify-center border-2 border-white" style="background-color: ${isSelected ? '#f59e0b' : loaiConfig.color}">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            ${isSelected ? '<div class="absolute -inset-1 rounded-full marker-pulse pointer-events-none"></div>' : ''}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([lat, lng], { 
        icon: customIcon,
        draggable: Boolean(isAdmin)
      });

      marker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        updateHouseholdLocation(household.ma_ho, newPos.lat, newPos.lng);
      });

      marker.on('click', () => {
        setSelectedHousehold(household);
      });

      marker.bindPopup(`
        <div class="p-3.5 space-y-2 text-xs min-w-[230px]">
          <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span class="font-mono font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">${household.ma_ho}</span>
            <span class="font-bold text-slate-500">${household.to_dan_cu}</span>
          </div>
          <div>
            <h4 class="font-extrabold text-slate-900 text-sm">${household.ten_chu_ho}</h4>
            <span class="text-[10px] px-2 py-0.5 rounded-md border ${loaiConfig.badge}">${loaiConfig.label}</span>
            <p class="text-slate-500 text-[11px] mt-1">${household.dia_chi}</p>
          </div>
          <div class="pt-1.5 flex items-center justify-between gap-2 border-t border-slate-100">
            <span class="text-emerald-700 font-bold">${memberCount} nhân khẩu</span>
            <a href="tel:${household.so_dien_thoai || ''}" class="text-sky-600 font-bold flex items-center gap-1 hover:underline">
              <span>${household.so_dien_thoai || 'Chưa có SĐT'}</span>
            </a>
          </div>
        </div>
      `);

      markersGroup.addLayer(marker);
    });
  }, [filteredHouseholds, selectedHousehold, showHouseholdMarkers, isAdmin, nhanKhauList]);

  // Action: Fly to household
  const handleFlyToHousehold = (household: HoKhau) => {
    setSelectedHousehold(household);
    const defaultCoord = DEFAULT_TO_CENTROIDS[household.to_dan_cu] || DEFAULT_TO_CENTROIDS['Tổ 1'];
    const lat = household.lat || defaultCoord.lat;
    const lng = household.lng || defaultCoord.lng;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 19, {
        animate: true,
        duration: 1.2
      });
    }
  };

  // Action: Reset view
  const handleResetVillageView = () => {
    setSelectedToFilter('ALL');
    setSelectedCategoryFilter('ALL');
    setSelectedHousehold(null);
    setSelectedBoundary(null);
    setIsEditingBoundaryMode(false);
    setIsDrawingParcelMode(false);
    setIsDrawingNewBoundaryMode(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(AN_TRACH_CENTER, DEFAULT_MAP_ZOOM, {
        animate: true,
        duration: 1.0
      });
    }
  };

  // Action: Geolocation
  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ GPS định vị.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 19, { animate: true });
          
          L.circle([latitude, longitude], {
            radius: accuracy || 15,
            color: '#0284c7',
            fillColor: '#38bdf8',
            fillOpacity: 0.2,
            weight: 1
          }).addTo(mapInstanceRef.current);

          L.circleMarker([latitude, longitude], {
            radius: 8,
            color: '#ffffff',
            fillColor: '#0284c7',
            fillOpacity: 1,
            weight: 3
          }).addTo(mapInstanceRef.current).bindPopup(`Vị trí GPS của bạn (Sai số: ±${Math.round(accuracy || 10)}m)`).openPopup();
        }
      },
      (err) => {
        alert(`Không thể lấy tọa độ GPS: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  // Action: Open Boundary Edit Modal
  const handleOpenBoundaryModal = (feat: ToBoundaryFeature) => {
    setSelectedBoundary(feat);
    setEditFormToName(feat.properties.to_dan_cu);
    setEditFormToTruong(feat.properties.to_truong);
    setEditFormPhone(feat.properties.so_dien_thoai || '');
    setEditFormDienTich(feat.properties.dien_tich_ha || 10);
    setEditFormColor(feat.properties.color || '#0284c7');
    setEditFormMoTa(feat.properties.mo_ta || '');
    setEditFormRawGeoJson(JSON.stringify(feat.geometry.coordinates[0], null, 2));
    setIsBoundaryModalOpen(true);
  };

  const handleSaveBoundaryModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoundary) return;

    let parsedCoords: [number, number][][] | undefined;
    try {
      if (editFormRawGeoJson.trim()) {
        const ring = JSON.parse(editFormRawGeoJson.trim());
        if (Array.isArray(ring) && ring.length >= 3) {
          parsedCoords = [ring];
        }
      }
    } catch (err) {
      alert('Cú pháp tọa độ GeoJSON chưa đúng định dạng mảng [[lng, lat], ...]');
      return;
    }

    updateBoundary(
      selectedBoundary.properties.id,
      {
        to_dan_cu: editFormToName.trim(),
        to_truong: editFormToTruong.trim(),
        so_dien_thoai: editFormPhone.trim(),
        dien_tich_ha: Number(editFormDienTich),
        color: editFormColor,
        fillColor: editFormColor,
        mo_ta: editFormMoTa.trim(),
      },
      parsedCoords
    );

    setIsBoundaryModalOpen(false);
    alert(`Đã lưu cập nhật cho phân vùng "${editFormToName.trim()}".`);
  };

  // Action: Delete Boundary with safe confirm
  const handleDeleteBoundary = (feat: ToBoundaryFeature) => {
    const confirmMsg = `CẢNH BÁO XÓA PHÂN VÙNG:\nBạn có chắc chắn muốn xóa phân vùng ranh giới "${feat.properties.to_dan_cu}" khỏi bản đồ số GIS không?\n\n(Lưu ý: Bạn luôn có thể khôi phục lại 8 tổ gốc bằng nút "Khôi Phục Ranh Giới Gốc")`;
    if (window.confirm(confirmMsg)) {
      deleteBoundary(feat.properties.id);
      setIsBoundaryModalOpen(false);
      setSelectedBoundary(null);
      if (editingBoundaryId === feat.properties.id || editingBoundaryName === feat.properties.to_dan_cu) {
        setIsEditingBoundaryMode(false);
        setEditingCoordinates([]);
      }
      alert(`Đã xóa thành công phân vùng ranh giới "${feat.properties.to_dan_cu}".`);
    }
  };

  // Action: Trigger Interactive Vertex Dragging
  const handleStartEditingBoundaryVertices = (feat: ToBoundaryFeature) => {
    setSelectedBoundary(feat);
    setEditingBoundaryId(feat.properties.id);
    setEditingBoundaryName(feat.properties.to_dan_cu);
    setEditingCoordinates(feat.geometry.coordinates[0]);
    setIsEditingBoundaryMode(true);
    setActiveGisMode('BOUNDARY');
  };

  // Action: Start Drawing New Boundary on Map
  const handleStartDrawingNewBoundary = () => {
    const nextIndex = boundariesData.features.length + 1;
    setAddFormName(`Tổ ${nextIndex}`);
    setAddFormToTruong('');
    setAddFormPhone('');
    setAddFormDienTich(12.5);
    setAddFormColor('#10b981');
    setAddFormMoTa('Phân vùng quy hoạch dân cư mới');
    setDrawnBoundaryPoints([]);
    setIsDrawingNewBoundaryMode(true);
    setActiveGisMode('BOUNDARY');
  };

  // Action: Save Drawn New Boundary
  const handleSaveDrawnNewBoundary = () => {
    if (drawnBoundaryPoints.length < 3) {
      alert('Vui lòng nhấp chuột ít nhất 3 điểm trên bản đồ để tạo thành đường bao phân vùng khép kín.');
      return;
    }

    const closedPoints = [...drawnBoundaryPoints];
    if (closedPoints[0][0] !== closedPoints[closedPoints.length - 1][0] || 
        closedPoints[0][1] !== closedPoints[closedPoints.length - 1][1]) {
      closedPoints.push(closedPoints[0]);
    }

    const calculatedAreaHa = Number((calculatePolygonAreaM2(closedPoints) / 10000).toFixed(1)) || addFormDienTich;

    const newFeature: ToBoundaryFeature = {
      type: 'Feature',
      properties: {
        id: `boundary-${Date.now()}`,
        to_dan_cu: addFormName.trim(),
        to_truong: addFormToTruong.trim() || 'Chưa phân công',
        so_dien_thoai: addFormPhone.trim() || '',
        so_ho: 0,
        so_dan: 0,
        dien_tich_ha: calculatedAreaHa,
        color: addFormColor,
        fillColor: addFormColor,
        fillOpacity: 0.35,
        mo_ta: addFormMoTa.trim()
      },
      geometry: {
        type: 'Polygon',
        coordinates: [closedPoints]
      }
    };

    addBoundary(newFeature);
    setIsDrawingNewBoundaryMode(false);
    setDrawnBoundaryPoints([]);
    setSelectedBoundary(newFeature);
    setSelectedToFilter(newFeature.properties.to_dan_cu);
    alert(`Đã khởi tạo thành công phân vùng mới "${newFeature.properties.to_dan_cu}" (${calculatedAreaHa} ha).`);
  };

  // Action: Open Household Management Modal
  const handleOpenHouseholdModal = (household: HoKhau) => {
    setSelectedHousehold(household);
    setFormTenChuHo(household.ten_chu_ho);
    setFormPhone(household.so_dien_thoai || '');
    setFormDiaChi(household.dia_chi);
    setFormToDanCu(household.to_dan_cu);
    setFormLoaiHo(household.loai_ho || 'chuan');
    setFormDienTichDat(household.dien_tich_dat_m2 || 120);
    setFormLat(household.lat || 15.9620);
    setFormLng(household.lng || 108.1965);
    setFormGhiChu(household.ghi_chu || '');
    setCopiedCoords(false);
    setIsHouseholdModalOpen(true);
  };

  const handleSaveHouseholdModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHousehold) return;

    await updateHouseholdSpatialData(selectedHousehold.ma_ho, {
      ten_chu_ho: formTenChuHo.trim(),
      so_dien_thoai: formPhone.trim(),
      dia_chi: formDiaChi.trim(),
      to_dan_cu: formToDanCu,
      loai_ho: formLoaiHo,
      dien_tich_dat_m2: Number(formDienTichDat),
      lat: Number(formLat),
      lng: Number(formLng),
      ghi_chu: formGhiChu.trim(),
    });

    setIsHouseholdModalOpen(false);
  };

  // Action: Start Drawing Household Parcel
  const handleStartDrawingParcel = (household: HoKhau) => {
    setDrawingHousehold(household);
    setDrawnPoints([]);
    setIsDrawingParcelMode(true);
    handleFlyToHousehold(household);
  };

  // Action: Save Drawn Parcel
  const handleSaveDrawnParcel = async () => {
    if (!drawingHousehold || drawnPoints.length < 3) {
      alert('Vui lòng nhấp ít nhất 3 điểm trên bản đồ để tạo thành một thửa đất khép kín.');
      return;
    }

    const closedPoints: [number, number][] = [...drawnPoints];
    if (closedPoints[0][0] !== closedPoints[closedPoints.length - 1][0] || 
        closedPoints[0][1] !== closedPoints[closedPoints.length - 1][1]) {
      closedPoints.push(closedPoints[0]);
    }

    const calculatedArea = calculatePolygonAreaM2(closedPoints);

    await updateHouseholdSpatialData(drawingHousehold.ma_ho, {
      polygon_thua_dat: closedPoints,
      dien_tich_dat_m2: calculatedArea,
    });

    setIsDrawingParcelMode(false);
    setDrawingHousehold(null);
    setDrawnPoints([]);
    alert(`Đã lưu thửa đất cho hộ ${drawingHousehold.ten_chu_ho} (Diện tích: ${calculatedArea} m²).`);
  };

  // Action: Copy Coordinates
  const handleCopyCoords = (lat: number, lng: number) => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Action: Export GeoJSON Backup
  const handleExportBackup = () => {
    const geoJsonStr = exportGisGeoJson();
    const blob = new Blob([geoJsonStr], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AnTrach_GIS_Backup_${new Date().toISOString().split('T')[0]}.geojson`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Action: Restore GeoJSON
  const handleFileRestoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = restoreGisGeoJson(content);
        if (res.success) {
          setRestoreStatusMsg({ type: 'success', msg: res.message });
          setTimeout(() => {
            setIsRestoreModalOpen(false);
            setRestoreStatusMsg(null);
          }, 2000);
        } else {
          setRestoreStatusMsg({ type: 'error', msg: res.message });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`relative w-full overflow-hidden ${isFullscreenMode ? 'fixed inset-0 z-50 bg-slate-900' : 'h-[calc(100vh-100px)] min-h-[600px] rounded-3xl border border-slate-300 shadow-xl'}`}>
      
      {/* 1. FULL CANVAS MAP */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* 2. TOP PRIMARY NAVIGATION & DUAL-MODULE SWITCHER */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Mode Switcher Tabs */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1 flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveGisMode('HOUSEHOLD')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black ${
              activeGisMode === 'HOUSEHOLD'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Quản Lý 614 Hộ Dân</span>
          </button>

          <button
            onClick={() => setActiveGisMode('BOUNDARY')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black ${
              activeGisMode === 'BOUNDARY'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Ranh Giới 8 Tổ</span>
          </button>

          <button
            onClick={() => setActiveGisMode('ALL')}
            className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
              activeGisMode === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Hiển thị đồng thời tất cả các lớp"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tổng Hợp</span>
          </button>
        </div>

        {/* Center: Map Base Layer Switcher */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-1 flex items-center gap-1 text-xs font-bold">
          {(Object.keys(TILE_LAYERS) as Array<keyof typeof TILE_LAYERS>).map((type) => (
            <button
              key={type}
              onClick={() => setCurrentMapType(type)}
              className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] ${
                currentMapType === type
                  ? 'bg-slate-900 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {TILE_LAYERS[type].shortName}
            </button>
          ))}
        </div>

        {/* Right: Layer Toggles, GPS & Fullscreen */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-1 flex items-center gap-1.5 text-xs font-bold">
          {activeGisMode !== 'BOUNDARY' && (
            <button
              onClick={() => setShowParcels(!showParcels)}
              className={`px-2 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                showParcels ? 'bg-amber-100 text-amber-800' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Bật/Tắt hiển thị thửa đất khuôn viên nhà"
            >
              {showParcels ? <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> : <Square className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Thửa Đất</span>
            </button>
          )}

          {activeGisMode !== 'BOUNDARY' && (
            <button
              onClick={() => setShowHouseholdMarkers(!showHouseholdMarkers)}
              className={`px-2 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                showHouseholdMarkers ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Bật/Tắt hiển thị ghim nhà"
            >
              {showHouseholdMarkers ? <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> : <Square className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Ghim Hộ</span>
            </button>
          )}

          <div className="h-3.5 w-px bg-slate-200" />

          {/* Device GPS */}
          <button
            onClick={handleGetDeviceLocation}
            className="p-1.5 rounded-xl hover:bg-sky-50 text-slate-700 hover:text-sky-700 transition-colors"
            title="Định vị GPS thực địa của bạn"
          >
            <Crosshair className="w-3.5 h-3.5 text-sky-600" />
          </button>

          {/* Reset Village View */}
          <button
            onClick={handleResetVillageView}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Toàn cảnh Thôn An Trạch"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreenMode(!isFullscreenMode)}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title={isFullscreenMode ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. CONTEXTUAL SECONDARY CONTROLS */}
      
      {/* MODULE 1: HOUSEHOLD CONTROLS */}
      {(activeGisMode === 'HOUSEHOLD' || activeGisMode === 'ALL') && (
        <div className="absolute top-16 left-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                isSidebarOpen ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Mở/Đóng Danh bạ Hộ Dân"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              <span className="text-[11px]">Danh Bạ ({filteredHouseholds.length})</span>
            </button>

            <div className="relative w-44 sm:w-56 md:w-64">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm chủ hộ, mã HK102..."
                className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-transparent text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 p-0.5 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto max-w-[92vw] sm:max-w-lg scrollbar-none py-0.5">
            {[
              { id: 'ALL', label: 'Tất Cả Hộ', color: '#0284c7' },
              { id: 'chuan', label: 'Hộ Chuẩn', color: '#0284c7' },
              { id: 'ho_ngheo', label: 'Hộ Nghèo', color: '#e11d48' },
              { id: 'chinh_sach', label: 'Chính Sách', color: '#9333ea' },
              { id: 'vung_ngap_lut', label: 'Vùng Lũ Lụt', color: '#d97706' },
              { id: 'kinh_doanh', label: 'Kinh Doanh', color: '#059669' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-xs transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-slate-900 text-white font-extrabold ring-1 ring-white/50'
                    : 'bg-white/95 backdrop-blur-md text-slate-700 hover:bg-white border border-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 2: BOUNDARY CONTROLS (QUẢN TRỊ RANH GIỚI 8 TỔ) */}
      {activeGisMode === 'BOUNDARY' && (
        <div className="absolute top-16 left-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
          {/* Drawer Opener for Boundaries & Quick Tổ Selection */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                isSidebarOpen ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
              title="Mở/Đóng Bảng Danh Sách Phân Vùng Ranh Giới"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              <span>Danh Sách 8 Tổ ({boundariesData.features.length})</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-1 overflow-x-auto max-w-sm sm:max-w-md scrollbar-none">
              <button
                onClick={() => {
                  setSelectedToFilter('ALL');
                  setSelectedBoundary(null);
                  handleResetVillageView();
                }}
                className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedToFilter === 'ALL'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Toàn Thôn
              </button>
              {boundariesData.features.map((f) => (
                <button
                  key={f.properties.id}
                  onClick={() => {
                    setSelectedToFilter(f.properties.to_dan_cu);
                    setSelectedBoundary(f);
                    const centroid = DEFAULT_TO_CENTROIDS[f.properties.to_dan_cu] || DEFAULT_TO_CENTROIDS['Tổ 1'];
                    mapInstanceRef.current?.flyTo([centroid.lat, centroid.lng], 16, { animate: true });
                  }}
                  className={`px-2 py-1 rounded-xl text-[10px] font-extrabold transition-all shrink-0 cursor-pointer ${
                    selectedToFilter === f.properties.to_dan_cu
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {f.properties.to_dan_cu}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTEXTUAL BOTTOM-LEFT ACTION DOCK */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-1 text-xs">
        
        {/* Actions for Boundary Mode */}
        {activeGisMode === 'BOUNDARY' && isAdmin && (
          <>
            <button
              onClick={handleStartDrawingNewBoundary}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all"
              title="Vẽ phân vùng ranh giới mới trực tiếp trên bản đồ"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Vẽ Phân Vùng Mới</span>
            </button>

            {selectedBoundary && (
              <button
                onClick={() => handleStartEditingBoundaryVertices(selectedBoundary)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                title="Kéo thả các đỉnh đa giác để chỉnh sửa ranh giới"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Sửa Đỉnh: {selectedBoundary.properties.to_dan_cu}</span>
              </button>
            )}

            {selectedBoundary && (
              <button
                onClick={() => handleDeleteBoundary(selectedBoundary)}
                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                title="Xóa phân vùng ranh giới đang chọn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Vùng</span>
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn khôi phục lại ranh giới 8 Tổ Dân Cư mặc định ban đầu không?')) {
                  resetBoundariesToDefault();
                  setIsEditingBoundaryMode(false);
                  setSelectedBoundary(null);
                  alert('Đã khôi phục lại ranh giới mặc định 8 tổ.');
                }
              }}
              className="px-2 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-rose-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
              title="Khôi phục lại ranh giới 8 tổ gốc"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ranh Giới Gốc</span>
            </button>
          </>
        )}

        {/* Global Export & Restore */}
        <button
          onClick={handleExportBackup}
          className="px-2.5 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
          title="Sao lưu dữ liệu GeoJSON"
        >
          <FileDown className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sao Lưu</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setIsRestoreModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-800 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
            title="Phục hồi từ file GeoJSON"
          >
            <FileUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phục Hồi</span>
          </button>
        )}
      </div>

      {/* 5. SLIDE-OUT LEFT DRAWER: HOUSEHOLDS (IN HOUSEHOLD MODE) OR BOUNDARIES (IN BOUNDARY MODE) */}
      {isSidebarOpen && (
        <div className="absolute top-28 left-3 bottom-14 z-30 w-72 sm:w-80 bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-left-5 duration-200">
          
          {/* Drawer in HOUSEHOLD Mode */}
          {activeGisMode !== 'BOUNDARY' ? (
            <>
              <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <h4 className="font-extrabold text-xs">Danh Bạ Hộ Dân ({filteredHouseholds.length})</h4>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredHouseholds.map((h) => {
                  const isSelected = selectedHousehold?.id === h.id;
                  const loaiConfig = LOAI_HO_CONFIG[h.loai_ho || 'chuan'] || LOAI_HO_CONFIG.chuan;
                  return (
                    <div
                      key={h.id}
                      onClick={() => handleFlyToHousehold(h)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs group ${
                        isSelected
                          ? 'bg-sky-50 border-sky-400 shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-sky-700 text-[10px] bg-white px-1 rounded border border-slate-200">
                            {h.ma_ho}
                          </span>
                          <strong className="text-slate-900 truncate font-extrabold">{h.ten_chu_ho}</strong>
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: loaiConfig.color }} />
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{h.to_dan_cu} • {h.dia_chi}</p>
                      </div>
                      <Navigation className="w-3 h-3 text-slate-400 group-hover:text-sky-600 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Drawer in BOUNDARY Mode (Ranh Giới 8 Tổ) */
            <>
              <div className="p-3 bg-indigo-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapIcon className="w-3.5 h-3.5 text-amber-300" />
                  <h4 className="font-extrabold text-xs">Danh Sách 8 Tổ ({boundariesData.features.length})</h4>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full text-slate-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {boundariesData.features.map((feat) => {
                  const props = feat.properties;
                  const isSelected = selectedBoundary?.properties.id === props.id;

                  return (
                    <div
                      key={props.id}
                      className={`p-3 rounded-2xl border transition-all text-xs space-y-2 ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-400 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div 
                        onClick={() => {
                          setSelectedBoundary(feat);
                          setSelectedToFilter(props.to_dan_cu);
                          const centroid = DEFAULT_TO_CENTROIDS[props.to_dan_cu] || DEFAULT_TO_CENTROIDS['Tổ 1'];
                          mapInstanceRef.current?.flyTo([centroid.lat, centroid.lng], 17, { animate: true });
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full shrink-0 border border-white shadow-xs" style={{ backgroundColor: props.color || '#0284c7' }} />
                            <strong className="text-slate-900 font-extrabold text-xs">{props.to_dan_cu}</strong>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            {props.dien_tich_ha} ha
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
                          <span>Tổ trưởng: <strong>{props.to_truong}</strong></span>
                          <span className="text-emerald-700 font-bold">{props.so_ho} hộ</span>
                        </div>
                      </div>

                      {/* Boundary Quick Actions */}
                      {isAdmin && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                          <button
                            onClick={() => handleStartEditingBoundaryVertices(feat)}
                            className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                            title="Kéo thả đỉnh để chỉnh sửa ranh giới"
                          >
                            <Edit3 className="w-3 h-3 text-amber-600" />
                            <span>Sửa Đỉnh</span>
                          </button>

                          <button
                            onClick={() => handleOpenBoundaryModal(feat)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                            title="Chỉnh sửa thông tin tổ trưởng, màu sắc, diện tích"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>Thuộc Tính</span>
                          </button>

                          <button
                            onClick={() => handleDeleteBoundary(feat)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Xóa phân vùng ranh giới này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {isAdmin && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <button
                    onClick={handleStartDrawingNewBoundary}
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm vùng mới</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('Khôi phục lại 8 tổ mặc định ban đầu?')) {
                        resetBoundariesToDefault();
                      }
                    }}
                    className="font-bold text-slate-500 hover:text-rose-700 flex items-center gap-0.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset 8 tổ</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 6. CAD DRAWING PARCEL ACTIVE STRIP (HOUSEHOLD) */}
      {isDrawingParcelMode && drawingHousehold && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-amber-500 text-slate-900 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-2.5 text-xs font-black animate-in fade-in">
          <Pentagon className="w-4 h-4 text-slate-900" />
          <span>Vẽ Thửa Đất ({drawnPoints.length} điểm): {drawingHousehold.ten_chu_ho}</span>
          <span className="text-[11px] font-semibold text-slate-900/80 hidden md:inline">• Nhấp chuột quanh góc sân/mái nhà</span>
          
          <button
            onClick={handleSaveDrawnParcel}
            className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 text-[11px] cursor-pointer"
          >
            Lưu Thửa Đất
          </button>

          <button
            onClick={() => {
              setIsDrawingParcelMode(false);
              setDrawingHousehold(null);
              setDrawnPoints([]);
            }}
            className="px-2.5 py-1 rounded-xl bg-white text-slate-900 font-black hover:bg-slate-100 text-[11px] cursor-pointer"
          >
            Hủy
          </button>
        </div>
      )}

      {/* 7. INTERACTIVE BOUNDARY VERTEX DRAGGING ACTIVE STRIP */}
      {isEditingBoundaryMode && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-amber-500 text-slate-900 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 text-xs font-black animate-in fade-in">
          <Move className="w-4 h-4 text-slate-900 animate-spin" />
          <span>Đang Sửa Ranh Giới ({editingCoordinates.length} đỉnh): <strong>{editingBoundaryName}</strong></span>
          <span className="text-[11px] font-semibold text-slate-900/80 hidden md:inline">• Kéo các nút tròn cam trên bản đồ</span>
          
          {selectedBoundary && (
            <button
              onClick={() => handleOpenBoundaryModal(selectedBoundary)}
              className="px-2.5 py-1 rounded-xl bg-indigo-900 text-white font-bold hover:bg-indigo-950 text-[11px] cursor-pointer"
            >
              Sửa Thuộc Tính
            </button>
          )}

          <button
            onClick={() => {
              setIsEditingBoundaryMode(false);
              setEditingCoordinates([]);
              alert(`Đã lưu cập nhật hình dạng ranh giới "${editingBoundaryName}".`);
            }}
            className="px-3 py-1 rounded-xl bg-slate-900 text-white font-black hover:bg-slate-800 text-[11px] cursor-pointer"
          >
            Hoàn Tất
          </button>
        </div>
      )}

      {/* 8. CAD DRAWING NEW BOUNDARY ACTIVE STRIP */}
      {isDrawingNewBoundaryMode && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-emerald-600 text-white rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 text-xs font-black animate-in fade-in">
          <Pentagon className="w-4 h-4 text-amber-300" />
          <span>Vẽ Phân Vùng Mới ({drawnBoundaryPoints.length} đỉnh)</span>
          <span className="text-[11px] font-normal text-emerald-100 hidden md:inline">• Nhấp các điểm mốc trên bản đồ</span>
          
          <input
            type="text"
            value={addFormName}
            onChange={(e) => setAddFormName(e.target.value)}
            placeholder="Tên tổ/vùng..."
            className="px-2 py-0.5 rounded-lg bg-white text-slate-900 font-bold text-xs w-28"
          />

          <button
            onClick={handleSaveDrawnNewBoundary}
            className="px-3 py-1 rounded-xl bg-white text-emerald-900 font-black hover:bg-emerald-50 text-[11px] cursor-pointer"
          >
            Lưu Phân Vùng
          </button>

          <button
            onClick={() => {
              setIsDrawingNewBoundaryMode(false);
              setDrawnBoundaryPoints([]);
            }}
            className="px-2.5 py-1 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 text-[11px] cursor-pointer"
          >
            Hủy
          </button>
        </div>
      )}

      {/* 9. PIN MODE INSTRUCTION STRIP */}
      {isPinModeActive && householdToPin && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-sky-600 text-white rounded-2xl shadow-2xl text-xs font-black flex items-center gap-2 animate-bounce">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span>Nhấp chuột lên vị trí ngôi nhà để ghim: {householdToPin.ten_chu_ho} ({householdToPin.ma_ho})</span>
          <button onClick={() => setIsPinModeActive(false)} className="ml-2 px-2 py-0.5 bg-white text-sky-900 rounded-lg">Hủy</button>
        </div>
      )}

      {/* 10. FLOATING BOTTOM-RIGHT INSPECTOR CARD FOR SELECTED HOUSEHOLD */}
      {selectedHousehold && activeGisMode !== 'BOUNDARY' && (
        <div className="absolute bottom-3 right-3 z-30 w-full max-w-sm bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-300 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center font-bold">
                <Home className="w-3 h-3" />
              </span>
              <div>
                <h4 className="font-black text-xs text-white">{selectedHousehold.ten_chu_ho}</h4>
                <span className="text-[10px] text-slate-300 font-mono">Mã: {selectedHousehold.ma_ho} • {selectedHousehold.to_dan_cu}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedHousehold(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 max-h-[340px] overflow-y-auto space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-lg border ${LOAI_HO_CONFIG[selectedHousehold.loai_ho || 'chuan']?.badge}`}>
                {LOAI_HO_CONFIG[selectedHousehold.loai_ho || 'chuan']?.label}
              </span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                Thửa đất: <strong>{selectedHousehold.dien_tich_dat_m2 || 120} m²</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Địa chỉ:</span>
                <strong className="text-slate-800 font-bold truncate block">{selectedHousehold.dia_chi}</strong>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Điện thoại:</span>
                <a href={`tel:${selectedHousehold.so_dien_thoai || ''}`} className="text-sky-700 font-bold flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3 text-sky-600" />
                  <span>{selectedHousehold.so_dien_thoai || 'Chưa cập nhật'}</span>
                </a>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                <h5 className="font-extrabold text-slate-900 text-[11px] flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-600" />
                  Nhân khẩu ({householdMembers.length} người)
                </h5>
              </div>

              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {householdMembers.map((m) => (
                  <div
                    key={m.id}
                    className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-1 text-[11px]"
                  >
                    <div className="min-w-0">
                      <strong className="text-slate-900 font-bold">{m.ho_ten}</strong>
                      <span className="text-[9px] px-1 py-0.2 ml-1 rounded bg-purple-100 text-purple-800 font-bold">
                        {m.quan_he_chu_ho}
                      </span>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {m.gioi_tinh} • Năm sinh: {m.nam_sinh || '---'} {m.so_cmnd_cccd ? `• CCCD: ${m.so_cmnd_cccd}` : ''}
                      </div>
                    </div>
                    {m.ma_the_bhyt && (
                      <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        BHYT: {m.ma_the_bhyt}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-1.5 flex-wrap">
              {isAdmin && (
                <button
                  onClick={() => handleOpenHouseholdModal(selectedHousehold)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3 h-3 text-sky-400" />
                  <span>Quản Lý Hộ</span>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => handleStartDrawingParcel(selectedHousehold)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Vẽ ranh giới thửa đất / khuôn viên ngôi nhà"
                >
                  <Pentagon className="w-3 h-3 text-amber-700" />
                  <span>Vẽ Thửa Đất</span>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => {
                    setHouseholdToPin(selectedHousehold);
                    setIsPinModeActive(true);
                  }}
                  className="px-2 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Ghim lại tọa độ GPS"
                >
                  <MapPin className="w-3 h-3 text-sky-600" />
                  <span>Ghim GPS</span>
                </button>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHousehold.lat || 15.9620},${selectedHousehold.lng || 108.1965}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1"
                title="Mở chỉ đường Google Maps"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 11. FLOATING BOTTOM-RIGHT INSPECTOR CARD FOR SELECTED BOUNDARY (IN BOUNDARY MODE) */}
      {selectedBoundary && activeGisMode === 'BOUNDARY' && (
        <div className="absolute bottom-3 right-3 z-30 w-full max-w-sm bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-indigo-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="px-4 py-3 bg-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-white shadow-xs" style={{ backgroundColor: selectedBoundary.properties.color || '#4f46e5' }}>
                <MapIcon className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-black text-sm text-white">{selectedBoundary.properties.to_dan_cu}</h4>
                <span className="text-[10px] text-indigo-200">Thôn An Trạch • Phân vùng quản lý</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedBoundary(null)}
              className="p-1 rounded-full text-indigo-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Tổ trưởng:</span>
                <strong className="text-slate-900 font-bold text-xs">{selectedBoundary.properties.to_truong}</strong>
                {selectedBoundary.properties.so_dien_thoai && (
                  <a href={`tel:${selectedBoundary.properties.so_dien_thoai}`} className="text-sky-700 font-bold flex items-center gap-1 mt-1 hover:underline">
                    <Phone className="w-3 h-3 text-sky-600" />
                    <span>{selectedBoundary.properties.so_dien_thoai}</span>
                  </a>
                )}
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Quy mô phân vùng:</span>
                <div className="text-slate-900 font-extrabold mt-0.5">
                  <span className="text-emerald-700 font-black">{selectedBoundary.properties.so_ho} hộ</span> • <span>{selectedBoundary.properties.so_dan} dân</span>
                </div>
                <span className="text-[10px] text-indigo-700 font-bold block mt-1">
                  Diện tích: {selectedBoundary.properties.dien_tich_ha} ha
                </span>
              </div>
            </div>

            {selectedBoundary.properties.mo_ta && (
              <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-slate-700">
                <span className="text-slate-400 text-[10px] block">Ghi chú đặc thù:</span>
                {selectedBoundary.properties.mo_ta}
              </div>
            )}

            {/* Actions for this Boundary */}
            {isAdmin && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                <button
                  onClick={() => handleStartEditingBoundaryVertices(selectedBoundary)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                  title="Kéo thả đỉnh để chỉnh sửa ranh giới trên bản đồ"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Đỉnh Đa Giác</span>
                </button>

                <button
                  onClick={() => handleOpenBoundaryModal(selectedBoundary)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>Thuộc Tính</span>
                </button>

                <button
                  onClick={() => handleDeleteBoundary(selectedBoundary)}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Xóa phân vùng ranh giới này khỏi bản đồ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Vùng</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: COMPREHENSIVE HOUSEHOLD SPATIAL MANAGER ================= */}
      {isHouseholdModalOpen && selectedHousehold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-sky-700 uppercase tracking-wide">Quản lý không gian hộ dân</span>
                <h3 className="font-black text-slate-900 text-base">
                  Hộ: {selectedHousehold.ten_chu_ho} ({selectedHousehold.ma_ho})
                </h3>
              </div>
              <button
                onClick={() => setIsHouseholdModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHouseholdModal} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên chủ hộ *</label>
                  <input
                    type="text"
                    value={formTenChuHo}
                    onChange={(e) => setFormTenChuHo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0905 xxx xxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổ Dân Cư</label>
                  <select
                    value={formToDanCu}
                    onChange={(e) => setFormToDanCu(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  >
                    {['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4', 'Tổ 5', 'Tổ 6', 'Tổ 7', 'Tổ 8'].map((to) => (
                      <option key={to} value={to}>{to}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phân loại đặc thù hộ *</label>
                  <select
                    value={formLoaiHo}
                    onChange={(e) => setFormLoaiHo(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  >
                    <option value="chuan">🟢 Hộ Chuẩn Thường Trú</option>
                    <option value="ho_ngheo">🔴 Hộ Nghèo / Cận Nghèo</option>
                    <option value="chinh_sach">🟣 Gia Đình Chính Sách</option>
                    <option value="vung_ngap_lut">🟡 Vùng Nguy Cơ Ngập Lũ (Ven Sông)</option>
                    <option value="kinh_doanh">🔵 Hộ Kinh Doanh / Làng Nghề</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={formDiaChi}
                    onChange={(e) => setFormDiaChi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Diện tích thửa đất (m²)</label>
                  <input
                    type="number"
                    value={formDienTichDat}
                    onChange={(e) => setFormDienTichDat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Tọa độ GPS WGS84</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCoords(formLat, formLng)}
                    className="text-[11px] text-sky-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    {copiedCoords ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCoords ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold">Vĩ độ (Latitude):</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formLat}
                      onChange={(e) => setFormLat(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold">Kinh độ (Longitude):</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formLng}
                      onChange={(e) => setFormLng(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú cứu trợ bão lũ / an sinh xã hội</label>
                <textarea
                  value={formGhiChu}
                  onChange={(e) => setFormGhiChu(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  placeholder="Ghi chú hoàn cảnh gia đình, sơ tán khẩn cấp..."
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://zalo.me/${formPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Nhắn Zalo</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHouseholdModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl gradient-gov text-white font-bold shadow-md cursor-pointer"
                  >
                    Lưu Không Gian Hộ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT & DELETE BOUNDARY ATTRIBUTES ================= */}
      {isBoundaryModalOpen && selectedBoundary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-indigo-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide">Quản lý ranh giới tổ</span>
                <h3 className="font-black text-white text-base">
                  Chỉnh Sửa: {selectedBoundary.properties.to_dan_cu}
                </h3>
              </div>
              <button
                onClick={() => setIsBoundaryModalOpen(false)}
                className="p-1.5 rounded-full text-indigo-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBoundaryModal} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Tổ / Phân vùng *</label>
                  <input
                    type="text"
                    value={editFormToName}
                    onChange={(e) => setEditFormToName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tổ trưởng / Phụ trách</label>
                  <input
                    type="text"
                    value={editFormToTruong}
                    onChange={(e) => setEditFormToTruong(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    value={editFormPhone}
                    onChange={(e) => setEditFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Diện tích vùng (Hecta)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editFormDienTich}
                    onChange={(e) => setEditFormDienTich(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Màu sắc hiển thị Polygon</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editFormColor}
                    onChange={(e) => setEditFormColor(e.target.value)}
                    className="w-10 h-9 rounded-xl border border-slate-200 p-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editFormColor}
                    onChange={(e) => setEditFormColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả đặc thù vùng / Ghi chú</label>
                <textarea
                  value={editFormMoTa}
                  onChange={(e) => setEditFormMoTa(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Tọa độ các đỉnh GeoJSON (WGS84 [lng, lat])</label>
                  <span className="text-[10px] text-slate-400">Định dạng JSON Ring</span>
                </div>
                <textarea
                  value={editFormRawGeoJson}
                  onChange={(e) => setEditFormRawGeoJson(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] leading-relaxed border border-slate-800"
                />
              </div>

              {/* Action Buttons: DELETE vs SAVE */}
              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDeleteBoundary(selectedBoundary)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold flex items-center gap-1.5 cursor-pointer border border-rose-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa Phân Vùng Này</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBoundaryModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESTORE GEOJSON BACKUP ================= */}
      {isRestoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <FileUp className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-base">Phục Hồi Dữ Liệu GIS GeoJSON</h3>
              </div>
              <button
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setRestoreStatusMsg(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed font-medium">
              Chọn file bản đồ sao lưu định dạng <strong>.geojson</strong> hoặc <strong>.json</strong> từ máy tính để phục hồi tọa độ vị trí cho 614 hộ gia đình Thôn An Trạch.
            </p>

            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 text-center space-y-2 transition-all">
              <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Chọn tệp tin sao lưu GeoJSON</div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".geojson,.json"
                onChange={handleFileRestoreChange}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            {restoreStatusMsg && (
              <div className={`p-3 rounded-xl font-bold text-xs ${
                restoreStatusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {restoreStatusMsg.msg}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIsRestoreModalOpen(false);
                  setRestoreStatusMsg(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
