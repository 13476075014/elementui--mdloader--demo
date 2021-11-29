/*
 * @Description: 
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-11-29 17:08:17
 * @LastEditors: your name
 * @LastEditTime: 2021-11-29 19:13:56
 */
// const webpack = require('webpack');
const path = require("path");
module.exports = {
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
                console.log("vuevueeeeee")
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
