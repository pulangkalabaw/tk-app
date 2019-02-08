<template>
    <div class="main__cont">
        <div>
            <div class="main-heading">
                <ol class="breadcrumb">
                    <li>Profile</a></li>
                    <li class="active">My Profile</li>
                </ol>
            </div>
            <div class="container-fluid half-padding">
                <div class="template template__blank">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <div class="panel-title">
                                        <label class="text-left">My Profile
                                            <span v-if="show_profile_loading">
                                                <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                            </span>
                                        </label>
                                        <label class="pull-right" v-if="!show_profile_loading">
                                            <label class="btn btn-xs btn-default" @click="redirect('profile.edit', { tenant: $route.params.tenant })"><span class='fa fa-edit fa-active'></span></label>
                                        </label>
                                    </div>
                                </div>

                                <div class="panel-body" v-if="!show_profile_loading">
                                    <!-- start of nav tab -->
                                    <ul class="nav nav-tabs">

                                        <li class="active">
                                            <a data-toggle="tab" href="#gi"><span class="fa fa-info-circle"></span> General Information</a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#pin"><span class="fa fa-asterisk"></span> Change Pin</a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#pwd"><span class="fa fa-lock"></span> Change Password</a>
                                        </li>
                                    </ul>
                                    <!-- end of nav tab -->
                                    <div class="tab-content">
                                        <!-- GI -->
                                        <div id="gi" class="tab-pane fade in active">
                                            <div class="container-fluid float-left">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <center v-if="employee.users.image != 'Photo.png'">
                                                            <img :src="$store.state.image_url + $route.params.tenant + '/images/users/' +employee.users.image" alt="" width="90%">
                                                        </center>
                                                        <center v-else>
                                                            <img :src="$store.state.image_url + 'Photo.png'" alt="" width="90%">
                                                        </center>
                                                    </div>
                                                    <div class="col-md-9">
                                                        <h2><span class='fa fa-user'></span> General Information</h2>
                                                        <table class="col-md-12">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="25%">Fullname: </td>
                                                                    <td width="75%">{{ fullname }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Email: </td>
                                                                    <td width="75%">{{ employee.email }}</td>
                                                                </tr>                                                               
                                                                <tr>
                                                                    <td width="25%">Employee #: </td>
                                                                    <td width="75%">{{ employee.emp_num }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Contact #: </td>
                                                                    <td width="75%">{{ employee.users.cell_num }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Bundee: </td>
                                                                    <td width="75%">
                                                                        <label v-if="employee.work_location != ''">
                                                                            <span v-for="(bun, index) in employee.work_location.timetrack">
                                                                                {{ showBundeeName(bun.bundee) }}
                                                                                <span v-if="index != employee.work_location.timetrack.length - 1">
                                                                                    <b>, </b>
                                                                                </span>
                                                                            </span>
                                                                        </label>
                                                                        <label v-else>
                                                                            None
                                                                        </label>
                                                                    </td>
                                                                </tr>   
                                                                <tr>
                                                                    <td width="25%">Work location: </td>
                                                                    <td width="75%">
                                                                        {{ employee.work_location.branch_name }}
                                                                    </td>
                                                                </tr>        
                                                                <tr v-if="employee.emp_sched[0].work_locations.length !== 0">
                                                                    <td width="25%">Assigned kiosks: </td>
                                                                    <td width="75%">
                                                                         <span v-for="wlocs in employee.emp_sched">
                                                                            <span v-for="(alocs,index) in wlocs.work_locations">
                                                                                {{ alocs.branch_name }}
                                                                                <span v-if="index != wlocs.work_locations.length - 1">
                                                                                    ,
                                                                                </span>
                                                                            </span>
                                                                        </span>
                                                                    </td>
                                                                </tr>                                                      
                                                                <tr>
                                                                    <td width="25%">Approver: </td>
                                                                    <td width="75%">
                                                                        <label v-if=" employee.reports_to != ''">
                                                                            <span v-for="(emp, index) in employee.reports_to">
                                                                                {{ emp.fname + ' ' + emp.lname }}
                                                                                <span v-if="index != employee.reports_to.length - 1">
                                                                                    <b>, </b>
                                                                                </span>
                                                                            </span>
                                                                        </label>
                                                                        <label v-else>None</label>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Roles: </td>
                                                                    <td width="75%">
                                                                        {{ employee.user_role.role }}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Schedule: </td>
                                                                    <td width="75%">
                                                                        <label v-if=" employee.emp_sched != ''">
                                                                            {{ employee.emp_sched[0].sched_name + ' (' + new Date('7/10/2013 '+employee.emp_sched[0].shift_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") + ' - ' + new Date('7/10/2013 '+employee.emp_sched[0].shift_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") + ')' }}
                                                                        </label>
                                                                        <label v-else>None</label>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Days: </td>
                                                                    <td width="75%">
                                                                        <label v-if=" $session.get('auth')['schedule']['days']">
                                                                            <span v-for="days in JSON.parse($session.get('auth')['schedule']['days'])">
                                                                                <span v-if="days.type == 1">{{ days.day }} <small>(REG)</small>&nbsp;</span>
                                                                            </span>
                                                                        </label>
                                                                        <label v-else>None</label>
                                                                    </td>
                                                                </tr>
                                                                <!-- added by ryann: tag start -->
                                                                <tr v-if="employee.change_queue != null">
                                                                  <td width="25%">Employee Change Sched:</td>
                                                                  <td width="75%">
                                                                    <label>{{ employee.change_queue }}</label>
                                                                    <small @click="openChangeQueModal()"><a><span class="fa fa-info-circle"></span> Info</a></small>
                                                                </td>
                                                            </tr>
                                                            <!-- added by ryann: tag end -->
                                                        </tbody>
                                                    </table>
                                                    <br>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- ./GI -->

                                    <!-- CHANGE PIN -->
                                    <div id="pin" class="tab-pane fade">
                                        <div class="container-fluid float-left">

                                            <form action="" v-on:submit.prevent="changePin()">

                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <!-- notif -->
                                                        <notif :notif="notif"></notif>
                                                        <!-- end of notif -->
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-2">
                                                        <label for=""><strong>Old pin:</strong></label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="password" maxlength="4" class="form-control input-sm" v-model="pinform.old_pin" required=""><br>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        <label for=""><strong>New pin:</strong></label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="password" maxlength="4" class="form-control input-sm" v-model="pinform.pin"  required><br>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        <label for=""><strong>Retype new pin:</strong></label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="password" maxlength="4" class="form-control input-sm" v-model="pinform.pin_confirmation"  required><br>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <button type="submit" :disabled="update_pin_loading" class="btn btn-xs btn-success">Change pin <span class='fa fa-edit'></span> </button>
                                                        <span v-if="update_pin_loading">
                                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <br>
                                    </div>
                                    <!-- END OF CHANGE PIN -->

                                    <!-- CHANGE PASSWORD -->
                                    <div id="pwd" class="tab-pane fade">
                                        <div class="container-fluid float-left">

                                            <form action="" v-on:submit.prevent="changePassword()">

                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <!-- notif -->
                                                        <notif :notif="password_notif"></notif>
                                                        <!-- end of notif -->
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-2">
                                                        <label for=""><strong>Old password:</strong></label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="password" class="form-control input-sm" v-model="passwordform.old_password" required><br>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        <label for=""><strong>New password:</strong></label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="password" class="form-control input-sm" v-model="passwordform.password" required><br>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-2">
                                                        <label for=""><strong>Retype new password:</strong></label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="password" class="form-control input-sm" v-model="passwordform.password_confirmation" required><br>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <button type="submit" :disabled="update_password_loading" class="btn btn-xs btn-success">Change password <span class='fa fa-edit'></span> </button>
                                                        <span v-if="update_password_loading">
                                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <br>
                                    </div>
                                    <!-- END OF CHANGE PIN -->

                                </div>

                                <!-- change queue modal start -->
                                <div class="modal fade in"  id="view_change_que" v-if="!show_employee_que_loading">
                                  <div class="modal-dialog">
                                    <div class="modal-content">

                                      <!-- modal header start -->
                                      <div class="modal-header">
                                        <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title">Employee Queue Info</h4>
                                    </div>
                                    <!-- modal header end -->

                                    <!-- modal body start -->
                                    <div class="modal-body">
                                        <div class="row">
                                          <!-- current employee schedule start -->
                                          <div class="col-md-12">
                                            <div class="breadcrumb">
                                              <h4>Current Employee Schedule</h4>
                                              <div class="row">

                                                  <div class="col-md-4">
                                                    <label><strong>Fullname:</strong></label>
                                                    <p>{{ fullname }}</p>
                                                </div>

                                                <div class="col-md-4">
                                                    <label><strong>Bundee:</strong></label>
                                                    <p>
                                                      <span v-for="(bun, index) in employee.work_location.timetrack" v-bind:key="bun.id">
                                                        {{ showBundeeName(bun.bundee) }}
                                                        <span v-if="index != employee.work_location.timetrack.length - 1">
                                                          <b>, </b>
                                                      </span>
                                                  </span>
                                              </p>
                                          </div>

                                          <div class="col-md-4">
                                            <label><strong>Location:</strong></label>
                                            <p>{{ employee.work_location.branch_name }}</p>
                                        </div>

                                        <div class="col-md-12">
                                            <label><strong>Schedule:</strong></label>
                                            <p>{{ employee.emp_sched[0].sched_name + ' (' + new Date('7/10/2013 '+employee.emp_sched[0].shift_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") + ' - ' + new Date('7/10/2013 '+employee.emp_sched[0].shift_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") + ')' }}</p>
                                            <p>Day:
                                              <small>
                                                <span v-for="(day, index) in employee.emp_sched[0].days" v-bind:key="day.id">
                                                  {{ day.day }} <small v-if="day.type ==1">(REG)</small> <small v-else>(RD)</small>
                                                  <span v-if="index != employee.emp_sched[0].days.length - 1">
                                                    <b>, </b>
                                                </span>
                                            </span>
                                        </small>
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!-- current employee schedule end -->

                    <!-- new employee schedule start -->
                    <div class="col-md-12" v-if="employee_que != null">
                        <div class="breadcrumb">
                          <h4>New Employee Schedule
                            <small class="pull-right" style="font-size: 12px;">Date Start: {{ employee_que.date_start }}</small>
                        </h4>
                        <div class="row">

                          <div class="col-md-4">
                            <label><strong>Fullname:</strong></label>
                            <p>{{ fullname }}</p>
                        </div>

                        <div class="col-md-4">
                            <label><strong>Bundee:</strong></label>
                            <p>
                              <span v-for="(bun, index) in employee_que.bundee" v-bind:key="bun.id">
                                {{ showBundeeName(bun.bundee) }}
                                <span v-if="index != employee_que.bundee.length - 1">
                                  <b>, </b>
                              </span>
                          </span>
                      </p>
                  </div>

                  <div class="col-md-4">
                    <label><strong>Location:</strong></label>
                    <p>{{ employee_que.location }}</p>
                </div>

                <div class="col-md-12">
                    <label><strong>Schedule:</strong></label>
                    <p>{{ employee_que.sched_name + ' (' + new Date('7/10/2013 '+employee_que.shift_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") + ' - ' + new Date('7/10/2013 '+employee_que.shift_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") + ')' }}</p>
                    <p>Day:
                      <small>
                        <span v-for="(day, index) in employee_que.days" v-bind:key="day.id">
                          {{ day.day }} <small v-if="day.type ==1">(REG)</small> <small v-else>(RD)</small>
                          <span v-if="index != employee_que.days.length - 1">
                            <b>, </b>
                        </span>
                    </span>
                </small>
            </p>
        </div>
    </div>
</div>
</div>
<!-- new employee schedule end -->
</div>
</div>
<!-- modal body end -->

</div>
</div>
</div>
<!-- change queue modal end -->
</div>
<div class="panel-body" v-else>
    Loading please wait..
</div>
</div>
</div>
</div>

<!-- Stats -->
<!-- ./Stats -->
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
                employee: {},
                employee_que: [],
                sched_id: '',
                date_start: '',
                timetable: '',
                alltime: '',
                pinform: {},
                passwordform: {},
                dates: '',
                sched: '',
                edtr_loading: '',
                notif: '',
                password_notif: '',
                show_profile_loading: true,
                update_pin_loading: false,
                update_password_loading: false,
                show_employee_que_loading: true,
            }
        },

        computed: {
            fullname: function() {
                return this.employee.users.fname + ' ' + this.employee.users.lname;
            },
        },

        created () {
            this.init();
        },

        methods: {

            async init () {

                var requests = [];

                requests['showEmployee'] = this.showEmployee()

                if (this.$store.state.all_schedules.length == 0) {
                    requests['getSchedules'] = this.getSchedules()
                }

                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        const showEmployee = val[0]['showEmployee'];
                        const getSchedules = val[0]['getSchedules'];

                        showEmployee.then(res => {
                            if(res.data.status != "failed"){
                                this.employee = res.data.msg[0]
                                this.show_profile_loading = false
                                this.showEmployeeQue()
                            }
                            else{
                                this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                            }
                        }).catch(err => console.log(err))

                        if (typeof getSchedules !== 'undefined') {
                            getSchedules.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_schedules = res.data.msg
                                    this.$store.state.loading = false
                                }
                            }).catch(err => console.log(err))
                        }

                    });

                }
                catch (e) {
                    console.log(e)
                }
            },

            changePin(){
                this.update_pin_loading = true
                this.notif = { message: 'Loading please wait..', style: 'alert-info', icon: 'fa-info-circle' }

                let params = {
                    old_pin: this.pinform.old_pin,
                    pin: this.pinform.pin,
                    pin_confirmation: this.pinform.pin_confirmation,
                }

                this.axiosRequest('post', this.$store.state.application_api+'/employee/changepin/'+this.$session.get('auth')['user_id'], params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ message: 'Pin changed!', title: 'Profile' })
                        this.notif = '';
                    }
                    else{
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }
                    this.update_pin_loading = false
                })
                .catch(err => console.log(err))
            },

            changePassword(){
                this.update_password_loading = true
                this.password_notif = { message: 'Loading please wait..', style: 'alert-info', icon: 'fa-info-circle' }

                let params = {
                    old_password: this.passwordform.old_password,
                    password: this.passwordform.password,
                    password_confirmation: this.passwordform.password_confirmation,
                }

                this.axiosRequest('post', this.$store.state.application_api+'/employee/changepassword/'+this.$session.get('auth')['user_id'], params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ message: 'Password changed!', title: 'Profile' })
                        this.password_notif = '';
                    }
                    else{
                        this.password_notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }
                    this.update_password_loading = false
                })
                .catch(err => console.log(err))
            },

            showEmployee(){
                return this.axiosRequest('GET', this.$store.state.application_api+'/employee/' + this.$session.get('auth')['user_id'], null, this.$session.get('headers'))
            },

            tooltipText (text) {
                $('[data-toggle="tooltip"]').tooltip().attr('data-original-title', text);
                return text;
            },

            //added by ryann 1/11/19
            showEmployeeQue(){
              this.show_employee_que_loading = true
              this.axiosRequest('GET', this.$store.state.application_api+'/employee_que/' + this.employee.que_id, null, this.$session.get('headers'))
              .then(res => {
                if(res.data.status != "failed"){
                  this.employee_que = res.data.msg[0]
                  this.show_employee_que_loading = false
              }
          }).catch(err => console.log(err))
          },

            //added by ryann 1/11/19
            openChangeQueModal(){
              $('#view_change_que').modal('show')
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

<style>
.txt-sm { font-size: 10px; }
</style>
