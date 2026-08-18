// Dữ liệu GeoJSON Bản Đồ Sản Xuất Nông Nghiệp Thôn An Trạch (Vụ Đông Xuân 2025 - 2026)
// Tự động sinh đồng bộ từ sanXuatData.ts và hệ tọa độ thực địa An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng

export interface XuDongGeoFeature {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    ma_xu_dong: string;
    ten_xu_dong: string;
    dien_tich_m2: number;
    dien_tich_ha: number;
    so_thua: number;
    cac_lo: string;
    giong_chinh: string;
    nguon_nuoc: string;
    to_quan_ly: string;
    color: string;
    fillColor: string;
    fillOpacity: number;
    center: [number, number]; // [lat, lng]
  };
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][]; // [lng, lat]
  };
}

export interface ParcelGeoFeature {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    stt: number;
    xu_dong: string;
    lo_thua_dat: string;
    chu_dat: string;
    ho_san_xuat: string;
    la_chinh_chu: boolean;
    giong_lua: string;
    dien_tich_m2: number;
    giong_cap_kg: number;
    dot_phan_bo: string;
    to_dan_cu: string;
    ky_nhan: string;
    center: [number, number]; // [lat, lng]
  };
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][]; // [lng, lat]
  };
}

export interface CanalGeoFeature {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    ten_kenh: string;
    loai: 'kenh_chinh' | 'kenh_nhanh';
    chieu_dai_m: number;
    luu_luong_m3s: number;
    cap_nuoc: string;
    color: string;
    width: number;
  };
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [lng, lat]
  };
}

export interface IrrigationPointFeature {
  type: 'Feature';
  id: string;
  properties: {
    id: string;
    ten_tram: string;
    loai: 'tram_bom' | 'cong_xa';
    cong_suat: string;
    trang_thai: string;
    phu_trach: string;
    sdt: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

// 5 Xứ Đồng Polygons GeoJSON
export const XU_DONG_POLYGONS_GEOJSON: { type: 'FeatureCollection'; features: XuDongGeoFeature[] } = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'xd-to-9',
      properties: {
        id: 'xd-to-9',
        ma_xu_dong: 'XD-TO9',
        ten_xu_dong: 'Xứ Đồng Tổ 9',
        dien_tich_m2: 229780,
        dien_tich_ha: 22.98,
        so_thua: 324,
        cac_lo: 'Lô 1 - Lô 19',
        giong_chinh: 'HG12 & HG244',
        nguon_nuoc: 'Trạm Bơm An Trạch 1 & Kênh N1',
        to_quan_ly: 'Tổ Thủy Nông 1 (Tổ 1, 2, 8)',
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.25,
        center: [15.9650, 108.1955]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1920, 15.9675],
          [108.1990, 15.9675],
          [108.1995, 15.9625],
          [108.1925, 15.9625],
          [108.1920, 15.9675]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'xd-ha-ra',
      properties: {
        id: 'xd-ha-ra',
        ma_xu_dong: 'XD-HARA',
        ten_xu_dong: 'Xứ Đồng Hà Ra',
        dien_tich_m2: 100524,
        dien_tich_ha: 10.05,
        so_thua: 135,
        cac_lo: 'Lô 20 - Lô 33, Kẹp Ao, Vườn',
        giong_chinh: 'HG244 Cao Sản',
        nguon_nuoc: 'Trạm Bơm An Trạch 1 & Kênh N2',
        to_quan_ly: 'Tổ Thủy Nông 2 (Tổ 3, 4)',
        color: '#f59e0b',
        fillColor: '#f59e0b',
        fillOpacity: 0.25,
        center: [15.9585, 108.1925]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1895, 15.9610],
          [108.1955, 15.9610],
          [108.1950, 15.9560],
          [108.1890, 15.9560],
          [108.1895, 15.9610]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'xd-la-chau',
      properties: {
        id: 'xd-la-chau',
        ma_xu_dong: 'XD-LACHAU',
        ten_xu_dong: 'Xứ Đồng La Châu',
        dien_tich_m2: 43367,
        dien_tich_ha: 4.34,
        so_thua: 70,
        cac_lo: 'Lô La Châu',
        giong_chinh: 'J02 Nhật Bản (Đặc sản)',
        nguon_nuoc: 'Trạm Bơm An Trạch 2 & Kênh N3',
        to_quan_ly: 'Tổ Nông Dân Chất Lượng Cao (Tổ 5)',
        color: '#a855f7',
        fillColor: '#a855f7',
        fillOpacity: 0.25,
        center: [15.9660, 108.2015]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1995, 15.9680],
          [108.2045, 15.9680],
          [108.2040, 15.9640],
          [108.1990, 15.9640],
          [108.1995, 15.9680]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'xd-la-bong-tay',
      properties: {
        id: 'xd-la-bong-tay',
        ma_xu_dong: 'XD-LABONGTAY',
        ten_xu_dong: 'Xứ Đồng La Bông Tây',
        dien_tich_m2: 36932,
        dien_tich_ha: 3.69,
        so_thua: 62,
        cac_lo: 'Lô LB Tây',
        giong_chinh: 'HG12 Lúa Thuần',
        nguon_nuoc: 'Kênh Tiêu Tự Chảy Sông Yên & Trạm 2',
        to_quan_ly: 'Tổ Thủy Nông 3 (Tổ 6)',
        color: '#06b6d4',
        fillColor: '#06b6d4',
        fillOpacity: 0.25,
        center: [15.9590, 108.2005]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.1980, 15.9610],
          [108.2030, 15.9610],
          [108.2030, 15.9570],
          [108.1980, 15.9570],
          [108.1980, 15.9610]
        ]]
      }
    },
    {
      type: 'Feature',
      id: 'xd-go-oi',
      properties: {
        id: 'xd-go-oi',
        ma_xu_dong: 'XD-GOOI',
        ten_xu_dong: 'Xứ Đồng Gò Ổi',
        dien_tich_m2: 27985,
        dien_tich_ha: 2.80,
        so_thua: 56,
        cac_lo: 'Lô Gò ổi, LBT',
        giong_chinh: 'HG12 Lúa Thuần',
        nguon_nuoc: 'Kênh N3 & Trạm Bơm Tăng Áp',
        to_quan_ly: 'Tổ Thủy Nông 3 (Tổ 7)',
        color: '#ec4899',
        fillColor: '#ec4899',
        fillOpacity: 0.25,
        center: [15.9625, 108.2030]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [108.2010, 15.9640],
          [108.2055, 15.9640],
          [108.2050, 15.9605],
          [108.2010, 15.9605],
          [108.2010, 15.9640]
        ]]
      }
    }
  ]
};

