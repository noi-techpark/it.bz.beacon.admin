<template>
  <home :source="title">
    <template slot="body">
      <div class="row h-100">
        <div class="col">
          <h1>Users</h1>
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
  name: 'Users',
  data() {
    return {
      title: 'Users'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
