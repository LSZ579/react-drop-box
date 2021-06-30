import React,{Component,useState} from "react";
import './style.css'
  export default class Concat extends Component{
      constructor(props){
          super(props)
          this.state={
                flag: 0,//目标区域的方块拖拽开关
                index: 0,//选中的方块
            
                list:[],//目标区域的方块

                selectStyle: {
                    x:0,
                    y:0,
                    w:0,
                    h:0,
                },
                select: 0,
                moveAdd: 0,//开始拖进去
                addStyle: {
                    x: 0,
                    y:0
                },
                activeIndex: -1,
                bindMove: 0,
          }
      }
    
    move = (e)=>{
        e.stopPropagation()
        e.preventDefault()
        if(this.state.flag==1){
            if(e.target.classList[0]  != 'page') return
            let {offsetX,offsetY} = e
            console.log(offsetX,offsetY)
            let list = this.state.list
            list[this.state.index].x = (offsetX-50)<=0?0:(offsetX-50)>650?600:(offsetX-50)
            list[this.state.index].y = offsetY-50
            this.setState({
                list
            })
        }
    }
    // 目标区域的方块放下拖动
    mouseUp = (e)=>{
        this.setState({
            flag: 0
        })
        window.removeEventListener('mousemove',this.move,false)
    }
    // 目标区域的方块开始拖拽
    down =(event,i)=>{
        event.stopPropagation()
        event.preventDefault()
        this.setState({
            flag: 1,
            index: i,
            activeIndex: i
        })
        window.addEventListener('mouseup',()=>{
            this.setState({
                flag: 0
            })
            window.removeEventListener('mousemove',this.move,false)
        })
        window.addEventListener('mousemove',this.move,false)
    }
    // 开始框选
    beginSelect = (e)=>{
        e.stopPropagation()
        e.preventDefault()
        let select = 1;
        this.setState({
            activeIndex: -1
        })
        this.resolveSeletData(e.nativeEvent.offsetX,e.nativeEvent.offsetY,0,0,select)
    }
    // 框选过程
    selectMove = (e)=>{
       if(this.state.select){
            let {x,y} = this.state.selectStyle
            let w = e.nativeEvent.offsetX - x,
            h = e.nativeEvent.offsetY - y,
            select = 1;
            this.resolveSeletData(x,y,h,w,select)
       }
    }

    // 框选数据处理
    resolveSeletData = (x,y,h,w,select)=>{
        let selectStyle  = {x,y,h,w}
        this.setState({
            selectStyle,
            select
        })
    }

    // 框选结束
    selectUp = (e)=>{
        let {x,y} = this.state.selectStyle,select = 0;
        this.resolveSeletData(x,y,e.screenY,e.screenX,select)

    }

    // 开始从拖拽区拖进去移动区
    beginMoveAdd = (e)=>{
        this.setState({
            moveAdd: 1
        })
        window.addEventListener('mouseup',(es)=>{
            if(!this.state.bindMove&&this.state.moveAdd){
                let {offsetX,offsetY} = es
                let list = this.state.list
                let x = (offsetX-50)<=0?0:(offsetX-50)>650?600:(offsetX-50);
                let y = offsetY-50;
                list.push({x,y,active: 0})
                this.setState({
                    list
                })
            }
            this.setState({
                moveAdd: 0,
                bindMove: 0
            })
            window.removeEventListener('mousemove',this.beginMoveToBox)
        })
        window.addEventListener('mousemove',this.beginMoveToBox,false)
    }

    // 拖拽到目标区域过程
    beginMoveToBox = (e)=>{
        if(this.state.moveAdd){
            // console.log('bind',e.target.className != 'page',e.target.className)
            if(e.target.classList[0] != 'page') {
                this.setState({
                    bindMove: 1
                })
            }else{
                this.setState({
                    bindMove: 0
                })
            }
            let {x,y} = e
            x = x - 50;
            y = y - 100 
            this.setState({
                addStyle:{
                    x,y
                }
            })
            
        }
    }

    // 激活方块
    activeBox = (index)=>{
        if(this.state.moveAdd) return 
        console.log(index,8888)
        let list = this.state.list;
        if(list.length==0) return
        list[index].active = 1;
        this.setState({
            list
        })
    }

    render(){
     return (
        <div className="page-box" style={{cursor: this.state.bindMove?'not-allowed': 'auto'}}>
            <div className="left">
                <div className="move-box" onMouseDown={this.beginMoveAdd} style={{cursor: this.state.bindMove==1?'no-drop': 'auto'}}></div>
            </div>
            <div className={`page  ${!this.state.bindMove&&this.state.moveAdd?'active':''}`}  onMouseDown={this.beginSelect} onMouseMove={this.selectMove} onMouseUp={this.selectUp} style={this.state.flag?{cursor: 'move'}:{}}>
                {this.state.select?<div className="select" style={{transform: `translate(${this.state.selectStyle.x}px,${this.state.selectStyle.y}px)`,width:`${this.state.selectStyle.w}px`,height:`${this.state.selectStyle.h}px`}}></div>:''}
                {
                    this.state.list.map((v,i)=>{
                        return  <div className={`box ${i==this.state.activeIndex?'box-active':''}`} key={i}  onMouseDown={(e)=>{this.down(e,i)}} onMouseUp={this.mouseUp} style={{transform:`translate(${v.x}px,${v.y}px)`,'pointer-events':this.state.flag||this.state.moveAdd||this.state.select?'none':'auto'}}>{i}</div>
                    })
                }
            </div>
            {this.state.moveAdd?<div className="box" style={{transform:`translate(${this.state.addStyle.x}px,${this.state.addStyle.y}px)`,'pointer-events': 'none'}}></div>
                :''    
                }
           
        </div>
     )   
    }
    

}

// export default Concat;