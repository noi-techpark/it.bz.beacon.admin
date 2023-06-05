// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { getIssues, getIssue } from '../service/apiService'

const SET_ISSUES = 'SET_ISSUES'
const SET_ISSUE = 'SET_ISSUE'
const CLEAR = 'CLEAR'
const SET_MODE = 'SET_MODE'
export const LIST = 'LIST'
export const MAP = 'MAP'

export default {
  namespaced: true,
  state: {
    issues: null,
    error: '',
    issue: null,
    viewMode: LIST
  },
  mutations: {
    [SET_ISSUES](state, issues) {
      state.issues = issues
    },
    [SET_ISSUE](state, issue) {
      state.issue = issue
    },
    [CLEAR](state) {
      state.issues = null
      state.issue = null
    },
    [SET_MODE](state, viewMode) {
      state.viewMode = viewMode
    }
  },
  actions: {
    fetchIssues({ commit }) {
      return getIssues()
        .then((issues) => {
          commit(SET_ISSUES, issues)
        })
        .catch(() => {
          commit(CLEAR)
        })
    },
    fetchIssue({ commit }, issueId) {
      return getIssue(issueId)
        .then((issue) => {
          commit(SET_ISSUE, issue)
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
    issues(state) {
      return state.issues
    },
    getError(state) {
      return state.error
    },
    issue(state) {
      return state.issue
    },
    viewMode(state) {
      return state.viewMode
    }
  }
}
