/**
 * Core UI JavaScript for Thu Hiền - Cùng Mẹ Hiểu Con (Pure Static Edition)
 * Đồng hành cùng cha mẹ có con tự kỷ (ASD)
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
        const curPage = document.title.includes('Đặt Lịch') 
            ? 'Đặt Lịch Trò Chuyện 1-1' 
            : (document.title.includes('Bảng Giá') 
                ? 'Bảng Giá & Gói Dịch Vụ' 
                : (document.title.includes('Dinh Dưỡng') 
                    ? 'Lời Khuyên Dinh Dưỡng GFCF' 
                    : (document.title.includes('Chuyên Gia') 
                        ? 'Chuyên Gia Bùi Thu Hiền' 
                        : (document.title.includes('Cộng Đồng') || document.title.includes('Kênh') || document.title.includes('Social')
                            ? 'Kênh & Cộng Đồng'
                            : 'Trang Chủ'))));
        DB.trackView(curPage);
        // Periodic heartbeat every 12 seconds to keep session alive
        setInterval(() => {
            DB.heartbeat(curPage);
        }, 12000);

        // Apply dynamic third-party integrations, social links and page status router
        try {
            if (typeof DB.applyPageStatusControl === 'function') DB.applyPageStatusControl();
            if (typeof DB.applyIntegrations === 'function') DB.applyIntegrations();
            if (typeof DB.applySocialLinks === 'function') DB.applySocialLinks();
        } catch (e) {
            console.warn('Error applying integrations/social/pages:', e);
        }
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
                baby_weight: formData.get('baby_weight') || 'Bé Trai',
                baby_height: formData.get('baby_height') || '',
                issues: issues,
                feeding_notes: formData.get('feeding_notes') || '',
                consult_type: formData.get('consult_type') || 'Gói Đồng Hành Chuyên Sâu 1 Tháng (3.000.000đ)',
                preferred_time: formData.get('preferred_time') || 'Buổi tối (19h30 - 21h30)'
            };

            if (!bookingData.parent_name || !bookingData.phone) {
                showToast('Vui lòng điền họ tên mẹ và số điện thoại Zalo liên hệ.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Đang ghi nhận thông tin...</span>';

            setTimeout(() => {
                // Save to client-side DB
                const savedBooking = DB.addBooking(bookingData);

                // Dispatch email notification via configured provider
                try {
                    if (typeof DB.sendNotificationEmail === 'function') {
                        DB.sendNotificationEmail('booking', savedBooking);
                    }
                } catch (err) {
                    console.warn('Email dispatch notice:', err);
                }

                showToast('Đăng ký thành công! Thu Hiền sẽ liên hệ riêng qua Zalo cùng Mẹ.', 'success');
                
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
                                Thu Hiền đã ghi nhận câu chuyện của Mẹ. Thu Hiền sẽ chủ động liên hệ riêng tư qua số Zalo/SĐT để lắng nghe và sắp xếp lịch hẹn trò chuyện trong thời gian sớm nhất. Mẹ hãy yên tâm nhé!
                            </p>
                            <div class="inline-flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a href="/" class="btn-pill-primary">
                                    <span>Về Trang Chủ</span>
                                </a>
                                <a href="https://zalo.me" target="_blank" rel="noopener" class="btn-pill-peach">
                                    <span>Nhắn Zalo Riêng Với Thu Hiền</span>
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
            
            // Get active resource from settings
            const activeRes = (typeof DB !== 'undefined' && typeof DB.getActiveResource === 'function') ? DB.getActiveResource() : null;
            const resTitle = activeRes && activeRes.title ? activeRes.title : 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà';
            const fileUrl = activeRes && activeRes.file_url ? activeRes.file_url : 'data:text/plain;charset=utf-8,Cam%20Nang%20Nhung%20Buoc%20Dau%20Dong%20Hanh%20Cung%20Con%20Tu%20Ky%20Tai%20Nha%20-%20Thu%20Hien';
            const btnLabel = activeRes && activeRes.button_text ? activeRes.button_text : 'Tải Cẩm Nang Ngay (PDF)';

            const formData = new FormData(ebookForm);
            const leadData = {
                parent_name: formData.get('parent_name') || '',
                phone: formData.get('phone') || '',
                email: formData.get('email') || '',
                baby_age: formData.get('baby_age') || '',
                resource_name: resTitle
            };

            if (!leadData.parent_name || !leadData.phone) {
                showToast('Vui lòng nhập họ tên mẹ và số Zalo.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Đang khởi tạo tài liệu...</span>';

            setTimeout(() => {
                DB.addLead(leadData);

                // Dispatch email notification via configured provider
                try {
                    if (typeof DB.sendNotificationEmail === 'function') {
                        DB.sendNotificationEmail('lead', leadData);
                    }
                } catch (err) {
                    console.warn('Email dispatch notice:', err);
                }

                showToast('Cẩm nang đã sẵn sàng để tải về!', 'success');
                const isExternal = fileUrl.startsWith('http://') || fileUrl.startsWith('https://');
                ebookForm.innerHTML = `
                    <div class="text-center py-8">
                        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EEF5EA] text-[#174C3B] flex items-center justify-center">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                        </div>
                        <h4 class="font-serif text-xl font-bold text-[#174C3B] mb-2">Tài liệu đã sẵn sàng!</h4>
                        <p class="text-[#5F6E66] text-sm mb-6">Mẹ hãy bấm nút bên dưới để mở hoặc tải tài liệu trực tiếp về thiết bị nhé.</p>
                        <a href="${fileUrl}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : 'download="Cam-Nang-Dong-Hanh-Con-Tu-Ky-Thu-Hien.pdf"'} class="btn-pill-peach">
                            <span>${btnLabel}</span>
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
        if (selectedPackage === '1thang') {
            consultTypeSelect.value = 'Gói Đồng Hành Chuyên Sâu 1 Tháng (3.000.000đ)';
        } else if (selectedPackage === '3ngay' || selectedPackage === '60phut') {
            consultTypeSelect.value = 'Gói Khởi Động Trải Nghiệm 3 Ngày (500.000đ)';
        } else if (selectedPackage === 'lienhe' || selectedPackage === '3thang') {
            consultTypeSelect.value = 'Gói Đồng Hành Dài Hạn / Chuyên Biệt (Liên Hệ)';
        }
    }

    // 9. Interactive 1-Minute Assessment Tool on Homepage (Autism & Sensory Connection)
    const assessmentForm = document.getElementById('babyAssessmentForm');
    const assessmentResult = document.getElementById('assessmentResult');
    if (assessmentForm && assessmentResult) {
        assessmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const age = assessmentForm.querySelector('input[name="quiz_age"]:checked')?.value || '18 - 36 tháng';
            const issue = assessmentForm.querySelector('input[name="quiz_issue"]:checked')?.value || 'Chậm nói';
            const habit = assessmentForm.querySelector('input[name="quiz_habit"]:checked')?.value || 'Mẹ kiệt sức';

            let analysisTitle = "Góc Nhìn Về Giao Tiếp Chức Năng & Tiền Ngôn Ngữ";
            let analysisDesc = `Bé trong độ tuổi <strong>${age}</strong> đang có biểu hiện <strong>${issue}</strong>. Trong giai đoạn này, trước khi con bật ra từ ngữ đầu tiên, con cần tích lũy đủ các kỹ năng tiền ngôn ngữ: Giao tiếp mắt, bắt chước cử chỉ, chú ý chung và động lực tương tác. Khi con chưa sẵn sàng mà mẹ ép con nói, con sẽ càng khép kín và nhại lời vô nghĩa.`;
            let recs = [
                "Hạ thấp người ngang tầm mắt con, lồng ghép từ ngữ đơn giản gắn liền với hành động con yêu thích.",
                "Tạo tình huống để con có nhu cầu nhờ mẹ giúp (đặt đồ chơi con thích trong hộp trong suốt đóng nắp).",
                "Dừng việc bắt con 'nói đi mới cho', thay vào đó mô tả cảm xúc và gọi tên đồ vật bằng giọng điệu vui tươi."
            ];

            if (issue.includes('giao tiếp mắt') || issue.includes('quay đầu')) {
                analysisTitle = "Góc Nhìn Về Quá Tải Giác Quan & Kết Nối Ánh Mắt";
                analysisDesc = `Ở độ tuổi <strong>${age}</strong>, trẻ có nét tự kỷ thường cảm thấy nhìn thẳng vào mắt người khác là một trải nghiệm quá tải giác quan thị giác. Con tránh ánh mắt không phải vì không yêu mẹ, mà vì não bộ con đang tìm cách tự điều hòa để giảm căng thẳng.`;
                recs = [
                    "Tránh việc giữ đầu hay ép con nhìn thẳng vào mắt mẹ, điều này dễ làm con căng thẳng hơn.",
                    "Đưa đồ vật con thích lên sát cạnh mắt hoặc miệng của mẹ khi trò chuyện để thu hút ánh nhìn tự nhiên.",
                    "Chơi các trò chơi biến mất - xuất hiện bất ngờ (ú òa, trùm khăn voan) để tạo nụ cười và ánh mắt kết nối."
                ];
            } else if (issue.includes('bùng nổ') || issue.includes('Meltdown')) {
                analysisTitle = "Góc Nhìn Về Hệ Thần Kinh & Cơn Quá Tải Meltdown";
                analysisDesc = `Cơn Meltdown ở bé <strong>${age}</strong> là tình trạng 'cháy cầu chì' của hệ thần kinh khi con bị ngập tràn trong cảm xúc hoặc quá tải giác quan. Con không thể tự kiểm soát được hành vi vào lúc đó, nên mọi lời quát mắng hay giải thích lý lẽ đều phản tác dụng.`;
                recs = [
                    "Giữ bản thân mẹ thật bình tâm, sự dịu dàng của mẹ chính là điểm tựa an toàn cho con.",
                    "Đưa con vào không gian yên tĩnh, giảm ánh sáng và âm thanh, loại bỏ các vật sắc nhọn nguy hiểm.",
                    "Ôm giữ sâu (nếu con cho phép) hoặc ngồi cạnh im lặng bảo bọc cho đến khi nhịp thở của con chậm lại."
                ];
            } else if (issue.includes('lặp lại') || issue.includes('giác quan')) {
                analysisTitle = "Góc Nhìn Về Nhu Cầu Tự Điều Hòa Giác Quan (Stimming)";
                analysisDesc = `Các hành vi lặp lại (vẫy tay, nhón chân, xoay tròn, ngắm đồ vật) là cách con gửi tín hiệu để tự cân bằng hệ thống cảm giác bản thể và tiền đình. Ngăn cấm thô bạo sẽ khiến con càng thêm lo âu và bùng phát hành vi dữ dội hơn.`;
                recs = [
                    "Ghi chép lại thời điểm con hay lặp lại hành vi (khi con quá phấn khích hay khi con lo âu sợ hãi).",
                    "Cung cấp các hoạt động thay thế an toàn cho giác quan (nhún nhảy đệm, xoa bóp tay chân, chơi cát/nước).",
                    "Thiết lập lịch sinh hoạt trực quan bằng hình ảnh giúp con biết trước điều gì sắp diễn ra trong ngày."
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
                                <span class="text-xs font-bold text-[#F08A4B] uppercase tracking-wider block">Góc Nhìn Thấu Cảm Từ Thu Hiền</span>
                                <h4 class="font-serif text-xl font-bold text-[#174C3B]">${analysisTitle}</h4>
                            </div>
                        </div>
                        <p class="text-sm text-[#5F6E66] leading-relaxed mb-5">${analysisDesc}</p>
                        <div class="p-4 rounded-2xl bg-[#EEF5EA] border border-[#8FAF91]/30 mb-6">
                            <h5 class="text-xs font-bold text-[#174C3B] uppercase tracking-wider mb-2.5">3 Gợi Ý Kết Nối Dành Cho Mẹ:</h5>
                            <ul class="space-y-2 text-xs text-[#174C3B]">
                                ${recs.map(r => `<li class="flex items-start gap-2"><span class="text-[#F08A4B] font-bold shrink-0 mt-0.5">•</span><span>${r}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <a href="./dat-lich/?issue=${encodeURIComponent(issue)}" class="btn-pill-peach justify-center flex-1">
                                <span>Đặt Lịch Trò Chuyện 1-1 Cùng Thu Hiền</span>
                                <span class="btn-circle-icon"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg></span>
                            </a>
                            <button type="button" data-open-modal="ebook" class="btn-pill-ghost justify-center">
                                <span>Tải Cẩm Nang Đồng Hành (PDF)</span>
                            </button>
                        </div>
                        <p class="text-[11px] text-[#8B9992] text-center mt-4">
                            *Lưu ý: Thông tin mang tính chất chia sẻ gợi ý tương tác tại gia đình, không thay thế chẩn đoán y khoa chuyên biệt.*
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
