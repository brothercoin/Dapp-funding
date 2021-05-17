//导入我自定义的web3
import MyWeb3 from "./myWeb3";
//导入Project abi
import Project from "../build/Project.json"
import contract from "./projectList";
import Web3 from "web3"

//Project 是通过ProjectList创建出来的,从ProjectList里面拿
// function getContract(address) {
//     let contract = new MyWeb3.eth.Contract(JSON.parse(Project,address))
// }
//es6 箭头函数写法
// const GetContract = address => new MyWeb3.eth.Contract(JSON.parse(Project.interface,address))
// export default GetContract


const getContract = address => new Web3.eth.Contract(JSON.parse(Project.interface),address)
export default getContract