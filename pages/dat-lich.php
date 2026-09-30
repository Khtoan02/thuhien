<?php
$pageTitle = 'Đặt Lịch Tư Vấn Dinh Dưỡng 1-1 | Chuyên Gia Thu Hiền';
$pageDesc = 'Đăng ký tư vấn dinh dưỡng 1-1 chuyên sâu cùng Chuyên gia Thu Hiền. Phân tích gốc rễ biếng ăn, chậm tăng cân, phục hồi đường ruột và thiết lập phác đồ cá nhân hóa 21 ngày.';
$currentPage = 'booking';
require_once __DIR__ . '/header.php';
?>

<!-- ==========================================================================
     BOOKING HERO SECTION
     ========================================================================== -->
<section class="pt-10 pb-8 md:pt-16 md:pb-12 text-center max-w-4xl mx-auto px-6">
    <span class="eyebrow-badge mb-3">TƯ VẤN CÁ NHÂN HÓA 1-1</span>
    <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174C3B] mb-4 leading-tight">
        Đặt Lịch Đồng Hành <br class="hidden sm:inline">
        Cùng <span class="font-serif italic font-normal text-[#1F5A45]">Chuyên Gia Thu Hiền</span>
    </h1>
    <p class="text-[#5F6E66] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        Để buổi tư vấn đạt hiệu quả cao nhất, Mẹ vui lòng chia sẻ kỹ về thói quen ăn uống và thể trạng của con. Chuyên gia sẽ nghiên cứu hồ sơ trước khi liên hệ trao đổi trực tiếp cùng Mẹ.
    </p>
</section>

<!-- ==========================================================================
     BOOKING FORM & SIDEBAR SECTION
     ========================================================================== -->
