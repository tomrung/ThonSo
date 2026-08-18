const fs = require('fs');
const path = require('path');
const XLSX = require('c:/Antigravity20/DataThon/node_modules/xlsx');

const filePath = 'c:/Antigravity20/DataThon/DanhSachSanXuat-DX2526-AT.xlsx';
const wb = XLSX.readFile(filePath);

const records = [];
let idCounter = 1;

wb.SheetNames.forEach(sheetName => {
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const title = data[0] ? data[0][0] : '';
  
  let giong = 'HG12';
  if (title.includes('HG244') || sheetName.includes('HG244')) giong = 'HG244';
  else if (title.includes('J02') || sheetName.includes('LaChau')) giong = 'J02';

  for (let i = 4; i < data.length; i++) {
    const row = data[i];
    if (!row || !row[0] || String(row[0]).toLowerCase().includes('tổng') || String(row[0]).toLowerCase().includes('cộng')) continue;
    
    const chuDat = String(row[1] || '').trim();
    const hoSanXuat = String(row[2] || chuDat).trim();
    const xuDong = String(row[3] || (sheetName.includes('T9') ? 'Tổ 9' : (sheetName.includes('T10') ? 'Hà Ra' : (sheetName.includes('LaChau') ? 'La Châu' : 'Gò ổi')))).trim();
    const lo = String(row[4] || row[3] || 'Lô 1').trim();
    const dienTich = Number(row[5] || row[4]) || 0;
    const giongCap = Number(row[6] || (dienTich * 0.012)) || 0;
    const muaThem = Number(row[7]) || 0;
    const donGia = Number(row[8]) || (muaThem > 0 ? 18000 : 0);
    const thanhTien = Number(row[9]) || (muaThem * donGia);

    if (dienTich > 0 && chuDat) {
      let to = 'Tổ 1';
      if (xuDong === 'Tổ 9') {
        const loNum = parseInt(lo.replace(/\D/g, '')) || 1;
        to = 'Tổ ' + (((loNum - 1) % 4) + 1);
      } else if (xuDong === 'Hà Ra') {
        const loNum = parseInt(lo.replace(/\D/g, '')) || 20;
        to = 'Tổ ' + (((loNum - 20) % 3) + 5);
      } else if (xuDong === 'La Châu') {
        to = 'Tổ 8';
      } else if (xuDong === 'La Bông Tây') {
        to = 'Tổ 7';
      } else if (xuDong === 'Gò ổi') {
        to = 'Tổ 6';
      }

      const laChinhChu = (chuDat.toLowerCase() === hoSanXuat.toLowerCase()) || (hoSanXuat === '');

      records.push({
        id: 'sx-dx2526-' + String(idCounter).padStart(4, '0'),
        stt: idCounter,
        dot_phan_bo: sheetName,
        giong_lua: giong,
        xu_dong: xuDong,
        lo_thua_dat: lo,
        chu_dat: chuDat,
        ho_san_xuat: hoSanXuat || chuDat,
        la_chinh_chu: laChinhChu,
        dien_tich_m2: dienTich,
        giong_cap_kg: Number(giongCap.toFixed(2)),
        mua_them_kg: muaThem,
        don_gia: donGia,
        thanh_tien: thanhTien,
        ky_nhan: 'Đã nhận giống',
        to_dan_cu: to,
        trang_thai_canh_tac: 'chuan_bi_dat',
        ghi_chu: xuDong + ' - ' + lo
      });
      idCounter++;
    }
  }
});

