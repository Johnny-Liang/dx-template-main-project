import { RootState } from './types'
const getters = {
  routes: (state: RootState) => state.permission.routes,
  add_routes: (state: RootState) => state.permission.addRoutes,
  perm_btn: (state: RootState) => state.permission.permBtn,
  system_active: (state: RootState) => state.app.menu.active
}
export default getters
