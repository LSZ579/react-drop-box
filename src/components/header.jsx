

import React , {Component} from 'react';


export default class Header extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div>
                <div>{this.props.title}</div>
                <button onClick={()=>{this.props.fun('5555')}}>传值给父</button>
            </div>
        )
    }
}