<template>
  <div id="users">
    <home>
      <template slot="header">
        <h1>{{ title }}</h1>
      </template>
      <template slot="body">
        <ul>
          <li>User1</li>
        </ul>
      </template>
    </home>
  </div>
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
<style scoped>

</style>
