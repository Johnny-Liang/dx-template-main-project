import { Module, MutationTree } from 'vuex'
import { App, Flexible } from './types'
import { RootState } from '@/store/types'

const state: App = {
  menu: {
    active: [-1, -1], // [当前系统下标, 当前系统的当前模块下标]
    systemRoutes: {},
    systemName: ''
  },
  fullScreen: false,
  flexible: {
    outerWidth: 0, // 根据比例得出的大屏内容渲染宽度
    outerHeight: 0, // 根据比例得出的大屏内容渲染高度
    fontSize: 16,
    screenW: 0,
    screenH: 0
  }
}

const actions = {
  SetMenuActived ({ commit, rootState }: any, actived: string) {
    if (actived) {
      commit('SET_SYSTEM_ROUTES', rootState.permission.addRoutes[actived[0]].children)
      commit('SET_SYSTEM_NAME', rootState.permission.addRoutes[actived[0]].meta.label)
      commit('SET_MENU_ACTIVE', actived)
    }
  },
  SetSystemRoutes ({ commit }: any, actived: {}) {
    commit('SET_SYSTEM_ROUTES', actived)
  },
  FullScreenToggle ({ commit }: any) {
    commit('FULL_SCREEN_TOGGLE')
  },
  SetFlexible ({ commit }: any, actived: Flexible) {
    commit('SET_FLEXIBLE', {...actived, screenW: window.innerWidth, screenH: window.innerHeight})
  }
}

const mutations: MutationTree<App> = {
  SET_MENU_ACTIVE (state, actived: number[]) {
    state.menu.active = actived
  },
  SET_SYSTEM_ROUTES (state, actived: {name: string}) {
    state.menu.systemRoutes = actived
  },
  SET_SYSTEM_NAME (state, actived: string) {
    state.menu.systemName = actived
  },
  FULL_SCREEN_TOGGLE (state) {
    state.fullScreen = !state.fullScreen
  },
  SET_FLEXIBLE (state, actived: Flexible) {
    state.flexible = actived
  }
}

export const app: Module<App, RootState> = {
  state,
  actions,
  mutations
}