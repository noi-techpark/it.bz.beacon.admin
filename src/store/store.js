import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import users from './users'
import beacons from './beacons'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [],
  modules: {
    login,
    users,
    beacons
  }
})
