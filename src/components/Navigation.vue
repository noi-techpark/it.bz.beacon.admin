<template>
  <div id="navigation">
    <nav>
      <ul>
        <li><router-link class="link" :to="{name: 'users'}">Users</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      msg: 'Login'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
