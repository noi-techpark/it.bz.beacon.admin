import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import users from './users'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [],
  modules: {
    login,
    users
  }
})
