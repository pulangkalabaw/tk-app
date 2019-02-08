<template>
    <div class="main__cont">

        <!-- table header start -->
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>HR Admin</li>
                <li><a style="cursor: pointer;" @click="redirect( 'profile.approver', { tenant: $route.params.tenant } )">Approvees</a></li>
                <li class="active">{{ employee.users.fname + ' ' + employee.users.lname }}</li>
            </ol>
        </div>
        <!-- table header end -->

        <!-- content start -->
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
                                                                <td width="75%">{{ employee.users.fname + ' ' + employee.users.lname }}</td>
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
                                                                <td width="25%">Work location: </td>
                                                                <td width="75%">
                                                                    {{ employee.work_location.branch_name }}
                                                                </td>
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
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td width="25%">Employee #: </td>
                                                                <td width="75%">{{ employee.emp_num }}</td>
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
                                    </div>
                                    <!-- ./DTR -->
                                </div>
                            </div>
                            <div class="panel-body" v-else>
                                Loading please wait..
                            </div>
                        </div>
                    </div>
                </div>

                <stats :user_id="$route.params.id"></stats>
                <late :user_id="$route.params.id"></late>


            </div>
        </div>
        <!-- content end -->
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
            sched_id: '',
            date_start: '',
            dashboards: [],
            dashboards_loading: true,
            hide_change_sched: true,
            timetable: '',
            alltime: '',
            dates: '',
            sched: '',
            edtr_loading: '',
            schedule_loading: '',
            show_employee_loading: true,
            index_schedules_loading: true,
            update_employee_loading: false,
        }
    },

    computed: {        
        excel_download_link: function() {
            let filename = this.employee.emp_num + '-' + this.employee.users.lname + ' ' + this.employee.users.fname
            return this.$store.state.excel + '/download?edtr=' + JSON.stringify(this.timetable) + '&filename=' + filename
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


            if (this.$store.state.all_schedules.length == 0) {
                requests['getSchedules'] = this.getSchedules()
            }
            else {
                this.index_schedules_loading = false
            }

            try {
                const result = await Promise.all([requests])
                .then(val => {
                    const showDashboard = val[0]['showDashboard'];
                    const showEmployee = val[0]['showEmployee'];
                    const getSchedules = val[0]['getSchedules'];

                    showEmployee.then(res => {
                        if(res.data.status != "failed"){
                            this.employee = res.data.msg[0]
                        }
                        else{
                            this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                        }
                        this.show_employee_loading = false
                    }).catch(err => console.log(err))


                    if (typeof getSchedules !== 'undefined') {
                        getSchedules.then(res => {
                            if (res.data.status != "failed") {
                                this.$store.state.all_schedules = res.data.msg
                                this.index_schedules_loading = false
                            }
                            // console.log({ getSchedules: res })
                        }).catch(err => console.log(err))
                    }

                });

            }
            catch (e) {
                console.log(e)
            }
        },


        async updateSchedule () {

            if (this.sched_id == '' || this.date_start == '') {
                alert('Whoops! We need schedule and the date start')
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

        reloadDtr()
        {
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

        tooltipText (text) {
            $('[data-toggle="tooltip"]').tooltip().attr('data-original-title', text);
            return text;
        },

        openBundeeModal(){
            $('#select_bundee').modal('show');
        }

    }

}

</script>

<style>
.txt-sm { font-size: 10px; }
</style>
