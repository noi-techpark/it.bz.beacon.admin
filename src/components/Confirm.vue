<template>
  <!-- eslint-disable -->
  <modal ref="confirmModal" v-if="visible" @close="close" :small="true">
    <h3 slot="header">{{ titleText }}</h3>
    <div slot="body"><slot></slot></div>
    <div slot="footer" class="w-100">
      <div class="form-row">
        <div class="col-12">
          <div class="d-flex flex-row-reverse">
            <button class="btn btn-danger" @click="close(true)">{{ confirmText }}</button>
            <button class="btn btn-secondary mr-3" @click="close(false)">{{ cancelText }}</button>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
import Modal from './Modal'

export default {
  components: {
    Modal
  },
  props: {
    titleText: {
      type: String,
      default() {
        return 'common.modal.defaultTitle'
      }
    },
    confirmText: {
      type: String,
      default() {
        return 'common.modal.defaultConfirmButton'
      }
    },
    cancelText: {
      type: String,
      default() {
        return 'common.modal.defaultCancelButton'
      }
    }
  },
  data() {
    return {
      visible: false,
      promise: null
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
    }
  }
}
</script>
