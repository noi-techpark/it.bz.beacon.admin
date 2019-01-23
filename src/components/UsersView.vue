<template>
  <home :source="title">
    <template slot="body">
      <div class="row">
        <div class="col">
          <h1>Users</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-12" v-bind:key="user.id" v-if="getUsers.length" v-for="user in getUsers">
          <div class="row">
            <div class="col">{{ user.id }}</div>
            <div class="col">{{ user.username }}</div>
            <div class="col">{{ user.name }}</div>
            <div class="col">{{ user.surname }}</div>
            <div class="col">{{ user.email }}</div>
          </div>
        </div>
        <div class="col-12 alert-danger" v-else> {{ getError }} </div>
      </div>
    </template>
  </home>
</template>

<script>
import Home from './Home'
import { mapGetters } from 'vuex'

export default {
  components: {
    Home
  },
  name: 'Users',
  data() {
    return {
      title: 'Users'
    }
  },
  computed: {
    ...mapGetters('users', [
      'getUsers',
      'getError'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
