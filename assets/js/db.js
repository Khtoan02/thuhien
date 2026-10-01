/**
 * Client-Side Database & Analytics Layer for Thu Hiền - Cùng Mẹ Hiểu Con
 * Đồng hành cùng cha mẹ có con tự kỷ (ASD)
 * Pure static & LocalStorage powered with Realistic Marketing Metrics & Realtime Live Online Engine.
 */

const DB = (() => {
    const STORAGE_KEY_BOOKINGS = 'thuhien_bookings_v6';
    const STORAGE_KEY_LEADS = 'thuhien_leads_v6';
    const STORAGE_KEY_ANALYTICS = 'thuhien_analytics_v6';
    const STORAGE_KEY_HEARTBEATS = 'thuhien_live_heartbeats_v6';

    // Helper to format date YYYY-MM-DD HH:mm:ss relative to now
    function getRelativeDateStr(daysAgo = 0, hours = 9, minutes = 15) {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        d.setHours(hours, minutes, 0, 0);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${day} ${hh}:${mm}:00`;
    }

    // Demo dataset for testing/preview purposes if requested by admin
    const DEMO_BOOKINGS = [
        {
            id: 101,
            parent_name: 'Nguyễn Thị Hoài An',
            phone: '0912345678',
            email: 'hoaian.nguyen@gmail.com',
            baby_name: 'Bé Bin',
            baby_age: '28 tháng',
            baby_weight: 'Bé Trai',
            baby_height: '92 cm',
            issues: 'Ăn chọn lọc, chỉ ăn vài món quen, khó thử món mới, Nhạy cảm mùi vị, màu sắc, kết cấu thức ăn, Bữa ăn kéo dài, căng thẳng, hay ngậm thức ăn',
            feeding_notes: 'Bin chỉ ăn cháo xay nhuyễn và trứng rán, cứ thấy cơm hạt hay rau xanh là khóc thét và nôn trớ. Mỗi bữa ăn kéo dài hơn 1 tiếng làm cả nhà vô cùng căng thẳng.',
            consult_type: 'Gói Đồng Hành Chuyên Sâu 1 Tháng (3.000.000đ)',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'Facebook (Fanpage / Video)',
            status: 'pending',
            admin_notes: 'Đã nhắn tin Zalo an ủi mẹ, hẹn tối nay gọi video call đánh giá ngưỡng giác quan xúc giác miệng của con.',
            created_at: getRelativeDateStr(0, 8, 45)
        },
        {
            id: 102,
            parent_name: 'Đặng Minh Thư',
            phone: '0988776655',
            email: 'minhthu.dang@gmail.com',
            baby_name: 'Bé Tôm',
            baby_age: '3.5 tuổi',
            baby_weight: 'Bé Trai',
            baby_height: '98 cm',
            issues: 'Nhạy cảm mùi vị, màu sắc, kết cấu thức ăn, Cơn bùng nổ cảm xúc Meltdown / Ăn vạ dữ dội, Nhạy cảm giác quan (âm thanh, ánh sáng, xúc giác)',
            feeding_notes: 'Tôm rất sợ mùi hành tỏi và đồ ăn có nước sốt, mỗi lần mẹ ép ăn là con đập bàn đập ghế rồi bùng nổ meltdown. Mẹ muốn học cách giúp con bình tĩnh và làm quen món mới từng bước.',
            consult_type: 'Gói Khởi Động Trải Nghiệm 3 Ngày (500.000đ)',
            preferred_time: 'Cuối tuần (Thứ 7 hoặc Chủ Nhật)',
            source: 'Zalo (Nhóm Đồng Hành Cha Mẹ)',
            status: 'contacted',
            admin_notes: 'Mẹ đã gửi video con ngồi ăn trưa qua Zalo, hẹn trao đổi phân tích video vào sáng Thứ 7.',
            created_at: getRelativeDateStr(1, 14, 15)
        },
        {
            id: 103,
            parent_name: 'Lê Lan Phương',
            phone: '0903112233',
            email: 'lanphuong.le@gmail.com',
            baby_name: 'Bé Gạo',
            baby_age: '24 tháng',
            baby_weight: 'Bé Gái',
            baby_height: '87 cm',
            issues: 'Ăn chọn lọc, chỉ ăn vài món quen, khó thử món mới, Rất ít giao tiếp mắt / Không phản ứng khi gọi tên, Hành vi lặp lại (vẫy tay, đi nhón chân, xoay tròn)',
            feeding_notes: 'Gạo chỉ ăn bánh mì khô và sữa, tuyệt đối không chạm tay vào thịt cá. Mẹ lo con thiếu chất ảnh hưởng não bộ nhưng không biết bắt đầu từ đâu.',
            consult_type: 'Gói Đồng Hành Chuyên Sâu 1 Tháng (3.000.000đ)',
            preferred_time: 'Giờ hành chính (09h00 - 17h00)',
            source: 'Bạn bè giới thiệu',
            status: 'in_progress',
            admin_notes: 'Đang tuần thứ 2. Mẹ đã áp dụng kỹ thuật cho con chạm và ngửi thực phẩm trước khi nếm, Gạo đã chịu nếm 1 thìa súp bí đỏ nhỏ.',
            created_at: getRelativeDateStr(2, 10, 20)
        },
        {
            id: 104,
            parent_name: 'Vũ Thị Minh Hằng',
            phone: '0977223344',
            email: 'minhhang.vu@gmail.com',
            baby_name: 'Bé Kem',
            baby_age: '20 tháng',
            baby_weight: 'Bé Trai',
            baby_height: '84 cm',
            issues: 'Bữa ăn kéo dài, căng thẳng, hay ngậm thức ăn, Chậm nói / Chưa bật âm / Nhại lời, Mẹ stress, kiệt sức và bế tắc tâm lý',
            feeding_notes: 'Kem ngậm cơm nửa tiếng không chịu nuốt, mẹ stress khóc theo con mỗi ngày. Mẹ muốn tìm một lộ trình kiên nhẫn và khoa học để cứu vãn bữa ăn.',
            consult_type: 'Gói Khởi Động Trải Nghiệm 3 Ngày (500.000đ)',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'TikTok (Video Tâm Lý)',
            status: 'completed',
            admin_notes: 'Đã hoàn thành 3 ngày trải nghiệm ban đầu. Mẹ phản hồi rất tích cực vì đã biết cách chia nhỏ khẩu phần, mẹ đăng ký chuyển tiếp lên gói 1 tháng.',
            created_at: getRelativeDateStr(3, 19, 30)
        },
        {
            id: 105,
            parent_name: 'Phạm Kiều Oanh',
            phone: '0944889900',
            email: 'kieuoanh.pham@gmail.com',
            baby_name: 'Bé Bơ',
            baby_age: '3 tuổi',
            baby_weight: 'Bé Trai',
            baby_height: '95 cm',
            issues: 'Ăn chọn lọc, chỉ ăn vài món quen, khó thử món mới, Mẹ stress, kiệt sức và bế tắc tâm lý',
            feeding_notes: 'Bố của bé cho rằng con kén ăn là do mẹ nuông chiều, trong khi mẹ biết con có nhạy cảm giác quan thực sự. Cần chuyên gia giúp phân tích cho cả gia đình cùng hiểu.',
            consult_type: 'Gói Đồng Hành Dài Hạn / Chuyên Biệt (Liên Hệ)',
            preferred_time: 'Buổi trưa (11h30 - 13h30)',
            source: 'Google Tìm Kiếm',
            status: 'pending',
            admin_notes: 'Cần giải tỏa căng thẳng cho mẹ trước tiên, sau đó tổ chức buổi trao đổi có sự tham gia của bố để đạt được sự đồng thuận.',
            created_at: getRelativeDateStr(4, 20, 10)
        },
        {
            id: 106,
            parent_name: 'Hoàng Yến Nhi',
            phone: '0938665544',
            email: 'yennhi.hoang@gmail.com',
            baby_name: 'Bé Sóc',
            baby_age: '4 tuổi',
            baby_weight: 'Bé Trai',
            baby_height: '102 cm',
            issues: 'Nhạy cảm mùi vị, màu sắc, kết cấu thức ăn, Chậm nói / Chưa bật âm / Nhại lời, Nhạy cảm giác quan (âm thanh, ánh sáng, xúc giác)',
            feeding_notes: 'Sóc không chịu ăn bất cứ món nào có màu xanh của rau. Chỉ ăn thịt chiên giòn khô, nếu thức ăn ướt chạm vào đĩa là con bỏ cả bữa.',
            consult_type: 'Gói Đồng Hành Chuyên Sâu 1 Tháng (3.000.000đ)',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'Facebook (Fanpage / Video)',
            status: 'contacted',
            admin_notes: 'Đã gửi bài tập giải mẫn cảm màu sắc qua Zalo, hướng dẫn mẹ dùng đĩa chia ngăn để thức ăn ướt không chạm đồ khô.',
            created_at: getRelativeDateStr(5, 16, 40)
        },
        {
            id: 107,
            parent_name: 'Trần Quỳnh Trang',
            phone: '0918776611',
            email: 'quynhtrang.tran@gmail.com',
            baby_name: 'Bé Bon',
            baby_age: '2.5 tuổi',
            baby_weight: 'Bé Gái',
            baby_height: '89 cm',
            issues: 'Ăn chọn lọc, chỉ ăn vài món quen, khó thử món mới, Bữa ăn kéo dài, căng thẳng, hay ngậm thức ăn, Cơn bùng nổ cảm xúc Meltdown / Ăn vạ dữ dội',
            feeding_notes: 'Bon chỉ ăn khoai tây chiên và xúc xích. Mẹ thử đổi sang món khác là con ném đĩa cơm xuống đất. Mẹ rất cần người đồng hành sát cánh hàng ngày.',
            consult_type: 'Gói Đồng Hành Chuyên Sâu 1 Tháng (3.000.000đ)',
            preferred_time: 'Giờ hành chính (09h00 - 17h00)',
            source: 'Zalo (Nhóm Đồng Hành Cha Mẹ)',
            status: 'pending',
            admin_notes: 'Lên lịch gọi video call hướng dẫn mẹ cách xử lý khi con ném đĩa cơm mà không quát mắng hay nhân nhượng.',
            created_at: getRelativeDateStr(6, 9, 15)
        }
    ];

    // Demo dataset for testing/preview purposes if requested by admin
    const DEMO_LEADS = [
        { id: 201, parent_name: 'Phạm Hải Yến', phone: '0945123987', email: 'haiyen.pham@gmail.com', baby_age: '26 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'converted', notes: 'Đã chuyển đổi sang đặt lịch gói 1 tháng #TH-101', created_at: getRelativeDateStr(0, 8, 20) },
        { id: 202, parent_name: 'Hoàng Minh Châu', phone: '0978654321', email: 'chauhoang.mc@gmail.com', baby_age: '30 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'contacted', notes: 'Đã gửi file cẩm nang qua Zalo, mẹ cảm ơn vì hướng dẫn giúp mẹ bớt lo âu', created_at: getRelativeDateStr(1, 16, 45) },
        { id: 203, parent_name: 'Đỗ Quỳnh Nga', phone: '0919888777', email: 'quynhnga.do@gmail.com', baby_age: '2 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'nurturing', notes: 'Bé nhạy cảm kết cấu thức ăn, đang gửi video hướng dẫn làm quen mùi vị', created_at: getRelativeDateStr(2, 11, 10) },
        { id: 204, parent_name: 'Vũ Thị Thu Hà', phone: '0934567890', email: 'thuha.vu@gmail.com', baby_age: '3 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'new', notes: '', created_at: getRelativeDateStr(3, 21, 05) },
        { id: 205, parent_name: 'Bùi Phương Linh', phone: '0912998877', email: 'phuonglinh.bui@gmail.com', baby_age: '22 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'new', notes: '', created_at: getRelativeDateStr(4, 14, 30) },
        { id: 206, parent_name: 'Ngô Mỹ Hạnh', phone: '0983114455', email: 'myhanh.ngo@gmail.com', baby_age: '3.5 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'contacted', notes: 'Đã nhắn Zalo thăm hỏi, mẹ đang áp dụng bài tập hạ nhiệt áp lực bàn ăn', created_at: getRelativeDateStr(5, 10, 00) },
        { id: 207, parent_name: 'Trịnh Cẩm Tú', phone: '0966443322', email: 'camtu.trinh@gmail.com', baby_age: '19 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'new', notes: '', created_at: getRelativeDateStr(6, 17, 15) }
    ];

    const DEMO_ANALYTICS = {
        totalVisitors: 512,
        pageViews: 1380,
        avgTimeOnSite: '3m 24s',
        bounceRate: '27.6%',
        dailyViews: {}
    };

    // Official production defaults: All metrics start at 0
    const INITIAL_BOOKINGS = [];
    const INITIAL_LEADS = [];
    const INITIAL_ANALYTICS = {
        totalVisitors: 0,
        pageViews: 0,
        avgTimeOnSite: '0s',
        bounceRate: '0.0%',
        dailyViews: {}
    };

    function init() {
        // Clear all older test versions from localStorage so user browser is 100% fresh
        const legacyKeys = [
            'thuhien_bookings', 'thuhien_leads', 'thuhien_analytics', 'thuhien_live_heartbeats',
            'thuhien_bookings_v2', 'thuhien_leads_v2', 'thuhien_analytics_v2',
            'thuhien_bookings_v3', 'thuhien_leads_v3', 'thuhien_analytics_v3',
            'thuhien_bookings_v4', 'thuhien_leads_v4', 'thuhien_analytics_v4',
            'thuhien_bookings_v5', 'thuhien_leads_v5', 'thuhien_analytics_v5'
        ];
        legacyKeys.forEach(k => {
            try {
                localStorage.removeItem(k);
            } catch (e) {}
        });

        if (!localStorage.getItem(STORAGE_KEY_BOOKINGS)) {
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        }
        if (!localStorage.getItem(STORAGE_KEY_LEADS)) {
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_LEADS));
        }
        if (!localStorage.getItem(STORAGE_KEY_ANALYTICS)) {
            localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
        }
        if (!localStorage.getItem(STORAGE_KEY_HEARTBEATS)) {
            localStorage.setItem(STORAGE_KEY_HEARTBEATS, JSON.stringify([]));
        }
    }

    init();

    return {
        // Bookings
        getBookings() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKINGS)) || [];
            } catch (e) {
                return [];
            }
        },

        addBooking(data) {
            const bookings = this.getBookings();
            const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 101;
            const now = new Date();
            const y = now.getFullYear();
            const m = String(now.getMonth() + 1).padStart(2, '0');
            const d = String(now.getDate()).padStart(2, '0');
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            const createdAt = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

            const newBooking = {
                id: newId,
                parent_name: data.parent_name || '',
                phone: data.phone || '',
                email: data.email || '',
                baby_name: data.baby_name || '',
                baby_age: data.baby_age || '',
                baby_weight: data.baby_weight || '',
                baby_height: data.baby_height || '',
                issues: Array.isArray(data.issues) ? data.issues.join(', ') : (data.issues || ''),
                feeding_notes: data.feeding_notes || '',
                consult_type: data.consult_type || 'Gói Đồng Hành Chuyên Sâu 1 Tháng (3.000.000đ)',
                preferred_time: data.preferred_time || 'Buổi tối (19h30 - 21h30)',
                source: data.source || 'Website Trực Tiếp',
                status: 'pending',
                admin_notes: '',
                created_at: createdAt
            };

            bookings.unshift(newBooking);
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
            return newBooking;
        },

        updateBookingStatus(id, newStatus) {
            const bookings = this.getBookings();
            const idx = bookings.findIndex(b => b.id == id);
            if (idx !== -1) {
                bookings[idx].status = newStatus;
                localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
                return true;
            }
            return false;
        },

        updateBookingNotes(id, notes) {
            const bookings = this.getBookings();
            const idx = bookings.findIndex(b => b.id == id);
            if (idx !== -1) {
                bookings[idx].admin_notes = notes;
                localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
                return true;
            }
            return false;
        },

        deleteBooking(id) {
            let bookings = this.getBookings();
            bookings = bookings.filter(b => b.id != id);
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
            return true;
        },

        // Leads
        getLeads() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY_LEADS)) || [];
            } catch (e) {
                return [];
            }
        },

        addLead(data) {
            const leads = this.getLeads();
            const newId = leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 201;
            const now = new Date();
            const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);

            const newLead = {
                id: newId,
                parent_name: data.parent_name || '',
                phone: data.phone || '',
                email: data.email || '',
                baby_age: data.baby_age || '',
                resource_name: data.resource_name || 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà',
                care_status: 'new',
                notes: '',
                created_at: createdAt
            };

            leads.unshift(newLead);
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
            return newLead;
        },

        updateLeadStatus(id, newStatus) {
            const leads = this.getLeads();
            const idx = leads.findIndex(l => l.id == id);
            if (idx !== -1) {
                leads[idx].care_status = newStatus;
                localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
                return true;
            }
            return false;
        },

        updateLeadNotes(id, notes) {
            const leads = this.getLeads();
            const idx = leads.findIndex(l => l.id == id);
            if (idx !== -1) {
                leads[idx].notes = notes;
                localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
                return true;
            }
            return false;
        },

        deleteLead(id) {
            let leads = this.getLeads();
            leads = leads.filter(l => l.id != id);
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
            return true;
        },

        // Realtime Live Heartbeat Tracking
        heartbeat(pageName = 'Trang Chủ') {
            try {
                let sid = sessionStorage.getItem('thuhien_session_id');
                if (!sid) {
                    sid = 'sess_' + Math.random().toString(36).substring(2, 9);
                    sessionStorage.setItem('thuhien_session_id', sid);
                }

                const now = Date.now();
                let sessions = JSON.parse(localStorage.getItem(STORAGE_KEY_HEARTBEATS) || '[]');
                
                // Clean stale sessions > 35 seconds
                sessions = sessions.filter(s => (now - s.time) < 35000);

                const existingIdx = sessions.findIndex(s => s.id === sid);
                if (existingIdx !== -1) {
                    sessions[existingIdx].page = pageName;
                    sessions[existingIdx].time = now;
                } else {
                    sessions.push({ id: sid, page: pageName, time: now });
                }

                localStorage.setItem(STORAGE_KEY_HEARTBEATS, JSON.stringify(sessions));
            } catch (e) {
                // Ignore storage limits
            }
        },

        getLiveOnline() {
            try {
                const now = Date.now();
                let sessions = JSON.parse(localStorage.getItem(STORAGE_KEY_HEARTBEATS) || '[]');
                sessions = sessions.filter(s => (now - s.time) < 45000);

                const realCount = sessions.length;

                const pageCounts = {};
                sessions.forEach(s => {
                    const p = s.page || 'Trang Chủ';
                    pageCounts[p] = (pageCounts[p] || 0) + 1;
                });

                const pages = [
                    { page: 'Trang Chủ & Lộ Trình Bữa Ăn', count: pageCounts['Trang Chủ'] || 0, url: '/' },
                    { page: 'Bảng Giá & Gói Dịch Vụ', count: pageCounts['Bảng Giá'] || 0, url: '/pricing/' },
                    { page: 'Đặt Lịch Trò Chuyện 1-1', count: pageCounts['Đặt Lịch'] || 0, url: '/dat-lich/' }
                ];

                return {
                    count: realCount,
                    sessions: sessions,
                    pages: pages,
                    realTabs: realCount
                };
            } catch (e) {
                return { count: 0, pages: [], realTabs: 0 };
            }
        },

        // Analytics
        getAnalytics() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY_ANALYTICS)) || INITIAL_ANALYTICS;
            } catch (e) {
                return INITIAL_ANALYTICS;
            }
        },

        trackView(pageName = 'Trang Chủ') {
            const analytics = this.getAnalytics();
            analytics.pageViews = (analytics.pageViews || 0) + 1;
            
            // Increment totalVisitors if new session
            if (!sessionStorage.getItem('thuhien_visitor_counted')) {
                analytics.totalVisitors = (analytics.totalVisitors || 0) + 1;
                sessionStorage.setItem('thuhien_visitor_counted', 'true');
            }

            // Track daily views by date
            const now = new Date();
            const dayKey = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;
            if (!analytics.dailyViews) analytics.dailyViews = {};
            analytics.dailyViews[dayKey] = (analytics.dailyViews[dayKey] || 0) + 1;

            localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(analytics));
            this.heartbeat(pageName);
        },

        // Dynamic 7-Day Rolling Trend Window (starts from 0, tracks real data)
        getDynamic7DayTrends() {
            const bookings = this.getBookings();
            const leads = this.getLeads();
            const analytics = this.getAnalytics();
            const dailyViews = analytics.dailyViews || {};

            const dates = [];
            const views = [];
            const bookingCounts = [];
            const leadCounts = [];

            const now = new Date();
            // 7 days ending today
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const dateKey = `${day}/${month}`;
                const ymd = `${d.getFullYear()}-${month}-${day}`;

                dates.push(dateKey);

                // Count actual bookings matching date
                const bCount = bookings.filter(b => (b.created_at || '').startsWith(ymd)).length;
                bookingCounts.push(bCount);

                // Count actual leads matching date
                const lCount = leads.filter(l => (l.created_at || '').startsWith(ymd)).length;
                leadCounts.push(lCount);

                // Real tracked Page Views only (starts from 0)
                const tracked = dailyViews[dateKey] || 0;
                views.push(tracked);
            }

            return { dates, views, bookings: bookingCounts, leads: leadCounts };
        },

        // Dynamic Traffic Sources computed from actual data (starts from 0)
        getTrafficSources() {
            const bookings = this.getBookings();
            const leads = this.getLeads();
            const sourceMap = {
                'Facebook': { count: 0, color: '#1877F2', label: 'Facebook (Fanpage / Video)' },
                'Zalo': { count: 0, color: '#0068FF', label: 'Zalo (Nhóm Đồng Hành Cha Mẹ)' },
                'TikTok': { count: 0, color: '#111111', label: 'TikTok (Video Chia Sẻ)' },
                'Google': { count: 0, color: '#0F9D58', label: 'Google Tìm Kiếm Tự Nhiên' },
                'Giới Thiệu': { count: 0, color: '#F08A4B', label: 'Bạn Bè / Mẹ Khác Giới Thiệu' }
            };

            // Aggregate actual sources from real bookings & leads
            [...bookings, ...leads].forEach(item => {
                const src = (item.source || item.resource_name || '').toLowerCase();
                if (src.includes('facebook')) sourceMap['Facebook'].count += 1;
                else if (src.includes('zalo')) sourceMap['Zalo'].count += 1;
                else if (src.includes('tiktok')) sourceMap['TikTok'].count += 1;
                else if (src.includes('google')) sourceMap['Google'].count += 1;
                else if (src.includes('bạn') || src.includes('giới thiệu')) sourceMap['Giới Thiệu'].count += 1;
            });

            let total = 0;
            const items = Object.keys(sourceMap).map(k => {
                const item = sourceMap[k];
                total += item.count;
                return { source: item.label, visits: item.count, color: item.color };
            });

            return items.map(it => ({
                ...it,
                percent: total > 0 ? ((it.visits / total) * 100).toFixed(1) : '0.0'
            }));
        },

        // Overview stats for badges & marketing cards (starts from 0)
        getStats() {
            const bookings = this.getBookings();
            const leads = this.getLeads();
            const analytics = this.getAnalytics();

            const pending = bookings.filter(b => b.status === 'pending').length;
            const contacted = bookings.filter(b => b.status === 'contacted').length;
            const inProgress = bookings.filter(b => b.status === 'in_progress').length;
            const completed = bookings.filter(b => b.status === 'completed').length;

            const totalConversions = bookings.length + leads.length;
            const totalVisitors = analytics.totalVisitors || 0;
            const conversionRate = totalVisitors > 0 
                ? ((totalConversions / totalVisitors) * 100).toFixed(1) 
                : '0.0';

            return {
                totalBookings: bookings.length,
                pending,
                contacted,
                inProgress,
                completed,
                totalLeads: leads.length,
                totalVisitors,
                pageViews: analytics.pageViews || 0,
                conversionRate,
                avgTimeOnSite: analytics.avgTimeOnSite || '0s',
                bounceRate: analytics.bounceRate || '0.0%'
            };
        },

        // CSV Export
        exportCSV(type = 'bookings') {
            let csvContent = '\uFEFF'; // UTF-8 BOM
            if (type === 'leads') {
                const leads = this.getLeads();
                csvContent += '"ID","Họ tên Mẹ","Số điện thoại","Email","Tuổi bé","Tài liệu","Trạng thái CS","Ghi chú","Thời gian"\n';
                leads.forEach(l => {
                    csvContent += `"${l.id}","${l.parent_name}","${l.phone}","${l.email}","${l.baby_age}","${l.resource_name}","${l.care_status || 'new'}","${(l.notes || '').replace(/"/g, '""')}","${l.created_at}"\n`;
                });
            } else {
                const bookings = this.getBookings();
                csvContent += '"ID","Họ tên Mẹ","Số điện thoại","Email","Tên bé","Tháng tuổi","Giới tính","Chiều cao","Biểu hiện","Gói đồng hành","Khung giờ","Nguồn","Trạng thái","Ghi chú","Thời gian"\n';
                bookings.forEach(b => {
                    csvContent += `"${b.id}","${b.parent_name}","${b.phone}","${b.email}","${b.baby_name}","${b.baby_age}","${b.baby_weight}","${b.baby_height}","${(b.issues || '').replace(/"/g, '""')}","${b.consult_type}","${b.preferred_time}","${b.source || '-'}","${b.status}","${(b.admin_notes || '').replace(/"/g, '""')}","${b.created_at}"\n`;
                });
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `bao-cao-${type}-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        // Pure Zero Reset: wipes all data clean for official public launch
        clearAllData() {
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify([]));
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify([]));
            localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify({
                totalVisitors: 0,
                pageViews: 0,
                avgTimeOnSite: '0s',
                bounceRate: '0.0%',
                dailyViews: {}
            }));
            localStorage.setItem(STORAGE_KEY_HEARTBEATS, JSON.stringify([]));
            try {
                sessionStorage.removeItem('thuhien_visitor_counted');
                sessionStorage.removeItem('thuhien_session_id');
            } catch (e) {}
            return true;
        },

        // Restore Demo testing dataset if desired
        resetSampleData() {
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(DEMO_BOOKINGS));
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(DEMO_LEADS));
            localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(DEMO_ANALYTICS));
        }
    };
})();
