// js/staking.js
// ต้องใช้ร่วมกับ app.js ที่ประกาศตัวแปร global: provider, signer, account, usdt, stakingContract, router
// และมี element: #usdtAmount

(function () {
  // ยูทิลเล็ก ๆ
  function uiBusy(on) {
    const btn = document.querySelector('button[onclick^="stakeLP"]');
    if (!btn) return;
    btn.disabled = !!on;
    btn.textContent = on ? "⏳ กำลัง Stake..." : "🚀 Stake LP";
  }

  async function ensureConnected() {
    if (!window.ethereum) throw new Error("ไม่พบกระเป๋า (MetaMask/Bitget)");
    if (!account || !provider || !signer) throw new Error("กรุณาเชื่อมต่อกระเป๋าก่อน");
    if (!usdt || !stakingContract || !router) throw new Error("ยังไม่ได้โหลดสัญญา โปรดเชื่อมต่อใหม่");
  }

  // ─────────────────────────────────────────────────────────────────────────────

  // ✅ Stake LP: อนุมัติ USDT → คำนวณ minKJC จากครึ่งหนึ่งของ USDT → เรียก buyAndStake
  window.stakeLP = async function () {
    try {
      await ensureConnected();

      const inputEl = document.getElementById("usdtAmount");
      const raw = (inputEl?.value || "").trim();
      if (!raw || Number(raw) <= 0) {
        alert("กรุณากรอกจำนวน USDT ที่ต้องการ Stake");
        return;
      }

      uiBusy(true);

      // 1) แปลงหน่วยตามทศนิยมจริงของ USDT (BSC-Peg USDT = 18)
      const usdtDecimals = await usdt.decimals();
      const amountIn = ethers.utils.parseUnits(raw, usdtDecimals);

      // 2) อนุมัติ USDT ให้สัญญาหลัก หาก allowance ไม่พอ
      const allowance = await usdt.allowance(account, stakingContract.address);
      if (allowance.lt(amountIn)) {
        const txApprove = await usdt.approve(stakingContract.address, amountIn);
        await txApprove.wait();
      }

      // 3) คำนวณ minKJC จาก **ครึ่งหนึ่ง** ของ USDT (ตาม logic ในสัญญา)
      const half = amountIn.div(ethers.BigNumber.from(2));
      const path = [window.usdtAddress, window.kjcAddress];
      const amountsOut = await router.getAmountsOut(half, path);
      // กันสลิปเพจ 3%
      const minKJC = amountsOut[1].mul(97).div(100);

      // 4) เรียกสัญญา buyAndStake(usdtAmount ทั้งก้อน, minKJC ที่คำนวณจากครึ่งหนึ่ง)
      const tx = await stakingContract.buyAndStake(amountIn, minKJC);
      await tx.wait();

      alert("✅ สเตคสำเร็จ! ระบบได้เพิ่ม LP และล็อกไว้เรียบร้อยแล้ว");
    } catch (err) {
      console.error("stakeLP error:", err);
      // พยายามดึงข้อความ revert ที่อ่านง่าย
      const msg =
        err?.error?.message ||
        err?.data?.message ||
        err?.reason ||
        err?.message ||
        "ไม่สามารถ stake ได้ กรุณาลองใหม่";
      alert("❌ " + msg);
    } finally {
      uiBusy(false);
    }
  };

  // ✅ เคลมรางวัล Staking
  window.claimStakingReward = async function () {
    try {
      await ensureConnected();
      const tx = await stakingContract.claimStakingReward();
      await tx.wait();
      alert("✅ เคลมรางวัล Staking สำเร็จ");
    } catch (err) {
      console.error("claimStakingReward error:", err);
      const msg = err?.error?.message || err?.data?.message || err?.reason || err?.message || "เคลมไม่สำเร็จ";
      alert("❌ " + msg);
    }
  };

  // ✅ เคลมรางวัลแนะนำ (Referral)
  window.claimReferralReward = async function () {
    try {
      await ensureConnected();
      const tx = await stakingContract.claimReferralReward();
      await tx.wait();
      alert("✅ เคลมรางวัลแนะนำสำเร็จ");
    } catch (err) {
      console.error("claimReferralReward error:", err);
      const msg = err?.error?.message || err?.data?.message || err?.reason || err?.message || "เคลมไม่สำเร็จ";
      alert("❌ " + msg);
    }
  };
})();
