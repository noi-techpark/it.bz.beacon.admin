<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="user-display m-4 p-4">
        <form @submit.prevent="update">
          <div class="form-group row">
            <label for="id" class="col-sm-2 col-form-label">Id</label>
            <div class="col-sm-10">
              <input type="text" disabled class="form-control" id="id" v-model="user.id" placeholder="Id">
            </div>
          </div>
          <div class="form-group row">
            <label for="username" class="col-sm-2 col-form-label">Username</label>
            <div class="col-sm-10">
              <input type="text" disabled class="form-control" id="username" v-model="user.username" placeholder="Username">
            </div>
          </div>
          <div class="form-group row">
            <label for="name" class="col-sm-2 col-form-label">Name</label>
            <div class="col-sm-10">
              <input type="text" required class="form-control" id="name" v-model="user.name" placeholder="Name">
            </div>
          </div>
          <div class="form-group row">
            <label for="surname" class="col-sm-2 col-form-label">Surname</label>
            <div class="col-sm-10">
              <input type="text" required class="form-control" id="surname" v-model="user.surname" placeholder="Surname">
            </div>
          </div>
          <div class="form-group row">
            <label for="email" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
              <input type="email" required class="form-control" id="email" v-model="user.email" placeholder="Email">
            </div>
          </div>
          <div class="form-group row">
            <label for="password" class="col-sm-2 col-form-label">Password</label>
            <div class="col-sm-10">
              <input type="password" class="form-control" id="password" v-model="user.password" placeholder="Password">
            </div>
          </div>
            <div class="row">
              <div class="col-12 ">
                <div class="d-flex flex-row-reverse">
                  <button class="btn btn-primary" type='submit'>Save user</button>
                  <router-link :to="{name: 'users'}" class="btn btn-secondary mr-3">Cancel</router-link>
                </div>
              </div>
            </div>
        </form>
      </div>
    </template>
  </layout>
</template>

<script>
import Layout from './Layout'
import router from '../router/index'
import { updateUser, getUser } from '../service/apiService'

export default {
  components: {
    Layout
  },
  name: 'User',
  data() {
    return {
      title: 'User',
      user: {
        id: '',
        name: '',
        surname: '',
        email: '',
        password: ''
      }
    }
  },
  mounted() {
    getUser(this.$route.params.id).then((user) => {
      Object.assign(this.user, user)
    })
  },
  methods: {
    update() {
      updateUser(this.user)
        .then(() => {
          router.push({ name: 'users' })
        })
        .catch(() => {
          //  handle error
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  div.form-group {
    margin-bottom: 1rem;
  }
</style>
