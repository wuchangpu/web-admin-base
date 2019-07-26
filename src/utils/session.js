/**
 * sessionStorage封装
 *
 */

export default {
  get(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key))
    } catch (error) {
      return null
    }
  },
  set(key, val) {
    sessionStorage.setItem(key, JSON.stringify(val))
  },
  remove(key) {
    sessionStorage.removeItem(key)
  },
  clear() {
    sessionStorage.clear()
  }
}
