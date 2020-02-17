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
        <div class="login-form col-sm p-0" v-show="emailSuccess">
          <div class="row mb-5">
            <div class="col-12 " style="flex: 0 0 100%;justify-content: center;display: flex;">
              <div class="d-flex" style="max-width: 380px;width: 100%;">
                <router-link :to="{name: 'login'}" class="btn btn-secondary btn-back">Back</router-link>
              </div>
            </div>
          </div>
          <div class="input row justify-content-center">
              <span class="col-sm alert alert-success error-message" role="alert">
                An email with the reset password instructions has been sent.
              </span>
          </div>
        </div>
        <form class="login-form col-sm p-0" v-show="!emailSuccess">
          <div class="row mb-5">
            <div class="col-12 " style="flex: 0 0 100%;justify-content: center;display: flex;">
              <div class="d-flex" style="max-width: 380px;width: 100%;">
                <router-link :to="{name: 'login'}" class="btn btn-secondary btn-back">Back</router-link>
              </div>
            </div>
          </div>
          <div class="input row justify-content-center" v-show="hasError">
            <span class="col-sm alert alert-danger error-message" role="alert">
              {{errorMessage}}
            </span>
          </div>
          <div class="input row">
            <div class="col-sm">
              <input type="text" id="username" name="username" placeholder="Username or Email" v-model="username" :class="'form-control' + (hasError ? ' is-invalid' : '')">
            </div>
          </div>
          <div class="input row">
            <div class="col-sm">
              <button id="submit" type="submit" @click.prevent="confirmFrom">Reset password</button>
            </div>
          </div>
        </form>
      </div>
      <loader :visible="sending" :label="'Sending password reset request...'"/>
    </div>
  </div>
</template>

<script>
  import { resetPasswordRequest } from '../service/apiService'
  import Loader from '../components/Loader'

  export default {
    components: {
      Loader
    },
    name: 'Login',
    data() {
      return {
        username: '',
        hasError: false,
        errorMessage: '',
        sending: false,
        emailSuccess: false
      }
    },
    methods: {
      confirmFrom() {
        this.sending = true
        resetPasswordRequest(this.username)
          .then(() => {
            this.sending = false
            this.emailSuccess = true
          })
          .catch((e) => {
            this.$set(this, 'hasError', true)
            if(e.response.status === 404 && e.response.data.message === 'User not found')
              this.$set(this, 'errorMessage', 'User not found.')
            else
              this.$set(this, 'errorMessage', 'Password reset failed.')
            this.sending = false
          })
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
    margin-bottom: 20px;
    width: 100%;
    color: #ffffff;
  }

  .error-message {
    max-width: 380px;
    width: 100%;
  }

  .btn.btn-back {
    margin-bottom: 0.8rem;
    font-size: 0.8em;
  }
</style>
