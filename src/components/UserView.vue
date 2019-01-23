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
        <div class="col-12 mb-4 col-header" v-show="editMode === false">
          <div class="row">
            <div class="col-1">Id</div>
            <div class="col-2">Username</div>
            <div class="col-2">Firstname</div>
            <div class="col-2">Surname</div>
            <div class="col-5">Email</div>
          </div>
        </div>
        <div class="col-12 mb-4 col-header" v-show="getUser && editMode === false">
          <div class="row">
            <div class="col-1">{{ getUser.id }}</div>
            <div class="col-2">{{ getUser.username }}</div>
            <div class="col-2">{{ getUser.name }}</div>
            <div class="col-2">{{ getUser.lastname }}</div>
            <div class="col-5">{{ getUser.email }}</div>
          </div>
        </div>
        <div class="col-12 mb-4 p-0 col-header" v-show="editMode">
          <div class="row">
            <div class="col-12 pl-0 pr-0 pb-2"><input type="password" class="form-control" v-model="password" placeholder="Password"></div>
            <div class="col-12 pl-0 pr-0 pb-2"><input type="text" class="form-control" v-model="name" placeholder="Name"></div>
            <div class="col-12 pl-0 pr-0 pb-2"><input type="text" class="form-control" v-model="surname" placeholder="Surname"></div>
            <div class="col-12 pl-0 pr-0 pb-2"><input type="text" class="form-control" v-model="email" placeholder="Email"></div>
          </div>
        </div>
        <a class="btn btn-primary mr-3" v-show="editMode" @click.prevent="switchMode">Cancel</a>
        <a class="btn btn-primary" v-show="editMode" @click.prevent="editUser">Save</a>
        <a class="btn btn-primary" v-show="editMode === false" @click.prevent="switchMode">Edit</a>
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
      editMode: false,
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
    switchMode() {
      this.editMode = !this.editMode
    },
    editUser() {
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
