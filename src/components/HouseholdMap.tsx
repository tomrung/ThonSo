import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  ExternalLink, 
  Check, 
  Layers, 
  Info,
  Maximize2,
  Save,
  Compass,
  Building2
} from 'lucide-react';
import { HoKhau } from '../types';
import { useData } from '../context/DataContext';

interface HouseholdMapProps {
  household: HoKhau;
  onSaved?: () => void;
}

// Tọa độ mẫu chuẩn của 8 Tổ Dân Cư Thôn An Trạch, Xã Hòa Tiến, Hòa Vang, Đà Nẵng
const DEFAULT_TO_COORDS: Record<string, { lat: number; lng: number }> = {
  'Tổ 1': { lat: 15.9625, lng: 108.1950 },
  'Tổ 2': { lat: 15.9632, lng: 108.1968 },
  'Tổ 3': { lat: 15.9610, lng: 108.1980 },
  'Tổ 4': { lat: 15.9600, lng: 108.1945 },
  'Tổ 5': { lat: 15.9640, lng: 108.1975 },
  'Tổ 6': { lat: 15.9590, lng: 108.1960 },
  'Tổ 7': { lat: 15.9650, lng: 108.1990 },
  'Tổ 8': { lat: 15.9580, lng: 108.1930 },
  'Chưa rõ tổ': { lat: 15.9620, lng: 108.1965 },
};

export const HouseholdMap: React.FC<HouseholdMapProps> = ({ household, onSaved }) => {
  const { updateHouseholdLocation } = useData();

  // Xác định tọa độ ban đầu: nếu đã có trong hộ thì dùng, nếu chưa có thì lấy theo Tổ
  const defaultCoord = DEFAULT_TO_COORDS[household.to_dan_cu] || DEFAULT_TO_COORDS['Chưa rõ tổ'];
  const [currentLat, setCurrentLat] = useState<number>(household.lat || defaultCoord.lat);
  const [currentLng, setCurrentLng] = useState<number>(household.lng || defaultCoord.lng);

  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(17);

  useEffect(() => {
    if (household.lat && household.lng) {
      setCurrentLat(household.lat);
      setCurrentLng(household.lng);
    } else {
      const coord = DEFAULT_TO_COORDS[household.to_dan_cu] || DEFAULT_TO_COORDS['Chưa rõ tổ'];
      setCurrentLat(coord.lat);
      setCurrentLng(coord.lng);
    }
  }, [household]);

  // Lấy vị trí GPS thực tế từ thiết bị (Điện thoại / Laptop)
  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLat(lat);
          setCurrentLng(lng);
          setIsGettingLocation(false);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          setIsGettingLocation(false);
          alert('Không thể truy cập GPS vị trí hiện tại. Vui lòng cấp quyền vị trí cho trình duyệt.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Thiết bị hoặc trình duyệt của bạn không hỗ trợ định vị GPS.');
    }
  };

  // Lưu tọa độ đã ghim vào cơ sở dữ liệu
  const handleSavePin = async () => {
    await updateHouseholdLocation(household.ma_ho, currentLat, currentLng);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onSaved) onSaved();
    }, 2000);
  };

  // URL nhúng OpenStreetMap tương tác
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.003}%2C${currentLat - 0.002}%2C${currentLng + 0.003}%2C${currentLat + 0.002}&layer=mapnik&marker=${currentLat}%2C${currentLng}`;

  // Link chỉ đường trực tiếp qua Google Maps
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${currentLat},${currentLng}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`;

  return (
    <div className="space-y-4">
      {/* Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <MapPin className="w-4 h-4 text-rose-600 animate-bounce" />
          <span>Vị Trí & Tọa Độ GPS Của Hộ</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Lấy GPS thiết bị */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold flex items-center gap-1 border border-sky-200/80 transition-colors shadow-2xs disabled:opacity-50"
            title="Lấy tọa độ GPS từ vị trí bạn đang đứng"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isGettingLocation ? 'animate-spin' : ''}`} />
            <span>{isGettingLocation ? 'Đang định vị...' : 'Lấy GPS của tôi'}</span>
          </button>

          {/* Mở Google Maps chỉ đường */}
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold flex items-center gap-1 border border-emerald-200/80 transition-colors shadow-2xs"
            title="Mở ứng dụng Google Maps để tìm đường đi đến nhà này"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Chỉ Đường</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Interactive Map Frame Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 h-64 sm:h-72">
        <iframe
          title="Bản đồ vị trí hộ gia đình"
          src={osmEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
        />

        {/* Floating Pin Card Indicator */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-slate-200/90 text-xs space-y-1 max-w-[200px] pointer-events-none">
          <div className="font-extrabold text-slate-900 flex items-center gap-1 truncate">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="truncate">{household.ten_chu_ho}</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {household.ma_ho} • {household.to_dan_cu}
          </div>
          <div className="text-[10px] font-mono font-semibold text-rose-700 truncate">
            {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
          </div>
        </div>

        {/* Micro Pin Adjuster Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-1">
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            Google Maps
          </a>
        </div>
      </div>

      {/* Manual GPS Inputs & Save Trigger */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Tọa độ kinh độ / vĩ độ (WGS84):</span>
          </div>
          {saveSuccess && (
            <span className="text-emerald-700 font-bold flex items-center gap-1 animate-in zoom-in-95">
              <Check className="w-3.5 h-3.5" /> Đã lưu vị trí GPS!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Vĩ độ (Latitude)</label>
            <input
              type="number"
              step="0.000001"
              value={currentLat}
              onChange={(e) => setCurrentLat(parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Kinh độ (Longitude)</label>
            <input
              type="number"
              step="0.000001"
              value={currentLng}
              onChange={(e) => setCurrentLng(parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-end">
            <button
              type="button"
              onClick={handleSavePin}
              className="w-full py-1.5 px-3 rounded-xl gradient-gov text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Ghim & Lưu Vị Trí</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-snug">
          💡 <strong className="text-slate-700">Mẹo cán bộ:</strong> Khi đi khảo sát thực địa tại Thôn An Trạch, bạn bấm nút <strong className="text-sky-700">"Lấy GPS của tôi"</strong> khi đứng trước nhà dân, sau đó bấm <strong className="text-sky-700">"Ghim & Lưu Vị Trí"</strong> để số hóa bản đồ địa chỉ.
        </p>
      </div>
    </div>
  );
};
