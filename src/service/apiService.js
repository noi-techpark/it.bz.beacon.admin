import axios from 'axios'
import config from './config'
import store from '../store/store'

const PATH_SIGNIN = '/v1/signin'
const PATH_CHECK_TOKEN = '/v1/checkToken'
const PATH_BEACONS = '/v1/admin/beacons'
const PATH_USERS = '/v1/admin/users'
const SUB_PATH_ISSUES = '/issues'
const SUB_PATH_IMAGES = '/images'

function call(method, path, auth, data) {
  var headers = {}
  if (auth) {
    headers = {
      'Authorization': 'Bearer ' + store.getters['login/token']
    }
  }
  return axios({
    method,
    url: config.API_BASE_URL + path,
    headers,
    data
  })
    .then(function(response) {
      return response.data
    })
    .catch(function(error) {
      throw error
    })
}

function callGet(path, auth) {
  return call('get', path, auth)
}

function callPost(path, auth, data) {
  return call('post', path, auth, data)
}

function callPatch(path, auth, data) {
  return call('patch', path, auth, data)
}

function callDelete(path, auth) {
  return call('delete', auth, path)
}

// AUTHENTICATION

export function signIn(username, password) {
  return callPost(PATH_SIGNIN, false, {
    username,
    password
  })
}

export function checkToken(token) {
  return callPost(PATH_CHECK_TOKEN, false, {
    token
  })
}

// USERS

export function getUsers() {
  return callGet(PATH_USERS, true)
}

export function getUser(id) {
  return callGet(PATH_USERS + '/' + id, true)
}

export function updateUser(user) {
  return callPatch(PATH_USERS + '/' + user.id, true, {
    'email': user.email,
    'name': user.name,
    'surname': user.surname,
    'password': user.password
  })
}

export function createUser(user) {
  return callPost(PATH_USERS, true, {
    'username': user.username,
    'email': user.email,
    'name': user.name,
    'surname': user.surname,
    'password': user.password
  })
}

export function deleteUser(user) {
  return callDelete(PATH_USERS + '/' + user.id, true)
}

// BEACONS

export function getBeacons() {
  return callGet(PATH_BEACONS, true);
}

export function getBeacon(id) {
  return callGet(PATH_BEACONS + '/' + id, true);
}

// BEACON IMAGES
export function getImagesForBeacon(id) {
  return callGet(PATH_BEACONS + '/' + id + SUB_PATH_IMAGES, true)
}

// ISSUES
export function getIssuesForBeacon(id) {
  return callGet(PATH_BEACONS + '/' + id + SUB_PATH_ISSUES, true)
}
