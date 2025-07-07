import React from 'react';

const UnknownTokens = ({ tokens, prices, show, onToggle, wallet }) => {
  const totalValue = tokens.reduce((sum, t) => {
    const price = prices[t.mint]?.usd || 0;
    const amount = Number(t.amount) / 10 ** t.decimals;
    return sum + (price * amount);
  }, 0);

  return (
    <div className="otherTkns">
      <h2
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={onToggle}
      >
        Other Tokens {show ? '▲' : '▼'}
      </h2>
      <p>
        Grouped Value: <strong style={{ color: '#00FFA3' }}>
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </strong> USD
      </p>

      {show && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tokens.map((t, i) => {
            const price = prices[t.mint]?.usd || 0;
            const amount = Number(t.amount) / 10 ** t.decimals;
            const value = (price * amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

            return (
              <li key={i} style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5rem 0',
                fontSize: '0.9rem',
                margin: '1rem 0'
              }}>
                <strong>
                  <a href={`https://birdeye.so/token/${t.mint}?chain=solana`} target="_blank" rel="noopener noreferrer">
                    {t.name || 'Unknown'}
                  </a>
                </strong> — {amount.toFixed(6)} tokens — ${value} USD
                <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.5em' }}>
                  Mint: {t.mint}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="otherTkns">
        <h3>
          <a target="_blank" href={`https://solana.fm/address/${wallet}/nfts?cluster=mainnet-alpha`} rel="noopener noreferrer">
            View their NFTs
          </a>
        </h3>
      </div>
    </div>
  );
};

export default UnknownTokens;