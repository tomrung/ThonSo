import { AiKnowledgeItem, AiSystemConfig } from '../types';

export const INITIAL_AI_SYSTEM_CONFIG: AiSystemConfig = {
  systemPrompt: `Bạn là An Trạch AI (Copilot Trí Tuệ Nhân Tạo) - Trợ lý số thông minh chính thức của Thôn An Trạch, Xã Hòa Tiến, Huyện Hòa Vang, TP Đà Nẵng.
Nhiệm vụ của bạn là tư vấn, giải đáp thắc mắc của người dân, khách vãng lai và hỗ trợ cán bộ trong công tác điều hành thôn.
Quy tắc trả lời:
1. Luôn lịch sự, tận tụy, chính xác, viện dẫn đúng quy định pháp luật và thông tin thực tế của thôn An Trạch.
2. Trình bày rõ ràng bằng Markdown, có các đề mục, gạch đầu dòng, emoji sinh động, số điện thoại liên hệ cán bộ khi cần.
3. Khi người dân hỏi thủ tục, nêu rõ: Hồ sơ cần chuẩn bị, nơi nộp, thời hạn giải quyết và lệ phí (nếu có).
4. Khi hỏi về nông nghiệp, nêu rõ diện tích 5 xứ đồng, giống lúa (HG12, HG244, J02), lịch trạm bơm và khuyến cáo bón phân cân đối.`,
  persona: 'tro_ly_dan_cu',
  temperature: 0.3,
  modelProvider: 'rag_local',
  enableCitations: true,
  autoSyncVillageData: true
};

