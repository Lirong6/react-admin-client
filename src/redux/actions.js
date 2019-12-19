/** 
 * 包含n个action creator函数的模块
 * 同步action：对象  {type:'',data:数据值}
 * 异步action：函数 dispatch => {}
*/
import {SET_HEAD_TITLE, RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-types'
import {reqLogin} from '../api'
import storageUtils from '../utils/storageUtils'

//设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({type:SET_HEAD_TITLE,data:headTitle})

//接收用户信息的同步action
export const receiveUser = (user) => ({type:RECEIVE_USER,user})

//显示错误信息的同步action
export const showErrorMsg = (errorMsg) => ({type:SHOW_ERROR_MSG,errorMsg})
/**
 * 实现登陆的异步action 
 */
export const login = (username,password) => {
  return async dispatch => {
    //1、执行异步Ajax请求
    const result = await reqLogin(username,password)
    //2、如果成功了，分发成功的同步action
    if(result.status === 0){
      const user = result.data
      //保存在local中，初始化user状态会用，下次访问可以得到
      storageUtils.saveUser(user)
      //分发接收用户的同步action
      dispatch(receiveUser(user))
    }else{//3、如果失败了，分发失败的同步action
      const msg = result.msg
      //message.error(msg)方式一
      //分发显示失败的action 方式二
      dispatch(showErrorMsg(msg))
    }
    
  }
}

//退出登陆的同步action
export const logout = () => {
  //先删除local中的user
  storageUtils.removeUser()
  //再返回action对象
  return {type:RESET_USER}
}