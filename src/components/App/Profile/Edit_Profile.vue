<template>
    <div class="main__cont">
        <div>
            <div class="main-heading">
                <ol class="breadcrumb">
                    <li>Profile</a></li>
                    <li>My Profile</li>
                    <li class="active">Edit</li>
                </ol>
            </div>
            <div class="container-fluid half-padding">
                <div class="template template__blank">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <div class="panel-title">
                                        <label class="text-left">Edit Profile
                                            <span v-if="show_profile_loading">
                                                <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                            </span>
                                        </label>
                                        <label class="pull-right" v-if="!show_profile_loading">
                                            <label class="btn btn-xs btn-default" @click="redirect('profile.info', { tenant: $route.params.tenant })"><span class='fa fa-eye fa-active'></span></label>
                                        </label>
                                    </div>
                                </div>

                                <div class="panel-body" v-if="!show_profile_loading">
                                    <!-- GI -->
                                    <div id="gi" class="tab-pane fade in active">
                                        <div class="container-fluid float-left">
                                            <form class="form users-new" v-on:submit.prevent="updateProfile()" encType="multipart/form-data">

                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <div v-if="profile.users.image != 'Photo.png'">
                                                            <img :src="image_preview" alt="" width="100%">
                                                            <span class='fa fa-info-circle'></span> image format must be .jpg, .png, .jpeg
                                                            <input type="file" name="image" v-on:change="handleImage">
                                                        </div>
                                                        <div v-else>
                                                            <img :src="$store.state.image_url + 'Photo.png'" alt="" width="100%">
                                                            <span class='fa fa-info-circle'></span> image format must be .jpg, .png, .jpeg
                                                            <input type="file" name="image" v-on:change="handleImage">
                                                        </div>
                                                    </div>
                                                    <div class="col-md-8" style="padding-left: 30px;">
                                                        <h2><span class='fa fa-edit'></span> Edit Profile Information</h2>
                                                        <br>

                                                        <div class="row">
                                                            <div class="col-md-2">Firstname: </div>
                                                            <div class="col-md-4">
                                                                <input type="text" v-model="profile.users.fname" id="" class="form-control" required="">
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>

                                                        <div class="row">
                                                            <div class="col-md-2">Lastname: </div>
                                                            <div class="col-md-4">
                                                                <input type="text" v-model="profile.users.lname" id="" class="form-control" required="">
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>

                                                        <div class="row">
                                                            <div class="col-md-2">Employee #: </div>
                                                            <div class="col-md-4">
                                                                <input type="text" v-model="profile.emp_num" id="" class="form-control" required="">
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>

                                                        <div class="row">
                                                            <div class="col-md-2">Email: </div>
                                                            <div class="col-md-4">
                                                                <input type="email" v-model="profile.email" id="" class="form-control" required="">
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>

                                                        <div class="row">
                                                            <div class="col-md-2">Contact #: </div>
                                                            <div class="col-md-4">
                                                                <input type="text" v-model="profile.users.cell_num" id="" class="form-control" required="">
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>

                                                        <div class="row">
                                                            <div class="col-md-4 col-md-offset-2 text-right">
                                                                <span v-if="update_profile_loading">
                                                                    <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                                </span>
                                                                <button type="submit" :disabled="update_profile_loading" class="btn btn-xs btn-success">Update Changes <span class='fa fa-edit'></span> </button>
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>

                                                        <br>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <!-- ./GI -->
                                </div>
                                <div class="panel-body" v-else>
                                    Loading please wait..
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

    import Vue from "vue";
    export default {

        data () {
            return {
                profile: {},
                image_preview: '',
                image: '',
                show_profile_loading: true,
                update_profile_loading: false,
            }
        },

        created () {
            this.init();
        },

        methods: {

            handleImage (e){
                const file = e.target.files[0];
                this.image = file;
                this.image_preview = URL.createObjectURL(file);
            },

            async init () {
                this.show_profile_loading = true
                var requests = [];

                requests['showEmployee'] = this.showEmployee()

                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        const showEmployee = val[0]['showEmployee'];
                        showEmployee.then(res => {
                            if(res.data.status != "failed"){
                                this.profile = res.data.msg[0]
                                this.image_preview = this.$store.state.image_url + this.$route.params.tenant + '/images/users/' + this.profile.users.image
                            }
                            else{
                                this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                            }
                            this.show_profile_loading = false
                        }).catch(err => console.log(err))

                    });

                }
                catch (e) {
                    console.log(e)
                }
            },

            showEmployee(){
                this.$store.state.loading = true
                return this.axiosRequest('GET', this.$store.state.application_api + '/employee/' + this.$session.get('auth')['user_id'], null, this.$session.get('headers'))
            },

            updateProfile(){

                this.update_profile_loading = true
                var fd = new FormData();
                fd.append('_method', "PUT")                
                fd.append('email', this.profile.email)
                fd.append('fname', this.profile.users.fname)
                fd.append('lname', this.profile.users.lname)
                fd.append('emp_num', this.profile.emp_num)
                fd.append('cell_num', this.profile.users.cell_num)
                fd.append('image', this.image)

                this.axiosRequest('POST', this.$store.state.application_api+'/profile/' + this.$session.get('auth')['user_id'], fd, this.$session.get('headers'))
                .then(res => {
                    if (res.data.status != "failed") {
                        this.toastr({ title: 'Profile', message: 'Update profile complete!' })
                    }
                    else {
                        this.toastr({ title: 'Profile', message: res.data.msg, type: 'error' })
                    }
                    this.update_profile_loading = false

                })
                .catch(err => {
                    console.log(err)
                })
            },

            handleImage (e){
                const file = e.target.files[0];
                this.image = file;
                this.image_preview = URL.createObjectURL(file);
            },

        },

        notifications: {
            toastr: {
                timeout: 2500,
                title: '',
                message: '',
                type: 'success'
            }
        },


    }

</script>

<style>
.txt-sm { font-size: 10px; }
</style>