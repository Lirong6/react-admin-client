import React,{Component} from 'react'
import {Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
class AddForm extends Component{
  //接收父组件参数
  static propTypes = {
    setForm:PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){

    const formItemLayout = {
      labelCol:{span:4},
      wrapperCol:{span:15}
    }

    const {getFieldDecorator} = this.props.form
    return (
      <Form {...formItemLayout}>

        <Item label='角色名称：'>
          {
            getFieldDecorator('roleName',{
              initialValue:'',
              rules:[{
                required:true,
                message:'角色名称必须输入'
              }]
            })(
               <Input placeholder='请输入角色名称'></Input>
            )
          }
         
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)