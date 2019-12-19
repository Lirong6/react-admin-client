import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import './index.less'
import {formatDate} from '../../utils/dateUtils.js'
//import memoryUtils from '../../utils/memoryUtils.js'
//import storageUtils from '../../utils/storageUtils.js'
import {reqWeather} from '../../api'
import menuList from '../../config/menuConfig.js'
import LinkButton from '../link-button'
import {connect} from 'react-redux' 
import {logout} from '../../redux/actions'

class Header extends Component{

  state={
    currentTime:formatDate(Date.now()),//当前时间字符串
    dayPictureUrl:'',//天气图片url
    weather:'',//天气的文本
  }
  //每隔一秒获取当前时间并更新状态
  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime=formatDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  getWeather = async () => {
    //解构
    const {dayPictureUrl,weather} = await reqWeather('北京')
    this.setState({dayPictureUrl,weather})
  }
  
  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if(item.key===path){
        title=item.title
      }else if(item.children){
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        if(cItem){
          title = cItem.title
        }
      }
    })
    return title
  }

  logout = () => {
    Modal.confirm({
      content: '确定退出吗？',
      //要把onOk(){}改造成箭头函数，这样this就用的是外层函数的this了
      onOk:() => {
        //清除user数据
        //storageUtils.removeUser()
        //memoryUtils.user = {}
        
        //跳转到login
        //this.props.history.replace('/login')
        this.props.logout()
      }
    })
  }

  //第一次render后执行一次，一般在此执行异步操作：发Ajax请求、启动定时器
  componentDidMount() {
    this.getTime()
    this.getWeather()
  }
  //不能这么做，不会更新显示了
  // componentWillMount() {
  //   this.title=this.getTitle()
  // }
  //在当前组件卸载之前调用
  componentWillUnmount(){
    //清除定时器
    clearInterval(this.intervalId)
  }

  render(){

    const {currentTime,dayPictureUrl,weather} =this.state
    //const username = memoryUtils.user.username
    const username = this.props.user.username

    //const title = this.getTitle()
    const title = this.props.headTitle

    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {title}
          </div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt='weather'/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({headTitle:state.headTitle,user:state.user}),
  {logout}
)(withRouter(Header))