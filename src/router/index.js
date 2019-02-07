import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '../components/LoginView'
import UsersView from '../components/UsersView'
import UserView from '../components/UserView'
import UserAddView from '../components/UserAddView'
import BeaconsView from '../components/BeaconsView'
import BeaconView from '../components/BeaconView'
import IssuesView from '../components/IssuesView'
import store from '../store/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: BeaconsView,
      meta: {
        nav: 'beacons'
      }
    },
    {
      path: '/beacons',
      name: 'beacons',
      component: BeaconsView,
      meta: {
        nav: 'beacons'
      }
    },
    {
      path: '/beacons/:id',
      name: 'beacon-detail',
      component: BeaconView,
      meta: {
        nav: 'beacons'
      }
    },
    {
      path: '/issues',
      name: 'issues',
      component: IssuesView,
      meta: {
        nav: 'issues'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        nav: 'login'
      }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: {
        nav: 'users'
      }
    },
    {
      path: '/users/new',
      name: 'user-new',
      component: UserAddView,
      meta: {
        nav: 'users'
      }
    },
    {
      path: '/users/:id',
      name: 'user-edit',
      component: UserView,
      meta: {
        nav: 'users'
      }
    }
  ]
})

// Simple access control
router.beforeEach((to, from, next) => {
  // function routeActions() {
  //   if (to.name === 'users') {
  //     store.dispatch('users/all')
  //   }
  // }
  if (store.getters['login/hasLogin']) {
    // routeActions()
    if (to.name === 'login') {
      next({ name: 'home' })
    } else {
      next()
    }
    return
  }

  if (to.name === 'login') {
    next()
    return
  }

  store.dispatch('login/authenticate').then((authorized) => {
    if (authorized) {
      // routeActions()
      next()
    } else {
      next({ name: 'login' })
    }
  })
})

export default router
