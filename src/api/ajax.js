//发送异步Ajax请求的函数模块,封装axios库，函数的返回值是promise对象
//优化：1、统一处理请求异常:在Ajax请求的外层自己创建新的Promise对象，在请求出错时不去reject而是提示错误
//2、异步得到的不是response，而是response.data。在请求成功resolve时，resolve(response.data)
import axios from 'axios'
import {message} from 'antd'

export default function ajax(url,data={},type='GET'){
  return new Promise((resolve,reject) => {
    let promise
    //1、执行异步Ajax请求
    if(type === 'GET'){
      promise = axios.get(url,{
        params:data
    })
    }else{
      promise = axios.post(url,data)
    }
    
    //2、如果成功了，调用resolve(value)
    promise.then(response => {
      resolve(response.data)

    }).catch(error => {
      message.error('请求出错了',error.message)
    })
    //3、如果失败了，不能调用reject(reason)，而是提示异常信息
  }) 
}