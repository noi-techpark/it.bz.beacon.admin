import axios from 'axios'

const API_URL = 'https://api.beacon-dev.it'
const USERS_URL = API_URL + '/v1/admin/users'

export default {
  namespaced: true,
  state: {
    users: [],
    error: ''
  },
  mutations: {},
  actions: {
    fetchUsers({ state }) {
      axios({
        method: 'get',
        url: USERS_URL,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('tk')
        }
      })
        .then(function(response) {
          state.users = response.data
        })
        .catch(function(error) {
          state.error = error
        })
    }
  },
  getters: {
    getUsers(state) {
      return state.users
    },
    getError(state) {
      return state.error
    }
  }
}
