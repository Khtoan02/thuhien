const { get, parseConnectionString } = require('@vercel/global-config');

const DEFAULT_PAGES = [
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
        id: 'dat-lich',
        title: 'Đặt Lịch Tư Vấn 1:1',
        path: '/dat-lich/',
        slug: 'dat-lich',
        enabled: true,
        can_disable: true,
        category: 'Đặt Lịch & Biểu Mẫu',
        description: 'Form khảo sát tình trạng bé và đăng ký giờ hẹn trao đổi riêng'
    }
];

module.exports = async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-vercel-token');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            let pages = null;
            let updatedAt = 0;
            const connStr = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG || 'https://global-config.vercel.com/ecfg_ulbt6vypngndqhq63ysoj9a8hrlj?token=b14d8d5f-7708-4a77-8b64-b219550d8e4c';
            try {
                const { createClient } = require('@vercel/global-config');
                const client = createClient(connStr);
                const raw = await client.get('pages_config');
                if (raw && Array.isArray(raw)) {
                    pages = raw;
                } else if (raw && Array.isArray(raw.pages)) {
                    pages = raw.pages;
                    updatedAt = raw.updated_at || 0;
                }
            } catch (gcErr) {
                console.warn('Global config read error:', gcErr.message);
            }

            if (!pages || !Array.isArray(pages)) {
                return res.status(200).json({
                    success: true,
                    source: 'default',
                    is_default: true,
                    pages: DEFAULT_PAGES
                });
            }

            // Fresh cache at edge for real-time responsiveness
            res.setHeader('Cache-Control', 'public, s-maxage=1, stale-while-revalidate=5');
            return res.status(200).json({
                success: true,
                source: (process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG) ? 'global-config' : 'default',
                is_default: false,
                pages: pages,
                updated_at: updatedAt
            });
        } catch (error) {
            console.error('Error fetching global config:', error);
            return res.status(200).json({
                success: true,
                source: 'fallback',
                is_default: true,
                pages: DEFAULT_PAGES,
                error: error.message
            });
        }
    }

    if (req.method === 'POST') {
        try {
            let body = req.body;
            if (typeof body === 'string') {
                try {
                    body = JSON.parse(body);
                } catch (e) {}
            }
            const { pages, updated_at } = body || {};
            if (!pages || !Array.isArray(pages)) {
                return res.status(400).json({ success: false, message: 'Dữ liệu danh sách pages không hợp lệ' });
            }

            let storeId = 'ecfg_ulbt6vypngndqhq63ysoj9a8hrlj';
            const connStr = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
            if (connStr) {
                try {
                    const parsed = parseConnectionString(connStr);
                    if (parsed && parsed.id) storeId = parsed.id;
                } catch (e) {}
            }

            const token = process.env.VERCEL_API_TOKEN || req.headers['x-vercel-token'];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    needs_token: true,
                    message: 'Chưa cấu hình VERCEL_API_TOKEN trong Environment Variables của Vercel hoặc cài đặt trang Admin.'
                });
            }

            // Call Vercel REST API to update Global Config items
            const updateUrl = `https://api.vercel.com/v1/global-config/${storeId}/items`;
            const response = await fetch(updateUrl, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: [
                        {
                            operation: 'upsert',
                            key: 'pages_config',
                            value: {
                                pages: pages,
                                updated_at: updated_at || Date.now()
                            }
                        }
                    ]
                })
            });

            const data = await response.json();
            if (!response.ok) {
                return res.status(response.status).json({
                    success: false,
                    message: data.error ? data.error.message : 'Lỗi cập nhật Vercel Global Config',
                    details: data
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Đã cập nhật trạng thái lên Vercel Global Config thành công!',
                data
            });
        } catch (error) {
            console.error('Error updating global config:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
};
