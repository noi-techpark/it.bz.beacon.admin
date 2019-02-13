<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container pb-4" v-show="loaded">
        <div class="row mt-4">
          <div class="col-12">
            <h2 class="beacon-title">{{ beacon.name }}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <span class="text-muted">last seen:</span> {{ formatLastSeen(beacon) }}
          </div>
        </div>
        <div class="row mt-4 row-eq-height">
          <div class="col-4 d-flex">
            <div :class="'row beacon-detail-card ' + (beacon.batteryLevel <= 5 ? 'battery-status-low' : '')">
              <div class="col-6 d-flex flex-column justify-content-between flex-grow-1 flex-shrink-0">
                <h5>Battery status</h5>
                <div class="mt-2">
                  <h4 class="mb-0"><strong>{{ beacon.batteryLevel }}%</strong></h4>
                  <div :class="'small ' + (beacon.batteryLevel > 5 ? 'label-yellow' : '')">critical < 5%</div>
                </div>
              </div>
                <div :class="'col-6 d-flex flex-column justify-content-between flex-grow-1 flex-shrink-0 border-start ' + (beacon.status === 'CONFIGURATION_PENDING' ? 'status-pending' : '')">
                  <h5>Device status</h5>
                  <div class="mt-2">
                    <h4 class="mb-0"><strong>{{ getStatusText(beacon) }}</strong></h4>
                    <div :class="'small status-label-' + getStatusClassPostfix(beacon)">{{ getStatusDescription(beacon) }}</div>
                  </div>
                </div>
            </div>
          </div>
          <div class="col-8 d-flex">
            <div class="row beacon-detail-card">
              <div class="col-8 d-flex flex-column justify-content-between flex-grow-1 flex-shrink-0">
                <div class="row">
                  <div class="col-12 p-0">
                    <h5>Signal strength</h5>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <div id="frequency-slider" class="mdc-slider mdc-slider--discrete mdc-slider--display-markers" tabindex="0" role="slider" aria-disabled="true" aria-valuemin="1" aria-valuemax="7" :aria-valuenow="beacon.txPower" data-step="1" aria-label="Select Value">
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
        <div class="row mt-4 row-eq-height">
          <div class="col-4 d-flex">
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
                      <img src="" id="location-map" style="width:100%"/>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12 p-0">
                      <input type="text" class="form-control" :value="beacon.lat" readonly />
                      <small class="text-muted">GPS-N</small>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12 p-0">
                      <input type="text" class="form-control" :value="beacon.lng" readonly />
                      <small class="text-muted">GPS-E</small>
                    </div>
                  </div>
                </div>
                <div id="location-description" :class="(locationTab === 'DESCRIPTION' ? 'd-flex' : '') + ' mt-4 flex-grow-1 flex-column'" v-show="locationTab === 'DESCRIPTION'">
                  <div class="row">
                    <div class="col-6 pl-0">
                      <button :class="'location-description-button ' + (beacon.locationType === 'OUTDOOR' ? 'location-description-button-active' : '')" disabled>OUTDOOR</button>
                    </div>
                    <div class="col-6 pr-0">
                      <button :class="'location-description-button ' + (beacon.locationType === 'INDOOR' ? 'location-description-button-active' : '')" disabled>INDOOR</button>
                    </div>
                  </div>
                  <div class="row flex-grow-1 mt-3">
                    <div class="col-12 p-0 d-flex flex-column">
                      <div class="description flex-grow-1"><small>{{ beacon.description }}</small></div>
                      <small class="text-muted">Description</small>
                    </div>
                  </div>
                  <div class="row mt-3" v-show="beacon.locationType === 'INDOOR'">
                    <div class="col-12 p-0 d-flex flex-column">
                      <input type="number" class="form-control" :value="beacon.locationDescription" readonly />
                      <small class="text-muted">Floor</small>
                    </div>
                  </div>
                </div>
                <div id="location-images" :class="(locationTab === 'IMAGES' ? 'd-flex' : '') + ' location-images mt-4 flex-grow-1 flex-column position-relative'" v-show="locationTab === 'IMAGES'">
                  <div class="location-images-wrapper">
                    <div :class="'row ' + (key > 0 ? 'mt-3' : '')" v-bind:key="image.id" v-if="images.length" v-for="(image, key) in images">
                      <div class="col-12 text-center p-0">
                        <img :src="image.content" class="location-image" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-8 d-flex flex-column">
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
                      <input type="text" class="form-control" :value="beacon.uuid" readonly />
                      <small class="text-muted">UUID</small>
                    </div>
                    <div class="col-2">
                      <input type="text" class="form-control" :value="beacon.major" readonly />
                      <small class="text-muted">Major</small>
                    </div>
                    <div class="col-2 pr-0">
                      <input type="text" class="form-control" :value="beacon.minor" readonly />
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
                      <input type="text" class="form-control" :value="beacon.namespace" readonly />
                      <small class="text-muted">Namespace</small>
                    </div>
                    <div class="col-6 pr-0">
                      <input type="text" class="form-control" :value="beacon.instanceId" readonly />
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
                      <input type="text" class="form-control" :value="beacon.url" readonly />
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
              </div>
            </div>
            <div class="row beacon-detail-card mt-4 flex-grow-1">
              <div class="col-12 d-flex flex-column flex-grow-1 flex-shrink-0">
                <h5>Reports</h5>
                <div class="row issue-display mt-4">
                  <div class="col-12 col-header table-header pl-0 pr-0">
                    <div class="row">
                      <div class="col-3">Problem</div>
                      <div class="col-3">Description</div>
                      <div class="col-3">Report</div>
                      <div class="col-3">Resolved</div>
                    </div>
                  </div>
                  <div class="col-12 issue-item pl-0 pr-0" v-bind:key="issue.id" v-if="issues.length" v-for="issue in issues">
                    <span class="row">
                      <span class="col-3">{{ issue.problem }}</span>
                      <span class="col-3">{{ issue.problemDescription }}</span>
                      <span class="col-3">{{ issue.reportDate }}</span>
                      <span class="col-3">{{ issue.resolveDate }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <loader :visible="!loaded" :label="'Loading beacon data...'"/>
    </template>
  </layout>
</template>

<script>
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import { getBeacon } from '../service/apiService'
import {MDCSlider} from '@material/slider'
import {MDCTabBar} from '@material/tab-bar'
import {MDCSwitch} from '@material/switch'
import config from '../service/config'
import { getIssuesForBeacon, getImagesForBeacon } from "../service/apiService"
import store from '../store/store'
import moment from 'moment'

export default {
  components: {
    Layout,
    Loader
  },
  name: 'Beacon',
  data() {
    return {
      title: 'Beacon',
      beacon: {
        name: '',
      },
      issues: [],
      modeTab: 'IBEACON',
      locationTab: 'GPS',
      images: [],
      loaded: false
    }
  },
  mounted() {
    const slider = new MDCSlider(document.querySelector('#frequency-slider'));
    const modeTabBar = new MDCTabBar(document.querySelector('#mode-tab-bar'));
    modeTabBar.listen('MDCTabBar:activated', event =>  {
      switch(event.detail.index) {
        case 1:
          this.$set(this, 'modeTab', 'EDDYSTONE')
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
    const iBeaconSwitch = new MDCSwitch(document.querySelector('#ibeacon-switch'));
    const eddystoneUidSwitch = new MDCSwitch(document.querySelector('#eddystone-uid-switch'));
    const eddystoneUrlSwitch = new MDCSwitch(document.querySelector('#eddystone-url-switch'));
    const eddystoneEidSwitch = new MDCSwitch(document.querySelector('#eddystone-eid-switch'));
    const eddystoneEtlmSwitch = new MDCSwitch(document.querySelector('#eddystone-etlm-switch'));
    const eddystoneTlmSwitch = new MDCSwitch(document.querySelector('#eddystone-tlm-switch'));

    iBeaconSwitch.disabled = true
    eddystoneUidSwitch.disabled = true
    eddystoneUrlSwitch.disabled = true
    eddystoneEidSwitch.disabled = true
    eddystoneEtlmSwitch.disabled = true
    eddystoneTlmSwitch.disabled = true

    getBeacon(this.$route.params.id).then((beacon) => {
      Object.assign(this.beacon, beacon)
      slider.value = beacon.txPower
      document.querySelector('#frequency-slider .mdc-slider__pin-value-marker').innerHTML = beacon.txPower
      document.querySelector('#location-map').setAttribute('src', this.getStaticMap(beacon))
      iBeaconSwitch.checked = beacon.iBeacon
      eddystoneUidSwitch.checked = beacon.eddystoneUid
      eddystoneUrlSwitch.checked = beacon.eddystoneUrl
      eddystoneEidSwitch.checked = beacon.eddystoneEid
      eddystoneEtlmSwitch.checked = beacon.eddystoneEtlm
      eddystoneTlmSwitch.checked = beacon.eddystoneTlm
      this.$set(this, 'loaded', true)
      setTimeout(() => {
        slider.layout()
      })
    })

    getIssuesForBeacon(this.$route.params.id).then(issues => {
      this.issues = issues
    })

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
  methods: {
    icon(beacon) {
      return 'https://beacon-dev.it/img/map_icon_pending.4762a85f.png';
      let uri = location.origin;
      switch(beacon.status) {
        case 'BATTERY_LOW':
        case 'ISSUE':
          uri += require('../assets/map_icon_issue.png')
          break
        case 'CONFIGURATION_PENDING':
          uri += require('../assets/map_icon_pending.png')
          break
        default:
          uri += require('../assets/map_icon_ok.png')
          break
      }

      return encodeURI(uri);
    },
    formatLastSeen(beacon) {
      return moment(beacon.lastSeen * 1000).format('DD.MM.YYYY');
    },
    getStaticMap(beacon) {
      return 'https://maps.googleapis.com/maps/api/staticmap' +
        '?center=' + beacon.lat + ',' + beacon.lng +
        '&zoom=18' +
        '&size=300x200' +
        '&maptype=roadmap' +
        '&markers=anchor:center|size:tiny|icon:' + this.icon(beacon) + '|' + beacon.lat + ',' + beacon.lng +
        '&key=' + config.GOOGLE_MAPS_API_KEY +
        '&style=element:geometry%7Ccolor:0xf5f5f5' +
        '&style=element:labels.icon%7Cvisibility:off' +
        '&style=element:labels.text.fill%7Ccolor:0x616161' +
        '&style=element:labels.text.stroke%7Ccolor:0xf5f5f5' +
        '&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xbdbdbd' +
        '&style=feature:poi%7Celement:geometry%7Ccolor:0xeeeeee' +
        '&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575' +
        '&style=feature:poi.park%7Celement:geometry%7Ccolor:0xe5e5e5' +
        '&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x9e9e9e' +
        '&style=feature:road%7Celement:geometry%7Ccolor:0xffffff' +
        '&style=feature:road.arterial%7Celement:labels.text.fill%7Ccolor:0x757575' +
        '&style=feature:road.highway%7Celement:geometry%7Ccolor:0xdadada' +
        '&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0x616161' +
        '&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x9e9e9e' +
        '&style=feature:transit.line%7Celement:geometry%7Ccolor:0xe5e5e5' +
        '&style=feature:transit.station%7Celement:geometry%7Ccolor:0xeeeeee' +
        '&style=feature:water%7Celement:geometry%7Ccolor:0xc9c9c9' +
        '&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x9e9e9e'
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
        default:
          return 'default'
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
        default:
          return beacon.status;
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "../variables";
  $mdc-theme-primary: $background-blue;
  $mdc-theme-secondary: $background-blue;
  $mdc-theme-text-primary-on-light: #fff;
  $mdc-theme-text-secondary-on-dark: #fff;
  @import "../../node_modules/@material/slider/mdc-slider";
  @import "../../node_modules/@material/tab-bar/mdc-tab-bar";
  @import "../../node_modules/@material/tab-scroller/mdc-tab-scroller";
  @import "../../node_modules/@material/tab-indicator/mdc-tab-indicator";
  @import "../../node_modules/@material/tab/mdc-tab";
  @import "../../node_modules/@material/switch/mdc-switch";

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

    .mdc-slider {
      margin-bottom: -0.9em;

      &.mdc-slider--disabled {
        opacity: 0.6;
      }

      .mdc-slider__track {
        background-color: $mdc-theme-secondary !important;
      }
      .mdc-slider__thumb {
        fill: $mdc-theme-secondary !important;
      }
      .mdc-slider__pin {
        background-color: $mdc-theme-secondary !important;
        color: white;
      }
    }

    .mdc-tab-bar {
      border-bottom: 1px solid $background-grey;

      .mdc-tab {
        text-transform: none;
        padding: 0 1em;
        letter-spacing: normal;
      }

      .mdc-tab--active {
        .mdc-tab__text-label {
          color: $light-blue;
        }
      }

      .mdc-tab__text-label {
        color: $text-muted-grey;
      }

      .mdc-tab-indicator {
        > .mdc-tab-indicator__content--underline {
          background-color: $light-blue
        }
      }

      .mdc-tab__ripple {
        &.mdc-ripple-upgraded--background-focused {
          background: none;
        }
      }
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

    .description {
      border: 1px solid $background-grey;
      color: $text-muted-grey;
      border-radius: 0.25rem;
      padding: 0.25em 0.75em;
    }

    button.location-description-button {
      background: $lighter-grey;
      color: white;
      border: none;
      border-radius: 1rem;
      display:block;
      width: 100%;

      &.location-description-button-active {
        background: $status-blue;
        color: white;
      }

      &[disabled] {
        opacity: 0.6;
      }
    }

    .location-images {
      overflow: auto;
      overflow-x: hidden;
    }

    .location-images-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .location-image {
      width:100%;
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



  .zipfzapf {
    flex: 1;
  }
  .zipfzapf::after {
    display: block;
    width: 2px;
    height: 2px;
    content: "";
  }

</style>