<section class="pb-24 max-w-7xl mx-auto px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: The Master Booking Form (Double-Bezel) -->
        <div class="lg:col-span-8 double-bezel">
            <div class="double-bezel-inner booking-card-inner p-6 sm:p-10">
                
                <div class="border-b border-[#8FAF91]/20 pb-5 mb-8 flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold text-[#8FAF91] uppercase tracking-wider block">Phiếu Tiếp Nhận Dinh Dưỡng</span>
                        <h2 class="font-serif text-xl sm:text-2xl font-bold text-[#174C3B]">Hồ Sơ Đăng Ký Tư Vấn</h2>
                    </div>
                    <span class="text-xs font-semibold px-3 py-1 rounded-full bg-[#EEF5EA] text-[#174C3B] border border-[#8FAF91]/30">
                        Bảo Mật Y Tế 100%
                    </span>
                </div>

                <form id="consultBookingForm" class="space-y-8">
                    
                    <!-- Phần 1: Thông tin người mẹ -->
                    <div>
                        <h3 class="font-serif font-bold text-base text-[#174C3B] mb-4 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-[#174C3B] text-white text-xs flex items-center justify-center font-bold">1</span>
                            <span>Thông Tin Người Mẹ</span>
                        </h3>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Họ Và Tên Mẹ <span class="text-red-500">*</span></label>
                                <input type="text" name="parent_name" required placeholder="Ví dụ: Nguyễn Thị Mai Lan" class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Số Điện Thoại / Zalo <span class="text-red-500">*</span></label>
                                <input type="tel" name="phone" required placeholder="0912 xxx xxx (để chuyên gia kết nối Zalo)" class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                            </div>

                            <div class="sm:col-span-2">
                                <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Email Nhận Báo Cáo Phác Đồ</label>
                                <input type="email" name="email" placeholder="email@gmail.com (chuyên gia gửi phác đồ chi tiết qua đây)" class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                            </div>
                        </div>
                    </div>

                    <!-- Phần 2: Thể trạng của bé -->
                    <div>
                        <h3 class="font-serif font-bold text-base text-[#174C3B] mb-4 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-[#174C3B] text-white text-xs flex items-center justify-center font-bold">2</span>
                            <span>Chỉ Số Sinh Học Của Bé</span>
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Tên Ở Nhà Của Bé</label>
                                <input type="text" name="baby_name" placeholder="Ví dụ: Bé Bơ, Bé Sóc..." class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Độ Tuổi Của Bé <span class="text-red-500">*</span></label>
                                <input type="text" name="baby_age" required placeholder="Ví dụ: 14 tháng (hoặc ngày sinh)" class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">Cân Nặng / Chiều Cao</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <input type="text" name="baby_weight" placeholder="9.2 kg" class="w-full px-3 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-xs text-[#174C3B]">
                                    <input type="text" name="baby_height" placeholder="76 cm" class="w-full px-3 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-xs text-[#174C3B]">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Phần 3: Vấn đề con đang gặp -->
                    <div>
                        <h3 class="font-serif font-bold text-base text-[#174C3B] mb-2 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-[#174C3B] text-white text-xs flex items-center justify-center font-bold">3</span>
                            <span>Tình Trạng Bé Đang Gặp (Mẹ có thể chọn nhiều mục)</span>
                        </h3>
                        <p class="text-xs text-[#5F6E66] mb-4">Bấm chọn các vấn đề con đang trải qua để chuyên gia định hướng chuyên sâu:</p>

                        <div class="flex flex-wrap gap-2.5">
                            <label class="checkbox-pill">
                                <input type="checkbox" name="issues[]" value="Biếng ăn sinh lý / Ngậm cháo cơm">
                                <span>Biếng ăn kéo dài / Ngậm thức ăn</span>
                            </label>
                            
                            <label class="checkbox-pill">
                                <input type="checkbox" name="issues[]" value="Chậm tăng cân / Đứng cân nhiều tháng">
                                <span>Chậm tăng cân / Đứng cân liên tục</span>
                            </label>

                            <label class="checkbox-pill">
                                <input type="checkbox" name="issues[]" value="Táo bón / Phân sống / Đầy hơi trướng bụng">
                                <span>Táo bón / Đi ngoài phân sống</span>
                            </label>

                            <label class="checkbox-pill">
                                <input type="checkbox" name="issues[]" value="Cần bổ sung vi chất (Kẽm, Sắt, D3K2, Canxi)">
                                <span>Tư vấn bổ sung vi chất chuẩn liều</span>
                            </label>

                            <label class="checkbox-pill">
                                <input type="checkbox" name="issues[]" value="Bé khó ngủ, trằn trọc quấy đêm">
                                <span>Khó ngủ, giật mình, trằn trọc đêm</span>
                            </label>

                            <label class="checkbox-pill">
                                <input type="checkbox" name="issues[]" value="Dị ứng đạm bò / Bất dung nạp lactose">
                                <span>Nghi ngờ dị ứng đạm bò / Bất dung nạp</span>
                            </label>

                            <label class="checkbox-pill">
                                <input type="checkbox" name="issues[]" value="Lên thực đơn ăn dặm khoa học">
                                <span>Lên thực đơn ăn dặm theo tháng tuổi</span>
                            </label>
                        </div>
                    </div>

                    <!-- Phần 4: Nhật ký thói quen ăn uống của bé -->
                    <div>
                        <label class="block text-xs font-bold text-[#174C3B] mb-1.5 uppercase tracking-wider">
                            Mô Tả Thói Quen Ăn Uống & Lo Lắng Lớn Nhất Của Mẹ
                        </label>
                        <textarea name="feeding_notes" rows="4" placeholder="Ví dụ: Bé bú mẹ hoàn toàn trước 6 tháng, hiện tại mỗi bữa ăn rất căng thẳng, hay nôn trớ khi gặp lợn cợn, mẹ đã thử nhiều loại men nhưng chưa đỡ..." class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B] leading-relaxed"></textarea>
                    </div>

                    <!-- Phần 5: Gói tư vấn mong muốn & Khung giờ hẹn -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                        <div>
                            <label class="block text-xs font-bold text-[#174C3B] mb-2 uppercase tracking-wider">Gói Tư Vấn Quan Tâm</label>
                            <select name="consult_type" class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                                <option value="Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu">Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu (Khuyên dùng)</option>
                                <option value="Tư Vấn Đơn Điểm 1-1 (60 Phút Trực Tiếp)">Tư Vấn Đơn Điểm 1-1 (60 Phút Video Call)</option>
                                <option value="Gói Đồng Hành Toàn Diện 1 Tháng Kèm Thực Đơn">Gói Đồng Hành Toàn Diện 1 Tháng Kèm Thực Đơn</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-[#174C3B] mb-2 uppercase tracking-wider">Khung Giờ Tiện Nghe Điện Thoại</label>
                            <select name="preferred_time" class="w-full px-4 py-3 rounded-xl border border-[#8FAF91]/40 bg-white focus:outline-none focus:border-[#174C3B] text-sm text-[#174C3B]">
                                <option value="Buổi tối (19h30 - 21h30)">Buổi tối (19h30 - 21h30 - Rất thuận tiện cho mẹ)</option>
                                <option value="Buổi trưa (11h30 - 13h30)">Buổi trưa (11h30 - 13h30)</option>
                                <option value="Giờ hành chính (09h00 - 17h00)">Giờ hành chính (09h00 - 17h00)</option>
                                <option value="Cuối tuần (Thứ 7 hoặc Chủ Nhật)">Cuối tuần (Thứ 7 / Chủ Nhật)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="pt-4 border-t border-[#8FAF91]/20">
                        <button type="submit" class="btn-pill-peach w-full justify-center py-4 text-base">
                            <span>Gửi Đăng Ký Tư Vấn Cho Chuyên Gia Thu Hiền</span>
                            <span class="btn-circle-icon">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>
                                </svg>
                            </span>
                        </button>
                        <p class="text-xs text-center text-[#5F6E66] mt-3">
                            Chuyên gia cam kết bảo mật 100% hồ sơ bệnh sử và hình ảnh của bé.
                        </p>
                    </div>

                </form>

            </div>
        </div>

        <!-- Right: Information & Direct Support Sidebar -->
        <div class="lg:col-span-4 space-y-6">
            
            <!-- Expert Profile Card -->
            <div class="p-6 rounded-3xl bg-white border border-[#8FAF91]/30 shadow-xs">
                <div class="flex items-center gap-3.5 mb-4 pb-4 border-b border-[#8FAF91]/20">
                    <div class="w-12 h-12 rounded-full bg-[#174C3B] text-white flex items-center justify-center font-serif font-bold text-lg">
                        TH
                    </div>
                    <div>
                        <h4 class="font-serif font-bold text-base text-[#174C3B]">Chuyên Gia Thu Hiền</h4>
                        <span class="text-xs text-[#F08A4B] font-semibold">Cùng Mẹ Hiểu Con</span>
                    </div>
                </div>
                <p class="text-xs text-[#5F6E66] leading-relaxed mb-4">
                    "Tôi không chỉ là một chuyên gia dinh dưỡng, tôi là một người bạn cùng mẹ lắng nghe con. Mục tiêu của tôi là giúp mẹ thở phào nhẹ nhõm sau mỗi bữa ăn của con."
                </p>
                <div class="space-y-2 text-xs text-[#174C3B]">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#8FAF91]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        <span>Hơn 5 năm kinh nghiệm tư vấn dinh dưỡng nhi</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#8FAF91]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        <span>Phác đồ dựa trên bằng chứng khoa học cập nhật</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-[#8FAF91]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                        <span>Không kê đơn thuốc bổ tràn lan bừa bãi</span>
                    </div>
                </div>
            </div>

            <!-- Direct Contact Card -->
            <div class="p-6 rounded-3xl bg-[#EEF5EA] border border-[#8FAF91]/40 shadow-xs">
                <span class="text-[11px] font-bold text-[#8FAF91] uppercase tracking-wider block mb-1">CẦN HỖ TRỢ GẤP?</span>
                <h4 class="font-serif font-bold text-base text-[#174C3B] mb-2">Kết Nối Trực Tiếp</h4>
                <p class="text-xs text-[#5F6E66] leading-relaxed mb-5">
                    Nếu bé đang gặp tình trạng cấp thiết (như táo bón đau đớn, nôn trớ liên tục), Mẹ có thể nhắn tin nhanh qua Zalo để trợ lý sắp xếp khung giờ ưu tiên.
                </p>
                
                <a href="https://zalo.me" target="_blank" rel="noopener" class="w-full py-3 px-4 rounded-full bg-[#174C3B] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#1F5A45] transition-colors mb-3">
                    <svg class="w-4 h-4 text-[#F08A4B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span>Nhắn Tin Zalo Với Chuyên Gia</span>
                </a>

                <a href="tel:0988000000" class="w-full py-3 px-4 rounded-full bg-white text-[#174C3B] border border-[#8FAF91]/40 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#FAF7F0] transition-colors">
                    <svg class="w-4 h-4 text-[#174C3B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>Hotline: 0988.xxx.xxx</span>
                </a>
            </div>

            <!-- Lead Magnet Reminder -->
            <div class="p-6 rounded-3xl bg-white border border-[#8FAF91]/30 text-center">
                <span class="text-xs font-bold text-[#F08A4B] block mb-1">MẸ CHƯA CẦN TƯ VẤN NGAY?</span>
                <h5 class="font-serif font-bold text-sm text-[#174C3B] mb-2">Tải Cẩm Nang 30 Thực Đơn</h5>
                <p class="text-xs text-[#5F6E66] mb-4">Tham khảo tài liệu miễn phí trước khi quyết định đặt lịch.</p>
                <button data-open-modal="ebook" class="text-xs font-bold text-[#174C3B] underline hover:text-[#F08A4B]">
                    Tải cẩm nang PDF ngay →
                </button>
            </div>

        </div>

    </div>
</section>

<?php require_once __DIR__ . '/footer.php'; ?>
