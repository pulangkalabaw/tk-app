<template>
    <div class="main__cont">

        <!-- Modal -->
        <div class="modal fade in" id="select_location" :class="{ show: select_location_modal}" v-if="!show_employee_loading">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Do you want to adopt the schedule of {{ location.branch_name }}</h4>
                    </div>
                    <div class="modal-body" v-if="location != ''">



                        <div v-if="location.schedule != ''">
                            <span v-for="sched in location.schedule">
                                <p>Schedule: {{ sched.schedule_name }}</p>
                                <p>Shift: {{ sched.shift_in }} - {{ sched.shift_out }}</p>
                                <p>Days:
                                    <span v-for="(day, index) in sched.days">
                                        <span v-if="day.type == 1">{{ shortDayName(day.day) }}</span>
                                        <span v-if="index == sched.days.length - 1">
                                            <b> (REG) </b> 
                                        </span>
                                    </span>
                                    ,
                                    <span v-for="(day, index) in sched.days">
                                        <span v-if="day.type == 0">{{ shortDayName(day.day) }}</span>
                                        <span v-if="index == sched.days.length - 1">
                                            <b> (RD) </b> 
                                        </span>
                                    </span>
                                </p>
                                Bundee(s):
                                <label v-if=" location.timetrack != ''">
                                    <span v-for="(bun, index) in location.timetrack">
                                        {{ showBundeeName(bun.bundee) }}
                                        <span v-if="index != location.timetrack.length - 1">
                                            <b>, </b> 
                                        </span>
                                    </span>
                                </label>
                                <label v-else>
                                    None
                                </label>
                                <br>
                            </span>
                            Effective Date Start: 
                            <input type="date" v-model="date_start" id="" class="form-control">
                        </div>
                        <div v-else>
                            <p>Ooops seems like this location has no schedule. Click <a @click="">here</a> to set schedule for {{ location.branch_name }}</p>
                        </div> 
                        <hr>
                        <span class='fa fa-info-circle'></span> if no, we will use the default <a @click="redirect('schedules.index', { tenant: $route.params.tenant})">schedule</a>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-default" type="button" data-dismiss="modal" @click="select_location_modal = false; hide_location = true">Cancel</button>
                        <button class="btn btn-default" type="button" data-dismiss="modal" @click="retainSched(employee.emp_sched[0].sched_id)">Retain Schedule</button>
                        <button class="btn btn-default" type="button" data-dismiss="modal" @click="defaultSched()">Use Default Schedule</button>
                        <span v-if="location.schedule != ''">
                            <span v-for="sched in location.schedule">
                                <button class="btn btn-primary" type="button" @click="selectSched(sched.sched_id)">Use this Schedule</button>
                            </span>
                        </span>

                    </div>
                </div>
            </div>
        </div>

        <div class="main-heading">
            <ol class="breadcrumb">
                <li><a style="cursor: pointer;" @click="redirect( 'dashboard', { tenant: $route.params.tenant})">HR Administrator</a></li>
                <li><a style="cursor: pointer;" @click="redirect( 'employees.index', { tenant: $route.params.tenant})">Employees</a></li>
                <li v-if="employee.users">
                    <a style="cursor: pointer;" @click="redirect('employees.show', { tenant: $route.params.tenant, id: $route.params.id })">{{ employee.users.fname+' '+employee.users.lname }}</a>
                </li>
                <li v-else>
                    <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                </li>
                <li class="active">Edit</li>
            </ol>
        </div>

        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- All things that need employee data -->
                <div class="row">
                    <div class="col-md-12">

                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <div class="panel-title">
                                    <label class="text-left">
                                        Edit Employee
                                        <span v-if="show_employee_loading">
                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                        </span>
                                    </label>
                                    <label class="pull-right" v-if="!show_employee_loading">
                                        <label class="btn btn-xs btn-default" @click="redirect('employees.show', { tenant: $route.params.tenant, id: $route.params.id })"><span data-toggle="tooltip" title="View" class='fa fa-eye fa-active'></span></label>
                                    </label>
                                </div>
                            </div>
                            <div class="panel-body" v-if="employee.users">

                                <!-- start of form -->
                                <div class="container-fluid float-left">
                                    <form class="form users-new" v-on:submit.prevent="updateEmployee()" encType="multipart/form-data">

                                        <notif :notif="notif"></notif>
                                        
                                        <div class="container-fluid float-left">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <strong>Employee Information</strong>
                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-user"></i></div>
                                                                    <input class="form-control" v-model="employee.users.fname" type="text" placeholder="First name" required="">
                                                                </div>
                                                            </div>

                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-user"></i></div>
                                                                    <input class="form-control" v-model="employee.users.lname" type="text" placeholder="Last name" required="">
                                                                </div>
                                                            </div>

                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-phone"></i></div>
                                                                    <input class="form-control" v-model="employee.users.cell_num" type="text" placeholder="Contact #" required="">
                                                                </div>
                                                            </div>

                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-hashtag"></i></div>
                                                                    <input class="form-control" v-model="employee.emp_num" type="text" placeholder="Employee Number" required="">
                                                                </div>
                                                            </div>                                                            
                                                            
                                                            <strong>Account Information</strong>
                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-users"></i></div>
                                                                    <input class="form-control" v-model="employee.email" type="email" placeholder="Email" required="">
                                                                </div>
                                                            </div>
                                                            
                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-briefcase"></i></div>
                                                                    <div v-if="!index_roles_loading">
                                                                        <select class="selectpicker" v-model="employee.user_role.role_id" placeholder="Role" required="" data-width="100%">
                                                                            <option v-for="role in $store.state.all_roles" :selected="employee.user_role.role_id == role.role_id" :value="role.role_id">{{ role.name }}</option>
                                                                        </select>
                                                                    </div>
                                                                    <div v-else>
                                                                        <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="form-group">
                                                                <div class="input-group" v-if="!hide_approver">
                                                                    <div class="input-group-addon"><i class="fa fa-users"></i></div>
                                                                    <div v-if="!index_employees_loading">
                                                                        <select class="selectpicker" v-model="reports_to" placeholder="Role" data-width="100%">
                                                                            <option value="" disabled="" selected="">-- Please select approver --</option>
                                                                            <option v-for="emp in $store.state.all_employees"  :value="emp.users.user_id">{{ emp.users.fname+' '+emp.users.lname }}</option>
                                                                        </select>
                                                                    </div>
                                                                    <div v-else>
                                                                        <span class='fa fa-spin' :class="$store.state.page_load_icon"></span>
                                                                    </div>
                                                                </div>
                                                                <div v-else>
                                                                    Approver: 
                                                                    <span v-if="employee.reports_to == ''">
                                                                        None
                                                                    </span>
                                                                    <span v-else>
                                                                        <span v-for="(reports_to, index) in employee.reports_to">
                                                                            {{ reports_to.fname }} {{ reports_to.lname }}
                                                                            <span v-if="index != employee.reports_to.length - 1">
                                                                                <b>, </b> 
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                    <span class='fa fa-edit' data-toggle="tooltip" title="Change Approver" @click="hide_approver = false"></span> 
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6">                                                                                                                    
                                                            <div class="form-group"> 
                                                                <strong>Location information</strong>
                                                                <br>
                                                                <small style="color:lightblue">*By default, User's bundee will based on your selected location.*</small>                                                                                                                                        
                                                                <div class="input-group" v-if="!hide_location">
                                                                    <div class="input-group-addon"><i class="fa fa-map-marker"></i></div>
                                                                    <div v-if="!index_location_loading">
                                                                        <select class="selectpicker" v-model="location" @change="select_location_modal = true" placeholder="Role" data-width="100%">
                                                                            <option value="" disabled="" selected="">-- Please select location --</option>
                                                                            <option v-for="loc in $store.state.all_locations" :value="loc">{{ loc.branch_name }}</option>
                                                                        </select>    
                                                                    </div>
                                                                    <div v-else>
                                                                        <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                                                                    </div>
                                                                </div>
                                                                <div v-else>
                                                                    Location: 
                                                                    <span v-if="employee.work_location == ''">
                                                                        None
                                                                    </span>
                                                                    <span v-else>
                                                                        {{ employee.work_location.branch_name }}
                                                                    </span>
                                                                    <span class='fa fa-edit' data-toggle="tooltip" title="Change Location" @click="hide_location = false"></span> 
                                                                </div>
                                                            </div>
                                                            <div class="form-group">
                                                            <!-- <div class="form-group" v-if="findkiosk.length !== 0"> -->
                                                                <div class="input-group">
                                                                    <small style="color:lightblue">                                                                                                                                                                                                                          
                                                                        <button type="button" class="btn btn-info btn-xs" v-if="isEditingCustomBundee == false" @click="customBundeeBtn()">Click to assign kiosk locations</button>
                                                                        <button type="button" class="btn btn-info btn-xs" v-else @click="customBundeeBtn()">Cancel</button>
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <div class="form-group" v-if="isEditingCustomBundee == true">
                                                            <!-- <div class="form-group" v-if="findkiosk.length !== 0 && isEditingCustomBundee == true"> -->
                                                                <div class="breadcrumb">
                                                                    <small>Choose bundee(s):</small>                                                                                
                                                                    <div class="input-group" v-for="(bun, index) in $store.state.all_bundees">
                                                                        <div class="checkbox">
                                                                            <input v-model="bundeebox" type="checkbox" class="checkbox" :class="{kiosk: bun.name == 'kiosk'}" :id="index + 'chckb'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" @change="bundeeValidation(index)" :disabled="!(bun.timetrack_id == employee.work_location.timetrack[0].id)">
                                                                            <label :for="index + 'chckb'" v-if="bun.name == 'kiosk'">Kiosk</label>
                                                                            <label :for="index + 'chckb'" v-else-if="bun.name == 'mobile'">Mobile</label>
                                                                            <label :for="index + 'chckb'" v-else-if="bun.name == 'edtr'">EDTR</label>
                                                                            <label :for="index + 'chckb'" v-else-if="bun.name == 'third_party_biometrics'">Biometrics(Third party)</label>
                                                                            <label :for="index + 'chckb'" v-else>Unkown Reference</label>
                                                                        </div>
                                                                        <div v-if="bun.name == 'kiosk'">
                                                                            <div v-if="kioskIsChosen == true">
                                                                                <label for="">Accessible location/s</label>
                                                                                <select v-model="work_locations" class="selectpicker" multiple="">
                                                                                    <option v-for="kiosk_locs in $store.state.all_locations" :value="{ branch_name: kiosk_locs.branch_name, branch_id: kiosk_locs.branch_id }">{{ kiosk_locs.branch_name }}</option>
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
                                                                <button type="submit" :disabled="update_employee_loading" class="btn btn-success btn-xs">Update Changes <span class='fa fa-edit'></span> </button>
                                                                <span v-if="update_employee_loading">
                                                                    <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">

                                                    <div class="fileupload">
                                                        <center v-if="employee.users.image != 'Photo.png'">
                                                            <img :src="image_preview" alt="" width="100%">
                                                        </center>
                                                        <center v-else>
                                                            <img :src="$store.state.image_url + 'Photo.png'" alt="" width="90%">
                                                        </center>
                                                        <span class='fa fa-info-circle'></span> image format must be .jpg, .png, .jpeg
                                                    </div> <br>
                                                    <input type="file" name="image" v-on:change="handleImage">
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <!-- end of form -->
                            </div>
                            <div class="panel-body" v-else>
                                Loading please wait..
                            </div>
                        </div>  
                    </div>
                </div>
                <!-- End of content here -->
            </div>
        </div>
    </div>
