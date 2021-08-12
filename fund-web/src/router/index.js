import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/fund/fund')
  },
  {
    path: '/member-login',
    name: '会员登录页',
    component: () => import('@/views/login/member-login')
  }
]

const router = new VueRouter({
  routes
})

export default router
