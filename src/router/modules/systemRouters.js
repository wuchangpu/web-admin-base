import Layout from "@/views/layout/Layout";

// 系统设置
const systemRouters = {
  path: '/system',
  name: 'SystemManagement',
  component: Layout,
  redirect: '/system/dictionary/list',
  alwaysShow: true, 
  meta: { title: "系统管理", icon: "sys" },
  children: [
    {
      path: 'dictionary',
      name: 'SystemDictionary',
      component: () => import("@/views/system/dictionary"),
      meta: { title: "数据字典" },
      redirect: '/system/dictionary/list',
      children: [
        {
          path: 'list',
          name: 'SystemDictionaryList',
          component: () => import("@/views/system/dictionary/list"),
          meta: { title: '数据字典', icon: "dictionary", breadcrumb: false }
        },
        {
          path: 'detail',
          hidden: true,
          name: 'SystemDictionaryDetail',
          component: () => import("@/views/system/dictionary/detail"),
          meta: { title: '字典查询', icon: "permission" }
        }
      ]
    },
    {
      path: 'journal',
      name: 'SystemJournal',
      component: () => import("@/views/system/journal"),
      children: [
        {
          path: 'list',
          name: 'SystemJournalList',
          component: () => import("@/views/system/journal/list"),
          meta: { title: '系统日志', icon: "sys_log" }
        },
      ]
    }
  ]
}

export default systemRouters