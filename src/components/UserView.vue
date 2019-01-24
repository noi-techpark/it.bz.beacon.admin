<template>
  <!-- eslint-disable -->
  <home :source="title">
    <template slot="body">
      <div class="row user-display m-4 p-4">
        <div class="col-12 mb-4 mt-4 col-header">
          <div class="row mb-2">
            <div class="col-12">
              <h3>User details</h3>
            </div>
          </div>
          <div class="row">
            <div class="col-2">Id</div> <div class="col-10 ml-0 mb-2"><input type="text" disabled="disabled" class="form-control" v-model="getUser.id" placeholder="Name"></div>
          </div>
          <div class="row">
            <div class="col-2">Username</div><div class="col-10 ml-0 mb-2"><input type="text" disabled="disabled" class="form-control" v-model="getUser.username" placeholder="Name"></div>
          </div>
          <div class="row">
            <div class="col-2">Name</div> <div class="col-10 ml-0 mb-2"><input type="text" class="form-control" v-model="name" placeholder="Name"></div>
          </div>
          <div class="row">
            <div class="col-2">Surname</div> <div class="col-10 ml-0 mb-2"><input type="text" class="form-control" v-model="surname"  placeholder="Surname"></div>
          </div>
          <div class="row">
            <div class="col-2">Email</div> <div class="col-10 ml-0 mb-2"><input type="text" class="form-control" v-model="email" placeholder="Email"></div>
          </div>
          <div class="row">
            <div class="col-2">Password</div> <div class="col-10 ml-0 mb-2"><input type="password" class="form-control" v-model="password" placeholder="Password"></div>
          </div>
        </div>
        <div class="col-12 mb-4">
          <div class="row">
            <div class="col-12 ">
              <div class="d-flex flex-row-reverse">
                <button class="btn btn-primary" @click.prevent="editUser">Save</button>
                <router-link :to="{name: 'users'}" class="btn btn-secondary mr-3">Cancel</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </home>
</template>

<script>
import Home from './Home'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Home
  },
  name: 'User',
  data() {
    return {
      title: 'User',
      password: '',
      name: '',
      surname: '',
      email: ''
    }
  },
  computed: {
    ...mapGetters('users', [
      'getUsers'
    ]),
    getUser() {
      let userId = this.$route.params.id,
        returnUser = false
      this.getUsers.forEach(function(user) {
        if (parseInt(user.id) === parseInt(userId)) {
          returnUser = user
        }
      })
      return returnUser
    }
  },
  methods: {
    ...mapActions('users', {
      'editSomeUser': 'editUser'
    }),
    editUser() {
      debugger
      this.editSomeUser({
        name: this.name,
        password: this.password,
        surname: this.surname,
        email: this.email,
        id: this.$route.params.id
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
