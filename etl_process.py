import os
import re
import json
from datetime import datetime, timedelta
import openpyxl

def excel_date_to_str(val):
    if val is None or val == "":
        return ""
    if isinstance(val, (int, float)):
        # Excel date serial number (epoch 1899-12-30)
        try:
            val_int = int(val)
            if val_int > 1000:
                dt = datetime(1899, 12, 30) + timedelta(days=val_int)
                return dt.strftime("%d/%m/%Y")
            else:
                return str(val_int)
        except Exception:
            return str(val)
    elif isinstance(val, datetime):
        return val.strftime("%d/%m/%Y")
    else:
        return str(val).strip()

def clean_phone(val):
    if not val:
        return ""
    s = str(val).strip().replace(" ", "").replace(".", "")
    if s.endswith(".0"):
        s = s[:-2]
    if len(s) == 9 and not s.startswith("0"):
        s = "0" + s
    return s

def clean_cccd(val):
    if not val:
        return ""
    s = str(val).strip().replace(" ", "").replace(".", "")
    if s.endswith(".0"):
        s = s[:-2]
    return s

def escape_sql(val):
    if val is None:
        return "NULL"
    s = str(val).replace("'", "''")
    return f"'{s}'"

def run_etl():
    excel_path = "c:/Antigravity20/DataThon/DuLieu_DanCu_AnTrach_DongBo_Master.xlsx"
    print(f"Loading Excel file: {excel_path}...")
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    ws = wb["DanhSach_ToanBo_Master"]
    
    rows = list(ws.iter_rows(values_only=True))
    header = rows[0]
    data_rows = rows[1:]
    print(f"Total data rows in Sheet 1: {len(data_rows)}")
    
    nhan_khau_list = []
    ho_khau_dict = {}
    
    for idx, r in enumerate(data_rows, start=1):
        stt = r[0] if r[0] is not None else idx
        ma_ho = str(r[1]).strip() if r[1] else f"HK_UNKNOWN_{idx}"
        chu_ho = str(r[2]).strip().upper() if r[2] else ""
        quan_he = str(r[3]).strip() if r[3] else "Khác"
        ho_ten = str(r[4]).strip().upper() if r[4] else ""
        gioi_tinh = str(r[5]).strip() if r[5] else "Chưa rõ"
        
        dob_raw = r[6]
        dob_str = excel_date_to_str(dob_raw)
        
        nam_sinh = r[7]
        try:
            nam_sinh = int(nam_sinh) if nam_sinh else None
        except Exception:
            nam_sinh = None
            
        tuoi = r[8]
        try:
            tuoi = int(tuoi) if tuoi else (2026 - nam_sinh if nam_sinh else None)
        except Exception:
            tuoi = 2026 - nam_sinh if nam_sinh else None
            
        nhom_tuoi = str(r[9]).strip() if r[9] else ""
        so_cmnd_cccd = clean_cccd(r[10])
        loai_giay_to = str(r[11]).strip() if r[11] else ("CCCD 12 số" if len(so_cmnd_cccd) == 12 else ("CMND 9 số" if len(so_cmnd_cccd) == 9 else "Chưa có / Chưa cập nhật"))
        dien_thoai = clean_phone(r[12])
        ho_ten_cha = str(r[13]).strip().upper() if r[13] else ""
        ho_ten_me = str(r[14]).strip().upper() if r[14] else ""
        ma_the_bhyt = clean_cccd(r[15]).upper()
        nhom_bhyt = str(r[16]).strip() if r[16] else ""
        nghe_nghiep = str(r[17]).strip() if r[17] else ""
        dia_chi = str(r[18]).strip() if r[18] else "An Trạch, Hòa Tiến, Hòa Vang, Đà Nẵng"
        to_dan_cu = str(r[19]).strip() if r[19] else "Chưa rõ tổ"
        trang_thai_cu_tru = str(r[20]).strip() if r[20] else "Đang thường trú"
        doi_tuong_dac_thu = str(r[21]).strip() if r[21] else "Bình thường"
        ghi_chu = str(r[22]).strip() if r[22] else ""
        nguon_dong_bo = str(r[23]).strip() if r[23] else ""
        
        item = {
            "stt_excel": int(stt) if str(stt).isdigit() else idx,
            "ma_ho": ma_ho,
            "chu_ho": chu_ho,
            "quan_he_chu_ho": quan_he,
            "ho_ten": ho_ten,
            "gioi_tinh": gioi_tinh,
            "ngay_thang_nam_sinh": dob_str,
            "nam_sinh": nam_sinh,
            "tuoi": tuoi,
            "nhom_tuoi": nhom_tuoi,
            "so_cmnd_cccd": so_cmnd_cccd,
            "loai_giay_to": loai_giay_to,
            "dien_thoai": dien_thoai,
            "ho_ten_cha": ho_ten_cha,
            "ho_ten_me": ho_ten_me,
            "ma_the_bhyt": ma_the_bhyt,
            "nhom_bhyt": nhom_bhyt,
            "nghe_nghiep": nghe_nghiep,
            "dia_chi": dia_chi,
            "to_dan_cu": to_dan_cu,
            "trang_thai_cu_tru": trang_thai_cu_tru,
            "doi_tuong_dac_thu": doi_tuong_dac_thu,
            "ghi_chu": ghi_chu,
            "nguon_dong_bo": nguon_dong_bo
        }
        nhan_khau_list.append(item)
        
        # Group into ho_khau
        if ma_ho not in ho_khau_dict:
            ho_khau_dict[ma_ho] = {
                "ma_ho": ma_ho,
                "ten_chu_ho": chu_ho if chu_ho else ho_ten,
                "so_cmnd_chu_ho": so_cmnd_cccd if quan_he in ["Chủ hộ", "chủ hộ"] else "",
                "so_dien_thoai": dien_thoai if quan_he in ["Chủ hộ", "chủ hộ"] else "",
                "dia_chi": dia_chi,
                "to_dan_cu": to_dan_cu,
                "so_nhan_khau": 1,
                "ghi_chu": ""
            }
        else:
            ho_khau_dict[ma_ho]["so_nhan_khau"] += 1
            if quan_he in ["Chủ hộ", "chủ hộ"]:
                ho_khau_dict[ma_ho]["ten_chu_ho"] = ho_ten
                ho_khau_dict[ma_ho]["so_cmnd_chu_ho"] = so_cmnd_cccd
                if dien_thoai:
                    ho_khau_dict[ma_ho]["so_dien_thoai"] = dien_thoai
                ho_khau_dict[ma_ho]["to_dan_cu"] = to_dan_cu
                ho_khau_dict[ma_ho]["dia_chi"] = dia_chi
                
    print(f"Processed {len(nhan_khau_list)} resident records.")
    print(f"Created {len(ho_khau_dict)} household records.")
    
    # Save JSON files
    with open("c:/Antigravity20/DataThon/seed_nhan_khau.json", "w", encoding="utf-8") as f:
        json.dump(nhan_khau_list, f, ensure_ascii=False, indent=2)
        
    with open("c:/Antigravity20/DataThon/seed_ho_khau.json", "w", encoding="utf-8") as f:
        json.dump(list(ho_khau_dict.values()), f, ensure_ascii=False, indent=2)
        
    # Generate SQL Seed File
    with open("c:/Antigravity20/DataThon/seed_data.sql", "w", encoding="utf-8") as f:
        f.write("-- SEED DATA CHO HỆ THỐNG QUẢN TRỊ DÂN CƯ AN TRẠCH\n\n")
        
        # 1. Insert ho_khau
        f.write("-- 1. INSERT HO_KHAU\n")
        f.write("INSERT INTO public.ho_khau (ma_ho, ten_chu_ho, so_cmnd_chu_ho, so_dien_thoai, dia_chi, to_dan_cu, so_nhan_khau, ghi_chu)\nVALUES\n")
        ho_entries = list(ho_khau_dict.values())
        ho_rows = []
        for h in ho_entries:
            row_str = f"({escape_sql(h['ma_ho'])}, {escape_sql(h['ten_chu_ho'])}, {escape_sql(h['so_cmnd_chu_ho'])}, {escape_sql(h['so_dien_thoai'])}, {escape_sql(h['dia_chi'])}, {escape_sql(h['to_dan_cu'])}, {h['so_nhan_khau']}, {escape_sql(h['ghi_chu'])})"
            ho_rows.append(row_str)
        f.write(",\n".join(ho_rows))
        f.write("\nON CONFLICT (ma_ho) DO NOTHING;\n\n")
        
        # 2. Insert nhan_khau in chunks of 200
        f.write("-- 2. INSERT NHAN_KHAU (2308 BẢN GHI)\n")
        chunk_size = 200
        for i in range(0, len(nhan_khau_list), chunk_size):
            chunk = nhan_khau_list[i:i+chunk_size]
            f.write(f"-- Chunk {i//chunk_size + 1} ({len(chunk)} bản ghi)\n")
            f.write("INSERT INTO public.nhan_khau (stt_excel, ma_ho, chu_ho, quan_he_chu_ho, ho_ten, gioi_tinh, ngay_thang_nam_sinh, nam_sinh, tuoi, nhom_tuoi, so_cmnd_cccd, loai_giay_to, dien_thoai, ho_ten_cha, ho_ten_me, ma_the_bhyt, nhom_bhyt, nghe_nghiep, dia_chi, to_dan_cu, trang_thai_cu_tru, doi_tuong_dac_thu, ghi_chu, nguon_dong_bo)\nVALUES\n")
            nk_rows = []
            for item in chunk:
                nam_val = str(item['nam_sinh']) if item['nam_sinh'] is not None else "NULL"
                tuoi_val = str(item['tuoi']) if item['tuoi'] is not None else "NULL"
                stt_val = str(item['stt_excel']) if item['stt_excel'] is not None else "NULL"
                row_str = f"({stt_val}, {escape_sql(item['ma_ho'])}, {escape_sql(item['chu_ho'])}, {escape_sql(item['quan_he_chu_ho'])}, {escape_sql(item['ho_ten'])}, {escape_sql(item['gioi_tinh'])}, {escape_sql(item['ngay_thang_nam_sinh'])}, {nam_val}, {tuoi_val}, {escape_sql(item['nhom_tuoi'])}, {escape_sql(item['so_cmnd_cccd'])}, {escape_sql(item['loai_giay_to'])}, {escape_sql(item['dien_thoai'])}, {escape_sql(item['ho_ten_cha'])}, {escape_sql(item['ho_ten_me'])}, {escape_sql(item['ma_the_bhyt'])}, {escape_sql(item['nhom_bhyt'])}, {escape_sql(item['nghe_nghiep'])}, {escape_sql(item['dia_chi'])}, {escape_sql(item['to_dan_cu'])}, {escape_sql(item['trang_thai_cu_tru'])}, {escape_sql(item['doi_tuong_dac_thu'])}, {escape_sql(item['ghi_chu'])}, {escape_sql(item['nguon_dong_bo'])})"
                nk_rows.append(row_str)
            f.write(",\n".join(nk_rows))
            f.write(";\n\n")
            
    print("Generated seed_data.sql successfully!")

if __name__ == "__main__":
    run_etl()
