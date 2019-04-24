import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'
// 把vuex数据缓存到sessionStorage
import plugins from './sessionPlugin'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins,
  getters,
  modules: {
    app,
    user,
    permission,
  },
})

export default store