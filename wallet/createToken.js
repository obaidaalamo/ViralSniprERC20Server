const abi = require("../abi.json");

async function createToken(web3,tokenInfo) {
  const x2y2Contract = new web3.eth.Contract(
    abi,
    "0xA9F665f0dA7e89154BB8458dd8772B7DdfA8A3D4"
  );

  tx = await x2y2Contract.methods.deployAdvancedToken(
    "nono",
    "soso",
    18,
    10000000,
    1000000000,
    "0x530e0DcABe13c6833058Bb91DE4f9e886a62CC4c"
  );


  await submitTransaction(
    tx,
    "0x530e0DcABe13c6833058Bb91DE4f9e886a62CC4c",
    web3.eth
  );
}

const submitTransaction = async (tx, backendWallet, eth) => {
  let nonce;
  let dataCode;
  let gasPrice;
  let gas;
  try {
    gas = await tx.estimateGas({
      from: backendWallet,
    });
    console.log("gas :>> ", gas);
  } catch (error) {
    console.log("no balance");
    // sendEmail(null, "Your wallet has No Balance to Buy NFT");
    return;
  }
  try {
    gasPrice = await eth.getGasPrice();
    console.log("gasPrice :>> ", gasPrice);
  } catch (error) {
    console.log("no Fass Fees");
    // sendEmail(null, "Error Gas Fees");
    return;
  }
  try {
    dataCode = tx.encodeABI();
    console.log("data :>> ", dataCode);
  } catch (error) {
    // sendEmail(null, "Error Encode ABI");
    return;
  }
  try {
    nonce = await eth.getTransactionCount(backendWallet);
    console.log("nonce :>> ", nonce);
  } catch (error) {
    // sendEmail(null, "Error Get Transaction Count");
    return;
  }
  const signedTx = await eth.accounts.signTransaction(
    {
      to: "0xA9F665f0dA7e89154BB8458dd8772B7DdfA8A3D4",
      data:dataCode,
      gas,
      gasPrice,
      nonce,
      chainId: 5,
    },
    "0x1d3a5fd7668c9f09ab535ff7eabc1a54d543810c4044700b0f5d99b51d11ffe4"
  );
  const receipt = await eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(signedTx);
};

module.exports = { createToken };
