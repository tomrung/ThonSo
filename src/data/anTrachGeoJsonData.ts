import { HoKhau, NhanKhau } from '../types';

// Tọa độ trung tâm Thôn An Trạch, Xã Hòa Tiến, Huyện Hòa Vang, TP Đà Nẵng
export const AN_TRACH_CENTER: [number, number] = [15.9620, 108.1965];
export const DEFAULT_MAP_ZOOM = 16;

export interface ToBoundaryFeature {
  type: 'Feature';
  properties: {
    id: string;
    to_dan_cu: string;
    to_truong: string;
    so_dien_thoai: string;
    so_ho: number;
    so_dan: number;
    dien_tich_ha: number;
    color: string;
    fillColor: string;
    fillOpacity: number;
    mo_ta: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][]; // GeoJSON [lng, lat]
  };
}

export interface VillageGeoJsonData {
  type: 'FeatureCollection';
  features: ToBoundaryFeature[];
}

// Ranh giới Polygon thực tế của 8 Tổ Dân Cư Thôn An Trạch
export const AN_TRACH_TO_BOUNDARIES_GEOJSON: VillageGeoJsonData = {
  type: 'FeatureCollection',
  features: [
    // Tổ 1 (Khu vực phía Bắc ven đường liên thôn)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-1',
        to_dan_cu: 'Tổ 1',
        to_truong: 'Nguyễn Văn An',
        so_dien_thoai: '0905 111 001',
        so_ho: 82,
        so_dan: 305,
        dien_tich_ha: 14.5,
        color: '#ef4444',
        fillColor: '#f87171',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực cụm dân cư phía Bắc ven sông Yên và trục đường chính ĐH4.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1930, 15.9645],
          [108.1965, 15.9655],
          [108.1975, 15.9635],
          [108.1940, 15.9625],
          [108.1930, 15.9645]
        ]]
      }
    },
    // Tổ 2 (Khu vực trung tâm Đình Làng An Trạch & Nhà Văn Hóa)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-2',
        to_dan_cu: 'Tổ 2',
        to_truong: 'Đoàn Thanh Niên (Phụ trách)',
        so_dien_thoai: '0933 445 566',
        so_ho: 76,
        so_dan: 288,
        dien_tich_ha: 12.8,
        color: '#f97316',
        fillColor: '#fb923c',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực trung tâm Đình Làng An Trạch, Nhà Văn Hóa thôn và Chợ Cũ.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1965, 15.9655],
          [108.2000, 15.9660],
          [108.2010, 15.9638],
          [108.1975, 15.9635],
          [108.1965, 15.9655]
        ]]
      }
    },
    // Tổ 3 (Khu vực phía Đông Bắc giáp cánh đồng lúa)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-3',
        to_dan_cu: 'Tổ 3',
        to_truong: 'Lê Đình Bình',
        so_dien_thoai: '0905 111 003',
        so_ho: 79,
        so_dan: 294,
        dien_tich_ha: 16.2,
        color: '#eab308',
        fillColor: '#facc15',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực phía Đông Bắc tiếp giáp đồng lúa hữu cơ và vùng gò đồi.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.2000, 15.9660],
          [108.2035, 15.9650],
          [108.2030, 15.9615],
          [108.1995, 15.9620],
          [108.2000, 15.9660]
        ]]
      }
    },
    // Tổ 4 (Khu vực Tây Nam ven đường trục chính)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-4',
        to_dan_cu: 'Tổ 4',
        to_truong: 'Trần Văn Cường',
        so_dien_thoai: '0905 111 004',
        so_ho: 74,
        so_dan: 280,
        dien_tich_ha: 13.6,
        color: '#10b981',
        fillColor: '#34d399',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực dân cư dọc tuyến bê tông liên tổ 4 - tổ 5 đang đề xuất mở rộng.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1925, 15.9625],
          [108.1955, 15.9628],
          [108.1950, 15.9595],
          [108.1920, 15.9600],
          [108.1925, 15.9625]
        ]]
      }
    },
    // Tổ 5 (Khu vực Trung tâm Đông)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-5',
        to_dan_cu: 'Tổ 5',
        to_truong: 'Ngô Thị Kim Dung',
        so_dien_thoai: '0905 111 005',
        so_ho: 80,
        so_dan: 302,
        dien_tich_ha: 15.0,
        color: '#06b6d4',
        fillColor: '#22d3ee',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực mật độ dân cư cao, gần Trạm Bơm tưới tiêu và trường Mầm non.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1955, 15.9628],
          [108.1995, 15.9620],
          [108.1990, 15.9590],
          [108.1950, 15.9595],
          [108.1955, 15.9628]
        ]]
      }
    },
    // Tổ 6 (Khu vực phía Nam giáp đê sông)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-6',
        to_dan_cu: 'Tổ 6',
        to_truong: 'Hoàng Văn Em',
        so_dien_thoai: '0905 111 006',
        so_ho: 72,
        so_dan: 275,
        dien_tich_ha: 11.9,
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực ven đê bao sông Yên, điểm trọng yếu phòng chống thiên tai bão lũ.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1945, 15.9595],
          [108.1985, 15.9590],
          [108.1975, 15.9565],
          [108.1935, 15.9570],
          [108.1945, 15.9595]
        ]]
      }
    },
    // Tổ 7 (Khu vực Đông Nam giáp ranh thôn Lệ Sơn)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-7',
        to_dan_cu: 'Tổ 7',
        to_truong: 'Võ Văn Giàu',
        so_dien_thoai: '0905 111 007',
        so_ho: 75,
        so_dan: 286,
        dien_tich_ha: 14.1,
        color: '#8b5cf6',
        fillColor: '#a78bfa',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực giáp ranh Thôn Lệ Sơn, có nhiều hộ sản xuất kinh doanh dịch vụ.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1990, 15.9615],
          [108.2030, 15.9605],
          [108.2020, 15.9570],
          [108.1980, 15.9575],
          [108.1990, 15.9615]
        ]]
      }
    },
    // Tổ 8 (Khu vực Tây Nam giáp vùng trũng ven sông)
    {
      type: 'Feature',
      properties: {
        id: 'boundary-to-8',
        to_dan_cu: 'Tổ 8',
        to_truong: 'Đinh Thị Hạnh',
        so_dien_thoai: '0905 111 008',
        so_ho: 76,
        so_dan: 278,
        dien_tich_ha: 13.4,
        color: '#ec4899',
        fillColor: '#f472b6',
        fillOpacity: 0.25,
        mo_ta: 'Khu vực làng nghề truyền thống, cụm dân cư đoàn kết và văn hóa gia đình.'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1915, 15.9600],
          [108.1945, 15.9595],
          [108.1935, 15.9570],
          [108.1905, 15.9575],
          [108.1915, 15.9600]
        ]]
      }
    }
  ]
};

