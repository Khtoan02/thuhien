/**
 * Client-Side Database & Analytics Layer for Thu Hiền - Cùng Mẹ Hiểu Con
 * Pure static & LocalStorage powered with Realistic Marketing Metrics & Realtime Live Online Engine.
 */

const DB = (() => {
    const STORAGE_KEY_BOOKINGS = 'thuhien_bookings_v3';
    const STORAGE_KEY_LEADS = 'thuhien_leads_v3';
    const STORAGE_KEY_ANALYTICS = 'thuhien_analytics_v3';
    const STORAGE_KEY_HEARTBEATS = 'thuhien_live_heartbeats';

    // Realistic, authentic bookings dataset
    const INITIAL_BOOKINGS = [
        {
            id: 101,
            parent_name: 'Nguyễn Thị Mai Lan',
            phone: '0912345678',
            email: 'mailan.nguyen@gmail.com',
            baby_name: 'Bé Bơ',
            baby_age: '14 tháng',
            baby_weight: '8.8 kg',
            baby_height: '74 cm',
            issues: 'Biếng ăn sinh lý / Ngậm cháo cơm, Chậm tăng cân / Đứng cân liên tục',
            feeding_notes: 'Bé chỉ thích bú mẹ, mỗi bữa cháo ngậm 30-40 phút, mẹ rất stress.',
            consult_type: 'Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'Facebook (Fanpage / Reels)',
            status: 'pending',
            admin_notes: 'Đã gửi tin nhắn Zalo hẹn tối thứ 5 gọi video trao đổi kỹ phác đồ.',
            created_at: '2026-09-30 08:45:00'
        },
        {
            id: 102,
            parent_name: 'Trần Thu Trang',
            phone: '0988776655',
            email: 'thutrang.hn@yahoo.com',
            baby_name: 'Bé Sóc',
            baby_age: '8 tháng',
            baby_weight: '7.2 kg',
            baby_height: '68 cm',
            issues: 'Táo bón / Đi ngoài phân sống, Cần bổ sung vi chất (Kẽm, Sắt, D3K2, Canxi)',
            feeding_notes: 'Bé 3 ngày mới đi ngoài 1 lần, phân cứng, hay quấy khóc ban đêm.',
            consult_type: 'Tư Vấn Đơn Điểm 1-1 (60 Phút Trực Tiếp)',
            preferred_time: 'Cuối tuần (Thứ 7 / Chủ Nhật)',
            source: 'Zalo (Nhóm Mẹ & Bé)',
            status: 'contacted',
            admin_notes: 'Mẹ đã gửi phiếu xét nghiệm vi chất, hẹn chuyên gia tư vấn sáng T7.',
            created_at: '2026-09-29 14:15:00'
        },
        {
            id: 103,
            parent_name: 'Lê Thanh Thảo',
            phone: '0903112233',
            email: 'thanhthao.le@gmail.com',
            baby_name: 'Bé Bon',
            baby_age: '24 tháng',
            baby_weight: '11.5 kg',
            baby_height: '86 cm',
            issues: 'Lên thực đơn ăn dặm khoa học, Dị ứng đạm bò / Bất dung nạp lactose',
            feeding_notes: 'Bé vừa cai sữa, tiêu hóa nhạy cảm, muốn chuyên gia lên thực đơn 30 ngày.',
            consult_type: 'Gói Đồng Hành Toàn Diện 1 Tháng Kèm Thực Đơn',
            preferred_time: 'Giờ hành chính (09h00 - 17h00)',
            source: 'Bạn bè giới thiệu',
            status: 'in_progress',
            admin_notes: 'Đang áp dụng thực đơn ngày thứ 6, bé hợp tác ăn hết suất cháo yến mạch cá hồi.',
            created_at: '2026-09-28 10:20:00'
        },
        {
            id: 104,
            parent_name: 'Vũ Thị Minh Hằng',
            phone: '0977223344',
            email: 'minhhang.vu@gmail.com',
            baby_name: 'Bé Kem',
            baby_age: '11 tháng',
            baby_weight: '8.2 kg',
            baby_height: '72 cm',
            issues: 'Biếng ăn sinh lý / Ngậm cháo cơm, Bé khó ngủ, trằn trọc quấy đêm',
            feeding_notes: 'Bé đêm ngủ hay lăn lộn, giật mình khóc thét, ban ngày lười ăn.',
            consult_type: 'Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'TikTok (Video Dinh Dưỡng)',
            status: 'completed',
            admin_notes: 'Đã hoàn thành 21 ngày. Bé ngủ một mạch đến sáng, tăng 600g, mẹ rất vui.',
            created_at: '2026-09-27 19:30:00'
        },
        {
            id: 105,
            parent_name: 'Phạm Kiều Oanh',
            phone: '0944889900',
            email: 'kieuoanh.pham@gmail.com',
            baby_name: 'Bé Coca',
            baby_age: '6 tháng',
            baby_weight: '6.8 kg',
            baby_height: '65 cm',
            issues: 'Lên thực đơn ăn dặm khoa học, Cần bổ sung vi chất (Kẽm, Sắt, D3K2, Canxi)',
            feeding_notes: 'Chuẩn bị ăn dặm, mẹ phân vân giữa BLW và truyền thống.',
            consult_type: 'Tư Vấn Đơn Điểm 1-1 (60 Phút Trực Tiếp)',
            preferred_time: 'Buổi trưa (11h30 - 13h30)',
            source: 'Google Tìm Kiếm',
            status: 'pending',
            admin_notes: 'Cần gửi bảng nguyên tắc ăn dặm 4 nhóm chất trước buổi gọi.',
            created_at: '2026-09-29 20:10:00'
        },
        {
            id: 106,
            parent_name: 'Hoàng Yến Nhi',
            phone: '0938665544',
            email: 'yennhi.hoang@gmail.com',
            baby_name: 'Bé Gấu',
            baby_age: '18 tháng',
            baby_weight: '9.6 kg',
            baby_height: '80 cm',
            issues: 'Chậm tăng cân / Đứng cân liên tục, Bé khó ngủ, trằn trọc quấy đêm',
            feeding_notes: '4 tháng liền không tăng được lạng nào, ngủ chập chờn 1 tiếng dậy 1 lần.',
            consult_type: 'Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu',
            preferred_time: 'Buổi tối (19h30 - 21h30)',
            source: 'Facebook (Fanpage / Reels)',
            status: 'contacted',
            admin_notes: 'Đã tư vấn sơ bộ, mẹ đồng ý chuyển khoản gói 21 ngày vào ngày mai.',
            created_at: '2026-09-28 16:40:00'
        },
        {
            id: 107,
            parent_name: 'Đỗ Minh Thư',
            phone: '0918776611',
            email: 'minhthu.do@gmail.com',
            baby_name: 'Bé Miu',
            baby_age: '10 tháng',
            baby_weight: '7.9 kg',
            baby_height: '71 cm',
            issues: 'Táo bón / Đi ngoài phân sống, Biếng ăn sinh lý / Ngậm cháo cơm',
            feeding_notes: 'Bụng hay chướng to, đánh rắm có mùi chua, ăn vào hay trớ.',
            consult_type: 'Tư Vấn Đơn Điểm 1-1 (60 Phút Trực Tiếp)',
            preferred_time: 'Giờ hành chính (09h00 - 17h00)',
            source: 'Zalo (Nhóm Mẹ & Bé)',
            status: 'pending',
            admin_notes: 'Cần hướng dẫn mẹ massage bụng theo chiều kim đồng hồ trước.',
            created_at: '2026-09-30 09:15:00'
        }
    ];

    // Realistic initial leads dataset
    const INITIAL_LEADS = [
        { id: 201, parent_name: 'Phạm Hải Yến', phone: '0945123987', email: 'haiyen.pham@gmail.com', baby_age: '7 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'converted', notes: 'Đã chuyển đổi sang đặt lịch tư vấn #TH-102', created_at: '2026-09-30 08:20:00' },
        { id: 202, parent_name: 'Hoàng Minh Châu', phone: '0978654321', email: 'chauhoang.mc@gmail.com', baby_age: '11 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'contacted', notes: 'Đã gửi file PDF qua Zalo, mẹ khen tài liệu thực tế', created_at: '2026-09-29 16:45:00' },
        { id: 203, parent_name: 'Đỗ Quỳnh Nga', phone: '0919888777', email: 'quynhnga.do@gmail.com', baby_age: '18 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'nurturing', notes: 'Bé đang biếng ăn, đang gửi bài viết cách tạo vị ngọt umami tự nhiên', created_at: '2026-09-29 11:10:00' },
        { id: 204, parent_name: 'Vũ Thị Thu Hà', phone: '0934567890', email: 'thuha.vu@gmail.com', baby_age: '9 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'new', notes: '', created_at: '2026-09-28 21:05:00' },
        { id: 205, parent_name: 'Bùi Phương Linh', phone: '0912998877', email: 'phuonglinh.bui@gmail.com', baby_age: '13 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'new', notes: '', created_at: '2026-09-28 14:30:00' },
        { id: 206, parent_name: 'Ngô Mỹ Hạnh', phone: '0983114455', email: 'myhanh.ngo@gmail.com', baby_age: '15 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'contacted', notes: 'Đã gọi điện hỏi thăm, mẹ đang đọc tuần 1 của cẩm nang', created_at: '2026-09-27 10:00:00' },
        { id: 207, parent_name: 'Trịnh Cẩm Tú', phone: '0966443322', email: 'camtu.trinh@gmail.com', baby_age: '8 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'new', notes: '', created_at: '2026-09-27 17:15:00' },
        { id: 208, parent_name: 'Lương Kiều Anh', phone: '0971228899', email: 'kieuanh.luong@gmail.com', baby_age: '20 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'nurturing', notes: 'Mẹ cần tham khảo thực đơn cho bé dị ứng trứng', created_at: '2026-09-26 19:40:00' },
        { id: 209, parent_name: 'Phan Thùy Dương', phone: '0908123456', email: 'thuyduong.phan@gmail.com', baby_age: '12 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'new', notes: '', created_at: '2026-09-26 11:25:00' },
        { id: 210, parent_name: 'Dương Ánh Nguyệt', phone: '0943998811', email: 'anhnguyet.duong@gmail.com', baby_age: '16 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', care_status: 'contacted', notes: 'Mẹ hỏi về cách bổ sung kẽm sinh học', created_at: '2026-09-25 15:50:00' }
    ];

    // Realistic marketing analytics baseline
    const INITIAL_ANALYTICS = {
        totalVisitors: 485,
        pageViews: 1290,
        avgTimeOnSite: '2m 48s',
        bounceRate: '32.6%',
        trafficSources: [
            { source: 'Facebook (Fanpage / Reels)', visits: 215, percent: 44.3, color: '#1877F2' },
            { source: 'Zalo (Nhóm Mẹ & Bé / OA)', visits: 136, percent: 28.0, color: '#0068FF' },
            { source: 'TikTok (Video Dinh Dưỡng)', visits: 78, percent: 16.1, color: '#111111' },
            { source: 'Google Tìm Kiếm Tự Nhiên', visits: 38, percent: 7.8, color: '#0F9D58' },
            { source: 'Trực Tiếp / Giới Thiệu', visits: 18, percent: 3.8, color: '#F08A4B' }
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
                consult_type: data.consult_type || 'Gói Đồng Hành 21 Ngày Tối Ưu Hấp Thu',
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
                resource_name: data.resource_name || 'Cẩm nang 30 Thực đơn Đột phá Hấp thu',
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
                    { page: 'Trang Chủ & Triết Lý', count: Math.max(1, Math.round(liveCount * 0.45)), url: '/' },
                    { page: 'Đọc 5 Trụ Cột Dinh Dưỡng', count: Math.max(1, Math.round(liveCount * 0.25)), url: '/#tru-cot' },
                    { page: 'Đặt Lịch Tư Vấn 1-1', count: Math.max(1, Math.round(liveCount * 0.20)), url: '/dat-lich/' },
                    { page: 'Cẩm Nang 30 Thực Đơn', count: Math.max(1, Math.round(liveCount * 0.10)), url: '/#cam-nang' }
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
                csvContent += '"ID","Họ tên Mẹ","Số điện thoại","Email","Tên bé","Tháng tuổi","Cân nặng","Chiều cao","Vấn đề","Gói tư vấn","Khung giờ","Nguồn","Trạng thái","Ghi chú","Thời gian"\n';
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
