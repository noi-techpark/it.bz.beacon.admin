<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container p-0" v-show="loaded">
        <div class="row group-display m-4 p-4">
          <div class="col-12 p-0">
            <form @submit.prevent="update">
              <div class="form-group row">
                <label for="name" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                  <input type="text" :disabled="!isAdmin" required class="form-control" id="name" v-model="group.name" placeholder="Name">
                </div>
              </div>
              <div class="form-group row">
                <label for="kontakt_io_api_key" class="col-sm-2 pl-0 col-form-label">kontakt.io API Key</label>
                <div class="col-sm-10">
                  <input type="text" :disabled="!isAdmin" required class="form-control" id="kontakt_io_api_key" v-model="group.kontaktIoApiKey" placeholder="kontakt.io API Key">
                </div>
              </div>
              <div class="row">
                <div class="col-12 pl-0 pr-0">
                  <div class="alert alert-danger" role="alert" v-if="error">
                    Unable to change group. Please verify the data and retry.
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 ">
                  <div class="d-flex flex-row-reverse">
                    <router-link v-if="!isAdmin" :to="{name: 'groups'}" class="btn btn-secondary">Back</router-link>
                    <button v-if="isAdmin" class="btn btn-primary" type='submit'>Save</button>
                    <router-link v-if="isAdmin" :to="{name: 'groups'}" class="btn btn-secondary mr-3">Cancel</router-link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>


      <div class="container mt-6 p-0" v-show="usersLoaded">
        <div class="row beacon-display m-4 p-4 position-relative">
          <div class="col-12 d-flex flex-column flex-grow-1 flex-shrink-0">
            <div class="row">
              <div class="col-3 pl-0">
                <h5>Assigned users</h5>
              </div>
              <div class="col-9 pr-0">
                <assign-user-to-group-form v-if="isAdmin || isManager()" ref="assignUserToGroupForm" :groupId="$route.params.id" />
              </div>
            </div>

            <div class="row">
              <div class="col-12 p-0 mt-4" v-show="tableData.length > 0">
                <simple-table responsive @change="reloadTableData" :cols="tableCols" :data="tableData" :meta="tableMeta"
                              @rowClicked="showUserDetail" @rowDeleteClicked="removeUserRole" @rowChangeClicked="changeUserRole" />
              </div>
              <div class="col-12 p-0 mt-4 text-center" v-show="tableData.length <= 0">
                <span class="text-muted">No users assigned to this group...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <loader :visible="!loaded" :label="'Loading group data...'"/>
      <loader :visible="saving" :label="'Saving groups...'"/>
      <loader :visible="loaded && !usersLoaded" :label="'Loading assigned users...'"/>
      <change-user-role-modal ref="changeUserRoleModal" :groupId="$route.params.id" :userRole="userRole"/>
      <confirm ref="removeUserFromGroupConfirm" titleText="Delete group" confirmText="Delete" cancelText="Cancel">
        Are you sure to you want to remove the user <b>{{ userRole.user.username }}</b> from the group?<br />
        This cannot be undone.
      </confirm>
    </template>
  </layout>
</template>

<script>
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import router from '../router/index'
import { updateGroup, getGroup, removeUserFromGroup } from '../service/apiService'
import { mapActions, mapGetters } from 'vuex'
import Confirm from '../components/Confirm'
import AssignUserToGroupForm from '../components/AssignUserToGroupForm'
import ChangeUserRoleModal from "../components/ChangeUserRoleModal"
import merge from 'lodash/merge'
import SimpleTable from '../components/SimpleTable'


