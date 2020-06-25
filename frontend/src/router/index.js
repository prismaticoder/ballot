import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AdminHome from '../views/admin/Home.vue'
import Major from '../views/admin/Major.vue'
import Voters from '../views/admin/Voters.vue'
import Candidates from '../views/Candidates.vue'
import CandidateApply from '../views/CandidateApply.vue'
import CandidateAppCheck from '../views/CandidateAppCheck.vue'
import Accreditation from '../views/Accreditation.vue'
import ConfirmAccreditation from '../views/ConfirmAccreditation.vue'
import Stats from '../views/Stats.vue'
import Vote from '../views/Vote.vue'
import Result from '../views/Result.vue'
import SingleCandidate from '../views/SingleCandidate.vue'
import AdminLogin from '../views/AdminLogin.vue'
import AdminCandidates from '../views/admin/Candidates.vue'
import AdminAccreditation from '../views/admin/Accreditation.vue'
import AdminResult from '../views/admin/Result.vue'
import Settings from '../views/admin/Settings.vue'
import PageNotFound from '../views/PageNotFound.vue'
import store from '../store';


Vue.use(VueRouter)

const appName = process.env.VUE_APP_NAME;

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: `Ballot | ${appName}`,
      requiresCheck: true
    }
  },
  {
    path: '/candidates',
    name: 'all-candidates',
    component: Candidates,
    meta: {
      title: `Ballot | ${appName} - Candidates`
    }
  },
  {
    path: '/candidates/apply',
    name: 'candidate-apply',
    component: CandidateApply,
    meta: {
      title: `Ballot | ${appName} - Apply For Candidacy`,
      requiresCheck: true
    }
  },
  {
    path: '/candidates/application-check',
    name: 'candidate-app-check',
    component: CandidateAppCheck,
    meta: {
      title: `Ballot | ${appName} - Check Application Status`,
    }
  },
  {
    path: '/candidates/:id',
    name: 'single-candidate',
    component: SingleCandidate,
    meta: {
      title: `Ballot | ${appName} - View Candidate`,
    }
  },
  {
    path: '/accreditation',
    name: 'accreditation',
    component: Accreditation,
    meta: {
      title: `Ballot | ${appName} - Voter Accreditation`,
      requiresCheck: true,
      onlyState: 'prevoting'
    }
  },
  {
    path: '/confirm_accreditation',
    name: 'confirm_accreditation',
    component: ConfirmAccreditation,
    meta: {
      title: `Ballot | ${appName} - Confirmation`
    }
  },
  {
    path: '/reset_code',
    name: 'reset_code',
    component: ConfirmAccreditation,
    meta: {
      title: `Ballot | ${appName} - Confirmation`
    }
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats,
    meta: {
      title: `Ballot | ${appName} - Realtime Voter Statistics`,
      requiresCheck: true,
      onlyState: 'voting'
    }
  },
  {
    path: '/vote',
    name: 'vote',
    component: Vote,
    meta: {
      title: `Ballot | ${appName} - Vote`,
      requiresCheck: true,
      onlyState: 'voting'
    }
  },
  {
    path: '/results',
    name: 'results',
    component: Result,
    meta: {
      title: `Ballot | ${appName} - View Results`,
      requiresCheck: true,
      onlyState: 'postvoting'
    }
  },
  {
    path: '/command/login',
    name: 'admin-login',
    component: AdminLogin,
    meta: {
      title: `Ballot | ${appName} - Command Login`
    }
  },
  {
    path: '/command',
    name: 'admin-home',
    component: AdminHome,
    meta: {
      title: `Ballot | ${appName} - Command Post Home`,
      requireAuth: true,
      requiresCheck: true
    }
  },
  {
    path: '/command/voters',
    name: 'voters',
    component: Voters,
    meta: {
      title: `Ballot | ${appName} - Command Post | Download Voter List`,
      requireAuth: true
    }
  },
  {
    path: '/command/candidates',
    name: 'candidates',
    component: AdminCandidates,
    meta: {
      title: `Ballot | ${appName} - Command Post | Review Candidate Applications`,
      requireAuth: true
    }
  },
  {
    path: '/command/candidates/:id',
    name: 'candidates-single',
    component: SingleCandidate,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/command/settings',
    name: 'admin-settings',
    component: Settings,
    meta: {
      title: `Ballot | ${appName} - Command Post | Election Settings`,
      requireAuth: true,
      requiresCheck: true
    }
  },
  {
    path: '/command/accreditation',
    name: 'admin-accreditation',
    component: AdminAccreditation,
    meta: {
      title: `Ballot | ${appName} - Command Post | Accredit Voters`,
      requireAuth: true,
      requiresCheck: true
    }
  },
  {
    path: '/command/results',
    name: 'admin-results',
    component: AdminResult,
    meta: {
      title: `Ballot | ${appName} - Command Post | View And Approve Election Results`,
      requireAuth: true,
      requiresCheck: true
    }
  },
  {
    path: '/command/major',
    name: 'main-command',
    component: Major,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/page-not-found',
    name: '404',
    component: PageNotFound,
    meta: {
      title: `Ballot | ${appName} - Page Not Found`
    }
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound,
    meta: {
      title: `Ballot | ${appName} - Page Not Found`
    }
  },


]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  if(to.matched.some(record => record.meta.requiresCheck)) {
    store.dispatch('setState')
    .then(res => {
      if (to.matched.some(record => record.meta.onlyState && record.meta.onlyState !== res)) {
        return next({
          path: '/page-not-found'
        })
      }
    })
    .catch(err => console.log(err))
  }



  if(to.matched.some(record => record.meta.requireAuth)) {
    let token = localStorage.getItem('userToken');
    if (token) {
      return next()
    }
    next({
      path: '/command/login',
      nextUrl: to.fullPath
    }) 
  } 
  
  else {
    next() 
  }
})

export default router
