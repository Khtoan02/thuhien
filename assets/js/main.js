/**
 * Core JavaScript for Thu Hiền - Cùng Mẹ Hiểu Con
 * Handles: Scroll reveals, lead modals, interactive pills, AJAX form processing & toasts
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

    // 2. Track Page View silently
    try {
        const pageName = document.body.dataset.page || 'home';
        fetch(`/api?action=track_view&page=${encodeURIComponent(pageName)}`).catch(() => {});
    } catch(e) {}

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

    // 5. Booking Form Submission (AJAX)
    const bookingForm = document.getElementById('consultBookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;

            // Collect form data
            const formData = new FormData(bookingForm);
            formData.append('action', 'submit_booking');

            // Visual loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Đang gửi thông tin...</span>
                <span class="btn-circle-icon">
                    <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                </span>
            `;

            try {
                const response = await fetch('/api?action=submit_booking', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    showToast(result.message, 'success');
                    bookingForm.reset();
                    // Reset checked state on pills
                    bookingForm.querySelectorAll('.checkbox-pill').forEach(p => p.classList.remove('checked'));
                    
                    // Show success confirmation screen inside the form card
                    const formContainer = bookingForm.closest('.booking-card-inner');
                    if (formContainer) {
                        formContainer.innerHTML = `
                            <div class="text-center py-12 px-6">
                                <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[#EEF5EA] text-[#174C3B] flex items-center justify-center border border-[#8FAF91]/40 shadow-sm">
                                    <svg class="w-10 h-10 text-[#174C3B]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <span class="eyebrow-badge mb-3">TIẾP NHẬN THÀNH CÔNG #TH-${result.booking_id}</span>
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
                } else {
                    showToast(result.message || 'Không thể gửi thông tin, vui lòng thử lại.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                }
            } catch (err) {
                showToast('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau!', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }

    // 6. Ebook Form Submission (AJAX)
    const ebookForm = document.getElementById('ebookLeadForm');
    if (ebookForm) {
        ebookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = ebookForm.querySelector('button[type="submit"]');
            const originalHtml = submitBtn.innerHTML;

            const formData = new FormData(ebookForm);
            formData.append('action', 'submit_ebook');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Đang khởi tạo tài liệu...</span>';

            try {
                const response = await fetch('/api?action=submit_ebook', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (result.success) {
                    showToast(result.message, 'success');
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
                } else {
                    showToast(result.message || 'Lỗi gửi yêu cầu', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHtml;
                }
            } catch (err) {
                showToast('Lỗi mạng, vui lòng thử lại!', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHtml;
            }
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
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-4', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 350);
        }, 4500);
    };
});
