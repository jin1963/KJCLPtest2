let provider, signer, account;
let usdt, stakingContract, router;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    account = await signer.getAddress();

    usdt = new ethers.Contract(usdtAddress, usdtABI, signer);
    stakingContract = new ethers.Contract(contractAddress, contractABI, signer);
    router = new ethers.Contract(routerAddress, routerABI, signer);

    document.getElementById("walletAddress").innerText = `✅ ${account}`;
    document.getElementById("refLink").innerText = `${window.location.origin + window.location.pathname}?ref=${account}`;
    document.getElementById("refLink").href = `${window.location.origin + window.location.pathname}?ref=${account}`;
    document.getElementById("bscScanLink").href = `https://bscscan.com/address/${account}`;
  } else {
    alert("กรุณาติดตั้ง MetaMask หรือ Bitget Wallet");
  }
}

async function registerReferrer() {
  const ref = document.getElementById("refAddress").value.trim();
  if (!ethers.utils.isAddress(ref)) return alert("Referrer ไม่ถูกต้อง");
  await stakingContract.setReferrer(ref);
  alert("สมัคร Referrer เรียบร้อย");
}

async function stakeLP() {
  const usdtAmount = document.getElementById("usdtAmount").value;
  if (!usdtAmount || usdtAmount <= 0) return alert("กรุณากรอกจำนวน USDT");

  const decimals = await usdt.decimals();
  const amountIn = ethers.utils.parseUnits(usdtAmount, decimals);
  const path = [usdtAddress, kjcAddress];
  const amountsOut = await router.getAmountsOut(amountIn, path);
  const minKJC = amountsOut[1].mul(97).div(100); // slippage 3%

  const allowance = await usdt.allowance(account, contractAddress);
  if (allowance.lt(amountIn)) {
    const tx = await usdt.approve(contractAddress, amountIn);
    await tx.wait();
  }

  const tx = await stakingContract.buyAndStake(amountIn, minKJC);
  await tx.wait();
  alert("สเตคสำเร็จแล้ว!");
}

async function claimStakingReward() {
  const tx = await stakingContract.claimStakingReward();
  await tx.wait();
  alert("เคลมรางวัล Staking สำเร็จ");
}

async function claimReferralReward() {
  const tx = await stakingContract.claimReferralReward();
  await tx.wait();
  alert("เคลมรางวัลแนะนำสำเร็จ");
}

// Auto-load ref address from URL
window.onload = () => {
  const url = new URL(window.location.href);
  const ref = url.searchParams.get("ref");
  if (ref && ethers.utils.isAddress(ref)) {
    document.getElementById("refAddress").value = ref;
  }
};
