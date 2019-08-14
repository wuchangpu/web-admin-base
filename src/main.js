import Vue from 'vue'
import md5 from 'md5'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import deepCopy from '@/utils/deepCopy'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Components from '@/components'

import API from '@/utils/request'

import '@/icons' // icon
import '@/permission' // permission control

import { parseTime } from '@/utils'

import permission from '@/directives/permission'

import TreeInput from '@/components/TreeInput'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
// import VueRouter from 'vue-router';
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(Components)
Vue.prototype.$api = API
Vue.prototype.$deepcopy = deepCopy
Vue.prototype.$md5 = md5
Vue.config.productionTip = false
Vue.directive('permission', permission)

Vue.component('TreeInput', TreeInput)

Vue.filter('parseTime', parseTime)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
