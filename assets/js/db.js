/**
 * Client-Side Database & Analytics Layer for Thu Hiền - Cùng Mẹ Hiểu Con
 * Đồng hành cùng cha mẹ có con tự kỷ (ASD)
 * Pure static & LocalStorage powered with Realistic Marketing Metrics & Realtime Live Online Engine.
 */

const DB = (() => {
    const STORAGE_KEY_BOOKINGS = 'thuhien_bookings_v4';
    const STORAGE_KEY_LEADS = 'thuhien_leads_v4';
    const STORAGE_KEY_ANALYTICS = 'thuhien_analytics_v4';
    const STORAGE_KEY_HEARTBEATS = 'thuhien_live_heartbeats';

    // Realistic, authentic bookings dataset for Thu Hien Autism Companionship
    const INITIAL_BOOKINGS = [
        {
            id: 101,
            parent_name: 'Nguyễn Thị Hoài An',
            phone: '0912345678',
            email: 'hoaian.nguyen@gmail.com',
            baby_name: 'Bé Bin',
            baby_age: '28 tháng',
            baby_weight: 'Bé Trai',
            baby_height: '92 cm',
            issues: 'Chậm nói / Chưa bật âm / Nhại lời, Rất ít giao tiếp mắt / Không phản ứng khi gọi tên, Cơn bùng nổ cảm xúc Meltdown / Ăn vạ dữ dội',
            feeding_notes: 'Bé vừa nhận kết luận ASD ở Viện Nhi tuần trước, mẹ khóc suốt mấy ngày nay. Con hay khóc thét khi ra nơi đông người, mẹ rất cần người hướng dẫn cách chơi và giao tiếp cùng con.',
            consult_type: 'Gói Đồng Hành Chuyên Sâu 1 Tháng (Zalo Hằng Ngày)',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'Facebook (Fanpage / Video)',
            status: 'pending',
            admin_notes: 'Đã nhắn tin Zalo an ủi mẹ, hẹn tối thứ 5 gọi video call trao đổi kỹ định hướng ban đầu.',
            created_at: '2026-09-30 08:45:00'
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
            issues: 'Cơn bùng nổ cảm xúc Meltdown / Ăn vạ dữ dội, Nhạy cảm giác quan (âm thanh, ánh sáng, xúc giác)',
            feeding_notes: 'Tôm rất sợ tiếng máy xay sinh tố và tiếng còi xe, mỗi lần sợ là đập đầu xuống nền nhà. Mẹ muốn học cách dập tắt cơn meltdown bằng sự bình tĩnh.',
            consult_type: 'Buổi Trò Chuyện & Tháo Gỡ Ban Đầu (60 Phút 1-1)',
            preferred_time: 'Cuối tuần (Thứ 7 / Chủ Nhật)',
            source: 'Zalo (Nhóm Đồng Hành Cha Mẹ)',
            status: 'contacted',
            admin_notes: 'Mẹ đã gửi video con chơi lúc chiều, hẹn chuyên gia tư vấn sáng Thứ 7.',
            created_at: '2026-09-29 14:15:00'
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
            issues: 'Rất ít giao tiếp mắt / Không phản ứng khi gọi tên, Hành vi lặp lại (vẫy tay, đi nhón chân, xoay tròn)',
            feeding_notes: 'Gạo thích xoay bánh xe ô tô hàng giờ, gọi tên không quay đầu lại. Gia đình chưa có điều kiện cho đi trung tâm can thiệp, mẹ muốn tự dạy con tại nhà.',
            consult_type: 'Gói Đồng Hành Chuyên Sâu 1 Tháng (Zalo Hằng Ngày)',
            preferred_time: 'Giờ hành chính (09h00 - 17h00)',
            source: 'Bạn bè giới thiệu',
            status: 'in_progress',
            admin_notes: 'Đang tuần thứ 2. Mẹ đã bắt nhịp ánh mắt tốt hơn, Gạo đã biết nhìn mẹ khi mẹ hát bài Con Cò.',
            created_at: '2026-09-28 10:20:00'
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
            issues: 'Chậm nói / Chưa bật âm / Nhại lời, Khó chơi cùng bạn / Thu mình một góc',
            feeding_notes: 'Kem thích chơi một mình một góc, ai đến gần là đẩy ra. Mẹ lo lắng con bị cô lập.',
            consult_type: 'Gói Đồng Hành Bền Vững 3 Tháng (Toàn Diện Nền Tảng)',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'TikTok (Video Tâm Lý)',
            status: 'completed',
            admin_notes: 'Đã hoàn thành giai đoạn 1. Bé Kem đã biết chia sẻ đồ chơi cùng anh trai và biết chỉ tay.',
            created_at: '2026-09-27 19:30:00'
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
            issues: 'Đã có kết luận chẩn đoán tự kỷ (ASD) từ bệnh viện, Mẹ stress, kiệt sức và bế tắc tâm lý',
            feeding_notes: 'Bố của bé chưa chấp nhận việc con tự kỷ, cho rằng do mẹ chiều. Mẹ kiệt sức cả về tinh thần và thể chất.',
            consult_type: 'Buổi Trò Chuyện & Tháo Gỡ Ban Đầu (60 Phút 1-1)',
            preferred_time: 'Buổi trưa (11h30 - 13h30)',
            source: 'Google Tìm Kiếm',
            status: 'pending',
            admin_notes: 'Cần lắng nghe giải tỏa tâm lý cho mẹ trước tiên, sau đó hướng dẫn mẹ kết nối với bố.',
            created_at: '2026-09-29 20:10:00'
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
            issues: 'Chậm nói / Chưa bật âm / Nhại lời, Nhạy cảm giác quan (âm thanh, ánh sáng, xúc giác)',
            feeding_notes: 'Sóc nói nhại lời tivi rất nhiều nhưng không có ngôn ngữ chủ động giao tiếp nhu cầu hàng ngày.',
            consult_type: 'Gói Đồng Hành Chuyên Sâu 1 Tháng (Zalo Hằng Ngày)',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'Facebook (Fanpage / Video)',
            status: 'contacted',
            admin_notes: 'Đã hẹn tư vấn thiết lập lịch biểu trực quan bằng tranh ảnh cho con.',
            created_at: '2026-09-28 16:40:00'
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
            issues: 'Rất ít giao tiếp mắt / Không phản ứng khi gọi tên, Cơn bùng nổ cảm xúc Meltdown / Ăn vạ dữ dội',
            feeding_notes: 'Bon đi nhón gót chân liên tục, mẹ gọi tên 10 lần chỉ quay lại 1 lần. Mẹ rất hoang mang.',
            consult_type: 'Buổi Trò Chuyện & Tháo Gỡ Ban Đầu (60 Phút 1-1)',
            preferred_time: 'Giờ hành chính (09h00 - 17h00)',
            source: 'Zalo (Nhóm Đồng Hành Cha Mẹ)',
            status: 'pending',
            admin_notes: 'Cần phân tích ngưỡng cảm giác bản thể (proprioception) của bé Bon.',
            created_at: '2026-09-30 09:15:00'
        }
    ];

    // Realistic initial leads dataset
    const INITIAL_LEADS = [
        { id: 201, parent_name: 'Phạm Hải Yến', phone: '0945123987', email: 'haiyen.pham@gmail.com', baby_age: '26 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'converted', notes: 'Đã chuyển đổi sang đặt lịch trò chuyện #TH-101', created_at: '2026-09-30 08:20:00' },
        { id: 202, parent_name: 'Hoàng Minh Châu', phone: '0978654321', email: 'chauhoang.mc@gmail.com', baby_age: '30 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'contacted', notes: 'Đã gửi file PDF qua Zalo, mẹ cảm ơn vì tài liệu giúp mẹ bớt lo âu', created_at: '2026-09-29 16:45:00' },
        { id: 203, parent_name: 'Đỗ Quỳnh Nga', phone: '0919888777', email: 'quynhnga.do@gmail.com', baby_age: '2 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'nurturing', notes: 'Bé ít tương tác mắt, đang gửi video hướng dẫn bài tập ú òa', created_at: '2026-09-29 11:10:00' },
        { id: 204, parent_name: 'Vũ Thị Thu Hà', phone: '0934567890', email: 'thuha.vu@gmail.com', baby_age: '3 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'new', notes: '', created_at: '2026-09-28 21:05:00' },
        { id: 205, parent_name: 'Bùi Phương Linh', phone: '0912998877', email: 'phuonglinh.bui@gmail.com', baby_age: '22 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'new', notes: '', created_at: '2026-09-28 14:30:00' },
        { id: 206, parent_name: 'Ngô Mỹ Hạnh', phone: '0983114455', email: 'myhanh.ngo@gmail.com', baby_age: '3.5 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'contacted', notes: 'Đã nhắn tin Zalo thăm hỏi, mẹ đang áp dụng bài tập hạ nhiệt cơn bùng nổ', created_at: '2026-09-27 10:00:00' },
        { id: 207, parent_name: 'Trịnh Cẩm Tú', phone: '0966443322', email: 'camtu.trinh@gmail.com', baby_age: '19 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'new', notes: '', created_at: '2026-09-27 17:15:00' },
        { id: 208, parent_name: 'Lương Kiều Anh', phone: '0971228899', email: 'kieuanh.luong@gmail.com', baby_age: '4 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'nurturing', notes: 'Mẹ cần tham khảo cách giao tiếp với bố của bé', created_at: '2026-09-26 19:40:00' },
        { id: 209, parent_name: 'Phan Thùy Dương', phone: '0908123456', email: 'thuyduong.phan@gmail.com', baby_age: '28 tháng', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'new', notes: '', created_at: '2026-09-26 11:25:00' },
        { id: 210, parent_name: 'Dương Ánh Nguyệt', phone: '0943998811', email: 'anhnguyet.duong@gmail.com', baby_age: '3 tuổi', resource_name: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà', care_status: 'contacted', notes: 'Mẹ hỏi thêm về gói đồng hành chuyên sâu 1 tháng', created_at: '2026-09-25 15:50:00' }
    ];

    // Realistic marketing analytics baseline
    const INITIAL_ANALYTICS = {
        totalVisitors: 485,
        pageViews: 1290,
        avgTimeOnSite: '3m 15s',
        bounceRate: '28.4%',
        trafficSources: [
            { source: 'Facebook (Fanpage / Video)', visits: 235, percent: 48.5, color: '#1877F2' },
            { source: 'Zalo (Nhóm Đồng Hành Cha Mẹ)', visits: 125, percent: 25.8, color: '#0068FF' },
            { source: 'TikTok (Video Chia Sẻ)', visits: 68, percent: 14.0, color: '#111111' },
            { source: 'Google Tìm Kiếm Tự Nhiên', visits: 37, percent: 7.6, color: '#0F9D58' },
            { source: 'Bạn Bè / Mẹ Khác Giới Thiệu', visits: 20, percent: 4.1, color: '#F08A4B' }
        ],
        dailyTrends: {
            dates: ['24/09', '25/09', '26/09', '27/09', '28/09', '29/09', '30/09'],
            views: [58, 65, 74, 82, 79, 68, 59],
            bookings: [1, 2, 1, 3, 2, 2, 1],
            leads: [3, 5, 4, 6, 5, 4, 3]
        }
    };

    function init() {
        if (!localStorage.getItem(STORAGE_KEY_BOOKINGS)) {
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        }
        if (!localStorage.getItem(STORAGE_KEY_LEADS)) {
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_LEADS));
        }
        if (!localStorage.getItem(STORAGE_KEY_ANALYTICS)) {
            localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
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
            const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);

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
                consult_type: data.consult_type || 'Gói Đồng Hành Chuyên Sâu 1 Tháng (Zalo Hằng Ngày)',
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
                sessions = sessions.filter(s => (now - s.time) < 35000);

                // Dynamically simulate realistic concurrent moms (between 2 and 5 active visitors)
                const minuteSlot = Math.floor(now / 15000);
                const jitter = (minuteSlot % 3); // 0, 1, 2
                const liveCount = Math.max(sessions.length, 3 + jitter);

                const pages = [
                    { page: 'Trang Chủ & Câu Chuyện Thu Hiền', count: Math.max(1, Math.round(liveCount * 0.45)), url: '/' },
                    { page: '4 Nền Tảng Đồng Hành Tại Nhà', count: Math.max(1, Math.round(liveCount * 0.25)), url: '/#nen-tang' },
                    { page: 'Đặt Lịch Trò Chuyện 1-1', count: Math.max(1, Math.round(liveCount * 0.20)), url: '/dat-lich/' },
                    { page: 'Cẩm Nang Cho Mẹ', count: Math.max(1, Math.round(liveCount * 0.10)), url: '/#cam-nang' }
                ];

                return {
                    count: liveCount,
                    sessions: sessions,
                    pages: pages,
                    realTabs: sessions.length
                };
            } catch (e) {
                return { count: 3, pages: [], realTabs: 1 };
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
            analytics.pageViews = (analytics.pageViews || 1290) + 1;
            localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(analytics));
            this.heartbeat(pageName);
        },

        // Overview stats for badges & marketing cards
        getStats() {
            const bookings = this.getBookings();
            const leads = this.getLeads();
            const analytics = this.getAnalytics();

            const pending = bookings.filter(b => b.status === 'pending').length;
            const contacted = bookings.filter(b => b.status === 'contacted').length;
            const inProgress = bookings.filter(b => b.status === 'in_progress').length;
            const completed = bookings.filter(b => b.status === 'completed').length;

            const totalConversions = bookings.length + leads.length;
            const conversionRate = analytics.totalVisitors > 0 
                ? ((totalConversions / analytics.totalVisitors) * 100).toFixed(1) 
                : '3.5';

            return {
                totalBookings: bookings.length,
                pending,
                contacted,
                inProgress,
                completed,
                totalLeads: leads.length,
                totalVisitors: analytics.totalVisitors,
                pageViews: analytics.pageViews,
                conversionRate,
                avgTimeOnSite: analytics.avgTimeOnSite,
                bounceRate: analytics.bounceRate
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

        resetSampleData() {
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_LEADS));
            localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
        }
    };
})();
