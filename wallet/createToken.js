const abi = require("../abi.json");
const { getContractByNetwork, getNetwork } = require("../Network");

async function createToken(web3, tokenInfo) {
  const contract = new web3.eth.Contract(abi, getContractByNetwork());

  tx = await contract.methods.deployAdvancedToken(
    tokenInfo.name,
    tokenInfo.symbol,
    tokenInfo.decimals,
    tokenInfo._supply,
    // tokenInfo.maxSupply,
    tokenInfo._owner,
    "0xc36442b4a4522e871399cd717abdd847ab11fe88", //contract router
    // "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//weth address main
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", //weth address goerli
    tokenInfo.poolFee,
    tokenInfo.poolPrice
  );

  await submitTransaction(tx, tokenInfo._owner, web3.eth, tokenInfo.privateKey);
}

const submitTransaction = async (tx, backendWallet, eth, privateKey) => {
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
      to: getContractByNetwork(),
      data: dataCode,
      gas,
      gasPrice,
      nonce,
      chainId: getNetwork(),
    },
    privateKey
  );
  const receipt = await eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(signedTx);
};

module.exports = { createToken };