export const INITIAL_AI_KNOWLEDGE_LIST: AiKnowledgeItem[] = [
  // 1. THỦ TỤC HÀNH CHÍNH
  {
    id: 'kb-001',
    title: 'Thủ tục Đăng ký Thường trú và Tạm trú tại Xã Hòa Tiến',
    category: 'thu_tuc',
    content: `🏛️ **QUY TRÌNH ĐĂNG KÝ THƯỜNG TRÚ / TẠM TRÚ (LUẬT CƯ TRÚ 2020)**

📌 **Nơi nộp hồ sơ:** 
* Nộp trực tuyến qua **Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)** hoặc **Cổng Dịch vụ công Bộ Công an**.
* Hoặc nộp trực tiếp tại **Công an Xã Hòa Tiến**.

📋 **Hồ sơ gồm có:**
1. **Tờ khai thay đổi thông tin cư trú (Mẫu CT01)**.
2. **Giấy tờ chứng minh chỗ ở hợp pháp**: Sổ đỏ (GCN QSDĐ), Hợp đồng thuê nhà có công chứng, hoặc Giấy xác nhận của Ban thôn/Công an xã.
3. **Ý kiến đồng ý của chủ hộ/chủ sở hữu** (nếu đăng ký vào hộ gia đình khác).

⏱️ **Thời hạn giải quyết:** Tối đa **03 ngày làm việc** kể từ ngày nhận đủ hồ sơ hợp lệ.
💰 **Lệ phí:** Miễn phí khi nộp trực tuyến theo chính sách chuyển đổi số.

📞 **Cán bộ phụ trách hỗ trợ:**
* Đ/c **Hoàng Văn Nam** (Tổ trưởng ANTT cơ sở): **0978.112.233**
* Công an Xã Hòa Tiến: **(0236) 3846.113**`,
    keywords: ['thuong tru', 'tam tru', 'dang ky ho khau', 'nhap ho khau', 'chuyen ho khau', 'ct01', 'luat cu tru', 'cong an xa hoa tien'],
    priority: 10,
    source: 'Luật Cư trú số 68/2020/QH14 & Thông tư 55/2021/TT-BCA',
    isActive: true,
    updatedAt: '2026-08-18'
  },
  {
    id: 'kb-002',
    title: 'Thủ tục Cấp & Đổi Thẻ Căn Cước theo Luật Căn Cước Mới',
    category: 'thu_tuc',
    content: `🪪 **HƯỚNG DẪN CẤP / ĐỔI THẺ CĂN CƯỚC (LUẬT CĂN CƯỚC MỚI)**

📌 **Địa điểm thực hiện:** 
* **Bộ phận Tiếp nhận & Trả kết quả - Công an Huyện Hòa Vang** (Trung tâm Hành chính Huyện Hòa Vang).
* Hoặc các đợt cấp lưu động tại **Nhà Sinh hoạt Cộng đồng Thôn An Trạch**.

👥 **Đối tượng cấp:**
* Bắt buộc: Công dân Việt Nam từ đủ **14 tuổi trở lên**.
* Tự nguyện: Trẻ em từ **0 đến dưới 14 tuổi** (do cha mẹ/người giám hộ đăng ký online).

📋 **Quy trình thực hiện:**
1. Đăng ký lịch hẹn qua **Ứng dụng VNeID** hoặc Cổng Dịch vụ công.
2. Đến cơ quan Công an thu nhận vân tay, ảnh khuôn mặt và **quét mống mắt (Iris Scan)**.
3. Nhận thẻ trực tiếp hoặc qua dịch vụ bưu chính công ích VNPost về tận nhà.

⏱️ **Thời hạn trả thẻ:** Từ **07 - 10 ngày làm việc**.
💡 *Lưu ý: Thẻ CCCD mã vạch / chip cũ còn hạn sử dụng vẫn có giá trị bình thường đến ngày hết hạn.*`,
    keywords: ['can cuoc', 'cccd', 'lam can cuoc', 'doi can cuoc', 'mong mat', 'vneid', 'cong an hoa vang', '14 tuoi'],
    priority: 9,
    source: 'Luật Căn cước số 26/2023/QH15',
    isActive: true,
    updatedAt: '2026-08-18'
  },
  {
    id: 'kb-003',
    title: 'Thủ tục Đăng ký Khai sinh, Cấp thẻ BHYT & Đăng ký Thường trú Liên thông',
    category: 'thu_tuc',
    content: `👶 **DỊCH VỤ CÔNG LIÊN THÔNG: KHAI SINH + THƯỜNG TRÚ + BHYT TRẺ EM (3 TRONG 1)**

📌 **Cách thức nộp:** Trực tuyến 100% trên **Cổng Dịch vụ công Quốc gia**.

📋 **Thành phần hồ sơ điện tử:**
1. **Giấy chứng sinh** (bản điện tử hoặc chụp ảnh bản gốc của Trạm Y tế / Bệnh viện).
2. **Tờ khai điện tử liên thông** (hệ thống tự động đồng bộ từ CSDL Dân cư).
3. **Ý kiến đồng ý của chủ hộ** nơi đăng ký thường trú cho trẻ.

⏱️ **Thời gian giải quyết:** Tối đa **03 ngày làm việc** nhận cùng lúc 3 kết quả:
* Giấy khai sinh bản điện tử và bản giấy.
* Thông báo kết quả đăng ký thường trú.
* Mã thẻ BHYT điện tử cho trẻ em dưới 6 tuổi (miễn phí 100%).

📞 **Hỗ trợ công nghệ số:** Đ/c **Nguyễn Văn Cường** (Tổ Công nghệ số cộng đồng An Trạch): **0905.999.111**`,
    keywords: ['khai sinh', 'lien thong', 'bhyt tre em', 'nhap ho cho con', 'giay chung sinh', '3 trong 1'],
    priority: 9,
    source: 'Nghị định 63/2024/NĐ-CP về liên thông TTHC điện tử',
    isActive: true,
    updatedAt: '2026-08-18'
  },
  {
    id: 'kb-004',
    title: 'Thủ tục Xác nhận Tình trạng Hôn nhân (Giấy Độc Thân) & Đăng ký Kết hôn',
    category: 'thu_tuc',
    content: `💍 **HƯỚNG DẪN ĐĂNG KÝ KẾT HÔN & XÁC NHẬN TÌNH TRẠNG HÔN NHÂN**

📌 **Nơi nộp hồ sơ:** Bộ phận Một cửa **UBND Xã Hòa Tiến** hoặc nộp qua Cổng Dịch vụ công Đà Nẵng.

📋 **Hồ sơ gồm có:**
1. **Tờ khai đăng ký kết hôn** (có chữ ký của hai bên nam, nữ).
2. **Căn cước công dân** (VNeID mức 2) của cả hai người.
3. **Giấy xác nhận tình trạng hôn nhân** (nếu một trong hai bên có hộ khẩu thường trú ngoài Xã Hòa Tiến).

⏱️ **Thời hạn:** Giải quyết ngay trong ngày sau khi tiếp nhận đủ hồ sơ hợp lệ.
📜 **Nghi thức:** Trao Giấy chứng nhận kết hôn trang trọng tại UBND Xã Hòa Tiến.`,
    keywords: ['ket hon', 'giay doc than', 'xac nhan hon nhan', 'lay vo', 'lay chong', 'ubnd xa hoa tien'],
    priority: 8,
    source: 'Luật Hộ tịch số 60/2014/QH13',
    isActive: true,
    updatedAt: '2026-08-18'
  },

  // 2. CHÍNH SÁCH BHYT & AN SINH XÃ HỘI
  {
    id: 'kb-005',
    title: 'Chính sách Thẻ BHYT Hộ Gia Đình & Mức Giảm Trừ Mới Nhất 2026',
    category: 'chinh_sach_bhyt',
    content: `🏥 **CHÍNH SÁCH MUA THẺ BẢO HIỂM Y TẾ (BHYT) HỘ GIA ĐÌNH**

💰 **Mức đóng BHYT hộ gia đình năm 2026 (Tính theo mức lương cơ sở):**
* 👤 **Người thứ 1**: 100% mức đóng = **1.263.600 đ/năm**.
* 👤 **Người thứ 2**: Giảm 30% = **884.520 đ/năm** (đóng 70%).
* 👤 **Người thứ 3**: Giảm 40% = **758.160 đ/năm** (đóng 60%).
* 👤 **Người thứ 4**: Giảm 50% = **631.800 đ/năm** (đóng 50%).
* 👤 **Từ người thứ 5 trở đi**: Giảm 60% = **505.440 đ/năm** (đóng 40%).

🌟 **Đối tượng được ngân sách TP Đà Nẵng hỗ trợ 100% thẻ BHYT:**
* Hộ nghèo, hộ cận nghèo chuẩn thành phố.
* Người cao tuổi từ đủ 75 tuổi trở lên chưa có lương hưu.
* Người khuyết tật nặng và đặc biệt nặng.
* Trẻ em dưới 6 tuổi.

📞 **Đăng ký mua BHYT tại Thôn An Trạch:**
* Cán bộ Y tế thôn bản: Đ/c **Đinh Thị Lan** - SĐT: **0912.345.678**
* Trạm Y tế Xã Hòa Tiến: **(0236) 3846.220**`,
    keywords: ['bhyt', 'bao hiem y te', 'mua the bhyt', 'giam tru bhyt', 'ho ngheo', 'nguoi cao tuoi', 'dinh thi lan'],
    priority: 10,
    source: 'Nghị định 75/2023/NĐ-CP & Nghị quyết HĐND TP Đà Nẵng',
    isActive: true,
    updatedAt: '2026-08-18'
  },
  {
    id: 'kb-006',
    title: 'Chính sách Trợ Cấp Xã Hội & Chăm Sóc Người Cao Tuổi Thôn An Trạch',
    category: 'chinh_sach_bhyt',
    content: `👵 **CHẾ ĐỘ TRỢ CẤP XÃ HỘI HÀNG THÁNG & CHĂM SÓC NGƯỜI CAO TUỔI**

🌟 **Điều kiện hưởng trợ cấp hàng tháng:**
1. **Người cao tuổi từ 75 đến dưới 80 tuổi**: Thuộc hộ nghèo, cận nghèo chuẩn Đà Nẵng.
2. **Người cao tuổi từ đủ 80 tuổi trở lên**: Không có lương hưu hoặc trợ cấp BHXH hàng tháng.
3. **Người khuyết tật nặng, đặc biệt nặng**: Được hưởng trợ cấp và cấp thẻ BHYT miễn phí.

🎁 **Chế độ mừng thọ đầu xuân tại Thôn An Trạch:**
* Tuổi 70, 75, 80, 85, 90, 95 và 100+ tuổi được UBND Xã và Chi hội Người cao tuổi tổ chức chúc thọ, tặng quà và bằng mừng thọ vào dịp Tết Nguyên Đán.

📞 **Liên hệ:** Ban Nhân Dân Thôn An Trạch hoặc Chi hội Người cao tuổi thôn.`,
    keywords: ['tro cap', 'nguoi cao tuoi', 'mung tho', '80 tuoi', 'khuyet tat', 'bao tro xa hoi'],
    priority: 8,
    source: 'Nghị định 20/2021/NĐ-CP & Chính sách an sinh TP Đà Nẵng',
    isActive: true,
    updatedAt: '2026-08-18'
  },

  // 3. SẢN XUẤT NÔNG NGHIỆP & MÙA VỤ
  {
    id: 'kb-007',
    title: 'Quy Mô 5 Xứ Đồng & Cơ Cấu Giống Lúa Vụ Đông Xuân 2025 - 2026',
    category: 'nong_nghiep',
    content: `🌾 **TỔNG QUAN VÙNG SẢN XUẤT LÚA THÔN AN TRẠCH (43,86 HA - 647 THỬA)**

🗺️ **Phân bố 5 Xứ Đồng trọng điểm:**
1. **Xứ Đồng Tổ 9**: 9,54 ha • 140 thửa • Giống chủ lực: **HG12** (chịu phèn, đẻ nhánh khỏe).
2. **Xứ Đồng Hà Ra**: 11,20 ha • 165 thửa • Giống chủ lực: **HG244** (cứng cây, chống đổ ngã).
3. **Xứ Đồng La Châu**: 8,75 ha • 128 thửa • Cơ cấu giống: **HG12 & J02** (lúa Nhật chất lượng cao).
4. **Xứ Đồng La Bông Tây**: 7,85 ha • 115 thửa • Giống chủ lực: **HG244**.
5. **Xứ Đồng Cánh Trù (Gò Ổi)**: 6,52 ha • 99 thửa • Giống chủ lực: **HG12**.

🌾 **Định mức cấp lúa giống HTX:** 
* Bình quân **12 kg giống / 1.000 m²** (6 kg / sào 500m²).
* Tổng lượng giống cấp toàn thôn: **5,26 tấn**.

💧 **Lịch Thủy Nông:** Trạm bơm An Trạch 1 và An Trạch 2 vận hành bơm nước từ sông Yên theo 3 đợt làm đất, đẻ nhánh và trổ bông.`,
    keywords: ['xu dong', 'nong nghiep', 'to 9', 'ha ra', 'la chau', 'la bong tay', 'go oi', 'hg12', 'hg244', 'j02', 'tram bom an trach'],
    priority: 10,
    source: 'Kế hoạch sản xuất HTX Nông nghiệp Hòa Tiến 2 & BND Thôn An Trạch',
    isActive: true,
    updatedAt: '2026-08-18'
  },
  {
    id: 'kb-008',
    title: 'Công thức Tính Lượng Phân Bón Cân Đối Cho Lúa Vụ Đông Xuân',
    category: 'nong_nghiep',
    content: `🌿 **QUY TRÌNH BÓN PHÂN CÂN ĐỐI CHO 1 SÀO (500 M²) RUỘNG LÚA**

📦 **Định mức phân bón nguyên chất cho 1 sào (500 m²):**
* ⚪ **Đạm Urê (N)**: **10 - 12 kg**.
* 🟤 **Lân Super Long Thành/Lâm Thao (P)**: **20 - 25 kg**.
* 🔴 **Kali Clorua (K)**: **8 - 10 kg**.
* 📦 *Hoặc phân NPK 16-16-8*: **25 kg/sào**.

📅 **Lịch bón phân 3 đợt đạt năng suất >70 tạ/ha:**
1. **Bón lót (Trước khi bừa phẳng gieo sạ)**: 100% Lân + 30% Đạm Urê + 300kg phân chuồng hoai mục.
2. **Bón thúc đợt 1 (7 - 10 ngày sau sạ - Cây lúa ra 3 lá)**: 40% Đạm Urê + 30% Kali (kết hợp làm cỏ sục bùn).
3. **Bón đón đòng (40 - 45 ngày sau sạ - Tim đèn 1-2mm)**: 30% Đạm Urê + 70% Kali còn lại (giúp đòng to, hạt chắc mẩy, chống lem lép hạt).

⚠️ *Khuyến cáo: Không bón thừa đạm khi thời tiết âm u sương mù để hạn chế bệnh đạo ôn lá và rầy nâu.*`,
    keywords: ['phan bon', 'luong phan', 'bon lot', 'bon thuc', 'bon don dong', 'ure', 'kali', 'lan', 'npk', 'sau benh'],
    priority: 9,
    source: 'Quy trình kỹ thuật Trạm Khuyến nông Huyện Hòa Vang',
    isActive: true,
    updatedAt: '2026-08-18'
  },

  // 4. BỘ MÁY ĐIỀU HÀNH & DANH BẠ CÁN BỘ
  {
    id: 'kb-009',
    title: 'Danh Bạ & Số Điện Thoại Cán Bộ Chủ Chốt Thôn An Trạch',
    category: 'bo_may_can_bo',
    content: `🏛️ **DANH BẠ CÁN BỘ LÃNH ĐẠO & ĐIỀU HÀNH THÔN AN TRẠCH**

1. **Khối Cấp Ủy & Chi Bộ:**
   * 🎖️ **Bí Thư Chi Bộ**: Đ/c **Nguyễn Văn Toàn** • 📞 **0905.123.456**
   * 🎖️ **Phó Bí Thư Chi Bộ**: Đ/c **Lê Thị Mai** • 📞 **0905.654.999**

2. **Khối Ban Nhân Dân Thôn:**
   * 🏛️ **Trưởng Thôn**: Đ/c **Lê Văn Trưởng Thôn** • 📞 **0905.654.321**
   * 🤝 **Phó Trưởng Thôn**: Đ/c **Trần Đình Hùng** • 📞 **0913.888.777**

3. **Khối Nghiệp Vụ Chuyên Trách:**
   * 🛡️ **Tổ Trưởng ANTT Cơ Sở**: Đ/c **Hoàng Văn Nam** • 📞 **0978.112.233**
   * 🩺 **Cán Bộ Y Tế Thôn Bản**: Đ/c **Đinh Thị Lan** • 📞 **0912.345.678**
   * 🌐 **Tổ Công Nghệ Số Cộng Đồng**: Đ/c **Nguyễn Văn Cường** • 📞 **0905.999.111**

4. **Khối Mặt Trận & Đoàn Thể:**
   * 🕊️ **Trưởng Ban CT Mặt Trận**: Đ/c **Lê Thị Mai** • 📞 **0905.654.999**
   * 👩 **Chi Hội Trưởng Phụ Nữ**: Đ/c **Nguyễn Thị Hoa** • 📞 **0905.222.333**
   * 🌾 **Chi Hội Trưởng Nông Dân**: Đ/c **Trần Văn Long** • 📞 **0905.333.444**
   * ⭐ **Chi Hội Trưởng Cựu Chiến Binh**: Đ/c **Phan Văn Dũng** • 📞 **0905.444.555**
   * 🚩 **Bí Thư Chi Đoàn Thanh Niên**: Đ/c **Lê Văn Khoa** • 📞 **0905.555.666**`,
    keywords: ['can bo', 'so dien thoai', 'truong thon', 'bi thu', 'cong an vien', 'y te', 'danh ba', 'lien he'],
    priority: 10,
    source: 'Quyết định kiện toàn nhân sự UBND Xã Hòa Tiến năm 2026',
    isActive: true,
    updatedAt: '2026-08-18'
  },
  {
    id: 'kb-010',
    title: 'Danh Sách & Số Điện Thoại 8 Tổ Trưởng Dân Cư Thôn An Trạch',
    category: 'bo_may_can_bo',
    content: `👥 **DANH SÁCH 8 TỔ TRƯỞNG DÂN CƯ THÔN AN TRẠCH (614 HỘ DÂN)**

* 🏡 **Tổ 1** (80 hộ): Đ/c **Nguyễn Văn An** • 📞 **0905.111.001**
* 🏡 **Tổ 2** (75 hộ): Đ/c **Trần Thị Bình** • 📞 **0905.111.002**
* 🏡 **Tổ 3** (85 hộ): Đ/c **Lê Văn Cường** • 📞 **0905.111.003**
* 🏡 **Tổ 4** (70 hộ): Đ/c **Phạm Văn Dũng** • 📞 **0905.111.004**
* 🏡 **Tổ 5** (78 hộ): Đ/c **Hoàng Thị Em** • 📞 **0905.111.005**
* 🏡 **Tổ 6** (72 hộ): Đ/c **Ngô Văn Phúc** • 📞 **0905.111.006**
* 🏡 **Tổ 7** (82 hộ): Đ/c **Đặng Thị Giang** • 📞 **0905.111.007**
* 🏡 **Tổ 8** (72 hộ): Đ/c **Bùi Văn Hùng** • 📞 **0905.111.008**

💡 *Người dân khi có việc cần xác nhận tạm trú, giải quyết xích mích hoặc biến động hộ khẩu vui lòng liên hệ Tổ trưởng trực tiếp quản lý tổ mình.*`,
    keywords: ['to truong', 'to 1', 'to 2', 'to 3', 'to 4', 'to 5', 'to 6', 'to 7', 'to 8', 'sdt to truong'],
    priority: 10,
    source: 'Quyết định công nhận Tổ trưởng dân cư BND Thôn An Trạch',
    isActive: true,
    updatedAt: '2026-08-18'
  },

  // 5. AN NINH TRẬT TỰ & PHÒNG CHÁY CHỮA CHÁY
  {
    id: 'kb-011',
    title: 'Quy Định & Số Điện Thoại Đường Dây Nóng An Ninh Trật Tự, PCCC',
    category: 'an_ninh_pccc',
    content: `🚨 **ĐƯỜNG DÂY NÓNG AN NINH TRẬT TỰ & PHÒNG CHÁY CHỮA CHÁY (24/7)**

📞 **Số điện thoại khẩn cấp:**
* 🚔 **Công an Xã Hòa Tiến**: **(0236) 3846.113** hoặc **113**
* 🚒 **Báo cháy & Cứu nạn cứu hộ**: **114**
* 🚑 **Cấp cứu y tế**: **115**
* 🛡️ **Tổ trưởng ANTT Thôn An Trạch**: Đ/c **Hoàng Văn Nam** • **0978.112.233**
* 🏛️ **Trưởng Thôn An Trạch**: Đ/c **Lê Văn Trưởng Thôn** • **0905.654.321**

🔥 **Mô hình "Tổ liên gia an toàn PCCC" và "Điểm chữa cháy công cộng":**
* Thôn An Trạch đã trang bị 8 điểm chữa cháy công cộng tại 8 tổ dân cư với bình bột chữa cháy MFZ4 và chuông báo động liên gia.
* Khuyến cáo: Không đốt rơm rạ sát đường giao thông, tắt bình gas và thiết bị điện trước khi rời khỏi nhà.`,
    keywords: ['an ninh', 'bao cong an', 'chay nha', 'pccc', 'duong day nong', 'cap cuu', 'to lien gia'],
    priority: 9,
    source: 'Luật Lực lượng tham gia bảo vệ ANTT ở cơ sở số 30/2023/QH15',
    isActive: true,
    updatedAt: '2026-08-18'
  },

  // 6. VĂN HÓA, MÔI TRƯỜNG & HƯƠNG ƯỚC THÔN
  {
    id: 'kb-012',
    title: 'Quy Ước Nếp Sống Văn Hóa & Lịch Thu Gom Rác Thôn An Trạch',
    category: 'van_hoa_xa_hoi',
    content: `🌿 **QUY ƯỚC XÂY DỰNG NÔNG THÔN MỚI KIỂU MẪU & VỆ SINH MÔI TRƯỜNG**

🗑️ **Lịch thu gom rác thải sinh hoạt:**
* Các ngày: **Thứ 3, Thứ 5 và Chủ Nhật** hàng tuần (Xe rác gom từ 05:00 - 08:00 sáng).
* Yêu cầu: Bỏ rác vào thùng có nắp đậy hoặc bao buộc kín, phân loại rác tái chế (chai nhựa, lon bia).

🌸 **Phong trào "Ngày Chủ Nhật Xanh - Sạch - Đẹp":**
* Toàn thể 8 tổ dân cư đồng loạt ra quân dọn vệ sinh đường làng ngõ xóm vào sáng Chủ Nhật tuần đầu tiên mỗi tháng.

🎉 **Thực hiện nếp sống văn minh trong việc cưới, việc tang:**
* Đám tang không để quá 48 giờ, không rải vàng mã ra đường giao thông.
* Đám cưới văn minh, tiết kiệm, âm thanh không mở quá 22:00 đêm theo quy định.`,
    keywords: ['thu gom rac', 'rac thai', 'chu nhat xanh', 'huong uoc', 'dam cuoi', 'dam tang', 'nong thon moi'],
    priority: 8,
    source: 'Quy ước Thôn Văn hóa An Trạch được UBND Huyện Hòa Vang phê duyệt',
    isActive: true,
    updatedAt: '2026-08-18'
  }
];
