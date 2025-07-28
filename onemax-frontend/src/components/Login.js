import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { email, password });
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
      <button onClick={handleSubmit}>Đăng nhập</button>
    </>
  );
}

export default Login;