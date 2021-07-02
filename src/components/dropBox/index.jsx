import React,{Component,useState} from "react";
import './style.css'
  export default class Concat extends Component{
      constructor(props){
          super(props)
          this.state={
                moveFlag: 0,//目标区域的方块拖拽开关
                moveType: 0,
                index: 0,//选中的方块
            
                list:[],//目标区域的方块

                selectStyle: {//框选区域style
                    x:0,
                    y:0,
                    w:0,
                    h:0,
                },
                select: 0,//是否开始框选
                moveAdd: 0,//开始拖进去
                addStyle: {
                    x: 0,
                    y:0
                },
                activeIndex: -1,//激活的box块
                bindMove: 0,//是否拖拽在目标区域外
                selectBorderStyle: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                },
                boxBorder: 0,
                beginLoc: {},
                leftTop: 0,
          }
          
    }

    componentDidMount(){
        window.addEventListener('keyup',this.keyupOperation)
    }

    componentWillUnmount(){
        window.removeEventListener('keyup',this.keyupOperation)
        window.removeEventListener('mouseup',this.moveAddboxEnd)
    }

    // 键盘事件监听
    keyupOperation = (e)=>{
        e.preventDefault()
        let {code} = e,activeIndex = this.state.activeIndex,
        list = this.state.list;
        if(activeIndex>-1){
            if(code == 'Delete'){
                list.splice(this.state.activeIndex,1)
                this.setState({
                    list,
                    activeIndex: -1
                })
            }else{
                if(code == 'ArrowUp'){
                    list[activeIndex].y-=1
                }else if(code == 'ArrowLeft'){
                    list[activeIndex].x-=1
                }else if(code == 'ArrowRight'){
                    list[activeIndex].x+=1
                }else if(code == 'ArrowDown'){
                    list[activeIndex].y+=1
                }
                this.updateBoxList(list)
            }
        }
    }

    //更新boxList
    updateBoxList = (list)=>{
        this.setState({
            list
        })
    }

    // 一起移动
    raceSelectMove = (offsetX,offsetY)=>{
        if(this.state.leftTop) return
        let originPosition = Object.assign({},this.state.selectBorderStyle),list = this.state.list;
        let x = offsetX - originPosition.x, y = offsetY - originPosition.y;

        originPosition.x = offsetX;
        originPosition.y = offsetY;
        console.log(offsetX,offsetY)
        for(let item of list){
            if(item.select){
                item.x = Number(item.x) + x;
                item.y = Number(item.y) + y;
            }
        }
        this.setState({
            list,
            selectBorderStyle: originPosition
        })
    }

    boxMove = (e)=>{
        e.stopPropagation()
        e.preventDefault()
        if(this.state.moveFlag==1&&!this.leftTop){
            if(e.target.classList[0]  != 'page') return
            let {offsetX,offsetY} = e
            console.log(this.state.moveType)
            if(this.state.moveType == 'select'){
                //整体移动
                this.raceSelectMove(offsetX,offsetY)
                return
            }
            let list = this.state.list,item = list[this.state.index];
            list[this.state.index].x = (offsetX-item.w/2)<=0?0:(offsetX-item.w/2)>650?600:(offsetX-item.w/2)
            list[this.state.index].y = offsetY-item.h/2
            this.setState({
                list
            })
        }
    }
    // 目标区域的方块放下拖动
    mouseUp = (e)=>{
        if(this.state.leftTop) return
        this.setState({
            moveFlag: 0
        })
        window.removeEventListener('mousemove',this.boxMove,false)
    }
    // 目标区域的方块开始拖拽
    boxMousedown =(event,i)=>{
        event.stopPropagation()
        event.preventDefault()
        if(this.state.leftTop) return
        let dataset = {
            moveFlag: 1,
            moveType: i,
            index: i,
            activeIndex: i
        }
        if(i == 'select'){
            delete dataset['index']
            delete dataset['activeIndex']
        }
        this.setState(dataset)
        window.addEventListener('mouseup',()=>{
            if(this.state.moveType){
                let list = this.state.list;
                for(let item of list){
                   item.select = 0
                }
                this.setState({
                    list
                })
            }
            this.setState({
                moveFlag: 0
            })
            window.removeEventListener('mousemove',this.boxMove,false)
        })
        window.addEventListener('mousemove',this.boxMove,false)
    }
    // 开始框选
    beginSelect = (e)=>{
        e.stopPropagation()
        e.preventDefault()
        let select = 1;
        let selectBorderStyle = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
        this.setState({
            selectBorderStyle,
            moveType: '',
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
        if(!this.state.select) return
        let {x,y} = this.state.selectStyle,select = 0;
        this.resolveSeletData(x,y,e.screenY,e.screenX,select)
        this.computedSelectBox()
    }


    // 计算框选中的数据
    computedSelectBox = ()=>{
        let { x, y, h, w} = this.state.selectStyle;
        let list = this.state.list;
        let selectList = [];
        let minX,minY,maxX,maxY;
        for(let item of list) {
            if(item.x >= x&&item.x  <= x + w - item.w&&item.y >= y&&item.y <= y + h -item.h){
                    item['select'] = true;
                    if(selectList.length == 0){
                        maxY = item.y + item.h;
                        minX = item.x;
                        minY = item.y;
                        maxX = item.x + item.w;
                    }
                    selectList.push(item)
                    minX = minX > item.x?item.x : minX;
                    minY = minY > item.y?item.y : minY;
                    maxX = maxX < item.x?item.x + item.w: maxX;
                    maxY = maxY < item.y?item.y + item.h: maxY;
               }
        }
        console.log(list)
        if(selectList.length > 0){
            let selectBorderStyle = {
                x: minX,
                y: minY,
                w: maxX - minX,
                h: maxY - minY
            }
            console.log(selectBorderStyle)
            this.setState({
                list,
                boxBorder: 1,
                selectBorderStyle
            })
        }
    }


    // 开始从拖拽区拖进去移动区
    beginMoveAdd = (e)=>{
        this.setState({
            moveAdd: 1
        })
        window.addEventListener('mouseup',this.moveAddboxEnd)
        window.addEventListener('mousemove',this.beginMoveToBox,false)
    }

    moveAddboxEnd = (es)=>{
        if(!this.state.bindMove&&this.state.moveAdd){
            let {offsetX,offsetY} = es
            let list = this.state.list
            let x = (offsetX-50)<=0?0:(offsetX-50)>650?600:(offsetX-50);
            let y = offsetY-50;
            list.push({x,y,active: 0,w:100,h:100})
            this.setState({
                list
            })
        }
        this.setState({
            moveAdd: 0,
            bindMove: 0
        })
        window.removeEventListener('mousemove',this.beginMoveToBox)
    }

    // 拖拽到目标区域过程
    beginMoveToBox = (e)=>{
        if(this.state.moveAdd){
            console.log('拖拽')
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
        let list = this.state.list;
        if(list.length==0) return
        list[index].active = 1;
        this.setState({
            list
        })
    }

    topLeft = (e,i,type)=>{
        console.log(type)
        e.stopPropagation();
        e.preventDefault();
        let {clientX,clientY} = e;
        this.setState({
            leftTop: 1,
            beginLoc:{
                clientX,
                clientY,
                i,
                type
            }
        })
        window.addEventListener('mousemove',this.topLeftMove)
        window.addEventListener('mouseup',this.topLeftmouseUp)
        
    }

    topLeftMove = (e)=>{
        e.stopPropagation();
        e.preventDefault();
        let ev = this.state.beginLoc;
        let list = this.state.list,item = list[ev.i];
        let w = e.offsetX - item.x,
        h = e.offsetY - item.y;
        if(e.target.classList[0] !== 'page') return
        switch(ev.type){
            case 'nw-resize':
                item.x =  e.offsetX;
                item.w -= w;
                item.h -= h;
                item.y =  e.offsetY;
                break
            case 'sw-resize':
                item.x =  e.offsetX;
                item.w -= w;
                item.h = h;
                break
            case 'ne-resize':
                item.w=w;
                item.h -= h;
                item.y =  e.offsetY;
                break
            case 'se-resize':
                item.w = w;
                item.h = h;
                break
            case 'w-resize':
                item.x = e.offsetX;
                item.w -= w;
                break
            case 'n-resize':
                item.h -= h;
                item.y =  e.offsetY;
                break
            case 'e-resize':
                item.w = w;
                break
            default:
                item.h = h
                break
        }

        this.setState({
            list
        })

    }

    topLeftmouseUp = (e)=>{
        this.setState({
            leftTop: 0
        })
        window.removeEventListener('mousemove',this.topLeftMove)
    }
    render(){
        let {x,y,w,h} = this.state.selectBorderStyle,
        directionType = this.state.beginLoc.type,
        boxBorder = {'pointer-events': this.state.leftTop?'none':'auto'};
     return (
        <div className="page-box" style={{cursor: this.state.bindMove?'not-allowed': 'auto'}}>
            <div className="left">
                <div className="move-box" onMouseDown={this.beginMoveAdd} style={{cursor: this.state.bindMove==1?'no-drop': 'auto'}}></div>
            </div>
            <div className={`page  ${!this.state.bindMove&&this.state.moveAdd?'active':''}`}  onMouseDown={this.beginSelect} onMouseMove={this.selectMove} onMouseUp={this.selectUp} style={{cursor: this.state.leftTop?directionType:this.state.moveFlag?'move':'auto'}}>
                {this.state.select?<div className="select" style={{transform: `translate(${this.state.selectStyle.x}px,${this.state.selectStyle.y}px)`,width:`${this.state.selectStyle.w}px`,height:`${this.state.selectStyle.h}px`}}></div>:''}
                {
                    this.state.list.map((v,i)=>{
                        return  (
                            <div className={`box ${i==this.state.activeIndex?'box-active':''}`} key={i}  onMouseDown={(e)=>{this.boxMousedown(e,i)}} onMouseUp={this.mouseUp} style={{transform:`translate(${v.x}px,${v.y}px)`,'pointer-events':this.state.moveFlag||this.state.moveAdd||this.state.select||this.state.leftTop?'none':'auto',width: `${v.w}px`,height:`${v.h}px`}}>
                                {i}
                               {this.state.activeIndex==i?<div> 
                                   <div className="move-type top-left" style={boxBorder} onMouseDown={(e)=>{this.topLeft(e,i,'nw-resize')}}></div>
                                   <div className="move-type left-move" style={boxBorder} onMouseDown={(e)=>{this.topLeft(e,i,'w-resize')}}></div>
                                   <div className="move-type top-move"  style={boxBorder} onMouseDown={(e)=>{this.topLeft(e,i,'n-resize')}}></div>
                                   <div className="move-type right-move" style={boxBorder} onMouseDown={(e)=>{this.topLeft(e,i,'e-resize')}}></div>
                                   <div className="move-type bottom-move" style={boxBorder} onMouseDown={(e)=>{this.topLeft(e,i,'s-resize')}}></div>
                                    <div className="move-type top-right"  style={boxBorder}  onMouseDown={(e)=>{this.topLeft(e,i,'ne-resize')}}></div>
                                    <div className="move-type buttom-left" style={boxBorder} onMouseDown={(e)=>{this.topLeft(e,i,'sw-resize')}}></div>
                                    <div className="move-type buttom-right" style={boxBorder} onMouseDown={(e)=>{this.topLeft(e,i,'se-resize')}}></div></div>:''}
                                 </div>
                        )
                    })
                }
                {
                    this.state.boxBorder?<div className="select-border" onMouseDown={(e)=>{this.boxMousedown(e,'select')}} style={{transform:`translate(${x}px,${y}px)`,width: w+'px',height: h+'px','pointer-events':this.state.moveFlag||this.state.moveAdd||this.state.select?'none':'auto'}}></div>:''
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