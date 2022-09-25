<template>
  <div class="col-12 p-0"><span :class='"badge badge-pill badge-status " + statusClass'>{{ statusText }}</span></div>
</template>

<script>
  export default {
    props: {
      resolved: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      console.log(this.resolved)
    },
    computed: {
      statusClass() {
        let statusClass = 'badge-status-' + (this.resolved? 'closed': 'open')
        return statusClass;
      },
      statusText() {
        if (this.resolved)
          return 'CLOSED';
        return 'OPEN';
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../variables";

  .badge-status {
    color: white;
    display:block;
    height: 2em;
    line-height: 1rem;
    font-weight: normal;
    font-size: 0.66rem;

    &.badge-status-open {
      background-color: $status-green;
    }

    &.badge-status-closed {
      background-color: $status-red;
    }
  }
</style>
