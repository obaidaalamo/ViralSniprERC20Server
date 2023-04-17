const Web3 = require("web3");
const Web3WsProvider = require("web3-providers-ws");
const { getInfuraByNetwork } = require("../Network");

const options = {
  timeout: 30000, // ms
  clientConfig: {
    // Useful if requests are large
    maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
    maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

    // Useful to keep a connection alive
    keepalive: true,
    keepaliveInterval: 60000, // ms
  },

  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false,
  },
};

async function getWeb3() {
  const ws = new Web3WsProvider(getInfuraByNetwork(), options);
  let customWeb3 = new Web3(ws);
  //   let balance = await customWeb3.eth.getBalance(
  //     "0x530e0DcABe13c6833058Bb91DE4f9e886a62CC4c"
  //   );
  //   console.log(balance);
  return customWeb3;
}

module.exports = { getWeb3 };
