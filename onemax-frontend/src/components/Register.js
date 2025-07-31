import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        email,
        password,
        username,
        referralCode
      });
      onRegister(res.data.userId);
    } catch (err) {
      alert('Đăng ký thất bại');
    }
  };

  return (
    <>
      <h2>Đăng ký</h2>
      <input
        placeholder="Tên người dùng"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Mã giới thiệu (nếu có)"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <button onClick={handleSubmit}>Đăng ký</button>
    </>
  );
}

export default Register;
