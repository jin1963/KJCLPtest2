async function initApp() {
  if (!account || !web3) return;

  await updateReferralInfo();

  const currentUrl = window.location.origin + window.location.pathname;
  const referralLink = `${currentUrl}?ref=${account}`;
  document.getElementById("refLink").href = referralLink;
  document.getElementById("refLink").innerText = referralLink;
}

async function updateReferralInfo() {
  try {
    const user = await contract.methods.users(account).call();
    const formatted = web3.utils.fromWei(user.referralRewards, "ether");
    document.getElementById("refReward").innerText = formatted;
  } catch (err) {
    console.error("❌ โหลด referral ไม่ได้:", err);
  }
}
