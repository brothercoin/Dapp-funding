//导入我根据场景拿到的web3
import MyWeb3 from "./myWeb3";
//拿到ProjectList 的abi
import Projectlist from "../build/ProjectList.json"
import address from "../build/address.json"

//通过abi和合约地址拿到 contract
//abi是字符串,需要转换为对象
const  ContractList = new MyWeb3.eth.Contract(JSON.parse(Projectlist.interface),address)

export default ContractList