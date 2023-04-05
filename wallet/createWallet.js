const ethers = require("ethers");
const { connectWallet } = require("./connectwallet");
const { createToken } = require("./createToken");

//0x530e0DcABe13c6833058Bb91DE4f9e886a62CC4c
//famous like raven human return barely lazy fun donate version winner limb
//0x1d3a5fd7668c9f09ab535ff7eabc1a54d543810c4044700b0f5d99b51d11ffe4
async function createWallet() {
const wallet = ethers.Wallet.createRandom();
console.log(wallet.privateKey)
console.log(wallet.address)
console.log(wallet._mnemonic().phrase)
const web3= await connectWallet("0x1d3a5fd7668c9f09ab535ff7eabc1a54d543810c4044700b0f5d99b51d11ffe4");
createToken(web3)
}


module.exports = { createWallet };
