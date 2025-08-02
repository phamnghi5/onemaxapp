const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:userId', (req, res) => {
  const user = db.users[req.params.userId];
  if (!user) return res.status(404).json({ error: 'User không tồn tại' });

  // Trả về lịch sử mới nhất trước (giảm dần theo thời gian)
  const sortedHistory = [...(user.history || [])].sort((a, b) => b.time - a.time);

  res.json({
    history: sortedHistory,
    totalMined: user.balance || 0
  });
});

module.exports = router;
