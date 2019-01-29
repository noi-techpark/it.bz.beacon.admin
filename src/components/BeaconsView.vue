<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="search-input">
      <div class="col p-0 h-100 text-right search-container">
        <img class="search-icon" :src="require('../assets/search.png')">
        <input type="text" class="beacon-search" placeholder="Search for beacon">
      </div>
    </template>
    <template slot="body">
      <div class="row headline p-4">
        <div class="col">
          <h1>Beacons</h1>
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
  name: 'BeaconsView',
  data() {
    return {
      title: 'Beacons'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
