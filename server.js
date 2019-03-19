var express = require('express');
var bodyParser = require('body-parser');
var Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const solc = require('solc');

var urlencodedParser = bodyParser.urlencoded({ extended: true });
var app = express();
var web3 = new Web3();

app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

//provide smart contract path
const sourcePath = path.resolve('./contracts/SampleStorage.sol');

const source = fs.readFileSync(sourcePath, 'utf8');
const output = solc.compile(source.toString(), 1);

// this will create bytecode of your smart contract
const bytecode = output.contracts[':SampleStorage'].bytecode;

// this will create abi value of your smart contract
const abi = JSON.parse(output.contracts[':SampleStorage'].interface);

console.log("bytecode" + bytecode);
console.log("abi value" + abi);

var sampleContractABI = abi;
var sampleContract = web3.eth.contract(sampleContractABI);
console.log("samplecontract:  " + JSON.stringify(sampleContract))

// 0x5adb2ffcb969e50c0eaaa3376734a1d5e9c314b3 --> smart contract address which is generated when you deploy your smart contract on your local chain. so replace this address with your smart contract address.
var sampleContractInstance = sampleContract.at("0x586004bcd7178bc73adf74d42ffe336822339dab");
console.log("contract instance: " + JSON.stringify(sampleContractInstance))

app.get('/', function (req, res) {
    res.render(__dirname + '/index.html');
});
app.post('/setValue', urlencodedParser, function (req, res) {

    console.log("request" + req.body.buttonClicked);
    console.log(JSON.stringify(req.body));

    if (req.body.buttonClicked === "set") {
        console.log("Inside onSetClick()");
        var valueD = req.body.value;
        console.log("set value: " + valueD);
        console.log("Unlocking coinbase account");
        var password = "this-is-not-a-secure-password";
        try {
            web3.personal.unlockAccount(web3.eth.accounts[0], password);
        } catch (e) {
            console.log(e);
            return;
        }
        var params = {
            gas: 40000,
            from: web3.eth.accounts[0]
        };
        console.log(params);
        sampleContractInstance.set.sendTransaction(valueD, params);
        var events = sampleContractInstance.Set_name({}, { fromBlock: 0, toBlock: 'latest' });
        events.watch((err, results) => {
            console.log("results: " + JSON.stringify(results));
        });
        events.get((error, eventResult) => {
            if (error)
                console.log('Error in myEvent event handler: ' + error);
            else
                console.log('Event count: ' + eventResult.length); // Notice object returned is an array
            eventResult.forEach(element => console.log('setEvent: ' + JSON.stringify(element)));
        });

    }
    else {
        console.log("Inside getValue");
        console.log("should be in here for get");
        var value = sampleContractInstance.get.call();
        console.log("get value", value);
        res.send(value);
    }
});
app.listen(3000);
