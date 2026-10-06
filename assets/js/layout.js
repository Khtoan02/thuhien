/**
 * Unified Global Layout Engine for Thu Hiền - Cùng Mẹ Hiểu Con
 * Single Source of Truth for Header, Navigation Island, Mobile Drawer & Footer across all pages.
 */

const LayoutEngine = (() => {
    function getRootPrefix() {
        if (typeof window === 'undefined') return './';
        const path = window.location.pathname.toLowerCase();
        const isSubdir = path.includes('/chuyen-gia') || 
                         path.includes('/dinh-duong') || 
                         path.includes('/cong-dong') || 
                         path.includes('/pricing') || 
                         path.includes('/danh-gia-dinh-duong') || 
                         path.includes('/danh-gia-thieu-sat') || 
                         path.includes('/tra-cuu') || 
                         path.includes('/dat-lich') ||
                         path.includes('/admin');
        return isSubdir ? '../' : './';
    }

    function renderGlobalMobileDrawer(prefix, pages, isAdmin, currentPath, datLichHref) {
        let drawerEl = document.getElementById('globalMobileDrawer');
        if (!drawerEl) {
            drawerEl = document.createElement('div');
            drawerEl.id = 'globalMobileDrawer';
            document.body.appendChild(drawerEl);
        }

        drawerEl.className = "fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs transition-opacity duration-300 hidden";

        const mobileLinksHtml = pages.map(p => {
            const isEnabled = p.enabled !== false;
            if (!isEnabled && !isAdmin) return '';

            const bodyPage = document.body ? (document.body.getAttribute('data-page') || '') : '';
            const isHome = (p.path === '/' || p.slug === 'home' || p.id === 'home') && 
                           (bodyPage === 'home' || currentPath === '/' || currentPath === '' || currentPath.endsWith('/thuhien') || currentPath.endsWith('/thuhien/'));
            const isActive = isHome || 
                             (bodyPage && (bodyPage === p.slug || bodyPage === p.id || (p.slug && bodyPage.includes(p.slug)))) || 
                             (p.slug && p.slug !== 'home' && currentPath.includes('/' + p.slug));

            let activeClass = isActive 
                ? 'bg-[#EEF5EA] text-[#174C3B] font-bold border-l-4 border-[#174C3B]' 
                : 'text-zinc-700 hover:bg-zinc-50 font-medium';

            let badge = (!isEnabled && isAdmin) 
                ? `<span class="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">Ẩn</span>` 
                : '';

            return `
                <a href="${href}" class="flex items-center justify-between px-4 py-3 rounded-xl ${activeClass} transition-colors text-sm">
                    <span>${p.title}</span>
                    ${badge}
                </a>
            `;
        }).join('');

        const settings = typeof DB !== 'undefined' ? DB.getSettings() : {};
        const hotline = settings.social?.hotline_display || settings.social?.hotline || '0988 776 655';
        const zaloLink = settings.social?.zalo_link || 'https://zalo.me/0988776655';

        drawerEl.innerHTML = `
            <div class="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
                <div>
                    <!-- Header with Close button -->
                    <div class="flex items-center justify-between pb-5 border-b border-zinc-100">
                        <div class="flex items-center gap-2.5">
                            <img src="${prefix}favicon.png" alt="Thu Hiền" class="w-8 h-8 rounded-full object-cover">
                            <div>
                                <span class="font-bold text-sm text-[#174C3B] block leading-none">Thu Hiền</span>
                                <span class="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Cùng Mẹ Hiểu Con</span>
                            </div>
                        </div>
                        <button id="globalMobileDrawerClose" class="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center hover:bg-zinc-200 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <!-- Navigation Items -->
                    <div class="py-4 space-y-1">
                        ${mobileLinksHtml}
                    </div>
                </div>

                <!-- Footer of Drawer -->
                <div class="pt-4 border-t border-zinc-100 space-y-3">
                    <a href="${datLichHref}" class="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#174C3B] text-white font-bold text-sm shadow-md hover:bg-[#133F31] transition-colors">
                        <span>Đặt Lịch Tư Vấn 1:1</span>
                        <span>→</span>
                    </a>
                    <a href="${zaloLink}" target="_blank" rel="noopener" class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-zinc-200 text-[#174C3B] font-bold text-xs hover:bg-zinc-50 transition-colors">
                        <span>Zalo: ${hotline}</span>
                    </a>
                </div>
            </div>
        `;

        // Event listeners for open / close
        const btnOpen = document.getElementById('globalMobileMenuBtn');
        const btnClose = document.getElementById('globalMobileDrawerClose');

        if (btnOpen) {
            btnOpen.onclick = (e) => {
                e.preventDefault();
                drawerEl.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            };
        }
        if (btnClose) {
            btnClose.onclick = () => {
                drawerEl.classList.add('hidden');
                document.body.style.overflow = '';
            };
        }
        drawerEl.onclick = (e) => {
            if (e.target === drawerEl) {
                drawerEl.classList.add('hidden');
                document.body.style.overflow = '';
            }
        };
    }

    function renderGlobalHeader() {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;
        if (window.location.pathname.includes('/admin')) return;

        const prefix = getRootPrefix();
        const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
        let pages = [];
        if (typeof DB !== 'undefined' && typeof DB.getPages === 'function') {
            pages = DB.getPages();
        } else {
            try {
                const s = JSON.parse(localStorage.getItem('thuhien_site_settings'));
                if (s && Array.isArray(s.pages)) pages = s.pages;
            } catch (e) {}
        }

        let isAdmin = false;
        if (typeof DB !== 'undefined' && typeof DB.isAdminAuthenticated === 'function') {
            isAdmin = DB.isAdminAuthenticated();
        } else {
            try {
                isAdmin = (sessionStorage.getItem('thuhien_admin_auth') === 'true') ||
                          (localStorage.getItem('thuhien_admin_auth') === 'true');
            } catch (e) {}
        }

        let headerEl = document.querySelector('header.nav-island');
        if (!headerEl) {
            headerEl = document.createElement('header');
            headerEl.className = 'nav-island';
            document.body.prepend(headerEl);
        }

        // Render Desktop / Tablet Navigation Items
        const navItemsHtml = pages.map(p => {
            if (p.id === 'dat-lich') return ''; // Primary CTA button rendered separately

            const isEnabled = p.enabled !== false;
            if (!isEnabled && !isAdmin) return '';

            let href = p.path === '/' ? prefix : `${prefix}${p.path.replace(/^\//, '')}`;
            const bodyPage = document.body ? (document.body.getAttribute('data-page') || '') : '';
            const isHome = (p.path === '/' || p.slug === 'home' || p.id === 'home') && 
                           (bodyPage === 'home' || currentPath === '/' || currentPath === '' || currentPath.endsWith('/thuhien') || currentPath.endsWith('/thuhien/'));
            const isActive = isHome || 
                             (bodyPage && (bodyPage === p.slug || bodyPage === p.id || (p.slug && bodyPage.includes(p.slug)))) || 
                             (p.slug && p.slug !== 'home' && currentPath.includes('/' + p.slug));

            let activeClass = isActive 
                ? 'bg-white text-[#174C3B] font-bold shadow-2xs' 
                : 'text-white hover:bg-white/10 font-bold';

            let hiddenBadge = (!isEnabled && isAdmin) 
                ? `<span class="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-800 text-amber-200 border border-amber-600 font-bold">Ẩn</span>` 
                : '';

            // Short readable titles
            let displayTitle = p.title;
            if (p.id === 'home') displayTitle = 'Trang Chủ';
            else if (p.id === 'chuyen-gia') displayTitle = 'Chuyên Gia';
            else if (p.id === 'dinh-duong') displayTitle = 'Dinh Dưỡng';
            else if (p.id === 'danh-gia') displayTitle = 'Đánh Giá';
            else if (p.id === 'tra-cuu') displayTitle = 'Tra Cứu';
            else if (p.id === 'cong-dong') displayTitle = 'Cộng Đồng';
            else if (p.id === 'pricing') displayTitle = 'Bảng Giá';

            // Responsive visibility: On desktop (lg: >=1024px), all enabled pages show.
            // On mobile/tablet (<lg), secondary items collapse into Mobile Drawer.
            let responsiveClass = 'inline-flex';
            if (p.id === 'cong-dong' || p.id === 'pricing' || p.id === 'danh-gia' || p.id === 'tra-cuu') {
                responsiveClass = 'hidden lg:inline-flex';
            } else if (p.id === 'dinh-duong') {
                responsiveClass = 'hidden sm:inline-flex';
            }

            return `
                <a href="${href}" class="px-2 lg:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] ${activeClass} transition-all items-center ${responsiveClass}">
                    <span>${displayTitle}</span>
                    ${hiddenBadge}
                </a>
            `;
        }).join('');

        const datLichHref = `${prefix}dat-lich/`;

        headerEl.innerHTML = `
            <nav class="nav-island-inner justify-between">
                <!-- Logo -->
                <a href="${prefix}" class="flex items-center gap-2.5 sm:gap-3 group text-decoration-none shrink-0">
                    <img src="${prefix}favicon.png" alt="Thu Hiền Logo" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm ring-2 ring-white/80 group-hover:scale-105 transition-transform duration-300">
                    <div class="flex flex-col">
                        <span class="font-bold text-base sm:text-lg md:text-xl text-white leading-snug tracking-normal">Thu Hiền</span>
                        <span class="text-[10px] sm:text-[11px] font-medium text-white/90 tracking-wide uppercase">Cùng Mẹ Hiểu Con</span>
                    </div>
                </a>

                <!-- Desktop / Tablet Navigation Items -->
                <div class="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    ${navItemsHtml}

                    <!-- Mobile Menu Button -->
                    <button id="globalMobileMenuBtn" aria-label="Mở Menu" class="lg:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    </button>

                    <!-- Primary Action Button -->
                    <a href="${datLichHref}" class="bg-[#174C3B] hover:bg-[#133F31] text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-bold shadow-2xs flex items-center gap-1.5 group transition-all shrink-0">
                        <span class="text-xs sm:text-sm font-bold">Đặt Lịch 1:1</span>
                        <span class="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                            <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>
                            </svg>
                        </span>
                    </a>
                </div>
            </nav>
        `;

        renderGlobalMobileDrawer(prefix, pages, isAdmin, currentPath, datLichHref);
    }

    function renderGlobalFooter() {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;
        if (window.location.pathname.includes('/admin')) return;

        const prefix = getRootPrefix();
        let settings = {};
        if (typeof DB !== 'undefined' && typeof DB.getSettings === 'function') {
            settings = DB.getSettings();
        } else {
            try {
                settings = JSON.parse(localStorage.getItem('thuhien_site_settings')) || {};
            } catch (e) {}
        }
        const soc = settings.social || {};
        let pages = [];
        if (typeof DB !== 'undefined' && typeof DB.getPages === 'function') {
            pages = DB.getPages();
        } else if (Array.isArray(settings.pages)) {
            pages = settings.pages;
        }

        let footerEl = document.querySelector('footer');
        if (!footerEl) {
            footerEl = document.createElement('footer');
            document.body.appendChild(footerEl);
        }

        footerEl.className = "border-t border-[#8FAF91]/30 bg-[#FAF7F0] pt-14 pb-24 md:pb-12 text-[#174C3B] relative z-10";

        // Navigation links
        const navLinksHtml = pages
            .filter(p => p.enabled !== false)
            .map(p => {
                const href = p.path === '/' ? prefix : `${prefix}${p.path.replace(/^\//, '')}`;
                return `<li><a href="${href}" class="text-xs text-[#5F6E66] hover:text-[#174C3B] transition-colors font-medium">${p.title}</a></li>`;
            }).join('');

        const hotline = soc.hotline_display || soc.hotline || '0988 776 655';
        const zaloLink = soc.zalo_link || `https://zalo.me/${(soc.zalo_number || '0988776655').replace(/[^0-9]/g, '')}`;
        const facebookUrl = soc.facebook_url || 'https://www.facebook.com/thuhien.cungmehieucon?sub_confirmation=1';
        const tiktokUrl = soc.tiktok_url || 'https://www.tiktok.com/@thuhien.cungmehieucon?sub_confirmation=1';
        const youtubeUrl = soc.youtube_url || 'https://www.youtube.com/@thuhien.cungmehieucon?sub_confirmation=1';
        const emailContact = soc.email_contact || 'thuhien.cungmehieucon@gmail.com';

        footerEl.innerHTML = `
            <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#8FAF91]/20">
                    
                    <!-- Col 1: Brand Info -->
                    <div class="md:col-span-5 space-y-4">
                        <a href="${prefix}" class="inline-flex items-center gap-3 text-decoration-none group">
                            <img src="${prefix}favicon.png" alt="Thu Hiền Logo" class="w-10 h-10 rounded-full object-cover ring-2 ring-[#8FAF91]/30">
                            <div>
                                <span class="font-bold text-lg text-[#174C3B] block leading-snug">Thu Hiền</span>
                                <span class="text-[11px] font-medium text-[#5F6E66] tracking-wider uppercase mt-0.5 block">Cùng Mẹ Hiểu Con</span>
                            </div>
                        </a>
                        <p class="text-xs text-[#5F6E66] leading-relaxed max-w-sm">
                            Đồng hành cùng cha mẹ xây dựng thói quen ăn uống khoa học, tự lập và bình an cho trẻ rối loạn phát triển bằng những bước nhỏ, cá nhân hóa và bền vững trong đời sống thật.
                        </p>
                        <div class="flex items-center gap-3 pt-1">
                            <a href="${facebookUrl}" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-[#174C3B]/10 hover:bg-[#174C3B] text-[#174C3B] hover:text-white flex items-center justify-center transition-colors" title="Facebook">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                            <a href="${tiktokUrl}" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-[#174C3B]/10 hover:bg-[#174C3B] text-[#174C3B] hover:text-white flex items-center justify-center transition-colors" title="TikTok">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                            </a>
                            <a href="${youtubeUrl}" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-[#174C3B]/10 hover:bg-[#174C3B] text-[#174C3B] hover:text-white flex items-center justify-center transition-colors" title="YouTube">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>
                        </div>
                    </div>

                    <!-- Col 2: Navigation Links -->
                    <div class="md:col-span-3 space-y-3">
                        <h4 class="font-bold uppercase tracking-wider text-xs text-[#174C3B]">Danh Mục Website</h4>
                        <ul class="space-y-2">
                            ${navLinksHtml}
                        </ul>
                    </div>

                    <!-- Col 3: Direct Contact -->
                    <div class="md:col-span-4 space-y-3">
                        <h4 class="font-bold uppercase tracking-wider text-xs text-[#174C3B]">Kênh Kết Nối & Hỗ Trợ</h4>
                        <div class="space-y-2.5 text-xs text-[#5F6E66]">
                            <div>
                                <span class="block text-[#8FAF91] font-bold uppercase text-[10px]">Hotline / Zalo Trực Tiếp</span>
                                <a href="${zaloLink}" target="_blank" rel="noopener" class="font-bold text-[#174C3B] hover:text-[#F08A4B] text-sm transition-colors">${hotline}</a>
                            </div>
                            <div>
                                <span class="block text-[#8FAF91] font-bold uppercase text-[10px]">Hòm Thư Điện Tử</span>
                                <span class="font-medium text-[#174C3B]">${emailContact}</span>
                            </div>
                            <div>
                                <span class="block text-[#8FAF91] font-bold uppercase text-[10px]">Giờ Làm Việc</span>
                                <span class="font-medium text-[#174C3B]">08:00 - 21:30 (Thứ 2 - Chủ Nhật)</span>
                            </div>
                            <div class="pt-2">
                                <a href="${prefix}dat-lich/" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#174C3B] text-white text-xs font-bold hover:bg-[#1F5A45] transition-colors shadow-2xs">
                                    <span>Đặt Giờ Tư Vấn 1:1</span>
                                    <span>→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom Disclaimer & Copyright -->
                <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#5F6E66]">
                    <p class="text-center md:text-left leading-relaxed">
                        © 2026 Thu Hiền – Cùng Mẹ Hiểu Con. Mọi quyền được bảo lưu.
                        <span class="block sm:inline sm:ml-2 text-[#8B9992]">*Nội dung nhằm mục đích hỗ trợ dinh dưỡng và thói quen tại gia đình, không thay thế chẩn đoán y khoa chuyên khoa.*</span>
                    </p>
                    <div class="flex items-center gap-4">
                        <a href="${prefix}admin/" class="hover:text-[#174C3B] opacity-60 hover:opacity-100 transition-opacity">Trang Quản Trị</a>
                    </div>
                </div>
            </div>
        `;
    }

    function init() {
        renderGlobalHeader();
        renderGlobalFooter();
    }

    // Auto run on DOM ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            setTimeout(init, 0);
        }
    }

    return {
        init,
        renderGlobalHeader,
        renderGlobalFooter
    };
})();

// Wire into DB sync so when pages or settings change, layout updates automatically!
if (typeof DB !== 'undefined') {
    DB.onSync(() => {
        if (typeof LayoutEngine !== 'undefined') {
            LayoutEngine.renderGlobalHeader();
            LayoutEngine.renderGlobalFooter();
        }
    });
}
