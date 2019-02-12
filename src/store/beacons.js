import { getBeacons, getBeacon } from '../service/apiService'

const SET_BEACONS = 'SET_BEACONS'
const SET_BEACON = 'SET_BEACON'
const CLEAR = 'CLEAR'
const SET_MODE = 'SET_MODE'
const LIST = 'LIST'
const MAP = 'MAP'

export default {
  namespaced: true,
  state: {
    beacons: null,
    error: '',
    beacon: null,
    viewMode: LIST
  },
  mutations: {
    [SET_BEACONS](state, beacons) {
      state.beacons = beacons
    },
    [SET_BEACON](state, beacon) {
      state.beacon = beacon
    },
    [CLEAR](state) {
      state.beacons = null
      state.beacon = null
    },
    [SET_MODE](state, viewMode) {
      state.viewMode = viewMode
    }
  },
  actions: {
    fetchBeacons({ commit }) {
      return getBeacons()
        .then((beacons) => {
          commit(SET_BEACONS, beacons)
        })
        .catch(() => {
          commit(CLEAR)
        })
    },
    fetchBeacon({ commit }, beaconId) {
      return getBeacon(beaconId)
        .then((beacon) => {
          commit(SET_BEACON, beacon)
        })
        .catch(() => {
          commit(CLEAR)
        })
    },
    clear({ commit }) {
      commit(CLEAR)
    },
    setViewMode({commit, state}, viewMode) {
      commit(SET_MODE, viewMode)
      return state.viewMode
    }
  },
  getters: {
    beacons(state) {
      return state.beacons
    },
    getError(state) {
      return state.error
    },
    beacon(state) {
      return state.beacon
    },
    viewMode(state) {
      return state.viewMode
    }
  }
}
