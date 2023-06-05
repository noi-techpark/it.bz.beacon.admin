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
            <div class="col-12 p-0">Issue</div>
            <button type="button" class="btn btn-close" @click="close(false)"><img src="../assets/ic_close.svg"/></button>
          </div>
          <div class="row mt-4">
            <div class="col-12 p-0">
              <input type="text" class="form-control form-issue-control" :value="issue.problem" readonly/>
              <small class="form-issue-label">Problem</small>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-6 p-0 pr-2">
              <input type="text" class="form-control form-issue-control" :value="issue.reportDate | formatDate" readonly/>
              <small class="form-issue-label form-issue-label-readonly">Report date</small>
            </div>
            <div class="col-6 p-0 pl-2">
              <input type="text" class="form-control form-issue-control" :value="issue.reporter" readonly/>
              <small class="form-issue-label form-issue-label-readonly">Reporter</small>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12 p-0">
              <textarea class="form-control form-issue-control" :value="issue.problemDescription" readonly></textarea>
              <small class="form-issue-solution-label">Problem description</small>
            </div>
          </div>
        </div>
        <div class="issue-solution-body pt-3 pb-3 pr-4 pl-4">
          <div class="row mt-2">
            <div class="col-12 p-0">
              <input type="text" class="form-control form-issue-solution-control" :value="issue.solution" readonly />
              <small class="form-issue-label">Solution</small>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-6 p-0 pr-2">
              <input type="text" class="form-control form-issue-solution-control" :value="issue.resolveDate | formatDate" readonly/>
              <small class="form-issue-solution-label form-issue-solution-label-readonly">Resolve date</small>
            </div>
            <div class="col-6 p-0 pl-2">
              <input type="text" class="form-control form-issue-solution-control" :value="issue.resolver" readonly/>
              <small class="form-issue-solution-label form-issue-solution-label-readonly">Resolver</small>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12 p-0">
              <textarea class="form-control form-issue-solution-control" :value="issue.solutionDescription" readonly></textarea>
              <small class="form-issue-solution-label">Solution description</small>
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

export default {
  components: {
    Modal
  },
  directives: {
    Scrollable
  },
  data() {
    return {
      visible: false,
      promise: null,
      issue: {
        problem: '',
        problemDescription: '',
        reportDate: '',
        reporter: '',
        solution: '',
        solutionDescription: '',
        resolver: ''
      },
      error: false
    }
  },
  methods: {
    open(issue) {
      this.visible = true
      this.issue = issue
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
    }
  },
  filters: {
    formatDate: (dateString) => {
      let date = moment(dateString)
      if (!date.isValid()) {
        return ''
      }

      return date.format('DD.MM.YYYY')
    }
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

  textarea.form-issue-control {
    resize: none;
    height: 6em;
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
