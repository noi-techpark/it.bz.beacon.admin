<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container p-0" v-show="loaded">
        <div class="row user-display m-4 p-4">
          <div class="col-12 p-0">
            <form @submit.prevent="update">
              <div class="form-group row">
                <label for="username" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                  <input type="text" disabled class="form-control" id="username" v-model="user.username" placeholder="Username">
                </div>
              </div>
              <div class="form-group row">
                <label for="name" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                  <input type="text" :disabled="!canChange()" required class="form-control" id="name" v-model="user.name" placeholder="Name">
                </div>
              </div>
              <div class="form-group row">
                <label for="surname" class="col-sm-2 col-form-label">Surname</label>
                <div class="col-sm-10">
                  <input type="text" :disabled="!canChange()" required class="form-control" id="surname" v-model="user.surname" placeholder="Surname">
                </div>
              </div>
              <div class="form-group row">
                <label for="email" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                  <input type="email" :disabled="!canChange()" required class="form-control" id="email" v-model="user.email" placeholder="Email">
                </div>
              </div>
              <div class="form-group row">
                <label for="admin-basic-switch" class="col-sm-2 col-form-label">Admin</label>
                <div class="col-sm-10">
                  <div id="admin-switch" class="mdc-switch">
                    <div class="mdc-switch__track"></div>
                    <div class="mdc-switch__thumb-underlay">
                      <div class="mdc-switch__thumb">
                        <input type="checkbox" :disabled="!canChange()" v-model="user.admin" id="admin-basic-switch" class="mdc-switch__native-control" role="switch">
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="row">
                <div class="col-12 pl-0 pr-0">
                  <div class="alert alert-danger" role="alert" v-if="error">
                    Unable to change user. Please verify the data and retry.
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 ">
                  <div class="d-flex flex-row-reverse">
                    <router-link v-if="!canChange()" :to="{name: 'users'}" class="btn btn-secondary">Back</router-link>
                    <button v-if="canChange()" class="btn btn-primary" type='submit'>Save</button>
                    <router-link v-if="canChange()" :to="{name: 'users'}" class="btn btn-secondary mr-3">Cancel</router-link>
                    <router-link v-if="canChange() && isSelf()" :to="{name: 'user-change-password', params: {id: user.id}}" class="btn btn-dark mr-3">Change password</router-link>
                    <router-link v-if="canChange() && !isSelf() && isAdmin" :to="{name: 'user-reset-password', params: {id: user.id}}" class="btn btn-danger mr-3">Reset password</router-link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="row beacon-display m-4 p-4 position-relative" v-show="user.groups.length > 0">
          <div class="col-12 d-flex flex-column flex-grow-1 flex-shrink-0">
            <div class="row">
              <div class="col pl-0">
                <h5>Groups</h5>
              </div>
            </div>
            <div class="row">
              <div class="table-responsive mt-3 table-groups-role-wrapper d-flex flex-column">
                <table class="table table-groups-role">
                  <thead>
                  <tr class="col-header table-header pl-0 pr-0">
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr class="user-item" v-bind:key="groupRole.group.id" v-if="user.groups.length" v-for="groupRole in user.groups" @click.prevent.stop="showGroup(groupRole.group)">
                    <td class="align-middle">{{ groupRole.group.name }}</td>
                    <td class="align-middle">{{ groupRole.role }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <loader :visible="!loaded" :label="'Loading user data...'"/>
      <loader :visible="saving" :label="'Saving users...'"/>
    </template>
  </layout>
</template>

<script>
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import router from '../router/index'
import {MDCSwitch} from '@material/switch'
import { updateUser, getUser } from '../service/apiService'
import { mapGetters } from 'vuex'

export default {
  components: {
    Layout,
    Loader
  },
  name: 'User',
  data() {
    return {
      title: 'User',
      user: {
        id: '',
        name: '',
        surname: '',
        email: '',
        admin: false,
        groups: []
      },
      loaded: false,
      saving: false,
      error: false,
      controls: {
        adminSwitch: null
      },
    }
  },
  computed: {
    ...mapGetters('login', [
      'getUsername',
      'isAdmin'
    ])
  },
  mounted() {
    this.controls.adminSwitch = new MDCSwitch(document.querySelector('#admin-switch'));
    this.controls.adminSwitch.nativeControl_.addEventListener('change', (event) => {
      this.user.admin = event.target.checked
      this.controls.adminSwitch.checked = this.user.admin
    })
    getUser(this.$route.params.id).then((user) => {
      Object.assign(this.user, user)
      this.controls.adminSwitch.checked = this.user.admin
      this.controls.adminSwitch.disabled = !this.canChange() || this.isSelf()
      this.$set(this, 'loaded', true)
    })
  },
  methods: {
    update() {
      this.saving = true
      this.error = false
      updateUser(this.user)
        .then(() => {
          router.push({ name: 'users' })
          this.saving = false
        })
        .catch(() => {
          this.saving = false
          this.error = true
        })
    },
    canChange() {
      return this.isAdmin || this.isSelf()
    },
    isSelf() {
      return this.getUsername === this.user.username
    },
    showGroup(group) {
      router.push({ name: 'group-edit', params: { id: group.id }})
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

  .table-header {
    background-color: $background-grey;
    color: $grey;
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 0.8rem;
  }

  .table-groups-role-wrapper {
    position: relative;
    min-height: 180px;

    .table-groups-role {

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
