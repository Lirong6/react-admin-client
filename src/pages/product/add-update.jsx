import React,{PureComponent} from 'react'
import {Card,Form,Input,Cascader,message,Button,Icon} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input

class ProductAddUpdate extends PureComponent{

  state = {
    options:[]
  }

  constructor(props) {
    super(props);
    
    //创建用来保存ref标识的标签对象的容器,pw是个容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }
  
  //获取一级分类列表或二级分类列表  async函数返回值是一个新的promise对象，promise的结果和值由async的结果来决定
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if(result.status===0){
      const categorys = result.data
      //判断一级分类还是二级分类
      if(parentId==='0'){
        this.initOptions(categorys)
      }else{//二级列表
        return categorys //返回二级列表，当前async函数返回的promise就会成功且value为categorys
      }
      
    }
  }

  initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value:c._id,
      label:c.name,
      isLeaf:false
    }))
  
    const {isUpdate,product} = this
    const {pCategoryId,categoryId} = product
    //如果是一个二级分类商品的更新
    if(isUpdate && pCategoryId !== '0'){
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级列表的options
      const childOptions = subCategorys.map(c => ({
        value:c._id,
        label:c.name,
        isLeaf:true
      }))
      //找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)
      //关联对应的一级option上
      targetOption.children = childOptions
    }

    this.setState({options})
  }

  validatePrice = (rule,value,callback) => {
    if(value*1>0){
      callback()
    }else{
      callback('价格必须大于0')
    }
  }

  //加载下一级列表的回调
  loadData = async (selectedOptions) => {
    //得到选择的option对象
    const targetOption = selectedOptions[0]
    //显示loading效果
    targetOption.loading = true

    //根据选中的分类请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    //隐藏loading
    targetOption.loading = false

    if(subCategorys && subCategorys.length>0){
      const childOptions = subCategorys.map(c => ({
        value:c._id,
        label:c.name,
        isLeaf:true
      }))
      targetOption.children = childOptions
      
    }else{//当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
    
    //更新options状态
    this.setState({
      options: [...this.state.options],
    })
  }
  
  submit = () => {
    this.props.form.validateFields(async (err,values) => {
      if(!err){
      
        //1、收集数据并封装成product对象
        const {name,desc,price,categoryIds} = values
        let pCategoryId,categoryId = ''
        if(categoryIds.length===1){
          pCategoryId='0'
          categoryId=categoryIds[0]
        }else{
          pCategoryId=categoryIds[0]
          categoryId=categoryIds[1]
        }

        //容器对象pw的current属性得到PicturesWall标签对象，再调用其方法
        const imgs = this.pw.current.getImgs()
        console.log('imgs',imgs)
        const detail = this.editor.current.getDetail()

        const product = {
          name,desc,price,categoryId,pCategoryId,imgs,detail
        }
        //如果是更新，需要添加_id
        if(this.isUpdate){
          product._id = this.product._id
        }
        //2、调用接口函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        //3、根据结果提示
        if(result.status===0){
          message.success(`${this.isUpdate ?'更新':'添加'}商品成功`)
          this.props.history.goBack()
        }else{
          message.error(`${this.isUpdate ?'更新':'添加'}商品失败`)
        }
      

        
      }
    })
  }
  

  componentDidMount() {
    this.getCategorys('0')
  }

  componentWillMount(){
    //取出携带的product
    const product = this.props.location.state
    //保存一个是否是更新的标识，不用设计为state，因为点进来就不会再变
    this.isUpdate = !!product //强制转换布尔类型
    //保存state携带的商品，如果没有，保存空对象，避免添加商品报错
    this.product = product || {}
  }

  render(){
  
    const {isUpdate,product} = this
    const {pCategoryId,categoryId,imgs,detail} = product
    //接收级联分类ID的数组
    const categoryIds =[]

    if(isUpdate){//商品是一个一级分类的商品
      if(pCategoryId==='0'){
        categoryIds.push(categoryId)
      }else{//商品是二级分类
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
      
      
    }
    //指定Item布局的配置对象
    const formItemLayout = {
      labelCol: {span:2},
      wrapperCol:{span:8}
    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize:20}}/>
        </LinkButton>
        <span>{isUpdate?'修改商品':'添加商品'}</span>
      </span>
    )
  
    const {getFieldDecorator} = this.props.form
  
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name',{
                initialValue:product.name,
                rules:[{
                  required:true,message:'商品名称必须输入'
                }]
              })(
                <Input placeholder='请输入商品名称'/>
              )
            }
            
          </Item>
          <Item label='商品描述'>
            {
              getFieldDecorator('desc',{
                initialValue:product.desc,
                rules:[{
                  required:true,message:'商品名称必须描述'
                }]
              })(
                <TextArea placeholder='请输入商品描述' autosize={{minRows:2,maxRows:6}}/>
              )
            }
          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price',{
                initialValue:product.price,
                rules:[
                  {required:true,message:'商品名称必须描述'},
                  {validator:this.validatePrice}
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
              )
            }
          </Item>
          <Item label='商品分类'>
            {
              getFieldDecorator('categoryIds',{
                initialValue:categoryIds,
                rules:[
                  {required:true,message:'请选择商品分类'},
                ]
              })(
                <Cascader
                  placeholder='请指定商品分类'
                  options={this.state.options}
                  loadData={this.loadData}
                />
              )
            }
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.pw} imgs={imgs}/>{/**pw是个容器，在组件实例上指定ref属性就会将PicturesWall实例塞进pw容器中去 */}
          </Item>
          <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item style={{marginLeft:30}}>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(ProductAddUpdate)

/** 
子组件调用父组件方法：
将父组件方法作为函数属性的形式传给子组件
父组件调用子组件方法：
因为标签对象就是组件对象，在父组件中通过ref得到子组件标签对象（也就是组件对象），再调用其方法
*/