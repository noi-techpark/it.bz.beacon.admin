<template>
  <div class="loader" v-if="visible">
    <div class="spinner">
    </div>
    <small class="text-muted">{{ label }}</small>
  </div>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../variables";

  .loader {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;

    background: rgba(255, 255, 255, 0.41);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @keyframes spinner {
      to {
        transform: rotate(360deg);
      }
    }

    .spinner {
      content: '';
      box-sizing: border-box;
      width: 30px;
      height: 30px;
      margin: 0.5em;
      border-radius: 50%;
      border: 1px solid $lighter-grey;
      border-top-color: $status-blue;
      animation: spinner .6s linear infinite;
    }
  }
</style>
