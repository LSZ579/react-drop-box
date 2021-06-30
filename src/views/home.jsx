

import React ,{Component} from 'react'

import Header from '../components/header'
import DropBox from '../components/dropBox/index'


export default class HomePage extends Component{
        constructor(props){
            super(props)
            this.state={
                cu:1
            }
            this.childs = React.createRef();
            console.log(this.childs)
        }  
        child = (e)=>{
            console.log(e)
        }
        render(){
            return (
                <div>
                    <Header title="头部导航" fun={this.child}  ref={this.childs}></Header>
                    <DropBox></DropBox>
                </div>
            )
        }
}