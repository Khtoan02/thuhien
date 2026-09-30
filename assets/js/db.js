/**
 * Client-Side Database & Analytics Layer for Thu Hiền - Cùng Mẹ Hiểu Con
 * Uses LocalStorage for zero-backend, instant, offline-capable persistence.
 */

const DB = (() => {
    const STORAGE_KEY_BOOKINGS = 'thuhien_bookings_v1';
    const STORAGE_KEY_LEADS = 'thuhien_leads_v1';
    const STORAGE_KEY_VIEWS = 'thuhien_views_v1';

    // Sample initial dataset to demonstrate dashboard functionality immediately
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
            status: 'pending',
            admin_notes: 'Đã gửi tin nhắn Zalo hẹn tối thứ 5 gọi video',
            created_at: '2026-09-28 19:30:00'
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
            issues: 'Táo bón / Đi ngoài phân sống, Tư vấn bổ sung vi chất chuẩn liều',
            feeding_notes: 'Bé 3 ngày mới đi ngoài 1 lần, phân cứng, hay quấy khóc ban đêm.',
            consult_type: 'Tư Vấn Đơn Điểm 1-1 (60 Phút Trực Tiếp)',
            preferred_time: 'Cuối tuần (Thứ 7 / Chủ Nhật)',
            status: 'contacted',
            admin_notes: 'Mẹ đã gửi phiếu xét nghiệm vi chất, hẹn chuyên gia tư vấn sáng T7.',
            created_at: '2026-09-27 10:15:00'
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
            issues: 'Lên thực đơn ăn dặm theo tháng tuổi, Nghi ngờ dị ứng đạm bò',
            feeding_notes: 'Bé vừa cai sữa, tiêu hóa nhạy cảm, muốn chuyên gia lên thực đơn 30 ngày.',
            consult_type: 'Gói Đồng Hành Toàn Diện 1 Tháng Kèm Thực Đơn',
            preferred_time: 'Giờ hành chính (09h00 - 17h00)',
            status: 'completed',
            admin_notes: 'Đã gửi phác đồ và tài liệu thực đơn, bé đã ăn ngoan và đi ngoài đều.',
            created_at: '2026-09-25 14:20:00'
        }
    ];

    const INITIAL_LEADS = [
        { id: 201, parent_name: 'Phạm Hải Yến', phone: '0945123987', email: 'haiyen.pham@gmail.com', baby_age: '7 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', created_at: '2026-09-29 11:20:00' },
        { id: 202, parent_name: 'Hoàng Minh Châu', phone: '0978654321', email: 'chauhoang.mc@gmail.com', baby_age: '11 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', created_at: '2026-09-29 16:45:00' },
        { id: 203, parent_name: 'Đỗ Quỳnh Nga', phone: '0919888777', email: 'quynhnga.do@gmail.com', baby_age: '18 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', created_at: '2026-09-28 09:10:00' },
        { id: 204, parent_name: 'Vũ Thị Thu Hà', phone: '0934567890', email: 'thuha.vu@gmail.com', baby_age: '9 tháng', resource_name: 'Cẩm nang 30 Thực đơn Đột phá Hấp thu', created_at: '2026-09-27 21:05:00' }
    ];

    function init() {
        if (!localStorage.getItem(STORAGE_KEY_BOOKINGS)) {
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        }
        if (!localStorage.getItem(STORAGE_KEY_LEADS)) {
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_LEADS));
        }
        if (!localStorage.getItem(STORAGE_KEY_VIEWS)) {
            localStorage.setItem(STORAGE_KEY_VIEWS, '78');
        }
    }

    init();

    return {
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
                created_at: createdAt
            };

            leads.unshift(newLead);
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
            return newLead;
        },

        trackView() {
            let views = parseInt(localStorage.getItem(STORAGE_KEY_VIEWS) || '78', 10);
            views += 1;
            localStorage.setItem(STORAGE_KEY_VIEWS, views.toString());
            return views;
        },

        getStats() {
            const bookings = this.getBookings();
            const leads = this.getLeads();
            const views = parseInt(localStorage.getItem(STORAGE_KEY_VIEWS) || '80', 10);

            const pending = bookings.filter(b => b.status === 'pending').length;
            const contacted = bookings.filter(b => b.status === 'contacted').length;
            const inProgress = bookings.filter(b => b.status === 'in_progress').length;
            const completed = bookings.filter(b => b.status === 'completed').length;
            const conversionRate = views > 0 ? (((bookings.length + leads.length) / views) * 100).toFixed(1) : '0';

            return {
                totalBookings: bookings.length,
                pending,
                contacted,
                inProgress,
                completed,
                totalLeads: leads.length,
                totalViews: views,
                conversionRate
            };
        },

        exportCSV(type = 'bookings') {
            let csvContent = '\uFEFF'; // UTF-8 BOM for Excel
            if (type === 'leads') {
                const leads = this.getLeads();
                csvContent += '"ID","Họ tên Mẹ","Số điện thoại","Email","Tuổi bé","Tài liệu","Thời gian"\n';
                leads.forEach(l => {
                    csvContent += `"${l.id}","${l.parent_name}","${l.phone}","${l.email}","${l.baby_age}","${l.resource_name}","${l.created_at}"\n`;
                });
            } else {
                const bookings = this.getBookings();
                csvContent += '"ID","Họ tên Mẹ","Số điện thoại","Email","Tên bé","Tháng tuổi","Cân nặng","Chiều cao","Vấn đề","Gói tư vấn","Khung giờ","Trạng thái","Ghi chú","Thời gian"\n';
                bookings.forEach(b => {
                    csvContent += `"${b.id}","${b.parent_name}","${b.phone}","${b.email}","${b.baby_name}","${b.baby_age}","${b.baby_weight}","${b.baby_height}","${(b.issues || '').replace(/"/g, '""')}","${b.consult_type}","${b.preferred_time}","${b.status}","${(b.admin_notes || '').replace(/"/g, '""')}","${b.created_at}"\n`;
                });
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `danh-sach-${type}-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        resetSampleData() {
            localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
            localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(INITIAL_LEADS));
            localStorage.setItem(STORAGE_KEY_VIEWS, '78');
        }
    };
})();
