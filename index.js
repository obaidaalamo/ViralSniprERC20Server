var express = require("express");
const { setNetwork } = require("./Network");
const { createWallet } = require("./wallet/createWallet");
require("dotenv").config();
var bodyParser = require("body-parser");
const { getWalletInfo } = require("./wallet/getWalletInfo");
const { connectWallet } = require("./wallet/connectWallet");
const { createToken } = require("./wallet/createToken");

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.get("/", function (req, res) {
  res.send("Hello to ViralSniper ERC20 Server");
});

app.get("/createwallet", async function (_req, res) {
  const wallet = await createWallet();
  res.send(JSON.stringify(wallet));
});

app.post("/getwalletinfo", async function (req, res) {
  console.log(req.body.walletList);
  setNetwork(req.body.networkId);
  const result = await getWalletInfo(req.body.walletList);
  res.send(JSON.stringify(result));
});

app.post("/createtoken", async function (req, res) {
  console.log(req.body);
  setNetwork(req.body.networkId);
  const web3 = await connectWallet(req.body.privateKey);
  const tokeninfo = await createToken(web3, req.body);
  res.send(JSON.stringify(tokeninfo));
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
  // console.log(process.env.INFURA_GOERLI_URL);
});

// https://github.com/obaidaalamo/ViralSniprERC20Server.git
