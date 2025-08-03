// referral.js

async function registerReferrer() {
  const refAddress = document.getElementById("refAddress").value.trim();

  if (!web3.utils.isAddress(refAddress)) {
    alert("❌ กรุณากรอก Referrer Address ให้ถูกต้อง");
    return;
  }

  try {
    await contract.methods.setReferrer(refAddress).send({ from: account });
    alert("✅ สมัครสำเร็จ!");
  } catch (error) {
    console.error("❌ การสมัคร Referrer ผิดพลาด:", error);
    alert("❌ สมัครไม่สำเร็จ กรุณาลองใหม่");
  }
}

async function claimReferral() {
  try {
    await contract.methods.claimReferralReward().send({ from: account });
    alert("✅ เคลมรางวัลแนะนำสำเร็จแล้ว!");
    await updateReferralInfo();
  } catch (error) {
    console.error("❌ Claim ผิดพลาด:", error);
    alert("❌ ไม่สามารถเคลมรางวัลแนะนำได้");
  }
}
