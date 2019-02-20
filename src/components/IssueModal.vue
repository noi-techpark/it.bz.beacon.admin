<template>
  <!-- eslint-disable -->
  <modal ref="confirmModal" v-if="visible" @close="close" :medium="true">
    <div v-scrollable="false" class="modal-body flex-grow-1 flex-shrink-1 d-flex flex-column p-0" slot="modal">
      <form @submit.prevent="resolve">
        <div class="issue-header pt-3 pb-3 pr-4 pl-4">
          <div class="row">
            <div class="col-12 p-0">New Issue</div>
            <button type="button" class="btn btn-close" @click="close(false)"><img src="../assets/ic_close.svg"/></button>
          </div>
          <div class="row mt-4">
            <div class="col-12 p-0">
              <input type="text" class="form-control form-issue-control" v-model="issueCreation.problem" placeholder="Insert the problem" required="required"/>
              <small class="form-issue-label">Problem</small>
            </div>
          </div>
        </div>
        <div class="issue-solution-body pt-3 pb-3 pr-4 pl-4">
          <div class="row mt-4">
            <div class="col-6 p-0 pr-2">
              <input type="text" class="form-control form-issue-solution-control" :value="reportDate" readonly/>
              <small class="form-issue-solution-label form-issue-solution-label-readonly">Report date</small>
            </div>
            <div class="col-6 p-0 pl-2">
              <input type="text" class="form-control form-issue-solution-control" v-model="issueCreation.reporter" readonly/>
              <small class="form-issue-solution-label form-issue-solution-label-readonly">Reporter</small>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-12 p-0">
              <textarea class="form-control form-issue-solution-control" v-model="issueCreation.problemDescription" placeholder="Insert a short description of the problem"></textarea>
              <small class="form-issue-solution-label">Problem description</small>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12 pl-0 pr-0">
              <div class="alert alert-danger" role="alert" v-if="error">
                Unable to create new issue.
              </div>
            </div>
            <div class="col-12 p-0 d-flex justify-content-end mt-2">
              <button type="submit" class="btn btn-issue-resolve pl-5 pr-5">Create Issue</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </modal>
</template>

<script>
import Modal from './Modal'
import moment from 'moment'
import { Scrollable } from '../directive/Scrollable'
import { createIssue } from '../service/apiService'
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
    beaconId: {
      type: Number
    }
  },
  watch: {
    beaconId() {
      this.issueCreation.beaconId = this.beaconId
    }
  },
  data() {
    return {
      visible: false,
      promise: null,
      issueCreation: {
        beaconId: 0,
        problem: '',
        problemDescription: '',
        reporter: ''
      },
      reportDate: '',
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
      createIssue(this.issueCreation)
        .then(() => {
          this.close(true)
        })
        .catch(() => {
          this.$set(this, 'error', true)
        })
    }
  },
  mounted() {
    this.issueCreation.beaconId = this.beaconId
    this.issueCreation.reporter = this.getUsername
    this.reportDate = moment().format('DD.MM.YYYY')
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

</style>
