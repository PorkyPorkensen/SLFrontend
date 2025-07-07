import React from 'react';
import solPic from "../images/sol.png";

const TokenModal = ({ token, onClose, prices }) => {
  if (!token) return null;

  const amount = Number(token.amount) / 10 ** token.decimals;
  const price = prices[token.mint]?.usd || 0;
  const totalValue = price * amount;

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <h2>
          {token.name || 'Unknown'} ({token.symbol || 'UNK'})
        </h2>
        {token.symbol ? (
          <img
            src={token.symbol === "SOL" ? solPic : token.logoURI}
            alt={token.name || 'Unknown Token'}
            className="coinLogo"
            style={{ height: "80px", width: "80px", marginBottom: "1rem" }}
          />
        ) : (
          <i className="fa-brands fa-bitcoin" style={{ fontSize: 60, marginBottom: "1rem", marginTop: '1rem' }}></i>
        )}
        <p><strong>Price per token:</strong> ${price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6
        })} USD</p>
        <p><strong>Amount:</strong> {amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6
        })}</p>
        <p><strong>Total Value:</strong> ${totalValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })} USD</p>
        <a
          href={`https://birdeye.so/token/${token.mint}?chain=solana`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00FFA3', marginTop: '1rem', display: 'block' }}
        >
          Trade on Birdeye ↗
        </a>
        <button onClick={onClose} style={{
          marginTop: '1rem',
          backgroundColor: '#9945FF',
          border: 'none',
          padding: '0.5rem 1rem',
          color: 'white',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TokenModal;