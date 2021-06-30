import React,{Component} from "react";


export default class  About extends Component{
    constructor(props){
        console.log(props)
        super()
        this.state={
            flag: false,
            style:{color:'red'}
        }
    }
    toNext=()=>{
        console.log(this)
        this.setState({
            flag: !this.state.flag
        })
        // this.props.history.push('home')
    }
    render() {
     return (
        <div>
            {this.state.flag? <div>关闭</div>:<div>打开</div>}
             <div style={this.state.style}>我是关于页面</div>
            <button onClick={this.toNext}>添砖</button>
        </div>
     )   
    }

}