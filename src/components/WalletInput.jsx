import React from 'react';

const WalletInput = ({ wallet, setWallet, onTrack, isCooldown, cooldownTime }) => {
  return (
    <div className="wallet-input-wrapper">
      <input
        className="walletInp"
        placeholder="Enter wallet address"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />
<button
  onClick={onTrack}
  className="searchBtn"
  disabled={isCooldown}
>
  {isCooldown ? `Cooldown: ${cooldownTime}s` : 'Track'}
</button>
    </div>
  );
};

export default WalletInput;