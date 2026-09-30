/**
 * Core UI JavaScript for Thu Hiền - Cùng Mẹ Hiểu Con (Pure Static Edition)
 * Handles: Scroll reveals, lead modals, interactive pills, LocalStorage persistence & toasts
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Reveals
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 2. Track Page View & Realtime Live Heartbeat via DB layer
    if (typeof DB !== 'undefined') {
        const curPage = document.title.includes('Đặt Lịch') ? 'Đặt Lịch Tư Vấn 1-1' : 'Trang Chủ';
        DB.trackView(curPage);
        // Periodic heartbeat every 12 seconds to keep session alive
        setInterval(() => {
            DB.heartbeat(curPage);
        }, 12000);
    }

    // 3. Interactive Checkbox Pills
    document.querySelectorAll('.checkbox-pill').forEach(pill => {
        const checkbox = pill.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        
        if (checkbox.checked) {
            pill.classList.add('checked');
        }

        pill.addEventListener('click', (e) => {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            pill.classList.toggle('checked', checkbox.checked);
        });
    });

    // 4. Modal Lead Magnet Handlers
    const ebookModal = document.getElementById('ebookModal');
    const openModalBtns = document.querySelectorAll('[data-open-modal="ebook"]');
    const closeModalBtns = document.querySelectorAll('[data-close-modal="ebook"]');

    if (ebookModal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                ebookModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                ebookModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        ebookModal.addEventListener('click', (e) => {
            if (e.target === ebookModal) {
                ebookModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 5. Booking Form Submission (Pure Client-Side + LocalStorage)
    const bookingForm = document.getElementById('consultBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;

            // Collect form values
            const formData = new FormData(bookingForm);
            const issues = [];
            bookingForm.querySelectorAll('input[name="issues[]"]:checked').forEach(cb => {
                issues.push(cb.value);
            });

            const bookingData = {
                parent_name: formData.get('parent_name') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                baby_name: formData.get('baby_name') || '',
                baby_age: formData.get('baby_age') || '',
                baby_weight: formData.get('baby_weight') || '',
                baby_height: formData.get('baby_height') || '',
                issues: issues,
                feeding_notes: formData.get('feeding_notes') || '',
                consult_type: formData.get('consult_type') || 'Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu',
                preferred_time: formData.get('preferred_time') || 'Buổi tối (19h30 - 21h30)'
            };

            if (!bookingData.parent_name || !bookingData.phone) {
                showToast('Vui lòng điền họ tên mẹ và số điện thoại liên hệ.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Đang ghi nhận thông tin...</span>';

            setTimeout(() => {
                // Save to client-side DB
                const savedBooking = DB.addBooking(bookingData);

                showToast('Đăng ký thành công! Chuyên gia Thu Hiền sẽ liên hệ qua Zalo.', 'success');
                
                // Show confirmation screen
                const formContainer = bookingForm.closest('.booking-card-inner');
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div class="text-center py-12 px-6">
                            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[#EEF5EA] text-[#174C3B] flex items-center justify-center border border-[#8FAF91]/40 shadow-sm">
                                <svg class="w-10 h-10 text-[#174C3B]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <span class="eyebrow-badge mb-3">TIẾP NHẬN THÀNH CÔNG #TH-${savedBooking.id}</span>
                            <h3 class="font-serif text-2xl md:text-3xl text-[#174C3B] font-bold mb-4">Cảm ơn Mẹ đã tin tưởng gửi gắm!</h3>
                            <p class="text-[#5F6E66] max-w-lg mx-auto mb-6 text-base leading-relaxed">
                                Chuyên gia Dinh dưỡng Thu Hiền đã ghi nhận tình trạng của bé. Chuyên gia sẽ liên hệ trực tiếp qua số Zalo/SĐT để trao đổi và lên lịch hẹn cụ thể trong thời gian sớm nhất.
                            </p>
                            <div class="inline-flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a href="/" class="btn-pill-primary">
                                    <span>Về Trang Chủ</span>
                                </a>
                                <a href="https://zalo.me" target="_blank" rel="noopener" class="btn-pill-peach">
                                    <span>Nhắn Zalo Trực Tiếp</span>
                                </a>
                            </div>
                        </div>
                    `;
                }
            }, 500);
        });
    }

    // 6. Ebook Form Submission (Pure Client-Side + LocalStorage)
    const ebookForm = document.getElementById('ebookLeadForm');
    if (ebookForm) {
        ebookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = ebookForm.querySelector('button[type="submit"]');
            
            const formData = new FormData(ebookForm);
            const leadData = {
                parent_name: formData.get('parent_name') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                baby_age: formData.get('baby_age') || '',
                resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu'
            };

            if (!leadData.parent_name || !leadData.phone) {
                showToast('Vui lòng nhập họ tên mẹ và số Zalo.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Đang khởi tạo tài liệu...</span>';

            setTimeout(() => {
                DB.addLead(leadData);
                showToast('Cẩm nang đã sẵn sàng để tải về!', 'success');
                ebookForm.innerHTML = `
                    <div class="text-center py-8">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EEF5EA] text-[#174C3B] flex items-center justify-center">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                        </div>
                        <h4 class="font-serif text-xl font-bold text-[#174C3B] mb-2">Tài liệu đã sẵn sàng!</h4>
                        <p class="text-[#5F6E66] text-sm mb-6">Mẹ hãy bấm nút bên dưới để tải trực tiếp file cẩm nang 30 thực đơn về điện thoại nhé.</p>
                        <a href="data:text/plain;charset=utf-8,Cam%20Nang%20Dinh%20Duong%20Thu%20Hien%20-%20Cung%20Me%20Hieu%20Con" download="Cam-Nang-Dinh-Duong-Thu-Hien.pdf" class="btn-pill-peach">
                            <span>Tải Cẩm Nang Ngay (PDF)</span>
                        </a>
                    </div>
                `;
            }, 400);
        });
    }

    // 7. Toast Notification Utility
    window.showToast = function(message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transition-all duration-300 transform translate-y-4 opacity-0 ${
            type === 'success' ? 'bg-[#FAF7F0] border-[#8FAF91] text-[#174C3B]' : 'bg-[#FFF5F5] border-red-300 text-red-800'
        }`;
        
        const iconSvg = type === 'success' 
            ? `<svg class="w-5 h-5 text-[#174C3B] shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`
            : `<svg class="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;

        toast.innerHTML = `
            ${iconSvg}
            <div class="text-sm font-medium leading-relaxed">${message}</div>
        `;

        toastContainer.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 350);
        }, 4500);
    };

    // 8. Pre-select Package from URL Query Param in dat-lich page
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPackage = urlParams.get('package');
    const consultTypeSelect = document.querySelector('select[name="consult_type"]');
    if (selectedPackage && consultTypeSelect) {
        if (selectedPackage === '21ngay') {
            consultTypeSelect.value = 'Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu';
        } else if (selectedPackage === '60phut') {
            consultTypeSelect.value = 'Tư Vấn Đơn Điểm 1-1 (60 Phút Trực Tiếp)';
        } else if (selectedPackage === '60ngay') {
            consultTypeSelect.value = 'Gói Đồng Hành Toàn Diện 1 Tháng Kèm Thực Đơn';
        }
    }

    // 9. Interactive 1-Minute Assessment Tool on Homepage
    const assessmentForm = document.getElementById('babyAssessmentForm');
    const assessmentResult = document.getElementById('assessmentResult');
    if (assessmentForm && assessmentResult) {
        assessmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const age = assessmentForm.querySelector('input[name="quiz_age"]:checked')?.value || '1-2 tuổi';
            const issue = assessmentForm.querySelector('input[name="quiz_issue"]:checked')?.value || 'Biếng ăn';
            const habit = assessmentForm.querySelector('input[name="quiz_habit"]:checked')?.value || 'Xem điện thoại';

            let analysisTitle = "Góc Nhìn Về Nhịp Sinh Học & Tâm Lý Bàn Ăn";
            let analysisDesc = `Bé trong độ tuổi <strong>${age}</strong> đang có biểu hiện <strong>${issue}</strong>, kết hợp với thói quen <strong>${habit}</strong>. Điều này cho thấy bé có thể đang gặp áp lực vô hình trong bữa ăn, khiến hệ tiêu hóa chưa thực sự sẵn sàng đón nhận thức ăn một cách tự nhiên.`;
            let recs = [
                "Giảm dần sự phụ thuộc vào màn hình điện thoại, tạo không khí bữa ăn vui vẻ và thoải mái.",
                "Tối ưu mật độ dinh dưỡng trong từng thìa nhỏ thay vì ép con ăn số lượng nhiều.",
                "Lắng nghe tín hiệu no - đói tự nhiên và xây dựng lại nhịp sinh hoạt ăn ngủ đều đặn."
            ];

            if (issue.includes('Táo bón') || issue.includes('phân sống')) {
                analysisTitle = "Góc Nhìn Về Chế Độ Ăn & Cân Bằng Tiêu Hóa";
                analysisDesc = `Ở độ tuổi <strong>${age}</strong>, hiện tượng tiêu hóa phân sống hoặc táo bón thường liên quan đến sự mất cân đối giữa lượng đạm, chất xơ hòa tan và lượng nước hàng ngày. Điều này khiến đường ruột bé khó tiêu hóa trọn vẹn thức ăn.`;
                recs = [
                    "Cân đối lại lượng đạm nạp vào mỗi bữa, tránh để hệ tiêu hóa non nớt của bé bị quá tải.",
                    "Tăng cường bổ sung nước và chất xơ tự nhiên từ rau củ quả phù hợp lứa tuổi.",
                    "Tạo thói quen vận động nhẹ nhàng và giờ đi vệ sinh cố định hàng ngày cho con."
                ];
            } else if (issue.includes('Chậm tăng cân') || issue.includes('đứng cân')) {
                analysisTitle = "Góc Nhìn Về Khả Năng Hấp Thu & Chuyển Hóa";
                analysisDesc = `Bé <strong>${age}</strong> đứng cân kéo dài thường do sự thiếu hụt các vi chất cần thiết giúp kích hoạt cảm giác thèm ăn tự nhiên, hoặc do cơ cấu bữa ăn chưa cân đối giữa các nhóm dưỡng chất.`;
                recs = [
                    "Đánh giá lại khẩu phần thực tế để đảm bảo đủ chất béo lành mạnh và vi chất thiết yếu.",
                    "Đa dạng hóa món ăn, đổi mới cách chế biến để kích thích sự hào hứng khám phá của con.",
                    "Thiết lập lịch trình đồng hành cùng chuyên gia để theo dõi và điều chỉnh từng tuần."
                ];
            }

            // Render result
            const resultBox = document.getElementById('assessmentResultContent');
            if (resultBox) {
                resultBox.innerHTML = `
                    <div class="p-6 md:p-8 rounded-3xl bg-white border border-[#8FAF91]/40 shadow-sm animate-fade-in">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="w-10 h-10 rounded-2xl bg-[#EEF5EA] text-[#174C3B] flex items-center justify-center font-bold text-lg">✦</span>
                            <div>
                                <span class="text-xs font-bold text-[#F08A4B] uppercase tracking-wider block">Góc Nhìn Dinh Dưỡng Từ Chuyên Gia</span>
                                <h4 class="font-serif text-xl font-bold text-[#174C3B]">${analysisTitle}</h4>
                            </div>
                        </div>
                        <p class="text-sm text-[#5F6E66] leading-relaxed mb-5">${analysisDesc}</p>
                        <div class="p-4 rounded-2xl bg-[#EEF5EA] border border-[#8FAF91]/30 mb-6">
                            <h5 class="text-xs font-bold text-[#174C3B] uppercase tracking-wider mb-2.5">3 Gợi Ý Hữu Ích Dành Cho Mẹ:</h5>
                            <ul class="space-y-2 text-xs text-[#174C3B]">
                                ${recs.map(r => `<li class="flex items-start gap-2"><span class="text-[#F08A4B] font-bold shrink-0 mt-0.5">•</span><span>${r}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <a href="./dat-lich/?issue=${encodeURIComponent(issue)}" class="btn-pill-peach justify-center flex-1">
                                <span>Đăng Ký Tư Vấn Đồng Hành 1-1</span>
                                <span class="btn-circle-icon"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg></span>
                            </a>
                            <button type="button" data-open-modal="ebook" class="btn-pill-ghost justify-center">
                                <span>Tải Cẩm Nang 30 Thực Đơn</span>
                            </button>
                        </div>
                        <p class="text-[11px] text-[#8B9992] text-center mt-4">
                            *Lưu ý: Đánh giá mang tính tham khảo thói quen ăn uống, không thay thế chẩn đoán hay điều trị y tế.*
                        </p>
                    </div>
                `;
                assessmentResult.classList.remove('hidden');
                assessmentResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Re-bind modal buttons in newly inserted HTML
                resultBox.querySelectorAll('[data-open-modal="ebook"]').forEach(btn => {
                    btn.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        const modal = document.getElementById('ebookModal');
                        if (modal) {
                            modal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }
                    });
                });
            }
        });
    }

    // 10. Smooth Accordion - close others when one opens
    document.querySelectorAll('.faq-details').forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                document.querySelectorAll('.faq-details').forEach(other => {
                    if (other !== detail && other.open) {
                        other.open = false;
                    }
                });
            }
        });
    });
});

