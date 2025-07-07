export default function AboutSection(){
    return (
        <div className="abt">
        <h3>About</h3>
        <p>This is my first project using the Solana ecosystem, and my first experience working with any Web3 package. It’s a simple wallet tracker that showcases what I can build using freely available APIs and limited request quotas. Everything you see is stitched together within those boundaries, and I’d love the opportunity to expand and polish the project further with proper API licensing and broader access. I'm excited to keep learning and growing in the blockchain space!</p>
        <h3>How it works</h3>
        <p>Upon searching an address, the app uses Helius to connect to the Solana RPC and fetch the SOL balance of the wallet and the price of SOL. After which, using what I built in the backend, finds all of the wallets SPL tokens and filters out the empty balances, and finally, uses the CoinGecko API to fetch the prices and sorts the coins by value in USD. The reason I was unable to be able to display each and ever coin's metadata is because the API limits my app to 30 request a minute on the free tier.</p>
      </div>

    )
}