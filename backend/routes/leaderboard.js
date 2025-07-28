const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const top = Object.entries(db.users)
    .map(([id, u]) => ({ userId: id, username: u.username, balance: u.balance }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 10);
  res.json(top);
});
module.exports = router;