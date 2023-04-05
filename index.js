var express = require('express');
const { createWallet } = require('./wallet/createWallet');
var app = express();

const router = express.Router();
router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

app.use(`/.netlify/functions/api`, router);

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

router.get('/createwallet',async function (req, res) {
    res.send('Hello World!');
  await  createWallet();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

