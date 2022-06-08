/*
 * @Description: 
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-11-29 17:08:17
 * @LastEditors: your name
 * @LastEditTime: 2022-06-08 20:04:44
 */
// const webpack = require('webpack');
const path = require("path");
module.exports = {
  runtimeCompiler:true,//运行时加上编译器,动态组件需要 参考地址：http://nanshanqiao.com/zz_article/51.html
  lintOnSave:false,
  css:{
    loaderOptions:{
        sass:{

        },
        scss:{
            
        }
    }
  },
  chainWebpack(config){
      config.module
        .rule('md')
        .test(/\.md$/)
        .use('vue')
            .loader('vue-loader')
            .tap(options => {
                // 修改它的选项...
                if(options&&options.compilerOptions){
                    options.compilerOptions.preserveWhitespace = false
                }
                return options
              })
            .end()
        .use('markdown')
            .loader(path.resolve(__dirname,"./build/md-loader/index.js"))
            .end()
    //   config
    //           .plugin('')
        

  }  
}
