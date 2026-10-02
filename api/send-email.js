const nodemailer = require('nodemailer');

// In-memory sliding window rate limiter
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 20; // 20 requests per minute
const ipRequests = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const timestamps = ipRequests.get(ip) || [];
    const recent = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
        ipRequests.set(ip, recent);
        return true;
    }
    recent.push(now);
    ipRequests.set(ip, recent);

    // Prune stale IPs if memory footprint grows
    if (ipRequests.size > 2000) {
        for (const [k, v] of ipRequests.entries()) {
            if (!v.length || now - v[v.length - 1] > RATE_LIMIT_WINDOW_MS) {
                ipRequests.delete(k);
            }
        }
    }
    return false;
}

// Anti-SSRF: block loopback and cloud metadata endpoints
function isForbiddenHost(host) {
    const h = String(host || '').toLowerCase().trim();
    if (!h) return true;
    if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '0.0.0.0') return true;
    if (h.startsWith('10.') || h.startsWith('192.168.') || h.startsWith('169.254.')) return true;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h)) return true;
    if (h.includes('metadata.google.internal') || h.includes('169.254.169.254')) return true;
    return false;
}

// Header injection prevention: strip CRLF
function sanitizeHeader(val) {
    return String(val || '').replace(/[\r\n\x00-\x1F]/g, ' ').trim();
}

// Email format validator
function isValidEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(String(email).trim());
}

// Helper to fetch remotely configured SMTP from Firestore REST API if client has empty local config
async function getRemoteSmtpConfig() {
    try {
        const url = 'https://firestore.googleapis.com/v1/projects/thuhien-cungmehieucon/databases/(default)/documents/site_config/email';
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data || !data.fields) return null;
        const f = data.fields;
        return {
            provider: f.provider?.stringValue || 'smtp',
            host: f.smtp_host?.stringValue || 'smtp.gmail.com',
            port: Number(f.smtp_port?.integerValue || f.smtp_port?.stringValue) || 465,
            secure: f.smtp_secure?.booleanValue !== false,
            user: f.smtp_user?.stringValue || '',
            pass: f.smtp_pass?.stringValue || '',
            fromName: f.smtp_from_name?.stringValue || 'Thu Hiền - Cùng Mẹ Hiểu Con',
            fromEmail: f.smtp_from_email?.stringValue || '',
            admin_notify_email: f.admin_notify_email?.stringValue || ''
        };
    } catch (e) {
        return null;
    }
}

