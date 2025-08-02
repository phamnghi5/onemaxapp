const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');
const sendEmail = require('../emailService');

// ✅ Tạo ID và mã giới thiệu
function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

function generateReferralCode() {
  return 'ref_' + crypto.randomBytes(3).toString('hex');
}

// ✅ ĐĂNG KÝ
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, referralCode } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ email, mật khẩu, username' });
    }

    // Kiểm tra email đã tồn tại
    const existed = Object.values(db.users).find(u => u.email === email);
    if (existed) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo userId và hash mật khẩu
    const userId = generateUserId();
    const hashed = await bcrypt.hash(password, 10);

    // Gọi tạo user
    db.createUserIfNotExists(userId, email, username, referralCode);

    // Đảm bảo user tồn tại rồi mới gán mật khẩu
    if (!db.users[userId]) {
      return res.status(500).json({ message: 'Không thể tạo tài khoản mới. Vui lòng thử lại.' });
    }

    db.users[userId].password = hashed;

    // ✅ Gửi email xác nhận bằng emailService.js
    await sendEmail(
      email,
      'Đăng ký thành công - Onemax',
      `<p>Chào <strong>${username}</strong>,</p>
       <p>Bạn đã đăng ký thành công tài khoản Onemax.</p>
       <p>Cảm ơn bạn đã tham gia!</p>`
    );

    res.json({
      message: 'Đăng ký thành công',
      userId,
      username,
      referralCode: db.users[userId].referralCode
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// ✅ ĐĂNG NHẬP
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

    const entry = Object.entries(db.users).find(([_, u]) => u.email === email);
    if (!entry) return res.status(400).json({ message: 'Email không tồn tại' });

    const [userId, user] = entry;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Sai mật khẩu' });

    res.json({
      message: 'Đăng nhập thành công',
      userId,
      username: user.username,
      referralCode: user.referralCode || '',
      wallet: user.wallet || ''
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

module.exports = router;
