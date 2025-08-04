const contractAddress = "0xf24bb50d20b64329290D2144016Bf13b5f901710";
const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const kjcAddress = "0xd479ae350dc24168e8db863c5413c35fb2044ecd";
const routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const lpTokenAddress = "0xdF0d76046E72C183142c5208Ea0247450475A0DF";

const usdtABI = [
  { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" },
  { constant: true, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" },
  { constant: false, inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }], name: "approve", outputs: [{ name: "success", type: "bool" }], type: "function" }
];

const routerABI = [
  {
    name: "getAmountsOut",
    type: "function",
    constant: true,
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" }
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }]
  }
];

const stakingABI = [
  { name: "buyAndStake", type: "function", inputs: [{ name: "usdtAmount", type: "uint256" }, { name: "minKJC", type: "uint256" }], outputs: [], stateMutability: "nonpayable" },
  { name: "claimStakingReward", type: "function", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { name: "claimReferralReward", type: "function", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { name: "withdrawLP", type: "function", inputs: [], outputs: [], stateMutability: "nonpayable" },
  { name: "setReferrer", type: "function", inputs: [{ name: "ref", type: "address" }], outputs: [], stateMutability: "nonpayable" },
  {
    name: "users", type: "function", inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "referrer", type: "address" },
      { name: "referralRewards", type: "uint256" }
    ], stateMutability: "view"
  }
];

const contractABI = stakingABI;
