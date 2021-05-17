//脚本: 执行别名:npm run compile (在package.json设置了)
const fs = require("fs-extra")
const path = require("path")
const solc = require("solc")
//定义编译后json文件的存储目录和每次编译都必须删除的目录
const compileDir = path.resolve(__dirname,"../src/build")

// cleanup 清除后再生成
fs.removeSync(compileDir)
fs.ensureDirSync(compileDir) //表示真的清除文件目录缓存

//获取指定目录下有多少个文件
const files = fs.readdirSync( path.resolve(__dirname,"../contracts") )
console.log("files" + files)

//遍历所有合约文件
files.map( src=> {
    console.log("src文件是"+src)
    if (src.lastIndexOf(".sol") != -1) {
        console.log("是.sol文件")
        const solFile = path.resolve(__dirname, "../contracts", src)
        console.log("solFile文件是" + solFile )

        const content = fs.readFileSync(solFile,"utf8")
        //调用solc去编译合约的内容
        const res = solc.compile(content,1)

        //console.log(res.errors)
        if( Array.isArray(res.errors) && res.errors.length>0){

            res.errors.map(errStr=>{
                if( errStr.indexOf("Error") != -1){
                    throw new Error("编译合约失败：",res.errors)
                }
            })
        }
        Object.keys(res.contracts).map( name=>{
            const contractJsonName = name.replace(/^:/,"") + ".json"
            const filePath = path.resolve(__dirname,"../src/build",contractJsonName)
            fs.outputJsonSync(filePath,res.contracts[name])
            console.log(filePath," -  compile successfuly.")
        } )
    }
} )
