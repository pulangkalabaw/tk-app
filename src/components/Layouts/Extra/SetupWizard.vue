<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>{{ $session.get('auth')['company_name'].toUpperCase() }}</li>
                <li class="active">Setup Wizard</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">          
                    <div class="col-md-12">
                        <div class="panel panel-info">
                            <div class="panel-heading">
                                <h3 class="panel-title">Setup wizard <span style="float:right"></span></h3>
                            </div>
                            <div class="panel-body" v-if="setupstatus">
                                <div class="row">
                                    <div class="col-md-12">
                                        <p>We are setting up your company, please follow these few steps.</p>
                                    </div>
                                </div>

                                <!-- TABS NAV -->
                                <ul class="nav nav-tabs">
                                    <li class="active disabled">
                                        <a class="disable" href="#setupsched">Default work schedule</a>
                                    </li>
                                    <li class="disabled">
                                        <a class="disable" href="#setupbranch">Set up main office operations</a>
                                    </li>
                                    <li class="disabled">
                                        <a class="disable" href="#setupemployees">Finish Setup</a>
                                    </li>
                                </ul>

                                <!-- START OF SETUP TAB CONTENT -->
                                <div class="tab-content">

                                    <!-- Setup Schedule -->
                                    <div id="setupsched" class="tab-pane fade in active" v-if="setupstatus.isScheduleFinished == 0" style="padding: 10px;">

                                        <div class="row">
                                            <div class="col-md-12">
                                                <h4 class="text-center text-primary"><span class='fa fa-info-circle'></span> Your company default schedule</h4>
                                            </div>                          
                                        </div>
                                        <div class="clearfix"></div><br>
                                        <!-- Start of form for schedule -->
                                        <form method="post" v-on:submit.prevent="createSchedule('setupbranch')">
                                            <!-- alert -->
                                            <notif :notif="notif"></notif>
                                            <!-- end of alert  -->
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label for=""><strong>Schedule Name</strong></label>
                                                    <input type="text" class="form-control" v-model="form.sched_name" placeholder="e.g. Regular shift" required="">
                                                </div>

                                                <div class="col-md-3">
                                                    <label for=""><strong>Shift In</strong></label>
                                                    <input type="time" class="form-control" v-model="form.shift_in" placeholder="e.g. Regular shift" required="">
                                                </div>

                                                <div class="col-md-3">
                                                    <label for=""><strong>Shift Out</strong></label>
                                                    <input type="time" class="form-control" v-model="form.shift_out" placeholder="e.g. Regular shift" required="">
                                                </div>

                                                <div class="col-md-2">
                                                    <label for=""><strong>Grace Period</strong></label>
                                                    <input type="text" class="form-control" v-model="form.grace_period" v-on:keypress="isNumber()" placeholder="e.g 10 (in minutes)" required="">
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="col-md-5">
                                                    <label for=""><strong>Remarks</strong></label>
                                                    <textarea class="form-control" col="2" row="2" v-model="form.remarks" placeholder="e.g. Schedule for regular shifts" style="resize: vertical" required=""></textarea>
                                                </div>

                                                <div class="col-md-7">
                                                    <label for=""><strong>Days</strong></label>     
                                                    <span>
                                                        <div class="form-group" >
                                                            <!-- <div class="checkbox" > -->
                                                                <span v-for="(days, index) in $store.state.days">                                                                    
                                                                    <!-- <div class="row"> -->
                                                                        <div class="col-md-2">
                                                                            <!-- <input :id="index" type='checkbox':key='days':value='days'v-model='new_sched.days'/>  -->
                                                                            <label :for="index">{{ days }}:</label> &nbsp;
                                                                        </div>
                                                                        <div class="col-md-3">
                                                                            <!-- <select class="form-control" @input="handleSelect(days)"> -->
                                                                            <select class="form-control" v-model="form.days[index]">
                                                                                <option selected :value="{'day': days, 'type': 1}">REG</option>
                                                                                <option :value="{'day': days, 'type': 0 }">RD</option>
                                                                            </select>
                                                                        </div>
                                                                        <div class="col-md-1"></div>
                                                                    <!-- </div> -->
                                                                </span>
                                                            <!-- </div> -->
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>

                                            <br>                                
                                            <div class="row">
                                                <div class="col-md-6"></div>
                                                <div class="col-md-6 text-right">
                                                    <button type="submit" class="btn btn-success" v-if="create_schedule_loading == false">Set schedule</button>
                                                    <button type="button" class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>
                                                </div>
                                            </div>
                                        </form>
                                        <!-- end of form for schedule -->


                                    </div>

                                    <!-- Setup Branch -->
                                    <div id="setupbranch" class="tab-pane fade" v-if="setupstatus.isLocationFinished == 0">

                                        <form action="" v-on:submit.prevent="createBranch('setupemployees')">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <h4 class="text-center text-primary">Your main operation office</h4>
                                                </div>                          
                                            </div>

                                            <!-- alert -->
                                                <notif :notif="notif"></notif>
                                            <!-- end of alert  -->

                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label for=""><strong>Location name</strong></label>
                                                    <input type="text" class="form-control" v-model="form.branch_name" placeholder="e.g. Sample Office" required="">
                                                </div>

                                                <div class="col-md-8">
                                                    <label for=""><strong>Address</strong></label>
                                                    <textarea type="time" class="form-control" v-model="form.address" placeholder="e.g. Sample Street, Sample Building, Sample City"></textarea>
                                                </div>

                                                <div class="col-md-6">
                                                    <label for=""><strong>Schedule</strong></label>
                                                    <select class="selectpicker form-control" v-model="form.sched_id">
                                                        <option value="">Select schedule</option>
                                                        <option :value="sched.sched_id" v-for="sched in schedules">{{ sched.sched_name }}</option>
                                                    </select>
                                                </div>

                                                <div class="col-md-6">
                                                    <label for=""><strong>Bundee</strong></label>
                                                    <span v-if="bundee">
                                                        <div class="form-group" >
                                                            <div class="checkbox" >
                                                                <span v-for="(bun, index) in bundee" style="margin-right: 20px;">
                                                                    <input :id="index+'bun'" type='checkbox' v-model="bundeeform" :value="{'id': parseInt(bun.id), 'bundee': bun.name}" @change="bundeeResrtrictions(index+'bun')"/> 
                                                                    <label :for="index+'bun'" v-if="bun.name == 'kiosk'">Kiosk</label> &nbsp;
                                                                    <label :for="index+'bun'" v-if="bun.name == 'edtr'">EDTR</label> &nbsp;
                                                                    <label :for="index+'bun'" v-if="bun.name == 'mobile'">Mobile</label> &nbsp;
                                                                    <label :for="index+'bun'" v-if="bun.name == 'third_party_biometrics'">Biometrics (Third Party)</label> &nbsp;
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </span>
                                                    <small>*Note: DTR cannot be the merge with other bundees.</small>
                                                </div>
                                            </div>

                                            <br>                                
                                            <div class="row">
                                                <div class="col-md-6"></div>                                        
                                                <div class="col-md-6 text-right">
                                                    <button type="submit" class="btn btn-success" v-if="create_location_loading == false">Set location</button>
                                                    <button class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>
                                                </div>
                                            </div>
                                        </form>

                                    </div>  

                                    <!-- Setup Employee -->
                                    <div id="setupemployees" class="tab-pane fade">
                                        <div class="alert alert-success">
                                            <center>
                                                <br>
                                                <h4><span class='fa fa-check-circle'></span> Setup complete! To add employees click <a class="text-success" href="#" @click="finishThenGoToEmp()"><b>here</b></a>, Or click done to finish setup.</h4>
                                            </center>
                                        </div>
                                        <br>                                
                                        <div class="row">
                                            <div class="col-md-6"></div>
                                            <div class="col-md-6 text-right">
                                                <button type="button" class="btn btn-success" @click="finishSetup()" v-if="setup_done_loading == false">Done</button>
                                                <button class="btn btn-success" v-else></button>
                                            </div>
                                        </div>

                                    </div>                             

                                </div>
                                <!-- END OF SETUP TAB CONTENT -->

                            </div>
                        </div> <!-- ./Panel Body -->

                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>


    export default{

        data(){
            return {
                setupstatus: '',
                isSchedOkay: false,
                form: {
                    days: []            
                },
                notif: '',
                bundeeform: [],
                bundee: [
                {id: 1000, name: 'kiosk'},
                {id: 1001, name: 'edtr'},
                {id: 1002, name: 'third_party_biometrics'},
                {id: 1003, name: 'mobile'},
                ],
                schedules: {},

                // loadings                
                create_schedule_loading: false,
                create_location_loading: false,
                setup_done_loading: false,
            }
        },

        created(){
            this.getSetupStatus();
            this.getSchedule();
        },

        mounted(){
            $('.selectpicker').selectpicker();
        },

        updated(){
            this.checkSetupStatus();
            $('.selectpicker').selectpicker('refresh');     
        },

        notifications: {
            toastr: {
                timeout: 2500,
                title: '',
                message: '',
                type: 'success'
            }
        },

        methods:{

        // fornumber only
        isNumber: function(evt) {
                evt = (evt) ? evt : window.event;
                var charCode = (evt.which) ? evt.which : evt.keyCode;
                if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                    evt.preventDefault();;
                } 
                else {
                  return true;
              }
        },

        // For restriction of choosing bundee
        bundeeResrtrictions(id){
            document.getElementById('0bun').disabled = false;
                document.getElementById('1bun').disabled = false;
                document.getElementById('2bun').disabled = false;
                document.getElementById('3bun').disabled = false;

                // For Kiosk or Mobile
                if(id == '0bun' || id == '3bun'){
                    if(!document.getElementById('0bun').checked && !document.getElementById('3c').checked){
                        document.getElementById('1bun').disabled = false;
                        document.getElementById('2bun').disabled = false;
                    }else{
                        document.getElementById('1bun').disabled = true;
                        document.getElementById('2bun').disabled = true;
                    }
                // For EDTR
                }else if(id == '1bun'){
                    if(!document.getElementById('1bun').checked){
                        document.getElementById('0bun').disabled = false;
                        document.getElementById('2bun').disabled = false;
                        document.getElementById('3bun').disabled = false;
                    }else{
                        document.getElementById('0bun').disabled = true;
                        document.getElementById('2bun').disabled = true;
                        document.getElementById('3bun').disabled = true;
                    }
                }else if(id == '2bun'){
                    if(!document.getElementById('2bun').checked){
                        document.getElementById('0bun').disabled = false;
                        document.getElementById('1bun').disabled = false;
                        document.getElementById('3bun').disabled = false;
                    }else{
                        document.getElementById('0bun').disabled = true;
                        document.getElementById('1bun').disabled = true;
                        document.getElementById('3bun').disabled = true;
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

        tabClicked(tabhref){
            if(tabhref == 'setupbranch'){
                if(this.isSchedOkay == true){
                    $('.nav-tabs a[href="#'+tabhref+'"]').tab('show');
                }
                else{
                    return false;
                }
            }
        },

        getSetupStatus(){
            this.axiosRequest('get', this.$store.state.application_api + '/setup-index', '', this.$session.get('headers'))
            .then(res => {
               this.setupstatus = res.data.msg;
           })
            .catch(err => {});
        },

        checkSetupStatus(){
         if(this.setupstatus['isScheduleFinished'] == 1 && this.setupstatus['isLocationFinished'] == 1 && this.setupstatus['isFinishedSetup'] == 1){
                // if all is okay
               $('.nav-tabs a[href="#setupemployees"]').tab('show');     
                // console.log('if all is okay');

            }else if(this.setupstatus['isScheduleFinished'] == 1 && this.setupstatus['isLocationFinished'] == 0 && this.setupstatus['isFinishedSetup'] == 0){
                // if sched is okay
                $('.nav-tabs a[href="#setupbranch"]').tab('show');
                // console.log('if sched is okay');

            }else if(this.setupstatus['isScheduleFinished'] ==  1 && this.setupstatus['isLocationFinished'] == 1 && this.setupstatus['isFinishedSetup'] == 0){
                // if sched and branch is okay
               $('.nav-tabs a[href="#setupemployees"]').tab('show');   
                // console.log('if sched and branch is okay');

            }else{
                // if all is not yet okay
               $('.nav-tabs a[href="#setupsched"]').tab('show');      
                // console.log('if all is not yet okay');

            }
        },

        createSchedule(tobranch){
            this.notif = '';
            this.create_schedule_loading = true;

            this.form.days = this.form.days.filter(x => x != null);

            if(this.form.days.length == 7){

                let params = {
                        sched_name: this.form.sched_name,
                        shift_in: this.form.shift_in,
                        shift_out: this.form.shift_out,
                        days: this.form.days,
                        grace_period: this.form.grace_period,
                        remarks: this.form.remarks,
                        added_by: this.$session.get('auth')['user_id'],
                    }

                    console.log(params);

                    this.axiosRequest('post', this.$store.state.application_api + '/schedule', params, this.$session.get('headers'))
                    .then(res => {
                        if(res.data.status == "success"){

                            // CHANGE SETUP SCHED TO FINISH
                            let params = {
                                company_id: this.$session.get('auth')['company_id'],
                                isScheduleFinished: 1
                            }

                            // Update ['isScheduleSetup'] = 1
                            this.axiosRequest('post', this.$store.state.application_api + '/setup-finish', params, this.$session.get('headers'))
                            .then(res => {
                                if(res.data.status == "success"){
                                    this.getSetupStatus();
                                    this.getSchedule();
                                    this.toastr({ title: 'Setup Wizard', message: 'Setup Default Schedule Complete!' })
                                    this.form = { bundee: [] };
                                    // $('.nav-tabs a[href="#'+tobranch+'"]').tab('show');     
                                    this.create_schedule_loading = false;            
                                }
                                else{
                                    this.toastr({ title: 'Setup Wizard', message: 'Setup Default Schedule Failed!', type: 'error' });
                                    this.create_schedule_loading = false;
                                }
                            })
                            .catch(err => {});
                            // END OF CHANGE SETUP TO FINISH

                        }
                        else{
                            this.notif = {style: 'alert-danger', message: res.data.msg, }
                            this.create_schedule_loading = false;
                        }
                    })
                    .catch(err => console.log(err));

            }else{
                
                this.notif = {style: 'alert-danger', message: 'Please input valid days', }
                this.create_schedule_loading = false;
                

            }
               

        },

        getSchedule(){

            this.axiosRequest('get', this.$store.state.application_api + '/schedule', null, this.$session.get('headers'))
            .then(res => {
                this.schedules = res.data.msg;
            })
            .catch(err => {});

        },

        createBranch(toemployees){

            this.create_location_loading = true;

            // checker for edtr
            let check = this.bundeeform.filter(x => x.id == 1001);
            if(check.length == 1){
                // if there is conflicting edtr will be chosen
                this.bundeeform = check;
            }
            // end of checker fore edtr

            let params = {
                branch_name: this.form.branch_name,
                address: this.form.address,
                timetrack_id: this.bundeeform,
                sched_id: this.form.sched_id,
            }

            this.axiosRequest('post', this.$store.state.application_api + '/location', params, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    // CHANGE SETUP BRANCH TO FINISH
                    let params = {
                        company_id: this.$session.get('auth')['company_id'],
                        isLocationFinished: 1,
                    }

                    this.axiosRequest('post', this.$store.state.application_api + '/setup-finish', params, this.$session.get('headers'))
                    .then(res => {
                        if(res.data.status == "success"){
                            this.getSetupStatus();
                            this.toastr({ title: 'Setup Wizard', message: 'Setup Default Location Complete!' })
                            // $('.nav-tabs a[href="#'+toemployees+'"]').tab('show');                  
                            this.create_location_loading = false;
                        }else{
                            this.toastr({ title: 'Setup Wizard', message: 'Setup Default Location Failed!', type: 'error' })
                            this.create_location_loading = false;
                        }
                        // console.log(res.data)
                    })
                    .catch(err => {});
                    // END OF CHANGE BRANCH TO FINISH
                }
                else{
                    this.notif = {style: 'alert-danger', message: res.data.msg, }
                    this.create_location_loading = false;
                }
                // console.log({ addLocation: res })
            })
            .catch(err => console.log(err))
        },


        finishSetup(){
            // CHANGE SETUP TO FINISH
            let params = {
                company_id: this.$session.get('auth')['company_id'],
                isFinishedSetup: 1
            }

            this.axiosRequest('post', this.$store.state.application_api + '/setup-finish', params, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    this.toastr({ title: 'Setup Wizard', message: 'Setup Complete!' })
                    this.$session.set('setup', {isFinishedSetup: 1});
                    this.$session.set('bundee', res.data.msg);
                    window.location.href = this.$store.state.app_url + '/' + this.$route.params.tenant + '/Profile/Dashboard';
                }
                else{
                    this.toastr({ title: 'Setup Wizard', message: 'Setup Failed!', type: 'error' })

                }
            })
            .catch(err => {});
            // END OF SETUP TO FINISH
        },

        finishThenGoToEmp(){
            // CHANGE SETUP TO FINISH
            this.setup_done_loading = true;

            let params = {
                company_id: this.$session.get('auth')['company_id'],
                isFinishedSetup: 1
            }

            this.axiosRequest('post', this.$store.state.application_api + '/setup-finish', params, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    this.toastr({ title: 'Setup Wizard', message: 'Setup Complete!' })
                    this.$session.set('setup', {isFinishedSetup: 1});
                    this.$session.set('bundee', res.data.msg);
                    window.location.href = this.$store.state.app_url + '/' + this.$route.params.tenant + '/Employees';
                    this.setup_done_loading = false;
                }
                else{
                    this.toastr({ title: 'Setup Wizard', message: 'Setup Failed!', type: 'error' })
                    this.setup_done_loading = false;
                }
            })
            .catch(err => {});
            // END OF SETUP TO FINISH
        }
    }

}

</script>


<style>
a.disable{
  pointer-events: none;
  cursor: default;
}
</style>
