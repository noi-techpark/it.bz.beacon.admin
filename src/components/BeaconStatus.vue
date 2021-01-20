<template>
  <div class="col-12 p-0"><span :class='"badge badge-pill badge-status " + statusClass'>{{ statusText }}</span></div>
</template>

<script>
  export default {
    props: {
      status: {
        type: String,
        default: 'OK'
      }
    },
    computed: {
      statusClass() {
        let statusClass = 'badge-status-'
        switch (this.status) {
          case 'OK':
            statusClass += 'ok'
            break;
          case 'BATTERY_LOW':
            statusClass += 'battery'
            break;
          case 'CONFIGURATION_PENDING':
            statusClass += 'pending'
            break;
          case 'ISSUE':
            statusClass += 'issue'
            break;
          case 'NO_SIGNAL':
            statusClass += 'nosignal'
            break;
          case 'NOT_ACCESSIBLE':
            statusClass += 'notaccessibile'
            break;
          default:
            statusClass += 'default'
            break;
        }
        return statusClass;
      },
      statusText() {
        switch (this.status) {
          case 'OK':
            return 'OK';
          case 'ISSUE':
          case 'BATTERY_LOW':
            return 'ISSUE';
          case 'CONFIGURATION_PENDING':
            return 'PENDING';
          case 'NO_SIGNAL':
            return 'NO SIGNAL';
          case 'NOT_ACCESSIBLE':
            return 'NOT ACCESSIBLE';
          default:
            return this.status;
        }
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

    &.badge-status-ok {
      background-color: $status-green;
    }

    &.badge-status-battery, &.badge-status-issue {
      background-color: $status-yellow;
    }

    &.badge-status-pending {
      background-color: $status-blue;
    }

    &.badge-status-nosignal {
      background-color: $status-red;
    }

    &.badge-status-notaccessibile {
      background-color: $status-purple;
    }
  }
</style>
