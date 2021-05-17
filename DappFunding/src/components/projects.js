import React,{Component} from 'react';
import ContractList from "../libs/projectList"
import GetContract from "../libs/project"
import Web3 from "web3"
import MyWeb3 from "../libs/myWeb3";
import Projectlist from "../build/ProjectList.json";
import ProjectListAddress from "../build/address.json";
import Project from "../build/Project.json";


class Projects extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            projects:[]
        }
    }


    renderProject(project,index) {
        return (
            <div className="col-md-6" key={index}>
                <div className="panel panel-default">
                    <div className="panel-heading">项目名称:{project.description}</div>


                    <div className="panel-body">

                        <div className="progress">
                            <div aria-valuenow=""  className="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" >
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
                            <td colSpan="5" className="text-center">
                                <a className="btn  btn-sm btn-primary" href={`/details/${project.address}`}>立即投资</a>&nbsp;&nbsp;

                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        //首先需要拿到web3
        if (window.ethereum) {
            var web3Provider = window.ethereum
            try {
                window.ethereum.enable();
            } catch (e) {
                console.error("用户禁止授权")
            }

            let web3js = new Web3(web3Provider)
            const  ContractList = new web3js.eth.Contract(JSON.parse(Projectlist.interface),ProjectListAddress)
            //拿所有项目的address
            const addresses = await ContractList.methods.getProjects().call()
            //通过地址拿到所有项目的摘要
            //=>多行的时候 需要return
            const summaryList = await Promise.all(addresses.map((address,index)=> {
                const oneProject = new web3js.eth.Contract(JSON.parse(Project.interface), addresses[index])
                console.log(oneProject)
                return oneProject.methods.getSummary().call()
            }))

            //结构赋值 变成数组
            const projects = addresses.map((address,index)=>{
                let [description,minInvest,maxInvest,goal,balance,investorCount,paymentCount,owner] = Object.values(summaryList[index])
                return {address,
                    description,
                    minInvest,
                    maxInvest,
                    goal,
                    balance,
                    investorCount,
                    paymentCount,
                    owner}
            })
            //setState更新
            this.setState({projects})
        }
    }

    render() {
        //循环载入
        let _projects = this.state.projects.map( (project,index)=>this.renderProject(project,index) )
        return (
            <div className="container" style={{marginTop:"50px"}}>
                <div className="page-header">
                    <h2>项目列表</h2>
                </div>
                <div className="row" >
                    {_projects}
                </div>
            </div>
        )
    }
}

export default Projects;