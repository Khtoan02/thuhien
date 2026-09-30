<?php
/**
 * Admin Dashboard & Reports for Thu Hiền - Cùng Mẹ Hiểu Con
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once dirname(__DIR__) . '/database.php';
$db = getDb();

$isLoggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

// If logged in, fetch live report statistics
if ($isLoggedIn) {
    // 1. KPI Counts
    $totalBookings = (int)$db->query("SELECT COUNT(*) FROM bookings")->fetchColumn();
    $pendingBookings = (int)$db->query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'")->fetchColumn();
    $contactedBookings = (int)$db->query("SELECT COUNT(*) FROM bookings WHERE status = 'contacted'")->fetchColumn();
    $inProgressBookings = (int)$db->query("SELECT COUNT(*) FROM bookings WHERE status = 'in_progress'")->fetchColumn();
    $completedBookings = (int)$db->query("SELECT COUNT(*) FROM bookings WHERE status = 'completed'")->fetchColumn();
    $totalLeads = (int)$db->query("SELECT COUNT(*) FROM ebook_leads")->fetchColumn();
    
    // Page views
    $totalViews = (int)$db->query("SELECT COUNT(*) FROM page_views")->fetchColumn();
    $homeViews = (int)$db->query("SELECT COUNT(*) FROM page_views WHERE page = 'home'")->fetchColumn();
    $bookingViews = (int)$db->query("SELECT COUNT(*) FROM page_views WHERE page = 'dat-lich'")->fetchColumn();

    // Conversion rate
    $conversionRate = $totalViews > 0 ? round((($totalBookings + $totalLeads) / $totalViews) * 100, 1) : 0;

    // Fetch all bookings
    $bookingsStmt = $db->query("SELECT * FROM bookings ORDER BY id DESC");
    $bookings = $bookingsStmt->fetchAll();

    // Fetch all leads
    $leadsStmt = $db->query("SELECT * FROM ebook_leads ORDER BY id DESC LIMIT 50");
    $leads = $leadsStmt->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản Trị Báo Cáo | Thu Hiền - Cùng Mẹ Hiểu Con</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="/assets/css/style.css">
    <style>
        .badge-pending { background-color: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; }
        .badge-contacted { background-color: #DBEAFE; color: #1E40AF; border: 1px solid #93C5FD; }
        .badge-in_progress { background-color: #E0E7FF; color: #3730A3; border: 1px solid #A5B4FC; }
        .badge-completed { background-color: #D1FAE5; color: #065F46; border: 1px solid #6EE7B7; }
        .badge-cancelled { background-color: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; }
    </style>
</head>
<body class="bg-[#FAF7F0] text-[#174C3B] min-h-screen">

<?php if (!$isLoggedIn): ?>
<!-- ==========================================================================
     ADMIN LOGIN SCREEN
     ========================================================================== -->
<div class="min-h-screen flex items-center justify-center p-6">
    <div class="double-bezel max-w-md w-full">
        <div class="double-bezel-inner p-8 text-center">
            
            <div class="w-14 h-14 rounded-full bg-[#174C3B] text-white flex items-center justify-center mx-auto mb-4 font-serif font-bold text-xl shadow-sm">
                TH
            </div>
            
            <h2 class="font-serif text-2xl font-bold text-[#174C3B] mb-1">Cổng Quản Trị Báo Cáo</h2>
            <p class="text-xs text-[#5F6E66] mb-6">Chuyên Gia Dinh Dưỡng Thu Hiền • Cùng Mẹ Hiểu Con</p>

            <form id="adminLoginForm" class="space-y-4 text-left">
                <div>
                    <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase">Tài Khoản</label>
                    <input type="text" name="username" required value="admin" class="w-full px-4 py-2.5 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                </div>

                <div>
                    <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase">Mật Khẩu</label>
                    <input type="password" name="password" required placeholder="Nhập mật khẩu..." class="w-full px-4 py-2.5 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                    <span class="block text-[11px] text-[#8B9992] mt-1">*Mật khẩu mặc định: <code>thuhien2026</code></span>
                </div>

                <div class="pt-2">
                    <button type="submit" class="btn-pill-primary w-full justify-center">
                        <span>Đăng Nhập Quản Trị</span>
                    </button>
                </div>
            </form>

            <div class="pt-6 border-t border-[#8FAF91]/20 mt-6">
                <a href="/" class="text-xs text-[#5F6E66] hover:text-[#174C3B]">← Quay lại Trang Chủ</a>
            </div>

        </div>
    </div>
</div>

<script>
    document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        formData.append('action', 'admin_login');

        try {
            const res = await fetch('/api?action=admin_login', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.message || 'Sai thông tin đăng nhập');
            }
        } catch(err) {
            alert('Lỗi kết nối máy chủ');
        }
    });
</script>

<?php else: ?>
<!-- ==========================================================================
     ADMIN AUTHENTICATED DASHBOARD & REPORTS
     ========================================================================== -->
<div class="max-w-7xl mx-auto px-6 py-8">
    
    <!-- Top Nav Bar -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#8FAF91]/30">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#174C3B] text-white flex items-center justify-center font-serif font-bold text-lg">
                TH
            </div>
            <div>
                <h1 class="font-serif text-2xl font-bold text-[#174C3B] leading-none">Báo Cáo Hoạt Động & Hồ Sơ Mẹ Bé</h1>
                <span class="text-xs text-[#5F6E66] mt-1 block">Chào Chuyên gia Thu Hiền • Hệ thống sẵn sàng</span>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <a href="/" class="px-4 py-2 rounded-full bg-white border border-[#8FAF91]/40 text-xs font-semibold hover:bg-[#EEF5EA] text-[#174C3B] transition-colors">
                Xem Trang Chủ
            </a>
            <a href="/dat-lich" class="px-4 py-2 rounded-full bg-white border border-[#8FAF91]/40 text-xs font-semibold hover:bg-[#EEF5EA] text-[#174C3B] transition-colors">
                Trang Đặt Lịch
            </a>
            <button id="adminLogoutBtn" class="px-4 py-2 rounded-full bg-[#174C3B] text-white text-xs font-semibold hover:bg-[#1F5A45] transition-colors">
                Đăng Xuất
            </button>
        </div>
    </header>

    <!-- 1. KPI Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        
        <div class="p-5 rounded-2xl bg-white border border-[#8FAF91]/30 shadow-xs">
            <span class="text-[11px] font-bold uppercase text-[#8FAF91] block mb-1">Tổng Lịch Hẹn</span>
            <div class="font-serif text-3xl font-bold text-[#174C3B]"><?= $totalBookings ?></div>
            <span class="text-[11px] text-[#5F6E66] mt-1 block">Hồ sơ đăng ký</span>
        </div>

        <div class="p-5 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] shadow-xs">
            <span class="text-[11px] font-bold uppercase text-[#92400E] block mb-1">Chờ Liên Hệ</span>
            <div class="font-serif text-3xl font-bold text-[#92400E]"><?= $pendingBookings ?></div>
            <span class="text-[11px] text-[#92400E] mt-1 block">Cần kết nối Zalo</span>
        </div>

        <div class="p-5 rounded-2xl bg-[#DBEAFE] border border-[#93C5FD] shadow-xs">
            <span class="text-[11px] font-bold uppercase text-[#1E40AF] block mb-1">Đã Liên Hệ</span>
            <div class="font-serif text-3xl font-bold text-[#1E40AF]"><?= $contactedBookings ?></div>
            <span class="text-[11px] text-[#1E40AF] mt-1 block">Đã hẹn giờ gọi</span>
        </div>

        <div class="p-5 rounded-2xl bg-[#E0E7FF] border border-[#A5B4FC] shadow-xs">
            <span class="text-[11px] font-bold uppercase text-[#3730A3] block mb-1">Đang Theo Dõi</span>
            <div class="font-serif text-3xl font-bold text-[#3730A3]"><?= $inProgressBookings ?></div>
            <span class="text-[11px] text-[#3730A3] mt-1 block">Phác đồ 21 ngày</span>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-[#8FAF91]/30 shadow-xs">
            <span class="text-[11px] font-bold uppercase text-[#F08A4B] block mb-1">Tải Cẩm Nang</span>
            <div class="font-serif text-3xl font-bold text-[#F08A4B]"><?= $totalLeads ?></div>
            <span class="text-[11px] text-[#5F6E66] mt-1 block">Phụ huynh quan tâm</span>
        </div>

        <div class="p-5 rounded-2xl bg-white border border-[#8FAF91]/30 shadow-xs">
            <span class="text-[11px] font-bold uppercase text-[#174C3B] block mb-1">Tỷ Lệ Chuyển Đổi</span>
            <div class="font-serif text-3xl font-bold text-[#174C3B]"><?= $conversionRate ?>%</div>
            <span class="text-[11px] text-[#5F6E66] mt-1 block"><?= $totalViews ?> lượt truy cập</span>
        </div>

    </div>

    <!-- 2. Main Tabs Navigation -->
    <div class="flex items-center gap-4 mb-6 border-b border-[#8FAF91]/30 pb-3">
        <button id="tabBookingsBtn" class="font-serif font-bold text-lg text-[#174C3B] border-b-2 border-[#174C3B] pb-2 px-1 focus:outline-none">
            Danh Sách Đăng Ký Tư Vấn (<?= count($bookings) ?>)
        </button>
        <button id="tabLeadsBtn" class="font-serif font-medium text-lg text-[#5F6E66] hover:text-[#174C3B] pb-2 px-1 focus:outline-none">
            Khách Tải Cẩm Nang Ebook (<?= count($leads) ?>)
        </button>
    </div>

    <!-- 3. BOOKINGS TAB -->
    <div id="tabBookings">
        <!-- Actions & Filter Bar -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
                <input type="text" id="searchInput" placeholder="Tìm theo tên mẹ hoặc SĐT..." class="px-4 py-2 rounded-xl border border-[#8FAF91]/40 bg-white text-xs w-64 focus:outline-none focus:border-[#174C3B]">
                <select id="statusFilter" class="px-3 py-2 rounded-xl border border-[#8FAF91]/40 bg-white text-xs focus:outline-none">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ liên hệ</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="in_progress">Đang theo dõi phác đồ</option>
                    <option value="completed">Đã hoàn thành</option>
                </select>
            </div>

            <div>
                <a href="/api?action=export_csv&type=bookings" class="px-4 py-2 rounded-full bg-[#174C3B] text-white text-xs font-semibold hover:bg-[#1F5A45] flex items-center gap-2">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Xuất Excel / CSV</span>
                </a>
            </div>
        </div>

        <!-- Bookings Table Card -->
        <div class="bg-white rounded-2xl border border-[#8FAF91]/30 shadow-xs overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs" id="bookingsTable">
                    <thead class="bg-[#EEF5EA] text-[#174C3B] uppercase font-bold tracking-wider border-b border-[#8FAF91]/30">
                        <tr>
                            <th class="p-4">ID</th>
                            <th class="p-4">Mẹ & Liên Hệ</th>
                            <th class="p-4">Thông Tin Bé</th>
                            <th class="p-4">Vấn Đề Gặp Phải</th>
                            <th class="p-4">Gói Tư Vấn</th>
                            <th class="p-4">Trạng Thái</th>
                            <th class="p-4 text-center">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#8FAF91]/20 text-[#174C3B]">
                        <?php if (empty($bookings)): ?>
                            <tr>
                                <td colspan="7" class="p-8 text-center text-[#5F6E66]">Chưa có lượt đăng ký tư vấn nào.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($bookings as $b): ?>
                                <tr class="hover:bg-[#FAF7F0] transition-colors booking-row" data-status="<?= htmlspecialchars($b['status']) ?>" data-search="<?= htmlspecialchars(strtolower($b['parent_name'] . ' ' . $b['phone'] . ' ' . $b['baby_name'])) ?>">
                                    <td class="p-4 font-mono font-bold text-[#8FAF91]">#<?= $b['id'] ?></td>
                                    
                                    <td class="p-4">
                                        <div class="font-bold text-sm text-[#174C3B]"><?= htmlspecialchars($b['parent_name']) ?></div>
                                        <div class="font-mono text-[#5F6E66]"><?= htmlspecialchars($b['phone']) ?></div>
                                        <?php if ($b['email']): ?>
                                            <div class="text-[11px] text-[#8B9992]"><?= htmlspecialchars($b['email']) ?></div>
                                        <?php endif; ?>
                                        <div class="text-[10px] text-[#F08A4B] mt-0.5">Hẹn: <?= htmlspecialchars($b['preferred_time']) ?></div>
                                    </td>

                                    <td class="p-4">
                                        <div class="font-bold"><?= htmlspecialchars($b['baby_name'] ?: 'Bé') ?></div>
                                        <div class="text-[11px] text-[#5F6E66]">Tuổi: <strong><?= htmlspecialchars($b['baby_age']) ?></strong></div>
                                        <div class="text-[11px] text-[#5F6E66]">
                                            <?= htmlspecialchars($b['baby_weight'] ? $b['baby_weight'] . ' / ' : '') ?>
                                            <?= htmlspecialchars($b['baby_height'] ?: '') ?>
                                        </div>
                                    </td>

                                    <td class="p-4 max-w-xs">
                                        <div class="font-medium text-[#174C3B] mb-1"><?= htmlspecialchars($b['issues']) ?></div>
                                        <?php if ($b['feeding_notes']): ?>
                                            <div class="text-[11px] text-[#5F6E66] line-clamp-2 italic bg-[#EEF5EA]/60 p-1.5 rounded">
                                                "<?= htmlspecialchars($b['feeding_notes']) ?>"
                                            </div>
                                        <?php endif; ?>
                                    </td>

                                    <td class="p-4">
                                        <span class="inline-block px-2.5 py-1 rounded-lg bg-[#FAF7F0] border border-[#8FAF91]/30 text-[11px] font-medium">
                                            <?= htmlspecialchars($b['consult_type']) ?>
                                        </span>
                                    </td>

                                    <td class="p-4">
                                        <select class="status-select px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none badge-<?= htmlspecialchars($b['status']) ?>" data-id="<?= $b['id'] ?>">
                                            <option value="pending" <?= $b['status'] === 'pending' ? 'selected' : '' ?>>Chờ liên hệ</option>
                                            <option value="contacted" <?= $b['status'] === 'contacted' ? 'selected' : '' ?>>Đã liên hệ</option>
                                            <option value="in_progress" <?= $b['status'] === 'in_progress' ? 'selected' : '' ?>>Đang theo dõi</option>
                                            <option value="completed" <?= $b['status'] === 'completed' ? 'selected' : '' ?>>Hoàn thành</option>
                                            <option value="cancelled" <?= $b['status'] === 'cancelled' ? 'selected' : '' ?>>Đã hủy</option>
                                        </select>
                                    </td>

                                    <td class="p-4 text-center">
                                        <div class="flex items-center justify-center gap-2">
                                            <button class="view-detail-btn px-2.5 py-1 rounded-lg bg-[#EEF5EA] text-[#174C3B] font-semibold hover:bg-[#8FAF91]/30 transition-colors" data-details='<?= htmlspecialchars(json_encode($b), ENT_QUOTES, 'UTF-8') ?>'>
                                                Chi Tiết
                                            </button>
                                            <button class="delete-booking-btn text-red-500 hover:text-red-700 p-1" data-id="<?= $b['id'] ?>" title="Xóa hồ sơ">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- 4. EBOOK LEADS TAB -->
    <div id="tabLeads" class="hidden">
        <div class="flex items-center justify-between gap-4 mb-4">
            <h3 class="font-serif font-bold text-lg text-[#174C3B]">Danh Sách Phụ Huynh Đăng Ký Tải Cẩm Nang Thực Đơn</h3>
            <a href="/api?action=export_csv&type=leads" class="px-4 py-2 rounded-full bg-[#174C3B] text-white text-xs font-semibold hover:bg-[#1F5A45] flex items-center gap-2">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Xuất Danh Sách Leads</span>
            </a>
        </div>

        <div class="bg-white rounded-2xl border border-[#8FAF91]/30 shadow-xs overflow-hidden">
            <table class="w-full text-left text-xs">
                <thead class="bg-[#EEF5EA] text-[#174C3B] uppercase font-bold tracking-wider border-b border-[#8FAF91]/30">
                    <tr>
                        <th class="p-4">ID</th>
                        <th class="p-4">Tên Mẹ</th>
                        <th class="p-4">Số Điện Thoại Zalo</th>
                        <th class="p-4">Email</th>
                        <th class="p-4">Tuổi Của Bé</th>
                        <th class="p-4">Tài Liệu</th>
                        <th class="p-4">Thời Gian</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#8FAF91]/20">
                    <?php if (empty($leads)): ?>
                        <tr><td colspan="7" class="p-8 text-center text-[#5F6E66]">Chưa có lượt tải nào.</td></tr>
                    <?php else: ?>
                        <?php foreach ($leads as $lead): ?>
                            <tr class="hover:bg-[#FAF7F0]">
                                <td class="p-4 font-mono font-bold text-[#8FAF91]">#<?= $lead['id'] ?></td>
                                <td class="p-4 font-bold text-[#174C3B]"><?= htmlspecialchars($lead['parent_name']) ?></td>
                                <td class="p-4 font-mono"><?= htmlspecialchars($lead['phone']) ?></td>
                                <td class="p-4 text-[#5F6E66]"><?= htmlspecialchars($lead['email'] ?: '-') ?></td>
                                <td class="p-4"><?= htmlspecialchars($lead['baby_age'] ?: '-') ?></td>
                                <td class="p-4 text-[11px] text-[#F08A4B] font-semibold"><?= htmlspecialchars($lead['resource_name']) ?></td>
                                <td class="p-4 text-[#8B9992] text-[11px]"><?= htmlspecialchars($lead['created_at']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- Booking Detail Modal -->
<div id="detailModal" class="modal-overlay">
    <div class="modal-content max-w-2xl">
        <div class="bg-white rounded-[calc(2rem-0.5rem)] p-6 sm:p-8 relative">
            <button id="closeDetailModal" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#174C3B]">✕</button>
            <div id="detailModalContent"></div>
        </div>
    </div>
</div>

<script>
    // Tab switching
    const tabBookingsBtn = document.getElementById('tabBookingsBtn');
    const tabLeadsBtn = document.getElementById('tabLeadsBtn');
    const tabBookings = document.getElementById('tabBookings');
    const tabLeads = document.getElementById('tabLeads');

    tabBookingsBtn.addEventListener('click', () => {
        tabBookings.classList.remove('hidden');
        tabLeads.classList.add('hidden');
        tabBookingsBtn.classList.add('border-b-2', 'border-[#174C3B]', 'font-bold', 'text-[#174C3B]');
        tabBookingsBtn.classList.remove('text-[#5F6E66]', 'font-medium');
        tabLeadsBtn.classList.remove('border-b-2', 'border-[#174C3B]', 'font-bold', 'text-[#174C3B]');
        tabLeadsBtn.classList.add('text-[#5F6E66]', 'font-medium');
    });

    tabLeadsBtn.addEventListener('click', () => {
        tabLeads.classList.remove('hidden');
        tabBookings.classList.add('hidden');
        tabLeadsBtn.classList.add('border-b-2', 'border-[#174C3B]', 'font-bold', 'text-[#174C3B]');
        tabLeadsBtn.classList.remove('text-[#5F6E66]', 'font-medium');
        tabBookingsBtn.classList.remove('border-b-2', 'border-[#174C3B]', 'font-bold', 'text-[#174C3B]');
        tabBookingsBtn.classList.add('text-[#5F6E66]', 'font-medium');
    });

    // Realtime Status Update
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const id = e.target.dataset.id;
            const status = e.target.value;
            const formData = new FormData();
            formData.append('action', 'update_booking');
            formData.append('id', id);
            formData.append('status', status);

            e.target.className = `status-select px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none badge-${status}`;

            try {
                const res = await fetch('/api?action=update_booking', { method: 'POST', body: formData });
                const data = await res.json();
                if (!data.success) alert(data.message);
            } catch(err) {
                alert('Lỗi cập nhật');
            }
        });
    });

    // Filter & Search
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const rows = document.querySelectorAll('.booking-row');

    function filterRows() {
        const query = (searchInput.value || '').toLowerCase().trim();
        const selectedStatus = statusFilter.value;

        rows.forEach(row => {
            const rowSearch = row.dataset.search || '';
            const rowStatus = row.dataset.status || '';

            const matchQuery = !query || rowSearch.includes(query);
            const matchStatus = selectedStatus === 'all' || rowStatus === selectedStatus;

            row.style.display = (matchQuery && matchStatus) ? '' : 'none';
        });
    }

    searchInput.addEventListener('input', filterRows);
    statusFilter.addEventListener('change', filterRows);

    // Detail Modal Handler
    const detailModal = document.getElementById('detailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailModalContent = document.getElementById('detailModalContent');

    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const b = JSON.parse(btn.dataset.details);
            detailModalContent.innerHTML = `
                <div class="mb-4 pb-3 border-b border-[#8FAF91]/30">
                    <span class="text-xs font-bold text-[#8FAF91] uppercase">HỒ SƠ TIẾP NHẬN #TH-${b.id}</span>
                    <h3 class="font-serif text-2xl font-bold text-[#174C3B]">${b.parent_name}</h3>
                    <div class="text-xs text-[#5F6E66]">Số điện thoại: <strong>${b.phone}</strong> | Email: ${b.email || 'Chưa cung cấp'}</div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4 text-xs bg-[#EEF5EA] p-4 rounded-xl">
                    <div>
                        <span class="text-[#8FAF91] font-bold block">Tên bé & Độ tuổi</span>
                        <div class="font-bold text-[#174C3B] text-sm">${b.baby_name || 'Bé'} • ${b.baby_age}</div>
                    </div>
                    <div>
                        <span class="text-[#8FAF91] font-bold block">Cân nặng & Chiều cao</span>
                        <div class="font-bold text-[#174C3B] text-sm">${b.baby_weight || '-'} / ${b.baby_height || '-'}</div>
                    </div>
                </div>

                <div class="mb-4 text-xs">
                    <span class="font-bold text-[#174C3B] block mb-1">Vấn đề bé đang gặp:</span>
                    <div class="p-3 rounded-lg bg-[#FAF7F0] border border-[#8FAF91]/30 text-[#174C3B] leading-relaxed">
                        ${b.issues || 'Không có mô tả'}
                    </div>
                </div>

                <div class="mb-4 text-xs">
                    <span class="font-bold text-[#174C3B] block mb-1">Thói quen ăn uống & Nhật ký mẹ chia sẻ:</span>
                    <div class="p-3 rounded-lg bg-[#FAF7F0] border border-[#8FAF91]/30 text-[#5F6E66] italic leading-relaxed">
                        ${b.feeding_notes || 'Chưa ghi nhật ký chi tiết'}
                    </div>
                </div>

                <div class="mb-4 text-xs">
                    <label class="font-bold text-[#174C3B] block mb-1">Ghi chú của Chuyên gia Thu Hiền:</label>
                    <textarea id="adminNotesInput" class="w-full p-2.5 rounded-lg border border-[#8FAF91]/40 text-xs focus:outline-none" rows="3" placeholder="Ghi chú lịch hẹn, tiến độ phục hồi...">${b.admin_notes || ''}</textarea>
                    <button class="mt-2 px-3 py-1.5 rounded-lg bg-[#174C3B] text-white text-xs font-semibold" onclick="saveAdminNotes(${b.id})">Lưu Ghi Chú</button>
                </div>
            `;
            detailModal.classList.add('active');
        });
    });

    window.saveAdminNotes = async function(id) {
        const notes = document.getElementById('adminNotesInput').value;
        const formData = new FormData();
        formData.append('action', 'update_booking');
        formData.append('id', id);
        formData.append('admin_notes', notes);

        try {
            const res = await fetch('/api?action=update_booking', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                alert('Đã lưu ghi chú thành công!');
                window.location.reload();
            }
        } catch(e) {
            alert('Lỗi lưu ghi chú');
        }
    };

    closeDetailModal.addEventListener('click', () => detailModal.classList.remove('active'));

    // Delete booking
    document.querySelectorAll('.delete-booking-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
                const id = btn.dataset.id;
                const formData = new FormData();
                formData.append('action', 'delete_booking');
                formData.append('id', id);

                const res = await fetch('/api?action=delete_booking', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                    window.location.reload();
                } else {
                    alert(data.message);
                }
            }
        });
    });

    // Admin Logout
    document.getElementById('adminLogoutBtn').addEventListener('click', async () => {
        await fetch('/api?action=admin_logout');
        window.location.reload();
    });
</script>

<?php endif; ?>

</body>
</html>
