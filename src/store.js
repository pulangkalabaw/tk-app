import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


import VueSession from 'vue-session'

Vue.use(VueSession, {persist: true})
const store =  new Vuex.Store({

    state: {

        maintenance_message: "Making it better. We'll back soon!",

        // timekeeping-backend.iplusapps.com
        // timekeeping-clock.iplusapps.com
        // timekeeping-login.iplusapps.com


        // image_url: 'http://192.168.1.52:90/iplus/tams_main/adminbackend/public/assets/',
        // clock_api: 'http://192.168.1.52:90/iplus/tams_main/clock/api',
        // application_api: 'http://192.168.1.52:90/iplus/tams_main/adminbackend/api',
        // authentication_api: 'http://192.168.1.52:90/iplus/tams_main/login/api/',

        // Live
        // image_url: 'http://timekeeping-backend.iplusapps.com/public/assets/',
        // application_api: 'http://timekeeping-backend.iplusapps.com/api',
        // clock_api: 'http://timekeeping-clock.iplusapps.com/api',
        // authentication_api: 'http://timekeeping-login.iplusapps.com/api/',
        // excel: 'http://tk-export.iplusapps.com/api',
        // mail_api: 'http://timekeeping-mail.iplusapps.com/api',
        // app_url: 'http://timekeeping.iplusapps.com',



        // Dev
        // image_url: 'http://192.168.1.49/tams/backend/adminbackend/public/assets/',
        // application_api: 'http://192.168.1.49/tams/backend/adminbackend/api',
        // excel: 'http://192.168.1.49/tams/backend/download_excel/api',
        // clock_api: 'http://192.168.1.49/tams/backend/clock/api',
        // authentication_api: 'http://192.168.1.49/tams/backend/login/api/',
        // mail_api: 'http://192.168.1.49/tams/backend/mailq/api',
        // app_url: 'http://192.168.1.49:3000',

        // Dev Ryann
        image_url: 'http://192.168.1.45:90/project/iplus/tams_main/backend/adminbackend/public/assets/',
        application_api: 'http://192.168.1.45:90/project/iplus/tams_main/backend/adminbackend/api',
        excel: 'http://192.168.1.45:90/project/iplus/tams_main/backend/download_excel/api',
        clock_api: 'http://192.168.1.45:90/project/iplus/tams_main/backend/clock/api',
        authentication_api: 'http://192.168.1.45:90/project/iplus/tams_main/backend/login/api/',
        mail_api: 'http://192.168.1.45:90/project/iplus/tams_main/backend/mailq/api',
        app_url: 'http://localhost:8080',


        daytype: ['REG','RD'],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        // daysInteger: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],

        stats: [],


        internal_error: false,

        notif: '',
        page_load_icon: 'fa-refresh',

        search: '',
        employee: '',
        loading: true,

        all_employees: [],
        all_schedules: [],
        all_bundees: [],
        all_locations: [],
        all_holidays: [],
        all_roles: [],
        all_leave_types: [],
        all_holiday_types: [],

        // Time Info
        // Time Request
        all_adjusted_requests: [],
        all_overtime_requests: [],
        all_leave_requests: [],
    },

})


console.log(store._vm)

export default store
