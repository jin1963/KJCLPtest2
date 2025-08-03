// staking.js

async function stakeLP(amount) {
  try {
    const usdtAmount = web3.utils.toWei(amount, "ether");

    // 1. Approve USDT ให้ contract ใช้
    await usdtContract.methods.approve(contractAddress, usdtAmount).send({ from: account });

    // 2. คำนวณ minKJC output ที่จะ swap จากครึ่งของ USDT → KJC (slippage 3%)
    const halfUSDT = web3.utils.toBN(usdtAmount).div(web3.utils.toBN(2));
    const amountsOut = await routerContract.methods.getAmountsOut(halfUSDT.toString(), [usdtAddress, kjcAddress]).call();
    const minKJC = web3.utils.toBN(amountsOut[1]).muln(97).divn(100); // -3% slippage

    // 3. Call buyAndStake ผ่าน contract
    await contract.methods.buyAndStake(usdtAmount, minKJC.toString()).send({ from: account });

    alert("✅ สเตคสำเร็จ! ระบบได้เพิ่ม LP และล็อกไว้เรียบร้อยแล้ว");
    updateStakingInfo();
  } catch (error) {
    console.error("❌ ผิดพลาดตอน stake:", error);
    alert("❌ ไม่สามารถ stake ได้ กรุณาตรวจสอบจำนวนหรือรอสักครู่");
  }
}

async function claimReward() {
  try {
    await contract.methods.claimStakingReward().send({ from: account });
    alert("✅ เคลมรางวัลสำเร็จแล้ว!");
    updateStakingInfo();
  } catch (error) {
    console.error("❌ Claim ผิดพลาด:", error);
    alert("❌ ไม่สามารถเคลมรางวัลได้");
  }
}

async function withdrawLP() {
  try {
    const can = await contract.methods.canWithdraw(account).call();
    if (!can) {
      alert("❌ ยังไม่ครบระยะเวลา 180 วัน");
      return;
    }

    await contract.methods.withdrawLP().send({ from: account });
    alert("✅ ถอน LP สำเร็จแล้ว");
    updateStakingInfo();
  } catch (error) {
    console.error("❌ Withdraw ผิดพลาด:", error);
    alert("❌ ไม่สามารถถอน LP ได้");
  }
}

async function updateStakingInfo() {
  try {
    const stakeInfo = await contract.methods.stakers(account).call();
    const reward = await contract.methods.getPendingReward(account).call();

    const stakedLP = web3.utils.fromWei(stakeInfo.amount, "ether");
    const pendingReward = web3.utils.fromWei(reward, "ether");

    document.getElementById("stakedLP").innerText = `${stakedLP} LP`;
    document.getElementById("pendingReward").innerText = `${pendingReward} KJC`;
  } catch (error) {
    console.error("❌ ไม่สามารถโหลดข้อมูล staking:", error);
  }
}
