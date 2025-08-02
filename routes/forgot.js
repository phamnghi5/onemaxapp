const express = require('express');
require('dotenv').config();
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../emailService');

function generateRandomPassword() {
  return crypto.randomBytes(4).toString('hex'); // 8 ký tự hex
}

router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Vui lòng nhập email' });
  }

  // ✅ Tìm user dựa theo email chính xác
  const found = Object.entries(db.users).find(([_, user]) => user.email?.toLowerCase() === email.toLowerCase());
  if (!found) {
    console.log(`❌ Email không tồn tại: ${email}`);
    return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
  }

  const [userId, user] = found;

  const newPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  try {
    console.log('📩 Gửi email đến:', email);

    await sendEmail(
      email,
      'Khôi phục mật khẩu Onemax',
      `
      <p>Xin chào <strong>${user.username}</strong>,</p>
      <p>Mật khẩu mới của bạn là: <strong>${newPassword}</strong></p>
      <p>Vui lòng đăng nhập và đổi mật khẩu sau khi vào hệ thống.</p>
      <p>Trân trọng,<br>Đội ngũ Onemax</p>
      `
    );

    console.log(`✅ Email đã gửi thành công tới: ${email}`);
    res.json({ message: '✅ Đã gửi mật khẩu mới về email của bạn' });
  } catch (err) {
    console.error('❌ Lỗi gửi email:', err.message);
    res.status(500).json({ message: 'Không thể gửi email. Vui lòng thử lại sau.' });
  }
});

module.exports = router;
