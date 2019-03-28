<template>
  <!-- eslint-disable -->
  <layout :source="title">
    <template slot="body">
      <div class="container p-0" v-show="loaded">
        <div class="row user-display m-4 p-4">
          <div class="col-12 p-0">
            <form @submit.prevent="reset">
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
                <label for="password"  class="col-sm-2 pl-0 col-form-label">New password</label>
                <div class="col-sm-10 pr-0">
                  <input type="password" required class="form-control" id="password" v-model="passwordReset.newPassword" placeholder="New password">
                </div>
              </div>
              <div class="form-group row">
                <label for="password"  class="col-sm-2 pl-0 col-form-label">New password confirmation</label>
                <div class="col-sm-10 pr-0">
                  <input type="password" required class="form-control" id="passwordVerification" v-model="passwordConfirm" placeholder="New password confirmation">
                </div>
              </div>
              <div class="row" v-if="isAdmin">
                <div class="col-12 ">
                  <div class="d-flex flex-row-reverse">
                    <button class="btn btn-danger" type='submit'>Reset</button>
                    <router-link :to="{name: 'user-edit', params: {id: user.id}}" class="btn btn-secondary mr-3">Cancel</router-link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <loader :visible="!loaded" :label="'Loading user data...'"/>
      <loader :visible="saving" :label="'Resetting password...'"/>
    </template>
  </layout>
</template>

<script>
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import router from '../router/index'
import { resetPassword, getUser } from '../service/apiService'
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
      passwordReset: {
        newPassword: null
      },
      loaded: false,
      saving: false
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
    reset() {
      this.saving = true
      if (this.passwordReset.newPassword !== this.passwordConfirm) {
        this.saving = false
        this.passwordReset.newPassword = null
        this.passwordConfirm = null
        alert("Inserted passwords are not the same")
      } else {
        resetPassword(this.user, this.passwordReset)
                .then(() => {
                  router.push({ name: 'user-edit', params: { id: this.user.id }})
                  this.saving = false
                })
                .catch(() => {
                  this.saving = false
                })
      }
    },
    canChange() {
      return this.isAdmin || this.isSelf()
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
