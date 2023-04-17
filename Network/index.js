let ChaineID = 1;
function setNetwork(number) {
  ChaineID = number;
}

function getNetwork() {
  return ChaineID;
}

function getInfuraByNetwork() {
  if (ChaineID === 1) {
    return process.env.INFURA_MAIN_URL;
  }
  if (ChaineID === 5) {
    return process.env.INFURA_GOERLI_URL;
  }
}
function getContractByNetwork() {
  if (ChaineID === 1) {
    return process.env.CONTRACT_MAIN;
  }
  if (ChaineID === 5) {
    return process.env.CONTRACT_GOERLI;
  }
}

function getWethAddress() {
  if (ChaineID === 1) {
    return process.env.WETH_MAIN;
  }
  if (ChaineID === 5) {
    return process.env.WETH_GOERLI;
  }
}
module.exports = {
  setNetwork,
  getNetwork,
  getInfuraByNetwork,
  getContractByNetwork,
  getWethAddress,
};
