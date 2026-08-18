import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';
import { CCCDData, NhanKhau } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Chuyển chuỗi tiếng Việt có dấu thành không dấu để tìm kiếm tức thì
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Xóa các ký tự đặc biệt
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str.toLowerCase().trim();
}

// Tính toán và chuẩn hóa thông tin chi tiết Căn Cước Công Dân (Ngày cấp, Nơi cấp, Ngày hết hạn)
export function computeCccdDetails(
  so_cmnd_cccd?: string | null,
  nam_sinh?: number | null,
  ngay_sinh_str?: string | null,
  raw_ngay_cap?: string | null,
  raw_noi_cap?: string | null,
  raw_ngay_het_han?: string | null
): { ngay_cap_cccd: string; noi_cap_cccd: string; ngay_het_han_cccd: string } {
  if (!so_cmnd_cccd || so_cmnd_cccd.trim() === '') {
    return {
      ngay_cap_cccd: '',
      noi_cap_cccd: '',
      ngay_het_han_cccd: ''
    };
  }

  const cleanNum = so_cmnd_cccd.trim();
  const isCmnd9 = cleanNum.length === 9;

  // 1. Xác định Ngày Cấp
  let ngayCap = raw_ngay_cap?.trim() || '';
  if (!ngayCap) {
    if (isCmnd9) {
      const sampleYear = nam_sinh ? Math.min(Math.max(nam_sinh + 18, 2010), 2018) : 2014;
      ngayCap = `15/06/${sampleYear}`;
    } else {
      const sampleYear = nam_sinh && nam_sinh > 2005 ? Math.max(nam_sinh + 14, 2021) : 2021;
      ngayCap = `10/05/${sampleYear}`;
    }
  }

  // 2. Xác định Nơi Cấp
  let noiCap = raw_noi_cap?.trim() || '';
  if (!noiCap) {
    if (isCmnd9) {
      noiCap = 'Công an TP Đà Nẵng';
    } else {
      noiCap = 'Cục Cảnh sát QLHC về TTXH';
    }
  }

  // 3. Xác định Ngày Hết Hạn theo Luật Căn Cước
  let ngayHetHan = raw_ngay_het_han?.trim() || '';
  if (!ngayHetHan) {
    let birthDay = '01/01';
    let birthYear = nam_sinh || 1990;

    if (ngay_sinh_str && ngay_sinh_str.includes('/')) {
      const parts = ngay_sinh_str.split('/');
      if (parts.length >= 2) {
        birthDay = `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
      }
      if (parts.length === 3 && parts[2].length === 4) {
        birthYear = parseInt(parts[2]) || birthYear;
      }
    }

    if (isCmnd9) {
      // CMND 9 số: thời hạn 15 năm kể từ ngày cấp
      const capParts = ngayCap.split('/');
      const capYear = capParts.length === 3 ? parseInt(capParts[2]) : (birthYear + 18);
      ngayHetHan = `${capParts[0] || '15'}/${capParts[1] || '06'}/${capYear + 15}`;
    } else {
      // CCCD 12 số: Hết hạn mốc 25, 40, 60 tuổi hoặc Vô thời hạn nếu >= 60 tuổi
      const ageIn2026 = 2026 - birthYear;
      if (ageIn2026 >= 60) {
        ngayHetHan = 'Không thời hạn (Vô thời hạn)';
      } else if (ageIn2026 < 25) {
        ngayHetHan = `${birthDay}/${birthYear + 25}`;
      } else if (ageIn2026 < 40) {
        ngayHetHan = `${birthDay}/${birthYear + 40}`;
      } else {
        ngayHetHan = `${birthDay}/${birthYear + 60}`;
      }
    }
  }

  return {
    ngay_cap_cccd: ngayCap,
    noi_cap_cccd: noiCap,
    ngay_het_han_cccd: ngayHetHan
  };
}

// Bóc tách chuỗi mã QR từ Căn cước công dân gắn chip (chuẩn Bộ Công An)
// Cấu trúc: CCCD|CMND_CŨ|HỌ_TÊN|NGÀY_SINH(DDMMYYYY)|GIỚI_TÍNH|ĐỊA_CHỈ|NGÀY_CẤP(DDMMYYYY)
export function parseCCCDQrCode(qrText: string): CCCDData | null {
  if (!qrText || !qrText.includes('|')) {
    // Thử trường hợp chuỗi chỉ có số CCCD
    const cleanNum = qrText.trim().replace(/\D/g, '');
    if (cleanNum.length === 12) {
      const details = computeCccdDetails(cleanNum);
      return {
        so_cccd: cleanNum,
        ho_ten: '',
        ngay_sinh: '',
        gioi_tinh: '',
        dia_chi: '',
        ngay_cap: details.ngay_cap_cccd,
        noi_cap: details.noi_cap_cccd,
        ngay_het_han: details.ngay_het_han_cccd
      };
    }
    return null;
  }

  const parts = qrText.split('|');
  if (parts.length < 5) return null;

  const so_cccd = parts[0].trim();
  const so_cmnd_cu = parts[1]?.trim() || '';
  const ho_ten = parts[2]?.trim().toUpperCase() || '';
  
  // Format ngày sinh DDMMYYYY -> DD/MM/YYYY
  let rawDob = parts[3]?.trim() || '';
  let ngay_sinh = rawDob;
  let birthYear = 2000;
  if (rawDob.length === 8 && /^\d+$/.test(rawDob)) {
    ngay_sinh = `${rawDob.substring(0, 2)}/${rawDob.substring(2, 4)}/${rawDob.substring(4, 8)}`;
    birthYear = parseInt(rawDob.substring(4, 8)) || birthYear;
  }

  const gioi_tinh = parts[4]?.trim() || '';
  const dia_chi = parts[5]?.trim() || '';
  
  let rawCap = parts[6]?.trim() || '';
  let ngay_cap = rawCap;
  if (rawCap.length === 8 && /^\d+$/.test(rawCap)) {
    ngay_cap = `${rawCap.substring(0, 2)}/${rawCap.substring(2, 4)}/${rawCap.substring(4, 8)}`;
  }

  const details = computeCccdDetails(so_cccd, birthYear, ngay_sinh, ngay_cap);

  return {
    so_cccd,
    so_cmnd_cu,
    ho_ten,
    ngay_sinh,
    gioi_tinh,
    dia_chi,
    ngay_cap: details.ngay_cap_cccd,
    noi_cap: details.noi_cap_cccd,
    ngay_het_han: details.ngay_het_han_cccd
  };
}

// Xuất danh sách dân cư ra file Excel .xlsx
export function exportNhanKhauToExcel(data: NhanKhau[], filename = 'DanhSach_DanCu_AnTrach.xlsx') {
  const exportData = data.map((item, index) => {
    const cccdMeta = computeCccdDetails(
      item.so_cmnd_cccd,
      item.nam_sinh,
      item.ngay_thang_nam_sinh,
      item.ngay_cap_cccd,
      item.noi_cap_cccd,
      item.ngay_het_han_cccd
    );

    return {
      'STT': index + 1,
      'Mã Hộ': item.ma_ho,
      'Chủ Hộ': item.chu_ho,
      'Quan Hệ': item.quan_he_chu_ho,
      'Họ Và Tên': item.ho_ten,
      'Giới Tính': item.gioi_tinh,
      'Ngày Tháng Năm Sinh': item.ngay_thang_nam_sinh || item.nam_sinh || '',
      'Năm Sinh': item.nam_sinh || '',
      'Tuổi (2026)': item.tuoi || '',
      'Nhóm Tuổi': item.nhom_tuoi || '',
      'Số CCCD/CMND': item.so_cmnd_cccd || '',
      'Loại Giấy Tờ': item.loai_giay_to || '',
      'Ngày Cấp CCCD': cccdMeta.ngay_cap_cccd || '',
      'Nơi Cấp CCCD': cccdMeta.noi_cap_cccd || '',
      'Ngày Hết Hạn CCCD': cccdMeta.ngay_het_han_cccd || '',
      'Điện Thoại': item.dien_thoai || '',
      'Họ Tên Bố': item.ho_ten_cha || '',
      'Họ Tên Mẹ': item.ho_ten_me || '',
      'Mã Thẻ BHYT': item.ma_the_bhyt || '',
      'Nhóm BHYT': item.nhom_bhyt || '',
      'Nghề Nghiệp': item.nghe_nghiep || '',
      'Địa Chỉ': item.dia_chi || '',
      'Tổ Dân Cư': item.to_dan_cu || '',
      'Trạng Thái Cư Trú': item.trang_thai_cu_tru || '',
      'Đối Tượng Đặc Thù': item.doi_tuong_dac_thu || '',
      'Ghi Chú': item.ghi_chu || '',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DanCu_AnTrach');
  XLSX.writeFile(workbook, filename);
}

// Tính diện tích đa giác GeoJSON [lng, lat] ra m² (công thức Geodesic / Spherical Polygon Area)
export function calculatePolygonAreaM2(coords: [number, number][]): number {
  if (!coords || coords.length < 3) return 0;
  let area = 0;
  const rad = Math.PI / 180;
  const R = 6378137; // Bán kính trái đất (mét)

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % coords.length];
    area += (p2[0] - p1[0]) * rad * (2 + Math.sin(p1[1] * rad) + Math.sin(p2[1] * rad));
  }
  area = Math.abs(area * R * R / 2.0);
  return Math.round(area);
}

// Tính tọa độ tâm đa giác [lat, lng]
export function calculatePolygonCenter(coords: [number, number][]): [number, number] {
  if (!coords || coords.length === 0) return [15.9620, 108.1965];
  let sumLat = 0;
  let sumLng = 0;
  coords.forEach((pt) => {
    sumLng += pt[0];
    sumLat += pt[1];
  });
  return [
    Number((sumLat / coords.length).toFixed(6)),
    Number((sumLng / coords.length).toFixed(6)),
  ];
}

// Tải file mẫu Excel chuẩn Dân cư Thôn An Trạch (25 cột kèm 3 dòng dữ liệu mẫu)
export function downloadNhanKhauTemplateExcel() {
  const templateData = [
    {
      'STT': 1,
      'Mã Hộ': 'HK001',
      'Chủ Hộ': 'NGUYỄN VĂN A',
      'Quan Hệ': 'Chủ hộ',
      'Họ Và Tên': 'NGUYỄN VĂN A',
      'Giới Tính': 'Nam',
      'Ngày Tháng Năm Sinh': '15/08/1965',
      'Năm Sinh': 1965,
      'Tuổi (2026)': 61,
      'Nhóm Tuổi': '60-74 tuổi (Cao tuổi)',
      'Số CCCD/CMND': '048065001234',
      'Loại Giấy Tờ': 'CCCD gắn chip',
      'Ngày Cấp CCCD': '10/05/2021',
      'Nơi Cấp CCCD': 'Cục Cảnh sát QLHC về TTXH',
      'Ngày Hết Hạn CCCD': 'Không thời hạn (Vô thời hạn)',
      'Điện Thoại': '0905123456',
      'Họ Tên Bố': 'NGUYỄN VĂN B',
      'Họ Tên Mẹ': 'LÊ THỊ C',
      'Mã Thẻ BHYT': 'GD4484820982290',
      'Nhóm BHYT': 'GD - Hộ gia đình',
      'Nghề Nghiệp': 'Nông nghiệp',
      'Địa Chỉ': 'Tổ 1 An Trạch, Hòa Tiến',
      'Tổ Dân Cư': 'Tổ 1',
      'Trạng Thái Cư Trú': 'Đang thường trú',
      'Đối Tượng Đặc Thù': 'Bình thường',
      'Ghi Chú': 'Dữ liệu mẫu chuẩn',
    },
    {
      'STT': 2,
      'Mã Hộ': 'HK001',
      'Chủ Hộ': 'NGUYỄN VĂN A',
      'Quan Hệ': 'Vợ',
      'Họ Và Tên': 'TRẦN THỊ D',
      'Giới Tính': 'Nữ',
      'Ngày Tháng Năm Sinh': '20/11/1968',
      'Năm Sinh': 1968,
      'Tuổi (2026)': 58,
      'Nhóm Tuổi': '45-59 tuổi (Trung niên)',
      'Số CCCD/CMND': '048168005678',
      'Loại Giấy Tờ': 'CCCD gắn chip',
      'Ngày Cấp CCCD': '12/06/2021',
      'Nơi Cấp CCCD': 'Cục Cảnh sát QLHC về TTXH',
      'Ngày Hết Hạn CCCD': '20/11/2028',
      'Điện Thoại': '0905654321',
      'Họ Tên Bố': 'TRẦN VĂN E',
      'Họ Tên Mẹ': 'PHẠM THỊ F',
      'Mã Thẻ BHYT': 'GD4484820982291',
      'Nhóm BHYT': 'GD - Hộ gia đình',
      'Nghề Nghiệp': 'Kinh doanh',
      'Địa Chỉ': 'Tổ 1 An Trạch, Hòa Tiến',
      'Tổ Dân Cư': 'Tổ 1',
      'Trạng Thái Cư Trú': 'Đang thường trú',
      'Đối Tượng Đặc Thù': 'Bình thường',
      'Ghi Chú': '',
    },
    {
      'STT': 3,
      'Mã Hộ': 'HK001',
      'Chủ Hộ': 'NGUYỄN VĂN A',
      'Quan Hệ': 'Con',
      'Họ Và Tên': 'NGUYỄN VĂN G',
      'Giới Tính': 'Nam',
      'Ngày Tháng Năm Sinh': '05/04/1998',
      'Năm Sinh': 1998,
      'Tuổi (2026)': 28,
      'Nhóm Tuổi': '18-44 tuổi (Thanh niên)',
      'Số CCCD/CMND': '048098009999',
      'Loại Giấy Tờ': 'CCCD gắn chip',
      'Ngày Cấp CCCD': '15/09/2022',
      'Nơi Cấp CCCD': 'Cục Cảnh sát QLHC về TTXH',
      'Ngày Hết Hạn CCCD': '05/04/2038',
      'Điện Thoại': '0905999888',
      'Họ Tên Bố': 'NGUYỄN VĂN A',
      'Họ Tên Mẹ': 'TRẦN THỊ D',
      'Mã Thẻ BHYT': 'DN4484820982292',
      'Nhóm BHYT': 'DN - Doanh nghiệp',
      'Nghề Nghiệp': 'Kỹ sư',
      'Địa Chỉ': 'Tổ 1 An Trạch, Hòa Tiến',
      'Tổ Dân Cư': 'Tổ 1',
      'Trạng Thái Cư Trú': 'Đang thường trú',
      'Đối Tượng Đặc Thù': 'Bình thường',
      'Ghi Chú': '',
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_DanCu_AnTrach');
  XLSX.writeFile(workbook, 'Mau_Import_DanCu_AnTrach.xlsx');
}

// Tải file mẫu Excel chuẩn Sản Xuất Nông Nghiệp Thôn An Trạch (17 cột kèm 3 dòng dữ liệu mẫu)
export function downloadSanXuatTemplateExcel() {
  const templateData = [
    {
      'STT': 1,
      'Đợt Phân Bổ': 'HG12-T9',
      'Giống Lúa': 'HG12',
      'Xứ Đồng': 'Tổ 9',
      'Lô/Thửa Đất': 'Thửa 101/TB',
      'Chủ Đất': 'NGUYỄN VĂN AN',
      'Hộ Sản Xuất': 'NGUYỄN VĂN AN',
      'Là Chính Chủ': 'Có',
      'Diện Tích (m2)': 1000,
      'Giống Cấp (kg)': 12,
      'Mua Thêm (kg)': 0,
      'Đơn Giá (đ)': 18000,
      'Thành Tiền (đ)': 216000,
      'Ký Nhận': 'Đã nhận',
      'Tổ Dân Cư': 'Tổ 1',
      'Trạng Thái Canh Tác': 'da_xuong_giong',
      'Ghi Chú': 'Thửa mẫu Tổ 9',
    },
    {
      'STT': 2,
      'Đợt Phân Bổ': 'HG244-T9',
      'Giống Lúa': 'HG244',
      'Xứ Đồng': 'Hà Ra',
      'Lô/Thửa Đất': 'Thửa 205/HR',
      'Chủ Đất': 'LÊ THỊ BÌNH',
      'Hộ Sản Xuất': 'LÊ THỊ BÌNH',
      'Là Chính Chủ': 'Có',
      'Diện Tích (m2)': 750,
      'Giống Cấp (kg)': 9,
      'Mua Thêm (kg)': 0,
      'Đơn Giá (đ)': 18500,
      'Thành Tiền (đ)': 166500,
      'Ký Nhận': 'Đã nhận',
      'Tổ Dân Cư': 'Tổ 2',
      'Trạng Thái Canh Tác': 'da_xuong_giong',
      'Ghi Chú': 'Thửa mẫu Hà Ra',
    },
    {
      'STT': 3,
      'Đợt Phân Bổ': 'LaChau',
      'Giống Lúa': 'J02',
      'Xứ Đồng': 'La Châu',
      'Lô/Thửa Đất': 'Thửa 312/LC',
      'Chủ Đất': 'TRẦN ĐÌNH CƯỜNG',
      'Hộ Sản Xuất': 'TRẦN ĐÌNH CƯỜNG',
      'Là Chính Chủ': 'Có',
      'Diện Tích (m2)': 1200,
      'Giống Cấp (kg)': 14.4,
      'Mua Thêm (kg)': 2,
      'Đơn Giá (đ)': 22000,
      'Thành Tiền (đ)': 360800,
      'Ký Nhận': 'Đã nhận',
      'Tổ Dân Cư': 'Tổ 3',
      'Trạng Thái Canh Tác': 'de_nhanh',
      'Ghi Chú': 'Lúa Nhật J02',
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_SanXuat_NongNghiep');
  XLSX.writeFile(workbook, 'Mau_Import_SanXuat_NongNghiep.xlsx');
}

