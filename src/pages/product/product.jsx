import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'
import './product.less'

export default class Product extends Component{
  render(){
    return (
      <Switch>
        <Route exact path='/product' component={ProductHome}/>  
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }  
}

//加上exact后变为路径完全匹配/精准匹配，不加的话默认是逐层匹配