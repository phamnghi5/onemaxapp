const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { userId, amount, wallet } = req.body;
  const user = db.users[userId];

  if (!user) return res.status(400).json({ message: 'User không tồn tại' });

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Số lượng rút không hợp lệ' });
  }

  if (!wallet || wallet.length < 5) {
    return res.status(400).json({ message: 'Vui lòng nhập ví Phantom hợp lệ' });
  }

  if (user.balance < parsedAmount) {
    return res.status(400).json({ message: 'Không đủ số dư' });
  }

  // ✅ Trừ số dư và cập nhật ví
  user.balance -= parsedAmount;
  user.wallet = wallet;

  // ✅ Ghi lịch sử rút
  user.history.push({
    time: Date.now(),
    amount: parsedAmount,
    wallet,
    activity: `Yêu cầu rút ${parsedAmount} OMX về ví`,
    type: 'withdraw'
  });

  res.json({ message: `Yêu cầu rút ${parsedAmount} OMX về ví ${wallet} đã được ghi nhận.` });
});

module.exports = router;
