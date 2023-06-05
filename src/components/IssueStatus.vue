<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="p-0 d-flex align-items-start" ><span :class='"badge badge-pill badge-status " + statusClass'>{{ statusText }}</span></div>
</template>

<script>
  export default {
    props: {
      resolved: {
        type: Boolean,
        default: false
      },
      styleBig: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      statusClass() {
        let statusClass = 'badge-status-' + (this.resolved? 'closed': 'open')
        if(this.styleBig)
          statusClass += ' big'
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
    line-height: 1rem;
    font-weight: normal;
    font-size: 0.66rem;

    &.badge-status-open {
      background-color: $status-green;
    }

    &.badge-status-closed {
      background-color: $status-red;
    }

    &.big {
      font-size: 1rem;
      padding: 0.5rem 1rem;
    }
  }
</style>
