import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message || 'Nếu email hợp lệ, liên kết đặt lại mật khẩu sẽ được gửi.');
    } catch (err) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <h2>Quên mật khẩu</h2>
      <input
        type="email"
        placeholder="Nhập email của bạn"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>Gửi yêu cầu</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
