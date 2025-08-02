const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.FROM_EMAIL) throw new Error('Chưa cấu hình FROM_EMAIL trong .env');

    const info = await transporter.sendMail({
      from: `"Onemax App" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html
    });

    console.log('✅ Email đã gửi:', info.messageId);
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error.message);
    throw error; // ⚠️ Ném lỗi để forgot.js biết và trả lỗi
  }
};

module.exports = sendEmail;
