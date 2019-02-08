<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li class="active">Schedules</li>
            </ol>
        </div>

        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-lg-12 col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">Schedules
                                    <span v-if="index_schedule_loading">
                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                    </span>
                                    <span v-else @click="reloadSchedules()">
                                        <span class='fa fa-refresh' data-toggle="tooltip" title="Refresh data"></span>
                                    </span>
                                </h3>
                            </div>
                            <div class="panel-body" v-if="!index_schedule_loading">
                                <div class="scrollable scrollbar-macosx">
                                    <!-- TABS NAV -->
                                    <ul class="nav nav-tabs">
                                        <li class="active">
                                            <a data-toggle="tab" href="#schedule_index">
                                                All
                                                <span v-if="!index_schedule_loading">
                                                    <span class="label">{{ $store.state.all_schedules.length }}</span>
                                                </span>
                                            </a>
                                        </li>
                                        <li><a data-toggle="tab" href="#schedule_create"><span class="fa fa-plus"></span> New</a></li>
                                    </ul>
                                </div>

                                <div class="tab-content">

                                    <!-- List Schedule -->
                                    <div id="schedule_index" class="tab-pane fade in active table-responsive" style="border: 0">
                                        <table class="table dtsched">
                                            <thead>
                                                <tr>
                                                    <th>Schedule name</th>
                                                    <th>Day</th>
                                                    <th>Shift in</th>
                                                    <th>Shift out</th>
                                                    <th>Remarks</th>
                                                    <th>Change queue</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="$store.state.all_schedules.length != 0">
                                                <tr v-for="schedule in $store.state.all_schedules" @click="redirect('schedules.show', { tenant: $route.params.tenant, id: schedule.sched_id })">
                                                    <td>
                                                        <span class='fa fa-star' v-if="schedule.default_sched == 1" data-toggle="tooltip" title="Default Schedule"></span>
                                                        {{ schedule.sched_name }}
                                                    </td>
                                                    <td>

                                                        <label v-for="(day, index) in schedule.day.filter(x => x.type == 1)">
                                                            {{ shortDayName(day.day) }}
                                                            <span v-if="index == schedule.day.filter(x => x.type == 1).length - 1">
                                                                (REG),
                                                            </span>
                                                        </label>

                                                        <label v-for="(day, index) in schedule.day.filter(x => x.type == 0)">
                                                            {{ shortDayName(day.day) }}
                                                            <span v-if="index == schedule.day.filter(x => x.type == 0).length - 1">
                                                                (RD)
                                                            </span>
                                                        </label>

                                                    </td>
                                                    <td>{{ toHumanTime(schedule.shift_in) }}</td>
                                                    <td>{{ toHumanTime(schedule.shift_out) }}</td>
                                                    <td>{{ schedule.remarks }}</td>
                                                    <td v-if="schedule.change_que != null">
                                                        {{ schedule.change_que }}
                                                    </td>
                                                    <td v-else>
                                                        - &nbsp; - &nbsp; - &nbsp; -
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <tr>
                                                    <td colspan="5" class="text-center">
                                                        No data
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table><br>
                                    </div>

                                    <!-- Create new Schedule -->
                                    <div id="schedule_create" class="tab-pane">

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


                                        <form @submit.prevent="addSchedule()" method="POST">
                                            <div class="row">
                                                <div class="col-md-6">

                                                    <div class="col-md-4">Schedule name</div>
                                                    <div class="col-md-6">
                                                        <input type="text" class="form-control" v-model="new_sched.sched_name">
                                                    </div>
                                                    <div class="clearfix"></div><br>

                                                    <div class="col-md-4">Shift in</div>
                                                    <div class="col-md-6">
                                                        <input type="time" class="form-control" v-model="new_sched.shift_in">
                                                    </div>
                                                    <div class="clearfix"></div><br>

                                                    <div class="col-md-4">Shift out</div>
                                                    <div class="col-md-6">
                                                        <input type="time" class="form-control" v-model="new_sched.shift_out">
                                                    </div>
                                                    <div class="clearfix"></div><br>

                                                    <div class="col-md-4">Grace Period</div>
                                                    <div class="col-md-6">
                                                        <input type="text" class="form-control" v-model="new_sched.grace_period">
                                                    </div>
                                                    <div class="clearfix"></div><br>

                                                </div>

                                                <div class="col-md-6">

                                                    <div class="col-md-4">Remarks</div>
                                                    <div class="col-md-8">
                                                        <input type="text" class="form-control" v-model="new_sched.remarks">
                                                    </div>
                                                    <div class="clearfix"></div><br>

                                                    <div class="col-md-12">Days</div>
                                                    <div class="col-md-12">
                                                        <div class="form-data">
                                                            <span v-for="(days, index) in $store.state.days">
                                                                <div class="col-md-2">
                                                                    <label :for="index">{{ days }}:</label> &nbsp;
                                                                </div>
                                                                <div class="col-md-3">
                                                                    <select class="form-control" v-model="new_sched.days[index]">
                                                                        <option selected :value="{'day': days, 'type': 1}">REG</option>
                                                                        <option :value="{'day': days, 'type': 0 }">RD</option>
                                                                    </select>
                                                                </div>
                                                                <div class="col-md-1"></div>
                                                            </span>
                                                        </div>

                                                    </div>
                                                    <div class="clearfix"></div><br>
                                                    <div class="col-md-3"></div>
                                                    <div class="col-md-9 text-right">
                                                        <span v-if="create_schedule_loading">
                                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                        </span>
                                                        <button :disabled="create_schedule_loading" class="btn-primary btn btn-xs" type="submit">Submit <span class='fa fa-plus-circle'></span> </button>
                                                    </div>
                                                    <div class="clearfix"></div><br>

                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
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
</template>

