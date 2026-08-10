# Mẹo & lý do lựa chọn

---

## DNS và DoH

YuzuFox để Firefox dùng DNS của hệ điều hành. **Không ép DoH**; `network.trr.*`
giữ nguyên mặc định của Firefox. Resolver của hệ thống (systemd-resolved,
unbound, Pi-hole, tùy bạn) xử lý DNS — trình duyệt đứng ngoài đường truyền đó.

### Bật DoH

Nếu bạn thích DoH, thêm vào `user.js`:

```js
user_pref("network.trr.mode", 2);                     // 2 = chỉ dùng DoH
user_pref("network.trr.uri", "https://dns.quad9.net/dns-query");
user_pref("network.trr.resolvers", '[{"name":"Quad9","url":"https://dns.quad9.net/dns-query"}]');
```

Đổi `quad9.net` sang Cloudflare, NextDNS hoặc Mullvad. Ý nghĩa các chế độ:

| `network.trr.mode` | Hành vi |
|---|---|
| `0` (mặc định) | Tắt — dùng resolver hệ thống |
| `2` | Chỉ DoH, không dự phòng |
| `3` | DoH có dự phòng qua DNS hệ thống |
| `5` | DoH tường minh, không dùng resolver hệ thống |

**Chế độ 2** an toàn nhất nếu chọn hướng này — *tự lặng lẽ rơi về DNS thường
sẽ phá vỡ ý nghĩa của việc bật DoH.*

---

## Safe Browsing

Safe Browsing cốt lõi (malware + phishing) **được bật** theo mặc định của
Firefox. Firefox chỉ gửi hash-prefix 32-bit cho Google rồi tự đối chiếu cục
bộ — không có URL đầy đủ nào rời khỏi trình duyệt. Chặn ở tầng DNS (Pi-hole,
NextDNS, Quad9) cùng filter lists của uBlock Origin là lớp bổ sung phía trên,
không phải sự thay thế.

Điều duy nhất YuzuFox tắt là **kiểm tra uy tín file tải về từ xa**
(`browser.safebrowsing.downloads.remote.enabled = false`) — cùng lựa chọn với
Arkenfox. Tính năng đó tải siêu dữ liệu file lên Google sau mỗi lần tải, trong
khi mức bảo vệ thêm vào là rất nhỏ nếu bạn đã có chặn ở tầng DNS.

### Kiểm tra bạn có chặn DNS không (gia cố tùy chọn)

- **Pi-hole / AdGuard Home** — bạn tự duy trì blocklist
- **NextDNS / Quad9** — nhà cung cấp DNS lọc domain độc hại/phishing từ phía trên
- **DNS mặc định của nhà mạng** — Safe Browsing vẫn tự bảo vệ bạn; tầng DNS chỉ
  là thêm vào

Nếu muốn bật lại kiểm tra uy tín file tải về từ xa:

```js
user_pref("browser.safebrowsing.downloads.remote.enabled", true);
```

---

## Công cụ tìm kiếm

DuckDuckGo là mặc định (kể cả cửa sổ riêng tư). Năm engine được cấu hình qua
`policies.json` — dùng alias bằng cách gõ trước truy vấn trong thanh địa chỉ:

| Engine          | Alias | Là gì                                                         |
| --------------- | ----- | ------------------------------------------------------------- |
| DuckDuckGo      | —     | Mặc định; kết quả thân thiện quyền riêng tư                   |
| Startpage       | `sp`  | Ủy quyền kết quả Google nhưng không bị Google theo dõi        |
| DuckDuckGo Lite | `dl`  | DDG chỉ-text — nhanh, tối giản, tốt cho mạng chậm             |
| SearXNG         | `sx`  | Metasearch tổng hợp nhiều engine, không theo dõi              |
| MetaGer         | `mg`  | Metasearch của Đức, ưu tiên quyền riêng tư                    |

Ví dụ: `sx tai nghe chống ồn tốt nhất` tìm thẳng trên SearXNG.

Mặc định/alias nằm trong `policies.json` (`SearchEngines`) nên áp dụng cho mọi
profile. Muốn đổi engine mặc định, sửa file đó.

---

## Tiện ích mở rộng

