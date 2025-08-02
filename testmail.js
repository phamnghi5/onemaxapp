const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.sendMail({
  from: `"Onemax App" <${process.env.SMTP_USER}>`,
  to: 'phamnghi594@gmail.com',
  subject: 'Test mail từ Onemax',
  text: 'Đây là email test xem có gửi được không.'
}, (error, info) => {
  if (error) return console.log('❌ Lỗi gửi mail:', error);
  console.log('✅ Gửi thành công:', info.response);
});
