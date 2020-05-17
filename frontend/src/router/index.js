import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AdminHome from '../views/admin/Home.vue'
import Voters from '../views/admin/Voters.vue'
import Candidates from '../views/Candidates.vue'
import Accreditation from '../views/Accreditation.vue'
import SingleCandidate from '../views/SingleCandidate.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminCandidates from '../views/admin/Candidates.vue'
import Settings from '../views/admin/Settings.vue'
import store from '../store'


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
    path: '/candidates',
    name: 'all-candidates',
    component: Candidates
  },
  {
    path: '/candidates/:id',
    name: 'single-candidate',
    component: SingleCandidate
  },
  {
    path: '/accreditation',
    name: 'accreditation',
    component: Accreditation
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin,
  },
  {
    path: '/admin',
    name: 'admin-home',
    component: AdminHome,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/voters',
    name: 'voters',
    component: Voters,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/candidates',
    name: 'candidates',
    component: AdminCandidates,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/candidates/:id',
    name: 'candidates',
    component: SingleCandidate,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requireAuth: true
    }
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next({
      path: '/admin/login',
      nextUrl: to.fullPath
    }) 
  } else {
    next() 
  }
})

export default router
