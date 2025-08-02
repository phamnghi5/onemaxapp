require('dotenv').config(); // ⬅️ THÊM DÒNG NÀY Ở DÒNG ĐẦU TIÊN

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ✅ Các route
const authRoutes = require('./routes/auth');
const miningRoutes = require('./routes/mine');
const balanceRoutes = require('./routes/balance');
const historyRoutes = require('./routes/history');
const leaderboardRoutes = require('./routes/leaderboard');
const withdrawRoutes = require('./routes/withdraw');
const forgotRoutes = require('./routes/forgot'); // ⬅️ Bổ sung

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Đăng ký route
app.use('/auth', authRoutes);
app.use('/mine', miningRoutes);
app.use('/balance', balanceRoutes);
app.use('/history', historyRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/withdraw', withdrawRoutes);
app.use('/forgot', forgotRoutes); // ⬅️ Bổ sung

// ✅ Phục vụ React đã build
app.use(express.static(path.join(__dirname, '../onemax-frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../onemax-frontend/build', 'index.html'));
});

module.exports = app;
