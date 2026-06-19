# 💰 HƯỚNG DẪN GẮN QUẢNG CÁO ADMOB ĐỂ CÓ THU NHẬP

App đã được tích hợp sẵn **3 loại quảng cáo Google AdMob**:

| Loại quảng cáo | Tiếng Việt | Khi nào hiện |
|---|---|---|
| **App Open Ad** | Quảng cáo khi mở ứng dụng | Khi mở app & khi quay lại app |
| **Banner Ad** | Quảng cáo biểu ngữ | Dải nhỏ cố định ở đáy màn hình |
| **Interstitial Ad** | Quảng cáo xen kẽ (toàn màn hình) | Sau mỗi 4 lần chuyển tab |

> ⚙️ Mã đã cài sẵn trong `www/js/ads.js`, `www/index.html`, `www/css/style.css` và khai báo plugin trong `package.json`. Hiện đang chạy bằng **ID test của Google** (an toàn, không tạo thu nhập thật). Làm theo các bước dưới để chuyển sang **ID thật → kiếm tiền**.

---

## Bước 1 — Tạo tài khoản AdMob
1. Vào **https://admob.google.com** → đăng nhập bằng Gmail.
2. Tạo tài khoản, khai thông tin & **liên kết tài khoản nhận tiền** (giống bước nhận tiền ở hướng dẫn Google Play).

## Bước 2 — Tạo App trong AdMob
1. **Apps → Add app → Android**.
2. Nếu app đã lên Google Play thì chọn từ danh sách; nếu chưa thì chọn "Chưa, app chưa đăng".
3. Sau khi tạo, AdMob cho bạn một **App ID** dạng:
   `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY` (có dấu `~`).

## Bước 3 — Tạo 3 Ad Unit (đơn vị quảng cáo)
Vào **App → Ad units → Add ad unit**, tạo lần lượt:
- **App open** → copy ID (dạng `ca-app-pub-...XXXX/....`)
- **Banner** → copy ID
- **Interstitial** → copy ID

> Lưu ý: **App ID** có dấu `~`, còn **Ad unit ID** có dấu `/`. Đừng nhầm hai loại này.

## Bước 4 — Dán ID thật vào app
Mở file **`www/js/ads.js`** và sửa:

```js
var USE_TEST_ADS = false;   // <-- đổi true thành false để dùng ID thật

var REAL = {
  appOpen:      'ca-app-pub-1234567890123456/1111111111', // dán App open ID
  banner:       'ca-app-pub-1234567890123456/2222222222', // dán Banner ID
  interstitial: 'ca-app-pub-1234567890123456/3333333333'  // dán Interstitial ID
};
```

## Bước 5 — Khai báo App ID trong AndroidManifest (BẮT BUỘC)
Sau khi chạy `npx cap add android` và `npx cap sync`, mở file:
`android/app/src/main/AndroidManifest.xml`

Thêm thẻ `<meta-data>` này vào **bên trong** thẻ `<application>` (thay bằng App ID `~` của bạn):

```xml
<application ...>
    <!-- ... -->
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
</application>
```

> ⚠️ Nếu thiếu thẻ này, app sẽ **crash ngay khi mở**. Đây là lỗi phổ biến nhất khi gắn AdMob.
> Khi còn test, có thể dùng App ID test của Google: `ca-app-pub-3940256099942544~3347511713`.

## Bước 6 — Đồng bộ & build lại
```bash
npm install        # cài plugin @capacitor-community/admob & @capacitor/app
npx cap sync       # đồng bộ plugin vào project Android
npx cap open android
```
Build file **.aab** như trong PUBLISHING_GUIDE.md rồi tải lên Google Play.

---

## ⚠️ Lưu ý quan trọng để KHÔNG bị khoá tài khoản AdMob
- **TUYỆT ĐỐI không tự bấm vào quảng cáo của chính mình** (kể cả nhờ người thân bấm) → Google sẽ khoá tài khoản vĩnh viễn.
- Trong lúc phát triển/thử nghiệm **luôn để `USE_TEST_ADS = true`** (đang là mặc định).
- Chỉ chuyển sang ID thật khi app chuẩn bị phát hành cho người dùng thật.
- Không đặt quảng cáo che nút bấm hay gây nhấn nhầm (vi phạm chính sách).
- App có quảng cáo → khi khai "**Ads**" trong Play Console phải chọn **Có (Yes)**.

## Tuỳ chỉnh thêm (không bắt buộc)
Trong `www/js/ads.js`:
- `INTERSTITIAL_EVERY = 4;` → đổi số lần chuyển tab trước khi hiện quảng cáo xen kẽ (số càng lớn càng ít làm phiền).
- Đổi `adSize: 'BANNER'` thành `'ADAPTIVE_BANNER'` nếu muốn banner co giãn theo màn hình.


---

## ✅ ĐÃ BỔ SUNG (bản hoàn thiện)
- **Đồng ý người dùng (GDPR/UMP):** `www/js/ads.js` nay goi `AdMob.requestConsentInfo()` + `AdMob.showConsentForm()` trước khi hiển thị quảng cáo (đúng chính sách EEA/UK). Cấu hình biểu mẫu trong **AdMob → Privacy & messaging**.
- **iOS ATT:** đã thêm `AdMob.requestTrackingAuthorization()` (tự bỏ qua trên Android). Nếu phát hành iOS, nhớ thêm khóa `NSUserTrackingUsageDescription` trong Info.plist.
- **Banner co giãn:** đổi sang `ADAPTIVE_BANNER` để vừa mọi chiều rộng màn hình.
- **Giới hạn tần suất App Open Ad:** mỗi lần hiện cách nhau tối thiểu **4 phút**, tránh làm phiền & vi phạm chính sách.
- **Service worker:** đã thêm `./js/ads.js` vào danh sách cache (sw.js, bump `caodai-v2`) để hoạt động ổn định offline.
- **Chính sách bảo mật & mô tả store:** đã cập nhật `PRIVACY_POLICY.md` và `STORE_LISTING.md` để phản ánh việc có quảng cáo (trước đây ghi nhầm "không quảng cáo" → sẽ bị Google từ chối).

## 📋 Khai báo Data safety trên Google Play
- **Ads = Yes**; khai thu thập *Advertising ID* cho mục đích quảng cáo (qua Google AdMob).
- Dán URL chính sách bảo mật công khai (từ `PRIVACY_POLICY.md`).
