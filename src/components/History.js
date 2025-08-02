import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History({ userId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(`http://localhost:5000/history/${userId}`);
      setHistory(res.data);
    };
    fetchHistory();
  }, [userId]);

  return (
    <>
      <h3>Lịch sử khai thác</h3>
      <ul>
        {history.map((item, i) => (
          <li key={i}>{item.action}: {item.amount} OMX ({new Date(item.time).toLocaleString()})</li>
        ))}
      </ul>
    </>
  );
}

export default History;