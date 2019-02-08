<template>
    <div class="login">
        <div style="padding: 80px;">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-danger">
                    <div class="panel-heading">
                        <div class="panel-title"> 
                            <div class="row">
                                <label class="col-md-6 text-left">
                                    <span class='fa fa-lock'></span> PASSWORD RESET
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body text-left" style="font-size: 15px">
                        <div v-if="!check_token_loading">
                            <div v-if="token_valid">

                                <form @submit.prevent="passwordReset()">
                                    <!-- Alert -->
                                    <notif :notif="notif" style="font-size: 15px"></notif>
                                    <!-- Alert -->

                                    <div class="row">
                                        <div class="col-md-4 text-right">
                                            New Password: 
                                        </div>
                                        <div class="col-md-6">
                                            <input class="form-control" type="password" v-model="user.new_password" placeholder="New Password" required="">
                                        </div>
                                    </div>
                                    <div class="clearfix"></div><br>
                                    
                                    <div class="row">
                                        <div class="col-md-4 text-right">
                                            Confirm Password: 
                                        </div>
                                        <div class="col-md-6">
                                            <input class="form-control" type="password" v-model="user.confirm_password" placeholder="Confirm Password" required="">
                                        </div>
                                    </div>
                                    <div class="clearfix"></div><br>

                                    <div class="row">
                                        <div class="col-md-10 text-right">
                                            <span v-if="password_change_loading">
                                                <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                                            </span>
                                            <button class="btn btn-default" :disabled="password_change_loading">Submit</button>
                                        </div>
                                    </div>

                                </form>

                            </div>
                            <div v-else class="text-left">
                                <h2>Error occured</h2><br>
                                <h5>This password has already been reset.</h5><br>
                                <h5>Use the new password or try to find the old password again</h5>
                                <h5>Go <a @click="redirect('login', { tenant: $route.params.tenant })">Back</a></h5>
                            </div>
                        </div>
                        <div v-else>
                            Loading please wait..
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {

        data () {
            return {
                notif: '',
                user: {},
                password_change_loading: false,
                token_valid: false,
                check_token_loading: true,
            }
        },

        created () {
            this.checkApiTokenAndLink();
        },

        notifications: {
            toastr: {
                timeout: 2500,
                title: '',
                message: '',
                type: 'success'
            }
        },

        methods: {

            // for link
            checkApiTokenAndLink(){
                this.check_token_loading = true
                this.axiosRequest('get', this.$store.state.authentication_api+'support/token-checker?ac=' + this.$route.params.ac + '&link=' + this.$route.params.tenant, null, null, false)
                .then(res => {
                    if (res.data.status == 'success') {
                        this.token_valid = true
                    }
                    else {
                        this.token_valid = false
                    }
                    this.check_token_loading = false
                })
                .catch(err => {console.log(err)})
            },


            passwordReset(){
                if (this.user.new_password !== this.user.confirm_password) {
                    alert("Password mismatch!")
                    return false;
                }
                this.password_change_loading = true
                this.axiosRequest('post', this.$store.state.authentication_api+'support/request/password-change?ac=' + this.$route.params.ac + '&link=' + this.$route.params.tenant, this.user, null, false)
                .then(res => {
                    if (res.data.status == 'success') {
                        this.toastr({ message: 'Password Reset. Redirecting please wait..', title: 'Password Reset' })
                        this.$router.push({ name: 'login', params: { tenant: this.$route.params.tenant } });   
                    }
                    else {
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }

                    this.password_change_loading = false
                })
                .catch(err => {console.log(err)})
            },

        }

    }
</script>