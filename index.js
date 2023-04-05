var express = require('express');
const { createWallet } = require('./wallet/createWallet');
var app = express();




app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/createwallet',async function (req, res) {
    res.send('Hello World!');
  await  createWallet();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});