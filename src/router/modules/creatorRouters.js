import Layout from "@/views/layout/Layout";

const creatorRouters = {
  path: '/creator',
  name: 'CreatorManagement',
  component: Layout,
  redirect: { name: 'ManageSystemMenu' },
  meta: { title: "创客空间", icon: "sys" },
  children: [
    {
      path: 'role',
      name: 'RoleManagement',
      component: () => import('@/views/role/index'),
      meta: { title: '角色管理' },
      redirect: { name: 'RoleManagementList' },
      children: [
        {
          path: 'list',
          name: 'RoleManagementList',
          component: () => import('@/views/role/list'),
          meta: { title: '角色管理', icon: "approve", breadcrumb: false }
        },
        {
          path: 'save',
          name: 'RoleManagementForm',
          hidden: true,
          component: () => import('@/views/role/form'),
          meta: { title: '角色新增', permission: 'creator:role:add' }
        },
        {
          path: 'update',
          name: 'RoleManagementFormUpdate',
          hidden: true,
          component: () => import('@/views/role/form'),
          meta: { title: '角色修改', permission: 'creator:role:update' }
        },
        {
          path: 'info',
          name: 'RoleManagementDetail',
          hidden: true,
          component: () => import('@/views/role/form'),
          meta: { title: '角色详情', permission: 'creator:role:info' }
        }
      ]
    },
    {
      path: 'admin',
      name: 'AdminManagement',
      component: () => import('@/views/admin/index'),
      redirect: { name: 'AdminManagementList' },
      children: [
        {
          path: 'list',
          name: 'AdminManagementList',
          component: () => import('@/views/admin/list'),
          meta: { title: '管理员设置' }
        }
      ]
    }
  ],
};

export default creatorRouters;