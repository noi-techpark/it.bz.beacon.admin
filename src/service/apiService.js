import axios from 'axios'
import config from './config'
import store from '../store/store'

const PATH_SIGNIN = '/v1/signin'
const PATH_CHECK_TOKEN = '/v1/checkToken'
const PATH_BEACONS = '/v1/admin/beacons'
const PATH_ISSUES = '/v1/admin/issues'
const PATH_USERS = '/v1/admin/users'
const SUB_PATH_ISSUES = '/issues'
const SUB_PATH_IMAGES = '/images'

function call(method, path, auth, data, headers = {}) {
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

function callPost(path, auth, data, headers = {}) {
  return call('post', path, auth, data, headers)
}

function callPatch(path, auth, data) {
  return call('patch', path, auth, data)
}

function callDelete(path, auth) {
  return call('delete', path, auth)
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

export function updateBeacon(beacon) {
  let data =  {
    description: beacon.description,
    eddystoneEid: beacon.eddystoneEid,
    eddystoneEtlm: beacon.eddystoneEtlm,
    eddystoneTlm: beacon.eddystoneTlm,
    eddystoneUid: beacon.eddystoneUid,
    eddystoneUrl: beacon.eddystoneUrl,
    iBeacon: beacon.iBeacon,
    instanceId: beacon.instanceId,
    interval: beacon.interval,
    lat: beacon.lat,
    lng: beacon.lng,
    locationDescription: beacon.locationDescription,
    locationType: beacon.locationType,
    major: beacon.major,
    minor: beacon.minor,
    name: beacon.name,
    namespace: beacon.namespace,
    telemetry: beacon.telemetry,
    txPower: beacon.txPower,
    url: beacon.url,
    uuid: beacon.uuid
  }
  return callPatch(PATH_BEACONS + '/' + beacon.id, true, data)
}

// BEACON IMAGES
export function getImagesForBeacon(beaconId) {
  return callGet(PATH_BEACONS + '/' + beaconId + SUB_PATH_IMAGES, true)
}

export function deleteImageForBeacon(beaconId, id) {
  return callDelete(PATH_BEACONS + '/' + beaconId + SUB_PATH_IMAGES + '/' + id, true)
}

export function createImageForBeacon(beaconId, file) {
  let formData = new FormData();
  formData.append('file', file);

  return callPost(PATH_BEACONS + '/' + beaconId + SUB_PATH_IMAGES, true, formData, {'Content-Type': 'multipart/form-data'})
}

// ISSUES
export function getIssues() {
  return callGet(PATH_ISSUES, true)
}

export function getIssue(id) {
  return callGet(PATH_ISSUES + '/' + id, true)
}

export function getIssuesForBeacon(beaconId) {
  return callGet(PATH_BEACONS + '/' + beaconId + SUB_PATH_ISSUES, true)
}

export function createIssue(issueCreation) {
  return callPost(PATH_ISSUES, true, issueCreation)
}

export function resolveIssue(id, issueSolution) {
  return callPost(PATH_ISSUES + '/' + id + '/resolve', true, issueSolution)
}

