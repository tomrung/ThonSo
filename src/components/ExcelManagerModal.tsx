import React, { useState, useRef } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Check, 
  AlertCircle, 
  Trash2, 
  RotateCcw, 
  ShieldAlert, 
  Database, 
  Eye, 
  FileCheck,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useData } from '../context/DataContext';
import { exportNhanKhauToExcel, downloadNhanKhauTemplateExcel, computeCccdDetails } from '../lib/utils';
import { NhanKhau } from '../types';

interface ExcelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelManagerModal: React.FC<ExcelManagerModalProps> = ({ isOpen, onClose }) => {
  const { 
    filteredNhanKhau, 
    nhanKhauList, 
    importExcelData, 
    clearAllNhanKhau, 
    resetNhanKhauToSeed 
  } = useData();

  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'database'>('import');
  
  // Import states
  const [parsedList, setParsedList] = useState<NhanKhau[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear confirm states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const handleExportFiltered = () => {
    exportNhanKhauToExcel(filteredNhanKhau, `DanCu_AnTrach_BoLoc_${filteredNhanKhau.length}_nguoi.xlsx`);
    onClose();
  };

  const handleExportAll = () => {
    exportNhanKhauToExcel(nhanKhauList, `DanCu_AnTrach_Master_${nhanKhauList.length}_nguoi.xlsx`);
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setIsProcessing(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData = XLSX.utils.sheet_to_json(ws) as any[];

        if (rawData.length === 0) {
          setImportStatus('Lỗi: File Excel không có dữ liệu!');
          setIsProcessing(false);
          return;
        }

        const parsed: NhanKhau[] = rawData.map((row, idx) => {
          const cccd = String(row['Số CCCD/CMND'] || row['So_CMND_CCCD'] || row['CCCD'] || '').trim();
          const namSinh = row['Năm Sinh'] || row['NamSinh'] ? parseInt(row['Năm Sinh'] || row['NamSinh']) : undefined;
          const dob = row['Ngày Tháng Năm Sinh'] || row['NgayThangNamSinh'] || row['Ngày Sinh'] || '';
          const rawNgayCap = row['Ngày Cấp CCCD'] || row['NgayCapCCCD'] || row['NgayCap'] || '';
          const rawNoiCap = row['Nơi Cấp CCCD'] || row['NoiCapCCCD'] || row['NoiCap'] || '';
          const rawHetHan = row['Ngày Hết Hạn CCCD'] || row['NgayHetHanCCCD'] || row['NgayHetHan'] || '';

          const cccdMeta = computeCccdDetails(cccd, namSinh, dob, rawNgayCap, rawNoiCap, rawHetHan);

          return {
            id: `nk-imp-${Date.now()}-${idx}`,
            stt_excel: idx + 1,
            ma_ho: String(row['Mã Hộ'] || row['MaHo'] || `HK_IMP_${idx}`).trim(),
            chu_ho: String(row['Chủ Hộ'] || row['ChuHo'] || '').toUpperCase().trim(),
            quan_he_chu_ho: String(row['Quan Hệ'] || row['QuanHeChuHo'] || 'Chủ hộ').trim(),
            ho_ten: String(row['Họ Và Tên'] || row['HoTen'] || row['Họ và tên'] || '').toUpperCase().trim(),
            gioi_tinh: String(row['Giới Tính'] || row['GioiTinh'] || 'Nam').trim(),
            ngay_thang_nam_sinh: dob,
            nam_sinh: namSinh,
            tuoi: row['Tuổi (2026)'] || row['Tuoi'] ? parseInt(row['Tuổi (2026)'] || row['Tuoi']) : (namSinh ? 2026 - namSinh : undefined),
            nhom_tuoi: row['Nhóm Tuổi'] || row['NhomTuoi'] || '',
            so_cmnd_cccd: cccd,
            loai_giay_to: row['Loại Giấy Tờ'] || row['LoaiGiayTo'] || (cccd.length === 12 ? 'CCCD gắn chip' : 'CMND 9 số'),
            ngay_cap_cccd: cccdMeta.ngay_cap_cccd,
            noi_cap_cccd: cccdMeta.noi_cap_cccd,
            ngay_het_han_cccd: cccdMeta.ngay_het_han_cccd,
            dien_thoai: String(row['Điện Thoại'] || row['DienThoai'] || '').trim(),
            ho_ten_cha: String(row['Họ Tên Bố'] || row['HoTenCha'] || '').toUpperCase().trim(),
            ho_ten_me: String(row['Họ Tên Mẹ'] || row['HoTenMe'] || '').toUpperCase().trim(),
            ma_the_bhyt: String(row['Mã Thẻ BHYT'] || row['MaTheBHYT'] || '').toUpperCase().trim(),
            nhom_bhyt: row['Nhóm BHYT'] || row['NhomBHYT'] || '',
            nghe_nghiep: row['Nghề Nghiệp'] || row['NgheNghiep'] || '',
            dia_chi: row['Địa Chỉ'] || row['DiaChi'] || 'Thôn An Trạch, Hòa Tiến',
            to_dan_cu: row['Tổ Dân Cư'] || row['ToDanCu'] || 'Tổ 1',
            trang_thai_cu_tru: row['Trạng Thái Cư Trú'] || row['TrangThaiCuTru'] || 'Đang thường trú',
            doi_tuong_dac_thu: row['Đối Tượng Đặc Thù'] || row['DoiTuongDacThu'] || 'Bình thường',
            ghi_chu: row['Ghi Chú'] || row['GhiChu'] || '',
          };
        });

        setParsedList(parsed);
        setIsProcessing(false);
      } catch (err: any) {
        setImportStatus(`Lỗi đọc file: ${err.message}`);
        setIsProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleApplyImport = () => {
    if (parsedList.length === 0) return;

    if (importMode === 'replace') {
      importExcelData(parsedList);
    } else {
      // Append mode
      const existingIds = new Set(nhanKhauList.map(r => r.so_cmnd_cccd || r.id));
      const combined = [...nhanKhauList];
      parsedList.forEach(p => {
        if (!p.so_cmnd_cccd || !existingIds.has(p.so_cmnd_cccd)) {
          combined.push(p);
        }
      });
      importExcelData(combined);
    }

    setImportStatus(`Đã nạp thành công ${parsedList.length} hồ sơ vào cơ sở dữ liệu!`);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleExecuteClear = () => {
    if (confirmInput.trim().toUpperCase() !== 'XÓA DÂN CƯ') {
      alert('Vui lòng gõ chính xác cụm từ "XÓA DÂN CƯ" để xác nhận!');
      return;
    }
    clearAllNhanKhau();
    setShowClearConfirm(false);
    setConfirmInput('');
    setImportStatus('Đã xóa sạch toàn bộ cơ sở dữ liệu Dân cư!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Quản Trị Cơ Sở Dữ Liệu Dân Cư</h3>
              <p className="text-xs text-slate-500 font-medium">Tải file mẫu, Nạp Excel, Xuất Master & Quản lý CSDL 2.308 cư dân</p>
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
            onClick={() => { setActiveTab('import'); setImportStatus(null); }}
            className={`pb-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Nạp / Import Excel</span>
            {parsedList.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">
                {parsedList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('export'); setImportStatus(null); }}
            className={`pb-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Xuất Master Excel</span>
          </button>

          <button
            onClick={() => { setActiveTab('database'); setImportStatus(null); }}
            className={`pb-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'database'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Quản Trị CSDL & Xóa</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 max-h-[calc(92vh-160px)]">
          
          {/* Status Banner */}
          {importStatus && (
            <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
              importStatus.includes('Lỗi') 
                ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {importStatus.includes('Lỗi') ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
              <span>{importStatus}</span>
            </div>
          )}

          {/* TAB 1: IMPORT / NẠP EXCEL */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              
              {/* Step 1: Download Template */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Mẫu File Excel Chuẩn (25 Cột)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tải file mẫu có sẵn cấu trúc 25 trường thông tin & 3 dòng mẫu hướng dẫn.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadNhanKhauTemplateExcel}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-emerald-700 border border-emerald-300 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Mẫu Excel</span>
                </button>
              </div>

              {/* Step 2: Upload File Box */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border-2 border-dashed border-sky-300 hover:border-sky-500 transition-colors text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <div className="p-3 rounded-2xl bg-sky-100 text-sky-700">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900">
                      {importFileName ? `Đã chọn: ${importFileName}` : 'Chọn hoặc Kéo thả File Excel Dân Cư'}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">Hỗ trợ định dạng .xlsx, .xls</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl gradient-gov text-white font-extrabold text-xs shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                  >
                    {importFileName ? 'Chọn Lại File Khác' : 'Chọn File Từ Máy Tính'}
                  </button>
                </div>
              </div>

              {/* Step 3: Preview Parsed Records */}
              {parsedList.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-sky-600" />
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Xem Trước Dữ Liệu ({parsedList.length} Cư Dân)
                      </h4>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex items-center gap-2 text-xs">
                      <label className="flex items-center gap-1 cursor-pointer font-bold text-slate-700">
                        <input
                          type="radio"
                          name="importMode"
                          value="replace"
                          checked={importMode === 'replace'}
                          onChange={() => setImportMode('replace')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Thay thế toàn bộ</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer font-bold text-slate-700">
                        <input
                          type="radio"
                          name="importMode"
                          value="append"
                          checked={importMode === 'append'}
                          onChange={() => setImportMode('append')}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Bổ sung thêm</span>
                      </label>
                    </div>
                  </div>

                  {/* Mini Preview Table */}
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-[11px] text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                        <tr>
                          <th className="px-2.5 py-1.5">Mã Hộ</th>
                          <th className="px-2.5 py-1.5">Họ Và Tên</th>
                          <th className="px-2.5 py-1.5">Số CCCD</th>
                          <th className="px-2.5 py-1.5">Ngày Cấp</th>
                          <th className="px-2.5 py-1.5">Hạn CCCD</th>
                          <th className="px-2.5 py-1.5">Tổ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {parsedList.slice(0, 10).map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-2.5 py-1 font-mono text-sky-700 font-bold">{r.ma_ho}</td>
                            <td className="px-2.5 py-1 font-bold text-slate-900">{r.ho_ten}</td>
                            <td className="px-2.5 py-1 font-mono">{r.so_cmnd_cccd || '-'}</td>
                            <td className="px-2.5 py-1 font-mono text-slate-600">{r.ngay_cap_cccd || '-'}</td>
                            <td className="px-2.5 py-1 font-mono text-emerald-700">{r.ngay_het_han_cccd || '-'}</td>
                            <td className="px-2.5 py-1">{r.to_dan_cu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {parsedList.length > 10 && (
                    <p className="text-[10px] text-slate-400 text-center italic">
                      Đang hiển thị 10 / {parsedList.length} cư dân đọc được từ file Excel
                    </p>
                  )}

                  {/* Submit Import Button */}
                  <button
                    type="button"
                    onClick={handleApplyImport}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Xác Nhận Nạp {parsedList.length} Cư Dân Vào Cơ Sở Dữ Liệu</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: EXPORT MASTER EXCEL */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Tùy Chọn Xuất Master Excel (.xlsx)
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  File xuất ra chứa đầy đủ 25 cột chuẩn bao gồm Mã hộ, Quan hệ, Ngày cấp, Nơi cấp, Hạn CCCD và thông tin BHYT.
                </p>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleExportFiltered}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Xuất danh sách theo Bộ lọc hiện tại</span>
                    </div>
                    <span className="bg-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                      {filteredNhanKhau.length} bản ghi
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportAll}
                    className="w-full py-3 px-4 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-800 font-black text-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-600" />
                      <span>Xuất toàn bộ Master CSDL Thôn An Trạch</span>
                    </div>
                    <span className="bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full text-[10px] font-mono">
                      {nhanKhauList.length} Cư Dân
                    </span>
                  </button>
                </div>
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
                    Hiện Trạng Cơ Sở Dữ Liệu Dân Cư
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tổng cộng: <strong className="text-slate-900">{nhanKhauList.length}</strong> nhân khẩu đang quản lý trên hệ thống.
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-700 font-mono text-xs font-black">
                  {nhanKhauList.length} Cư Dân
                </div>
              </div>

              {/* Reset to Default Seed */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Khôi Phục Dữ Liệu Gốc Ban Đầu</span>
                  </h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Nạp lại toàn bộ 2.308 cư dân và 614 hộ gia đình mẫu chuẩn của Thôn An Trạch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại 2.308 cư dân mẫu chuẩn của Thôn An Trạch?')) {
                      resetNhanKhauToSeed();
                      setImportStatus('Đã khôi phục thành công 2.308 cư dân mẫu chuẩn!');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi Phục 2.308 Cư Dân</span>
                </button>
              </div>

              {/* Clear All Database Box */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                <div>
                  <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Xóa Toàn Bộ Cơ Sở Dữ Liệu Dân Cư</span>
                  </h4>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    Xóa trắng toàn bộ danh sách nhân khẩu và sổ hộ khẩu để nhập liệu địa bàn mới từ đầu.
                  </p>
                </div>

                {!showClearConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa Toàn Bộ Dữ Liệu Dân Cư</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-white border-2 border-rose-300 space-y-2.5 animate-in fade-in duration-150">
                    <p className="text-xs font-black text-rose-900">
                      ⚠️ CẢNH BÁO BẢO MẬT: Hành động này sẽ xóa toàn bộ {nhanKhauList.length} nhân khẩu!
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Để xác nhận, vui lòng nhập chính xác cụm từ <strong className="text-rose-600">XÓA DÂN CƯ</strong> vào ô bên dưới:
                    </p>
                    <input
                      type="text"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder="Gõ: XÓA DÂN CƯ"
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

        </div>
      </div>
    </div>
  );
};
