<template>
  <!-- eslint-disable -->
  <home :source="title">
    <template slot="body">
      <div class="row headline p-4">
        <div class="col">
          <h1>Home</h1>
        </div>
      </div>
    </template>
  </home>
</template>

<script>
import Home from './Home'

export default {
  components: {
    Home
  },
  name: 'HomeView',
  data() {
    return {
      title: 'Home'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
