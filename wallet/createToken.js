const abi = require("../ABI/abi.json");
const newtokenabi = require("../ABI/newtokenabi.json");
const uniswapv2abi = require("../ABI/UniswapV2abi.json");
// const wethabi = require("../ABI/wethTestnet.json");
const { Utils } = require("alchemy-sdk");

const ethers = require("ethers");
const tokenAbi = require("../tokenAbi.json");
const {
  getContractByNetwork,
  getNetwork,
  // getWethAddress,
} = require("../Network");

async function createToken(web3, tokenInfo) {
  const contract = new web3.eth.Contract(abi, getContractByNetwork());

  //convert number to bignumber
  const ethAmount = ethers.utils
    .parseUnits(tokenInfo.liquidityPool + "", 18)
    .toString();
  const approvalAmount1 = ethers.utils
    .parseUnits(tokenInfo._supply + "", 18)
    .toString();
  //end
  console.log(ethAmount);
  console.log(approvalAmount1);
  //deploy new token contract
  tx = await contract.methods.deployAdvancedToken(
    tokenInfo.name,
    tokenInfo.symbol,
    tokenInfo.decimals,
    tokenInfo._supply,
    tokenInfo.maxSupply,
    tokenInfo._owner
  );

  const transactionHash = await submitTransaction(
    tx,
    tokenInfo._owner,
    web3.eth,
    tokenInfo.privateKey,
    getContractByNetwork()
  );
  // end

  // //transaction is pennding
  // // if (transactionHash === null) {
  // // }

  //get new token address
  const newTokenAddress = await getTokenAddress(transactionHash, web3.eth);
  //end

  //end

  //approve Token1 to Send
  const token1 = new web3.eth.Contract(newtokenabi, newTokenAddress);
  const token1tx = await token1.methods.approve(
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    approvalAmount1
  );
  const transactionHash1 = await submitTransaction(
    token1tx,
    tokenInfo._owner,
    web3.eth,
    tokenInfo.privateKey,
    newTokenAddress
  );
  //end

  //createPool
  const poolContract = new web3.eth.Contract(
    uniswapv2abi,
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
  );
  const pooltx = await poolContract.methods.addLiquidityETH(
    newTokenAddress,
    approvalAmount1,
    approvalAmount1,
    ethAmount,
    tokenInfo._owner,
    Math.floor(Date.now() / 1000) + 60 * 10
  );

  const transactionHashPool = await submitTransaction(
    pooltx,
    tokenInfo._owner,
    web3.eth,
    tokenInfo.privateKey,
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
    ethAmount
  );
  //end

  return {
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    address: newTokenAddress,
    decimals: tokenInfo.decimals,
    _supply: tokenInfo._supply,
    maxSupply: tokenInfo.maxSupply,
    _owner: tokenInfo._owner,
    privateKey: tokenInfo.privateKey,
  };
}
async function getTransaction(hash, eth) {
  try {
    await new Promise(async (res, error) => {
      do {
        const result = await eth.getTransactionReceipt(transactionHash, true);
        console.log(result);
      } while (result !== null);
      res("ok");
    });
    return true;
  } catch (error) {}
}
async function getTokenAddress(transactionHash, eth) {
  try {
    const result = await eth.getTransactionReceipt(transactionHash, true);
    console.log(result);
    console.log(result.logs[0].address);
    return result.logs[0].address;
  } catch (error) {}
}

const submitTransaction = async (
  tx,
  backendWallet,
  eth,
  privateKey,
  to,
  value
) => {
  let nonce;
  let dataCode;
  let gasPrice;
  let gas;
  console.log(value);

  // try {
  //   gas = await tx.estimateGas({
  //     from: backendWallet,
  //   });
  //   console.log("gas :>> ", gas);
  // } catch (error) {
  //   console.log(error);
  //   console.log("no balance");
  //   // sendEmail(null, "Your wallet has No Balance to Buy NFT");
  //   return;
  // }
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
  // console.log(value);
  const signedTx = await eth.accounts.signTransaction(
    {
      value: value ? value : 0,
      to: to,
      data: dataCode,
      gas: 7000000,
      gasPrice: gasPrice * 2,
      nonce,
      chainId: getNetwork(),
    },
    privateKey
  );
  console.log(signedTx);

  try {
    const receipt = await eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(receipt.transactionHash);
    return signedTx.transactionHash;
  } catch (error) {
    console.log(error);
    try {
      const signedTx = await eth.accounts.signTransaction(
        {
          value: value ? value : 0,
          to: to,
          data: dataCode,
          gas: 7000000,
          gasPrice: 100814260211,
          nonce,
          chainId: getNetwork(),
        },
        privateKey
      );
      const receipt = await eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(receipt.transactionHash);
      return signedTx.transactionHash;
    } catch (error) {
      console.log(error);
    }
    return null;
  }
};

module.exports = { createToken };
