import { NhanKhau, HoKhau, SanXuatRecord, XuDongMeta, VillageOfficer, AiKnowledgeItem, AiSystemConfig } from '../types';
import { removeVietnameseTones } from '../lib/utils';
import { INITIAL_AI_KNOWLEDGE_LIST, INITIAL_AI_SYSTEM_CONFIG } from '../data/initialAiKnowledge';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: string;
  citations?: Array<{ id: string; title: string; source?: string }>;
  structuredData?: any;
}

export interface AiContextData {
  nhanKhauList: NhanKhau[];
  hoKhauList: HoKhau[];
  sanXuatList: SanXuatRecord[];
  xuDongList: XuDongMeta[];
  officersList?: VillageOfficer[];
  aiKnowledgeList?: AiKnowledgeItem[];
  aiConfig?: AiSystemConfig;
}

/**
 * Enhanced RAG (Retrieval-Augmented Generation) Processor for An Trạch AI
 */
export function processAnTrachAiQuery(
  rawQuery: string,
  context: AiContextData
): { text: string; category?: string; citations?: Array<{ id: string; title: string; source?: string }>; structuredData?: any } {
  const query = rawQuery.trim();
  const qClean = removeVietnameseTones(query.toLowerCase());
  const knowledgeBase = context.aiKnowledgeList && context.aiKnowledgeList.length > 0 
    ? context.aiKnowledgeList.filter(k => k.isActive)
    : INITIAL_AI_KNOWLEDGE_LIST;

  // 1. RAG PHASE: SEARCH IN DYNAMIC KNOWLEDGE BASE
  let bestMatch: { item: AiKnowledgeItem; score: number } | null = null;

  for (const item of knowledgeBase) {
    let score = 0;
    const titleClean = removeVietnameseTones(item.title.toLowerCase());
    const contentClean = removeVietnameseTones(item.content.toLowerCase());

    // Check title exact or high overlap
    if (qClean.includes(titleClean) || titleClean.includes(qClean)) {
      score += 25;
    }

    // Check keywords overlap
    if (item.keywords && Array.isArray(item.keywords)) {
      for (const kw of item.keywords) {
        const kwClean = removeVietnameseTones(kw.toLowerCase().trim());
        if (kwClean && qClean.includes(kwClean)) {
          score += 15;
        }
      }
    }

    // Check words overlap in content
    const queryWords = qClean.split(/\s+/).filter(w => w.length > 2);
    let matchedWordsCount = 0;
    for (const w of queryWords) {
      if (titleClean.includes(w)) score += 6;
      else if (contentClean.includes(w)) matchedWordsCount++;
    }
    score += Math.min(matchedWordsCount * 2, 10);

    // Apply priority weighting
    score += (item.priority || 5) * 0.5;

    if (score >= 15 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { item, score };
    }
  }

  // If a high-confidence dynamic knowledge match is found, return it!
  if (bestMatch && bestMatch.score >= 18) {
    const matched = bestMatch.item;
    return {
      category: matched.category,
      citations: [
        {
          id: matched.id,
          title: matched.title,
          source: matched.source || 'Kho Tri Thức An Trạch AI'
        }
      ],
      text: `${matched.content}\n\n---\n📖 *Nguồn trích dẫn: ${matched.source || 'Kho Tri Thức Thôn An Trạch (Cập nhật 2026)'}*`
    };
  }

  // 2. QUERY: THỐNG KÊ NHÂN KHẨU / BHYT / TỔ DÂN CƯ (DATABASE DRIVEN)
  if (
    qClean.includes('bao nhieu dan') ||
    qClean.includes('nhan khau') ||
    qClean.includes('dan so') ||
    qClean.includes('tong so nguoi') ||
    qClean.includes('bao hiem') ||
    qClean.includes('bhyt') ||
    qClean.includes('cccd') ||
    (qClean.includes('to ') && (qClean.includes('bao nhieu') || qClean.includes('danh sach')))
  ) {
    const toMatch = qClean.match(/to\s*([1-8])/);
    if (toMatch) {
      const toNum = toMatch[1];
      const toName = `Tổ ${toNum}`;
      const toResidents = context.nhanKhauList.filter((r) => r.to_dan_cu === toName);
      const toHouseholds = context.hoKhauList.filter((h) => h.to_dan_cu === toName);
      const bhytCount = toResidents.filter((r) => !!r.ma_the_bhyt).length;
      const cccdCount = toResidents.filter((r) => r.so_cmnd_cccd && r.so_cmnd_cccd.length >= 9).length;
      const maleCount = toResidents.filter((r) => r.gioi_tinh === 'Nam').length;
      const femaleCount = toResidents.filter((r) => r.gioi_tinh === 'Nữ').length;

      return {
        category: 'dan_cu',
        text: `📊 **BÁO CÁO THỐNG KÊ NHÂN KHẨU & AN SINH XÃ HỘI ${toName.toUpperCase()}**\n\n` +
          `* 👥 **Tổng nhân khẩu**: **${toResidents.length} người** (*${maleCount} Nam • ${femaleCount} Nữ*)\n` +
          `* 🏡 **Số hộ gia đình**: **${toHouseholds.length} hộ** (Bình quân ${(toResidents.length / (toHouseholds.length || 1)).toFixed(2)} người/hộ)\n` +
          `* 🏥 **Thẻ BHYT**: **${bhytCount} / ${toResidents.length} người** (${((bhytCount / (toResidents.length || 1)) * 100).toFixed(1)}% bao phủ)\n` +
          `* 🪪 **Định danh CCCD**: **${cccdCount} người** đã cấp CCCD/CMND\n\n` +
          `💡 *Gợi ý: Cán bộ có thể mở tab "Dân Cư" và chọn bộ lọc "${toName}" để xem danh sách chi tiết từng nhân khẩu.*`
      };
    }

    const totalPop = context.nhanKhauList.length;
    const totalHo = context.hoKhauList.length;
    const totalBhyt = context.nhanKhauList.filter((r) => !!r.ma_the_bhyt).length;
    const elderly = context.nhanKhauList.filter((r) => {
      if (!r.ngay_thang_nam_sinh) return false;
      const year = parseInt(r.ngay_thang_nam_sinh.slice(0, 4) || r.ngay_thang_nam_sinh.slice(-4));
      return year && (2026 - year >= 60);
    }).length;

    return {
      category: 'dan_cu',
      text: `📊 **TỔNG QUAN NHÂN KHẨU TOÀN THÔN AN TRẠCH (NĂM 2026)**\n\n` +
        `* 👥 **Tổng dân số toàn thôn**: **${totalPop.toLocaleString()} nhân khẩu**\n` +
        `* 🏡 **Tổng số hộ gia đình**: **${totalHo.toLocaleString()} hộ** phân bổ trên 8 Tổ Dân Cư\n` +
        `* 🏥 **Tỷ lệ bao phủ BHYT**: **${((totalBhyt / totalPop) * 100).toFixed(1)}%** (${totalBhyt.toLocaleString()} người có thẻ)\n` +
        `* 👴 **Người cao tuổi (≥60 tuổi)**: **${elderly.toLocaleString()} cụ** (${((elderly / totalPop) * 100).toFixed(1)}% dân số)\n` +
        `* 🏛️ **Địa bàn hành chính**: Xã Hòa Tiến, Huyện Hòa Vang, TP Đà Nẵng.`
    };
  }

  // 3. QUERY: SẢN XUẤT NÔNG NGHIỆP & 5 XỨ ĐỒNG
  if (
    qClean.includes('nong nghiep') ||
    qClean.includes('xứ dong') ||
    qClean.includes('xu dong') ||
    qClean.includes('thua dat') ||
    qClean.includes('giong lua') ||
    qClean.includes('dien tich dat') ||
    qClean.includes('hg12') ||
    qClean.includes('hg244') ||
    qClean.includes('j02') ||
    qClean.includes('tram bom') ||
    qClean.includes('thuy nong')
  ) {
    const totalAreaM2 = context.sanXuatList.reduce((s, r) => s + (r.dien_tich_m2 || 0), 0);
    const totalParcels = context.sanXuatList.length;
    const hg12 = context.sanXuatList.filter((r) => r.giong_lua === 'HG12').length;
    const hg244 = context.sanXuatList.filter((r) => r.giong_lua === 'HG244').length;
    const j02 = context.sanXuatList.filter((r) => r.giong_lua === 'J02').length;

    return {
      category: 'nong_nghiep',
      text: `🌾 **BÁO CÁO NÔNG NGHIỆP & MÙA VỤ ĐÔNG XUÂN 2025 - 2026**\n\n` +
        `* 🗺️ **Quy mô vùng sản xuất**: **43,86 ha** (*${totalAreaM2.toLocaleString()} m²*) trên **5 Xứ Đồng**:\n` +
        `  1. **Xứ Đồng Tổ 9**: 9,54 ha • 140 thửa • Giống HG12\n` +
        `  2. **Xứ Đồng Hà Ra**: 11,20 ha • 165 thửa • Giống HG244\n` +
        `  3. **Xứ Đồng La Châu**: 8,75 ha • 128 thửa • Giống HG12 & J02\n` +
        `  4. **Xứ Đồng La Bông Tây**: 7,85 ha • 115 thửa • Giống HG244\n` +
        `  5. **Xứ Đồng Cánh Trù**: 6,52 ha • 99 thửa • Giống HG12\n` +
        `* 🌾 **Cơ cấu giống lúa**: **HG12** (${hg12} thửa - 53%) • **HG244** (${hg244} thửa - 32%) • **J02** (${j02} thửa - 15%)\n` +
        `* 💧 **Hệ thống thủy nông**: **Trạm bơm An Trạch 1 & An Trạch 2** bơm nước từ sông Yên qua 4 tuyến kênh chính (2.450m).`
    };
  }

  // 4. QUERY: BÓN PHÂN
  if (
    qClean.includes('phan bon') ||
    qClean.includes('bon phan') ||
    qClean.includes('luong phan') ||
    qClean.includes('dam') ||
    qClean.includes('kali') ||
    qClean.includes('npk') ||
    qClean.includes('sao')
  ) {
    const numMatch = query.match(/(\d+(?:[.,]\d+)?)/);
    let areaM2 = 500;
    if (numMatch) {
      const rawNum = parseFloat(numMatch[1].replace(',', '.'));
      if (qClean.includes('sao')) {
        areaM2 = rawNum * 500;
      } else if (rawNum > 20) {
        areaM2 = rawNum;
      }
    }

    const saoCount = (areaM2 / 500).toFixed(1);
    const ureKg = ((areaM2 / 500) * 10).toFixed(1);
    const lanKg = ((areaM2 / 500) * 20).toFixed(1);
    const kaliKg = ((areaM2 / 500) * 8).toFixed(1);
    const npkKg = ((areaM2 / 500) * 25).toFixed(1);

    return {
      category: 'phan_bon',
      text: `🌿 **QUY TRÌNH BÓN PHÂN CÂN ĐỐI CHO ${areaM2.toLocaleString()} m² LÚA (${saoCount} sào)**\n\n` +
        `📋 **Tổng lượng phân khuyến cáo cho vụ Đông Xuân:**\n` +
        `* ⚪ **Đạm Urê (N)**: **${ureKg} kg**\n` +
        `* 🟤 **Lân Super (P)**: **${lanKg} kg** *(bón lót toàn bộ)*\n` +
        `* 🔴 **Kali Clorua (K)**: **${kaliKg} kg**\n` +
        `* 📦 *Hoặc dùng phân NPK 16-16-8*: **${npkKg} kg**\n\n` +
        `📅 **Lịch bón phân chia làm 3 đợt:**\n` +
        `1. **Bón Lót (Trước bừa cấy)**: 100% Lân + 30% Đạm Urê.\n` +
        `2. **Bón Thúc Lần 1 (7-10 ngày sau cấy)**: 40% Đạm Urê + 30% Kali.\n` +
        `3. **Bón Đón Đòng (40-45 ngày sau cấy)**: 30% Đạm Urê + 70% Kali (giúp bông to, hạt chắc).`
    };
  }

  // 5. QUERY: SOẠN THẢO VĂN BẢN
  if (
    qClean.includes('soan') ||
    qClean.includes('thong bao') ||
    qClean.includes('cong van') ||
    qClean.includes('giay moi') ||
    qClean.includes('to trinh') ||
    qClean.includes('nghi dinh 30')
  ) {
    const todayStr = new Date().toLocaleDateString('vi-VN');

    return {
      category: 'cong_van',
      text: `📜 **DỰ THẢO THÔNG BÁO CHUẨN THỂ THỨC (NGHỊ ĐỊNH 30/2020/NĐ-CP)**\n\n` +
        `\`\`\`text\n` +
        `UBND HUYỆN HÒA VANG          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n` +
        `UBND XÃ HÒA TIẾN                    Độc lập - Tự do - Hạnh phúc\n` +
        `BAN NHÂN DÂN THÔN AN TRẠCH\n` +
        `Số: ... /TB-BND                    Hòa Tiến, ngày ${todayStr}\n\n` +
        `                           THÔNG BÁO\n` +
        `  V/v Lịch Lấy Nước Đổ Ải & Gieo Sạ Vụ Đông Xuân 2025 - 2026\n\n` +
        `Kính gửi: Toàn thể bà con nhân dân các tổ sản xuất thôn An Trạch.\n\n` +
        `Căn cứ thông báo của HTX Nông nghiệp Hòa Tiến và Ban Nhân dân thôn;\n` +
        `Ban Nhân dân thôn An Trạch thông báo lịch điều tiết nước như sau:\n\n` +
        `1. Thời gian vận hành trạm bơm An Trạch 1 & 2: Từ ngày ... đến ngày ...\n` +
        `2. Yêu cầu các hộ chủ động đắp bờ giữ nước, nạo vét mương nội đồng.\n` +
        `3. Cơ cấu giống gieo sạ tập trung: HG12, HG244, J02 theo đúng khung lịch.\n\n` +
        `Đề nghị các Tổ trưởng và bà con nhân dân nghiêm túc thực hiện./.\n\n` +
        `Nơi nhận:                                    TRƯỞNG THÔN\n` +
        `- UBND Xã Hòa Tiến (b/c);\n` +
        `- 8 Tổ Dân Cư (t/h);\n` +
        `- Lưu: VT thôn.                           (Ký, ghi rõ họ tên)\n` +
        `\`\`\`\n\n` +
        `💡 *Cán bộ có thể bấm nút Copy để sử dụng ngay vào công việc điều hành.*`
    };
  }

  // 6. DEFAULT INTELLIGENT SEARCH & ASSISTANT RESPONSE
  return {
    category: 'dan_cu',
    text: `Xin chào! Tôi là **Trợ Lý Ảo An Trạch AI**. Tôi đã được nạp và cập nhật **${knowledgeBase.length} chuyên đề tri thức** chính thức của Thôn An Trạch:\n\n` +
      `* 🏛️ **Thủ tục hành chính**: Đăng ký thường trú/tạm trú, cấp thẻ Căn cước, đăng ký khai sinh liên thông.\n` +
      `* 🏥 **Chính sách & BHYT**: Mức đóng BHYT hộ gia đình 2026, trợ cấp người cao tuổi, hộ nghèo.\n` +
      `* 🌾 **Sản xuất Nông nghiệp**: Quy mô 5 xứ đồng (43,86 ha), giống HG12/HG244/J02, tính lượng phân bón.\n` +
      `* 👥 **Bộ máy & Danh bạ**: Bí thư, Trưởng thôn, Công an viên, Y tế và 8 Tổ trưởng dân cư.\n` +
      `* 🚨 **An ninh trật tự & PCCC**: Số điện thoại đường dây nóng, tổ liên gia an toàn PCCC.\n\n` +
      `👉 *Bạn vui lòng gõ câu hỏi cụ thể hoặc dùng mục Quản Trị AI để bổ sung tri thức mới nhé!*`
  };
}
