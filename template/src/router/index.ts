import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/views/Home.vue'
import login from '@/views/login.vue'
import test from '@/views/test.vue'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/',
    name: 'home',
    component: home,
    meta: {
      rootPage: true,
      noCache: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      rootPage: true,
      noCache: true
    }
  },
  {
    path: '/test',
    name: 'test',
    component: test,
    meta: {
      rootPage: true,
      noCache: true
    }
  },
  {
    path: '/redirect/:path(.*)',
    hidden: true,
    component: () => import('@/views/redirect.vue'),
    meta: {
      noCache: true
    }
  },
]

const router = new VueRouter({
  routes: constantRoutes
})

export default router
