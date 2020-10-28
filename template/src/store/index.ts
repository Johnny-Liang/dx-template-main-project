import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import createPersistedState from 'vuex-persistedstate'

import { app } from './modules/app/index'
import { user } from './modules/user/index'
import { permission } from './modules/permission/index'
import { cacheView } from './modules/cacheView/index'
import getters from './getters'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  modules: {
    app,
    user,
    permission,
    cacheView
  },
  getters,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer (val) {
      return {
        user: val.user
      }
    }
  })]
}

export default new Vuex.Store<RootState>(store)
