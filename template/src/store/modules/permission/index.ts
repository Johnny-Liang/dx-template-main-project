import Vue from 'vue'
import { constantRoutes } from '@/router'
import { Module, MutationTree } from 'vuex'
import { Permission } from './types'
import { RootState } from '@/store/types'
import { getRouters } from '@/api/menu'
import RouterView from '@/components/RouterView.vue'
import Layout from '@/components/Layout.vue'


const initState: Permission = {
  addRoutes: [],
  routes: [],
  permBtn: []
}

const actions = {
  async generateRoutes({ commit }: any, actived: string) {
    return new Promise(async (resolve) => {
      const res = await getRouters()
      console.log(res.data.data)
      const { routes, permBtn} = filterAsyncRouter(res.data.data, 1)
      console.log(routes)
      commit('SET_ROUTES', routes)
      commit('SET_PERM_BTN', permBtn)
      resolve(routes)
    })
  }
}

const mutations: MutationTree<Permission> = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERM_BTN: (state, permBtn) => {
    state.permBtn = permBtn
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any[], hier: number, systemIndex?: number, moduleIndex?: number) {
  return asyncRouterMap.reduce((acc, route, index) => {
    // 组织组件名称，用于缓存识别组件
    let name = 'no-name'
    if (route.path) {
      let pathNames = route.path.match(/\w+/g)
      if (pathNames) {
        if (pathNames[pathNames.length - 1] !== 'index') {
          name = pathNames[pathNames.length - 1].replace(/\w/, (str: string) => {
            return str.toUpperCase()
          })
        } else {
          name = pathNames[pathNames.length - 2].replace(/\w/, (str: string) => {
            return str.toUpperCase()
          })
        }
      } 
    }
    // Layout组件特殊处理
    switch (route.type) {
      case 1:
        route.component = (hier === 1 && route.component !== 'bigScreen') ? Layout : RouterView
        break;
      case 2:
        route.component = loadView(route.component)
        break;
      case 3:
        acc.permBtn.push(route.id)
        break;
      default:
        break;
    }
    if (route.childrenList != null && route.childrenList) {
      const { routes, permBtn } = filterAsyncRouter(route.childrenList, hier + 1, hier === 1 ? index : systemIndex, hier === 2 ? index : moduleIndex)
      route.childrenList = routes
      acc.permBtn = [ ...acc.permBtn, ...permBtn ]
    }
    if (route.type < 3) {
      acc.routes.push({
        name: name,
        path: route.path,
        children: (route.childrenList && route.childrenList.length > 0) ? route.childrenList : null,
        meta: {
          label: route.name,
          icon: route.icon,
          systemIndex: [hier === 1 ? index : systemIndex, hier === 2 ? index : moduleIndex]
        },
        component: route.component
      })
    }
    return acc
  }, {routes: [], permBtn: []})
}

const loadBuildView = require('@/../module_cache/loadBuildView').default
// if (process.env.NODE_ENV !== 'development') {
  // loadBuildView = require('@/../module_cache/loadBuildView').default
// }

export const loadView = (view: string) => {
  const moduleName = view.match(/-/g) !== null ? view.replace(/-[^-]+$/, '') : 'dh-portal'
  const compPath = view.replace(/(\w+-)+/, '')
  // if (process.env.NODE_ENV === 'development') {
  //   return () => import(`subp/views/${compPath}.vue`)
  //   // return Vue.component
  // } else {
    return loadBuildView && loadBuildView(moduleName, compPath)
    // return () => import(`@/../node_modules/${moduleName}/src/views/${compPath}.vue`)
  // }
}


export const permission: Module<Permission, RootState> = {
  state: initState,
  actions,
  mutations
}