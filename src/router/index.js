import Vue from "vue";
import Router from "vue-router";

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router);

/* Layout */
import Layout from "../views/layout/Layout";

/* modules */
import commonRouters from './modules/commonRouters'
import creatorRouters from './modules/creatorRouters'
import projectRouters from './modules/projectRouters'

/**
* hidden: true                   是否显示在侧边栏菜单（默认为false）
*
* alwaysShow: true               当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
*                                只有一个时，会将那个子路由当做根路由显示在侧边栏
*                                如果设置为true，将始终显示根菜单路由，无论是否有子路由（默认为false）
*
* redirect: noredirect           如果设置 `redirect:noredirect` ，则点击面包屑不会重定向跳转
*
* name:'router-name'             用于<keep-alive> (必须设置!!!不设置则使用<keep-alive>时会出现各种问题)
*
* path: 'path-name'              不支持'a/b'或者'a:1' 的写法
*
* meta : {
    title: 'title'               显示在侧边栏和面包屑的名称
    icon: 'svg-name'             侧边栏icon的svg-name
    breadcrumb: false            是否显示在面包屑（默认为true）
  }
**/
export const constantRouterMap = [
  // login
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  commonRouters,

  {
    path: '/addmenu',
    component: () => import('@/views/addmenu'),
  },

  // 404
  {
    path: '/404',
    component: () => import ('@/views/404'),
    hidden: true
  },
  { path: "/", redirect: "/login", hidden: true },
  // 菜单管理
  // {
  //   path: "/menu",
  //   component: Layout,
  //   children: [
  //     {
  //       path: "index",
  //       name: "Menu",
  //       meta: { title: "菜单管理", icon: "permission" },
  //       component: () => import("@/views/menu/index")
  //     }
  //   ]
  // }

  // { path: '*', redirect: '/404', hidden: true }
];

export const asyncRouterMap = [
  
  // permissionRouters,
  // systemRouters,

  creatorRouters,
  projectRouters,

  { path: "/", redirect: "/login", hidden: true },
  { path: "*", redirect: "/404", hidden: true }
  
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
