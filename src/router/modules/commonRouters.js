import Layout from "@/views/menu/Layout";

// 菜单设置
const commonRouters = {
  path: '/menu',
  name: 'MenuManagement',
  component: Layout,
  redirect: '/menu/creator',
  alwaysShow: true, 
  meta: { title: "菜单管理", icon: "sys", hidden: true },
  children: [
    {
      path: 'creator',
      name: 'ManageSystemMenu',
      component: () => import('@/views/menu/creator'),
      meta: { title: '创客空间管理系统', hidden: true }
    },
    {
      path: 'project',
      name: 'ProjectSystemMenu',
      component: () => import('@/views/menu/project'),
      meta: { title: '工程训练管理信息系统', hidden: true }
    }
  ]
};

export default commonRouters;