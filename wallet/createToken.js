const abi = require("../ABI/abi.json");
const newtokenabi = require("../ABI/newtokenabi.json");
const uniswapv2abi = require("../ABI/UniswapV2abi.json");
const wethabi = require("../ABI/wethTestnet.json");

const ethers = require("ethers");

const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");
const tokenAbi = require("../tokenAbi.json");

const { getContractByNetwork, getNetwork } = require("../Network");

async function createToken(web3, tokenInfo) {
  const contract = new web3.eth.Contract(abi, getContractByNetwork());

  // tx = await contract.methods.deployAdvancedToken(
  //   tokenInfo.name,
  //   tokenInfo.symbol,
  //   tokenInfo.decimals,
  //   tokenInfo._supply,
  //   tokenInfo.maxSupply,
  //   tokenInfo._owner
  //   // "0xc36442b4a4522e871399cd717abdd847ab11fe88", //contract router
  //   // // "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",//weth address main
  //   // "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", //weth address goerli
  //   // tokenInfo.poolFee,
  //   // tokenInfo.poolPrice
  // );

  // const transactionHash = await submitTransaction(
  //   tx,
  //   tokenInfo._owner,
  //   web3.eth,
  //   tokenInfo.privateKey,
  //   getContractByNetwork()
  // );
  const wethAddress = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
  const approvalAmount0 = ethers.utils.parseUnits("0.002", 18).toString();
  console.log(approvalAmount0);
  const approvalAmount1 = ethers.utils.parseUnits("50", 18).toString();
  console.log(approvalAmount1);
  const newTokenAddress = await getTokenAddress(
    "0x82270da4c6ccccf74c610e19e579938fdd43322ed70479aba4c5f30ccb7b8926",
    web3
  );
  // //approve Token0 to Send
  // const token0 = new web3.eth.Contract(wethabi, wethAddress);
  // const token0tx = await token0.methods.approve(
  //   "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  //   approvalAmount0
  // );
  // const transactionHash0 = await submitTransaction(
  //   token0tx,
  //   tokenInfo._owner,
  //   web3.eth,
  //   tokenInfo.privateKey,
  //   wethAddress
  // );
  // //end
  // //approve Token1 to Send
  // const token1 = new web3.eth.Contract(newtokenabi, newTokenAddress);
  // console.log(token1);
  // const token1tx = await token1.methods.approve(
  //   "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  //   approvalAmount1
  // );
  // const transactionHash1 = await submitTransaction(
  //   token1tx,
  //   tokenInfo._owner,
  //   web3.eth,
  //   tokenInfo.privateKey,
  //   newTokenAddress
  // );
  // //end
  //createPool
  const poolContract = new web3.eth.Contract(
    uniswapv2abi,
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
  );
  console.log(Math.floor(Date.now() / 1000) + 60 * 10);
  const pooltx = await poolContract.methods.addLiquidity(
    wethAddress,
    newTokenAddress,
    approvalAmount0,
    approvalAmount1,
    approvalAmount0,
    approvalAmount1,
    tokenInfo._owner,
    Math.floor(Date.now() / 1000) + 60 * 10
  );
  // console.log(pooltx);
  const transactionHashPool = await submitTransaction(
    pooltx,
    tokenInfo._owner,
    web3.eth,
    tokenInfo.privateKey,
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
  );

  //end
}

async function getTokenAddress(transactionHash, web3, tokenInfo) {
  const result = await web3.eth.getTransactionReceipt(transactionHash, true);
  console.log(result.logs[0].address);
  return result.logs[0].address;
}

async function createPool(tokenB, web3) {}

const submitTransaction = async (tx, backendWallet, eth, privateKey, to) => {
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
    console.log(error);
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
      to: to,
      data: dataCode,
      gas,
      gasPrice,
      nonce,
      chainId: getNetwork(),
    },
    privateKey
  );
  console.log(signedTx);
  const receipt = await eth.sendSignedTransaction(signedTx.rawTransaction);
  // console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(signedTx.transactionHash);
  return receipt.transactionHash;
};

module.exports = { createToken };
