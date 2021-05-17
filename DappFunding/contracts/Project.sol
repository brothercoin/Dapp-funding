pragma solidity ^0.4.22;

//导入安全的数学库 数字的加减乘除溢出等异常操作
//import "./SafeMath.sol";
/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract ProjectList {
    //uint 使用SafeMath 安全库
    using SafeMath for uint;
    //所有项目的合约地址
    address [] public projectAddresses;
    function createProject(string _description,uint _minInvest,uint _maxInvest,uint _goal) public {
        //创建项目 ,拿到项目的合约地址  //也可以是一个实例:Project instance = new Project....
        address projectAdr = new Project(msg.sender,_description,_minInvest,_maxInvest,_goal);
        projectAddresses.push(projectAdr);
    }
    //拿到所有合约地址
    function getProjects() view public returns(address[]) {
        return projectAddresses;
    }



}

contract Project {
    //uint 使用SafeMath 这个安全库
    using SafeMath for uint;
    /*
    专项支出
    项目中的专项支出描述,所需金额,资金接收人,是否完成投票,投票人列表(bool标记是否已经投过了),投票数
    */
    struct Payment {
        string desc;
        uint amount;
        address receiver;
        bool completed;
        mapping(address=>bool) voters;
        uint voteCount;
    }
    /* 项目发起人,项目描述(ipfs url),起投额,最大限额,项目众筹金额目标,投资人个数,投资人列表(地址对应票数)*/
    address public owner;
    string public description;
    uint public minInvest;
    uint public maxInvest;
    uint public goal;
    uint investorCount;
    mapping(address=>uint) investors;

    /*专项资金列表(项目中,分阶段,分小项目的支出投票)*/
    Payment[] public paymentList;

    //modifier 过滤修饰函数 表示必须先执行这个函数
    //通常可用于权限控制
    modifier MustContractCreator() {
        require(owner == msg.sender,"发起者必须是合约的拥有者");
        //占位符 标示后面所有语句
        _;
    }

    //初始化项目
    constructor(address _owner,string _description,uint _minInvest,uint _maxInvest,uint _goal) public {
        owner = _owner;
        description = _description;
        minInvest = _minInvest;
        maxInvest = _maxInvest;
        goal = _goal;
    }
    //投资人进行投资
    function contribute() payable public {
        require(msg.value>=minInvest,"必须大于最小投资额度");
        require(msg.value<=maxInvest,"必须小于最大投资额度");
        //不能超过投资最大额度
        //uint newResult = address(this).balance + msg.value;
        //使用安全库加法
        uint newResult = 0;
        newResult = address(this).balance.add(msg.value);
        require(newResult<= goal,"超过了总投资额");
        //投资人拥有的票数
        investors[msg.sender] = msg.value;
        investorCount += 1;
    }

    //构造项目资金请求
    function createPayment(string _desc,uint _account,address _receiver) public MustContractCreator {
        //构造payment  注意需要memory
        Payment memory payment = Payment({
            desc:_desc,
            amount:_account,
            receiver:_receiver,
            completed:false,
            voteCount:0
        });
        //放到资金项目请求列表里面
        paymentList.push(payment);
    }

    //股东投票
    function approvePayment(uint index) public {
        //注意这里是storage
        Payment storage payment = paymentList[index];
        require(!payment.completed,"当前资金请求已经投票结束了");
        require(!payment.voters[msg.sender],"此股东已经投过票了");
        payment.voters[msg.sender] = true;
        payment.voteCount +=1;
    }

    //投票数如果过半 可以转出资金
    function doPayment(uint index) public MustContractCreator {
        //注意这里是storage
        Payment storage payment = paymentList[index];
        require(!payment.completed,"当前资金请求已经投票结束了");
        //合约的账户越大于可转出金额
        require(address (this).balance>=payment.amount,"合约资金账户不够支付");
        //注意此处(investorCount/2) 刮号刮起来 投票数大于总共股东一半
        require(payment.voteCount > (investorCount/2),"投票同意数没有过半");
        //支付项目资金
        payment.receiver.transfer(payment.amount);
        //标记项目结束
        payment.completed = true;
    }
    //返回project项目摘要信息
    function getSummary() public view returns (string, uint, uint, uint, uint, uint, uint, address){
        return (
            description,
            minInvest,
            maxInvest,
            goal,
            address(this).balance,
            investorCount,
            paymentList.length,
            owner
        );
    }

    //本文件中有转账兑换功能,需要使用payable 必须先声明
    function() payable public {}
}