<script>

    export default {

        data () {
            return {
                notif: '',
                new_sched: {
                    days: [],
                },

                index_schedule_loading: true,
                create_schedule_loading: false,
                update_schedule_loading: false, // DEFAULT SCHEDULE UPDATE (ONLY)
            }
        },

        created () {
            this.init ()
        },

        computed: {
            count () {
                return this.index_schedule_loading
            }
        },

        updated () {
            if (this.$store.state.all_schedules.length != 0) {
                if (!$.fn.dataTable.isDataTable( '.dtsched' )) {
                    $('.dtsched').dataTable({ ordering: true  });
                }
            }
        },

        watch: {
            count: function (val) {
                if (this.$store.state.all_schedules.length != 0) {
                    if (!$.fn.dataTable.isDataTable( '.dtsched' )) {
                        $('.dtsched').dataTable({ ordering: true  });
                    }
                }
            }
        },

        methods: {

            reloadSchedules () {
                this.$store.state.all_schedules = "";
                this.init();
            },

            async init () {
                this.index_schedule_loading = true
                var requests = [];
                if (this.$store.state.all_schedules.length == 0) {
                    requests['getSchedules'] = this.getSchedules()
                }
                else {
                    this.index_schedule_loading = false
                }
                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        const getSchedules = val[0]['getSchedules'];
                        if (typeof getSchedules !== 'undefined') {
                            getSchedules.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_schedules = res.data.msg
                                    this.index_schedule_loading = false
                                    // clearInterval(t)
                                    // let t = setInterval(() => {
                                    //     if (!$.fn.dataTable.isDataTable( '.dtsched' )) {
                                    //         $('.dtsched').DataTable({ ordering: true });
                                    //     }
                                    // }, 500)
                                }
                            }).catch(err => console.log(err))
                        }
                    });

                }
                catch (e) {
                    console.log(e)
                }
            },

            addSchedule () {
                this.create_schedule_loading = true
                this.new_sched.added_by = this.$session.get('auth')['user_id'];
                this.new_sched.days = this.new_sched.days.filter(x => x != null);

                if(this.new_sched.days.length == 7){ // Check length of days
                    let r = this.axiosRequest('POST', this.$store.state.application_api + '/schedule', this.new_sched, this.$session.get('headers'))
                    r.then(res => {
                        if (res.data.status != "failed") {
                            this.notif = { style: 'alert-success', message: 'Added complete!', icon: 'fa-check-circle' }
                            this.reloadSchedules()
                            this.notif = ''
                        }
                        else {
                            this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                        }
                        this.create_schedule_loading = false
                    })
                    r.catch(err => console.log(err))
                }else{ // if days length is invalid
                    this.notif = { message: 'Invalid days', style: 'alert-danger', icon: 'fa-times-circle' }
                    this.create_schedule_loading = false
                }

            },

            updateDefaultSched (id) {
                this.update_schedule_loading = true
                let r = this.axiosRequest('POST', this.$store.state.application_api + '/schedule/default/' + id, null, this.$session.get('headers'))
                r.then(res => {
                    if (res.data.status != "failed") {
                        this.reloadSchedules()
                        this.update_schedule_loading = false
                    }
                })
                r.catch(err => console.log(err))
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
