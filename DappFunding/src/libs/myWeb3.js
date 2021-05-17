import Web3 from "web3"

//创建项目的web3
let  MyWeb3
//根据是在浏览器metamask中,还是项目node中,拿到web3
//如果发现了前端的window 对象 并且安装了 metamask(metamask会有web3),
if(typeof  window!= "undefined" && typeof window.web3 != "undefined") {
    const  metaMask = window.web3.currentProvider
    MyWeb3 = new Web3(metaMask)
}else {
    const rpcUrl = "http://localhost:8545"
    const httpProvider = new Web3.provider.HttpProvider(rpcUrl)
    MyWeb3 = new Web3(httpProvider)
}
//暴露出去
export default MyWeb3