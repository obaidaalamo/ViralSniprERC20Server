const Web3 = require("web3");
const Web3WsProvider = require("web3-providers-ws");
const { getWeb3 } = require("../provider/web3Provider");

async function connectWallet(privateKey) {
  let customWeb3 = await getWeb3();
  customWeb3.eth.accounts.wallet.add(privateKey);
  //   let balance = await customWeb3.eth.getBalance(
  //     "0x530e0DcABe13c6833058Bb91DE4f9e886a62CC4c"
  //   );
  //   console.log(balance);
  return customWeb3;
}

module.exports = { connectWallet };
