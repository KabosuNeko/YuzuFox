# YuzuFox

<p><br/></p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="yuzufox Logo" style="width: 192px" />
</p>
<p><br/></p>

**Firefox cứng hóa, không bloat, cho dùng hằng ngày.**

---

## Tổng quan

YuzuFox cấu hình Firefox theo **hai tầng**:

| Tầng          | File                            | Phạm vi                                                          |
| ------------- | ------------------------------- | ---------------------------------------------------------------- |
| Toàn hệ thống | `yuzu.js` + `policies.json`      | Mọi profile, pref bị khóa (locked), cài một lần với sudo         |
| Theo profile  | `user.js`                       | Tinh chỉnh tùy chọn theo từng profile, cập nhật độc lập          |

- **`yuzu.js`** — nền hệ thống: chặn telemetry, gỡ bloat Mozilla,
  WebRender/GPU, locale, tích hợp desktop. Pref bị khóa, cài một lần.
- **`policies.json`** — chính sách doanh nghiệp: tự cài uBlock Origin, đặt
  DuckDuckGo làm mặc định, tắt telemetry và Pocket ở cấp chính sách.
- **`user.js`** — tinh chỉnh theo profile: quyền riêng tư & bảo mật, hiệu
  năng, trải nghiệm. *Được sinh tự động từ `src/user.js/*.js` bằng `build.py`.*
  Cài vào các profile bạn dùng. Cập nhật tách biệt với nền hệ thống.
- **`install.sh`** — script duy nhất cho Linux/macOS: toàn hệ thống + theo
  profile.
- **`install.ps1`** — tương tự cho Windows.

### Vì sao có hai file cấu hình

`yuzu.js` hiếm khi thay đổi — chỉ khi Mozilla đổi tên/deprecate một pref. Bạn
cài một lần và nó giữ vai trò **sàn cứng (locked)** cho mọi profile.

`user.js` theo sát các bản cập nhật Firefox hơn. Pref về quyền riêng tư hay bị
đổi tên hoặc loại bỏ; file này hấp thụ những thay đổi đó. **Cập nhật vài tuần
một lần** mà không bao giờ đụng tới nền hệ thống.

Việc tách riêng cũng ngăn lựa chọn theo profile bị ghi đè bởi một lần cài đặt
toàn hệ thống.

## Cài đặt

### Linux / macOS

Tự phát hiện nền tảng, cài phần toàn hệ thống (hỏi sudo), sau đó liệt kê các
profile và hỏi bạn muốn cài `user.js` vào những profile nào.

> **Cài qua pipe không hỏi được.** `curl ... | bash` đẩy script qua stdin,
> nên bảng chọn profile không có bàn phím để đọc. Hãy tải script về trước rồi
> chạy cục bộ:

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh
```

> Để cài không tương tác (mọi profile, không hỏi, chạy được qua pipe):

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --all
```

Installer từ chối hỏi qua pipe và in ra chính xác hai lệnh trên.

| | policies.json | yuzu.js |
|---|---|---|
| **Linux** | `/etc/firefox/policies/policies.json` | `/usr/lib/firefox/browser/defaults/preferences/yuzu.js` |
| **macOS** | `/Applications/Firefox.app/.../distribution/policies.json` | `/Applications/Firefox.app/.../browser/defaults/preferences/yuzu.js` |

Các tùy chọn:

```bash
bash install.sh                 # chọn profile tương tác
bash install.sh --system-only   # chỉ yuzu.js + policies.json
bash install.sh --profiles-only # chỉ user.js (không cần sudo)
bash install.sh --all           # mọi profile, không hỏi
bash install.sh --dry-run       # xem trước, không ghi gì
```

`user.js` hiện có được **sao lưu** thành `user.js.yuzubak`.

### Cập nhật

Chạy lại installer **chính là** cập nhật: nó luôn tải file mới nhất từ `main`
và so sánh với bản đang cài. File không đổi được bỏ qua ("up to date"); file
thay đổi được thay thế (kèm sao lưu `user.js` cũ).

### Dọn pref cũ (stale prefs)

Pref đã bị gỡ khỏi `user.js` có thể vẫn nằm trong `prefs.js` của profile và
tiếp tục áp dụng giá trị cũ (ví dụ khối Safe Browsing cũ sẽ giữ malware
protection ở trạng thái tắt dù `user.js` không còn tắt nó nữa). `prefsCleaner`
đưa chúng về mặc định của Firefox:

```bash
# Linux / macOS
bash prefsCleaner.sh --dry-run   # xem trước
bash prefsCleaner.sh --all       # dọn mọi profile

# Windows
.\prefsCleaner.ps1 -DryRun
.\prefsCleaner.ps1 -All
```

Mỗi `prefs.js` được sao lưu thành `prefs.js.yuzubak` trước khi dọn. Đóng
Firefox trước khi chạy.

### Windows

Mở PowerShell ở chế độ **Administrator**, tải script về và chạy cục bộ:

```powershell
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1
```

> Nếu execution policy chặn file `.ps1`, bỏ qua cho lần chạy này:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Để cài không tương tác (mọi profile, không hỏi), thêm `-All`:

```powershell
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1 -All
```

| File | Đường dẫn |
|---|---|
| policies.json | `%ProgramFiles%\Mozilla Firefox\distribution\policies.json` |
| yuzu.js | `%ProgramFiles%\Mozilla Firefox\browser\defaults\preferences\yuzu.js` |
| user.js | các profile đã chọn trong `%APPDATA%\Mozilla\Firefox\Profiles\` |

## Gỡ cài đặt

```bash
# Linux / macOS — mọi profile, không hỏi xác nhận (chạy được qua pipe)
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall --all

# Hoặc tải về trước để có bước xác nhận [y/N] tương tác
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh --uninstall
```

```powershell
# Windows
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1 -Uninstall
```

## Đọc thêm

Xem **[TIPS.md](TIPS.md)** để hiểu lý do chọn DNS/DoH, Safe Browsing, công cụ
tìm kiếm, tiện ích mở rộng và các quyết định liên quan zero-day.

## Đóng góp

`user.js` được sinh từ các file nguồn theo mô-đun trong `src/user.js/`. Muốn
đổi một pref, hãy sửa file nguồn tương ứng rồi chạy `python3 build.py`. CI
đảm bảo `user.js` và `user.js.lock` luôn đồng bộ qua `build.py --check`.
`yuzu.js` và `policies.json` vẫn là các file độc lập.

## Ghi công

[Betterfox](https://github.com/yokoffing/Betterfox) ·
[Arkenfox](https://github.com/arkenfox/user.js) ·
[cachyos-firefox-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings) ·
[Tài liệu admin Firefox](https://firefox-admin-docs.mozilla.org/)
