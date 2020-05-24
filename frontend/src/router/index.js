import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AdminHome from '../views/admin/Home.vue'
import Voters from '../views/admin/Voters.vue'
import Candidates from '../views/Candidates.vue'
import CandidateApply from '../views/CandidateApply.vue'
import CandidateAppCheck from '../views/CandidateAppCheck.vue'
import Accreditation from '../views/Accreditation.vue'
import SingleCandidate from '../views/SingleCandidate.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminCandidates from '../views/admin/Candidates.vue'
import AdminAccreditation from '../views/admin/Accreditation.vue'
import Settings from '../views/admin/Settings.vue'
import PageNotFound from '../views/PageNotFound.vue'
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
    path: '/candidates/apply',
    name: 'candidate-apply',
    component: CandidateApply
  },
  {
    path: '/candidates/application-check',
    name: 'candidate-app-check',
    component: CandidateAppCheck
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
    path: '/ecom/login',
    name: 'admin-login',
    component: AdminLogin,
  },
  {
    path: '/ecom',
    name: 'admin-home',
    component: AdminHome,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/ecom/voters',
    name: 'voters',
    component: Voters,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/ecom/candidates',
    name: 'candidates',
    component: AdminCandidates,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/ecom/candidates/:id',
    name: 'candidates-single',
    component: SingleCandidate,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/ecom/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/ecom/accreditation',
    name: 'admin-accreditation',
    component: AdminAccreditation,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/page-not-found',
    name: '404',
    component: PageNotFound,
    meta: {
      title: "Ballot | Page Not Found"
    }
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound,
    meta: {
      title: "Ballot | Page Not Found"
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
