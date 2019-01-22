/*

import store from '../store/store'
import router from '../router'
import axios from 'axios/index'

export default {
  clearData({ commit }) {
    localStorage.setItem('tk', '')
    store.dispatch(login/setLogin, false)
  },
  doLogin({ commit }, {
    username,
    password
  }) {
    axios.post(LOGIN_URL, {
      username: username,
      password: password
    })
      .then(function(response) {
        commit(SET_LOGIN, true)
        localStorage.setItem('tk', response.data.token)
        commit(SET_ERROR, false)
        commit(SET_ERROR_TEXT, '')
        router.go('home')
      })
      .catch(function(error) {
        commit(SET_LOGIN, false)
        commit(SET_ERROR, true)
        commit(SET_ERROR_TEXT, error)
      })
  },
  doAuth({ commit }, name) {
    axios({
      method: 'get',
      url: AUTH_URL,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('tk')
      }
    })
      .then((response) => {
        debugger
        commit(SET_LOGIN, true)
        if (name !== null) {
          router.go(name)
        }
      })
      .catch((error) => {
        debugger
        this.dispatch('login/clearData')
        commit(SET_ERROR, true)
        commit(SET_ERROR_TEXT, error)
        router.go('login')
      })
  },
  checkLogin() {
    debugger
    if (this.getters.getLogin && localStorage.getItem('tk') !== '') {
      debugger
      return true
    }

    if (this.getters.getLogin === false || localStorage.getItem('tk') === '') {
      debugger
      return false
    }
  }
}

*/
