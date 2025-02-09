const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3('HTTP://127.0.0.1:7545'); // Ganache RPC URL
const { abi: authAbi, bytecode: authBytecode } = require('./build/Auth.json');
const { abi: firAbi, bytecode: firBytecode } = require('./build/FIR.json');

(async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Deploying contracts from:", accounts[0]);

    const authContract = new web3.eth.Contract(authAbi);
    const deployedAuth = await authContract.deploy({ data: authBytecode }).send({ from: accounts[0], gas: 3000000 });
    console.log("Auth Contract deployed at:", deployedAuth.options.address);

    const firContract = new web3.eth.Contract(firAbi);
    const deployedFIR = await firContract.deploy({ data: firBytecode, arguments: [deployedAuth.options.address] }).send({ from: accounts[0], gas: 5000000 });
    console.log("FIR Contract deployed at:", deployedFIR.options.address);
})();

