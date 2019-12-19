import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'
import {Form,Icon,Button,Input,message} from 'antd'
// import {reqLogin} from '../../api'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'

const Item=Form.Item
class Login extends Component{
  
  handleSubmit = (e) => {
    e.preventDefault()
    //对所有表单字段进行校验
    this.props.form.validateFields(async (err,values) => {
      if(!err){
        console.log('提交登陆的Ajax请求',values)
        //请求登陆
        const {username,password} = values
        // // reqLogin(username,password).then(response => {
        // //   console.log('请求成功',response.data)
        // // }).error(error => {
        // //   console.log('请求失败')
        // // })

        // // try{
        // //   const response = await reqLogin(username,password)
        // //   console.log('请求成功',response.data)
        // // }catch(error){
        // //   console.log('请求失败',error.message)
        // // }
        // const result = await reqLogin(username,password)
        // //console.log('请求成功',response.data)
        // //const result = response.data
        // if(result.status===0){
        //   message.success('登陆成功')
        //   //保存user到内存（刷新地址会清掉内存，不能实现持久登陆）
        //   const user = result.data
        //   memoryUtils.user=user
        //   storageUtils.saveUser(user)//保存到local中
        //   //用replace而不用push是因为不需要回退回来了(在事件回调中跳转用history)
        //   this.props.history.replace('/home')
        // }else{
        //   message.error(result.msg)
        // }
        //调用异步action的函数，发登陆的异步请求，有结果之后分发action更新user状态
        this.props.login(username,password)
      }else{
        console.log('校验失败')
      }
    })
    

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

  render(){
    //如果用户已经登陆，自动跳转到首页，只需要看内存里有没有user
    //const user = memoryUtils.user
    const user = this.props.user
    if(user && user._id){
      return <Redirect to='/home'/>
    }
    //显示错误信息
    const errorMsg = this.props.user.errorMsg

  
    //具有强大功能的form对象
    const form = this.props.form
    //getFieldDecorator（‘标识名称’，配置对象）（组件标签）是一个高阶函数
    const {getFieldDecorator} = form

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo"/>
          <h1>React后台管理系统</h1>
        </header>
        <section className='login-content'>
          <div className={errorMsg?'error-msg show':'error-msg'}>{errorMsg}</div>
          <h2>登陆</h2>
        <Form onSubmit={this.handleSubmit} className="login-form">
        <Item>
          {getFieldDecorator('username', {
            //声明式验证
            rules: [
              { required: true, message: '请输入用户名' },
              {min:4,message:'最少4位'},
              {max:12,message:'最多12位'},
              {pattern:/^[a-zA-Z0-9_]+$/,message:'必须是英文字母、数字、下划线'}],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Item>
        <Item>
          {getFieldDecorator('password', {
            //自定义验证,validator验证器
            rules: [
              {validator:this.validatePwd}
              ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Item>
        <Item>
          {/* {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a> */}
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          {/* Or <a href="">register now!</a> */}
        </Item>
      </Form>
        </section>
      </div>
    )
  }
}

//create高阶函数，将Form组件包装起来返回一个新组件，新组件向Form老组件传递一个强大的form对象，这个对象里面的方法可以实现验证表单，获取表单值等功能。
export default connect(
  state => ({user:state.user}),
  {login}
)(Form.create()(Login))

/*
高阶函数
接受函数类型的参数或者返回值是函数
高阶函数更加动态更加具有扩展性
常见的高阶函数
1、定时器 setTimeout() setInterval
2、Promise： Promise(()=>{}) then(value =>{},reason => {})
3、数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
4、函数对象的bind()
5、Form.create()()  getFieldDecorator()()

高阶组件
本质就是一个函数
接受一个组件（被包装组件）并返回一个新的组件（包装组件）。包装组件会向被包装组件传入特定的属性
用于扩展组件的功能
create()不是高阶组件，而是create()返回的函数是一个高阶组件，接受一个组件返回一个包装组件
getFieldDecorator()不是组件，返回的函数接受一个标签对象，而不是组件，组件是一种类型，标签对象可以算是组件的实例
高阶组件也是高阶函数，接受一个组件函数，返回一个新的组件函数
*/

/*
async和await
1、作用
简化Promise对象的使用，不用再通过.then()来指定成功或者失败的回调函数
以同步编码方式（没有写回调函数了）实现异步流程
2、哪里写await
在返回Promise的表达式左侧写await，不想要Promise，而想要Promise异步执行成功的value数据
3、哪里写async
await所在的函数（最近的）定义的左侧写async
*/