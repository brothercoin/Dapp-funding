import React,{Component} from 'react';
import Project from "../build/Project.json";
import Web3 from "web3";
import GetProject from '../libs/project';

class Details extends Component {

    constructor(...args){
        super(...args)

        console.log("address=",this.props.match.params.address)

        this.state = {
            web3js:undefined,
            oneProject:undefined,
            project:{
                address:"",
                description:"",
                minInvest:"0",
                maxInvest:"0",
                goal:"0",
                balance:"0",
                investorCount:"0",
                paymentCount:"0",
                owner:""
            },
            errmsg:"",
            flag:false
        }
    }



    async componentDidMount(){
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

        const address = this.props.match.params.address
        console.log("获得的地址是" + address)

        this.state.oneProject = await (new this.state.web3js.eth.Contract(JSON.parse(Project.interface), address))
        console.log("获得的项目是" + this.state.oneProject)
        let summary = await this.state.oneProject.methods.getSummary().call()
        console.log("获得的摘要" + summary)

        let [description,minInvest,maxInvest,goal,balance,investorCount,paymentCount,owner] = Object.values(summary)
        this.setState({
            project:{address,
                description,
                minInvest,
                maxInvest,
                goal,
                balance,
                investorCount,
                paymentCount,
                owner}
        })
    }

    async contributeEvent() {

        const amount = this.refs["amount"].value
        let {minInvest,maxInvest} = this.state.project
        minInvest = this.state.web3js.utils.fromWei(minInvest,"ether")
        maxInvest = this.state.web3js.utils.fromWei(maxInvest,"ether")

        if(amount<=0) {
            return this.setState({
                errmsg:"投资金额必须大于0"
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

        if( parseInt(amount)<parseInt(minInvest)){
            return this.setState({
                errmsg:"投资金额必须大于或等于最小投资金额"
            })
        }


        if( parseInt(amount)>parseInt(maxInvest)){
            return this.setState({
                errmsg:"投资金额必须小于或等于最大投资金额"
            })
        }

        //获取用户metamask
        const accounts = await this.state.web3js.eth.getAccounts()
        let sender = accounts.toString();
        console.log("发送交易者sender" + sender)
        //const sender = accounts[0]


        const contract = new this.state.web3js.eth.Contract(JSON.parse(Project.interface), sender)
        console.log("拿到的contract")
        console.log(contract)
        //const contract = Project(this.props.match.params.address)
        //投资
        const tx = {from:sender,value:this.state.web3js.utils.toWei(amount,"ether"),gas:5000000}
        console.log("交易信息")
        console.log(tx)
        await contract.methods.contribute().send(tx)
        this.setState({
            flag:true,
            errmsg:""
        })
        //一秒以后刷新下页面
        setTimeout(function(){
            window.location.reload()
        },1000)
    }

    async getEth() {
        const accounts = await this.state.web3js.eth.getAccounts()
        let sender = accounts[0]

        const contract = Project(this.props.match.params.address)
        await contract.methods.doEther().send({from:sender,gas:"5000000"})
        alert("拿钱成功")
        setTimeout(function(){
            window.location.reload()
        },1000)
    }


    renderProject(project){

        return (


            <div className="col-md-6">
                <div className="panel panel-default">
                    <div className="panel-heading">{project.description}</div>


                    <div className="panel-body">

                        <div className="progress">
                            <div  className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" >
                                <span className="sr-only">45% Complete</span>
                            </div>
                        </div>

                    </div>


                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>募资上限</th>
                            <th>最小投资金额</th>
                            <th>最大投资金额</th>
                            <th>参投人数</th>
                            <th>已募集资金数量</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{Web3.utils.fromWei(project.goal,"ether")} ETH</td>
                            <td>{Web3.utils.fromWei(project.minInvest,"ether")} ETH</td>
                            <td>{Web3.utils.fromWei(project.maxInvest,"ether")} ETH</td>
                            <td>{project.investorCount} 人</td>
                            <td>{Web3.utils.fromWei(project.balance,"ether")} ETH</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="5">
                                <div className="input-group">
                                    <input type="text" ref="amount" className="form-control" placeholder="单位:以太(ETH)" />
                                    <span className="input-group-btn">
    <button className="btn btn-primary" type="button" onClick={this.contributeEvent.bind(this)}>立即投资</button>
                                    </span>
                                </div>
                            </td>
                        </tr>


                        <tr>
                            <td colSpan="5">
                                <button className="btn btn-success" type="button" onClick={this.getEth.bind(this)}>资金划出</button>
                            </td>
                        </tr>


                        </tfoot>
                    </table>
                </div>
            </div>




        );
    }



    render() {

        return (
            <div className="container" style={{marginTop:"50px"}}>
                <div className="page-header">
                    <h2>项目详情</h2>
                </div>
                {this.state.errmsg!=''?<div className="alert alert-danger" role="alert">{this.state.errmsg}</div>:""}
                <div className="row" >
                    {this.renderProject(this.state.project)}
                </div>
            </div>
        )
    }
}

export default Details;