export default {
  components: {
    ChangeUserRoleModal,
    Layout,
    Confirm,
    Loader,
    AssignUserToGroupForm,
    SimpleTable
  },
  name: 'Group',
  data() {
    let data = {
      title: 'Group',
      group: {
        id: '',
        name: '',
        kontaktIoApiKey: ''
      },
      userRole: {
        user: ''
      },
      tableCols: [
        {
          title: 'Username',
          key: 'user.username'
        },
        {
          title: 'Name',
          key: 'user.name'
        },
        {
          title: 'Surname',
          key: 'user.surname'
        },
        {
          title: 'Email',
          key: 'user.email'
        },
        {
          title: 'Role',
          key: 'role'
        }
      ],
      tableData: [],
      tableMeta: {
        sorting: {
          col: 'user.username',
          order: 'asc'
        },
        pagination: {
          offset: 0,
          page: 1,
          records: 10,
          recordsNumberList: [2, 5, 10, 20]
        }
      },
      users: [],
      loaded: false,
      usersLoaded: false,
      saving: false,
      error: false
    }

    return data
  },
  computed: {
    ...mapGetters('login', [
      'getUsername',
      'isAdmin',
      'groupsRole'
    ]),
    ...mapGetters('groups', [
      'usersForGroup'
    ])
  },
  watch: {
    search() {
      this.reloadTableData()
    },
    usersForGroup() {
      this.reloadTableData()
    }
  },
  mounted() {
    getGroup(this.$route.params.id).then((group) => {
      Object.assign(this.group, group)
      this.$set(this, 'loaded', true)
    }),
    this.fetchUsersForGroup(this.$route.params.id)
  },
  methods: {
    update() {
      this.saving = true
      this.error = false
      updateGroup(this.group)
        .then(() => {
          router.push({ name: 'groups' })
          this.saving = false
        })
        .catch(() => {
          this.saving = false
          this.error = true
        })
    },
    isManager() {
      return this.groupsRole.some((groupRole => groupRole.group.id === this.group.id && groupRole.role == 'MANAGER'))
    },

    ...mapActions('groups', [
      'fetchUsersForGroup',
      'clear'
    ]),
    ...mapActions('login', [
      'isAdmin',
      'groupsRole'
    ]),
    showUserDetail(user) {
      router.push({ name: 'user-edit', params: { id: user.user.id }})
    },
    reloadTableData(params = {}) {
      if (this.isAdmin || this.isManager()) {
        if(!this.tableCols.some((tableCol => tableCol.type === 'modify-buttons'))) {
          this.tableCols.push({
            title: '',
            key: 'id',
            type: 'modify-buttons',
            name: 'role'
          })
        }
      } else {
        if(this.tableCols.some((tableCol => tableCol.type === 'modify-buttons'))) {
          this.tableCols = this.tableCols.filter(((tableCol) => tableCol.type !== 'modify-buttons'))
        }
      }

      params = merge({
        pagination: this.tableMeta.pagination,
        sorting: this.tableMeta.sorting,
        filters: this.filters
      }, params, {
        filters: this.filters
      })

      if (this.usersForGroup === null) {
        this.tableData = []
      } else {
        this.tableData = this.usersForGroup.slice(0).filter((userForGroup) => {
          return typeof userForGroup !== 'undefined'
        })
      }
      this.tableData.sort((groupA, groupB) => {
        let valA = groupA
        let valB = groupB
        let sortingCols = params.sorting.col.split('.')
        for(let i = 0; i < sortingCols.length; i++) {
          valA = valA[sortingCols[i]]
          valB = valB[sortingCols[i]]
        }

        if (valA < valB) {
          return params.sorting.order === 'asc' ? -1 : 1
        }
        if (valA > valB) {
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

      this.$set(this, 'usersLoaded', true)
    },
    changeUserRole(userRole) {
      this.userRole = userRole
      this.$refs.changeUserRoleModal.open()
        .then(() => {
          this.fetchUsersForGroup(this.$route.params.id);
        })
        .catch(() => {})
    },
    removeUserRole(userRole) {
      this.userRole = userRole
      this.$refs.removeUserFromGroupConfirm.open()
        .then(() => {
          removeUserFromGroup(this.$route.params.id, userRole.user)
            .then(() => {
              this.fetchUsersForGroup(this.$route.params.id);
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../variables';
  div.form-group {
    margin-bottom: 1rem;
  }

  input {
    font-size: 1em;
  }

  .btn {
    font-size: 1em;
  }

  h1 {
    display: inline-block;
  }

  .group-display {
    position: relative;
  }

  .table-header {
    background-color: $background-grey;
    color: $grey;
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 0.8rem;
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

    &.btn-add-user {
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

  .btn-edit {
    mask-image: url("./../assets/ic_edit.svg");
    background-color: $text-grey;

    height: 24px;
    width: 24px;

    &:hover {
      background-color: red;
    }
  }

  .table-users-wrapper {
    position: relative;
    min-height: 180px;

    .table-users {

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

      .user-item {

        td {
          border-bottom: 1px solid $background-grey;
          font-size: 0.8rem;
          color: $text-grey;
        }

      }
    }
  }
</style>
