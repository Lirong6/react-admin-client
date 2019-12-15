import React,{PureComponent} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
class UserForm extends PureComponent{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired,
    roles:PropTypes.array.isRequired,
    user:PropTypes.object
  }

  //对密码进行自定义验证
  validatePwd = (rule,value,callback) => {
    if(!value){
      callback('必须输入密码')
    }else if(value.length<4){
      callback('长度不能小于4位')
    }else if(value.length>12){
      callback('长度不能大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('必须是英文字母、数字、下划线')
    }else{
      callback()
    }
    //callback()//验证通过
    //callback('')//验证失败并指定提示文本
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){
    const {roles} = this.props
    const user = this.props.user

    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label='用户名：'>
          {
            getFieldDecorator('username',{
              initialValue:user.username,
              rules:[
                {required:true,message:'必须输入用户名'},
                {min:4,message:'最少4位'},
                {max:12,message:'最多12位'},
                {pattern:/^[a-zA-Z0-9_]+$/,message:'必须是英文字母、数字、下划线'}
              ]
            })(
               <Input placeholder='请输入用户名'></Input>
            )
          }
        </Item>

        {
          user._id?null:(
            <Item label='密码：'>
          {
            getFieldDecorator('password',{
              initialValue:user.password,
              rules:[
                {required:true,message:'必须输入密码'},
                {validator:this.validatePwd}
              ]
            })(
               <Input type='password' placeholder='请输入密码'></Input>
            )
          }
        </Item>
          )
        }
        
        <Item label='手机号：'>
          {
            getFieldDecorator('phone',{
              initialValue:user.phone,
              rules:[{
                required:true,
                message:'必须输入手机号'
              }]
            })(
               <Input placeholder='请输入手机号'></Input>
            )
          }
        </Item>

        <Item label='邮箱：'>
          {
            getFieldDecorator('email',{
              initialValue:user.email,
            })(
               <Input placeholder='请输入邮箱'></Input>
            )
          }
        </Item>

        <Item label='角色：'>
          {
            getFieldDecorator('role_id',{
              initialValue:user.role_id
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>

      </Form>
    )
  }
}
export default Form.create()(UserForm)