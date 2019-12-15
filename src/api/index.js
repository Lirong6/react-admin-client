//接口请求函数，包含应用中所有接口请求函数的模块，返回promise对象
import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
//登陆
// export function reqLogin(username,password){
//   return ajax('/login',{username,password},'POST')
// }
//注意不要用{}包裹ajax，不然得用return 
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')
//export const reqLogin = (username,password) => { return ajax('/login',{username,password},'POST')}


//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add',user,'POST')
//获取所有用户列表
export const reqUsers = () => ajax('/manage/user/list')
//删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')
//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id?'update':'add'),user,'POST')

//json请求的接口请求函数,,,,jsonp请求是为了解决Ajax跨域问题，但只能解决GET请求，并且jsonp请求是一般的get请求，不是Ajax请求。
//浏览器端通过<script>标签发请求，同时定义好用于接收响应数据的函数（如fn），并将函数名通过请求参数提交给后台（如：callback=fn）
//服务器端接收到请求产生结果数据后，返回一个函数执行代码（函数调用的js代码），并将结果数据作为实参传入函数调用
//浏览器端收到响应自动执行函数调用js代码，也就执行了提前定义好的回调函数并得到了需要的结果数据
export const reqWeather = (city) => {
  
  return new Promise((resolve,reject) => {
    const url=`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url,{},(error,data) => {
      if(!error && data.status==='success'){
        //取出需要的数据
        const {dayPictureUrl,weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl,weather})
      }else{
        message.error('获取天气信息失败')
      }
    })
  })
 
}


//获取分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId:parentId},'GET')
//添加分类,方式一：传两个参数
export const reqAddCategory = (categoryName,parentId) => ajax('/manage/category/add',{categoryName,parentId},'POST')
//更新分类，方式二：传一个参数对象
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax('/manage/category/update',{categoryId,categoryName},'POST')
//获取一个分类
export const reqCategory = (categoryId) => ajax('/manage/category/info',{categoryId})


//获取分页商品列表
export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize})
//搜索带分页的产品列表   想让一个变量的值作为属性名的时候要用[]
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax('/manage/product/search',{
  pageNum,
  pageSize,
  [searchType]:searchName,
})
//更新商品状态（上架/下架）
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

//删除上传的图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

//添加商品
export const reqAddProduct = (product) => ajax('/manage/product/add',product,'POST')
//更新商品
export const reqUpdateProduct = (product) => ajax('/manage/product/update',product,'POST')
//添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')


//获取所有角色列表
export const reqRoles = () => ajax('/manage/role/list')
//添加一个角色
export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')
//更新角色
export const reqUpdateRole = (role) => ajax('/manage/role/update',role,'POST')
