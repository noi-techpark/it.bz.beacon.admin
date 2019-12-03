<template>
  <!-- eslint-disable -->
  <modal ref="confirmModal" v-if="visible" @close="close" :medium="true">
    <div v-scrollable="false" class="modal-body flex-grow-1 flex-shrink-1 d-flex flex-column p-0" slot="modal">
      <form @submit.prevent="resolve">
        <div class="assign-user-header pt-3 pb-3 pr-4 pl-4">
          <div class="row">
            <div class="col-12 p-0">Change user role</div>
            <button type="button" class="btn btn-close" @click="close(false)"><img src="../assets/ic_close.svg"/></button>
          </div>
        </div>
        <div class="assign-user-body pt-3 pb-3 pr-4 pl-4">
          <div class="row mt-4">
            <div class="col-12 p-0">
              <div class="form-group row">
                  <label for="username" class="col-sm-2 pl-0 col-form-label form-assign-user-label">Username</label>
                  <div class="col-sm-10 pr-0">
                    <input type="text" disabled required class="form-control form-assign-user-control" id="username" v-model="userRole.user.username">
                  </div>
                </div>
              </div>
          </div>
          <div class="row mt-4">
            <div class="col-12 p-0">
              <div class="form-group row">
                  <label for="name" class="col-sm-2 pl-0 col-form-label form-assign-user-label">Name</label>
                  <div class="col-sm-10 pr-0">
                    <input type="text" disabled required class="form-control form-assign-user-control" id="name" v-model="userRole.user.name">
                  </div>
                </div>
              </div>
          </div>
          <div class="row mt-4">
            <div class="col-12 p-0">
              <div class="form-group row">
                  <label for="surname" class="col-sm-2 pl-0 col-form-label form-assign-user-label">Surname</label>
                  <div class="col-sm-10 pr-0">
                    <input type="text" disabled required class="form-control form-assign-user-control" id="surname" v-model="userRole.user.surname">
                  </div>
                </div>
              </div>
          </div>
          <div class="row mt-4">
            <div class="col-12 p-0">
              <div class="form-group row">
                <label for="role" class="col-sm-2 pl-0 col-form-label form-assign-user-label">Role</label>
                <div class="col-sm-10 pr-0">
                  <select class="form-control form-assign-user-control" id="role" v-model="newUserRole" required>
                    <option disabled value="">Select role</option>
                    <option>MANAGER</option>
                    <option>BEACON_EDITOR</option>
                    <option>BEACON_VIEWER</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-2 mt-4">
            <div class="col-12 pl-0 pr-0">
              <div class="alert alert-danger" role="alert" v-if="error">
                Unable to change the role of this user given username to this group.
              </div>
            </div>
            <div class="col-12 p-0 d-flex justify-content-end mt-2">
              <button type="submit" class="btn btn-assign-user-resolve pl-5 pr-5">Change role</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </modal>
</template>

<script>
import Modal from './Modal'
import { Scrollable } from '../directive/Scrollable'
import { changeUserRoleInGroup } from '../service/apiService'
import { mapGetters } from 'vuex'

export default {
  components: {
    Modal
  },
  directives: {
    Scrollable
  },
  computed: {
    ...mapGetters('login', [
      'getUsername'
    ])
  },
  props: {
    userRole: Object,
    groupId: Number
  },
  watch: {
    userRole() {
      this.newUserRole = this.userRole.role
    }
  },
  data() {
    return {
      visible: false,
      promise: null,
      newUserRole: '',
      order: {
        id: null
      },
      error: false
    }
  },
  methods: {
    open() {
      this.visible = true
      return new Promise((resolve, reject) => {
        this.promise = {
          resolve: resolve,
          reject: reject
        }
      })
    },
    close(resolved) {
      this.visible = false
      if (this.promise) {
        if (resolved) {
          this.promise.resolve()
        } else {
          this.promise.reject()
        }
      }
      this.promise = null
    },
    resolve() {
      this.error = false
      changeUserRoleInGroup(this.groupId, this.userRole.user, this.newUserRole)
        .then(() => {
          this.close(true)
        })
        .catch(() => {
          this.$set(this, 'error', true)
        })
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '../variables';

  .assign-user-header {
    font-size: 1.25rem;
    color: white;
    background: $background-blue;
  }

  .assign-user-body {
    font-size: 1.25rem;
    color: $text-grey;
    background: white;
  }

  .image-modal-actions {
    .btn {
      padding: 0.1em 0.5em;
      font-size: 0.9em;

      &.btn-outline-secondary {
        border-color: $grey;

        &:hover {
          background: $grey;
        }
      }
    }
  }

  select.form-assign-user-control {
    height: calc(1.5em + 0.75rem + 2px);
    font-size: 1rem;
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

  .assign-user-control {
    color: $text-grey;
    border: 1px solid $grey;
    font-size: 0.8rem;

    &[readonly] {
      opacity: 0.3;
    }

    &:focus {
      outline: 0;
      box-shadow: none;
      border: 1px solid $grey;
    }

    &::placeholder {
      opacity: 0.5;
    }
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

  .btn-close {
    color: white;
    position: absolute;
    top: 0.5rem;
    right: 0;

    &:focus {
      outline: 0;
      box-shadow: none;
    }
  }

</style>
