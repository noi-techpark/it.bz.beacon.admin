import { getInfos } from '../service/apiService'

const SET_INFOS = 'SET_INFOS'
const CLEAR = 'CLEAR'

export default {
  namespaced: true,
  state: {
    infos: []
  },
  mutations: {
    [SET_INFOS](state, infos) {
      state.infos = infos
    },
    [CLEAR](state) {
      state.infos = []
    }
  },
  actions: {
    fetchInfos({ commit }) {
      return getInfos()
        .then((infos) => {
          commit(SET_INFOS, infos)
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
    infos(state) {
      return state.infos
    }
  }
}
