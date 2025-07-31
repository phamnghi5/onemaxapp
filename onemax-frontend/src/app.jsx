import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';

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
        <Login onLogin={handleLogin} onViewChange={setView} />
      )}

      {view === 'register' && (
        <Register onRegister={handleLogin} onViewChange={setView} />
      )}

      {view === 'forgot' && (
        <div>
          <ForgotPassword />
          <p style={{ textAlign: 'center' }}>
            Nhớ mật khẩu rồi?{' '}
            <button onClick={() => setView('login')}>Quay lại đăng nhập</button>
          </p>
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard userId={userId} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
