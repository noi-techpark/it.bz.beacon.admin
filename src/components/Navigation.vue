<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <!-- eslint-disable -->
  <div id="navigation" class="main-navigation col-sm p-0">
    <nav class="row h-100 align-items-start">
      <div class="col-12 p-0 d-flex flex-column h-100">
        <div class="row">
          <div class="beacon-logo shadow-sm col-12 p-0 text-center">
            <img src="../assets/logo.png" class="align-self-center">
          </div>
        </div>
        <router-link v-for="item in navigationItems" :key="item.id" :class="'row navigation-link pl-3' + ( $route.meta.nav === item.nav ? ' highlight' : '' )" :to="{name: item.name}">
          <span class="navigation-symbol col"><img :src="iconSvg(item)"/></span>
          <span class="pl1 navigation-text col">{{ item.title }}</span>
        </router-link>
        <div class="row request-support-container">
          <a class="request-support-link" :href="'mailto:' + supportEmail">Request support</a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import config from '../service/config'

export default {
  // props: {
  //   source: ''
  // },
  name: 'Navigation',
  data() {
    return {
      navigationItems: [
        {
          name: 'beacons',
          title: 'Beacons',
          nav: 'beacons'
        },
        {
          name: 'issues',
          title: 'Issues',
          nav: 'issues'
        },
        {
          name: 'users',
          title: 'Users',
          nav: 'users'
        },
        {
          name: 'groups',
          title: 'Groups',
          nav: 'groups'
        }
      ],
      supportEmail: config.SUPPORT_EMAIL
    }
  },
  methods: {
    iconSvg(navigationItem) {
      return location.origin + require('../assets/ic_' + navigationItem.nav + '.svg');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../variables';

.main-navigation {
  position: relative;
  z-index: 99;
  font-size: 14px;
}

.beacon-logo {
  background-color: #ffffff;
  height: 70px;
  img {
    height: 45px;
    margin-top: 13px;
  }
}

.navigation-symbol {
  max-width: 40px;
  height: 50px;
  padding: 0 11px;

  div.nav-logo {
    background-color: white;
    width: 32px;
    height: 32px;
    margin-top: 9px;
    background-position: center;

    &.logo-beacons {
      -webkit-mask: url(../assets/ic_beacons.svg) no-repeat center;
      mask: url(../assets/ic_beacons.svg) no-repeat center;
    }
    &.logo-issues {
      -webkit-mask: url(../assets/ic_issues.svg) no-repeat center;
      mask: url(../assets/ic_issues.svg) no-repeat center;
    }
    &.logo-users {
      -webkit-mask: url(../assets/ic_users.svg) no-repeat center;
      mask: url(../assets/ic_users.svg) no-repeat center;
    }
    &.logo-groups {
      -webkit-mask: url(../assets/ic_users.svg) no-repeat center;
      mask: url(../assets/ic_users.svg) no-repeat center;
    }
  }
}

.request-support-container {
  flex-grow: 1;
  align-content: end;
  padding: 8px 10px;
}
.request-support-link {
  color: #ffffff;
  text-decoration: none;
  background-color: transparent;
}
.request-support-link:hover {
  color: #ffffff;
  text-decoration: underline; }
</style>
