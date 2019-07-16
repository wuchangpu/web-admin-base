/* 公共参数配置文件 */

/**
 * 接口请求公共路径
 */
const devOrigin = 'cross/admin/' // 本地代理(nginx)
// const devOrigin = 'cross/admin/'
  // 正式环境动态获取域名
export const Host = process.env.NODE_ENV === 'development' ? devOrigin : (window.location.origin + '/admin/')


/**
 * 图片公共路径
 */
const devImageBaseUrl = 'http://10.0.0.48:8888/resource/'; // 本地测试环境
export const imageBaseUrl = process.env.NODE_ENV === 'development' ? devImageBaseUrl : (window.location.origin + '/resource/');


/**
 * 公共路径url
 */
export const receptionUrl = window.location.origin;


/**
 * office在线预览
 */
export const previewBaseUrl = 'http://ow365.cn/?i=18303&furl=http://admin.ganbu.vpclub.cc:10000/resource/';

/**
 * 文件类型，此处顺序勿更改，添加直接加在最后
 */
export const MIMETYPE = {
  word: {
    suffix: 'doc,docx',
    type: 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  },
  excel: {
    suffix: 'xls,xlsx',
    type: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  ppt: {
    suffix: 'ppt,pptx',
    type: 'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
  },
  pdf: {
    suffix: 'pdf',
    type: 'application/pdf'
  },
  video: {
    suffix: 'mp4,ogv,webm',
    type: 'video/mp4,video/ogg,video/webm'
  },
  image: {
    suffix: 'gif,jpg,png',
    type: 'image/gif,image/jpeg,image/png'
  },
}
