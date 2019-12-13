import React from 'react'
import './index.less'
//用类定义组件也可以，这个组件没有状态所以可以用function定义
export default function LinkButton(props){
  return (
      <button {...props} className='link-button'></button>
  )
  
}