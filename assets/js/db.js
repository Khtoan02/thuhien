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
    const STORAGE_KEY_SETTINGS = 'thuhien_settings_v1';
    const STORAGE_KEY_EMAIL_LOGS = 'thuhien_email_logs_v1';
    const STORAGE_KEY_SECURITY_LOGS = 'thuhien_security_logs_v1';
    const STORAGE_KEY_ADMIN_CRED = 'thuhien_admin_cred_v1';
    const STORAGE_KEY_LOGIN_ATTEMPTS = 'thuhien_login_attempts_v1';

    // Synchronous standard SHA-256 algorithm (zero-dependency, browser & node compatible)
    function sha256(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }
        var mathPow = Math.pow;
        var maxWord = mathPow(2, 32);
        var lengthProperty = "length";
        var i, j;
        var result = "";
        var words = [];
        var asciiBitLength = ascii[lengthProperty] * 8;
        var hash = [];
        var k = [];
        var primeCounter = 0;
        var isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
        ascii += "\x80";
        while (ascii[lengthProperty] % 64 - 56) ascii += "\x00";
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return;
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
        words[words[lengthProperty]] = (asciiBitLength);
        for (j = 0; j < words[lengthProperty];) {
            var w = words.slice(j, j += 16);
            var oldHash = hash;
            hash = hash.slice(0, 8);
            for (i = 0; i < 64; i++) {
                var i2 = i + j;
                var w15 = w[i - 15], w2 = w[i - 2];
                var a = hash[0], e = hash[4];
                var temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ ((~e) & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                            w[i - 16]
                            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                            + w[i - 7]
                            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                        ) | 0
                    );
                var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }
            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }
        for (i = 0; i < 8; i++) {
            for (i2 = 3; i2 >= 0; i2--) {
                var c = (hash[i] >> (i2 * 8)) & 255;
                result += ((c < 16 ? "0" : "") + c.toString(16));
            }
        }
        return result;
    }

    const DEFAULT_ADMIN_CRED = {
        username: 'admin',
        salt: 'thuhien_salt_secure_2026',
        hash: '7880e57d1f3c390da434aa0b239ed21cf99946f056212a404079509cb3d5b42f' // thuhien2026
    };

    const DEFAULT_SETTINGS = {
        email: {
            provider: 'webhook', // 'webhook' | 'emailjs' | 'formspree' | 'resend'
            admin_notify_email: 'thuhien.cungmehieucon@gmail.com',
            notify_on_booking: true,
            notify_on_lead: true,
            emailjs_service_id: '',
            emailjs_template_booking: '',
            emailjs_template_lead: '',
            emailjs_public_key: '',
            webhook_url: '',
            auto_reply_lead: true,
            auto_reply_lead_subject: 'Cẩm Nang Đồng Hành Cùng Con Tại Nhà - Thu Hiền gửi Mẹ',
            auto_reply_lead_body: 'Chào Mẹ {parent_name},\n\nCảm ơn Mẹ đã quan tâm đến tài liệu "{resource_name}".\nMẹ có thể tải trực tiếp cẩm nang tại đường dẫn sau:\n{resource_url}\n\nChúc Mẹ và bé {baby_age} luôn kiên nhẫn và bình an trên hành trình này!\n\nThương mến,\nThu Hiền - Cùng Mẹ Hiểu Con\nHotline/Zalo: {hotline}'
        },
        resources: [
            {
                id: 'res_1',
                title: 'Cẩm Nang: Những Bước Đầu Đồng Hành Cùng Con Tự Kỷ Tại Nhà',
                description: 'Ebook đúc kết từ 5 năm đồng hành thực tế, từng bước giúp mẹ hạ nhiệt lo âu và kết nối với con',
                file_url: 'https://drive.google.com/file/d/1DemoDriveFileCamNangThuHien2026/view?usp=sharing',
                button_text: 'Tải Cẩm Nang Ngay (Miễn Phí)',
                badge: 'Bản Cập Nhật 2026',
                active: true
            },
            {
                id: 'res_2',
                title: '30 Thực Đơn Trực Quan Cho Trẻ Kén Ăn & Nhạy Cảm Mùi Vị',
                description: 'Thực đơn phân cấp màu sắc và kết cấu giúp con làm quen thức ăn mới từng bước',
                file_url: '',
                button_text: 'Nhận Thực Đơn 30 Ngày',
                badge: 'Độc Quyền',
                active: false
            }
        ],
        social: {
            hotline: '0988.776.655',
            hotline_display: '0988 776 655',
            zalo_link: 'https://zalo.me/0988776655',
            zalo_number: '0988776655',
            facebook_url: 'https://www.facebook.com/thuhien.cungmehieucon?sub_confirmation=1',
            tiktok_url: 'https://www.tiktok.com/@thuhien.cungmehieucon?is_from_webapp=1&sender_device=pc&sub_confirmation=1',
            youtube_url: 'https://www.youtube.com/@thuhien.cungmehieucon?sub_confirmation=1',
            email_contact: 'thuhien.cungmehieucon@gmail.com',
            support_hours: '08:00 - 21:30 (Thứ 2 - Chủ Nhật)',
            community_facebook_group: 'https://hieucontugoc.online/facebook-group',
            community_website: 'https://hieucontugoc.online/',
            community_zalo_group: 'https://hieucontugoc.online/zalo-group'
        },
        integrations: {
            google_analytics_id: '',
            google_tag_manager_id: '',
            facebook_pixel_id: '',
            tiktok_pixel_id: '',
            vercel_analytics_enabled: true,
            custom_head_scripts: '',
            custom_body_scripts: ''
        },
        security: {
            max_failed_attempts: 5,
            lockout_minutes: 15,
            session_timeout_minutes: 30,
            require_captcha: true,
            honeypot_enabled: true
        }
    };

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
        if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        } else {
            try {
                const s = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS));
                let changed = false;
                if (s?.social?.youtube_url && s.social.youtube_url.includes('thuhien_cungmehieucon')) {
                    s.social.youtube_url = 'https://www.youtube.com/@thuhien.cungmehieucon';
                    changed = true;
                }
                if (s?.social?.tiktok_url && s.social.tiktok_url.includes('thuhien_cungmehieucon')) {
                    s.social.tiktok_url = 'https://www.tiktok.com/@thuhien.cungmehieucon';
                    changed = true;
                }
                if (changed) {
                    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(s));
                }
            } catch (e) {}
        }
        if (!localStorage.getItem(STORAGE_KEY_ADMIN_CRED)) {
            localStorage.setItem(STORAGE_KEY_ADMIN_CRED, JSON.stringify(DEFAULT_ADMIN_CRED));
        }
        if (!localStorage.getItem(STORAGE_KEY_EMAIL_LOGS)) {
            localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEY_SECURITY_LOGS)) {
            localStorage.setItem(STORAGE_KEY_SECURITY_LOGS, JSON.stringify([]));
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
        },

        // ====================================================================
        // SETTINGS & CONFIGURATION ENGINE
        // ====================================================================
        getSettings() {
            try {
                const s = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS));
                const soc = { ...DEFAULT_SETTINGS.social, ...(s?.social || {}) };
                if (soc.youtube_url && soc.youtube_url.includes('thuhien_cungmehieucon')) {
                    soc.youtube_url = 'https://www.youtube.com/@thuhien.cungmehieucon';
                }
                if (soc.tiktok_url && soc.tiktok_url.includes('thuhien_cungmehieucon')) {
                    soc.tiktok_url = 'https://www.tiktok.com/@thuhien.cungmehieucon';
                }
                return {
                    email: { ...DEFAULT_SETTINGS.email, ...(s?.email || {}) },
                    resources: s?.resources || DEFAULT_SETTINGS.resources,
                    social: soc,
                    integrations: { ...DEFAULT_SETTINGS.integrations, ...(s?.integrations || {}) },
                    security: { ...DEFAULT_SETTINGS.security, ...(s?.security || {}) }
                };
            } catch (e) {
                return DEFAULT_SETTINGS;
            }
        },

        saveSettings(newSettings) {
            try {
                const current = this.getSettings();
                const merged = {
                    email: { ...current.email, ...(newSettings.email || {}) },
                    resources: newSettings.resources || current.resources,
                    social: { ...current.social, ...(newSettings.social || {}) },
                    integrations: { ...current.integrations, ...(newSettings.integrations || {}) },
                    security: { ...current.security, ...(newSettings.security || {}) }
                };
                localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(merged));
                this.logSecurityEvent('SETTINGS_UPDATED', 'SUCCESS', 'Cập nhật cấu hình hệ thống');
                return true;
            } catch (e) {
                return false;
            }
        },

        resetSettings() {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
            return DEFAULT_SETTINGS;
        },

        getActiveResource() {
            const settings = this.getSettings();
            return (settings.resources || []).find(r => r.active || r.is_active) || settings.resources[0] || null;
        },

        updateResource(id, updatedFields) {
            const settings = this.getSettings();
            const list = settings.resources || [];
            const idx = list.findIndex(r => r.id === id);
            if (idx !== -1) {
                const willBeActive = updatedFields.active || updatedFields.is_active;
                if (willBeActive) {
                    list.forEach(item => {
                        item.active = false;
                        item.is_active = false;
                    });
                }
                list[idx] = { 
                    ...list[idx], 
                    ...updatedFields,
                    active: willBeActive !== undefined ? willBeActive : (list[idx].active || list[idx].is_active),
                    is_active: willBeActive !== undefined ? willBeActive : (list[idx].is_active || list[idx].active)
                };
                settings.resources = list;
                this.saveSettings(settings);
                return true;
            }
            return false;
        },

        addResource(resourceData) {
            const settings = this.getSettings();
            const list = settings.resources || [];
            const isActive = resourceData.active !== undefined ? resourceData.active : (resourceData.is_active !== undefined ? resourceData.is_active : true);
            if (isActive) {
                list.forEach(item => {
                    item.active = false;
                    item.is_active = false;
                });
            }
            const newRes = {
                id: 'res_' + Date.now(),
                title: resourceData.title || 'Tài Liệu Mới',
                description: resourceData.description || '',
                file_url: resourceData.file_url || '',
                button_text: resourceData.button_text || 'Tải Cẩm Nang Ngay (PDF)',
                badge: resourceData.badge || 'Mới',
                active: isActive,
                is_active: isActive
            };
            list.push(newRes);
            settings.resources = list;
            this.saveSettings(settings);
            return newRes;
        },

        deleteResource(id) {
            const settings = this.getSettings();
            settings.resources = (settings.resources || []).filter(r => r.id !== id);
            this.saveSettings(settings);
            return true;
        },

        // ====================================================================
        // EMAIL & AUTOMATION ENGINE
        // ====================================================================
        getEmailLogs() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY_EMAIL_LOGS)) || [];
            } catch (e) {
                return [];
            }
        },

        clearEmailLogs() {
            localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify([]));
            return true;
        },

        async sendNotificationEmail(type, payload) {
            const settings = this.getSettings();
            const emailCfg = settings.email;
            const nowStr = new Date().toLocaleString('vi-VN');

            let subject = '';
            let bodyText = '';
            const logs = this.getEmailLogs();

            if (type === 'booking') {
                if (!emailCfg.notify_on_booking) return null;
                subject = `[Lịch Hẹn Mới] Phụ huynh ${payload.parent_name} - ${payload.consult_type}`;
                bodyText = `THÔNG BÁO LỊCH HẸN TƯ VẤN 1-1 MỚI\n\n` +
                    `- Họ tên mẹ: ${payload.parent_name}\n` +
                    `- SĐT / Zalo: ${payload.phone}\n` +
                    `- Email: ${payload.email || 'Không có'}\n` +
                    `- Thông tin bé: ${payload.baby_name || 'Bé'} (${payload.baby_age || '-'})\n` +
                    `- Biểu hiện của con: ${payload.issues || '-'}\n` +
                    `- Chia sẻ của mẹ: ${payload.feeding_notes || '-'}\n` +
                    `- Gói đồng hành: ${payload.consult_type}\n` +
                    `- Khung giờ mong muốn: ${payload.preferred_time}\n` +
                    `- Thời gian gửi: ${payload.created_at || nowStr}`;
            } else if (type === 'lead') {
                if (!emailCfg.notify_on_lead) return null;
                subject = `[Tải Cẩm Nang Mới] Phụ huynh ${payload.parent_name} - ${payload.phone}`;
                bodyText = `THÔNG BÁO TẢI CẨM NANG / TÀI LIỆU MỚI\n\n` +
                    `- Họ tên mẹ: ${payload.parent_name}\n` +
                    `- Số Zalo: ${payload.phone}\n` +
                    `- Email: ${payload.email || 'Không có'}\n` +
                    `- Độ tuổi bé: ${payload.baby_age || '-'}\n` +
                    `- Tài liệu nhận: ${payload.resource_name}\n` +
                    `- Thời gian gửi: ${payload.created_at || nowStr}`;
            } else if (type === 'test') {
                subject = `[Kiểm Tra Hệ Thống] Email thử nghiệm từ Website Thu Hiền`;
                bodyText = `Xin chào,\n\nĐây là email kiểm tra kết nối từ hệ thống quản trị Thu Hiền - Cùng Mẹ Hiểu Con.\nNếu bạn nhận được email này, cấu hình thông báo đã hoạt động thành công!\n\nThời gian: ${nowStr}`;
            }

            const targetRecipient = payload.recipient || emailCfg.admin_notify_email;
            const logEntry = {
                id: Date.now(),
                type: type,
                recipient: targetRecipient,
                subject: subject,
                provider: emailCfg.provider,
                status: 'Sent (Đã ghi nhận)',
                created_at: nowStr,
                details: bodyText
            };

            // Attempt delivery via Webhook if configured
            if (emailCfg.provider === 'webhook' && emailCfg.webhook_url) {
                try {
                    await fetch(emailCfg.webhook_url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            event: type,
                            subject: subject,
                            recipient: targetRecipient,
                            payload: payload,
                            text: bodyText,
                            timestamp: new Date().toISOString()
                        })
                    });
                    logEntry.status = 'Delivered (Webhook thành công)';
                } catch (err) {
                    logEntry.status = 'Error (Webhook không phản hồi: ' + err.message + ')';
                }
            } else if (emailCfg.provider === 'emailjs' && emailCfg.emailjs_service_id && emailCfg.emailjs_public_key) {
                if (typeof window !== 'undefined' && window.emailjs) {
                    try {
                        const templateId = type === 'booking' ? emailCfg.emailjs_template_booking : emailCfg.emailjs_template_lead;
                        await window.emailjs.send(emailCfg.emailjs_service_id, templateId, {
                            to_email: targetRecipient,
                            subject: subject,
                            message: bodyText,
                            ...payload
                        }, emailCfg.emailjs_public_key);
                        logEntry.status = 'Delivered (EmailJS thành công)';
                    } catch (err) {
                        logEntry.status = 'Error (EmailJS: ' + err.message + ')';
                    }
                } else {
                    logEntry.status = 'Simulated (Chờ nạp SDK EmailJS)';
                }
            } else {
                logEntry.status = 'Simulated (Lưu hệ thống nội bộ)';
            }

            logs.unshift(logEntry);
            if (logs.length > 50) logs.pop();
            localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify(logs));
            return logEntry;
        },

        async testEmail(targetEmail) {
            return await this.sendNotificationEmail('test', {
                recipient: targetEmail || this.getSettings().email.admin_notify_email,
                parent_name: 'Quản Trị Viên'
            });
        },

        // ====================================================================
        // SECURITY & ANTI-BOT ENGINE
        // ====================================================================
        getSecurityLogs() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY_SECURITY_LOGS)) || [];
            } catch (e) {
                return [];
            }
        },

        clearSecurityLogs() {
            localStorage.setItem(STORAGE_KEY_SECURITY_LOGS, JSON.stringify([]));
            return true;
        },

        logSecurityEvent(action, status, details) {
            try {
                const logs = this.getSecurityLogs();
                const nowStr = new Date().toLocaleString('vi-VN');
                const userAgent = typeof navigator !== 'undefined' ? (navigator.userAgent || '').substring(0, 100) : 'Server/Node';
                logs.unshift({
                    id: Date.now(),
                    action: action,
                    status: status,
                    details: details,
                    userAgent: userAgent,
                    timestamp: nowStr
                });
                if (logs.length > 100) logs.pop();
                localStorage.setItem(STORAGE_KEY_SECURITY_LOGS, JSON.stringify(logs));
            } catch (e) {}
        },

        getLoginLockoutState() {
            try {
                const data = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGIN_ATTEMPTS) || '{"count": 0, "lockUntil": 0}');
                const now = Date.now();
                if (data.lockUntil && now < data.lockUntil) {
                    const remainingSeconds = Math.ceil((data.lockUntil - now) / 1000);
                    return { isLocked: true, locked: true, remainingSeconds: remainingSeconds, count: data.count };
                }
                return { isLocked: false, locked: false, remainingSeconds: 0, count: data.count || 0 };
            } catch (e) {
                return { isLocked: false, locked: false, remainingSeconds: 0, count: 0 };
            }
        },

        verifyAdminLogin(username, password, honeypotValue, captchaAnswer, expectedCaptchaAnswer, elapsedMs) {
            const lockout = this.getLoginLockoutState();
            if (lockout.isLocked) {
                const mins = Math.ceil(lockout.remainingSeconds / 60);
                this.logSecurityEvent('LOGIN_ATTEMPT_BLOCKED', 'BLOCKED', `Thử đăng nhập khi tài khoản đang bị khóa (${lockout.remainingSeconds}s còn lại)`);
                return {
                    success: false,
                    code: 'LOCKED',
                    message: `Tài khoản tạm khóa do nghi vấn bot spam. Vui lòng thử lại sau ${mins} phút.`
                };
            }

            // 1. Honeypot check (Invisible field filled by bots)
            if (honeypotValue && honeypotValue.trim().length > 0) {
                this.logSecurityEvent('BOT_HONEYPOT_DETECTED', 'BLOCKED', `Bot đã điền vào trường bẫy ẩn: "${honeypotValue.substring(0, 30)}"`);
                return {
                    success: false,
                    code: 'BOT_DETECTED',
                    message: 'Yêu cầu bị từ chối bởi hệ thống phòng thủ Anti-Bot.'
                };
            }

            // 2. Timing check (< 800ms indicates automated script)
            if (elapsedMs && elapsedMs < 800) {
                this.logSecurityEvent('BOT_TIMING_FAST', 'BLOCKED', `Thời gian gửi form quá nhanh: ${elapsedMs}ms`);
                return {
                    success: false,
                    code: 'BOT_TIMING',
                    message: 'Phát hiện hành vi tự động. Vui lòng thao tác bình thường.'
                };
            }

            // 3. Captcha check
            if (expectedCaptchaAnswer !== undefined && String(captchaAnswer || '').trim() !== String(expectedCaptchaAnswer).trim()) {
                this.logSecurityEvent('CAPTCHA_FAILED', 'FAILED', `Nhập sai mã xác thực: "${captchaAnswer}" (cần: "${expectedCaptchaAnswer}")`);
                return {
                    success: false,
                    code: 'CAPTCHA_FAILED',
                    message: 'Câu trả lời xác thực chống bot chưa chính xác.'
                };
            }

            // 4. Validate Credentials with Salted SHA-256
            const creds = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_CRED) || JSON.stringify(DEFAULT_ADMIN_CRED));
            const inputHash = sha256(String(password).trim() + creds.salt);

            if (username.trim() === creds.username && inputHash === creds.hash) {
                localStorage.removeItem(STORAGE_KEY_LOGIN_ATTEMPTS);
                this.logSecurityEvent('LOGIN_SUCCESS', 'SUCCESS', `Đăng nhập thành công với user "${username}"`);
                try {
                    sessionStorage.setItem('thuhien_admin_auth', 'true');
                    sessionStorage.setItem('thuhien_admin_auth_time', String(Date.now()));
                } catch (e) {}
                return { success: true };
            } else {
                let attempts = JSON.parse(localStorage.getItem(STORAGE_KEY_LOGIN_ATTEMPTS) || '{"count": 0, "lockUntil": 0}');
                attempts.count = (attempts.count || 0) + 1;
                
                if (attempts.count >= 5) {
                    attempts.lockUntil = Date.now() + 15 * 60 * 1000;
                    localStorage.setItem(STORAGE_KEY_LOGIN_ATTEMPTS, JSON.stringify(attempts));
                    this.logSecurityEvent('ACCOUNT_LOCKED_BRUTEFORCE', 'LOCKED', 'Đã nhập sai 5 lần. Kích hoạt khóa 15 phút.');
                    return {
                        success: false,
                        code: 'LOCKED',
                        message: 'Bạn đã nhập sai 5 lần liên tiếp. Hệ thống khóa đăng nhập 15 phút để phòng chống bot brute-force!'
                    };
                } else {
                    localStorage.setItem(STORAGE_KEY_LOGIN_ATTEMPTS, JSON.stringify(attempts));
                    this.logSecurityEvent('LOGIN_FAILED', 'FAILED', `Sai tài khoản hoặc mật khẩu (Lần ${attempts.count}/5)`);
                    return {
                        success: false,
                        code: 'INVALID_CREDENTIALS',
                        message: `Tài khoản hoặc mật khẩu không chính xác! (Còn ${5 - attempts.count} lần thử)`
                    };
                }
            }
        },

        changeAdminCredentials(currentPassword, newUsername, newPassword) {
            const creds = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_CRED) || JSON.stringify(DEFAULT_ADMIN_CRED));
            const currentHash = sha256(String(currentPassword).trim() + creds.salt);

            if (currentHash !== creds.hash) {
                this.logSecurityEvent('CHANGE_PASSWORD_FAILED', 'FAILED', 'Nhập sai mật khẩu hiện tại khi đổi thông tin');
                return { success: false, message: 'Mật khẩu hiện tại không đúng!' };
            }

            if (!newUsername || newUsername.trim().length < 3) {
                return { success: false, message: 'Tên đăng nhập mới phải có ít nhất 3 ký tự!' };
            }

            if (!newPassword || newPassword.trim().length < 6) {
                return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' };
            }

            const newSalt = 'thuhien_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
            const newHash = sha256(String(newPassword).trim() + newSalt);

            const newCreds = {
                username: newUsername.trim(),
                salt: newSalt,
                hash: newHash
            };

            localStorage.setItem(STORAGE_KEY_ADMIN_CRED, JSON.stringify(newCreds));
            this.logSecurityEvent('CREDENTIALS_CHANGED', 'SUCCESS', `Đổi tài khoản thành công sang "${newCreds.username}"`);
            return { success: true, message: 'Đổi thông tin đăng nhập thành công!' };
        },

        // ====================================================================
        // FRONTEND INTEGRATIONS & SOCIAL LINK BINDINGS
        // ====================================================================
        applyIntegrations() {
            if (typeof document === 'undefined') return;
            const settings = this.getSettings();
            const integ = settings.integrations;

            // 1. Google Analytics (GA4)
            if (integ.google_analytics_id && !document.getElementById('ga-script-thuhien')) {
                const gaId = integ.google_analytics_id.trim();
                const s = document.createElement('script');
                s.id = 'ga-script-thuhien';
                s.async = true;
                s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
                document.head.appendChild(s);

                const inline = document.createElement('script');
                inline.innerHTML = `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `;
                document.head.appendChild(inline);
            }

            // 2. Google Tag Manager (GTM)
            if (integ.google_tag_manager_id && !document.getElementById('gtm-script-thuhien')) {
                const gtmId = integ.google_tag_manager_id.trim();
                const s = document.createElement('script');
                s.id = 'gtm-script-thuhien';
                s.innerHTML = `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${gtmId}');
                `;
                document.head.appendChild(s);
            }

            // 3. Meta (Facebook) Pixel
            if (integ.facebook_pixel_id && !document.getElementById('fb-pixel-thuhien')) {
                const pixelId = integ.facebook_pixel_id.trim();
                const s = document.createElement('script');
                s.id = 'fb-pixel-thuhien';
                s.innerHTML = `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${pixelId}');
                    fbq('track', 'PageView');
                `;
                document.head.appendChild(s);
            }

            // 4. TikTok Pixel
            if (integ.tiktok_pixel_id && !document.getElementById('tt-pixel-thuhien')) {
                const ttId = integ.tiktok_pixel_id.trim();
                const s = document.createElement('script');
                s.id = 'tt-pixel-thuhien';
                s.innerHTML = `
                    !function (w, d, t) {
                    w.TiktokAnalyticsObject=t;var tt=w[t]=w[t]||[];tt.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],tt.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<tt.methods.length;i++)tt.setAndDefer(tt,tt.methods[i]);tt.instance=function(t){for(var e=tt._i[t]||[],n=0;n<tt.methods.length;n++)tt.setAndDefer(e,tt.methods[n]);return e},tt.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";tt._i=tt._i||{},tt._i[e]=[],tt._i[e]._u=i,s=d.createElement("script"),s.type="text/javascript",s.async=!0,s.src=i+"?sdkid="+e+"&lib="+t;var o=d.getElementsByTagName("script")[0];o.parentNode.insertBefore(s,o)};
                    tt.load('${ttId}');
                    tt.page();
                    }(window, document, 'ttq');
                `;
                document.head.appendChild(s);
            }

            // 5. Vercel Web Analytics
            if (integ.vercel_analytics_enabled && !document.getElementById('vercel-insights-thuhien')) {
                window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
                const s = document.createElement('script');
                s.id = 'vercel-insights-thuhien';
                s.defer = true;
                s.src = '/_vercel/insights/script.js';
                document.head.appendChild(s);
            }

            // 6. Custom Head Scripts
            if (integ.custom_head_scripts && !document.getElementById('custom-head-thuhien')) {
                const container = document.createElement('div');
                container.id = 'custom-head-thuhien';
                container.style.display = 'none';
                container.innerHTML = integ.custom_head_scripts;
                document.head.appendChild(container);
                container.querySelectorAll('script').forEach(sc => {
                    const run = document.createElement('script');
                    if (sc.src) run.src = sc.src;
                    else run.textContent = sc.textContent;
                    document.head.appendChild(run);
                });
            }

            // 7. Custom Body Scripts
            if (integ.custom_body_scripts && !document.getElementById('custom-body-thuhien')) {
                const container = document.createElement('div');
                container.id = 'custom-body-thuhien';
                container.style.display = 'none';
                container.innerHTML = integ.custom_body_scripts;
                document.body.appendChild(container);
                container.querySelectorAll('script').forEach(sc => {
                    const run = document.createElement('script');
                    if (sc.src) run.src = sc.src;
                    else run.textContent = sc.textContent;
                    document.body.appendChild(run);
                });
            }
        },

        applySocialLinks() {
            if (typeof document === 'undefined') return;
            const settings = this.getSettings();
            const soc = settings.social;

            // Update Zalo links
            if (soc.zalo_link || soc.zalo_number) {
                const zLink = soc.zalo_link || `https://zalo.me/${soc.zalo_number.replace(/[^0-9]/g, '')}`;
                document.querySelectorAll('a[href*="zalo.me"]').forEach(a => {
                    a.href = zLink;
                });
            }

            // Update Facebook links
            if (soc.facebook_url) {
                const fbUrl = soc.facebook_url.includes('sub_confirmation=1') 
                    ? soc.facebook_url 
                    : `${soc.facebook_url}${soc.facebook_url.includes('?') ? '&' : '?'}sub_confirmation=1`;
                document.querySelectorAll('a[href*="facebook.com"]').forEach(a => {
                    a.href = fbUrl;
                });
            }

            // Update TikTok links
            if (soc.tiktok_url) {
                const ttUrl = soc.tiktok_url.includes('sub_confirmation=1')
                    ? soc.tiktok_url
                    : `${soc.tiktok_url}${soc.tiktok_url.includes('?') ? '&' : '?'}is_from_webapp=1&sender_device=pc&sub_confirmation=1`;
                document.querySelectorAll('a[href*="tiktok.com"]').forEach(a => {
                    a.href = ttUrl;
                });
            }

            // Update YouTube links
            if (soc.youtube_url) {
                const ytUrl = soc.youtube_url.includes('sub_confirmation=1') 
                    ? soc.youtube_url 
                    : `${soc.youtube_url}${soc.youtube_url.includes('?') ? '&' : '?'}sub_confirmation=1`;
                document.querySelectorAll('a[href*="youtube.com"]').forEach(a => {
                    a.href = ytUrl;
                });
            }

            // Update Hotline tel: links & text
            if (soc.hotline) {
                const cleanPhone = soc.hotline.replace(/[^0-9]/g, '');
                document.querySelectorAll('a[href^="tel:"]').forEach(a => {
                    a.href = `tel:${cleanPhone}`;
                    if (a.dataset.dynamicPhone !== 'false' && a.innerText.match(/[0-9]{3}/)) {
                        a.innerText = soc.hotline_display || soc.hotline;
                    }
                });
            }
        }
    };
})();
