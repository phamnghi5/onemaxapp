import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword'; // 👈 Thêm dòng này

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [view, setView] = useState(userId ? 'dashboard' : 'login');

  const handleLogin = (id) => {
    localStorage.setItem('userId', id);
    setUserId(id);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId('');
    setView('login');
  };

  useEffect(() => {
    if (!userId) setView('login');
  }, [userId]);

  return (
    <div className="container">
      {view === 'login' && (
        <>
          <Login onLogin={handleLogin} />
          <p style={{ textAlign: 'center' }}>
            Chưa có tài khoản? <button onClick={() => setView('register')}>Đăng ký</button>
            <br />
            Quên mật khẩu? <button onClick={() => setView('forgot')}>Lấy lại mật khẩu</button>
          </p>
        </>
      )}
      {view === 'register' && (
        <>
          <Register onRegister={handleLogin} />
          <p style={{ textAlign: 'center' }}>
            Đã có tài khoản? <button onClick={() => setView('login')}>Đăng nhập</button>
          </p>
        </>
      )}
      {view === 'forgot' && (
        <>
          <ForgotPassword />
          <p style={{ textAlign: 'center' }}>
            Nhớ mật khẩu rồi? <button onClick={() => setView('login')}>Quay lại đăng nhập</button>
          </p>
        </>
      )}
      {view === 'dashboard' && <Dashboard userId={userId} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
