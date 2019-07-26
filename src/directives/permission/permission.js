import store from '@/store'

export default {
  inserted(el, { value }) {
    const permission = store.state.permission.permissions

    if (!permission.includes(value)) {
      el.parentNode.removeChild(el)
    }
  }
}
