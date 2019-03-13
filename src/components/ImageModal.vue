<template>
  <!-- eslint-disable -->
  <modal ref="confirmModal" v-if="visible" @close="close" :small="false">
    <div slot="header" class="image-header">Beacon location image</div>
    <div slot="body">
      <div class="image-wrapper d-flex justify-content-center">
        <img class="image" :src="imageSrc"/>
      </div>
    </div>
    <div slot="footer" class="image-modal-actions">
      <button class="btn btn-outline-secondary" @click.prevent="close(false)">
        Close
      </button>
    </div>
  </modal>
</template>

<script>
import Modal from './Modal'

export default {
  components: {
    Modal
  },
  data() {
    return {
      visible: false,
      promise: null,
      imageSrc: ''
    }
  },
  methods: {
    open(imageSrc) {
      this.visible = true
      this.imageSrc = imageSrc
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

<style lang="scss" scoped>

  @import '../variables';

  .image-wrapper {

    width: 100%;
    min-height: 400px;
    max-height: 600px;
    position: relative;

    img.image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .image-header {
    font-size: 1.5rem;
    color: $background-blue;
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

</style>
