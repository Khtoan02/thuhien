<?php
/**
 * Main Front Controller & Clean URL Router
 * Thu Hiền - Cùng Mẹ Hiểu Con
 * 
 * Supports clean URLs:
 *   / or /home     -> Homepage
 *   /dat-lich      -> 1-on-1 Consultation Booking
 *   /admin         -> Admin Dashboard & Reports
 *   /api           -> API Endpoint
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Clean trailing slashes except for root
if ($uri !== '/' && substr($uri, -1) === '/') {
    $uri = rtrim($uri, '/');
}

// Redirect if request contains .html or .php extension to enforce clean URLs
if (preg_match('#^/(home|dat-lich|admin)\.(php|html)$#i', $uri, $matches)) {
    header('Location: /' . strtolower($matches[1]), true, 301);
    exit;
}

// Route mapping
switch ($uri) {
    case '':
    case '/':
    case '/home':
    case '/index':
        require_once __DIR__ . '/pages/home.php';
        break;

    case '/dat-lich':
        require_once __DIR__ . '/pages/dat-lich.php';
        break;

    case '/admin':
        require_once __DIR__ . '/pages/admin.php';
        break;

    case '/api':
        require_once __DIR__ . '/api.php';
        break;

    default:
        // Check if static file exists in public directories
        $filePath = __DIR__ . $uri;
        if (file_exists($filePath) && !is_dir($filePath)) {
            return false; // let web server handle static file
        }
        
        // 404 fallback page matching the brand aesthetic
        http_response_code(404);
        ?>
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Không Tìm Thấy Trang | Thu Hiền - Cùng Mẹ Hiểu Con</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="/assets/css/style.css">
        </head>
        <body class="bg-[#FAF7F0] text-[#174C3B] min-h-screen flex items-center justify-center p-6 text-center">
            <div class="double-bezel max-w-md w-full">
                <div class="double-bezel-inner p-8">
                    <span class="eyebrow-badge mb-3">LỖI 404</span>
                    <h2 class="font-serif text-3xl font-bold text-[#174C3B] mb-3">Không Tìm Thấy Trang</h2>
                    <p class="text-[#5F6E66] text-sm mb-6">Trang Mẹ đang tìm kiếm không tồn tại hoặc đã được thay đổi địa chỉ.</p>
                    <a href="/" class="btn-pill-primary justify-center">
                        <span>Về Trang Chủ</span>
                    </a>
                </div>
            </div>
        </body>
        </html>
        <?php
        break;
}
