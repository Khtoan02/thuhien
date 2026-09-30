# Chuyên Gia Dinh Dưỡng Thu Hiền – Cùng Mẹ Hiểu Con

Website thương hiệu cá nhân và hệ thống đặt lịch tư vấn dinh dưỡng 1-1 cho **Chuyên gia Dinh dưỡng Thu Hiền** với triết lý **"Cùng mẹ hiểu con"**.

Được thiết kế theo tiêu chuẩn thuần (Vanilla HTML5 / PHP 8.3 / Tailwind CSS / Vanilla JS), không phụ thuộc framework cồng kềnh, tải siêu tốc, hỗ trợ **URL sạch (Clean URLs không hiển thị đuôi `.html` hay `.php`)** và tích hợp sẵn trang **Quản trị Báo cáo**.

---

## 🎨 1. Hệ Thống Nhận Diện Thương Hiệu (Brand Guidelines)

* **Phong cách:** Ấm áp – khoa học – gần gũi – tối giản – đáng tin cậy. 
* **Tỷ lệ màu sắc chuẩn:**
  * **70% Cream / Warm White (`#FAF7F0`):** Nền chính toàn trang, tạo cảm giác thư thái, ấm áp như trang sách.
  * **20% Xanh Đậm (`#174C3B` & `#1F5A45`):** Tiêu đề, logo, viền chính, icon y khoa chủ đạo.
  * **10% Cam Đào (`#F08A4B`):** Điểm nhấn keyword, số liệu, nút kêu gọi hành động (CTA).
  * **Màu phụ:** Xanh Sage (`#8FAF91`), Mint nhạt (`#EEF5EA`), Xám xanh (`#5F6E66`).
* **Visual Icon:** Ưu tiên các biểu tượng y khoa & sinh học dinh dưỡng tinh tế (Đường ruột, vi chất, não bộ - trục não ruột, đồng hồ sinh học, đĩa ăn khoa học).

---

## 🚀 2. Cấu Trúc Đường Dẫn Sạch (Clean URLs)

Website xử lý định tuyến tự động, hoàn toàn không hiển thị đuôi file:
* **Trang chủ:** `/` hoặc `/home` (Định vị thương hiệu, triết lý "Cùng mẹ hiểu con", 4 trụ cột khoa học, cảm nhận của mẹ, nhận cẩm nang 30 thực đơn)
* **Trang đặt lịch tư vấn 1-1:** `/dat-lich` (Phiếu tiếp nhận dinh dưỡng toàn diện, khảo sát thói quen ăn uống, chọn vấn đề của bé)
* **Trang quản trị & báo cáo:** `/admin` (Bảng điều khiển KPIs, danh sách lịch hẹn, cập nhật tiến độ, xuất Excel/CSV, danh sách tải Ebook)
* **Cổng API:** `/api` (Xử lý AJAX form, tracking lượt xem, xuất báo cáo)

---

## 🔐 3. Thông Tin Quản Trị Trang Web (Admin Dashboard)

* **Đường dẫn truy cập:** `http://<domain-hoặc-localhost>/admin`
* **Tài khoản mặc định:** `admin`
* **Mật khẩu mặc định:** `thuhien2026`
* **Các tính năng báo cáo trong trang Admin:**
  1. Thống kê tổng quan: Tổng lượt đăng ký, số lịch hẹn mới, đang theo dõi phác đồ 21 ngày, đã hoàn thành.
  2. Báo cáo lượt tải Cẩm Nang 30 Thực Đơn (Lead Magnet).
  3. Lọc và tìm kiếm nhanh theo tên mẹ hoặc số điện thoại.
  4. Cập nhật trạng thái trực tiếp (Chờ liên hệ, Đã liên hệ, Đang theo dõi, Hoàn thành, Đã hủy).
  5. Xem chi tiết hồ sơ bệnh sử từng bé và lưu **Ghi chú của Chuyên gia**.
  6. **Xuất file Excel / CSV** chuẩn tiếng Việt có dấu (UTF-8 BOM).

---

## 📁 4. Cấu Trúc Thư Mục

```text
/Applications/ServBay/www/thuhien/
├── index.php             # Bộ định tuyến Front-Controller xử lý Clean URL
├── database.php          # Quản lý cơ sở dữ liệu SQLite tự động
├── api.php               # Xử lý các request gửi form, đăng nhập, báo cáo
├── .htaccess             # Quy tắc Rewrite cho Apache
├── home/
│   └── index.php         # Entry point hỗ trợ truy cập /home/
├── dat-lich/
│   └── index.php         # Entry point hỗ trợ truy cập /dat-lich/
├── admin/
│   └── index.php         # Entry point hỗ trợ truy cập /admin/
├── pages/
│   ├── header.php        # Header dùng chung & thanh điều hướng đảo nổi
│   ├── footer.php        # Footer, tuyên bố y khoa & modal tải Ebook
│   ├── home.php          # Giao diện trang chủ chi tiết
│   ├── dat-lich.php      # Giao diện trang đặt lịch tư vấn 1-1
│   └── admin.php         # Giao diện dashboard quản trị báo cáo
├── data/
│   └── thuhien.db        # Cơ sở dữ liệu SQLite lưu trữ dữ liệu an toàn
└── assets/
    ├── css/style.css     # Design tokens, double-bezel, typography & animations
    └── js/main.js        # Script cuộn mượt, pill checkboxes, AJAX & toast
```
