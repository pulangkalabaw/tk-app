<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>Time Info</a></li>
                <!-- <li><a href="#" @click="redirect('profile.timetable', { tenant: $route.params.tenant})" >Time table</a></li> -->
                <li class="active">Time Sheet entry</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- Start of content here -->
                
                <div class="row">
                    <div class="col-md-12">
                        
                        <div class="panel panel-primary">
                            <div class="panel-heading">
                                <h3 class="panel-title">Time Sheet entry  <i class="fa fa-spin" :class="$store.state.page_load_icon" v-if="$store.state.loading"></i></h3>
                            </div>
                            <div class="panel-body">

                                <div v-if="timetable">
                                    <!-- Start of inside codable(component) -->
                                        <!-- if all fields are in -->
                                        <div class="row">
                                            <div class="col-md-2 text-left">
                                                <button class="btn btn-secondary" v-if="dates" @click="changeTimeTableDate(dates.prev_start)"><i class="fa fa-chevron-left"></i> Previous</button>
                                            </div>
                                            <div class="col-md-8 text-center">
                                                <h3>{{ dates.start+' - '+dates.end }}</h3>


                                            </div>  
                                            <div class="col-md-2 text-right">
                                                <div v-if="new Date(dates.next_start) <= new Date()">
                                                    <button class="btn btn-secondary" v-if="dates" @click="changeTimeTableDate(dates.next_start)">Next <i class="fa fa-chevron-right"></i></button>                                                                            
                                                </div>
                                            </div>                                
                                        </div>

                                        <div>
                                            <div class="col-md-12 text-right">                                    
                                                <i class="fa fa-info-circle text-info"></i> <small class="text-info">For declined entry, request for time adjustments on time sheet page</small>                    
                                            </div>
                                        </div>

                                        <!-- is editing -->
                                        <div class="row">
                                            <div class="col-md-2 text-center"><strong>Date</strong></div>
                                            <div class="col-md-2 text-center"><strong>Time in</strong></div>
                                            <div class="col-md-2 text-center"><strong>Time Out</strong></div>
                                            <div class="col-md-1 text-center"><strong>Day Type</strong></div>
                                            <div class="col-md-4 text-center"><strong>Remarks</strong></div>
                                            <div class="col-md-1 text-center"><strong>Status</strong></div>
                                        </div>

                                        <div class="row" v-for="(time,index) in timetable">
                                            <!-- DECLINED, PENDING, NULL OR NOT WEB KIOSK -->
                                            <form action="" v-on:submit.prevent v-if="time.status == 'pending' || time.status == null">
                                                <div> <!-- FOR REG -->
                                                    <div class="col-md-2 text-center"><h5>{{ time.date_in }}<small v-if="time.date_in">({{ $store.state.days[new Date(time.date_in).getDay()] }})</small></h5><input type="hidden" v-model="date[index] = time.date_in"></div>
                                                    <div class="col-md-2 text-center"><div :class="[(isError == 'this'+index) ? 'form-group has-error has-feedback': (isError == 'succ'+index) ? 'form-group has-success has-feedback' : '']"><input type="time" v-model="time.time_in" class="form-control input-sm" :disabled="checkerDayType(time)"></div></div>
                                                    <div class="col-md-2 text-center"><div :class="[(isError == 'this'+index) ? 'form-group has-error has-feedback': (isError == 'succ'+index) ? 'form-group has-success has-feedback' : '']"><input type="time" v-model="time.time_out" class="form-control input-sm" :disabled="new Date() < new Date(time.date_in) || time.day_type == 'RD'"></div></div>
                                                    <div class="col-md-1 text-center"><div :class="[(isError == 'this'+index) ? 'form-group has-error has-feedback': (isError == 'succ'+index) ? 'form-group has-success has-feedback' : '']"><!-- <select class="selectpicker form-control input-sm" v-model="time.day_type" :disabled="new Date() < new Date(time.date_in)"><option value="">Select type</option><option :value="dtype" v-for="dtype in $store.state.daytype">{{ dtype }}</option></select> -->        <h5 v-if="new Date() >= new Date(time.date_in)">{{ time.day_type }}</h5><h5 style="opacity: 0.5" v-else>{{ time.day_type }}</h5></div></div>
                                                    <div class="col-md-4 text-center"><input type="text" class="form-control input-sm text-center" v-model="time.remarks" :disabled="new Date() < new Date(time.date_in)"></div>                           
                                                    <div class="col-md-1 text-center">
                                                        <div v-if="new Date() > new Date(time.date_in)">
                                                            <!-- date have already been encountered -->
                                                            <button class="btn btn-success btn-xs" @click="submitSingleLine(index ,time.date_in, time.time_in, time.time_out, time.day_type, time.remarks, 'pending')" v-if="time.status == null"><i class="fa fa-save fa-lg" v-if="isActiveBtn != 'btn'+index"></i><i class="fa fa-refresh fa-spin" v-else></i></button>
                                                            <button class="btn btn-default btn-xs" @click="updateSingleLine(index , time.id ,time.date_in, time.time_in, time.time_out, time.day_type, time.remarks, time.status)" v-else-if="time.status == 'pending' || time.status == 'declined'"><i class="fa fa-edit fa-lg" v-if="isActiveBtn != 'btn'+index"></i><i class="fa fa-refresh fa-spin" v-else></i></button>
                                                        </div>
                                                        <div v-else>
                                                            <!-- date is not yet encoutnered -->
                                                            <i class="fa fa-lock"></i>
                                                        </div>

                                                    </div>
                                                </div>
                                                <!-- <div v-else> 
                                                    <div class="col-md-2 text-center"><h5>{{ time.date_in }}<small v-if="time.date_in">({{ $store.state.days[new Date(time.date_in).getDay()] }})</small></h5><input type="hidden" v-model="date[index] = time.date_in"></div>
                                                    <div class="col-md-2 text-center"><h5 v-if="time.time_in">{{ new Date('7/10/2013 '+time.time_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</h5><h5 v-else>--</h5></div>
                                                    <div class="col-md-2 text-center"><h5 v-if="time.time_out">{{ new Date('7/10/2013 '+time.time_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</h5><h5 v-else>--</h5></div>
                                                    <div class="col-md-1 text-center"><h5 v-if="new Date() >= new Date(time.date_in)">{{ time.day_type }}</h5><h5 style="opacity: 0.5" v-else>{{ time.day_type }}</h5></div>
                                                    <div class="col-md-4 text-center"><h5 v-if="time.remarks">{{ time.remarks }}</h5><h5 v-else>--</h5></div>                          
                                                    <div class="col-md-1 text-center">
                                                        <div v-if="time.status == 'approved'"><h5 class="text-success"><i class="fa fa-check-circle" data-toggle="tooltip" :title="time.status+' by '+time.checked_by"></i></h5></div>
                                                        <div v-if="time.status == 'declined'"><h5 class="text-danger"><i class="fa fa-times-circle" data-toggle="tooltip" :title="time.status+' by '+time.checked_by+' beacuse of '+time.reason"></i></h5></div>                                        
                                                    </div>                                            
                                                    <div class="col-md-1 text-center"><i class="fa fa-lock"></i></div>
                                                </div> -->
                                            </form>
                                            <!-- IF WEB KIOSK OR APPROVED -->
                                            <div v-else>
                                                <div class="col-md-2 text-center"><h5>{{ time.date_in }}<small v-if="time.date_in">({{ $store.state.days[new Date(time.date_in).getDay()] }})</small></h5><input type="hidden" v-model="date[index] = time.date_in"></div>
                                                <div class="col-md-2 text-center"><h5 v-if="time.time_in">{{ new Date('7/10/2013 '+time.time_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</h5><h5 v-else>N/A</h5></div>
                                                <div class="col-md-2 text-center"><h5 v-if="time.time_out">{{ new Date('7/10/2013 '+time.time_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</h5><h5 v-else>N/A</h5></div>
                                                <div class="col-md-1 text-center"><h5>{{ time.day_type }}</h5></div>
                                                <div class="col-md-4 text-center"><h5 v-if="time.remarks">{{ time.remarks }}</h5><h5 v-else>N/A</h5></div>                          
                                                <div class="col-md-1 text-center">
                                                    <div v-if="time.status == 'approved'"><h5 class="text-success"><i class="fa fa-check-circle" data-toggle="tooltip" :title="ucfirst(time.status) +' by '+time.checked_by"></i></h5></div>
                                                    <div v-if="time.status == 'declined'"><h5 class="text-danger"><i class="fa fa-times-circle" data-toggle="tooltip" :title="ucfirst(time.status) +' by '+time.checked_by+' beacuse of '+time.reason"></i></h5></div>                                        
                                                </div>
                                            </div>
                                        </div>
                                        <!-- if some fields are incomplete -->
                                    <!-- End if inside codable(component) -->
                                </div>
                                <div v-else>
                                    Loading please wait...
                                </div>
                                
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
                timetable: '',
                dates: '',
            // forms
            date: {},
            timein: {},
            timeout: {},
            daytype: {},
            remarks: {},

            isActiveBtn: '',
            btnChanger: false,
            isError: '',
            notifAlert: '',
        }
    },


    created () {       
        this.getTimeTable();        
        $('.selectpicker').selectpicker({style: 'btn-sm'});             
        // console.log(this.$session.get('auth'))

    },

    updated () {
        $('[data-toggle="tooltip"]').tooltip('destroy');                        
        $('[data-toggle="tooltip"]').tooltip();  
        $('.selectpicker').selectpicker({style: 'btn-sm'});             
        $('.selectpicker').selectpicker('refresh');             
    },

    methods: {

        getTimeTable() {
            // let user_id = (this.profile == true ? this.$session.get('auth')['user_id'] : this.$route.params.id)
            this.$store.state.loading = true;
            this.axiosRequest('get', this.$store.state.clock_api+'/time/' + this.$session.get('auth')['user_id'], null, this.$session.get('headers'))
            .then(res => {
                console.log(res)
                this.timetable = res.data.msg.edtr
                this.dates = res.data.msg.dates
                if(res.data.success == "success"){
                    this.$store.state.loading = false;
                }else{
                    this.$store.state.loading = false;
                }
            })
            .catch(err => {

            })

        },

        submitSingleLine (index, date_in, time_in, time_out, day_type, remarks, status) {
            this.$store.state.loading = true;

            clearTimeout(this.notifAlert);
            this.isActiveBtn = 'btn'+index;
            let params = {
                user_id: this.$session.get('auth')['user_id'],
                date_in: date_in,
                time_in: time_in,
                time_out: time_out,
                day_type: day_type,
                reference: 'edtr',
                remarks: remarks,
                status: status,
            }
            
            // console.log(params)

            this.axiosRequest('post', this.$store.state.clock_api + '/timeapproval/create', params, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    // this.changeTimeTableDate (this.dates.end)
                    this.timetable[index].status = 'pending';

                    this.isActiveBtn = '';
                    this.isError = 'succ'+index;
                    this.btnChanger = true;

                    let self = this;
                    this.toastr({ title: 'Success!', message: 'Successfully saved edtr.'})
                    this.notif = '';    
                    this.notifAlert = setTimeout(function(){
                        self.isError = ''
                    },3000);  
                    this.$store.state.loading = false;

                }else{
                    this.isActiveBtn = '';
                    this.isError = 'this'+index;  
                    this.toastr({ title: 'Failed!', message: 'Failure on submiting edtr.', type: 'error'})
                    this.notif = '';
                    this.$store.state.loading = false;

                }
                // console.log(res.data)
            })
            .catch(err => {

            })

        },

        updateSingleLine (index, id, date, time_in, time_out, day_type, remarks, status) {
            this.$store.state.loading = true;

            clearTimeout(this.notifAlert);
            this.isActiveBtn = 'btn'+index;
            let params = {
                id: id,
                user_id: this.$session.get('auth')['user_id'],
                date_in: date,
                time_in: time_in,
                time_out: time_out,
                day_type: day_type,
                reference: 'web_edtr',
                remarks: remarks,
                status: status,
            }

            this.axiosRequest('post', this.$store.state.clock_api + '/timeapproval/updatedtr', params , this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    // this.changeTimeTableDate (this.dates.end)
                    this.timetable[index].status = 'pending';                    

                    this.isActiveBtn = '';
                    this.isError = 'succ'+index;

                    let self = this;
                    this.toastr({ title: 'Success!', message: 'Successfully saved edtr.'})
                    this.notif = '';     
                    this.notifAlert = setTimeout(function(){
                        self.isError = ''
                    },3000);  
                    this.$store.state.loading = false;
                }else{
                    this.isActiveBtn = '';
                    this.isError = 'this'+index;      
                    this.toastr({ title: 'Failed!', message: 'Failure on submiting edtr.', type: 'error'})                                                                                    
                    this.$store.state.loading = false;
                }
            })
            .catch(err => {

            })      
        },

        changeTimeTableDate (datadate) {
            this.isError = '';
            this.$store.state.loading = true;

            this.axiosRequest('get', this.$store.state.clock_api+'/time/'+this.$session.get('auth')['user_id']+'?date='+datadate, '', this.$session.get('headers'))
            .then(res => {
                this.timetable = res.data.msg.edtr
                this.dates = res.data.msg.dates
                if(res.data.status = "success"){
                    this.empChecker = true
                    this.$store.state.loading = false;

                }else{
                    this.empChecker = false
                    this.$store.state.loading = false;

                }
            })
            .catch(err => {

            })
        },

        checkerDayType(time){
            if(new Date() < new Date(time.date_in) || time.day_type == 'RD'){
                time.time_in = ''
                time.time_out = '';
                return true;//retrun disabled
            }else{
                return false;
            }
        }


    }
}

</script>