const express = require('express');
const router = express.Router();
const db = require('../db');

const REF_REWARD = { F1: 0.05, F2: 0.03, F3: 0.02 };
const MAX_DISTRIBUTED = 150000000;
const COOLDOWN = 24 * 60 * 60 * 1000;

function calculateSpeed(joinedAt) {
  const months = (Date.now() - joinedAt) / (1000 * 60 * 60 * 24 * 30);
  if (months <= 3) return 0.25;
  if (months <= 6) return 0.1;
  return 0.05;
}

function calculateStreakBonus(streak) {
  return Math.min(0.3, streak * 0.01); // +1% mỗi ngày, tối đa +30%
}

router.post('/', (req, res) => {
  const { userId } = req.body;
  const user = db.users[userId];
  if (!user) return res.status(400).json({ message: 'User không tồn tại' });

  const now = Date.now();
  const last = user.lastMinedAt || 0;
  const passed = now - last;
  if (passed < COOLDOWN) {
    return res.status(400).json({ message: 'Cooldown chưa kết thúc' });
  }

  const speed = calculateSpeed(user.joinedAt);
  const hours = passed / (1000 * 60 * 60);
  const streakBonus = calculateStreakBonus(user.streak || 0);
  const amount = +(speed * hours * (1 + streakBonus)).toFixed(6);

  if (db.totalDistributed + amount > MAX_DISTRIBUTED) {
    return res.status(400).json({ message: 'Đã đạt giới hạn 150 triệu token' });
  }

  user.balance += amount;
  user.totalMined += amount;
  user.lastMinedAt = now;
  user.streak = (passed <= COOLDOWN + 6 * 60 * 60 * 1000) ? (user.streak + 1) : 1;
  user.history.push({ amount, time: now, type: 'mine' });
  db.totalDistributed += amount;

  // F1
  const f1 = db.users[user.referredBy];
  if (f1) {
    const f1Amt = +(amount * REF_REWARD.F1).toFixed(6);
    f1.balance += f1Amt;
    db.totalDistributed += f1Amt;
    f1.history.push({ amount: f1Amt, time: now, type: 'ref-F1' });

    // F2
    const f2 = db.users[f1.referredBy];
    if (f2) {
      const f2Amt = +(amount * REF_REWARD.F2).toFixed(6);
      f2.balance += f2Amt;
      db.totalDistributed += f2Amt;
      f2.history.push({ amount: f2Amt, time: now, type: 'ref-F2' });

      // F3
      const f3 = db.users[f2.referredBy];
      if (f3) {
        const f3Amt = +(amount * REF_REWARD.F3).toFixed(6);
        f3.balance += f3Amt;
        db.totalDistributed += f3Amt;
        f3.history.push({ amount: f3Amt, time: now, type: 'ref-F3' });
      }
    }
  }

  res.json({
    message: 'Khai thác thành công',
    amount,
    balance: user.balance,
    streak: user.streak
  });
});
module.exports = router;