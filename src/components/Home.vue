<template>
  <div id="home" class="h-100">
    <div>
      <slot name="header"></slot>
    </div>
    <div>
      <navigation></navigation>
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
  name: 'Home',
  data() {
    return {
      msg: 'Home'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
