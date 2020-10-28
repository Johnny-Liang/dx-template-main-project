import router from './index'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route, RouteConfig } from 'vue-router'

const BIGSCREEN_PATH = '/bigScreen' // 硬编码配置，识别大屏路径

const whiteList = ['/login']
NProgress.configure({ showSpinner: false })

const getLastChild = (route: RouteConfig): RouteConfig => {
  if (route.children && route.children.length > 0) {
    return getLastChild(route.children[0])
  }
  return route
}

router.beforeEach((to: Route, from: Route, next: Function) => {
  NProgress.start()
  const token = sessionStorage.getItem('authorization')
  if (token) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.routes.length === 0) {
        // 路由信息是不是组装完
        store.dispatch('generateRoutes').then(accessRoutes => {
          // 生成可访问的路由表
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        })
      } else {
        // 进入页面前设置菜单
        if (JSON.stringify(store.getters.system_active) !== JSON.stringify(to.meta.systemIndex)) { // 选中的系统与模块与当前设置不一致时更新
          store.dispatch('SetMenuActived', to.meta.systemIndex)
        }
        // 若当前用户只存在一个模块的权限且非大屏、或该模块为大屏且只有一个大屏时，直接进入该系统
        const add_routes = store.getters.add_routes
        if (to.path === '/' && ((add_routes.length === 1 && add_routes[0].path !== BIGSCREEN_PATH) || (add_routes[0].path === BIGSCREEN_PATH && add_routes.length <= 1 && add_routes[0].children && add_routes[0].children.length === 1))) {
          const lastChild = getLastChild(add_routes[0])
          if (to.path === lastChild.path) return false
          next(lastChild)
          NProgress.done()
        } else {
          next()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
router.afterEach((to: Route) => {
  if (!to.meta.noCache) { // 新增缓存tag
    store.dispatch('cacheView/addView', to)
  }
  NProgress.done()
})
