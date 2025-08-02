const crypto = require('crypto');

const users = {};

let totalDistributed = 0;

// Tạo mã giới thiệu duy nhất (referral code) cho user
function generateReferralCode() {
  return 'ref_' + crypto.randomBytes(3).toString('hex');
}

// Hàm tạo user mới nếu chưa tồn tại
function createUserIfNotExists(userId, email = '', username = '', referredBy = '') {
  if (!users[userId]) {
    const referralCode = generateReferralCode();
    users[userId] = {
      email,
      username,
      userId,
      password: '', // bcrypt hashed
      referralCode, // mã giới thiệu của chính mình
      referredBy,   // ai đã giới thiệu mình
      wallet: '',
      balance: 0,
      cooldown: 0,
      streak: 0,
      joinedAt: Date.now(),
      history: [],
      startMiningTime: null // Thời điểm bắt đầu khai thác
    };
  }
}

module.exports = {
  users,
  totalDistributed,
  createUserIfNotExists,
};
