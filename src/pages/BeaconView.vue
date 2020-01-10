<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container pb-4" v-show="loaded">
        <div class="row mt-4">
          <div class="col-8">
            <h2 class="beacon-title mb-3" v-if="!editing">{{ beacon.name }}</h2>
            <div v-if="editing">
              <input type="text" class="form-control" v-model="beacon.name" :readonly="!editing" />
              <small class="text-muted">Name</small>
            </div>
          </div>
          <div class="col-4">
            <select class="form-control form-select-group-control" id="role" v-if="isAdmin" v-model="group.id" :disabled="!editing">
              <option v-bind:key="notAssignedValue" :value="notAssignedValue">{{ this.notAssignedLabel }}</option>
              <option v-bind:key="mGroup.id" v-if="groups.length" v-for="mGroup in groups" :value="mGroup.id">{{ mGroup.name }}</option>
            </select>
            <input type="text" class="form-control" v-if="!isAdmin" v-model="group.name" :readonly="true" />
            <small class="text-muted">Group</small>
          </div>
        </div>
        <div class="row mt-2">
          <div class="col">
            <span class="text-muted">last seen:</span> {{ beacon.lastSeen | formatDate }}
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3 col-lg-2" v-show="!editing">
            <select class="form-control" @change="executeAction" v-if="canEdit()">
              <option value="">Action</option>
              <option value="edit">Edit</option>
            </select>
          </div>
          <div class="col-auto edit-actions" v-show="editing">
            <button class="btn btn-outline-secondary mr-4" @click="cancelEdit">Cancel</button>
            <button class="btn btn-primary" @click="save">Save</button>
          </div>
        </div>
        <div class="row mt-4" v-if="editing && beacon.status === 'CONFIGURATION_PENDING' && !configResetted">
          <div class="col-12">
            <div class="alert alert-configuration-pending mb-0 p-3" role="alert">
              The following values may contain pending configuration values and do not represent the current values written to the beacon.
              <div class="row d-flex justify-content-end mt-3">
                <button class="btn btn-secondary" @click="resetConfiguration">Reset pending configuration</button>
              </div>
            </div>
          </div>
        </div>
        <div class="row row-eq-height">
          <div class="col-md-12 col-lg-6 col-xl-4 d-flex mt-4 ">
            <div :class="'row beacon-detail-card ' + (beacon.batteryLevel <= 5 ? 'battery-status-low' : '')">
              <div class="col-6 d-flex flex-column justify-content-between flex-grow-1 flex-shrink-0">
                <h5>Battery status</h5>
                <div class="mt-2">
                  <h4 class="mb-0"><strong>{{ beacon.batteryLevel }}%</strong></h4>
                  <div :class="'small ' + (beacon.batteryLevel > 5 ? 'label-yellow' : '')">critical < 5%</div>
                </div>
              </div>
              <div :class="'col-6 d-flex flex-column justify-content-between flex-grow-1 flex-shrink-0 border-start ' + getStatusCardClass(beacon)">
                <h5>Device status</h5>
                <div class="mt-2">
                  <h4 class="mb-0"><strong>{{ getStatusText(beacon) }}</strong></h4>
                  <div :class="'small status-label-' + getStatusClassPostfix(beacon)">{{ getStatusDescription(beacon) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 col-lg-6 col-xl-8 d-flex mt-4 ">
            <div class="row beacon-detail-card">
              <div class="col-8 d-flex flex-column justify-content-between flex-grow-1 flex-shrink-0">
                <div class="row">
                  <div class="col-12 p-0">
                    <h5>Signal strength</h5>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div id="frequency-slider" class="mdc-slider mdc-slider--discrete mdc-slider--display-markers" tabindex="0" role="slider" :aria-disabled="!editing" aria-valuemin="1" aria-valuemax="7" :aria-valuenow="beacon.txPower" data-step="1" aria-label="Select Value">
                      <div class="mdc-slider__track-container">
                        <div class="mdc-slider__track"></div>
                        <div class="mdc-slider__track-marker-container"></div>
                      </div>
                      <div class="mdc-slider__thumb-container">
                        <div class="mdc-slider__pin slider-always-label">
                          <span class="mdc-slider__pin-value-marker"></span>
                        </div>
                        <svg class="mdc-slider__thumb" width="21" height="21">
                          <circle cx="10.5" cy="10.5" r="7.875"></circle>
                        </svg>
                        <div class="mdc-slider__focus-ring"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-4 d-flex flex-column justify-content-between flex-grow-1 flex-shrink-0 border-start">
                <h5>Signal interval</h5>
                <div class="mt-2">
                  <h4 class="mb-0"><strong>{{ beacon.interval }} ms</strong></h4>
                  <div class="small label-blue">100 - 10240 ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row row-eq-height">
          <div class="col-md-12 col-lg-6 col-xl-4 d-flex mt-4">
            <div class="row beacon-detail-card">
              <div class="col-12 d-flex flex-column flex-grow-1 flex-shrink-0">
                <div class="row">
                  <div class="col pl-0">
                    <h5>Location</h5>
                  </div>
                  <div class="col-auto pr-0">
                    <small class="text-muted">{{ beacon.locationType }}</small>
                  </div>
                </div>
                <div id="location-tab-bar" class="mdc-tab-bar" role="tablist">
                  <div class="mdc-tab-scroller mdc-tab-scroller--align-start">
                    <div class="mdc-tab-scroller__scroll-area">
                      <div class="mdc-tab-scroller__scroll-content">
                        <button class="mdc-tab mdc-tab--min-width mdc-tab--active" role="tab" aria-selected="true" tabindex="0">
                            <span class="mdc-tab__content">
                              <span class="mdc-tab__text-label">GPS</span>
                            </span>
                          <span class="mdc-tab-indicator mdc-tab-indicator--active">
                              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                          <span class="mdc-tab__ripple"></span>
                        </button>
                        <button class="mdc-tab mdc-tab--min-width" role="tab" aria-selected="true" tabindex="0">
                            <span class="mdc-tab__content">
                              <span class="mdc-tab__text-label">Description</span>
                            </span>
                          <span class="mdc-tab-indicator">
                              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                          <span class="mdc-tab__ripple"></span>
                        </button>
                        <button class="mdc-tab mdc-tab--min-width" role="tab" aria-selected="true" tabindex="0">
                            <span class="mdc-tab__content">
                              <span class="mdc-tab__text-label">Images</span>
                            </span>
                          <span class="mdc-tab-indicator">
                              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                          <span class="mdc-tab__ripple"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="location-gps" class="mt-4" v-show="locationTab === 'GPS'">
                  <div class="row">
                    <div class="col-12 p-0">
                      <div id="map" class="col-12" style="height:200px"></div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12 p-0">
                      <input type="text" class="form-control" v-model="beacon.lat" :readonly="!editing" @change="updateMap"/>
                      <small class="text-muted">Latitude</small>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12 p-0">
                      <input type="text" class="form-control" v-model="beacon.lng" :readonly="!editing" @change="updateMap" />
                      <small class="text-muted">Longitude</small>
                    </div>
                  </div>
                </div>
                <div id="location-description" :class="(locationTab === 'DESCRIPTION' ? 'd-flex' : '') + ' mt-4 flex-grow-1 flex-column'" v-show="locationTab === 'DESCRIPTION'">
                  <div class="row">
                    <div class="col-6 pl-0">
                      <button class="location-description-button" :class="{'location-description-button-active' : beacon.locationType === 'OUTDOOR'}"  :disabled="!editing" @click="changeLocationType('OUTDOOR')">OUTDOOR</button>
                    </div>
                    <div class="col-6 pr-0">
                      <button class="location-description-button" :class="{'location-description-button-active' : beacon.locationType === 'INDOOR'}" :disabled="!editing" @click="changeLocationType('INDOOR')">INDOOR</button>
                    </div>
                  </div>
                  <div class="row flex-grow-1 mt-3">
                    <div class="col-12 p-0 d-flex flex-column">
                      <textarea class="description flex-grow-1" :class="{'description-disabled': !editing}" :disabled="!editing" v-model="beacon.description"></textarea>
                      <small class="text-muted">Description</small>
                    </div>
                  </div>
                  <div class="row mt-3" v-show="beacon.locationType === 'INDOOR'">
                    <div class="col-12 p-0 d-flex flex-column">
                      <input type="number" class="form-control" v-model="beacon.locationDescription" :readonly="!editing" />
                      <small class="text-muted">Floor</small>
                    </div>
                  </div>
                </div>
                <div id="location-images" :class="(locationTab === 'IMAGES' ? 'd-flex' : '') + ' location-images mt-4 flex-grow-1 flex-column position-relative'" v-show="locationTab === 'IMAGES'">
                  <div class="row position-relative flex-grow-1 flex-shrink-0 location-images-outer-wrapper">
                    <div class="location-images-wrapper">
                      <div :class="'row ' + (key > 0 ? 'mt-3' : '')" v-bind:key="image.id" v-if="images.length" v-for="(image, key) in images">
                        <div class="col-12 text-center p-0">
                          <div class="location-image-wrapper">
                            <button type="button" class="btn btn-delete" title="Delete image" @click.prevent.stop="removeImage(image)" v-show="editing"></button>
                            <img :src="image.content" class="location-image" @click="showImage(image.content)" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row flex-grow-0 flex-shrink-0 mt-4" v-show="editing">
                    <input id="imageUpload" type="file" class="image-upload-input" name="imageUpload" @change="newImage" accept="image/*">
                    <label for="imageUpload" class="btn btn-block btn-image-upload">Upload image</label>
                  </div>
                  <confirm ref="deleteImageConfirm" titleText="Delete image" confirmText="Delete" cancelText="Cancel">
                    Are you sure to you want to delete the image?<br />
                    This cannot be undone.
                  </confirm>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-12 col-lg-6 col-xl-8 d-flex flex-column mt-4">
            <div class="row beacon-detail-card flex-grow-1">
              <div class="col-12 d-flex flex-column flex-grow-1 flex-shrink-0">
                <div class="row">
                  <div class="col p-0">
                    <h5>Beacon config</h5>
                  </div>
                </div>
                <div id="mode-tab-bar" class="mdc-tab-bar" role="tablist">
                  <div class="mdc-tab-scroller mdc-tab-scroller--align-start">
                    <div class="mdc-tab-scroller__scroll-area">
                      <div class="mdc-tab-scroller__scroll-content">
                        <button class="mdc-tab mdc-tab--min-width mdc-tab--active" role="tab" aria-selected="true" tabindex="0">
                            <span class="mdc-tab__content">
                              <span class="mdc-tab__text-label">iBeacon</span>
                            </span>
                          <span class="mdc-tab-indicator mdc-tab-indicator--active">
                              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                          <span class="mdc-tab__ripple"></span>
                        </button>
                        <button class="mdc-tab mdc-tab--min-width" role="tab" aria-selected="true" tabindex="0">
                            <span class="mdc-tab__content">
                              <span class="mdc-tab__text-label">Eddystone</span>
                            </span>
                          <span class="mdc-tab-indicator">
                              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                          <span class="mdc-tab__ripple"></span>
                        </button>
                        <button class="mdc-tab mdc-tab--min-width" role="tab" aria-selected="true" tabindex="0">
                            <span class="mdc-tab__content">
                              <span class="mdc-tab__text-label">General</span>
                            </span>
                          <span class="mdc-tab-indicator">
                              <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                            </span>
                          <span class="mdc-tab__ripple"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="config-ibeacon" class="row mt-4 flex-column" v-show="modeTab === 'IBEACON'">
                  <div class="row">
                    <div class="col pl-0">
                      <small class="text-muted">iBeacon</small>
                    </div>
                    <div class="col-auto pr-0">
                      <div id="ibeacon-switch" class="mdc-switch">
                        <div class="mdc-switch__track"></div>
                        <div class="mdc-switch__thumb-underlay">
                          <div class="mdc-switch__thumb">
                            <input type="checkbox" id="ibeacon-basic-switch" class="mdc-switch__native-control" role="switch">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-8 pl-0">
                      <input type="text" class="form-control" v-model="beacon.uuid" :readonly="!editing" />
                      <small class="text-muted">UUID</small>
                    </div>
                    <div class="col-2">
                      <input type="text" class="form-control" v-model="beacon.major" :readonly="!editing" />
                      <small class="text-muted">Major</small>
                    </div>
                    <div class="col-2 pr-0">
                      <input type="text" class="form-control" v-model="beacon.minor" :readonly="!editing" />
                      <small class="text-muted">Minor</small>
                    </div>
                  </div>
                </div>
                <div id="config-eddystone" class="row mt-4 flex-column" v-show="modeTab === 'EDDYSTONE'">
                  <div class="row">
                    <div class="col pl-0">
                      <small class="text-muted">Eddystone UID</small>
                    </div>
                    <div class="col-auto pr-0">
                      <div id="eddystone-uid-switch" class="mdc-switch">
                        <div class="mdc-switch__track"></div>
                        <div class="mdc-switch__thumb-underlay">
                          <div class="mdc-switch__thumb">
                            <input type="checkbox" id="eddystone-uid-basic-switch" class="mdc-switch__native-control" role="switch">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-6 pl-0">
                      <input type="text" class="form-control" v-model="beacon.namespace" :readonly="!editing" />
                      <small class="text-muted">Namespace</small>
                    </div>
                    <div class="col-6 pr-0">
                      <input type="text" class="form-control" v-model="beacon.instanceId" :readonly="!editing" />
                      <small class="text-muted">Instance ID</small>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col pl-0">
                      <small class="text-muted">Eddystone URL</small>
                    </div>
                    <div class="col-auto pr-0">
                      <div id="eddystone-url-switch" class="mdc-switch">
                        <div class="mdc-switch__track"></div>
                        <div class="mdc-switch__thumb-underlay">
                          <div class="mdc-switch__thumb">
                            <input type="checkbox" id="eddystone-url-basic-switch" class="mdc-switch__native-control" role="switch">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12 pl-0 pr-0">
                      <input type="text" class="form-control" v-model="beacon.url" :readonly="!editing" />
                      <small class="text-muted">URL</small>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col pl-0">
                      <small class="text-muted">Eddystone EID</small>
                    </div>
                    <div class="col-auto pr-0">
                      <div id="eddystone-eid-switch" class="mdc-switch">
                        <div class="mdc-switch__track"></div>
                        <div class="mdc-switch__thumb-underlay">
                          <div class="mdc-switch__thumb">
                            <input type="checkbox" id="eddystone-eid-basic-switch" class="mdc-switch__native-control" role="switch">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col pl-0">
                      <small class="text-muted">Eddystone Encrypted TLM</small>
                    </div>
                    <div class="col-auto pr-0">
                      <div id="eddystone-etlm-switch" class="mdc-switch">
                        <div class="mdc-switch__track"></div>
                        <div class="mdc-switch__thumb-underlay">
                          <div class="mdc-switch__thumb">
                            <input type="checkbox" id="eddystone-etlm-basic-switch" class="mdc-switch__native-control" role="switch">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col pl-0">
                      <small class="text-muted">Eddystone TLM</small>
                    </div>
                    <div class="col-auto pr-0">
                      <div id="eddystone-tlm-switch" class="mdc-switch">
                        <div class="mdc-switch__track"></div>
                        <div class="mdc-switch__thumb-underlay">
                          <div class="mdc-switch__thumb">
                            <input type="checkbox" id="eddystone-tlm-basic-switch" class="mdc-switch__native-control" role="switch">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="config-general" class="row mt-4 flex-column" v-show="modeTab === 'GENERAL'">
                  <div class="row">
                    <div class="col pl-0">
                      <small class="text-muted">Telemetry</small>
                    </div>
                    <div class="col-auto pr-0">
                      <div id="telemetry-switch" class="mdc-switch">
                        <div class="mdc-switch__track"></div>
                        <div class="mdc-switch__thumb-underlay">
                          <div class="mdc-switch__thumb">
                            <input type="checkbox" id="telemetry-basic-switch" class="mdc-switch__native-control" role="switch">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row beacon-detail-card mt-4 flex-grow-1">
              <div class="col-12 d-flex flex-column flex-grow-1 flex-shrink-0">
                <div class="row">
                  <div class="col pl-0">
                    <h5>Issues</h5>
                  </div>
                  <div class="col-auto pr-0">
                    <button type="button" class="btn btn-add-issue" @click="createIssue">New issue</button>
                  </div>
                </div>
                <div class="row">
                  <div class="table-responsive mt-3 table-issues-wrapper d-flex flex-column">
                    <div :class="issues.length <= 0 ? 'no-issues flex-grow-1 d-flex justify-content-center align-content-center text-center flex-column' : ''" v-show="issues.length <= 0">
                      <small class="text-muted">No issues reported.</small>
                    </div>
                    <table class="table table-issues" v-show="issues.length > 0">
                      <thead>
                      <tr class="col-header table-header pl-0 pr-0">
                        <th scope="col">Problem</th>
                        <th scope="col">Description</th>
                        <th scope="col">Report</th>
                        <th scope="col">Resolved</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr class="issue-item" :class="{'issue-item-resolved': issue.resolveDate > 0}" v-bind:key="issue.id" v-if="issues.length" v-for="issue in issues" @click.prevent.stop="showIssueDetail(issue)">
                        <td class="align-middle" scope="row">{{ issue.problem }}</td>
                        <td class="align-middle">{{ issue.problemDescription }}</td>
                        <td class="align-middle">{{ issue.reportDate | formatDate }}</td>
                        <td class="align-middle">
                          <span v-if="issue.resolveDate">{{ issue.resolveDate | formatDate }}</span>
                          <button type="button" class="btn btn-resolve" v-if="!issue.resolveDate" @click.prevent.stop="resolveIssue(issue)" >Resolve</button>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <loader :visible="!loaded" :label="'Loading beacon data...'"/>
      <loader :visible="saving" :label="'Saving beacon data...'"/>
      <loader :visible="uploadingImage" :label="'Uploading image...'"/>
      <image-modal ref="openImage"/>
      <issue-modal ref="issueModal" :beaconId="beacon.id"/>
      <issue-solution-modal ref="resolveIssueModal"/>
      <issue-detail-modal ref="issueDetailModal"/>
      <alert ref="batteryAlert" alert-title="Battery consumption warning" alert-message="Turning this setting on may have a major impact on the beacons battery lifetime." hideable/>
    </template>
  </layout>
</template>

<script>
  import Layout from '../components/Layout'
  import Loader from '../components/Loader'
  import { getBeacon, updateBeacon } from '../service/apiService'
  import {MDCSlider} from '@material/slider'
  import {MDCTabBar} from '@material/tab-bar'
  import {MDCSwitch} from '@material/switch'
  import config from '../service/config'
  import { getIssuesForBeacon, getImagesForBeacon, deleteImageForBeacon, createImageForBeacon } from "../service/apiService"
  import store from '../store/store'
  import moment from 'moment'
  import { initMap, getMapStyles } from '../service/googlemaps'
  import ImageModal from '../components/ImageModal'
  import IssueModal from '../components/IssueModal'
  import IssueSolutionModal from '../components/IssueSolutionModal'
  import IssueDetailModal from '../components/IssueDetailModal'
  import Alert from '../components/Alert'
  import Confirm from '../components/Confirm'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {
      Layout,
      Loader,
      ImageModal,
      IssueModal,
      IssueSolutionModal,
      IssueDetailModal,
      Confirm,
      Alert
    },
    name: 'Beacon',
    data() {
      let data = {
        title: 'Beacon',
        beacon: {
          ibeacon: false,
          major: 0,
          minor: 0,
          namespace: '',
          instanceId: '',
          url: '',
          eddystoneUid: false,
          eddystoneUrl: false,
          eddystoneTlm: false,
          eddystoneEid: false,
          eddystoneEtlm: false,
          telemetry: false,
          txPower: 1,
          interval: 100,
          locationType: 'OUTDOOR',
          description: '',
          locationDescription: '',
          lat: 0,
          lng: 0,
          pendingConfiguration: {}
        },
        beaconBackup: {},
        notAssignedLabel: 'not assigned',
        notAssignedValue: 'null',
        issues: [],
        modeTab: 'IBEACON',
        locationTab: 'GPS',
        images: [],
        loaded: false,
        editing: false,
        saving: false,
        uploadingImage: false,
        configResetted: false,
        controls: {
          frequencySlider: null,
          iBeaconSwitch: null,
          eddystoneUidSwitch: null,
          eddystoneUrlSwitch: null,
          eddystoneEidSwitch: null,
          eddystoneEtlmSwitch: null,
          eddystoneTlmSwitch: null,
          telemetrySwitch: null
        },
        map: {},
        marker: {},
        L: null
      }

      data.group = {
        id: data.notAssignedValue,
        name: data.notAssignedLabel
      }
      data.groupBackup = {
        id: data.notAssignedValue,
        name: data.notAssignedLabel
      }

      return data
    },
    computed: {
      ...mapGetters('settings', [
        'getSettingById'
      ]),
      ...mapGetters('infos', [
        'info'
      ]),
      ...mapGetters('groups', [
        'groups'
      ]),
      ...mapGetters('login', [
        'isAdmin',
        'groupsRole'
      ]),
    },
    mounted() {
      const modeTabBar = new MDCTabBar(document.querySelector('#mode-tab-bar'));
      modeTabBar.listen('MDCTabBar:activated', event =>  {
        switch(event.detail.index) {
          case 1:
            this.$set(this, 'modeTab', 'EDDYSTONE')
            break;
          case 2:
            this.$set(this, 'modeTab', 'GENERAL')
            break;
          default:
            this.$set(this, 'modeTab', 'IBEACON')
            break;
        }
      });
      const locationTabBar = new MDCTabBar(document.querySelector('#location-tab-bar'));
      locationTabBar.listen('MDCTabBar:activated', event =>  {
        switch(event.detail.index) {
          case 1:
            this.$set(this, 'locationTab', 'DESCRIPTION')
            break;
          case 2:
            this.$set(this, 'locationTab', 'IMAGES')
            break;
          default:
            this.$set(this, 'locationTab', 'GPS')
            break;
        }
      });
      this.controls.frequencySlider = new MDCSlider(document.querySelector('#frequency-slider'));
      this.controls.iBeaconSwitch = new MDCSwitch(document.querySelector('#ibeacon-switch'));
      this.controls.eddystoneUidSwitch = new MDCSwitch(document.querySelector('#eddystone-uid-switch'));
      this.controls.eddystoneUrlSwitch = new MDCSwitch(document.querySelector('#eddystone-url-switch'));
      this.controls.eddystoneEidSwitch = new MDCSwitch(document.querySelector('#eddystone-eid-switch'));
      this.controls.eddystoneEtlmSwitch = new MDCSwitch(document.querySelector('#eddystone-etlm-switch'));
      this.controls.eddystoneTlmSwitch = new MDCSwitch(document.querySelector('#eddystone-tlm-switch'));
      this.controls.telemetrySwitch = new MDCSwitch(document.querySelector('#telemetry-switch'));

      this.controls.frequencySlider.listen('MDCSlider:change', event => {
        this.beacon.txPower = event.detail.value
        this.showBatteryAlert()
      })
      this.controls.iBeaconSwitch.nativeControl_.addEventListener('change', (event) => {
        this.beacon.iBeacon = event.target.checked
      })
      this.controls.eddystoneUidSwitch.nativeControl_.addEventListener('change', (event) => {
        this.beacon.eddystoneUid = event.target.checked
        if (!event.target.checked) {
          this.beacon.eddystoneUrl = false
          this.beacon.eddystoneEid = false
          this.beacon.eddystoneEtlm = false
          this.beacon.eddystoneTlm = false

          this.updateControls()
        }
      })
      this.controls.eddystoneUrlSwitch.nativeControl_.addEventListener('change', (event) => {
        this.beacon.eddystoneUrl = event.target.checked
        if (event.target.checked) {
          this.beacon.eddystoneUid = true

          this.updateControls()
        }
      })
      this.controls.eddystoneEidSwitch.nativeControl_.addEventListener('change', (event) => {
        this.beacon.eddystoneEid = event.target.checked
        if (event.target.checked) {
          this.beacon.eddystoneUid = true

          this.updateControls()
        }
      })
      this.controls.eddystoneEtlmSwitch.nativeControl_.addEventListener('change', (event) => {
        this.beacon.eddystoneEtlm = event.target.checked
        if (event.target.checked) {
          this.beacon.eddystoneUid = true

          this.updateControls()
        }
      })
      this.controls.eddystoneTlmSwitch.nativeControl_.addEventListener('change', (event) => {
        this.beacon.eddystoneTlm = event.target.checked
        if (event.target.checked) {
          this.beacon.eddystoneUid = true

          this.updateControls()
        }
      })
      this.controls.telemetrySwitch.nativeControl_.addEventListener('change', (event) => {
        this.beacon.telemetry = event.target.checked
      })

      this.controls.iBeaconSwitch.disabled = true
      this.controls.eddystoneUidSwitch.disabled = true
      this.controls.eddystoneUrlSwitch.disabled = true
      this.controls.eddystoneEidSwitch.disabled = true
      this.controls.eddystoneEtlmSwitch.disabled = true
      this.controls.eddystoneTlmSwitch.disabled = true
      this.controls.telemetrySwitch.disabled = true

//      this.fetchInfos().then(() =>
              getBeacon(this.$route.params.id).then((beacon) => {
                Object.assign(this.beaconBackup, beacon)
                Object.assign(this.beacon, beacon)
                if(beacon.group != null) {
                  Object.assign(this.groupBackup, beacon.group)
                  Object.assign(this.group, beacon.group)
                }
                if(beacon.lat !== null && beacon.lng !== null && beacon.lat !== 0 && beacon.lng !== 0) {
                  this.updateControls()
                  this.loadMap()
                  this.$set(this, 'loaded', true)
                } else {
                  this.fetchInfo(this.$route.params.id).then((info) => {
                    this.updateControls()
                    this.loadMap()
                    this.$set(this, 'loaded', true)
                  })
                }
              })
//      )

      this.reloadIssues();
      this.reloadImages();

      this.fetchGroups()
    },
    watch: {
      editing() {
        this.configResetted = false
        this.controls.frequencySlider.disabled = !this.editing
        this.controls.iBeaconSwitch.disabled = !this.editing
        this.controls.eddystoneUidSwitch.disabled = !this.editing
        this.controls.eddystoneUrlSwitch.disabled = !this.editing
        this.controls.eddystoneEidSwitch.disabled = !this.editing
        this.controls.eddystoneEtlmSwitch.disabled = !this.editing
        this.controls.eddystoneTlmSwitch.disabled = !this.editing
        this.controls.telemetrySwitch.disabled = !this.editing
        // this.setMapControlsEnabled(this.editing)

        if (this.editing && this.beacon.pendingConfiguration != null) {
          this.beacon.interval = this.beacon.pendingConfiguration.interval
          this.beacon.txPower = this.beacon.pendingConfiguration.txPower

          this.beacon.iBeacon = this.beacon.pendingConfiguration.iBeacon
          this.beacon.uuid = this.beacon.pendingConfiguration.uuid
          this.beacon.major = this.beacon.pendingConfiguration.major
          this.beacon.minor = this.beacon.pendingConfiguration.minor

          this.beacon.eddystoneUid = this.beacon.pendingConfiguration.eddystoneUid
          this.beacon.namespace = this.beacon.pendingConfiguration.namespace
          this.beacon.instanceId = this.beacon.pendingConfiguration.instanceId

          this.beacon.eddystoneUrl = this.beacon.pendingConfiguration.eddystoneUrl
          this.beacon.url = this.beacon.pendingConfiguration.url

          this.beacon.eddystoneEid = this.beacon.pendingConfiguration.eddystoneEid
          this.beacon.eddystoneEtlm = this.beacon.pendingConfiguration.eddystoneEtlm
          this.beacon.eddystoneTlm = this.beacon.pendingConfiguration.eddystoneTlm

          this.beacon.telemetry = this.beacon.pendingConfiguration.telemetry

          this.updateControls()
        }
      }
    },
    methods: {
      ...mapActions('infos', [
        'fetchInfo'
      ]),
      ...mapActions('groups', [
        'fetchGroups',
        'clear'
      ]),
      ...mapActions('login', [
        'isAdmin',
        'groupsRole'
      ]),
      canEdit() {
        return this.isAdmin || this.groupsRole != null &&
            this.groupsRole.some((groupRole => groupRole.group.id === this.group.id &&
              (groupRole.role == 'MANAGER' || groupRole.role == 'BEACON_EDITOR')))
      },
      async loadMap() {
        try {
          this.L = await initMap();
//          this.beacon.info = this.getInfo(this.beacon)
          let position = this.getPosition(this.beacon, this.info)

          this.map = this.L.map('map')

          this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);

          console.log(position)

          this.map.setView([position.lat, position.lng], 16);

          var customIcon = this.L.icon({
                        iconUrl: this.iconSvg(this.beacon),

                        // shadowUrl: 'leaf-shadow.png',

                        iconSize:     [24, 24], // size of the icon
                        // shadowSize:   [50, 64], // size of the shadow
                        iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
                        // shadowAnchor: [4, 62],  // the same for the shadow
                        // popupAnchor:  [12, 12] // point from which the popup should open relative to the iconAnchor
                      });

          let marker = this.L.marker([position.lat, position.lng], {icon: customIcon}).addTo(this.map);

          // alert('load map!')

          /*

          this.map = new this.google.maps.Map(document.getElementById('map'), {
            center: position,
            zoom: 16,
            styles: getMapStyles()
          })

          this.marker = new this.google.maps.Marker({
            position: position,
            draggable: this.editing,
            map: this.map,
            icon: {
              url: this.iconSvg(this.beacon),
              size: new this.google.maps.Size(48, 48),
              scaledSize: new this.google.maps.Size(24, 24),
              anchor: new this.google.maps.Point(12, 12)
            }
          })
          this.marker.addListener('dragend', event => {
            this.beacon.lat = event.latLng.lat()
            this.beacon.lng = event.latLng.lng()
          });

          this.setMapControlsEnabled(this.editing)

          */

        } catch (error) {
          this.loaded = true
        }
      },
      showBatteryAlert() {
        if (!this.getSettingById('DO_NOT_SHOW_BATTERY_ALERT')) {
          this.$refs.batteryAlert.open()
                  .then((dontShowAgain) => {
                    this.$store.dispatch('settings/setSetting', {key: 'DO_NOT_SHOW_BATTERY_ALERT', value: dontShowAgain})
                  })
                  .catch(() => {})
        }
      },
      reloadIssues() {
        getIssuesForBeacon(this.$route.params.id).then(issues => {
          issues.sort((issueA, issueB) => {
            if (issueA.resolveDate == null && issueB.resolveDate == null) {
              if(issueA.reportDate > issueB.reportDate) {
                return -1
              } else if (issueA.reportDate < issueB.reportDate) {
                return 1
              } else {
                return 0
              }
            } else if (issueA.resolveDate != null && issueB.resolveDate != null) {
              if (issueA.resolveDate > issueB.resolveDate) {
                return -1
              } else if (issueA.resolveDate < issueB.resolveDate) {
                return 1
              } else {
                return 0
              }
            } else {
              if (issueA.resolveDate == null) {
                return -1
              } else {
                return 1
              }
            }
          })
          this.issues = issues
        })
      },
      reloadImages() {
        getImagesForBeacon(this.$route.params.id).then(beaconImages => {
          this.images = []

          beaconImages.forEach(beaconImage => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
              if (xhr.readyState === 4 && xhr.status === 200) {
                let url = window.URL || window.webkitURL;
                this.images.push({
                  id: beaconImage.id,
                  content: url.createObjectURL(xhr.response)
                })
              }
            }
            xhr.open('GET', config.API_BASE_URL + '/v1/admin/beacons/' + this.$route.params.id + '/images/' + beaconImage.id);
            xhr.setRequestHeader("Authorization", "Bearer " + store.getters['login/token'])
            xhr.responseType = 'blob';
            xhr.send();
          })
        })
      },
      newImage(event) {
        if (event.target.files.length > 0) {
          this.uploadingImage = true
          createImageForBeacon(this.beacon.id, event.target.files[0])
                  .then(() => {
                    this.reloadImages()
                    this.$set(this, 'uploadingImage', false)
                  })
                  .catch(() => {
                    alert('Image upload failed. Please try again.')
                    this.$set(this, 'uploadingImage', false)
                  })
        }
      },
      showImage(image) {
        this.$refs.openImage.open(image)
      },
      showIssueDetail(issue) {
        if (issue.resolved) {
          this.$refs.issueDetailModal.open(issue)
                  .then(() => {})
                  .catch(() => {})
        }
      },
      createIssue() {
        this.$refs.issueModal.open()
                .then(() => {
                  this.reload()
                  this.reloadIssues()
                })
                .catch(() => {})
      },
      resolveIssue(issue) {
        this.$refs.resolveIssueModal.open(issue)
                .then(() => {
                  this.reload()
                  this.reloadIssues()
                })
                .catch(() => {})
      },
      updateControls() {
        this.controls.frequencySlider.value = this.beacon.txPower
        document.querySelector('#frequency-slider .mdc-slider__pin-value-marker').innerHTML = this.beacon.txPower
        this.controls.iBeaconSwitch.checked = this.beacon.iBeacon
        this.controls.eddystoneUidSwitch.checked = this.beacon.eddystoneUid
        this.controls.eddystoneUrlSwitch.checked = this.beacon.eddystoneUrl
        this.controls.eddystoneEidSwitch.checked = this.beacon.eddystoneEid
        this.controls.eddystoneEtlmSwitch.checked = this.beacon.eddystoneEtlm
        this.controls.eddystoneTlmSwitch.checked = this.beacon.eddystoneTlm
        this.controls.telemetrySwitch.checked = this.beacon.telemetry
        setTimeout(() => {
          this.controls.frequencySlider.layout()
        })
      },
      resetConfiguration() {
        this.resetBeacon()
        this.configResetted = true
      },
      save() {
        this.saving = true
        if(this.group.id !== this.notAssignedLabel)
          this.beacon.group = this.group
        else
          this.beacon.group = null
        updateBeacon(this.beacon).then(beacon => {
          Object.assign(this.beaconBackup, beacon)
          Object.assign(this.beacon, beacon)
          if(beacon.group != null) {
            Object.assign(this.groupBackup, beacon.group)
            Object.assign(this.group, beacon.group)
          } else {
            Object.assign(this.groupBackup, {
              id: this.notAssignedValue,
              name: this.notAssignedLabel
            })
            Object.assign(this.group, {
              id: this.notAssignedValue,
              name: this.notAssignedLabel
            })
          }
          this.updateControls()
          this.updateMap()
          this.$set(this, 'editing', false)
          this.$set(this, 'saving', false)
        }).catch(() => {
          alert('An error occured during saving. Please check your input values.')
          this.$set(this, 'saving', false)
        })
      },
      reload() {
        getBeacon(this.beacon.id).then(beacon => {
          Object.assign(this.beaconBackup, beacon)
          Object.assign(this.beacon, beacon)
          if(beacon.group != null) {
            Object.assign(this.groupBackup, beacon.group)
            Object.assign(this.group, beacon.group)
          }
          this.updateControls()
          this.updateMap()
        })
      },
      cancelEdit() {
        this.resetBeacon()
        this.updateMap()
        this.$set(this, 'editing', false)
      },
      setMapControlsEnabled(enabled) {
        this.marker.setDraggable(enabled)
        this.map.setOptions({
          disableDefaultUI: false,
          zoomControl: enabled,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: enabled,
          fullscreenControl: false,
          draggable: enabled,
          scrollwheel: enabled,
          panControl: enabled
        })
      },
      updateMap() {
/**        let latLng = new this.google.maps.LatLng(this.beacon.lat, this.beacon.lng)
        this.marker.setPosition(latLng)
        this.map.panTo(latLng)
        this.map.setZoom(16)*/
      },
      resetBeacon() {
        if (this.beaconBackup != null) {
          Object.assign(this.beacon, this.beaconBackup)
          if(this.groupBackup != null)
            Object.assign(this.group, this.groupBackup)
          this.updateControls()
        }
      },
      executeAction(event) {
        switch(event.target.value) {
          case 'edit':
            this.$set(this, 'editing', true)
            event.target.selectedIndex = 0
            break;
        }
      },
      changeLocationType(type) {
        if (this.editing) {
          this.beacon.locationType = type
        }
      },
