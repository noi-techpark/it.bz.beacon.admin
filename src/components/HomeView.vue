<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="row headline p-4">
        <div class="col">
          <h1>Home</h1>
        </div>
      </div>
    </template>
  </layout>
</template>

<script>
import Layout from './Layout'

export default {
  components: {
    Layout
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
