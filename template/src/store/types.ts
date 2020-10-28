import { User } from './modules/user/types'
import { Permission } from './modules/permission/types'
import { CacheView } from './modules/cacheView/types'
export interface RootState {
  app: any;
  user: User;
  permission: Permission;
  cacheView: CacheView;
}