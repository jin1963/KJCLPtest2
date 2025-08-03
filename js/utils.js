// utils.js

function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}

function shortenAddress(addr) {
  if (!addr || addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function getReferrerFromURL() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  return (ref && web3.utils.isAddress(ref)) ? ref : null;
}
