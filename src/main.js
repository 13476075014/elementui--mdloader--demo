/*
 * @Description: 
 * @Version: 1.0
 * @Author: chunchun.liu
 * @Date: 2021-11-29 16:43:39
 * @LastEditors: your name
 * @LastEditTime: 2021-11-29 19:15:48
 */
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import Element from 'element-ui'
import hljs from 'highlight.js';
import demoBlock from './components/demo-block';

import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

Vue.use(Element);
Vue.use(VueRouter);

Vue.component('demo-block', demoBlock);

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
