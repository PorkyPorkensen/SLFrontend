import React from 'react';
import TokenCard from './TokenCard';

const TokenList = ({ tokens, prices, onTokenClick }) => {
  return (
    <div className="coinContainer">
      {tokens.map((token, i) => (
        <TokenCard
          key={i}
          token={token}
          price={prices[token.mint]?.usd ?? null}
          onClick={() => onTokenClick(token)}
        />
      ))}
    </div>
  );
};

export default TokenList;