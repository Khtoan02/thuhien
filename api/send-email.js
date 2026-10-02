const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    // Enable CORS for localhost and production domains
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
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

        const { action, smtp, to, subject, html, text, from_name, from_email } = body || {};

        if (!smtp || !smtp.host || !smtp.user || !smtp.pass) {
            return res.status(400).json({
                success: false,
                error: 'Thiếu thông số cấu hình SMTP (host, username, password)'
            });
        }

        // Clean credentials (e.g. Google App Passwords often contain spaces "xxxx xxxx xxxx xxxx")
        const cleanHost = String(smtp.host || '').trim();
        const port = Number(smtp.port) || 465;
        const secure = smtp.secure !== undefined ? Boolean(smtp.secure) : (port === 465);
        const cleanUser = String(smtp.user || '').trim();
        const cleanPass = String(smtp.pass || '').replace(/\s+/g, ''); // Trim all whitespace in app password

        const senderName = from_name || smtp.from_name || smtp.fromName || 'Thu Hiền - Cùng Mẹ Hiểu Con';
        const senderEmail = from_email || smtp.from_email || smtp.fromEmail || cleanUser;

        const transporter = nodemailer.createTransport({
            host: cleanHost,
            port: port,
            secure: secure, // true for 465, false for 587
            auth: {
                user: cleanUser,
                pass: cleanPass
            },
            tls: {
                rejectUnauthorized: false // Avoid self-signed certificate rejection
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

        const mailOptions = {
            from: `"${senderName}" <${senderEmail}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject: subject || 'Thông báo từ Website Thu Hiền - Cùng Mẹ Hiểu Con',
            text: text || '',
            html: html || (text ? text.replace(/\n/g, '<br>') : '')
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

        if (err.code === 'EAUTH') {
            errorMsg = 'Sai thông tin đăng nhập SMTP (Username hoặc Mật khẩu ứng dụng không đúng). Nếu dùng Gmail, vui lòng dùng Mật khẩu ứng dụng (App Password) 16 ký tự, không dùng mật khẩu Gmail thông thường.';
        } else if (err.code === 'ESOCKET' || err.code === 'ETIMEDOUT') {
            errorMsg = `Không thể kết nối đến máy chủ SMTP (${err.code}). Vui lòng kiểm tra lại Host và Cổng (Port 465 SSL hoặc 587 TLS).`;
        }

        return res.status(500).json({
            success: false,
            error: errorMsg,
            code: err.code
        });
    }
};
