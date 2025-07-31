import React from 'react';
import Mining from './Mining';
import Withdraw from './Withdraw';
import History from './History';
import Leaderboard from './Leaderboard';

function Dashboard({ userId, onLogout }) {
  return (
    <>
      <h2>Chào mừng bạn đến Onemax</h2>
      <p>User ID: {userId}</p>
      <button onClick={onLogout}>Đăng xuất</button>
      <Mining userId={userId} />
      <Withdraw userId={userId} />
      <History userId={userId} />
      <Leaderboard />
    </>
  );
}

export default Dashboard;