import Vue from 'vue'
import Router from 'vue-router'
import LoginView from '../pages/LoginView'
import UsersView from '../pages/UsersView'
import UserView from '../pages/UserView'
import UserAddView from '../pages/UserAddView'
import GroupsView from '../pages/GroupsView'
import GroupView from '../pages/GroupView'
import GroupAddView from '../pages/GroupAddView'
import BeaconsView from '../pages/BeaconsView'
import BeaconView from '../pages/BeaconView'
import IssuesView from '../pages/IssuesView'
import ChangePasswordView from '../pages/ChangePasswordView'
import ResetPasswordView from '../pages/ResetPasswordView'
import ResetPasswordRequestView from "../pages/ResetPasswordRequestView";
import ResetPasswordChangeView from "../pages/ResetPasswordChangeView";
import store from '../store/store'
import {getUsers} from '../service/apiService'

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
      path: '/beacons/:id/issue/:issueId',
      name: 'beacon-detail',
      component: BeaconView,
      meta: {
        nav: 'beacons'
      }
    },
    {
      path: '/beacons',
      name: 'beacon-new',
      component: BeaconsView,
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
      path: '/issues/beacon/:id',
      name: 'issue-detail',
      component: BeaconView,
      meta: {
        nav: 'issues'
      }
    },
    {
      path: '/issues/beacon/:id/issue/:issueId',
      name: 'issue-detail-issue',
      component: BeaconView,
      meta: {
        nav: 'issues'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Home Page - Example App',
        metaTags: [
          {
            name: 'description',
            content: 'The home page of our example app.'
          },
          {
            property: 'og:description',
            content: 'The home page of our example app.'
          }
        ],
        nav: 'login'
      }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordRequestView,
      meta: {
        nav: 'login'
      }
    },
    {
      path: '/reset-password-change/:token',
      name: 'reset-password-change',
      component: ResetPasswordChangeView,
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
    },
    {
      path: '/users/:id/change-password',
      name: 'user-change-password',
      component: ChangePasswordView,
      meta: {
        nav: 'users'
      }
    },
    {
      path: '/users/:id/reset-password',
      name: 'user-reset-password',
      component: ResetPasswordView,
      meta: {
        nav: 'users'
      }
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsView,
      meta: {
        nav: 'groups'
      }
    },
    {
      path: '/groups/new',
      name: 'group-new',
      component: GroupAddView,
      meta: {
        nav: 'groups'
      }
    },
    {
      path: '/groups/:id',
      name: 'group-edit',
      component: GroupView,
      meta: {
        nav: 'groups'
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
    if (store.getters['login/requirePasswordChange'] && to.name !== 'user-change-password') {
      getUsers()
        .then((users) => {
          let authUser = users.filter((user) => {
            return user.username === store.getters['login/getUsername']
          })[0]
          next({ name: 'user-change-password', params: {id: authUser.id} })
        })
        .catch(() => {
        })
    }
    else if (to.name === 'login') {
      next({ name: 'home' })
    } else {
      next()
    }
    return
  }

  if (to.name === 'login' || to.name === 'reset-password' || to.name === 'reset-password-change') {
//    next({ name: 'reset-password' })
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
