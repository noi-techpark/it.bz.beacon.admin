<template>
  <!-- eslint-disable -->
    <div class="flex-grow-1 flex-shrink-1 d-flex flex-column p-0" slot="modal">
      <form ref="form" v-on:submit="resolve">
        <div class="row">
            <div class="col-5 p-0">
              <div class="form-group row">
                  <label for="username" class="pl-0 col-form-label form-assign-user-label">Username</label>
                  <div class="col flex-grow-1 pr-0">
                    <input type="text" class="form-control form-assign-user-control" id="username" required="required"
                           v-model="userRole.username" placeholder="Username">
                  </div>
                </div>
              </div>
            <div class="col-4 p-0">
              <div class="form-group row">
                <label for="role" class="pl-4 col-form-label form-assign-user-label">Role</label>
                <div class="col flex-grow-1 pr-0">
                  <select class="form-control form-assign-user-control" id="role" required="required"
                          v-model="userRole.role">
                    <option disabled value="">Select role</option>
                    <option>MANAGER</option>
                    <option>BEACON_EDITOR</option>
                    <option>BEACON_VIEWER</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-3 p-0 d-flex justify-content-end">
              <button type="submit" class="flex-grow-1 btn btn-assign-user-resolve ml-4">Assign user</button>
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
    ])
  },
  props: {
    groupId: {
      type: Number
    }
  },
  data() {
    return {
      userRole: {
        username: '',
        role: ''
      },
      error: false
    }
  },
  methods: {
    ...mapActions('groups', [
      'fetchUsersForGroup',
      'clear'
    ]),
    resolve() {
      this.error = false
      getUsers()
        .then((users) => {
          let mUser = users.find((user => user.username === this.userRole.username))
          assignUserToGroup(this.groupId, mUser, this.userRole)
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
    validate: function () {
      this.$validator.validateAll();
    },
    reset() {
    }
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

</style>
