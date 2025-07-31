import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, onViewChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      });
      onLogin(res.data.userId);
    } catch (err) {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
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

      <p style={{ textAlign: 'right', marginTop: '5px' }}>
        <button
          onClick={() => onViewChange('forgot')}
          style={{ fontSize: '14px' }}
        >
          Quên mật khẩu?
        </button>
      </p>

      <button onClick={handleSubmit}>Đăng nhập</button>

      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Chưa có tài khoản?{' '}
        <button onClick={() => onViewChange('register')}>
          Đăng ký
        </button>
      </p>
    </div>
  );
}

export default Login;
