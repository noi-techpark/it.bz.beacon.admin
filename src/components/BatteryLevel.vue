<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="text-right d-flex align-middle justify-content-end p-0">
    <span class="battery-label">{{ (unknown ? "?" : level) }} %</span>
    <div class="battery ml-2" :class="(level <= 5 ? 'warning' : '') + ' ' + (unknown ? 'unknown' : '')">
      <div class="chargestatus" :style="'top:' + (100 - level) + '%;height:' + level + '%'"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      level: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        unknown: false
      }
    },
    watch: {
      level() {
        this.unknown = this.level == null
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../variables";

  .battery {
    height: 1.5em;
    width: 0.75em;
    background: $lighter-grey;
    position:relative;

    &:before,
    &:after {
      z-index:10;
      content:'';
      display:block;
      position:absolute;
      background: white;
      width: 0.2em;
      height: 0.15em;
      top:0;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
    .chargestatus {
      position:absolute;
      top: 0;
      left:0;
      right:0;
      background: grey;
    }

    &.warning {
      background: lighten($status-yellow, 35%);
      .chargestatus {
        background: lighten($status-yellow, 25%);
      }
    }

    &.danger {
      background: darkred;
      .chargestatus {
        background: red;

      }
    }

    &.unknown {
      background: $lighter-grey;
      .chargestatus {
        background: transparent;
      }
    }
  }

  .battery-label {
    white-space:nowrap;
  }

  .chargestatus {
    position:absolute;
    top: 0;
    left:0;
    right:0;
    background: grey;
  }
</style>
