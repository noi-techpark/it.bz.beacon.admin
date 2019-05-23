<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container p-0" v-show="loaded">
        <div class="row user-display m-4 p-4">
          <div class="col-12 p-0">
            <form @submit.prevent="change">
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
                <label for="password"  class="col-sm-2 pl-0 col-form-label">Old password</label>
                <div class="col-sm-10 pr-0">
                  <input type="password" required class="form-control" id="oldPassword" v-model="passwordChange.oldPassword" placeholder="Old password">
                </div>
              </div>
              <div class="form-group row">
                <label for="password"  class="col-sm-2 pl-0 col-form-label">New password</label>
                <div class="col-sm-10 pr-0">
                  <input type="password" required class="form-control" id="password" v-model="passwordChange.newPassword" placeholder="New password">
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-2 pl-0 col-form-label"></div>
                <div class="col-sm-10 pr-0">
                  Min. 8 characters, max. 32 characters, must contain one of $&+,:;=\?@#|/'<>.^*()%!
                </div>
              </div>
              <div class="form-group row">
                <label for="password"  class="col-sm-2 pl-0 col-form-label">New password confirmation</label>
                <div class="col-sm-10 pr-0">
                  <input type="password" required class="form-control" id="passwordVerification" v-model="passwordConfirm" placeholder="New password confirmation">
                </div>
              </div>
              <div class="row">
                <div class="col-12 pl-0 pr-0">
                  <div class="alert alert-danger" role="alert" v-if="error">
                    Unable to change the password. Please verify that the password corresponds to the password rules.
                  </div>
                </div>
              </div>
              <div class="row" v-if="isSelf()">
                <div class="col-12 ">
                  <div class="d-flex flex-row-reverse">
                    <button class="btn btn-primary" type='submit'>Change</button>
                    <router-link :to="{name: 'user-edit', params: {id: user.id}}" class="btn btn-secondary mr-3">Cancel</router-link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <loader :visible="!loaded" :label="'Loading user data...'"/>
      <loader :visible="saving" :label="'Saving users...'"/>
    </template>
  </layout>
</template>

<script>
  import Layout from '../components/Layout'
  import Loader from '../components/Loader'
  import router from '../router/index'
  import { changePassword, getUser } from '../service/apiService'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Layout,
      Loader
    },
    name: 'User',
    data() {
      return {
        title: 'User',
        user: {
          id: '',
          name: '',
          surname: '',
          email: ''
        },
        passwordConfirm: null,
        passwordChange: {
          oldPassword: null,
          newPassword: null
        },
        loaded: false,
        saving: false,
        error: false
      }
    },
    computed: {
      ...mapGetters('login', [
        'getUsername',
        'isAdmin'
      ])
    },
    mounted() {
      getUser(this.$route.params.id).then((user) => {
        Object.assign(this.user, user)
        this.$set(this, 'loaded', true)
      })
    },
    methods: {
      change() {
        this.saving = true
        this.error = false
        if (this.passwordChange.newPassword !== this.passwordConfirm) {
          this.saving = false
          this.passwordChange.newPassword = null
          this.passwordConfirm = null
          alert("Inserted passwords are not the same")
        } else {
          changePassword(this.user, this.passwordChange)
                  .then(() => {
                    router.push({ name: 'user-edit', params: { id: this.user.id }})
                    this.saving = false
                  })
                  .catch(() => {
                    this.saving = false
                    this.error = true
                  })
        }
      },
      isSelf() {
        return this.getUsername === this.user.username
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
