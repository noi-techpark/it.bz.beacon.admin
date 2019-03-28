<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container p-0" v-show="!saving">
        <div class="row user-display m-4 p-4">
          <div class="col-12 p-0">
            <form @submit.prevent="create">
              <div class="form-group row">
                <label for="username" class="col-sm-2 pl-0 col-form-label">Username</label>
                <div class="col-sm-10 pr-0">
                  <input type="text" required class="form-control" id="username" v-model="user.username" placeholder="Username">
                </div>
              </div>
              <div class="form-group row">
                <label for="name" class="col-sm-2 pl-0 col-form-label">Name</label>
                <div class="col-sm-10 pr-0">
                  <input type="text" required class="form-control" id="name" v-model="user.name" placeholder="Name">
                </div>
              </div>
              <div class="form-group row">
                <label for="surname" class="col-sm-2 pl-0 col-form-label">Surname</label>
                <div class="col-sm-10 pr-0">
                  <input type="text" required class="form-control" id="surname" v-model="user.surname" placeholder="Surname">
                </div>
              </div>
              <div class="form-group row">
                <label for="email" class="col-sm-2 pl-0 col-form-label">Email</label>
                <div class="col-sm-10 pr-0">
                  <input type="email" required class="form-control" id="email" v-model="user.email" placeholder="Email">
                </div>
              </div>
              <div class="form-group row">
                <label for="password"  class="col-sm-2 pl-0 col-form-label">Password</label>
                <div class="col-sm-10 pr-0">
                  <input type="password" required class="form-control" id="password" v-model="user.password" placeholder="Password">
                </div>
              </div>
              <div class="form-group row">
                <label for="password"  class="col-sm-2 pl-0 col-form-label">Password confirmation</label>
                <div class="col-sm-10 pr-0">
                  <input type="password" required class="form-control" id="passwordVerification" v-model="passwordConfirm" placeholder="Password confirmation">
                </div>
              </div>
              <div class="row">
                <div class="col-12 pl-0 pr-0">
                  <div class="alert alert-danger" role="alert" v-if="error">
                    Unable to create new user. Please verify that the username does not already exist.
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 pl-0 pr-0">
                  <div class="d-flex flex-row-reverse">
                    <button class="btn btn-primary" type='submit'>Create user</button>
                    <router-link :to="{name: 'users'}" class="btn btn-secondary mr-3">Cancel</router-link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <loader :visible="saving" :label="'Creating users...'"/>
      </div>
    </template>
  </layout>
</template>

<script>
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import router from '../router/index'
import { createUser } from '../service/apiService'

export default {
  components: {
    Layout,
    Loader
  },
  name: 'AddUser',
  data() {
    return {
      title: 'AddUser',
      user: {
        username: '',
        name: '',
        surname: '',
        email: '',
        password: ''
      },
      passwordConfirm: '',
      saving: false,
      error: false
    }
  },
  methods: {
    create() {
      this.saving = true
      this.error = false
      if (this.user.password !== this.passwordConfirm) {
        this.saving = false
        this.user.password = ''
        this.passwordConfirm = ''
        alert("Inserted passwords are not the same")
      } else {
        createUser(this.user)
          .then(() => {
            router.push({name: 'users'})
            this.saving = false
          })
          .catch(() => {
            this.saving = false
            this.error = true
          })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  div.form-group {
    margin-bottom: 1rem;
  }

  input {
    font-size: 1em;
  }

  .btn {
    font-size: 1em;
  }
</style>
