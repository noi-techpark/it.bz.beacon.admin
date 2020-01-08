import { getGroups, getGroup, createGroup, updateGroup, deleteGroup, getUsersForGroup } from '../service/apiService'

const SET_GROUPS = 'SET_GROUPS'
const SET_GROUP = 'SET_GROUP'
const SET_USERS_FOR_GROUP = 'SET_USERS_FOR_GROUP'
const CLEAR = 'CLEAR'

export default {
  namespaced: true,
  state: {
    groups: null,
    error: '',
    group: null,
    usersForGroup: null
  },
  mutations: {
    [SET_GROUPS](state, groups) {
      state.groups = groups
    },
    [SET_GROUP](state, group) {
      state.group = group
    },
    [SET_USERS_FOR_GROUP](state, usersForGroup) {
      state.usersForGroup = usersForGroup
    },
    [CLEAR](state) {
      state.groups = null
      state.group = null
    }
  },
  actions: {
    update(group) {
      return updateGroup(group)
        .then(
          this.fetchGroups()
        )
        .catch(() => {

        })
    },
    create(group) {
      return createGroup(group)
        .then(
          this.fetchGroups()
        )
    },
    delete(group) {
      return deleteGroup(group)
        .then(
          this.fetchGroups()
        )
    },
    fetchGroups({ commit }) {
      return getGroups()
        .then((groups) => {
          commit(SET_GROUPS, groups)
        })
        .catch(() => {
          commit(CLEAR)
        })
    },
    fetchGroup({ commit }, groupId) {
      return getGroup(groupId)
        .then((group) => {
          commit(SET_GROUP, group)
        })
        .catch(() => {
          commit(CLEAR)
        })
    },
    fetchUsersForGroup({ commit }, groupId) {
      return getUsersForGroup(groupId)
        .then((usersForGroup) => {
          commit(SET_USERS_FOR_GROUP, usersForGroup)
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
    groups(state) {
      return state.groups
    },
    getError(state) {
      return state.error
    },
    group(state) {
      return state.group
    },
    usersForGroup(state) {
      return state.usersForGroup
    }
  }
}
