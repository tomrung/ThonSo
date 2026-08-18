import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  Compass, 
  Layers, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sparkles, 
  Eye, 
  Sun, 
  Moon, 
  Droplets, 
  Wheat, 
  Info,
  CheckCircle2,
  ChevronRight,
  X
} from 'lucide-react';
import { SanXuatRecord } from '../types';
import { XU_DONG_POLYGONS_GEOJSON, PARCELS_GEOJSON, CANALS_GEOJSON } from '../data/anTrachAgriculturalGeoJson';

interface SanXuatGeo3DViewerProps {
  sanXuatList: SanXuatRecord[];
  selectedXuDong: string;
  selectedVariety: string;
  selectedOwnership: string;
  onSelectParcel: (record: SanXuatRecord) => void;
  selectedParcelId?: string | null;
}

export const SanXuatGeo3DViewer: React.FC<SanXuatGeo3DViewerProps> = ({
  sanXuatList,
  selectedXuDong,
  selectedVariety,
  selectedOwnership,
  onSelectParcel,
  selectedParcelId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Camera Controls State
  const [rotationX, setRotationX] = useState(55); // Pitch (degrees)
  const [rotationZ, setRotationZ] = useState(30); // Yaw / Orbit (degrees)
  const [zoom, setZoom] = useState(1.1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragModeRef = useRef<'rotate' | 'pan'>('rotate');

  // Simulation Controls State
  const [cropStage, setCropStage] = useState<'ma_non' | 'de_nhanh' | 'lam_dong' | 'chin_vang'>('de_nhanh');
  const [sunMode, setSunMode] = useState<'morning' | 'noon' | 'afternoon'>('afternoon');
  const [isWaterFlowing, setIsWaterFlowing] = useState(true);
  const [colorMode, setColorMode] = useState<'variety' | 'ownership' | 'yield'>('variety');
  const [hoveredParcel, setHoveredParcel] = useState<any | null>(null);

  // Growth Stage Parameters
  const cropStageParams = useMemo(() => {
    switch (cropStage) {
      case 'ma_non':
        return { height: 6, colorTint: '#4ade80', name: 'Mạ non (10 - 15 ngày)', desc: 'Lúa mới cấy, màu xanh mạ nõn chuối' };
      case 'de_nhanh':
        return { height: 16, colorTint: '#16a34a', name: 'Đẻ nhánh rộ (30 - 45 ngày)', desc: 'Lúa phát triển rực rỡ, lá xanh đậm mướt' };
      case 'lam_dong':
        return { height: 26, colorTint: '#84cc16', name: 'Làm đòng & Trổ bông (60 - 75 ngày)', desc: 'Thân lúa cao vươn đều, đòng non xanh mướt' };
      case 'chin_vang':
        return { height: 32, colorTint: '#eab308', name: 'Lúa chín vàng óng (95 - 105 ngày)', desc: 'Mặt ruộng chuyển màu vàng óng, chờ thu hoạch' };
    }
  }, [cropStage]);

  // Sun Light Parameters
  const sunParams = useMemo(() => {
    switch (sunMode) {
      case 'morning':
        return { ambient: 0.75, sunX: -0.6, sunY: -0.4, sunZ: 0.8, skyBg: '#f0fdf4' };
      case 'noon':
        return { ambient: 0.95, sunX: 0.1, sunY: 0.1, sunZ: 1.0, skyBg: '#f8fafc' };
      case 'afternoon':
        return { ambient: 0.82, sunX: 0.7, sunY: 0.3, sunZ: 0.6, skyBg: '#fefce8' };
    }
  }, [sunMode]);

  // Center coordinate bounds for 3D projection
  const bounds = useMemo(() => {
    const latMin = 15.9550, latMax = 15.9690;
    const lngMin = 108.1880, lngMax = 108.2060;
    return { latMin, latMax, lngMin, lngMax };
  }, []);

  // Filtered parcels
  const visibleParcels = useMemo(() => {
    return PARCELS_GEOJSON.features.filter((f) => {
      const p = f.properties;
      if (selectedXuDong !== 'ALL' && p.xu_dong !== selectedXuDong) return false;
      if (selectedVariety !== 'ALL' && p.giong_lua !== selectedVariety) return false;
      if (selectedOwnership === 'CHINH_CHU' && p.la_chinh_chu === false) return false;
      if (selectedOwnership === 'THUE_MUON' && p.la_chinh_chu !== false) return false;
      return true;
    });
  }, [selectedXuDong, selectedVariety, selectedOwnership]);

  // Main Render Loop (60 FPS Canvas WebGL-like 3D Engine)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let waterPhase = 0;

    const render = () => {
      waterPhase += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      // Clear & Sky Background
      ctx.fillStyle = sunParams.skyBg;
      ctx.fillRect(0, 0, width, height);

      // Grid background pattern
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.save();
      // Apply Camera Center Pan & Zoom
      ctx.translate(width / 2 + panX, height / 2 + panY);
      ctx.scale(zoom, zoom);

      // Convert Lon/Lat/Elevation to 3D Projected Screen (X, Y)
      const radX = (rotationX * Math.PI) / 180;
      const radZ = (rotationZ * Math.PI) / 180;
      const cosX = Math.cos(radX), sinX = Math.sin(radX);
      const cosZ = Math.cos(radZ), sinZ = Math.sin(radZ);

      const mapScale = Math.min(width, height) * 1.8;

      const project3D = (lng: number, lat: number, elev: number): [number, number] => {
        const nx = (lng - (bounds.lngMin + bounds.lngMax) / 2) / (bounds.lngMax - bounds.lngMin);
        const ny = (lat - (bounds.latMin + bounds.latMax) / 2) / (bounds.latMax - bounds.latMin);

        const worldX = nx * mapScale;
        const worldY = -ny * mapScale;
        const worldZ = elev;

        // Rotate around Z axis (Orbit)
        const rx = worldX * cosZ - worldY * sinZ;
        const ry = worldX * sinZ + worldY * cosZ;

        // Rotate around X axis (Pitch)
        const screenX = rx;
        const screenY = ry * cosX - worldZ * sinX;

        return [screenX, screenY];
      };

      // 1. Draw 5 Xứ Đồng Ground Boundaries (Floor Zones)
      XU_DONG_POLYGONS_GEOJSON.features.forEach((zone) => {
        const coords = zone.geometry.coordinates[0];
        if (coords.length < 3) return;

        ctx.beginPath();
        coords.forEach(([lng, lat], i) => {
          const [sx, sy] = project3D(lng, lat, 0);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.closePath();

        const isSelectedZone = selectedXuDong === 'ALL' || selectedXuDong === zone.properties.ten_xu_dong.replace('Xứ Đồng ', '');
        ctx.fillStyle = isSelectedZone ? `${zone.properties.fillColor}18` : '#f1f5f90a';
        ctx.fill();

        ctx.strokeStyle = isSelectedZone ? zone.properties.color : '#cbd5e1';
        ctx.lineWidth = isSelectedZone ? 2.5 : 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Zone Center Label
        const [clat, clng] = zone.properties.center;
        const [cx, cy] = project3D(clng, clat, 4);
        ctx.fillStyle = zone.properties.color;
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${zone.properties.ten_xu_dong} (${zone.properties.dien_tich_ha} ha)`, cx, cy);
      });

      // 2. Draw 3D Water Canals & Flow Ripple Animation
      CANALS_GEOJSON.features.forEach((canal) => {
        const coords = canal.geometry.coordinates;
        if (coords.length < 2) return;

        // Canal Bed Ground
        ctx.beginPath();
        coords.forEach(([lng, lat], i) => {
          const [sx, sy] = project3D(lng, lat, 1);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.strokeStyle = canal.properties.color;
        ctx.lineWidth = canal.properties.width * zoom * 1.6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Water Flow Waves
        if (isWaterFlowing) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = (canal.properties.width * zoom * 1.6) / 2.5;
          ctx.setLineDash([8, 12]);
          ctx.lineDashOffset = -waterPhase * 15;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 3. Draw 647 Extruded 3D Parcels (Rice Fields with Elevation)
      visibleParcels.forEach((parcel) => {
        const coords = parcel.geometry.coordinates[0];
        if (coords.length < 4) return;

        const isSelected = selectedParcelId === parcel.properties.id;
        const isHovered = hoveredParcel?.properties?.id === parcel.properties.id;

        // Base Parcel Color by Mode
        let baseColor = '#10b981';
        if (colorMode === 'variety') {
          if (parcel.properties.giong_lua === 'HG12') baseColor = '#10b981';
          else if (parcel.properties.giong_lua === 'HG244') baseColor = '#f59e0b';
          else baseColor = '#a855f7';
        } else if (colorMode === 'ownership') {
          baseColor = parcel.properties.la_chinh_chu ? '#10b981' : '#f97316';
        } else if (colorMode === 'yield') {
          baseColor = cropStageParams.colorTint;
        }

        const parcelHeight = (isSelected || isHovered ? cropStageParams.height + 8 : cropStageParams.height);

        // Project Base and Top Polygon Vertices
        const basePts: [number, number][] = coords.map(([lng, lat]) => project3D(lng, lat, 0));
        const topPts: [number, number][] = coords.map(([lng, lat]) => project3D(lng, lat, parcelHeight));

        // Side Walls (3D Extrusion Effect)
        for (let i = 0; i < coords.length - 1; i++) {
          const b1 = basePts[i], b2 = basePts[i + 1];
          const t1 = topPts[i], t2 = topPts[i + 1];

          ctx.beginPath();
          ctx.moveTo(b1[0], b1[1]);
          ctx.lineTo(b2[0], b2[1]);
          ctx.lineTo(t2[0], t2[1]);
          ctx.lineTo(t1[0], t1[1]);
          ctx.closePath();

          ctx.fillStyle = `${baseColor}99`; // Darker shaded side wall
          ctx.fill();
          ctx.strokeStyle = `${baseColor}cc`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Top Roof Surface (Crop Canopy)
        ctx.beginPath();
        topPts.forEach(([tx, ty], i) => {
          if (i === 0) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        });
        ctx.closePath();

        ctx.fillStyle = isSelected ? '#fbbf24' : isHovered ? '#38bdf8' : baseColor;
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#0f172a33';
        ctx.lineWidth = isSelected ? 2 : isHovered ? 1.5 : 0.6;
        ctx.stroke();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotationX, rotationZ, zoom, panX, panY, cropStage, cropStageParams, sunParams, isWaterFlowing, colorMode, visibleParcels, selectedParcelId, hoveredParcel]);

  // Mouse Handlers for 3D Orbit, Pan and Click
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragModeRef.current = e.button === 2 || e.shiftKey ? 'pan' : 'rotate';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    if (dragModeRef.current === 'rotate') {
      setRotationZ((prev) => (prev + dx * 0.4) % 360);
      setRotationX((prev) => Math.max(15, Math.min(85, prev - dy * 0.3)));
    } else {
      setPanX((prev) => prev + dx);
      setPanY((prev) => prev + dy);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.max(0.5, Math.min(3.5, prev + delta)));
  };

  // Reset Camera View
  const handleResetCamera = () => {
    setRotationX(55);
    setRotationZ(30);
    setZoom(1.1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="relative w-full h-[640px] lg:h-[700px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col select-none">
      
      {/* 3D Top Floating HUD Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Status Badge */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-lg text-xs flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-white">Geo3D Engine • An Trạch Smart Farm</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-emerald-400 font-bold">{visibleParcels.length} Thửa 3D</span>
        </div>

        {/* Right Simulation Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Color Mode Selector */}
          <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setColorMode('variety')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                colorMode === 'variety' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Giống lúa
            </button>
            <button
              onClick={() => setColorMode('ownership')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                colorMode === 'ownership' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Chính chủ
            </button>
            <button
              onClick={() => setColorMode('yield')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                colorMode === 'yield' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sinh trưởng
            </button>
          </div>

          {/* Water Flow Toggle */}
          <button
            onClick={() => setIsWaterFlowing(!isWaterFlowing)}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
              isWaterFlowing
                ? 'bg-sky-600 border-sky-400 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Bật/Tắt dòng chảy thủy nông 3D"
          >
            <Droplets className="w-4 h-4" />
            <span className="hidden sm:inline">Dòng Nước</span>
          </button>

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
            title="Khôi phục góc nhìn mặc định"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main 3D Canvas */}
      <canvas
        ref={canvasRef}
        width={1400}
        height={850}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Floating Season Timeline & Stage Simulator */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        
        {/* Stage Timeline Controller */}
        <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-1.5 pointer-events-auto text-xs overflow-x-auto">
          <span className="text-[11px] font-black text-slate-400 uppercase px-2">Giai đoạn:</span>
          
          <button
            onClick={() => setCropStage('ma_non')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              cropStage === 'ma_non'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🌱 Mạ non
          </button>

          <button
            onClick={() => setCropStage('de_nhanh')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              cropStage === 'de_nhanh'
                ? 'bg-emerald-600 text-white font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🌾 Đẻ nhánh
          </button>

          <button
            onClick={() => setCropStage('lam_dong')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              cropStage === 'lam_dong'
                ? 'bg-lime-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🌿 Làm đòng
          </button>

          <button
            onClick={() => setCropStage('chin_vang')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              cropStage === 'chin_vang'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🌾 Chín vàng
          </button>
        </div>

        {/* 3D Navigation Guide Tip */}
        <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Giữ chuột trái để xoay 3D • Shift + Kéo để dịch chuyển • Cuộn chuột để phóng to/thu nhỏ</span>
        </div>

      </div>

    </div>
  );
};
