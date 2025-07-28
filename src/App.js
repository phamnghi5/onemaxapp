import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

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
      {view === 'dashboard' && <Dashboard userId={userId} onLogout={handleLogout} />}
    </div>
  );
}

export default App;