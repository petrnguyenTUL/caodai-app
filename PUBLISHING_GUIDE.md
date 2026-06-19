# 📌 HƯỚNG DẪN ĐĂNG “Cao Đài Vegetarian 365” LÊN APP STORE & GOOGLE PLAY

> **Đọc trước — quan trọng:** Tôi đã tạo cho bạn **toàn bộ mã nguồn + icon + ảnh store + cấu hình đóng gói native** — tức là một bộ “sẵn sàng phát hành”. Tuy nhiên, **việc bấm nút đăng lên App Store/Google Play không thể làm thay bạn** vì bắt buộc phải: đăng nhập tài khoản nhà phát triển của chính bạn, ký số (signing) bằng chứng chỉ của bạn, và chờ Apple/Google xét duyệt. Dưới đây là các bước để bạn (hoặc một lập trình viên) hoàn tất trong vài giờ.

---

## 💰 KIẾM TIỀN BẰNG QUẢNG CÁO (AdMob)

App đã được tích hợp sẵn **3 loại quảng cáo Google AdMob**: Quảng cáo khi mở ứng dụng (App Open), Quảng cáo biểu ngữ (Banner) và Quảng cáo xen kẽ (Interstitial). Xem hướng dẫn chi tiết cách lấy ID thật và bật kiếm tiền tại file **`ADMOB_SETUP.md`**.

---

## 0. Tổng quan 3 cách phát hành

| Cách | iOS (App Store) | Android (Google Play) | Độ khó |
|---|---|---|---|
| **A. Capacitor** (khuyên dùng) | ✅ | ✅ | Trung bình – cần máy Mac cho iOS |
| **B. PWABuilder** | ✅ (xuất Xcode) | ✅ (xuất .aab) | Dễ – làm qua web |
| **C. Bubblewrap (TWA)** | ❌ | ✅ | Dễ cho riêng Android |

Để có mặt trên **cả hai** store, cách **A (Capacitor)** là gọn nhất vì dùng chung một bộ mã.

---

## 1. Chuẩn bị tài khoản & công cụ

**Tài khoản nhà phát triển (bắt buộc):**
- 🍎 **Apple Developer Program** — **99 USD/năm** — https://developer.apple.com/programs/ (cần Apple ID + thông tin thuế/pháp lý; duyệt 1–2 ngày).
- 🤖 **Google Play Console** — **25 USD trả một lần** — https://play.google.com/console/ .

**Công cụ:**
- Máy **macOS + Xcode** (bắt buộc cho iOS — Apple không cho build iOS trên Windows).
- **Android Studio** (cho Android).
- **Node.js 18+** (để chạy Capacitor).
- Nếu không có Mac: có thể thuê Mac cloud (MacStadium, MacinCloud) hoặc dùng dịch vụ build iOS (Codemagic, EAS).

---

## 2. Cách A — Đóng gói bằng Capacitor (iOS + Android)

Mở terminal trong thư mục `caodai_app/`:

```bash
# 1) Cài phụ thuộc
npm install

# 2) Khởi tạo (nếu cần) — cấu hình đã có sẵn trong capacitor.config.json
npx cap init "Cao Dai Vegetarian 365" com.longbao.caodaivegetarian365 --web-dir=www

# 3) Thêm nền tảng
npx cap add android
npx cap add ios        # chỉ chạy được trên macOS

# 4) Đồng bộ mã web vào app native
npx cap sync
```

> `appId` hiện đặt là `com.longbao.caodaivegetarian365`. Bạn có thể đổi thành tên miền đảo ngược của riêng bạn trong `capacitor.config.json` (ví dụ `com.tencaocua.vegetarian365`).

### 2a. Android → Google Play
```bash
npx cap open android      # mở Android Studio
```
Trong Android Studio:
1. **Build > Generate Signed Bundle / APK > Android App Bundle (.aab)**.
2. Tạo **keystore** mới (lưu file `.jks` + mật khẩu thật kỹ — mất là không cập nhật app được nữa!).
3. Chọn **release**, build ra file `app-release.aab`.
4. Tải `.aab` lên **Google Play Console > Create app > Production > Create release**.

### 2b. iOS → App Store
```bash
npx cap open ios          # mở Xcode (trên Mac)
```
Trong Xcode:
1. Chọn **Signing & Capabilities** → đăng nhập Apple ID, chọn Team.
2. Đặt **Bundle Identifier** = `com.longbao.caodaivegetarian365`.
3. Cắm điện thoại thật hoặc chọn “Any iOS Device” → **Product > Archive**.
4. **Distribute App > App Store Connect > Upload**.
5. Vào https://appstoreconnect.apple.com tạo app mới, chọn build vừa upload, điền thông tin → **Submit for Review**.

