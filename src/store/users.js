import { getUsers, getUser, createUser, updateUser, deleteUser } from '../service/apiService'

const SET_USERS = 'SET_USERS'
const SET_USER = 'SET_USER'
const CLEAR = 'CLEAR'

export default {
  namespaced: true,
  state: {
    users: [],
    error: '',
    user: null
  },
  mutations: {
    [SET_USERS](state, users) {
      state.users = users
    },
    [SET_USER](state, user) {
      state.user = user
    },
    [CLEAR](state) {
      state.users = []
      state.user = null
    }
  },
  actions: {
    update(user) {
      return updateUser(user)
        .then(
          this.fetchUsers()
        )
        .catch(() => {

        })
    },
    create(user) {
      return createUser(user)
        .then(
          this.fetchUsers()
        )
    },
    delete(user) {
      return deleteUser(user)
        .then(
          this.fetchUsers()
        )
    },
    fetchUsers({ commit }) {
      return getUsers()
        .then((users) => {
          commit(SET_USERS, users)
        })
        .catch(() => {
          commit(CLEAR)
        })
    },
    fetchUser({ commit }, userId) {
      return getUser(userId)
        .then((user) => {
          commit(SET_USER, user)
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
    users(state) {
      return state.users
    },
    getError(state) {
      return state.error
    },
    user(state) {
      return state.user
    }
  }
}
