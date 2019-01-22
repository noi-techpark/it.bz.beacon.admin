import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Users from '../components/Users'
import Home from '../components/Home'
import store from '../store/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/users',
      name: 'users',
      component: Users
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
      debugger
      if (authorized) {
        next()
      } else {
        next({ name: 'login' })
      }
    })
  })
})

export default router
