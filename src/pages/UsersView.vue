<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="search-input">
      <div class="col p-0 text-right search-container">
        <img class="search-icon" :src="require('../assets/ic_search.svg')">
        <input type="text" class="beacon-search" v-model="search" placeholder="Search user">
      </div>
    </template>
    <template slot="body">
      <div class="container mt-6 p-0" v-show="loaded">
        <div class="row beacon-display m-4 p-4 position-relative">
          <div class="col-12 p-0">
            <simple-table responsive @change="reloadTableData" :cols="tableCols" :data="tableData" :meta="tableMeta" @rowClicked="showDetail" @rowDeleteClicked="removeUser" />
          </div>
          <router-link class="fab add-fab" :to="{name: 'user-new'}" v-if="isAdmin"><i class="fab-icon-adduser"></i></router-link>
          <confirm ref="deleteUserConfirm" titleText="Delete user" confirmText="Delete" cancelText="Cancel">
            Are you sure to you want to delete the user?<br />
            This cannot be undone.
          </confirm>
        </div>
      </div>
      <loader :visible="!loaded" :label="'Loading users...'"/>
    </template>
  </layout>
</template>

<script>
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import SimpleTable from '../components/SimpleTable'
import { deleteUser } from '../service/apiService'
import Confirm from '../components/Confirm'
import { mapActions, mapGetters } from 'vuex'
import merge from 'lodash/merge'
import router from '../router/index'

export default {
  components: {
    Layout,
    SimpleTable,
    Confirm,
    Loader
  },
  name: 'Users',
  data() {
    let data = {
      title: 'Users',
      tableCols: [
        {
          title: 'Username',
          key: 'username'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Surname',
          key: 'surname'
        },
        {
          title: 'Email',
          key: 'email'
        }
      ],
      tableData: [],
      tableMeta: {
        sorting: {
          col: 'name',
          order: 'asc'
        },
        pagination: {
          offset: 0,
          page: 1,
          records: 10,
          recordsNumberList: [2, 5, 10, 20]
        }
      },
      search: '',
      loaded: false
    }

    if (this.$store.getters['login/isAdmin']) {
      data.tableCols.push({
        title: '',
        key: 'id',
        type: 'delete-button',
        identifier: 'username'
      })
    }

    return data
  },
  computed: {
    ...mapGetters('users', [
      'users'
    ]),
    ...mapGetters('login', [
      'isAdmin'
    ])
  },
  watch: {
    search() {
      this.reloadTableData()
    },
    users() {
      this.reloadTableData()
    }
  },
  methods: {
    ...mapActions('users', [
      'fetchUsers',
      'clear'
    ]),
    showDetail(user) {
      router.push({ name: 'user-edit', params: { id: user.id }})
    },
    reloadTableData(params = {}) {
      params = merge({
        pagination: this.tableMeta.pagination,
        sorting: this.tableMeta.sorting,
        filters: this.filters
      }, params, {
        filters: this.filters
      })

      if (this.users === null) {
        this.tableData = []
      } else {
        this.tableData = this.users.slice(0).filter((user) => {
          return typeof user !== 'undefined'
        }).filter((user) => {
          return user.name.toLowerCase().includes(this.search.toLowerCase())
            || user.username.toLowerCase().includes(this.search.toLowerCase())
        })
      }
      this.tableData.sort((userA, userB) => {
        if (userA[params.sorting.col] < userB[params.sorting.col]) {
          return params.sorting.order === 'asc' ? -1 : 1
        }
        if (userA[params.sorting.col] > userB[params.sorting.col]) {
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

      this.$set(this, 'loaded', true)
    },
    removeUser(user) {
      this.$refs.deleteUserConfirm.open()
        .then(() => {
          deleteUser(user)
            .then(() => {
              this.fetchUsers()
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../variables';
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
    background-image: url("../assets/ic_add_user.svg");
  }

  .user-display {
    position: relative;
  }

  .table-header {
    background-color: $background-grey;
    color: $grey;
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 0.8rem;
  }
</style>
