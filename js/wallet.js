let web3;
let account;
let contract;
let usdtContract;
let routerContract;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    contract = new web3.eth.Contract(contractABI, contractAddress);
    usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
    routerContract = new web3.eth.Contract(routerABI, routerAddress);

    document.getElementById("walletAddress").innerText = `✅ ${account}`;
    initApp();
  } else {
    alert("กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
  }
}
