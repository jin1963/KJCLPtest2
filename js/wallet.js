let web3;
let account;
let contract;
let usdtContract;
let kjcContract;
let routerContract;

let isConnecting = false;
const BSC_CHAIN_ID = "0x38";

async function connectWallet() {
  if (isConnecting) return;
  isConnecting = true;

  if (window.ethereum) {
    try {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== BSC_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BSC_CHAIN_ID }]
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: BSC_CHAIN_ID,
                chainName: "BNB Smart Chain",
                nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                blockExplorerUrls: ["https://bscscan.com"]
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];

      document.getElementById("walletAddress").innerText = `✅ ${account}`;

      contract = new web3.eth.Contract(stakingABI, contractAddress);
      usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
      kjcContract = new web3.eth.Contract(kjcABI, kjcAddress);
      routerContract = new web3.eth.Contract(routerABI, routerAddress);

      await initApp();
    } catch (err) {
      console.error("❌ Wallet connect error:", err);
      alert("ไม่สามารถเชื่อมต่อกระเป๋าได้");
    }
  } else {
    alert("⚠️ กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
  }

  isConnecting = false;
}
