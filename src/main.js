import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

// import ElementUI from 'element-ui'
import '@/utils/element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Global from '@/utils/global'
import Components from '@/Components'
import { Base64 } from 'js-base64'
import Loading from '@/utils/loading'


import '@/icons' // icon
import '@/permission' // permission control

import directives from '@/directives'

for (const [name, value] of Object.entries(directives)) {
  Vue.directive(name, value)
}

// Vue.use(ElementUI, { locale })
// Vue.use(ElementUI)
Vue.use(Global)
Vue.use(Components)
Vue.use(Loading)

Vue.config.productionTip = false

Vue.prototype.$base64 = Base64

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})