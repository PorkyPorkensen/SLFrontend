import React from 'react';

const WalletInput = ({ wallet, setWallet, onTrack }) => {
  return (
    <div className="wallet-input-wrapper">
      <input
        className="walletInp"
        placeholder="Enter wallet address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />
      <button onClick={onTrack} className="searchBtn">
        Track
      </button>
    </div>
  );
};

export default WalletInput;