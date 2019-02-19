<template>
  <!-- eslint-disable -->
  <transition name="modal">
    <div class="modal-mask fixed-top h-100">
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="modal-container d-flex flex-column" :class="{'modal-small': small, 'full-height': fullHeight}">
          <div class="modal-header d-flex align-items-center flex-shrink-0 flex-grow-0">
            <slot name="header" />
            <a href @click.prevent="close()" class="icon-link icon-link-right close-link">
            </a>
          </div>
          <div v-scrollable="false" class="modal-body flex-grow-1 flex-shrink-1 d-flex flex-column">
            <slot name="body" />
          </div>
          <div class="modal-footer flex-shrink-0 flex-grow-0">
            <slot name="footer">
              <button class="btn btn-outline-primary" @click.prevent="close()" ref="focusElement">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Scrollable } from '../directive/Scrollable'
import { freezeScrollable } from '../service/scrollable'

export default {
  components: {
  },
  directives: {
    Scrollable
  },
  props: {
    small: {
      type: Boolean,
      default: false
    },
    fullHeight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prevfocusedElement: null
    }
  },
  mounted() {
    window.addEventListener('keyup', this.closeModalOnEsc)
    freezeScrollable(true)
    this.prevfocusedElement = document.activeElement
    if (this.$refs.focusElement) {
      this.$refs.focusElement.focus()
    }
  },
  destroyed() {
    if (this.prevfocusedElement) {
      this.prevfocusedElement.focus()
    }
    window.removeEventListener('keyup', this.closeModalOnEsc)
    freezeScrollable(false)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    closeModalOnEsc(e) {
      if (e.keyCode === 27) {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~bootstrap/scss/functions';
  @import '~bootstrap/scss/variables';
  @import '~bootstrap/scss/mixins';

  .modal-mask {
    z-index: 9000;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
    transform:translateZ(1px);
  }

  .modal-container {
    position: fixed;
    z-index: 9001;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    -webkit-transform: translateZ(0px);
    -webkit-transform: translate3d(0,0,0);
    /*-webkit-perspective: 1000;*/

    background-color: #fff;
    border-radius: 0.5em;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: opacity .2s ease, transform .2s ease;
    font-family: Helvetica, Arial, sans-serif;

    &.modal-small {
      @media only screen and (min-width: 300px) {
        position: static;
        width: 300px;
        height: auto;
      }
    }

    @include media-breakpoint-up(md) {
      width: calc(100% - 60px);
      max-height: calc(100% - 60px);
      margin: 30px;
    }

    @include media-breakpoint-up(lg) {
      position: static;
      width: 800px;
      height: auto;
      margin-right: 0;
      margin-left: 0;
    }

    &.full-height {
      height: 100%;

      @include media-breakpoint-up(md) {
        height: calc(100% - 60px);
        margin-top: 30px;
        margin-bottom: 30px;
      }
    }

    .modal-header {
      h2 {
        margin-bottom: 0
      }
    }
  }

  /*
   * transition="modal"
   */
  .modal {
    &-enter,
    &-leave-active {
      opacity: 0;
    }
    &-enter .modal-container,
    &-leave-active .modal-container {
      transform: translateY(100vh);

      &.small {
        @media only screen and (min-width: 300px) {
          transform: scale(1.1);
        }
      }
      @include media-breakpoint-up(lg) {
        transform: scale(1.1);
      }
    }
  }
</style>
