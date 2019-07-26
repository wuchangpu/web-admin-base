import Vue from 'vue'
import Axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import apiConf from '@/config/api'

const service = Axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/dev-api' : process.env.VUE_APP_API_URL,
  headers: {
    'content-type': 'application/json;charset=utf-8'
  },
  timeout: 30000
})

/* eslint-disable no-param-reassign */
service.interceptors.request.use(
  request => {
    if (store.getters.token) {
      request.headers['token'] = `${getToken()}`
    }
    return request
  },
  error => {
    console.warn(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => response,
  error => {
    console.warn('err' + error) // for debug
    Vue.prototype.$message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// 因为后端架构问题，无法在分页的接口中直接把数据封装到 dataInfo 中，由前端做判断
function access(url, param, method, isList) {
  param = param || {}
  let ret = null
  const upperMethod = method.toUpperCase()

  /* eslint-disable no-underscore-dangle */
  const __randNum = Math.random()

  if (upperMethod === 'POST') {
    ret = service.post(url, param, { params: { __randNum }})
  } else if (upperMethod === 'PUT') {
    ret = service.put(url, param, { params: { __randNum }})
  } else if (upperMethod === 'DELETE') {
    ret = service.delete(url, { params: { ...param, __randNum }})
  } else {
    ret = service.get(url, { params: { ...param, __randNum }})
  }

  return ret.then(res => {
    const { data: resData } = res
    if (resData.returnCode === '1000') {
      if (isList) {
        return resData
      }
      return resData.dataInfo
    } else {
      if (resData.returnCode === '401') {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      } else {
        Vue.prototype.$message({
          message: resData.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    return Promise.reject(res)
  })
}

// 根据 confit/api.js 配置往this上挂载对应的方法
export default new function getAPI() {
  const apiMap = apiConf
  Object.keys(apiMap).forEach(key => {
    const [url, method = 'post'] = apiMap[key]
    this[key] = (params, str = '', isList) => access(url + str, params, method, isList)
  })
}()