</template>

<script>

export default {

    data () {
        return {

            employee: {},
            reports_to: '',
            image_preview: '',
            image: '',
            location: '',
            notif: '',
            selected_location: '',
            select_location_modal: false,
            schedule: '',

            hide_approver: true,
            hide_location: true,
            index_location_loading: true,
            index_roles_loading: true,
            index_employees_loading: true,
            index_bundees_loading: true,
            show_employee_loading: true,
            index_schedule_loading: true,
            update_employee_loading: false,
            isEditingCustomBundee: false, 

            date_start: '',
            sched_mode:'retain',
            bundeebox: '',

            kioskIsChosen: false,        
            work_locations: [],
        }
    },

    computed: {
        branch: function () {
            return this.employee.user_branch[0] ? this.employee.user_branch[0] : ''
        },

        count () {
            return this.show_employee_loading
        },

        // findkiosk () {
        //     let filteredbundee = this.employee.work_location.timetrack;
        //     // return filteredbundee = filteredbundee.filter(x => x.id == 1000)
        //     return filteredbundee = filteredbundee.filter(res => {
        //         return res.id == 1000;
        //     });
        // },
    },

    created () {

        this.init ()
    },

    updated () {
        $(".selectpicker").selectpicker('refresh')
        if($('.kiosk').is(':checked')){
            this.kioskIsChosen = true;  
            $('#3chckb').removeAttr("disabled");
        } 
    },

    watch: {
        count: function (val) {
            $(".selectpicker").selectpicker('refresh')
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


        async init () {

            var requests = [];
            if (this.$store.state.all_locations.length == 0) {
                requests['getLocations'] = this.getLocations()
            }
            else {
                this.index_location_loading = false
            }

            if (this.$store.state.all_roles.length == 0) {
                requests['getRoles'] = this.getRoles()
            }
            else {
                this.index_roles_loading = false
            }

            if (this.$store.state.all_schedules.length == 0) {
                requests['getSchedules'] = this.getSchedules()
            }
            else {
                this.index_schedules_loading = false
            }

            if (this.$store.state.all_employees.length == 0) {
                requests['getEmployees'] = this.getEmployees()
            }
            else {
                this.index_employees_loading = false
            }

            if (this.$store.state.all_bundees.length == 0) {
                requests['getBundees'] = this.getBundees()
            }else {
                this.index_bundees_loading = false;
            }

            requests['showEmployee'] = this.showEmployee()

            try {

                const result = await Promise.all([requests])
                .then(val => {
                    const getLocations = val[0]['getLocations'];
                    const getRoles = val[0]['getRoles'];
                    const getBundees = val[0]['getBundees'];                        
                    const showEmployee = val[0]['showEmployee'];
                    const getEmployees = val[0]['getEmployees'];

                    showEmployee.then(res => {
                        if(res.data.status != "failed"){
                            this.employee = res.data.msg[0]
                            this.show_employee_loading = false
                            this.image_preview = this.$store.state.image_url + this.$route.params.tenant + '/images/users/' + this.employee.users.image
                        }
                        else{
                            this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                        }
                    }).catch(err => console.log(err))

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
                    }

                    if (typeof getEmployees !== 'undefined') {
                        getEmployees.then(res => {
                            if (res.data.status != "failed") {
                                this.$store.state.all_employees = res.data.msg
                                this.work_locations = this.employee.emp_sched[0].work_locations;
                                this.index_employees_loading = false
                                console.log(this.employee)
                                console.log({"hehehe": this.findkiosk});
                            }
                        })
                        .catch(err => console.log(err))
                    }


                    if (typeof getSchedules !== 'undefined') {
                        getSchedules.then(res => {
                            if (res.data.status != "failed") {
                                this.$store.state.all_schedules = res.data.msg
                                this.index_schedules_loading = false
                            }
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

defaultSched ()  {
    if (this.date_start == '') {
        alert("Effective date start is required!")
    }
    else {
        this.schedule = ''
        this.sched_mode = 'default'
        this.select_location_modal = false
    }
},

selectSched (sched_id) {
    if (this.date_start == '') {
        alert("Effective date start is required!")
    }
    else {
        this.sched_mode = 'use'
        this.schedule = sched_id
        this.select_location_modal = false;
    }
},
retainSched (sched_id) {
    if (this.date_start == '') {
        alert("Effective date start is required!")
    }
    else {
        this.sched_mode = 'retain'
        this.schedule = sched_id
        this.select_location_modal = false;
    }
},


showEmployee(){
    this.$store.state.loading = true
    return this.axiosRequest('get', this.$store.state.application_api+'/employee/' + this.$route.params.id, null, this.$session.get('headers'))
},


handleImage (e){
    const file = e.target.files[0];
    this.image = file;
    this.image_preview = URL.createObjectURL(file);
},

updateEmployee () {
    this.update_employee_loading = true
    var fd = new FormData();

    fd.append('_method', "PUT")                
    fd.append('email', this.employee.email)
    fd.append('fname', this.employee.users.fname)
    fd.append('lname', this.employee.users.lname)
    fd.append('cell_num', this.employee.users.cell_num)
    fd.append('emp_num', this.employee.emp_num)
    fd.append('sched_mode', this.sched_mode)
    // fd.append('work_locations', JSON.stringify(this.work_locations))
    if(this.work_locations.length !== 0){
        fd.append('work_locations', JSON.stringify(this.work_locations))
    }else{
        fd.append('work_locations', JSON.stringify([{'branch_name':this.employee.work_location.branch_name, 'branch_id': this.employee.work_location.location_id}]))                    
    }
    if(this.bundeebox.length !== 0){
        fd.append('bundee', JSON.stringify(this.bundeebox))
    }else{
        fd.append('bundee', JSON.stringify(this.employee.work_location.timetrack))
    } 
    if (this.location != '') {
        this.selected_location = this.location.branch_id
        fd.append('branch_id', this.selected_location)
    } 
    if (this.date_start != '') {
        fd.append('date_start', this.date_start)
    } 
    if (this.schedule != '') {
        fd.append('sched_id', this.schedule)
        fd.append('type', 'location')
    }
    else {
        fd.append('type', 'global')
    }
    if (this.reports_to != '') {
        fd.append('approver_id', this.reports_to)
    }
    fd.append('role_id', this.employee.user_role.role_id)
    fd.append('image', this.image)

    for (var value of fd.values()) {
       console.log(value); 
    }

    this.axiosRequest('post', this.$store.state.application_api+'/employee/'+this.$route.params.id, fd, this.$session.get('headers'))
    .then(res => {
        if(res.data.status != "failed"){
            console.log(res.data.msg)
            this.toastr({ message: 'Updated employee', title: 'Employee' })
        }else{
            this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
        }
        this.update_employee_loading = false
    })
    .catch(err => {
        console.log(err)
    })
},

    customBundeeBtn(){

        this.isEditingCustomBundee ^= true;
        this.bundeebox = this.employee.work_location.timetrack;
        this.work_locations = this.employee.emp_sched[0].work_locations;
    },

    bundeeValidation(index){

        $('#0chckb').removeAttr("disabled");
        $('#1chckb').removeAttr("disabled");
        $('#2chckb').removeAttr("disabled");
        $('#3chckb').removeAttr("disabled");
        this.kioskIsChosen = false;   


        console.log(this.bundeebox);

        // There is data inside
        if(this.bundeebox){

            // Checking if EDTR is checked
            if(this.bundeebox[0]['id'] == 1001){
                $('#'+0+'chckb').attr("disabled",true);
                $('#'+2+'chckb').attr("disabled",true);
                $('#'+3+'chckb').attr("disabled",true);
                this.work_locations = [];
            // Checking if Biometrics(Third party) is checked 
            }else if(this.bundeebox[0]['id'] == 1002){
                $('#'+0+'chckb').attr("disabled",true);
                $('#'+1+'chckb').attr("disabled",true);
                $('#'+3+'chckb').attr("disabled",true);  
                this.work_locations = [];                        
            // Checking if Kiosk or Mobile is checked
            }else if(this.bundeebox[0]['id'] == 1000 || this.bundeebox[0]['id'] == 1003){
                $('#'+1+'chckb').attr("disabled",true);
                $('#'+2+'chckb').attr("disabled",true);   
                if($('.kiosk').is(':checked')){
                    this.kioskIsChosen = true;  
                    this.work_locations = this.employee.emp_sched[0].work_locations;                                

                }else{
                    this.work_locations = [];                                
                }        
            }
        }

    },

}

}

</script>