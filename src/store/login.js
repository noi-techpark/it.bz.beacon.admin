import axios from 'axios'
import router from '../router/index'

const SET_LOGIN = 'SET_LOGIN'
const SET_ERROR = 'SET_ERROR'
const SET_ERROR_TEXT = 'SET_ERROR_TEXT'

const API_URL = 'https://api.beacon-dev.it'
const LOGIN_URL = API_URL + '/v1/signin'
const AUTH_URL = API_URL + '/v1/checkToken'

export default {
  namespaced: true,
  state: {
    isLoggedIn: false,
    error: false,
    errorText: ''
  },
  mutations: {
    [SET_LOGIN](value) {
      this.state.isLoggedIn = value
    },
    [SET_ERROR](value) {
      this.state.error = value
    },
    [SET_ERROR_TEXT](value) {
      this.state.errorText = value
    }
  },
  actions: {
    doLogin({ state, commit }, {
      username,
      password
    }) {
      axios.post(LOGIN_URL, {
        username: username,
        password: password
      })
        .then(function(response) {
          state.isLoggedIn = true
          localStorage.setItem('tk', response.data.token)
          commit(SET_ERROR, false)
          commit(SET_ERROR_TEXT, '')
          router.push('home')
        })
        .catch(function(error) {
          state.isLoggedIn = false
          localStorage.setItem('tk', '')
          commit(SET_ERROR, true)
          commit(SET_ERROR_TEXT, error)
        })
    },
    doAuth({ state, commit }) {
      return axios({
        method: 'get',
        url: AUTH_URL,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('tk')
        }
      })
        .then(() => {
          state.isLoggedIn = true
          return true
        })
        .catch((error) => {
          localStorage.setItem('tk', '')
          state.isLoggedIn = false
          commit(SET_ERROR, true)
          commit(SET_ERROR_TEXT, error)
          return false
        })
    },
    checkLogin({ state }) {
      if (state.isLoggedIn && localStorage.getItem('tk') !== '') {
        return true
      }

      if (state.isLoggedIn === false || localStorage.getItem('tk') === '') {
        return false
      }
    }
  },
  getters: {
    hasLogin(state) {
      return state.isLoggedIn
    },
    getError(state) {
      return state.errorText
    },
    hasError(state) {
      return state.error
    }
  }
}