// Ranh giới bao quanh toàn Thôn An Trạch (Polygon Outer Boundary)
export const AN_TRACH_OUTER_BOUNDARY_GEOJSON = {
  type: 'Feature',
  properties: {
    name: 'Toàn Thôn An Trạch',
    xa: 'Xã Hòa Tiến',
    huyen: 'Huyện Hòa Vang',
    thanh_pho: 'Thành phố Đà Nẵng',
    tong_so_ho: 614,
    tong_nhan_khau: 2308,
    tong_dien_tich_ha: 111.5
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [108.1905, 15.9575],
      [108.1925, 15.9625],
      [108.1930, 15.9645],
      [108.1965, 15.9655],
      [108.2000, 15.9660],
      [108.2035, 15.9650],
      [108.2030, 15.9605],
      [108.2020, 15.9570],
      [108.1975, 15.9565],
      [108.1905, 15.9575]
    ]]
  }
};

// Hàm chuyển đổi danh sách Hộ Khẩu thành GeoJSON FeatureCollection Points
export const convertHouseholdsToGeoJson = (households: HoKhau[], residents: NhanKhau[]) => {
  const features = households.map((h) => {
    const toCoord = DEFAULT_TO_CENTROIDS[h.to_dan_cu] || DEFAULT_TO_CENTROIDS['Tổ 1'];
    // Nếu chưa có lat/lng chính xác thì phân bố tản nhẹ quanh tâm tổ
    const lat = h.lat || (toCoord.lat + (Math.random() - 0.5) * 0.003);
    const lng = h.lng || (toCoord.lng + (Math.random() - 0.5) * 0.003);

    const members = residents.filter((r) => r.ma_ho === h.ma_ho);

    return {
      type: 'Feature',
      properties: {
        id: h.id,
        ma_ho: h.ma_ho,
        ten_chu_ho: h.ten_chu_ho,
        so_cmnd_chu_ho: h.so_cmnd_chu_ho,
        so_dien_thoai: h.so_dien_thoai,
        dia_chi: h.dia_chi,
        to_dan_cu: h.to_dan_cu,
        so_thanh_vien: members.length || 1,
        lat,
        lng,
        thanh_vien_list: members.map((m) => ({
          id: m.id,
          ho_ten: m.ho_ten,
          quan_he_chu_ho: m.quan_he_chu_ho,
          gioi_tinh: m.gioi_tinh,
          nam_sinh: m.nam_sinh,
          ngay_sinh: m.ngay_thang_nam_sinh,
          so_cccd: m.so_cmnd_cccd,
          ma_bhyt: m.ma_the_bhyt,
          doi_tuong_dac_thu: m.doi_tuong_dac_thu,
        }))
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, lat] // GeoJSON is [lng, lat]
      }
    };
  });

  return {
    type: 'FeatureCollection',
    metadata: {
      title: 'Dữ liệu Không Gian Địa Lý GIS 614 Hộ Gia Đình Thôn An Trạch',
      exported_at: new Date().toISOString(),
      source: 'Hệ thống Quản Trị Dân Cư Số Thôn An Trạch (Supabase GIS PostGIS)',
      total_households: households.length
    },
    features
  };
};

export const DEFAULT_TO_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  'Tổ 1': { lat: 15.9640, lng: 108.1950 },
  'Tổ 2': { lat: 15.9645, lng: 108.1985 },
  'Tổ 3': { lat: 15.9635, lng: 108.2015 },
  'Tổ 4': { lat: 15.9610, lng: 108.1935 },
  'Tổ 5': { lat: 15.9605, lng: 108.1970 },
  'Tổ 6': { lat: 15.9580, lng: 108.1960 },
  'Tổ 7': { lat: 15.9590, lng: 108.2000 },
  'Tổ 8': { lat: 15.9585, lng: 108.1925 },
  'Chưa rõ tổ': { lat: 15.9620, lng: 108.1965 }
};
