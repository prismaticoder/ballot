import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AdminHome from '../views/admin/Home.vue'
import Voters from '../views/admin/Voters.vue'
import Candidates from '../views/admin/Candidates.vue'
import Settings from '../views/admin/Settings.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/admin',
    name: 'admin-home',
    component: AdminHome,
    // children: [
    //   {
    //     // path: '/voters',
    //     // name: 'voters',
    //     // component: Voters
    //   },
    // ]
  },
  {
    path: '/admin/voters',
    name: 'voters',
    component: Voters
  },
  {
    path: '/admin/candidates',
    name: 'candidates',
    component: Candidates
  },
  {
    path: '/admin/settings',
    name: 'settings',
    component: Settings
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
