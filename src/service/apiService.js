import axios from 'axios'
import config from './config'
import store from '../store/store'

const PATH_SIGNIN = '/v1/signin'
const PATH_CHECK_TOKEN = '/v1/checkToken'
const PATH_RESET_PASSWORD_REQUEST = '/v1/resetPassword/request'
const PATH_RESET_PASSWORD_CHANGE = '/v1/resetPassword/change'
const PATH_BEACONS = '/v1/admin/beacons'
const PATH_ISSUES = '/v1/admin/issues'
const PATH_USERS = '/v1/admin/users'
const PATH_GROUPS = '/v1/admin/groups'
const PATH_INFO = '/v1/infos'
const SUB_PATH_ISSUES = '/issues'
const SUB_PATH_IMAGES = '/images'
const SUB_PATH_RESET_PASSWORD = '/reset-password'
const SUB_PATH_CHANGE_PASSWORD = '/change-password'
const SUB_PATH_USERS = '/users'

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

export function resetPasswordRequest(username) {
  return callPost(PATH_RESET_PASSWORD_REQUEST, false, {
    username
  })
}

export function resetPasswordChange(token, newPassword) {
  return callPost(PATH_RESET_PASSWORD_CHANGE, false, {
    'token': token,
    'newPassword': newPassword
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
    'admin': user.admin
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

export function changePassword(user, passwordChange) {
  return callPatch(PATH_USERS + '/' + user.id + SUB_PATH_CHANGE_PASSWORD, true, passwordChange)
}

export function resetPassword(user, passwordReset) {
  return callPatch(PATH_USERS + '/' + user.id + SUB_PATH_RESET_PASSWORD, true, passwordReset)
}

// GROUPS

export function getGroups() {
  return callGet(PATH_GROUPS, true)
}

export function getGroup(id) {
  return callGet(PATH_GROUPS + '/' + id, true)
}

export function updateGroup(group) {
  return callPatch(PATH_GROUPS + '/' + group.id, true, {
    'name': group.name,
  })
}

export function createGroup(group) {
  return callPost(PATH_GROUPS, true, {
    'name': group.name
  })
}

export function deleteGroup(group) {
  return callDelete(PATH_GROUPS + '/' + group.id, true)
}

export function getUsersForGroup(groupId) {
  return callGet(PATH_GROUPS + '/' + groupId + SUB_PATH_USERS, true)
}

export function assignUserToGroup(groupId, user, userRole) {
  return callPatch(PATH_GROUPS + '/' + groupId + SUB_PATH_USERS, true, {
    'user': user.id,
    'userRole': userRole.role
  })
}

export function changeUserRoleInGroup(groupId, user, userRole) {
  return callPatch(PATH_GROUPS + '/' + groupId + SUB_PATH_USERS + '/' + user.id, true, {
    'user': user.id,
    'userRole': userRole
  })
}

export function removeUserFromGroup(groupId, user) {
  return callDelete(PATH_GROUPS + '/' + groupId + SUB_PATH_USERS + '/' + user.id, true)
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
    uuid: beacon.uuid,
    group: beacon.group.id
  }
  return callPatch(PATH_BEACONS + '/' + beacon.id, true, data)
}

export function createBeaconsByOrder(order) {
  return callPost(PATH_BEACONS + '/createByOrder', true, order);
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
  return callGet(PATH_ISSUES + '?onlyUnresolved=true', true)
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

// INFO
export function getInfos() {
  return callGet(PATH_INFO, false)
}

export function getInfo(id) {
  return callGet(PATH_INFO + '/' + id, false);
}
