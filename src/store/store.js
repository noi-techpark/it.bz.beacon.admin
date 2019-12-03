import Vue from 'vue'
import Vuex from 'vuex'
import login from './login'
import users from './users'
import groups from './groups'
import beacons from './beacons'
import issues from './issues'
import settings from './settings'
import infos from './infos'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [],
  modules: {
    login,
    users,
    groups,
    beacons,
    issues,
    settings,
    infos
  }
})
