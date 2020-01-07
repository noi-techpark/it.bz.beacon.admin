import router from '../router/index'
import {signIn, checkToken} from '../service/apiService'

const SET_ERROR = 'SET_ERROR'
const SET_ERROR_TEXT = 'SET_ERROR_TEXT'
const SET_USERNAME = 'SET_USERNAME'
const SET_TOKEN = 'SET_TOKEN'
const SET_IS_ADMIN = 'SET_IS_ADMIN'
const SET_GROUPS_ROLE = 'SET_GROUPS_ROLE'
const SET_REQUIRE_PASSWORD_CHANGE = 'SET_REQUIRE_PASSWORD_CHANGE'
const CLEAR = 'CLEAR'

export default {
  namespaced: true,
  state: {
    error: false,
    errorText: '',
    username: null,
    token: null,
    admin: false,
    groupsRole: null,
    requirePasswordChange: false
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
    [SET_IS_ADMIN](state, value) {
      state.admin = value
    },
    [SET_GROUPS_ROLE](state, value) {
      state.groupsRole = value
    },
    [SET_REQUIRE_PASSWORD_CHANGE](state, value) {
      state.requirePasswordChange = value
    },
    [CLEAR](state) {
      state.username = null
      state.token = null
      state.admin = false
      state.groupsRole = null
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
            //TODO remove
            dispatch('storeAuth', {
              username: localStorage.getItem('username'),
              token: checkTokenResponse.token
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
    storeAuth({ commit }, { username, token}) {
      localStorage.setItem('loginToken', token)
      localStorage.setItem('username', username)
      let tokenPayload = JSON.parse(atob(token.split('.')[1]))
      localStorage.setItem('admin', tokenPayload.admin)
      localStorage.setItem('groupsRole', tokenPayload.groups)
      localStorage.setItem('requirePasswordChange', tokenPayload.requirePasswordChange !== null? tokenPayload.requirePasswordChange: false)
      commit(SET_USERNAME, username)
      commit(SET_TOKEN, token)
      commit(SET_IS_ADMIN, tokenPayload.admin)
      commit(SET_GROUPS_ROLE, tokenPayload.groups)
      commit(SET_REQUIRE_PASSWORD_CHANGE, tokenPayload.requirePasswordChange)
      commit(SET_ERROR, false)
      commit(SET_ERROR_TEXT, null)
    },
    clearAuth({ commit }, error = null) {
      localStorage.setItem('loginToken', null)
      localStorage.setItem('username', null)
      localStorage.setItem('admin', false)
      localStorage.setItem('groupsRole', null)
      commit(SET_USERNAME, null)
      commit(SET_TOKEN, null)
      commit(SET_IS_ADMIN, false)
      commit(SET_GROUPS_ROLE, null)
      commit(SET_REQUIRE_PASSWORD_CHANGE, false)
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
    requirePasswordChange(state) {
      return state.requirePasswordChange
    },
    getUsername(state) {
      return state.username
    },
    isAdmin(state) {
      return state.admin
    },
    groupsRole(state) {
      return state.groupsRole
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
  },
  setters: {
    setAdmin(state, admin) {

    }
  }
}
