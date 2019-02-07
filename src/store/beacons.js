import { getBeacons, getBeacon } from '../service/apiService'

const SET_BEACONS = 'SET_BEACONS'
const SET_BEACON = 'SET_BEACON'
const CLEAR = 'CLEAR'

export default {
  namespaced: true,
  state: {
    beacons: [],
    error: '',
    beacon: null
  },
  mutations: {
    [SET_BEACONS](state, beacons) {
      state.beacons = beacons
    },
    [SET_BEACON](state, beacon) {
      state.beacon = beacon
    },
    [CLEAR](state) {
      state.beacons = []
      state.beacon = null
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
    }
  }
}
