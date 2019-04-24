import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 递归获取有权限访问的页面的url
 * @param menu
 */
let urls = [];
function getMenuUrls(menu) {
  menu.forEach(item => {
    
    if (item.url) {
      urls.push(item.url)
    }
    if (item.list && item.list.length) {
      getMenuUrls(item.list);
    }
  });
}

function getMenuBtnUrls(menu) {
  menu.forEach(item => {
    if(item.permList.length && (item.parentId === '3')) {
      item.permList.forEach(current => {
        urls.push(current.permsKey.split(':').join('/'));
      });
    }
    
    if (item.list && item.list.length) {
      getMenuBtnUrls(item.list);
    }
  });
}

/**
 * 递归给异步路由增加level属性，便于筛选
 * @param routes
 */
function addLevel(routes){
  routes.forEach(route => {
    if(!route.level) {
      route.level = 1;
      route.fullPath = route.path;
    };
    if(route.children && route.children.length){
      route.children.forEach(v => {
        v.level = route.level + 1;
        v.fullPath = route.fullPath + '/' + v.path;
      });
      addLevel(route.children)
    }
  });
}
function delLevel(routes){
  routes.forEach(route => {
    if(route.level) delete route.level;
    if(route.children && route.children.length){
      delLevel(route.children)
    }
  });
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(route) {
//   let has, arr = [];
//   urls.forEach(item => {
//     arr.push(item.split('/')[route.level - 1])
//   });
//   if(route.level === 1){
//     has = arr.includes(route.path.split('/')[1])
//   } else {
//     has = arr.includes(route.path)
//   }
  
//   return has
// }
function hasPermission(route) {
  let has, arr = [];
  urls.forEach(item => {
    let str = '';
    item.split('/').forEach((v,i) => {
      if(route.level > i) str += '/' + v;
    });
    arr.push( str )
  });
  // console.log('arr',arr,route.fullPath)
  has = arr.includes(route.fullPath)
  return has
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 */
function filterAsyncRouter(routes) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children)
      }
      res.push(tmp)
    }
  })

  return res
}

// 恢复Vuex 相应模块里面的数据 fix: 刷新页面，vuex数据会丢失
// const data = (sessionStorage.getItem('common') && JSON.parse(sessionStorage.getItem('common'))) || {}
const data = JSON.parse(sessionStorage.getItem('permission'))

const permission = {
  state: {
    routers: data && data.routers || [],
    addRouters: data && data.addRouters || [],
    resMenu: data && data.resMenu || [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers).filter(current => current.name !== 'MenuManagement');
      
    },
    SET_RES_MENU(state, val){
      state.resMenu = val;
    },
  },
  actions: {
    GenerateRoutes({ commit }, menuData) {
      return new Promise(resolve => {
        // 获取urls
        getMenuUrls(menuData.menuList, 'list', 'url');
        getMenuBtnUrls(menuData.menuList);
        // let btnPers = [];

        // if(menuData.menuList.permList && menuData.menuList.permList.length){
        //   menuData.permList.forEach(item => {
        //     btnPers.push(item.split(':').join('/'));
        //   });
        // }

        // urls.push(...btnPers);
        // console.log('urls', urls)
        // urls = ['form/index', 'example/table', 'example/tree', 'nested/menu1/menu1-2/menu1-2-1', 'nested/menu1/menu1-2/menu1-2-2']

        // 给路由增加level标识
        addLevel(asyncRouterMap)
        // console.log('asyncRouterMapLevel', asyncRouterMap)

        // 筛选
        let accessedRouters = filterAsyncRouter(asyncRouterMap)
        // console.log('accessedRouters',accessedRouters)

        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    setResMenu({ commit }, val){
      commit('SET_RES_MENU', val)
    },
  }
}

export default permission