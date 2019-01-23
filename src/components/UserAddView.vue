<template>
  <!-- eslint-disable -->
  <home :source="title">
    <template slot="body">
      <div class="row headline p-4">
        <div class="col">
          <router-link :to="{name: 'users'}" class="back-link">&laquo; back</router-link>
        </div>
      </div>
      <div class="row user-display m-4 p-4">
        <div class="col-12 alert alert-danger" v-if="getError"> {{ getError }} </div>
        <div class="col-12 mb-4 p-0 col-header">
          <div class="row">
            <div class="col-12 pl-0 pr-0 pb-2"><input type="text" class="form-control" v-model="username" placeholder="Username"></div>
            <div class="col-12 pl-0 pr-0 pb-2"><input type="text" class="form-control" v-model="name" placeholder="Name"></div>
            <div class="col-12 pl-0 pr-0 pb-2"><input type="text" class="form-control" v-model="surname" placeholder="Surname"></div>
            <div class="col-12 pl-0 pr-0 pb-2"><input type="text" class="form-control" v-model="email" placeholder="Email"></div>
            <div class="col-12 pl-0 pr-0 pb-2"><input type="password" class="form-control" v-model="password" placeholder="Password"></div>
          </div>
        </div>
        <a class="btn btn-primary" @click.prevent="addUser">Add</a>
      </div>
    </template>
  </home>
</template>

<script>
import Home from './Home'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Home
  },
  name: 'AddUser',
  data() {
    return {
      title: 'AddUser',
      username: '',
      password: '',
      name: '',
      surname: '',
      email: ''
    }
  },
  methods: {
    ...mapActions('users', {
      'addNewUser': 'addUser'
    }),
    addUser() {
      this.addNewUser({
        password: this.password,
        name: this.name,
        username: this.username,
        surname: this.surname,
        email: this.email
      })
    }
  },
  computed: {
    ...mapGetters('users', [
      'getError'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
