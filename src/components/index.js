/**
 * 需要注册为全局组件就在这里引入，并添加到 components 对象中，不用操作其它地方。
 * SvgIcon 已在 './icons' 里面注册
 * Breadcrumb和Hamburger 已在layout局部引入，如需注册全局请删除相应局部
 */


import Pagination from './Pagination'
import PermissionTree from './Tree/PermissionTree'
import CountTo from './CountTo'
import DatePicker from './DatePicker'
import Tinymce from './Tinymce'
import FileUpload from './FileUpload'
import Echarts from './Echarts'
import SpecifiedObject from './SpecifiedObject'
import FilePreview from './FilePreview'
import CheckInMap from './GaodeMap/CheckInMap'
import Annex from './Annex'

const components = {
  Pagination,
  PermissionTree,
  CountTo,
  DatePicker,
  Tinymce,
  FileUpload,
  Echarts,
  SpecifiedObject,
  FilePreview,
  CheckInMap,
  Annex,
}


function install(Vue) {
  if (install.installed) return;

  install.installed = true

  for (const key in components) {
    if (components.hasOwnProperty(key)) {
      Vue.component(key, components[key])
    }
  }

  
}

export default install