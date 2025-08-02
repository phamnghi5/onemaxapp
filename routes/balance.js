const express = require('express');
const router = express.Router();
const db = require('../db');

// ✅ Tính tốc độ khai thác dựa theo thời gian tham gia
function getMiningRate(joinedAt) {
  const now = Date.now();
  const months = (now - joinedAt) / (30 * 24 * 60 * 60 * 1000); // số tháng

  if (months < 3) return 0.25;
  if (months < 6) return 0.10;
  return 0.05;
}

router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  // ✅ Tạo user nếu chưa có
  if (!db.users[userId]) {
    db.users[userId] = {
      balance: 0,
      history: [],
      joinedAt: Date.now(),
      wallet: '',
      username: '',
      referralCode: '',
      referredBy: '',
      startMiningTime: null,
      lastMinedAt: null,
      streak: 0
    };
  }

  const user = db.users[userId];
  const now = Date.now();

  // Tính cooldown
  const cooldown = 24 * 60 * 60 * 1000;
  const last = user.lastMinedAt || 0;
  const timeSinceLast = now - last;
  const cooldownRemaining = Math.max(0, cooldown - timeSinceLast);

  // ✅ Tính token đang khai thác (nếu đang khai thác)
  let miningAmount = 0;
  if (user.startMiningTime) {
    const rate = getMiningRate(user.joinedAt); // tốc độ khai thác theo tháng
    const duration = (now - user.startMiningTime) / (60 * 60 * 1000); // số giờ
    miningAmount = parseFloat((duration * rate).toFixed(6));
  }

  const totalBalance = parseFloat((user.balance + miningAmount).toFixed(6));

  res.json({
    balance: totalBalance,
    miningAmount,
    cooldownRemaining,
    streak: user.streak || 0,
    wallet: user.wallet || '',
    referralCode: user.referralCode || '',
    username: user.username || ''
  });
});

module.exports = router;
