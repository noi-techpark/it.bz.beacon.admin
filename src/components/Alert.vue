<template>
  <!-- eslint-disable -->
  <modal v-show="visible" @close="close" :small="true">
    <h3 slot="header">{{ alertTitle }}</h3>
    <div slot="body">{{ alertMessage }}</div>
    <div slot="footer" class="w-100">
      <div class="form-row" v-show="hideable">
        <div id="dont-show-again-field" class="mdc-form-field">
          <div id="dont-show-again-checkbox" class="mdc-checkbox">
            <input type="checkbox"
                   class="mdc-checkbox__native-control"
                   id="checkbox-1"/>
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark"
                   viewBox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
          <label for="checkbox-1">Don't show again</label>
        </div>
      </div>
      <div class="form-row">
        <div class="col-12">
          <div class="d-flex flex-row-reverse">
            <button class="btn btn-danger" @click="close(true)">OK</button>
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

export default {
  components: {
    Modal
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
      promise: null,
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
  mounted() {
    this.dontShowAgainCheckbox = new MDCCheckbox(document.querySelector('#dont-show-again-checkbox'));
    this.dontShowAgainFormField = new MDCFormField(document.querySelector('#dont-show-again-field'));
    this.dontShowAgainFormField.input = this.dontShowAgainCheckbox;
  },
  methods: {
    init() {
      this.dontShowAgainCheckbox.checked = false
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
