// 恢复Vuex 相应模块里面的数据 fix: 刷新页面，vuex数据会丢失
// const data = (sessionStorage.getItem('common') && JSON.parse(sessionStorage.getItem('common'))) || {}
const data = JSON.parse(sessionStorage.getItem('user'))

const user = {
  state: {
    userInfo: data && data.userInfo || '',
    initPsdStatus: data && data.initPsdStatus || '',
  },

  mutations: {
    SET_USERINFO: (state, val) => {
      state.userInfo = val
    },
    SET_INIT_PSD_STATUE: (state, val) => {
      state.initPsdStatus = val
    },
  },

  actions: {
    // 设置userInfo(登录和修改信息后)
    setUserInfo({ commit }, userInfo) {
      commit('SET_USERINFO', userInfo)
    },
    // 设置重置密码的状态
    setInitPsdStatus({ commit }, status) {
      commit('SET_INIT_PSD_STATUE', status)
    },

    // 登出
    // LogOut({ commit }) {
    //   commit('SET_USERINFO', '')
    // },



    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       removeToken()
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    // FedLogOut({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resolve()
    //   })
    // }
  }
}

export default user