//这个是node脚本 执行如下: node ./scripts/addBlock.js
//新增加
const Web3 = require("web3")
const address = require("../src/build/address.json")
const projectList = require("../src/build/ProjectList.json")


//链接ganache-cli
const httpProvider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(httpProvider)
//projectList 需要变成对象
const  contract = new web3.eth.Contract(JSON.parse(projectList.interface),address)
// console.log("获得contractlist 实例")
// console.log( contract)
//添加测试区块
async function addBlock() {
    //需要await 异步执行 拿到账户
    const accounts = await web3.eth.getAccounts();
    const projects = [
        {
            description:"天下第一",
            minInvest:web3.utils.toWei("5","ether"),
            maxInvest:web3.utils.toWei("20","ether"),
            goal: web3.utils.toWei("500","ether"),
        },
        {
            description:"僵尸道长",
            minInvest:web3.utils.toWei("10","ether"),
            maxInvest:web3.utils.toWei("150","ether"),
            goal: web3.utils.toWei("600","ether"),
        },
        {
            description:"叶问1",
            minInvest:web3.utils.toWei("10","ether"),
            maxInvest:web3.utils.toWei("50","ether"),
            goal: web3.utils.toWei("1000","ether"),
        },
        {
            description:"叶问2",
            minInvest:web3.utils.toWei("20","ether"),
            maxInvest:web3.utils.toWei("100","ether"),
            goal: web3.utils.toWei("20000","ether"),
        },
        ]
    const owner = accounts[0]

    //添加项目实例
    const results = await Promise.all(projects.map(x =>
        contract.methods.createProject(x.description, x.minInvest, x.maxInvest, x.goal).send({ from: owner, gas: '1000000' })
    )
   )
    console.log("成功创建实例");
    console.log(results);
}

addBlock()