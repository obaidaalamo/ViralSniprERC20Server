var express = require("express");
const { setNetwork } = require("./Network");
const { createWallet } = require("./wallet/createWallet");
require("dotenv").config();
var bodyParser = require("body-parser");
const { getWalletInfo } = require("./wallet/getWalletInfo");
const { connectWallet } = require("./wallet/connectWallet");
const { createToken } = require("./wallet/createToken");
const cors = require("cors");
let createBrowser;
try {
  createBrowser = require("browserless");
} catch (error) {
  console.log(error);
  createBrowser = require("browserless");
}

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);
// #\\\"id__5ft6bandgm\\\"
const getTwitterData = async (url) => {
  // const _browser = await puppeteer.connect({
  //   browserWSEndpoint: `wss://chrome.browserless.io?token=57fac766-d087-4699-8ef5-0979d4157160`,
  // });
  // const _page = await _browser.newPage();
  // await _page.goto(url);
  // await _page.waitForSelector("section");
  // await _page.evaluate(async () => {
  //   const $ = (selector) => document.querySelector(selector);
  //   // await _page.waitForSelector(`article`);

  //   console.log($('[data-testid="tweetText"] span').innerText);
  // });
  // const data = await _page.content();
  // // console.log(await _page.content());
  // // TODO: Use query selectors to access profile info and tweets
  // _browser.disconnect();

  const browser = createBrowser({
    timeout: 25000,
    lossyDeviceName: true,
    ignoreHTTPSErrors: true,
  });
  let browserless;
  try {
    browserless = await browser.createContext();
  } catch (error) {
    console.log(error);
  }

  // await browserless.getDevice({ device: "macbook pro 13" });
  // await browser.waitForSelector("section");
  // const page = await browserless.page();

  const data = await browserless.html(url);
  data.response;

  const serialize = browserless.evaluate(
    (page) =>
      page.evaluate(() => {
        // console.log(document.body.innerText);
        return document.body.innerText;
      }),
    {
      waitUntil: "section",
    }
  );
  await serialize(url);

  await browserless.destroyContext();

  await browser.close();

  return data;
};

// parse application/json
app.use(bodyParser.json());
app.get("/", async function (req, res) {
  try {
    const data = await getTwitterData("https://twitter.com/elonmusk");
    res.send(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
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

app.listen(3010, function () {
  console.log("Example app listening on port 3010!");
});

// https://github.com/obaidaalamo/ViralSniprERC20Server.git
