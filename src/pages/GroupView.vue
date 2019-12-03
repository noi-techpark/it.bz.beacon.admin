<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container p-0" v-show="loaded">
        <div class="row group-display m-4 p-4">
          <div class="col-12 p-0">
            <form @submit.prevent="update">
              <div class="form-group row">
                <label for="id" class="col-sm-2 col-form-label">Id</label>
                <div class="col-sm-10">
                  <input type="text" disabled class="form-control" id="id" v-model="group.id" placeholder="Id">
                </div>
              </div>
              <div class="form-group row">
                <label for="name" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                  <input type="text" :disabled="!isAdmin" required class="form-control" id="name" v-model="group.name" placeholder="Name">
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
                <assign-user-to-group-form ref="assignUserToGroupForm" :groupId="group.id"/>
              </div>
            </div>

            <div class="row">
              <div class="table-responsive mt-3 table-users-wrapper d-flex flex-column">
                <div :class="usersForGroup.length <= 0 ? 'no-users flex-grow-1 d-flex justify-content-center align-content-center text-center flex-column' : ''" v-show="users.length <= 0">
                  <small class="text-muted">No users are assigned to this group.</small>
                </div>
                <table class="table table-users" v-show="usersForGroup.length > 0">
                  <thead>
                  <tr class="col-header table-header pl-0 pr-0">
                    <th scope="col">Id</th>
                    <th scope="col">Username</th>
                    <th scope="col">Name</th>
                    <th scope="col">Surname</th>
                    <th scope="col">Role</th>
                    <th v-if="isAdmin || isManager()" scope="col"></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr class="user-item" v-bind:key="user.user.id" v-if="usersForGroup.length" v-for="user in usersForGroup" @click.prevent.stop="showUserDetail(user.user)">
                    <td class="align-middle" scope="row">{{ user.user.id }}</td>
                    <td class="align-middle">{{ user.user.username }}</td>
                    <td class="align-middle">{{ user.user.name }}</td>
                    <td class="align-middle">{{ user.user.surname }}</td>
                    <td class="align-middle">{{ user.role }}</td>
                    <th v-if="isAdmin || isManager()" scope="align-middle">
                      <button type="button" title="Change role" class="btn btn-edit" @click.prevent.stop="changeUserRole(user)"></button>
                      <button type="button" title="Delete user" class="btn btn-delete" @click.prevent.stop="removeUserRole(user)"></button>
                    </th>
                  </tr>
                  <tr class="user-item" v-bind:key="user.user.id" v-if="usersForGroup.length" v-for="user in usersForGroup" @click.prevent.stop="showUserDetail(user.user)">
                    <td class="align-middle" scope="row">{{ user.user.id }}</td>
                    <td class="align-middle">{{ user.user.username }}</td>
                    <td class="align-middle">{{ user.user.name }}</td>
                    <td class="align-middle">{{ user.user.surname }}</td>
                    <td class="align-middle">{{ user.role }}</td>
                    <th v-if="isAdmin || isManager()" scope="align-middle">
                      <button type="button" title="Change role" class="btn btn-edit" @click.prevent.stop="changeUserRole(user)"></button>
                      <button type="button" title="Delete user" class="btn btn-delete" @click.prevent.stop="removeUserRole(user)"></button>
                    </th>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <loader :visible="!loaded" :label="'Loading group data...'"/>
      <loader :visible="saving" :label="'Saving groups...'"/>
      <loader :visible="loaded && !usersLoaded" :label="'Loading assigned users...'"/>
      <change-user-role-modal ref="changeUserRoleModal" :groupId="group.id" :userRole="userRole"/>
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
import ChangeUserRoleModal from "../components/ChangeUserRoleModal";


export default {
  components: {
    ChangeUserRoleModal,
    Layout,
    Confirm,
    Loader,
    AssignUserToGroupForm
  },
  name: 'Group',
  data() {
    return {
      title: 'Group',
      group: {
        id: '',
        name: ''
      },
      userRole: {
        user: ''
      },
      users: [],
      loaded: false,
      usersLoaded: false,
      saving: false,
      error: false
    }
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
      this.$set(this, 'usersLoaded', true)
    }
  },
  mounted() {
    getGroup(this.$route.params.id).then((group) => {
      Object.assign(this.group, group)
      this.$set(this, 'loaded', true)
    }),
    this.fetchUsersForGroup(this.$route.params.id);
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
      router.push({ name: 'user-edit', params: { id: user.id }})
    },
    assignNewUser() {
      this.$refs.assignUserModal.open()
        .then(() => {
          this.fetchUsersForGroup(this.$route.params.id);
        })
        .catch(() => {})
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
