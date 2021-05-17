const Web3 = require("web3")
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

//脚本:从gananche转账给metamask
async function send(fromIndex,to,amount) {
    const accounts = await web3.eth.getAccounts()
    amount = amount.toString()
    const tx = {from:accounts[fromIndex],to:to,value:web3.utils.toWei(amount)}
    const block = await web3.eth.sendTransaction(tx)
    console.log(block)
    web3.eth.getBalance(accounts[fromIndex]).then(res=>console.log(res.toString(10)))
}

send(7,"0x8470C03b6aC25c28DF6c9633cBAa35F60f19899A",15)