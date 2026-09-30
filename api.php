<?php
/**
 * API Endpoint handler for Thu Hiền - Cùng Mẹ Hiểu Con
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/database.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Helper to send JSON responses
function jsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Helper to check admin authentication
function checkAdminAuth(): bool {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

$db = getDb();

switch ($action) {
    // -------------------------------------------------------------
    // 1. Submit 1-on-1 Consultation Booking
    // -------------------------------------------------------------
    case 'submit_booking':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(['success' => false, 'message' => 'Phương thức không hợp lệ.'], 405);
        }

        $parentName = trim($_POST['parent_name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $babyName = trim($_POST['baby_name'] ?? '');
        $babyAge = trim($_POST['baby_age'] ?? '');
        $babyWeight = trim($_POST['baby_weight'] ?? '');
        $babyHeight = trim($_POST['baby_height'] ?? '');
        $issues = isset($_POST['issues']) ? (is_array($_POST['issues']) ? implode(', ', $_POST['issues']) : trim($_POST['issues'])) : '';
        $feedingNotes = trim($_POST['feeding_notes'] ?? '');
        $consultType = trim($_POST['consult_type'] ?? 'Tư Vấn Đơn Điểm 1-1 (60 Phút)');
        $preferredTime = trim($_POST['preferred_time'] ?? 'Bất kỳ khi nào tiện');

        if (empty($parentName) || empty($phone)) {
            jsonResponse(['success' => false, 'message' => 'Vui lòng cung cấp họ tên mẹ và số điện thoại liên hệ.'], 400);
        }

        try {
            $stmt = $db->prepare("
                INSERT INTO bookings (parent_name, phone, email, baby_name, baby_age, baby_weight, baby_height, issues, feeding_notes, consult_type, preferred_time, status)
                VALUES (:pn, :ph, :em, :bn, :ba, :bw, :bh, :iss, :fn, :ct, :pt, 'pending')
            ");
            $stmt->execute([
                ':pn' => $parentName,
                ':ph' => $phone,
                ':em' => $email,
                ':bn' => $babyName,
                ':ba' => $babyAge,
                ':bw' => $babyWeight,
                ':bh' => $babyHeight,
                ':iss' => $issues,
                ':fn' => $feedingNotes,
                ':ct' => $consultType,
                ':pt' => $preferredTime
            ]);

            $bookingId = $db->lastInsertId();

            jsonResponse([
                'success' => true,
                'message' => 'Cảm ơn Mẹ đã tin tưởng gửi thông tin! Chuyên gia Thu Hiền sẽ liên hệ hỗ trợ Mẹ qua Zalo/SĐT trong vòng 2-4 giờ tới.',
                'booking_id' => $bookingId
            ]);
        } catch (Exception $e) {
            jsonResponse(['success' => false, 'message' => 'Đã có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
        break;

    // -------------------------------------------------------------
    // 2. Submit Ebook Lead (Lead Magnet)
    // -------------------------------------------------------------
    case 'submit_ebook':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(['success' => false, 'message' => 'Phương thức không hợp lệ.'], 405);
        }

        $parentName = trim($_POST['parent_name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $babyAge = trim($_POST['baby_age'] ?? '');
        $resourceName = trim($_POST['resource_name'] ?? 'Cẩm nang 30 Thực đơn Đột phá Hấp thu');

        if (empty($parentName) || empty($phone)) {
            jsonResponse(['success' => false, 'message' => 'Vui lòng nhập họ tên mẹ và số điện thoại Zalo để nhận cẩm nang.'], 400);
        }

        try {
            $stmt = $db->prepare("
                INSERT INTO ebook_leads (parent_name, phone, email, baby_age, resource_name)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$parentName, $phone, $email, $babyAge, $resourceName]);

            jsonResponse([
                'success' => true,
                'message' => 'Đăng ký thành công! Cẩm nang dinh dưỡng đặc biệt đã sẵn sàng để tải về máy của Mẹ.',
                'download_url' => '#tai-ngay'
            ]);
        } catch (Exception $e) {
            jsonResponse(['success' => false, 'message' => 'Lỗi lưu thông tin: ' . $e->getMessage()], 500);
        }
        break;

    // -------------------------------------------------------------
    // 3. Track Page View
    // -------------------------------------------------------------
    case 'track_view':
        $page = trim($_GET['page'] ?? $_POST['page'] ?? 'home');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $ipHash = md5($ip . date('Y-m-d'));

        $stmt = $db->prepare("INSERT INTO page_views (page, ip_hash) VALUES (?, ?)");
        $stmt->execute([$page, $ipHash]);

        jsonResponse(['success' => true]);
        break;

    // -------------------------------------------------------------
    // 4. Admin Login
    // -------------------------------------------------------------
    case 'admin_login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(['success' => false, 'message' => 'Phương thức không hợp lệ.'], 405);
        }

        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        $stmt = $db->prepare("SELECT * FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];
            $_SESSION['admin_name'] = $user['full_name'];

            jsonResponse(['success' => true, 'message' => 'Đăng nhập thành công!']);
        } else {
            jsonResponse(['success' => false, 'message' => 'Tài khoản hoặc mật khẩu không chính xác.'], 401);
        }
        break;

    // -------------------------------------------------------------
    // 5. Admin Logout
    // -------------------------------------------------------------
    case 'admin_logout':
        unset($_SESSION['admin_logged_in'], $_SESSION['admin_id'], $_SESSION['admin_username'], $_SESSION['admin_name']);
        session_destroy();
        jsonResponse(['success' => true, 'message' => 'Đã đăng xuất an toàn.']);
        break;

    // -------------------------------------------------------------
    // 6. Update Booking Status / Admin Note
    // -------------------------------------------------------------
    case 'update_booking':
        if (!checkAdminAuth()) {
            jsonResponse(['success' => false, 'message' => 'Vui lòng đăng nhập để thao tác.'], 403);
        }

        $id = intval($_POST['id'] ?? 0);
        $status = trim($_POST['status'] ?? '');
        $adminNotes = trim($_POST['admin_notes'] ?? '');

        if ($id <= 0) {
            jsonResponse(['success' => false, 'message' => 'ID hồ sơ không hợp lệ.'], 400);
        }

        try {
            $stmt = $db->prepare("UPDATE bookings SET status = :st, admin_notes = :an WHERE id = :id");
            $stmt->execute([
                ':st' => $status,
                ':an' => $adminNotes,
                ':id' => $id
            ]);

            jsonResponse(['success' => true, 'message' => 'Cập nhật trạng thái thành công!']);
        } catch (Exception $e) {
            jsonResponse(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
        break;

    // -------------------------------------------------------------
    // 7. Delete Booking
    // -------------------------------------------------------------
    case 'delete_booking':
        if (!checkAdminAuth()) {
            jsonResponse(['success' => false, 'message' => 'Vui lòng đăng nhập.'], 403);
        }

        $id = intval($_POST['id'] ?? 0);
        if ($id > 0) {
            $stmt = $db->prepare("DELETE FROM bookings WHERE id = ?");
            $stmt->execute([$id]);
            jsonResponse(['success' => true, 'message' => 'Đã xóa hồ sơ thành công.']);
        }
        jsonResponse(['success' => false, 'message' => 'ID không hợp lệ.'], 400);
        break;

    // -------------------------------------------------------------
    // 8. Export CSV for Bookings or Leads (Excel compatible UTF-8 BOM)
    // -------------------------------------------------------------
    case 'export_csv':
        if (!checkAdminAuth()) {
            die('Access Denied');
        }

        $type = $_GET['type'] ?? 'bookings';
        header('Content-Type: text/csv; charset=utf-8');

        if ($type === 'leads') {
            header('Content-Disposition: attachment; filename=danh-sach-nhan-ebook-' . date('Ymd-His') . '.csv');
            $output = fopen('php://output', 'w');
            // Write UTF-8 BOM for Excel
            fputs($output, "\xEF\xBB\xBF");
            fputcsv($output, ['ID', 'Họ tên Mẹ', 'Số điện thoại', 'Email', 'Tháng tuổi của Bé', 'Tài liệu tải', 'Thời gian đăng ký']);

            $rows = $db->query("SELECT * FROM ebook_leads ORDER BY id DESC")->fetchAll();
            foreach ($rows as $r) {
                fputcsv($output, [$r['id'], $r['parent_name'], $r['phone'], $r['email'], $r['baby_age'], $r['resource_name'], $r['created_at']]);
            }
        } else {
            header('Content-Disposition: attachment; filename=lich-tu-van-dinh-duong-' . date('Ymd-His') . '.csv');
            $output = fopen('php://output', 'w');
            fputs($output, "\xEF\xBB\xBF");
            fputcsv($output, ['ID', 'Họ tên Mẹ', 'Số điện thoại', 'Email', 'Tên bé', 'Tháng tuổi', 'Cân nặng', 'Chiều cao', 'Vấn đề gặp phải', 'Nhật ký ăn uống', 'Gói tư vấn', 'Khung giờ hẹn', 'Trạng thái', 'Ghi chú chuyên gia', 'Thời gian đăng ký']);

            $rows = $db->query("SELECT * FROM bookings ORDER BY id DESC")->fetchAll();
            foreach ($rows as $r) {
                fputcsv($output, [
                    $r['id'],
                    $r['parent_name'],
                    $r['phone'],
                    $r['email'],
                    $r['baby_name'],
                    $r['baby_age'],
                    $r['baby_weight'],
                    $r['baby_height'],
                    $r['issues'],
                    $r['feeding_notes'],
                    $r['consult_type'],
                    $r['preferred_time'],
                    $r['status'],
                    $r['admin_notes'],
                    $r['created_at']
                ]);
            }
        }
        fclose($output);
        exit;

    default:
        jsonResponse(['success' => false, 'message' => 'Action không tồn tại.'], 404);
}
