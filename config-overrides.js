const {override,fixBabelImports,addLessLoader} = require('customize-cra');
//antd按需打包，根据import打包
module.exports = override(
  fixBabelImports('import',{
    libraryName:'antd',
    libraryDirectory:'es',
    style:true,
  }),
  //使用less-loader对源码中的less变量进行重新指定
  addLessLoader({
    javascriptEnabled:true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
);