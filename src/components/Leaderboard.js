import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Leaderboard() {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await axios.get('http://localhost:5000/leaderboard');
      setTopUsers(res.data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <>
      <h3>Bảng xếp hạng</h3>
      <ol>
        {topUsers.map((user, i) => (
          <li key={i}>{user.username}: {user.balance} OMX</li>
        ))}
      </ol>
    </>
  );
}

export default Leaderboard;