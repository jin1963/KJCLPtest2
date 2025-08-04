let web3;
let account;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      account = accounts[0];
      document.getElementById("walletAddress").innerText = `✅ ${account}`;

      initApp(); // เรียกหลังเชื่อม wallet
    } catch (err) {
      console.error("❌ การเชื่อมต่อกระเป๋าล้มเหลว:", err);
    }
  } else {
    alert("กรุณาติดตั้ง MetaMask หรือ Bitget Wallet ก่อนใช้งาน");
  }
}
