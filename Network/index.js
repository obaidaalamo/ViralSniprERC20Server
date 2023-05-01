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
  return process.env.INFURA_MAIN_URL;
}

function getContractByNetwork() {
  if (ChaineID === 1) {
    return process.env.CONTRACT_MAIN;
  }
  if (ChaineID === 5) {
    return process.env.CONTRACT_GOERLI;
  }
  return process.env.CONTRACT_MAIN;
}

function getWethAddress() {
  if (ChaineID === 1) {
    return process.env.WETH_MAIN;
  }
  if (ChaineID === 5) {
    return process.env.WETH_GOERLI;
  }
  return process.env.WETH_MAIN;
}

module.exports = {
  setNetwork,
  getNetwork,
  getInfuraByNetwork,
  getContractByNetwork,
  getWethAddress,
};
