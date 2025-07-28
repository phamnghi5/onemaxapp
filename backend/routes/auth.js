const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

router.post('/register', async (req, res) => {
  const { email, password, username, referralCode } = req.body;
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

  res.json({ message: 'Đăng ký thành công', userId });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userEntry = Object.entries(db.users).find(([_, user]) => user.email === email);
  if (!userEntry) return res.status(400).json({ message: 'Email không tồn tại' });

  const [userId, user] = userEntry;
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Sai mật khẩu' });

  res.json({ message: 'Đăng nhập thành công', userId, username: user.username });
});

module.exports = router;