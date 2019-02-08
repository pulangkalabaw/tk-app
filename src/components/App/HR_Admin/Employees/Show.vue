<template>
    <div class="main__cont">

        <!-- Change Sched Modal -->
        <div class="modal fade in" id="select_location"  v-if="!show_employee_loading"  :class="{ 'show': !hide_change_sched }">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Change Schedule</h4>
                    </div>
                    <div class="modal-body">
                        <h5>Select schedule</h5>
                        <div v-for="sched in $store.state.all_schedules" data-toggle="tooltip" title="Click to select">
                            <div class="col-md-6">
                                <div class="breadcrumb">

                                    <label v-if="employee.emp_sched != ''">
                                        <label v-if="employee.emp_sched[0].sched_id == sched.sched_id">
                                            {{ sched.sched_name }}
                                        </label>
                                        <label v-else>
                                            <b><input type="radio" v-model="sched_id" :disabled="employee.emp_sched[0].sched_id == sched.sched_id" :value="sched.sched_id" :id="'sched_id' + sched.sched_id"> <label :for="'sched_id' + sched.sched_id">{{ sched.sched_name }}</label></b>
                                        </label>
                                    </label>
                                    <label v-else>
                                        <b><input type="radio" v-model="sched_id" :value="sched.sched_id" :id="'sched_id' + sched.sched_id"> <label :for="'sched_id' + sched.sched_id">{{ sched.sched_name }}</label></b>
                                    </label>

                                    <span class='fa fa-star' v-if="sched.default_sched == 1"></span> <br>
                                    {{ toHumanTime(sched.shift_in) }} -
                                    {{ toHumanTime(sched.shift_out) }}<br>
                                    <span v-for="(day, index) in sched.day">
                                        <span v-if="day.type == 1">{{ shortDayName(day.day) }}</span>
                                        <span v-if="index == sched.day.length - 1">
                                            <b> (REG) </b>
                                        </span>
                                    </span>
                                    <br>
                                    <span v-for="(day, index) in sched.day">
                                        <span v-if="day.type == 0">{{ shortDayName(day.day) }}</span>
                                        <span v-if="index == sched.day.length - 1">
                                            <b> (RD) </b>
                                        </span>
                                    </span>

                                </div>
                            </div>
                            
                        </div>
                        <div class="clearfix"></div><br>
                        <h5>Effective date start</h5>
                        <input type="date" v-model="date_start" id="" class="form-control">

                    </div>
                    <div class="modal-footer">
                        <div class="row">
                            <div class="col-md-12">
                                <span v-if="update_employee_loading">
                                    <span class='fa fa-refresh fa-spin'></span>
                                </span>
                                <button class="btn btn-default" type="button" :disabled="update_employee_loading" data-dismiss="modal" @click="hide_change_sched = true">Cancel</button>
                                <button class="btn btn-default" type="button" :disabled="update_employee_loading" data-dismiss="modal" @click="updateSchedule()">Update changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- Change Bundee Modal -->
        <div class="modal fade in" id="select_bundee" v-if="!show_employee_loading" :class="{ 'show': !hide_change_bundee }">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Change Bundee</h4>
                    </div>
                    <div class="modal-body">
                        <h3>Current Bundee:
                            <span v-if="employee.work_location.timetrack != null">
                                <span v-for="(bun, index) in employee.work_location.timetrack" v-bind:key="bun.id">
                                    {{ showBundeeName(bun.bundee) }}
                                    <span v-if="index != employee.work_location.timetrack.length - 1">
                                        <b>, </b>
                                    </span>
                                </span>
                            </span>
                            <span v-else>
                                -
                            </span>
                        </h3>
                        <hr>
                        <h5>Select bundee</h5>
                        <span class="checkbox" v-if="!index_bundees_loading">
                            <span v-for="(bun, index) in $store.state.all_bundees" style="margin-right: 25px;">
                                <span v-if="employee.work_location.timetrack != null">


                                    <input v-model="trackers" :id="parseInt(bun.timetrack_id) + 'c'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" type="checkbox" checked="checked">
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-if="bun.name == 'kiosk'">Kiosk</label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'mobile'">Mobile</label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'edtr'">EDTR</label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'third_party_biometrics'">Biometrics (Third Party) </label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else>Unkown reference</label>


                                    <!-- <span v-if="employee.work_location.timetrack.filter(x => x.bundee == bun.name).length == 0">
                                        <input v-model="trackers" :id="parseInt(bun.timetrack_id) + 'c'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" type="checkbox" checked="checked">
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-if="bun.name == 'kiosk'">Kiosk</label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'mobile'">Mobile</label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'edtr'">EDTR</label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'third_party_biometrics'">Biometrics (Third Party) </label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else>Unkown reference</label>
                                    </span>
                                    <span v-else>
                                        <input v-model="trackers" :id="parseInt(bun.timetrack_id) + 'c'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" type="checkbox">
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-if="bun.name == 'kiosk'">Kiosk</label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'mobile'">Mobile</label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'edtr'">EDTR</label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'third_party_biometrics'">Biometrics (Third Party) </label>
                                        <label :for="parseInt(bun.timetrack_id) + 'c'" v-else>Unkown reference</label>
                                    </span> -->
                                </span>
                                <span v-else>
                                    <input v-model="trackers" :id="parseInt(bun.timetrack_id) + 'c'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" type="checkbox" checked="checked">
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-if="bun.name == 'kiosk'">Kiosk</label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'mobile'">Mobile</label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'edtr'">EDTR</label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else-if="bun.name == 'third_party_biometrics'">Biometrics (Third Party) </label>
                                    <label :for="parseInt(bun.timetrack_id) + 'c'" v-else>Unkown reference</label>
                                </span>
                            </span>
                        </span>
                        <br>
                        <h5>Effective date start</h5>
                        <input type="date" v-model="date_start_bundee" id="" class="form-control">
                    </div>
                    <div class="modal-footer">
                        <div class="row">
                            <div class="col-md-12">
                                <span v-if="update_employee_loading">
                                    <span class='fa fa-refresh fa-spin'></span>
                                </span>
                                <button class="btn btn-default" type="button" :disabled="update_employee_loading" data-dismiss="modal" @click="hide_change_bundee = true">Cancel</button>
                                <button class="btn btn-default" type="button" disabled="" data-dismiss="modal">Use your location bundee</button>
                                <button class="btn btn-default" type="button" :disabled="update_employee_loading" data-dismiss="modal" @click="customBundee()">Update Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End of Change bundee modal -->

        <div>
            <div class="main-heading">
                <ol class="breadcrumb">
                    <li><a style="cursor: pointer;" @click="redirect( 'dashboard', { tenant: $route.params.tenant})">HR Administrator</a></li>
                    <li><a style="cursor: pointer;" @click="redirect( 'employees.index', { tenant: $route.params.tenant})">Employees</a></li>
                    <li v-if="!show_employee_loading">
                        <a style="cursor: pointer;" @click="redirect('employees.show', { tenant: $route.params.tenant, id: $route.params.id })">{{ employee.users.fname+' '+ employee.users.lname }}</a>
                    </li>
                    <li v-else>
                        <span class='fa fa-spin' :class="$store.state.page_load_icon"></span>
                    </li>
                </ol>
            </div>

            <div class="container-fluid half-padding">
                <div class="template template__blank">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <div class="panel-title">
                                        <label class="text-left">Employee
                                            <span v-if="show_employee_loading">
                                                <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                            </span>
                                        </label>
                                        <label class="pull-right" v-if="!show_employee_loading">
                                            <label class="btn btn-xs btn-default" @click="redirect('employees.edit', { tenant: $route.params.tenant, id: employee.users.user_id })"><span class='fa fa-edit fa-active'></span></label>
                                        </label>
                                    </div>
                                </div>

                                <div class="panel-body" v-if="!show_employee_loading">
                                    <!-- start of nav tab -->
                                    <ul class="nav nav-tabs">

                                        <li class="active">
                                            <a data-toggle="tab" href="#gi"><span class="fa fa-info-circle"></span> General Information</a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#dtr"><span class="fa fa-calendar"></span>
                                                Timesheet
                                                <span v-if="edtr_loading">
                                                    <span class='fa fa-refresh fa-spin'></span>
                                                </span>
                                                <span v-else>
                                                    <span class='fa fa-refresh' @click="reloadDtr()" data-toggle="tooltip" title="Refresh data"></span>
                                                </span>
                                            </a>
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
                                                        <h2>General Information</h2>
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
                                                                    <td width="25%">Contact #: </td>
                                                                    <td width="75%">{{ employee.users.cell_num }}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Employee #: </td>
                                                                    <td width="75%">{{ employee.emp_num }}</td>
                                                                </tr>                                                                
                                                                <tr>
                                                                    <td width="25%">Bundee: </td>
                                                                    <td width="75%">
                                                                        <label v-if=" employee.work_location != ''">
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
                                                                        <!-- <a @click="bundeeOnOpenModal(employee.work_location.timetrack)"><small>change</small></a> -->
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="25%">Work location: </td>
                                                                    <td width="75%">
                                                                        {{ employee.work_location.branch_name }}
                                                                    </td>
                                                                </tr> 
                                                                <tr v-if="(employee.emp_sched[0].work_locations !== null && findkiosk.length !== 0) ? (employee.emp_sched[0].work_locations.length !== 0) : false">
                                                                    <td width="25%">Assigned kiosks:</td>
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
                                                                        <small @click="hide_change_sched = false"><a>change</a></small>
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
                                        <!-- DTR -->
                                        <div id="dtr" class="tab-pane fade in">

                                            <div v-if="!edtr_loading">
                                                <!-- if all fields are okay -->
                                                <show-timetable :enableAdjustment="false" :profile="false"></show-timetable>
                                            </div>
                                            <div v-else>
                                                Loading please wait..
                                            </div>
                                            <!-- ./DTR -->
                                        </div>
                                    </div>
                                </div>
                                <div class="panel-body" v-else>
                                    Loading please wait..
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Stats -->
                    <stats :user_id="$route.params.id"></stats>
                    <late :user_id="$route.params.id"></late>

                    <!-- ./Stats -->
                </div>
            </div>
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

