import Vue from 'vue'
import axios from 'axios'

import ElementUI from 'element-ui'; //使用element插件
import 'element-ui/lib/theme-chalk/index.css'; //使用element插件

import App from './App'
import router from './router'
import store from './store'

//定义全局变量
import domain from './utils/domain'
import utils from './utils/utils'

//Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

//定义全局变量
Vue.prototype.$domain = domain;
Vue.prototype.$utils = utils;

Vue.use(ElementUI); //使用element插件

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')