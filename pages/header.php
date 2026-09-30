<?php
/**
 * Shared Header for Thu Hiền - Cùng Mẹ Hiểu Con
 */
$pageTitle = $pageTitle ?? 'Chuyên Gia Dinh Dưỡng Thu Hiền | Cùng Mẹ Hiểu Con';
$pageDesc = $pageDesc ?? 'Nuôi con bằng sự thấu hiểu, không áp lực từ chiếc cân. Chuyên gia Dinh dưỡng Thu Hiền đồng hành cùng mẹ qua 4 trụ cột khoa học: Đường ruột, Vi chất, Não bộ và Nhịp sinh học.';
$currentPage = $currentPage ?? 'home';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <meta name="description" content="<?= htmlspecialchars($pageDesc) ?>">
    
    <!-- OpenGraph & SEO -->
    <meta property="og:title" content="<?= htmlspecialchars($pageTitle) ?>">
    <meta property="og:description" content="<?= htmlspecialchars($pageDesc) ?>">
    <meta property="og:type" content="website">
    <meta name="theme-color" content="#174C3B">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            primary: '#174C3B',
                            primaryLight: '#1F5A45',
                            sage: '#8FAF91',
                            sageLight: '#A9C2A4',
                            mintSub: '#EEF5EA',
                            creamBg: '#FAF7F0',
                            peach: '#F08A4B',
                            peachHover: '#E07837',
                            textMuted: '#5F6E66'
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                        serif: ['"Fraunces"', 'Georgia', 'serif']
                    }
                }
            }
        }
    </script>

    <!-- Custom Design System Stylesheet -->
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body data-page="<?= htmlspecialchars($currentPage) ?>" class="bg-[#FAF7F0] text-[#174C3B] selection:bg-[#F08A4B]/20 selection:text-[#174C3B]">

<!-- Floating Navigation Island -->
<header class="nav-island">
    <nav class="nav-island-inner">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group text-decoration-none">
            <div class="w-10 h-10 rounded-full bg-[#174C3B] text-[#FAF7F0] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <!-- Medical / Nutrition Seedling Leaf SVG -->
                <svg class="w-5 h-5 text-[#FAF7F0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9a9 9 0 0 0 9 9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 7c2 2 3 5 3 7s-1 4-3 5"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 12c-2 0-4-1.5-4-3.5"/>
                </svg>
            </div>
            <div class="flex flex-col">
                <span class="font-serif font-bold text-lg md:text-xl text-[#174C3B] leading-none tracking-tight">Thu Hiền</span>
                <span class="text-[11px] font-medium text-[#5F6E66] tracking-wide mt-1 uppercase">Cùng Mẹ Hiểu Con</span>
            </div>
        </a>

        <!-- Desktop Menu Links -->
        <div class="hidden md:flex items-center gap-7 text-[14.5px] font-medium text-[#5F6E66]">
            <a href="/" class="hover:text-[#174C3B] transition-colors <?= $currentPage === 'home' ? 'text-[#174C3B] font-semibold' : '' ?>">Trang Chủ</a>
            <a href="/#triet-ly" class="hover:text-[#174C3B] transition-colors">Triết Lý</a>
            <a href="/#tru-cot" class="hover:text-[#174C3B] transition-colors">4 Trụ Cột</a>
            <a href="/#cam-nhan" class="hover:text-[#174C3B] transition-colors">Cảm Nhận Mẹ</a>
            <a href="/#cam-nang" class="hover:text-[#174C3B] transition-colors">Cẩm Nang Ebook</a>
            <a href="/dat-lich" class="hover:text-[#174C3B] transition-colors <?= $currentPage === 'booking' ? 'text-[#174C3B] font-semibold' : '' ?>">Đặt Lịch</a>
        </div>

        <!-- Desktop Action CTA -->
        <div class="hidden sm:flex items-center gap-3">
            <a href="/dat-lich" class="btn-pill-primary group">
                <span class="text-sm">Đặt Lịch 1-1</span>
                <span class="btn-circle-icon">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                </span>
            </a>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button id="mobileMenuBtn" class="md:hidden w-10 h-10 rounded-full flex items-center justify-center border border-[#8FAF91]/30 text-[#174C3B] focus:outline-none" aria-label="Toggle navigation">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
        </button>
    </nav>

    <!-- Mobile Drawer Overlay -->
    <div id="mobileDrawer" class="hidden fixed inset-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-xl p-6 flex flex-col justify-between">
        <div>
            <div class="flex items-center justify-between pb-6 border-b border-[#8FAF91]/20">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-[#174C3B] text-white flex items-center justify-center font-serif font-bold">TH</div>
                    <div>
                        <div class="font-serif font-bold text-lg text-[#174C3B]">Thu Hiền</div>
                        <div class="text-[11px] text-[#5F6E66]">Cùng Mẹ Hiểu Con</div>
                    </div>
                </div>
                <button id="mobileDrawerClose" class="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[#174C3B]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="flex flex-col gap-5 pt-8 text-lg font-medium text-[#174C3B]">
                <a href="/" class="hover:text-[#F08A4B] transition-colors">Trang Chủ</a>
                <a href="/#triet-ly" class="hover:text-[#F08A4B] transition-colors">Triết Lý Dinh Dưỡng</a>
                <a href="/#tru-cot" class="hover:text-[#F08A4B] transition-colors">4 Trụ Cột Khoa Học</a>
                <a href="/#cam-nhan" class="hover:text-[#F08A4B] transition-colors">Góc Cảm Nhận Của Mẹ</a>
                <a href="/#cam-nang" class="hover:text-[#F08A4B] transition-colors">Cẩm Nang 30 Thực Đơn</a>
                <a href="/dat-lich" class="hover:text-[#F08A4B] transition-colors">Đăng Ký Tư Vấn 1-1</a>
                <a href="/admin" class="hover:text-[#F08A4B] transition-colors text-sm text-[#5F6E66] pt-4 border-t border-[#8FAF91]/20">Trang Quản Trị</a>
            </div>
        </div>
        <div class="pt-6">
            <a href="/dat-lich" class="btn-pill-peach w-full justify-center">
                <span>Đặt Lịch Tư Vấn Ngay</span>
                <span class="btn-circle-icon">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>
                    </svg>
                </span>
            </a>
        </div>
    </div>
</header>

<script>
    // Simple toggle for mobile drawer
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileClose = document.getElementById('mobileDrawerClose');
    const mobileDrawer = document.getElementById('mobileDrawer');
    if (mobileBtn && mobileDrawer) {
        mobileBtn.addEventListener('click', () => {
            mobileDrawer.classList.remove('hidden');
        });
        mobileClose.addEventListener('click', () => {
            mobileDrawer.classList.add('hidden');
        });
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileDrawer.classList.add('hidden'));
        });
    }
</script>
