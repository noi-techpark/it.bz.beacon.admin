import router from '../router/index'
import {signIn, checkToken, getUsers} from '../service/apiService'

const SET_ERROR = 'SET_ERROR'
const SET_ERROR_TEXT = 'SET_ERROR_TEXT'
const SET_USERNAME = 'SET_USERNAME'
const SET_TOKEN = 'SET_TOKEN'
const SET_ADMIN = 'SET_ADMIN'

export default {
  namespaced: true,
  state: {
    error: false,
    errorText: '',
    username: null,
    token: null,
    admin: false
  },
  mutations: {
    [SET_ERROR](state, value) {
      state.error = value
    },
    [SET_ERROR_TEXT](state, value) {
      state.errorText = value
    },
    [SET_USERNAME](state, value) {
      state.username = value
    },
    [SET_TOKEN](state, value) {
      state.token = value
    },
    [SET_ADMIN](state, value) {
      state.admin = value
    }
  },
  actions: {
    logout({ dispatch }) {
      dispatch('clearAuth')
      router.push({ name: 'login' })
    },
    login({ dispatch }, { username, password }) {
      signIn(username, password)
        .then((loginResponse) => {
          dispatch('storeAuth', {
            username,
            token: loginResponse.token
          })
          getUsers().then(usersResponse => {
            let admin = usersResponse.some(user => {
              return user.username === username && user.admin === true
            })

            dispatch('storeAdmin', {
              admin
            })
            router.push({ name: 'home' })
          }).catch(error => {
            dispatch('clearAuth', error)
          })
        })
        .catch((error) => {
          dispatch('clearAuth', error)
        })
    },
    authenticate({ dispatch }) {
      return checkToken(localStorage.getItem('loginToken'))
        .then((checkTokenResponse) => {
          if (checkTokenResponse.valid === true) {
            dispatch('storeAuth', {
              username: localStorage.getItem('username'),
              token: localStorage.getItem('loginToken')
            })
            dispatch('storeAdmin', {
              admin: localStorage.getItem('admin') === "true"
            })
            return true
          }
          dispatch('clearAuth')
          return false
        })
        .catch(() => {
          dispatch('clearAuth')
          return false
        })
    },
    storeAuth({ commit }, { username, token }) {
      localStorage.setItem('loginToken', token)
      localStorage.setItem('username', username)
      commit(SET_USERNAME, username)
      commit(SET_TOKEN, token)
      commit(SET_ERROR, false)
      commit(SET_ERROR_TEXT, null)
    },
    storeAdmin({ commit }, { admin }) {
      localStorage.setItem('admin', admin)
      commit(SET_ADMIN, admin)
    },
    clearAuth({ commit }, error = null) {
      localStorage.setItem('loginToken', null)
      localStorage.setItem('username', null)
      localStorage.setItem('admin', false)
      commit(SET_USERNAME, null)
      commit(SET_TOKEN, null)
      commit(SET_ADMIN, false)
      if (error !== null) {
        commit(SET_ERROR, true)
        commit(SET_ERROR_TEXT, error.message)
      } else {
        commit(SET_ERROR, false)
        commit(SET_ERROR_TEXT, null)
      }
    }
  },
  getters: {
    hasLogin(state) {
      return state.token !== null
    },
    getUsername(state) {
      return state.username
    },
    isAdmin(state) {
      return state.admin
    },
    getError(state) {
      return state.errorText
    },
    hasError(state) {
      return state.error
    },
    token(state) {
      return state.token
    }
  }
}
