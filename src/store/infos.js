// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import {getInfos, getInfo} from '../service/apiService'

const SET_INFOS = 'SET_INFOS'
const SET_INFO = 'SET_INFO'
const CLEAR = 'CLEAR'

export default {
  namespaced: true,
  state: {
    infos: [],
    info: null
  },
  mutations: {
    [SET_INFOS](state, infos) {
      state.infos = infos
    },
    [SET_INFO](state, info) {
      state.info = info
    },
    [CLEAR](state) {
      state.infos = []
      state.info = null
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
    fetchInfo({ commit }, id) {
      return getInfo(id)
        .then((info) => {
          commit(SET_INFO, info)
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
    },
    info(state) {
      return state.info
    }
  }
}