// 647 Thửa Đất Nông Nghiệp Polygons GeoJSON
export const PARCELS_GEOJSON: { type: 'FeatureCollection'; features: ParcelGeoFeature[] } = {
  type: 'FeatureCollection',
  features: [
  {
    "type": "Feature",
    "id": "sx-dx2526-0001",
    "properties": {
      "id": "sx-dx2526-0001",
      "stt": 1,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Thái Thị Tuyết",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19253,
            15.967
          ],
          [
            108.19283,
            15.967
          ],
          [
            108.19283,
            15.9668
          ],
          [
            108.19253,
            15.9668
          ],
          [
            108.19253,
            15.967
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0002",
    "properties": {
      "id": "sx-dx2526-0002",
      "stt": 2,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Quang Thơ",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 350,
      "giong_cap_kg": 4.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192833,
            15.96702
          ],
          [
            108.193133,
            15.96702
          ],
          [
            108.193133,
            15.96682
          ],
          [
            108.192833,
            15.96682
          ],
          [
            108.192833,
            15.96702
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0003",
    "properties": {
      "id": "sx-dx2526-0003",
      "stt": 3,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Thị Tường",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 350,
      "giong_cap_kg": 4.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193137,
            15.96703
          ],
          [
            108.193437,
            15.96703
          ],
          [
            108.193437,
            15.96683
          ],
          [
            108.193137,
            15.96683
          ],
          [
            108.193137,
            15.96703
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0004",
    "properties": {
      "id": "sx-dx2526-0004",
      "stt": 4,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Đặng Hiệp",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 340,
      "giong_cap_kg": 4.08,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.1935,
            15.967025
          ],
          [
            108.1938,
            15.967025
          ],
          [
            108.1938,
            15.966825
          ],
          [
            108.1935,
            15.966825
          ],
          [
            108.1935,
            15.967025
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0005",
    "properties": {
      "id": "sx-dx2526-0005",
      "stt": 5,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Đặng Văn Bảy",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 340,
      "giong_cap_kg": 4.08,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193863,
            15.967008
          ],
          [
            108.194163,
            15.967008
          ],
          [
            108.194163,
            15.966808
          ],
          [
            108.193863,
            15.966808
          ],
          [
            108.193863,
            15.967008
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0006",
    "properties": {
      "id": "sx-dx2526-0006",
      "stt": 6,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Hồng",
      "ho_san_xuat": "Nguyễn Hồng",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 420,
      "giong_cap_kg": 5.04,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194167,
            15.966987
          ],
          [
            108.194467,
            15.966987
          ],
          [
            108.194467,
            15.966787
          ],
          [
            108.194167,
            15.966787
          ],
          [
            108.194167,
            15.966987
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0007",
    "properties": {
      "id": "sx-dx2526-0007",
      "stt": 7,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Đặng Chinh",
      "ho_san_xuat": "Nguyễn Thị Liễu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19447,
            15.966973
          ],
          [
            108.19477,
            15.966973
          ],
          [
            108.19477,
            15.966773
          ],
          [
            108.19447,
            15.966773
          ],
          [
            108.19447,
            15.966973
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0008",
    "properties": {
      "id": "sx-dx2526-0008",
      "stt": 8,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Đặng Quang - Hoài",
      "ho_san_xuat": "Đặng Quang - Hoài",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 360,
      "giong_cap_kg": 4.32,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194832,
            15.966971
          ],
          [
            108.195132,
            15.966971
          ],
          [
            108.195132,
            15.966771
          ],
          [
            108.194832,
            15.966771
          ],
          [
            108.194832,
            15.966971
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0009",
    "properties": {
      "id": "sx-dx2526-0009",
      "stt": 9,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Võ Thanh Long",
      "ho_san_xuat": "Đặng Quang - Hoài",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 360,
      "giong_cap_kg": 4.32,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195197,
            15.966984
          ],
          [
            108.195497,
            15.966984
          ],
          [
            108.195497,
            15.966784
          ],
          [
            108.195197,
            15.966784
          ],
          [
            108.195197,
            15.966984
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0010",
    "properties": {
      "id": "sx-dx2526-0010",
      "stt": 10,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Thị Bình",
      "ho_san_xuat": "Nguyễn Thị Bình",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195501,
            15.967005
          ],
          [
            108.195801,
            15.967005
          ],
          [
            108.195801,
            15.966805
          ],
          [
            108.195501,
            15.966805
          ],
          [
            108.195501,
            15.967005
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0011",
    "properties": {
      "id": "sx-dx2526-0011",
      "stt": 11,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Võ Văn Vũ",
      "ho_san_xuat": "Nguyễn Thị Bình",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195803,
            15.967023
          ],
          [
            108.196103,
            15.967023
          ],
          [
            108.196103,
            15.966823
          ],
          [
            108.195803,
            15.966823
          ],
          [
            108.195803,
            15.967023
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0012",
    "properties": {
      "id": "sx-dx2526-0012",
      "stt": 12,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Võ Diên",
      "ho_san_xuat": "Nguyễn Thị Bình",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 120,
      "giong_cap_kg": 1.44,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196165,
            15.96703
          ],
          [
            108.196465,
            15.96703
          ],
          [
            108.196465,
            15.96683
          ],
          [
            108.196165,
            15.96683
          ],
          [
            108.196165,
            15.96703
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0013",
    "properties": {
      "id": "sx-dx2526-0013",
      "stt": 13,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Đặng Thị Tâm",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19653,
            15.967022
          ],
          [
            108.19683,
            15.967022
          ],
          [
            108.19683,
            15.966822
          ],
          [
            108.19653,
            15.966822
          ],
          [
            108.19653,
            15.967022
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0014",
    "properties": {
      "id": "sx-dx2526-0014",
      "stt": 14,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Võ Thị Phước",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196835,
            15.967003
          ],
          [
            108.197135,
            15.967003
          ],
          [
            108.197135,
            15.966803
          ],
          [
            108.196835,
            15.966803
          ],
          [
            108.196835,
            15.967003
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0015",
    "properties": {
      "id": "sx-dx2526-0015",
      "stt": 15,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Cam",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197137,
            15.966983
          ],
          [
            108.197437,
            15.966983
          ],
          [
            108.197437,
            15.966783
          ],
          [
            108.197137,
            15.966783
          ],
          [
            108.197137,
            15.966983
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0016",
    "properties": {
      "id": "sx-dx2526-0016",
      "stt": 16,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Phận",
      "ho_san_xuat": "Nguyễn Phận",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197498,
            15.966971
          ],
          [
            108.197798,
            15.966971
          ],
          [
            108.197798,
            15.966771
          ],
          [
            108.197498,
            15.966771
          ],
          [
            108.197498,
            15.966971
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0017",
    "properties": {
      "id": "sx-dx2526-0017",
      "stt": 17,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Nhơn",
      "ho_san_xuat": "Đặng Toàn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197863,
            15.966973
          ],
          [
            108.198163,
            15.966973
          ],
          [
            108.198163,
            15.966773
          ],
          [
            108.197863,
            15.966773
          ],
          [
            108.197863,
            15.966973
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0018",
    "properties": {
      "id": "sx-dx2526-0018",
      "stt": 18,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Đặng Lào",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9669,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198169,
            15.966989
          ],
          [
            108.198469,
            15.966989
          ],
          [
            108.198469,
            15.966789
          ],
          [
            108.198169,
            15.966789
          ],
          [
            108.198169,
            15.966989
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0019",
    "properties": {
      "id": "sx-dx2526-0019",
      "stt": 19,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Võ Nhân",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19247,
            15.966788
          ],
          [
            108.19277,
            15.966788
          ],
          [
            108.19277,
            15.966588
          ],
          [
            108.19247,
            15.966588
          ],
          [
            108.19247,
            15.966788
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0020",
    "properties": {
      "id": "sx-dx2526-0020",
      "stt": 20,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Thị Y",
      "ho_san_xuat": "Nguyễn Thị Y",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192831,
            15.966804
          ],
          [
            108.193131,
            15.966804
          ],
          [
            108.193131,
            15.966604
          ],
          [
            108.192831,
            15.966604
          ],
          [
            108.192831,
            15.966804
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0021",
    "properties": {
      "id": "sx-dx2526-0021",
      "stt": 21,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Đặng Văn Nhất",
      "ho_san_xuat": "Đặng Toàn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193197,
            15.966807
          ],
          [
            108.193497,
            15.966807
          ],
          [
            108.193497,
            15.966607
          ],
          [
            108.193197,
            15.966607
          ],
          [
            108.193197,
            15.966807
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0022",
    "properties": {
      "id": "sx-dx2526-0022",
      "stt": 22,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Nguyễn Nghĩa",
      "ho_san_xuat": "Nguyễn Đức Thanh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193503,
            15.966796
          ],
          [
            108.193803,
            15.966796
          ],
          [
            108.193803,
            15.966596
          ],
          [
            108.193503,
            15.966596
          ],
          [
            108.193503,
            15.966796
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0023",
    "properties": {
      "id": "sx-dx2526-0023",
      "stt": 23,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Võ Mười",
      "ho_san_xuat": "Võ Mười",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193803,
            15.966776
          ],
          [
            108.194103,
            15.966776
          ],
          [
            108.194103,
            15.966576
          ],
          [
            108.193803,
            15.966576
          ],
          [
            108.193803,
            15.966776
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0024",
    "properties": {
      "id": "sx-dx2526-0024",
      "stt": 24,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 1)",
      "chu_dat": "Võ Thị Chi",
      "ho_san_xuat": "Võ Thị Chi",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194164,
            15.966757
          ],
          [
            108.194464,
            15.966757
          ],
          [
            108.194464,
            15.966557
          ],
          [
            108.194164,
            15.966557
          ],
          [
            108.194164,
            15.966757
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0025",
    "properties": {
      "id": "sx-dx2526-0025",
      "stt": 25,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Thử",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19453,
            15.966748
          ],
          [
            108.19483,
            15.966748
          ],
          [
            108.19483,
            15.966548
          ],
          [
            108.19453,
            15.966548
          ],
          [
            108.19453,
            15.966748
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0026",
    "properties": {
      "id": "sx-dx2526-0026",
      "stt": 26,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Phạm Rô",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194837,
            15.966754
          ],
          [
            108.195137,
            15.966754
          ],
          [
            108.195137,
            15.966554
          ],
          [
            108.194837,
            15.966554
          ],
          [
            108.194837,
            15.966754
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0027",
    "properties": {
      "id": "sx-dx2526-0027",
      "stt": 27,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Phạm Thị Liên",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195137,
            15.966771
          ],
          [
            108.195437,
            15.966771
          ],
          [
            108.195437,
            15.966571
          ],
          [
            108.195137,
            15.966571
          ],
          [
            108.195137,
            15.966771
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0028",
    "properties": {
      "id": "sx-dx2526-0028",
      "stt": 28,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Phạm Thị Lang",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195496,
            15.966792
          ],
          [
            108.195796,
            15.966792
          ],
          [
            108.195796,
            15.966592
          ],
          [
            108.195496,
            15.966592
          ],
          [
            108.195496,
            15.966792
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0029",
    "properties": {
      "id": "sx-dx2526-0029",
      "stt": 29,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Phan Lan",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195863,
            15.966806
          ],
          [
            108.196163,
            15.966806
          ],
          [
            108.196163,
            15.966606
          ],
          [
            108.195863,
            15.966606
          ],
          [
            108.195863,
            15.966806
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0030",
    "properties": {
      "id": "sx-dx2526-0030",
      "stt": 30,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đinh Lương",
      "ho_san_xuat": "Phạm Mười",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196171,
            15.966806
          ],
          [
            108.196471,
            15.966806
          ],
          [
            108.196471,
            15.966606
          ],
          [
            108.196171,
            15.966606
          ],
          [
            108.196171,
            15.966806
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0031",
    "properties": {
      "id": "sx-dx2526-0031",
      "stt": 31,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Phạm Thị Chức",
      "ho_san_xuat": "Phạm Mười",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19647,
            15.966792
          ],
          [
            108.19677,
            15.966792
          ],
          [
            108.19677,
            15.966592
          ],
          [
            108.19647,
            15.966592
          ],
          [
            108.19647,
            15.966792
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0032",
    "properties": {
      "id": "sx-dx2526-0032",
      "stt": 32,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Nguyễn Xin",
      "ho_san_xuat": "Nguyễn Xin",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196829,
            15.966771
          ],
          [
            108.197129,
            15.966771
          ],
          [
            108.197129,
            15.966571
          ],
          [
            108.196829,
            15.966571
          ],
          [
            108.196829,
            15.966771
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0033",
    "properties": {
      "id": "sx-dx2526-0033",
      "stt": 33,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Tàu",
      "ho_san_xuat": "Đặng Tàu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197196,
            15.966753
          ],
          [
            108.197496,
            15.966753
          ],
          [
            108.197496,
            15.966553
          ],
          [
            108.197196,
            15.966553
          ],
          [
            108.197196,
            15.966753
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0034",
    "properties": {
      "id": "sx-dx2526-0034",
      "stt": 34,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Lê Minh Cảnh",
      "ho_san_xuat": "Lê Minh Cảnh",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197504,
            15.966748
          ],
          [
            108.197804,
            15.966748
          ],
          [
            108.197804,
            15.966548
          ],
          [
            108.197504,
            15.966548
          ],
          [
            108.197504,
            15.966748
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0035",
    "properties": {
      "id": "sx-dx2526-0035",
      "stt": 35,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Thị Thi",
      "ho_san_xuat": "Lê Minh Cảnh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197804,
            15.966757
          ],
          [
            108.198104,
            15.966757
          ],
          [
            108.198104,
            15.966557
          ],
          [
            108.197804,
            15.966557
          ],
          [
            108.197804,
            15.966757
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0036",
    "properties": {
      "id": "sx-dx2526-0036",
      "stt": 36,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Ngô Thị Xoa",
      "ho_san_xuat": "Lê Minh Cảnh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966678,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198162,
            15.966776
          ],
          [
            108.198462,
            15.966776
          ],
          [
            108.198462,
            15.966576
          ],
          [
            108.198162,
            15.966576
          ],
          [
            108.198162,
            15.966776
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0037",
    "properties": {
      "id": "sx-dx2526-0037",
      "stt": 37,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Võ Thị Huệ",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19253,
            15.966574
          ],
          [
            108.19283,
            15.966574
          ],
          [
            108.19283,
            15.966374
          ],
          [
            108.19253,
            15.966374
          ],
          [
            108.19253,
            15.966574
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0038",
    "properties": {
      "id": "sx-dx2526-0038",
      "stt": 38,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Nguyễn Thị Xí",
      "ho_san_xuat": "Nguyễn Lâm",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192838,
            15.966585
          ],
          [
            108.193138,
            15.966585
          ],
          [
            108.193138,
            15.966385
          ],
          [
            108.192838,
            15.966385
          ],
          [
            108.192838,
            15.966585
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0039",
    "properties": {
      "id": "sx-dx2526-0039",
      "stt": 39,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Thị Bé",
      "ho_san_xuat": "Đặng Thị Bé",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193137,
            15.966581
          ],
          [
            108.193437,
            15.966581
          ],
          [
            108.193437,
            15.966381
          ],
          [
            108.193137,
            15.966381
          ],
          [
            108.193137,
            15.966581
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0040",
    "properties": {
      "id": "sx-dx2526-0040",
      "stt": 40,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Phạm Xong",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193495,
            15.966565
          ],
          [
            108.193795,
            15.966565
          ],
          [
            108.193795,
            15.966365
          ],
          [
            108.193495,
            15.966365
          ],
          [
            108.193495,
            15.966565
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0041",
    "properties": {
      "id": "sx-dx2526-0041",
      "stt": 41,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Võ Kỳ",
      "ho_san_xuat": "Nguyễn Lâm",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193863,
            15.966544
          ],
          [
            108.194163,
            15.966544
          ],
          [
            108.194163,
            15.966344
          ],
          [
            108.193863,
            15.966344
          ],
          [
            108.193863,
            15.966544
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0042",
    "properties": {
      "id": "sx-dx2526-0042",
      "stt": 42,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Toản",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194172,
            15.966529
          ],
          [
            108.194472,
            15.966529
          ],
          [
            108.194472,
            15.966329
          ],
          [
            108.194172,
            15.966329
          ],
          [
            108.194172,
            15.966529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0043",
    "properties": {
      "id": "sx-dx2526-0043",
      "stt": 43,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Nguyễn Văn Tích",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194471,
            15.966527
          ],
          [
            108.194771,
            15.966527
          ],
          [
            108.194771,
            15.966327
          ],
          [
            108.194471,
            15.966327
          ],
          [
            108.194471,
            15.966527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0044",
    "properties": {
      "id": "sx-dx2526-0044",
      "stt": 44,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Lâm Tùng Nghĩa",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194828,
            15.966539
          ],
          [
            108.195128,
            15.966539
          ],
          [
            108.195128,
            15.966339
          ],
          [
            108.194828,
            15.966339
          ],
          [
            108.194828,
            15.966539
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0045",
    "properties": {
      "id": "sx-dx2526-0045",
      "stt": 45,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Phạm Thị Tứ",
      "ho_san_xuat": "Đặng Quang Viên",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195196,
            15.966559
          ],
          [
            108.195496,
            15.966559
          ],
          [
            108.195496,
            15.966359
          ],
          [
            108.195196,
            15.966359
          ],
          [
            108.195196,
            15.966559
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0046",
    "properties": {
      "id": "sx-dx2526-0046",
      "stt": 46,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Bùi Thị Gái",
      "ho_san_xuat": "Lê Thị Tằm",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195506,
            15.966578
          ],
          [
            108.195806,
            15.966578
          ],
          [
            108.195806,
            15.966378
          ],
          [
            108.195506,
            15.966378
          ],
          [
            108.195506,
            15.966578
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0047",
    "properties": {
      "id": "sx-dx2526-0047",
      "stt": 47,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Quang Viên",
      "ho_san_xuat": "Đặng Quang Viên",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195804,
            15.966586
          ],
          [
            108.196104,
            15.966586
          ],
          [
            108.196104,
            15.966386
          ],
          [
            108.195804,
            15.966386
          ],
          [
            108.195804,
            15.966586
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0048",
    "properties": {
      "id": "sx-dx2526-0048",
      "stt": 48,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Phước",
      "ho_san_xuat": "Lê Thị Tằm",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19616,
            15.966578
          ],
          [
            108.19646,
            15.966578
          ],
          [
            108.19646,
            15.966378
          ],
          [
            108.19616,
            15.966378
          ],
          [
            108.19616,
            15.966578
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0049",
    "properties": {
      "id": "sx-dx2526-0049",
      "stt": 49,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Võ Long",
      "ho_san_xuat": "Đặng Toàn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196529,
            15.96656
          ],
          [
            108.196829,
            15.96656
          ],
          [
            108.196829,
            15.96636
          ],
          [
            108.196529,
            15.96636
          ],
          [
            108.196529,
            15.96656
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0050",
    "properties": {
      "id": "sx-dx2526-0050",
      "stt": 50,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Toàn",
      "ho_san_xuat": "Đặng Toàn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19684,
            15.966539
          ],
          [
            108.19714,
            15.966539
          ],
          [
            108.19714,
            15.966339
          ],
          [
            108.19684,
            15.966339
          ],
          [
            108.19684,
            15.966539
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0051",
    "properties": {
      "id": "sx-dx2526-0051",
      "stt": 51,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 4(Thớt 2)",
      "chu_dat": "Đặng Thị Đoan",
      "ho_san_xuat": "Đặng Toàn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197137,
            15.966527
          ],
          [
            108.197437,
            15.966527
          ],
          [
            108.197437,
            15.966327
          ],
          [
            108.197137,
            15.966327
          ],
          [
            108.197137,
            15.966527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0052",
    "properties": {
      "id": "sx-dx2526-0052",
      "stt": 52,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Đặng Sanh",
      "ho_san_xuat": "Đặng Sanh",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1470,
      "giong_cap_kg": 17.64,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197493,
            15.966528
          ],
          [
            108.197793,
            15.966528
          ],
          [
            108.197793,
            15.966328
          ],
          [
            108.197493,
            15.966328
          ],
          [
            108.197493,
            15.966528
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0053",
    "properties": {
      "id": "sx-dx2526-0053",
      "stt": 53,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Võ Diên",
      "ho_san_xuat": "Nguyễn Thị Phượng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197863,
            15.966543
          ],
          [
            108.198163,
            15.966543
          ],
          [
            108.198163,
            15.966343
          ],
          [
            108.197863,
            15.966343
          ],
          [
            108.197863,
            15.966543
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0054",
    "properties": {
      "id": "sx-dx2526-0054",
      "stt": 54,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Lê Thị Mẹo",
      "ho_san_xuat": "Đặng Xí",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 383,
      "giong_cap_kg": 4.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966456,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198174,
            15.966564
          ],
          [
            108.198474,
            15.966564
          ],
          [
            108.198474,
            15.966364
          ],
          [
            108.198174,
            15.966364
          ],
          [
            108.198174,
            15.966564
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0055",
    "properties": {
      "id": "sx-dx2526-0055",
      "stt": 55,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Đặng Thị Tâm",
      "ho_san_xuat": "Đặng Điền",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 382,
      "giong_cap_kg": 4.58,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192471,
            15.966359
          ],
          [
            108.192771,
            15.966359
          ],
          [
            108.192771,
            15.966159
          ],
          [
            108.192471,
            15.966159
          ],
          [
            108.192471,
            15.966359
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0056",
    "properties": {
      "id": "sx-dx2526-0056",
      "stt": 56,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Đặng Đa",
      "ho_san_xuat": "Đặng Xí",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 640,
      "giong_cap_kg": 7.68,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192826,
            15.966363
          ],
          [
            108.193126,
            15.966363
          ],
          [
            108.193126,
            15.966163
          ],
          [
            108.192826,
            15.966163
          ],
          [
            108.192826,
            15.966363
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0057",
    "properties": {
      "id": "sx-dx2526-0057",
      "stt": 57,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Võ Đình Nguyên",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 704,
      "giong_cap_kg": 8.45,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193196,
            15.966353
          ],
          [
            108.193496,
            15.966353
          ],
          [
            108.193496,
            15.966153
          ],
          [
            108.193196,
            15.966153
          ],
          [
            108.193196,
            15.966353
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0058",
    "properties": {
      "id": "sx-dx2526-0058",
      "stt": 58,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Võ Thị Bút",
      "ho_san_xuat": "Võ Thị Bút",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 400,
      "giong_cap_kg": 4.8,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193507,
            15.966333
          ],
          [
            108.193807,
            15.966333
          ],
          [
            108.193807,
            15.966133
          ],
          [
            108.193507,
            15.966133
          ],
          [
            108.193507,
            15.966333
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0059",
    "properties": {
      "id": "sx-dx2526-0059",
      "stt": 59,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Võ Thị Mẫn",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 484,
      "giong_cap_kg": 5.81,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193804,
            15.966313
          ],
          [
            108.194104,
            15.966313
          ],
          [
            108.194104,
            15.966113
          ],
          [
            108.193804,
            15.966113
          ],
          [
            108.193804,
            15.966313
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0060",
    "properties": {
      "id": "sx-dx2526-0060",
      "stt": 60,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Lâm Tùng Nghĩa",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 550,
      "giong_cap_kg": 6.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194159,
            15.966304
          ],
          [
            108.194459,
            15.966304
          ],
          [
            108.194459,
            15.966104
          ],
          [
            108.194159,
            15.966104
          ],
          [
            108.194159,
            15.966304
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0061",
    "properties": {
      "id": "sx-dx2526-0061",
      "stt": 61,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Đặng Thị Bình",
      "ho_san_xuat": "Đặng Thị Bình",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194529,
            15.966309
          ],
          [
            108.194829,
            15.966309
          ],
          [
            108.194829,
            15.966109
          ],
          [
            108.194529,
            15.966109
          ],
          [
            108.194529,
            15.966309
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0062",
    "properties": {
      "id": "sx-dx2526-0062",
      "stt": 62,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Đặng Thọ",
      "ho_san_xuat": "Đặng Thọ",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1058,
      "giong_cap_kg": 12.7,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194841,
            15.966326
          ],
          [
            108.195141,
            15.966326
          ],
          [
            108.195141,
            15.966126
          ],
          [
            108.194841,
            15.966126
          ],
          [
            108.194841,
            15.966326
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0063",
    "properties": {
      "id": "sx-dx2526-0063",
      "stt": 63,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Trần Thị Toàn",
      "ho_san_xuat": "Trần Thị Toàn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 570,
      "giong_cap_kg": 6.84,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195138,
            15.966347
          ],
          [
            108.195438,
            15.966347
          ],
          [
            108.195438,
            15.966147
          ],
          [
            108.195138,
            15.966147
          ],
          [
            108.195138,
            15.966347
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0064",
    "properties": {
      "id": "sx-dx2526-0064",
      "stt": 64,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Phạm Văn Quang",
      "ho_san_xuat": "Phạm Văn Tiến",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195492,
            15.966361
          ],
          [
            108.195792,
            15.966361
          ],
          [
            108.195792,
            15.966161
          ],
          [
            108.195492,
            15.966161
          ],
          [
            108.195492,
            15.966361
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0065",
    "properties": {
      "id": "sx-dx2526-0065",
      "stt": 65,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Nguyễn Thị Chuốt",
      "ho_san_xuat": "Đặng Hiệp",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 350,
      "giong_cap_kg": 4.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195862,
            15.966362
          ],
          [
            108.196162,
            15.966362
          ],
          [
            108.196162,
            15.966162
          ],
          [
            108.195862,
            15.966162
          ],
          [
            108.195862,
            15.966362
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0066",
    "properties": {
      "id": "sx-dx2526-0066",
      "stt": 66,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Nguyễn Kiện",
      "ho_san_xuat": "Đặng Thị Ngọc Bích",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196175,
            15.966349
          ],
          [
            108.196475,
            15.966349
          ],
          [
            108.196475,
            15.966149
          ],
          [
            108.196175,
            15.966149
          ],
          [
            108.196175,
            15.966349
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0067",
    "properties": {
      "id": "sx-dx2526-0067",
      "stt": 67,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 8",
      "chu_dat": "Võ Hoàng",
      "ho_san_xuat": "Võ Hoàng",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196471,
            15.966328
          ],
          [
            108.196771,
            15.966328
          ],
          [
            108.196771,
            15.966128
          ],
          [
            108.196471,
            15.966128
          ],
          [
            108.196471,
            15.966328
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0068",
    "properties": {
      "id": "sx-dx2526-0068",
      "stt": 68,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Nguyễn Xin",
      "ho_san_xuat": "Nguyễn Xin",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 720,
      "giong_cap_kg": 8.64,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196825,
            15.96631
          ],
          [
            108.197125,
            15.96631
          ],
          [
            108.197125,
            15.96611
          ],
          [
            108.196825,
            15.96611
          ],
          [
            108.196825,
            15.96631
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0069",
    "properties": {
      "id": "sx-dx2526-0069",
      "stt": 69,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Hồ Tuấn",
      "ho_san_xuat": "Hồ Tuấn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 612,
      "giong_cap_kg": 7.34,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197195,
            15.966303
          ],
          [
            108.197495,
            15.966303
          ],
          [
            108.197495,
            15.966103
          ],
          [
            108.197195,
            15.966103
          ],
          [
            108.197195,
            15.966303
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0070",
    "properties": {
      "id": "sx-dx2526-0070",
      "stt": 70,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Đặng Tàu",
      "ho_san_xuat": "Đặng Tàu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 923,
      "giong_cap_kg": 11.08,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197509,
            15.966312
          ],
          [
            108.197809,
            15.966312
          ],
          [
            108.197809,
            15.966112
          ],
          [
            108.197509,
            15.966112
          ],
          [
            108.197509,
            15.966312
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0071",
    "properties": {
      "id": "sx-dx2526-0071",
      "stt": 71,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Đặng Dốn",
      "ho_san_xuat": "Đặng Dốn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1180,
      "giong_cap_kg": 14.16,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197805,
            15.966331
          ],
          [
            108.198105,
            15.966331
          ],
          [
            108.198105,
            15.966131
          ],
          [
            108.197805,
            15.966131
          ],
          [
            108.197805,
            15.966331
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0072",
    "properties": {
      "id": "sx-dx2526-0072",
      "stt": 72,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Võ Nhân",
      "ho_san_xuat": "Phạm Trung",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1130,
      "giong_cap_kg": 13.56,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966233,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198157,
            15.966351
          ],
          [
            108.198457,
            15.966351
          ],
          [
            108.198457,
            15.966151
          ],
          [
            108.198157,
            15.966151
          ],
          [
            108.198157,
            15.966351
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0073",
    "properties": {
      "id": "sx-dx2526-0073",
      "stt": 73,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Phạm Giàu",
      "ho_san_xuat": "Phạm Rô",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 930,
      "giong_cap_kg": 11.16,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192528,
            15.96614
          ],
          [
            108.192828,
            15.96614
          ],
          [
            108.192828,
            15.96594
          ],
          [
            108.192528,
            15.96594
          ],
          [
            108.192528,
            15.96614
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0074",
    "properties": {
      "id": "sx-dx2526-0074",
      "stt": 74,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Nguyễn Thị Y",
      "ho_san_xuat": "Nguyễn Thị Y",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 645,
      "giong_cap_kg": 7.74,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192843,
            15.966138
          ],
          [
            108.193143,
            15.966138
          ],
          [
            108.193143,
            15.965938
          ],
          [
            108.192843,
            15.965938
          ],
          [
            108.192843,
            15.966138
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0075",
    "properties": {
      "id": "sx-dx2526-0075",
      "stt": 75,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Thái Thị Tuyết",
      "ho_san_xuat": "Đặng Thiệu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 677,
      "giong_cap_kg": 8.12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193138,
            15.966122
          ],
          [
            108.193438,
            15.966122
          ],
          [
            108.193438,
            15.965922
          ],
          [
            108.193138,
            15.965922
          ],
          [
            108.193138,
            15.966122
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0076",
    "properties": {
      "id": "sx-dx2526-0076",
      "stt": 76,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Nguyễn Xin",
      "ho_san_xuat": "Nguyễn Xin",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19349,
            15.966101
          ],
          [
            108.19379,
            15.966101
          ],
          [
            108.19379,
            15.965901
          ],
          [
            108.19349,
            15.965901
          ],
          [
            108.19349,
            15.966101
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0077",
    "properties": {
      "id": "sx-dx2526-0077",
      "stt": 77,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Phạm Thị Tứ",
      "ho_san_xuat": "Đặng Hoàng Bình",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193862,
            15.966085
          ],
          [
            108.194162,
            15.966085
          ],
          [
            108.194162,
            15.965885
          ],
          [
            108.193862,
            15.965885
          ],
          [
            108.193862,
            15.966085
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0078",
    "properties": {
      "id": "sx-dx2526-0078",
      "stt": 78,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Đặng Lào",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194177,
            15.966082
          ],
          [
            108.194477,
            15.966082
          ],
          [
            108.194477,
            15.965882
          ],
          [
            108.194177,
            15.965882
          ],
          [
            108.194177,
            15.966082
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0079",
    "properties": {
      "id": "sx-dx2526-0079",
      "stt": 79,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Dương Thị Tâm",
      "ho_san_xuat": "Dương Thị Tâm",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 690,
      "giong_cap_kg": 8.28,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194472,
            15.966093
          ],
          [
            108.194772,
            15.966093
          ],
          [
            108.194772,
            15.965893
          ],
          [
            108.194472,
            15.965893
          ],
          [
            108.194472,
            15.966093
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0080",
    "properties": {
      "id": "sx-dx2526-0080",
      "stt": 80,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Phan Thị Thời",
      "ho_san_xuat": "Đặng Văn Bảy",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194823,
            15.966113
          ],
          [
            108.195123,
            15.966113
          ],
          [
            108.195123,
            15.965913
          ],
          [
            108.194823,
            15.965913
          ],
          [
            108.194823,
            15.966113
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0081",
    "properties": {
      "id": "sx-dx2526-0081",
      "stt": 81,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Đặng Phước",
      "ho_san_xuat": "Lê Thị Tằm",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195195,
            15.966133
          ],
          [
            108.195495,
            15.966133
          ],
          [
            108.195495,
            15.965933
          ],
          [
            108.195195,
            15.965933
          ],
          [
            108.195195,
            15.966133
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0082",
    "properties": {
      "id": "sx-dx2526-0082",
      "stt": 82,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 9",
      "chu_dat": "Đặng Văn Bảy",
      "ho_san_xuat": "Đặng Văn Bảy",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 855,
      "giong_cap_kg": 10.26,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195511,
            15.966141
          ],
          [
            108.195811,
            15.966141
          ],
          [
            108.195811,
            15.965941
          ],
          [
            108.195511,
            15.965941
          ],
          [
            108.195511,
            15.966141
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0083",
    "properties": {
      "id": "sx-dx2526-0083",
      "stt": 83,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Đặng Văn Đối",
      "ho_san_xuat": "Đặng Văn Quang",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195805,
            15.966135
          ],
          [
            108.196105,
            15.966135
          ],
          [
            108.196105,
            15.965935
          ],
          [
            108.195805,
            15.965935
          ],
          [
            108.195805,
            15.966135
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0084",
    "properties": {
      "id": "sx-dx2526-0084",
      "stt": 84,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Đặng Quang - Hoài",
      "ho_san_xuat": "Đặng Quang - Hoài",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 990,
      "giong_cap_kg": 11.88,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196156,
            15.966117
          ],
          [
            108.196456,
            15.966117
          ],
          [
            108.196456,
            15.965917
          ],
          [
            108.196156,
            15.965917
          ],
          [
            108.196156,
            15.966117
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0085",
    "properties": {
      "id": "sx-dx2526-0085",
      "stt": 85,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Đặng Văn Quân",
      "ho_san_xuat": "Đặng Văn Quân",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1720,
      "giong_cap_kg": 20.64,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196528,
            15.966096
          ],
          [
            108.196828,
            15.966096
          ],
          [
            108.196828,
            15.965896
          ],
          [
            108.196528,
            15.965896
          ],
          [
            108.196528,
            15.966096
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0086",
    "properties": {
      "id": "sx-dx2526-0086",
      "stt": 86,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Võ Thị Lịch",
      "ho_san_xuat": "Phạm Công Anh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 520,
      "giong_cap_kg": 6.24,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196844,
            15.966083
          ],
          [
            108.197144,
            15.966083
          ],
          [
            108.197144,
            15.965883
          ],
          [
            108.196844,
            15.965883
          ],
          [
            108.196844,
            15.966083
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0087",
    "properties": {
      "id": "sx-dx2526-0087",
      "stt": 87,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Đặng Hiền",
      "ho_san_xuat": "Võ Thị Thủy",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1025,
      "giong_cap_kg": 12.3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197139,
            15.966083
          ],
          [
            108.197439,
            15.966083
          ],
          [
            108.197439,
            15.965883
          ],
          [
            108.197139,
            15.965883
          ],
          [
            108.197139,
            15.966083
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0088",
    "properties": {
      "id": "sx-dx2526-0088",
      "stt": 88,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Đặng Đoàn",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1250,
      "giong_cap_kg": 15,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197489,
            15.966098
          ],
          [
            108.197789,
            15.966098
          ],
          [
            108.197789,
            15.965898
          ],
          [
            108.197489,
            15.965898
          ],
          [
            108.197489,
            15.966098
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0089",
    "properties": {
      "id": "sx-dx2526-0089",
      "stt": 89,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Trần Đình Tân",
      "ho_san_xuat": "Võ Thị Phước",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197861,
            15.966118
          ],
          [
            108.198161,
            15.966118
          ],
          [
            108.198161,
            15.965918
          ],
          [
            108.197861,
            15.965918
          ],
          [
            108.197861,
            15.966118
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0090",
    "properties": {
      "id": "sx-dx2526-0090",
      "stt": 90,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Võ Tiến Dũng",
      "ho_san_xuat": "Võ Thị Phước",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966011,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198178,
            15.966136
          ],
          [
            108.198478,
            15.966136
          ],
          [
            108.198478,
            15.965936
          ],
          [
            108.198178,
            15.965936
          ],
          [
            108.198178,
            15.966136
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0091",
    "properties": {
      "id": "sx-dx2526-0091",
      "stt": 91,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Nguyễn Thị Xí",
      "ho_san_xuat": "Nguyễn Thị Xí",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192472,
            15.965919
          ],
          [
            108.192772,
            15.965919
          ],
          [
            108.192772,
            15.965719
          ],
          [
            108.192472,
            15.965719
          ],
          [
            108.192472,
            15.965919
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0092",
    "properties": {
      "id": "sx-dx2526-0092",
      "stt": 92,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Võ Văn Sang",
      "ho_san_xuat": "Võ Văn Sang",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 675,
      "giong_cap_kg": 8.1,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192822,
            15.965909
          ],
          [
            108.193122,
            15.965909
          ],
          [
            108.193122,
            15.965709
          ],
          [
            108.192822,
            15.965709
          ],
          [
            108.192822,
            15.965909
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0093",
    "properties": {
      "id": "sx-dx2526-0093",
      "stt": 93,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Đặng Thị Chi",
      "ho_san_xuat": "Nguyễn Sự",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 675,
      "giong_cap_kg": 8.1,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193194,
            15.96589
          ],
          [
            108.193494,
            15.96589
          ],
          [
            108.193494,
            15.96569
          ],
          [
            108.193194,
            15.96569
          ],
          [
            108.193194,
            15.96589
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0094",
    "properties": {
      "id": "sx-dx2526-0094",
      "stt": 94,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Võ Hiệu",
      "ho_san_xuat": "Võ Hiệu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 870,
      "giong_cap_kg": 10.44,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193512,
            15.96587
          ],
          [
            108.193812,
            15.96587
          ],
          [
            108.193812,
            15.96567
          ],
          [
            108.193512,
            15.96567
          ],
          [
            108.193512,
            15.96587
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0095",
    "properties": {
      "id": "sx-dx2526-0095",
      "stt": 95,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Đặng Đoàn",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 525,
      "giong_cap_kg": 6.3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193806,
            15.965859
          ],
          [
            108.194106,
            15.965859
          ],
          [
            108.194106,
            15.965659
          ],
          [
            108.193806,
            15.965659
          ],
          [
            108.193806,
            15.965859
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0096",
    "properties": {
      "id": "sx-dx2526-0096",
      "stt": 96,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 13",
      "chu_dat": "Võ Di",
      "ho_san_xuat": "Võ Thị Thi",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 910,
      "giong_cap_kg": 10.92,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194154,
            15.965863
          ],
          [
            108.194454,
            15.965863
          ],
          [
            108.194454,
            15.965663
          ],
          [
            108.194154,
            15.965663
          ],
          [
            108.194154,
            15.965863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0097",
    "properties": {
      "id": "sx-dx2526-0097",
      "stt": 97,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Đặng Thị Thu",
      "ho_san_xuat": "Nguyễn Đức Thanh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1050,
      "giong_cap_kg": 12.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194527,
            15.96588
          ],
          [
            108.194827,
            15.96588
          ],
          [
            108.194827,
            15.96568
          ],
          [
            108.194527,
            15.96568
          ],
          [
            108.194527,
            15.96588
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0098",
    "properties": {
      "id": "sx-dx2526-0098",
      "stt": 98,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Nguyễn Phận",
      "ho_san_xuat": "Nguyễn Phận",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1025,
      "giong_cap_kg": 12.3,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194846,
            15.965901
          ],
          [
            108.195146,
            15.965901
          ],
          [
            108.195146,
            15.965701
          ],
          [
            108.194846,
            15.965701
          ],
          [
            108.194846,
            15.965901
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0099",
    "properties": {
      "id": "sx-dx2526-0099",
      "stt": 99,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Lê Thị Út",
      "ho_san_xuat": "Đinh Lệ",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 975,
      "giong_cap_kg": 11.7,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195139,
            15.965916
          ],
          [
            108.195439,
            15.965916
          ],
          [
            108.195439,
            15.965716
          ],
          [
            108.195139,
            15.965716
          ],
          [
            108.195139,
            15.965916
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0100",
    "properties": {
      "id": "sx-dx2526-0100",
      "stt": 100,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Đặng Thứ",
      "ho_san_xuat": "Đặng Thứ",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 910,
      "giong_cap_kg": 10.92,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195487,
            15.965918
          ],
          [
            108.195787,
            15.965918
          ],
          [
            108.195787,
            15.965718
          ],
          [
            108.195487,
            15.965718
          ],
          [
            108.195487,
            15.965918
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0101",
    "properties": {
      "id": "sx-dx2526-0101",
      "stt": 101,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Thanh Long",
      "ho_san_xuat": "Võ Thanh Long",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19586,
            15.965905
          ],
          [
            108.19616,
            15.965905
          ],
          [
            108.19616,
            15.965705
          ],
          [
            108.19586,
            15.965705
          ],
          [
            108.19586,
            15.965905
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0102",
    "properties": {
      "id": "sx-dx2526-0102",
      "stt": 102,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Tuấn",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 364,
      "giong_cap_kg": 4.37,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19618,
            15.965885
          ],
          [
            108.19648,
            15.965885
          ],
          [
            108.19648,
            15.965685
          ],
          [
            108.19618,
            15.965685
          ],
          [
            108.19618,
            15.965885
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0103",
    "properties": {
      "id": "sx-dx2526-0103",
      "stt": 103,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Đặng Toản",
      "ho_san_xuat": "Đặng Toản",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 806,
      "giong_cap_kg": 9.67,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196473,
            15.965866
          ],
          [
            108.196773,
            15.965866
          ],
          [
            108.196773,
            15.965666
          ],
          [
            108.196473,
            15.965666
          ],
          [
            108.196473,
            15.965866
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0104",
    "properties": {
      "id": "sx-dx2526-0104",
      "stt": 104,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Long",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 670,
      "giong_cap_kg": 8.04,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19682,
            15.965859
          ],
          [
            108.19712,
            15.965859
          ],
          [
            108.19712,
            15.965659
          ],
          [
            108.19682,
            15.965659
          ],
          [
            108.19682,
            15.965859
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0105",
    "properties": {
      "id": "sx-dx2526-0105",
      "stt": 105,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Kỳ",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 705,
      "giong_cap_kg": 8.46,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197194,
            15.965866
          ],
          [
            108.197494,
            15.965866
          ],
          [
            108.197494,
            15.965666
          ],
          [
            108.197194,
            15.965666
          ],
          [
            108.197194,
            15.965866
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0106",
    "properties": {
      "id": "sx-dx2526-0106",
      "stt": 106,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Đặng Thị Quí",
      "ho_san_xuat": "Đặng Học",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197513,
            15.965885
          ],
          [
            108.197813,
            15.965885
          ],
          [
            108.197813,
            15.965685
          ],
          [
            108.197513,
            15.965685
          ],
          [
            108.197513,
            15.965885
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0107",
    "properties": {
      "id": "sx-dx2526-0107",
      "stt": 107,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Thị Chi",
      "ho_san_xuat": "Võ Thị Chi",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197807,
            15.965905
          ],
          [
            108.198107,
            15.965905
          ],
          [
            108.198107,
            15.965705
          ],
          [
            108.197807,
            15.965705
          ],
          [
            108.197807,
            15.965905
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0108",
    "properties": {
      "id": "sx-dx2526-0108",
      "stt": 108,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Hồng Quân",
      "ho_san_xuat": "Võ Tiến Dũng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965789,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198153,
            15.965918
          ],
          [
            108.198453,
            15.965918
          ],
          [
            108.198453,
            15.965718
          ],
          [
            108.198153,
            15.965718
          ],
          [
            108.198153,
            15.965918
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0109",
    "properties": {
      "id": "sx-dx2526-0109",
      "stt": 109,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Nguyễn Văn Ích",
      "ho_san_xuat": "Võ Tiến Dũng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192527,
            15.965694
          ],
          [
            108.192827,
            15.965694
          ],
          [
            108.192827,
            15.965494
          ],
          [
            108.192527,
            15.965494
          ],
          [
            108.192527,
            15.965694
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0110",
    "properties": {
      "id": "sx-dx2526-0110",
      "stt": 110,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Đặng Toản",
      "ho_san_xuat": "Đặng Toản",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 555,
      "giong_cap_kg": 6.66,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192847,
            15.965679
          ],
          [
            108.193147,
            15.965679
          ],
          [
            108.193147,
            15.965479
          ],
          [
            108.192847,
            15.965479
          ],
          [
            108.192847,
            15.965679
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0111",
    "properties": {
      "id": "sx-dx2526-0111",
      "stt": 111,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Nhân",
      "ho_san_xuat": "Võ Tiến Dũng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 762,
      "giong_cap_kg": 9.14,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19314,
            15.965658
          ],
          [
            108.19344,
            15.965658
          ],
          [
            108.19344,
            15.965458
          ],
          [
            108.19314,
            15.965458
          ],
          [
            108.19314,
            15.965658
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0112",
    "properties": {
      "id": "sx-dx2526-0112",
      "stt": 112,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Nguyễn Minh",
      "ho_san_xuat": "Nguyễn Minh",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 684,
      "giong_cap_kg": 8.21,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193486,
            15.965641
          ],
          [
            108.193786,
            15.965641
          ],
          [
            108.193786,
            15.965441
          ],
          [
            108.193486,
            15.965441
          ],
          [
            108.193486,
            15.965641
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0113",
    "properties": {
      "id": "sx-dx2526-0113",
      "stt": 113,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Nguyễn Keo",
      "ho_san_xuat": "Võ Tiến Dũng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1350,
      "giong_cap_kg": 16.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19386,
            15.965637
          ],
          [
            108.19416,
            15.965637
          ],
          [
            108.19416,
            15.965437
          ],
          [
            108.19386,
            15.965437
          ],
          [
            108.19386,
            15.965637
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0114",
    "properties": {
      "id": "sx-dx2526-0114",
      "stt": 114,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Đinh Thị Nhí",
      "ho_san_xuat": "Đặng Xí",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 905,
      "giong_cap_kg": 10.86,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194181,
            15.965648
          ],
          [
            108.194481,
            15.965648
          ],
          [
            108.194481,
            15.965448
          ],
          [
            108.194181,
            15.965448
          ],
          [
            108.194181,
            15.965648
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0115",
    "properties": {
      "id": "sx-dx2526-0115",
      "stt": 115,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Vũ Thị Dung",
      "ho_san_xuat": "Trần Mai Trường",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194474,
            15.965668
          ],
          [
            108.194774,
            15.965668
          ],
          [
            108.194774,
            15.965468
          ],
          [
            108.194474,
            15.965468
          ],
          [
            108.194474,
            15.965668
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0116",
    "properties": {
      "id": "sx-dx2526-0116",
      "stt": 116,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 14",
      "chu_dat": "Võ Nhân",
      "ho_san_xuat": "Võ Tiến Dũng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 900,
      "giong_cap_kg": 10.8,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194819,
            15.965687
          ],
          [
            108.195119,
            15.965687
          ],
          [
            108.195119,
            15.965487
          ],
          [
            108.194819,
            15.965487
          ],
          [
            108.194819,
            15.965687
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0117",
    "properties": {
      "id": "sx-dx2526-0117",
      "stt": 117,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Đặng Thị Tâm",
      "ho_san_xuat": "Đặng Thị Tâm",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1380,
      "giong_cap_kg": 16.56,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195193,
            15.965697
          ],
          [
            108.195493,
            15.965697
          ],
          [
            108.195493,
            15.965497
          ],
          [
            108.195193,
            15.965497
          ],
          [
            108.195193,
            15.965697
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0118",
    "properties": {
      "id": "sx-dx2526-0118",
      "stt": 118,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Nguyễn Thị Hoa",
      "ho_san_xuat": "Nguyễn Thị Hoa",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195515,
            15.965691
          ],
          [
            108.195815,
            15.965691
          ],
          [
            108.195815,
            15.965491
          ],
          [
            108.195515,
            15.965491
          ],
          [
            108.195515,
            15.965691
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0119",
    "properties": {
      "id": "sx-dx2526-0119",
      "stt": 119,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Đặng Điền",
      "ho_san_xuat": "Đặng Điền",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1130,
      "giong_cap_kg": 13.56,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195807,
            15.965674
          ],
          [
            108.196107,
            15.965674
          ],
          [
            108.196107,
            15.965474
          ],
          [
            108.195807,
            15.965474
          ],
          [
            108.195807,
            15.965674
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0120",
    "properties": {
      "id": "sx-dx2526-0120",
      "stt": 120,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Nguyễn Thị Tùng",
      "ho_san_xuat": "Lê Minh Cảnh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 522,
      "giong_cap_kg": 6.26,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196152,
            15.965653
          ],
          [
            108.196452,
            15.965653
          ],
          [
            108.196452,
            15.965453
          ],
          [
            108.196152,
            15.965453
          ],
          [
            108.196152,
            15.965653
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0121",
    "properties": {
      "id": "sx-dx2526-0121",
      "stt": 121,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Ngô Thị Xoa",
      "ho_san_xuat": "Lê Thị Tằm",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1010,
      "giong_cap_kg": 12.12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196526,
            15.965639
          ],
          [
            108.196826,
            15.965639
          ],
          [
            108.196826,
            15.965439
          ],
          [
            108.196526,
            15.965439
          ],
          [
            108.196526,
            15.965639
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0122",
    "properties": {
      "id": "sx-dx2526-0122",
      "stt": 122,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Nguyễn Thị Năm",
      "ho_san_xuat": "Nguyễn Thị Y",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1010,
      "giong_cap_kg": 12.12,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196849,
            15.965638
          ],
          [
            108.197149,
            15.965638
          ],
          [
            108.197149,
            15.965438
          ],
          [
            108.196849,
            15.965438
          ],
          [
            108.196849,
            15.965638
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0123",
    "properties": {
      "id": "sx-dx2526-0123",
      "stt": 123,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Đặng Thị Khoái",
      "ho_san_xuat": "Phạm Công Anh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197141,
            15.965652
          ],
          [
            108.197441,
            15.965652
          ],
          [
            108.197441,
            15.965452
          ],
          [
            108.197141,
            15.965452
          ],
          [
            108.197141,
            15.965652
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0124",
    "properties": {
      "id": "sx-dx2526-0124",
      "stt": 124,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Phạm Xong",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1008,
      "giong_cap_kg": 12.1,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197484,
            15.965673
          ],
          [
            108.197784,
            15.965673
          ],
          [
            108.197784,
            15.965473
          ],
          [
            108.197484,
            15.965473
          ],
          [
            108.197484,
            15.965673
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0125",
    "properties": {
      "id": "sx-dx2526-0125",
      "stt": 125,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Phạm Tấn - Hoa",
      "ho_san_xuat": "Đặng Thị Hoa",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1605,
      "giong_cap_kg": 19.26,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197859,
            15.965691
          ],
          [
            108.198159,
            15.965691
          ],
          [
            108.198159,
            15.965491
          ],
          [
            108.197859,
            15.965491
          ],
          [
            108.197859,
            15.965691
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0126",
    "properties": {
      "id": "sx-dx2526-0126",
      "stt": 126,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Võ Đình Nguyên",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 379,
      "giong_cap_kg": 4.55,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965567,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198182,
            15.965697
          ],
          [
            108.198482,
            15.965697
          ],
          [
            108.198482,
            15.965497
          ],
          [
            108.198182,
            15.965497
          ],
          [
            108.198182,
            15.965697
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0127",
    "properties": {
      "id": "sx-dx2526-0127",
      "stt": 127,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Võ Thị Bút",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 379,
      "giong_cap_kg": 4.55,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192475,
            15.965466
          ],
          [
            108.192775,
            15.965466
          ],
          [
            108.192775,
            15.965266
          ],
          [
            108.192475,
            15.965266
          ],
          [
            108.192475,
            15.965466
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0128",
    "properties": {
      "id": "sx-dx2526-0128",
      "stt": 128,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Phạm Lưỡng",
      "ho_san_xuat": "Phạm Trung",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 910,
      "giong_cap_kg": 10.92,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192817,
            15.965447
          ],
          [
            108.193117,
            15.965447
          ],
          [
            108.193117,
            15.965247
          ],
          [
            108.192817,
            15.965247
          ],
          [
            108.192817,
            15.965447
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0129",
    "properties": {
      "id": "sx-dx2526-0129",
      "stt": 129,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 18",
      "chu_dat": "Phạm Mười",
      "ho_san_xuat": "Phạm Mười",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 910,
      "giong_cap_kg": 10.92,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193192,
            15.965426
          ],
          [
            108.193492,
            15.965426
          ],
          [
            108.193492,
            15.965226
          ],
          [
            108.193192,
            15.965226
          ],
          [
            108.193192,
            15.965426
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0130",
    "properties": {
      "id": "sx-dx2526-0130",
      "stt": 130,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Đặng Thị Thi",
      "ho_san_xuat": "Đặng Thị Hồng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193516,
            15.965415
          ],
          [
            108.193816,
            15.965415
          ],
          [
            108.193816,
            15.965215
          ],
          [
            108.193516,
            15.965215
          ],
          [
            108.193516,
            15.965415
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0131",
    "properties": {
      "id": "sx-dx2526-0131",
      "stt": 131,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Đặng Lâng",
      "ho_san_xuat": "Nguyễn Cứ (Tổ 5)",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193808,
            15.965418
          ],
          [
            108.194108,
            15.965418
          ],
          [
            108.194108,
            15.965218
          ],
          [
            108.193808,
            15.965218
          ],
          [
            108.193808,
            15.965418
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0132",
    "properties": {
      "id": "sx-dx2526-0132",
      "stt": 132,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Lê Duy Mỹ",
      "ho_san_xuat": "Đặng Văn Quân",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1600,
      "giong_cap_kg": 19.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19415,
            15.965434
          ],
          [
            108.19445,
            15.965434
          ],
          [
            108.19445,
            15.965234
          ],
          [
            108.19415,
            15.965234
          ],
          [
            108.19415,
            15.965434
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0133",
    "properties": {
      "id": "sx-dx2526-0133",
      "stt": 133,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Đặng Thị Tựu",
      "ho_san_xuat": "Lê Minh Cảnh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 920,
      "giong_cap_kg": 11.04,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194525,
            15.965455
          ],
          [
            108.194825,
            15.965455
          ],
          [
            108.194825,
            15.965255
          ],
          [
            108.194525,
            15.965255
          ],
          [
            108.194525,
            15.965455
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0134",
    "properties": {
      "id": "sx-dx2526-0134",
      "stt": 134,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Nguyễn Mai",
      "ho_san_xuat": "Lê Minh Cảnh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19485,
            15.965471
          ],
          [
            108.19515,
            15.965471
          ],
          [
            108.19515,
            15.965271
          ],
          [
            108.19485,
            15.965271
          ],
          [
            108.19485,
            15.965471
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0135",
    "properties": {
      "id": "sx-dx2526-0135",
      "stt": 135,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Nguyễn Thị Tùng",
      "ho_san_xuat": "Lê Minh Cảnh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195142,
            15.965474
          ],
          [
            108.195442,
            15.965474
          ],
          [
            108.195442,
            15.965274
          ],
          [
            108.195142,
            15.965274
          ],
          [
            108.195142,
            15.965474
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0136",
    "properties": {
      "id": "sx-dx2526-0136",
      "stt": 136,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Võ Thị Kiểu",
      "ho_san_xuat": "Võ Thị Kiểu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1072,
      "giong_cap_kg": 12.86,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195483,
            15.965462
          ],
          [
            108.195783,
            15.965462
          ],
          [
            108.195783,
            15.965262
          ],
          [
            108.195483,
            15.965262
          ],
          [
            108.195483,
            15.965462
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0137",
    "properties": {
      "id": "sx-dx2526-0137",
      "stt": 137,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Đặng Công",
      "ho_san_xuat": "Đặng Thị Bình",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 2080,
      "giong_cap_kg": 24.96,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195858,
            15.965442
          ],
          [
            108.196158,
            15.965442
          ],
          [
            108.196158,
            15.965242
          ],
          [
            108.195858,
            15.965242
          ],
          [
            108.195858,
            15.965442
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0138",
    "properties": {
      "id": "sx-dx2526-0138",
      "stt": 138,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 19",
      "chu_dat": "Lê Trình",
      "ho_san_xuat": "Đặng Hiệp",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1350,
      "giong_cap_kg": 16.2,
      "dot_phan_bo": "HG244-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196184,
            15.965423
          ],
          [
            108.196484,
            15.965423
          ],
          [
            108.196484,
            15.965223
          ],
          [
            108.196184,
            15.965223
          ],
          [
            108.196184,
            15.965423
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0139",
    "properties": {
      "id": "sx-dx2526-0139",
      "stt": 139,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Võ Dự",
      "ho_san_xuat": "Phạm Nhân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196475,
            15.965414
          ],
          [
            108.196775,
            15.965414
          ],
          [
            108.196775,
            15.965214
          ],
          [
            108.196475,
            15.965214
          ],
          [
            108.196475,
            15.965414
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0140",
    "properties": {
      "id": "sx-dx2526-0140",
      "stt": 140,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Đặng Thị Bạn",
      "ho_san_xuat": "Phạm Nhân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 510,
      "giong_cap_kg": 6.12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196816,
            15.965421
          ],
          [
            108.197116,
            15.965421
          ],
          [
            108.197116,
            15.965221
          ],
          [
            108.196816,
            15.965221
          ],
          [
            108.196816,
            15.965421
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0141",
    "properties": {
      "id": "sx-dx2526-0141",
      "stt": 141,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Phạm Trung",
      "ho_san_xuat": "Phạm Trung",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 815,
      "giong_cap_kg": 9.78,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197191,
            15.965439
          ],
          [
            108.197491,
            15.965439
          ],
          [
            108.197491,
            15.965239
          ],
          [
            108.197191,
            15.965239
          ],
          [
            108.197191,
            15.965439
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0142",
    "properties": {
      "id": "sx-dx2526-0142",
      "stt": 142,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Nguyễn Minh Tâm",
      "ho_san_xuat": "Võ Thị Huệ",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 900,
      "giong_cap_kg": 10.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197518,
            15.96546
          ],
          [
            108.197818,
            15.96546
          ],
          [
            108.197818,
            15.96526
          ],
          [
            108.197518,
            15.96526
          ],
          [
            108.197518,
            15.96546
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0143",
    "properties": {
      "id": "sx-dx2526-0143",
      "stt": 143,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Võ Khải",
      "ho_san_xuat": "Võ Đá",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 585,
      "giong_cap_kg": 7.02,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197809,
            15.965473
          ],
          [
            108.198109,
            15.965473
          ],
          [
            108.198109,
            15.965273
          ],
          [
            108.197809,
            15.965273
          ],
          [
            108.197809,
            15.965473
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0144",
    "properties": {
      "id": "sx-dx2526-0144",
      "stt": 144,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Võ Đá",
      "ho_san_xuat": "Võ Đá",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 465,
      "giong_cap_kg": 5.58,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965344,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198149,
            15.965472
          ],
          [
            108.198449,
            15.965472
          ],
          [
            108.198449,
            15.965272
          ],
          [
            108.198149,
            15.965272
          ],
          [
            108.198149,
            15.965472
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0145",
    "properties": {
      "id": "sx-dx2526-0145",
      "stt": 145,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Võ Kỳ",
      "ho_san_xuat": "Đặng Thiệu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 230,
      "giong_cap_kg": 2.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192524,
            15.965235
          ],
          [
            108.192824,
            15.965235
          ],
          [
            108.192824,
            15.965035
          ],
          [
            108.192524,
            15.965035
          ],
          [
            108.192524,
            15.965235
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0146",
    "properties": {
      "id": "sx-dx2526-0146",
      "stt": 146,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Nguyễn Thị Thu Thanh",
      "ho_san_xuat": "Đặng Thiệu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 680,
      "giong_cap_kg": 8.16,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192851,
            15.965214
          ],
          [
            108.193151,
            15.965214
          ],
          [
            108.193151,
            15.965014
          ],
          [
            108.192851,
            15.965014
          ],
          [
            108.192851,
            15.965214
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0147",
    "properties": {
      "id": "sx-dx2526-0147",
      "stt": 147,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Nguyễn Cứ (Tổ 5)",
      "ho_san_xuat": "Nguyễn Cứ (Tổ 5)",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 950,
      "giong_cap_kg": 11.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193143,
            15.965197
          ],
          [
            108.193443,
            15.965197
          ],
          [
            108.193443,
            15.964997
          ],
          [
            108.193143,
            15.964997
          ],
          [
            108.193143,
            15.965197
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0148",
    "properties": {
      "id": "sx-dx2526-0148",
      "stt": 148,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Đặng Thị Thi",
      "ho_san_xuat": "Đặng Thị Thi",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193482,
            15.965192
          ],
          [
            108.193782,
            15.965192
          ],
          [
            108.193782,
            15.964992
          ],
          [
            108.193482,
            15.964992
          ],
          [
            108.193482,
            15.965192
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0149",
    "properties": {
      "id": "sx-dx2526-0149",
      "stt": 149,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Phan Lan",
      "ho_san_xuat": "Lê Thị Bông",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193857,
            15.965202
          ],
          [
            108.194157,
            15.965202
          ],
          [
            108.194157,
            15.965002
          ],
          [
            108.193857,
            15.965002
          ],
          [
            108.193857,
            15.965202
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0150",
    "properties": {
      "id": "sx-dx2526-0150",
      "stt": 150,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Đặng Thử",
      "ho_san_xuat": "Đặng Thử",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 870,
      "giong_cap_kg": 10.44,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194185,
            15.965222
          ],
          [
            108.194485,
            15.965222
          ],
          [
            108.194485,
            15.965022
          ],
          [
            108.194185,
            15.965022
          ],
          [
            108.194185,
            15.965222
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0151",
    "properties": {
      "id": "sx-dx2526-0151",
      "stt": 151,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Võ Tuấn Hải",
      "ho_san_xuat": "Võ Tuấn Hải",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 970,
      "giong_cap_kg": 11.64,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194476,
            15.965242
          ],
          [
            108.194776,
            15.965242
          ],
          [
            108.194776,
            15.965042
          ],
          [
            108.194476,
            15.965042
          ],
          [
            108.194476,
            15.965242
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0152",
    "properties": {
      "id": "sx-dx2526-0152",
      "stt": 152,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 1",
      "chu_dat": "Võ Tiến Dũng",
      "ho_san_xuat": "Võ Hoàng Đại Việt",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 920,
      "giong_cap_kg": 11.04,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194815,
            15.965252
          ],
          [
            108.195115,
            15.965252
          ],
          [
            108.195115,
            15.965052
          ],
          [
            108.194815,
            15.965052
          ],
          [
            108.194815,
            15.965252
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0153",
    "properties": {
      "id": "sx-dx2526-0153",
      "stt": 153,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Nguyễn Nghĩa",
      "ho_san_xuat": "Nguyễn Đức Thanh",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19519,
            15.965247
          ],
          [
            108.19549,
            15.965247
          ],
          [
            108.19549,
            15.965047
          ],
          [
            108.19519,
            15.965047
          ],
          [
            108.19519,
            15.965247
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0154",
    "properties": {
      "id": "sx-dx2526-0154",
      "stt": 154,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Nguyễn Hồng Sơn",
      "ho_san_xuat": "Nguyễn Hồng Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 320,
      "giong_cap_kg": 3.84,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195519,
            15.965231
          ],
          [
            108.195819,
            15.965231
          ],
          [
            108.195819,
            15.965031
          ],
          [
            108.195519,
            15.965031
          ],
          [
            108.195519,
            15.965231
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0155",
    "properties": {
      "id": "sx-dx2526-0155",
      "stt": 155,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Nguyễn Hoàng Lâm",
      "ho_san_xuat": "Nguyễn Hồng Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19581,
            15.96521
          ],
          [
            108.19611,
            15.96521
          ],
          [
            108.19611,
            15.96501
          ],
          [
            108.19581,
            15.96501
          ],
          [
            108.19581,
            15.96521
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0156",
    "properties": {
      "id": "sx-dx2526-0156",
      "stt": 156,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Võ Long",
      "ho_san_xuat": "Đặng Dốn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 950,
      "giong_cap_kg": 11.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196148,
            15.965195
          ],
          [
            108.196448,
            15.965195
          ],
          [
            108.196448,
            15.964995
          ],
          [
            108.196148,
            15.964995
          ],
          [
            108.196148,
            15.965195
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0157",
    "properties": {
      "id": "sx-dx2526-0157",
      "stt": 157,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Đặng Chinh",
      "ho_san_xuat": "Đặng Chinh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1650,
      "giong_cap_kg": 19.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196523,
            15.965194
          ],
          [
            108.196823,
            15.965194
          ],
          [
            108.196823,
            15.964994
          ],
          [
            108.196523,
            15.964994
          ],
          [
            108.196523,
            15.965194
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0158",
    "properties": {
      "id": "sx-dx2526-0158",
      "stt": 158,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Nguyễn Hồng",
      "ho_san_xuat": "Nguyễn Hồng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 740,
      "giong_cap_kg": 8.88,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196853,
            15.965206
          ],
          [
            108.197153,
            15.965206
          ],
          [
            108.197153,
            15.965006
          ],
          [
            108.196853,
            15.965006
          ],
          [
            108.196853,
            15.965206
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0159",
    "properties": {
      "id": "sx-dx2526-0159",
      "stt": 159,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Đặng Năng",
      "ho_san_xuat": "Đặng Dốn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197144,
            15.965227
          ],
          [
            108.197444,
            15.965227
          ],
          [
            108.197444,
            15.965027
          ],
          [
            108.197144,
            15.965027
          ],
          [
            108.197144,
            15.965227
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0160",
    "properties": {
      "id": "sx-dx2526-0160",
      "stt": 160,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Đặng Văn Mười",
      "ho_san_xuat": "Đặng Văn Mười",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1650,
      "giong_cap_kg": 19.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197481,
            15.965245
          ],
          [
            108.197781,
            15.965245
          ],
          [
            108.197781,
            15.965045
          ],
          [
            108.197481,
            15.965045
          ],
          [
            108.197481,
            15.965245
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0161",
    "properties": {
      "id": "sx-dx2526-0161",
      "stt": 161,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Đặng Lâng",
      "ho_san_xuat": "Nguyễn Xin",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1250,
      "giong_cap_kg": 15,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197856,
            15.965252
          ],
          [
            108.198156,
            15.965252
          ],
          [
            108.198156,
            15.965052
          ],
          [
            108.197856,
            15.965052
          ],
          [
            108.197856,
            15.965252
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0162",
    "properties": {
      "id": "sx-dx2526-0162",
      "stt": 162,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Võ Tiến Dũng",
      "ho_san_xuat": "Võ Tiến Dũng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965122,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198186,
            15.965244
          ],
          [
            108.198486,
            15.965244
          ],
          [
            108.198486,
            15.965044
          ],
          [
            108.198186,
            15.965044
          ],
          [
            108.198186,
            15.965244
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0163",
    "properties": {
      "id": "sx-dx2526-0163",
      "stt": 163,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Nguyễn Thị Y",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 400,
      "giong_cap_kg": 4.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192477,
            15.965003
          ],
          [
            108.192777,
            15.965003
          ],
          [
            108.192777,
            15.964803
          ],
          [
            108.192477,
            15.964803
          ],
          [
            108.192477,
            15.965003
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0164",
    "properties": {
      "id": "sx-dx2526-0164",
      "stt": 164,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Đặng Chiến",
      "ho_san_xuat": "Đặng Chiến-B",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 740,
      "giong_cap_kg": 8.88,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192814,
            15.964983
          ],
          [
            108.193114,
            15.964983
          ],
          [
            108.193114,
            15.964783
          ],
          [
            108.192814,
            15.964783
          ],
          [
            108.192814,
            15.964983
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0165",
    "properties": {
      "id": "sx-dx2526-0165",
      "stt": 165,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Đặng Hiệp",
      "ho_san_xuat": "Đặng Hiệp",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193189,
            15.964971
          ],
          [
            108.193489,
            15.964971
          ],
          [
            108.193489,
            15.964771
          ],
          [
            108.193189,
            15.964771
          ],
          [
            108.193189,
            15.964971
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0166",
    "properties": {
      "id": "sx-dx2526-0166",
      "stt": 166,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 2",
      "chu_dat": "Phạm Ngữ",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 790,
      "giong_cap_kg": 9.48,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19352,
            15.964973
          ],
          [
            108.19382,
            15.964973
          ],
          [
            108.19382,
            15.964773
          ],
          [
            108.19352,
            15.964773
          ],
          [
            108.19352,
            15.964973
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0167",
    "properties": {
      "id": "sx-dx2526-0167",
      "stt": 167,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đặng Văn Quang",
      "ho_san_xuat": "Đặng Văn Quang",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 2150,
      "giong_cap_kg": 25.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193811,
            15.964989
          ],
          [
            108.194111,
            15.964989
          ],
          [
            108.194111,
            15.964789
          ],
          [
            108.193811,
            15.964789
          ],
          [
            108.193811,
            15.964989
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0168",
    "properties": {
      "id": "sx-dx2526-0168",
      "stt": 168,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Nguyễn Phận",
      "ho_san_xuat": "Đặng Văn Quang",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194146,
            15.96501
          ],
          [
            108.194446,
            15.96501
          ],
          [
            108.194446,
            15.96481
          ],
          [
            108.194146,
            15.96481
          ],
          [
            108.194146,
            15.96501
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0169",
    "properties": {
      "id": "sx-dx2526-0169",
      "stt": 169,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đặng Chiến",
      "ho_san_xuat": "Đặng Chiến-B",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194522,
            15.965026
          ],
          [
            108.194822,
            15.965026
          ],
          [
            108.194822,
            15.964826
          ],
          [
            108.194522,
            15.964826
          ],
          [
            108.194522,
            15.965026
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0170",
    "properties": {
      "id": "sx-dx2526-0170",
      "stt": 170,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đặng Dốn",
      "ho_san_xuat": "Đặng Văn Quang",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194854,
            15.965029
          ],
          [
            108.195154,
            15.965029
          ],
          [
            108.195154,
            15.964829
          ],
          [
            108.194854,
            15.964829
          ],
          [
            108.194854,
            15.965029
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0171",
    "properties": {
      "id": "sx-dx2526-0171",
      "stt": 171,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đặng Quang Viên",
      "ho_san_xuat": "Đặng Quang Viên",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195145,
            15.965018
          ],
          [
            108.195445,
            15.965018
          ],
          [
            108.195445,
            15.964818
          ],
          [
            108.195145,
            15.964818
          ],
          [
            108.195145,
            15.965018
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0172",
    "properties": {
      "id": "sx-dx2526-0172",
      "stt": 172,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Võ Thị Phước",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195479,
            15.964998
          ],
          [
            108.195779,
            15.964998
          ],
          [
            108.195779,
            15.964798
          ],
          [
            108.195479,
            15.964798
          ],
          [
            108.195479,
            15.964998
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0173",
    "properties": {
      "id": "sx-dx2526-0173",
      "stt": 173,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Nguyễn Nho",
      "ho_san_xuat": "Nguyễn Nho",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195855,
            15.964979
          ],
          [
            108.196155,
            15.964979
          ],
          [
            108.196155,
            15.964779
          ],
          [
            108.195855,
            15.964779
          ],
          [
            108.195855,
            15.964979
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0174",
    "properties": {
      "id": "sx-dx2526-0174",
      "stt": 174,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Nguyễn Hồng",
      "ho_san_xuat": "Nguyễn Hồng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196187,
            15.96497
          ],
          [
            108.196487,
            15.96497
          ],
          [
            108.196487,
            15.96477
          ],
          [
            108.196187,
            15.96477
          ],
          [
            108.196187,
            15.96497
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0175",
    "properties": {
      "id": "sx-dx2526-0175",
      "stt": 175,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đặng Hiệp",
      "ho_san_xuat": "Trần Mai Trường",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196478,
            15.964976
          ],
          [
            108.196778,
            15.964976
          ],
          [
            108.196778,
            15.964776
          ],
          [
            108.196478,
            15.964776
          ],
          [
            108.196478,
            15.964976
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0176",
    "properties": {
      "id": "sx-dx2526-0176",
      "stt": 176,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Nguyễn Thị Thanh Vĩ",
      "ho_san_xuat": "Trần Mai Trường",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196812,
            15.964993
          ],
          [
            108.197112,
            15.964993
          ],
          [
            108.197112,
            15.964793
          ],
          [
            108.196812,
            15.964793
          ],
          [
            108.196812,
            15.964993
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0177",
    "properties": {
      "id": "sx-dx2526-0177",
      "stt": 177,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đinh Thị Thương",
      "ho_san_xuat": "Đinh Thị Thương",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197188,
            15.965014
          ],
          [
            108.197488,
            15.965014
          ],
          [
            108.197488,
            15.964814
          ],
          [
            108.197188,
            15.964814
          ],
          [
            108.197188,
            15.965014
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0178",
    "properties": {
      "id": "sx-dx2526-0178",
      "stt": 178,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Nguyễn Lâm",
      "ho_san_xuat": "Nguyễn Lâm",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197521,
            15.965028
          ],
          [
            108.197821,
            15.965028
          ],
          [
            108.197821,
            15.964828
          ],
          [
            108.197521,
            15.964828
          ],
          [
            108.197521,
            15.965028
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0179",
    "properties": {
      "id": "sx-dx2526-0179",
      "stt": 179,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đặng Hồng - Học",
      "ho_san_xuat": "Đặng Học",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197812,
            15.965028
          ],
          [
            108.198112,
            15.965028
          ],
          [
            108.198112,
            15.964828
          ],
          [
            108.197812,
            15.964828
          ],
          [
            108.197812,
            15.965028
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0180",
    "properties": {
      "id": "sx-dx2526-0180",
      "stt": 180,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Phạm Rô",
      "ho_san_xuat": "Phạm Rô",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.9649,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198145,
            15.965014
          ],
          [
            108.198445,
            15.965014
          ],
          [
            108.198445,
            15.964814
          ],
          [
            108.198145,
            15.964814
          ],
          [
            108.198145,
            15.965014
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0181",
    "properties": {
      "id": "sx-dx2526-0181",
      "stt": 181,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Nguyễn Nhơn",
      "ho_san_xuat": "Nguyễn Nhơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192521,
            15.964771
          ],
          [
            108.192821,
            15.964771
          ],
          [
            108.192821,
            15.964571
          ],
          [
            108.192521,
            15.964571
          ],
          [
            108.192521,
            15.964771
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0182",
    "properties": {
      "id": "sx-dx2526-0182",
      "stt": 182,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Đặng Văn Mười",
      "ho_san_xuat": "Đinh Lệ",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192855,
            15.964754
          ],
          [
            108.193155,
            15.964754
          ],
          [
            108.193155,
            15.964554
          ],
          [
            108.192855,
            15.964554
          ],
          [
            108.192855,
            15.964754
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0183",
    "properties": {
      "id": "sx-dx2526-0183",
      "stt": 183,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Nguyễn Đính",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193146,
            15.964748
          ],
          [
            108.193446,
            15.964748
          ],
          [
            108.193446,
            15.964548
          ],
          [
            108.193146,
            15.964548
          ],
          [
            108.193146,
            15.964748
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0184",
    "properties": {
      "id": "sx-dx2526-0184",
      "stt": 184,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 3",
      "chu_dat": "Lâm Tùng Nghĩa",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193478,
            15.964757
          ],
          [
            108.193778,
            15.964757
          ],
          [
            108.193778,
            15.964557
          ],
          [
            108.193478,
            15.964557
          ],
          [
            108.193478,
            15.964757
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0185",
    "properties": {
      "id": "sx-dx2526-0185",
      "stt": 185,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Nguyễn Đính",
      "ho_san_xuat": "Nguyễn Đính",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 815,
      "giong_cap_kg": 9.78,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193854,
            15.964776
          ],
          [
            108.194154,
            15.964776
          ],
          [
            108.194154,
            15.964576
          ],
          [
            108.193854,
            15.964576
          ],
          [
            108.193854,
            15.964776
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0186",
    "properties": {
      "id": "sx-dx2526-0186",
      "stt": 186,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Lê Văn Hồng",
      "ho_san_xuat": "Hồ Hoàng Kiếm",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1208,
      "giong_cap_kg": 14.5,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194189,
            15.964796
          ],
          [
            108.194489,
            15.964796
          ],
          [
            108.194489,
            15.964596
          ],
          [
            108.194189,
            15.964596
          ],
          [
            108.194189,
            15.964796
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0187",
    "properties": {
      "id": "sx-dx2526-0187",
      "stt": 187,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đặng Toàn",
      "ho_san_xuat": "Đặng Toàn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 476,
      "giong_cap_kg": 5.71,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19448,
            15.964807
          ],
          [
            108.19478,
            15.964807
          ],
          [
            108.19478,
            15.964607
          ],
          [
            108.19448,
            15.964607
          ],
          [
            108.19448,
            15.964807
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0188",
    "properties": {
      "id": "sx-dx2526-0188",
      "stt": 188,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đặng Quang Viên",
      "ho_san_xuat": "Đặng Quang Viên",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194811,
            15.964804
          ],
          [
            108.195111,
            15.964804
          ],
          [
            108.195111,
            15.964604
          ],
          [
            108.194811,
            15.964604
          ],
          [
            108.194811,
            15.964804
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0189",
    "properties": {
      "id": "sx-dx2526-0189",
      "stt": 189,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đặng Thị Tâm",
      "ho_san_xuat": "Đặng Quang - Hoài",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 478,
      "giong_cap_kg": 5.74,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195187,
            15.964787
          ],
          [
            108.195487,
            15.964787
          ],
          [
            108.195487,
            15.964587
          ],
          [
            108.195187,
            15.964587
          ],
          [
            108.195187,
            15.964787
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0190",
    "properties": {
      "id": "sx-dx2526-0190",
      "stt": 190,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đặng Quang - Hoài",
      "ho_san_xuat": "Đặng Quang - Hoài",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195522,
            15.964766
          ],
          [
            108.195822,
            15.964766
          ],
          [
            108.195822,
            15.964566
          ],
          [
            108.195522,
            15.964566
          ],
          [
            108.195522,
            15.964766
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0191",
    "properties": {
      "id": "sx-dx2526-0191",
      "stt": 191,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đặng Phước",
      "ho_san_xuat": "Lê Thị Tằm",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 384,
      "giong_cap_kg": 4.61,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195813,
            15.964751
          ],
          [
            108.196113,
            15.964751
          ],
          [
            108.196113,
            15.964551
          ],
          [
            108.195813,
            15.964551
          ],
          [
            108.195813,
            15.964751
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0192",
    "properties": {
      "id": "sx-dx2526-0192",
      "stt": 192,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đặng Sơn",
      "ho_san_xuat": "Trần Thị Toàn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1150,
      "giong_cap_kg": 13.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196144,
            15.964749
          ],
          [
            108.196444,
            15.964749
          ],
          [
            108.196444,
            15.964549
          ],
          [
            108.196144,
            15.964549
          ],
          [
            108.196144,
            15.964749
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0193",
    "properties": {
      "id": "sx-dx2526-0193",
      "stt": 193,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Nguyễn Văn Lợi",
      "ho_san_xuat": "Nguyễn Văn Lợi",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 485,
      "giong_cap_kg": 5.82,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19652,
            15.964761
          ],
          [
            108.19682,
            15.964761
          ],
          [
            108.19682,
            15.964561
          ],
          [
            108.19652,
            15.964561
          ],
          [
            108.19652,
            15.964761
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0194",
    "properties": {
      "id": "sx-dx2526-0194",
      "stt": 194,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Trương Thị Tàu",
      "ho_san_xuat": "Trương Thị Tàu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 485,
      "giong_cap_kg": 5.82,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196856,
            15.964781
          ],
          [
            108.197156,
            15.964781
          ],
          [
            108.197156,
            15.964581
          ],
          [
            108.196856,
            15.964581
          ],
          [
            108.196856,
            15.964781
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0195",
    "properties": {
      "id": "sx-dx2526-0195",
      "stt": 195,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Trần Thị Nga",
      "ho_san_xuat": "Nguyễn Thị Được",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 964,
      "giong_cap_kg": 11.57,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197147,
            15.9648
          ],
          [
            108.197447,
            15.9648
          ],
          [
            108.197447,
            15.9646
          ],
          [
            108.197147,
            15.9646
          ],
          [
            108.197147,
            15.9648
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0196",
    "properties": {
      "id": "sx-dx2526-0196",
      "stt": 196,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đinh Ngọc Em",
      "ho_san_xuat": "Đinh Thị Thương",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1156,
      "giong_cap_kg": 13.87,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197477,
            15.964808
          ],
          [
            108.197777,
            15.964808
          ],
          [
            108.197777,
            15.964608
          ],
          [
            108.197477,
            15.964608
          ],
          [
            108.197477,
            15.964808
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0197",
    "properties": {
      "id": "sx-dx2526-0197",
      "stt": 197,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Đặng Thị Nhỏ",
      "ho_san_xuat": "Đặng Dốn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1268,
      "giong_cap_kg": 15.22,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197853,
            15.964801
          ],
          [
            108.198153,
            15.964801
          ],
          [
            108.198153,
            15.964601
          ],
          [
            108.197853,
            15.964601
          ],
          [
            108.197853,
            15.964801
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0198",
    "properties": {
      "id": "sx-dx2526-0198",
      "stt": 198,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Bùi Thị Gái",
      "ho_san_xuat": "Đặng Thử",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 980,
      "giong_cap_kg": 11.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964678,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19819,
            15.964783
          ],
          [
            108.19849,
            15.964783
          ],
          [
            108.19849,
            15.964583
          ],
          [
            108.19819,
            15.964583
          ],
          [
            108.19819,
            15.964783
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0199",
    "properties": {
      "id": "sx-dx2526-0199",
      "stt": 199,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 5",
      "chu_dat": "Võ Trung Thành",
      "ho_san_xuat": "Võ Trung Thành",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 728,
      "giong_cap_kg": 8.74,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192481,
            15.96454
          ],
          [
            108.192781,
            15.96454
          ],
          [
            108.192781,
            15.96434
          ],
          [
            108.192481,
            15.96434
          ],
          [
            108.192481,
            15.96454
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0200",
    "properties": {
      "id": "sx-dx2526-0200",
      "stt": 200,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Đặng Chiến",
      "ho_san_xuat": "Đặng Chiến-B",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 570,
      "giong_cap_kg": 6.84,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19281,
            15.964527
          ],
          [
            108.19311,
            15.964527
          ],
          [
            108.19311,
            15.964327
          ],
          [
            108.19281,
            15.964327
          ],
          [
            108.19281,
            15.964527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0201",
    "properties": {
      "id": "sx-dx2526-0201",
      "stt": 201,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Phạm Mười",
      "ho_san_xuat": "Phạm Thị Chín",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193186,
            15.964528
          ],
          [
            108.193486,
            15.964528
          ],
          [
            108.193486,
            15.964328
          ],
          [
            108.193186,
            15.964328
          ],
          [
            108.193186,
            15.964528
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0202",
    "properties": {
      "id": "sx-dx2526-0202",
      "stt": 202,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Đặng Văn Hùng - Oai",
      "ho_san_xuat": "Đặng Văn Hùng - Oai",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193523,
            15.964543
          ],
          [
            108.193823,
            15.964543
          ],
          [
            108.193823,
            15.964343
          ],
          [
            108.193523,
            15.964343
          ],
          [
            108.193523,
            15.964543
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0203",
    "properties": {
      "id": "sx-dx2526-0203",
      "stt": 203,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Phạm Thị Hiệp",
      "ho_san_xuat": "Nguyễn Côi",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193815,
            15.964564
          ],
          [
            108.194115,
            15.964564
          ],
          [
            108.194115,
            15.964364
          ],
          [
            108.193815,
            15.964364
          ],
          [
            108.193815,
            15.964564
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0204",
    "properties": {
      "id": "sx-dx2526-0204",
      "stt": 204,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Nguyễn Thị Năm",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194143,
            15.964581
          ],
          [
            108.194443,
            15.964581
          ],
          [
            108.194443,
            15.964381
          ],
          [
            108.194143,
            15.964381
          ],
          [
            108.194143,
            15.964581
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0205",
    "properties": {
      "id": "sx-dx2526-0205",
      "stt": 205,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Võ Diên",
      "ho_san_xuat": "Võ Văn Vũ",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194519,
            15.964585
          ],
          [
            108.194819,
            15.964585
          ],
          [
            108.194819,
            15.964385
          ],
          [
            108.194519,
            15.964385
          ],
          [
            108.194519,
            15.964585
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0206",
    "properties": {
      "id": "sx-dx2526-0206",
      "stt": 206,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Nguyễn Cứ (Tổ 5)",
      "ho_san_xuat": "Nguyễn Cứ (Tổ 5)",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 370,
      "giong_cap_kg": 4.44,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194857,
            15.964575
          ],
          [
            108.195157,
            15.964575
          ],
          [
            108.195157,
            15.964375
          ],
          [
            108.194857,
            15.964375
          ],
          [
            108.194857,
            15.964575
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0207",
    "properties": {
      "id": "sx-dx2526-0207",
      "stt": 207,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Võ Lai",
      "ho_san_xuat": "Võ Lai",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195148,
            15.964555
          ],
          [
            108.195448,
            15.964555
          ],
          [
            108.195448,
            15.964355
          ],
          [
            108.195148,
            15.964355
          ],
          [
            108.195148,
            15.964555
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0208",
    "properties": {
      "id": "sx-dx2526-0208",
      "stt": 208,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Đặng Văn Đối",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195476,
            15.964536
          ],
          [
            108.195776,
            15.964536
          ],
          [
            108.195776,
            15.964336
          ],
          [
            108.195476,
            15.964336
          ],
          [
            108.195476,
            15.964536
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0209",
    "properties": {
      "id": "sx-dx2526-0209",
      "stt": 209,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Võ Sang",
      "ho_san_xuat": "Võ Đình Nguyên",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195851,
            15.964526
          ],
          [
            108.196151,
            15.964526
          ],
          [
            108.196151,
            15.964326
          ],
          [
            108.195851,
            15.964326
          ],
          [
            108.195851,
            15.964526
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0210",
    "properties": {
      "id": "sx-dx2526-0210",
      "stt": 210,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Nguyễn Khanh",
      "ho_san_xuat": "Nguyễn Tám",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196191,
            15.964531
          ],
          [
            108.196491,
            15.964531
          ],
          [
            108.196491,
            15.964331
          ],
          [
            108.196191,
            15.964331
          ],
          [
            108.196191,
            15.964531
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0211",
    "properties": {
      "id": "sx-dx2526-0211",
      "stt": 211,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Nguyễn Thị Sở",
      "ho_san_xuat": "Nguyễn Côi",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196482,
            15.964548
          ],
          [
            108.196782,
            15.964548
          ],
          [
            108.196782,
            15.964348
          ],
          [
            108.196482,
            15.964348
          ],
          [
            108.196482,
            15.964548
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0212",
    "properties": {
      "id": "sx-dx2526-0212",
      "stt": 212,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Nguyễn Thị Phúc",
      "ho_san_xuat": "Nguyễn Thị Phúc",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 740,
      "giong_cap_kg": 8.88,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196809,
            15.964569
          ],
          [
            108.197109,
            15.964569
          ],
          [
            108.197109,
            15.964369
          ],
          [
            108.196809,
            15.964369
          ],
          [
            108.196809,
            15.964569
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0213",
    "properties": {
      "id": "sx-dx2526-0213",
      "stt": 213,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Nguyễn Hồng",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 487,
      "giong_cap_kg": 5.84,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197184,
            15.964583
          ],
          [
            108.197484,
            15.964583
          ],
          [
            108.197484,
            15.964383
          ],
          [
            108.197184,
            15.964383
          ],
          [
            108.197184,
            15.964583
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0214",
    "properties": {
      "id": "sx-dx2526-0214",
      "stt": 214,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Trần Đình Tân",
      "ho_san_xuat": "Võ Thị Thu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197524,
            15.964584
          ],
          [
            108.197824,
            15.964584
          ],
          [
            108.197824,
            15.964384
          ],
          [
            108.197524,
            15.964384
          ],
          [
            108.197524,
            15.964584
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0215",
    "properties": {
      "id": "sx-dx2526-0215",
      "stt": 215,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Nguyễn Xin",
      "ho_san_xuat": "Nguyễn Xuân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 590,
      "giong_cap_kg": 7.08,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197816,
            15.964571
          ],
          [
            108.198116,
            15.964571
          ],
          [
            108.198116,
            15.964371
          ],
          [
            108.197816,
            15.964371
          ],
          [
            108.197816,
            15.964571
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0216",
    "properties": {
      "id": "sx-dx2526-0216",
      "stt": 216,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Đặng Thử",
      "ho_san_xuat": "Đặng Thử",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 790,
      "giong_cap_kg": 9.48,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964456,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198142,
            15.96455
          ],
          [
            108.198442,
            15.96455
          ],
          [
            108.198442,
            15.96435
          ],
          [
            108.198142,
            15.96435
          ],
          [
            108.198142,
            15.96455
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0217",
    "properties": {
      "id": "sx-dx2526-0217",
      "stt": 217,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Đặng Xuân Nhân",
      "ho_san_xuat": "Đặng Thị Xuân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192517,
            15.96431
          ],
          [
            108.192817,
            15.96431
          ],
          [
            108.192817,
            15.96411
          ],
          [
            108.192517,
            15.96411
          ],
          [
            108.192517,
            15.96431
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0218",
    "properties": {
      "id": "sx-dx2526-0218",
      "stt": 218,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Đặng Chinh",
      "ho_san_xuat": "Đặng Chinh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 590,
      "giong_cap_kg": 7.08,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192858,
            15.964303
          ],
          [
            108.193158,
            15.964303
          ],
          [
            108.193158,
            15.964103
          ],
          [
            108.192858,
            15.964103
          ],
          [
            108.192858,
            15.964303
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0219",
    "properties": {
      "id": "sx-dx2526-0219",
      "stt": 219,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Phạm Thị Tứ",
      "ho_san_xuat": "Đặng Hoàng Bình",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 440,
      "giong_cap_kg": 5.28,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19315,
            15.964312
          ],
          [
            108.19345,
            15.964312
          ],
          [
            108.19345,
            15.964112
          ],
          [
            108.19315,
            15.964112
          ],
          [
            108.19315,
            15.964312
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0220",
    "properties": {
      "id": "sx-dx2526-0220",
      "stt": 220,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 6",
      "chu_dat": "Võ Thị Chi",
      "ho_san_xuat": "Võ Thị Chi",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 790,
      "giong_cap_kg": 9.48,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193475,
            15.96433
          ],
          [
            108.193775,
            15.96433
          ],
          [
            108.193775,
            15.96413
          ],
          [
            108.193475,
            15.96413
          ],
          [
            108.193475,
            15.96433
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0221",
    "properties": {
      "id": "sx-dx2526-0221",
      "stt": 221,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Nguyễn Thị Chuốt",
      "ho_san_xuat": "Đặng Học",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19385,
            15.964351
          ],
          [
            108.19415,
            15.964351
          ],
          [
            108.19415,
            15.964151
          ],
          [
            108.19385,
            15.964151
          ],
          [
            108.19385,
            15.964351
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0222",
    "properties": {
      "id": "sx-dx2526-0222",
      "stt": 222,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Nguyễn Nhơn",
      "ho_san_xuat": "Nguyễn Nhơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194192,
            15.964363
          ],
          [
            108.194492,
            15.964363
          ],
          [
            108.194492,
            15.964163
          ],
          [
            108.194192,
            15.964163
          ],
          [
            108.194192,
            15.964363
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0223",
    "properties": {
      "id": "sx-dx2526-0223",
      "stt": 223,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Nguyễn Nho",
      "ho_san_xuat": "Nguyễn Nho",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194483,
            15.96436
          ],
          [
            108.194783,
            15.96436
          ],
          [
            108.194783,
            15.96416
          ],
          [
            108.194483,
            15.96416
          ],
          [
            108.194483,
            15.96436
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0224",
    "properties": {
      "id": "sx-dx2526-0224",
      "stt": 224,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Lâm Tùng Nghĩa",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194808,
            15.964344
          ],
          [
            108.195108,
            15.964344
          ],
          [
            108.195108,
            15.964144
          ],
          [
            108.194808,
            15.964144
          ],
          [
            108.194808,
            15.964344
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0225",
    "properties": {
      "id": "sx-dx2526-0225",
      "stt": 225,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Võ Sáu",
      "ho_san_xuat": "Võ Sáu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195183,
            15.964323
          ],
          [
            108.195483,
            15.964323
          ],
          [
            108.195483,
            15.964123
          ],
          [
            108.195183,
            15.964123
          ],
          [
            108.195183,
            15.964323
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0226",
    "properties": {
      "id": "sx-dx2526-0226",
      "stt": 226,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Bùi Hiếu Mạnh",
      "ho_san_xuat": "Bùi Hiếu Mạnh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195525,
            15.964307
          ],
          [
            108.195825,
            15.964307
          ],
          [
            108.195825,
            15.964107
          ],
          [
            108.195525,
            15.964107
          ],
          [
            108.195525,
            15.964307
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0227",
    "properties": {
      "id": "sx-dx2526-0227",
      "stt": 227,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Nguyễn Đính",
      "ho_san_xuat": "Đặng Dốn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1500,
      "giong_cap_kg": 18,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195817,
            15.964304
          ],
          [
            108.196117,
            15.964304
          ],
          [
            108.196117,
            15.964104
          ],
          [
            108.195817,
            15.964104
          ],
          [
            108.195817,
            15.964304
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0228",
    "properties": {
      "id": "sx-dx2526-0228",
      "stt": 228,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Phan Lan",
      "ho_san_xuat": "Lê Thị Bông",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1830,
      "giong_cap_kg": 21.96,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196141,
            15.964315
          ],
          [
            108.196441,
            15.964315
          ],
          [
            108.196441,
            15.964115
          ],
          [
            108.196141,
            15.964115
          ],
          [
            108.196141,
            15.964315
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0229",
    "properties": {
      "id": "sx-dx2526-0229",
      "stt": 229,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Đặng Văn Quang",
      "ho_san_xuat": "Đặng Dốn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1500,
      "giong_cap_kg": 18,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196516,
            15.964335
          ],
          [
            108.196816,
            15.964335
          ],
          [
            108.196816,
            15.964135
          ],
          [
            108.196516,
            15.964135
          ],
          [
            108.196516,
            15.964335
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0230",
    "properties": {
      "id": "sx-dx2526-0230",
      "stt": 230,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Võ Thị Thủy",
      "ho_san_xuat": "Võ Thị Thủy",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196859,
            15.964355
          ],
          [
            108.197159,
            15.964355
          ],
          [
            108.197159,
            15.964155
          ],
          [
            108.196859,
            15.964155
          ],
          [
            108.196859,
            15.964355
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0231",
    "properties": {
      "id": "sx-dx2526-0231",
      "stt": 231,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Đặng Chinh",
      "ho_san_xuat": "Đặng Chinh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197151,
            15.964363
          ],
          [
            108.197451,
            15.964363
          ],
          [
            108.197451,
            15.964163
          ],
          [
            108.197151,
            15.964163
          ],
          [
            108.197151,
            15.964363
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0232",
    "properties": {
      "id": "sx-dx2526-0232",
      "stt": 232,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Lâm Tùng Nghĩa",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197474,
            15.964357
          ],
          [
            108.197774,
            15.964357
          ],
          [
            108.197774,
            15.964157
          ],
          [
            108.197474,
            15.964157
          ],
          [
            108.197474,
            15.964357
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0233",
    "properties": {
      "id": "sx-dx2526-0233",
      "stt": 233,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Phạm Xong",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197849,
            15.964339
          ],
          [
            108.198149,
            15.964339
          ],
          [
            108.198149,
            15.964139
          ],
          [
            108.197849,
            15.964139
          ],
          [
            108.197849,
            15.964339
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0234",
    "properties": {
      "id": "sx-dx2526-0234",
      "stt": 234,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Đặng Văn Mười",
      "ho_san_xuat": "Đặng Lào",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964233,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198192,
            15.964319
          ],
          [
            108.198492,
            15.964319
          ],
          [
            108.198492,
            15.964119
          ],
          [
            108.198192,
            15.964119
          ],
          [
            108.198192,
            15.964319
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0235",
    "properties": {
      "id": "sx-dx2526-0235",
      "stt": 235,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Nguyễn Thị Thanh Vĩ",
      "ho_san_xuat": "Bùi Hiếu Mạnh",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192485,
            15.964083
          ],
          [
            108.192785,
            15.964083
          ],
          [
            108.192785,
            15.963883
          ],
          [
            108.192485,
            15.963883
          ],
          [
            108.192485,
            15.964083
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0236",
    "properties": {
      "id": "sx-dx2526-0236",
      "stt": 236,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 7",
      "chu_dat": "Đinh Thị Thương",
      "ho_san_xuat": "Đinh Thị Thương",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192807,
            15.964083
          ],
          [
            108.193107,
            15.964083
          ],
          [
            108.193107,
            15.963883
          ],
          [
            108.192807,
            15.963883
          ],
          [
            108.192807,
            15.964083
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0237",
    "properties": {
      "id": "sx-dx2526-0237",
      "stt": 237,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Lê Thị Tơ",
      "ho_san_xuat": "Lê Thị Tơ",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1062,
      "giong_cap_kg": 12.74,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193182,
            15.964097
          ],
          [
            108.193482,
            15.964097
          ],
          [
            108.193482,
            15.963897
          ],
          [
            108.193182,
            15.963897
          ],
          [
            108.193182,
            15.964097
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0238",
    "properties": {
      "id": "sx-dx2526-0238",
      "stt": 238,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Đinh Lệ",
      "ho_san_xuat": "Đinh Lệ",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 483,
      "giong_cap_kg": 5.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193526,
            15.964118
          ],
          [
            108.193826,
            15.964118
          ],
          [
            108.193826,
            15.963918
          ],
          [
            108.193526,
            15.963918
          ],
          [
            108.193526,
            15.964118
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0239",
    "properties": {
      "id": "sx-dx2526-0239",
      "stt": 239,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Đính",
      "ho_san_xuat": "Nguyễn Nho",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193818,
            15.964136
          ],
          [
            108.194118,
            15.964136
          ],
          [
            108.194118,
            15.963936
          ],
          [
            108.193818,
            15.963936
          ],
          [
            108.193818,
            15.964136
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0240",
    "properties": {
      "id": "sx-dx2526-0240",
      "stt": 240,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Nho",
      "ho_san_xuat": "Nguyễn Nho",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 477,
      "giong_cap_kg": 5.72,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194141,
            15.964141
          ],
          [
            108.194441,
            15.964141
          ],
          [
            108.194441,
            15.963941
          ],
          [
            108.194141,
            15.963941
          ],
          [
            108.194141,
            15.964141
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0241",
    "properties": {
      "id": "sx-dx2526-0241",
      "stt": 241,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Nhơn",
      "ho_san_xuat": "Nguyễn Nhơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 477,
      "giong_cap_kg": 5.72,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194515,
            15.964132
          ],
          [
            108.194815,
            15.964132
          ],
          [
            108.194815,
            15.963932
          ],
          [
            108.194515,
            15.963932
          ],
          [
            108.194515,
            15.964132
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0242",
    "properties": {
      "id": "sx-dx2526-0242",
      "stt": 242,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Đặng Xuân Nhân",
      "ho_san_xuat": "Đặng Xuân Lư",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19486,
            15.964112
          ],
          [
            108.19516,
            15.964112
          ],
          [
            108.19516,
            15.963912
          ],
          [
            108.19486,
            15.963912
          ],
          [
            108.19486,
            15.964112
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0243",
    "properties": {
      "id": "sx-dx2526-0243",
      "stt": 243,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Đặng Năng",
      "ho_san_xuat": "Đặng Mau",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 974,
      "giong_cap_kg": 11.69,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195152,
            15.964092
          ],
          [
            108.195452,
            15.964092
          ],
          [
            108.195452,
            15.963892
          ],
          [
            108.195152,
            15.963892
          ],
          [
            108.195152,
            15.964092
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0244",
    "properties": {
      "id": "sx-dx2526-0244",
      "stt": 244,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Quang Thơ",
      "ho_san_xuat": "Nguyễn Quang Thơ",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1665,
      "giong_cap_kg": 19.98,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195474,
            15.964082
          ],
          [
            108.195774,
            15.964082
          ],
          [
            108.195774,
            15.963882
          ],
          [
            108.195474,
            15.963882
          ],
          [
            108.195474,
            15.964082
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0245",
    "properties": {
      "id": "sx-dx2526-0245",
      "stt": 245,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Phạm Công Anh",
      "ho_san_xuat": "Phạm Công Anh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195847,
            15.964085
          ],
          [
            108.196147,
            15.964085
          ],
          [
            108.196147,
            15.963885
          ],
          [
            108.195847,
            15.963885
          ],
          [
            108.195847,
            15.964085
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0246",
    "properties": {
      "id": "sx-dx2526-0246",
      "stt": 246,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Thị Chiến",
      "ho_san_xuat": "Nguyễn Thị Chiến",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 945,
      "giong_cap_kg": 11.34,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196193,
            15.964102
          ],
          [
            108.196493,
            15.964102
          ],
          [
            108.196493,
            15.963902
          ],
          [
            108.196193,
            15.963902
          ],
          [
            108.196193,
            15.964102
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0247",
    "properties": {
      "id": "sx-dx2526-0247",
      "stt": 247,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Thị Xuân Hương",
      "ho_san_xuat": "Bùi Hiếu Tàu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 970,
      "giong_cap_kg": 11.64,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196486,
            15.964123
          ],
          [
            108.196786,
            15.964123
          ],
          [
            108.196786,
            15.963923
          ],
          [
            108.196486,
            15.963923
          ],
          [
            108.196486,
            15.964123
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0248",
    "properties": {
      "id": "sx-dx2526-0248",
      "stt": 248,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Bùi Đức",
      "ho_san_xuat": "Bùi Hiếu Tàu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196807,
            15.964138
          ],
          [
            108.197107,
            15.964138
          ],
          [
            108.197107,
            15.963938
          ],
          [
            108.196807,
            15.963938
          ],
          [
            108.196807,
            15.964138
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0249",
    "properties": {
      "id": "sx-dx2526-0249",
      "stt": 249,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Hồng Sơn",
      "ho_san_xuat": "Đặng Mau",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19718,
            15.96414
          ],
          [
            108.19748,
            15.96414
          ],
          [
            108.19748,
            15.96394
          ],
          [
            108.19718,
            15.96394
          ],
          [
            108.19718,
            15.96414
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0250",
    "properties": {
      "id": "sx-dx2526-0250",
      "stt": 250,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Võ Thị Phước",
      "ho_san_xuat": "Võ Thị Phước",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 482,
      "giong_cap_kg": 5.78,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197527,
            15.964128
          ],
          [
            108.197827,
            15.964128
          ],
          [
            108.197827,
            15.963928
          ],
          [
            108.197527,
            15.963928
          ],
          [
            108.197527,
            15.964128
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0251",
    "properties": {
      "id": "sx-dx2526-0251",
      "stt": 251,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Đặng Thị Bé",
      "ho_san_xuat": "Đặng Thị Bé",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 964,
      "giong_cap_kg": 11.57,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19782,
            15.964107
          ],
          [
            108.19812,
            15.964107
          ],
          [
            108.19812,
            15.963907
          ],
          [
            108.19782,
            15.963907
          ],
          [
            108.19782,
            15.964107
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0252",
    "properties": {
      "id": "sx-dx2526-0252",
      "stt": 252,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 10",
      "chu_dat": "Nguyễn Ngọc Ngân",
      "ho_san_xuat": "Đặng Lạc",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 355,
      "giong_cap_kg": 4.26,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 2",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964011,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19814,
            15.964089
          ],
          [
            108.19844,
            15.964089
          ],
          [
            108.19844,
            15.963889
          ],
          [
            108.19814,
            15.963889
          ],
          [
            108.19814,
            15.964089
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0253",
    "properties": {
      "id": "sx-dx2526-0253",
      "stt": 253,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Đinh Tuân",
      "ho_san_xuat": "Đinh Tuân",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192513,
            15.963859
          ],
          [
            108.192813,
            15.963859
          ],
          [
            108.192813,
            15.963659
          ],
          [
            108.192513,
            15.963659
          ],
          [
            108.192513,
            15.963859
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0254",
    "properties": {
      "id": "sx-dx2526-0254",
      "stt": 254,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Võ Lai",
      "ho_san_xuat": "Võ Lai",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19286,
            15.963866
          ],
          [
            108.19316,
            15.963866
          ],
          [
            108.19316,
            15.963666
          ],
          [
            108.19286,
            15.963666
          ],
          [
            108.19286,
            15.963866
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0255",
    "properties": {
      "id": "sx-dx2526-0255",
      "stt": 255,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Nguyễn Ngọc Ngân",
      "ho_san_xuat": "Đặng Thị Tương",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1150,
      "giong_cap_kg": 13.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193154,
            15.963885
          ],
          [
            108.193454,
            15.963885
          ],
          [
            108.193454,
            15.963685
          ],
          [
            108.193154,
            15.963685
          ],
          [
            108.193154,
            15.963885
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0256",
    "properties": {
      "id": "sx-dx2526-0256",
      "stt": 256,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Đặng Bồi",
      "ho_san_xuat": "Đặng Bồi",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193473,
            15.963905
          ],
          [
            108.193773,
            15.963905
          ],
          [
            108.193773,
            15.963705
          ],
          [
            108.193473,
            15.963705
          ],
          [
            108.193473,
            15.963905
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0257",
    "properties": {
      "id": "sx-dx2526-0257",
      "stt": 257,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Nguyễn Thị Xuân Hương",
      "ho_san_xuat": "Bùi Hiếu Mạnh",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 950,
      "giong_cap_kg": 11.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193846,
            15.963918
          ],
          [
            108.194146,
            15.963918
          ],
          [
            108.194146,
            15.963718
          ],
          [
            108.193846,
            15.963718
          ],
          [
            108.193846,
            15.963918
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0258",
    "properties": {
      "id": "sx-dx2526-0258",
      "stt": 258,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Võ Sáu",
      "ho_san_xuat": "Võ Sáu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194194,
            15.963916
          ],
          [
            108.194494,
            15.963916
          ],
          [
            108.194494,
            15.963716
          ],
          [
            108.194194,
            15.963716
          ],
          [
            108.194194,
            15.963916
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0259",
    "properties": {
      "id": "sx-dx2526-0259",
      "stt": 259,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Nguyễn Thị Bình",
      "ho_san_xuat": "Nguyễn Thị Bình",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194488,
            15.963901
          ],
          [
            108.194788,
            15.963901
          ],
          [
            108.194788,
            15.963701
          ],
          [
            108.194488,
            15.963701
          ],
          [
            108.194488,
            15.963901
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0260",
    "properties": {
      "id": "sx-dx2526-0260",
      "stt": 260,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Lê Văn Hồng",
      "ho_san_xuat": "Hồ Hoàng Kiếm",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1445,
      "giong_cap_kg": 17.34,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194806,
            15.96388
          ],
          [
            108.195106,
            15.96388
          ],
          [
            108.195106,
            15.96368
          ],
          [
            108.194806,
            15.96368
          ],
          [
            108.194806,
            15.96388
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0261",
    "properties": {
      "id": "sx-dx2526-0261",
      "stt": 261,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Nguyễn Sự",
      "ho_san_xuat": "Nguyễn Sự",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195179,
            15.963863
          ],
          [
            108.195479,
            15.963863
          ],
          [
            108.195479,
            15.963663
          ],
          [
            108.195179,
            15.963663
          ],
          [
            108.195179,
            15.963863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0262",
    "properties": {
      "id": "sx-dx2526-0262",
      "stt": 262,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Võ Đá",
      "ho_san_xuat": "Võ Đá",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195527,
            15.963859
          ],
          [
            108.195827,
            15.963859
          ],
          [
            108.195827,
            15.963659
          ],
          [
            108.195527,
            15.963659
          ],
          [
            108.195527,
            15.963859
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0263",
    "properties": {
      "id": "sx-dx2526-0263",
      "stt": 263,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Trương Thị Thu Trang",
      "ho_san_xuat": "Võ Tiến Dũng",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195821,
            15.96387
          ],
          [
            108.196121,
            15.96387
          ],
          [
            108.196121,
            15.96367
          ],
          [
            108.195821,
            15.96367
          ],
          [
            108.195821,
            15.96387
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0264",
    "properties": {
      "id": "sx-dx2526-0264",
      "stt": 264,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Đặng Lộc",
      "ho_san_xuat": "Đặng Lộc",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196139,
            15.96389
          ],
          [
            108.196439,
            15.96389
          ],
          [
            108.196439,
            15.96369
          ],
          [
            108.196139,
            15.96369
          ],
          [
            108.196139,
            15.96389
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0265",
    "properties": {
      "id": "sx-dx2526-0265",
      "stt": 265,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 11",
      "chu_dat": "Đặng Thị Đoan",
      "ho_san_xuat": "Võ Thị Phước",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1035,
      "giong_cap_kg": 12.42,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196512,
            15.963909
          ],
          [
            108.196812,
            15.963909
          ],
          [
            108.196812,
            15.963709
          ],
          [
            108.196512,
            15.963709
          ],
          [
            108.196512,
            15.963909
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0266",
    "properties": {
      "id": "sx-dx2526-0266",
      "stt": 266,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Nguyễn Kiện",
      "ho_san_xuat": "Đặng Thị Ngọc Bích",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196861,
            15.963919
          ],
          [
            108.197161,
            15.963919
          ],
          [
            108.197161,
            15.963719
          ],
          [
            108.196861,
            15.963719
          ],
          [
            108.196861,
            15.963919
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0267",
    "properties": {
      "id": "sx-dx2526-0267",
      "stt": 267,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Võ Thiệu",
      "ho_san_xuat": "Võ Hoàng",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 990,
      "giong_cap_kg": 11.88,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197155,
            15.963914
          ],
          [
            108.197455,
            15.963914
          ],
          [
            108.197455,
            15.963714
          ],
          [
            108.197155,
            15.963714
          ],
          [
            108.197155,
            15.963914
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0268",
    "properties": {
      "id": "sx-dx2526-0268",
      "stt": 268,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Đặng Đa",
      "ho_san_xuat": "Đinh Thị Thương",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 990,
      "giong_cap_kg": 11.88,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197472,
            15.963896
          ],
          [
            108.197772,
            15.963896
          ],
          [
            108.197772,
            15.963696
          ],
          [
            108.197472,
            15.963696
          ],
          [
            108.197472,
            15.963896
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0269",
    "properties": {
      "id": "sx-dx2526-0269",
      "stt": 269,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Trần Đình Tân",
      "ho_san_xuat": "Võ Thị Phước",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197845,
            15.963875
          ],
          [
            108.198145,
            15.963875
          ],
          [
            108.198145,
            15.963675
          ],
          [
            108.197845,
            15.963675
          ],
          [
            108.197845,
            15.963875
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0270",
    "properties": {
      "id": "sx-dx2526-0270",
      "stt": 270,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Phạm Thước",
      "ho_san_xuat": "Phạm Văn Tiến",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1640,
      "giong_cap_kg": 19.68,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963789,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198195,
            15.963861
          ],
          [
            108.198495,
            15.963861
          ],
          [
            108.198495,
            15.963661
          ],
          [
            108.198195,
            15.963661
          ],
          [
            108.198195,
            15.963861
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0271",
    "properties": {
      "id": "sx-dx2526-0271",
      "stt": 271,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Hồ Liền",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 490,
      "giong_cap_kg": 5.88,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192489,
            15.963638
          ],
          [
            108.192789,
            15.963638
          ],
          [
            108.192789,
            15.963438
          ],
          [
            108.192489,
            15.963438
          ],
          [
            108.192489,
            15.963638
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0272",
    "properties": {
      "id": "sx-dx2526-0272",
      "stt": 272,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Phạm Kim Sơn",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192805,
            15.963652
          ],
          [
            108.193105,
            15.963652
          ],
          [
            108.193105,
            15.963452
          ],
          [
            108.192805,
            15.963452
          ],
          [
            108.192805,
            15.963652
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0273",
    "properties": {
      "id": "sx-dx2526-0273",
      "stt": 273,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Đinh Thị Thương",
      "ho_san_xuat": "Đinh Thị Thương",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1140,
      "giong_cap_kg": 13.68,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193177,
            15.963672
          ],
          [
            108.193477,
            15.963672
          ],
          [
            108.193477,
            15.963472
          ],
          [
            108.193177,
            15.963472
          ],
          [
            108.193177,
            15.963672
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0274",
    "properties": {
      "id": "sx-dx2526-0274",
      "stt": 274,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Lê Thị Mẹo",
      "ho_san_xuat": "Nguyễn Tàu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 820,
      "giong_cap_kg": 9.84,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193528,
            15.96369
          ],
          [
            108.193828,
            15.96369
          ],
          [
            108.193828,
            15.96349
          ],
          [
            108.193528,
            15.96349
          ],
          [
            108.193528,
            15.96369
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0275",
    "properties": {
      "id": "sx-dx2526-0275",
      "stt": 275,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Phạm Ngữ",
      "ho_san_xuat": "Phạm Mười",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 890,
      "giong_cap_kg": 10.68,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193823,
            15.963697
          ],
          [
            108.194123,
            15.963697
          ],
          [
            108.194123,
            15.963497
          ],
          [
            108.193823,
            15.963497
          ],
          [
            108.193823,
            15.963697
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0276",
    "properties": {
      "id": "sx-dx2526-0276",
      "stt": 276,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Trần Thị Ân",
      "ho_san_xuat": "Nguyễn Văn Lợi",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194139,
            15.963688
          ],
          [
            108.194439,
            15.963688
          ],
          [
            108.194439,
            15.963488
          ],
          [
            108.194139,
            15.963488
          ],
          [
            108.194139,
            15.963688
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0277",
    "properties": {
      "id": "sx-dx2526-0277",
      "stt": 277,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 12",
      "chu_dat": "Võ Nha",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1580,
      "giong_cap_kg": 18.96,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19451,
            15.963669
          ],
          [
            108.19481,
            15.963669
          ],
          [
            108.19481,
            15.963469
          ],
          [
            108.19451,
            15.963469
          ],
          [
            108.19451,
            15.963669
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0278",
    "properties": {
      "id": "sx-dx2526-0278",
      "stt": 278,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Nguyễn Thị Xí",
      "ho_san_xuat": "Nguyễn Thị Xí",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 705,
      "giong_cap_kg": 8.46,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194862,
            15.963649
          ],
          [
            108.195162,
            15.963649
          ],
          [
            108.195162,
            15.963449
          ],
          [
            108.194862,
            15.963449
          ],
          [
            108.194862,
            15.963649
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0279",
    "properties": {
      "id": "sx-dx2526-0279",
      "stt": 279,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Phạm Xong",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 475,
      "giong_cap_kg": 5.7,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195157,
            15.963637
          ],
          [
            108.195457,
            15.963637
          ],
          [
            108.195457,
            15.963437
          ],
          [
            108.195157,
            15.963437
          ],
          [
            108.195157,
            15.963637
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0280",
    "properties": {
      "id": "sx-dx2526-0280",
      "stt": 280,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Võ Thanh Long",
      "ho_san_xuat": "Võ Thanh Long",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 860,
      "giong_cap_kg": 10.32,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195472,
            15.96364
          ],
          [
            108.195772,
            15.96364
          ],
          [
            108.195772,
            15.96344
          ],
          [
            108.195472,
            15.96344
          ],
          [
            108.195472,
            15.96364
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0281",
    "properties": {
      "id": "sx-dx2526-0281",
      "stt": 281,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Nguyễn Cứ (Tổ 5)",
      "ho_san_xuat": "Nguyễn Cứ (Tổ 5)",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 960,
      "giong_cap_kg": 11.52,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195843,
            15.963656
          ],
          [
            108.196143,
            15.963656
          ],
          [
            108.196143,
            15.963456
          ],
          [
            108.195843,
            15.963456
          ],
          [
            108.195843,
            15.963656
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0282",
    "properties": {
      "id": "sx-dx2526-0282",
      "stt": 282,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Phạm Trung",
      "ho_san_xuat": "Phạm Trung",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 715,
      "giong_cap_kg": 8.58,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196195,
            15.963677
          ],
          [
            108.196495,
            15.963677
          ],
          [
            108.196495,
            15.963477
          ],
          [
            108.196195,
            15.963477
          ],
          [
            108.196195,
            15.963677
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0283",
    "properties": {
      "id": "sx-dx2526-0283",
      "stt": 283,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Nguyễn Văn Lợi",
      "ho_san_xuat": "Nguyễn Văn Lợi",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19649,
            15.963693
          ],
          [
            108.19679,
            15.963693
          ],
          [
            108.19679,
            15.963493
          ],
          [
            108.19649,
            15.963493
          ],
          [
            108.19649,
            15.963693
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0284",
    "properties": {
      "id": "sx-dx2526-0284",
      "stt": 284,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Nguyễn Văn Ích",
      "ho_san_xuat": "Nguyễn Văn Ích",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 490,
      "giong_cap_kg": 5.88,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196805,
            15.963696
          ],
          [
            108.197105,
            15.963696
          ],
          [
            108.197105,
            15.963496
          ],
          [
            108.196805,
            15.963496
          ],
          [
            108.196805,
            15.963696
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0285",
    "properties": {
      "id": "sx-dx2526-0285",
      "stt": 285,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Đặng Thị Quí",
      "ho_san_xuat": "Đặng Hiệp",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 473,
      "giong_cap_kg": 5.68,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197176,
            15.963684
          ],
          [
            108.197476,
            15.963684
          ],
          [
            108.197476,
            15.963484
          ],
          [
            108.197176,
            15.963484
          ],
          [
            108.197176,
            15.963684
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0286",
    "properties": {
      "id": "sx-dx2526-0286",
      "stt": 286,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 15",
      "chu_dat": "Đặng Toản",
      "ho_san_xuat": "Đặng Toản",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 852,
      "giong_cap_kg": 10.22,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 3",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197529,
            15.963664
          ],
          [
            108.197829,
            15.963664
          ],
          [
            108.197829,
            15.963464
          ],
          [
            108.197529,
            15.963464
          ],
          [
            108.197529,
            15.963664
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0287",
    "properties": {
      "id": "sx-dx2526-0287",
      "stt": 287,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Nguyễn Nghĩa",
      "ho_san_xuat": "Nguyễn Thị Bốn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1067,
      "giong_cap_kg": 12.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197824,
            15.963645
          ],
          [
            108.198124,
            15.963645
          ],
          [
            108.198124,
            15.963445
          ],
          [
            108.197824,
            15.963445
          ],
          [
            108.197824,
            15.963645
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0288",
    "properties": {
      "id": "sx-dx2526-0288",
      "stt": 288,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Võ Long",
      "ho_san_xuat": "Nguyễn Xin",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963567,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198138,
            15.963637
          ],
          [
            108.198438,
            15.963637
          ],
          [
            108.198438,
            15.963437
          ],
          [
            108.198138,
            15.963437
          ],
          [
            108.198138,
            15.963637
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0289",
    "properties": {
      "id": "sx-dx2526-0289",
      "stt": 289,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Nguyễn Sự",
      "ho_san_xuat": "Nguyễn Sự",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192509,
            15.963421
          ],
          [
            108.192809,
            15.963421
          ],
          [
            108.192809,
            15.963221
          ],
          [
            108.192509,
            15.963221
          ],
          [
            108.192509,
            15.963421
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0290",
    "properties": {
      "id": "sx-dx2526-0290",
      "stt": 290,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Phan Lan",
      "ho_san_xuat": "Lê Thị Bông",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192862,
            15.963439
          ],
          [
            108.193162,
            15.963439
          ],
          [
            108.193162,
            15.963239
          ],
          [
            108.192862,
            15.963239
          ],
          [
            108.192862,
            15.963439
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0291",
    "properties": {
      "id": "sx-dx2526-0291",
      "stt": 291,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Lê Thị Mẹo",
      "ho_san_xuat": "Nguyễn Tàu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193158,
            15.96346
          ],
          [
            108.193458,
            15.96346
          ],
          [
            108.193458,
            15.96326
          ],
          [
            108.193158,
            15.96326
          ],
          [
            108.193158,
            15.96346
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0292",
    "properties": {
      "id": "sx-dx2526-0292",
      "stt": 292,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Đinh Tuân",
      "ho_san_xuat": "Đinh Tuân",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193471,
            15.963473
          ],
          [
            108.193771,
            15.963473
          ],
          [
            108.193771,
            15.963273
          ],
          [
            108.193471,
            15.963273
          ],
          [
            108.193471,
            15.963473
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0293",
    "properties": {
      "id": "sx-dx2526-0293",
      "stt": 293,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Nguyễn Quang Thơ",
      "ho_san_xuat": "Đinh Tuân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193842,
            15.963472
          ],
          [
            108.194142,
            15.963472
          ],
          [
            108.194142,
            15.963272
          ],
          [
            108.193842,
            15.963272
          ],
          [
            108.193842,
            15.963472
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0294",
    "properties": {
      "id": "sx-dx2526-0294",
      "stt": 294,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Đặng Hiền",
      "ho_san_xuat": "Đặng Văn Quân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194196,
            15.963458
          ],
          [
            108.194496,
            15.963458
          ],
          [
            108.194496,
            15.963258
          ],
          [
            108.194196,
            15.963258
          ],
          [
            108.194196,
            15.963458
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0295",
    "properties": {
      "id": "sx-dx2526-0295",
      "stt": 295,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Võ Nhân",
      "ho_san_xuat": "Đặng Hiệp",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194492,
            15.963437
          ],
          [
            108.194792,
            15.963437
          ],
          [
            108.194792,
            15.963237
          ],
          [
            108.194492,
            15.963237
          ],
          [
            108.194492,
            15.963437
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0296",
    "properties": {
      "id": "sx-dx2526-0296",
      "stt": 296,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Võ Văn Vũ",
      "ho_san_xuat": "Võ Văn Vũ",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 660,
      "giong_cap_kg": 7.92,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194804,
            15.96342
          ],
          [
            108.195104,
            15.96342
          ],
          [
            108.195104,
            15.96322
          ],
          [
            108.194804,
            15.96322
          ],
          [
            108.194804,
            15.96342
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0297",
    "properties": {
      "id": "sx-dx2526-0297",
      "stt": 297,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Võ Diên",
      "ho_san_xuat": "Võ Văn Vũ",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195174,
            15.963415
          ],
          [
            108.195474,
            15.963415
          ],
          [
            108.195474,
            15.963215
          ],
          [
            108.195174,
            15.963215
          ],
          [
            108.195174,
            15.963415
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0298",
    "properties": {
      "id": "sx-dx2526-0298",
      "stt": 298,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Nguyễn Cứ (Tổ 5)",
      "ho_san_xuat": "Nguyễn Cứ (Tổ 5)",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 360,
      "giong_cap_kg": 4.32,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195529,
            15.963424
          ],
          [
            108.195829,
            15.963424
          ],
          [
            108.195829,
            15.963224
          ],
          [
            108.195529,
            15.963224
          ],
          [
            108.195529,
            15.963424
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0299",
    "properties": {
      "id": "sx-dx2526-0299",
      "stt": 299,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Đặng Thị Khoái",
      "ho_san_xuat": "Phạm Phú Quốc",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 550,
      "giong_cap_kg": 6.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195826,
            15.963444
          ],
          [
            108.196126,
            15.963444
          ],
          [
            108.196126,
            15.963244
          ],
          [
            108.195826,
            15.963244
          ],
          [
            108.195826,
            15.963444
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0300",
    "properties": {
      "id": "sx-dx2526-0300",
      "stt": 300,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Lâm Tùng Nghĩa",
      "ho_san_xuat": "Hồ Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 372,
      "giong_cap_kg": 4.46,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196138,
            15.963464
          ],
          [
            108.196438,
            15.963464
          ],
          [
            108.196438,
            15.963264
          ],
          [
            108.196138,
            15.963264
          ],
          [
            108.196138,
            15.963464
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0301",
    "properties": {
      "id": "sx-dx2526-0301",
      "stt": 301,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Đặng Thị Bình",
      "ho_san_xuat": "Đặng Thị Bình",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196507,
            15.963474
          ],
          [
            108.196807,
            15.963474
          ],
          [
            108.196807,
            15.963274
          ],
          [
            108.196507,
            15.963274
          ],
          [
            108.196507,
            15.963474
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0302",
    "properties": {
      "id": "sx-dx2526-0302",
      "stt": 302,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Võ Thị Mẫn",
      "ho_san_xuat": "Đặng Thị Tương",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196862,
            15.96347
          ],
          [
            108.197162,
            15.96347
          ],
          [
            108.197162,
            15.96327
          ],
          [
            108.196862,
            15.96327
          ],
          [
            108.196862,
            15.96347
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0303",
    "properties": {
      "id": "sx-dx2526-0303",
      "stt": 303,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Đặng Văn Đối",
      "ho_san_xuat": "Phạm Trung",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 583,
      "giong_cap_kg": 7,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19716,
            15.963453
          ],
          [
            108.19746,
            15.963453
          ],
          [
            108.19746,
            15.963253
          ],
          [
            108.19716,
            15.963253
          ],
          [
            108.19716,
            15.963453
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0304",
    "properties": {
      "id": "sx-dx2526-0304",
      "stt": 304,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Nguyễn Thị Năm",
      "ho_san_xuat": "Nguyễn Thị Năm",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197471,
            15.963432
          ],
          [
            108.197771,
            15.963432
          ],
          [
            108.197771,
            15.963232
          ],
          [
            108.197471,
            15.963232
          ],
          [
            108.197471,
            15.963432
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0305",
    "properties": {
      "id": "sx-dx2526-0305",
      "stt": 305,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 16",
      "chu_dat": "Phạm Thị Chín",
      "ho_san_xuat": "Phạm Thị Chín",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 660,
      "giong_cap_kg": 7.92,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 4",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19784,
            15.963417
          ],
          [
            108.19814,
            15.963417
          ],
          [
            108.19814,
            15.963217
          ],
          [
            108.19784,
            15.963217
          ],
          [
            108.19784,
            15.963417
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0306",
    "properties": {
      "id": "sx-dx2526-0306",
      "stt": 306,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Đặng Thị Bé",
      "ho_san_xuat": "Đặng Thị Bé",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963344,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198196,
            15.963416
          ],
          [
            108.198496,
            15.963416
          ],
          [
            108.198496,
            15.963216
          ],
          [
            108.198196,
            15.963216
          ],
          [
            108.198196,
            15.963416
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0307",
    "properties": {
      "id": "sx-dx2526-0307",
      "stt": 307,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Đặng Thị Hồng",
      "ho_san_xuat": "Đặng Thị Thi",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.19265
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192494,
            15.963206
          ],
          [
            108.192794,
            15.963206
          ],
          [
            108.192794,
            15.963006
          ],
          [
            108.192494,
            15.963006
          ],
          [
            108.192494,
            15.963206
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0308",
    "properties": {
      "id": "sx-dx2526-0308",
      "stt": 308,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Nguyễn Thị Tùng",
      "ho_san_xuat": "Đặng Thống",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 934,
      "giong_cap_kg": 11.21,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.192983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192804,
            15.963227
          ],
          [
            108.193104,
            15.963227
          ],
          [
            108.193104,
            15.963027
          ],
          [
            108.192804,
            15.963027
          ],
          [
            108.192804,
            15.963227
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0309",
    "properties": {
      "id": "sx-dx2526-0309",
      "stt": 309,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Nguyễn Thị Y",
      "ho_san_xuat": "Nguyễn Thị Y",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.193317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193173,
            15.963245
          ],
          [
            108.193473,
            15.963245
          ],
          [
            108.193473,
            15.963045
          ],
          [
            108.193173,
            15.963045
          ],
          [
            108.193173,
            15.963245
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0310",
    "properties": {
      "id": "sx-dx2526-0310",
      "stt": 310,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Đặng Tàu",
      "ho_san_xuat": "Đặng Tàu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 815,
      "giong_cap_kg": 9.78,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.19365
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193529,
            15.963252
          ],
          [
            108.193829,
            15.963252
          ],
          [
            108.193829,
            15.963052
          ],
          [
            108.193529,
            15.963052
          ],
          [
            108.193529,
            15.963252
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0311",
    "properties": {
      "id": "sx-dx2526-0311",
      "stt": 311,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Nguyễn Thị Chiến",
      "ho_san_xuat": "Nguyễn Thị Chiến",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.193983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193827,
            15.963245
          ],
          [
            108.194127,
            15.963245
          ],
          [
            108.194127,
            15.963045
          ],
          [
            108.193827,
            15.963045
          ],
          [
            108.193827,
            15.963245
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0312",
    "properties": {
      "id": "sx-dx2526-0312",
      "stt": 312,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Vũ Thị Dung",
      "ho_san_xuat": "Trần Mai Trường",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.194317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194137,
            15.963226
          ],
          [
            108.194437,
            15.963226
          ],
          [
            108.194437,
            15.963026
          ],
          [
            108.194137,
            15.963026
          ],
          [
            108.194137,
            15.963226
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0313",
    "properties": {
      "id": "sx-dx2526-0313",
      "stt": 313,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Nguyễn Phận",
      "ho_san_xuat": "Nguyễn Phận",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 900,
      "giong_cap_kg": 10.8,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.19465
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194506,
            15.963205
          ],
          [
            108.194806,
            15.963205
          ],
          [
            108.194806,
            15.963005
          ],
          [
            108.194506,
            15.963005
          ],
          [
            108.194506,
            15.963205
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0314",
    "properties": {
      "id": "sx-dx2526-0314",
      "stt": 314,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Phạm Lưỡng",
      "ho_san_xuat": "Phạm Thị Pha",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.194983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194863,
            15.963193
          ],
          [
            108.195163,
            15.963193
          ],
          [
            108.195163,
            15.962993
          ],
          [
            108.194863,
            15.962993
          ],
          [
            108.194863,
            15.963193
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0315",
    "properties": {
      "id": "sx-dx2526-0315",
      "stt": 315,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Võ Thiệu",
      "ho_san_xuat": "Võ Hoàng",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.195317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195161,
            15.963195
          ],
          [
            108.195461,
            15.963195
          ],
          [
            108.195461,
            15.962995
          ],
          [
            108.195161,
            15.962995
          ],
          [
            108.195161,
            15.963195
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0316",
    "properties": {
      "id": "sx-dx2526-0316",
      "stt": 316,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Võ Thị Phước",
      "ho_san_xuat": "Võ Thị Phước",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.19565
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19547,
            15.963211
          ],
          [
            108.19577,
            15.963211
          ],
          [
            108.19577,
            15.963011
          ],
          [
            108.19547,
            15.963011
          ],
          [
            108.19547,
            15.963211
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0317",
    "properties": {
      "id": "sx-dx2526-0317",
      "stt": 317,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Võ Hiệu",
      "ho_san_xuat": "Võ Hiệu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.195983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.195838,
            15.963232
          ],
          [
            108.196138,
            15.963232
          ],
          [
            108.196138,
            15.963032
          ],
          [
            108.195838,
            15.963032
          ],
          [
            108.195838,
            15.963232
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0318",
    "properties": {
      "id": "sx-dx2526-0318",
      "stt": 318,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Phạm Văn Quang",
      "ho_san_xuat": "Phạm Văn Quang",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.196317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196196,
            15.963248
          ],
          [
            108.196496,
            15.963248
          ],
          [
            108.196496,
            15.963048
          ],
          [
            108.196196,
            15.963048
          ],
          [
            108.196196,
            15.963248
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0319",
    "properties": {
      "id": "sx-dx2526-0319",
      "stt": 319,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Võ Hoàng",
      "ho_san_xuat": "Võ Hoàng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.19665
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196495,
            15.963252
          ],
          [
            108.196795,
            15.963252
          ],
          [
            108.196795,
            15.963052
          ],
          [
            108.196495,
            15.963052
          ],
          [
            108.196495,
            15.963252
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0320",
    "properties": {
      "id": "sx-dx2526-0320",
      "stt": 320,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Đặng Bồi",
      "ho_san_xuat": "Đặng Thị Tạo",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 510,
      "giong_cap_kg": 6.12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.196983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.196804,
            15.963241
          ],
          [
            108.197104,
            15.963241
          ],
          [
            108.197104,
            15.963041
          ],
          [
            108.196804,
            15.963041
          ],
          [
            108.196804,
            15.963241
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0321",
    "properties": {
      "id": "sx-dx2526-0321",
      "stt": 321,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Đặng Quang Viên",
      "ho_san_xuat": "Đặng Thị Tạo",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 510,
      "giong_cap_kg": 6.12,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.197317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197171,
            15.963221
          ],
          [
            108.197471,
            15.963221
          ],
          [
            108.197471,
            15.963021
          ],
          [
            108.197171,
            15.963021
          ],
          [
            108.197171,
            15.963221
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0322",
    "properties": {
      "id": "sx-dx2526-0322",
      "stt": 322,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Lê Thị Mẹo",
      "ho_san_xuat": "Nguyễn Tàu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.19765
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19753,
            15.963202
          ],
          [
            108.19783,
            15.963202
          ],
          [
            108.19783,
            15.963002
          ],
          [
            108.19753,
            15.963002
          ],
          [
            108.19753,
            15.963202
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0323",
    "properties": {
      "id": "sx-dx2526-0323",
      "stt": 323,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Võ Thị Thu Vân",
      "ho_san_xuat": "Trương Thị Tàu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.197983
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.197829,
            15.963192
          ],
          [
            108.198129,
            15.963192
          ],
          [
            108.198129,
            15.962992
          ],
          [
            108.197829,
            15.962992
          ],
          [
            108.197829,
            15.963192
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0324",
    "properties": {
      "id": "sx-dx2526-0324",
      "stt": 324,
      "xu_dong": "Tổ 9",
      "lo_thua_dat": "Lô 17",
      "chu_dat": "Thái Thị Tuyết",
      "ho_san_xuat": "Thái Thị Tuyết",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 746,
      "giong_cap_kg": 8.95,
      "dot_phan_bo": "HG12-T9",
      "to_dan_cu": "Tổ 1",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963122,
        108.198317
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198137,
            15.963198
          ],
          [
            108.198437,
            15.963198
          ],
          [
            108.198437,
            15.962998
          ],
          [
            108.198137,
            15.962998
          ],
          [
            108.198137,
            15.963198
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0325",
    "properties": {
      "id": "sx-dx2526-0325",
      "stt": 325,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Võ Lai",
      "ho_san_xuat": "Nguyễn Côi",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 615,
      "giong_cap_kg": 7.38,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189504,
            15.960493
          ],
          [
            108.189917,
            15.960493
          ],
          [
            108.189917,
            15.960193
          ],
          [
            108.189504,
            15.960193
          ],
          [
            108.189504,
            15.960493
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0326",
    "properties": {
      "id": "sx-dx2526-0326",
      "stt": 326,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Võ Thị Hoa",
      "ho_san_xuat": "Võ Thị Hoa",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1025,
      "giong_cap_kg": 12.3,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189988,
            15.960514
          ],
          [
            108.190401,
            15.960514
          ],
          [
            108.190401,
            15.960214
          ],
          [
            108.189988,
            15.960214
          ],
          [
            108.189988,
            15.960514
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0327",
    "properties": {
      "id": "sx-dx2526-0327",
      "stt": 327,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Đặng Tiếu",
      "ho_san_xuat": "Đặng Tiếu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1025,
      "giong_cap_kg": 12.3,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190413,
            15.960528
          ],
          [
            108.190825,
            15.960528
          ],
          [
            108.190825,
            15.960228
          ],
          [
            108.190413,
            15.960228
          ],
          [
            108.190413,
            15.960528
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0328",
    "properties": {
      "id": "sx-dx2526-0328",
      "stt": 328,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Đặng Điện",
      "ho_san_xuat": "Đặng Ngọc Tiến",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 512,
      "giong_cap_kg": 6.14,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190845,
            15.960528
          ],
          [
            108.191258,
            15.960528
          ],
          [
            108.191258,
            15.960228
          ],
          [
            108.190845,
            15.960228
          ],
          [
            108.190845,
            15.960528
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0329",
    "properties": {
      "id": "sx-dx2526-0329",
      "stt": 329,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Võ Trợ",
      "ho_san_xuat": "Đặng Thị Liễu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1025,
      "giong_cap_kg": 12.3,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191337,
            15.960514
          ],
          [
            108.191749,
            15.960514
          ],
          [
            108.191749,
            15.960214
          ],
          [
            108.191337,
            15.960214
          ],
          [
            108.191337,
            15.960514
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0330",
    "properties": {
      "id": "sx-dx2526-0330",
      "stt": 330,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Đặng Thiệu",
      "ho_san_xuat": "Đặng Thiệu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 512,
      "giong_cap_kg": 6.14,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191821,
            15.960494
          ],
          [
            108.192234,
            15.960494
          ],
          [
            108.192234,
            15.960194
          ],
          [
            108.191821,
            15.960194
          ],
          [
            108.191821,
            15.960494
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0331",
    "properties": {
      "id": "sx-dx2526-0331",
      "stt": 331,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Nguyễn Hồng",
      "ho_san_xuat": "Lê Thị Thanh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1025,
      "giong_cap_kg": 12.3,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192247,
            15.960476
          ],
          [
            108.192659,
            15.960476
          ],
          [
            108.192659,
            15.960176
          ],
          [
            108.192247,
            15.960176
          ],
          [
            108.192247,
            15.960476
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0332",
    "properties": {
      "id": "sx-dx2526-0332",
      "stt": 332,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Phạm Thị Thu Phương",
      "ho_san_xuat": "Phạm Thị Thu Phương",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 512,
      "giong_cap_kg": 6.14,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192679,
            15.96047
          ],
          [
            108.193091,
            15.96047
          ],
          [
            108.193091,
            15.96017
          ],
          [
            108.192679,
            15.96017
          ],
          [
            108.192679,
            15.96047
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0333",
    "properties": {
      "id": "sx-dx2526-0333",
      "stt": 333,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Nguyễn Thị Sở",
      "ho_san_xuat": "Nguyễn Côi",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 513,
      "giong_cap_kg": 6.16,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19317,
            15.960479
          ],
          [
            108.193582,
            15.960479
          ],
          [
            108.193582,
            15.960179
          ],
          [
            108.19317,
            15.960179
          ],
          [
            108.19317,
            15.960479
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0334",
    "properties": {
      "id": "sx-dx2526-0334",
      "stt": 334,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 20",
      "chu_dat": "Đặng Lý",
      "ho_san_xuat": "Đặng Lý",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1025,
      "giong_cap_kg": 12.3,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193655,
            15.960498
          ],
          [
            108.194067,
            15.960498
          ],
          [
            108.194067,
            15.960198
          ],
          [
            108.193655,
            15.960198
          ],
          [
            108.193655,
            15.960498
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0335",
    "properties": {
      "id": "sx-dx2526-0335",
      "stt": 335,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Đặng Thanh",
      "ho_san_xuat": "Đặng Tấn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 495,
      "giong_cap_kg": 5.94,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194081,
            15.960518
          ],
          [
            108.194493,
            15.960518
          ],
          [
            108.194493,
            15.960218
          ],
          [
            108.194081,
            15.960218
          ],
          [
            108.194081,
            15.960518
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0336",
    "properties": {
      "id": "sx-dx2526-0336",
      "stt": 336,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Nguyễn Ngọc Sơn",
      "ho_san_xuat": "Nguyễn Ngọc Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96035,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194512,
            15.960529
          ],
          [
            108.194924,
            15.960529
          ],
          [
            108.194924,
            15.960229
          ],
          [
            108.194512,
            15.960229
          ],
          [
            108.194512,
            15.960529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0337",
    "properties": {
      "id": "sx-dx2526-0337",
      "stt": 337,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Nguyễn Yên",
      "ho_san_xuat": "Nguyễn Yên",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 990,
      "giong_cap_kg": 11.88,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189503,
            15.960193
          ],
          [
            108.189915,
            15.960193
          ],
          [
            108.189915,
            15.959893
          ],
          [
            108.189503,
            15.959893
          ],
          [
            108.189503,
            15.960193
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0338",
    "properties": {
      "id": "sx-dx2526-0338",
      "stt": 338,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Võ Văn Phi Hùng",
      "ho_san_xuat": "Võ Văn Phi Hùng",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189988,
            15.960177
          ],
          [
            108.190401,
            15.960177
          ],
          [
            108.190401,
            15.959877
          ],
          [
            108.189988,
            15.959877
          ],
          [
            108.189988,
            15.960177
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0339",
    "properties": {
      "id": "sx-dx2526-0339",
      "stt": 339,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Nguyễn Thị Mẫn",
      "ho_san_xuat": "Huỳnh Đức Thuận",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190414,
            15.960156
          ],
          [
            108.190827,
            15.960156
          ],
          [
            108.190827,
            15.959856
          ],
          [
            108.190414,
            15.959856
          ],
          [
            108.190414,
            15.960156
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0340",
    "properties": {
      "id": "sx-dx2526-0340",
      "stt": 340,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Đặng Ninh",
      "ho_san_xuat": "Nguyễn Thị Kiêu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190845,
            15.96014
          ],
          [
            108.191258,
            15.96014
          ],
          [
            108.191258,
            15.95984
          ],
          [
            108.190845,
            15.95984
          ],
          [
            108.190845,
            15.96014
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0341",
    "properties": {
      "id": "sx-dx2526-0341",
      "stt": 341,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Ngô Nghĩa",
      "ho_san_xuat": "Đặng Thiệu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 495,
      "giong_cap_kg": 5.94,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191335,
            15.960138
          ],
          [
            108.191748,
            15.960138
          ],
          [
            108.191748,
            15.959838
          ],
          [
            108.191335,
            15.959838
          ],
          [
            108.191335,
            15.960138
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0342",
    "properties": {
      "id": "sx-dx2526-0342",
      "stt": 342,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Đặng Văn Dũng (Tổ 3)",
      "ho_san_xuat": "Đặng Văn Dũng (Tổ 3)",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 495,
      "giong_cap_kg": 5.94,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191822,
            15.960149
          ],
          [
            108.192234,
            15.960149
          ],
          [
            108.192234,
            15.959849
          ],
          [
            108.191822,
            15.959849
          ],
          [
            108.191822,
            15.960149
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0343",
    "properties": {
      "id": "sx-dx2526-0343",
      "stt": 343,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Nguyễn Thị Mai",
      "ho_san_xuat": "Nguyễn Thị Mai",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192248,
            15.96017
          ],
          [
            108.192661,
            15.96017
          ],
          [
            108.192661,
            15.95987
          ],
          [
            108.192248,
            15.95987
          ],
          [
            108.192248,
            15.96017
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0344",
    "properties": {
      "id": "sx-dx2526-0344",
      "stt": 344,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Phạm Thị Hiệp",
      "ho_san_xuat": "Vệ Thị Bé",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192678,
            15.960189
          ],
          [
            108.193091,
            15.960189
          ],
          [
            108.193091,
            15.959889
          ],
          [
            108.192678,
            15.959889
          ],
          [
            108.192678,
            15.960189
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0345",
    "properties": {
      "id": "sx-dx2526-0345",
      "stt": 345,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Đặng Thành",
      "ho_san_xuat": "Đặng Thành Phương",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193168,
            15.960197
          ],
          [
            108.193581,
            15.960197
          ],
          [
            108.193581,
            15.959897
          ],
          [
            108.193168,
            15.959897
          ],
          [
            108.193168,
            15.960197
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0346",
    "properties": {
      "id": "sx-dx2526-0346",
      "stt": 346,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Lê Thị Cúc",
      "ho_san_xuat": "Vệ Phú Hải",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193655,
            15.96019
          ],
          [
            108.194067,
            15.96019
          ],
          [
            108.194067,
            15.95989
          ],
          [
            108.193655,
            15.95989
          ],
          [
            108.193655,
            15.96019
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0347",
    "properties": {
      "id": "sx-dx2526-0347",
      "stt": 347,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Đặng Tấn",
      "ho_san_xuat": "Đặng Tấn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 496,
      "giong_cap_kg": 5.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194082,
            15.960172
          ],
          [
            108.194495,
            15.960172
          ],
          [
            108.194495,
            15.959872
          ],
          [
            108.194082,
            15.959872
          ],
          [
            108.194082,
            15.960172
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0348",
    "properties": {
      "id": "sx-dx2526-0348",
      "stt": 348,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 21",
      "chu_dat": "Nguyễn Hường",
      "ho_san_xuat": "Nguyễn Hường",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 658,
      "giong_cap_kg": 7.9,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960017,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194512,
            15.960151
          ],
          [
            108.194924,
            15.960151
          ],
          [
            108.194924,
            15.959851
          ],
          [
            108.194512,
            15.959851
          ],
          [
            108.194512,
            15.960151
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0349",
    "properties": {
      "id": "sx-dx2526-0349",
      "stt": 349,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Nguyễn Mỹ",
      "ho_san_xuat": "Nguyễn Mỹ",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 630,
      "giong_cap_kg": 7.56,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189501,
            15.959805
          ],
          [
            108.189913,
            15.959805
          ],
          [
            108.189913,
            15.959505
          ],
          [
            108.189501,
            15.959505
          ],
          [
            108.189501,
            15.959805
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0350",
    "properties": {
      "id": "sx-dx2526-0350",
      "stt": 350,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Nguyễn Thị Thu Nga",
      "ho_san_xuat": "Nguyễn Thị Thu Nga",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189988,
            15.959806
          ],
          [
            108.190401,
            15.959806
          ],
          [
            108.190401,
            15.959506
          ],
          [
            108.189988,
            15.959506
          ],
          [
            108.189988,
            15.959806
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0351",
    "properties": {
      "id": "sx-dx2526-0351",
      "stt": 351,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Đặng Thạch",
      "ho_san_xuat": "Đặng Thị Liễu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190416,
            15.95982
          ],
          [
            108.190829,
            15.95982
          ],
          [
            108.190829,
            15.95952
          ],
          [
            108.190416,
            15.95952
          ],
          [
            108.190416,
            15.95982
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0352",
    "properties": {
      "id": "sx-dx2526-0352",
      "stt": 352,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Nguyễn Thị Kiêu",
      "ho_san_xuat": "Nguyễn Thị Kiêu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190845,
            15.959841
          ],
          [
            108.191258,
            15.959841
          ],
          [
            108.191258,
            15.959541
          ],
          [
            108.190845,
            15.959541
          ],
          [
            108.190845,
            15.959841
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0353",
    "properties": {
      "id": "sx-dx2526-0353",
      "stt": 353,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Nguyễn Thị Trung",
      "ho_san_xuat": "Đặng Ngọc Liên",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1482,
      "giong_cap_kg": 17.78,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191334,
            15.959858
          ],
          [
            108.191746,
            15.959858
          ],
          [
            108.191746,
            15.959558
          ],
          [
            108.191334,
            15.959558
          ],
          [
            108.191334,
            15.959858
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0354",
    "properties": {
      "id": "sx-dx2526-0354",
      "stt": 354,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Nguyễn Xí",
      "ho_san_xuat": "Nguyễn Xí",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 988,
      "giong_cap_kg": 11.86,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191822,
            15.959863
          ],
          [
            108.192234,
            15.959863
          ],
          [
            108.192234,
            15.959563
          ],
          [
            108.191822,
            15.959563
          ],
          [
            108.191822,
            15.959863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0355",
    "properties": {
      "id": "sx-dx2526-0355",
      "stt": 355,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Đặng Tơ",
      "ho_san_xuat": "Đặng Đào",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19225,
            15.959853
          ],
          [
            108.192662,
            15.959853
          ],
          [
            108.192662,
            15.959553
          ],
          [
            108.19225,
            15.959553
          ],
          [
            108.19225,
            15.959853
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0356",
    "properties": {
      "id": "sx-dx2526-0356",
      "stt": 356,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Phùng Thị Nga",
      "ho_san_xuat": "Đặng Công Khanh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192678,
            15.959833
          ],
          [
            108.193091,
            15.959833
          ],
          [
            108.193091,
            15.959533
          ],
          [
            108.192678,
            15.959533
          ],
          [
            108.192678,
            15.959833
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0357",
    "properties": {
      "id": "sx-dx2526-0357",
      "stt": 357,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Đinh Thị Hường",
      "ho_san_xuat": "Nguyễn Hà (L)",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193167,
            15.959814
          ],
          [
            108.193579,
            15.959814
          ],
          [
            108.193579,
            15.959514
          ],
          [
            108.193167,
            15.959514
          ],
          [
            108.193167,
            15.959814
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0358",
    "properties": {
      "id": "sx-dx2526-0358",
      "stt": 358,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Đặng Thị Khuyến",
      "ho_san_xuat": "Đặng Thị Bích Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193655,
            15.959804
          ],
          [
            108.194067,
            15.959804
          ],
          [
            108.194067,
            15.959504
          ],
          [
            108.193655,
            15.959504
          ],
          [
            108.193655,
            15.959804
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0359",
    "properties": {
      "id": "sx-dx2526-0359",
      "stt": 359,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Trần Văn Minh",
      "ho_san_xuat": "Đặng Thị Bích Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194084,
            15.959808
          ],
          [
            108.194496,
            15.959808
          ],
          [
            108.194496,
            15.959508
          ],
          [
            108.194084,
            15.959508
          ],
          [
            108.194084,
            15.959808
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0360",
    "properties": {
      "id": "sx-dx2526-0360",
      "stt": 360,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 22",
      "chu_dat": "Nguyễn Thị Hữu",
      "ho_san_xuat": "Nguyễn Mộng Hùng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 423,
      "giong_cap_kg": 5.08,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959683,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194512,
            15.959825
          ],
          [
            108.194924,
            15.959825
          ],
          [
            108.194924,
            15.959525
          ],
          [
            108.194512,
            15.959525
          ],
          [
            108.194512,
            15.959825
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0361",
    "properties": {
      "id": "sx-dx2526-0361",
      "stt": 361,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Đặng Văn Em",
      "ho_san_xuat": "Đặng Văn Em",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 390,
      "giong_cap_kg": 4.68,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189499,
            15.959513
          ],
          [
            108.189912,
            15.959513
          ],
          [
            108.189912,
            15.959213
          ],
          [
            108.189499,
            15.959213
          ],
          [
            108.189499,
            15.959513
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0362",
    "properties": {
      "id": "sx-dx2526-0362",
      "stt": 362,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Nguyễn Thị Xão",
      "ho_san_xuat": "Nguyễn Thị Xão",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1010,
      "giong_cap_kg": 12.12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189988,
            15.959527
          ],
          [
            108.190401,
            15.959527
          ],
          [
            108.190401,
            15.959227
          ],
          [
            108.189988,
            15.959227
          ],
          [
            108.189988,
            15.959527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0363",
    "properties": {
      "id": "sx-dx2526-0363",
      "stt": 363,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Nguyễn Châu",
      "ho_san_xuat": "Nguyễn Châu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 505,
      "giong_cap_kg": 6.06,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190418,
            15.959529
          ],
          [
            108.19083,
            15.959529
          ],
          [
            108.19083,
            15.959229
          ],
          [
            108.190418,
            15.959229
          ],
          [
            108.190418,
            15.959529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0364",
    "properties": {
      "id": "sx-dx2526-0364",
      "stt": 364,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Nguyễn Sàng",
      "ho_san_xuat": "Nguyễn Anh Phúc",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 505,
      "giong_cap_kg": 6.06,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190845,
            15.959516
          ],
          [
            108.191258,
            15.959516
          ],
          [
            108.191258,
            15.959216
          ],
          [
            108.190845,
            15.959216
          ],
          [
            108.190845,
            15.959516
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0365",
    "properties": {
      "id": "sx-dx2526-0365",
      "stt": 365,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Trần Mậu Thức",
      "ho_san_xuat": "Võ Thị Sinh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 505,
      "giong_cap_kg": 6.06,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191332,
            15.959495
          ],
          [
            108.191745,
            15.959495
          ],
          [
            108.191745,
            15.959195
          ],
          [
            108.191332,
            15.959195
          ],
          [
            108.191332,
            15.959495
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0366",
    "properties": {
      "id": "sx-dx2526-0366",
      "stt": 366,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Nguyễn Sảy",
      "ho_san_xuat": "Nguyễn Thị Loan",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191822,
            15.959477
          ],
          [
            108.192234,
            15.959477
          ],
          [
            108.192234,
            15.959177
          ],
          [
            108.191822,
            15.959177
          ],
          [
            108.191822,
            15.959477
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0367",
    "properties": {
      "id": "sx-dx2526-0367",
      "stt": 367,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Đặng Thị Nhường",
      "ho_san_xuat": "Phạm Ngọc Hiệp",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 310,
      "giong_cap_kg": 3.72,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192251,
            15.95947
          ],
          [
            108.192664,
            15.95947
          ],
          [
            108.192664,
            15.95917
          ],
          [
            108.192251,
            15.95917
          ],
          [
            108.192251,
            15.95947
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0368",
    "properties": {
      "id": "sx-dx2526-0368",
      "stt": 368,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Thái Thị Hiệp",
      "ho_san_xuat": "Đặng Văn Quốc",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 505,
      "giong_cap_kg": 6.06,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192678,
            15.959478
          ],
          [
            108.193091,
            15.959478
          ],
          [
            108.193091,
            15.959178
          ],
          [
            108.192678,
            15.959178
          ],
          [
            108.192678,
            15.959478
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0369",
    "properties": {
      "id": "sx-dx2526-0369",
      "stt": 369,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Đặng Văn Em",
      "ho_san_xuat": "Đặng Văn Em",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 504,
      "giong_cap_kg": 6.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193165,
            15.959497
          ],
          [
            108.193577,
            15.959497
          ],
          [
            108.193577,
            15.959197
          ],
          [
            108.193165,
            15.959197
          ],
          [
            108.193165,
            15.959497
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0370",
    "properties": {
      "id": "sx-dx2526-0370",
      "stt": 370,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Võ Thị Nam",
      "ho_san_xuat": "Đặng Thị Hòa",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1010,
      "giong_cap_kg": 12.12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193655,
            15.959517
          ],
          [
            108.194067,
            15.959517
          ],
          [
            108.194067,
            15.959217
          ],
          [
            108.193655,
            15.959217
          ],
          [
            108.193655,
            15.959517
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0371",
    "properties": {
      "id": "sx-dx2526-0371",
      "stt": 371,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Nguyễn Thị Tri",
      "ho_san_xuat": "Đặng Văn Dũng (Tổ 3)",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 504,
      "giong_cap_kg": 6.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194085,
            15.959529
          ],
          [
            108.194498,
            15.959529
          ],
          [
            108.194498,
            15.959229
          ],
          [
            108.194085,
            15.959229
          ],
          [
            108.194085,
            15.959529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0372",
    "properties": {
      "id": "sx-dx2526-0372",
      "stt": 372,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Nguyễn Văn Cường",
      "ho_san_xuat": "Đặng Ký",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 504,
      "giong_cap_kg": 6.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95935,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194512,
            15.959527
          ],
          [
            108.194924,
            15.959527
          ],
          [
            108.194924,
            15.959227
          ],
          [
            108.194512,
            15.959227
          ],
          [
            108.194512,
            15.959527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0373",
    "properties": {
      "id": "sx-dx2526-0373",
      "stt": 373,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 23",
      "chu_dat": "Đặng Ngọc Liên",
      "ho_san_xuat": "Đặng Ngọc Liên",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 504,
      "giong_cap_kg": 6.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189498,
            15.959178
          ],
          [
            108.18991,
            15.959178
          ],
          [
            108.18991,
            15.958878
          ],
          [
            108.189498,
            15.958878
          ],
          [
            108.189498,
            15.959178
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0374",
    "properties": {
      "id": "sx-dx2526-0374",
      "stt": 374,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Đặng Nhì",
      "ho_san_xuat": "Nguyễn Ngọc Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 867,
      "giong_cap_kg": 10.4,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189988,
            15.959157
          ],
          [
            108.190401,
            15.959157
          ],
          [
            108.190401,
            15.958857
          ],
          [
            108.189988,
            15.958857
          ],
          [
            108.189988,
            15.959157
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0375",
    "properties": {
      "id": "sx-dx2526-0375",
      "stt": 375,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Nguyễn Mộng Hùng",
      "ho_san_xuat": "Nguyễn Ngọc Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 450,
      "giong_cap_kg": 5.4,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190419,
            15.959141
          ],
          [
            108.190832,
            15.959141
          ],
          [
            108.190832,
            15.958841
          ],
          [
            108.190419,
            15.958841
          ],
          [
            108.190419,
            15.959141
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0376",
    "properties": {
      "id": "sx-dx2526-0376",
      "stt": 376,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Đặng Tình",
      "ho_san_xuat": "Nguyễn Côi",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190845,
            15.959137
          ],
          [
            108.191258,
            15.959137
          ],
          [
            108.191258,
            15.958837
          ],
          [
            108.190845,
            15.958837
          ],
          [
            108.190845,
            15.959137
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0377",
    "properties": {
      "id": "sx-dx2526-0377",
      "stt": 377,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Nguyễn Thị Mẫn",
      "ho_san_xuat": "Huỳnh Đức Thuận",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191331,
            15.959148
          ],
          [
            108.191743,
            15.959148
          ],
          [
            108.191743,
            15.958848
          ],
          [
            108.191331,
            15.958848
          ],
          [
            108.191331,
            15.959148
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0378",
    "properties": {
      "id": "sx-dx2526-0378",
      "stt": 378,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Nguyễn Thị Dung",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191822,
            15.959169
          ],
          [
            108.192234,
            15.959169
          ],
          [
            108.192234,
            15.958869
          ],
          [
            108.191822,
            15.958869
          ],
          [
            108.191822,
            15.959169
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0379",
    "properties": {
      "id": "sx-dx2526-0379",
      "stt": 379,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Lê Thị Chát",
      "ho_san_xuat": "Lê Thị Chát",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 502,
      "giong_cap_kg": 6.02,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192253,
            15.959188
          ],
          [
            108.192666,
            15.959188
          ],
          [
            108.192666,
            15.958888
          ],
          [
            108.192253,
            15.958888
          ],
          [
            108.192253,
            15.959188
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0380",
    "properties": {
      "id": "sx-dx2526-0380",
      "stt": 380,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Nguyễn Ngọc Quý",
      "ho_san_xuat": "Nguyễn Ngọc Quý",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192679,
            15.959197
          ],
          [
            108.193091,
            15.959197
          ],
          [
            108.193091,
            15.958897
          ],
          [
            108.192679,
            15.958897
          ],
          [
            108.192679,
            15.959197
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0381",
    "properties": {
      "id": "sx-dx2526-0381",
      "stt": 381,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Đặng Nghĩa",
      "ho_san_xuat": "Đặng Văn Lai",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1002,
      "giong_cap_kg": 12.02,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193163,
            15.959191
          ],
          [
            108.193576,
            15.959191
          ],
          [
            108.193576,
            15.958891
          ],
          [
            108.193163,
            15.958891
          ],
          [
            108.193163,
            15.959191
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0382",
    "properties": {
      "id": "sx-dx2526-0382",
      "stt": 382,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 24",
      "chu_dat": "Huỳnh Thị Loan",
      "ho_san_xuat": "Đặng Liễu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1002,
      "giong_cap_kg": 12.02,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193655,
            15.959173
          ],
          [
            108.194067,
            15.959173
          ],
          [
            108.194067,
            15.958873
          ],
          [
            108.193655,
            15.958873
          ],
          [
            108.193655,
            15.959173
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0383",
    "properties": {
      "id": "sx-dx2526-0383",
      "stt": 383,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 25",
      "chu_dat": "Đặng Minh Thành",
      "ho_san_xuat": "Đặng Minh Thành",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 950,
      "giong_cap_kg": 11.4,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194087,
            15.959152
          ],
          [
            108.194499,
            15.959152
          ],
          [
            108.194499,
            15.958852
          ],
          [
            108.194087,
            15.958852
          ],
          [
            108.194087,
            15.959152
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0384",
    "properties": {
      "id": "sx-dx2526-0384",
      "stt": 384,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 25",
      "chu_dat": "Đặng Thị Mười",
      "ho_san_xuat": "Đặng Thị Mười",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 996,
      "giong_cap_kg": 11.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959017,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194512,
            15.959138
          ],
          [
            108.194924,
            15.959138
          ],
          [
            108.194924,
            15.958838
          ],
          [
            108.194512,
            15.958838
          ],
          [
            108.194512,
            15.959138
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0385",
    "properties": {
      "id": "sx-dx2526-0385",
      "stt": 385,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 25",
      "chu_dat": "Đặng Điện",
      "ho_san_xuat": "Đặng Ngọc Tiến",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 996,
      "giong_cap_kg": 11.95,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189496,
            15.958805
          ],
          [
            108.189909,
            15.958805
          ],
          [
            108.189909,
            15.958505
          ],
          [
            108.189496,
            15.958505
          ],
          [
            108.189496,
            15.958805
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0386",
    "properties": {
      "id": "sx-dx2526-0386",
      "stt": 386,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 25",
      "chu_dat": "Đặng Thạch",
      "ho_san_xuat": "Đặng Thị Liễu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1029,
      "giong_cap_kg": 12.35,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189988,
            15.958819
          ],
          [
            108.190401,
            15.958819
          ],
          [
            108.190401,
            15.958519
          ],
          [
            108.189988,
            15.958519
          ],
          [
            108.189988,
            15.958819
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0387",
    "properties": {
      "id": "sx-dx2526-0387",
      "stt": 387,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 25",
      "chu_dat": "Đặng Thành",
      "ho_san_xuat": "Đặng Thành",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 564,
      "giong_cap_kg": 6.77,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190421,
            15.95884
          ],
          [
            108.190833,
            15.95884
          ],
          [
            108.190833,
            15.95854
          ],
          [
            108.190421,
            15.95854
          ],
          [
            108.190421,
            15.95884
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0388",
    "properties": {
      "id": "sx-dx2526-0388",
      "stt": 388,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 25",
      "chu_dat": "Đặng Hồng (Truật)",
      "ho_san_xuat": "Đặng Đào",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 468,
      "giong_cap_kg": 5.62,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190845,
            15.958858
          ],
          [
            108.191258,
            15.958858
          ],
          [
            108.191258,
            15.958558
          ],
          [
            108.190845,
            15.958558
          ],
          [
            108.190845,
            15.958858
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0389",
    "properties": {
      "id": "sx-dx2526-0389",
      "stt": 389,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Ân",
      "ho_san_xuat": "Nguyễn Châu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 677,
      "giong_cap_kg": 8.12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191329,
            15.958863
          ],
          [
            108.191741,
            15.958863
          ],
          [
            108.191741,
            15.958563
          ],
          [
            108.191329,
            15.958563
          ],
          [
            108.191329,
            15.958863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0390",
    "properties": {
      "id": "sx-dx2526-0390",
      "stt": 390,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Hồng (Cẩm)",
      "ho_san_xuat": "Nguyễn Văn Hồng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 727,
      "giong_cap_kg": 8.72,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191821,
            15.958854
          ],
          [
            108.192234,
            15.958854
          ],
          [
            108.192234,
            15.958554
          ],
          [
            108.191821,
            15.958554
          ],
          [
            108.191821,
            15.958854
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0391",
    "properties": {
      "id": "sx-dx2526-0391",
      "stt": 391,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Thị Quýt",
      "ho_san_xuat": "Nguyễn Thị Quýt",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1014,
      "giong_cap_kg": 12.17,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192255,
            15.958835
          ],
          [
            108.192667,
            15.958835
          ],
          [
            108.192667,
            15.958535
          ],
          [
            108.192255,
            15.958535
          ],
          [
            108.192255,
            15.958835
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0392",
    "properties": {
      "id": "sx-dx2526-0392",
      "stt": 392,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Mười",
      "ho_san_xuat": "Nguyễn Tư",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 982,
      "giong_cap_kg": 11.78,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192679,
            15.958815
          ],
          [
            108.193091,
            15.958815
          ],
          [
            108.193091,
            15.958515
          ],
          [
            108.192679,
            15.958515
          ],
          [
            108.192679,
            15.958815
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0393",
    "properties": {
      "id": "sx-dx2526-0393",
      "stt": 393,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Sảy",
      "ho_san_xuat": "Nguyễn Tư",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 523,
      "giong_cap_kg": 6.28,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193162,
            15.958804
          ],
          [
            108.193574,
            15.958804
          ],
          [
            108.193574,
            15.958504
          ],
          [
            108.193162,
            15.958504
          ],
          [
            108.193162,
            15.958804
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0394",
    "properties": {
      "id": "sx-dx2526-0394",
      "stt": 394,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Phương",
      "ho_san_xuat": "Nguyễn Phương",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 982,
      "giong_cap_kg": 11.78,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193655,
            15.958808
          ],
          [
            108.194067,
            15.958808
          ],
          [
            108.194067,
            15.958508
          ],
          [
            108.193655,
            15.958508
          ],
          [
            108.193655,
            15.958808
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0395",
    "properties": {
      "id": "sx-dx2526-0395",
      "stt": 395,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Thị Đủ",
      "ho_san_xuat": "Nguyễn Văn Thành",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 490,
      "giong_cap_kg": 5.88,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194088,
            15.958824
          ],
          [
            108.194501,
            15.958824
          ],
          [
            108.194501,
            15.958524
          ],
          [
            108.194088,
            15.958524
          ],
          [
            108.194088,
            15.958824
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0396",
    "properties": {
      "id": "sx-dx2526-0396",
      "stt": 396,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Võ Thị Bằng",
      "ho_san_xuat": "Nguyễn Văn Vinh (T)",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1014,
      "giong_cap_kg": 12.17,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958683,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194512,
            15.958845
          ],
          [
            108.194925,
            15.958845
          ],
          [
            108.194925,
            15.958545
          ],
          [
            108.194512,
            15.958545
          ],
          [
            108.194512,
            15.958845
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0397",
    "properties": {
      "id": "sx-dx2526-0397",
      "stt": 397,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Nguyễn Thị Huệ",
      "ho_san_xuat": "Nguyễn Văn Vinh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1047,
      "giong_cap_kg": 12.56,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189495,
            15.958527
          ],
          [
            108.189907,
            15.958527
          ],
          [
            108.189907,
            15.958227
          ],
          [
            108.189495,
            15.958227
          ],
          [
            108.189495,
            15.958527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0398",
    "properties": {
      "id": "sx-dx2526-0398",
      "stt": 398,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 26",
      "chu_dat": "Ngô Thị Yến",
      "ho_san_xuat": "Nguyễn Mai",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1144,
      "giong_cap_kg": 13.73,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189988,
            15.958529
          ],
          [
            108.1904,
            15.958529
          ],
          [
            108.1904,
            15.958229
          ],
          [
            108.189988,
            15.958229
          ],
          [
            108.189988,
            15.958529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0399",
    "properties": {
      "id": "sx-dx2526-0399",
      "stt": 399,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Nguyễn Hùng Sơn",
      "ho_san_xuat": "Nguyễn Hùng Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1104,
      "giong_cap_kg": 13.25,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190422,
            15.958517
          ],
          [
            108.190835,
            15.958517
          ],
          [
            108.190835,
            15.958217
          ],
          [
            108.190422,
            15.958217
          ],
          [
            108.190422,
            15.958517
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0400",
    "properties": {
      "id": "sx-dx2526-0400",
      "stt": 400,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Đặng Thị Phú",
      "ho_san_xuat": "Võ Thị Kim Thanh",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1004,
      "giong_cap_kg": 12.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190846,
            15.958496
          ],
          [
            108.191258,
            15.958496
          ],
          [
            108.191258,
            15.958196
          ],
          [
            108.190846,
            15.958196
          ],
          [
            108.190846,
            15.958496
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0401",
    "properties": {
      "id": "sx-dx2526-0401",
      "stt": 401,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Phạm Thị Kim",
      "ho_san_xuat": "Đặng Liễu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1004,
      "giong_cap_kg": 12.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191327,
            15.958478
          ],
          [
            108.19174,
            15.958478
          ],
          [
            108.19174,
            15.958178
          ],
          [
            108.191327,
            15.958178
          ],
          [
            108.191327,
            15.958478
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0402",
    "properties": {
      "id": "sx-dx2526-0402",
      "stt": 402,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Thái Thị Hiệp",
      "ho_san_xuat": "Võ Văn Phi Hùng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1004,
      "giong_cap_kg": 12.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191821,
            15.95847
          ],
          [
            108.192234,
            15.95847
          ],
          [
            108.192234,
            15.95817
          ],
          [
            108.191821,
            15.95817
          ],
          [
            108.191821,
            15.95847
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0403",
    "properties": {
      "id": "sx-dx2526-0403",
      "stt": 403,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Võ Kỹ",
      "ho_san_xuat": "Võ Văn Phi Hùng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1006,
      "giong_cap_kg": 12.07,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192256,
            15.958477
          ],
          [
            108.192669,
            15.958477
          ],
          [
            108.192669,
            15.958177
          ],
          [
            108.192256,
            15.958177
          ],
          [
            108.192256,
            15.958477
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0404",
    "properties": {
      "id": "sx-dx2526-0404",
      "stt": 404,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Võ Văn Phi Hùng",
      "ho_san_xuat": "Võ Văn Phi Hùng",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192679,
            15.958496
          ],
          [
            108.193092,
            15.958496
          ],
          [
            108.193092,
            15.958196
          ],
          [
            108.192679,
            15.958196
          ],
          [
            108.192679,
            15.958496
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0405",
    "properties": {
      "id": "sx-dx2526-0405",
      "stt": 405,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Nguyễn Yên",
      "ho_san_xuat": "Nguyễn Yên",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19316,
            15.958516
          ],
          [
            108.193573,
            15.958516
          ],
          [
            108.193573,
            15.958216
          ],
          [
            108.19316,
            15.958216
          ],
          [
            108.19316,
            15.958516
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0406",
    "properties": {
      "id": "sx-dx2526-0406",
      "stt": 406,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 27",
      "chu_dat": "Nguyễn Thị Thịnh",
      "ho_san_xuat": "Đặng Ngọc Long",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1004,
      "giong_cap_kg": 12.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193654,
            15.958529
          ],
          [
            108.194067,
            15.958529
          ],
          [
            108.194067,
            15.958229
          ],
          [
            108.193654,
            15.958229
          ],
          [
            108.193654,
            15.958529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0407",
    "properties": {
      "id": "sx-dx2526-0407",
      "stt": 407,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Phạm Thị Nghĩ",
      "ho_san_xuat": "Nguyễn Mười",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1020,
      "giong_cap_kg": 12.24,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19409,
            15.958527
          ],
          [
            108.194503,
            15.958527
          ],
          [
            108.194503,
            15.958227
          ],
          [
            108.19409,
            15.958227
          ],
          [
            108.19409,
            15.958527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0408",
    "properties": {
      "id": "sx-dx2526-0408",
      "stt": 408,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Võ Thị Hữu",
      "ho_san_xuat": "Nguyễn Văn Vinh (T)",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95835,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194512,
            15.958512
          ],
          [
            108.194925,
            15.958512
          ],
          [
            108.194925,
            15.958212
          ],
          [
            108.194512,
            15.958212
          ],
          [
            108.194512,
            15.958512
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0409",
    "properties": {
      "id": "sx-dx2526-0409",
      "stt": 409,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Đặng Huấn",
      "ho_san_xuat": "Đặng Lạc",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 988,
      "giong_cap_kg": 11.86,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189493,
            15.958158
          ],
          [
            108.189906,
            15.958158
          ],
          [
            108.189906,
            15.957858
          ],
          [
            108.189493,
            15.957858
          ],
          [
            108.189493,
            15.958158
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0410",
    "properties": {
      "id": "sx-dx2526-0410",
      "stt": 410,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Nguyễn Mười",
      "ho_san_xuat": "Nguyễn Mười",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189987,
            15.958141
          ],
          [
            108.1904,
            15.958141
          ],
          [
            108.1904,
            15.957841
          ],
          [
            108.189987,
            15.957841
          ],
          [
            108.189987,
            15.958141
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0411",
    "properties": {
      "id": "sx-dx2526-0411",
      "stt": 411,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Đặng Lạc",
      "ho_san_xuat": "Đặng Lạc",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 987,
      "giong_cap_kg": 11.84,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190424,
            15.958137
          ],
          [
            108.190836,
            15.958137
          ],
          [
            108.190836,
            15.957837
          ],
          [
            108.190424,
            15.957837
          ],
          [
            108.190424,
            15.958137
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0412",
    "properties": {
      "id": "sx-dx2526-0412",
      "stt": 412,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Đặng Huấn",
      "ho_san_xuat": "Doãn Đình Dương",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 987,
      "giong_cap_kg": 11.84,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190846,
            15.958147
          ],
          [
            108.191258,
            15.958147
          ],
          [
            108.191258,
            15.957847
          ],
          [
            108.190846,
            15.957847
          ],
          [
            108.190846,
            15.958147
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0413",
    "properties": {
      "id": "sx-dx2526-0413",
      "stt": 413,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Nguyễn Sàng",
      "ho_san_xuat": "Nguyễn Anh Phúc",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 988,
      "giong_cap_kg": 11.86,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191326,
            15.958167
          ],
          [
            108.191738,
            15.958167
          ],
          [
            108.191738,
            15.957867
          ],
          [
            108.191326,
            15.957867
          ],
          [
            108.191326,
            15.958167
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0414",
    "properties": {
      "id": "sx-dx2526-0414",
      "stt": 414,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Đặng Thị Tuôi",
      "ho_san_xuat": "Nguyễn Văn Vinh (T)",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 988,
      "giong_cap_kg": 11.86,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191821,
            15.958187
          ],
          [
            108.192233,
            15.958187
          ],
          [
            108.192233,
            15.957887
          ],
          [
            108.191821,
            15.957887
          ],
          [
            108.191821,
            15.958187
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0415",
    "properties": {
      "id": "sx-dx2526-0415",
      "stt": 415,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 28",
      "chu_dat": "Lê Thị Chát",
      "ho_san_xuat": "Lê Thị Chát",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 494,
      "giong_cap_kg": 5.93,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192258,
            15.958196
          ],
          [
            108.19267,
            15.958196
          ],
          [
            108.19267,
            15.957896
          ],
          [
            108.192258,
            15.957896
          ],
          [
            108.192258,
            15.958196
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0416",
    "properties": {
      "id": "sx-dx2526-0416",
      "stt": 416,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Nguyễn Thị Hường",
      "ho_san_xuat": "Nguyễn Thị Hường",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192679,
            15.958191
          ],
          [
            108.193092,
            15.958191
          ],
          [
            108.193092,
            15.957891
          ],
          [
            108.192679,
            15.957891
          ],
          [
            108.192679,
            15.958191
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0417",
    "properties": {
      "id": "sx-dx2526-0417",
      "stt": 417,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Nguyễn Thị Cẩm",
      "ho_san_xuat": "Nguyễn Thanh Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1002,
      "giong_cap_kg": 12.02,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193159,
            15.958174
          ],
          [
            108.193571,
            15.958174
          ],
          [
            108.193571,
            15.957874
          ],
          [
            108.193159,
            15.957874
          ],
          [
            108.193159,
            15.958174
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0418",
    "properties": {
      "id": "sx-dx2526-0418",
      "stt": 418,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Đặng Lư",
      "ho_san_xuat": "Đặng Lư",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1017,
      "giong_cap_kg": 12.2,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193654,
            15.958153
          ],
          [
            108.194066,
            15.958153
          ],
          [
            108.194066,
            15.957853
          ],
          [
            108.193654,
            15.957853
          ],
          [
            108.193654,
            15.958153
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0419",
    "properties": {
      "id": "sx-dx2526-0419",
      "stt": 419,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Phạm Thị Tý",
      "ho_san_xuat": "Nguyễn Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1017,
      "giong_cap_kg": 12.2,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194092,
            15.958139
          ],
          [
            108.194504,
            15.958139
          ],
          [
            108.194504,
            15.957839
          ],
          [
            108.194092,
            15.957839
          ],
          [
            108.194092,
            15.958139
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0420",
    "properties": {
      "id": "sx-dx2526-0420",
      "stt": 420,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Nguyễn Thị Huệ",
      "ho_san_xuat": "Phạm Ngọc Hiệp",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 509,
      "giong_cap_kg": 6.11,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958017,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194513,
            15.958138
          ],
          [
            108.194925,
            15.958138
          ],
          [
            108.194925,
            15.957838
          ],
          [
            108.194513,
            15.957838
          ],
          [
            108.194513,
            15.958138
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0421",
    "properties": {
      "id": "sx-dx2526-0421",
      "stt": 421,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Nguyễn Thị Vọng",
      "ho_san_xuat": "Đặng Ký",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1017,
      "giong_cap_kg": 12.2,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189491,
            15.957818
          ],
          [
            108.189904,
            15.957818
          ],
          [
            108.189904,
            15.957518
          ],
          [
            108.189491,
            15.957518
          ],
          [
            108.189491,
            15.957818
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0422",
    "properties": {
      "id": "sx-dx2526-0422",
      "stt": 422,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Nguyễn Tàng",
      "ho_san_xuat": "Nguyễn Văn Hùng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 509,
      "giong_cap_kg": 6.11,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189987,
            15.957839
          ],
          [
            108.1904,
            15.957839
          ],
          [
            108.1904,
            15.957539
          ],
          [
            108.189987,
            15.957539
          ],
          [
            108.189987,
            15.957839
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0423",
    "properties": {
      "id": "sx-dx2526-0423",
      "stt": 423,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Đặng Kế",
      "ho_san_xuat": "Đặng Kế",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 509,
      "giong_cap_kg": 6.11,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190425,
            15.957857
          ],
          [
            108.190838,
            15.957857
          ],
          [
            108.190838,
            15.957557
          ],
          [
            108.190425,
            15.957557
          ],
          [
            108.190425,
            15.957857
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0424",
    "properties": {
      "id": "sx-dx2526-0424",
      "stt": 424,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 29",
      "chu_dat": "Võ Nông",
      "ho_san_xuat": "Võ Nông",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190846,
            15.957863
          ],
          [
            108.191259,
            15.957863
          ],
          [
            108.191259,
            15.957563
          ],
          [
            108.190846,
            15.957563
          ],
          [
            108.190846,
            15.957863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0425",
    "properties": {
      "id": "sx-dx2526-0425",
      "stt": 425,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 30",
      "chu_dat": "Nguyễn Thị Chúc",
      "ho_san_xuat": "Nguyễn Thị Chúc",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 696,
      "giong_cap_kg": 8.35,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191324,
            15.957855
          ],
          [
            108.191737,
            15.957855
          ],
          [
            108.191737,
            15.957555
          ],
          [
            108.191324,
            15.957555
          ],
          [
            108.191324,
            15.957855
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0426",
    "properties": {
      "id": "sx-dx2526-0426",
      "stt": 426,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 30",
      "chu_dat": "Nguyễn Đức Thắng",
      "ho_san_xuat": "Nguyễn Phượng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1177,
      "giong_cap_kg": 14.12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19182,
            15.957836
          ],
          [
            108.192233,
            15.957836
          ],
          [
            108.192233,
            15.957536
          ],
          [
            108.19182,
            15.957536
          ],
          [
            108.19182,
            15.957836
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0427",
    "properties": {
      "id": "sx-dx2526-0427",
      "stt": 427,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 30",
      "chu_dat": "Nguyễn Minh",
      "ho_san_xuat": "Nguyễn Phương",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 525,
      "giong_cap_kg": 6.3,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192259,
            15.957816
          ],
          [
            108.192672,
            15.957816
          ],
          [
            108.192672,
            15.957516
          ],
          [
            108.192259,
            15.957516
          ],
          [
            108.192259,
            15.957816
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0428",
    "properties": {
      "id": "sx-dx2526-0428",
      "stt": 428,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 30",
      "chu_dat": "Phạm Phú Tế",
      "ho_san_xuat": "Nguyễn Phương",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1047,
      "giong_cap_kg": 12.56,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19268,
            15.957804
          ],
          [
            108.193092,
            15.957804
          ],
          [
            108.193092,
            15.957504
          ],
          [
            108.19268,
            15.957504
          ],
          [
            108.19268,
            15.957804
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0429",
    "properties": {
      "id": "sx-dx2526-0429",
      "stt": 429,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Nguyễn Thị Thương",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1111,
      "giong_cap_kg": 13.33,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193157,
            15.957807
          ],
          [
            108.19357,
            15.957807
          ],
          [
            108.19357,
            15.957507
          ],
          [
            108.193157,
            15.957507
          ],
          [
            108.193157,
            15.957807
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0430",
    "properties": {
      "id": "sx-dx2526-0430",
      "stt": 430,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Võ Sản",
      "ho_san_xuat": "Võ Sản",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1099,
      "giong_cap_kg": 13.19,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193653,
            15.957823
          ],
          [
            108.194066,
            15.957823
          ],
          [
            108.194066,
            15.957523
          ],
          [
            108.193653,
            15.957523
          ],
          [
            108.193653,
            15.957823
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0431",
    "properties": {
      "id": "sx-dx2526-0431",
      "stt": 431,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Nguyễn Thị Xí",
      "ho_san_xuat": "Ngô Thanh Hùng",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194093,
            15.957844
          ],
          [
            108.194506,
            15.957844
          ],
          [
            108.194506,
            15.957544
          ],
          [
            108.194093,
            15.957544
          ],
          [
            108.194093,
            15.957844
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0432",
    "properties": {
      "id": "sx-dx2526-0432",
      "stt": 432,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Trần Thị Huệ",
      "ho_san_xuat": "Trần Thị Huệ",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957683,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194513,
            15.95786
          ],
          [
            108.194926,
            15.95786
          ],
          [
            108.194926,
            15.95756
          ],
          [
            108.194513,
            15.95756
          ],
          [
            108.194513,
            15.95786
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0433",
    "properties": {
      "id": "sx-dx2526-0433",
      "stt": 433,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Đặng Thị Lan",
      "ho_san_xuat": "Trần Thị Huệ",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.18949,
            15.957529
          ],
          [
            108.189902,
            15.957529
          ],
          [
            108.189902,
            15.957229
          ],
          [
            108.18949,
            15.957229
          ],
          [
            108.18949,
            15.957529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0434",
    "properties": {
      "id": "sx-dx2526-0434",
      "stt": 434,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Lê Phương",
      "ho_san_xuat": "Lê Thị Bé",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189987,
            15.957518
          ],
          [
            108.190399,
            15.957518
          ],
          [
            108.190399,
            15.957218
          ],
          [
            108.189987,
            15.957218
          ],
          [
            108.189987,
            15.957518
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0435",
    "properties": {
      "id": "sx-dx2526-0435",
      "stt": 435,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Đặng Thị Xáng",
      "ho_san_xuat": "Nguyễn Trường Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190427,
            15.957498
          ],
          [
            108.190839,
            15.957498
          ],
          [
            108.190839,
            15.957198
          ],
          [
            108.190427,
            15.957198
          ],
          [
            108.190427,
            15.957498
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0436",
    "properties": {
      "id": "sx-dx2526-0436",
      "stt": 436,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 31",
      "chu_dat": "Đặng Minh Hùng",
      "ho_san_xuat": "Đặng Minh Thành",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 490,
      "giong_cap_kg": 5.88,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190847,
            15.957479
          ],
          [
            108.191259,
            15.957479
          ],
          [
            108.191259,
            15.957179
          ],
          [
            108.190847,
            15.957179
          ],
          [
            108.190847,
            15.957479
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0437",
    "properties": {
      "id": "sx-dx2526-0437",
      "stt": 437,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Phùng Thị Nga",
      "ho_san_xuat": "Phạm Ngọc Hiệp",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 552,
      "giong_cap_kg": 6.62,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191323,
            15.95747
          ],
          [
            108.191735,
            15.95747
          ],
          [
            108.191735,
            15.95717
          ],
          [
            108.191323,
            15.95717
          ],
          [
            108.191323,
            15.95747
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0438",
    "properties": {
      "id": "sx-dx2526-0438",
      "stt": 438,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Doãn Thùy",
      "ho_san_xuat": "Doãn Thùy",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19182,
            15.957476
          ],
          [
            108.192232,
            15.957476
          ],
          [
            108.192232,
            15.957176
          ],
          [
            108.19182,
            15.957176
          ],
          [
            108.19182,
            15.957476
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0439",
    "properties": {
      "id": "sx-dx2526-0439",
      "stt": 439,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Đặng Thành Phương",
      "ho_san_xuat": "Đặng Thành Phương",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192261,
            15.957494
          ],
          [
            108.192673,
            15.957494
          ],
          [
            108.192673,
            15.957194
          ],
          [
            108.192261,
            15.957194
          ],
          [
            108.192261,
            15.957494
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0440",
    "properties": {
      "id": "sx-dx2526-0440",
      "stt": 440,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Phạm Thị Kim",
      "ho_san_xuat": "Đặng Thành Phương",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19268,
            15.957515
          ],
          [
            108.193093,
            15.957515
          ],
          [
            108.193093,
            15.957215
          ],
          [
            108.19268,
            15.957215
          ],
          [
            108.19268,
            15.957515
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0441",
    "properties": {
      "id": "sx-dx2526-0441",
      "stt": 441,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Nguyễn Phượng",
      "ho_san_xuat": "Nguyễn Phượng",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193156,
            15.957528
          ],
          [
            108.193568,
            15.957528
          ],
          [
            108.193568,
            15.957228
          ],
          [
            108.193156,
            15.957228
          ],
          [
            108.193156,
            15.957528
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0442",
    "properties": {
      "id": "sx-dx2526-0442",
      "stt": 442,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Nguyễn Thị Anh",
      "ho_san_xuat": "Nguyễn Thị Anh",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193653,
            15.957528
          ],
          [
            108.194065,
            15.957528
          ],
          [
            108.194065,
            15.957228
          ],
          [
            108.193653,
            15.957228
          ],
          [
            108.193653,
            15.957528
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0443",
    "properties": {
      "id": "sx-dx2526-0443",
      "stt": 443,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Trương Thị Dạng",
      "ho_san_xuat": "Võ Lai",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194095,
            15.957514
          ],
          [
            108.194507,
            15.957514
          ],
          [
            108.194507,
            15.957214
          ],
          [
            108.194095,
            15.957214
          ],
          [
            108.194095,
            15.957514
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0444",
    "properties": {
      "id": "sx-dx2526-0444",
      "stt": 444,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Đặng Truật",
      "ho_san_xuat": "Đặng Đào",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.95735,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194514,
            15.957493
          ],
          [
            108.194926,
            15.957493
          ],
          [
            108.194926,
            15.957193
          ],
          [
            108.194514,
            15.957193
          ],
          [
            108.194514,
            15.957493
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0445",
    "properties": {
      "id": "sx-dx2526-0445",
      "stt": 445,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Nguyễn Hà",
      "ho_san_xuat": "Nguyễn Hà",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189488,
            15.957142
          ],
          [
            108.189901,
            15.957142
          ],
          [
            108.189901,
            15.956842
          ],
          [
            108.189488,
            15.956842
          ],
          [
            108.189488,
            15.957142
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0446",
    "properties": {
      "id": "sx-dx2526-0446",
      "stt": 446,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 32",
      "chu_dat": "Ngô Thị Hình",
      "ho_san_xuat": "Đặng Văn Châu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 853,
      "giong_cap_kg": 10.24,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189986,
            15.957137
          ],
          [
            108.190398,
            15.957137
          ],
          [
            108.190398,
            15.956837
          ],
          [
            108.189986,
            15.956837
          ],
          [
            108.189986,
            15.957137
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0447",
    "properties": {
      "id": "sx-dx2526-0447",
      "stt": 447,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Tàu",
      "ho_san_xuat": "Nguyễn Tàu",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190428,
            15.957146
          ],
          [
            108.190841,
            15.957146
          ],
          [
            108.190841,
            15.956846
          ],
          [
            108.190428,
            15.956846
          ],
          [
            108.190428,
            15.957146
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0448",
    "properties": {
      "id": "sx-dx2526-0448",
      "stt": 448,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Võ Lai",
      "ho_san_xuat": "Võ Lai",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.191081
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.190847,
            15.957166
          ],
          [
            108.19126,
            15.957166
          ],
          [
            108.19126,
            15.956866
          ],
          [
            108.190847,
            15.956866
          ],
          [
            108.190847,
            15.957166
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0449",
    "properties": {
      "id": "sx-dx2526-0449",
      "stt": 449,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Khanh",
      "ho_san_xuat": "Nguyễn Tám",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1254,
      "giong_cap_kg": 15.05,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.19154
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191321,
            15.957186
          ],
          [
            108.191734,
            15.957186
          ],
          [
            108.191734,
            15.956886
          ],
          [
            108.191321,
            15.956886
          ],
          [
            108.191321,
            15.957186
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0450",
    "properties": {
      "id": "sx-dx2526-0450",
      "stt": 450,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Đặng Hiển",
      "ho_san_xuat": "Nguyễn Trường Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 501,
      "giong_cap_kg": 6.01,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.191998
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.191819,
            15.957196
          ],
          [
            108.192232,
            15.957196
          ],
          [
            108.192232,
            15.956896
          ],
          [
            108.191819,
            15.956896
          ],
          [
            108.191819,
            15.957196
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0451",
    "properties": {
      "id": "sx-dx2526-0451",
      "stt": 451,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Thị Liều",
      "ho_san_xuat": "Nguyễn Trường Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 505,
      "giong_cap_kg": 6.06,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.192456
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192262,
            15.957192
          ],
          [
            108.192675,
            15.957192
          ],
          [
            108.192675,
            15.956892
          ],
          [
            108.192262,
            15.956892
          ],
          [
            108.192262,
            15.957192
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0452",
    "properties": {
      "id": "sx-dx2526-0452",
      "stt": 452,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Thị Liều",
      "ho_san_xuat": "Vệ Phú Hải",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.192915
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.192681,
            15.957176
          ],
          [
            108.193094,
            15.957176
          ],
          [
            108.193094,
            15.956876
          ],
          [
            108.192681,
            15.956876
          ],
          [
            108.192681,
            15.957176
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0453",
    "properties": {
      "id": "sx-dx2526-0453",
      "stt": 453,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Thị Hường",
      "ho_san_xuat": "Nguyễn Thị Hường",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1003,
      "giong_cap_kg": 12.04,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.193373
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193154,
            15.957155
          ],
          [
            108.193567,
            15.957155
          ],
          [
            108.193567,
            15.956855
          ],
          [
            108.193154,
            15.956855
          ],
          [
            108.193154,
            15.957155
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0454",
    "properties": {
      "id": "sx-dx2526-0454",
      "stt": 454,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Thị Đinh",
      "ho_san_xuat": "Nguyễn Thị Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 501,
      "giong_cap_kg": 6.01,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.193831
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.193652,
            15.957139
          ],
          [
            108.194065,
            15.957139
          ],
          [
            108.194065,
            15.956839
          ],
          [
            108.193652,
            15.956839
          ],
          [
            108.193652,
            15.957139
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0455",
    "properties": {
      "id": "sx-dx2526-0455",
      "stt": 455,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Trường Sơn",
      "ho_san_xuat": "Nguyễn Trường Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1003,
      "giong_cap_kg": 12.04,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.19429
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194096,
            15.957138
          ],
          [
            108.194509,
            15.957138
          ],
          [
            108.194509,
            15.956838
          ],
          [
            108.194096,
            15.956838
          ],
          [
            108.194096,
            15.957138
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0456",
    "properties": {
      "id": "sx-dx2526-0456",
      "stt": 456,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Anh Phương",
      "ho_san_xuat": "Nguyễn Thị Loan",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 501,
      "giong_cap_kg": 6.01,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957017,
        108.194748
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.194515,
            15.95715
          ],
          [
            108.194927,
            15.95715
          ],
          [
            108.194927,
            15.95685
          ],
          [
            108.194515,
            15.95685
          ],
          [
            108.194515,
            15.95715
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0457",
    "properties": {
      "id": "sx-dx2526-0457",
      "stt": 457,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô 33",
      "chu_dat": "Nguyễn Nhí",
      "ho_san_xuat": "Nguyễn Thị Hường",
      "la_chinh_chu": false,
      "giong_lua": "HG244",
      "dien_tich_m2": 1117,
      "giong_cap_kg": 13.4,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.956683,
        108.189706
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189487,
            15.956838
          ],
          [
            108.1899,
            15.956838
          ],
          [
            108.1899,
            15.956538
          ],
          [
            108.189487,
            15.956538
          ],
          [
            108.189487,
            15.956838
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0458",
    "properties": {
      "id": "sx-dx2526-0458",
      "stt": 458,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Lô Kẹp Ao",
      "chu_dat": "Ngô Thanh Hùng",
      "ho_san_xuat": "Ngô Thanh Hùng",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 1200,
      "giong_cap_kg": 14.4,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.956683,
        108.190165
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.189985,
            15.956856
          ],
          [
            108.190398,
            15.956856
          ],
          [
            108.190398,
            15.956556
          ],
          [
            108.189985,
            15.956556
          ],
          [
            108.189985,
            15.956856
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0459",
    "properties": {
      "id": "sx-dx2526-0459",
      "stt": 459,
      "xu_dong": "Hà Ra",
      "lo_thua_dat": "Vườn",
      "chu_dat": "Đinh Thị Vân",
      "ho_san_xuat": "Đinh Thị Vân",
      "la_chinh_chu": true,
      "giong_lua": "HG244",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "HG244-T10",
      "to_dan_cu": "Tổ 5",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.956683,
        108.190623
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19043,
            15.956863
          ],
          [
            108.190842,
            15.956863
          ],
          [
            108.190842,
            15.956563
          ],
          [
            108.19043,
            15.956563
          ],
          [
            108.19043,
            15.956863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0460",
    "properties": {
      "id": "sx-dx2526-0460",
      "stt": 460,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Kế",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 900,
      "giong_cap_kg": 10.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963359,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201473,
            15.963523
          ],
          [
            108.201923,
            15.963523
          ],
          [
            108.201923,
            15.963241
          ],
          [
            108.201473,
            15.963241
          ],
          [
            108.201473,
            15.963523
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0461",
    "properties": {
      "id": "sx-dx2526-0461",
      "stt": 461,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Lê Thị Chát",
      "ho_san_xuat": "Lê Thị Chát",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 460,
      "giong_cap_kg": 5.52,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963359,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201987,
            15.963504
          ],
          [
            108.202437,
            15.963504
          ],
          [
            108.202437,
            15.963223
          ],
          [
            108.201987,
            15.963223
          ],
          [
            108.201987,
            15.963504
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0462",
    "properties": {
      "id": "sx-dx2526-0462",
      "stt": 462,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Tấn",
      "ho_san_xuat": "Đặng Tấn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963359,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202527,
            15.963483
          ],
          [
            108.202977,
            15.963483
          ],
          [
            108.202977,
            15.963202
          ],
          [
            108.202527,
            15.963202
          ],
          [
            108.202527,
            15.963483
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0463",
    "properties": {
      "id": "sx-dx2526-0463",
      "stt": 463,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Tàn",
      "ho_san_xuat": "Nguyễn Tàn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 233,
      "giong_cap_kg": 2.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963359,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203014,
            15.963471
          ],
          [
            108.203464,
            15.963471
          ],
          [
            108.203464,
            15.96319
          ],
          [
            108.203014,
            15.96319
          ],
          [
            108.203014,
            15.963471
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0464",
    "properties": {
      "id": "sx-dx2526-0464",
      "stt": 464,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Nhựt",
      "ho_san_xuat": "Nguyễn Nhựt",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 447,
      "giong_cap_kg": 5.36,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963359,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203473,
            15.963473
          ],
          [
            108.203923,
            15.963473
          ],
          [
            108.203923,
            15.963192
          ],
          [
            108.203473,
            15.963192
          ],
          [
            108.203473,
            15.963473
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0465",
    "properties": {
      "id": "sx-dx2526-0465",
      "stt": 465,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Minh Hoàng",
      "ho_san_xuat": "Đặng Minh Hoàng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 520,
      "giong_cap_kg": 6.24,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963359,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203986,
            15.963488
          ],
          [
            108.204436,
            15.963488
          ],
          [
            108.204436,
            15.963207
          ],
          [
            108.203986,
            15.963207
          ],
          [
            108.203986,
            15.963488
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0466",
    "properties": {
      "id": "sx-dx2526-0466",
      "stt": 466,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Thôi",
      "ho_san_xuat": "Nguyễn Thị Thôi",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 650,
      "giong_cap_kg": 7.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963359,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204527,
            15.963509
          ],
          [
            108.204977,
            15.963509
          ],
          [
            108.204977,
            15.963228
          ],
          [
            108.204527,
            15.963228
          ],
          [
            108.204527,
            15.963509
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0467",
    "properties": {
      "id": "sx-dx2526-0467",
      "stt": 467,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Dung",
      "ho_san_xuat": "Nguyễn Thị Dung",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 650,
      "giong_cap_kg": 7.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963047,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201514,
            15.963213
          ],
          [
            108.201964,
            15.963213
          ],
          [
            108.201964,
            15.962932
          ],
          [
            108.201514,
            15.962932
          ],
          [
            108.201514,
            15.963213
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0468",
    "properties": {
      "id": "sx-dx2526-0468",
      "stt": 468,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Văn Em",
      "ho_san_xuat": "Đặng Văn Em",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1050,
      "giong_cap_kg": 12.6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963047,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201974,
            15.963217
          ],
          [
            108.202424,
            15.963217
          ],
          [
            108.202424,
            15.962936
          ],
          [
            108.201974,
            15.962936
          ],
          [
            108.201974,
            15.963217
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0469",
    "properties": {
      "id": "sx-dx2526-0469",
      "stt": 469,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Tàng",
      "ho_san_xuat": "Nguyễn Tàng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 550,
      "giong_cap_kg": 6.6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963047,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202486,
            15.963206
          ],
          [
            108.202936,
            15.963206
          ],
          [
            108.202936,
            15.962925
          ],
          [
            108.202486,
            15.962925
          ],
          [
            108.202486,
            15.963206
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0470",
    "properties": {
      "id": "sx-dx2526-0470",
      "stt": 470,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Sảy",
      "ho_san_xuat": "Nguyễn Sảy",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 330,
      "giong_cap_kg": 3.96,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963047,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203026,
            15.963186
          ],
          [
            108.203476,
            15.963186
          ],
          [
            108.203476,
            15.962905
          ],
          [
            108.203026,
            15.962905
          ],
          [
            108.203026,
            15.963186
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0471",
    "properties": {
      "id": "sx-dx2526-0471",
      "stt": 471,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Thịnh",
      "ho_san_xuat": "Nguyễn Thị Thịnh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963047,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203515,
            15.963167
          ],
          [
            108.203965,
            15.963167
          ],
          [
            108.203965,
            15.962886
          ],
          [
            108.203515,
            15.962886
          ],
          [
            108.203515,
            15.963167
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0472",
    "properties": {
      "id": "sx-dx2526-0472",
      "stt": 472,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Mộng Hùng",
      "ho_san_xuat": "Nguyễn Mộng Hùng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963047,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203974,
            15.963158
          ],
          [
            108.204424,
            15.963158
          ],
          [
            108.204424,
            15.962876
          ],
          [
            108.203974,
            15.962876
          ],
          [
            108.203974,
            15.963158
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0473",
    "properties": {
      "id": "sx-dx2526-0473",
      "stt": 473,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Hùng Sơn",
      "ho_san_xuat": "Nguyễn Hùng Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.963047,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204485,
            15.963163
          ],
          [
            108.204935,
            15.963163
          ],
          [
            108.204935,
            15.962882
          ],
          [
            108.204485,
            15.962882
          ],
          [
            108.204485,
            15.963163
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0474",
    "properties": {
      "id": "sx-dx2526-0474",
      "stt": 474,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Thị Phấn",
      "ho_san_xuat": "Đặng Thị Phấn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 430,
      "giong_cap_kg": 5.16,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962734,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201526,
            15.962868
          ],
          [
            108.201976,
            15.962868
          ],
          [
            108.201976,
            15.962587
          ],
          [
            108.201526,
            15.962587
          ],
          [
            108.201526,
            15.962868
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0475",
    "properties": {
      "id": "sx-dx2526-0475",
      "stt": 475,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Mỹ",
      "ho_san_xuat": "Nguyễn Mỹ",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 150,
      "giong_cap_kg": 1.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962734,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202015,
            15.962889
          ],
          [
            108.202465,
            15.962889
          ],
          [
            108.202465,
            15.962608
          ],
          [
            108.202015,
            15.962608
          ],
          [
            108.202015,
            15.962889
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0476",
    "properties": {
      "id": "sx-dx2526-0476",
      "stt": 476,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Xí",
      "ho_san_xuat": "Nguyễn Xí",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 585,
      "giong_cap_kg": 7.02,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962734,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202474,
            15.962903
          ],
          [
            108.202924,
            15.962903
          ],
          [
            108.202924,
            15.962622
          ],
          [
            108.202474,
            15.962622
          ],
          [
            108.202474,
            15.962903
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0477",
    "properties": {
      "id": "sx-dx2526-0477",
      "stt": 477,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Minh",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 400,
      "giong_cap_kg": 4.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962734,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202985,
            15.962903
          ],
          [
            108.203435,
            15.962903
          ],
          [
            108.203435,
            15.962622
          ],
          [
            108.202985,
            15.962622
          ],
          [
            108.202985,
            15.962903
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0478",
    "properties": {
      "id": "sx-dx2526-0478",
      "stt": 478,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Tơ",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 300,
      "giong_cap_kg": 3.6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962734,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203526,
            15.96289
          ],
          [
            108.203976,
            15.96289
          ],
          [
            108.203976,
            15.962608
          ],
          [
            108.203526,
            15.962608
          ],
          [
            108.203526,
            15.96289
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0479",
    "properties": {
      "id": "sx-dx2526-0479",
      "stt": 479,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Xí",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 700,
      "giong_cap_kg": 8.4,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962734,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204016,
            15.962869
          ],
          [
            108.204466,
            15.962869
          ],
          [
            108.204466,
            15.962588
          ],
          [
            108.204016,
            15.962588
          ],
          [
            108.204016,
            15.962869
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0480",
    "properties": {
      "id": "sx-dx2526-0480",
      "stt": 480,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Điện",
      "ho_san_xuat": "Đặng Điện",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1052,
      "giong_cap_kg": 12.62,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962734,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204474,
            15.962851
          ],
          [
            108.204924,
            15.962851
          ],
          [
            108.204924,
            15.96257
          ],
          [
            108.204474,
            15.96257
          ],
          [
            108.204474,
            15.962851
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0481",
    "properties": {
      "id": "sx-dx2526-0481",
      "stt": 481,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Thương",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1065,
      "giong_cap_kg": 12.78,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962422,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201484,
            15.962533
          ],
          [
            108.201934,
            15.962533
          ],
          [
            108.201934,
            15.962251
          ],
          [
            108.201484,
            15.962251
          ],
          [
            108.201484,
            15.962533
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0482",
    "properties": {
      "id": "sx-dx2526-0482",
      "stt": 482,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Thương",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 250,
      "giong_cap_kg": 3,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962422,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202025,
            15.962541
          ],
          [
            108.202475,
            15.962541
          ],
          [
            108.202475,
            15.96226
          ],
          [
            108.202025,
            15.96226
          ],
          [
            108.202025,
            15.962541
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0483",
    "properties": {
      "id": "sx-dx2526-0483",
      "stt": 483,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Châu",
      "ho_san_xuat": "Nguyễn Châu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 210,
      "giong_cap_kg": 2.52,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962422,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202516,
            15.96256
          ],
          [
            108.202966,
            15.96256
          ],
          [
            108.202966,
            15.962279
          ],
          [
            108.202516,
            15.962279
          ],
          [
            108.202516,
            15.96256
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0484",
    "properties": {
      "id": "sx-dx2526-0484",
      "stt": 484,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Châu",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962422,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202975,
            15.962581
          ],
          [
            108.203425,
            15.962581
          ],
          [
            108.203425,
            15.962299
          ],
          [
            108.202975,
            15.962299
          ],
          [
            108.202975,
            15.962581
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0485",
    "properties": {
      "id": "sx-dx2526-0485",
      "stt": 485,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Lê Thị Chát",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 200,
      "giong_cap_kg": 2.4,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962422,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203484,
            15.962592
          ],
          [
            108.203934,
            15.962592
          ],
          [
            108.203934,
            15.962311
          ],
          [
            108.203484,
            15.962311
          ],
          [
            108.203484,
            15.962592
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0486",
    "properties": {
      "id": "sx-dx2526-0486",
      "stt": 486,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Sảy",
      "ho_san_xuat": "Nguyễn Sảy",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 490,
      "giong_cap_kg": 5.88,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962422,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204025,
            15.962589
          ],
          [
            108.204475,
            15.962589
          ],
          [
            108.204475,
            15.962307
          ],
          [
            108.204025,
            15.962307
          ],
          [
            108.204025,
            15.962589
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0487",
    "properties": {
      "id": "sx-dx2526-0487",
      "stt": 487,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Yên",
      "ho_san_xuat": "Nguyễn Yên",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 515,
      "giong_cap_kg": 6.18,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962422,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204516,
            15.962573
          ],
          [
            108.204966,
            15.962573
          ],
          [
            108.204966,
            15.962291
          ],
          [
            108.204516,
            15.962291
          ],
          [
            108.204516,
            15.962573
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0488",
    "properties": {
      "id": "sx-dx2526-0488",
      "stt": 488,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Đủ",
      "ho_san_xuat": "Nguyễn Yên",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 275,
      "giong_cap_kg": 3.3,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962109,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201475,
            15.962239
          ],
          [
            108.201925,
            15.962239
          ],
          [
            108.201925,
            15.961958
          ],
          [
            108.201475,
            15.961958
          ],
          [
            108.201475,
            15.962239
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0489",
    "properties": {
      "id": "sx-dx2526-0489",
      "stt": 489,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Ký",
      "ho_san_xuat": "Đặng Ký",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1130,
      "giong_cap_kg": 13.56,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962109,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201983,
            15.962223
          ],
          [
            108.202433,
            15.962223
          ],
          [
            108.202433,
            15.961942
          ],
          [
            108.201983,
            15.961942
          ],
          [
            108.201983,
            15.962223
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0490",
    "properties": {
      "id": "sx-dx2526-0490",
      "stt": 490,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Quýt",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 360,
      "giong_cap_kg": 4.32,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962109,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202525,
            15.962221
          ],
          [
            108.202975,
            15.962221
          ],
          [
            108.202975,
            15.96194
          ],
          [
            108.202525,
            15.96194
          ],
          [
            108.202525,
            15.962221
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0491",
    "properties": {
      "id": "sx-dx2526-0491",
      "stt": 491,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Truật",
      "ho_san_xuat": "Đặng Truật",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 145,
      "giong_cap_kg": 1.74,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962109,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203017,
            15.962233
          ],
          [
            108.203467,
            15.962233
          ],
          [
            108.203467,
            15.961951
          ],
          [
            108.203017,
            15.961951
          ],
          [
            108.203017,
            15.962233
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0492",
    "properties": {
      "id": "sx-dx2526-0492",
      "stt": 492,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Võ Thị Hoa",
      "ho_san_xuat": "Võ Thị Hoa",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 460,
      "giong_cap_kg": 5.52,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962109,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203475,
            15.962253
          ],
          [
            108.203925,
            15.962253
          ],
          [
            108.203925,
            15.961972
          ],
          [
            108.203475,
            15.961972
          ],
          [
            108.203475,
            15.962253
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0493",
    "properties": {
      "id": "sx-dx2526-0493",
      "stt": 493,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Mỹ",
      "ho_san_xuat": "Phạm Xong",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 95,
      "giong_cap_kg": 1.14,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962109,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203983,
            15.962272
          ],
          [
            108.204433,
            15.962272
          ],
          [
            108.204433,
            15.961991
          ],
          [
            108.203983,
            15.961991
          ],
          [
            108.203983,
            15.962272
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0494",
    "properties": {
      "id": "sx-dx2526-0494",
      "stt": 494,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Mười",
      "ho_san_xuat": "Nguyễn Mười",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 865,
      "giong_cap_kg": 10.38,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.962109,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204525,
            15.96228
          ],
          [
            108.204975,
            15.96228
          ],
          [
            108.204975,
            15.961999
          ],
          [
            108.204525,
            15.961999
          ],
          [
            108.204525,
            15.96228
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0495",
    "properties": {
      "id": "sx-dx2526-0495",
      "stt": 495,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Trương Thị Dạng",
      "ho_san_xuat": "Võ Đình Phú",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 785,
      "giong_cap_kg": 9.42,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961797,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201517,
            15.961961
          ],
          [
            108.201967,
            15.961961
          ],
          [
            108.201967,
            15.96168
          ],
          [
            108.201517,
            15.96168
          ],
          [
            108.201517,
            15.961961
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0496",
    "properties": {
      "id": "sx-dx2526-0496",
      "stt": 496,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Trương Thị Dạng",
      "ho_san_xuat": "Võ Đình Phú",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 95,
      "giong_cap_kg": 1.14,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961797,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201976,
            15.961943
          ],
          [
            108.202426,
            15.961943
          ],
          [
            108.202426,
            15.961662
          ],
          [
            108.201976,
            15.961662
          ],
          [
            108.201976,
            15.961943
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0497",
    "properties": {
      "id": "sx-dx2526-0497",
      "stt": 497,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Võ Đình Phú",
      "ho_san_xuat": "Võ Đình Phú",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 78,
      "giong_cap_kg": 0.94,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961797,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202482,
            15.961922
          ],
          [
            108.202932,
            15.961922
          ],
          [
            108.202932,
            15.961641
          ],
          [
            108.202482,
            15.961641
          ],
          [
            108.202482,
            15.961922
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0498",
    "properties": {
      "id": "sx-dx2526-0498",
      "stt": 498,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Hà",
      "ho_san_xuat": "Nguyễn Hà",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 950,
      "giong_cap_kg": 11.4,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961797,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203024,
            15.961909
          ],
          [
            108.203474,
            15.961909
          ],
          [
            108.203474,
            15.961628
          ],
          [
            108.203024,
            15.961628
          ],
          [
            108.203024,
            15.961909
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0499",
    "properties": {
      "id": "sx-dx2526-0499",
      "stt": 499,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Xão",
      "ho_san_xuat": "Nguyễn Thị Xão",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 115,
      "giong_cap_kg": 1.38,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961797,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203518,
            15.96191
          ],
          [
            108.203968,
            15.96191
          ],
          [
            108.203968,
            15.961629
          ],
          [
            108.203518,
            15.961629
          ],
          [
            108.203518,
            15.96191
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0500",
    "properties": {
      "id": "sx-dx2526-0500",
      "stt": 500,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Chúc",
      "ho_san_xuat": "Nguyễn Thị Chúc",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 410,
      "giong_cap_kg": 4.92,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961797,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203976,
            15.961924
          ],
          [
            108.204426,
            15.961924
          ],
          [
            108.204426,
            15.961643
          ],
          [
            108.203976,
            15.961643
          ],
          [
            108.203976,
            15.961924
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0501",
    "properties": {
      "id": "sx-dx2526-0501",
      "stt": 501,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Huỳnh Thị Loan",
      "ho_san_xuat": "Huỳnh Thị Loan",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 275,
      "giong_cap_kg": 3.3,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961797,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204482,
            15.961945
          ],
          [
            108.204932,
            15.961945
          ],
          [
            108.204932,
            15.961664
          ],
          [
            108.204482,
            15.961664
          ],
          [
            108.204482,
            15.961945
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0502",
    "properties": {
      "id": "sx-dx2526-0502",
      "stt": 502,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Võ Thị Hữu",
      "ho_san_xuat": "Võ Thị Hữu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 200,
      "giong_cap_kg": 2.4,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961484,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201524,
            15.96165
          ],
          [
            108.201974,
            15.96165
          ],
          [
            108.201974,
            15.961369
          ],
          [
            108.201524,
            15.961369
          ],
          [
            108.201524,
            15.96165
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0503",
    "properties": {
      "id": "sx-dx2526-0503",
      "stt": 503,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Đức Thắng",
      "ho_san_xuat": "Nguyễn Đức Thắng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 65,
      "giong_cap_kg": 0.78,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961484,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202018,
            15.961655
          ],
          [
            108.202468,
            15.961655
          ],
          [
            108.202468,
            15.961374
          ],
          [
            108.202018,
            15.961374
          ],
          [
            108.202018,
            15.961655
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0504",
    "properties": {
      "id": "sx-dx2526-0504",
      "stt": 504,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Sơn",
      "ho_san_xuat": "Nguyễn Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 840,
      "giong_cap_kg": 10.08,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961484,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202476,
            15.961645
          ],
          [
            108.202926,
            15.961645
          ],
          [
            108.202926,
            15.961364
          ],
          [
            108.202476,
            15.961364
          ],
          [
            108.202476,
            15.961645
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0505",
    "properties": {
      "id": "sx-dx2526-0505",
      "stt": 505,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Lê Thị Chát",
      "ho_san_xuat": "Lê Thị Chát",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 645,
      "giong_cap_kg": 7.74,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961484,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202982,
            15.961625
          ],
          [
            108.203432,
            15.961625
          ],
          [
            108.203432,
            15.961344
          ],
          [
            108.202982,
            15.961344
          ],
          [
            108.202982,
            15.961625
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0506",
    "properties": {
      "id": "sx-dx2526-0506",
      "stt": 506,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đinh Thị Em",
      "ho_san_xuat": "Đinh Thị Em",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 630,
      "giong_cap_kg": 7.56,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961484,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203524,
            15.961605
          ],
          [
            108.203974,
            15.961605
          ],
          [
            108.203974,
            15.961324
          ],
          [
            108.203524,
            15.961324
          ],
          [
            108.203524,
            15.961605
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0507",
    "properties": {
      "id": "sx-dx2526-0507",
      "stt": 507,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Miên",
      "ho_san_xuat": "Nguyễn Thị Miên",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 950,
      "giong_cap_kg": 11.4,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961484,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204019,
            15.961595
          ],
          [
            108.204469,
            15.961595
          ],
          [
            108.204469,
            15.961314
          ],
          [
            108.204019,
            15.961314
          ],
          [
            108.204019,
            15.961595
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0508",
    "properties": {
      "id": "sx-dx2526-0508",
      "stt": 508,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Thị Nhường",
      "ho_san_xuat": "Đặng Thị Nhường",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 445,
      "giong_cap_kg": 5.34,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961484,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204477,
            15.9616
          ],
          [
            108.204927,
            15.9616
          ],
          [
            108.204927,
            15.961319
          ],
          [
            108.204477,
            15.961319
          ],
          [
            108.204477,
            15.9616
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0509",
    "properties": {
      "id": "sx-dx2526-0509",
      "stt": 509,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Minh",
      "ho_san_xuat": "Nguyễn Minh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 256,
      "giong_cap_kg": 3.07,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961172,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201481,
            15.961304
          ],
          [
            108.201931,
            15.961304
          ],
          [
            108.201931,
            15.961023
          ],
          [
            108.201481,
            15.961023
          ],
          [
            108.201481,
            15.961304
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0510",
    "properties": {
      "id": "sx-dx2526-0510",
      "stt": 510,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Thị Xão",
      "ho_san_xuat": "Nguyễn Thị Xão",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 665,
      "giong_cap_kg": 7.98,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961172,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202023,
            15.961325
          ],
          [
            108.202473,
            15.961325
          ],
          [
            108.202473,
            15.961044
          ],
          [
            108.202023,
            15.961044
          ],
          [
            108.202023,
            15.961325
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0511",
    "properties": {
      "id": "sx-dx2526-0511",
      "stt": 511,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Võ Thị Hữu",
      "ho_san_xuat": "Võ Thị Hữu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 410,
      "giong_cap_kg": 4.92,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961172,
        108.202725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202519,
            15.96134
          ],
          [
            108.202969,
            15.96134
          ],
          [
            108.202969,
            15.961059
          ],
          [
            108.202519,
            15.961059
          ],
          [
            108.202519,
            15.96134
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0512",
    "properties": {
      "id": "sx-dx2526-0512",
      "stt": 512,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Võ Thị Hoa",
      "ho_san_xuat": "Nguyễn Văn Vinh (T)",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 465,
      "giong_cap_kg": 5.58,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961172,
        108.203225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202977,
            15.961341
          ],
          [
            108.203427,
            15.961341
          ],
          [
            108.203427,
            15.96106
          ],
          [
            108.202977,
            15.96106
          ],
          [
            108.202977,
            15.961341
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0513",
    "properties": {
      "id": "sx-dx2526-0513",
      "stt": 513,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Thị Tuôi",
      "ho_san_xuat": "Đặng Thị Tuôi",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 810,
      "giong_cap_kg": 9.72,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961172,
        108.203725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203481,
            15.961328
          ],
          [
            108.203931,
            15.961328
          ],
          [
            108.203931,
            15.961047
          ],
          [
            108.203481,
            15.961047
          ],
          [
            108.203481,
            15.961328
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0514",
    "properties": {
      "id": "sx-dx2526-0514",
      "stt": 514,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Nguyễn Minh",
      "ho_san_xuat": "Nguyễn Minh",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 150,
      "giong_cap_kg": 1.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961172,
        108.204225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204023,
            15.961308
          ],
          [
            108.204473,
            15.961308
          ],
          [
            108.204473,
            15.961026
          ],
          [
            108.204023,
            15.961026
          ],
          [
            108.204023,
            15.961308
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0515",
    "properties": {
      "id": "sx-dx2526-0515",
      "stt": 515,
      "xu_dong": "Gò Ổi",
      "lo_thua_dat": "Gò ổi",
      "chu_dat": "Đặng Thị Nhường",
      "ho_san_xuat": "Đặng Thị Nhường",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 280,
      "giong_cap_kg": 3.36,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 6",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.961172,
        108.204725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.204519,
            15.961289
          ],
          [
            108.204969,
            15.961289
          ],
          [
            108.204969,
            15.961008
          ],
          [
            108.204519,
            15.961008
          ],
          [
            108.204519,
            15.961289
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0516",
    "properties": {
      "id": "sx-dx2526-0516",
      "stt": 516,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Trung Hiếu",
      "ho_san_xuat": "Đặng Trung Hiếu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 344,
      "giong_cap_kg": 4.13,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198477,
            15.96047
          ],
          [
            108.198927,
            15.96047
          ],
          [
            108.198927,
            15.960133
          ],
          [
            108.198477,
            15.960133
          ],
          [
            108.198477,
            15.96047
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0517",
    "properties": {
      "id": "sx-dx2526-0517",
      "stt": 517,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Thị Khuyến",
      "ho_san_xuat": "Đặng Thị Bích Sơn",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 428,
      "giong_cap_kg": 5.14,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19898,
            15.960478
          ],
          [
            108.19943,
            15.960478
          ],
          [
            108.19943,
            15.96014
          ],
          [
            108.19898,
            15.96014
          ],
          [
            108.19898,
            15.960478
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0518",
    "properties": {
      "id": "sx-dx2526-0518",
      "stt": 518,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Văn Đông",
      "ho_san_xuat": "Đặng Văn Em",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 590,
      "giong_cap_kg": 7.08,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199523,
            15.960497
          ],
          [
            108.199973,
            15.960497
          ],
          [
            108.199973,
            15.960159
          ],
          [
            108.199523,
            15.960159
          ],
          [
            108.199523,
            15.960497
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0519",
    "properties": {
      "id": "sx-dx2526-0519",
      "stt": 519,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Đức Thắng",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 270,
      "giong_cap_kg": 3.24,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20002,
            15.960517
          ],
          [
            108.20047,
            15.960517
          ],
          [
            108.20047,
            15.960179
          ],
          [
            108.20002,
            15.960179
          ],
          [
            108.20002,
            15.960517
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0520",
    "properties": {
      "id": "sx-dx2526-0520",
      "stt": 520,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Huỳnh Thị Loan",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 323,
      "giong_cap_kg": 3.88,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200478,
            15.960529
          ],
          [
            108.200928,
            15.960529
          ],
          [
            108.200928,
            15.960192
          ],
          [
            108.200478,
            15.960192
          ],
          [
            108.200478,
            15.960529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0521",
    "properties": {
      "id": "sx-dx2526-0521",
      "stt": 521,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Thạch",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 802,
      "giong_cap_kg": 9.62,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20098,
            15.960527
          ],
          [
            108.20143,
            15.960527
          ],
          [
            108.20143,
            15.960189
          ],
          [
            108.20098,
            15.960189
          ],
          [
            108.20098,
            15.960527
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0522",
    "properties": {
      "id": "sx-dx2526-0522",
      "stt": 522,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Tàu",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 430,
      "giong_cap_kg": 5.16,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201522,
            15.960511
          ],
          [
            108.201972,
            15.960511
          ],
          [
            108.201972,
            15.960174
          ],
          [
            108.201522,
            15.960174
          ],
          [
            108.201522,
            15.960511
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0523",
    "properties": {
      "id": "sx-dx2526-0523",
      "stt": 523,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Thị Mười",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 740,
      "giong_cap_kg": 8.88,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.960331,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20202,
            15.96049
          ],
          [
            108.20247,
            15.96049
          ],
          [
            108.20247,
            15.960153
          ],
          [
            108.20202,
            15.960153
          ],
          [
            108.20202,
            15.96049
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0524",
    "properties": {
      "id": "sx-dx2526-0524",
      "stt": 524,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "H1",
      "ho_san_xuat": "H1",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 440,
      "giong_cap_kg": 5.28,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198478,
            15.960099
          ],
          [
            108.198928,
            15.960099
          ],
          [
            108.198928,
            15.959762
          ],
          [
            108.198478,
            15.959762
          ],
          [
            108.198478,
            15.960099
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0525",
    "properties": {
      "id": "sx-dx2526-0525",
      "stt": 525,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Thái Thị Hiệp",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 992,
      "giong_cap_kg": 11.9,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19898,
            15.960096
          ],
          [
            108.19943,
            15.960096
          ],
          [
            108.19943,
            15.959758
          ],
          [
            108.19898,
            15.959758
          ],
          [
            108.19898,
            15.960096
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0526",
    "properties": {
      "id": "sx-dx2526-0526",
      "stt": 526,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Văn Thành",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 816,
      "giong_cap_kg": 9.79,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199522,
            15.960107
          ],
          [
            108.199972,
            15.960107
          ],
          [
            108.199972,
            15.959769
          ],
          [
            108.199522,
            15.959769
          ],
          [
            108.199522,
            15.960107
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0527",
    "properties": {
      "id": "sx-dx2526-0527",
      "stt": 527,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Thị Bằng",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200021,
            15.960127
          ],
          [
            108.200471,
            15.960127
          ],
          [
            108.200471,
            15.959789
          ],
          [
            108.200021,
            15.959789
          ],
          [
            108.200021,
            15.960127
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0528",
    "properties": {
      "id": "sx-dx2526-0528",
      "stt": 528,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Minh",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 680,
      "giong_cap_kg": 8.16,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200478,
            15.960146
          ],
          [
            108.200928,
            15.960146
          ],
          [
            108.200928,
            15.959808
          ],
          [
            108.200478,
            15.959808
          ],
          [
            108.200478,
            15.960146
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0529",
    "properties": {
      "id": "sx-dx2526-0529",
      "stt": 529,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Đức Thắng",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 315,
      "giong_cap_kg": 3.78,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200979,
            15.960155
          ],
          [
            108.201429,
            15.960155
          ],
          [
            108.201429,
            15.959817
          ],
          [
            108.200979,
            15.959817
          ],
          [
            108.200979,
            15.960155
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0530",
    "properties": {
      "id": "sx-dx2526-0530",
      "stt": 530,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Mộng Hùng",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 355,
      "giong_cap_kg": 4.26,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201522,
            15.960149
          ],
          [
            108.201972,
            15.960149
          ],
          [
            108.201972,
            15.959812
          ],
          [
            108.201522,
            15.959812
          ],
          [
            108.201522,
            15.960149
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0531",
    "properties": {
      "id": "sx-dx2526-0531",
      "stt": 531,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Lê Thị Thanh",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 350,
      "giong_cap_kg": 4.2,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959956,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202021,
            15.960132
          ],
          [
            108.202471,
            15.960132
          ],
          [
            108.202471,
            15.959794
          ],
          [
            108.202021,
            15.959794
          ],
          [
            108.202021,
            15.960132
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0532",
    "properties": {
      "id": "sx-dx2526-0532",
      "stt": 532,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Ngọc Sơn",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 140,
      "giong_cap_kg": 1.68,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198479,
            15.959736
          ],
          [
            108.198929,
            15.959736
          ],
          [
            108.198929,
            15.959398
          ],
          [
            108.198479,
            15.959398
          ],
          [
            108.198479,
            15.959736
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0533",
    "properties": {
      "id": "sx-dx2526-0533",
      "stt": 533,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Huỳnh Thị Loan",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 415,
      "giong_cap_kg": 4.98,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198979,
            15.959722
          ],
          [
            108.199429,
            15.959722
          ],
          [
            108.199429,
            15.959384
          ],
          [
            108.198979,
            15.959384
          ],
          [
            108.198979,
            15.959722
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0534",
    "properties": {
      "id": "sx-dx2526-0534",
      "stt": 534,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Mộng Hùng",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 790,
      "giong_cap_kg": 9.48,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199521,
            15.959722
          ],
          [
            108.199971,
            15.959722
          ],
          [
            108.199971,
            15.959384
          ],
          [
            108.199521,
            15.959384
          ],
          [
            108.199521,
            15.959722
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0535",
    "properties": {
      "id": "sx-dx2526-0535",
      "stt": 535,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Nhí",
      "ho_san_xuat": "Nguyễn Thị Hường",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 760,
      "giong_cap_kg": 9.12,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200021,
            15.959736
          ],
          [
            108.200471,
            15.959736
          ],
          [
            108.200471,
            15.959398
          ],
          [
            108.200021,
            15.959398
          ],
          [
            108.200021,
            15.959736
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0536",
    "properties": {
      "id": "sx-dx2526-0536",
      "stt": 536,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Sàng",
      "ho_san_xuat": "Nguyễn Anh Phúc",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 576,
      "giong_cap_kg": 6.91,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200479,
            15.959757
          ],
          [
            108.200929,
            15.959757
          ],
          [
            108.200929,
            15.959419
          ],
          [
            108.200479,
            15.959419
          ],
          [
            108.200479,
            15.959757
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0537",
    "properties": {
      "id": "sx-dx2526-0537",
      "stt": 537,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Thị Trung",
      "ho_san_xuat": "Đặng Ngọc Liên",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 755,
      "giong_cap_kg": 9.06,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200978,
            15.959774
          ],
          [
            108.201428,
            15.959774
          ],
          [
            108.201428,
            15.959437
          ],
          [
            108.200978,
            15.959437
          ],
          [
            108.200978,
            15.959774
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0538",
    "properties": {
      "id": "sx-dx2526-0538",
      "stt": 538,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Văn Phi Hùng",
      "ho_san_xuat": "Võ Văn Phi Hùng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 220,
      "giong_cap_kg": 2.64,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201521,
            15.95978
          ],
          [
            108.201971,
            15.95978
          ],
          [
            108.201971,
            15.959442
          ],
          [
            108.201521,
            15.959442
          ],
          [
            108.201521,
            15.95978
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0539",
    "properties": {
      "id": "sx-dx2526-0539",
      "stt": 539,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Nhí",
      "ho_san_xuat": "Nguyễn Thị Hường",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 560,
      "giong_cap_kg": 6.72,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959581,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202022,
            15.959771
          ],
          [
            108.202472,
            15.959771
          ],
          [
            108.202472,
            15.959433
          ],
          [
            108.202022,
            15.959433
          ],
          [
            108.202022,
            15.959771
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0540",
    "properties": {
      "id": "sx-dx2526-0540",
      "stt": 540,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Ngọc Sơn",
      "ho_san_xuat": "Nguyễn Ngọc Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 415,
      "giong_cap_kg": 4.98,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198479,
            15.959377
          ],
          [
            108.198929,
            15.959377
          ],
          [
            108.198929,
            15.959039
          ],
          [
            108.198479,
            15.959039
          ],
          [
            108.198479,
            15.959377
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0541",
    "properties": {
      "id": "sx-dx2526-0541",
      "stt": 541,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Thị Trung",
      "ho_san_xuat": "Đặng Ngọc Liên",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 120,
      "giong_cap_kg": 1.44,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198978,
            15.959357
          ],
          [
            108.199428,
            15.959357
          ],
          [
            108.199428,
            15.959019
          ],
          [
            108.198978,
            15.959019
          ],
          [
            108.198978,
            15.959357
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0542",
    "properties": {
      "id": "sx-dx2526-0542",
      "stt": 542,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Trần Mậu Thức",
      "ho_san_xuat": "Đặng Lạc",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1050,
      "giong_cap_kg": 12.6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19952,
            15.959346
          ],
          [
            108.19997,
            15.959346
          ],
          [
            108.19997,
            15.959008
          ],
          [
            108.19952,
            15.959008
          ],
          [
            108.19952,
            15.959346
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0543",
    "properties": {
      "id": "sx-dx2526-0543",
      "stt": 543,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Thị Hường",
      "ho_san_xuat": "Nguyễn Thị Hường",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 410,
      "giong_cap_kg": 4.92,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200022,
            15.959349
          ],
          [
            108.200472,
            15.959349
          ],
          [
            108.200472,
            15.959012
          ],
          [
            108.200022,
            15.959012
          ],
          [
            108.200022,
            15.959349
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0544",
    "properties": {
      "id": "sx-dx2526-0544",
      "stt": 544,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "H2",
      "ho_san_xuat": "H2",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 100,
      "giong_cap_kg": 1.2,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20048,
            15.959365
          ],
          [
            108.20093,
            15.959365
          ],
          [
            108.20093,
            15.959028
          ],
          [
            108.20048,
            15.959028
          ],
          [
            108.20048,
            15.959365
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0545",
    "properties": {
      "id": "sx-dx2526-0545",
      "stt": 545,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Trường Sơn",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 890,
      "giong_cap_kg": 10.68,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200978,
            15.959386
          ],
          [
            108.201428,
            15.959386
          ],
          [
            108.201428,
            15.959049
          ],
          [
            108.200978,
            15.959049
          ],
          [
            108.200978,
            15.959386
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0546",
    "properties": {
      "id": "sx-dx2526-0546",
      "stt": 546,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Thị Hoa",
      "ho_san_xuat": "Võ Thị Hoa",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20152,
            15.959402
          ],
          [
            108.20197,
            15.959402
          ],
          [
            108.20197,
            15.959064
          ],
          [
            108.20152,
            15.959064
          ],
          [
            108.20152,
            15.959402
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0547",
    "properties": {
      "id": "sx-dx2526-0547",
      "stt": 547,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "CBB",
      "ho_san_xuat": "Đặng Tiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 373,
      "giong_cap_kg": 4.48,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.959206,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202022,
            15.959404
          ],
          [
            108.202472,
            15.959404
          ],
          [
            108.202472,
            15.959067
          ],
          [
            108.202022,
            15.959067
          ],
          [
            108.202022,
            15.959404
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0548",
    "properties": {
      "id": "sx-dx2526-0548",
      "stt": 548,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "CBB",
      "ho_san_xuat": "Đặng Tiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 1110,
      "giong_cap_kg": 13.32,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19848,
            15.959017
          ],
          [
            108.19893,
            15.959017
          ],
          [
            108.19893,
            15.958679
          ],
          [
            108.19848,
            15.958679
          ],
          [
            108.19848,
            15.959017
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0549",
    "properties": {
      "id": "sx-dx2526-0549",
      "stt": 549,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Lê Thị Chát",
      "ho_san_xuat": "Lê Thị Chát",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 680,
      "giong_cap_kg": 8.16,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198977,
            15.958997
          ],
          [
            108.199427,
            15.958997
          ],
          [
            108.199427,
            15.958659
          ],
          [
            108.198977,
            15.958659
          ],
          [
            108.198977,
            15.958997
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0550",
    "properties": {
      "id": "sx-dx2526-0550",
      "stt": 550,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Hà",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 695,
      "giong_cap_kg": 8.34,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19952,
            15.958978
          ],
          [
            108.19997,
            15.958978
          ],
          [
            108.19997,
            15.95864
          ],
          [
            108.19952,
            15.95864
          ],
          [
            108.19952,
            15.958978
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0551",
    "properties": {
      "id": "sx-dx2526-0551",
      "stt": 551,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Nông",
      "ho_san_xuat": "Võ Nông",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1250,
      "giong_cap_kg": 15,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200023,
            15.95897
          ],
          [
            108.200473,
            15.95897
          ],
          [
            108.200473,
            15.958633
          ],
          [
            108.200023,
            15.958633
          ],
          [
            108.200023,
            15.95897
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0552",
    "properties": {
      "id": "sx-dx2526-0552",
      "stt": 552,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Mười",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 580,
      "giong_cap_kg": 6.96,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200481,
            15.958977
          ],
          [
            108.200931,
            15.958977
          ],
          [
            108.200931,
            15.958639
          ],
          [
            108.200481,
            15.958639
          ],
          [
            108.200481,
            15.958977
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0553",
    "properties": {
      "id": "sx-dx2526-0553",
      "stt": 553,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Doãn Quýt",
      "ho_san_xuat": "Doãn Quýt",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1055,
      "giong_cap_kg": 12.66,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200977,
            15.958995
          ],
          [
            108.201427,
            15.958995
          ],
          [
            108.201427,
            15.958658
          ],
          [
            108.200977,
            15.958658
          ],
          [
            108.200977,
            15.958995
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0554",
    "properties": {
      "id": "sx-dx2526-0554",
      "stt": 554,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Thị Bằng",
      "ho_san_xuat": "Nguyễn Văn Vinh (T)",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 310,
      "giong_cap_kg": 3.72,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201519,
            15.959016
          ],
          [
            108.201969,
            15.959016
          ],
          [
            108.201969,
            15.958678
          ],
          [
            108.201519,
            15.958678
          ],
          [
            108.201519,
            15.959016
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0555",
    "properties": {
      "id": "sx-dx2526-0555",
      "stt": 555,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Xí",
      "ho_san_xuat": "Nguyễn Xí",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 965,
      "giong_cap_kg": 11.58,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958831,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202023,
            15.959029
          ],
          [
            108.202473,
            15.959029
          ],
          [
            108.202473,
            15.958691
          ],
          [
            108.202023,
            15.958691
          ],
          [
            108.202023,
            15.959029
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0556",
    "properties": {
      "id": "sx-dx2526-0556",
      "stt": 556,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Truật",
      "ho_san_xuat": "Đặng Đào",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 400,
      "giong_cap_kg": 4.8,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198481,
            15.958652
          ],
          [
            108.198931,
            15.958652
          ],
          [
            108.198931,
            15.958315
          ],
          [
            108.198481,
            15.958315
          ],
          [
            108.198481,
            15.958652
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0557",
    "properties": {
      "id": "sx-dx2526-0557",
      "stt": 557,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Thị Quýt",
      "ho_san_xuat": "Nguyễn Thị Quýt",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 1180,
      "giong_cap_kg": 14.16,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198977,
            15.958638
          ],
          [
            108.199427,
            15.958638
          ],
          [
            108.199427,
            15.9583
          ],
          [
            108.198977,
            15.9583
          ],
          [
            108.198977,
            15.958638
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0558",
    "properties": {
      "id": "sx-dx2526-0558",
      "stt": 558,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Sơn",
      "ho_san_xuat": "Nguyễn Sơn",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199519,
            15.958617
          ],
          [
            108.199969,
            15.958617
          ],
          [
            108.199969,
            15.958279
          ],
          [
            108.199519,
            15.958279
          ],
          [
            108.199519,
            15.958617
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0559",
    "properties": {
      "id": "sx-dx2526-0559",
      "stt": 559,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Thị Lan",
      "ho_san_xuat": "Nguyễn Châu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200023,
            15.9586
          ],
          [
            108.200473,
            15.9586
          ],
          [
            108.200473,
            15.958262
          ],
          [
            108.200023,
            15.958262
          ],
          [
            108.200023,
            15.9586
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0560",
    "properties": {
      "id": "sx-dx2526-0560",
      "stt": 560,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Thị Bằng",
      "ho_san_xuat": "Nguyễn Văn Vinh (T)",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 785,
      "giong_cap_kg": 9.42,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200481,
            15.958595
          ],
          [
            108.200931,
            15.958595
          ],
          [
            108.200931,
            15.958258
          ],
          [
            108.200481,
            15.958258
          ],
          [
            108.200481,
            15.958595
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0561",
    "properties": {
      "id": "sx-dx2526-0561",
      "stt": 561,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Sàng",
      "ho_san_xuat": "Nguyễn Anh Phúc",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 620,
      "giong_cap_kg": 7.44,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200976,
            15.958605
          ],
          [
            108.201426,
            15.958605
          ],
          [
            108.201426,
            15.958268
          ],
          [
            108.200976,
            15.958268
          ],
          [
            108.200976,
            15.958605
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0562",
    "properties": {
      "id": "sx-dx2526-0562",
      "stt": 562,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Sàng",
      "ho_san_xuat": "Nguyễn Anh Phúc",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 505,
      "giong_cap_kg": 6.06,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201518,
            15.958625
          ],
          [
            108.201968,
            15.958625
          ],
          [
            108.201968,
            15.958288
          ],
          [
            108.201518,
            15.958288
          ],
          [
            108.201518,
            15.958625
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0563",
    "properties": {
      "id": "sx-dx2526-0563",
      "stt": 563,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Mười",
      "ho_san_xuat": "Nguyễn Mười",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 678,
      "giong_cap_kg": 8.14,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958456,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202024,
            15.958645
          ],
          [
            108.202474,
            15.958645
          ],
          [
            108.202474,
            15.958307
          ],
          [
            108.202024,
            15.958307
          ],
          [
            108.202024,
            15.958645
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0564",
    "properties": {
      "id": "sx-dx2526-0564",
      "stt": 564,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Văn Phi Hùng",
      "ho_san_xuat": "Võ Văn Phi Hùng",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 679,
      "giong_cap_kg": 8.15,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198482,
            15.95828
          ],
          [
            108.198932,
            15.95828
          ],
          [
            108.198932,
            15.957942
          ],
          [
            108.198482,
            15.957942
          ],
          [
            108.198482,
            15.95828
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0565",
    "properties": {
      "id": "sx-dx2526-0565",
      "stt": 565,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Thị Quýt",
      "ho_san_xuat": "Nguyễn Thị Quýt",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 350,
      "giong_cap_kg": 4.2,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198976,
            15.958275
          ],
          [
            108.199426,
            15.958275
          ],
          [
            108.199426,
            15.957937
          ],
          [
            108.198976,
            15.957937
          ],
          [
            108.198976,
            15.958275
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0566",
    "properties": {
      "id": "sx-dx2526-0566",
      "stt": 566,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Thiệu",
      "ho_san_xuat": "Đặng Thiệu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 406,
      "giong_cap_kg": 4.87,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199518,
            15.958258
          ],
          [
            108.199968,
            15.958258
          ],
          [
            108.199968,
            15.95792
          ],
          [
            108.199518,
            15.95792
          ],
          [
            108.199518,
            15.958258
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0567",
    "properties": {
      "id": "sx-dx2526-0567",
      "stt": 567,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Thị Lan",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200024,
            15.958237
          ],
          [
            108.200474,
            15.958237
          ],
          [
            108.200474,
            15.957899
          ],
          [
            108.200024,
            15.957899
          ],
          [
            108.200024,
            15.958237
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0568",
    "properties": {
      "id": "sx-dx2526-0568",
      "stt": 568,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Phạm Thị Tý",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 465,
      "giong_cap_kg": 5.58,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200482,
            15.958222
          ],
          [
            108.200932,
            15.958222
          ],
          [
            108.200932,
            15.957885
          ],
          [
            108.200482,
            15.957885
          ],
          [
            108.200482,
            15.958222
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0569",
    "properties": {
      "id": "sx-dx2526-0569",
      "stt": 569,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Thị Mười",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 850,
      "giong_cap_kg": 10.2,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200976,
            15.958221
          ],
          [
            108.201426,
            15.958221
          ],
          [
            108.201426,
            15.957884
          ],
          [
            108.200976,
            15.957884
          ],
          [
            108.200976,
            15.958221
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0570",
    "properties": {
      "id": "sx-dx2526-0570",
      "stt": 570,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Châu",
      "ho_san_xuat": "Nguyễn Châu",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.201725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201518,
            15.958235
          ],
          [
            108.201968,
            15.958235
          ],
          [
            108.201968,
            15.957897
          ],
          [
            108.201518,
            15.957897
          ],
          [
            108.201518,
            15.958235
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0571",
    "properties": {
      "id": "sx-dx2526-0571",
      "stt": 571,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Tơ",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 435,
      "giong_cap_kg": 5.22,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.958081,
        108.202225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202024,
            15.958255
          ],
          [
            108.202474,
            15.958255
          ],
          [
            108.202474,
            15.957918
          ],
          [
            108.202024,
            15.957918
          ],
          [
            108.202024,
            15.958255
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0572",
    "properties": {
      "id": "sx-dx2526-0572",
      "stt": 572,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Truật",
      "ho_san_xuat": "Nguyễn Trung Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 140,
      "giong_cap_kg": 1.68,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957706,
        108.198725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198483,
            15.957898
          ],
          [
            108.198933,
            15.957898
          ],
          [
            108.198933,
            15.957561
          ],
          [
            108.198483,
            15.957561
          ],
          [
            108.198483,
            15.957898
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0573",
    "properties": {
      "id": "sx-dx2526-0573",
      "stt": 573,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Lạc",
      "ho_san_xuat": "Đặng Lạc",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 880,
      "giong_cap_kg": 10.56,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957706,
        108.199225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.198975,
            15.957905
          ],
          [
            108.199425,
            15.957905
          ],
          [
            108.199425,
            15.957567
          ],
          [
            108.198975,
            15.957567
          ],
          [
            108.198975,
            15.957905
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0574",
    "properties": {
      "id": "sx-dx2526-0574",
      "stt": 574,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Đặng Thị Lự",
      "ho_san_xuat": "Vệ Thị Bé",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 945,
      "giong_cap_kg": 11.34,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957706,
        108.199725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199517,
            15.957897
          ],
          [
            108.199967,
            15.957897
          ],
          [
            108.199967,
            15.957559
          ],
          [
            108.199517,
            15.957559
          ],
          [
            108.199517,
            15.957897
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0575",
    "properties": {
      "id": "sx-dx2526-0575",
      "stt": 575,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Nguyễn Hà",
      "ho_san_xuat": "Nguyễn Hà (L)",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 735,
      "giong_cap_kg": 8.82,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957706,
        108.200225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200025,
            15.957878
          ],
          [
            108.200475,
            15.957878
          ],
          [
            108.200475,
            15.95754
          ],
          [
            108.200025,
            15.95754
          ],
          [
            108.200025,
            15.957878
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0576",
    "properties": {
      "id": "sx-dx2526-0576",
      "stt": 576,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Doãn Thùy",
      "ho_san_xuat": "Doãn Thùy",
      "la_chinh_chu": true,
      "giong_lua": "HG12",
      "dien_tich_m2": 830,
      "giong_cap_kg": 9.96,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957706,
        108.200725
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200483,
            15.957858
          ],
          [
            108.200933,
            15.957858
          ],
          [
            108.200933,
            15.95752
          ],
          [
            108.200483,
            15.95752
          ],
          [
            108.200483,
            15.957858
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0577",
    "properties": {
      "id": "sx-dx2526-0577",
      "stt": 577,
      "xu_dong": "La Bông Tây",
      "lo_thua_dat": "LB Tây",
      "chu_dat": "Võ Trợ",
      "ho_san_xuat": "Đặng Tân",
      "la_chinh_chu": false,
      "giong_lua": "HG12",
      "dien_tich_m2": 915,
      "giong_cap_kg": 10.98,
      "dot_phan_bo": "LBT-GO",
      "to_dan_cu": "Tổ 7",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.957706,
        108.201225
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200975,
            15.957846
          ],
          [
            108.201425,
            15.957846
          ],
          [
            108.201425,
            15.957508
          ],
          [
            108.200975,
            15.957508
          ],
          [
            108.200975,
            15.957846
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0578",
    "properties": {
      "id": "sx-dx2526-0578",
      "stt": 578,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Ngọc Quý",
      "ho_san_xuat": "Nguyễn Ngọc Quý",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 662,
      "giong_cap_kg": 7.94,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199517,
            15.967473
          ],
          [
            108.200023,
            15.967473
          ],
          [
            108.200023,
            15.967173
          ],
          [
            108.199517,
            15.967173
          ],
          [
            108.199517,
            15.967473
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0579",
    "properties": {
      "id": "sx-dx2526-0579",
      "stt": 579,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Văn Em",
      "ho_san_xuat": "Đặng Văn Em",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200088,
            15.967489
          ],
          [
            108.200594,
            15.967489
          ],
          [
            108.200594,
            15.967189
          ],
          [
            108.200088,
            15.967189
          ],
          [
            108.200088,
            15.967489
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0580",
    "properties": {
      "id": "sx-dx2526-0580",
      "stt": 580,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Phùng Thị Nga",
      "ho_san_xuat": "Đặng Công Khanh",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 435,
      "giong_cap_kg": 5.22,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200609,
            15.96751
          ],
          [
            108.201115,
            15.96751
          ],
          [
            108.201115,
            15.96721
          ],
          [
            108.200609,
            15.96721
          ],
          [
            108.200609,
            15.96751
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0581",
    "properties": {
      "id": "sx-dx2526-0581",
      "stt": 581,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Điện",
      "ho_san_xuat": "Đặng Minh Thành",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 583,
      "giong_cap_kg": 7,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201162,
            15.967526
          ],
          [
            108.201669,
            15.967526
          ],
          [
            108.201669,
            15.967226
          ],
          [
            108.201162,
            15.967226
          ],
          [
            108.201162,
            15.967526
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0582",
    "properties": {
      "id": "sx-dx2526-0582",
      "stt": 582,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Thu Nga",
      "ho_san_xuat": "Nguyễn Thị Thu Nga",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 315,
      "giong_cap_kg": 3.78,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201766,
            15.967529
          ],
          [
            108.202272,
            15.967529
          ],
          [
            108.202272,
            15.967229
          ],
          [
            108.201766,
            15.967229
          ],
          [
            108.201766,
            15.967529
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0583",
    "properties": {
      "id": "sx-dx2526-0583",
      "stt": 583,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Thịnh",
      "ho_san_xuat": "Đặng Ngọc Long",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202338,
            15.967518
          ],
          [
            108.202844,
            15.967518
          ],
          [
            108.202844,
            15.967218
          ],
          [
            108.202338,
            15.967218
          ],
          [
            108.202338,
            15.967518
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0584",
    "properties": {
      "id": "sx-dx2526-0584",
      "stt": 584,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Chuốt",
      "ho_san_xuat": "Ngô Thanh Hùng",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 400,
      "giong_cap_kg": 4.8,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202859,
            15.967498
          ],
          [
            108.203365,
            15.967498
          ],
          [
            108.203365,
            15.967198
          ],
          [
            108.202859,
            15.967198
          ],
          [
            108.202859,
            15.967498
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0585",
    "properties": {
      "id": "sx-dx2526-0585",
      "stt": 585,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Xí",
      "ho_san_xuat": "Ngô Thanh Hùng",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 140,
      "giong_cap_kg": 1.68,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96735,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203412,
            15.967479
          ],
          [
            108.203918,
            15.967479
          ],
          [
            108.203918,
            15.967179
          ],
          [
            108.203412,
            15.967179
          ],
          [
            108.203412,
            15.967479
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0586",
    "properties": {
      "id": "sx-dx2526-0586",
      "stt": 586,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Phạm Thị Như",
      "ho_san_xuat": "Ngô Thanh Hùng",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 260,
      "giong_cap_kg": 3.12,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199516,
            15.967137
          ],
          [
            108.200022,
            15.967137
          ],
          [
            108.200022,
            15.966837
          ],
          [
            108.199516,
            15.966837
          ],
          [
            108.199516,
            15.967137
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0587",
    "properties": {
      "id": "sx-dx2526-0587",
      "stt": 587,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Võ Đình Phú",
      "ho_san_xuat": "Võ Đình Phú",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 570,
      "giong_cap_kg": 6.84,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200088,
            15.967143
          ],
          [
            108.200594,
            15.967143
          ],
          [
            108.200594,
            15.966843
          ],
          [
            108.200088,
            15.966843
          ],
          [
            108.200088,
            15.967143
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0588",
    "properties": {
      "id": "sx-dx2526-0588",
      "stt": 588,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Phượng",
      "ho_san_xuat": "Đặng Lý",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 535,
      "giong_cap_kg": 6.42,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200609,
            15.967161
          ],
          [
            108.201116,
            15.967161
          ],
          [
            108.201116,
            15.966861
          ],
          [
            108.200609,
            15.966861
          ],
          [
            108.200609,
            15.967161
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0589",
    "properties": {
      "id": "sx-dx2526-0589",
      "stt": 589,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Phương",
      "ho_san_xuat": "Nguyễn Phương",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 710,
      "giong_cap_kg": 8.52,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201162,
            15.967181
          ],
          [
            108.201668,
            15.967181
          ],
          [
            108.201668,
            15.966881
          ],
          [
            108.201162,
            15.966881
          ],
          [
            108.201162,
            15.967181
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0590",
    "properties": {
      "id": "sx-dx2526-0590",
      "stt": 590,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Trần Thị Huệ",
      "ho_san_xuat": "Trần Thị Huệ",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 784,
      "giong_cap_kg": 9.41,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201765,
            15.967195
          ],
          [
            108.202272,
            15.967195
          ],
          [
            108.202272,
            15.966895
          ],
          [
            108.201765,
            15.966895
          ],
          [
            108.201765,
            15.967195
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0591",
    "properties": {
      "id": "sx-dx2526-0591",
      "stt": 591,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Thành",
      "ho_san_xuat": "Đặng Thành",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202338,
            15.967195
          ],
          [
            108.202845,
            15.967195
          ],
          [
            108.202845,
            15.966895
          ],
          [
            108.202338,
            15.966895
          ],
          [
            108.202338,
            15.967195
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0592",
    "properties": {
      "id": "sx-dx2526-0592",
      "stt": 592,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đinh Thị Em",
      "ho_san_xuat": "Đinh Thị Em",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 705,
      "giong_cap_kg": 8.46,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20286,
            15.96718
          ],
          [
            108.203366,
            15.96718
          ],
          [
            108.203366,
            15.96688
          ],
          [
            108.20286,
            15.96688
          ],
          [
            108.20286,
            15.96718
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0593",
    "properties": {
      "id": "sx-dx2526-0593",
      "stt": 593,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Thị Nhường",
      "ho_san_xuat": "Lê Thị Thanh",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 370,
      "giong_cap_kg": 4.44,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.967017,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203411,
            15.96716
          ],
          [
            108.203918,
            15.96716
          ],
          [
            108.203918,
            15.96686
          ],
          [
            108.203411,
            15.96686
          ],
          [
            108.203411,
            15.96716
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0594",
    "properties": {
      "id": "sx-dx2526-0594",
      "stt": 594,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Lê Thị Thanh",
      "ho_san_xuat": "Lê Thị Thanh",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 530,
      "giong_cap_kg": 6.36,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199515,
            15.966809
          ],
          [
            108.200021,
            15.966809
          ],
          [
            108.200021,
            15.966509
          ],
          [
            108.199515,
            15.966509
          ],
          [
            108.199515,
            15.966809
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0595",
    "properties": {
      "id": "sx-dx2526-0595",
      "stt": 595,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Võ Trợ",
      "ho_san_xuat": "Đặng Văn Dũng-T3",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 480,
      "giong_cap_kg": 5.76,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200089,
            15.966803
          ],
          [
            108.200595,
            15.966803
          ],
          [
            108.200595,
            15.966503
          ],
          [
            108.200089,
            15.966503
          ],
          [
            108.200089,
            15.966803
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0596",
    "properties": {
      "id": "sx-dx2526-0596",
      "stt": 596,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Võ Sản",
      "ho_san_xuat": "Võ Sản",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 460,
      "giong_cap_kg": 5.52,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20061,
            15.966813
          ],
          [
            108.201117,
            15.966813
          ],
          [
            108.201117,
            15.966513
          ],
          [
            108.20061,
            15.966513
          ],
          [
            108.20061,
            15.966813
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0597",
    "properties": {
      "id": "sx-dx2526-0597",
      "stt": 597,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Tàu",
      "ho_san_xuat": "Nguyễn Tàu",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 770,
      "giong_cap_kg": 9.24,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201161,
            15.966832
          ],
          [
            108.201667,
            15.966832
          ],
          [
            108.201667,
            15.966532
          ],
          [
            108.201161,
            15.966532
          ],
          [
            108.201161,
            15.966832
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0598",
    "properties": {
      "id": "sx-dx2526-0598",
      "stt": 598,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Phương",
      "ho_san_xuat": "Nguyễn Phương",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201764,
            15.966852
          ],
          [
            108.202271,
            15.966852
          ],
          [
            108.202271,
            15.966552
          ],
          [
            108.201764,
            15.966552
          ],
          [
            108.201764,
            15.966852
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0599",
    "properties": {
      "id": "sx-dx2526-0599",
      "stt": 599,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Võ Văn Phi Hùng",
      "ho_san_xuat": "Võ Văn Phi Hùng",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202339,
            15.966863
          ],
          [
            108.202845,
            15.966863
          ],
          [
            108.202845,
            15.966563
          ],
          [
            108.202339,
            15.966563
          ],
          [
            108.202339,
            15.966863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0600",
    "properties": {
      "id": "sx-dx2526-0600",
      "stt": 600,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Hiển",
      "ho_san_xuat": "Đặng Hiển",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 450,
      "giong_cap_kg": 5.4,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202861,
            15.966859
          ],
          [
            108.203367,
            15.966859
          ],
          [
            108.203367,
            15.966559
          ],
          [
            108.202861,
            15.966559
          ],
          [
            108.202861,
            15.966859
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0601",
    "properties": {
      "id": "sx-dx2526-0601",
      "stt": 601,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Lê Thị Thanh",
      "ho_san_xuat": "Lê Thị Thanh",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 940,
      "giong_cap_kg": 11.28,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966683,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203411,
            15.966842
          ],
          [
            108.203917,
            15.966842
          ],
          [
            108.203917,
            15.966542
          ],
          [
            108.203411,
            15.966542
          ],
          [
            108.203411,
            15.966842
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0602",
    "properties": {
      "id": "sx-dx2526-0602",
      "stt": 602,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Anh",
      "ho_san_xuat": "Nguyễn Thị Anh",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 495,
      "giong_cap_kg": 5.94,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199514,
            15.966488
          ],
          [
            108.20002,
            15.966488
          ],
          [
            108.20002,
            15.966188
          ],
          [
            108.199514,
            15.966188
          ],
          [
            108.199514,
            15.966488
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0603",
    "properties": {
      "id": "sx-dx2526-0603",
      "stt": 603,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Yên",
      "ho_san_xuat": "Đinh Thị Em",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 230,
      "giong_cap_kg": 2.76,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200089,
            15.966473
          ],
          [
            108.200595,
            15.966473
          ],
          [
            108.200595,
            15.966173
          ],
          [
            108.200089,
            15.966173
          ],
          [
            108.200089,
            15.966473
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0604",
    "properties": {
      "id": "sx-dx2526-0604",
      "stt": 604,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đinh Thị Em",
      "ho_san_xuat": "Đinh Thị Em",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 265,
      "giong_cap_kg": 3.18,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200611,
            15.966471
          ],
          [
            108.201118,
            15.966471
          ],
          [
            108.201118,
            15.966171
          ],
          [
            108.200611,
            15.966171
          ],
          [
            108.200611,
            15.966471
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0605",
    "properties": {
      "id": "sx-dx2526-0605",
      "stt": 605,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Phạm Thị Tý",
      "ho_san_xuat": "Nguyễn Hơn",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 1232,
      "giong_cap_kg": 14.78,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201161,
            15.966483
          ],
          [
            108.201667,
            15.966483
          ],
          [
            108.201667,
            15.966183
          ],
          [
            108.201161,
            15.966183
          ],
          [
            108.201161,
            15.966483
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0606",
    "properties": {
      "id": "sx-dx2526-0606",
      "stt": 606,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Vọng",
      "ho_san_xuat": "Đặng Ký",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 840,
      "giong_cap_kg": 10.08,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201763,
            15.966504
          ],
          [
            108.20227,
            15.966504
          ],
          [
            108.20227,
            15.966204
          ],
          [
            108.201763,
            15.966204
          ],
          [
            108.201763,
            15.966504
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0607",
    "properties": {
      "id": "sx-dx2526-0607",
      "stt": 607,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Lư",
      "ho_san_xuat": "Nguyễn Mỹ",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202339,
            15.966523
          ],
          [
            108.202846,
            15.966523
          ],
          [
            108.202846,
            15.966223
          ],
          [
            108.202339,
            15.966223
          ],
          [
            108.202339,
            15.966523
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0608",
    "properties": {
      "id": "sx-dx2526-0608",
      "stt": 608,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thuận",
      "ho_san_xuat": "Nguyễn Thuận",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 1142,
      "giong_cap_kg": 13.7,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202862,
            15.96653
          ],
          [
            108.203368,
            15.96653
          ],
          [
            108.203368,
            15.96623
          ],
          [
            108.202862,
            15.96623
          ],
          [
            108.202862,
            15.96653
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0609",
    "properties": {
      "id": "sx-dx2526-0609",
      "stt": 609,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Kiêu",
      "ho_san_xuat": "Nguyễn Thị Kiêu",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 575,
      "giong_cap_kg": 6.9,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96635,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20341,
            15.966523
          ],
          [
            108.203917,
            15.966523
          ],
          [
            108.203917,
            15.966223
          ],
          [
            108.20341,
            15.966223
          ],
          [
            108.20341,
            15.966523
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0610",
    "properties": {
      "id": "sx-dx2526-0610",
      "stt": 610,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Mã Văn Cường",
      "ho_san_xuat": "Đặng Tiếu",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199513,
            15.966171
          ],
          [
            108.200019,
            15.966171
          ],
          [
            108.200019,
            15.965871
          ],
          [
            108.199513,
            15.965871
          ],
          [
            108.199513,
            15.966171
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0611",
    "properties": {
      "id": "sx-dx2526-0611",
      "stt": 611,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Thịnh",
      "ho_san_xuat": "Đặng Ngọc Long",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20009,
            15.96615
          ],
          [
            108.200596,
            15.96615
          ],
          [
            108.200596,
            15.96585
          ],
          [
            108.20009,
            15.96585
          ],
          [
            108.20009,
            15.96615
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0612",
    "properties": {
      "id": "sx-dx2526-0612",
      "stt": 612,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Ngọc Liên",
      "ho_san_xuat": "Đặng Ngọc Liên",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 570,
      "giong_cap_kg": 6.84,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200612,
            15.966138
          ],
          [
            108.201119,
            15.966138
          ],
          [
            108.201119,
            15.965838
          ],
          [
            108.200612,
            15.965838
          ],
          [
            108.200612,
            15.966138
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0613",
    "properties": {
      "id": "sx-dx2526-0613",
      "stt": 613,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Võ Đình Phú",
      "ho_san_xuat": "Võ Đình Phú",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 800,
      "giong_cap_kg": 9.6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20116,
            15.96614
          ],
          [
            108.201667,
            15.96614
          ],
          [
            108.201667,
            15.96584
          ],
          [
            108.20116,
            15.96584
          ],
          [
            108.20116,
            15.96614
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0614",
    "properties": {
      "id": "sx-dx2526-0614",
      "stt": 614,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Sàng",
      "ho_san_xuat": "Nguyễn Anh Phúc",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 570,
      "giong_cap_kg": 6.84,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201762,
            15.966155
          ],
          [
            108.202269,
            15.966155
          ],
          [
            108.202269,
            15.965855
          ],
          [
            108.201762,
            15.965855
          ],
          [
            108.201762,
            15.966155
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0615",
    "properties": {
      "id": "sx-dx2526-0615",
      "stt": 615,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Mai",
      "ho_san_xuat": "Nguyễn Thị Mai",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 940,
      "giong_cap_kg": 11.28,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20234,
            15.966176
          ],
          [
            108.202846,
            15.966176
          ],
          [
            108.202846,
            15.965876
          ],
          [
            108.20234,
            15.965876
          ],
          [
            108.20234,
            15.966176
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0616",
    "properties": {
      "id": "sx-dx2526-0616",
      "stt": 616,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Thanh",
      "ho_san_xuat": "Đặng Thị Mười",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 240,
      "giong_cap_kg": 2.88,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202863,
            15.966192
          ],
          [
            108.203369,
            15.966192
          ],
          [
            108.203369,
            15.965892
          ],
          [
            108.202863,
            15.965892
          ],
          [
            108.202863,
            15.966192
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0617",
    "properties": {
      "id": "sx-dx2526-0617",
      "stt": 617,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Châu",
      "ho_san_xuat": "Nguyễn Châu",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 560,
      "giong_cap_kg": 6.72,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.966017,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20341,
            15.966196
          ],
          [
            108.203916,
            15.966196
          ],
          [
            108.203916,
            15.965896
          ],
          [
            108.20341,
            15.965896
          ],
          [
            108.20341,
            15.966196
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0618",
    "properties": {
      "id": "sx-dx2526-0618",
      "stt": 618,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Nhựt",
      "ho_san_xuat": "Nguyễn Nhựt",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 1200,
      "giong_cap_kg": 14.4,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199512,
            15.965852
          ],
          [
            108.200018,
            15.965852
          ],
          [
            108.200018,
            15.965552
          ],
          [
            108.199512,
            15.965552
          ],
          [
            108.199512,
            15.965852
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0619",
    "properties": {
      "id": "sx-dx2526-0619",
      "stt": 619,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Điện",
      "ho_san_xuat": "Đặng Ngọc Tiến",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 742,
      "giong_cap_kg": 8.9,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20009,
            15.965833
          ],
          [
            108.200596,
            15.965833
          ],
          [
            108.200596,
            15.965533
          ],
          [
            108.20009,
            15.965533
          ],
          [
            108.20009,
            15.965833
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0620",
    "properties": {
      "id": "sx-dx2526-0620",
      "stt": 620,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Thanh",
      "ho_san_xuat": "Đặng Ngọc Tiến",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 438,
      "giong_cap_kg": 5.26,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200613,
            15.965813
          ],
          [
            108.20112,
            15.965813
          ],
          [
            108.20112,
            15.965513
          ],
          [
            108.200613,
            15.965513
          ],
          [
            108.200613,
            15.965813
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0621",
    "properties": {
      "id": "sx-dx2526-0621",
      "stt": 621,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Tơ",
      "ho_san_xuat": "Nguyễn Hùng Sơn",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20116,
            15.965804
          ],
          [
            108.201666,
            15.965804
          ],
          [
            108.201666,
            15.965504
          ],
          [
            108.20116,
            15.965504
          ],
          [
            108.20116,
            15.965804
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0622",
    "properties": {
      "id": "sx-dx2526-0622",
      "stt": 622,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Mỹ",
      "ho_san_xuat": "Nguyễn Mỹ",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 510,
      "giong_cap_kg": 6.12,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201761,
            15.965809
          ],
          [
            108.202268,
            15.965809
          ],
          [
            108.202268,
            15.965509
          ],
          [
            108.201761,
            15.965509
          ],
          [
            108.201761,
            15.965809
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0623",
    "properties": {
      "id": "sx-dx2526-0623",
      "stt": 623,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Lê Thị Thanh",
      "ho_san_xuat": "Lê Thị Thanh",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 1026,
      "giong_cap_kg": 12.31,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20234,
            15.965826
          ],
          [
            108.202847,
            15.965826
          ],
          [
            108.202847,
            15.965526
          ],
          [
            108.20234,
            15.965526
          ],
          [
            108.20234,
            15.965826
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0624",
    "properties": {
      "id": "sx-dx2526-0624",
      "stt": 624,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Võ Đình Phú",
      "ho_san_xuat": "Võ Đình Phú",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 618,
      "giong_cap_kg": 7.42,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202864,
            15.965847
          ],
          [
            108.20337,
            15.965847
          ],
          [
            108.20337,
            15.965547
          ],
          [
            108.202864,
            15.965547
          ],
          [
            108.202864,
            15.965847
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0625",
    "properties": {
      "id": "sx-dx2526-0625",
      "stt": 625,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Miên",
      "ho_san_xuat": "Đinh Thị Vân",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 482,
      "giong_cap_kg": 5.78,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965683,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20341,
            15.965861
          ],
          [
            108.203916,
            15.965861
          ],
          [
            108.203916,
            15.965561
          ],
          [
            108.20341,
            15.965561
          ],
          [
            108.20341,
            15.965861
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0626",
    "properties": {
      "id": "sx-dx2526-0626",
      "stt": 626,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đinh Thị Hường",
      "ho_san_xuat": "Đinh Thị Hường",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 785,
      "giong_cap_kg": 9.42,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199511,
            15.965528
          ],
          [
            108.200017,
            15.965528
          ],
          [
            108.200017,
            15.965228
          ],
          [
            108.199511,
            15.965228
          ],
          [
            108.199511,
            15.965528
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0627",
    "properties": {
      "id": "sx-dx2526-0627",
      "stt": 627,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Sàng",
      "ho_san_xuat": "Nguyễn Sàng",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 105,
      "giong_cap_kg": 1.26,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20009,
            15.965515
          ],
          [
            108.200597,
            15.965515
          ],
          [
            108.200597,
            15.965215
          ],
          [
            108.20009,
            15.965215
          ],
          [
            108.20009,
            15.965515
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0628",
    "properties": {
      "id": "sx-dx2526-0628",
      "stt": 628,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Phương",
      "ho_san_xuat": "Nguyễn Phương",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 568,
      "giong_cap_kg": 6.82,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200614,
            15.965494
          ],
          [
            108.20112,
            15.965494
          ],
          [
            108.20112,
            15.965194
          ],
          [
            108.200614,
            15.965194
          ],
          [
            108.200614,
            15.965494
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0629",
    "properties": {
      "id": "sx-dx2526-0629",
      "stt": 629,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Hùng Sơn",
      "ho_san_xuat": "Đặng Văn Dũng-T3",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 458,
      "giong_cap_kg": 5.5,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201159,
            15.965476
          ],
          [
            108.201666,
            15.965476
          ],
          [
            108.201666,
            15.965176
          ],
          [
            108.201159,
            15.965176
          ],
          [
            108.201159,
            15.965476
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0630",
    "properties": {
      "id": "sx-dx2526-0630",
      "stt": 630,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Đặng Thị Bích Sơn",
      "ho_san_xuat": "Đặng Văn Dũng-T3",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 1202,
      "giong_cap_kg": 14.42,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201761,
            15.96547
          ],
          [
            108.202267,
            15.96547
          ],
          [
            108.202267,
            15.96517
          ],
          [
            108.201761,
            15.96517
          ],
          [
            108.201761,
            15.96547
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0631",
    "properties": {
      "id": "sx-dx2526-0631",
      "stt": 631,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Mộng Hùng",
      "ho_san_xuat": "Nguyễn Mộng Hùng",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 515,
      "giong_cap_kg": 6.18,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202341,
            15.965479
          ],
          [
            108.202847,
            15.965479
          ],
          [
            108.202847,
            15.965179
          ],
          [
            108.202341,
            15.965179
          ],
          [
            108.202341,
            15.965479
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0632",
    "properties": {
      "id": "sx-dx2526-0632",
      "stt": 632,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Lê Thị Thanh",
      "ho_san_xuat": "Nguyễn Mộng Hùng",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 515,
      "giong_cap_kg": 6.18,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202865,
            15.965498
          ],
          [
            108.203371,
            15.965498
          ],
          [
            108.203371,
            15.965198
          ],
          [
            108.202865,
            15.965198
          ],
          [
            108.202865,
            15.965498
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0633",
    "properties": {
      "id": "sx-dx2526-0633",
      "stt": 633,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Ngọc Bài",
      "ho_san_xuat": "Nguyễn Ngọc Sơn",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 350,
      "giong_cap_kg": 4.2,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.96535,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203409,
            15.965518
          ],
          [
            108.203916,
            15.965518
          ],
          [
            108.203916,
            15.965218
          ],
          [
            108.203409,
            15.965218
          ],
          [
            108.203409,
            15.965518
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0634",
    "properties": {
      "id": "sx-dx2526-0634",
      "stt": 634,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Phượng",
      "ho_san_xuat": "Nguyễn Phượng",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 1035,
      "giong_cap_kg": 12.42,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.19951,
            15.965196
          ],
          [
            108.200016,
            15.965196
          ],
          [
            108.200016,
            15.964896
          ],
          [
            108.19951,
            15.964896
          ],
          [
            108.19951,
            15.965196
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0635",
    "properties": {
      "id": "sx-dx2526-0635",
      "stt": 635,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Hường",
      "ho_san_xuat": "Nguyễn Hường",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 1000,
      "giong_cap_kg": 12,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200091,
            15.965193
          ],
          [
            108.200597,
            15.965193
          ],
          [
            108.200597,
            15.964893
          ],
          [
            108.200091,
            15.964893
          ],
          [
            108.200091,
            15.965193
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0636",
    "properties": {
      "id": "sx-dx2526-0636",
      "stt": 636,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Ngự",
      "ho_san_xuat": "Nguyễn Thị Hường",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 600,
      "giong_cap_kg": 7.2,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200615,
            15.965177
          ],
          [
            108.201121,
            15.965177
          ],
          [
            108.201121,
            15.964877
          ],
          [
            108.200615,
            15.964877
          ],
          [
            108.200615,
            15.965177
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0637",
    "properties": {
      "id": "sx-dx2526-0637",
      "stt": 637,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Sảy",
      "ho_san_xuat": "Nguyễn Hùng Sơn",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 650,
      "giong_cap_kg": 7.8,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201159,
            15.965156
          ],
          [
            108.201665,
            15.965156
          ],
          [
            108.201665,
            15.964856
          ],
          [
            108.201159,
            15.964856
          ],
          [
            108.201159,
            15.965156
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0638",
    "properties": {
      "id": "sx-dx2526-0638",
      "stt": 638,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Hùng Sơn",
      "ho_san_xuat": "Nguyễn Hùng Sơn",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 650,
      "giong_cap_kg": 7.8,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.20176,
            15.96514
          ],
          [
            108.202266,
            15.96514
          ],
          [
            108.202266,
            15.96484
          ],
          [
            108.20176,
            15.96484
          ],
          [
            108.20176,
            15.96514
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0639",
    "properties": {
      "id": "sx-dx2526-0639",
      "stt": 639,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Ngọc Bài",
      "ho_san_xuat": "Nguyễn Ngọc Sơn",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 1100,
      "giong_cap_kg": 13.2,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202341,
            15.965137
          ],
          [
            108.202847,
            15.965137
          ],
          [
            108.202847,
            15.964837
          ],
          [
            108.202341,
            15.964837
          ],
          [
            108.202341,
            15.965137
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0640",
    "properties": {
      "id": "sx-dx2526-0640",
      "stt": 640,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Phạm Phú Tế",
      "ho_san_xuat": "Nguyễn Minh",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 810,
      "giong_cap_kg": 9.72,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.203128
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202866,
            15.965149
          ],
          [
            108.203372,
            15.965149
          ],
          [
            108.203372,
            15.964849
          ],
          [
            108.202866,
            15.964849
          ],
          [
            108.202866,
            15.965149
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0641",
    "properties": {
      "id": "sx-dx2526-0641",
      "stt": 641,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Trung",
      "ho_san_xuat": "Đặng Ngọc Liên",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 725,
      "giong_cap_kg": 8.7,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.965017,
        108.203691
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.203409,
            15.965169
          ],
          [
            108.203915,
            15.965169
          ],
          [
            108.203915,
            15.964869
          ],
          [
            108.203409,
            15.964869
          ],
          [
            108.203409,
            15.965169
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0642",
    "properties": {
      "id": "sx-dx2526-0642",
      "stt": 642,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Huệ",
      "ho_san_xuat": "Nguyễn Văn Vinh",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 640,
      "giong_cap_kg": 7.68,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964683,
        108.199753
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.199509,
            15.964855
          ],
          [
            108.200015,
            15.964855
          ],
          [
            108.200015,
            15.964555
          ],
          [
            108.199509,
            15.964555
          ],
          [
            108.199509,
            15.964855
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0643",
    "properties": {
      "id": "sx-dx2526-0643",
      "stt": 643,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Huệ",
      "ho_san_xuat": "Nguyễn Văn Vinh",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 85,
      "giong_cap_kg": 1.02,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964683,
        108.200316
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200091,
            15.964863
          ],
          [
            108.200597,
            15.964863
          ],
          [
            108.200597,
            15.964563
          ],
          [
            108.200091,
            15.964563
          ],
          [
            108.200091,
            15.964863
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0644",
    "properties": {
      "id": "sx-dx2526-0644",
      "stt": 644,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Ngô Thị Thanh Thảo",
      "ho_san_xuat": "Ngô Thị Thanh Thảo",
      "la_chinh_chu": true,
      "giong_lua": "J02",
      "dien_tich_m2": 750,
      "giong_cap_kg": 9,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964683,
        108.200878
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.200616,
            15.964857
          ],
          [
            108.201123,
            15.964857
          ],
          [
            108.201123,
            15.964557
          ],
          [
            108.200616,
            15.964557
          ],
          [
            108.200616,
            15.964857
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0645",
    "properties": {
      "id": "sx-dx2526-0645",
      "stt": 645,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Đinh",
      "ho_san_xuat": "Nguyễn Thị Minh Hiếu",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964683,
        108.201441
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201159,
            15.964839
          ],
          [
            108.201665,
            15.964839
          ],
          [
            108.201665,
            15.964539
          ],
          [
            108.201159,
            15.964539
          ],
          [
            108.201159,
            15.964839
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0646",
    "properties": {
      "id": "sx-dx2526-0646",
      "stt": 646,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Châu",
      "chu_dat": "Nguyễn Thị Lan",
      "ho_san_xuat": "Nguyễn Châu",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 500,
      "giong_cap_kg": 6,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964683,
        108.202003
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.201758,
            15.964818
          ],
          [
            108.202265,
            15.964818
          ],
          [
            108.202265,
            15.964518
          ],
          [
            108.201758,
            15.964518
          ],
          [
            108.201758,
            15.964818
          ]
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "sx-dx2526-0647",
    "properties": {
      "id": "sx-dx2526-0647",
      "stt": 647,
      "xu_dong": "La Châu",
      "lo_thua_dat": "La Bông Tây",
      "chu_dat": "Nguyễn Thị Huynh",
      "ho_san_xuat": "Doãn Thùy",
      "la_chinh_chu": false,
      "giong_lua": "J02",
      "dien_tich_m2": 850,
      "giong_cap_kg": 10.2,
      "dot_phan_bo": "LaChau",
      "to_dan_cu": "Tổ 8",
      "ky_nhan": "Đã nhận giống",
      "center": [
        15.964683,
        108.202566
      ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            108.202341,
            15.964805
          ],
          [
            108.202848,
            15.964805
          ],
          [
            108.202848,
            15.964505
          ],
          [
            108.202341,
            15.964505
          ],
          [
            108.202341,
            15.964805
          ]
        ]
      ]
    }
  }
]
};

// Mạng Lưới Kênh Thủy Nông GeoJSON
export const CANALS_GEOJSON: { type: 'FeatureCollection'; features: CanalGeoFeature[] } = {
  type: 'FeatureCollection',
  features: [
  {
    "type": "Feature",
    "id": "canal-song-yen-main",
    "properties": {
      "id": "canal-song-yen-main",
      "ten_kenh": "Kênh Chính Đập Dâng Sông Yên",
      "loai": "kenh_chinh",
      "chieu_dai_m": 2450,
      "luu_luong_m3s": 5.5,
      "cap_nuoc": "Toàn bộ 5 Xứ Đồng",
      "color": "#0284c7",
      "width": 4
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          108.188,
          15.9685
        ],
        [
          108.192,
          15.966
        ],
        [
          108.196,
          15.964
        ],
        [
          108.2,
          15.962
        ],
        [
          108.204,
          15.96
        ],
        [
          108.207,
          15.958
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "canal-tram-bom-to9",
    "properties": {
      "id": "canal-tram-bom-to9",
      "ten_kenh": "Kênh N1 - Trạm Bơm An Trạch 1 ➔ Xứ Đồng Tổ 9",
      "loai": "kenh_nhanh",
      "chieu_dai_m": 1200,
      "luu_luong_m3s": 2.2,
      "cap_nuoc": "Xứ Đồng Tổ 9 (324 thửa)",
      "color": "#0ea5e9",
      "width": 3
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          108.192,
          15.966
        ],
        [
          108.1935,
          15.967
        ],
        [
          108.1965,
          15.9675
        ],
        [
          108.1985,
          15.9665
        ],
        [
          108.198,
          15.9635
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "canal-nhanh-ha-ra",
    "properties": {
      "id": "canal-nhanh-ha-ra",
      "ten_kenh": "Kênh N2 - Tiếp Nước Xứ Đồng Hà Ra",
      "loai": "kenh_nhanh",
      "chieu_dai_m": 980,
      "luu_luong_m3s": 1.8,
      "cap_nuoc": "Xứ Đồng Hà Ra (135 thửa)",
      "color": "#0ea5e9",
      "width": 3
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          108.192,
          15.966
        ],
        [
          108.1915,
          15.9625
        ],
        [
          108.1905,
          15.959
        ],
        [
          108.1935,
          15.9575
        ],
        [
          108.195,
          15.957
        ]
      ]
    }
  },
  {
    "type": "Feature",
    "id": "canal-nhanh-la-chau-go-oi",
    "properties": {
      "id": "canal-nhanh-la-chau-go-oi",
      "ten_kenh": "Kênh N3 - Kênh Liên Vùng La Châu - La Bông Tây - Gò Ổi",
      "loai": "kenh_nhanh",
      "chieu_dai_m": 1450,
      "luu_luong_m3s": 2,
      "cap_nuoc": "Xứ Đồng La Châu, La Bông Tây & Gò Ổi (188 thửa)",
      "color": "#0ea5e9",
      "width": 3
    },
    "geometry": {
      "type": "LineString",
      "coordinates": [
        [
          108.196,
          15.964
        ],
        [
          108.2005,
          15.9655
        ],
        [
          108.2035,
          15.966
        ],
        [
          108.203,
          15.962
        ],
        [
          108.2015,
          15.9585
        ]
      ]
    }
  }
]
};

// Điểm Công Trình Đầu Mối & Trạm Bơm
export const IRRIGATION_POINTS_GEOJSON: { type: 'FeatureCollection'; features: IrrigationPointFeature[] } = {
  type: 'FeatureCollection',
  features: [
  {
    "type": "Feature",
    "id": "pump-station-1",
    "properties": {
      "id": "pump-station-1",
      "ten_tram": "Trạm Bơm An Trạch 1",
      "loai": "tram_bom",
      "cong_suat": "2 máy x 2.500 m³/h",
      "trang_thai": "hoat_dong",
      "phu_trach": "Nguyễn Văn Hải (Tổ trưởng thủy nông)",
      "sdt": "0905 888 991"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        108.1885,
        15.9682
      ]
    }
  },
  {
    "type": "Feature",
    "id": "pump-station-2",
    "properties": {
      "id": "pump-station-2",
      "ten_tram": "Trạm Bơm An Trạch 2 (Tăng Áp)",
      "loai": "tram_bom",
      "cong_suat": "2 máy x 1.800 m³/h",
      "trang_thai": "hoat_dong",
      "phu_trach": "Trần Đình Trọng",
      "sdt": "0905 888 992"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        108.1962,
        15.9638
      ]
    }
  },
  {
    "type": "Feature",
    "id": "gate-dap-dang-song-yen",
    "properties": {
      "id": "gate-dap-dang-song-yen",
      "ten_tram": "Cống Đầu Mối Đập Dâng Sông Yên",
      "loai": "cong_xa",
      "cong_suat": "Khống chế mực nước dâng +2.5m",
      "trang_thai": "hoat_dong",
      "phu_trach": "Ban Quản Lý Thủy Nông Xã Hòa Tiến",
      "sdt": "0905 888 990"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        108.187,
        15.9695
      ]
    }
  }
]
};
