// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import './style.scss'
import CookieConsent from 'vue-cookieconsent'
import '../node_modules/vue-cookieconsent/vendor/cookieconsent.css'
import { consentOptions } from './cookieconsent/cookieconsent-init';

Vue.config.productionTip = false

Vue.config.errorHandler = (a,b,c) => {
   window.console.log(a);
   window.console.log(b);
   window.console.log(c);
   alert('vue error')
}

// insert cookieconsent banner with fix for undefined global properties
Vue.config.globalProperties = Vue.config.globalProperties ? Vue.config.globalProperties : {};
Vue.use(CookieConsent, consentOptions)

// remove map_zoom and lat/lon on webapp start
sessionStorage.removeItem('map_zoom')
sessionStorage.removeItem('map_lat')
sessionStorage.removeItem('map_lon')

sessionStorage.removeItem('beacons_search')
sessionStorage.removeItem('group_filter')

/* eslint-disable no-new */
new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#app');
