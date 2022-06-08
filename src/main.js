/*
 * @Description: 
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-11-29 16:43:39
 * @LastEditors: your name
 * @LastEditTime: 2022-06-08 20:08:36
 */
import Vue from 'vue'
import App from './App.vue'
// 全局引入vue-codemirror
import {codemirror} from 'vue-codemirror';
 // 引入css文件
 import 'codemirror/lib/codemirror.css'
// 引入主题 可以从 codemirror/theme/ 下引入多个
import 'codemirror/theme/idea.css'

  
import VueRouter from 'vue-router';
import Element from 'element-ui'
import hljs from 'highlight.js';
import demoBlock from './components/demo-block';

import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

Vue.use(Element);
Vue.use(VueRouter);

Vue.component('demo-block', demoBlock);
Vue.component('codemirror', codemirror);

Vue.component("test-code-component",{
  props:{
    code:{
      type:String,
    }
  },
  render:function(createElement){
    const com = Vue.extend({
      // template:"<el-button>123</el-button>"
      template:`<div>${this.code}</div>`
    });
    return createElement("div",{
            class:{customCalendar:true}
        },[
            createElement(com,{})
        ]
    )
  }
  
})


const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes:[
    {
      path:'',
      redirect:"/button"
    },
    {
      path:"/button",
      component:()=>import("@/components/docs/button.md")
    }
]
});

router.afterEach(() => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
