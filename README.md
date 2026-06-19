# 🪷 Cao Đài Vegetarian 365

**Ăn chay · Dưỡng tâm · Dưỡng thân**

Ứng dụng ăn chay thông minh dành cho cộng đồng người theo đạo Cao Đài và những ai muốn ăn chay khoa học. Mọi tính năng **dùng được offline** (PWA), hỗ trợ **3 ngôn ngữ: Tiếng Việt / English / 한국어**, có chế độ **sáng/tối** và **chế độ người cao tuổi** (chữ lớn). Ứng dụng **miễn phí, có quảng cáo (Google AdMob)** để hỗ trợ tác giả — xem `ADMOB_SETUP.md` và `PRIVACY_POLICY.md`.

---

## ✨ Tính năng chính

| Màn hình | Mô tả |
|---|---|
| 🏠 **Hôm nay** | Ngày dương + âm lịch (can chi), tự động báo **hôm nay có phải ngày chay không** (thập trai / lục trai), lời dạy mỗi ngày, gợi ý thực đơn sáng/trưa/tối, nhắc uống nước & vận động, theo dõi chuỗi ngày ăn chay (streak). |
| 📅 **Lịch chay** | Lịch tháng đánh dấu mọi ngày chay theo âm lịch. Chuyển đổi **Thập trai (10 ngày)** ↔ **Lục trai (6 ngày)**. |
| 🍱 **Thực đơn** | Bộ thực đơn xoay vòng cho **12 tháng** (120 thực đơn ngày không trùng nhau), kèm nút tạo **danh sách đi chợ** tự động. |
| 🍲 **Công thức** | Thư viện 70+ món chay có tìm kiếm & lọc theo nhóm (món nước, cơm, canh, cháo, đồ uống, món chính, tráng miệng), mỗi món có nguyên liệu + cách làm + calo. |
| 📖 **Kinh** | 10 bài kinh: Niệm Hương, Khai Kinh, Sám Hối, Cầu An, Cầu Siêu, Bát Nhã Tâm Kinh, Phổ Môn, Dược Sư, Hồng Danh Bửu Sám, Địa Tạng (bản trích — vui lòng đối chiếu kinh sách chính thức). |
| ❤️ **Sức khỏe** | Máy tính BMI, cân nặng lý tưởng, nhu cầu nước, calo (BMR×hệ số vận động) và đạm mỗi ngày. |
| 🎙️ **Trợ lý** | Trợ lý ăn chay offline: hỏi "hôm nay ăn gì", "thực đơn cho người tiểu đường / giảm cân / huyết áp", "lập thực đơn 7 ngày"… |
| ☰ **Thêm** | Đổi ngôn ngữ, sáng/tối, chế độ người cao tuổi, **bật nhắc giờ thật bằng thông báo đẩy** (7 mốc trong ngày), xem lịch nhắc nhở. |

---

## 📂 Cấu trúc dự án

```
caodai_app/
├── www/                      ← Mã nguồn web (PWA) – đây là phần chạy thật
│   ├── index.html
│   ├── manifest.webmanifest  ← Khai báo PWA (tên, icon, màu…)
│   ├── sw.js                 ← Service worker (chạy offline)
│   ├── css/style.css
│   ├── js/
│   │   ├── lunar.js          ← Thuật toán đổi âm lịch (Hồ Ngọc Đức)
│   │   ├── data.js           ← Dữ liệu: ngày chay, công thức, kinh, lời dạy
│   │   ├── i18n.js           ← Chuỗi giao diện VI/EN/KO
│   │   └── app.js            ← Logic ứng dụng
│   └── icons/                ← Icon 192/512/maskable/1024
├── store/                    ← Ảnh cho cửa hàng (screenshot + feature graphic)
├── capacitor.config.json     ← Cấu hình đóng gói thành app native
├── package.json
├── PUBLISHING_GUIDE.md        ← 📌 HƯỚNG DẪN ĐĂNG LÊN APP STORE & GOOGLE PLAY
└── PRIVACY_POLICY.md          ← Mẫu chính sách bảo mật (store bắt buộc)
```

---

## ▶️ Chạy thử trên máy (không cần internet)

Vì trình duyệt chặn service worker khi mở bằng `file://`, hãy chạy một web server tĩnh:

```bash
cd caodai_app
# Cách 1: Python (có sẵn trên Mac/Linux)
cd www && python3 -m http.server 5173
# Cách 2: Node
npx --yes serve -l 5173 www
```

Mở trình duyệt: **http://localhost:5173** → trên điện thoại có thể "Thêm vào màn hình chính" để dùng như app.

---

## 📱 Đưa lên App Store & Google Play

👉 Xem chi tiết từng bước trong **`PUBLISHING_GUIDE.md`**.

Tóm tắt: app này là **PWA**, được "gói" thành app native bằng **Capacitor** (iOS + Android) hoặc **PWABuilder/Bubblewrap** (Android). Bạn cần tài khoản **Apple Developer ($99/năm)** và **Google Play ($25 trả một lần)**.

---

## ⚠️ Lưu ý về nội dung tôn giáo

Bài *Niệm Hương* và *Khai Kinh* dùng nguyên văn phổ biến; các bài còn lại để ở dạng trích/đại ý kèm ghi chú. **Hãy đối chiếu với kinh sách chính thức của Hội Thánh/Tòa Thánh** trước khi phát hành để đảm bảo chính xác.


## 📷 AI Camera món chay (mới)

Tab **Quét món** cho phép người dùng chụp hoặc tải ảnh món ăn để AI phân tích **ngay trên thiết bị** (offline, không gửi ảnh đi đâu):

- Ước lượng độ nhiều rau xanh, độ tươi ngon và độ thanh đạm (ít dầu mỡ).
- Ước lượng calo và khả năng là món chay dựa trên phân tích màu sắc.
- Gợi ý món chay tương đương từ thư viện công thức.
- Hiển thị mẹo cải thiện bữa ăn.

> ⚠️ Kết quả mang tính tham khảo, không thay thế tư vấn dinh dưỡng.

**Lưu ý cho camera trực tiếp trên Android:** nút *Tải ảnh lên* luôn hoạt động. Để dùng camera trực tiếp trong WebView, sau khi `npx cap add android` hãy thêm quyền vào `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA"/>
<uses-feature android:name="android.hardware.camera" android:required="false"/>
```

và cấp quyền WebView (`onPermissionRequest`) cho `getUserMedia` nếu muốn xem trước trực tiếp.
