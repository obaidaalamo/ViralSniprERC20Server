const { getWeb3 } = require("../provider/web3Provider");

async function getWalletInfo(list) {
  let customWeb3 = await getWeb3();
  const resultList = [];
  await new Promise(async (res, err) => {
    for (let x = 0; x < list.length; x++) {
      const data = list[x];
      let balance = await customWeb3.eth.getBalance(data);
      resultList.push({
        address: data,
        balance: balance,
      });
      //   console.log(balance);
    }

    res("ok");
  });

  return resultList;
}

module.exports = { getWalletInfo };
