//脚本: 执行别名:npm run migrate (在package.json设置了)
const Web3 = require("web3") // web3-1.0.0-beta.36
const fs = require("fs-extra")
const path = require("path")

//链接ganache-cli
const httpProvider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(httpProvider)

//获取json文件
const projectListFile = path.resolve(__dirname,"../src/build","ProjectList.json")
//只要abi和bytecode
const {interface,bytecode} = require(projectListFile)

//部署合约使用async&await函数
async function deployContract(){
    //获取用户
    const accounts = await web3.eth.getAccounts()
    //构造交易对象
    const deployTx = {from:accounts[0],gas:2000000}
    //部署合约
   
    const instance = await new web3.eth.Contract( JSON.parse(interface) )
                               .deploy({data:"0x"+bytecode})
                               .send(deployTx)
    //把合约地址也保存为address.json文件
    console.log("合约地址:",instance.options.address)
    const adrFile = path.resolve(__dirname,"../src/build/address.json")
    fs.writeFileSync(adrFile,JSON.stringify(instance.options.address))
}

deployContract()