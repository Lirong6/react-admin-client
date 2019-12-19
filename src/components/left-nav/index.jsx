import React,{Component} from 'react'
import './index.less'
import logo from '../../assets/images/logo.png'
import {Link,withRouter} from 'react-router-dom'
import {Menu,Icon} from 'antd'
import menuList from '../../config/menuConfig.js'
//import memoryUtils from '../../utils/memoryUtils'
import {connect} from 'react-redux'
import {setHeadTitle} from '../../redux/actions'
//const SubMenu = Menu.SubMenu
const {SubMenu} = Menu

class LeftNav extends Component{
  //根据menu的数据数组生成对应的标签数组
  //reduce+递归
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.reduce((pre,item) => {
      //如果当前用户有item对应的权限，才需要显示对应的菜单项
      if(this.hasAuth(item)){
        
        if(!item.children){
          //解决刷新之后headTitle变为初始值，不与当前标签匹配问题
          if(item.key === path || path.indexOf(item.key) === 0){
            //更新store中的header状态
            this.props.setHeadTitle(item.title)
          }
        
          pre.push((
            <Menu.Item key={item.key}>
              <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          ))
        }else{
          //查找一个与当前请求路径匹配的子item
          const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
          //如果存在，当前item的子列表需要打开
          if(cItem){
            this.openKey = item.key
          }
          
  
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon}/>
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      
      return pre
    },[])
  }

  //判断当前登陆用户对item是否有权限
  hasAuth = (item) => {
    const {key,isPublic} = item
    //const menus = memoryUtils.user.role.menus
    //const username = memoryUtils.user.username
    const menus = this.props.user.role.menus
    const username = this.props.user.username
    /** 
     * 1、如果当前用户是admin，return true
     * 2、当前用户有item权限，看key在不在menus中
     * 3、如果当前item是公开的isPublic为true
     * 4、如果当前用户有此item的某个子item的权限
    */
   if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
     return true
   }else if(item.children){
     return !!(item.children.find(child => menus.indexOf(child.key)!==-1))
   }
   return false
  }

  //在第一次render之前执行一次，一般用作：为第一次render做准备数据（同步请求）
  componentWillMount(){
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render(){
    //取到node，但每次render都会重新取值，不太好，放进componentWillMount中
    //const menuNodes = this.getMenuNodes(menuList)
    //得到当前路径
    let path=this.props.location.pathname
    //解决product子路由无法选中左导航栏标签问题
    if(path.indexOf('/product')===0){
      path='/product'
    }
  
    //得到需要打开的openKey
    const openKey = this.openKey

    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt='logo'/>
          <h1>后台管理系统</h1>
        </Link>

        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
      
    )
  }
}
export default connect(
  state => ({user:state.user}),
  {setHeadTitle}
)(withRouter(LeftNav))
/*
map和递归实现getMenuNodes
getMenuNodes = (menuList) => {
  return menuList.map(item => {
    if(!item.children){
      return (
        <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
      )
    }else{
      return (
        <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
        </SubMenu>
      )
    }
  })
}
*/
/*
withRouter高阶组件
包装非路由组件（LeftNav是非路由组件，无法取到history、match、location，所以需要包装），返回一个新的组件
新的组件向非路由组件传递history、location、match
*/