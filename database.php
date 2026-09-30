<?php
/**
 * Database connection & schema migration for Thu Hiền - Cùng Mẹ Hiểu Con
 */

define('DB_PATH', __DIR__ . '/data/thuhien.db');

function getDb(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dbDir = dirname(DB_PATH);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }
        
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA journal_mode = WAL;');
        
        initDbSchema($pdo);
    }
    return $pdo;
}

function initDbSchema(PDO $pdo): void {
    // 1. Bookings table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            baby_name TEXT,
            baby_age TEXT,
            baby_weight TEXT,
            baby_height TEXT,
            issues TEXT,
            feeding_notes TEXT,
            consult_type TEXT,
            preferred_time TEXT,
            status TEXT DEFAULT 'pending',
            admin_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // 2. Ebook Leads table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS ebook_leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            parent_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            baby_age TEXT,
            resource_name TEXT DEFAULT 'Cẩm nang 30 Thực đơn Đột phá Hấp thu',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // 3. Page views table for analytics
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page TEXT NOT NULL,
            ip_hash TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // 4. Admin users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Seed default admin account if not exists (username: admin, pass: thuhien2026)
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users WHERE username = 'admin'");
    $stmt->execute();
    if ($stmt->fetchColumn() == 0) {
        $defaultHash = password_hash('thuhien2026', PASSWORD_DEFAULT);
        $insert = $pdo->prepare("INSERT INTO admin_users (username, password_hash, full_name) VALUES (:u, :p, :n)");
        $insert->execute([
            ':u' => 'admin',
            ':p' => $defaultHash,
            ':n' => 'Chuyên gia Thu Hiền'
        ]);
        
        // Seed some sample data for demonstration in the report dashboard
        seedSampleData($pdo);
    }
}

function seedSampleData(PDO $pdo): void {
    // Insert some realistic demo bookings to populate the dashboard reports initially
    $sampleBookings = [
        [
            'parent_name' => 'Nguyễn Thị Mai Lan',
            'phone' => '0912345678',
            'email' => 'mailan.nguyen@gmail.com',
            'baby_name' => 'Bé Bơ',
            'baby_age' => '14 tháng',
            'baby_weight' => '8.8 kg',
            'baby_height' => '74 cm',
            'issues' => 'Biếng ăn sinh lý, Chậm tăng cân, Không chịu nhai thô',
            'feeding_notes' => 'Bé chỉ thích bú mẹ, mỗi bữa cháo ngậm 30-40 phút, mẹ rất stress.',
            'consult_type' => 'Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu',
            'preferred_time' => 'Buổi tối (19h30 - 21h00)',
            'status' => 'pending',
            'admin_notes' => 'Đã gửi tin nhắn Zalo hẹn tối thứ 5 gọi video'
        ],
        [
            'parent_name' => 'Trần Thu Trang',
            'phone' => '0988776655',
            'email' => 'thutrang.hn@yahoo.com',
            'baby_name' => 'Bé Sóc',
            'baby_age' => '8 tháng',
            'baby_weight' => '7.2 kg',
            'baby_height' => '68 cm',
            'issues' => 'Táo bón kéo dài, Bổ sung vi chất kẽm & sắt',
            'feeding_notes' => 'Bé 3 ngày mới đi ngoài 1 lần, phân cứng, hay quấy khóc ban đêm.',
            'consult_type' => 'Tư Vấn Đơn Điểm 1-1 (60 Phút)',
            'preferred_time' => 'Cuối tuần (Sáng thứ 7)',
            'status' => 'contacted',
            'admin_notes' => 'Mẹ đã cung cấp phiếu xét nghiệm vi chất, hẹn chuyên gia tư vấn sáng T7.'
        ],
        [
            'parent_name' => 'Lê Thanh Thảo',
            'phone' => '0903112233',
            'email' => 'thanhthao.le@gmail.com',
            'baby_name' => 'Bé Bon',
            'baby_age' => '24 tháng',
            'baby_weight' => '11.5 kg',
            'baby_height' => '86 cm',
            'issues' => 'Đổi sữa, Dị ứng đạm bò nhẹ, Cần thực đơn gia đình cân bằng',
            'feeding_notes' => 'Bé vừa cai sữa, tiêu hóa nhạy cảm, muốn chuyên gia lên thực đơn 30 ngày.',
            'consult_type' => 'Gói Đồng Hành Toàn Diện 1 Tháng',
            'preferred_time' => 'Giờ hành chính (14h00)',
            'status' => 'completed',
            'admin_notes' => 'Đã gửi phác đồ và tài liệu thực đơn, bé đã ăn ngoan và đi ngoài đều.'
        ]
    ];

    $stmt = $pdo->prepare("
        INSERT INTO bookings (parent_name, phone, email, baby_name, baby_age, baby_weight, baby_height, issues, feeding_notes, consult_type, preferred_time, status, admin_notes)
        VALUES (:pn, :ph, :em, :bn, :ba, :bw, :bh, :iss, :fn, :ct, :pt, :st, :an)
    ");

    foreach ($sampleBookings as $b) {
        $stmt->execute([
            ':pn' => $b['parent_name'],
            ':ph' => $b['phone'],
            ':em' => $b['email'],
            ':bn' => $b['baby_name'],
            ':ba' => $b['baby_age'],
            ':bw' => $b['baby_weight'],
            ':bh' => $b['baby_height'],
            ':iss' => $b['issues'],
            ':fn' => $b['feeding_notes'],
            ':ct' => $b['consult_type'],
            ':pt' => $b['preferred_time'],
            ':st' => $b['status'],
            ':an' => $b['admin_notes']
        ]);
    }

    // Sample Ebook leads
    $sampleLeads = [
        ['Phạm Hải Yến', '0945123987', 'haiyen.pham@gmail.com', '7 tháng'],
        ['Hoàng Minh Châu', '0978654321', 'chauhoang.mc@gmail.com', '11 tháng'],
        ['Đỗ Quỳnh Nga', '0919888777', 'quynhnga.do@gmail.com', '18 tháng'],
        ['Vũ Thị Thu Hà', '0934567890', 'thuha.vu@gmail.com', '9 tháng']
    ];

    $leadStmt = $pdo->prepare("INSERT INTO ebook_leads (parent_name, phone, email, baby_age) VALUES (?, ?, ?, ?)");
    foreach ($sampleLeads as $lead) {
        $leadStmt->execute($lead);
    }

    // Sample initial page views
    $pvStmt = $pdo->prepare("INSERT INTO page_views (page, ip_hash) VALUES (?, ?)");
    for ($i = 0; $i < 42; $i++) {
        $pvStmt->execute(['home', md5('demo_ip_' . $i)]);
    }
    for ($i = 0; $i < 18; $i++) {
        $pvStmt->execute(['dat-lich', md5('demo_booking_ip_' . $i)]);
    }
}
