import Layout from "@/views/layout/Layout";

// 菜单设置
const projectRouters = {
  path: '/project',
  name: 'ProjectManagement',
  component: Layout,
  redirect: { name: 'ProjectSystemMenu' },
  alwaysShow: true, 
  meta: { title: "工程训练管理信息系统", icon: "sys", hidden: true },
  children: [
    {
      path: 'table',
      name: 'GraphTable',
      component: () => import('@/views/graph/index'),
      meta: { title: '创客空间数据面板', hidden: true },
      redirect: { name: 'ProjectTableGraph' },
      children: [
        {
          path: 'graph',
          name: 'ProjectTableGraph',
          component: () => import('@/views/graph/graph'),
          meta: { title: '数据面板' }
        }
      ]
    },
  ]
};

export default projectRouters;