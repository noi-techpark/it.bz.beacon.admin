<template>
  <!-- eslint-disable -->
  <div id="reset-password" class="row h-100">
    <div class="col-sm-6 text-center p-0">
      <div class="row h-100 start-screen">
        <div class="col-sm-12 p-0">
          <div class="row h-100 align-items-center beacon-login-left">
            <div class="col beacon-logo-container">
              <img src="../assets/beacon_logo.svg" alt="Beacon Südtirol - Alto Adige" style="width: 10em">
            </div>
          </div>
        </div>
        <div class="col partner-images">
          <img src="../assets/efre.png" alt="afre - fesr Südtirol - AltoAdige">
          <img src="../assets/eu.png" alt="European Union">
          <img src="../assets/rep-it.png" alt="Repubblica Italiana">
          <img src="../assets/alto-adige.png" alt="Autonome Provinz Südtirol - Provincia Autonoma di Bolzano Alto Adige">
        </div>
      </div>
    </div>
    <div class="col-sm-6 pl-0 login-form-container text-center">
      <div class="row h-100 align-items-center">
        <div class="login-form col-sm p-0" v-show="!isTokenValid()">
          <div class="input row justify-content-center">
              <span class="col-sm alert alert-danger error-message" role="alert">
                Your token has been expired. Please reset your password again.
                <router-link :to="{name: 'reset-password'}">Reset password</router-link>
              </span>
          </div>
        </div>
        <form class="login-form col-sm p-0" v-show="isTokenValid()">
          <div class="row form-group">
            <div class="col-12 ">
              <div class="d-flex">
                <router-link :to="{name: 'login'}" class="btn btn-secondary">Back</router-link>
              </div>
            </div>
          </div>
          <div class="input form-group row">
            <label for="username" class="col-sm-3 col-form-label">Username</label>
            <div class="col-sm-9 pr-0">
              <input type="text" disabled class="form-control" id="username" v-model="getTokenPayload().sub" placeholder="Username">
            </div>
          </div>
          <div class="input form-group row">
            <label for="password"  class="col-sm-3 pl-0 col-form-label">New password</label>
            <div class="col-sm-9 pr-0">
              <input type="password" required class="form-control" id="password" v-model="newPassword" placeholder="New password">
            </div>
          </div>
          <div class="input form-group row">
            <div class="col-sm-3 pl-0 col-form-label"></div>
            <div class="col-sm-9 pr-0">
              Min. 8 characters, max. 32 characters, must contain one of $&+,:;=\?@#|/'<>.^*()%!
            </div>
          </div>
          <div class="input form-group row">
            <label for="password"  class="col-sm-3 pl-0 col-form-label">New password confirmation</label>
            <div class="col-sm-9 pr-0">
              <input type="password" required class="form-control" id="passwordVerification" v-model="passwordConfirm" placeholder="New password confirmation">
            </div>
          </div>
          <div class="row">
            <div class="col-12 pl-0 pr-0">
              <div class="alert alert-danger" role="alert" v-if="hasError">
                Unable to reset the password. Please verify that the password corresponds to the password rules.
              </div>
            </div>
          </div>
          <div class="input row form-group">
            <div class="col-sm">
              <button id="submit" type="submit" @click.prevent="changeFrom">Reset password</button>
            </div>
          </div>
        </form>
      </div>
      <loader :visible="saving" :label="'Resetting password...'"/>
    </div>
  </div>
</template>

<script>
  import { resetPasswordChange } from '../service/apiService'
  import router from '../router/index'
  import Loader from '../components/Loader'

  export default {
    components: {
      Loader
    },
    name: 'Login',
    data() {
      return {
        hasError: false,
        saving: false,
        user: {
          id: '',
          name: '',
          surname: '',
          email: ''
        },
        passwordConfirm: null,
        newPassword: null,
        tokenPayload: {
          username: ''
        }
      }
    },
    methods: {
      getTokenPayload() {
        if(this.$route.params.token)
          return JSON.parse(atob(this.$route.params.token.split('.')[1]));
        return {
          username: '',
          exp: 0
        }
      },
      isTokenValid() {
        return this.getTokenPayload().exp > new Date().getTime() / 1000
      },
      changeFrom() {
        this.saving = true
        this.hasError = false
        if (this.newPassword !== this.passwordConfirm) {
          this.saving = false
          this.newPassword = null
          this.passwordConfirm = null
          alert("Inserted passwords are not the same")
        } else {
          resetPasswordChange(this.$route.params.token, this.newPassword)
            .then(() => {
              router.push({ name: 'login' })
              this.saving = false
            })
            .catch(() => {
              this.saving = false
              this.hasError = true
            })
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .beacon-login-left {
    background-image: url("../assets/bg_login.png");
    background-repeat: repeat;
    background-size: auto;
  }

  input.form-control {
    display: inline-block;
    font-size: 0.8rem;

    &.is-invalid {

    }
  }

  input, button {
    padding: 8px 10px;
    border-radius: 5px;
    max-width: 380px;
    width: 100%;
    color: #ffffff;
  }

  .error-message {
    max-width: 380px;
    width: 100%;
  }

  div.form-group {
    margin-bottom: 0.8rem;
    font-size: 0.8em;
  }

  .form-group .col-form-label {
    font-size: 0.8em;
  }

  input {
    font-size: 0.8em;
  }

  .btn {
    font-size: 0.8em;
  }
</style>
