import { Route } from 'vue-router'
export { Route }
export interface CacheView {
  noCache: boolean,
  cachedNames: string[],
  visitedViews: Route[]
}