import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Candidates from '../components/Candidates.vue'

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
    component: Candidates,
    // children: [
    //   {
    //     path: '/candidates',
    //     name: 'candidates',
    //     component: Candidates
    //   },
    // ]
  }

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
