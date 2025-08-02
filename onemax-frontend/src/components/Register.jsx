import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister, onViewChange }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        username,
        email,
        password,
        referralCode
      });
      onRegister(res.data.userId);
    } catch (err) {
      alert('Đăng ký thất bại');
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <input placeholder="Tên người dùng" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <input placeholder="Mã giới thiệu (nếu có)" value={referralCode} onChange={e => setReferralCode(e.target.value)} />
      <button onClick={handleSubmit}>Đăng ký</button>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Đã có tài khoản?{' '}
        <button onClick={() => onViewChange('login')}>
          Quay lại đăng nhập
        </button>
      </p>
    </div>
  );
}

export default Register;
