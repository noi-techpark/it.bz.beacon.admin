import router from '../router/index'
import { signIn, checkToken } from '../service/apiService'

const SET_ERROR = 'SET_ERROR'
const SET_ERROR_TEXT = 'SET_ERROR_TEXT'
const SET_USERNAME = 'SET_USERNAME'
const SET_TOKEN = 'SET_TOKEN'

export default {
  namespaced: true,
  state: {
    error: false,
    errorText: '',
    username: null,
    token: null
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
          router.push({ name: 'home' })
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
    clearAuth({ commit }, error = null) {
      localStorage.setItem('loginToken', null)
      localStorage.setItem('username', null)
      commit(SET_USERNAME, null)
      commit(SET_TOKEN, null)
      if (error !== null) {
        commit(SET_ERROR, true)
        commit(SET_ERROR_TEXT, error.message)
      } else {
        commit(SET_ERROR, false)
        commit(SET_ERROR_TEXT, null)
      }
    },
    reloadStore({ state }) {
      state.username = localStorage.getItem('username')
    }
  },
  getters: {
    hasLogin(state) {
      return state.token !== null
    },
    getUsername(state) {
      return state.username
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
