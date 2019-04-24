import axios from 'axios'
import Vue from 'vue'
import API from './api'
import { Host } from '@/config'
import Store from '@/store'
import router from '../router'

export const httpGet = (url, params) => {
  const token = Store.state.user.userInfo && Store.state.user.userInfo.token;
  return axios({
    url: `${API[url]}?${params}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': token,
    },
  })
}

export const httpFormPost = (url, params) => {
  const token = Store.state.user.userInfo && Store.state.user.userInfo.token;
  return axios({
    url: API[url],
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'token': token,
    },
    data: {
      ...params
    },
    transformRequest: [(data) => {
      let keys = Object.keys(data);
      let str = '';
      for (let i = 0; i < keys.length; i++) {
        str += `${keys[i]}=${data[keys[0]]}&`
      }
      return str
    }],
  })
}

export const httpPost = (url, params, appId = false) => {
  const token = Store.state.user.userInfo && Store.state.user.userInfo.token;
  return axios({
    // url: API[key1][key2],
    url: API[url],
    method: 'post',
    data: {
      appId: appId ? 1 : undefined,
      ...params
    },
    headers: {
      'token': token,
    },
  })
}

/**
 **上传接口**
 **/
const newAxios = axios.create({
  transformRequest: [(data) => {
    return data
  }]
})

export const $httpImgUpoad = (params, callback = () => {}) => newAxios({
  url: API.fileUpload,
  // url: API[url],
  method: 'post',
  onUploadProgress: function(progressEvent) { //原生获取上传进度的事件
    if (progressEvent.lengthComputable) {
      //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
      //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
      callback(progressEvent);
    }
  },
  data: params
})

// axios 全局配置
axios.defaults.baseURL = Host
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
console.log('token', Store.state.user.userInfo.token)
const devTimeout = 5000;
const proTimeout = 30000;
axios.defaults.timeout = process.env.NODE_ENV === 'development' ? devTimeout : proTimeout;
axios.defaults.transformRequest = [(data) => {
  return JSON.stringify(data)
}]
axios.interceptors.request.use(function(config) {
  // 打开loading
  Vue.$loading.open()

  return config
}, function(error) {
  return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
  // 关闭loading
  setTimeout(() => {
    Vue.$loading.close()
  }, 300)
  
  if (response.data.returnCode == '401') {
    window.sessionStorage.clear();
    window.location.reload();
    return router.replace('/login');
  }
  
  return response.data
}, (error) => {
  Vue.$loading.close()
  Vue.prototype.$message.error('请求失败');
  if (error) throw error
})