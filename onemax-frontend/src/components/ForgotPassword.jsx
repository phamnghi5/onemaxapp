// src/components/ForgotPassword.jsx
import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    alert(`Yêu cầu đặt lại mật khẩu đã gửi đến: ${email}`);
    // sau này bạn có thể gọi API gửi email tại đây
  };

  return (
    <>
      <h2>Quên mật khẩu</h2>
      <input
        placeholder="Nhập email khôi phục"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Gửi yêu cầu</button>
    </>
  );
}

export default ForgotPassword;
