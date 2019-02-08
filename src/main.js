// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Axios from 'axios'
import store from './store'
import router from './router'
import mixins from './mixins'
import VueSession from 'vue-session'
import Notif from '@/components/Layouts/Extra/Notif.vue'


Vue.component('notif', Notif);
Vue.use(VueSession, {persist: true})

Vue.config.productionTip = false
Vue.prototype.$axios = Axios


// Vue Notif
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'// https://github.com/se-panfilov/mini-toastr
miniToastr.init()
function toast ({title, message, type, timeout, cb}) {
  return miniToastr[type](message, title, timeout, cb)
}
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}
Vue.use(VueNotifications, options)
// ./Vue Notif




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  mixins: ['mixins'],
  components: { App },
  template: '<App/>'
})
