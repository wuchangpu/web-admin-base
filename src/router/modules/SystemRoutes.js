/* Layout */
import Layout from '@/layout'

export default {
  path: '/system',
  component: Layout,
  name: 'System',
  meta: {
    title: '系统配置',
    icon: 'system'
  },
  children: [
    {
      path: 'image',
      component: () => import('@/views/system/index'),
      name: 'ImageView',
      redirect: { name: 'ImageList' },
      meta: {
        title: '图片管理'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/image/list'),
          name: 'ImageList',
          meta: {
            title: '图片列表',
            activeMenu: '/system/image/list'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/system/image/form'),
          name: 'ImageAdd',
          hidden: true,
          meta: {
            title: '新增图片',
            activeMenu: '/system/image/list'
          }
        },
        {
          path: 'edit',
          component: () => import('@/views/system/image/form'),
          name: 'ImageEdit',
          hidden: true,
          meta: {
            title: '编辑图片',
            activeMenu: '/system/image/list'
          }
        }
      ]
    },

    {
      path: 'menu',
      component: () => import('@/views/system/index'),
      name: 'MenuView',
      redirect: { name: 'MenuList' },
      meta: {
        title: '菜单管理'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/menu/list'),
          name: 'MenuList',
          meta: {
            title: '菜单列表',
            activeMenu: '/system/menu/list'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/system/menu/form'),
          name: 'MenuAdd',
          hidden: true,
          meta: {
            title: '菜单新增',
            activeMenu: '/system/menu/list'
          }
        },
        {
          path: 'edit',
          component: () => import('@/views/system/menu/form'),
          name: 'MenuEdit',
          hidden: true,
          meta: {
            title: '菜单编辑',
            activeMenu: '/system/menu/list'
          }
        }
      ]
    },

    {
      path: 'role',
      component: () => import('@/views/system/index'),
      name: 'RoleView',
      redirect: { name: 'RoleList' },
      meta: { title: '角色管理' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/role/list'),
          name: 'RoleList',
          meta: {
            title: '角色列表',
            activeMenu: '/system/role/list'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/system/role/form'),
          name: 'RoleAdd',
          hidden: true,
          meta: {
            title: '新建角色',
            activeMenu: '/system/role/list'
          }
        },
        {
          path: 'edit',
          component: () => import('@/views/system/role/form'),
          name: 'RoleEdit',
          hidden: true,
          meta: {
            title: '编辑角色',
            activeMenu: '/system/role/list'
          }
        },
        {
          path: 'detail',
          component: () => import('@/views/system/role/form'),
          name: 'RoleDetail',
          hidden: true,
          meta: {
            title: '角色详情',
            activeMenu: '/system/role/list'
          }
        }
      ]
    },

    {
      path: 'department',
      component: () => import('@/views/system/index'),
      name: 'DepeartmentView',
      redirect: { name: 'DepartmentList' },
      meta: { title: '机构管理' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/department/list'),
          name: 'DepartmentList',
          meta: {
            title: '机构列表',
            activeMenu: '/system/department/list'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/system/department/form'),
          name: 'DepartmentAdd',
          hidden: true,
          meta: {
            title: '新建机构',
            activeMenu: '/system/department/add'
          }
        },
        {
          path: 'edit',
          component: () => import('@/views/system/department/form'),
          name: 'DepartmentEdit',
          hidden: true,
          meta: {
            title: '编辑机构',
            activeMenu: '/system/department/add'
          }
        }
      ]
    },

    {
      path: 'user',
      component: () => import('@/views/system/index'),
      name: 'UserView',
      redirect: { name: 'UserList' },
      meta: { title: '用户管理' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/user/list'),
          name: 'UserList',
          meta: {
            title: '用户列表',
            activeMenu: '/system/user/list'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/system/user/form'),
          name: 'UserAdd',
          hidden: true,
          meta: {
            title: '新建用户',
            activeMenu: '/system/user/list'
          }
        },
        {
          path: 'edit',
          component: () => import('@/views/system/user/form'),
          name: 'UserEdit',
          hidden: true,
          meta: {
            title: '编辑用户',
            activeMenu: '/system/user/list'
          }
        }
      ]
    },

    {
      path: 'dictionary',
      component: () => import('@/views/system/index'),
      name: 'DictionaryView',
      redirect: { name: 'DictionaryList' },
      meta: { title: '字典管理' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/dictionary/list'),
          name: 'DictionaryList',
          meta: {
            title: '字典列表',
            activeMenu: '/system/dictionary/list'
          }
        },
        {
          path: 'add',
          component: () => import('@/views/system/dictionary/form'),
          name: 'DictionaryAdd',
          hidden: true,
          meta: {
            title: '新建字典',
            activeMenu: '/system/dictionary/list'
          }
        },
        {
          path: 'edit',
          component: () => import('@/views/system/dictionary/form'),
          name: 'DictionaryEdit',
          hidden: true,
          meta: {
            title: '编辑字典',
            activeMenu: '/system/dictionary/list'
          }
        },
        {
          path: 'data',
          component: () => import('@/views/system/dictionary/data'),
          name: 'DictionaryDataList',
          hidden: true,
          meta: {
            title: '字典数据',
            activeMenu: '/system/dictionary/list'
          }
        }
      ]
    },

    {
      path: 'permission',
      component: () => import('@/views/system/index'),
      name: 'MenuView',
      redirect: { name: 'PermissionList' },
      hidden: true,
      meta: {
        title: '权限管理'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/permission/list'),
          name: 'PermissionList',
          meta: {
            title: '菜单管理',
            activeMenu: '/system/permission/list'
          }
        },

        {
          path: 'add',
          component: () => import('@/views/system/permission/form'),
          name: 'PermissionAdd',
          hidden: true,
          meta: {
            title: '菜单新增',
            activeMenu: '/system/permission/list'
          }
        }
      ]
    },

    {
      path: 'log',
      component: () => import('@/views/system/index'),
      name: 'LogView',
      redirect: { name: 'LogList' },
      meta: {
        title: '系统日志'
      },
      children: [
        {
          path: 'list',
          component: () => import('@/views/system/log/list'),
          name: 'LogList',
          meta: {
            title: '系统日志',
            activeMenu: '/system/log/list'
          }
        }
      ]
    }
  ]
}
