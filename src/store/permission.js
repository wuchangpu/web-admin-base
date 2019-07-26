import { asyncRoutes, constantRoutes } from '@/router'
import session from '@/utils/session'

const result = session.get('permission')

function getMenuUrls(menu) {
  const urls = {
    menu: [],
    permission: []
  }
  menu.forEach(item => {
    if (item.url) {
      urls.menu.push(item.url)
    }
    if (item.list && item.list.length) {
      const result = getMenuUrls(item.list)
      urls.menu.push(...result.menu)
      urls.permission.push(...result.permission)
    }

    if (item.permList.length && (item.menuType === '1')) {
      item.permList.forEach(current => {
        urls.permission.push(current.permsKey)
        urls.menu.push(current.permsKey.split(':').join('/'))
      })
    }
  })

  return urls
}

function addLevel(routes) {
  routes.forEach(current => {
    if (!current.level) {
      current.level = 1
      current.fullPath = current.path
    }

    if (current.children && current.children.length) {
      current.children.forEach(child => {
        child.level = current.level + 1
        child.fullPath = current.fullPath + '/' + child.path
      })

      addLevel(current.children)
    }
  })
}

function filterAsyncRoutes(routes, hasPermissionFunc) {
  const res = []

  routes.forEach(route => {
    if (hasPermissionFunc(route)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, hasPermissionFunc)
      }

      res.push(route)
    }
  })

  return res
}

function hasPermission(urls) {
  return (route) => {
    let has = false
    const arr = []
    urls.forEach(item => {
      let str = ''
      item.split('/').forEach((v, i) => {
        if (route.level > i) str += '/' + v
      })
      arr.push(str)
    })

    has = arr.includes(route.fullPath)
    return has
  }
}

const state = result || {
  routers: constantRoutes,
  addRouters: [],
  permissions: []
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRoutes.concat(routers)
  },

  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  ROUTER_FILTER({ commit }, data) {
    return new Promise((resolve, reject) => {
      const { menu, permission } = getMenuUrls(data)

      const hasPermissionFunc = hasPermission(menu)

      addLevel(asyncRoutes)

      const result = filterAsyncRoutes(asyncRoutes, hasPermissionFunc)
      commit('SET_ROUTERS', result)
      commit('SET_PERMISSIONS', permission)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
