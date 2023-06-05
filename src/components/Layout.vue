<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- eslint-disable -->
  <div id="home" class="row h-100">
    <navigation :source="source"></navigation>
    <div class="body col-sm p-0">
      <div class="row">
        <div class="col p-0 search-bar shadow-sm">
          <div class="row h-100 align-items-center">
            <slot name="search-input"></slot>
          </div>
          <div class="user-login row align-items-center">
            <div class="col"></div>
            <a class="admin-logout col-auto d-flex align-items-center" @click.prevent="logout">
              <div class="admin-user-name col-auto text-right">{{ getUsername }}</div>
              <img :src="require('../assets/logout.svg')">
            </a>
          </div>
        </div>
      </div>
      <slot name="body"></slot>
      <slot name="loader"></slot>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  components: {
    Navigation
  },
  name: 'Home',
  computed: {
    ...mapGetters('login', [
      'getUsername'
    ])
  },
  methods: {
    ...mapActions('login', [
      'logout'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../variables';

  .body {
    position: relative;
    z-index: 99;
    display: flex;
    flex-direction: column;
  }

  .search-bar {
    min-height: 70px;
    position: relative;
    background: white;
    border-left: 1px solid $background-grey;
    z-index: 1;
    .search-bar-container {
      padding: 10px 0;
      width: 100% !important;
      height: 100% !important;
    }
  }

  .user-login {
    height: 70px;
    min-width: 200px;
    position: absolute;
    right: 0;
    top: 0;
  }

  .beacon-search {
    height: 100%;
    width: 100%;
    color: #666666;
    border: none;
    padding-left: 10px;
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 40px;
  }

  .search-icon {
    margin-left: 10px;
    height: 30px;
    width: 30px;
    opacity: 0.3;
  }
</style>
