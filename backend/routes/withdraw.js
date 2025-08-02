const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { userId, amount, wallet } = req.body;
  const user = db.users[userId];
  if (!user) return res.status(400).json({ message: 'User không tồn tại' });
  if (user.balance < amount) return res.status(400).json({ message: 'Không đủ số dư' });

  user.balance -= amount;
  user.wallet = wallet;
  user.history.push({ amount, wallet, time: Date.now(), type: 'withdraw' });

  res.json({ message: `Yêu cầu rút ${amount} OMX về ví ${wallet} đã được ghi nhận.` });
});
module.exports = router;