module.exports = {
  login: ['/sys/login', 'POST'],
  logout: ['/sys/logout', 'POST'],
  getNav: ['/sys/menu/nav', 'POST'],
  getUserInfo: ['/sys/user/query', 'POST'],
  fileUpload: ['/file/upload', 'POST'],
  getResourceInfo: ['/resource/info', 'POST'],

  // 菜单列表
  getMenuList: ['/sys/menu/select', 'POST'],
  getMenuSystemList: ['/sys/menu/list', 'POST'],
  menuDelete: ['/sys/menu/delete', 'POST'],
  saveMenu: ['/sys/menu/save', 'POST'],
  updateMenu: ['/sys/menu/update', 'POST'],
  menuDetail: ['/sys/menu/info', 'POST'],

  // 权限列表
  getPermissionList: ['/sys/perm/page', 'POST'],
  permissionAdd: ['/sys/perm/add', 'POST'],

  // 角色列表
  getRoleList: ['/sys/role/list', 'POST'],
  getAllMenuSelect: ['sys/menu/select', 'POST'],
  saveRole: ['/sys/role/save', 'POST'],
  updateRole: ['/sys/role/update', 'POST'],
  roleDetail: ['/sys/role/info', 'POST'],
  roleDelete: ['/sys/role/delete', 'POST'],
  getRoleSelect: ['/sys/role/select', 'POST'],

  // 机构管理
  getDepartmentListIncludeItself: ['/org/queryByParentId', 'POST'],
  getDepartmentListUnder: ['/org/queryChildById', 'POST'],
  getDepartmentList: ['/org/select', 'POST'],
  departmentAdd: ['/org/save', 'POST'],
  departmentUpdate: ['/org/update', 'POST'],
  departmentDelete: ['/org/delete', 'POST'],
  departmentDetail: ['/org/query', 'POST'],

  // 字典管理
  getDictionaryList: ['/sysDic/pageDic', 'POST'],
  dictionaryAdd: ['/sysDic/saveOrUpdateSysDic', 'POST'],
  dictionaryStatusControl: ['/sysDic/useOrStopSysDic', 'POST'],
  dictionaryDetail: ['/sysDic/getSysDicById', 'POST'],

  getDictionaryDataList: ['/sysDic/pageDicData', 'POST'],
  dictionaryDataAdd: ['/sysDic/saveOrUpdateSysDicData', 'POST'],
  dictionaryDataStatusControl: ['/sysDic/useOrStopSysDicData', 'POST'],

  getDictionaryByDicCodeList: ['/sysDic/getSysDicList', 'POST'],

  // 用户管理
  getUserList: ['/sys/user/list', 'POST'],
  userAdd: ['/sys/user/save', 'POST'],
  userDelete: ['/sys/user/delete', 'POST'],
  userDetail: ['/sys/user/query', 'POST'],
  userUpdate: ['/sys/user/update', 'POST'],
  userStatusChange: ['/sys/user/enable', 'POST'],

  // 图片管理
  getImageList: ['/sysBannerInfo/page', 'POST'],
  imageAdd: ['/sysBannerInfo/add', 'POST'],
  imageDetail: ['/sysBannerInfo/query', 'POST'],
  imageUpdate: ['/sysBannerInfo/update', 'POST'],
  imageDelete: ['/sysBannerInfo/delete', 'POST'],

  // 系统日志
  getLogList: ['/sys/log/list', 'POST']
}
