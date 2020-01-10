<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="search-input">
      <div class="col p-0 h-100 text-right search-container">
        <img class="search-icon" :src="require('../assets/ic_search.svg')">
        <input type="text" class="beacon-search" v-model="search" placeholder="Search issue">
      </div>
    </template>
    <template slot="body">
      <div class="row flex-grow-1" style="overflow: hidden">
        <div id="view-switch" class="position-absolute mt-4 ml-4 btn-group" role="group" aria-label="Switch view">
          <button type="button" :class="'btn btn-view-switch ' + (viewMode === LIST ? 'btn-view-switch-active' : '')" @click="changeMode(LIST)"><img src="../assets/ic_list.svg"/></button>
          <button type="button" :class="'btn btn-view-switch ' + (viewMode === MAP ? 'btn-view-switch-active' : '')" @click="changeMode(MAP)"><img src="../assets/ic_map.svg"/></button>
        </div>
        <div class="container mt-6 p-0" v-show="loaded && viewMode === LIST">
          <div class="row beacon-display m-4 p-4">
            <div class="col-12 p-0" v-show="tableData.length > 0">
              <simple-table responsive @change="reloadTableData" :cols="tableCols" :data="tableData" :meta="tableMeta" @rowClicked="showDetail"/>
            </div>
            <div class="col-12 p-0 text-center" v-show="tableData.length <= 0">
              <span class="text-muted">No issues found...</span>
            </div>
          </div>
        </div>
        <div id="map" class="issue-map" :style="{visibility: loaded && viewMode === MAP ? 'visible' : 'hidden'}">
        </div>
        <loader :visible="!loaded" :label="'Loading issues...'"/>
      </div>
    </template>
  </layout>
</template>

