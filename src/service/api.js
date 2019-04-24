// API接口统一管理文件
export default {
  // common
  'sysMenuNav': 'sys/menu/nav', // 获取菜单
  'fileUpload': 'file/upload', // 上传图片
  'sysDicGetSysDicList': 'sysDic/getSysDicList', // 数据字典查所有

  // user
  'sysCheckJobNumber': 'sys/checkJobNumber', // 初始化密码-校验工号
  'sysCheckIdCard': 'sys/checkIdCard', // 初始化密码-校验姓名和身份证
  'sysInitPassword': 'sys/initPassword',  // 初始化密码
  'sysLogin': 'sys/login', // 登录
  'sysLogout': 'sys/logout', // 登出
  'sysUserPassword': 'sys/user/password', // 修改密码

  // permission
  'sysMenuUpdate': 'sys/menu/update', // 编辑菜单
  'sysUserList': 'sys/user/list',  // 管理员列表
  'sysUserSave': 'sys/user/save',  // 新增管理员
  'sysUserUpdate': 'sys/user/update',  // 编辑管理员
  'sysUserQuerUserinfo': 'sys/user/querUserinfo', // 查询管理员信息
  'sysUserDelete': 'sys/user/delete',  // 删除管理员
  'sysUserIsEnable': 'sys/user/isEnable', // 管理员启用禁用
  'sysRoleSelect': 'sys/role/select',  // 获取所有角色-角色选择
  'sysRoleList': 'sys/role/list', // 角色列表
  'sysRoleIsEnable': 'sys/role/isEnable',  // 角色启用禁用
  'sysMenuSelect': 'sys/menu/select',  // 获取角色菜单
  'sysRoleSave': 'sys/role/save',  // 角色新增
  'sysRoleInfo': 'sys/role/info',  // 查询角色详情
  'sysRoleUpdate': 'sys/role/update',  // 角色修改
  'sysRoleDelete': 'sys/role/delete',  // 角色删除

  'addMenu': 'sys/menu/save',
  'getAllMenu': 'sys/menu/nav',
  'getAllMenuSelect': 'sys/menu/select',

  'getRoleList': 'sys/role/list',
  'saveRoleForm': 'sys/role/save',
  'updateRoleForm': 'sys/role/update',
  'getRoleDetail': 'sys/role/info',

  'getUserList': 'sys/user/list'
}