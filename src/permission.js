import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式

let addRoutesCompeleted = false;
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.state.user.userInfo.token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      let lastPath = sessionStorage.getItem('lastPath');
      if(lastPath && lastPath === to.path && !addRoutesCompeleted){
        store.dispatch('GenerateRoutes', store.state.permission.resMenu).then(() => {
          console.log('permission-router',router)
          router.addRoutes(store.state.permission.addRouters);
          addRoutesCompeleted = true; // next(to)会再次执行一次beforeEach钩子，所以加此判断，不然会死循环
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        }).catch(err => {
          console.log(err);
        });
      } else {
        next();
      }
      sessionStorage.setItem('lastPath', to.path);
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})