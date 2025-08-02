import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Mining({ userId }) {
  const [mining, setMining] = useState(false);
  const [tokenEarned, setTokenEarned] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/balance/${userId}`);
      setCooldown(res.data.cooldown);
    };
    fetchBalance();
  }, [userId]);

  const startMining = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/mine`, { userId });
      setTokenEarned(res.data.amount);
      setCooldown(86400); // 24h
    } catch (err) {
      alert('Không thể khai thác lúc này');
    }
  };

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <>
      <h3>Khai thác token</h3>
      {cooldown > 0 ? (
        <p>Đang cooldown: {cooldown}s</p>
      ) : (
        <button onClick={startMining}>Bắt đầu khai thác</button>
      )}
      {tokenEarned > 0 && <p>Đã khai thác được: {tokenEarned.toFixed(6)} OMX</p>}
    </>
  );
}

export default Mining;
