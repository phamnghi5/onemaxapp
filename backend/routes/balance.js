const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:userId', (req, res) => {
  const user = db.users[req.params.userId];
  if (!user) return res.status(400).json({ message: 'User không tồn tại' });

  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;
  const left = Math.max(0, cooldown - (now - (user.lastMinedAt || 0)));

  res.json({
    balance: user.balance,
    wallet: user.wallet,
    cooldown: Math.ceil(left / 1000),
    username: user.username,
    streak: user.streak
  });
});
module.exports = router;