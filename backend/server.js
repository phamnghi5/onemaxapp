const express = require('express');
const cors = require('cors');
const path = require('path'); // Bổ sung thư viện path
const app = express();

const authRoutes = require('./routes/auth');
const miningRoutes = require('./routes/mine');
const balanceRoutes = require('./routes/balance');
const historyRoutes = require('./routes/history');
const leaderboardRoutes = require('./routes/leaderboard');
const withdrawRoutes = require('./routes/withdraw');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/mine', miningRoutes);
app.use('/balance', balanceRoutes);
app.use('/history', historyRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/withdraw', withdrawRoutes);

// Phục vụ các file tĩnh React đã build (frontend)
app.use(express.static(path.join(__dirname, '../onemax-frontend/build')));

// Với mọi request không phải API, trả về file index.html của React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../onemax-frontend/build', 'index.html'));
});

module.exports = app;
