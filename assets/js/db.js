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
    const STORAGE_KEY_EVALUATIONS = 'thuhien_evaluations_v1';
    const STORAGE_KEY_DELETED_EVALUATIONS = 'thuhien_deleted_evaluations_v1';
    const STORAGE_KEY_CHECKLISTS = 'thuhien_checklists_v1';

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyDdt8u-SD8fvqtW4j9e5FBxPQT0_RXIKhQ",
        authDomain: "thuhien-cungmehieucon.firebaseapp.com",
        projectId: "thuhien-cungmehieucon",
        storageBucket: "thuhien-cungmehieucon.firebasestorage.app",
        messagingSenderId: "285736864114",
        appId: "1:285736864114:web:89832aa6b485590fdd35eb",
        measurementId: "G-WB4K2SC14M"
    };

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
            provider: 'smtp', // 'smtp' | 'webhook' | 'emailjs' | 'formspree' | 'resend'
            admin_notify_email: 'thuhien.cungmehieucon@gmail.com',
            notify_on_booking: true,
            notify_on_lead: true,
            notify_on_evaluation: true,
            smtp_host: 'smtp.gmail.com',
            smtp_port: 465,
            smtp_secure: true,
            smtp_user: '',
            smtp_pass: '',
            smtp_from_name: 'Thu Hiền - Cùng Mẹ Hiểu Con',
            smtp_from_email: '',
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
            zalo_link: 'https://hieucontugoc.online/zalo',
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
        },
        pages: [
            {
                id: 'home',
                title: 'Trang Chủ',
                path: '/',
                slug: 'home',
                enabled: true,
                can_disable: false,
                category: 'Trang Chính',
                description: 'Trang thông tin tổng quan giới thiệu dịch vụ và đồng hành cùng phụ huynh'
            },
            {
                id: 'chuyen-gia',
                title: 'Chuyên Gia Bùi Thu Hiền',
                path: '/chuyen-gia/',
                slug: 'chuyen-gia',
                enabled: true,
                can_disable: true,
                category: 'Hồ Sơ Chuyên Môn',
                description: 'Hồ sơ năng lực, 4 điểm tựa kinh nghiệm và phong cách làm việc'
            },
            {
                id: 'dinh-duong',
                title: 'Lời Khuyên Dinh Dưỡng',
                path: '/dinh-duong/',
                slug: 'dinh-duong',
                enabled: true,
                can_disable: true,
                category: 'Kiến Thức Khoa Học',
                description: 'Chế độ ăn GFCF+SF, thực phẩm khuyên dùng và nhóm cần hạn chế'
            },
            {
                id: 'cong-dong',
                title: 'Kênh & Cộng Đồng',
                path: '/cong-dong/',
                slug: 'cong-dong',
                enabled: true,
                can_disable: true,
                category: 'Mạng Xã Hội',
                description: 'Cộng đồng Hiểu Con Từ Gốc và kênh TikTok, YouTube, Facebook có embed'
            },
            {
                id: 'pricing',
                title: 'Bảng Giá & Gói Dịch Vụ',
                path: '/pricing/',
                slug: 'pricing',
                enabled: true,
                can_disable: true,
                category: 'Dịch Vụ & Chi Phí',
                description: 'Bảng giá các gói đồng hành 3 ngày, 1 tháng và cam kết hoàn tiền 100%'
            },
            {
                id: 'danh-gia',
                title: 'Phiếu Đánh Giá Dinh Dưỡng',
                path: '/danh-gia-dinh-duong/',
                slug: 'danh-gia-dinh-duong',
                enabled: true,
                can_disable: true,
                category: 'Đánh Giá & Khảo Sát',
                description: 'Checklist sàng lọc thói quen ăn uống, nhai nuốt và nguy cơ thiếu hụt vi chất cho trẻ'
            },
            {
                id: 'tra-cuu',
                title: 'Tra Cứu Kết Quả Đánh Giá',
                path: '/tra-cuu/',
                slug: 'tra-cuu',
                enabled: true,
                can_disable: true,
                category: 'Đánh Giá & Khảo Sát',
                description: 'Trang tra cứu lịch sử đánh giá dinh dưỡng của bé theo số điện thoại của phụ huynh'
            },
            {
                id: 'dat-lich',
                title: 'Đặt Lịch Tư Vấn 1:1',
                path: '/dat-lich/',
                slug: 'dat-lich',
                enabled: true,
                can_disable: true,
                category: 'Đặt Lịch & Biểu Mẫu',
                description: 'Form khảo sát tình trạng bé và đăng ký giờ hẹn trao đổi riêng'
            },
            {
                id: 'danh-gia-thieu-sat',
                title: 'Checklist Đánh Giá Thiếu Sắt',
                path: '/danh-gia-thieu-sat/',
                slug: 'danh-gia-thieu-sat',
                enabled: true,
                can_disable: true,
                category: 'Đánh Giá & Khảo Sát',
                description: 'Checklist 14 câu hỏi đánh giá nguy cơ thiếu sắt ở trẻ rối loạn phát triển'
            }
        ],
        pages_schema_v: 5,
        pages_behavior: 'maintenance_screen', // 'maintenance_screen' | 'redirect_home'
        pages_maintenance_message: 'Trang này hiện đang được Chuyên gia Bùi Thu Hiền và đội ngũ hoàn thiện nội dung để mang đến trải nghiệm chuẩn mực nhất cho phụ huynh. Ba mẹ vui lòng quay lại sau nhé!'
    };

    const DEFAULT_CHECKLISTS = [
        {
            id: 'checklist_iron_deficiency',
            title: 'Checklist Đánh Giá Nguy Cơ Thiếu Sắt Ở Trẻ Rối Loạn Phát Triển',
            category: 'Vi Chất & Dinh Dưỡng Chuyên Sâu',
            slug: 'danh-gia-thieu-sat',
            path: '/danh-gia-thieu-sat/',
            question_count: 14,
            target_age: 'Từ 6 tháng trở lên',
            status: 'active',
            description: 'Sàng lọc 14 dấu hiệu thiếu máu thiếu sắt, hội chứng chân không yên, thói quen ăn uống và rào cản chuyển hóa ở trẻ đặc biệt.',
            created_at: '06/10/2026',
            lead_magnet: 'Cẩm Nang Bổ Sung Sắt An Toàn & Thực Đơn Giàu Sắt Dễ Hấp Thu Cho Trẻ',
            scoring_guide: '0-2đ: Nguy cơ thấp | 3-5đ: Có nguy cơ thiếu sắt | ≥6đ: Nguy cơ cao (Cần xét nghiệm Ferritin)'
        },
        {
            id: 'checklist_nutrition',
            title: 'Sàng Lọc Dinh Dưỡng & Tiêu Hóa Trẻ Đặc Biệt',
            category: 'Dinh Dưỡng GFCF+SF',
            slug: 'danh-gia-dinh-duong',
            path: '/danh-gia-dinh-duong/',
            question_count: 10,
            target_age: '1 - 10 tuổi',
            status: 'active',
            description: 'Đánh giá thói quen ăn uống, nhai nuốt, táo bón, dị ứng và nguy cơ thiếu hụt vi chất dinh dưỡng cho trẻ.',
            created_at: '01/10/2026',
            lead_magnet: 'Nhận Báo Cáo Phân Tích Thể Trạng & Phác Đồ Ăn Uống 1:1',
            scoring_guide: '1-5đ: Nguy cơ thấp | 5-10đ: Nguy cơ trung bình | >10đ: Nguy cơ cao'
        },
        {
            id: 'checklist_autism_early',
            title: 'Sàng Lọc Dấu Hiệu Phổ Tự Kỷ & Giao Tiếp Sớm (M-CHAT-R)',
            category: 'Phát Triển & Hành Vi',
            slug: 'checklist-tu-ky-som',
            path: '/danh-gia-dinh-duong/?type=autism',
            question_count: 12,
            target_age: '16 - 36 tháng',
            status: 'active',
            description: 'Khảo sát giao tiếp mắt, chỉ tay, phản ứng tên gọi, bắt chước và biểu hiện tương tác xã hội trong giai đoạn vàng.',
            created_at: '02/10/2026',
            lead_magnet: 'Cẩm Nang 10 Hoạt Động Kích Hoạt Lời Nói Đầu Đời Tại Nhà',
            scoring_guide: '0-2đ: Nguy cơ thấp | 3-7đ: Nguy cơ trung bình | 8-12đ: Nguy cơ cao'
        },
        {
            id: 'checklist_sensory',
            title: 'Đánh Giá Rối Loạn Xử Lý Cảm Giác & Nhạy Cảm Giác Quan',
            category: 'Giác Quan & Vận Động',
            slug: 'checklist-giac-quan',
            path: '/danh-gia-dinh-duong/?type=sensory',
            question_count: 10,
            target_age: '2 - 8 tuổi',
            status: 'active',
            description: 'Đo lường mức độ quá tải hoặc tìm kiếm cảm giác về xúc giác, thính giác, thị giác, tiền đình và vận động cơ sâu.',
            created_at: '03/10/2026',
            lead_magnet: 'Bộ Trò Chơi Điều Hòa Giác Quan 15 Phút Mỗi Ngày',
            scoring_guide: 'Dưới 10đ: Nhẹ | 10-20đ: Đáng lưu ý | Trên 20đ: Rối loạn giác quan nặng'
        },
        {
            id: 'checklist_readiness',
            title: 'Đo Lường Mức Độ Sẵn Sàng Can Thiệp Tại Nhà Cùng Mẹ',
            category: 'Tâm Lý Cha Mẹ',
            slug: 'checklist-san-sang',
            path: '/danh-gia-dinh-duong/?type=readiness',
            question_count: 8,
            target_age: 'Phụ huynh',
            status: 'draft',
            description: 'Đánh giá thời gian, tâm lý, sự đồng thuận gia đình và nguồn lực hỗ trợ để chọn lộ trình can thiệp khả thi nhất.',
            created_at: '04/10/2026',
            lead_magnet: 'Bản Đồ Lộ Trình Can Thiệp Cá Nhân Hóa Cho Gia Đình',
            scoring_guide: 'Đo lường chỉ số sẵn sàng và mức độ kiệt sức (burnout) của mẹ'
        }
    ];

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

    const DEMO_EVALUATIONS = [
        {
            id: 'eval_demo_101',
            checklist_id: 'checklist_nutrition',
            checklist_title: 'Sàng Lọc Dinh Dưỡng & Tiêu Hóa Trẻ Đặc Biệt',
            child_name: 'Bé Bơ',
            child_age: '3 tuổi',
            gender: 'Bé Trai',
            parent_name: 'Nguyễn Thị Phương Thảo',
            phone: '0912345678',
            phone_normalized: '0912345678',
            weight: '12.5 kg',
            height: '92 cm',
            risk_level: 'low',
            risk_title: 'Nguy cơ dinh dưỡng thấp / Cần điều chỉnh nhẹ',
            score: 3,
            crm_status: 'contacted',
            crm_priority: 'normal',
            crm_notes: 'Đã nhắn Zalo gửi cẩm nang GFCF, mẹ đang đọc và hẹn tuần sau phản hồi.',
            water: '500ml - 1000ml',
            allergies: ['Sữa bò thông thường'],
            other_difficulties: 'Hay ngậm thức ăn khi ngồi ăn cùng cả nhà quá 25 phút',
            daily_diet: 'Sáng: 1 bát cháo thịt bò băm.\nTrưa: Cơm nát, trứng hấp, canh bí đỏ.\nTối: Cơm thịt heo rang, nước cam vắt.',
            advice_summary: 'Bé có nguy cơ dinh dưỡng thấp. Cần duy trì chế độ ăn đa dạng màu sắc, tăng cường thêm chất béo lành mạnh (dầu oliu, quả bơ) và tập phản xạ nhai thức ăn thô có cấu trúc.',
            answers: {
                'q1_height_weight': 0, 'q2_eating_diff': 1, 'q3_digest': 0, 'q4_exercise': 0,
                'q5_sleep': 0, 'q6_screen': 0, 'q7_1': 1, 'q7_2': 0, 'q7_5': 1, 'supp_vitamin': 'co'
            },
            created_at: getRelativeDateStr(1, 10, 20),
            created_at_iso: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'eval_demo_102',
            checklist_id: 'checklist_sensory',
            checklist_title: 'Đánh Giá Rối Loạn Xử Lý Cảm Giác & Nhạy Cảm Giác Quan',
            child_name: 'Bé Sóc',
            child_age: '4 tuổi',
            gender: 'Bé Trai',
            parent_name: 'Hoàng Yến Nhi',
            phone: '0938665544',
            phone_normalized: '0938665544',
            weight: '13.8 kg',
            height: '98 cm',
            risk_level: 'medium',
            risk_title: 'Nguy cơ dinh dưỡng trung bình / Cần can thiệp',
            score: 8,
            crm_status: 'consulting',
            crm_priority: 'high',
            crm_notes: 'Bé kén ăn nặng do sợ mùi và nhớt xúc giác. Mẹ đã nhận cẩm nang, đang hướng dẫn massage miệng.',
            water: 'Dưới 500ml',
            allergies: ['Trứng gà', 'Hải sản'],
            other_difficulties: 'Từ chối tuyệt đối rau xanh, chỉ ăn đồ giòn khô, sợ thức ăn ướt hoặc có sốt',
            daily_diet: 'Sáng: Bánh mì nướng khô giòn.\nTrưa: Thịt heo chiên giòn rụm, cơm trắng khô.\nTối: Gà rán hoặc khoai tây chiên.',
            advice_summary: 'Bé có nguy cơ dinh dưỡng trung bình do chế độ ăn quá chọn lọc, thiếu hụt chất xơ, vitamin C, kẽm và khoáng chất vi lượng. Cần kế hoạch giải mẫn cảm vị giác từng bước.',
            answers: {
                'q1_height_weight': 1, 'q2_eating_diff': 1, 'q3_digest': 1, 'q4_exercise': 0,
                'q5_sleep': 1, 'q6_screen': 1, 'q7_2': 1, 'q7_3': 1, 'q7_8': 1, 'supp_omega': 'khong'
            },
            created_at: getRelativeDateStr(2, 14, 45),
            created_at_iso: new Date(Date.now() - 172800000).toISOString()
        },
        {
            id: 'eval_demo_103',
            checklist_id: 'checklist_autism_early',
            checklist_title: 'Sàng Lọc Dấu Hiệu Phổ Tự Kỷ & Giao Tiếp Sớm (M-CHAT-R)',
            child_name: 'Bé Bon',
            child_age: '2.5 tuổi',
            gender: 'Bé Gái',
            parent_name: 'Trần Quỳnh Trang',
            phone: '0918776611',
            phone_normalized: '0918776611',
            weight: '10.2 kg',
            height: '84 cm',
            risk_level: 'high',
            risk_title: 'Nguy cơ dinh dưỡng cao / Cần can thiệp chuyên sâu',
            score: 13,
            crm_status: 'new',
            crm_priority: 'urgent',
            crm_notes: 'Bé 2.5 tuổi trong giai đoạn vàng, táo bón 4-5 ngày + chậm nói. CẦN GỌI ĐIỆN TƯ VẤN NGAY HÔM NAY!',
            water: 'Dưới 500ml',
            allergies: ['Gluten (Lúa mì)', 'Sữa bò', 'Đậu nành'],
            other_difficulties: 'Táo bón kéo dài 4-5 ngày/lần, phân cứng chảy máu, hay bùng nổ ăn vạ lúc ăn, khó ngủ đêm',
            daily_diet: 'Sáng: Uống sữa công thức.\nTrưa: Cố ép được 3 thìa cơm nhão rồi nôn trớ.\nTối: Ăn xúc xích, bim bim, nước ngọt có gas.',
            advice_summary: 'Bé có nguy cơ dinh dưỡng cao với nhiều dấu hiệu rối loạn tiêu hóa và quá tải hệ thần kinh. Cần xây dựng phác đồ phục hồi niêm mạc ruột, kiểm tra vi chất và đồng hành chuyên sâu.',
            answers: {
                'q1_height_weight': 1, 'q2_eating_diff': 1, 'q3_digest': 2, 'q4_exercise': 1,
                'q5_sleep': 1, 'q6_screen': 1, 'q7_1': 1, 'q7_2': 1, 'q7_4': 1, 'q7_5': 1,
                'q7_6': 1, 'q7_8': 1, 'q7_14': 1
            },
            created_at: getRelativeDateStr(3, 19, 15),
            created_at_iso: new Date(Date.now() - 259200000).toISOString()
        }
    ];

    // Official production defaults: All metrics start at 0
    const INITIAL_BOOKINGS = [];
    const INITIAL_LEADS = [];
    const INITIAL_EVALUATIONS = [];
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
        if (!localStorage.getItem(STORAGE_KEY_CHECKLISTS)) {
            localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(DEFAULT_CHECKLISTS));
        } else {
            try {
                let chks = JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKLISTS));
                let chkChanged = false;
                DEFAULT_CHECKLISTS.forEach(def => {
                    if (!chks.some(c => c.id === def.id)) {
                        chks.unshift(def);
                        chkChanged = true;
                    }
                });
                if (chkChanged) {
                    localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(chks));
                }
            } catch (e) {}
        }
        if (!localStorage.getItem(STORAGE_KEY_SETTINGS)) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        } else {
            try {
                const s = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS));
                let changed = false;
                if (!s.pages || !Array.isArray(s.pages) || s.pages.length === 0) {
                    s.pages = DEFAULT_SETTINGS.pages;
                    s.pages_schema_v = 5;
                    s.pages_updated_at = Date.now();
                    changed = true;
                } else {
                    // Always ensure all default pages exist in s.pages
                    DEFAULT_SETTINGS.pages.forEach(defP => {
                        if (!s.pages.some(p => p.id === defP.id || p.slug === defP.slug)) {
                            s.pages.push(defP);
                            changed = true;
                        }
                    });
                    if (!s.pages_schema_v || s.pages_schema_v < 5) {
                        s.pages_schema_v = 5;
                        changed = true;
                    }
                }
                if (!s.pages_behavior) {
                    s.pages_behavior = DEFAULT_SETTINGS.pages_behavior;
                    changed = true;
                }
                if (!s.pages_maintenance_message) {
                    s.pages_maintenance_message = DEFAULT_SETTINGS.pages_maintenance_message;
                    changed = true;
                }
                if (s?.social?.youtube_url && s.social.youtube_url.includes('thuhien_cungmehieucon')) {
                    s.social.youtube_url = 'https://www.youtube.com/@thuhien.cungmehieucon';
                    changed = true;
                }
                if (s?.social?.tiktok_url && s.social.tiktok_url.includes('thuhien_cungmehieucon')) {
                    s.social.tiktok_url = 'https://www.tiktok.com/@thuhien.cungmehieucon';
                    changed = true;
                }
                if (!s.social) s.social = DEFAULT_SETTINGS.social;
                if (!s.social.zalo_link || s.social.zalo_link === 'https://zalo.me/0988776655' || s.social.zalo_link.includes('0988776655')) {
                    s.social.zalo_link = 'https://hieucontugoc.online/zalo';
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
        if (!localStorage.getItem(STORAGE_KEY_EVALUATIONS)) {
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify([]));
        }
        if (!localStorage.getItem(STORAGE_KEY_DELETED_EVALUATIONS)) {
            localStorage.setItem(STORAGE_KEY_DELETED_EVALUATIONS, JSON.stringify([]));
        }
        try {
            localStorage.removeItem('thuhien_evaluations'); // Clean obsolete legacy key
        } catch (e) {}
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

            // Trigger Email Notification if enabled
            try {
                const emailCfg = this.getSettings().email;
                if (emailCfg && emailCfg.notify_on_booking !== false) {
                    this.sendNotificationEmail('booking', newBooking).catch(() => {});
                }
            } catch (e) {}

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

            // Trigger Email Notification if enabled
            try {
                const emailCfg = this.getSettings().email;
                if (emailCfg && emailCfg.notify_on_lead !== false) {
                    this.sendNotificationEmail('lead', newLead).catch(() => {});
                }
            } catch (e) {}

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

        // ====================================================================
        // NUTRITION EVALUATIONS (CHECKLIST SÀNG LỌC DINH DƯỠNG)
        // ====================================================================
        getDeletedEvaluationIds() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_EVALUATIONS)) || [];
            } catch (e) {
                return [];
            }
        },

        addDeletedEvaluationId(id) {
            if (!id) return;
            const sId = String(id);
            const deleted = this.getDeletedEvaluationIds();
            if (!deleted.includes(sId)) {
                deleted.push(sId);
                localStorage.setItem(STORAGE_KEY_DELETED_EVALUATIONS, JSON.stringify(deleted));
            }
        },

        getEvaluations() {
            try {
                const deletedSet = new Set(this.getDeletedEvaluationIds().map(String));
                const list = JSON.parse(localStorage.getItem(STORAGE_KEY_EVALUATIONS)) || [];
                return list.filter(item => !item.is_deleted && !deletedSet.has(String(item.id))).map(item => ({
                    ...item,
                    checklist_id: item.checklist_id || 'checklist_nutrition',
                    checklist_title: item.checklist_title || 'Sàng Lọc Dinh Dưỡng & Tiêu Hóa Trẻ Đặc Biệt',
                    crm_status: item.crm_status || 'new',
                    crm_priority: item.crm_priority || (item.risk_level === 'high' ? 'urgent' : (item.risk_level === 'medium' ? 'high' : 'normal')),
                    crm_notes: item.crm_notes || '',
                    crm_history: item.crm_history || []
                }));
            } catch (e) {
                return [];
            }
        },

        addEvaluation(data) {
            let list = this.getEvaluations();
            const now = new Date();
            const cleanPhone = (data.phone || '').toString().replace(/\D/g, '');
            const id = data.id || ('eval_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
            const sId = String(id);

            // If previously marked deleted, unmark
            let deleted = this.getDeletedEvaluationIds();
            if (deleted.includes(sId)) {
                deleted = deleted.filter(d => d !== sId);
                localStorage.setItem(STORAGE_KEY_DELETED_EVALUATIONS, JSON.stringify(deleted));
            }

            const newRecord = {
                id: sId,
                checklist_id: data.checklist_id || 'checklist_nutrition',
                checklist_title: data.checklist_title || 'Sàng Lọc Dinh Dưỡng & Tiêu Hóa Trẻ Đặc Biệt',
                child_name: data.child_name || '',
                child_age: data.child_age || '',
                gender: data.gender || data.child_gender || 'Bé',
                parent_name: data.parent_name || '',
                phone: data.phone || '',
                phone_normalized: cleanPhone,
                weight: data.weight || '',
                height: data.height || '',
                risk_level: data.risk_level || 'low', // 'low' | 'medium' | 'high'
                risk_title: data.risk_title || 'Nguy cơ dinh dưỡng thấp',
                score: Number(data.score || 0),
                crm_status: data.crm_status || 'new', // 'new' | 'contacted' | 'consulting' | 'booked' | 'converted' | 'lost'
                crm_priority: data.crm_priority || (data.risk_level === 'high' ? 'urgent' : (data.risk_level === 'medium' ? 'high' : 'normal')), // 'urgent' | 'high' | 'normal'
                crm_notes: data.crm_notes || '',
                crm_history: data.crm_history || [{ time: now.toLocaleString('vi-VN'), action: 'Khách hàng hoàn thành checklist' }],
                answers: data.answers || {},
                water: data.water || data.water_intake || '',
                allergies: data.allergies || [],
                daily_diet: data.daily_diet || data.diet_description || '',
                other_difficulties: data.other_difficulties || '',
                advice_summary: data.advice_summary || data.feedback || '',
                source: data.source || 'Website Checklist',
                utm_source: data.utm_source || '',
                created_at: data.created_at || now.toLocaleString('vi-VN'),
                created_at_iso: data.created_at_iso || now.toISOString()
            };

            // Remove duplicate if same ID
            list = list.filter(item => String(item.id) !== sId);
            list.unshift(newRecord);
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(list));

            // Sync to Firebase Cloud Firestore
            if (this._firestoreDb) {
                this._firestoreDb.collection('evaluations').doc(sId).set(newRecord, { merge: true }).catch(err => {
                    console.warn('🔥 Firestore evaluation save failed:', err);
                });
            } else if (typeof this.initFirebase === 'function') {
                this.initFirebase().then(db => {
                    if (db) {
                        db.collection('evaluations').doc(sId).set(newRecord, { merge: true }).catch(() => {});
                    }
                });
            }

            // Realtime sync broadcast
            this.broadcastChange('evaluations_changed', newRecord);

            // Trigger Email Notification if enabled
            try {
                const emailCfg = this.getSettings().email;
                if (emailCfg && emailCfg.notify_on_evaluation !== false) {
                    this.sendNotificationEmail('evaluation', newRecord).catch(() => {});
                }
            } catch (e) {}

            return newRecord;
        },

        updateEvaluationCRMStatus(id, newStatus) {
            const sId = String(id);
            let list = this.getEvaluations();
            const item = list.find(e => String(e.id) === sId);
            if (!item) return false;
            item.crm_status = newStatus;
            item.updated_at = new Date().toLocaleString('vi-VN');
            if (!item.crm_history) item.crm_history = [];
            item.crm_history.push({
                time: item.updated_at,
                action: `Cập nhật trạng thái CRM: ${newStatus}`
            });
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(list));

            if (this._firestoreDb) {
                this._firestoreDb.collection('evaluations').doc(sId).set({
                    crm_status: newStatus,
                    updated_at: item.updated_at,
                    crm_history: item.crm_history
                }, { merge: true }).catch(() => {});
            }
            this.broadcastChange('evaluations_changed', { id: sId, crm_status: newStatus });
            return true;
        },

        updateEvaluationPriority(id, newPriority) {
            const sId = String(id);
            let list = this.getEvaluations();
            const item = list.find(e => String(e.id) === sId);
            if (!item) return false;
            item.crm_priority = newPriority;
            item.updated_at = new Date().toLocaleString('vi-VN');
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(list));

            if (this._firestoreDb) {
                this._firestoreDb.collection('evaluations').doc(sId).set({
                    crm_priority: newPriority,
                    updated_at: item.updated_at
                }, { merge: true }).catch(() => {});
            }
            this.broadcastChange('evaluations_changed', { id: sId, crm_priority: newPriority });
            return true;
        },

        updateEvaluationCRMNotes(id, noteText) {
            const sId = String(id);
            let list = this.getEvaluations();
            const item = list.find(e => String(e.id) === sId);
            if (!item) return false;
            item.crm_notes = noteText;
            item.updated_at = new Date().toLocaleString('vi-VN');
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(list));

            if (this._firestoreDb) {
                this._firestoreDb.collection('evaluations').doc(sId).set({
                    crm_notes: noteText,
                    updated_at: item.updated_at
                }, { merge: true }).catch(() => {});
            }
            this.broadcastChange('evaluations_changed', { id: sId, crm_notes: noteText });
            return true;
        },

        // CHECKLIST MANAGEMENT METHODS
        getChecklists() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY_CHECKLISTS);
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch (e) {}
            return DEFAULT_CHECKLISTS;
        },

        saveChecklist(item) {
            let list = this.getChecklists();
            const nowStr = new Date().toLocaleDateString('vi-VN');
            if (item.id) {
                const idx = list.findIndex(c => c.id === item.id);
                if (idx !== -1) {
                    list[idx] = { ...list[idx], ...item, updated_at: nowStr };
                } else {
                    list.unshift({ ...item, created_at: item.created_at || nowStr });
                }
            } else {
                const newId = 'chk_' + Date.now();
                list.unshift({
                    id: newId,
                    status: 'active',
                    created_at: nowStr,
                    ...item
                });
            }
            localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(list));
            this.broadcastChange('checklists_changed', list);
            return true;
        },

        deleteChecklist(id) {
            let list = this.getChecklists();
            list = list.filter(c => c.id !== id);
            localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(list));
            this.broadcastChange('checklists_changed', list);
            return true;
        },

        toggleChecklistStatus(id) {
            let list = this.getChecklists();
            const chk = list.find(c => c.id === id);
            if (chk) {
                chk.status = chk.status === 'active' ? 'draft' : 'active';
                localStorage.setItem(STORAGE_KEY_CHECKLISTS, JSON.stringify(list));
                this.broadcastChange('checklists_changed', list);
                return chk.status;
            }
            return null;
        },

        getChecklistAnalytics() {
            const evals = this.getEvaluations();
            const checklists = this.getChecklists();

            const total = evals.length;
            const statusCounts = {
                new: 0,
                contacted: 0,
                consulting: 0,
                booked: 0,
                converted: 0,
                lost: 0
            };
            const priorityCounts = {
                urgent: 0,
                high: 0,
                normal: 0
            };
            const riskCounts = {
                high: 0,
                medium: 0,
                low: 0
            };
            const ageSegments = {
                under2: 0,
                age2to3: 0,
                age3to5: 0,
                above5: 0,
                other: 0
            };
            const checklistBreakdown = {};

            checklists.forEach(c => {
                checklistBreakdown[c.id] = {
                    id: c.id,
                    title: c.title,
                    category: c.category,
                    submissions: 0,
                    contacted: 0,
                    converted: 0,
                    high_risk: 0
                };
            });

            evals.forEach(e => {
                const st = e.crm_status || 'new';
                if (statusCounts[st] !== undefined) statusCounts[st]++;
                else statusCounts.new++;

                const pr = e.crm_priority || (e.risk_level === 'high' ? 'urgent' : 'normal');
                if (priorityCounts[pr] !== undefined) priorityCounts[pr]++;

                const rk = e.risk_level || 'low';
                if (riskCounts[rk] !== undefined) riskCounts[rk]++;

                const ageText = (e.child_age || '').toString().toLowerCase();
                const num = parseFloat(ageText.replace(',', '.'));
                if (ageText.includes('tháng') || (num > 0 && num < 2)) {
                    ageSegments.under2++;
                } else if (num >= 2 && num <= 3) {
                    ageSegments.age2to3++;
                } else if (num > 3 && num <= 5) {
                    ageSegments.age3to5++;
                } else if (num > 5) {
                    ageSegments.above5++;
                } else {
                    ageSegments.other++;
                }

                const chkId = e.checklist_id || 'checklist_nutrition';
                if (!checklistBreakdown[chkId]) {
                    checklistBreakdown[chkId] = {
                        id: chkId,
                        title: e.checklist_title || chkId,
                        category: 'Khác',
                        submissions: 0,
                        contacted: 0,
                        converted: 0,
                        high_risk: 0
                    };
                }
                checklistBreakdown[chkId].submissions++;
                if (['contacted', 'consulting', 'booked', 'converted'].includes(st)) {
                    checklistBreakdown[chkId].contacted++;
                }
                if (st === 'converted' || st === 'booked') {
                    checklistBreakdown[chkId].converted++;
                }
                if (rk === 'high') {
                    checklistBreakdown[chkId].high_risk++;
                }
            });

            const totalLeads = total;
            const contactedOrAbove = totalLeads - statusCounts.new;
            const consultingOrAbove = statusCounts.consulting + statusCounts.booked + statusCounts.converted;
            const bookedOrAbove = statusCounts.booked + statusCounts.converted;
            const converted = statusCounts.converted;

            return {
                total,
                statusCounts,
                priorityCounts,
                riskCounts,
                ageSegments,
                checklistBreakdown: Object.values(checklistBreakdown),
                funnel: {
                    totalLeads,
                    contactedRate: totalLeads > 0 ? ((contactedOrAbove / totalLeads) * 100).toFixed(1) : '0.0',
                    consultingRate: totalLeads > 0 ? ((consultingOrAbove / totalLeads) * 100).toFixed(1) : '0.0',
                    bookedRate: totalLeads > 0 ? ((bookedOrAbove / totalLeads) * 100).toFixed(1) : '0.0',
                    conversionRate: totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : '0.0'
                }
            };
        },

        deleteEvaluation(id) {
            const sId = String(id);
            this.addDeletedEvaluationId(sId);
            let list = this.getEvaluations();
            list = list.filter(e => String(e.id) !== sId);
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(list));

            // Firestore sync: soft-delete AND hard-delete
            const syncDeleteToCloud = async () => {
                try {
                    const db = this._firestoreDb || (await this.initFirebase());
                    if (db) {
                        const docRef = db.collection('evaluations').doc(sId);
                        await docRef.set({ is_deleted: true, deleted_at: new Date().toISOString() }, { merge: true }).catch(() => {});
                        await docRef.delete().catch(() => {});
                    }
                } catch (err) {
                    console.warn('🔥 Firestore evaluation delete notice:', err);
                }
            };
            syncDeleteToCloud();

            this.broadcastChange('evaluations_changed', { id: sId });
            return true;
        },

        clearAllEvaluations() {
            let list = this.getEvaluations();
            list.forEach(item => {
                this.addDeletedEvaluationId(item.id);
            });
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify([]));

            const syncClearAllToCloud = async () => {
                try {
                    const db = this._firestoreDb || (await this.initFirebase());
                    if (db && list.length) {
                        const batch = db.batch();
                        list.forEach(item => {
                            const ref = db.collection('evaluations').doc(String(item.id));
                            batch.set(ref, { is_deleted: true, deleted_at: new Date().toISOString() }, { merge: true });
                            batch.delete(ref);
                        });
                        await batch.commit().catch(() => {});
                    }
                } catch (err) {
                    console.warn('🔥 Firestore clear all evaluations notice:', err);
                }
            };
            syncClearAllToCloud();

            this.broadcastChange('evaluations_changed', { clear_all: true });
            return true;
        },

        getEvaluationsByPhone(phone) {
            if (!phone) return [];
            const clean = phone.toString().replace(/\D/g, '');
            if (!clean) return [];
            const list = this.getEvaluations();
            return list.filter(item => {
                const itemClean = (item.phone_normalized || item.phone || '').replace(/\D/g, '');
                return itemClean.includes(clean) || clean.includes(itemClean);
            });
        },

        async fetchEvaluationsByPhoneRemote(phone) {
            const clean = (phone || '').toString().replace(/\D/g, '');
            if (!clean) return [];
            try {
                const db = await this.initFirebase();
                if (db) {
                    const snap = await db.collection('evaluations').where('phone_normalized', '==', clean).get();
                    if (!snap.empty) {
                        const remoteResults = [];
                        const deletedSet = new Set(this.getDeletedEvaluationIds().map(String));
                        snap.forEach(doc => {
                            const data = doc.data() || {};
                            if (data.is_deleted) {
                                this.addDeletedEvaluationId(doc.id);
                            } else if (!deletedSet.has(String(doc.id))) {
                                remoteResults.push({ id: doc.id, ...data });
                            }
                        });
                        this.mergeRemoteEvaluations(remoteResults);
                    }
                }
            } catch (e) {
                console.warn('Remote phone lookup notice:', e);
            }
            return this.getEvaluationsByPhone(phone);
        },

        async fetchAllEvaluationsRemote() {
            try {
                const db = await this.initFirebase();
                if (db) {
                    const snap = await db.collection('evaluations').get();
                    if (!snap.empty) {
                        const remoteResults = [];
                        const deletedSet = new Set(this.getDeletedEvaluationIds().map(String));
                        snap.forEach(doc => {
                            const data = doc.data() || {};
                            if (data.is_deleted) {
                                this.addDeletedEvaluationId(doc.id);
                            } else if (!deletedSet.has(String(doc.id))) {
                                remoteResults.push({ id: doc.id, ...data });
                            }
                        });
                        this.mergeRemoteEvaluations(remoteResults);
                        if (typeof window !== 'undefined') {
                            if (typeof window.renderEvaluations === 'function') window.renderEvaluations();
                            if (typeof window.renderAll === 'function') window.renderAll();
                        }
                        return remoteResults;
                    }
                }
            } catch (e) {
                console.warn('fetchAllEvaluationsRemote notice:', e);
            }
            return this.getEvaluations();
        },

        mergeRemoteEvaluations(remoteList) {
            if (!Array.isArray(remoteList) || !remoteList.length) return;
            const deletedSet = new Set(this.getDeletedEvaluationIds().map(String));
            let localList = this.getEvaluations();
            const map = new Map();
            localList.forEach(item => {
                const sId = String(item.id);
                if (!deletedSet.has(sId) && !item.is_deleted) {
                    map.set(sId, item);
                }
            });
            remoteList.forEach(item => {
                const sId = String(item.id);
                if (item.is_deleted) {
                    this.addDeletedEvaluationId(sId);
                    return;
                }
                if (!deletedSet.has(sId)) {
                    map.set(sId, { ...(map.get(sId) || {}), ...item });
                }
            });
            const merged = Array.from(map.values()).sort((a, b) => {
                const tA = new Date(a.created_at_iso || a.created_at || 0).getTime() || 0;
                const tB = new Date(b.created_at_iso || b.created_at || 0).getTime() || 0;
                return tB - tA;
            });
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(merged));
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
            } else if (type === 'evaluations') {
                const evals = this.getEvaluations();
                csvContent += '"Mã Phiếu","Thời gian","Tên Checklist","Phụ huynh","Số điện thoại","SĐT Chuẩn hóa","Tên bé","Tuổi bé","Giới tính","Cân nặng (kg)","Chiều cao (cm)","Mức độ nguy cơ","Điểm số","Trạng thái CRM","Mức độ ưu tiên","Ghi chú CSKH","Lượng nước","Dị ứng","Chế độ ăn 1 ngày","Khó khăn khác","Nguồn Lead"\n';
                evals.forEach(e => {
                    const allergiesStr = Array.isArray(e.allergies) ? e.allergies.join('; ') : (e.allergies || '');
                    csvContent += `"${e.id}","${e.created_at}","${(e.checklist_title || '').replace(/"/g, '""')}","${(e.parent_name || '').replace(/"/g, '""')}","${e.phone || ''}","${e.phone_normalized || ''}","${(e.child_name || '').replace(/"/g, '""')}","${e.child_age || ''}","${e.gender || ''}","${e.weight || ''}","${e.height || ''}","${(e.risk_title || e.risk_level || '').replace(/"/g, '""')}","${e.score || 0}","${e.crm_status || 'new'}","${e.crm_priority || 'normal'}","${(e.crm_notes || '').replace(/"/g, '""')}","${e.water || ''}","${allergiesStr.replace(/"/g, '""')}","${(e.daily_diet || '').replace(/"/g, '""')}","${(e.other_difficulties || '').replace(/"/g, '""')}","${e.source || 'Website'}"\n`;
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
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify([]));
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
            localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(DEMO_EVALUATIONS));
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
                    security: { ...DEFAULT_SETTINGS.security, ...(s?.security || {}) },
                    pages: s?.pages || DEFAULT_SETTINGS.pages,
                    pages_schema_v: s?.pages_schema_v || 4,
                    pages_updated_at: s?.pages_updated_at || 0,
                    pages_behavior: s?.pages_behavior || DEFAULT_SETTINGS.pages_behavior,
                    pages_maintenance_message: s?.pages_maintenance_message !== undefined ? s.pages_maintenance_message : DEFAULT_SETTINGS.pages_maintenance_message
                };
            } catch (e) {
                return DEFAULT_SETTINGS;
            }
        },

        // ====================================================================
        // REALTIME SYNCHRONIZATION ENGINE (Cross-tab & Multi-window)
        // ====================================================================
        _syncListeners: [],
        _bc: null,
        _realtimeInitialized: false,

        onSync(cb) {
            if (typeof cb === 'function') {
                this._syncListeners.push(cb);
            }
        },

        broadcastChange(type, data) {
            const payload = { type, data, timestamp: Date.now() };

            // 1. Notify internal subscribers in current window
            this._syncListeners.forEach(cb => {
                try { cb(payload); } catch (e) {}
            });

            // 2. Dispatch custom event on current window
            if (typeof window !== 'undefined') {
                try {
                    window.dispatchEvent(new CustomEvent('thuhien_db_sync', { detail: payload }));
                } catch (e) {}
            }

            // 3. Broadcast to other tabs/windows via BroadcastChannel
            try {
                if (typeof BroadcastChannel !== 'undefined') {
                    if (!this._bc) {
                        this._bc = new BroadcastChannel('thuhien_realtime_bus');
                    }
                    this._bc.postMessage(payload);
                }
            } catch (e) {}

            // 4. Trigger localStorage storage event for cross-tab fallback
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('thuhien_realtime_ping', JSON.stringify({
                        type,
                        ts: Date.now()
                    }));
                }
            } catch (e) {}
        },

        initRealtimeListener() {
            if (typeof window === 'undefined') return;
            if (this._realtimeInitialized) return;
            this._realtimeInitialized = true;

            const handleIncoming = (payload) => {
                if (!payload || !payload.type) return;
                this._syncListeners.forEach(cb => {
                    try { cb(payload); } catch (e) {}
                });
                try {
                    window.dispatchEvent(new CustomEvent('thuhien_db_sync', { detail: payload }));
                } catch (e) {}

                // If on public page, immediately update UI when settings or page status changes
                if (!window.location.pathname.includes('/admin')) {
                    if (payload.type === 'page_status' || payload.type === 'settings_changed' || payload.type === 'settings') {
                        if (typeof this.applyPageStatusControl === 'function') {
                            this.applyPageStatusControl();
                        }
                    }
                }
            };

            // BroadcastChannel listener
            try {
                if (typeof BroadcastChannel !== 'undefined') {
                    if (!this._bc) {
                        this._bc = new BroadcastChannel('thuhien_realtime_bus');
                    }
                    this._bc.onmessage = (event) => {
                        handleIncoming(event.data);
                    };
                }
            } catch (e) {}

            // Storage event listener
            window.addEventListener('storage', (e) => {
                if (e.key === 'thuhien_realtime_ping') {
                    try {
                        const ping = JSON.parse(e.newValue);
                        handleIncoming(ping);
                    } catch (err) {}
                } else if (e.key === STORAGE_KEY_SETTINGS) {
                    handleIncoming({ type: 'settings_changed', data: this.getSettings() });
                } else if (e.key === STORAGE_KEY_BOOKINGS) {
                    handleIncoming({ type: 'bookings_changed' });
                } else if (e.key === STORAGE_KEY_LEADS) {
                    handleIncoming({ type: 'leads_changed' });
                }
            });
        },

        showToast(message, type = 'success') {
            if (typeof document === 'undefined') return;
            const existing = document.getElementById('thuhien-live-toast');
            if (existing) existing.remove();

            const isSuccess = type === 'success';
            const isWarn = type === 'warning' || type === 'amber';
            const bg = isSuccess ? '#064e3b' : (isWarn ? '#78350f' : '#18181b');
            const border = isSuccess ? '#047857' : (isWarn ? '#b45309' : '#3f3f46');
            const color = isSuccess ? '#6ee7b7' : (isWarn ? '#fcd34d' : '#f4f4f5');

            const toast = document.createElement('div');
            toast.id = 'thuhien-live-toast';
            toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999999;background:${bg};border:1px solid ${border};color:#ffffff;padding:8px 18px;border-radius:9999px;font-size:12px;font-family:Alata,sans-serif;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;transition:all 0.25s ease;`;

            const iconSvg = isSuccess 
                ? `<svg style="width:14px;height:14px;color:${color};flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
                : `<svg style="width:14px;height:14px;color:${color};flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;

            toast.innerHTML = `
                ${iconSvg}
                <span>${message}</span>
            `;
            document.body.appendChild(toast);

            setTimeout(() => {
                if (toast && toast.parentElement) {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translate(-50%, 10px)';
                    setTimeout(() => toast.remove(), 250);
                }
            }, 3000);
        },

        saveSettings(newSettings) {
            try {
                const current = this.getSettings();
                const merged = {
                    ...current,
                    ...newSettings,
                    email: { ...current.email, ...(newSettings.email || {}) },
                    resources: newSettings.resources || current.resources,
                    social: { ...current.social, ...(newSettings.social || {}) },
                    integrations: { ...current.integrations, ...(newSettings.integrations || {}) },
                    security: { ...current.security, ...(newSettings.security || {}) },
                    pages: newSettings.pages || current.pages,
                    pages_schema_v: 4,
                    pages_updated_at: newSettings.pages_updated_at || current.pages_updated_at || Date.now(),
                    pages_behavior: newSettings.pages_behavior || current.pages_behavior,
                    pages_maintenance_message: newSettings.pages_maintenance_message !== undefined ? newSettings.pages_maintenance_message : current.pages_maintenance_message
                };
                localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(merged));
                this.logSecurityEvent('SETTINGS_UPDATED', 'SUCCESS', 'Cập nhật cấu hình hệ thống');
                this.broadcastChange('settings_changed', merged);
                return true;
            } catch (e) {
                return false;
            }
        },

        resetSettings() {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
            this.broadcastChange('settings_changed', DEFAULT_SETTINGS);
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
        // PAGE MANAGEMENT & PUBLICS CONTROL ENGINE
        // ====================================================================
        getPages() {
            const settings = this.getSettings();
            return settings.pages || DEFAULT_SETTINGS.pages;
        },

        togglePage(id, enabled) {
            const settings = this.getSettings();
            const list = settings.pages || DEFAULT_SETTINGS.pages;
            const target = list.find(p => p.id === id);
            if (!target) return { success: false, message: 'Không tìm thấy trang yêu cầu' };
            if (target.can_disable === false && !enabled) {
                return { success: false, message: 'Trang Chủ là trang bắt buộc của hệ thống, không thể tắt!' };
            }
            target.enabled = Boolean(enabled);
            settings.pages = list;
            settings.pages_schema_v = 4;
            settings.pages_updated_at = Date.now();
            this.saveSettings(settings);
            this.logSecurityEvent('PAGE_STATUS_CHANGED', 'SUCCESS', `Trang "${target.title}" đã chuyển sang trạng thái: ${target.enabled ? 'CÔNG KHAI (Publics)' : 'TẠM ẨN (Chưa Publics)'}`);
            this.broadcastChange('page_status', { id, enabled: target.enabled, page: target, pages: list });
            if (typeof this.pushFirebasePages === 'function') {
                this.pushFirebasePages(list);
            }
            if (typeof this.pushGlobalConfig === 'function') {
                this.pushGlobalConfig(list);
            }
            return { success: true, page: target };
        },

        updatePage(id, updatedFields) {
            const settings = this.getSettings();
            const list = settings.pages || DEFAULT_SETTINGS.pages;
            const idx = list.findIndex(p => p.id === id);
            if (idx === -1) return false;
            list[idx] = { ...list[idx], ...updatedFields };
            settings.pages = list;
            this.saveSettings(settings);
            this.logSecurityEvent('PAGE_UPDATED', 'SUCCESS', `Cập nhật thông tin trang "${list[idx].title}"`);
            if (typeof this.pushFirebasePages === 'function') {
                this.pushFirebasePages(list);
            }
            if (typeof this.pushGlobalConfig === 'function') {
                this.pushGlobalConfig(list);
            }
            return true;
        },

        // ====================================================================
        // GOOGLE FIREBASE REALTIME FIRESTORE ENGINE
        // ====================================================================
        _firestoreDb: null,
        _firebaseInitPromise: null,

        async initFirebase() {
            if (this._firebaseInitPromise) return this._firebaseInitPromise;
            this._firebaseInitPromise = new Promise(async (resolve) => {
                try {
                    if (typeof window === 'undefined') return resolve(null);

                    const loadScript = (src) => new Promise((res, rej) => {
                        if (document.querySelector(`script[src="${src}"]`)) return res();
                        const s = document.createElement('script');
                        s.src = src;
                        s.onload = res;
                        s.onerror = rej;
                        document.head.appendChild(s);
                    });

                    if (typeof firebase === 'undefined') {
                        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
                        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
                    }

                    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
                        firebase.initializeApp(FIREBASE_CONFIG);
                    }

                    if (typeof firebase !== 'undefined' && firebase.firestore) {
                        this._firestoreDb = firebase.firestore();
                        console.log('🔥 Firebase Cloud Firestore connected!');

                        // Realtime live listener for pages status
                        this._firestoreDb.collection('site_config').doc('pages').onSnapshot((doc) => {
                            if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) return;
                            if (doc && doc.exists) {
                                if (doc.metadata && doc.metadata.hasPendingWrites) return;
                                const data = doc.data();
                                if (data && Array.isArray(data.items)) {
                                    let remoteTs = 0;
                                    if (data.updated_at && typeof data.updated_at.toMillis === 'function') {
                                        remoteTs = data.updated_at.toMillis();
                                    } else if (data.client_timestamp) {
                                        remoteTs = data.client_timestamp;
                                    }
                                    if (remoteTs > 0) {
                                        this.syncRemotePages(data.items, remoteTs);
                                    }
                                }
                            }
                        }, (err) => {
                            console.warn('🔥 Firestore snapshot notice (rules may require allow read/write):', err.message);
                        });

                        // Realtime live listener for email configuration
                        this._firestoreDb.collection('site_config').doc('email').onSnapshot((doc) => {
                            if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) return;
                            if (doc && doc.exists) {
                                const data = doc.data();
                                if (data && (data.smtp_user || data.admin_notify_email)) {
                                    const current = this.getSettings();
                                    current.email = { ...current.email, ...data };
                                    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(current));
                                }
                            }
                        }, (err) => {
                            console.warn('🔥 Firestore email config listener notice:', err.message);
                        });

                        // Realtime live listener for evaluations
                        try {
                            this._firestoreDb.collection('evaluations').limit(200).onSnapshot((snapshot) => {
                                if (snapshot && !snapshot.empty) {
                                    const remoteList = [];
                                    const deletedSet = new Set(this.getDeletedEvaluationIds().map(String));
                                    snapshot.forEach(doc => {
                                        const data = doc.data() || {};
                                        if (data.is_deleted) {
                                            this.addDeletedEvaluationId(doc.id);
                                        } else if (!deletedSet.has(String(doc.id))) {
                                            remoteList.push({ id: doc.id, ...data });
                                        }
                                    });
                                    this.mergeRemoteEvaluations(remoteList);
                                    if (typeof window !== 'undefined') {
                                        if (typeof window.renderEvaluations === 'function') {
                                            window.renderEvaluations();
                                        }
                                        if (typeof window.renderAll === 'function') {
                                            window.renderAll();
                                        }
                                    }
                                }
                            }, (err) => {
                                console.warn('🔥 Firestore evaluations listener notice:', err.message);
                            });
                        } catch (e) {}
                    }
                    resolve(this._firestoreDb);
                } catch (e) {
                    console.warn('🔥 Firebase init failed/offline:', e);
                    resolve(null);
                }
            });
            return this._firebaseInitPromise;
        },

        async pushFirebasePages(pagesList) {
            try {
                const db = await this.initFirebase();
                if (db && typeof firebase !== 'undefined') {
                    await db.collection('site_config').doc('pages').set({
                        items: pagesList,
                        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                        client_timestamp: Date.now()
                    }, { merge: true });
                    console.log('🔥 Pushed pages to Firebase Firestore successfully!');
                    this.showToast('Đã đồng bộ lên Firebase Realtime toàn cầu!', 'success');
                }
            } catch (e) {
                console.warn('🔥 Error pushing to Firebase:', e);
            }
        },

        async pushFirebaseEmailConfig(emailConfig) {
            try {
                const db = await this.initFirebase();
                if (db && typeof firebase !== 'undefined') {
                    await db.collection('site_config').doc('email').set({
                        ...emailConfig,
                        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
                        client_timestamp: Date.now()
                    }, { merge: true });
                    console.log('🔥 Pushed email config to Firebase Firestore successfully!');
                }
            } catch (e) {
                console.warn('🔥 Error pushing email config to Firebase:', e);
            }
        },

        async fetchFirebaseEmailConfig() {
            try {
                const db = await this.initFirebase();
                if (db) {
                    const doc = await db.collection('site_config').doc('email').get();
                    if (doc && doc.exists) {
                        return doc.data();
                    }
                }
            } catch (e) {
                console.warn('🔥 Error fetching email config from Firebase:', e);
            }
            return null;
        },

        syncRemotePages(remotePages, remoteTimestamp = 0) {
            if (!Array.isArray(remotePages) || !remotePages.length) return;

            // Never overwrite local settings when inside Admin panel
            if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
                return;
            }

            const current = this.getSettings();
            const localTs = current.pages_updated_at || 0;

            // Strict safety guard: ONLY accept remote pages if remoteTimestamp is valid positive number and strictly newer than localTs
            if (!remoteTimestamp || remoteTimestamp <= localTs) {
                return;
            }

            const pageMap = {};
            remotePages.forEach(p => { pageMap[p.id] = p.enabled; });

            let hasChange = false;
            const updated = (current.pages || DEFAULT_SETTINGS.pages).map(p => {
                if (pageMap[p.id] !== undefined && p.enabled !== pageMap[p.id]) {
                    hasChange = true;
                    return { ...p, enabled: pageMap[p.id] };
                }
                return p;
            });

            if (hasChange) {
                current.pages = updated;
                current.pages_schema_v = 4;
                current.pages_updated_at = remoteTimestamp;
                this.saveSettings(current);
                if (typeof this.applyPageStatusControl === 'function') {
                    this.applyPageStatusControl();
                }
                if (typeof LayoutEngine !== 'undefined') {
                    try {
                        LayoutEngine.renderGlobalHeader();
                        LayoutEngine.renderGlobalFooter();
                    } catch (e) {}
                }
            }
        },

        async syncRemoteGlobalConfig() {
            // Never sync remote global config inside Admin panel
            if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
                return null;
            }
            try {
                const res = await fetch('/api/config');
                if (!res.ok) return null;
                const data = await res.json();
                if (data && data.success && Array.isArray(data.pages)) {
                    // CRITICAL: NEVER overwrite local settings if remote response is fallback or default state
                    if (data.source === 'default' || data.source === 'fallback' || data.is_default) {
                        return data;
                    }
                    if (data.updated_at) {
                        this.syncRemotePages(data.pages, data.updated_at);
                    }
                    return data;
                }
            } catch (e) {
                // Ignore when running locally without Vercel Serverless
            }
            return null;
        },

        async pushGlobalConfig(pages) {
            try {
                const settings = this.getSettings();
                const vercelToken = (settings.integrations && settings.integrations.vercel_api_token) || '';
                const res = await fetch('/api/config', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-vercel-token': vercelToken
                    },
                    body: JSON.stringify({ 
                        pages,
                        updated_at: Date.now()
                    })
                });
                const data = await res.json();
                if (data && data.success) {
                    this.showToast('Đã đồng bộ lên Vercel Global Config toàn cầu!', 'success');
                }
                return data;
            } catch (e) {
                return null;
            }
        },

        addCustomPage(pageData) {
            const settings = this.getSettings();
            const list = settings.pages || DEFAULT_SETTINGS.pages;
            const newId = 'page_' + Date.now();
            const cleanSlug = (pageData.slug || pageData.title || newId).toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            const newPage = {
                id: newId,
                title: pageData.title || 'Trang Mới',
                path: pageData.path || `/${cleanSlug}/`,
                slug: cleanSlug,
                enabled: pageData.enabled !== undefined ? Boolean(pageData.enabled) : true,
                can_disable: true,
                is_custom: true,
                category: pageData.category || 'Trang Tùy Chỉnh',
                description: pageData.description || 'Trang mới được tạo từ trang quản trị'
            };
            list.push(newPage);
            settings.pages = list;
            this.saveSettings(settings);
            this.logSecurityEvent('PAGE_CREATED', 'SUCCESS', `Tạo trang mới "${newPage.title}" (${newPage.path})`);
            return newPage;
        },

        deletePage(id) {
            const settings = this.getSettings();
            const list = settings.pages || DEFAULT_SETTINGS.pages;
            const target = list.find(p => p.id === id);
            if (!target) return false;
            if (!target.is_custom && target.can_disable === false) {
                return false;
            }
            settings.pages = list.filter(p => p.id !== id);
            this.saveSettings(settings);
            this.logSecurityEvent('PAGE_DELETED', 'SUCCESS', `Xóa trang "${target.title}"`);
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

        getSendEmailApiUrl() {
            if (typeof window !== 'undefined') {
                const host = window.location.hostname;
                if (host === 'localhost' || host === '127.0.0.1' || host.includes('.local') || host.includes('servbay')) {
                    return 'https://www.thuhien.online/api/send-email';
                }
            }
            return '/api/send-email';
        },

        clearEmailLogs() {
            localStorage.setItem(STORAGE_KEY_EMAIL_LOGS, JSON.stringify([]));
            return true;
        },

        async sendNotificationEmail(type, payload) {
            const settings = this.getSettings();
            const emailCfg = settings.email || {};
            const nowStr = new Date().toLocaleString('vi-VN');

            let subject = '';
            let bodyText = '';
            let htmlBody = '';
            const logs = this.getEmailLogs();

            if (type === 'booking') {
                if (emailCfg.notify_on_booking === false) return null;
                subject = `[Lịch Hẹn Mới] Phụ huynh ${payload.parent_name || 'Phụ huynh'} - ${payload.consult_type || 'Tư vấn'}`;
                bodyText = `THÔNG BÁO LỊCH HẸN TƯ VẤN 1-1 MỚI\n\n` +
                    `- Họ tên mẹ: ${payload.parent_name || '-'}\n` +
                    `- SĐT / Zalo: ${payload.phone || '-'}\n` +
                    `- Email: ${payload.email || 'Không có'}\n` +
                    `- Thông tin bé: ${payload.baby_name || 'Bé'} (${payload.baby_age || '-'})\n` +
                    `- Biểu hiện của con: ${payload.issues || '-'}\n` +
                    `- Chia sẻ của mẹ: ${payload.feeding_notes || '-'}\n` +
                    `- Gói đồng hành: ${payload.consult_type || '-'}\n` +
                    `- Khung giờ mong muốn: ${payload.preferred_time || '-'}\n` +
                    `- Thời gian gửi: ${payload.created_at || nowStr}`;

                htmlBody = `
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#f9fafb;padding:20px;border-radius:12px;">
                    <div style="background:#174c3b;padding:24px;border-radius:10px 10px 0 0;text-align:center;color:#ffffff;">
                        <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.5px;">THU HIỀN - CÙNG MẸ HIỂU CON</h1>
                        <p style="margin:6px 0 0;font-size:12px;opacity:0.85;">Thông Báo Lịch Hẹn Tư Vấn 1-1 Mới Từ Website</p>
                    </div>
                    <div style="background:#ffffff;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;">
                        <div style="display:inline-block;background:#ecfdf5;border:1px solid #10b981;color:#065f46;font-size:11px;font-weight:700;padding:4px 10px;border-radius:9999px;margin-bottom:16px;">
                            LỊCH HẸN MỚI CHỜ XÁC NHẬN
                        </div>
                        <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.6;color:#374151;">
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;width:140px;color:#6b7280;font-weight:600;">Họ tên phụ huynh:</td><td style="padding:8px 0;font-weight:700;color:#111827;">${payload.parent_name || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">SĐT / Zalo:</td><td style="padding:8px 0;font-weight:700;color:#047857;"><a href="tel:${payload.phone}" style="color:#047857;text-decoration:none;">${payload.phone || '-'}</a></td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Email:</td><td style="padding:8px 0;">${payload.email || 'Không có'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Thông tin bé:</td><td style="padding:8px 0;"><strong>${payload.baby_name || 'Bé'}</strong> (${payload.baby_age || '-'})</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Gói đăng ký:</td><td style="padding:8px 0;font-weight:600;color:#b45309;">${payload.consult_type || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Khung giờ mong muốn:</td><td style="padding:8px 0;">${payload.preferred_time || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Biểu hiện của con:</td><td style="padding:8px 0;color:#4b5563;">${payload.issues || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Chia sẻ của mẹ:</td><td style="padding:8px 0;color:#4b5563;">${payload.feeding_notes || '-'}</td></tr>
                            <tr><td style="padding:8px 0;color:#6b7280;font-weight:600;">Thời gian đăng ký:</td><td style="padding:8px 0;font-size:12px;color:#9ca3af;">${payload.created_at || nowStr}</td></tr>
                        </table>
                        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #f3f4f6;text-align:center;">
                            <a href="https://zalo.me/${(payload.phone || '').replace(/\D/g, '')}" target="_blank" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;padding:8px 18px;border-radius:6px;font-size:12px;font-weight:600;margin-right:8px;">Nhắn Zalo Phụ Huynh</a>
                            <a href="/admin/?tab=bookings" target="_blank" style="display:inline-block;background:#174c3b;color:#ffffff;text-decoration:none;padding:8px 18px;border-radius:6px;font-size:12px;font-weight:600;">Mở Trang Quản Trị</a>
                        </div>
                    </div>
                </div>`;
            } else if (type === 'lead') {
                if (emailCfg.notify_on_lead === false) return null;
                subject = `[Tải Cẩm Nang Mới] Phụ huynh ${payload.parent_name || 'Phụ huynh'} - ${payload.phone || ''}`;
                bodyText = `THÔNG BÁO TẢI CẨM NANG / TÀI LIỆU MỚI\n\n` +
                    `- Họ tên mẹ: ${payload.parent_name || '-'}\n` +
                    `- Số Zalo: ${payload.phone || '-'}\n` +
                    `- Email: ${payload.email || 'Không có'}\n` +
                    `- Độ tuổi bé: ${payload.baby_age || '-'}\n` +
                    `- Tài liệu nhận: ${payload.resource_name || '-'}\n` +
                    `- Thời gian gửi: ${payload.created_at || nowStr}`;

                htmlBody = `
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#f9fafb;padding:20px;border-radius:12px;">
                    <div style="background:#174c3b;padding:24px;border-radius:10px 10px 0 0;text-align:center;color:#ffffff;">
                        <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.5px;">THU HIỀN - CÙNG MẸ HIỂU CON</h1>
                        <p style="margin:6px 0 0;font-size:12px;opacity:0.85;">Khách Hàng Tiềm Năng Mới Nhận Tài Liệu</p>
                    </div>
                    <div style="background:#ffffff;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;">
                        <div style="display:inline-block;background:#fef3c7;border:1px solid #f59e0b;color:#92400e;font-size:11px;font-weight:700;padding:4px 10px;border-radius:9999px;margin-bottom:16px;">
                            ĐĂNG KÝ TẢI TÀI LIỆU MỚI
                        </div>
                        <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.6;color:#374151;">
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;width:140px;color:#6b7280;font-weight:600;">Họ tên phụ huynh:</td><td style="padding:8px 0;font-weight:700;color:#111827;">${payload.parent_name || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Số Zalo:</td><td style="padding:8px 0;font-weight:700;color:#047857;"><a href="tel:${payload.phone}" style="color:#047857;text-decoration:none;">${payload.phone || '-'}</a></td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Email:</td><td style="padding:8px 0;">${payload.email || 'Không có'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Độ tuổi của con:</td><td style="padding:8px 0;">${payload.baby_age || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Tài liệu đã nhận:</td><td style="padding:8px 0;font-weight:600;color:#1d4ed8;">${payload.resource_name || '-'}</td></tr>
                            <tr><td style="padding:8px 0;color:#6b7280;font-weight:600;">Thời gian đăng ký:</td><td style="padding:8px 0;font-size:12px;color:#9ca3af;">${payload.created_at || nowStr}</td></tr>
                        </table>
                        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #f3f4f6;text-align:center;">
                            <a href="https://zalo.me/${(payload.phone || '').replace(/\D/g, '')}" target="_blank" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;padding:8px 18px;border-radius:6px;font-size:12px;font-weight:600;">Kết Nối Zalo Với Mẹ</a>
                        </div>
                    </div>
                </div>`;
            } else if (type === 'evaluation') {
                if (emailCfg.notify_on_evaluation === false) return null;
                const riskTitle = payload.risk_title || (payload.risk_level === 'high' ? 'Nguy cơ cao' : (payload.risk_level === 'medium' ? 'Nguy cơ trung bình' : 'Nguy cơ thấp'));
                const riskColor = payload.risk_level === 'high' ? '#dc2626' : (payload.risk_level === 'medium' ? '#d97706' : '#059669');
                const riskBg = payload.risk_level === 'high' ? '#fee2e2' : (payload.risk_level === 'medium' ? '#fef3c7' : '#d1fae5');
                
                subject = `[Phiếu Đánh Giá Dinh Dưỡng] Bé ${payload.child_name || 'Bé'} (${payload.child_age || '-'}) - ${riskTitle}`;
                bodyText = `THÔNG BÁO PHIẾU ĐÁNH GIÁ DINH DƯỠNG MỚI\n\n` +
                    `- Họ tên bé: ${payload.child_name || 'Chưa cập nhật'}\n` +
                    `- Tuổi / Giới tính: ${payload.child_age || '-'} | ${payload.gender || '-'}\n` +
                    `- Phụ huynh: ${payload.parent_name || 'Phụ huynh'} (SĐT: ${payload.phone || 'Chưa có'})\n` +
                    `- Thể trạng: ${payload.weight ? payload.weight + ' kg' : '-'} / ${payload.height ? payload.height + ' cm' : '-'}\n` +
                    `- Mức độ nguy cơ: ${riskTitle} (Điểm: ${payload.score || 0})\n` +
                    `- Khẩu phần / Thói quen ăn: ${payload.daily_diet || '-'}\n` +
                    `- Dị ứng thực phẩm: ${Array.isArray(payload.allergies) ? payload.allergies.join(', ') : (payload.allergies || 'Không có')}\n` +
                    `- Khó khăn khác: ${payload.other_difficulties || '-'}\n` +
                    `- Lượng nước uống: ${payload.water || '-'}\n` +
                    `- Thời gian gửi: ${payload.created_at || nowStr}`;

                htmlBody = `
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#f9fafb;padding:20px;border-radius:12px;">
                    <div style="background:#174c3b;padding:24px;border-radius:10px 10px 0 0;text-align:center;color:#ffffff;">
                        <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.5px;">THU HIỀN - CÙNG MẸ HIỂU CON</h1>
                        <p style="margin:6px 0 0;font-size:12px;opacity:0.85;">Phiếu Đánh Giá Dinh Dưỡng Của Trẻ</p>
                    </div>
                    <div style="background:#ffffff;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;">
                        <div style="display:inline-block;background:${riskBg};border:1px solid ${riskColor};color:${riskColor};font-size:12px;font-weight:700;padding:5px 12px;border-radius:9999px;margin-bottom:16px;">
                            ${riskTitle.toUpperCase()} (ĐIỂM SỐ: ${payload.score || 0})
                        </div>
                        <table style="width:100%;border-collapse:collapse;font-size:13px;line-height:1.6;color:#374151;">
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;width:140px;color:#6b7280;font-weight:600;">Họ tên bé:</td><td style="padding:8px 0;font-weight:700;color:#111827;">${payload.child_name || 'Bé'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Độ tuổi / Giới tính:</td><td style="padding:8px 0;">${payload.child_age || '-'} (${payload.gender || '-'})</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Cân nặng / Chiều cao:</td><td style="padding:8px 0;">${payload.weight ? payload.weight + ' kg' : '-'} / ${payload.height ? payload.height + ' cm' : '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Phụ huynh:</td><td style="padding:8px 0;font-weight:600;">${payload.parent_name || 'Phụ huynh'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">SĐT / Zalo:</td><td style="padding:8px 0;font-weight:700;color:#047857;"><a href="tel:${payload.phone}" style="color:#047857;text-decoration:none;">${payload.phone || 'Chưa cung cấp'}</a></td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Thói quen / Bữa ăn:</td><td style="padding:8px 0;color:#4b5563;">${payload.daily_diet || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Dị ứng thực phẩm:</td><td style="padding:8px 0;color:#dc2626;">${Array.isArray(payload.allergies) ? payload.allergies.join(', ') : (payload.allergies || 'Không có')}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Lượng nước uống:</td><td style="padding:8px 0;">${payload.water || '-'}</td></tr>
                            <tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:8px 0;color:#6b7280;font-weight:600;">Khó khăn khác:</td><td style="padding:8px 0;color:#4b5563;">${payload.other_difficulties || '-'}</td></tr>
                            <tr><td style="padding:8px 0;color:#6b7280;font-weight:600;">Thời gian hoàn thành:</td><td style="padding:8px 0;font-size:12px;color:#9ca3af;">${payload.created_at || nowStr}</td></tr>
                        </table>
                        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #f3f4f6;text-align:center;">
                            ${payload.phone ? `<a href="https://zalo.me/${(payload.phone || '').replace(/\D/g, '')}" target="_blank" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;padding:8px 18px;border-radius:6px;font-size:12px;font-weight:600;margin-right:8px;">Nhắn Zalo Cho Mẹ</a>` : ''}
                            <a href="/danh-gia-dinh-duong/tra-cuu.html?phone=${(payload.phone || '').replace(/\D/g, '')}" target="_blank" style="display:inline-block;background:#174c3b;color:#ffffff;text-decoration:none;padding:8px 18px;border-radius:6px;font-size:12px;font-weight:600;">Xem Phiếu Tra Cứu</a>
                        </div>
                    </div>
                </div>`;
            } else if (type === 'test') {
                subject = `[Kiểm Tra Hệ Thống] Email thử nghiệm từ Website Thu Hiền`;
                bodyText = `Xin chào,\n\nĐây là email kiểm tra kết nối từ hệ thống quản trị Thu Hiền - Cùng Mẹ Hiểu Con.\nNếu bạn nhận được email này, cấu hình thông báo đã hoạt động thành công!\n\nThời gian: ${nowStr}`;
                htmlBody = `
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:620px;margin:0 auto;background:#f9fafb;padding:20px;border-radius:12px;">
                    <div style="background:#174c3b;padding:24px;border-radius:10px 10px 0 0;text-align:center;color:#ffffff;">
                        <h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.5px;">THU HIỀN - CÙNG MẸ HIỂU CON</h1>
                        <p style="margin:6px 0 0;font-size:12px;opacity:0.85;">Kiểm Tra Kết Nối Email Thông Báo</p>
                    </div>
                    <div style="background:#ffffff;padding:24px;border-radius:0 0 10px 10px;border:1px solid #e5e7eb;border-top:none;">
                        <div style="background:#ecfdf5;border:1px solid #10b981;color:#065f46;padding:12px 16px;border-radius:8px;font-size:13px;line-height:1.5;margin-bottom:16px;">
                            <strong>✓ THÀNH CÔNG:</strong> Email kiểm tra kết nối từ Website Thu Hiền đã hoạt động chuẩn xác!
                        </div>
                        <p style="font-size:13px;color:#4b5563;margin-bottom:12px;">Khi có phụ huynh đặt lịch hẹn, tải cẩm nang hoặc làm phiếu đánh giá dinh dưỡng, hệ thống sẽ tự động gửi email báo cáo chi tiết đến hộp thư này.</p>
                        <p style="font-size:12px;color:#9ca3af;margin:0;">Thời gian gửi: ${nowStr}</p>
                    </div>
                </div>`;
            }

            const targetRecipient = payload.recipient || emailCfg.admin_notify_email || emailCfg.smtp_user || 'thuhien.cungmehieucon@gmail.com';
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

            // Attempt delivery via SMTP
            if (emailCfg.provider === 'smtp') {
                try {
                    const apiUrl = this.getSendEmailApiUrl();
                    const res = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'send',
                            smtp: {
                                host: emailCfg.smtp_host || 'smtp.gmail.com',
                                port: Number(emailCfg.smtp_port) || 465,
                                secure: emailCfg.smtp_secure !== false,
                                user: emailCfg.smtp_user || '',
                                pass: emailCfg.smtp_pass || '',
                                fromName: emailCfg.smtp_from_name || 'Thu Hiền - Cùng Mẹ Hiểu Con',
                                fromEmail: emailCfg.smtp_from_email || emailCfg.smtp_user || ''
                            },
                            to: targetRecipient,
                            subject: subject,
                            text: bodyText,
                            html: htmlBody
                        })
                    });
                    const json = await res.json().catch(() => ({}));
                    if (res.ok && json.success) {
                        logEntry.status = 'Delivered (SMTP gửi thành công)';
                    } else {
                        logEntry.status = `Error (SMTP: ${json.error || 'Thất bại'})`;
                        if (json.hint) logEntry.hint = json.hint;
                    }
                } catch (err) {
                    logEntry.status = 'Error (Không kết nối được server mail: ' + err.message + ')';
                }
            } else if (emailCfg.provider === 'webhook' && emailCfg.webhook_url) {
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
                            html: htmlBody,
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

        async testEmail(targetEmail, customConfig = null) {
            const settings = this.getSettings();
            const emailCfg = customConfig || settings.email || {};
            const target = targetEmail || emailCfg.admin_notify_email;

            if (emailCfg.provider === 'smtp') {
                try {
                    const apiUrl = this.getSendEmailApiUrl();
                    const res = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'send',
                            smtp: {
                                host: emailCfg.smtp_host || 'smtp.gmail.com',
                                port: Number(emailCfg.smtp_port) || 465,
                                secure: emailCfg.smtp_secure !== false,
                                user: emailCfg.smtp_user || '',
                                pass: emailCfg.smtp_pass || '',
                                fromName: emailCfg.smtp_from_name || 'Thu Hiền - Cùng Mẹ Hiểu Con',
                                fromEmail: emailCfg.smtp_from_email || emailCfg.smtp_user || ''
                            },
                            to: target,
                            subject: `[Kiểm Tra SMTP] Thử nghiệm gửi email từ Website Thu Hiền`,
                            text: `Xin chào,\n\nĐây là email kiểm tra kết nối SMTP từ hệ thống quản trị Thu Hiền - Cùng Mẹ Hiểu Con.\nThời gian: ${new Date().toLocaleString('vi-VN')}`,
                            html: `
                            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e4e4e7;border-radius:12px;background:#ffffff;">
                                <div style="border-bottom:2px solid #10b981;padding-bottom:12px;margin-bottom:16px;">
                                    <h2 style="margin:0;color:#064e3b;font-size:20px;">Thu Hiền - Cùng Mẹ Hiểu Con</h2>
                                    <p style="margin:4px 0 0 0;color:#6b7280;font-size:13px;">Hệ thống thông báo tự động Website</p>
                                </div>
                                <div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:14px 18px;border-radius:8px;font-size:14px;margin-bottom:16px;">
                                    <strong>✓ KẾT NỐI SMTP THÀNH CÔNG!</strong><br>
                                    Email thử nghiệm đã được gửi từ tài khoản <strong>${emailCfg.smtp_user || 'SMTP'}</strong> đến <strong>${target}</strong>.
                                </div>
                                <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse;">
                                    <tr><td style="padding:6px 0;font-weight:600;width:130px;">SMTP Host:</td><td>${emailCfg.smtp_host || 'smtp.gmail.com'}</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;">Cổng (Port):</td><td>${emailCfg.smtp_port || 465} (SSL/TLS: ${emailCfg.smtp_secure !== false ? 'Bật' : 'Tắt'})</td></tr>
                                    <tr><td style="padding:6px 0;font-weight:600;">Thời gian gửi:</td><td>${new Date().toLocaleString('vi-VN')}</td></tr>
                                </table>
                            </div>`
                        })
                    });
                    const json = await res.json().catch(() => ({}));
                    if (res.ok && json.success) {
                        return { success: true, message: `Gửi email thử nghiệm thành công đến ${target}! (MessageID: ${json.messageId || 'OK'})` };
                    } else {
                        return { success: false, message: json.error || `Lỗi máy chủ HTTP ${res.status}`, hint: json.hint };
                    }
                } catch (err) {
                    return { success: false, message: 'Lỗi kết nối tới API: ' + err.message, hint: 'Kiểm tra xem backend server /api/send-email có đang chạy không.' };
                }
            } else {
                const log = await this.sendNotificationEmail('test', { recipient: target });
                const isSuccess = log && !log.status.startsWith('Error');
                return { 
                    success: isSuccess, 
                    message: log ? log.status : 'Không thể gửi email kiểm tra',
                    hint: log?.hint
                };
            }
        },

        async verifySmtp(customConfig = null) {
            const settings = this.getSettings();
            const emailCfg = customConfig || settings.email || {};
            try {
                const apiUrl = this.getSendEmailApiUrl();
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'verify',
                        smtp: {
                            host: emailCfg.smtp_host || 'smtp.gmail.com',
                            port: Number(emailCfg.smtp_port) || 465,
                            secure: emailCfg.smtp_secure !== false,
                            user: emailCfg.smtp_user || '',
                            pass: emailCfg.smtp_pass || ''
                        }
                    })
                });
                const json = await res.json().catch(() => ({}));
                return json;
            } catch (err) {
                return { success: false, error: err.message, hint: 'Không kết nối được API /api/send-email. Hãy kiểm tra server backend.' };
            }
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
                    const loginTime = Date.now();
                    const expiresAt = loginTime + (12 * 60 * 60 * 1000); // 12 hours absolute maximum
                    const signature = sha256(`THUHIEN_SESSION_${username.trim()}_${creds.hash}_${loginTime}_${creds.salt}`);
                    const sessionData = {
                        username: username.trim(),
                        loginTime: loginTime,
                        lastActive: loginTime,
                        expiresAt: expiresAt,
                        signature: signature
                    };
                    const sessionStr = JSON.stringify(sessionData);
                    sessionStorage.setItem('thuhien_admin_session', sessionStr);
                    sessionStorage.setItem('thuhien_admin_auth', 'true');
                    sessionStorage.setItem('thuhien_admin_auth_time', String(loginTime));
                    localStorage.setItem('thuhien_admin_session', sessionStr);
                    localStorage.setItem('thuhien_admin_auth', 'true');
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
        },

        // ====================================================================
        // ADMIN AUTHENTICATION CHECK & PAGE STATUS ROUTER
        // ====================================================================
        escapeHtml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        clearAdminSession() {
            try {
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem('thuhien_admin_session');
                    sessionStorage.removeItem('thuhien_admin_auth');
                    sessionStorage.removeItem('thuhien_admin_auth_time');
                }
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('thuhien_admin_session');
                    localStorage.removeItem('thuhien_admin_auth');
                    localStorage.removeItem('thuhien_admin_auth_time');
                }
            } catch (e) {}
        },

        isAdminAuthenticated() {
            try {
                let sessionRaw = null;
                if (typeof sessionStorage !== 'undefined') {
                    sessionRaw = sessionStorage.getItem('thuhien_admin_session');
                }
                if (!sessionRaw && typeof localStorage !== 'undefined') {
                    sessionRaw = localStorage.getItem('thuhien_admin_session');
                }
                if (!sessionRaw) {
                    // Check if someone tried to manually fake thuhien_admin_auth without a signed session
                    if ((typeof sessionStorage !== 'undefined' && sessionStorage.getItem('thuhien_admin_auth')) ||
                        (typeof localStorage !== 'undefined' && localStorage.getItem('thuhien_admin_auth'))) {
                        this.clearAdminSession();
                    }
                    return false;
                }

                const session = JSON.parse(sessionRaw);
                if (!session || !session.username || !session.signature || !session.loginTime || !session.expiresAt) {
                    this.clearAdminSession();
                    return false;
                }

                const now = Date.now();
                // 1. Check absolute session expiration (12 hours)
                if (now > session.expiresAt) {
                    this.clearAdminSession();
                    return false;
                }

                // 2. Check inactivity timeout (30 minutes of idle)
                const lastActive = session.lastActive || session.loginTime;
                if (now - lastActive > 30 * 60 * 1000) {
                    this.clearAdminSession();
                    return false;
                }

                // 3. Cryptographically verify signature against salted admin credentials
                const creds = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_CRED) || JSON.stringify(DEFAULT_ADMIN_CRED));
                const expectedSig = sha256(`THUHIEN_SESSION_${session.username}_${creds.hash}_${session.loginTime}_${creds.salt}`);

                if (session.signature !== expectedSig || session.username !== creds.username) {
                    this.clearAdminSession();
                    this.logSecurityEvent('SESSION_TAMPERING_DETECTED', 'BLOCKED', 'Phát hiện chữ ký phiên không hợp lệ');
                    return false;
                }

                // 4. Slide inactivity window forward
                session.lastActive = now;
                const updatedStr = JSON.stringify(session);
                if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('thuhien_admin_session', updatedStr);
                if (typeof localStorage !== 'undefined') localStorage.setItem('thuhien_admin_session', updatedStr);

                return true;
            } catch (e) {
                this.clearAdminSession();
                return false;
            }
        },

        applyPageStatusControl() {
            if (typeof document === 'undefined' || typeof window === 'undefined') return;

            // Ensure realtime cross-tab listener is running
            this.initRealtimeListener();

            const currentPath = window.location.pathname;
            // Never restrict or insert bar inside the admin panel
            if (currentPath.includes('/admin')) return;

            // Automatically render unified global layout (Header, Mobile Drawer & Footer)
            if (typeof LayoutEngine !== 'undefined') {
                try {
                    LayoutEngine.renderGlobalHeader();
                    LayoutEngine.renderGlobalFooter();
                } catch (e) {}
            }

            const settings = this.getSettings();
            const pages = settings.pages || DEFAULT_SETTINGS.pages;
            const behavior = settings.pages_behavior || 'maintenance_screen';
            const maintenanceMsg = settings.pages_maintenance_message || DEFAULT_SETTINGS.pages_maintenance_message;
            const isAdmin = this.isAdminAuthenticated();

            // Helper to get relative URL from current location
            const getRelUrl = (targetPath) => {
                const isSubdir = currentPath.includes('/chuyen-gia') || 
                                 currentPath.includes('/dinh-duong') || 
                                 currentPath.includes('/cong-dong') || 
                                 currentPath.includes('/pricing') || 
                                 currentPath.includes('/dat-lich') ||
                                 (currentPath.replace(/^\/|\/$/g, '').split('/').length > 1);

                if (targetPath === '/') return isSubdir ? '../' : './';
                const clean = targetPath.replace(/^\//, '');
                return isSubdir ? '../' + clean : './' + clean;
            };

            // 1. Navigation links control for body links (outside unified header/drawer/footer)
            pages.forEach(p => {
                const isPageDisabled = (p.enabled === false && p.slug !== 'home');
                document.querySelectorAll('a').forEach(a => {
                    // Skip unified header, drawer and footer since LayoutEngine renders them directly
                    if (a.closest('.nav-island') || a.closest('footer') || a.closest('#globalMobileDrawer')) {
                        return;
                    }
                    const h = a.getAttribute('href') || '';
                    const matchesHref = p.slug && (h.includes('/' + p.slug) || h.includes(p.path));
                    if (matchesHref) {
                        const parentLi = a.closest('li');
                        const targetEl = parentLi || a;
                        if (!isAdmin) {
                            if (isPageDisabled) {
                                targetEl.style.display = 'none';
                            } else {
                                targetEl.style.display = '';
                            }
                        } else {
                            targetEl.style.display = '';
                        }
                    }
                });
            });

            // 2. Robustly identify the active page
            const cleanPath = (currentPath || window.location.pathname).toLowerCase().replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
            let activePage = pages.find(p => {
                if (p.slug === 'home' || !p.slug) return false;
                const s = p.slug.toLowerCase();
                return cleanPath.includes('/' + s) || 
                       cleanPath.endsWith(s) || 
                       (document.body && document.body.dataset && document.body.dataset.page === s);
            });

            if (!activePage) {
                const isHome = cleanPath === '/' || 
                               cleanPath.endsWith('/thuhien') || 
                               (document.body && document.body.dataset && document.body.dataset.page === 'home');
                if (isHome) {
                    activePage = pages.find(p => p.slug === 'home');
                }
            }

            if (!activePage) {
                activePage = {
                    id: 'page_current',
                    title: 'Trang Hiện Tại',
                    path: currentPath,
                    slug: '',
                    enabled: true,
                    can_disable: false
                };
            }

            // 3. Visitor access check
            if (activePage && activePage.enabled === false && !isAdmin) {
                if (behavior === 'redirect_home') {
                    window.location.replace(getRelUrl('/'));
                    return;
                } else {
                    document.title = 'Trang Đang Được Hoàn Thiện | Thu Hiền';
                    document.body.innerHTML = `
                        <div id="thuhien-maintenance-screen" class="min-h-screen bg-[#FAF7F0] flex flex-col justify-between text-[#174C3B] selection:bg-[#F08A4B]/20 font-sans p-6 sm:p-12 relative overflow-hidden">
                            <div class="w-full max-w-2xl mx-auto my-auto py-12 text-center">
                                <div class="w-16 h-16 rounded-2xl bg-[#E7F0EB] text-[#174C3B] flex items-center justify-center mx-auto mb-6 shadow-xs border border-[#C5DCCF]/50">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                    </svg>
                                </div>
                                <span class="inline-block px-3 py-1 rounded-full bg-[#E7F0EB] text-[#174C3B] text-xs font-bold uppercase tracking-wider mb-4">
                                    Nội Dung Đang Hoàn Thiện
                                </span>
                                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#174C3B] mb-4">
                                    ${activePage.title}
                                </h1>
                                <p class="text-sm sm:text-base text-[#5F6E66] max-w-lg mx-auto leading-relaxed mb-8">
                                    ${maintenanceMsg}
                                </p>
                                <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <a href="${getRelUrl('/')}" class="w-full sm:w-auto px-6 py-3 rounded-full bg-[#174C3B] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#133F31] transition-all flex items-center justify-center gap-2">
                                        <span>Quay Về Trang Chủ</span>
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7"/>
                                        </svg>
                                    </a>
                                    <a href="${settings.social?.zalo_link || 'https://hieucontugoc.online/zalo'}" target="_blank" class="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#174C3B] border border-[#C5DCCF] text-xs sm:text-sm font-bold hover:bg-[#F4F8F5] transition-all">
                                        Liên Hệ Với Thu Hiền
                                    </a>
                                </div>
                            </div>
                            <div class="text-center text-xs text-[#8B9992] pt-6 border-t border-[#E7F0EB]">
                                © 2026 Thu Hiền – Cùng Mẹ Hiểu Con. Đồng hành cùng cha mẹ có con tự kỷ.
                            </div>
                        </div>
                    `;
                    return;
                }
            }

            // 4. If user is Admin -> Render or update the interactive Admin Top Bar
            if (isAdmin) {
                const adminUrl = getRelUrl('/admin/');
                const isCurrentDisabled = activePage.enabled === false;
                const isCorePage = activePage.can_disable === false;

                // Adjust body & floating nav island position
                document.body.style.paddingTop = '42px';
                document.querySelectorAll('.nav-island').forEach(el => {
                    el.style.top = '3.75rem';
                });

                let adminBar = document.getElementById('thuhien-admin-bar');
                if (!adminBar) {
                    adminBar = document.createElement('div');
                    adminBar.id = 'thuhien-admin-bar';
                    adminBar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:999999;height:42px;background:#18181b;color:#fafafa;font-family:Alata,system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
                    document.body.prepend(adminBar);
                }
                adminBar.className = isCurrentDisabled ? 'border-b-2 border-b-amber-500' : 'border-b border-zinc-800';

                adminBar.innerHTML = `
                    <div style="max-width:1200px;margin:0 auto;height:100%;padding:0 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;">
                        
                        <!-- Left Group: Admin Logo + Current Page + Live Status + Toggle Button -->
                        <div style="display:flex;align-items:center;gap:10px;min-width:0;overflow:hidden;">
                            <a href="${adminUrl}?tab=settings-pages" title="Mở trang Quản trị" style="display:inline-flex;align-items:center;gap:6px;background:#27272a;color:#ffffff;padding:4px 8px;border-radius:6px;font-weight:700;text-decoration:none;flex-shrink:0;">
                                <svg style="width:14px;height:14px;color:#34d399;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                <span>Quản Trị</span>
                            </a>

                            <div style="height:14px;width:1px;background:#3f3f46;" class="hidden sm:block"></div>

                            <!-- Current Page & Status -->
                            <div style="display:flex;align-items:center;gap:6px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                <span style="color:#a1a1aa;font-size:11px;" class="hidden md:inline">Trang:</span>
                                <span style="font-weight:700;color:#ffffff;max-width:140px;overflow:hidden;text-overflow:ellipsis;" class="sm:max-w-none">${activePage.title}</span>
                                ${!isCurrentDisabled
                                    ? `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700;background:#064e3b;color:#6ee7b7;border:1px solid #047857;flex-shrink:0;">
                                         <span style="width:6px;height:6px;border-radius:50%;background:#34d399;"></span>
                                         <span>Công Khai</span>
                                       </span>`
                                    : `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:700;background:#78350f;color:#fcd34d;border:1px solid #b45309;flex-shrink:0;">
                                         <span style="width:6px;height:6px;border-radius:50%;background:#fbbf24;"></span>
                                         <span>Tạm Ẩn (Khách không thấy)</span>
                                       </span>`
                                }
                            </div>

                            <!-- Direct Toggle Button for Current Page -->
                            ${isCorePage 
                                ? `<span style="font-size:10px;color:#71717a;background:#27272a;padding:2px 6px;border-radius:4px;" class="hidden lg:inline">Cố định</span>`
                                : (!isCurrentDisabled
                                    ? `<button id="adminBarBtnToggleCur" style="display:inline-flex;align-items:center;gap:4px;background:#27272a;color:#fcd34d;border:1px solid #52525b;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;flex-shrink:0;" title="Chuyển trang này sang chế độ Tạm Ẩn">
                                         <svg style="width:13px;height:13px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                                         <span class="hidden sm:inline">Tạm Ẩn Trang</span>
                                         <span class="sm:hidden">Ẩn</span>
                                       </button>`
                                    : `<button id="adminBarBtnToggleCur" style="display:inline-flex;align-items:center;gap:4px;background:#059669;color:#ffffff;border:none;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.2);" title="Bật công khai trang này ngay cho khách xem">
                                         <svg style="width:13px;height:13px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                         <span>Công Khai Ngay</span>
                                       </button>`
                                  )
                            }
                        </div>

                        <!-- Right Group: Pages Quick Dropdown + Edit in Admin + Logout -->
                        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                            
                            <!-- Pages Quick Dropdown Menu -->
                            <div style="position:relative;" id="adminBarDropdownWrapper">
                                <button id="adminBarBtnPagesDropdown" style="display:inline-flex;align-items:center;gap:6px;background:#27272a;color:#e4e4e7;border:1px solid #3f3f46;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">
                                    <svg style="width:13px;height:13px;color:#a1a1aa;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7"/></svg>
                                    <span class="hidden sm:inline">Các Trang (${pages.length})</span>
                                    <span class="sm:hidden">Trang</span>
                                    <svg id="adminBarDropdownArrow" style="width:11px;height:11px;color:#a1a1aa;transition:transform 0.15s ease;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                                </button>

                                <!-- Dropdown Popover -->
                                <div id="adminBarDropdownMenu" class="hidden" style="position:absolute;right:0;top:100%;margin-top:6px;width:340px;background:#18181b;border:1px solid #3f3f46;border-radius:10px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);padding:10px;z-index:9999999;font-size:12px;color:#e4e4e7;">
                                    <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;margin-bottom:6px;border-bottom:1px solid #27272a;font-size:11px;">
                                        <span style="font-weight:700;color:#ffffff;">Trạng Thái Các Trang</span>
                                        <span style="color:#a1a1aa;font-family:monospace;">${pages.filter(p => p.enabled !== false).length}/${pages.length} công khai</span>
                                    </div>

                                    <div style="max-height:260px;overflow-y:auto;padding-right:2px;" class="space-y-1">
                                        ${pages.map(p => {
                                            const isCurr = p.id === activePage.id;
                                            const isPub = p.enabled !== false;
                                            return `
                                                <div style="padding:6px 8px;border-radius:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;background:${isCurr ? '#27272a' : 'transparent'};">
                                                    <div style="min-width:0;flex:1;">
                                                        <div style="display:flex;align-items:center;gap:4px;">
                                                            <a href="${getRelUrl(p.path)}" style="font-weight:600;color:${isCurr ? '#34d399' : '#ffffff'};text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;" title="Xem trang ${p.title}">
                                                                ${p.title}
                                                            </a>
                                                            ${isCurr ? '<span style="font-size:9px;background:#064e3b;color:#6ee7b7;padding:1px 4px;border-radius:4px;font-weight:700;flex-shrink:0;">Hiện tại</span>' : ''}
                                                        </div>
                                                        <div style="font-size:10px;color:#71717a;font-family:monospace;">${p.path}</div>
                                                    </div>
                                                    <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                                                        ${isPub 
                                                            ? '<span style="font-size:10px;font-weight:700;color:#34d399;background:#064e3b;border:1px solid #047857;padding:1px 6px;border-radius:4px;">Bật</span>'
                                                            : '<span style="font-size:10px;font-weight:700;color:#fbbf24;background:#78350f;border:1px solid #b45309;padding:1px 6px;border-radius:4px;">Ẩn</span>'
                                                        }
                                                        ${p.can_disable === false
                                                            ? '<span style="font-size:10px;color:#71717a;width:38px;text-align:center;">Khóa</span>'
                                                            : `<button onclick="DB.togglePage('${p.id}', ${!isPub}); DB.applyPageStatusControl(); DB.showToast('Đã ' + (${!isPub} ? 'công khai' : 'tạm ẩn') + ' trang ${p.title}!', ${!isPub} ? 'success' : 'warning');" style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;border:none;background:${isPub ? '#3f3f46' : '#059669'};color:${isPub ? '#e4e4e7' : '#ffffff'};">
                                                                ${isPub ? 'Tắt' : 'Bật'}
                                                               </button>`
                                                        }
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>

                                    <div style="padding-top:8px;margin-top:6px;border-top:1px solid #27272a;display:flex;align-items:center;justify-content:space-between;font-size:11px;">
                                        <span style="color:#71717a;font-size:10px;">Bấm Bật/Tắt cập nhật realtime</span>
                                        <a href="${adminUrl}?tab=settings-pages" style="color:#f08a4b;text-decoration:none;font-weight:700;display:inline-flex;align-items:center;gap:3px;">
                                            <span>Quản lý trong Admin</span>
                                            <span>↗</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Edit in Admin Page Settings Button -->
                            <a href="${adminUrl}?tab=settings-pages" style="display:inline-flex;align-items:center;gap:4px;background:#174c3b;color:#ffffff;text-decoration:none;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;flex-shrink:0;" title="Chỉnh sửa nội dung và bật tắt trang trong Quản Trị">
                                <svg style="width:13px;height:13px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                <span>Chỉnh Sửa</span>
                            </a>

                            <!-- Logout Admin Button (Preview as public user) -->
                            <button id="adminBarBtnLogout" style="display:inline-flex;align-items:center;gap:4px;background:transparent;color:#a1a1aa;border:none;padding:4px 6px;border-radius:6px;font-size:11px;cursor:pointer;flex-shrink:0;" title="Đăng xuất để xem website như khách vãng lai bình thường">
                                <svg style="width:13px;height:13px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                <span class="hidden md:inline">Thoát Admin</span>
                            </button>

                            <!-- Collapse Button -->
                            <button id="adminBarBtnCollapse" style="background:transparent;color:#71717a;border:none;padding:3px;cursor:pointer;" title="Thu nhỏ thanh bar">
                                <svg style="width:13px;height:13px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                            </button>
                        </div>
                    </div>
                `;

                // Update or remove toast for hidden page
                let toast = document.getElementById('admin-hidden-page-toast');
                if (isCurrentDisabled) {
                    if (!toast) {
                        toast = document.createElement('div');
                        toast.id = 'admin-hidden-page-toast';
                        toast.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:999998;background:#78350f;color:#fef3c7;border:1px solid #b45309;padding:10px 14px;border-radius:10px;font-size:12px;box-shadow:0 10px 20px rgba(0,0,0,0.25);max-width:360px;line-height:1.4;display:flex;align-items:start;gap:8px;';
                        document.body.appendChild(toast);
                    }
                    toast.innerHTML = `
                        <span style="font-weight:700;color:#f59e0b;font-size:14px;line-height:1;">!</span>
                        <div style="flex:1;">
                            <strong style="color:#ffffff;display:block;">Trang Đang Tạm Ẩn</strong>
                            <span>Khách truy cập sẽ thấy thông báo bảo trì. Chỉ Quản trị viên mới thấy được toàn bộ trang này để tiếp tục chỉnh sửa.</span>
                        </div>
                        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#fde68a;cursor:pointer;font-size:13px;padding:0 2px;">✕</button>
                    `;
                } else if (toast) {
                    toast.remove();
                }

                // Event listener: Toggle current page directly
                const btnToggleCur = document.getElementById('adminBarBtnToggleCur');
                if (btnToggleCur) {
                    btnToggleCur.onclick = (e) => {
                        e.preventDefault();
                        const nextState = isCurrentDisabled; // if currently disabled -> enable it (true)
                        DB.togglePage(activePage.id, nextState);
                        DB.applyPageStatusControl();
                        DB.showToast(`Đã ${nextState ? 'công khai' : 'tạm ẩn'} trang "${activePage.title}" thành công!`, nextState ? 'success' : 'warning');
                    };
                }

                // Event listener: Dropdown menu toggle
                const btnDd = document.getElementById('adminBarBtnPagesDropdown');
                const menuDd = document.getElementById('adminBarDropdownMenu');
                const arrowDd = document.getElementById('adminBarDropdownArrow');
                if (btnDd && menuDd) {
                    btnDd.onclick = (e) => {
                        e.stopPropagation();
                        const isHidden = menuDd.classList.contains('hidden');
                        if (isHidden) {
                            menuDd.classList.remove('hidden');
                            if (arrowDd) arrowDd.style.transform = 'rotate(180deg)';
                        } else {
                            menuDd.classList.add('hidden');
                            if (arrowDd) arrowDd.style.transform = 'rotate(0deg)';
                        }
                    };

                    document.addEventListener('click', (e) => {
                        if (menuDd && !menuDd.contains(e.target) && e.target !== btnDd) {
                            menuDd.classList.add('hidden');
                            if (arrowDd) arrowDd.style.transform = 'rotate(0deg)';
                        }
                    });
                }

                // Event listener: Logout admin
                const btnLogout = document.getElementById('adminBarBtnLogout');
                if (btnLogout) {
                    btnLogout.onclick = () => {
                        if (confirm('Đăng xuất phiên Admin để kiểm tra giao diện dưới góc nhìn của khách vãng lai?')) {
                            sessionStorage.removeItem('thuhien_admin_auth');
                            localStorage.removeItem('thuhien_admin_auth');
                            // Remove ?admin=1 from URL if present
                            try {
                                const url = new URL(window.location.href);
                                url.searchParams.delete('admin');
                                window.history.replaceState({}, '', url.pathname + url.search);
                            } catch (e) {}
                            window.location.reload();
                        }
                    };
                }

                // Event listener: Collapse & Expand Admin Bar
                const btnCollapse = document.getElementById('adminBarBtnCollapse');
                if (btnCollapse) {
                    btnCollapse.onclick = () => {
                        adminBar.style.display = 'none';
                        document.body.style.paddingTop = '0px';
                        document.querySelectorAll('.nav-island').forEach(el => {
                            el.style.top = '1.25rem';
                        });

                        // Create small floating expand button
                        if (!document.getElementById('adminBarFloatingExpand')) {
                            const expandBtn = document.createElement('button');
                            expandBtn.id = 'adminBarFloatingExpand';
                            expandBtn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:999999;background:#18181b;color:#34d399;border:1px solid #3f3f46;padding:6px 12px;border-radius:9999px;font-size:11px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.3);cursor:pointer;display:flex;align-items:center;gap:5px;font-family:Alata,sans-serif;';
                            expandBtn.innerHTML = `
                                <svg style="width:13px;height:13px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                                <span>Mở Admin Bar</span>
                            `;
                            expandBtn.onclick = () => {
                                expandBtn.remove();
                                adminBar.style.display = 'block';
                                document.body.style.paddingTop = '42px';
                                document.querySelectorAll('.nav-island').forEach(el => {
                                    el.style.top = '3.75rem';
                                });
                            };
                            document.body.appendChild(expandBtn);
                        }
                    };
                }
            } else {
                const existingBar = document.getElementById('thuhien-admin-bar');
                if (existingBar) existingBar.remove();
                const existingToast = document.getElementById('admin-hidden-page-toast');
                if (existingToast) existingToast.remove();
                document.body.style.paddingTop = '0px';
                document.querySelectorAll('.nav-island').forEach(el => {
                    el.style.top = '1.25rem';
                });
            }
        }
    };
})();

// Auto-initialize page status and admin bar on load, plus sync remote Firebase & Vercel
if (typeof document !== 'undefined') {
    const runInitSync = () => {
        if (typeof DB !== 'undefined') {
            if (typeof DB.applyPageStatusControl === 'function') {
                DB.applyPageStatusControl();
            }
            if (typeof DB.initFirebase === 'function') {
                DB.initFirebase();
            }
            if (typeof DB.syncRemoteGlobalConfig === 'function') {
                DB.syncRemoteGlobalConfig();
            }
            // Ensure LayoutEngine is hydrated
            if (typeof LayoutEngine !== 'undefined') {
                LayoutEngine.init();
            } else {
                const isSub = window.location.pathname !== '/' && !window.location.pathname.endsWith('/index.html') && !window.location.pathname.endsWith('/thuhien/');
                const prefix = isSub ? '../' : './';
                const s = document.createElement('script');
                s.src = `${prefix}assets/js/layout.js?v=1.0`;
                s.onload = () => {
                    if (typeof LayoutEngine !== 'undefined') {
                        LayoutEngine.init();
                    }
                };
                document.head.appendChild(s);
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitSync);
    } else {
        setTimeout(runInitSync, 0);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DB;
}
if (typeof window !== 'undefined') {
    window.DB = DB;
}

