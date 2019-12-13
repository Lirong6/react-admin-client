import React,{Component} from 'react'
import {Card,Table,Button,Icon,message,Modal} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component{

  state = {
    category:[], //一级分类列表
    loading:false,
    parentId:'0', //当前需要显示的分类列表的父分类parentId
    parentName:'',//当前需要显示的分类列表的父分类名称
    subCategorys:[], //二级分类列表
    showStatus:0, //标识添加或更新的确认框是否显示，0：都不，1：添加，2：更新
  }

  //初始化列的数组
  initColumns = () => {
    this.columns = [
      {
        title: '一级分类列表',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width:300,
        dataIndex: '',
        key: 'action',
        render:(category) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/*向事件回调函数里面传参数，要在外面包一层函数（先定义一个匿名函数，在函数中调用处理的函数并传入数据）*/}
            {this.state.parentId==='0'?<LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>:null}
             
          </span>
        )
      }
    ];
  }
  
  //参数里面的parentId如果没有传就用状态中的parentId请求，如果有指定就根据指定的请求
  getCategorys = async(parentId) => {
    //发请求前显示loading
    this.setState({loading:true})

    //const {parentId} = this.state  不单从状态里取了
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    //请求结束后隐藏loading
    this.setState({loading:false})

    if(result.status===0){
      const categorys = result.data
      //更新状态
      if(parentId==='0'){
        this.setState({categorys:categorys})
      }else{
        this.setState({subCategorys:categorys})
      }
      
    }else{
      message.error('获取分类列表失败')
    }
  }

  //显示二级分类列表
  showSubCategorys = (category) => {
    //更新状态，setState这是异步更新的,不能立即获取最新的状态，所以需要回调函数
    this.setState({
      parentId:category._id,
      parentName:category.name
    },() => {//在状态更新并重新render后执行
      //获取二级分类列表
      this.getCategorys()
    })
    
  }

  //显示一级分类列表
  showCategorys = () => {
    //更新为显示一级列表
    this.setState({
      parentId:'0',
      parentName:'',
      subCategorys:[]
    })
  }

  handleCancel = () => {
    //清除缓存数据
    this.form.resetFields()

    this.setState({showStatus:0})
  }

  showAdd = () => {
    this.setState({showStatus:1})
  }

  showUpdate = (category) => {
    //保存分类对象
    this.category = category

    this.setState({showStatus:2})
  }

  addCategory = () => {
    this.form.validateFields(async (err,values) => {
      if(!err){
        this.setState({showStatus:0})
        const {categoryName,parentId} = this.form.getFieldsValue()  //从values取也行
        this.form.resetFields()
        const result = await reqAddCategory(categoryName,parentId)
        if(result.status===0){
          //添加的分类就是当前分类
          if(parentId===this.state.parentId){
            this.getCategorys()
          }else if(parentId==='0'){
            //在二级分类下添加一级分类项需要重新获取一级分类列表但不需要显示一级列表
            this.getCategorys('0')
          }
        }
      }
    })
  }

  updateCategory = () => {
    //表单验证通过
    this.form.validateFields(async(err,values) => {
      if(!err){
        //隐藏确认框
        this.setState({showStatus:0})
        //准备数据
        const categoryId = this.category._id
        const {categoryName} = values
        //清除缓存数据
        this.form.resetFields()
        //发送请求
        const result = await reqUpdateCategory({categoryId,categoryName})
        if(result.status===0){
          //重新渲染列表
          this.getCategorys()
        }
    }
    })
    
    
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getCategorys()
  }

  render(){
    const {categorys,subCategorys,parentId,parentName,loading,showStatus} = this.state
    
    //读取指定的分类对象，如果没有就指定一个空对象
    const category = this.category || {}

    const title = parentId==='0'?'一级分类列表':(
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight:8}}/>
        <span>{parentName}</span>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={this.showAdd}><Icon type='plus'/>添加</Button>
    )
    
    return (
      <Card title={title} extra={extra}>
      <Table 
        bordered={true} 
        loading={loading}
        dataSource={parentId==='0'?categorys:subCategorys}
        columns={this.columns}
        rowKey='_id'
        pagination={{defaultPageSize:10,showQuickJumper:true}}
      />
      <Modal
          title="添加分类"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <AddForm
            categorys={categorys} 
            parentId={parentId}
            setForm={(form)=>{this.form = form}}
          />
        </Modal>

        <Modal
          title="更新分类"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <UpdateForm 
            categoryName={category.name} 
            setForm={(form)=>{this.form = form}} //将子组件UpdateForm传递上来的form对象保存到父组件Category的this.form上
          />
        </Modal>
    </Card>
    )
  }
}
//props传递的参数可以分为一般参数和函数类型的参数，函数类型的参数可以将参数从子组件传递给父组件