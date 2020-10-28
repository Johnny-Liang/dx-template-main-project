import { Module, MutationTree } from 'vuex'
import { CacheView, Route } from './types'
import { RootState } from '@/store/types'

const initState: CacheView = {
  noCache: false,
  cachedNames: [],
  visitedViews: []
}

const actions = {
  addView({ dispatch, state }: any, view: Route) {
    if (!state.noCache) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    }
  },
  addVisitedView({ commit }: any, view: Route) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }: any, view: Route) {
    commit('ADD_CACHED_VIEW', view)
  },

  delView({ dispatch, state }: any, view: Route) {
    return new Promise(resolve => {
      dispatch('delVisitedView', view)
      dispatch('delCachedView', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedNames: [...state.cachedNames]
      })
    })
  },
  delVisitedView({ commit, state }: any, view: Route) {
    return new Promise(resolve => {
      commit('DEL_VISITED_VIEW', view)
      resolve([...state.visitedViews])
    })
  },
  delCachedView({ commit, state }: any, view: Route) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedNames])
    })
  },

  delOthersViews({ dispatch, state }: any, view: Route) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', view)
      dispatch('delOthersCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedNames: [...state.cachedNames]
      })
    })
  },
  delOthersVisitedViews({ commit, state }: any, view: Route) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_VISITED_VIEWS', view)
      resolve([...state.visitedViews])
    })
  },
  delOthersCachedViews({ commit, state }: any, view: Route) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', view)
      resolve([...state.cachedNames])
    })
  },

  delAllViews({ dispatch, state }: any, view: Route) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', view)
      dispatch('delAllCachedViews', view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedNames: [...state.cachedNames]
      })
    })
  },
  delAllVisitedViews({ commit, state }: any) {
    return new Promise(resolve => {
      commit('DEL_ALL_VISITED_VIEWS')
      resolve([...state.visitedViews])
    })
  },
  delAllCachedViews({ commit, state }: any) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedNames])
    })
  },

  updateVisitedView({ commit }: any, view: Route) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

const mutations: MutationTree<CacheView> = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some((v, i) => {
      if (v.path === view.path) {
        state.visitedViews[i] = {...state.visitedViews[i], ...view}
        return v.path === view.path
      }
    })) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.label || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedNames.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedNames.push(view.name)
    }
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    for (const i of state.cachedNames) {
      if (i === view.name) {
        const index = state.cachedNames.indexOf(i)
        state.cachedNames.splice(index, 1)
        break
      }
    }
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view) => {
    for (const i of state.cachedNames) {
      if (i === view.name) {
        const index = state.cachedNames.indexOf(i)
        state.cachedNames = state.cachedNames.slice(index, index + 1)
        break
      }
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedNames = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

export const cacheView: Module<CacheView, RootState> = {
  namespaced: true,
  state: initState,
  actions,
  mutations
}
