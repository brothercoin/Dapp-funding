import React,{Component} from 'react';
import ContractList from "../libs/projectList"
import Web3 from "web3"
import Projects from "./projects";
import ProjectList from '../libs/projectList';
import Projectlist from "../build/ProjectList.json";
import ProjectListAddress from "../build/address.json";

class CreateProjects extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            web3js:undefined,
            //获取metamask的账户是什么
            addresses:[],
            //描述
            description:'',
            //最小投资金额
            minInvest:0,
            //最大投资金额
            maxInvest:0,
            //上限
            goal:0,
            //错误提示信息
            errmsg:'',
            //标示成功发起项目成功与否
            flag:false
        }
    }

    async componentDidMount() {
        //获取浏览器中的web3,即metamask
        if (!this.state.web3js) {
            if (window.ethereum) {
                var web3Provider = window.ethereum
                try {
                    window.ethereum.enable();
                } catch (e) {
                    console.error("用户禁止授权")
                }
                this.state.web3js = new Web3(web3Provider)
            }
        }
        const getAccount = await this.state.web3js.eth.getAccounts()
        const currentAccount = getAccount.toString()
        const currentBalance = await this.state.web3js.eth.getBalance(currentAccount)
        console.log("获得地址和余额分别为"+ currentAccount + currentBalance)
        let balance = this.state.web3js.utils.fromWei(currentBalance,"ether")
        let showStr = currentAccount.concat("  余额是: " + balance + "  ETH");
        this.setState({
            addresses:showStr
        })
    }

    async newProject(){
        let description = this.refs["description"].value
        let minInvest = this.refs["minInvest"].value
        let maxInvest = this.refs["maxInvest"].value
        let goal = this.refs["goal"].value

        if(!description){
            return this.setState({
                errmsg:"项目描述不能为空！"
            })
        }

        if(minInvest<=0){
            return this.setState({
                errmsg:"最小投资金额不能为0或者负数！"
            })
        }

        if(maxInvest<=0){
            return this.setState({
                errmsg:"最大投资金额不能为0或者负数！"
            })
        }



        if( parseInt(minInvest)>parseInt(maxInvest)){
            return this.setState({
                errmsg:"最小投资金额必须小于等于最大投资金额"
            })
        }

        if(goal<=0){
            return this.setState({
                errmsg:"上限金额不能为0或者负数！"
            })
        }


        let minInvestWei = this.state.web3js.utils.toWei(minInvest,"ether")
        let maxInvestWei = this.state.web3js.utils.toWei(maxInvest,"ether")
        let goalWei = this.state.web3js.utils.toWei(goal,"ether")

        //获取metamask的账户
        let accounts = await this.state.web3js.eth.getAccounts()
        let owner = accounts.toString();

        //创建
        const  ContractList = new this.state.web3js.eth.Contract(JSON.parse(Projectlist.interface),ProjectListAddress)
        console.log("拿到实例ContractList")
        console.log(ContractList)
        console.log("拿到实例ContractList")
        //function createProject(string _description,uint _minInvest,uint _maxInvest,uint _goal) public {
        console.log("描述信息如下")
        console.log(description + minInvestWei + maxInvestWei + goalWei)
        console.log(owner)
        console.log("上面是owner")
        await ContractList.methods.createProject(description,minInvestWei,maxInvestWei,goalWei).send({from:owner,gas:"5000000"}, function(error, transactionHash){
            console.log("创建项目的交易hash:" + transactionHash)
        });
        this.setState({
            flag:true,
            errmsg:''
        })
    }

    render() {
        return (
            <div className="container" style={{marginTop:"50px"}}>
                <div className="page-header">
                    <h2>发起项目</h2>
                   当期账户地址: {this.state.addresses}
                </div>

                {this.state.errmsg!=''?<div className="alert alert-danger" role="alert">{this.state.errmsg}</div>:""}
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="projectDesc">项目描述:</label>
                        <input type="text" className="form-control" id="projectDesc" ref="description" placeholder="例如:项目名称" />

                        <label htmlFor="ProjectminInvest">最小投资金额:</label>
                        <div className="input-group">
                            <input type="text" id="ProjectminInvest" ref="minInvest" className="form-control" placeholder="单位:以太（ETH）" aria-describedby="basic-addon2" />
                            <span className="input-group-addon" id="basic-addon2">以太(ETH)</span>
                        </div>


                        <label htmlFor="ProjectmaxInvest">最大投资金额:</label>
                        <div className="input-group">
                            <input type="text" id="ProjectmaxInvest" ref="maxInvest" className="form-control" placeholder="单位:以太（ETH）" aria-describedby="basic-addon2" />
                            <span className="input-group-addon" id="basic-addon2">以太(ETH)</span>
                        </div>



                        <label htmlFor="ProjectmaxInvest">募资上限:</label>
                        <div className="input-group">
                            <input type="text" id="Projectgoal" ref="goal" className="form-control" placeholder="单位:以太（ETH）" aria-describedby="basic-addon2" />
                            <span className="input-group-addon" id="basic-addon2">以太(ETH)</span>
                        </div>

                    </div>

                    {this.state.flag ? <div className="alert alert-success">项目创建已成功</div>: <button className="btn btn-primary btn-lg" onClick={this.newProject.bind(this)}>创建项目</button>}


                </div>


            </div>
        )
    }

}

export default CreateProjects;