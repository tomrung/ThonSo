import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  MapPin, 
  Trash2, 
  Save, 
  RotateCcw, 
  Plus, 
  X, 
  Crosshair, 
  Navigation, 
  Wheat, 
  Layers, 
  Info,
  Edit3,
  Sliders,
  CheckCircle2,
  FileDown,
  Upload
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { XuDongGeoFeature, ParcelGeoFeature } from '../data/anTrachAgriculturalGeoJson';
import { calculatePolygonAreaM2, calculatePolygonCenter } from '../lib/utils';
import { AN_TRACH_CENTER } from '../data/anTrachGeoJsonData';

interface AgriSpatialEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'zone' | 'parcel';
  editingFeature?: XuDongGeoFeature | ParcelGeoFeature | null;
  defaultXuDong?: string;
}

export const AgriSpatialEditorModal: React.FC<AgriSpatialEditorModalProps> = ({
  isOpen,
  onClose,
  mode,
  editingFeature,
  defaultXuDong = 'Tổ 9',
}) => {
  const { 
    agriZonesGeoJson, 
    agriParcelsGeoJson, 
    addAgriZoneFeature, 
    updateAgriZoneFeature, 
    addAgriParcelFeature, 
    updateAgriParcelFeature,
    xuDongList,
    sanXuatList
  } = useData();
  const { currentUser } = useAuth();

  // Multi-point coordinates array: [lng, lat]
  const [points, setPoints] = useState<[number, number][]>([]);
  
  // Point input fields
  const [newLat, setNewLat] = useState<string>('');
  const [newLng, setNewLng] = useState<string>('');
  const [bulkText, setBulkText] = useState<string>('');
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState<string>('');

  // Zone Form Fields
  const [zoneId, setZoneId] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [zoneGiong, setZoneGiong] = useState('HG12 & HG244');
  const [zoneWater, setZoneWater] = useState('Trạm Bơm An Trạch 1');
  const [zoneTeam, setZoneTeam] = useState('Tổ Thủy Nông 1');
  const [zoneColor, setZoneColor] = useState('#10b981');

  // Parcel Form Fields
  const [parcelLoThua, setParcelLoThua] = useState('');
  const [parcelChuDat, setParcelChuDat] = useState('');
  const [parcelHoSanXuat, setParcelHoSanXuat] = useState('');
  const [parcelGiong, setParcelGiong] = useState('HG12');
  const [parcelXuDong, setParcelXuDong] = useState(defaultXuDong);
  const [parcelIsChinhChu, setParcelIsChinhChu] = useState(true);

  // Mini Map Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize data when opening modal
  useEffect(() => {
    if (!isOpen) return;

    if (editingFeature) {
      const coords = editingFeature.geometry.coordinates[0] || [];
      // Remove duplicate closing point for editing
      const cleanCoords = coords.length > 3 && coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1]
        ? coords.slice(0, -1)
        : coords;
      setPoints(cleanCoords);

      if (mode === 'zone') {
        const z = editingFeature as XuDongGeoFeature;
        setZoneId(z.properties.ma_xu_dong || z.id);
        setZoneName(z.properties.ten_xu_dong);
        setZoneGiong(z.properties.giong_chinh || 'HG12 & HG244');
        setZoneWater(z.properties.nguon_nuoc || 'Trạm Bơm An Trạch 1');
        setZoneTeam(z.properties.to_quan_ly || 'Tổ Thủy Nông 1');
        setZoneColor(z.properties.color || '#10b981');
      } else {
        const p = editingFeature as ParcelGeoFeature;
        setParcelLoThua(p.properties.lo_thua_dat);
        setParcelChuDat(p.properties.chu_dat);
        setParcelHoSanXuat(p.properties.ho_san_xuat);
        setParcelGiong(p.properties.giong_lua || 'HG12');
        setParcelXuDong(p.properties.xu_dong || defaultXuDong);
        setParcelIsChinhChu(p.properties.la_chinh_chu !== false);
      }
    } else {
      // New Feature Creation
      if (mode === 'zone') {
        const ma = `XD-${Date.now().toString(36).toUpperCase()}`;
        setZoneId(ma);
        setZoneName('Xứ Đồng Mới');
        setZoneGiong('HG12 & HG244');
        setZoneWater('Trạm Bơm An Trạch 1');
        setZoneTeam('Tổ Thủy Nông 1');
        setZoneColor('#10b981');
        // Seed default 4 points around center
        setPoints([
          [108.1930, 15.9640],
          [108.1980, 15.9640],
          [108.1980, 15.9600],
          [108.1930, 15.9600],
        ]);
      } else {
        setParcelLoThua('Lô Mới');
        setParcelChuDat('');
        setParcelHoSanXuat('');
        setParcelGiong('HG12');
        setParcelXuDong(defaultXuDong);
        setParcelIsChinhChu(true);
        // Seed default parcel points
        setPoints([
          [108.1950, 15.9630],
          [108.1960, 15.9630],
          [108.1960, 15.9620],
          [108.1950, 15.9620],
        ]);
      }
    }
  }, [isOpen, editingFeature, mode, defaultXuDong]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Small delay to ensure modal DOM is painted
    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const center: [number, number] = points.length > 0 
        ? calculatePolygonCenter(points) 
        : AN_TRACH_CENTER;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 17,
        zoomControl: true,
      });

      // Hybrid Satellite Basemap
      L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 21,
        attribution: 'Google Satellite',
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);

      // Click on Map to add point
      map.on('click', (e: L.LeafletMouseEvent) => {
        const lng = Number(e.latlng.lng.toFixed(6));
        const lat = Number(e.latlng.lat.toFixed(6));
        setPoints((prev) => [...prev, [lng, lat]]);
      });

      mapInstanceRef.current = map;
      redrawPolygon();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Redraw Polygon & Markers when points change
  const redrawPolygon = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    if (markersGroupRef.current) {
      markersGroupRef.current.clearLayers();
    }

    if (points.length === 0) return;

    // LatLngs for Leaflet: [lat, lng]
    const latLngs: [number, number][] = points.map((p) => [p[1], p[0]]);

    if (latLngs.length >= 3) {
      const polyColor = mode === 'zone' ? zoneColor : '#10b981';
      const poly = L.polygon(latLngs, {
        color: polyColor,
        weight: 3,
        fillColor: polyColor,
        fillOpacity: 0.35,
        dashArray: '4, 4',
      }).addTo(map);
      polygonLayerRef.current = poly;
    }

    // Add Vertex Markers with Vertex Index Tooltip
    points.forEach((pt, idx) => {
      const markerHtml = `
        <div style="background: white; border: 2px solid ${mode === 'zone' ? zoneColor : '#0284c7'}; color: #0f172a; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; box-shadow: 0 2px 6px rgba(0,0,0,0.4); cursor: pointer;">
          ${idx + 1}
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-vertex-marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([pt[1], pt[0]], { icon, draggable: true });

      marker.on('dragend', (e: any) => {
        const newPos = e.target.getLatLng();
        const updatedLng = Number(newPos.lng.toFixed(6));
        const updatedLat = Number(newPos.lat.toFixed(6));
        setPoints((prev) => {
          const next = [...prev];
          next[idx] = [updatedLng, updatedLat];
          return next;
        });
      });

      marker.bindTooltip(`Đỉnh ${idx + 1} (${pt[1].toFixed(5)}, ${pt[0].toFixed(5)}) - Kéo để dịch chuyển hoặc nhấp nút xóa`, {
        direction: 'top',
        className: 'text-xs font-bold font-mono',
      });

      if (markersGroupRef.current) {
        markersGroupRef.current.addLayer(marker);
      }
    });
  };

  useEffect(() => {
    redrawPolygon();
  }, [points, zoneColor, mode]);

  // Area Calculations
  const calculatedM2 = calculatePolygonAreaM2(points);
  const calculatedHa = Number((calculatedM2 / 10000).toFixed(2));

  // Action: Add Manual Coordinate Point
  const handleAddManualPoint = () => {
    const lat = parseFloat(newLat.trim());
    const lng = parseFloat(newLng.trim());
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Vui lòng nhập Vĩ độ (Lat: -90 đến 90) và Kinh độ (Lng: -180 đến 180) hợp lệ!');
      return;
    }
    setPoints((prev) => [...prev, [Number(lng.toFixed(6)), Number(lat.toFixed(6))]]);
    setNewLat('');
    setNewLng('');
  };

  // Action: Delete Single Point
  const handleDeletePoint = (index: number) => {
    setPoints((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Action: Get Device GPS
  const handleGetDeviceGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatusMsg('Thiết bị không hỗ trợ định vị GPS.');
      return;
    }
    setIsGpsLoading(true);
    setGpsStatusMsg('Đang thu nhận tín hiệu vệ tinh GPS...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setPoints((prev) => [...prev, [lng, lat]]);
        setIsGpsLoading(false);
        setGpsStatusMsg(`Đã thêm điểm GPS: ${lat}, ${lng} (Độ chính xác: ±${Math.round(pos.coords.accuracy)}m)`);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 18);
        }
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsStatusMsg(`Lỗi GPS: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  // Action: Parse Bulk Paste Coordinates
  const handleParseBulk = () => {
    if (!bulkText.trim()) return;
    try {
      const text = bulkText.trim();
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
                // Lat, Lng format
                parsedPoints.push([Number(num2.toFixed(6)), Number(num1.toFixed(6))]);
              } else {
                // Lng, Lat format
                parsedPoints.push([Number(num1.toFixed(6)), Number(num2.toFixed(6))]);
              }
            }
          }
        });
      }

      if (parsedPoints.length >= 3) {
        setPoints(parsedPoints);
        setShowBulkInput(false);
        setBulkText('');
        alert(`Đã nạp thành công ${parsedPoints.length} điểm tọa độ vào đa giác.`);
        if (mapInstanceRef.current) {
          const center = calculatePolygonCenter(parsedPoints);
          mapInstanceRef.current.flyTo(center, 17);
        }
      } else {
        alert('Cần ít nhất 3 điểm tọa độ hợp lệ để tạo thành đa giác khép kín!');
      }
    } catch (e: any) {
      alert(`Lỗi phân tích tọa độ: ${e.message}`);
    }
  };

  // Action: Save Polygon Feature
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (points.length < 3) {
      alert('Vui lòng tạo ít nhất 3 điểm tọa độ để xác định ranh giới đa giác khép kín!');
      return;
    }

    // Auto-close polygon: Ensure last point equals first point
    const closedCoords = [...points];
    const first = closedCoords[0];
    const last = closedCoords[closedCoords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      closedCoords.push([first[0], first[1]]);
    }

    const center = calculatePolygonCenter(points);

    if (mode === 'zone') {
      if (!zoneName.trim()) {
        alert('Vui lòng nhập tên xứ đồng!');
        return;
      }

      const featId = editingFeature ? editingFeature.id : `xd-${Date.now()}`;
      const newZoneFeat: XuDongGeoFeature = {
        type: 'Feature',
        id: featId,
        properties: {
          id: featId,
          ma_xu_dong: zoneId.trim(),
          ten_xu_dong: zoneName.trim(),
          dien_tich_m2: calculatedM2,
          dien_tich_ha: calculatedHa,
          so_thua: editingFeature ? (editingFeature as XuDongGeoFeature).properties.so_thua : 50,
          cac_lo: editingFeature ? (editingFeature as XuDongGeoFeature).properties.cac_lo : 'Lô A - Lô B',
          giong_chinh: zoneGiong.trim(),
          nguon_nuoc: zoneWater.trim(),
          to_quan_ly: zoneTeam.trim(),
          color: zoneColor,
          fillColor: zoneColor,
          fillOpacity: 0.35,
          center,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [closedCoords],
        },
      };

      if (editingFeature) {
        updateAgriZoneFeature(featId, newZoneFeat.properties, [closedCoords]);
        alert(`Đã cập nhật thành công tọa độ đa điểm xứ đồng "${zoneName.trim()}" (${calculatedHa} ha)!`);
      } else {
        addAgriZoneFeature(newZoneFeat);
        alert(`Đã tạo mới thành công xứ đồng đa điểm "${zoneName.trim()}" (${calculatedHa} ha)!`);
      }
    } else {
      // Parcel Mode
      if (!parcelLoThua.trim() || !parcelChuDat.trim()) {
        alert('Vui lòng nhập số hiệu lô thửa và tên chủ đất!');
        return;
      }

      const featId = editingFeature ? editingFeature.id : `thua-${Date.now()}`;
      const newParcelFeat: ParcelGeoFeature = {
        type: 'Feature',
        id: featId,
        properties: {
          id: featId,
          stt: editingFeature ? (editingFeature as ParcelGeoFeature).properties.stt : agriParcelsGeoJson.features.length + 1,
          xu_dong: parcelXuDong,
          lo_thua_dat: parcelLoThua.trim(),
          chu_dat: parcelChuDat.trim().toUpperCase(),
          ho_san_xuat: (parcelHoSanXuat || parcelChuDat).trim().toUpperCase(),
          la_chinh_chu: parcelIsChinhChu,
          giong_lua: parcelGiong,
          dien_tich_m2: calculatedM2,
          giong_cap_kg: Math.round((calculatedM2 / 500) * 2.5),
          dot_phan_bo: 'Đông Xuân 2025-2026',
          to_dan_cu: 'Tổ 1',
          ky_nhan: 'Đã nhận giống HTX',
          center,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [closedCoords],
        },
      };

      if (editingFeature) {
        updateAgriParcelFeature(featId, newParcelFeat.properties, [closedCoords]);
        alert(`Đã cập nhật thành công hình học đa điểm Thửa đất ${parcelLoThua.trim()} (${calculatedM2} m²)!`);
      } else {
        addAgriParcelFeature(newParcelFeat);
        alert(`Đã tạo mới thành công Thửa đất đa điểm ${parcelLoThua.trim()} (${calculatedM2} m²)!`);
      }
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-6xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`p-2.5 rounded-2xl ${mode === 'zone' ? 'bg-teal-50 text-teal-700' : 'bg-emerald-50 text-emerald-700'}`}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>{editingFeature ? 'Biên Tập Tọa Độ Đa Điểm GIS' : 'Khởi Tạo Đa Giác Đa Điểm Mới'}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                  {mode === 'zone' ? 'Xứ Đồng Lúa' : 'Thửa Ruộng'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhấp trực tiếp trên bản đồ vệ tinh để định vị các đỉnh thửa đất, tự động khép góc và tính diện tích chuẩn GIS.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          
          {/* Main Grid: Form Inputs (Left 5 Cols) vs Interactive Mini Map (Right 7 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Col: Metadata & Coordinate Points List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
              
              {/* Feature Metadata Fields */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Thông Tin Thuộc Tính {mode === 'zone' ? 'Xứ Đồng' : 'Thửa Đất'}
                </span>

                {mode === 'zone' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Mã Xứ Đồng</label>
                      <input
                        type="text"
                        required
                        value={zoneId}
                        onChange={(e) => setZoneId(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Tên Xứ Đồng</label>
                      <input
                        type="text"
                        required
                        value={zoneName}
                        onChange={(e) => setZoneName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Giống Chủ Đạo</label>
                      <input
                        type="text"
                        value={zoneGiong}
                        onChange={(e) => setZoneGiong(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Màu Nhận Diện</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={zoneColor}
                          onChange={(e) => setZoneColor(e.target.value)}
                          className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={zoneColor}
                          onChange={(e) => setZoneColor(e.target.value)}
                          className="w-full px-2 py-1 rounded-lg border border-slate-300 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Lô / Thửa Đất</label>
                      <input
                        type="text"
                        required
                        value={parcelLoThua}
                        onChange={(e) => setParcelLoThua(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Xứ Đồng</label>
                      <select
                        value={parcelXuDong}
                        onChange={(e) => setParcelXuDong(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-xs bg-white"
                      >
                        {xuDongList.map((x) => (
                          <option key={x.ma_xu_dong} value={x.ten_xu_dong.replace('Xứ Đồng ', '')}>
                            {x.ten_xu_dong}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Chủ Đất (QSDĐ)</label>
                      <input
                        type="text"
                        required
                        value={parcelChuDat}
                        onChange={(e) => setParcelChuDat(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold uppercase"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-0.5">Hộ Canh Tác</label>
                      <input
                        type="text"
                        value={parcelHoSanXuat}
                        onChange={(e) => setParcelHoSanXuat(e.target.value)}
                        placeholder="Để trống nếu chính chủ"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Coordinates List & GPS Tools */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Danh Sách Tọa Độ Đa Điểm ({points.length} đỉnh)</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleGetDeviceGPS}
                      disabled={isGpsLoading}
                      className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[10px] flex items-center gap-1 border border-teal-200 cursor-pointer"
                    >
                      <Crosshair className="w-3 h-3" />
                      <span>{isGpsLoading ? 'Đang đọc...' : 'GPS'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowBulkInput(!showBulkInput)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Dán Tọa Độ</span>
                    </button>
                  </div>
                </div>

                {gpsStatusMsg && (
                  <div className="text-[10px] text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-200">
                    {gpsStatusMsg}
                  </div>
                )}

                {/* Bulk Paste Dialog */}
                {showBulkInput && (
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                    <label className="text-[11px] font-bold text-purple-900 block">
                      Dán danh sách tọa độ [[lng, lat], ...] hoặc Lat Lng:
                    </label>
                    <textarea
                      rows={3}
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder="VD: [[108.192, 15.967], [108.199, 15.967], [108.199, 15.962]]"
                      className="w-full p-2 rounded-lg border border-purple-300 font-mono text-[10px] bg-white"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowBulkInput(false)}
                        className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-white text-xs font-bold cursor-pointer"
                      >
                        Đóng
                      </button>
                      <button
                        type="button"
                        onClick={handleParseBulk}
                        className="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold text-xs cursor-pointer"
                      >
                        Nạp Tọa Độ
                      </button>
                    </div>
                  </div>
                )}

                {/* Manual Lat/Lng Add Input */}
                <div className="flex items-center gap-1.5 text-xs">
                  <input
                    type="number"
                    step="any"
                    placeholder="Vĩ độ (Lat)"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Kinh độ (Lng)"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualPoint}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm</span>
                  </button>
                </div>

                {/* Vertex Table */}
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-600 font-extrabold sticky top-0">
                      <tr>
                        <th className="py-1.5 px-2.5">Đỉnh</th>
                        <th className="py-1.5 px-2">Vĩ độ (Lat)</th>
                        <th className="py-1.5 px-2">Kinh độ (Lng)</th>
                        <th className="py-1.5 px-2 text-right">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {points.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400 font-sans">
                            Chưa có điểm tọa độ. Hãy nhấp trực tiếp trên bản đồ vệ tinh để chấm điểm.
                          </td>
                        </tr>
                      ) : (
                        points.map((pt, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 font-bold text-teal-700">Đỉnh {idx + 1}</td>
                            <td className="py-1.5 px-2 text-slate-700">{pt[1].toFixed(6)}</td>
                            <td className="py-1.5 px-2 text-slate-700">{pt[0].toFixed(6)}</td>
                            <td className="py-1.5 px-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeletePoint(idx)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

            {/* Right Col: Live Interactive Satellite Map (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-600" />
                  <span>Bản Đồ Vệ Tinh Trực Quan Thôn An Trạch</span>
                </span>
                <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200">
                  Nhấp vào bản đồ để chấm đỉnh • Kéo đỉnh để nắn góc
                </span>
              </div>

              {/* Leaflet Map Canvas */}
              <div 
                ref={mapContainerRef} 
                className="w-full h-80 sm:h-96 rounded-2xl border border-slate-300 shadow-inner overflow-hidden relative z-0"
              />

              {/* Area Calculator Box */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-300 block text-[10px] font-bold">Diện Tích Đa Giác Tính Toán:</span>
                  <strong className="text-base text-teal-300 font-mono font-black">
                    {calculatedHa} Hecta ({calculatedM2.toLocaleString('vi-VN')} m²)
                  </strong>
                </div>
                <div className="text-right text-[11px] text-slate-300 font-medium">
                  <div>Số đỉnh: <strong className="text-white">{points.length} điểm</strong></div>
                  <div>Tâm tọa độ: <strong className="text-white">{calculatePolygonCenter(points).join(', ')}</strong></div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer text-xs"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{editingFeature ? 'Lưu Cập Nhật Tọa Độ Đa Điểm' : 'Lưu Đa Giác Mới Vào Bản Đồ'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
