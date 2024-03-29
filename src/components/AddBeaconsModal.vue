<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- eslint-disable -->
  <modal ref="confirmModal" v-if="visible" @close="close" :medium="true">
    <div v-scrollable="false" class="modal-body flex-grow-1 flex-shrink-1 d-flex flex-column p-0" slot="modal">
      <form @submit.prevent="resolve">
        <div class="issue-header pt-3 pb-3 pr-4 pl-4">
          <div class="row">
            <div class="col-12 p-0">Add new beacons</div>
            <button type="button" class="btn btn-close" @click="close(false)"><img src="../assets/ic_close.svg"/></button>
          </div>
        </div>
        <div class="issue-solution-body pt-3 pb-3 pr-4 pl-4">
          <div class="row mt-4">
            <div class="col-12 p-0 pl-2">
              <input type="text" class="form-control form-issue-solution-control" v-model="orderId" placeholder="Insert your order ID"/>
              <small class="form-issue-solution-label">Order ID</small>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12 p-0 pl-2">
              <select class="form-control form-select-group-control" id="role" v-model="groupId" :required="!isAdmin">
                <option disabled value="">Select group</option>
                <option v-bind:key="group.id" v-if="isAdmin || isManager(group)"
                        v-for="group in groups" :value="group.id">{{ group.name }}</option>
              </select>
              <small class="form-issue-solution-label">Group</small>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12 pl-0 pr-0">
              <div class="alert alert-danger" role="alert" v-if="error">
                Unable to process the given order ID.
              </div>
            </div>
            <div class="col-12 p-0 d-flex justify-content-end mt-2">
              <button type="submit" class="btn btn-issue-resolve pl-5 pr-5">Add beacons</button>
            </div>
          </div>
        </div>
      </form>
      <loader :visible="addingBeacons" :label="'Adding beacons...'"/>
    </div>
  </modal>
</template>

<script>
import Modal from './Modal'
import { Scrollable } from '../directive/Scrollable'
import { createBeaconsByOrder } from '../service/apiService'
import { mapActions, mapGetters } from 'vuex'
import Loader from '../components/Loader'

export default {
  components: {
    Modal,
    Loader
  },
  directives: {
    Scrollable
  },
  computed: {
    ...mapGetters('groups', [
      'groups'
    ]),
    ...mapGetters('login', [
      'getUsername',
      'isAdmin',
      'groupsRole'
    ]),
  },
  watch: {
    orderId() {
      this.order.id = this.orderId
    },
    groupId() {
      this.order.groupId = this.groupId
    }
  },
  data() {
    return {
      visible: false,
      promise: null,
      orderId: '',
      groupId: '',
      order: {
        id: null,
        groupId: null
      },
      error: false,
      addingBeacons: false
    }
  },
  methods: {
    ...mapActions('groups', [
      'fetchGroups',
      'clear'
    ]),
    isManager(group) {
      return this.groupsRole.some((groupRole => groupRole.group.id === group.id && groupRole.role == 'MANAGER'))
    },
    open() {
      this.groupId = ''
      this.orderId = ''
      this.visible = true
      this.error = false
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
      this.addingBeacons = true
      this.error = false
      createBeaconsByOrder(this.order)
        .then(() => {
          this.close(true)
          this.$set(this, 'addingBeacons', false)
        })
        .catch(() => {
          this.$set(this, 'error', true)
          this.$set(this, 'addingBeacons', false)
        })
    }
  },
  mounted() {
    this.fetchGroups()
  }
}
</script>

<style lang="scss" scoped>

  @import '../variables';

  .issue-header {
    font-size: 1.25rem;
    color: white;
    background: $background-blue;
  }

  .issue-solution-body {
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

  .form-issue-control {
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

  .form-issue-solution-control {
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

  textarea.form-issue-solution-control {
    resize: none;
    height: 6em;
    border: 1px solid $grey;

    &:focus {
      border: 1px solid $light-blue;
    }
  }

  .form-issue-label {
    opacity: 0.5;
    font-size: 0.8rem;
  }

  .form-issue-solution-label {
    opacity: 0.5;
    font-size: 0.8rem;

    &.form-issue-solution-label-readonly {
      opacity: 0.3;
    }
  }

  .btn {

    &.btn-issue-resolve {
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

  select.form-select-group-control {
    height: calc(1.5em + 0.75rem + 2px);
    line-height: 1.5;
  }

</style>
