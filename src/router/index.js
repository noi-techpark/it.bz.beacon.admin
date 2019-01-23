import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '../components/LoginView'
import UsersView from '../components/UsersView'
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
    }
  ]
})

// Simple access control
router.beforeEach((to, from, next) => {
  store.dispatch('login/checkLogin').then((loggedIn) => {
    if (loggedIn) {
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
        next()
      } else {
        next({ name: 'login' })
      }
    })
  })
})

export default router
