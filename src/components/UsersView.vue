<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="search-input">
      <div class="col p-0 h-100 text-right search-container">
        <img class="search-icon" :src="require('../assets/search.png')">
        <input type="text" class="beacon-search" v-model="search" placeholder="Search for user">
      </div>
    </template>
    <template slot="body">
      <div class="row user-display m-4 p-4 pb-5">
        <div class="col-12 col-header table-header">
          <div class="row">
            <div class="col-1">Id</div>
            <div class="col-2">Username</div>
            <div class="col-2">Firstname</div>
            <div class="col-2">Surname</div>
            <div class="col-4">Email</div>
            <div class="col-1"></div>
          </div>
        </div>
        <router-link class="col-12 user-item" v-bind:key="user.id" v-if="users.length" v-for="user in listUsers" :to="{name: 'user-edit', params: { id: user.id }}">
          <span class="row">
            <span class="col-1">{{ user.id }}</span>
            <span class="col-2">{{ user.username }}</span>
            <span class="col-2">{{ user.name }}</span>
            <span class="col-2">{{ user.surname }}</span>
            <span class="col-4">{{ user.email }}</span>
            <span class="col-1 d-flex justify-content-end"><button type="button" class="btn btn-delete" title="Delete user" @click.prevent.stop="removeUser(user)"></button></span>
          </span>
        </router-link>
        <div class="col-12 alert alert-danger" v-else> {{ getError }} </div>
        <router-link class="fab add-fab" :to="{name: 'user-new'}"><i class="fab-icon-adduser"></i></router-link>
      </div>
      <confirm ref="deleteUserConfirm" titleText="Delete user" confirmText="Delete" cancelText="Cancel">
        Are you sure to you want to delete the user?<br />
        This cannot be undone.
      </confirm>

      <!--<simple-table responsive @change="reloadTableData" :cols="tableCols" :data="tableData" :meta="tableMeta" />-->
    </template>
  </layout>
</template>

<script>
import Layout from './Layout'
import SimpleTable from './SimpleTable'
import { deleteUser } from '../service/apiService'
import Confirm from './Confirm'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Layout,
    SimpleTable,
    Confirm
  },
  name: 'Users',
  data() {
    return {
      title: 'Users',
      tableCols: [
        {
          title: 'Id',
          key: 'id'
        },
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
          records: 1
        }
      },
      search: ''
    }
  },
  computed: {
    ...mapGetters('users', [
      'users'
    ]),
    listUsers() {
      let users = this.users.slice(0).filter((user) => {
        return user.username.includes(this.search)
          || user.name.includes(this.search)
          || user.surname.includes(this.search)
          || user.email.includes(this.search)
      })
      users.sort((userA, userB) => {
        if (userA.username < userB.username) {
          return -1
        }
        if (userA.username > userB.username) {
          return 1
        }
        return 0
      })

      return users
    }
  },
  methods: {
    ...mapActions('users', [
      'fetchUsers',
      'clear'
    ]),
    reloadTableData(params) {
      this.tableData = this.users.slice(0)
      this.tableData
        .filter((user) => {
          return typeof user !== 'undefined'
        })
      this.tableMeta.totalRecords = this.tableData.length
      this.tableData
        .sort((userA, userB) => {
          if (userA[params.sorting.col] < userB[params.sorting.col]) {
            return params.sorting.order === 'asc' ? -1 : 1
          }
          if (userA[params.sorting.col] > userB[params.sorting.col]) {
            return params.sorting.order === 'asc' ? 1 : -1
          }
          return 0
        })
      this.tableData = this.tableData.slice(0, 0 + params.pagination.records)
      this.tableMeta.sorting.col = params.sorting.col
      this.tableMeta.sorting.order = params.sorting.order
      this.tableMeta.pagination.offset = 1
    },
    removeUser(user) {
      this.$refs.deleteUserConfirm.open()
        .then(() => deleteUser(user.id)
          .then(() => {
            this.fetchUsers()
          }))
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
  h1 {
    display: inline-block;
  }

  .add-fab {
    position: absolute;
    bottom: 0;
    right: 1em;
    transform: translateY(50%);
    border-radius: 50%;
    background-image: url("./../assets/ic_add_user.svg");
  }

  .user-display {
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
