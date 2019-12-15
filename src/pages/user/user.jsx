import React,{Component} from 'react'
import {Card,Table,Button,Modal,message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {formatDate} from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api'
import UserForm from './user-form'

export default class User extends Component{

  state = {
    isShow:false,
    loading:false,
    users:[],
    roles:[],//所有角色的列表
  }

  initColumns = () => {
    this.columns = [
      {
        title:'用户名',
        dataIndex:'username'
      },
      {
        title:'邮箱',
        dataIndex:'email'
      },
      {
        title:'电话',
        dataIndex:'phone'
      },
      {
        title:'注册时间',
        dataIndex:'create_time',
        render:formatDate
      },
      {
        title:'所属角色',
        dataIndex:'role_id',
        //render:(role_id) => this.state.roles.find(role => role._id === role_id).name     效率低，会每行都遍历查找一次
        render:(role_id) => this.roleNames[role_id]
      },
      {
        title:'操作',
        render:(user) =>{
          return (
            <span>
              <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
            </span>
          )
        }
      }
    ]
  }

  //显示添加页面
  showAdd = () => {
    this.user = null  //去除前面保存的user
    this.setState({isShow:true})
  }

  //显示修改页面
  showUpdate = (user) => {
    this.user = user //保存user
    this.setState({isShow:true})
  }

  //删除用户
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if(result.status === 0){
          message.success('删除用户成功')
          this.getUsers()
        }
      }
    })
  }

  getUsers = async () => {
    const result = await reqUsers()
    if(result.status===0){
      const {users,roles} = result.data
      this.initRoleNames(roles)
      this.setState({users,roles})
    }
  }

  addOrUpdateUser = async () => {
    this.setState({isShow:false})
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    
    //如果是更新，需要给user指定_id属性
    if(this.user){
      user._id = this.user._id
    }
    const result = await reqAddOrUpdateUser(user)
    if(result.status===0){
      message.success(`${this.user?'修改':'添加'}用户成功`)
      this.getUsers()
    }
  } 

  initRoleNames = (roles) => {
    //根据role的数组生成包含所有角色名的对象，属性名是角色id值_id,属性值是角色名称name
    const roleNames = roles.reduce((pre,role) => {
      pre[role._id] = role.name
      return pre
    },{})
    //保存起来
    this.roleNames = roleNames
  }

  componentWillMount(){
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render(){
  
    const {loading,users,isShow,roles} = this.state
  
    const user = this.user || {}
  
    const title = (
      <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    )
  
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize:PAGE_SIZE,showQuickJumper:true}}
        >
        </Table>
        <Modal
          title={user._id?'修改用户':'添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {this.setState({isShow:false}); this.form.resetFields()}}
        >
          <UserForm setForm={form => this.form = form} roles={roles} user={user}/>
        </Modal>
      </Card>
    )
  }
}