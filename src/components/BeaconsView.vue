<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="search-input">
      <div class="col p-0 h-100 text-right search-container">
        <img class="search-icon" :src="require('../assets/search.png')">
        <input type="text" class="beacon-search" v-model="search" placeholder="Search beacon">
      </div>
    </template>
    <template slot="body">
      <div class="row beacon-display m-4 p-4 pb-5">
        <div class="col-12 col-header table-header">
          <div class="row">
            <div class="col-2">Name</div>
            <div class="col-1">Major</div>
            <div class="col-1">Minor</div>
            <div class="col-5">Description</div>
            <div class="col-1">Last seen</div>
            <div class="col-1">Battery</div>
            <div class="col-1">Status</div>
          </div>
        </div>
        <router-link class="col-12 beacon-item" v-bind:key="beacon.id" v-if="beacons.length" v-for="beacon in listBeacons" :to="{name: 'beacon-detail', params: { id: beacon.id }}">
          <div class="row beacon-row">
            <div class="col-2">{{ beacon.name }}</div>
            <div class="col-1">{{ beacon.major }}</div>
            <div class="col-1">{{ beacon.minor }}</div>
            <div class="col-5">{{ beacon.description }}</div>
            <div class="col-1">{{ formatLastSeen(beacon) }}</div>
            <div class="col-1 text-right d-flex align-middle justify-content-end">
              <span>{{ beacon.batteryLevel }} %</span>
              <div :class="'battery ml-2 ' + (beacon.batteryLevel <= 5 ? 'warning' : '')">
                <div class="chargestatus" :style="'top:' + (100 - beacon.batteryLevel) + '%;height:' + beacon.batteryLevel + '%'"></div>
              </div>
            </div>
            <div class="col-1"><span :class='"badge badge-pill badge-status " + getStatusClass(beacon)'>{{ getStatusText(beacon) }}</span></div>
          </div>
        </router-link>
        <div class="col-12 alert alert-danger" v-else> {{ getError }} </div>
        <router-link class="fab add-fab" :to="{name: 'beacon-new'}" style="display:none"><i class="fab-icon-addissue"></i></router-link>
      </div>

      <!--<simple-table responsive @change="reloadTableData" :cols="tableCols" :data="tableData" :meta="tableMeta" />-->
    </template>
  </layout>
</template>

<script>
  import Layout from './Layout'
  import SimpleTable from './SimpleTable'
  import { mapActions, mapGetters } from 'vuex'
  import moment from 'moment'

  export default {
    components: {
      Layout,
      SimpleTable
    },
    name: 'Beacons',
    data() {
      return {
        title: 'Beacons',
        tableCols: [
          {
            title: 'Name',
            key: 'name'
          }
        ],
        tableData: [],
        tableMeta: {
          sorting: {
            col: 'name',
            order: 'asc'
          },
          pagination: {
            records: 1
          }
        },
        search: ''
      }
    },
    computed: {
      ...mapGetters('beacons', [
        'beacons'
      ]),
      listBeacons() {
        let beacons = this.beacons.slice(0).filter((beacon) => {
          return beacon.name.toLowerCase().includes(this.search.toLowerCase())
        })
        beacons.sort((beaconA, beaconB) => {
          if (beaconA.name < beaconB.name) {
            return -1
          }
          if (beaconA.name > beaconB.name) {
            return 1
          }
          return 0
        })

        return beacons
      }
    },
    methods: {
      ...mapActions('beacons', [
        'fetchBeacons',
        'clear'
      ]),
      reloadTableData(params) {
        this.tableData = this.beacons.slice(0)
        this.tableData
          .filter((beacon) => {
            return typeof beacon !== 'undefined'
          })
        this.tableMeta.totalRecords = this.tableData.length
        this.tableData
          .sort((beaconA, beaconB) => {
            if (beaconA[params.sorting.col] < beaconB[params.sorting.col]) {
              return params.sorting.order === 'asc' ? -1 : 1
            }
            if (beaconA[params.sorting.col] > beaconB[params.sorting.col]) {
              return params.sorting.order === 'asc' ? 1 : -1
            }
            return 0
          })
        this.tableData = this.tableData.slice(0, 0 + params.pagination.records)
        this.tableMeta.sorting.col = params.sorting.col
        this.tableMeta.sorting.order = params.sorting.order
        this.tableMeta.pagination.offset = 1
      },
      formatLastSeen(beacon) {
        return moment(beacon.lastSeen * 1000).format('DD.MM.YYYY');
      },
      getStatusClass(beacon) {
        let statusClass = 'badge-status-'
        switch (beacon.status) {
          case 'OK':
            statusClass += 'ok'
            break;
          case 'BATTERY_LOW':
            statusClass += 'battery'
            break;
          case 'CONFIGURATION_PENDING':
            statusClass += 'pending'
            break;
          case 'ISSUE':
            statusClass += 'issue'
            break;
          default:
            statusClass += 'default'
            break;
        }
        return statusClass;
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
      }
    },
    mounted() {
      this.fetchBeacons()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../variables';
  h1 {
    display: inline-block;
  }

  .add-fab {
    position: absolute;
    bottom: 0;
    right: 1em;
    transform: translateY(50%);
    border-radius: 50%;
    background-image: url("./../assets/ic_add_beacon.svg");
  }

  .beacon-display {
    position: relative;
  }

  .btn-delete {
    mask-image: url("./../assets/delete.svg");
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
    color: $text-grey;
  }

  .badge-status {
    color: white;
    display:block;
    height: 2em;
    line-height: 1rem;
    font-weight: normal;
    font-size: 0.66rem;

    &.badge-status-ok {
      background-color: $status-green;
    }

    &.badge-status-battery, .badge-status-issue {
      background-color: $status-yellow;
    }

    &.badge-status-pending {
      background-color: $status-blue;
    }
  }

  .battery {
    height: 1.5em;
    width: 0.75em;
    background: #EEEEEE;
    position:relative;

    &:before,
    &:after {
      z-index:10;
      content:'';
      display:block;
      position:absolute;
      background: white;
      width: 30%;
      height: 10%;
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
