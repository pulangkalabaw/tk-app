<template>
    <div class="login">
        <div style="padding: 80px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="panel panel-danger">
                    <div class="panel-heading">
                        <div class="panel-title"> 
                            <div class="row">
                                <label class="col-md-6 text-left">
                                    <span class='fa fa-lock'></span> Forgot Password
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">

                        <form @submit.prevent="forgotPassword()">

                            <!-- Alert -->
                            <notif :notif="notif"></notif>
                            <!-- Alert -->

                            <div class="form-group">
                                <input class="form-control" type="email" v-model="user.username" placeholder="Enter your email address" required="">
                                <input class="form-control" type="hidden" v-model="user.link" required="">
                            </div>
                            <div class="form-group login__action">
                                <div class="login__submit" style="font-size: 15px">
                                    <span v-if="forgot_password_loading">
                                        <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                                    </span>
                                    <button class="btn btn-default" :disabled="forgot_password_loading">Submit</button>
                                </div>
                            </div>

                        </form>
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
                user: {
                    link: this.$route.params.tenant
                },
                forgot_password_loading: false,
                token_valid: false,
                check_token_loading: true,
            }
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

            forgotPassword(){
                this.forgot_password_loading = true
                this.axiosRequest('post', this.$store.state.authentication_api+'support/request/password-reset', this.user, null, false)
                .then(res => {
                    if (res.data.status == 'success') {
                        this.toastr({ message: 'You request has been sent to your email address', title: 'Forgot Password' })
                        this.$router.push({ name: 'login', params: { tenant: this.$route.params.tenant } });   
                    }
                    else {
                        this.toastr({ message: res.data.msg, title: 'Forgot Password', type: 'error' })
                    }

                    this.forgot_password_loading = false
                })
                .catch(err => {console.log(err)})

                let params = {
                    email: this.user.username,
                    link: this.$route.params.tenant,
                    // api_token: this.$session.get('auth')['api_token'],
                };

                console.log(params);

                this.axiosRequest('post', this.$store.state.mail_api + '/send_resetpass', params, null, false)
            },

        }

    }
</script>