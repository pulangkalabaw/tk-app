<template>
    <div class="main__cont">
        <!-- Modal -->
        <div class="modal fade in" id="select_location" :class="{ show: select_location_modal}">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Do you want to adopt the schedule of {{ location.branch_name }}?</h4>
                    </div>
                    <div class="modal-body" v-if="location != ''">
                        <div v-if="location.schedule != ''">
                            <span v-for="sched in location.schedule">
                                <p><strong>Schedule:</strong> {{ sched.schedule_name }}</p>
                                <p><strong>Shift:</strong> {{ sched.shift_in }} - {{ sched.shift_out }}</p>
                                <p><strong>Day:</strong>
                                    <!-- {{ sched.days.length }} -->
                                    <span v-for="(day, index) in sched.days">
                                        {{ day.day }}  
                                        <small v-if="day.type == 0">(RD)</small>
                                        <small v-else>(REG)</small>
                                        <span v-if="index != sched.days.length - 1">, </span>
                                    </span>
                                </p>
                                <p><strong>Bundee:</strong> <span v-for="temploc in location.timetrack" v-if="location.timetrack">{{ showBundeeName(temploc.bundee) }}</span></p>

                            </span>
                        </div>
                        <div v-else>
                            <p>Ooops seems like this location has no schedule. Click <a @click="">here</a> to set schedule for {{ location.branch_name }}</p>
                        </div> 
                        <hr>
                        <!-- <span class='fa fa-info-circle'></span> if no, we will use the default <a @click="redirect('schedules.index', { tenant: $route.params.tenant})">schedule</a> -->
                        <!-- <span v-if="defaultSchedOnly">{{ defaultSchedOnly[0].sched_name }}</span>                                                                         -->
                        <span v-if="defaultSchedOnly">
                            <strong>Default Schedule: </strong> {{ defaultSchedOnly[0].sched_name }} ({{ toHumanTime(defaultSchedOnly[0].shift_in) + ' - ' + toHumanTime(defaultSchedOnly[0].shift_out) }})
                            <br>
                            <strong>Days:</strong> <span v-for="(days, index) in defaultSchedOnly[0].day">
                                {{ days.day }}  
                                <small v-if="days.type == 0">(RD)</small>
                                <small v-else>(REG)</small>
                                <span v-if="index != defaultSchedOnly[0].day.length - 1">, </span>
                            </span>
                        </span>
                        <br>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default" type="button" data-dismiss="modal" @click="defaultSched()">Use Default Schedule</button>
                        <span v-if="location.schedule != ''">
                            <span v-for="sched in location.schedule">
                                <button class="btn btn-primary" type="button" @click="selectSched(sched.sched_id)">Yes</button>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>


        <div class="main-heading">
            <ol class="breadcrumb">
                <li><a style="cursor: pointer;" @click="redirect( 'dashboard', { tenant: $route.params.tenant})">HR Administrator</a></li>
                <li class="active">Employees</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- START OF CONTENT -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    Employees 
                                    <span v-if="index_employees_loading">
                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                    </span>
                                    <span v-else @click="reloadEmployees()">
                                        <span class='fa fa-refresh' data-toggle="tooltip" title="Refresh data"></span>
                                    </span>
                                </h3>
                            </div>
                            <div class="panel-body">
                                <div v-if="!index_employees_loading">
                                    <!-- start of nav tab -->
                                    <ul class="nav nav-tabs">
                                        <li class="active">
                                            <a data-toggle="tab" href="#allTab">All 
                                                <span v-if="!index_employees_loading">
                                                    <span class="label">
                                                        {{ $store.state.all_employees.length }}
                                                    </span>
                                                </span>
                                            </a>
                                        </li>
                                        <li v-if="empAdmin.length != 0">
                                            <a data-toggle="tab" href="#adminTab">Admin <span class="label">{{ empAdmin.length }}</span></a>
                                        </li>
                                        <li v-if="empHR.length != 0">
                                            <a data-toggle="tab" href="#hrTab">HR Admin <span class="label">{{ empHR.length }}</span></a>
                                        </li>
                                        <li v-if="empEmployees.length != 0">
                                            <a data-toggle="tab" href="#empTab">Employee <span class="label" >{{ empEmployees.length }}</span></a>
                                        </li>
                                        <li v-if="empKeeper.length != 0">
                                            <a data-toggle="tab" href="#keeperTab">Time keeper <span class="label">{{ empKeeper.length }}</span></a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#newTab"><span class="fa fa-plus"></span> New</a>
                                        </li>
                                    </ul>
                                    <!-- end of nav tab -->

                                    <!-- start of tab conent -->
                                    <div class="tab-content">
                                        <!-- ALL -->
                                        <div id="allTab" class="tab-pane fade in active table-responsive" style="border: 0">
                                            <table class="table table-hover display dtemployees" v-if="$store.state.all_employees" >
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Approver</th>
                                                        <th>Location</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="emp in $store.state.all_employees" @click="$router.push({path: '/'+$route.params.tenant+'/Employee/'+emp.user_id})">
                                                        <td>{{ emp.users.fname+' '+emp.users.lname }}</td>
                                                        <td>{{ emp.email }}</td>
                                                        <td>{{ emp.user_roles.role }}</td>
                                                        <td>
                                                            <span v-for="(emp, index) in emp.reports_to">
                                                                <span v-if="emp.fname">
                                                                    {{ emp.fname+' '+emp.lname }}
                                                                    <!-- <span v-if="index != emp.reports_to.length - 1">
                                                                        <b>, </b> 
                                                                    </span> -->
                                                                </span><span v-else>none</span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {{ emp.work_location.branch_name }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div v-else>
                                                <center><i class="fa fa-spinner fa-spin"></i></center>
                                            </div>
                                        </div>

                                        <!-- ADMIN -->
                                        <div id="adminTab" class="tab-pane fade table-responsive" style="border: 0" v-if="empAdmin">
                                            <table class="table table-hover dtemployeesAdmin display mytable" v-if="empAdmin.length != 0">
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Approver</th>
                                                        <th>Location</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="emp in empAdmin" @click="$router.push({path: '/'+$route.params.tenant+'/Employee/'+emp.user_id})">
                                                        <td>{{ emp.users.fname+' '+emp.users.lname }}</td>
                                                        <td>{{ emp.email }}</td>
                                                        <td>{{ emp.user_roles.role }}</td>
                                                        <td>
                                                            <span v-for="(emp, index) in emp.reports_to">
                                                                <span v-if="emp.fname">
                                                                    {{ emp.fname+' '+emp.lname }}
                                                                    <!-- <span v-if="index != emp.reports_to.length - 1">
                                                                        <b>, </b> 
                                                                    </span> -->
                                                                </span><span v-else>none</span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {{ emp.work_location.branch_name }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <center v-else><p><strong>No Admin employees</strong></p></center>
                                        </div>

                                        <!-- HR -->
                                        <div id="hrTab" class="tab-pane fade table-responsive" style="border: 0" v-if="empHR">
                                            <table class="table table-hover dtemployeesHr display mytable" v-if="empHR.length != 0">
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Supervisor</th>
                                                        <th>Location</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="emp in empHR" @click="$router.push({path: '/'+$route.params.tenant+'/Employee/'+emp.user_id})">
                                                        <td>{{ emp.users.fname+' '+emp.users.lname }}</td>
                                                        <td>{{ emp.email }}</td>
                                                        <td>{{ emp.user_roles.role }}</td>
                                                        <td>
                                                            <span v-for="(emp, index) in emp.reports_to">
                                                                <span v-if="emp.fname">
                                                                    {{ emp.fname+' '+emp.lname }}
                                                                    <!-- <span v-if="index != emp.reports_to.length - 1">
                                                                        <b>, </b> 
                                                                    </span> -->
                                                                </span><span v-else>none</span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {{ emp.work_location.branch_name }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <center v-else><p><strong>No HR Admin employees</strong></p></center>
                                        </div>


                                        <!-- EMP -->
                                        <div id="empTab" class="tab-pane fade table-responsive" style="border: 0" v-if="empEmployees">
                                            <table class="table table-hover dtemployeesEmp display mytable" v-if="empEmployees.length != 0">
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Supervisor</th>
                                                        <th>Location</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="emp in empEmployees" @click="$router.push({path: '/'+$route.params.tenant+'/Employee/'+emp.user_id})">
                                                        <td>{{ emp.users.fname+' '+emp.users.lname }}</td>
                                                        <td>{{ emp.email }}</td>
                                                        <td>{{ emp.user_roles.role }}</td>
                                                        <td>
                                                            <span v-for="(emp, index) in emp.reports_to">
                                                                <span v-if="emp.fname">
                                                                    {{ emp.fname+' '+emp.lname }}
                                                                    <!-- <span v-if="index != emp.reports_to.length - 1">
                                                                        <b>, </b> 
                                                                    </span> -->
                                                                </span><span v-else>none</span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {{ emp.work_location.branch_name }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <center v-else><p><strong>No Employee role</strong></p></center>
                                        </div>


                                        <!-- timekeeper -->
                                        <div id="keeperTab" class="tab-pane fade table-responsive" style="border: 0" v-if="empKeeper">
                                            <table class="table table-hover dtemployeesTimeK display mytable" v-if="empKeeper.length != 0">
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Supervisor</th>
                                                        <th>Location</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="emp in empKeeper" @click="$router.push({path: '/'+$route.params.tenant+'/Employee/'+emp.user_id})">
                                                        <td>{{ emp.users.fname+' '+emp.users.lname }}</td>
                                                        <td>{{ emp.email }}</td>
                                                        <td>{{ emp.user_roles.role }}</td>
                                                        <td>
                                                            <span v-for="(emp, index) in emp.reports_to">
                                                                <span v-if="emp.fname">
                                                                    {{ emp.fname+' '+emp.lname }}
                                                                    <!-- <span v-if="index != emp.reports_to.length - 1">
                                                                        <b>, </b> 
                                                                    </span> -->
                                                                </span><span v-else>none</span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {{ emp.work_location.branch_name }}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <center v-else><p><strong>No Time keeper employees</strong></p></center>
                                        </div>


                                        <!-- add new  -->
                                        <div id="newTab" class="tab-pane fade">

                                            <!-- START OF FORM -->
                                            <!-- <div v-if="isFormReady"> -->

                                                <form class="form users-new" v-on:submit.prevent="addEmployee()">

                                                    <!-- notif -->
                                                    <notif :notif="notif"></notif>
                                                    <!-- end of notif -->

                                                    <div class="container-fluid float-left">
                                                        <div class="row">
                                                            <div class="col-md-8">
                                                                <div class="row">
                                                                    <div class="col-md-6">
                                                                        <strong>Employee Information</strong>
                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-user"></i></div>
                                                                                <input class="form-control" v-model="fname" type="text" placeholder="First name" required="">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-user"></i></div>
                                                                                <input class="form-control" v-model="lname" type="text" placeholder="Last name" required="">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-phone"></i></div>
                                                                                <input class="form-control" v-model="cell_num" type="text" placeholder="Contact #" required="">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-hashtag"></i></div>
                                                                                <input class="form-control" v-model="emp_num" type="text" placeholder="Employee Number" required="">
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <strong>Account Information</strong><br>
                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-users"></i></div>
                                                                                <input class="form-control" v-model="email" type="email" placeholder="Email" required="">
                                                                            </div>
                                                                        </div>

                                                                        <!-- <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-lock"></i></div>
                                                                                <input type="password" v-model="password" placeholder="Password" class="form-control" required="">
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-asterisk"></i></div>
                                                                                <input type="password" v-model="pin" placeholder="Pin" maxlength="4" class="form-control" required="">
                                                                            </div>
                                                                        </div> -->

                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-briefcase"></i></div>
                                                                                <div v-if="!index_roles_loading">
                                                                                    <select class="selectpicker" v-model="role" placeholder="Role" required="" data-width="100%">
                                                                                        <option value="" selected disabled="">--Choose a role--</option>
                                                                                        <option v-for="role in $store.state.all_roles" :value="role.role_id">{{ role.name }}</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div v-else>
                                                                                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-users"></i></div>
                                                                                <div v-if="!index_employees_loading">
                                                                                    <select class="selectpicker" v-model="approver" placeholder="Role" required="" data-width="100%">
                                                                                        <option value="" selected disabled="">--Choose a approver--</option>
                                                                                        <option v-for="emp in $store.state.all_employees" :value="emp.user_id">{{ emp.users.fname+' '+emp.users.lname }}</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div v-else>
                                                                                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span>
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    <div class="col-md-6">
                                                                        <strong>Bundee & Location Information</strong>
                                                                        <br>
                                                                        <!-- <small style="color:lightblue">*By default, User's bundee will based on your selected location.*</small>                                                                         -->
                                                                        <div class="form-group">                             
                                                                            <div class="input-group">
                                                                                <div class="input-group-addon"><i class="fa fa-map-marker"></i></div>
                                                                                <div v-if="!index_location_loading">
                                                                                    <select class="selectpicker" @change="select_location_modal = true" v-model="location" placeholder="Role"  required="" data-width="100%">
                                                                                        <option value="" selected disabled="">--Choose a location--</option>
                                                                                        <option v-for="loc in $store.state.all_locations" :value="loc">{{ loc.branch_name }}</option>
                                                                                    </select>    
                                                                                </div>
                                                                                <div v-else>
                                                                                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>                                                                    
                                                                        <div class="form-group">
                                                                            <div class="input-group">
                                                                                <button type="button" class="btn btn-info btn-xs" v-if="isEditingCustomBundee == false" @click="customBundeeBtn()">Click for customized Bundee</button>     
                                                                                <button class="btn btn-info btn-xs" v-else type="button" @click="customBundeeBtn()">Cancel</button>    
                                                                                <!-- <small style="color:lightblue">*If you want to change the users bundee                                                                                                                                                                                                                            
                                                                                    <button type="button" class="btn btn-info btn-xs" v-if="isEditingCustomBundee == false" @click="customBundeeBtn()">CLICK HERE</button>
                                                                                    <a v-if="isEditingCustomBundee == false" @click="customBundeeBtn()">CLICK HERE</a>
                                                                                    <button type="button" class="btn btn-info btn-xs" v-else @click="customBundeeBtn()">Cancel</button>
                                                                                *</small> -->
                                                                            </div>
                                                                        </div>
                                                                        <div class="form-group" v-if="isEditingCustomBundee == true">
                                                                            <div class="breadcrumb">

                                                                                <small>Choose bundee(s):</small>                                                                                
                                                                                <div class="input-group" v-for="(bun, index) in $store.state.all_bundees">
                                                                                    <div class="checkbox">
                                                                                        <input v-model="bundeebox" type="checkbox" class="checkbox" :class="{kiosk: bun.name == 'kiosk'}" :id="index + 'chckb'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" @change="bundeeValidation(index)">
                                                                                        <label :for="index + 'chckb'" v-if="bun.name == 'kiosk'">Kiosk</label>
                                                                                        <label :for="index + 'chckb'" v-else-if="bun.name == 'mobile'">Mobile</label>
                                                                                        <label :for="index + 'chckb'" v-else-if="bun.name == 'edtr'">EDTR</label>
                                                                                        <label :for="index + 'chckb'" v-else-if="bun.name == 'third_party_biometrics'">Biometrics(Third party)</label>
                                                                                        <label :for="index + 'chckb'" v-else>Unkown Reference</label>
                                                                                    </div>
                                                                                    <div v-if="bun.name == 'kiosk'">
                                                                                        <div v-if="kioskIsChosen == true">
                                                                                            <label for="">Accessible location/s</label>
                                                                                            <select class="selectpicker" multiple="" :id="index + 'kiosk'" v-model="work_location">
                                                                                                <option v-for="loc in $store.state.all_locations" :value="{branch_name:loc.branch_name,branch_id:loc.branch_id}">{{ loc.branch_name }}</option>
                                                                                            </select>
                                                                                        </div>                                                                                        
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        
                                                                    </div>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="col-md-12">
                                                                        <div class="form-group">
                                                                            <button type="submit" :disabled="create_employees_loading" class="btn btn-success btn-xs">Save <span class='fa fa-save'></span> </button>
                                                                            <span v-if="create_employees_loading">
                                                                                <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-md-4">
                                                                <img :src="image_preview" alt="Avatar" class="image">
                                                                <br> <br>
                                                                <input type="file" name="image" v-on:change="handleImage">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
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
            </div>
        </div>
    </div>
</div>
</template>

<script>

    export default {

        data () {
            return {
                fname: '',
                lname: '',
                email: '',
                cell_num: '',
                pin: '',
                password: '',
                emp_num: '',
                image: '',
                role: '',
                approver: '',
                location: '',
                image_preview: '/static/img/default-avatar.png',
                select_location_modal: false,
                selected_location: '',
                schedule: '',
                notif: '',
                passpin: '',
                defaultSchedOnly: '',

                isEditingCustomBundee: false,
                bundeebox: [],
                kioskIsChosen: false,
                work_location: [],

                index_employees_loading: true,
                index_location_loading: true,
                index_roles_loading: true,
                index_bundees_loading: true,
                create_employees_loading: false,

            }
        },


        computed: {

            // filter all employees role
            empEmployees () {
                if(this.$store.state.all_employees){
                    let emp = this.$store.state.all_employees
                    return emp.filter(function(val){
                        return val.user_roles.role == 'Employee';
                    });
                }

            },

            // Filter all admin role
            empAdmin () {
                if(this.$store.state.all_employees) {
                    let emp = this.$store.state.all_employees
                    return emp.filter(function(val){
                        return val.user_roles.role == 'Admin';
                    });
                }

            },

            // Filter all hr role
            empHR () {
                if(this.$store.state.all_employees){
                    let emp = this.$store.state.all_employees
                    return emp.filter(function(val){
                        return val.user_roles.role == 'HR Admin';
                    });
                }

            },

            // Filter all time keeper role
            empKeeper () {
                if(this.$store.state.all_employees){
                    let emp = this.$store.state.all_employees
                    return emp.filter(function(val){
                        return val.user_roles.role == 'Time Keeper';
                    });
                }

            },

            // Get default sched only
            defSchedOnly () {
                if(this.defaultSchedOnly){
                    let sche = this.defaultSchedOnly
                    return sche.filter(function(val){
                        return val.defaul_sched == 1;
                    });
                }

            },

            count () {
                return this.index_employees_loading
            }
        },

        filters: {

            roleEmp: function (value) {
                return value.filter(function(val){
                    return val.user_roles.role == 'Employee';
                });
            },

        },
        
        created () {
            this.init ()
            this.getAllSched();
        },

        updated () {
            if (this.$store.state.all_employees.length != 0) {
                $(".selectpicker").selectpicker('refresh')
                if (!$.fn.dataTable.isDataTable( '.dtemployees' )) {
                    $('.dtemployees').dataTable({ ordering: true  });
                }
                if (!$.fn.dataTable.isDataTable( '.dtemployeesAdmin' )) {
                    $('.dtemployeesAdmin').dataTable({ ordering: true  });
                }
                if (!$.fn.dataTable.isDataTable( '.dtemployeesEmp' )) {
                    $('.dtemployeesEmp').dataTable({ ordering: true  });
                }
                if (!$.fn.dataTable.isDataTable( '.dtemployeesTimeK' )) {
                    $('.dtemployeesTimeK').dataTable({ ordering: true  });
                }
                if (!$.fn.dataTable.isDataTable( '.dtemployeesHr' )) {
                    $('.dtemployeesHr').dataTable({ ordering: true  });
                }
            }
        },

        watch: {
            count: function (val) {
                if (this.$store.state.all_employees.length != 0) {
                    $(".selectpicker").selectpicker('refresh')
                    if (!$.fn.dataTable.isDataTable( '.dtemployees' )) {
                        $('.dtemployees').dataTable({ ordering: true  });
                    }
                    if (!$.fn.dataTable.isDataTable( '.dtemployeesAdmin' )) {
                        $('.dtemployeesAdmin').dataTable({ ordering: true  });
                    }
                    if (!$.fn.dataTable.isDataTable( '.dtemployeesEmp' )) {
                        $('.dtemployeesEmp').dataTable({ ordering: true  });
                    }
                    if (!$.fn.dataTable.isDataTable( '.dtemployeesTimeK' )) {
                        $('.dtemployeesTimeK').dataTable({ ordering: true  });
                    }
                    if (!$.fn.dataTable.isDataTable( '.dtemployeesHr' )) {
                        $('.dtemployeesHr').dataTable({ ordering: true  });
                    }
                }
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


            reloadEmployees () {
                this.$store.state.all_employees = "";
                this.init();
            },

            async init () {

                var requests = [];
                this.index_employees_loading = true
                
                if (this.$store.state.all_employees.length == 0) {
                    requests['getEmployees'] = this.getEmployees()
                }
                else{
                    this.index_employees_loading = false
                }


                if (this.$store.state.all_bundees.length == 0) {
                    requests['getBundees'] = this.getBundees()
                }else {
                    this.index_bundees_loading = false;
                }

                if (this.$store.state.all_locations.length == 0) {
                    requests['getLocations'] = this.getLocations()
                }
                else{
                    this.index_location_loading = false
                }

                if (this.$store.state.all_roles.length == 0) {
                    requests['getRoles'] = this.getRoles()
                }
                else{
                    this.index_roles_loading = false
                }

                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        const getLocations = val[0]['getLocations'];
                        const getRoles = val[0]['getRoles'];
                        const getBundees = val[0]['getBundees'];                        
                        const getEmployees = val[0]['getEmployees'];
                        if (typeof getEmployees !== 'undefined') {
                            getEmployees.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_employees = res.data.msg
                                    this.index_employees_loading = false
                                }
                            })
                            .catch(err => console.log(err))
                        }

                        if (typeof getLocations !== 'undefined') {
                            getLocations.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_locations = res.data.msg
                                    this.index_location_loading = false
                                }
                            })
                        }

                        if (typeof getRoles !== 'undefined') {
                            getRoles.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_roles = res.data.msg
                                    this.index_roles_loading = false
                                }
                            })
                            .catch(err => console.log(err))
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


            defaultSched ()  {
                this.schedule = ''
                this.select_location_modal = false
            },

            selectSched (sched_id) {
                this.schedule = sched_id
                this.select_location_modal = false;
            },

            addEmployee() {

                this.create_employees_loading = true

                let formData = new FormData();

                formData.append('email', this.email)
                formData.append('fname', this.fname)
                formData.append('lname', this.lname)
                formData.append('emp_num', this.emp_num)
                // formData.append('pin', this.pin)
                // formData.append('password', this.password)
                formData.append('approver_id', this.approver)
                formData.append('role_id', this.role)
                formData.append('cell_num', this.cell_num)
                formData.append('bundee', JSON.stringify(this.bundeebox))
                if(this.work_location.length !== 0){
                    formData.append('work_locations', JSON.stringify(this.work_location))
                }else{
                    formData.append('work_locations', JSON.stringify([{'branch_name':this.location.branch_name, 'branch_id': this.location.branch_id}]))                    
                }
                if (this.location != '') {
                    this.selected_location = this.location.branch_id
                    formData.append('branch_id', this.selected_location)
                } 
                if (this.schedule != '') {
                    formData.append('sched_id', this.schedule)
                }
                formData.append('image', this.image)

                for (var value of formData.values()) {
                   // console.log(value); 
                }

                this.axiosRequest('post', this.$store.state.application_api + '/employee', formData, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ title: 'Employees', message: 'Added new employee'})
                        this.passpin = res.data.pe
                        this.getEmployees()
                        this.notif = ''
                        // ADDED BY PAUL THIS IS EMAIL
                        let params = {
                            email: this.email,
                            fname: this.fname,
                            lname: this.lname,
                            link: this.$route.params.tenant,
                            password: this.passpin['pass'],
                            pin: this.passpin['pin'],
                        };

                        console.log(params);

                        this.axiosRequest('post', this.$store.state.mail_api + '/send_newemp', params, this.$session.get('headers'))
                        .then(res => console.log("email sent"))
                        .catch(err => console.log(err))

                        
                    }else{
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-cicle' }
                    }
                    this.create_employees_loading = false
                })
                .catch(err => console.log(err))

                
                
            },

            handleImage (e) {

                const file = e.target.files[0];
                this.image = file;
                this.image_preview = URL.createObjectURL(file);
            },

            // ALL ABOUT BUNDEE
            customBundeeBtn(){

                this.isEditingCustomBundee ^= true;
                this.bundeebox = [];
                this.kioskIsChosen = false;
                this.work_location = [];

            },

            bundeeValidation(index){

                $('#0chckb').removeAttr("disabled");
                $('#1chckb').removeAttr("disabled");
                $('#2chckb').removeAttr("disabled");
                $('#3chckb').removeAttr("disabled");
                this.kioskIsChosen = false;   

                // let filtercheckbox = this.bundeebox;
                // filtercheckbox = filtercheckbox.filter(res => {
                //     return res.id == 1000;
                // });
                // console.log(filtercheckbox);

                // There is data inside
                if(this.bundeebox.length !== 0){
                    // Checking if EDTR is checked
                    if(this.bundeebox[0]['id'] == 1001){
                        $('#'+0+'chckb').attr("disabled",true);
                        $('#'+2+'chckb').attr("disabled",true);
                        $('#'+3+'chckb').attr("disabled",true);
                        this.work_location = [];

                    // Checking if Biometrics(Third party) is checked 
                    }else if(this.bundeebox[0]['id'] == 1002){
                        $('#'+0+'chckb').attr("disabled",true);
                        $('#'+1+'chckb').attr("disabled",true);
                        $('#'+3+'chckb').attr("disabled",true);        
                        this.work_location = [];                                  
                    
                    // Checking if Kiosk or Mobile is checked
                    }else if(this.bundeebox[0]['id'] == 1000 || this.bundeebox[0]['id'] == 1003){
                        $('#'+1+'chckb').attr("disabled",true);
                        $('#'+2+'chckb').attr("disabled",true);  
                            // console.log($('.kiosk').is(':checked'))
                        if($('.kiosk').is(':checked')){
                            this.kioskIsChosen = true;   
                        }else{
                            this.work_location = [];                                
                        }


                        // if(filtercheckbox.length !== 0){
                        //     if($('.kiosk').is(':checked')){
                        //         this.kioskIsChosen = true;   
                        //     }else{
                        //         this.work_location = [];                                
                        //     }
                        // }else{
                        //      if($('.kiosk').is(':checked')){
                        //         this.kioskIsChosen = true;   
                        //     }else{
                        //         this.work_location = [];                                
                        //     }
                        // }      
                        // $('#'+index+'kiosk').removeAttr("disabled",true);           

                    }
                }else{
                    this.work_location = [];                                
                }
                // There is no data inside
               
            },

            // END OF ALL ABOUT BUNDEE

            // ADDED BY PAUL TO GET SCHEDULE
            getAllSched(){
                this.axiosRequest('get', this.$store.state.application_api + '/schedule' + '?link=' + this.$route.params.tenant, null, this.$session.get('headers'))
                .then(res => {
                    this.defaultSchedOnly = res.data.msg;
                    console.log(res.data)
                })
                .catch(err => console.log(err));
            }
            // END OF GET SCHEDULE
        }

    }

</script>
