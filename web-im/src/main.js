/*
 * @Author: tim
 * @Date: 2020-05-23 10:20:45
 * @LastEditors: tim
 * @LastEditTime: 2020-05-23 11:57:44
 * @Description: 
 */ 
// import 'babel-polyfill' // 兼容 IE8

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import messageUI from './components/message';

Vue.config.productionTip = false
Vue.prototype.$message = messageUI;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// new Vue({ 
//   router,
//   render: h => h(App)
// }).$mount("#app")
