const Web3 = require("Web3");
const ethers = require("ethers");
const Web3WsProvider = require("web3-providers-ws");

const options = {
    timeout: 30000, // ms

    clientConfig: {
      // Useful if requests are large
      maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
      maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

      // Useful to keep a connection alive
      keepalive: true,
      keepaliveInterval: 60000 // ms
    },

    // Enable auto reconnection
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false
    }
};

async function connectWallet(privateKey){
    const ws = new Web3WsProvider('wss://goerli.infura.io/ws/v3/96c433cb36d444239d3e8024e1d0efb1', options);
    let customWeb3 = new Web3(ws);
    customWeb3.eth.accounts.wallet.add(privateKey);
    let balance = await customWeb3.eth.getBalance("0x530e0DcABe13c6833058Bb91DE4f9e886a62CC4c"); //Will give value in.
console.log(balance)
return customWeb3
    // console.log(ws)
}

module.exports = { connectWallet };
