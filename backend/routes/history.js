const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:userId', (req, res) => {
  const user = db.users[req.params.userId];
  if (!user) return res.json([]);
  res.json(user.history || []);
});
module.exports = router;