const giongLuaMeta = [
  {
    ma_giong: 'HG12',
    ten_giong: 'Lúa thuần HG12',
    thoi_gian_sinh_truong: '105 - 115 ngày (Vụ Đông Xuân)',
    nang_suat_uoc_tinh: '65 - 72 tạ/ha',
    dinh_muc_giong_ha: '120 kg/ha (12 kg/1.000m²)',
    dac_tinh_noi_bat: 'Chịu rét tốt đầu vụ, đẻ nhánh khỏe, kháng đạo ôn và rầy nâu sinh học, hạt gạo trong, cơm dẻo đậm vị.',
    dien_tich_toan_thon: 205268,
    ty_trong_phan_tram: 46.8,
    mau_nhan_dien: '#10b981',
    xuat_xu: 'Viện Khoa học Nông nghiệp Duyên hải Nam Trung Bộ'
  },
  {
    ma_giong: 'HG244',
    ten_giong: 'Lúa thuần HG244',
    thoi_gian_sinh_truong: '110 - 120 ngày (Vụ Đông Xuân)',
    nang_suat_uoc_tinh: '70 - 78 tạ/ha',
    dinh_muc_giong_ha: '120 kg/ha (12 kg/1.000m²)',
    dac_tinh_noi_bat: 'Thân cứng chống đổ ngã cực tốt vùng trũng sông Yên, bông to nhiều hạt, chịu thâm canh phân chuồng vi sinh.',
    dien_tich_toan_thon: 189953,
    ty_trong_phan_tram: 43.3,
    mau_nhan_dien: '#f59e0b',
    xuat_xu: 'Trung tâm Giống Cây trồng Nông nghiệp Đà Nẵng'
  },
  {
    ma_giong: 'J02',
    ten_giong: 'Lúa Nhật Bản J02 (Đặc sản)',
    thoi_gian_sinh_truong: '125 - 135 ngày (Vụ Đông Xuân)',
    nang_suat_uoc_tinh: '60 - 68 tạ/ha (Giá trị thương phẩm gấp 1.8 lần)',
    dinh_muc_giong_ha: '120 kg/ha (12 kg/1.000m²)',
    dac_tinh_noi_bat: 'Giống lúa thuần nhập nội Nhật Bản, chất lượng gạo cao cấp (Japonica), cơm dẻo mềm, thơm dịu, bao tiêu xuất khẩu.',
    dien_tich_toan_thon: 43367,
    ty_trong_phan_tram: 9.9,
    mau_nhan_dien: '#8b5cf6',
    xuat_xu: 'Dự án Nông nghiệp Công nghệ cao Hòa Vang'
  }
];

const xuDongMeta = [
  {
    ma_xu_dong: 'to_9',
    ten_xu_dong: 'Xứ Đồng Tổ 9',
    vi_tri: 'Dọc hạ lưu sông Yên (Phía Đông Thôn An Trạch)',
    dien_tich_m2: 229839,
    so_thua: 324,
    cac_lo: 'Lô 1 đến Lô 19 (gồm Thớt 1, Thớt 2)',
    giong_chinh: 'HG12 & HG244',
    nguon_nuoc: 'Kênh chính Trạm bơm An Trạch 1',
    to_quan_ly: 'Tổ 1, Tổ 2, Tổ 3, Tổ 4',
    mau_sac: '#10b981'
  },
  {
    ma_xu_dong: 'ha_ra',
    ten_xu_dong: 'Xứ Đồng Hà Ra',
    vi_tri: 'Khu đồng trung tâm phía Tây Thôn An Trạch',
    dien_tich_m2: 100524,
    so_thua: 135,
    cac_lo: 'Lô 20 đến Lô 33, Lô Kẹp Ao, Vườn',
    giong_chinh: 'HG244',
    nguon_nuoc: 'Kênh N1 - Trạm bơm An Trạch 2',
    to_quan_ly: 'Tổ 5, Tổ 6, Tổ 7',
    mau_sac: '#f59e0b'
  },
  {
    ma_xu_dong: 'la_chau',
    ten_xu_dong: 'Xứ Đồng La Châu',
    vi_tri: 'Khu đồng chuyên canh hữu cơ giáp thôn La Châu',
    dien_tich_m2: 43367,
    so_thua: 70,
    cac_lo: 'Lô La Châu',
    giong_chinh: 'J02 (Nhật Bản)',
    nguon_nuoc: 'Kênh tưới tự chảy Đập dâng Sông Yên',
    to_quan_ly: 'Tổ 8',
    mau_sac: '#8b5cf6'
  },
  {
    ma_xu_dong: 'la_bong_tay',
    ten_xu_dong: 'Xứ Đồng La Bông Tây',
    vi_tri: 'Khu đồng giáp ranh thôn La Bông',
    dien_tich_m2: 36872,
    so_thua: 52,
    cac_lo: 'Lô LB Tây',
    giong_chinh: 'HG12',
    nguon_nuoc: 'Kênh liên thôn Hòa Tiến',
    to_quan_ly: 'Tổ 7',
    mau_sac: '#06b6d4'
  },
  {
    ma_xu_dong: 'go_oi',
    ten_xu_dong: 'Xứ Đồng Gò Ổi',
    vi_tri: 'Vùng gò cao phía Bắc Thôn An Trạch',
    dien_tich_m2: 27986,
    so_thua: 66,
    cac_lo: 'Lô Gò ổi, Lô Bà Thổ',
    giong_chinh: 'HG12',
    nguon_nuoc: 'Trạm bơm dã chiến Gò Ổi',
    to_quan_ly: 'Tổ 6',
    mau_sac: '#ec4899'
  }
];

