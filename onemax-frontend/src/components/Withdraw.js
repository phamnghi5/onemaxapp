import React, { useState } from 'react';
import axios from 'axios';

function Withdraw({ userId }) {
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    try {
      await axios.post('http://localhost:5000/withdraw', { userId, wallet, amount });
      alert('Đã gửi yêu cầu rút');
    } catch (err) {
      alert('Rút thất bại');
    }
  };

  return (
    <>
      <h3>Rút token về ví Phantom</h3>
      <input placeholder="Ví Phantom" value={wallet} onChange={e => setWallet(e.target.value)} />
      <input placeholder="Số lượng OMX" value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={handleWithdraw}>Rút</button>
    </>
  );
}

export default Withdraw;