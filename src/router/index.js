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
  debugger
  function redirect() {
    if (to.name === 'login') {
      next({ name: 'home' })
    } else {
      next()
    }
  }

  store.dispatch('login/checkLogin').then((loggedIn) => {
    debugger
    if (loggedIn) {
      redirect()
    } else {
      store.dispatch('login/doAuth').then((authorized) => {
        debugger
        if (authorized) {
          redirect()
        }
      })
    }
  })
})

export default router
