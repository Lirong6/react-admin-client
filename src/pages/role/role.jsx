import React,{Component} from 'react'
import {Card,Table,Button,Modal,message} from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
//import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils'
import {formatDate} from '../../utils/dateUtils'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'

class Role extends Component{
  
  state = {
    roles:[], //所有角色的列表
    role:{}, //选中的role
    isShowAdd:false,
    isShowAuth:false,
  }

  constructor(props){
    super(props)

    this.auth = React.createRef()
  }

  initColumn = () => {
    this.columns = [
      {
        title:'角色名称',
        dataIndex:'name',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        render:(create_time) => formatDate(create_time)
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        render:formatDate
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
      }
    ]
  }

  getRoles = async() => {
    const result = await reqRoles()
    if(result.status===0){
      const roles = result.data
      this.setState({roles})
    }
  }

  //这里的role是从数组里面取得，是roles的一个引用变量，所以改role会影响到roles
  onRow = (role) => {
    return {
      onClick:event => {
        this.setState({role})
      }
    }
  }

  addRole = () => {
    //进行表单验证，通过了才继续处理
    this.form.validateFields(async (err,values) => {
      if(!err){
        this.setState({isShowAdd:false})

        const {roleName} = values
        this.form.resetFields()
        const result = await reqAddRole(roleName)
        if(result.status===0){
          message.success('添加角色成功')
          //this.getRoles()不用重新获取列表了
          //返回体可以取到role
          const role = result.data
          //更新roles状态
          //const roles = this.state.roles  尽量不要直接更新状态数据，而要把他复制到一个新的对象中操作
          // const roles = [...this.state.role]
          // roles.push(role)
          // this.setState({roles})
          //推荐基于原本的状态数据更新
          this.setState(state => ({
            roles:[...state.roles,role]
          }))
        }else{
          message.error('添加角色失败')
        }
      }
    })
   
    
  }

  //更新角色
  updateRole = async () => {
    this.setState({isShowAuth:false})
    const role = this.state.role
    const menus = this.auth.current.getMenus()
    role.menus = menus //改role会影响到roles
    role.auth_name = this.props.user.username
    role.auth_time = Date.now()
    
    const result = await reqUpdateRole(role)
    if(result.status===0){
     
      //如果当前更新的是自己角色的权限，需要强制退出
      if(role._id=== this.props.user.role_id){
        // memoryUtils.user = {}
        // storageUtils.removeUser()
        // this.props.history.replace('/login')
        this.props.logout()
        message.success('当前用户权限修改，请重新登陆')
      }else{
        message.success('设置权限成功')
        this.setState({
          roles:[...this.state.roles]
        })
      }
      
    }
  }

  componentWillMount(){
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render(){
  
    const {roles,role,isShowAdd,isShowAuth} = this.state
  
    const title=(
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd:true})}>创建角色</Button> &nbsp;&nbsp;
        <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth:true})}>设置权限</Button>
      </span>
    )
  
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={this.columns}
          rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect: (role) => {
              this.setState({
                role
              })
            }
          }}
          onRow={this.onRow}
          pagination={{defaultPageSize:PAGE_SIZE}}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {this.setState({isShowAdd:false});this.form.resetFields()}}
          okText="确认"
          cancelText="取消"
        >
          <AddForm
            setForm={(form)=>{this.form = form}}
          />
        </Modal>
        <Modal
          title="设置权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {this.setState({isShowAuth:false});}}
          okText="确认"
          cancelText="取消"
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}
export default connect(
  state => ({user:state.user}),
  {logout}
)(Role)