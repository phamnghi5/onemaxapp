const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { userId, amount, action } = req.body;
  const now = Date.now();

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

  if (action === 'start') {
    user.startMiningTime = now;
    return res.json({ message: 'Đã bắt đầu khai thác' });
  }

  if (action === 'stop') {
    const cooldown = 24 * 60 * 60 * 1000;
    const last = user.lastMinedAt || 0;
    const timeSinceLast = now - last;

    if (timeSinceLast < cooldown) {
      const timeLeft = cooldown - timeSinceLast;
      return res.status(403).json({
        error: `Bạn cần đợi thêm ${Math.ceil(timeLeft / 1000)} giây`,
        cooldownRemaining: timeLeft
      });
    }

    // Chuỗi ngày liên tiếp
    user.streak = (user.streak || 0) + 1;
    if (timeSinceLast > cooldown * 2) user.streak = 1;
    const bonusRate = Math.min(user.streak - 1, 30) * 0.01;

    const minedAmount = amount * (1 + bonusRate);
    user.balance += minedAmount;
    user.lastMinedAt = now;
    user.startMiningTime = null;

    user.history.push({
      time: now,
      amount: minedAmount,
      activity: 'Khai thác token'
    });

    db.totalDistributed += minedAmount;

    // Thưởng giới thiệu
    const rewardPercent = { F1: 0.05, F2: 0.03, F3: 0.02 };
    let refUser = user;
    for (let level = 1; level <= 3; level++) {
      const refCode = refUser.referredBy;
      if (!refCode) break;

      const referred = Object.values(db.users).find(u => u.referralCode === refCode);
      if (!referred) break;

      const reward = minedAmount * rewardPercent[`F${level}`];
      referred.balance += reward;
      referred.history.push({
        time: now,
        amount: reward,
        activity: `Thưởng giới thiệu F${level} từ ${user.username}`
      });

      db.totalDistributed += reward;
      refUser = referred;
    }

    return res.json({
      message: 'Khai thác thành công',
      amount: minedAmount,
      balance: user.balance,
      cooldownRemaining: cooldown
    });
  }

  res.status(400).json({ error: 'Thiếu action hoặc không hợp lệ' });
});

module.exports = router;
