<?php
/**
 * Shared Footer & Lead Magnet Modal for Thu Hiền - Cùng Mẹ Hiểu Con
 */
?>

<!-- Footer Section -->
<footer class="mt-28 border-t border-[#8FAF91]/30 bg-[#FAF7F0] pt-16 pb-12 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#8FAF91]/20">
            <!-- Brand Column -->
            <div class="md:col-span-5 space-y-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#174C3B] text-[#FAF7F0] flex items-center justify-center font-serif font-bold text-lg">
                        TH
                    </div>
                    <div>
                        <span class="font-serif font-bold text-xl text-[#174C3B] block">Thu Hiền</span>
                        <span class="text-xs font-semibold text-[#F08A4B] tracking-wider uppercase">Cùng Mẹ Hiểu Con</span>
                    </div>
                </div>
                <p class="text-[#5F6E66] text-sm leading-relaxed max-w-sm pt-2">
                    Không áp lực từ chiếc cân, không bữa ăn chan nước mắt. Chuyên gia Dinh dưỡng Thu Hiền đồng hành cùng mẹ thấu hiểu nhịp điệu sinh học tự nhiên và dinh dưỡng chuẩn y khoa cho bé yêu.
                </p>
                <div class="flex items-center gap-3 pt-2">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF5EA] text-[#174C3B] text-xs font-medium border border-[#8FAF91]/30">
                        <span class="w-2 h-2 rounded-full bg-[#8FAF91] pulse-indicator"></span>
                        Đang tiếp nhận lịch hẹn tuần này
                    </span>
                </div>
            </div>

            <!-- Quick Navigation -->
            <div class="md:col-span-3 space-y-3">
                <h4 class="font-serif font-bold text-[#174C3B] text-base mb-4">Nội Dung Chính</h4>
                <ul class="space-y-2.5 text-sm text-[#5F6E66]">
                    <li><a href="/#triet-ly" class="hover:text-[#174C3B] transition-colors">Triết lý: Cùng Mẹ Hiểu Con</a></li>
                    <li><a href="/#tru-cot" class="hover:text-[#174C3B] transition-colors">4 Trụ Cột Khoa Học Dinh Dưỡng</a></li>
                    <li><a href="/#cam-nhan" class="hover:text-[#174C3B] transition-colors">Góc Cảm Nhận Của Phụ Huynh</a></li>
                    <li><a href="/#cam-nang" class="hover:text-[#174C3B] transition-colors">Cẩm Nang & Tài Liệu Dinh Dưỡng</a></li>
                    <li><a href="/dat-lich" class="hover:text-[#F08A4B] font-medium transition-colors">Đăng Ký Tư Vấn Cá Nhân Hóa 1-1</a></li>
                </ul>
            </div>

            <!-- Direct Contact & Social -->
            <div class="md:col-span-4 space-y-3">
                <h4 class="font-serif font-bold text-[#174C3B] text-base mb-4">Kết Nối Trực Tiếp</h4>
                <div class="space-y-3 text-sm text-[#5F6E66]">
                    <div class="flex items-start gap-3">
                        <div class="w-7 h-7 rounded-full bg-[#EEF5EA] text-[#174C3B] flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                            </svg>
                        </div>
                        <div>
                            <span class="block text-xs text-[#8FAF91] font-semibold uppercase">Hotline / Zalo Tư Vấn</span>
                            <span class="font-semibold text-[#174C3B]">0988.xxx.xxx (Ưu tiên nhắn tin Zalo)</span>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <div class="w-7 h-7 rounded-full bg-[#EEF5EA] text-[#174C3B] flex items-center justify-center shrink-0 mt-0.5">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <span class="block text-xs text-[#8FAF91] font-semibold uppercase">Hòm Thư Chuyên Môn</span>
                            <span class="font-medium text-[#174C3B]">chuyengia.thuhien@cungmehieucon.vn</span>
                        </div>
                    </div>

                    <div class="pt-2">
                        <button data-open-modal="ebook" class="w-full py-2.5 px-4 rounded-xl bg-[#EEF5EA] hover:bg-[#E2ECD7] text-[#174C3B] font-semibold text-xs border border-[#8FAF91]/40 flex items-center justify-center gap-2 transition-all">
                            <svg class="w-4 h-4 text-[#F08A4B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Tải Cẩm Nang 30 Thực Đơn Miễn Phí</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Disclaimer & Copyright -->
        <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5F6E66]">
            <p class="text-center md:text-left leading-relaxed">
                © 2026 Thu Hiền – Cùng Mẹ Hiểu Con. Mọi quyền được bảo lưu. 
                <span class="block sm:inline sm:ml-2 text-[#8B9992]">*Nội dung dinh dưỡng mang tính chất hướng dẫn khoa học, không thay thế chẩn đoán y khoa cấp cứu.</span>
            </p>
            <div class="flex items-center gap-4 text-xs">
                <a href="/admin" class="hover:text-[#174C3B] opacity-70 hover:opacity-100 transition-opacity">Quản Trị Báo Cáo</a>
            </div>
        </div>
    </div>
</footer>

<!-- Lead Magnet Modal: Tải Cẩm Nang Thực Đơn -->
<div id="ebookModal" class="modal-overlay">
    <div class="modal-content">
        <div class="bg-[#FAF7F0] rounded-[calc(2rem-0.5rem)] p-6 md:p-8 relative">
            <button data-close-modal="ebook" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#174C3B] transition-colors" aria-label="Đóng">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>

            <div class="text-center mb-6">
                <span class="eyebrow-badge mb-3">TÀI LIỆU DINH DƯỠNG ĐẶC BIỆT</span>
                <h3 class="font-serif text-2xl font-bold text-[#174C3B] mb-2">Cẩm Nang 30 Thực Đơn Đột Phá Hấp Thu</h3>
                <p class="text-[#5F6E66] text-xs md:text-sm max-w-md mx-auto">
                    Biên soạn độc quyền bởi Chuyên gia Thu Hiền dành cho các bé từ 6 - 36 tháng gặp tình trạng biếng ăn, phân sống hoặc chậm tăng cân.
                </p>
            </div>

            <form id="ebookLeadForm" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Họ Tên Của Mẹ *</label>
                    <input type="text" name="parent_name" required placeholder="Ví dụ: Mẹ Mai Lan" class="w-full px-4 py-2.5 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Số Điện Thoại Zalo *</label>
                        <input type="tel" name="phone" required placeholder="0912 xxx xxx" class="w-full px-4 py-2.5 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Độ Tuổi Của Bé</label>
                        <input type="text" name="baby_age" placeholder="Ví dụ: 14 tháng" class="w-full px-4 py-2.5 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Email Nhận File PDF</label>
                    <input type="email" name="email" placeholder="email@gmail.com (tùy chọn)" class="w-full px-4 py-2.5 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                </div>

                <div class="pt-2">
                    <button type="submit" class="btn-pill-peach w-full justify-center">
                        <span>Nhận Cẩm Nang Miễn Phí Ngay</span>
                        <span class="btn-circle-icon">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8l-8 8-8-8"/>
                            </svg>
                        </span>
                    </button>
                    <p class="text-[11px] text-center text-[#8B9992] mt-2.5">
                        Cam kết 100% không spam. Tài liệu gửi trực tiếp không mất phí.
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Main JS script -->
<script src="/assets/js/main.js"></script>
</body>
</html>
