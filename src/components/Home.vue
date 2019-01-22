<template>
  <div id="home" class="row h-100">
    <navigation></navigation>
    <div class="body col-sm p-0">
      <div class="row">
        <div class="col search-bar"></div>
        <div class="col user-login"></div>
      </div>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation'

export default {
  components: {
    Navigation
  },
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
