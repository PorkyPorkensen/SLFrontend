import React from 'react';
import './App.css';
import axios from 'axios';
import { TokenListProvider } from "@solana/spl-token-registry";
import { Connection, PublicKey } from "@solana/web3.js";
import AboutSection from './components/AboutSection';
import ExampleWallet from './components/ExampleWallet';
import WalletInput from './components/WalletInput';
import TokenList from './components/TokenList';
import TokenModal from './components/TokenModal';
import UnknownTokens from './components/UnknownTokens';
import LoadingSpinner from './components/LoadingSpinner';
import PortfolioPieChart from './components/PortfolioPieChart';

function App() {
  const [wallet, setWallet] = React.useState('');
  const [tokens, setTokens] = React.useState([]);
  const [tokenList, setTokenList] = React.useState([]);
  const [prices, setPrices] = React.useState({});
  const [totalValue, setTotalValue] = React.useState(0);
  const [unknownRemaining, setUnknownRemaining] = React.useState([]);
  const [showUnknownDetails, setShowUnknownDetails] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isCooldown, setIsCooldown] = React.useState(false);
  const [cooldownTime, setCooldownTime] = React.useState(60);

  React.useEffect(() => {
    new TokenListProvider().resolve().then((container) => {
      const list = container.filterByChainId(101).getList();
      setTokenList(list);
    });
  }, []);

  React.useEffect(() => {
    let timer;
    if (isCooldown && cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    } else if (cooldownTime === 0) {
      setIsCooldown(false);
    }

    return () => clearTimeout(timer);
  }, [isCooldown, cooldownTime]);

  const getSolPrice = async () => {
    try {
      const res = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd");
      return res.data.solana.usd || 0;
    } catch (err) {
      console.error("Failed to fetch SOL price:", err);
      return 0;
    }
  };

  const enrichUnknownsWithCoingecko = async (tokens) => {
    const updated = [];
    for (const token of tokens) {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/solana/contract/${token.mint}`);
        const data = res.data;
        updated.push({
          ...token,
          name: data.name,
          symbol: data.symbol.toUpperCase(),
          logoURI: data.image?.small || "",
        });
      } catch (err) {
        updated.push(token);
      }
    }
    return updated;
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const connection = new Connection("https://rpc.helius.xyz/?api-key=258cae47-7300-44bb-be88-1182416282c5");
      const publicKey = new PublicKey(wallet);

      const lamports = await connection.getBalance(publicKey);
      const solPrice = await getSolPrice();

      const solToken = {
        name: "Solana",
        symbol: "SOL",
        mint: "So11111111111111111111111111111111111111112",
        amount: lamports,
        decimals: 9,
        logoURI: "https://cryptologos.cc/logos/solana-sol-logo.png?v=032"
      };

      const res = await axios.get(`https://slbackend-0fvj.onrender.com/api/assets/${wallet}`);
      const rawTokens = res.data;
      const filtered = rawTokens.filter((asset) => Number(asset.amount) > 0);

      const enriched = filtered.map((token) => {
        const meta = tokenList.find((t) => t.address === token.mint);
        return {
          ...token,
          name: meta?.name || "Unknown",
          symbol: meta?.symbol || "",
          logoURI: meta?.logoURI || "",
        };
      });

      const knownTokens = enriched.filter((t) => t.name !== "Unknown");
      const unknownTokens = enriched.filter((t) => t.name === "Unknown");

      knownTokens.unshift(solToken);

      const mintAddresses = enriched.map((t) => t.mint);
      let priceData = {
        [solToken.mint]: { usd: solPrice }
      };

      const BATCH_SIZE = 60;
      const batches = [];

      for (let i = 0; i < mintAddresses.length; i += BATCH_SIZE) {
        const chunk = mintAddresses.slice(i, i + BATCH_SIZE);
        batches.push(chunk);
      }

      for (const batch of batches) {
        try {
          const priceURL = `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${batch.join(',')}&vs_currencies=usd&x_cg_demo_api_key=CG-J7MsjScDMvuF8hC1zDL88zyt`;
          const response = await axios.get(priceURL);
          priceData = { ...priceData, ...response.data };
        } catch (err) {
          console.error("Price batch fetch failed:", err);
        }
      }

      setPrices(priceData);

      const sortedUnknowns = [...unknownTokens].sort((a, b) => {
        const pa = priceData[a.mint]?.usd || 0;
        const pb = priceData[b.mint]?.usd || 0;
        const va = pa * (Number(a.amount) / 10 ** a.decimals);
        const vb = pb * (Number(b.amount) / 10 ** b.decimals);
        return vb - va;
      });

      const top12Unknowns = sortedUnknowns.slice(0, 5);
      const enrichedTop12 = await enrichUnknownsWithCoingecko(top12Unknowns);

      let finalKnownTokens = [...knownTokens, ...enrichedTop12];

      finalKnownTokens = finalKnownTokens.sort((a, b) => {
        const priceA = priceData[a.mint]?.usd || 0;
        const priceB = priceData[b.mint]?.usd || 0;
        const amountA = Number(a.amount) / 10 ** a.decimals;
        const amountB = Number(b.amount) / 10 ** b.decimals;
        return (priceB * amountB) - (priceA * amountA);
      });

      const total = [...finalKnownTokens, ...sortedUnknowns.slice(12)].reduce((sum, token) => {
        const price = priceData[token.mint]?.usd || 0;
        const amount = Number(token.amount) / 10 ** token.decimals;
        return sum + (price * amount);
      }, 0);

      const filteredFinalTokens = finalKnownTokens.filter((token) => {
        const amount = Number(token.amount) / 10 ** token.decimals;
        const price = priceData[token.mint]?.usd || 0;
        const value = amount * price;
        return value >= 1;
      });

      setTotalValue(total);
      setTokens(filteredFinalTokens);
      setUnknownRemaining(
        sortedUnknowns.slice(12).filter((token) => {
          const amount = Number(token.amount) / 10 ** token.decimals;
          const price = priceData[token.mint]?.usd || 0;
          const value = amount * price;
          return value >= 1;
        })
      );
            setIsCooldown(true);
            setCooldownTime(60);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };

  return (
    <div>
      <h1 className="logo">SolScanner</h1>
      <AboutSection />
      <ExampleWallet />
      <WalletInput
        wallet={wallet}
        setWallet={setWallet}
        onTrack={fetchTokens}
        isCooldown={isCooldown}
        cooldownTime={cooldownTime}
      />
      <div className="pv">
        <h3>Estimated Value:</h3>
        <h2 style={{ color: '#00FFA3', letterSpacing: '0.1em' }}>
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PortfolioPieChart tokens={tokens} prices={prices} />
          <TokenList tokens={tokens} prices={prices} onTokenClick={setSelectedToken} />
          <TokenModal token={selectedToken} onClose={() => setSelectedToken(null)} prices={prices} />
          <UnknownTokens
            tokens={unknownRemaining}
            prices={prices}
            show={showUnknownDetails}
            onToggle={() => setShowUnknownDetails(prev => !prev)}
            wallet={wallet}
          />
        </>
      )}
    </div>
  );
}

export default App;