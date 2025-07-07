import solPic from "../images/sol.png";
import React from "react";

export default function TokenCard({ token, price, onClick}) {
  const { name, symbol, logoURI, amount, decimals, mint } = token;
  const rawAmount = Number(amount) / 10 ** decimals;
  const formattedAmount = rawAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

  const valueUSD =
    price !== null
      ? (rawAmount * price).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  return (
    <div className="coinDiv" onClick={() => onClick(token)}>
      {logoURI ? (
        <img
          src={symbol === "SOL" ? solPic : logoURI}
          alt={name}
          className="coinLogo"
        />
      ) : (
        <i
          className="fa-brands fa-bitcoin"
          style={{ fontSize: 60, marginBottom: "1rem", marginTop: "1rem", }}
        ></i>
      )}
      <h3>
        <a href={`https://birdeye.so/token/${mint}?chain=solana`} target="_blank" rel="noreferrer" >
          {name} {symbol ? `(${symbol})` : ""}
        </a>

        <p>${price} USD / {symbol ? symbol : 'UNK'}</p>
      </h3>
      <p>
        <strong>{formattedAmount} {symbol}</strong>
      </p>
      {price && <p>≈ ${valueUSD} USD</p>}
    </div>
  );
}