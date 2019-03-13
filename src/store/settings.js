const SET_SETTING = 'SET_SETTING'

export default {
  namespaced: true,
  state: {
    settings: {}
  },
  mutations: {
    [SET_SETTING](state, {key, value}) {
      state.settings[key] = value
    }
  },
  actions: {
    setSetting({ dispatch }, {key, value}) {
      dispatch('storeSetting', {key, value})
    },
    storeSetting({ commit }, { key, value }) {
      localStorage.setItem('SETTING_' + key, value)
      commit(SET_SETTING, { key, value })
    }
  },
  getters: {
    getSettingById: (state) => (key) => {
      if (!state.settings.hasOwnProperty(key)) {
        return null
      }
      return state.settings[key]
    }
  }
}
