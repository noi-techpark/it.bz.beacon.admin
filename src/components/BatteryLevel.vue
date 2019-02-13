<template>
  <div class="text-right d-flex align-middle justify-content-end p-0">
    <span>{{ level }} %</span>
    <div :class="'battery ml-2 ' + (level <= 5 ? 'warning' : '')">
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
  }

  .chargestatus {
    position:absolute;
    top: 0;
    left:0;
    right:0;
    background: grey;
  }
</style>
