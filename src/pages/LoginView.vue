<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- eslint-disable -->
  <div id="login" class="row h-100">
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
        <form class="login-form col-sm p-0">
          <div class="input row justify-content-center" v-show="hasError">
            <span class="col-sm alert alert-danger error-message" role="alert">
              Anmeldung fehlgeschlagen.
            </span>
          </div>
          <div class="input row">
            <div class="col-sm">
              <input type="text" id="username" name="username" placeholder="Username" v-model="username" :class="'form-control' + (hasError ? ' is-invalid' : '')">
            </div>
          </div>
          <div class="input row">
            <div class="col-sm">
              <input :type="passwordFieldType" id="password" name="password" placeholder="Password" v-model="password" :class="'form-control' + (hasError ? ' is-invalid' : '')">
              <!--<button type="button" @click="switchVisibility">show / hide</button>-->
            </div>
          </div>
          <div class="input row">
            <div class="col-sm">
              <button id="submit" type="submit" @click.prevent="login">Login</button>
            </div>
          </div>
          <div class="input row" style="justify-content: center">
            <div class="col-sm col-sm-link">
              <a :href="'mailto:' + supportEmail">Request support</a>
              <router-link :to="{name: 'reset-password'}">Reset password</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import config from '../service/config'

  export default {
    name: 'Login',
    data() {
      return {
        username: '',
        password: '',
        passwordFieldType: 'password',
        supportEmail: config.SUPPORT_EMAIL
      }
    },
    computed: {
      ...mapGetters('login', [
        'hasError',
        'getError'
      ])
    },
    methods: {
      login() {
        this.$store.dispatch('login/login', {
          username: this.username,
          password: this.password
        })
      },
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
      }
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

  input {
    margin-bottom: 20px;
  }

  button {
    margin-bottom: 5px;
  }

  .error-message {
    max-width: 380px;
    width: 100%;
  }

  a {
    color: #ffffff;
    text-decoration: none;
    background-color: transparent;
  }
  a:hover {
    color: #ffffff;
    text-decoration: underline; }

  .col-sm-link {
    max-width: 380px;
    display: flex;
    justify-content: space-between;
  }
</style>
