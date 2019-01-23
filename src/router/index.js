import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '../components/LoginView'
import UsersView from '../components/UsersView'
import UserView from '../components/UserView'
import HomeView from '../components/HomeView'
import store from '../store/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView
    },
    {
      path: '/user/:id',
      name: 'user',
      component: UserView
    }
  ]
})

// Simple access control
router.beforeEach((to, from, next) => {
  function routeActions() {
    if (to.name === 'users' || (to.name === 'user' && from.name !== 'users')) {
      store.dispatch('users/fetchUsers')
    }
  }
  store.dispatch('login/checkLogin').then((loggedIn) => {
    if (loggedIn) {
      routeActions()
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

    store.dispatch('login/doAuth').then((authorized) => {
      if (authorized) {
        routeActions()
        next()
      } else {
        next({ name: 'login' })
      }
    })
  })
})

export default router
