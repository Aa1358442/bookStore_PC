// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
import store from './store/store.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import Qs from 'qs'
import moment from 'moment'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.prototype.qs = Qs
Vue.prototype.$moment = moment

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  if (userInfo && userInfo.access_token) {
    next()
  } else {
    next('/login')
  }
})
