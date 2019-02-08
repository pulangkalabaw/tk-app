import Vue from 'vue';

export default Vue.mixin({
    notifications: {
        toastr: {
            timeout: 5000,
            title: '',
            message: '',
            type: 'success'
        }
    },
    methods: {

        ucfirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        showBundeeName (bundee) {
            if (bundee == null) {
                return ''
            }
            else if (bundee == "kiosk") {
                return 'Kiosk'
            }
            else if (bundee == "mobile") {
                return 'Mobile'
            }
            else if (bundee == "edtr") {
                return 'EDTR'
            }
            else if (bundee == "third_party_biometrics") {
                return 'Biometrics (3rd party)'
            }
            else {
                return 'Unkown reference'
            }
        },

        shortDayName (day) {
            if (day === "Mon") {
                return "M"
            }
            else if (day === "Tue") {
                return "T"
            }
            else if (day === "Wed") {
                return "W"
            }
            else if (day === "Thu") {
                return "Th"
            }
            else if (day === "Fri") {
                return "F"
            }
            else if (day === "Sat") {
                return "Sa"
            }
            else if (day === "Sun") {
                return "Su"
            }
            else {
                return day
            }
        },

        // method, url, params, options
        axiosRequest (method, url, params, headers, api_token = true) {
            //  CHECK GET PARAMS
            url =  (url.includes('?') ? url + '&' : url + '?')
            // CHECK API TOKEN 
            url = (api_token == true ? url + 'api_token=' + this.$session.get('auth')['api_token'] + '&link=' + this.$route.params.tenant  : url)
            // ***************
            const instance = this.$axios({
                method: method,
                url: url,
                data: params,
                headers: headers,
                timeout: 60000,
                responseType: 'json', 
            });    

            // ***************
            let checker = instance
            checker.then(res => {
                if (res.data.status == "error") {
                    this.$session.destroy();
                    this.redirect('login', { tenant: this.$route.params.tenant });
                }else if( res.data.status == "fail" ){
                    this.toastr({ title: 'Ooops!', message: 'You are trying to access the page that could be under maintenance or not found.', type: 'error'})
                    // this.toastr({ message: 'You are trying to access pages that does not exist', title: 'Page not found!',  style: 'alert-warning', icon: 'fa-warning'})
                    history.back();
                    
                }
            })
            .catch(err => {
                // if (!err.status) {
                    // this.toastr({ message: 'You are trying to access the page that could be under maintenance or not found.', title: 'Ooops', type: 'error', timeout: 10000 })
                    // history.back();
                // }
            })
            // ***************
            
            // RETURN INSTANCE
            return instance;
        },
        
        redirect (route_name, params) {
            this.$router.push({ name: route_name , params : params })
        },

        notForEmployee () {
            return this.$session.get('auth')['role'][0]['role_name'] === 'Admin'
        },

        makePagination (data) {

            let pagination = {
                current_page: data.current_page,
                last_page: data.last_page,
                // In this portion
                // we will include the api token 
                // and search string
                next_page_url: data.next_page_url === null ? null : data.next_page_url + "&search=" + this.$store.state.search + "&t=" + this.$store.state.api_token,
                prev_page_url: data.prev_page_url === null ? null : data.prev_page_url + "&search=" + this.$store.state.search + "&t=" + this.$store.state.api_token,
            }
            return pagination;
        },


        toHumanTime(time){
            return new Date('7/10/2013 '+time).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        },

        // API REQUESTS

        // GET SCHEDULES
        getSchedules () {
            return this.axiosRequest('GET', this.$store.state.application_api + '/schedule?search=' + this.$store.state.search, null, this.$session.get('headers'))
        },
         // GET LEAVE TYPES
        getLeaveTypes () {
            return this.axiosRequest('GET', this.$store.state.application_api + '/leave', null, this.$session.get('headers'))
        },

        // GET LEAVE TYPES
        getHolidayTypes () {
            return this.axiosRequest('GET', this.$store.state.application_api + '/holiday-type', null, this.$session.get('headers'))
        },
        
        // GET LOCATIONS
        getLocations () {
            return this.axiosRequest('get',  this.$store.state.application_api + '/location', '', this.$session.get('headers'))
        },

        // GET BUNDEES
        getBundees () {
            return this.axiosRequest('get', this.$store.state.application_api + '/bundee', '', this.$session.get('headers'))
        },

        // GET ROLES
        getRoles () {
            return this.axiosRequest('get', this.$store.state.application_api + '/role', '', this.$session.get('headers'))
        },

        // GET EMPLOYEES 
        getEmployees () {
            return this.axiosRequest('get', this.$store.state.application_api+'/employee', '', this.$session.get('headers'))
        },


    }
})