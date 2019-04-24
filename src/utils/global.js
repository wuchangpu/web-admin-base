import {
  httpGet,
  httpFormPost,
  httpPost,
  $httpImgUpoad
} from '@/service'

import store from '@/store'
import deepCopy from './deepCopy'
import EventBus from '@/utils/eventBus'

function install(Vue, options) {
  // 全局正则
  Vue.prototype.$reg = {
    phone: /^1[3-9]\d{9}$/,
    idCard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    psd: /^[^\u4E00-\u9FA5\s]{8,20}$/,  // 匹配除去中文和空格外的任意字符(数字，字母，符号)
    // 匹配数字，字母，符号（必须得两种以上组合）
    // psd: /(?!.*\s)(?!^[\u4E00-\u9FA5]+$)(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^\u4E00-\u9FA5a-zA-Z\d]+$)^.{8,20}$/,
    jobNumber: /^\d+$/,
    positiveInteger: /^\d+$/,  // 正整数
    percentage: /^(100|(([1-9]){1}[0-9]?|0?)((\.)([0-9]){1,2})?)$/,
  }

  // 数据请求
  Vue.prototype.$get = httpGet // get请求
  Vue.prototype.$formPost = httpFormPost // post请求
  Vue.prototype.$post = httpPost // postJson请求
  Vue.prototype.$httpImgUpoad = $httpImgUpoad // post请求

  // sessionStorage封装
  Vue.prototype.$session = {
    get(key) {
      return sessionStorage.getItem(key) ? JSON.parse(sessionStorage.getItem(key)) : ''
    },
    set(key, val) {
      sessionStorage.setItem(key, JSON.stringify(val))
    },
    remove(key) {
      sessionStorage.removeItem(key)
    }
  }

  /**************
   * 全局directive
   **************/

  // 解决键盘挡住输入框指令
  Vue.directive('keyBoard', {
    inserted: function(el) {
      const oHeight = document.body.clientHeight
      window.addEventListener('resize', function(params) {
        if (oHeight > document.body.clientHeight) { // 键盘弹出
          el.scrollIntoView(false)
        }
      }, false)
    }
  })

  // 进入页面input自动聚焦
  Vue.directive('focus', {
    inserted(el, { value }) {
      if (value) el.focus()
    }
  })

  /**************
   * 全局filter
   **************/

  // 价格过滤器 格式 ￥20.00
  Vue.filter('currency', (value) => {
    if (!value) return '￥0.00'
    return `${(value / 100).toFixed(2)}`
  })

  // 价格过滤器 格式 20.00元
  Vue.filter('price', (value) => {
    if (!value) return '0.00'
    return `${(value / 100).toFixed(2)}`
  })

  /*
   * 补零
   */
  //num是传入的数字, n是保留几位数
  Vue.filter('addZero', (num, n) => {
    return (Array(n).join(0) + num).slice(-n);
  });
  //传入大于n位数时,返回原数字
  Vue.filter('addZeroByJudge', (num, n) => {
    if (num < Math.pow(10, n - 1)) {
      return (Array(n).join(0) + num).slice(-n);
    } else {
      return num;
    }
  });

  // 时间过滤器
  Vue.filter('filterTime', (value, formatDefault = 'YYYY/MM/DD hh:mm:ss') => {
    if (!value) return ''
    let date = new Date(value - 0)
    let format = formatDefault
    if (/(Y+)/.test(format)) {
      format = format.replace(RegExp.$1, date.getFullYear() + '').substr(4 - RegExp.$1.length)
    }
    let o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let key in o) {
      if (new RegExp(`(${key})`).test(format)) {
        let str = o[key] + ''
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
      }
    }
    return format
  })


  // 全局变量
  Vue.prototype.globalVar = {
    GaodeScriptUrl: 'https://webapi.amap.com/maps?v=1.4.13&key=bd50a62b5979b253faffc14481cf4462&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.Geocoder&callback=GaodeInit'
  }


  // 全局方法

  window.GaodeInit = function() {
    EventBus.$emit('gaode-init');
  }
  
  Vue.prototype.addGaodeScript = function () {
    let url = this.globalVar.GaodeScriptUrl;
    let scripts = document.getElementsByTagName('script');
    let urls = [...scripts].map(item => item.src);
    if(urls.includes(url)) return true;
    let jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  },

  Vue.prototype.formatTime = (value, formatDefault = 'YYYY/MM/DD hh:mm:ss') => {
    if (!value) return ''
    let date = new Date(value - 0)
    let format = formatDefault
    if (/(Y+)/.test(format)) {
      format = format.replace(RegExp.$1, date.getFullYear() + '').substr(4 - RegExp.$1.length)
    }
    let o = {
      'M+': date.getMonth() + 1,
      'D+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let key in o) {
      if (new RegExp(`(${key})`).test(format)) {
        let str = o[key] + ''
        format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
      }
    }
    return format
  }

  Vue.prototype.existScrollbar = function() {
    // console.log('scrollbar',document.body.scrollHeight,window.innerHeight,document.documentElement.clientHeight)
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
  }

  Vue.prototype.$deepCopy = deepCopy;

  // 获取数据字典数据
  // "dicCodeList":[],//字典码集合  "idList":[],//字典id集合 "deleted":""//1,启用，2停用
  Vue.prototype.getDictionaryData = async function(dicCodeList = [],idList = [],deleted = '') {
    const res = await this.$post('sysDicGetSysDicList', {
      dicCodeList,
      idList,
      deleted
    });
    if (res.returnCode === '1000') {
      return res.dataInfo
    } else {
      return this.$message.error(res.message);
    }
  }

  /**
   * 压缩图片方法
   */
  // 将base64转换为file(ios10及以下有兼容性问题)
  Vue.prototype.dataURLtoFile = function(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    // 转File
    return new File([u8arr], filename, { type: mime });
    // 转Blob
    // return new Blob([u8arr], { type: mime });
  }

  Vue.prototype.compressImg = function(img) {
    // // 创建画布图片
    // let canvas = document.createElement('canvas'); //创建画布节点
    // canvas.width = img.naturalWidth; //画布宽度为img宽度
    // canvas.height = img.naturalHeight; //画布高度为img高度
    // console.log(canvas.width * canvas.height);
    // let ctx = canvas.getContext('2d'); //绘制2D类型图形
    // ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
    // // 铺底色
    // ctx.fillStyle = "#fff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight); //在画布类绘制图片
    // // 创建压缩后的图片
    // let dataUrl = canvas.toDataURL('image/jpeg', .3); //输出jpg格式dataURI并压缩图片质量(取值范围0~1)
    // return dataUrl;

    /**
     * 以下兼容ios超大像素图片问题
     */
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;
    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000) > 1) {
      ratio = Math.sqrt(ratio);
      width /= ratio;
      height /= ratio;
    } else {
      ratio = 1;
    }
    // 用于压缩图片的canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    // 瓦片canvas
    var tCanvas = document.createElement("canvas");
    var tctx = tCanvas.getContext("2d");
    // 铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
      count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
      // 计算每块瓦片的宽和高
      var nw = ~~(width / count);
      var nh = ~~(height / count);
      tCanvas.width = nw;
      tCanvas.height = nh;
      for (var i = 0; i < count; i++) {
        for (var j = 0; j < count; j++) {
          tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
          ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        }
      }
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }
    //进行压缩
    var ndata = canvas.toDataURL('image/jpeg', 0.3);
    // console.log('压缩前：' + initSize);
    // console.log('压缩后：' + ndata.length);
    // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
    return ndata;
  }


}




export default install