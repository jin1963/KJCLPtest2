async function initApp() {
  if (!account || !web3) return;

  await updateReferralInfo();
  await updateStakingInfo(); // โหลดข้อมูล stake ด้วย

  // ลิงก์แนะนำ
  const currentUrl = window.location.origin + window.location.pathname;
  const referralLink = `${currentUrl}?ref=${account}`;
  document.getElementById("refLink").href = referralLink;
  document.getElementById("refLink").innerText = referralLink;

  // ลิงก์ไป BscScan
  const bscscanLink = `https://bscscan.com/address/${account}`;
  document.getElementById("bscscanLink").href = bscscanLink;
}
