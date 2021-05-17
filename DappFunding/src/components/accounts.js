import React, {Component} from "react"
import Web3 from "web3"

class Accounts extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            addresses:[]
        }
    }
    //页面加载完成之后  通过授权拿到地址
   async componentDidMount() {
        console.log("已经加载完页面了")
        //等待用户授权
       if (window.ethereum) {
           var web3Provider = window.ethereum
           try {
               window.ethereum.enable();
           } catch (e) {
               console.error("用户禁止授权")
           }
           let web3js = new Web3(web3Provider)
           const getedAccounds =  await web3js.eth.getAccounts(function (error,result) {
                if(!error) {
                    console.log("授权成功,拿到的地址是")
                    console.log(result)
                    return result
                }
           })
            //Promise.all 需要取得所有账户的余额,否则只要一个没有取出,就报错
           const balances = await Promise.all(getedAccounds.map(address=>web3js.eth.getBalance(address)))

           this.setState({
               addresses:getedAccounds.map((account,index)=>{
                    return {address:account,balance:web3js.utils.fromWei(balances[index],"ether")  }
               })
           })
       }
       console.log("已经授权完毕了")
    }

    render() {
        let addresses = this.state.addresses.map((account,index)=>{
            return <li key={index}>{account.address}&nbsp;&nbsp; 余额是&nbsp;&nbsp;[{account.balance} ETH]</li>
        })
        return (
            <ul>{addresses}</ul>
        );
    }
}

export default Accounts;