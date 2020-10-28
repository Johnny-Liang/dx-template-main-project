import { Module, MutationTree } from 'vuex'
import { User } from './types'
import { RootState } from '@/store/types'

const initState: User = {
  userId: 0,
  authorization: '',
  name: '',
  username: '',
  employeeCode: ''
}

const actions = {
  SetAuthorization ({ commit }: any, actived: string) {
    sessionStorage.setItem('authorization', actived)
    commit('SET_AUTHORIZATION', actived)
  },
  SetUserInfo ({ commit }: any, actived: {authorization: string}) {
    sessionStorage.setItem('authorization', actived.authorization)
    commit('SET_USER_INFO', actived)
  },
  Logout ({ commit }: any) {
    sessionStorage.removeItem('authorization')
    commit('LOGOUT')
  }
}

const mutations: MutationTree<User> = {
  SET_AUTHORIZATION (state, actived: string) {
    state.authorization = actived
  },
  SET_USER_INFO (state, actived: {name: string, authorization: string, username: string, employeeCode: string, userId: number}) {
    state.userId = actived.userId
    state.name = actived.name
    state.employeeCode = actived.employeeCode
    state.username = actived.username
    state.authorization = actived.authorization
  },
  LOGOUT (state) {
    state = initState
    location.reload()
  }
}

export const user: Module<User, RootState> = {
  state: initState,
  actions,
  mutations
}