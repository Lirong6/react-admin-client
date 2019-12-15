import React,{Component} from 'react'
import {Card,Table,Select,Button,Icon,Input,message} from 'antd'
import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants.js'

const Option = Select.Option
export default class ProductHome extends Component{

  state={
    products:[], //当前页的商品数组
    total:0,//商品总条数
    loading:false, //是否正在加载中
    searchName:'', //搜索关键字
    searchType:'productName', //根据哪个字段搜索
  }

  initColumns = () => {
    this.columns = [
      {
        title:'商品名称',
        dataIndex:'name'
      },
      {
        title:'商品描述',
        dataIndex:'desc'
      },
      {
        width:100,
        title:'价格',
        dataIndex:'price',
        render: (price) => '￥'+price  //当前指定了对应的dataIndex属性，传入的是对应的属性值
      },
      {
        width:100,
        title:'状态',
        //dataIndex:'status',不能用传入status因为需要回调函数需要传入status和productId，只传入status无法获取productId，所以不能写dataIndex，要传入product
        render: (product) => {
          const {status,_id} = product
          return (
            <span>
            <Button 
              type='primary' 
              onClick={() => {this.updateStatus(_id,status===1?2:1)}}
            >{status===1?'下架':'上架'}</Button>
            <span>{status===1?'在售':'已下架'}</span>
            </span>
            
          )
        }
      },
      {
        width:100,
        title:'操作',
        render: (product) => {//没有指定dataIndex就传入整个product
          return (
            <span>
              {/*将product对象通过this.props.location.state传递给目标路由组件，在history.push的第二个参数传入详情，在子路由中通过state取到
                push('/product/detail',{product})这种方式只有BrowserRouter可以用，HashRouter用传id的方式push('/product/detail/id')*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
            </span>
            
          )
        }
      }
    ]
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum //保存pageNum以供其他方法使用
    this.setState({loading:true})
    const {searchName,searchType} = this.state
    let result
    //判断是否有搜索项
    if(searchName){
      result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    }else{
      result = await reqProducts(pageNum,PAGE_SIZE)
    }
    
    this.setState({loading:false})
    if(result.status===0){
      const {total,list} = result.data
      this.setState({
        total,
        products:list
      })
    }
  }

  updateStatus = async (productId,status) => {
    const result = await reqUpdateStatus(productId,status)
    if(result.status===0){
      message.success('更新商品状态成功')
      this.getProducts(this.pageNum)
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount(){
    this.getProducts(1)
  }

  render(){

    const {products,total,loading,searchName,searchType} = this.state

    const title = (
      <span>
        <Select value={searchType} style={{width:120,}} onChange={value => this.setState({searchType:value})}>
          <Option value='productName' key='productName'>按名称搜索</Option>
          <Option value='productDesc' key='productDesc'>按描述搜素</Option>
        </Select>
        <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} value={searchName} onChange={event => this.setState({searchName:event.target.value})}/>
        <Button type='primary' onClick={() => {this.getProducts(1)}}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}><Icon type='plus'/>添加商品</Button>
    )

    
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          loading={loading}
          rowKey='_id'
          dataSource={products}
          columns={this.columns}
          pagination={{
            current:this.pageNum,
            defaultPageSize:PAGE_SIZE,
            showQuickJumper:true,
            total:total,
            onChange:this.getProducts,//(pageNum) => {this.getProducts(pageNum)} 参数一样可以直接传入函数
          }}
        />
      </Card>
    )
  }
}
/*
受控组件和非受控组件
受控组件可以实时收集数据（onChange绑定并用state接收数据），非受控组件是手动收集
*/