<script>
  import Layout from '../components/Layout'
  import SimpleTable from '../components/SimpleTable'
  import { mapActions, mapGetters } from 'vuex'
  import { LIST, MAP } from '../store/issues'
  import Loader from '../components/Loader'
  import { initMap, getMapStyles } from '../service/googlemaps'
  import MarkerClusterer  from '@google/markerclusterer'
  import router from '../router/index'
  import merge from 'lodash/merge'

  export default {
    components: {
      Layout,
      SimpleTable,
      Loader
    },
    name: 'Issues',
    data() {
      return {
        LIST: LIST,
        MAP: MAP,
        title: 'Issues',
        tableCols: [
          {
            title: 'Name',
            key: 'beacon.name'
          },
          {
            title: 'Problem',
            key: 'problem'
          },
          {
            title: 'Description',
            key: 'problemDescription'
          },
          {
            title: 'Date',
            key: 'reportDate',
            type: 'date'
          },
          {
            title: 'Battery',
            key: 'beacon.batteryLevel',
            type: 'battery-level'
          },
          {
            title: 'Status',
            key: 'beacon.status',
            type: 'beacon-status'
          }
        ],
        tableData: [],
        tableMeta: {
          sorting: {
            col: 'reportDate',
            order: 'desc'
          },
          pagination: {
            offset: 0,
            page: 1,
            records: 10,
            recordsNumberList: [2, 5, 10, 20]
          }
        },
        search: '',
        loaded: false,
        map: null,
        markers: [],
        beaconIds: [],
        addedOnMap: false,
        myPosition: null,
        clusterer: null,
        google: {},
        timers: []
      }
    },
    computed: {
      ...mapGetters('issues', [
        'issues',
        'viewMode'
      ])
    },
    watch: {
      search() {
        this.reloadTableData()
      },
      issues() {
        this.reloadTableData()
        this.$set(this, 'loaded', true)
      },
      tableData() {

        // if leaflet is not ready, skip
        if (!this.L)
           return

        // cancel previous marker timers
        while (this.timers.length > 0)
           clearTimeout(this.timers.shift());

        if (this.cluster == null)
        {
           this.cluster = this.L.markerClusterGroup();
           // console.log(this.cluster)
           this.map.addLayer(this.cluster);
        }
        else
        {
           this.cluster.removeLayers(this.cluster.getLayers())
        }

        this.tableData.forEach((issue) => {
          let beacon = issue.beacon

          let position = this.getPosition(beacon)
          console.log(position)
          console.log(issue.beacon)

          if (position.lat !== 0 || position.lng !== 0) {

            var customIcon = this.L.icon({
              iconUrl: this.iconSvg(beacon),
              iconSize:     [24, 24], // size of the icon
              iconAnchor:   [12, 12], // point of the icon which will correspond to marker's location
            });

            console.log(customIcon)

            let marker = this.L.marker([position.lat, position.lng], {icon: customIcon}) //.addTo(this.map);
            marker.on('click', () => {
              router.push({name: 'beacon-detail', params: {id: beacon.id}})
            })
            let ccc = this.cluster
            // add marker async
            this.timers.push(setTimeout(function() { ccc.addLayer(marker); }, 200));

          }

        });

        /*
        this.beaconIds = []
        let newMarkers = []

        if (this.tableData === null) {
          this.updateMarkers(newMarkers)
          return
        }
        this.tableData.forEach((issue) => {
          if (!this.beaconIds.includes(issue.beacon.id)) {
            let marker = new this.google.maps.Marker({
              position: {
                lat: issue.beacon.lat,
                lng: issue.beacon.lng
              },
              icon: {
                url: this.iconSvg(issue.beacon),
                size: new this.google.maps.Size(48, 48),
                scaledSize: new this.google.maps.Size(24, 24),
                anchor: new this.google.maps.Point(12, 12)
              }
            })
            marker.addListener('click', () => {
              router.push({name: 'issue-detail', params: {id: issue.beacon.id}})
            })
            this.beaconIds.push(issue.beacon.id)
            newMarkers.push(marker)
          }
        })

        this.updateMarkers(newMarkers)

        */
      }
    },
    methods: {
      ...mapActions('issues', [
        'fetchIssues',
        'clear'
      ]),
      updateMarkers(newMarkers) {
        if (this.map != null) {
          if (this.clusterer === null) {
            this.clusterer = new MarkerClusterer(this.map, [], {
              styles: [
                {
                  url: location.origin + require('../assets/img/map/cluster/map_icon_cluster.svg'),
                  height: 32,
                  width: 32,
                  textColor: '#4d4f5c'
                }
              ]
            })
          }

          let markersToKeep = this.markers.filter(marker => {
            return newMarkers.some(newMarker => marker.position.lat() === newMarker.position.lat() && marker.position.lng() === newMarker.position.lng())
          })

          let markersToRemove = this.markers.filter(marker => !markersToKeep.includes(marker))
          let markersToAdd = newMarkers.filter(newMarker => {
            return !markersToKeep.some(marker => {
              return marker.position.lat() === newMarker.position.lat() && marker.position.lng() === newMarker.position.lng()
            })
          })

          this.clusterer.removeMarkers(markersToRemove)
          this.clusterer.addMarkers(markersToAdd)

          this.markers = markersToAdd.concat(markersToKeep)
        }
      },
      getPosition(beacon) {

        // TODO check this

        if (beacon.lat !== 0 || beacon.lng !== 0) {
          return {
            lat: beacon.lat,
            lng: beacon.lng
          }
        } else if (beacon.info != null) {
          return {
            lat: beacon.info.latitude,
            lng: beacon.info.longitude
          }
        }

        return {
          lat: 0,
          lng: 0
        }
      },
      showDetail(issue) {
        router.push({name: 'issue-detail', params: {id: issue.beacon.id}})
      },
      showMyPosition(success, failure) {
        let myPositionButtonIcon = document.getElementById('myLocationButtonIcon')
        let on = false
        let myLocationButtonBlinker = setInterval(function(){
          myPositionButtonIcon.src = on ? require('../assets/img/map/my_location.svg') : require('../assets/img/map/my_location_empty.svg')
          on = !on
        }, 500);
        navigator.geolocation.getCurrentPosition(position => {
          clearInterval(myLocationButtonBlinker)
          myPositionButtonIcon.src = require('../assets/img/map/my_location.svg')
          if (this.myPosition != null) {
            this.myPosition.setMap(null)
          }
          this.myPosition = new this.google.maps.Marker({
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            draggable: this.editing,
            map: this.map,
            icon: {
              url: require('../assets/img/map/map_icon_my_location.svg'),
              size: new this.google.maps.Size(24, 24),
              scaledSize: new this.google.maps.Size(24, 24),
              anchor: new this.google.maps.Point(12, 12)
            }
          })
          success(position)
        }, error => {
          clearInterval(myLocationButtonBlinker)
          myPositionButtonIcon.src = require('../assets/img/map/my_location.svg')
          failure(error)
        })
      },
      goToMyPosition() {
        this.showMyPosition(position => {
          this.map.panTo(new this.google.maps.LatLng(position.coords.latitude, position.coords.longitude))
          this.map.setZoom(16)
        }, () => {
          alert("Please make sure you have allowed the acces to your location.")
        })
      },
      MyLocationControl(controlDiv) {
        this.controlUI = document.createElement('div')
        this.controlUI.style.backgroundColor = '#fff'
        this.controlUI.style.border = '2px solid #fff'
        this.controlUI.style.borderRadius = '3px'
        this.controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)'
        this.controlUI.style.cursor = 'pointer'
        this.controlUI.style.marginBottom = '0px'
        this.controlUI.style.marginRight = '10px'
        this.controlUI.style.width = '40px'
        this.controlUI.style.height = '40px'
        this.controlUI.style.textAlign = 'center'
        this.controlUI.title = 'Click to recenter the map'
        controlDiv.appendChild(this.controlUI)

        this.controlText = document.createElement('div')
        this.controlText.style.color = 'rgb(25,25,25)'
        this.controlText.style.fontFamily = 'Roboto,Arial,sans-serif'
        this.controlText.style.fontSize = '16px'
        this.controlText.style.lineHeight = '38px'
        this.controlText.style.paddingLeft = '5px'
        this.controlText.style.paddingRight = '5px'
        this.controlText.innerHTML = '<img id="myLocationButtonIcon" src="' + require('../assets/img/map/my_location.svg') +  '" class="map-control"/>'
        this.controlUI.appendChild(this.controlText);

        this.addClickListener = function(callback) {
          this.controlUI.addEventListener('click', callback)
        }

      },
      changeMode(mode) {
        this.$store.dispatch('issues/setViewMode', mode)
      },
      reloadTableData(params = {}) {
        params = merge({
          pagination: this.tableMeta.pagination,
          sorting: this.tableMeta.sorting,
          filters: this.filters
        }, params, {
          filters: this.filters
        })

        if (this.issues === null) {
          this.tableData = []
        } else {
          this.tableData = this.issues.slice(0).filter((issue) => {
            return typeof issue !== 'undefined'
          }).filter((issue) => {
              return issue.beacon.name.toLowerCase().includes(this.search.toLowerCase())
          })
        }
        this.tableData.sort((issueA, issueB) => {
          if (issueA[params.sorting.col] < issueB[params.sorting.col]) {
            return params.sorting.order === 'asc' ? -1 : 1
          }
          if (issueA[params.sorting.col] > issueB[params.sorting.col]) {
            return params.sorting.order === 'asc' ? 1 : -1
          }
          return 0
        })

        this.tableMeta.totalRecords = this.tableData.length
        params.pagination.page = Math.min(Math.max(params.pagination.page, 1), Math.ceil(this.tableMeta.totalRecords / this.tableMeta.pagination.records))

        let currentIndex = (params.pagination.page - 1) * params.pagination.records
        let nextIndex = params.pagination.page * params.pagination.records
        this.tableData = this.tableData.slice(currentIndex, nextIndex)
        this.tableMeta.sorting.col = params.sorting.col
        this.tableMeta.sorting.order = params.sorting.order
      },
      iconSvg(beacon) {
        let uri = location.origin;
        switch(beacon.status) {
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

        return encodeURI(uri);
      }
    },
    async mounted() {

      this.clear()
        /*
        this.google = await initMap();
        this.map = new this.google.maps.Map(document.getElementById('map'), {
          center: {
            lat: 46.6568142,
            lng: 11.423318
          },
          zoom: 9,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: true,
          styles: getMapStyles()
        })
        */

        this.L = await initMap();
        this.map = this.L.map('map')
        this.map.zoomControl.setPosition('topright')
        let map = this.map

        this.map.on('zoomend', function(e) {
            console.log(e.target.getZoom())
            sessionStorage.setItem('map_zoom', map.getZoom())
        });

        this.map.on('moveend', function(e) {
            sessionStorage.setItem('map_lat', e.target.getCenter().lat)
            sessionStorage.setItem('map_lon', e.target.getCenter().lng)
        });

        // get previous zoom
        let prevZoom = sessionStorage.getItem('map_zoom') || 9
        let prevLat  = sessionStorage.getItem('map_lat')  || 46.6568142
        let prevLon  = sessionStorage.getItem('map_lon')  || 11.423318

        // setView after on zoomend/moveend so that they fire the first time
        this.map.setView([prevLat, prevLon], prevZoom);

        this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);


        let myLocationButtonContainer = document.createElement('div');
        let myLocationControl = new this.MyLocationControl(myLocationButtonContainer);
        myLocationControl.addClickListener(() => {
          this.goToMyPosition()
        });
        myLocationButtonContainer.index = 1;
        // this.map.controls[this.google.maps.ControlPosition.RIGHT_BOTTOM].push(myLocationButtonContainer);
        this.fetchIssues()
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../variables';
  h1 {
    display: inline-block;
  }

  .mt-6 {
    margin-top: 4em !important;
  }

  .issue-map {
    width: 100%;
    height: 100%;
  }

  #view-switch {
     z-index: 1000;
  }

  .btn-view-switch {
    color: white;
    background: $grey;
    z-index: 1000;
    border-radius: 0.5em;
    opacity: 0.7;
    height: 2.25em;
    line-height: 1.125em;
    padding: 0 0.7em;

    &:hover {
      color: white;
      opacity: 0.9;
    }

    &:focus {
      box-shadow: none;
    }

    &.btn-view-switch-active {
      background: $status-blue;
      opacity: 1;

      &:hover {
        background: $background-blue;
      }
    }
  }

  .add-fab {
    position: absolute;
    bottom: 0;
    right: 1em;
    transform: translateY(50%);
    border-radius: 50%;
    background-image: url("../assets/ic_add_beacon.svg");
  }

  .beacon-display {
    position: relative;
  }

  .btn-delete {
    mask-image: url("../assets/delete.svg");
    background-color: black;

    &:hover {
      background-color: red;
    }
  }

  .table-header {
    background-color: $background-grey;
    color: $grey;
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 0.8rem;
  }

  .beacon-row {
    font-size: 0.8rem;
    font-weight: lighter;
  }

  .battery {
    height: 1.5em;
    width: 0.75em;
    background: $lighter-grey;
    position:relative;

    &:before,
    &:after {
      z-index:10;
      content:'';
      display:block;
      position:absolute;
      background: white;
      width: 0.2em;
      height: 0.15em;
      top:0;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
    .chargestatus {
      position:absolute;
      top: 0;
      left:0;
      right:0;
      background: grey;
    }

    &.warning {
      background: lighten($status-yellow, 35%);
      .chargestatus {
        background: lighten($status-yellow, 25%);
      }
    }

    &.danger {
      background: darkred;
      .chargestatus {
        background: red;

      }
    }
  }

</style>
