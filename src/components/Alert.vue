<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <modal ref="confirmModal" v-if="visible" @close="close" :medium="true" :close-able-with-esc="false">
    <div v-scrollable="false" class="modal-body flex-grow-1 flex-shrink-1 d-flex flex-column p-0" slot="modal">
      <div class="alert-modal-header pt-3 pb-3 pr-4 pl-4">
        <div class="row">
          <div class="col-12 p-0">{{ alertTitle }}</div>
        </div>
      </div>
      <div class="alert-modal-solution-body pt-3 pb-3 pr-4 pl-4">
        <div class="row mt-2">
          <div class="col-12 p-0 pl-0 alert-modal-text">
            {{ alertMessage }}
          </div>
        </div>
        <div class="row mt-3 form-row">
          <div class="col-6 pl-0" v-show="hideable">
            <div id="dont-show-again-field" class="mdc-form-field">
              <div id="dont-show-again-checkbox" class="mdc-checkbox">
                <input type="checkbox" class="mdc-checkbox__native-control" id="checkbox-1"/>
                <div class="mdc-checkbox__background">
                  <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                    <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
                  </svg>
                  <div class="mdc-checkbox__mixedmark"></div>
                </div>
              </div>
              <label for="checkbox-1" class="mb-0"><small class="text-muted">Don't show again</small></label>
            </div>
          </div>
          <div class="col-6 pr-0">
            <div class="d-flex justify-content-end">
              <button class="btn btn-alert-modal-resolve pl-5 pr-5" @click="close(true)">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import {MDCFormField} from '@material/form-field'
import {MDCCheckbox} from '@material/checkbox'
import Modal from './Modal'
import { Scrollable } from '../directive/Scrollable'

export default {
  components: {
    Modal
  },
  directives: {
    Scrollable
  },
  props: {
    alertTitle: {
      type: String,
      default: 'Alert'
    },
    alertMessage: {
      type: String,
      default: ''
    },
    hideable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      promise: {
        resolve: null,
        reject: null
      },
      dontShowAgainCheckbox: null,
      dontShowAgainFormField: null
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.dontShowAgainCheckbox = new MDCCheckbox(document.querySelector('#dont-show-again-checkbox'));
        this.dontShowAgainFormField = new MDCFormField(document.querySelector('#dont-show-again-field'));
        this.dontShowAgainFormField.input = this.dontShowAgainCheckbox;
        this.dontShowAgainCheckbox.checked = false
      })
    },
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
          this.promise.resolve(this.dontShowAgainCheckbox.checked)
        } else {
          this.promise.reject()
        }
      }
      this.promise = null
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '../variables';

  .alert-modal-header {
    font-size: 1.25rem;
    color: white;
    background: $background-blue;
  }

  .alert-modal-text {
    font-size: 0.8rem;
  }

  .alert-modal-solution-body {
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

  .form-alert-modal-control {
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

  .form-alert-modal-solution-control {
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

  textarea.form-alert-modal-solution-control {
    resize: none;
    height: 6em;
    border: 1px solid $grey;

    &:focus {
      border: 1px solid $light-blue;
    }
  }

  .form-alert-modal-label {
    opacity: 0.5;
    font-size: 0.8rem;
  }

  .form-alert-modal-solution-label {
    opacity: 0.5;
    font-size: 0.8rem;

    &.form-alert-modal-solution-label-readonly {
      opacity: 0.3;
    }
  }

  .btn {

    &.btn-alert-modal-resolve {
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

  .mdc-checkbox__checkmark {
    color: white;
  }

</style>
