import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { NhanKhauPage } from './pages/NhanKhauPage';
import { HoKhauPage } from './pages/HoKhauPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { ThongBaoPage } from './pages/ThongBaoPage';
import { CanBoPage } from './pages/CanBoPage';
import { CongVanPage } from './pages/CongVanPage';
import { BanDoGisPage } from './pages/BanDoGisPage';
import { NongNghiepPage } from './pages/NongNghiepPage';
import { BanDoSanXuatPage } from './pages/BanDoSanXuatPage';
import { QuanTriAiPage } from './pages/QuanTriAiPage';
import { QRScannerModal } from './components/QRScannerModal';
import { ExcelManagerModal } from './components/ExcelManagerModal';
import { ThongBaoModal } from './components/ThongBaoModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthModal } from './components/AuthModal';
import { NhanKhauModal } from './components/NhanKhauModal';
import { HoKhauModal } from './components/HoKhauModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { AnTrachAiAssistantModal } from './components/AnTrachAiAssistantModal';
import { AnTrachAiFloatingTrigger } from './components/AnTrachAiFloatingTrigger';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NhanKhau, HoKhau, CCCDData } from './types';

const MainLayout: React.FC = () => {
  const { hoKhauList } = useData();
  const { currentUser } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  React.useEffect(() => {
    if (!currentUser && (currentTab === 'profile' || currentTab === 'admin')) {
      setCurrentTab('home');
    }
  }, [currentUser, currentTab]);

  const [selectedResident, setSelectedResident] = useState<NhanKhau | null>(null);
  const [selectedHousehold, setSelectedHousehold] = useState<HoKhau | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState<boolean>(false);
  const [isThongBaoModalOpen, setIsThongBaoModalOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');
  const [isNewResidentModalOpen, setIsNewResidentModalOpen] = useState<boolean>(false);
  const [newResidentPrefill, setNewResidentPrefill] = useState<Partial<NhanKhau> | undefined>(undefined);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const handleOpenAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSelectHoKhauByCode = (maHo: string) => {
    const found = hoKhauList.find((h) => h.ma_ho === maHo);
    if (found) {
      setSelectedHousehold(found);
    }
  };

  const handlePrefillFromCCCD = (cccd: CCCDData) => {
    setNewResidentPrefill({
      ho_ten: cccd.ho_ten,
      so_cmnd_cccd: cccd.so_cccd,
      ngay_thang_nam_sinh: cccd.ngay_sinh,
      gioi_tinh: cccd.gioi_tinh || 'Nam',
      dia_chi: cccd.dia_chi || 'Thôn An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng',
      to_dan_cu: 'Tổ 1',
      loai_giay_to: 'CCCD 12 số',
      ngay_cap_cccd: cccd.ngay_cap || '',
      noi_cap_cccd: cccd.noi_cap || 'Cục Cảnh sát QLHC về TTXH',
      ngay_het_han_cccd: cccd.ngay_het_han || '',
      trang_thai_cu_tru: 'Đang thường trú',
      doi_tuong_dac_thu: 'Bình thường',
    });
    setIsNewResidentModalOpen(true);
  };

  const handleAddNewMemberToHousehold = (maHo: string, toDanCu: string, diaChi: string, tenChuHo: string) => {
    setNewResidentPrefill({
      ma_ho: maHo,
      chu_ho: tenChuHo,
      quan_he_chu_ho: 'Con',
      to_dan_cu: toDanCu,
      dia_chi: diaChi,
      gioi_tinh: 'Nam',
      trang_thai_cu_tru: 'Đang thường trú',
      doi_tuong_dac_thu: 'Bình thường',
    });
    setIsNewResidentModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 overflow-x-hidden antialiased">
      {/* Left Sidebar Menu */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenThongBaoModal={() => setIsThongBaoModalOpen(true)}
        onOpenAuthModal={(mode) => handleOpenAuthModal(mode)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onOpenAiModal={() => {
          setAiInitialQuery('');
          setIsAiModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <Navbar
          currentTab={currentTab}
          onNavigateToTab={setCurrentTab}
          onToggleMobileMenu={() => setMobileOpen(true)}
          onOpenQRScanner={() => setIsQRScannerOpen(true)}
          onOpenExcelModal={() => setIsExcelModalOpen(true)}
          onOpenThongBaoModal={() => setIsThongBaoModalOpen(true)}
          onOpenAuthModal={(mode) => handleOpenAuthModal(mode)}
          onOpenNotificationCenter={() => setIsNotificationCenterOpen(true)}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
          onOpenAiModal={() => {
            setAiInitialQuery('');
            setIsAiModalOpen(true);
          }}
        />

        {/* Page Content View - Ultra Flexible & Responsive Container */}
        <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8 pb-24 lg:pb-12 transition-all duration-200">
          {currentTab === 'home' && (
            <HomePage
              onNavigateToTab={setCurrentTab}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              onSelectResident={(res) => setSelectedResident(res)}
              onOpenThongBao={() => setCurrentTab('thong-bao')}
              onOpenAuthModal={(mode) => handleOpenAuthModal(mode)}
            />
          )}

          {currentTab === 'nhan-khau' && (
            <NhanKhauPage
              onSelectResident={(res) => setSelectedResident(res)}
              onOpenQRScanner={() => setIsQRScannerOpen(true)}
              onOpenExcelModal={() => setIsExcelModalOpen(true)}
              onOpenNewResidentModal={() => {
                setNewResidentPrefill(undefined);
                setIsNewResidentModalOpen(true);
              }}
              onSelectHoKhau={handleSelectHoKhauByCode}
            />
          )}

          {currentTab === 'ho-khau' && (
            <HoKhauPage
              onSelectHoKhau={(hk) => setSelectedHousehold(hk)}
              onAddNewHousehold={() => {
                handleAddNewMemberToHousehold(`HK${Math.floor(100 + Math.random() * 900)}`, 'Tổ 1', 'Thôn An Trạch, Hòa Tiến', '');
              }}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardPage
              onSelectResident={(res) => setSelectedResident(res)}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'thong-bao' && <ThongBaoPage />}

          {currentTab === 'can-bo' && <CanBoPage />}

          {currentTab === 'cong-van' && <CongVanPage />}

          {currentTab === 'nong-nghiep' && (
            <ErrorBoundary>
              <NongNghiepPage
                onSelectResident={(res) => setSelectedResident(res)}
                onNavigateToTab={setCurrentTab}
              />
            </ErrorBoundary>
          )}

          {currentTab === 'ban-do-san-xuat' && (
            <BanDoSanXuatPage
              onSelectResident={(res) => setSelectedResident(res)}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === 'ban-do' && <BanDoGisPage />}

          {currentTab === 'quan-tri-ai' && <QuanTriAiPage />}

          {currentTab === 'admin' && <AdminPage />}

          {currentTab === 'profile' && (
            <ProfilePage onNavigateToHome={() => setCurrentTab('home')} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      {/* Global Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onNavigateToTab={setCurrentTab}
      />

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Modals */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onSelectResident={(res) => setSelectedResident(res)}
        onPrefillNewResident={handlePrefillFromCCCD}
      />

      <ExcelManagerModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      />

      <ThongBaoModal
        isOpen={isThongBaoModalOpen}
        onClose={() => setIsThongBaoModalOpen(false)}
      />

      <NhanKhauModal
        resident={selectedResident}
        isOpen={selectedResident !== null}
        onClose={() => setSelectedResident(null)}
        onSelectOtherResident={(res) => setSelectedResident(res)}
      />

      <NhanKhauModal
        resident={null}
        isCreating={true}
        initialData={newResidentPrefill}
        isOpen={isNewResidentModalOpen}
        onClose={() => {
          setIsNewResidentModalOpen(false);
          setNewResidentPrefill(undefined);
        }}
        onSelectOtherResident={() => {}}
      />

      <HoKhauModal
        household={selectedHousehold}
        isOpen={selectedHousehold !== null}
        onClose={() => setSelectedHousehold(null)}
        onSelectResident={(res) => setSelectedResident(res)}
        onAddNewMember={handleAddNewMemberToHousehold}
      />

      {/* PWA Mobile App Install Guide Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      {/* Floating AI Copilot Trigger Button */}
      <AnTrachAiFloatingTrigger
        onOpenAiModal={() => {
          setAiInitialQuery('');
          setIsAiModalOpen(true);
        }}
      />

      {/* An Trạch AI Assistant / Copilot Modal */}
      <AnTrachAiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialQuery={aiInitialQuery}
        onNavigateToTab={setCurrentTab}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainLayout />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