const lichThoiVu = [
  {
    id: 'tv-01',
    giai_doan: 'Giai đoạn 1: Làm đất & Thau chua rửa mặn',
    thoi_gian: '05/12/2025 - 20/12/2025',
    noi_dung_cong_viec: 'Cày lật đất, bón vôi bột (25-30kg/sào), mở cống đập dâng sông Yên thau chua rửa phèn, bừa kỹ phẳng mặt ruộng.',
    khuyen_cao_ky_thuat: 'Mực nước duy trì 5-7cm, kiểm tra nồng độ mặn dưới 0.8‰ trước khi đưa nước vào ruộng.',
    can_bo_phu_trach: 'Ông Đặng Công - Trưởng Ban Nông Nghiệp HTX Hòa Tiến 2',
    trang_thai: 'hoan_thanh'
  },
  {
    id: 'tv-02',
    giai_doan: 'Giai đoạn 2: Phát lúa giống & Gieo sạ tập trung né rầy',
    thoi_gian: '25/12/2025 - 05/01/2026',
    noi_dung_cong_viec: 'HTX Hòa Tiến 2 bàn giao 5,26 tấn giống HG12, HG244, J02 cho 647 thửa. Ngâm ủ hạt giống nứt nanh và gieo sạ đồng loạt.',
    khuyen_cao_ky_thuat: 'Ngâm ủ đúng 24-30 giờ, xử lý hạt giống bằng thuốc sinh học Cruiser Plus phòng trừ bọ trĩ đầu vụ.',
    can_bo_phu_trach: 'Ông Nguyễn Quang Thơ - Phó Trưởng Ban Nông Nghiệp Thôn An Trạch',
    trang_thai: 'hoan_thanh'
  },
  {
    id: 'tv-03',
    giai_doan: 'Giai đoạn 3: Bón thúc đợt 1 & Tỉa dặm lúa',
    thoi_gian: '15/01/2026 - 28/01/2026',
    noi_dung_cong_viec: 'Bón thúc đợt 1 khi lúa 3.5 lá (Đạm Urê + Lân vi sinh), tỉa dặm hàng lúa đảm bảo mật độ 80-100 khóm/m².',
    khuyen_cao_ky_thuat: 'Giữ nước xăm xắp mặt ruộng 2-3cm, không để khô ruộng làm lúa đẹt còi cọc.',
    can_bo_phu_trach: 'Bà Hồ Thị Vân - Phụ trách Khuyến nông cơ sở',
    trang_thai: 'dang_thuc_hien'
  },
  {
    id: 'tv-04',
    giai_doan: 'Giai đoạn 4: Bón đón đòng & Phòng trừ sâu bệnh (IPM)',
    thoi_gian: '15/02/2026 - 05/03/2026',
    noi_dung_cong_viec: 'Bón đón đòng khi lúa thắt eo (Kaly Clorua + Vi lượng Bo), kiểm tra sâu cuốn lá nhỏ và đạo ôn cổ bông.',
    khuyen_cao_ky_thuat: 'Chỉ phun thuốc BVTV khi mật độ sâu vượt ngưỡng gây hại kinh tế, ưu tiên chế phẩm sinh học.',
    can_bo_phu_trach: 'Ông Phạm Trung - Cán bộ Thủy nông & BVTV',
    trang_thai: 'sap_toi'
  },
  {
    id: 'tv-05',
    giai_doan: 'Giai đoạn 5: Thu hoạch rộ & Đánh giá năng suất',
    thoi_gian: '10/04/2026 - 25/04/2026',
    noi_dung_cong_viec: 'Huy động máy gặt đập liên hợp thu hoạch toàn bộ 43,86 ha lúa. HTX thu mua và bao tiêu toàn bộ giống J02 và HG12.',
    khuyen_cao_ky_thuat: 'Thu hoạch khi 85-90% hạt chín vàng rơm để giảm thiểu thất thoát cơ giới.',
    can_bo_phu_trach: 'Đại diện BND Thôn An Trạch & Ban Giám đốc HTX Hòa Tiến 2',
    trang_thai: 'sap_toi'
  }
];

const fileContent = 'import { SanXuatRecord, GiongLuaMeta, LichThoiVuNongNghiep, XuDongMeta } from "../types";\n\n' +
  'export const SEED_GIONG_LUA: GiongLuaMeta[] = ' + JSON.stringify(giongLuaMeta, null, 2) + ';\n\n' +
  'export const SEED_XU_DONG: XuDongMeta[] = ' + JSON.stringify(xuDongMeta, null, 2) + ';\n\n' +
  'export const SEED_LICH_THOI_VU: LichThoiVuNongNghiep[] = ' + JSON.stringify(lichThoiVu, null, 2) + ';\n\n' +
  'export const SEED_SAN_XUAT: SanXuatRecord[] = ' + JSON.stringify(records, null, 2) + ';\n';

fs.writeFileSync('c:/Antigravity20/DataThon/src/data/sanXuatData.ts', fileContent, 'utf8');
console.log('Successfully wrote sanXuatData.ts with all ' + records.length + ' records and SEED_XU_DONG!');
