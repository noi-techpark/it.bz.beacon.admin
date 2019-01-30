<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="search-input">
      <div class="col p-0 h-100 text-right search-container">
        <img class="search-icon" :src="require('../assets/search.png')">
        <input type="text" class="beacon-search" v-model="search" placeholder="Search for beacon">
      </div>
    </template>
    <template slot="body">
      <div class="row beacon-display m-4 p-4 pb-5">
        <div class="col-12 col-header table-header">
          <div class="row">
            <div class="col-6">Name</div>
            <div class="col-3">Major</div>
            <div class="col-3">Minor</div>
          </div>
        </div>
        <router-link class="col-12 beacon-item" v-bind:key="beacon.id" v-if="beacons.length" v-for="beacon in listBeacons" :to="{name: 'beacon-edit', params: { id: beacon.id }}">
          <span class="row">
            <span class="col-6">{{ beacon.name }}</span>
            <span class="col-3">{{ beacon.major }}</span>
            <span class="col-3">{{ beacon.minor }}</span>
          </span>
        </router-link>
        <div class="col-12 alert alert-danger" v-else> {{ getError }} </div>
        <router-link class="fab add-fab" :to="{name: 'beacon-new'}"><i class="fab-icon-addbeacon"></i></router-link>
      </div>

      <!--<simple-table responsive @change="reloadTableData" :cols="tableCols" :data="tableData" :meta="tableMeta" />-->
    </template>
  </layout>
</template>

<script>
  import Layout from './Layout'
  import SimpleTable from './SimpleTable'
  import { deleteBeacon } from '../service/apiService'
  import Confirm from './Confirm'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    components: {
      Layout,
      SimpleTable,
      Confirm
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
          return beacon.name.includes(this.search)
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
      removeBeacon(beacon) {
        this.$refs.deleteBeaconConfirm.open()
          .then(() => deleteBeacon(beacon.id)
            .then(() => {
              this.fetchBeacons()
            }))
          .catch(() => {})
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
    background-image: url("./../assets/ic_add_issue.svg");
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
  }
</style>
