# 📦 Cách ra file .AAB để nộp Google Play (Cao Dai Vegetarian 365)

> **Vì sao không có sẵn file .aab trong gói?**
> Đây là app **Capacitor (PWA → Android)**. Để ra `.aab` bắt buộc phải: tạo thư mục `android/` (lệnh `npx cap add android`), tải Android SDK + Gradle (~vài GB), rồi **ký số bằng keystore của chính bạn**. Keystore là "chứng minh thư" vĩnh viễn của app — chỉ bạn được giữ, không ai tạo thay được. Vì vậy file `.aab` phải được build ở máy bạn hoặc trên đám mây bằng tài khoản của bạn.
>
> Bên dưới là **2 cách**. Cách 1 (đám mây) **không cần cài gì trên máy**.

---

## ✅ CÁCH 1 — Build trên GitHub Actions (khuyên dùng, không cần máy mạnh)

Dự án đã có sẵn quy trình tự động tại `.github/workflows/android-release.yml`. Nó sẽ tự: tạo `android/`, nâng chuẩn **API 35 + AGP 8.6**, gắn AdMob App ID, build và **ký** rồi cho bạn tải `.aab`.

### Bước 1 — Tạo keystore (làm 1 lần, giữ kỹ file + mật khẩu)
Trên máy bất kỳ có Java (hoặc dùng máy ảo), chạy:
```bash
keytool -genkeypair -v -keystore caodai-upload.jks -alias caodai \
  -keyalg RSA -keysize 2048 -validity 9125 \
  -storepass MAT_KHAU_CUA_BAN -keypass MAT_KHAU_CUA_BAN \
  -dname "CN=Long Bao Studio, O=Long Bao Studio, C=VN"

# Mã hoá keystore sang base64 để dán vào GitHub secret:
base64 -w0 caodai-upload.jks    # macOS: dùng  base64 caodai-upload.jks | tr -d '\n'
```

### Bước 2 — Đưa code lên GitHub
1. Tạo repo mới (Private cũng được) trên https://github.com .
2. Đẩy toàn bộ thư mục `caodai_app/` lên nhánh `main`.

### Bước 3 — Khai báo Secrets
Vào repo → **Settings → Secrets and variables → Actions → New repository secret**, tạo:

| Tên secret | Giá trị |
|---|---|
| `KEYSTORE_BASE64` | Chuỗi base64 ở Bước 1 |
| `KEYSTORE_PASSWORD` | Mật khẩu store (storepass) |
| `KEY_ALIAS` | `caodai` |
| `KEY_PASSWORD` | Mật khẩu key (keypass) |
| `ADMOB_APP_ID` | *(tuỳ chọn)* App ID AdMob thật `ca-app-pub-...~...`. Bỏ trống = dùng ID test. |

### Bước 4 — Chạy build & tải file
1. Mở tab **Actions** → chọn workflow **Build CaoDai Vegetarian 365** → **Run workflow** (hoặc cứ push lên `main` là tự chạy).
2. Chờ ~5–10 phút. Khi xong, mở lần chạy đó → mục **Artifacts** → tải **`caodai-release`** (chứa `caodai-release.aab`).
3. File `caodai-release.aab` chính là file **nộp lên Google Play Console**.

---

## 💻 CÁCH 2 — Build tại máy (cần Android Studio)

```bash
cd caodai_app
npm install
npx cap add android        # tạo thư mục android/
npx cap sync android
```
Mở `android/` bằng Android Studio rồi:
1. Sửa `android/variables.gradle`: `compileSdkVersion = 35`, `targetSdkVersion = 35`.
2. **Build → Generate Signed Bundle / APK → Android App Bundle**, chọn keystore của bạn → ra file `.aab` trong `android/app/build/outputs/bundle/release/`.
3. Thêm dòng AdMob App ID vào `android/app/src/main/AndroidManifest.xml` (trong thẻ `<application>`):
   ```xml
   <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXX~YYYY"/>
   ```

---

## 💰 Trước khi kiếm tiền thật
- Trong `www/js/ads.js`: đổi `USE_TEST_ADS = true` → `false` và điền 3 ID quảng cáo thật (App Open / Banner / Interstitial).
- Đặt `ADMOB_APP_ID` (secret) hoặc sửa Manifest = App ID thật.
- Lưu ý: để **ID test** khi phát hành công khai sẽ **vi phạm chính sách AdMob** — phải đổi sang ID thật.

> Tóm lại: chạy **Cách 1**, sau ~10 phút bạn tải về `caodai-release.aab` và nộp thẳng lên Google Play Console.
