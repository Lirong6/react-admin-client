//进行local数据存储管理的工具模块
//如果不用原生的localStorage（有的浏览器不支持），可以用一个js库叫store
import store from 'store'
const USER_KEY = 'user_key'
export default {
  //保存user
  saveUser(user){
    //localStorage.setItem(USER_KEY,JSON.stringify(user))
    store.set(USER_KEY,user)
  },
  //读取user
  getUser(){
    //return JSON.parse(localStorage.getItem(USER_KEY)||'{}')
    return store.get(USER_KEY)||{}
  },
  //删除user
  removeUser(){
    //localStorage.removeItem(USER_KEY)
    store.remove(USER_KEY)
  }
}