uBlock Origin là tiện ích duy nhất YuzuFox cài. Thêm nhiều trình chặn khác
(CanvasBlocker, Privacy Badger, HTTPS Everywhere…) sẽ **phản tác dụng**:

- uBO và khả năng chống vân tay (fingerprinting) tích hợp của Firefox đã bao
  phủ canvas, user-agent, rút gọn referrer và chống theo dõi.
- Trình chặn thừa ghi đè chồng chéo quy tắc, làm hỏng trang, và khiến dấu vân
  tay của bạn **độc nhất hơn** — mỗi tiện ích có các pattern hành vi nhận
  dạng được.
- Nhiều code hơn = bề mặt tấn công lớn hơn.

Dùng uBO + một tiện ích bạn thực sự cần (Bitwarden, Tridactyl,
Violentmonkey). **Một, không phải mười.**

---

## Trình quản lý mật khẩu

Trình quản lý mật khẩu tích hợp của Firefox bị tắt:

```js
browser.formfill.enable = false
signon.rememberSignons = false
signon.autofillForms = false
```

Hãy dùng **trình quản lý mật khẩu ngoài**. Nó giữ thông tin xác thực được mã
hóa ngoài trình duyệt và đồng bộ giữa các thiết bị:

| Trình quản lý        | Loại   | Ghi chú                                                                 |
| -------------------- | ------ | ----------------------------------------------------------------------- |
| [Bitwarden](https://bitwarden.com/)        | Đám mây | Gói miễn phí, mã nguồn mở, tiện ích trình duyệt + di động              |
| [KeePassXC](https://keepassxc.org/)        | Cục bộ | File .kdbx ngoại tuyến, đồng bộ qua Syncthing/Nextcloud                 |
| [pass](https://www.passwordstore.org/)     | CLI    | GPG + Git, tối giản, triết lý Unix                                      |

**Khuyến nghị:** Bitwarden cho đa số người dùng (dễ nhất), KeePassXC nếu muốn
kiểm soát ngoại tuyến hoàn toàn, `pass` nếu bạn sống trong terminal.

Nếu bắt buộc phải dùng trình quản lý của Firefox, bật lại:

```js
user_pref("browser.formfill.enable", true);
user_pref("signon.rememberSignons", true);
```

---

## Filter lists theo khu vực

YuzuFox đi kèm bộ filter uBO phổ quát. Sau khi cài, mở uBlock Origin →
*Dashboard* → *Filter lists* để bật các filter theo khu vực (tiếng Việt, RU
AdList, v.v. — xem
[hướng dẫn filterlists của yokoffing](https://github.com/yokoffing/filterlists)).
Không ép bất kỳ danh sách khu vực nào lên tất cả mọi người.

---

## Firefox fork và zero-day

Zen, Waterfox, Pulse, Floorp và các fork tương tự do đội ngũ nhỏ duy trì,
vá lỗ hổng bảo mật chậm hơn Mozilla. Một zero-day bị khai thác ngoài tự nhiên
vài giờ sau khi công bố có thể nằm không được vá trong fork suốt nhiều tuần.

YuzuFox nhắm tới **Firefox gốc** để việc vá zero-day đến trực tiếp từ Mozilla.
Bạn có thể copy các file cấu hình sang fork, nhưng bản thân fork vẫn là *nút
thắt* — mỗi lớp trung gian giữa bạn và chu kỳ phát hành của Mozilla là độ trễ
thêm vào.

---

## Cập nhật & bảo trì

Chạy lại installer **chính là** cập nhật — nó luôn tải file mới nhất từ `main`
và so sánh với bản đang cài:

- **File không đổi** được bỏ qua (`policies.json: up to date`).
- **File thay đổi** được thay thế; `user.js` cũ tự động được sao lưu thành
  `user.js.yuzubak`.

```bash
# Linux / macOS
bash install.sh --all

# Windows
.\install.ps1 -All
```

Sau một bản cập nhật lớn, hãy dọn pref cũ. Những pref YuzuFox đã gỡ khỏi
`user.js` có thể vẫn nằm trong `prefs.js` và tiếp tục áp dụng giá trị cũ (ví
dụ khối Safe Browsing cũ sẽ giữ malware protection ở trạng thái tắt dù
`user.js` không còn tắt nó nữa):

```bash
# Linux / macOS — xem trước trước, rồi dọn mọi profile
bash prefsCleaner.sh --dry-run
bash prefsCleaner.sh --all

# Windows
.\prefsCleaner.ps1 -DryRun
.\prefsCleaner.ps1 -All
```

Mỗi `prefs.js` được dọn đều được sao lưu thành `prefs.js.yuzubak`. Đóng
Firefox trước khi chạy.

---

## Thông báo & Push

Web Push giữ nguyên mặc định của Firefox (bật), nhưng **quyền thông báo mặc
định bị chặn** (`permissions.default.desktop-notification = 2`). Trang web
vẫn có thể xin quyền, và bạn có thể cho phép từng trang:

1. Truy cập trang web.
2. Bấm biểu tượng quyền trên thanh địa chỉ (hoặc chuông thông báo trên hộp
   thoại xin quyền) và chọn **Cho phép**.

Hoặc quản lý mọi thứ ở một chỗ: `about:preferences#privacy` → *Permissions* →
*Notifications* → *Settings*. Ở đó bạn cũng có thể chặn một trang cứ đòi hỏi.

---

## Định vị (Geolocation) & WebRTC

Định vị **bị chặn theo mặc định** (`permissions.default.geo = 2`) và phương
thức dự phòng dựa trên mạng (dịch vụ định vị của Google) bị tắt. Trang web
vẫn có thể xin phép, và bạn cho phép từng trang giống như thông báo (biểu
tượng quyền trên thanh địa chỉ). Nếu trang thực sự cần vị trí (bản đồ, thời
tiết), hãy cấp ở đó.

WebRTC chỉ để lộ **IP công cộng** của bạn — địa chỉ LAN (192.168.x.x) không
bao giờ bị lộ cho trang web
(`media.peerconnection.ice.default_address_only`). Gọi video, chia sẻ màn hình
và truyền file qua WebRTC vẫn hoạt động bình thường; chỉ địa chỉ mạng nội bộ
bị ẩn đi.

---

## Containers (Vùng chứa)

Tab container cô lập bộ nhớ first-party theo từng tab: việc vs cá nhân, dev
vs prod, một tài khoản mỗi trang — tất cả trong một cửa sổ.

- **Mở tab container**: nhấn giữ nút **+** (tab mới) → chọn container
  (`privacy.userContext.longPressBehavior = 2`). Nếu nhấn giữ không có tác
  dụng, picker cũng nằm trong menu: *New Container Tab*.
- Hoặc cài tiện ích chính thức
  [Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/)
  cho quy tắc theo trang ("luôn mở example.com trong Work").

Container **không** thay thế VPN hay một profile trình duyệt riêng — chúng
tách cookie/bộ nhớ, không tách danh tính mạng.

---

## Xử lý sự cố

### Firefox không khởi động hoặc trang không tải

Đóng Firefox, rồi tạm thời tắt phần tinh chỉnh theo profile:

```bash
mv <profile>/user.js <profile>/user.js.off
```

Khởi động Firefox. Nếu chạy được, vấn đề nằm trong `user.js`. Khôi phục bản
sao lưu:

```bash
mv <profile>/user.js.yuzubak <profile>/user.js
```

Nếu không có bản sao lưu, xóa `user.js.off` và chạy trình gỡ cài đặt (xem
[Gỡ cài đặt hoàn toàn](#g-c-i-t-ho-n-to-n)).

Nếu Firefox vẫn không khởi động, gỡ các file toàn hệ thống:

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall --all
```

### Một trang web bị hỏng

Trước tiên thử tắt uBlock Origin trên trang đó. Nếu trang vẫn hỏng, kiểm tra
không có `user.js`:

1. Đóng Firefox.
2. Đổi tên `<profile>/user.js` thành `<profile>/user.js.off`.
3. Khởi động lại Firefox và mở lại trang.

Nếu trang chạy được, nguyên nhân là một pref trong `user.js`. Khôi phục
`user.js.yuzubak` nếu có, hoặc thu hẹp vấn đề bằng cách bật lại từng nửa số
pref một lần.

### Lỗi DNS/DoH

Nếu trang không phân giải được, đảm bảo Firefox đang dùng resolver hệ thống.
Trong `about:config`, kiểm tra:

```js
network.trr.mode = 0
```

Nếu bạn đã bật DoH trước đó, xem [DNS và DoH](#dns-v-doh) để chọn cấu hình
đúng. Bạn cũng có thể xóa cache DNS tại `about:networking#dns`.

### Thiếu cảnh báo Safe Browsing

Safe Browsing cốt lõi (malware + phishing) được bật theo mặc định. Nếu không
có cảnh báo, thứ gì đó khác đã tắt chúng — kiểm tra dưới
`about:preferences#privacy` → *Security* xem "Block dangerous and deceptive
content" và "Block dangerous downloads" có được đánh dấu không, hoặc xác minh
trong `about:config` rằng `browser.safebrowsing.malware.enabled` và
`browser.safebrowsing.phishing.enabled` là `true`.

Tính năng Safe Browsing duy nhất YuzuFox để tắt là *kiểm tra uy tín file tải
về từ xa* (`browser.safebrowsing.downloads.remote.enabled`) — xem
[Safe Browsing](#safe-browsing) để biết lý do và cách bật lại.

### Gỡ cài đặt hoàn toàn

Chạy lệnh gỡ cài đặt theo nền tảng của bạn:

```bash
# Linux / macOS
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall --all
```

```powershell
# Windows
$s = irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1
& ([scriptblock]::Create($s)) -Uninstall
```

Sau đó khôi phục bản sao lưu của từng profile:

```bash
mv <profile>/user.js.yuzubak <profile>/user.js
```

Nếu `user.js.yuzubak` không tồn tại, tức installer không có `user.js` trước đó
để sao lưu. Trong trường hợp đó, chỉ cần xóa `<profile>/user.js`.

Khởi động lại Firefox.

### Bị từ chối quyền trên Linux/macOS

Installer dùng `sudo` cho các đường dẫn toàn hệ thống (`/etc/firefox`,
`/usr/lib/firefox`, `/Applications/Firefox.app`). Đảm bảo tài khoản của bạn có
quyền sudo và Firefox đang không chạy. Đừng chạy bước cấu hình profile bằng
sudo, vì `user.js` thuộc về thư mục profile của riêng bạn.

Nếu cần cài thủ công:

```bash
sudo mkdir -p /etc/firefox/policies
sudo cp policies.json /etc/firefox/policies/policies.json
sudo mkdir -p /usr/lib/firefox/browser/defaults/preferences
sudo cp yuzu.js /usr/lib/firefox/browser/defaults/preferences/yuzu.js
```

Trên macOS, thay `/usr/lib/firefox/...` bằng các đường dẫn bên trong
`/Applications/Firefox.app/Contents/Resources/`.

---

## Ghi công

`yuzu.js` và `user.js` kế thừa từ
[Betterfox](https://github.com/yokoffing/Betterfox),
[Arkenfox](https://github.com/arkenfox/user.js) và
[cachyos-firefox-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings).
Installer được đối chiếu với [tài liệu admin Firefox](https://firefox-admin-docs.mozilla.org/)
và [policy templates](https://github.com/mozilla/policy-templates).

## Sửa đổi pref

`user.js` được sinh tự động. **Đừng sửa trực tiếp `user.js`** — thay đổi của
bạn sẽ bị ghi đè vào lần chạy `python3 build.py` tiếp theo.

Thay vào đó, sửa file nguồn tương ứng trong `src/user.js/`:

| File nguồn | Nội dung |
|---|---|
| `00-header.js` | Tiêu đề dự án |
| `10-network.js` | DNS, mạng, kết nối dự đoán, OCSP/CRLite |
| `20-privacy.js` | HTTPS-only, chống vân tay, referrer, GPC, cookie |
| `30-security.js` | Safe Browsing, sandbox tải về |
| `40-telemetry-connections.js` | Khởi động, push, attribution |
| `45-performance.js` | Cache, rendering, JIT/GC, network feeds |
| `50-ui-qol.js` | Tinh chỉnh UI, thanh URL, container, cuộn trang |
| `60-os-specific.js` | Các khối Linux, Windows, macOS |

Sau khi sửa, chạy `python3 build.py` để sinh lại `user.js` và `user.js.lock`
trước khi commit.
