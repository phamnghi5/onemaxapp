import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      onLogin(res.data.userId);
    } catch (err) {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <>
      <h2>Đăng nhập</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      {/* Quên mật khẩu */}
      <p style={{ textAlign: 'right', marginTop: '5px' }}>
        <a href="/forgot-password" style={{ fontSize: '14px' }}>Quên mật khẩu?</a>
      </p>

      <button onClick={handleSubmit}>Đăng nhập</button>
    </>
  );
}

export default Login;
