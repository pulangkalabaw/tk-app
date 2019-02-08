<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li><a style="cursor: pointer;" @click="redirect('schedules.index', { tenant: $route.params.tenant})">Schedules</a></li>
                <li v-if="!show_schedule_loading">{{ schedule.sched_name }}</li>
                <li v-else>
                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                </li>
                <li class="active">Edit</li>
            </ol>
        </div>

        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-lg-12 col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <div class="panel-title">
                                    <label class="text-left">Schedule
                                        <span v-if="show_schedule_loading">
                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                        </span>
                                    </label>
                                    <label class="pull-right" v-if="!show_schedule_loading">
                                        <label class="btn btn-xs btn-default" @click="redirect('schedules.show', { tenant: $route.params.tenant, id: schedule.sched_id })"><span data-toggle="tooltip" title="View" class='fa fa-eye fa-active'></span></label>
                                    </label>
                                </div>
                            </div>
                            <div class="panel-body">

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
                                </div>
                                <br>


                                <div v-if="!show_schedule_loading">
                                    <form @submit.prevent="updateSchedule()" method="POST">
                                        <h2>Schedule Information</h2>
                                        <div class="col-md-8">
                                            <div class="row">
                                                <div class="col-md-3">Schedule name:</div>
                                                <div class="col-md-8">
                                                    <input type="text" class="form-control" v-model="schedule.sched_name">
                                                </div>
                                            </div>
                                            <div class="clearfix"></div><br>
                                            
                                            <div class="row">
                                                <div class="col-md-8 col-md-offset-3">

                                                    <b v-if="hide_schedule_part">
                                                        <span @click="hide_schedule_part = false"><span class='fa fa-edit'></span> Change Schedule</span>
                                                    </b>
                                                    <b v-if="!hide_schedule_part">
                                                        <span @click="hide_schedule_part = true"><span class='fa fa-edit'></span> Cancel</span>
                                                    </b>
                                                </div>
                                                <div class="clearfix"></div>
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>

                                        <!-- Schedule form -->
                                        <div v-if="!hide_schedule_part">
                                            <hr>
                                            <span>
                                                <h2>Schedule <small class="text-xs"><span class='fa fa-info-circle'></span> any update on this part will be queued and will be changed on the <i>Effect date start</i> that you entered</small></h2>

                                            </span>
                                            <div class="col-md-8">
                                                <div class="row">
                                                    <div class="col-md-3">Day:</div>
                                                    <div class="col-md-8">
                                                        <div class="form-data" v-if="schedule.day">
                                                                <span v-for="(days, index) in $store.state.days">                                                                    
                                                                        <div class="col-md-2">
                                                                            <label :for="index">{{ days }}:</label> &nbsp;
                                                                        </div>
                                                                        <div class="col-md-3">
                                                                            <select class="form-control" v-model="schedule.day[index]">
                                                                                <option selected :value="{'day': days, 'type': 1}">REG</option>
                                                                                <option :value="{'day': days, 'type': 0 }">RD</option>
                                                                            </select>
                                                                        </div>
                                                                        <div class="col-md-1"></div>
                                                                </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3">Shift in:</div>
                                                    <div class="col-md-8">
                                                        <input type="time" class="form-control" v-model="schedule.shift_in" required="">
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3">Shift out:</div>
                                                    <div class="col-md-8">
                                                        <input type="time" class="form-control" v-model="schedule.shift_out" required="">
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3">Remarks:</div>
                                                    <div class="col-md-8">
                                                        <input type="text" class="form-control" v-model="schedule.remarks" required="">
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3">Grace Period:</div>
                                                    <div class="col-md-8">
                                                        <input type="number" class="form-control" v-model="schedule.grace_period" required="">
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row" >
                                                    <div class="col-md-3">Make Default:</div>
                                                    <div class="col-md-8" v-if="schedule.default_sched != 1">
                                                        <input type="checkbox" v-model="schedule.default_sched">
                                                    </div>
                                                    <div class="col-md-8">
                                                        <span class='fa fa-info-circle'></span> if you want to change the default schedule, you must update your desired schedule
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row" v-if="schedule.added_by != ''">
                                                    <div class="col-md-3">Added by</div>
                                                    <div class="col-md-8">
                                                        {{ schedule.added_by[0].fname }}
                                                        {{ schedule.added_by[0].mname }}
                                                        {{ schedule.added_by[0].lname }}
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3">Effective Date Start:</div>
                                                    <div class="col-md-8">
                                                        <input type="date" class="form-control" v-model="date_sched_queue" required="">
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>

                                        <!--./ Schedule form -->

                                        
                                        <!-- Submit form -->
                                        <hr>
                                        <div class="col-md-8">
                                            <div class="row">
                                                <div class="col-md-8 col-md-offset-3 text-right">
                                                    <span v-if="update_schedule_loading">
                                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                    </span>
                                                    <button :disabled="update_schedule_loading" class="btn btn-success btn-xs"><span class='fa fa-edit'></span> Update Changes</button>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- ./Submit form -->

                                    </form>
                                </div>

                                <div v-else>
                                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span>  Loading please wait..
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
                show_schedule_loading: true,
                update_schedule_loading: false,
                paginate: '',
                total: 0,
                notif: '',
                schedule: { 
                    day: [],
                },
                date_sched_queue: '',
                hide_schedule_part: true,
            }
        },

        created () {
            this.init ()
        },

        methods: {

            reload () {
                this.$store.state.all_schedules = "";
                this.init()
            },

            init () {
                const requests = {
                    getScheduleShow: () => this.getScheduleShow()
                }

                this.setup(requests)
            },

            async setup (requests) {
                try {
                    await requests.getScheduleShow()
                    .then(res => {
                        if (res.data.status != "failed") {
                            this.total = res.data.msg.length
                            this.schedule = res.data.msg[0]
                            // make int
                            this.schedule.default_sched = parseInt(this.schedule.default_sched)
                            this.show_schedule_loading = false
                        }
                    }).catch(err => console.log(err))
                }
                catch (err) {
                    console.log(err)
                }
            },

            getScheduleShow (route = "") {
                this.$store.state.loading = true
                return  this.axiosRequest('GET', this.$store.state.application_api + '/schedule/' + this.$route.params.id + '?search=' + this.$store.state.search, null, this.$session.get('headers'))
            },

            updateSchedule () {
                this.update_schedule_loading = true
                this.schedule.date_sched_queue = this.date_sched_queue

                if (this.hide_schedule_part) {
                    var params = {
                        sched_name: this.schedule.sched_name,
                        added_by: this.schedule.added_by[0].user_id,
                    }
                }
                else {
                    var params = this.schedule
                    params.added_by = this.schedule.added_by[0].user_id
                    params.default_sched = this.schedule.default_sched == true ? 1 : 0
                }

                
                this.axiosRequest('PUT', this.$store.state.application_api + '/schedule/' +  this.$route.params.id, params, this.$session.get('headers'))
                .then(res => {
                    if (res.data.status != "failed") {
                        this.toastr({ message: 'Update/Queue complete!', title: 'Schedule Management' })
                        this.reload()
                        this.notif = ''
                    }
                    else {
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }
                    this.update_schedule_loading = false
                })
                .catch(err => console.log(err))
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

    }

</script>