import React,{PureComponent} from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree

export default class AuthForm extends PureComponent{

  static propTypes = {
    role:PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    const {menus} = this.props.role
    this.state ={
      checkedKeys:menus
    }
  }

  //为父组件获取最新menus的方法
  getMenus = () => this.state.checkedKeys

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre,item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>)
      return pre
    },[])
  }

  //选中某个复选框
  onCheck = (checkedKeys) => {
    this.setState({checkedKeys})
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  
  //根据新传入的role来更新checkedKeys状态，这个生命周期方法是组件接收到新的属性才会调用，且是在render之前调用，初始显示是不会调用的
  componentWillReceiveProps(nextProps){
    console.log(' componentWillReceiveProps()',nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys:menus
    })
  }

  render(){
    console.log('AuthForm render()')
    const {role} = this.props
    const {checkedKeys} = this.state
  
    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }
  
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title='平台权限' key='all'>
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
       
      
    )
  }
}