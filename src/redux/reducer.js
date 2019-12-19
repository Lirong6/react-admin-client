import {combineReducers} from 'redux'
import storageUtils from '../utils/storageUtils'
import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-types'

//管理头部标题的reducer函数
const initHeadTitle ='首页'
function headTitle(state=initHeadTitle,action){
  switch(action.type){
    case SET_HEAD_TITLE:
      return action.data
    default:
      return state
  }
}
//管理当前登陆用户的reducer函数
const initUser = storageUtils.getUser()
function user(state=initUser,action){
  switch(action.type){
    case RECEIVE_USER:
      return action.user
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg
      //必须返回一个对象，里面有errorMsg属性 
      //state.errorMsg=errorMsg 不要直接改变一个属性，而是增加一个新的属性
      return {...state,errorMsg}
    case RESET_USER:
      return {}
    default:
      return state
  }
}
//向外默认暴露的是合并产生的总的reducer函数，管理的总的state结构是{headTitle:'首页',user:{}}
export default combineReducers({
  headTitle,
  user
})