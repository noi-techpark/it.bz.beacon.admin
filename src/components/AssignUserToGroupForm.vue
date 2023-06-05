<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- eslint-disable -->
    <div class="flex-grow-1 flex-shrink-1 d-flex flex-column p-0" slot="modal">
      <form ref="form" v-on:submit="resolve">
        <div class="row">
            <div class="col-5 p-0">
              <div class="form-group row">
                  <label for="username" class="pl-0 col-form-label form-assign-user-label">Username</label>
                  <div class="col flex-grow-1 pr-0">
                    <div>

                      <div class="dropdown">
                        <input autocomplete="off" type="text" class="form-control form-assign-user-control" id="username" required="required"
                               v-model="searchUserField" placeholder="Username"
                               @focus="usernameFocused = true"
                               @blur="usernameFocused = false"
                               v-on:keydown.up.prevent="changeActiveUsername(-1)" v-on:keydown.down.prevent="changeActiveUsername(1)"
                               v-on:keydown.enter.prevent="selectActiveUser()">
                        <div v-if="(usernameFocused || dropdownHover) && searchedUsers.length > 0 && !userSelected"
                             class="dropdown-menu" aria-labelledby="dropdownMenuButton"
                             @mouseover="dropdownHover = true" @mouseleave="dropdownHover = false">
                          <a class="dropdown-item" v-bind:key="user.id" v-on:click.stop.prevent="selectUser(user)"
                             v-for="(user, userIndex) in searchedUsers"
                             v-bind:class="{ active: userIndex == activeUsername}">
                            {{ user.username }}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <div class="col-4 p-0">
              <div class="form-group row">
                <label for="role" class="pl-4 col-form-label form-assign-user-label">Role</label>
                <div class="col flex-grow-1 pr-0">
                  <select class="form-control form-assign-user-control" id="role" required="required"
                          v-model="userRole">
                    <option disabled value="">Select role</option>
                    <option>MANAGER</option>
                    <option>BEACON_EDITOR</option>
                    <option>BEACON_VIEWER</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-3 p-0 d-flex justify-content-end">
              <button type="submit" class="flex-grow-1 btn btn-assign-user-resolve ml-4" :disabled="!userSelected || userRole === ''">Assign user</button>
            </div>
        </div>
        <div class="row mt-4" v-if="error">
            <div class="col-12 pl-0 pr-0">
              <div class="alert alert-danger" role="alert">
                Unable to assign the given username to the group.
              </div>
            </div>
          </div>
      </form>
    </div>
</template>

<script>
import { assignUserToGroup, getUsers } from '../service/apiService'
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('login', [
      'getUsername'
    ]),
    ...mapGetters('users', [
      'users'
    ]),
    ...mapGetters('groups', [
      'usersForGroup'
    ])
  },
  props: {
    groupId: String
  },
  data() {
    return {
      userRole: '',
      searchUserField: '',
      error: false,
      userSelected: false,
      usernameFocused: false,
      activeUsername: 0,
      dropdownHover: false,
      searchedUsers: []
    }
  },
  watch: {
    users() {
      this.setupDropDown()
    },
    usersForGroup() {
      this.setupDropDown()
    },
    searchUserField() {
      this.setupDropDown()
      this.userSelected = this.searchedUsers !== null && this.searchedUsers.some((user) => user.username === this.searchUserField)
    }
  },
  methods: {
    ...mapActions('groups', [
      'fetchUsersForGroup',
      'clear'
    ]),
    ...mapActions('users', [
      'fetchUsers',
      'clear'
    ]),
    resolve() {
      this.error = false
      getUsers()
        .then((users) => {
          let mUser = users.find((user => user.username === this.searchUserField))
          assignUserToGroup(this.groupId, mUser, {
            username: this.searchUserField,
            role: this.userRole
          })
            .then(() => {
              this.fetchUsersForGroup(this.groupId);
              Object.assign(this.$data, this.$options.data.call(this));
              this.$refs.form.reset();
            })
            .catch(() => {
              this.$set(this, 'error', true)
            })
        })
        .catch(() => {
          this.$set(this, 'error', true)
        })
    },
    setupDropDown() {
      this.activeUsername = null
      if (this.users === null || this.usersForGroup === null || this.searchUserField === null || this.searchUserField === '') {
        this.searchedUsers = []
      } else {

        this.searchedUsers = this.users.slice(0).filter((user) => {
          return typeof user !== 'undefined'
        }).filter((user) => {
          return user.username.toLowerCase().includes(this.searchUserField.toLowerCase())
        }).filter((user) => {
          return !user.admin && !this.usersForGroup.some((userForGroup => userForGroup.user.id === user.id))
        })
      }
    },
    changeActiveUsername(change) {
      if(this.searchedUsers.length > 0) {
        if (this.activeUsername === null) {
          this.activeUsername = change === 1? 0: this.searchedUsers.length - 1
        } else {
          if(change === 1)
            if(this.activeUsername + 1 < this.searchedUsers.length)
              this.activeUsername += 1
            else
              this.activeUsername = 0
          if(change === -1)
            if(this.activeUsername > 0)
              this.activeUsername -= 1
            else
              this.activeUsername = this.searchedUsers.length - 1
        }
      }
    },
    selectActiveUser() {
      if(this.activeUsername !== null)
        this.selectUser(this.searchedUsers[this.activeUsername])
    },
    selectUser(user) {
      this.searchUserField = user.username
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script>

<style lang="scss" scoped>

  @import '../variables';

  select.form-assign-user-control {
    height: calc(1.5em + 0.75rem + 2px);
    font-size: 0.8rem;
    line-height: 1.5;
  }

  .assign-user-control {
    border: 1px solid $dark-blue;
    font-size: 0.8rem;
    color: $text-grey;

    &[readonly] {
      color: white;
      background: transparent;
    }

    &:focus {
      outline: 0;
      box-shadow: none;
      border: 1px solid $dark-blue;
      color: white;

      &:not([readonly]) {
        color: $text-grey;
        border: 1px solid $light-blue;
      }
    }
  }

  .dropdown-item.active {
    background-color: $light-blue;
  }

  .dropdown-item:active {
    background-color: $light-blue;
  }

  .form-assign-user-control {
    font-size: 0.8rem;
  }

  .form-assign-user-label {
    font-size: 0.8rem

  }

  .btn {

    &.btn-assign-user-resolve {
      color: white;
      background: $light-blue;
      border: 1px solid $light-blue;

      &:hover {
        background: $lighter-blue;
      }

      &:focus {
        outline: 0;
        box-shadow: none;
      }
    }
  }

  .alert-danger {
    font-size: 0.8rem;
  }

  .dropdown-menu {
    display: block;
  }

</style>
