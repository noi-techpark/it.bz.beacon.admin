<template>
  <!-- eslint-disable -->
  <home :source="title">
    <template slot="body">
      <div class="row headline p-4">
        <div class="col">
          <h1 class="m-0">Users</h1>
          <router-link class="ml-4 mb-3 btn btn-primary" :to="{name: 'add-user'}">add</router-link>
          <router-link class="ml-4 mb-3 btn btn-primary fab" :to="{name: 'add-user'}">add</router-link>
        </div>
      </div>
      <div class="row user-display m-4 p-4">
        <div class="col-12 mb-4 col-header">
          <div class="row">
            <div class="col-1">Id</div>
            <div class="col-2">Username</div>
            <div class="col-2">Firstname</div>
            <div class="col-2">Surname</div>
            <div class="col-5">Email</div>
          </div>
        </div>
        <router-link class="col-12 user-item pt-2 pb-2" v-bind:key="user.id" v-if="getUsers.length"
                     v-for="user in getUsers" :to="{name: 'user', params: { id: user.id }}">
          <span class="row">
            <span class="col-1">{{ user.id }}</span>
            <span class="col-2">{{ user.username }}</span>
            <span class="col-2">{{ user.name }}</span>
            <span class="col-2">{{ user.surname }}</span>
            <span class="col-5">{{ user.email }}</span>
          </span>
        </router-link>
        <div class="col-12 alert alert-danger" v-else> {{ getError }} </div>
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
h1 {
  display: inline-block;
}
</style>