/*      getInfo(beacon) {
        return this.infos.find((info => info.id === beacon.id))
      },*/
      getPosition(beacon, info) {
        if (beacon.lat !== 0 || beacon.lng !== 0) {
          return {
            lat: beacon.lat,
            lng: beacon.lng
          }
        } else if (info != null) {
          return {
            lat: info.latitude,
            lng: info.longitude
          }
        }

        return {
          lat: 0,
          lng: 0
        }
      },
      iconSvg(beacon) {
        let uri = location.origin;
        if (beacon.lat === 0 && beacon.lng === 0) {
          uri += require('../assets/img/map/map_icon_provisoric.svg')
        } else {
          switch (beacon.status) {
            case 'BATTERY_LOW':
            case 'ISSUE':
              uri += require('../assets/img/map/map_icon_issue.svg')
              break
            case 'CONFIGURATION_PENDING':
              uri += require('../assets/img/map/map_icon_pending.svg')
              break
            case 'NO_SIGNAL':
              uri += require('../assets/img/map/map_icon_nosignal.svg')
              break
            default:
              uri += require('../assets/img/map/map_icon_ok.svg')
              break
          }
        }

        return encodeURI(uri);
      },
      getStatusClassPostfix(beacon) {
        switch (beacon.status) {
          case 'OK':
            return 'ok'
          case 'BATTERY':
          case 'ISSUE':
            return 'issue'
          case 'CONFIGURATION_PENDING':
            return 'pending'
          case 'NO_SIGNAL':
            return 'nosignal'
          default:
            return 'default'
        }
      },
      getStatusCardClass(beacon) {
        switch (beacon.status) {
          case 'OK':
            return 'status-ok'
          case 'BATTERY_LOW':
          case 'ISSUE':
            return 'status-issue'
          case 'CONFIGURATION_PENDING':
            return 'status-pending'
          case 'NO_SIGNAL':
            return 'status-nosignal'
          default:
            return ''
        }
      },
      getStatusText(beacon) {
        switch (beacon.status) {
          case 'OK':
            return 'OK';
          case 'ISSUE':
          case 'BATTERY_LOW':
            return 'ISSUE';
          case 'CONFIGURATION_PENDING':
            return 'PENDING';
          case 'NO_SIGNAL':
            return 'NO SIGNAL';
          default:
            return beacon.status;
        }
      },
      getStatusDescription(beacon) {
        switch (beacon.status) {
          case 'OK':
            return 'No problems found';
          case 'ISSUE':
            return 'Issue';
          case 'BATTERY_LOW':
            return 'Battery level low';
          case 'CONFIGURATION_PENDING':
            return 'Configuration pending';
          case 'NO_SIGNAL':
            return 'Device status unknown';
          default:
            return '';
        }
      },
      removeImage(image) {
        this.$refs.deleteImageConfirm.open()
                .then(() => {
                  deleteImageForBeacon(this.beacon.id, image.id)
                          .then(() => {
                            this.reloadImages()
                          })
                          .catch(() => {})
                })
                .catch(() => {})
      }
    },
    filters: {
      formatDate(dateString) {
        let date = moment(dateString)
        if (!date.isValid()) {
          return ''
        }

        return date.format('DD.MM.YYYY')
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "../variables";

  .beacon-title {
    color: $background-blue;
  }

  .beacon-detail-card {
    width: 100%;
    background-color: white;
    border-radius: 10px;
    border: 1px solid $background-grey;
    box-shadow: 0 0.125em 0.25em 0 rgba(0,0,0,0.05);

    &>div {
      padding: 1.25em;
    }

    h5 {
      font-weight: normal;
      font-size: 1.125rem;
    }

    .form-control {
      font-size: 80%;
    }

    small {

      &.text-muted {
        color: $text-muted-grey !important;
      }
    }

    input[readonly] {
      background: white;
      border-color: $background-grey;
      color: $text-muted-grey;
    }

    textarea.description {
      border: 1px solid $background-grey;
      border-radius: 0.25rem;
      padding: 0.25em 0.75em;
      resize: none;
      font-size: 0.8em;
      color: $text-grey;

      &.description-disabled {
        color: $text-muted-grey;
      }
    }

    button.location-description-button {
      background: $lighter-grey;
      color: white;
      border: none;
      border-radius: 1rem;
      display:block;
      width: 100%;
      cursor: pointer;
      font-size: 0.8rem;

      &.location-description-button-active {
        background: $status-blue;
        color: white;
      }

      &[disabled] {
        cursor: default;
        opacity: 0.6;
      }
    }

    .location-images-outer-wrapper {
      overflow: auto;
      overflow-x: hidden;
      min-height: 240px;
    }

    .location-images-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .location-image-wrapper {

        display: inline-block;
        position: relative;
        cursor: pointer;
        text-align: center;

        .location-image {
          width: 100%;
        }

        .btn-delete {
          position: absolute;
          top: 0.45rem;
          right: 0.125rem;
        }
      }
    }


    .image-upload-input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .btn-image-upload {
      background: $light-blue;
      color: white;
      cursor: pointer;
      font-size: 0.8rem;

      &:hover {
        background: $lighter-blue;
      }
    }
  }

  .row-eq-height {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display:         flex;
  }

  .border-start {
    border-left: 1px solid $background-grey;
  }

  .status-pending {
    color: white;
    background-color: $status-blue;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .status-issue {
    color: white;
    background-color: $status-yellow;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .status-nosignal {
    color: white;
    background-color: $status-red;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .battery-status-low {
    color: white;
    background-color: $status-yellow;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .status-label-ok {
    color: $status-green;
  }
  .status-label-issue, .status-label-pending, .status-label-default {
    color: white;
  }

  .label-blue {
    color: $status-blue;
  }

  .label-yellow {
    color: $status-yellow;
  }

  .slider-always-label {
    transform: rotate(-45deg) scale(1) translate(19px, -20px);
  }

  .issue-display {
    font-size: 0.75rem;

    .table-header {
      background-color: $background-grey;
      color: $grey;
      padding-top: 1em;
      padding-bottom: 1em;
    }
  }

  .edit-actions {
    .btn {
      width: 180px;
      padding: 0.1em 0.5em;
      font-size: 0.9em;

      &.btn-primary {
        background: $light-blue;
        border-color: $light-blue;

        &:hover {
          background: $lighter-blue;
          border-color: $lighter-blue;
        }
      }

      &.btn-outline-secondary {
        border-color: $grey;

        &:hover {
          background: $grey;
        }
      }
    }
  }

  .alert {
    &.alert-configuration-pending {
      color: white;
      background: $background-blue;

      .btn {
        font-size: 0.8rem;
      }
    }
  }

  .btn {
    &.btn-resolve {
      color: $background-blue;
      text-transform: uppercase;
      font-size: 0.8rem;
      padding: 0;

      &:hover {
        color: $light-blue;
      }

      &:focus {
        outline: 0;
        box-shadow: none;
      }
    }

    &.btn-add-issue {
      background: $light-blue;
      border-color: $light-blue;
      font-size: 0.8rem;
      color: white;

      &:hover {
        background: $lighter-blue;
        border-color: $lighter-blue;
      }
    }
  }

  .btn-delete {
    mask-image: url("./../assets/delete.svg");
    background-color: $text-grey;

    height: 24px;
    width: 24px;

    &:hover {
      background-color: red;
    }
  }

  .table-issues-wrapper {
    position: relative;
    min-height: 180px;

    .table-issues {

      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding-bottom: 4em;

      thead {
        border-bottom: none;

        .table-header {
          border-bottom: none;

          th {
            border-bottom: none;
          }
        }
      }

      .issue-item {

        td {
          border-bottom: 1px solid $background-grey;
          font-size: 0.8rem;
          color: $text-grey;
        }

        &.issue-item-resolved {
          cursor: pointer;

          &:hover {
            td {
              color: $lighter-blue;
            }
          }
        }
      }
    }
  }

  select.form-select-group-control {
    height: calc(1.5em + 0.75rem + 2px);
    font-size: 1rem;
    line-height: 1.5;
  }

</style>
