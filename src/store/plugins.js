// vuex的插件
import session from '@/utils/session'
const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    Object.keys(state).forEach((item, index) => {
      session.set(item, state[item])
    })
  })
}

export default [localStoragePlugin]
