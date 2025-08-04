async function initApp() {
  if (!account || !web3) return;

  const currentUrl = window.location.origin + window.location.pathname;
  const referralLink = `${currentUrl}?ref=${account}`;
  document.getElementById("refLink").href = referralLink;
  document.getElementById("refLink").innerText = referralLink;

  const bscscanLink = `https://bscscan.com/address/${account}`;
  document.getElementById("bscscanLink").href = bscscanLink;
}

async function registerReferrer() {
  const ref = document.getElementById("refAddress").value.trim();
  if (!web3.utils.isAddress(ref)) return alert("❌ Referrer ไม่ถูกต้อง");

  const contract = new web3.eth.Contract(stakingABI, contractAddress);
  try {
    await contract.methods.setReferrer(ref).send({ from: account });
    alert("✅ สมัคร Referrer สำเร็จ");
  } catch (err) {
    console.error("❌ สมัคร Referrer ล้มเหลว:", err);
  }
}

async function stakeLP() {
  const usdtAmount = document.getElementById("usdtAmount").value.trim();
  if (!usdtAmount || isNaN(usdtAmount)) return alert("กรุณากรอกจำนวน USDT");

  const contract = new web3.eth.Contract(stakingABI, contractAddress);
  const usdt = new web3.eth.Contract(usdtABI, usdtAddress);

  const amountInWei = web3.utils.toWei(usdtAmount, "ether");

  try {
    await usdt.methods.approve(contractAddress, amountInWei).send({ from: account });
    const path = [usdtAddress, kjcAddress];
    const router = new web3.eth.Contract(routerABI, routerAddress);
    const amounts = await router.methods.getAmountsOut(amountInWei / 2, path).call();
    const minKJC = web3.utils.toBN(amounts[1]).muln(95).divn(100); // -5% slippage

    await contract.methods.buyAndStake(amountInWei, minKJC).send({ from: account });
    alert("✅ Stake สำเร็จแล้ว");
  } catch (err) {
    console.error("❌ Stake ล้มเหลว:", err);
  }
}
