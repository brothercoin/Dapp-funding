import React,{Component} from 'react';
//安装路由插件
import {BrowserRouter,Switch,Route} from "react-router-dom"
import Web3 from "web3"
import Project from "../build/Project.json"
import Projects from "./projects";
import CreateProjects from "./createProjects"
import Details from "./details"

class App extends Component {
    constructor(...args) {
        super(...args);
    }

    render() {
        console.log(Web3)
        console.log(Project)
        return (
            <div>

                <nav className="navbar navbar-inverse navbar-fix-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                    data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="/">Dapp众筹_余满贵</a>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li className="active"><a href="/">项目列表</a></li>
                            <li><a href="/CreateProjects">项目发起</a></li>
                        </ul>
                    </div>
                </nav>
                {/*路由*/}
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Projects}></Route>
                        <Route exact path="/details/:address" component={Details} />
                        <Route exact path="/CreateProjects" component={CreateProjects} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;