</template>

<script>

    import Vue from "vue";
    import JsonExcel from "vue-json-excel";
    import Stats from "@/components/App/HR_Admin/Employees/Extra/_Stats";
    import Late from "@/components/App/HR_Admin/_DashboardComponents/Widgets/Late";
    import DTR from "@/components/App/Timetable/Extra/_ShowTimeTable";

    Vue.component("downloadExcel", JsonExcel);
    export default {

        components: { 'stats': Stats, 'late': Late, 'show-timetable': DTR },

        data () {
            return {
                employee: '',
                //added by ryann 1/9/19
                employee_que: [],
                sched_id: '',
                date_start: '',
                custom_bundee_type: '',
                date_start_bundee: '',
                dashboards: [],
                dashboards_loading: true,
                hide_change_sched: true,
                hide_change_bundee: true,
                timetable: '',
                alltime: '',
                dates: '',
                sched: '',
                edtr_loading: '',
                schedule_loading: '',
                show_employee_loading: true,
                show_employee_que_loading: true,
                index_schedules_loading: true,
                update_employee_loading: false,
                index_bundees_loading: true,
                trackers: [],
            }
        },

        computed: {
            fullname: function() {
                return this.employee.users.fname + ' ' + this.employee.users.lname;
            },

            excel_download_link: function() {
                let filename = this.employee.emp_num + '-' + this.employee.users.lname + ' ' + this.employee.users.fname
                return this.$store.state.excel + '/download?edtr=' + JSON.stringify(this.timetable) + '&filename=' + filename
            },

            trackersTick () {
                return this.trackers;
            },

            findkiosk () {
                let filteredbundee = this.employee.work_location.timetrack;
                // return filteredbundee = filteredbundee.filter(x => x.id == 1000)
                return filteredbundee = filteredbundee.filter(res => {
                    return res.id == 1000;
                });
            },
        },

                updated () {

            if (this.trackers.length == 0) {
                this.employee.work_location.timetrack.forEach(key => {
                    console.log(key.id)

                    // Kiosk & Mobile
                    if (key.id == 1000 || key.id == 1003) {

                        // Checked Kiosk
                        $('#' + 1000 + "c").prop('checked', true); 
                        $('#' + 1003 + "c").prop('checked', true); 

                        // Disabled EDTR and Third Party
                        // $('#' + 1001 + "c").attr("disabled", true);
                        // $('#' + 1002 + "c").attr("disabled", true);

                    }

                    // EDTR
                    else if (key.id == 1001) {
                        $('#' + 1001 + "c").prop('checked', true); 

                        // Disabled All except Edtr
                        // $('#' + 1000 + "c").attr("disabled", true);
                        // $('#' + 1002 + "c").attr("disabled", true);
                        // $('#' + 1003 + "c").attr("disabled", true);
                    }

                    // Third Party
                    else if (key.id == 1002) {
                        $('#' + 1002 + "c").prop('checked', true); 

                        // Disabled All except Third Party
                        // $('#' + 1000 + "c").attr("disabled", true);
                        // $('#' + 1001 + "c").attr("disabled", true);
                        // $('#' + 1003 + "c").attr("disabled", true);
                    }
                    
                })
            }

        },

        watch: {
            trackersTick () {
                let selected_id = this.trackers.map(function (r) {
                    return r.id
                });

                this.$store.state.all_bundees.forEach (key => {

                    // Clicked EDTR
                    if (selected_id.filter(x => x == 1001).length != 0) {

                        // to prevent disabling itself
                        if (parseInt(key.timetrack_id) != 1001) { 
                            $('#' + parseInt(key.timetrack_id) + "c").prop('checked', false); 
                            $('#' + parseInt(key.timetrack_id) + "c").attr("disabled", true);
                        }

                    }
                    

                    // Clicked Third Party
                    else if (selected_id.filter(x => x == 1002).length != 0) {

                        // to prevent disabling itself
                        if (parseInt(key.timetrack_id) != 1002) { 
                            $('#' + parseInt(key.timetrack_id) + "c").prop('checked', false); 
                            $('#' + parseInt(key.timetrack_id) + "c").attr("disabled", true);
                        }
                    }
                    


                    // Clicked KIOSK
                    else if (selected_id.filter(x => x == 1000).length != 0) {

                        // to prevent disabling edtr and third_party
                        if (![1000, 1003].includes(parseInt(key.timetrack_id))) { 
                            $('#' + parseInt(key.timetrack_id) + "c").prop('checked', false); 
                            $('#' + parseInt(key.timetrack_id) + "c").attr("disabled", true);
                        }
                        
                    }
                    

                    // Clicked Mobile
                    else if (selected_id.filter(x => x == 1003).length != 0) {

                        // to prevent disabling edtr and third_party
                        if (![1000, 1003].includes(parseInt(key.timetrack_id))) { 
                            $('#' + parseInt(key.timetrack_id) + "c").prop('checked', false); 
                            $('#' + key.timetrack_id + "c").attr("disabled", true);
                        }
                    }

                    else {
                        $('#' + key.timetrack_id + "c").removeAttr('disabled');
                        $('#' + parseInt(key.timetrack_id) + "c").prop('checked', false); 
                    }


                }) 

            }
        },

        created () {
            this.init();
            this.getFinalDtr();

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

            async init () {

                var requests = [];

                requests['showEmployee'] = this.showEmployee()
                // requests['showEmployeeQue'] = this.showEmployeeQue()

                if (this.$store.state.all_bundees.length == 0) {
                    requests['getBundees'] = this.getBundees()
                }
                else {
                    this.index_bundees_loading = false;
                }

                if (this.$store.state.all_schedules.length == 0) {
                    requests['getSchedules'] = this.getSchedules()
                }
                else {
                    this.index_schedules_loading = false
                }

                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        // const showDashboard = val[0]['showDashboard'];
                        const showEmployee = val[0]['showEmployee'];
                        const getSchedules = val[0]['getSchedules'];
                        const getBundees = val[0]['getBundees'];

                        showEmployee.then(res => {
                            if(res.data.status != "failed"){
                                this.employee = res.data.msg[0]
                                this.showEmployeeQue();
                            }
                            else{
                                this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                            }
                            this.show_employee_loading = false
                        }).catch(err => console.log(err))

                        //added by ryann 1/9/19
                        // showEmployeeQue.then(res => {
                        //   if(res.data.status != "failed"){
                        //     this.employee_que = res.data.msg[0]
                        //     this.show_employee_loading = false
                        //   }
                        // }).catch(err => console.log(err))

                        if (typeof getSchedules !== 'undefined') {
                            getSchedules.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_schedules = res.data.msg
                                    this.index_schedules_loading = false
                                }
                                // console.log({ getSchedules: res })
                            }).catch(err => console.log(err))
                        }

                        if (typeof getBundees !== 'undefined') {
                            getBundees.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_bundees = res.data.msg
                                    this.index_bundees_loading = false
                                }
                            })
                        }

                    });

                }
                catch (e) {
                    console.log(e)
                }

            },


            async updateSchedule () {

                if (this.sched_id == '' || this.date_start == '') {
                    alert('Whoops! We need schedule and the effective date start')
                }
                else {
                    this.update_employee_loading = true;
                    await this.axiosRequest('POST', this.$store.state.application_api+'/employee/change_sched/' + this.$route.params.id, { sched_id: this.sched_id, date_start: this.date_start }, this.$session.get('headers'))
                    .then(res => {
                        if(res.data.status != "failed"){
                            this.init();
                            this.update_employee_loading= false
                            this.hide_change_sched = true
                            this.toastr({ title: "Employee's Schedule", message: 'You changes has been queued'})
                        }
                        else{
                            this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.notif = { message: 'Something went wrong - Please try again', style: 'alert-warning', icon: 'fa-warning' }
                    })
                }
            },

            getFinalDtr() {
                if (this.timetable == '') {
                    this.edtr_loading = true
                    this.axiosRequest('get', this.$store.state.clock_api+'/time/final/edtr/' + this.$route.params.id, this.$route.params.id, this.$session.get('headers'))
                    .then(res => {
                        if(res.data.success = "success"){
                            this.timetable = res.data.msg.edtr
                            this.dates = res.data.msg.dates
                            this.sched = res.data.msg.schedule
                            this.edtr_loading = false
                        }
                    })
                    .catch(err => console.log(err))
                }
            },

            reloadDtr() {
                this.timetable = '';
                this.getFinalDtr();
            },

            changeTimeTableDate (datadate) {
                this.edtr_loading = true
                this.axiosRequest('get', this.$store.state.clock_api+'/time/final/edtr/'+this.$route.params.id+'?date='+datadate, '', this.$session.get('headers'))
                .then(res => {
                    if(res.data.success = "success"){
                        this.timetable = res.data.msg.edtr
                        this.dates = res.data.msg.dates
                        this.edtr_loading = false
                    }
                })
                .catch(err => console.log(err))
            },

            // GET SCHEDULES
            getSchedules () {
                this.schedule_loading = true
                return this.axiosRequest('GET', this.$store.state.application_api + '/schedule?search=' + this.$store.state.search, null, this.$session.get('headers'))
            },

            showEmployee(){
                this.show_employee_loading = true
                return this.axiosRequest('GET', this.$store.state.application_api+'/employee/' + this.$route.params.id, null, this.$session.get('headers'))
            },

            //added by ryann 1/9/19
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

            //added by ryann 1/9/19
            openChangeQueModal(){
              $('#view_change_que').modal('show')
            },

            customBundee () {
                this.custom_bundee_type = 'custom_bundee';
                if (this.trackers == '' || this.date_start_bundee == '') {
                    alert('Whoops! We need bundee and the effective date start')
                }
                else {
                    this.update_employee_loading = true;
                    var params = {
                        'user_id': this.$route.params.id,
                        'type': this.custom_bundee_type,
                        'timetrack_id': this.trackers,
                        'date_start': this.date_start_bundee,
                    };
                    this.axiosRequest('POST', this.$store.state.application_api+'/user-bundee', params, this.$session.get('headers'))
                    .then(res => {
                        if(res.data.status != "failed"){
                            this.init();
                            this.update_employee_loading= false
                            this.hide_change_sched = true
                            this.toastr({ title: "Employee's Schedule", message: 'You changes has been queued'})
                        }
                        else{
                            this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.notif = { message: 'Something went wrong - Please try again', style: 'alert-warning', icon: 'fa-warning' }
                    })
                }
            },

            // ALL ABOUT BUNDEE

            // On open of bundee for disabling other checkbox
            bundeeOnOpenModal(timetrackdata){
                this.trackers = timetrackdata;
                let temp = '';
                if(timetrackdata[0].id == '1000'){
                    temp = '0c';
                }else if(timetrackdata[0].id == '1001'){
                    temp = '1c';
                }else if(timetrackdata[0].id == '1002'){
                    temp = '2c';
                }else if(timetrackdata[0].id == '1003'){
                    temp = '3c';
                }
                // this.bundeeResrtrictions(temp);
                this.hide_change_bundee = false;

                // console.log(timetrackdata[0].id);
            },

            closeChangeBundeeModal(){
                let nowid = this.employee.work_location.timetrack[0].id;
                let temp = '';
                if(nowid == '1000'){
                    temp = '0c';
                }else if(nowid == '1001'){
                    temp = '1c';
                }else if(nowid == '1002'){
                    temp = '2c';
                }else if(nowid == '1003'){
                    temp = '3c';
                }
                this.bundeeResrtrictions(temp);
                this.hide_change_bundee = true;
                console.log(nowid == '1001');

            },

            // For restriction of choosing bundee
            bundeeResrtrictions(id){

                document.getElementById('0c').disabled = false;
                document.getElementById('1c').disabled = false;
                document.getElementById('2c').disabled = false;
                document.getElementById('3c').disabled = false;

                // For Kiosk or Mobile
                if(id == '0c' || id == '3c'){
                    if(document.getElementById('0c').checked || document.getElementById('3c').checked){
                        document.getElementById('0c').disabled = false;
                        document.getElementById('1c').disabled = true;
                        document.getElementById('2c').disabled = true;
                        document.getElementById('3c').disabled = false;
                    }else{
                        document.getElementById('0c').disabled = false;
                        document.getElementById('1c').disabled = false;
                        document.getElementById('2c').disabled = false;
                        document.getElementById('3c').disabled = false;
                    }
                // For EDTR
                }else if(id == '1c'){
                    if(!document.getElementById('1c').checked){
                        document.getElementById('0c').disabled = false;
                        document.getElementById('1c').disabled = false;
                        document.getElementById('2c').disabled = false;
                        document.getElementById('3c').disabled = false;
                    }else{
                        document.getElementById('0c').disabled = true;
                        document.getElementById('1c').disabled = false;
                        document.getElementById('2c').disabled = true;
                        document.getElementById('3c').disabled = true;
                    }
                }else if(id == '2c'){
                    if(!document.getElementById('2c').checked){
                        document.getElementById('0c').disabled = false;
                        document.getElementById('1c').disabled = false;
                        document.getElementById('2c').disabled = false;
                        document.getElementById('3c').disabled = false;
                    }else{
                        document.getElementById('0c').disabled = true;
                        document.getElementById('1c').disabled = true;
                        document.getElementById('2c').disabled = false;
                        document.getElementById('3c').disabled = true;
                    }
                }else{
                    // if(document.getElementById(id).checked){
                    //     document.getElementById('0c').disabled = true;
                    //     document.getElementById('2c').disabled = true;
                    //     document.getElementById('3c').disabled = true;
                    // }else{
                    //     document.getElementById('0c').disabled = false;
                    //     document.getElementById('2c').disabled = false;
                    //     document.getElementById('3c').disabled = false;
                    // }
                }
            },


            // END OF ALL ABOUT BUNDEE
        }

    }

</script>

<style>
.txt-sm { font-size: 10px; }
</style>
