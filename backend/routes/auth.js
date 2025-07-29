const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');

function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Đăng ký user mới
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, referralCode } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin: email, mật khẩu, username' });
    }

    const emailExists = Object.values(db.users).some(u => u.email === email);
    if (emailExists) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId();
    const referredBy = referralCode || null;

    db.users[userId] = {
      email,
      password: hashedPassword,
      username,
      wallet: '',
      balance: 0,
      history: [],
      lastMinedAt: 0,
      joinedAt: Date.now(),
      streak: 0,
      referralCode: userId,
      referredBy,
      totalMined: 0
    };

    console.log(`[REGISTER] User registered: ${userId} - ${email}`);

    res.json({ message: 'Đăng ký thành công', userId });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});

// Đăng nhập user
router.post('/login', async (req, res) => {
  try {
    console.log('[LOGIN] Body received:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    const userEntry = Object.entries(db.users).find(([_, user]) => user.email === email);
    if (!userEntry) return res.status(400).json({ message: 'Email không tồn tại' });

    const [userId, user] = userEntry;
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Sai mật khẩu' });

    console.log(`[LOGIN SUCCESS] User logged in: ${userId} - ${email}`);

    res.json({ message: 'Đăng nhập thành công', userId, username: user.username });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

module.exports = router;
