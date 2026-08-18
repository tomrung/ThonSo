import React, { useState, useRef, useMemo } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Layers, 
  Wheat, 
  Search, 
  Check, 
  RotateCcw, 
  ShieldAlert, 
  Trash2, 
  FileCheck,
  Eye,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { SanXuatRecord } from '../types';
import { downloadSanXuatTemplateExcel } from '../lib/utils';

interface SanXuatExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SanXuatExcelModal: React.FC<SanXuatExcelModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    sanXuatList, 
    importSanXuatExcel, 
    resetSanXuatToSeed, 
    clearAllSanXuat,
  } = useData();

  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'database' | 'supabase'>('import');

  // Import State
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [parsedRecords, setParsedRecords] = useState<SanXuatRecord[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewSearch, setPreviewSearch] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export State
  const [exportFilterXuDong, setExportFilterXuDong] = useState<string>('ALL');
  const [exportFilterGiong, setExportFilterGiong] = useState<string>('ALL');

  // Clear confirm states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filtered Preview Records (Must be declared before any conditional return!)
  const filteredPreview = useMemo(() => {
    if (!previewSearch) return parsedRecords;
    const q = previewSearch.toLowerCase().trim();
    return (parsedRecords || []).filter((r) =>
      String(r?.chu_dat || '').toLowerCase().includes(q) ||
      String(r?.ho_san_xuat || '').toLowerCase().includes(q) ||
      String(r?.lo_thua_dat || '').toLowerCase().includes(q) ||
      String(r?.xu_dong || '').toLowerCase().includes(q)
    );
  }, [parsedRecords, previewSearch]);

  // Helper matching synonyms in excel rows
  const findValue = (row: any, keys: string[]): any => {
    for (const key of Object.keys(row)) {
      const cleanKey = key.toLowerCase().trim();
      for (const target of keys) {
        if (cleanKey === target.toLowerCase().trim()) {
          return row[key];
        }
      }
    }
    return undefined;
  };

  // Universal Robust Excel Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setIsProcessing(true);
    setStatusMessage(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });

        const importedList: SanXuatRecord[] = [];
        let globalCounter = 1;

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const jsonRows = XLSX.utils.sheet_to_json(ws) as any[];

          // 1. Try Structured Object Array first
          if (jsonRows && jsonRows.length > 0) {
            jsonRows.forEach((row, idx) => {
              const chuDatRaw = findValue(row, ['chủ đất', 'chủ ruộng', 'họ tên chủ đất', 'người đứng tên', 'chủ hộ', 'chủ sử dụng', 'họ và tên', 'họ tên', 'chudat', 'hoten']);
              const chuDat = String(chuDatRaw || '').trim();
              if (!chuDat) return;

              const hoSanXuatRaw = findValue(row, ['hộ sản xuất', 'hộ canh tác', 'người cấy', 'người sản xuất', 'người làm', 'hộ nhận', 'hosanxuat']);
              const hoSanXuat = String(hoSanXuatRaw || chuDat).trim();

              const xuDongRaw = findValue(row, ['xứ đồng', 'vùng', 'khu vực', 'xứ đồng canh tác', 'xudong']);
              let xuDong = String(xuDongRaw || '').trim();
              if (!xuDong) {
                if (sheetName.includes('T9')) xuDong = 'Tổ 9';
                else if (sheetName.includes('T10') || sheetName.includes('HR')) xuDong = 'Hà Ra';
                else if (sheetName.includes('LaChau') || sheetName.includes('LC')) xuDong = 'La Châu';
                else if (sheetName.includes('LBT')) xuDong = 'La Bông Tây';
                else if (sheetName.includes('GO') || sheetName.includes('Gò')) xuDong = 'Gò ổi';
                else xuDong = 'Tổ 9';
              }

              const loRaw = findValue(row, ['lô/thửa đất', 'thửa đất', 'lô', 'thửa', 'số thửa', 'lô thửa', 'lothuadat']);
              const lo = String(loRaw || `Thửa ${idx + 1}`).trim();

              const dienTichRaw = findValue(row, ['diện tích (m2)', 'diện tích', 'diện tích m2', 'm2', 'm²', 'dientich']);
              const dienTich = Number(dienTichRaw) || 500;
              if (dienTich <= 0) return;

              const giongRaw = findValue(row, ['giống lúa', 'giống', 'loại giống', 'gionglua']);
              let giong = String(giongRaw || '').trim();
              if (!giong) {
                if (sheetName.includes('HG244')) giong = 'HG244';
                else if (sheetName.includes('J02')) giong = 'J02';
                else giong = 'HG12';
              }

              const dotRaw = findValue(row, ['đợt phân bổ', 'đợt', 'dotphanbo']);
              const dot = String(dotRaw || sheetName || `${giong}-${xuDong}`).trim();

              const giongCapRaw = findValue(row, ['giống cấp (kg)', 'giống cấp', 'lượng giống', 'giongcap']);
              const giongCap = Number(giongCapRaw) || Number((dienTich * 0.012).toFixed(2));

              const muaThemRaw = findValue(row, ['mua thêm (kg)', 'mua thêm', 'muathem']);
              const muaThem = Number(muaThemRaw) || 0;

              const donGiaRaw = findValue(row, ['đơn giá (đ)', 'đơn giá', 'dongia']);
              const donGia = Number(donGiaRaw) || (muaThem > 0 ? 18000 : 0);

              const thanhTienRaw = findValue(row, ['thành tiền (đ)', 'thành tiền', 'thanhtien']);
              const thanhTien = Number(thanhTienRaw) || (muaThem * donGia);

              const toRaw = findValue(row, ['tổ dân cư', 'tổ', 'todancu']);
              let to = String(toRaw || '').trim();
              if (!to) {
                if (xuDong.includes('9')) to = 'Tổ 1';
                else if (xuDong.includes('Hà Ra')) to = 'Tổ 5';
                else if (xuDong.includes('La Châu')) to = 'Tổ 8';
                else if (xuDong.includes('La Bông')) to = 'Tổ 7';
                else if (xuDong.includes('Gò')) to = 'Tổ 6';
                else to = 'Tổ 1';
              }

              const kyNhanRaw = findValue(row, ['ký nhận', 'ký nhận htx', 'kynhan']);
              const kyNhan = String(kyNhanRaw || 'Đã nhận giống').trim();

              const ghiChuRaw = findValue(row, ['ghi chú', 'ghichu', 'note']);
              const ghiChu = String(ghiChuRaw || `Import từ ${file.name}`).trim();

              const laChinhChuRaw = findValue(row, ['là chính chủ', 'chính chủ', 'lachinhchu']);
              let laChinhChu = true;
              if (laChinhChuRaw !== undefined) {
                laChinhChu = !String(laChinhChuRaw).toLowerCase().includes('không');
              } else {
                laChinhChu = chuDat.toLowerCase() === hoSanXuat.toLowerCase();
              }

              importedList.push({
                id: `sx-imp-${Date.now()}-${globalCounter}`,
                stt: globalCounter,
                dot_phan_bo: dot,
                giong_lua: giong,
                xu_dong: xuDong,
                lo_thua_dat: lo,
                chu_dat: chuDat,
                ho_san_xuat: hoSanXuat,
                la_chinh_chu: laChinhChu,
                dien_tich_m2: dienTich,
                giong_cap_kg: Number(giongCap.toFixed(2)),
                mua_them_kg: muaThem,
                don_gia: donGia,
                thanh_tien: thanhTien,
                ky_nhan: kyNhan,
                to_dan_cu: to,
                trang_thai_canh_tac: 'da_xuong_giong',
                ghi_chu: ghiChu,
              });
              globalCounter++;
            });
          }

          // 2. Fallback: Parse 2D array if Object mode yielded 0 items
          if (importedList.length === 0) {
            const rawArray = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
            if (rawArray && rawArray.length >= 3) {
              let startRow = 3;
              for (let r = 0; r < Math.min(8, rawArray.length); r++) {
                const rowStr = JSON.stringify(rawArray[r] || '').toLowerCase();
                if (rowStr.includes('chủ đất') || rowStr.includes('diện tích')) {
                  startRow = r + 1;
                  break;
                }
              }

              for (let i = startRow; i < rawArray.length; i++) {
                const row = rawArray[i];
                if (!row || row.length === 0) continue;
                const firstCell = String(row[0] || '').toLowerCase();
                if (firstCell.includes('tổng') || firstCell.includes('cộng') || firstCell.includes('đại diện')) continue;

                const chuDat = String(row[1] || row[0] || '').trim();
                if (!chuDat) continue;

                const hoSanXuat = String(row[2] || chuDat).trim();
                const xuDong = String(row[3] || 'Tổ 9').trim();
                const lo = String(row[4] || row[3] || `Thửa ${i}`).trim();
                const dienTich = Number(row[5] || row[4] || 500) || 500;
                const giongCap = Number(row[6]) || Number((dienTich * 0.012).toFixed(2));

                importedList.push({
                  id: `sx-imp-${Date.now()}-${globalCounter}`,
                  stt: globalCounter,
                  dot_phan_bo: sheetName,
                  giong_lua: 'HG12',
                  xu_dong: xuDong,
                  lo_thua_dat: lo,
                  chu_dat: chuDat,
                  ho_san_xuat: hoSanXuat,
                  la_chinh_chu: chuDat.toLowerCase() === hoSanXuat.toLowerCase(),
                  dien_tich_m2: dienTich,
                  giong_cap_kg: Number(giongCap.toFixed(2)),
                  mua_them_kg: 0,
                  don_gia: 18000,
                  thanh_tien: 0,
                  ky_nhan: 'Đã nhận giống',
                  to_dan_cu: 'Tổ 1',
                  trang_thai_canh_tac: 'da_xuong_giong',
                  ghi_chu: `Import từ ${file.name} [${sheetName}]`,
                });
                globalCounter++;
              }
            }
          }
        });

        if (importedList.length > 0) {
          setParsedRecords(importedList);
          setStatusMessage(`Đã đọc thành công ${importedList.length} thửa ruộng từ file Excel.`);
        } else {
          setStatusMessage('Không tìm thấy dữ liệu thửa đất hợp lệ trong file Excel. Vui lòng kiểm tra lại cấu trúc file!');
        }
      } catch (error: any) {
        console.error('Error parsing excel:', error);
        setStatusMessage(`Lỗi đọc file: ${error.message || 'File Excel bị lỗi định dạng'}`);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Confirm Import into State & Context
  const handleConfirmImport = () => {
    if (parsedRecords.length === 0) return;

    if (importMode === 'replace') {
      importSanXuatExcel(parsedRecords);
    } else {
      const merged = [...sanXuatList, ...parsedRecords];
      importSanXuatExcel(merged);
    }

    setStatusMessage(`Đã nạp thành công ${parsedRecords.length} thửa sản xuất vào cơ sở dữ liệu!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Handle Export with Filter
  const handleExportData = () => {
    let filtered = sanXuatList;
    if (exportFilterXuDong !== 'ALL') {
      filtered = filtered.filter((r) => r.xu_dong === exportFilterXuDong);
    }
    if (exportFilterGiong !== 'ALL') {
      filtered = filtered.filter((r) => r.giong_lua === exportFilterGiong);
    }

    const rows = filtered.map((r, idx) => ({
      'STT': idx + 1,
      'Đợt Phân Bổ': r.dot_phan_bo,
      'Giống Lúa': r.giong_lua,
      'Xứ Đồng': r.xu_dong || 'Tổ 9',
      'Lô/Thửa Đất': r.lo_thua_dat,
      'Chủ Đất': r.chu_dat,
      'Hộ Sản Xuất': r.ho_san_xuat,
      'Là Chính Chủ': r.la_chinh_chu !== false ? 'Có' : 'Không (Thuê/Mượn)',
      'Diện Tích (m2)': r.dien_tich_m2,
      'Giống Cấp (kg)': r.giong_cap_kg,
      'Mua Thêm (kg)': r.mua_them_kg || 0,
      'Đơn Giá (đ)': r.don_gia || 0,
      'Thành Tiền (đ)': r.thanh_tien || 0,
      'Ký Nhận': r.ky_nhan || 'Đã nhận giống',
      'Tổ Dân Cư': r.to_dan_cu || 'Tổ 1',
      'Trạng Thái Canh Tác': r.trang_thai_canh_tac || 'da_xuong_giong',
      'Ghi Chú': r.ghi_chu || '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SoBo_SanXuat_Export');
    XLSX.writeFile(wb, `SoBo_SanXuat_NongNghiep_${exportFilterXuDong}_${exportFilterGiong}.xlsx`);
  };

  const handleExecuteClear = () => {
    if (confirmInput.trim().toUpperCase() !== 'XÓA NÔNG NGHIỆP') {
      alert('Vui lòng gõ chính xác cụm từ "XÓA NÔNG NGHIỆP" để xác nhận!');
      return;
    }
    clearAllSanXuat();
    setShowClearConfirm(false);
    setConfirmInput('');
    setStatusMessage('Đã xóa sạch toàn bộ cơ sở dữ liệu Nông nghiệp!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Quản Trị Cơ Sở Dữ Liệu & Excel Sổ Bộ Sản Xuất Nông Nghiệp
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Vụ Đông Xuân 2025 - 2026 • 5 Xứ Đồng (647 Thửa) • Tải mẫu, Nạp Excel & Quản trị CSDL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-white border-b border-slate-200 flex items-center gap-2 text-xs">
          <button
            onClick={() => { setActiveTab('import'); setStatusMessage(null); }}
            className={`pb-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-800 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Nạp / Import Excel</span>
            {parsedRecords.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold">
                {parsedRecords.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('export'); setStatusMessage(null); }}
            className={`pb-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-800 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Xuất Master Excel</span>
          </button>

          <button
            onClick={() => { setActiveTab('database'); setStatusMessage(null); }}
            className={`pb-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'database'
                ? 'border-rose-600 text-rose-800 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Quản Trị CSDL & Xóa</span>
          </button>

          <button
            onClick={() => { setActiveTab('supabase'); setStatusMessage(null); }}
            className={`pb-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'supabase'
                ? 'border-sky-600 text-sky-800 font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>CSDL Supabase</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1 max-h-[calc(92vh-160px)]">
          
          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
              statusMessage.includes('Lỗi') || statusMessage.includes('Không tìm thấy')
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {statusMessage.includes('Lỗi') || statusMessage.includes('Không tìm thấy') ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Check className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage}</span>
            </div>
          )}

          {/* TAB 1: IMPORT EXCEL */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              
              {/* Step 1: Download Template */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Mẫu File Excel Chuẩn Sản Xuất Nông Nghiệp</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tải file mẫu có sẵn cấu trúc 17 cột (Đợt phân bổ, Giống lúa, Xứ đồng, Thửa đất, Diện tích...) & dữ liệu mẫu 5 xứ đồng.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadSanXuatTemplateExcel}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-emerald-700 border border-emerald-300 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Mẫu Nông Nghiệp (.xlsx)</span>
                </button>
              </div>

              {/* Step 2: Dropzone */}
              <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-3xl p-6 text-center space-y-3 bg-emerald-50/30 transition-all">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {importFileName ? `Đã chọn: ${importFileName}` : 'Chọn hoặc Kéo thả File Excel Danh Sách Sản Xuất'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Hỗ trợ cả file mẫu chuẩn 1 sheet lẫn file Master đa sheet (HG244-T9, HG12-T9, LaChau...)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl gradient-gov text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{importFileName ? 'Chọn Lại File Khác' : 'Chọn File Từ Máy Tính'}</span>
                  </button>
                </div>
              </div>

              {/* Import Options & Summary */}
              {parsedRecords.length > 0 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-emerald-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Đã bóc tách thành công {parsedRecords.length} thửa đất sản xuất</span>
                      </div>
                      <div className="text-slate-600 text-xs mt-0.5">
                        Tổng diện tích: <strong>{(parsedRecords || []).reduce((s, r) => s + (Number(r?.dien_tich_m2) || 0), 0).toLocaleString()} m²</strong> • Tổng lúa giống: <strong>{(parsedRecords || []).reduce((s, r) => s + (Number(r?.giong_cap_kg) || 0), 0).toFixed(2)} kg</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Thay thế toàn bộ ({parsedRecords.length} thửa)</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer ml-2">
                        <input
                          type="radio"
                          name="importMode"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Bổ sung thêm</span>
                      </label>
                    </div>
                  </div>

                  {/* Preview Search */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={previewSearch}
                        onChange={(e) => setPreviewSearch(e.target.value)}
                        placeholder="Tìm trong dữ liệu vừa nạp..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200"
                      />
                    </div>
                    <span className="text-slate-500 text-xs font-semibold">
                      Hiển thị {(filteredPreview || []).length} / {(parsedRecords || []).length} thửa
                    </span>
                  </div>

                  {/* Preview Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                        <tr>
                          <th className="p-2 border-b">STT</th>
                          <th className="p-2 border-b">Chủ Đất</th>
                          <th className="p-2 border-b">Hộ Canh Tác</th>
                          <th className="p-2 border-b">Xứ Đồng</th>
                          <th className="p-2 border-b">Lô/Thửa</th>
                          <th className="p-2 border-b">Giống</th>
                          <th className="p-2 border-b text-right">Diện Tích (m²)</th>
                          <th className="p-2 border-b text-right">Giống Cấp (kg)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(filteredPreview || []).slice(0, 30).map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-2 font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-2 font-bold text-slate-900">{r.chu_dat || 'Chưa rõ'}</td>
                            <td className="p-2 text-slate-700">{r.ho_san_xuat || r.chu_dat || 'Chưa rõ'}</td>
                            <td className="p-2 font-bold text-emerald-800">{r.xu_dong || 'Tổ 9'}</td>
                            <td className="p-2 font-mono text-slate-600">{r.lo_thua_dat || `Thửa ${idx + 1}`}</td>
                            <td className="p-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                {r.giong_lua || 'HG12'}
                              </span>
                            </td>
                            <td className="p-2 text-right font-mono font-bold">{(Number(r.dien_tich_m2) || 0).toLocaleString()}</td>
                            <td className="p-2 text-right font-mono text-emerald-700">{(Number(r.giong_cap_kg) || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setParsedRecords([])}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                    >
                      Hủy Bỏ
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận Nạp {parsedRecords.length} Thửa Vào Cơ Sở Dữ Liệu</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EXPORT EXCEL */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Bộ Lọc Xuất File Excel Master</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Tùy chọn xuất toàn bộ 647 thửa hoặc lọc theo từng Xứ Đồng / Giống lúa</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Lọc Xứ Đồng</label>
                    <select
                      value={exportFilterXuDong}
                      onChange={(e) => setExportFilterXuDong(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                    >
                      <option value="ALL">Toàn Thôn (Tất cả 5 xứ đồng)</option>
                      <option value="Tổ 9">Xứ Đồng Tổ 9</option>
                      <option value="Hà Ra">Xứ Đồng Hà Ra</option>
                      <option value="La Châu">Xứ Đồng La Châu</option>
                      <option value="La Bông Tây">Xứ Đồng La Bông Tây</option>
                      <option value="Gò ổi">Xứ Đồng Gò Ổi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Lọc Giống Lúa</label>
                    <select
                      value={exportFilterGiong}
                      onChange={(e) => setExportFilterGiong(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs"
                    >
                      <option value="ALL">Tất cả giống lúa</option>
                      <option value="HG12">Giống HG12</option>
                      <option value="HG244">Giống HG244</option>
                      <option value="J02">Giống Nhật J02</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất File Excel Master Theo Bộ Lọc</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: DATABASE MANAGEMENT & CLEAR */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              
              {/* Database Overview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Hiện Trạng Cơ Sở Dữ Liệu Nông Nghiệp
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tổng cộng: <strong className="text-slate-900">{sanXuatList.length}</strong> thửa ruộng đang quản lý • Tổng diện tích: <strong>{(sanXuatList.reduce((s, r) => s + r.dien_tich_m2, 0) / 10000).toFixed(2)} ha</strong>.
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 font-mono text-xs font-black">
                  {sanXuatList.length} Thửa Ruộng
                </div>
              </div>

              {/* Reset to Default Seed */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Khôi Phục Sổ Bộ Gốc Mẫu Ban Đầu</span>
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Nạp lại toàn bộ 647 thửa ruộng phân bổ trên 5 xứ đồng của Thôn An Trạch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại 647 thửa ruộng mẫu chuẩn của Thôn An Trạch?')) {
                      resetSanXuatToSeed();
                      setStatusMessage('Đã khôi phục thành công 647 thửa ruộng mẫu chuẩn!');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi Phục 647 Thửa</span>
                </button>
              </div>

              {/* Clear All Database Box */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div>
                  <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Xóa Toàn Bộ Cơ Sở Dữ Liệu Nông Nghiệp</span>
                  </h4>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Xóa trắng toàn bộ danh sách thửa ruộng để bắt đầu nhập liệu mùa vụ mới từ file Excel.
                  </p>
                </div>

                {!showClearConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa Toàn Bộ Dữ Liệu Nông Nghiệp</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-white border-2 border-rose-300 space-y-2.5 animate-in fade-in duration-150">
                    <p className="text-xs font-black text-rose-900">
                      ⚠️ CẢNH BÁO BẢO MẬT: Hành động này sẽ xóa toàn bộ {sanXuatList.length} thửa ruộng sản xuất!
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Để xác nhận, vui lòng nhập chính xác cụm từ <strong className="text-rose-600">XÓA NÔNG NGHIỆP</strong> vào ô bên dưới:
                    </p>
                    <input
                      type="text"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder="Gõ: XÓA NÔNG NGHIỆP"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold uppercase text-rose-700"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleExecuteClear}
                        className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer shadow-xs active:scale-95 transition-all"
                      >
                        Xác Nhận Xóa Ngay
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowClearConfirm(false); setConfirmInput(''); }}
                        className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Hủy Bỏ
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: SUPABASE POSTGRESQL */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 font-mono">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="font-bold">POSTGRESQL DDL SCHEMA:</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">v2.1</span>
                </div>
                <pre className="text-[11px] overflow-x-auto text-slate-300 bg-slate-950 p-3 rounded-xl max-h-48">
{`-- Bảng Sổ Bộ Sản Xuất Nông Nghiệp Thôn An Trạch
CREATE TABLE public.san_xuat_nong_nghiep (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stt INTEGER,
  dot_phan_bo VARCHAR(100),
  giong_lua VARCHAR(50),
  xu_dong VARCHAR(100),
  lo_thua_dat VARCHAR(100),
  chu_dat VARCHAR(255),
  ho_san_xuat VARCHAR(255),
  la_chinh_chu BOOLEAN DEFAULT TRUE,
  dien_tich_m2 NUMERIC(10, 2),
  giong_cap_kg NUMERIC(10, 2),
  mua_them_kg NUMERIC(10, 2) DEFAULT 0,
  don_gia NUMERIC(12, 2) DEFAULT 18000,
  thanh_tien NUMERIC(14, 2),
  ky_nhan VARCHAR(100) DEFAULT 'Đã nhận',
  to_dan_cu VARCHAR(50),
  trang_thai_canh_tac VARCHAR(50) DEFAULT 'da_xuong_giong',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
