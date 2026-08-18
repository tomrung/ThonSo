import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, CheckCircle2, User, MapPin, Calendar, CreditCard, Sparkles, RefreshCw, Keyboard, Search, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';
import { parseCCCDQrCode } from '../lib/utils';
import { CCCDData, NhanKhau } from '../types';
import { useData } from '../context/DataContext';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResident: (resident: NhanKhau) => void;
  onPrefillNewResident: (data: CCCDData) => void;
}

// Các chuỗi QR CCCD mẫu chuẩn BCA để trải nghiệm thử nhanh
const SAMPLE_QR_CODES = [
  {
    label: 'Cư dân Tổ 1: Đinh Thị Em (200321109)',
    qr: '200321109||DINH THI EM|22121952|Nữ|Tổ 1 An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng|15052021',
  },
  {
    label: 'Cư dân Tổ 3: Phạm Hữu Nghĩa (048092004567)',
    qr: '048092004567|201456789|PHAM HUU NGHIA|14081992|Nam|Tổ 3 An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng|20112022',
  },
  {
    label: 'Cư dân Mới: Lê Thị Kim Oanh (Chưa có hồ sơ)',
    qr: '048199008899|201889900|LE THI KIM OANH|05091999|Nữ|Tổ 5 An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng|10032023',
  },
];

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectResident,
  onPrefillNewResident,
}) => {
  const { nhanKhauList } = useData();
  const [scanMode, setScanMode] = useState<'camera' | 'manual' | 'samples'>('camera');
  const [manualInput, setManualInput] = useState('');
  const [scanResult, setScanResult] = useState<CCCDData | null>(null);
  const [matchedResident, setMatchedResident] = useState<NhanKhau | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setMatchedResident(null);
      setCameraError(null);
      setManualInput('');
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const qrScanner = new Html5Qrcode('qr-reader', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      html5QrCodeRef.current = qrScanner;

      await qrScanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleDecodedText(decodedText);
        },
        () => {
          // Ignore frame decode failures
        }
      );
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError('Không thể mở Camera (Do quyền truy cập bị chặn hoặc thiết bị không có webcam). Bạn có thể dùng chế độ "Nhập / Dán Chuỗi QR" bên dưới.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Camera stop error:', err);
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleDecodedText = (text: string) => {
    stopCamera();
    const cleanText = text.trim();
    const parsed = parseCCCDQrCode(cleanText);

    if (parsed) {
      setScanResult(parsed);
      // Tìm xem cư dân đã có trong hệ thống chưa
      const found = nhanKhauList.find(
        (r) =>
          (r.so_cmnd_cccd && r.so_cmnd_cccd.replace(/\D/g, '') === parsed.so_cccd.replace(/\D/g, '')) ||
          (parsed.so_cmnd_cu && r.so_cmnd_cccd && r.so_cmnd_cccd.replace(/\D/g, '') === parsed.so_cmnd_cu.replace(/\D/g, '')) ||
          (r.ho_ten.toLowerCase() === parsed.ho_ten.toLowerCase())
      );
      setMatchedResident(found || null);
    } else {
      // Thử tìm theo số CCCD 12 số thuần túy
      const numOnly = cleanText.replace(/\D/g, '');
      if (numOnly.length >= 9) {
        const found = nhanKhauList.find(
          (r) => r.so_cmnd_cccd && r.so_cmnd_cccd.replace(/\D/g, '') === numOnly
        );
        if (found) {
          const simulatedCCCD: CCCDData = {
            so_cccd: found.so_cmnd_cccd || numOnly,
            so_cmnd_cu: '',
            ho_ten: found.ho_ten,
            ngay_sinh: found.ngay_thang_nam_sinh || String(found.nam_sinh || '1990'),
            gioi_tinh: found.gioi_tinh,
            dia_chi: found.dia_chi || 'Thôn An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng',
            ngay_cap: '15/05/2021',
          };
          setScanResult(simulatedCCCD);
          setMatchedResident(found);
          return;
        }
      }
      setCameraError('Mã QR không đúng định dạng CCCD chuẩn của Bộ Công An (Dạng: CCCD|CMND|HọTên|NgàySinh|GiớiTính|ĐịaChỉ|NgàyCấp).');
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleDecodedText(manualInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Quét Mã QR Căn Cước Công Dân</h3>
              <p className="text-xs text-slate-500 font-medium">Bóc tách dữ liệu chuẩn BCA & đối soát CSDL Thôn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-3 bg-white border-b border-slate-100 flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setScanMode('camera');
              setCameraError(null);
            }}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              scanMode === 'camera'
                ? 'border-sky-600 text-sky-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Trực Tiếp</span>
          </button>

          <button
            onClick={() => {
              setScanMode('manual');
              stopCamera();
              setCameraError(null);
            }}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              scanMode === 'manual'
                ? 'border-sky-600 text-sky-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Nhập / Dán Mã QR</span>
          </button>

          <button
            onClick={() => {
              setScanMode('samples');
              stopCamera();
              setCameraError(null);
            }}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              scanMode === 'samples'
                ? 'border-sky-600 text-sky-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Mẫu Thử Nghiệm</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: Camera Viewport */}
          {scanMode === 'camera' && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 min-h-[260px] flex items-center justify-center text-white">
              <div id="qr-reader" className="w-full" />
              {!isCameraActive && !scanResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-sky-400">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                    Bấm nút bên dưới để cấp quyền mở Camera và đưa mã QR CCCD vào khung quét.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-5 py-2.5 rounded-xl gradient-gov text-white text-xs font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Mở Camera Quét QR</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Manual Text / CCCD Input */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSearch} className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700">
                Dán chuỗi mã QR CCCD hoặc Nhập Số CCCD / CMND 12 số:
              </label>
              <textarea
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Ví dụ: 048092004567|201456789|PHAM HUU NGHIA|14081992|Nam|Tổ 3 An Trạch... hoặc nhập 048092004567"
                rows={3}
                className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-sky-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl gradient-gov text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Bóc Tách & Đối Soát Cơ Sở Dữ Liệu</span>
              </button>
            </form>
          )}

          {/* TAB 3: Quick Demo Samples */}
          {scanMode === 'samples' && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Chọn dữ liệu mẫu chuẩn Bộ Công An để kiểm thử:
              </div>
              <div className="space-y-2">
                {SAMPLE_QR_CODES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDecodedText(item.qr)}
                    className="w-full text-left p-3 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/60 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 group-hover:text-sky-700">{item.label}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate max-w-[280px] mt-0.5">{item.qr}</div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold shrink-0">
                      Thử Quét
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {cameraError && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>{cameraError}</div>
            </div>
          )}

          {/* Result Card if scanned */}
          {scanResult && (
            <div className="p-4.5 rounded-3xl bg-sky-50/90 border border-sky-200 space-y-3.5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
                <div className="flex items-center gap-2 text-sky-900 font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã Bóc Tách Thông Tin CCCD Thành Công</span>
                </div>
                <button
                  onClick={() => {
                    setScanResult(null);
                    setMatchedResident(null);
                    if (scanMode === 'camera') startCamera();
                  }}
                  className="text-[11px] text-sky-700 hover:text-sky-900 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Quét lại
                </button>
              </div>

              {/* Citizen Details Card */}
              <div className="bg-white p-3.5 rounded-2xl border border-sky-100 shadow-2xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Họ và tên:</span>
                  <strong className="text-slate-900 font-black text-sm">{scanResult.ho_ten}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Số CCCD:</span>
                  <strong className="font-mono text-sky-700 font-extrabold">{scanResult.so_cccd}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Ngày sinh:</span>
                    <span className="font-bold text-slate-800">{scanResult.ngay_sinh}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Giới tính:</span>
                    <span className="font-bold text-slate-800">{scanResult.gioi_tinh}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Địa chỉ thường trú:</span>
                  <span className="font-medium text-slate-800 text-[11px] leading-relaxed">{scanResult.dia_chi}</span>
                </div>
              </div>

              {/* Database Match Status & Actions */}
              {matchedResident ? (
                <div className="space-y-2 pt-1">
                  <div className="text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">Đã có hồ sơ: {matchedResident.ho_ten} ({matchedResident.to_dan_cu}, Hộ {matchedResident.ma_ho})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectResident(matchedResident);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl gradient-gov text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Xem Chi Tiết Hồ Sơ Dân Cư Này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>Cư dân này chưa có trong cơ sở dữ liệu số Thôn An Trạch.</span>
                  </div>
                  <button
                    onClick={() => {
                      onPrefillNewResident(scanResult);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Tự Động Điền & Thêm Mới Cư Dân Vào Thôn</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

