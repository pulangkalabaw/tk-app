<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li><a style="cursor: pointer;" @click="redirect( 'holiday_types.index', { tenant: $route.params.tenant})">Holiday Types Settings</a></li>
                <li v-if="!show_holidays_loading">{{ update_holidays.holiday_type_name }}</li>
                <li class="active">Edit</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <label class="text-left">Location
                                        <span v-if="show_holidays_loading">
                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                        </span>
                                    </label>
                                </h3>
                            </div>
                            <div class="panel-body">
                                <div v-if="!show_holidays_loading">
                                    <div class="alert alert-dismissible" :class="notif.style" v-if="notif">
                                        <div v-if="notif.style == 'alert-danger'">
                                            <div v-if="typeof notif.message === 'object'">
                                                <div v-for="(mess, index) in notif.message">
                                                    <span class='fa' :class="notif.icon"></span> {{ mess.join() }}
                                                </div>
                                            </div>
                                            <div v-else>
                                                <span class='fa' :class="notif.icon"></span> {{ notif.message }}
                                            </div>
                                        </div>
                                        <div v-else>
                                            <span class='fa' :class="notif.icon"></span> {{ notif.message }}
                                        </div>
                                    </div><br>

                                    <form class="form locations-new" v-on:submit.prevent="updateHolidayTypes()">
                                        <div class="container-fluid float-left">
                                            <h2>Holiday Type Information</h2>
                                            <div class="col-md-8">
                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Holiday name:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <input class="form-control" type="text" v-model="update_holidays.holiday_type_name" placeholder="Leave name">
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Holiday code:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <input class="form-control" type="text" v-model="update_holidays.holiday_type_code" placeholder="Leave code">
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>
                                                
                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3"></div>
                                                    <div class="col-md-9 col-xs-9 text-right">
                                                        <button class="btn btn-success btn-xs" :disabled="update_holidays_loading">Update changes <span class='fa fa-edit'></span> </button>
                                                        <span v-if="update_holidays_loading">
                                                            <span class='fa fa-refresh fa-spin'></span> 
                                                        </span>
                                                    </div>
                                                </div>

                                            </div>
                                            <div class="clearfix"></div><br>  
                                        </div>
                                        <div class="clearfix"></div>
                                    </form>
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

    export default {

        data () {
            return {
                show_holidays_loading: true,
                update_holidays_loading: false,
                update_holidays: {},
                notif: '',
            }
        },

        created () {
            this.getHolidayTypesShow ()
        },


        methods: {

            getHolidayTypesShow () {
                this.axiosRequest('GET', this.$store.state.application_api + '/holiday-type/' + this.$route.params.id, null, this.$session.get('headers'))
                .then(res => {
                    console.log(res)
                    if (res.data.status != "failed") {
                        this.update_holidays = res.data.msg
                    }
                    this.show_holidays_loading = false
                })
            },


            updateHolidayTypes() {

                this.update_holidays_loading = true
                var params = {
                    holiday_type_name: this.update_holidays.holiday_type_name,
                    holiday_type_code: this.update_holidays.holiday_type_code,
                    '_method': 'PUT'
                }

                this.axiosRequest('post', this.$store.state.application_api + '/holiday-type/' + this.$route.params.id, params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ title: 'Leave Types Settings', message: 'Update complete' })
                        this.notif = ''
                    }
                    else{
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }
                    this.update_holidays_loading = false

                }).catch(err => console.log(err))

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