---

## 3. Cách B — PWABuilder (dễ nhất, làm qua web)

1. Đưa thư mục `www/` lên một hosting có HTTPS (Netlify, Vercel, GitHub Pages, Cloudflare Pages — miễn phí). Bạn sẽ có một URL dạng `https://...`.
2. Vào **https://www.pwabuilder.com** → dán URL đó → bấm **Start**.
3. PWABuilder kiểm tra manifest + service worker (app này đã có đủ) → bấm **Package for stores**:
   - **Android** → tải gói `.aab` (đã ký sẵn hoặc hướng dẫn ký) → upload lên Google Play Console.
   - **iOS** → tải project Xcode → mở trên Mac → Archive → upload như mục 2b.

---

## 4. Cách C — Bubblewrap (chỉ Android, TWA)
```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://<URL-cua-ban>/manifest.webmanifest
bubblewrap build      # tạo app-release.aab + keystore
```
Upload `.aab` lên Google Play Console.

---

## 5. Tài nguyên store đã có sẵn trong gói này

Trong thư mục `store/` và `www/icons/`:

| File | Dùng cho |
|---|---|
| `www/icons/icon-1024.png` | **App icon 1024×1024** (App Store bắt buộc) |
| `www/icons/icon-512.png` | **Play Store icon 512×512** |
| `www/icons/icon-maskable-512.png` | Icon thích ứng Android |
| `store/feature_graphic_1024x500.png` | **Feature graphic** (Google Play bắt buộc) |
| `store/screen1_home.png`, `screen2_calendar.png`, `screen3_ai.png` | **Screenshot** cho cả hai store |

> Mẹo: chụp thêm screenshot trực tiếp từ điện thoại sau khi cài app để có ảnh đúng tỉ lệ màn hình thiết bị (iPhone 6.7", 6.5" và Android đều cần các kích thước riêng).

---

## 6. Nội dung khai báo store (chuẩn bị trước)

- **Tên app:** Cao Đài Vegetarian 365
- **Tên ngắn:** Vegetarian 365
- **Danh mục:** Lifestyle / Food & Drink hoặc Health & Fitness
- **Mô tả ngắn:** *Lịch ngày chay âm lịch, thực đơn & công thức chay, kinh Cao Đài — hoạt động offline.*
- **Mô tả đầy đủ:** (xem gợi ý trong file `STORE_LISTING.md`)
- **Chính sách bảo mật (URL):** Bắt buộc — đăng `PRIVACY_POLICY.md` lên web công khai rồi dán link.
- **Phân loại độ tuổi:** 4+ / Everyone.
- **Giá:** Miễn phí (đề xuất).

---

## 7. Checklist trước khi bấm “Submit”

- [ ] Đã có tài khoản Apple Developer / Google Play Console.
- [ ] Đã đổi `appId` thành ID của riêng bạn (nếu muốn).
- [ ] Đã build `.aab` (Android) và/hoặc archive (iOS) thành công.
- [ ] Đã tải icon, feature graphic, screenshot lên store.
- [ ] Đã đăng URL chính sách bảo mật.
- [ ] Đã đối chiếu nội dung kinh với nguồn chính thức.
- [ ] Đã kiểm tra app chạy offline trên thiết bị thật.

---

## 8. Câu hỏi thường gặp

**Hỏi: App bị từ chối vì “chỉ là website đóng gói”?**
Apple (guideline 4.2) đôi khi từ chối app webview quá đơn giản. App này có nhiều tính năng gốc (lịch chay, máy tính sức khỏe, trợ lý, hoạt động offline) nên thường đạt. Nếu cần, bổ sung thông báo đẩy (push) hoặc tính năng native qua plugin Capacitor.

**Hỏi: Không có máy Mac thì sao?**
Dùng dịch vụ build cloud (Codemagic, EAS Build) hoặc thuê Mac cloud để archive iOS.

**Hỏi: Muốn tôi thêm tính năng (thông báo nhắc giờ thật, đồng bộ đám mây, thêm công thức…)?**
Nhắn tôi — mã nguồn đã tách module rõ ràng (`data.js`, `app.js`) nên dễ mở rộng.