module.exports = async function handler(req, res) {
    // Standard CORS configuration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    // Rate Limiting Check
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const primaryIp = String(clientIp).split(',')[0].trim();
    if (isRateLimited(primaryIp)) {
        return res.status(429).json({
            success: false,
            error: 'Quá nhiều yêu cầu gửi thư trong thời gian ngắn. Vui lòng thử lại sau 1 phút!',
            code: 'RATE_LIMITED'
        });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
            }
        }

        let { action, smtp, to, subject, html, text, from_name, from_email } = body || {};

        // Fallback: If SMTP credentials or recipient are missing (e.g. from visitor submission on phone),
        // automatically load from Firestore site_config/email or process.env!
        if (!smtp || !smtp.user || !smtp.pass || !to) {
            const remoteConfig = await getRemoteSmtpConfig();
            if (remoteConfig && remoteConfig.user && remoteConfig.pass) {
                smtp = {
                    host: smtp?.host || remoteConfig.host || 'smtp.gmail.com',
                    port: smtp?.port || remoteConfig.port || 465,
                    secure: smtp?.secure !== undefined ? smtp.secure : remoteConfig.secure,
                    user: smtp?.user || remoteConfig.user,
                    pass: smtp?.pass || remoteConfig.pass,
                    from_name: smtp?.from_name || remoteConfig.fromName,
                    from_email: smtp?.from_email || remoteConfig.fromEmail
                };
                if (!to) {
                    to = remoteConfig.admin_notify_email || remoteConfig.user || 'thuhien.cungmehieucon@gmail.com';
                }
            } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
                smtp = {
                    host: smtp?.host || process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: Number(smtp?.port || process.env.SMTP_PORT) || 465,
                    secure: smtp?.secure !== undefined ? smtp.secure : true,
                    user: smtp?.user || process.env.SMTP_USER,
                    pass: smtp?.pass || process.env.SMTP_PASS,
                    from_name: smtp?.from_name || process.env.SMTP_FROM_NAME || 'Thu Hiền - Cùng Mẹ Hiểu Con',
                    from_email: smtp?.from_email || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
                };
                if (!to) {
                    to = process.env.ADMIN_NOTIFY_EMAIL || process.env.SMTP_USER || 'thuhien.cungmehieucon@gmail.com';
                }
            }
        }

        if (!smtp || !smtp.host || !smtp.user || !smtp.pass) {
            return res.status(400).json({
                success: false,
                error: 'Thiếu thông số cấu hình SMTP (host, username, password). Vui lòng cấu hình SMTP trong trang quản trị Admin.'
            });
        }

        const cleanHost = String(smtp.host || '').trim();
        if (isForbiddenHost(cleanHost)) {
            return res.status(403).json({
                success: false,
                error: 'Máy chủ SMTP không hợp lệ hoặc bị cấm vì lý do an toàn bảo mật (Anti-SSRF).'
            });
        }

        const port = Number(smtp.port) || 465;
        if (port < 1 || port > 65535) {
            return res.status(400).json({ success: false, error: 'Cổng (Port) không hợp lệ.' });
        }

        let secure = smtp.secure !== undefined ? Boolean(smtp.secure) : (port === 465);
        if (port === 465) {
            secure = true;
        } else if (port === 587 || port === 25) {
            secure = false;
        }

        const cleanUser = String(smtp.user || '').trim();
        const cleanPass = String(smtp.pass || '').replace(/\s+/g, '');

        if (cleanHost.toLowerCase().includes('gmail') && !isValidEmail(cleanUser)) {
            return res.status(400).json({
                success: false,
                error: 'Tài khoản Gmail SMTP phải là một địa chỉ email hợp lệ (ví dụ: yourname@gmail.com).'
            });
        }

        const senderName = sanitizeHeader(from_name || smtp.from_name || smtp.fromName || 'Thu Hiền - Cùng Mẹ Hiểu Con');
        const rawSenderEmail = from_email || smtp.from_email || smtp.fromEmail || (isValidEmail(cleanUser) ? cleanUser : '');
        const senderEmail = sanitizeHeader(rawSenderEmail);

        if (!isValidEmail(senderEmail)) {
            return res.status(400).json({
                success: false,
                error: 'Email người gửi (fromEmail) không đúng định dạng email hợp lệ.'
            });
        }

        const transporter = nodemailer.createTransport({
            host: cleanHost,
            port: port,
            secure: secure,
            auth: {
                user: cleanUser,
                pass: cleanPass
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000,
            greetingTimeout: 8000,
            socketTimeout: 15000
        });

        // 1. Connection Verification Action
        if (action === 'verify') {
            await transporter.verify();
            return res.status(200).json({
                success: true,
                message: `Kết nối máy chủ SMTP ${cleanHost}:${port} thành công với tài khoản ${cleanUser}!`
            });
        }

        // 2. Send Mail Action
        if (!to) {
            return res.status(400).json({
                success: false,
                error: 'Thiếu địa chỉ email người nhận (to)'
            });
        }

        // Validate recipients (prevent mass mail relay abuse)
        const recipientList = Array.isArray(to) ? to : String(to).split(/[,;]/);
        const cleanRecipients = recipientList.map(r => sanitizeHeader(r)).filter(Boolean);

        if (cleanRecipients.length === 0) {
            return res.status(400).json({ success: false, error: 'Không tìm thấy địa chỉ người nhận hợp lệ.' });
        }
        if (cleanRecipients.length > 5) {
            return res.status(400).json({
                success: false,
                error: 'Giới hạn tối đa 5 người nhận mỗi lần gửi để phòng chống spam relay.'
            });
        }
        for (const recipient of cleanRecipients) {
            if (!isValidEmail(recipient)) {
                return res.status(400).json({
                    success: false,
                    error: `Địa chỉ email người nhận không hợp lệ: "${recipient}"`
                });
            }
        }

        const cleanSubject = sanitizeHeader(subject || 'Thông báo từ Website Thu Hiền - Cùng Mẹ Hiểu Con').substring(0, 200);

        // Sanitize and limit body length (max 200KB)
        const cleanText = String(text || '').substring(0, 200000);
        const cleanHtml = html ? String(html).substring(0, 200000) : cleanText.replace(/\n/g, '<br>');

        const mailOptions = {
            from: `"${senderName}" <${senderEmail}>`,
            to: cleanRecipients.join(', '),
            subject: cleanSubject,
            text: cleanText,
            html: cleanHtml
        };

        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: `Gửi email thành công tới ${mailOptions.to}`,
            messageId: info.messageId,
            response: info.response
        });

    } catch (err) {
        console.error('SMTP Mailer Error:', err);
        let errorMsg = err.message || 'Lỗi không xác định khi kết nối SMTP';

        if (err.code === 'EAUTH' || err.responseCode === 535 || (err.message && err.message.includes('535'))) {
            errorMsg = 'Sai thông tin đăng nhập SMTP (Username hoặc Mật khẩu ứng dụng không đúng). Nếu dùng Gmail, bạn BẮT BUỘC phải dùng "Mật khẩu ứng dụng" (App Password) 16 ký tự tạo tại myaccount.google.com/apppasswords (yêu cầu bật Xác minh 2 bước), KHÔNG được dùng mật khẩu Gmail thông thường!';
        } else if (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNECTION' || (err.message && (err.message.includes('timeout') || err.message.includes('ETIMEDOUT')))) {
            errorMsg = `Không thể kết nối đến máy chủ SMTP (${err.code || 'Timeout'}). Vui lòng kiểm tra lại Host và Cổng (Gmail: smtp.gmail.com, Cổng 465 với SSL, hoặc 587 với TLS).`;
        }

        return res.status(500).json({
            success: false,
            error: errorMsg,
            code: err.code
        });
    }
};
