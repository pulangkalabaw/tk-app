<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li><a style="cursor: pointer;" @click="redirect('schedules.index', { tenant: $route.params.tenant})">Schedules</a></li>
                <li class="active" v-if="!show_schedule_loading">{{ schedule.sched_name }}</li>
                <li class="active" v-else>
                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span>
                </li>

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
                                        <label class="btn btn-xs btn-default" @click="redirect('schedules.edit', { tenant: $route.params.tenant, id: schedule.sched_id })"><span data-toggle="tooltip" title="Edit" class='fa fa-edit fa-active'></span></label>
                                    </label>
                                </div>
                            </div>
                            <div class="panel-body">

                                <div v-if="!show_schedule_loading">
                                    <h2>General Information
                                        <span class='fa fa-star' v-if="schedule.default_sched == 1" data-toggle="tooltip" title="Default Schedule"></span>
                                    </h2>
                                    <div class="col-md-8">
                                        <div class="row">
                                            <div class="col-md-3">Schedule name:</div>
                                            <div class="col-md-9">
                                                {{ schedule.sched_name }}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">Day:</div>
                                            <div class="col-md-9">
                                                <span v-for="(day, index) in schedule.day">
                                                    {{ day.day }} <small v-if="day.type == 1">(REG)</small><small v-else>(RD)</small>
                                                    <span v-if="index != schedule.day.length - 1">
                                                        <b>, </b>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>


                                        <div class="row">
                                            <div class="col-md-3">Shift:</div>
                                            <div class="col-md-9">
                                                {{ toHumanTime(schedule.shift_in) }} -
                                                {{ toHumanTime(schedule.shift_out) }}
                                            </div>
                                        </div>


                                        <div class="row">
                                            <div class="col-md-3">Remarks:</div>
                                            <div class="col-md-9">
                                                {{ schedule.remarks }}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">Grace Period:</div>
                                            <div class="col-md-9">
                                                {{ schedule.grace_period }}
                                            </div>
                                        </div>

                                        <div class="row" v-if="schedule.added_by != ''">
                                            <div class="col-md-3">Added by</div>
                                            <div class="col-md-9">
                                                {{ schedule.added_by[0].fname }}
                                                {{ schedule.added_by[0].mname }}
                                                {{ schedule.added_by[0].lname }}
                                            </div>
                                        </div>

                                        <div class="row" v-if="schedule.change_que != null">
                                          <div class="col-md-3">Schedule Change</div>
                                          <div class="col-md-9">
                                            {{ schedule.change_que }}
                                            <small @click="openChangeQueModal()"><a><span class="fa fa-info-circle"> Info</span></a></small>
                                          </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else>
                                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- change queue modal start -->
        <div class="modal fade in" v-if="!show_schedule_que_loading" id="view_change_que">
          <div class="modal-dialog">
            <div class="modal-content">

              <!-- modal header start -->
              <div class="modal-header">
                <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Schedule Change</h4>
              </div>
              <!-- modal header end -->

              <!-- modal body start -->
              <div class="modal-body">
                <div class="row">
                  <!-- current schedule start -->
                  <div class="col-md-12">
                    <div class="breadcrumb">
                      <h4>Current Schedule</h4>
                        <div class="row">
                          <div class="col-md-4">
                            <label><strong>Schedule Name:</strong></label>
                            <p>{{ schedule.sched_name }}</p>
                          </div>

                          <div class="col-md-4">
                            <label><strong>Grace Period:</strong></label>
                            <p>{{ schedule.grace_period }}</p>
                          </div>

                          <div class="col-md-4">
                            <label><strong>Shift:</strong></label>
                            <p>
                              {{ toHumanTime(schedule.shift_in) }} -
                              {{ toHumanTime(schedule.shift_out) }}
                            </p>
                          </div>

                          <div class="col-md-12">
                            <label><strong>Remarks:</strong></label>
                            <p>{{ schedule.remarks }}</p>
                          </div>

                          <div class="col-md-12">
                            <label><strong>Day:</strong></label>
                            <p>
                              <span v-for="(day, index) in schedule.day" v-bind:key="day.id">
                                  {{ day.day }} <small v-if="day.type == 1">(REG)</small><small v-else>(RD)</small>
                                  <span v-if="index != schedule.day.length - 1">
                                      <b>, </b>
                                  </span>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- current schedule end -->

                    <!-- new schedule start -->
                    <div class="col-md-12" v-if="schedule_que != null">
                      <div class="breadcrumb">
                        <h4>New Schedule
                          <small class="pull-right" style="font-size: 12px;">Date Start: {{ schedule_que.date_start }}</small>
                        </h4>
                          <div class="row">
                            <div class="col-md-4">
                              <label><strong>Schedule Name:</strong></label>
                              <p>{{ schedule_que.sched_name }}</p>
                            </div>

                            <div class="col-md-4">
                              <label><strong>Grace Period:</strong></label>
                              <p>{{ schedule_que.grace_period }}</p>
                            </div>

                            <div class="col-md-4">
                              <label><strong>Shift:</strong></label>
                              <p>
                                {{ toHumanTime(schedule_que.shift_in) }} -
                                {{ toHumanTime(schedule_que.shift_out) }}
                              </p>
                            </div>

                            <div class="col-md-12">
                              <label><strong>Remarks:</strong></label>
                              <p>{{ schedule_que.remarks }}</p>
                            </div>

                            <div class="col-md-12">
                              <label><strong>Day:</strong></label>
                              <p>
                                <span v-for="(day, index) in schedule_que.day" v-bind:key="day.id">
                                    {{ day.day }} <small v-if="day.type == 1">(REG)</small><small v-else>(RD)</small>
                                    <span v-if="index != schedule.day.length - 1">
                                        <b>, </b>
                                    </span>
                                </span>
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                    <!-- new schedule end -->
                  </div>
                </div>

              </div>
              <!-- modal body end -->
            </div>
          </div>
        </div>
        <!-- change queue modal end -->
    </div>
</template>

<script>

    export default {

        data () {
            return {
                paginate: '',
                total: 0,
                notif: '',
                schedule: '',
                schedule_que: [],
                show_schedule_loading: true,
                show_schedule_que_loading: true,
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
                    getScheduleShow: () => this.getScheduleShow(),
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
                            this.show_schedule_loading = false
                            this.getScheduleQueShow()
                        }
                    }).catch(err => console.log(err))
                }
                catch (err) {
                    console.log(err)
                }
            },

            getScheduleShow (route = "") {
                this.show_schedule_loading = true
                return this.axiosRequest('GET', this.$store.state.application_api + '/schedule/' + this.$route.params.id + '?search=' + this.$store.state.search, null, this.$session.get('headers'))
            },

            getScheduleQueShow () {
              this.show_schedule_que_loading = true
              this.axiosRequest('GET', this.$store.state.application_api + '/schedule_que/' + this.schedule.que_id, null, this.$session.get('headers'))
              .then(res => {
                if (res.data.status != "failed") {
                  this.total = res.data.msg.length
                  this.schedule_que = res.data.msg[0]
                  this.show_schedule_que_loading = false
                }
              }).catch(err => console.log(err))
            },

            openChangeQueModal(){
              $('#view_change_que').modal('show')
            }
        },

    }

</script>
