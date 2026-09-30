# Chuyên Gia Dinh Dưỡng Thu Hiền – Cùng Mẹ Hiểu Con (Pure HTML Edition)

Website thương hiệu cá nhân và hệ thống đặt lịch tư vấn dinh dưỡng 1-1 cho **Chuyên gia Dinh dưỡng Thu Hiền** với slogan **"Cùng mẹ hiểu con"**.

Phiên bản này được xây dựng **100% bằng HTML5 thuần, CSS và JavaScript** (hoàn toàn không cần PHP/Backend), có thể triển khai ngay lập tức lên bất kỳ máy chủ nào: **GitHub Pages, Vercel, Netlify, Cloudflare Pages, ServBay hoặc Hosting thông thường** mà không bao giờ bị lỗi tự động tải file về.

---

## 🎨 1. Nhận Diện Thương Hiệu (Brand Guidelines)

* **Phong cách:** Ấm áp – khoa học – gần gũi – tối giản – đáng tin cậy.
* **Tỷ lệ màu sắc chuẩn:**
  * **70% Cream / Warm White (`#FAF7F0`):** Nền chính trơn sáng, thoáng đãng, padding lớn (`py-24`).
  * **20% Xanh Đậm (`#174C3B` & `#1F5A45`):** Tiêu đề, logo, viền card, icon dinh dưỡng chủ đạo.
  * **10% Cam Đào (`#F08A4B`):** Điểm nhấn keyword, số liệu khoa học, badge nổi bật, nút kêu gọi hành động (CTA).
  * **Màu phụ:** Xanh Sage (`#8FAF91`), Mint nhạt (`#EEF5EA`), Xám xanh (`#5F6E66`).
* **Visual Icon:** Minh họa vector chuẩn xác: Hệ vi sinh đường ruột, dạ dày, vi chất (Kẽm, Sắt, D3K2), não bộ - trục não ruột, đồng hồ sinh học & giấc ngủ.

---

## 🚀 2. Cấu Trúc Đường Dẫn Sạch (Clean URLs Không Hiển Thị Đuôi `.html`)

Website sử dụng cấu trúc thư mục tiêu chuẩn, giúp đường dẫn trên thanh địa chỉ luôn sạch đẹp không có đuôi file:
* **Trang chủ:** `/` hoặc `/home/`
* **Trang đặt lịch tư vấn 1-1:** `/dat-lich/`
* **Trang quản trị báo cáo:** `/admin/`

---

## 📊 3. Trang Quản Trị Báo Cáo (`/admin/`)

Hệ thống quản trị hoạt động hoàn toàn bằng JavaScript và lưu trữ dữ liệu an toàn trên trình duyệt qua **LocalStorage** (sẵn sàng nạp lại mẫu hoặc xuất Excel):
* **Đường dẫn truy cập:** `/admin/`
* **Tài khoản mặc định:** `admin`
* **Mật khẩu mặc định:** `thuhien2026`
* **Tính năng:**
  * Thống kê KPI: Tổng lịch hẹn, Chờ liên hệ, Đã liên hệ, Đang theo dõi phác đồ 21 ngày, Hoàn thành, Lượt tải Ebook, Tỷ lệ chuyển đổi.
  * Tìm kiếm và lọc theo trạng thái hồ sơ.
  * Cập nhật trạng thái trực tiếp tức thì.
  * Xem chi tiết từng bé và lưu **Ghi chú của Chuyên gia**.
  * **Xuất file Excel / CSV** chuẩn UTF-8 tiếng Việt có dấu.
  * Nút nạp lại dữ liệu mẫu (`Nạp mẫu`) để test giao diện mọi lúc.

---

## 📁 4. Cấu Trúc Thư Mục

```text
/Applications/ServBay/www/thuhien/
├── index.html            # Trang chủ chính
├── home/
│   └── index.html        # Trang chủ chuyển hướng
├── dat-lich/
│   └── index.html        # Trang đăng ký đặt lịch tư vấn 1-1
├── admin/
│   └── index.html        # Trang dashboard quản trị báo cáo
├── assets/
│   ├── css/style.css     # Design tokens, màu sắc, font chữ & animation
│   └── js/
│       ├── db.js         # Lớp cơ sở dữ liệu client-side LocalStorage & Export CSV
│       └── main.js       # Script cuộn mượt, pill checkboxes, AJAX modal
├── .htaccess             # Cấu hình DirectoryIndex cho Apache
└── README.md             # Hướng dẫn chi tiết
```
