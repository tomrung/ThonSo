import json

def generate():
    with open('c:/Antigravity20/DataThon/seed_nhan_khau.json', 'r', encoding='utf-8') as f:
        nk = json.load(f)
    with open('c:/Antigravity20/DataThon/seed_ho_khau.json', 'r', encoding='utf-8') as f:
        hk = json.load(f)

    for idx, item in enumerate(nk, 1):
        item['id'] = f'nk-{idx}'
    for idx, item in enumerate(hk, 1):
        item['id'] = f'hk-{idx}'

    with open('c:/Antigravity20/DataThon/src/data/residentData.ts', 'w', encoding='utf-8') as f:
        f.write('import { NhanKhau, HoKhau } from "../types";\n\n')
        f.write('export const SEED_NHAN_KHAU: NhanKhau[] = ')
        f.write(json.dumps(nk, ensure_ascii=False, indent=2))
        f.write(';\n\n')
        f.write('export const SEED_HO_KHAU: HoKhau[] = ')
        f.write(json.dumps(hk, ensure_ascii=False, indent=2))
        f.write(';\n')

    print(f"Generated residentData.ts with {len(nk)} residents and {len(hk)} households!")

if __name__ == '__main__':
    generate()
