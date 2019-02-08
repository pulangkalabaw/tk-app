<template>

    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">
                <span v-if="profile == true">Time Sheet</span><span v-else>{{ $parent.employee.users.fname + ' ' + $parent.employee.users.lname }}</span> 
                <span v-if="$store.state.loading">
                    <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                </span>
            </h3>
        </div>
        <div class="panel-body">

            <div v-if="timetable">
                <!-- Start of inside codable(component) -->
                    <!-- notif -->
                    <!-- <notif :notif="notif"></notif> -->
                    <!-- end of notif -->

                    <!-- if all fields are okay -->
                    <div class="row">
                        <div class="col-md-6 col-xs-6 text-left">
                            <button class="btn btn-secondary" v-if="dates" @click="changeAllTimeDate(dates.prev_start)"><i class="fa fa-chevron-left"></i> Previous</button>
                        </div>
                        <div class="col-md-6 col-xs-6 text-right">
                            <div >
                                <button class="btn btn-secondary" v-if="dates" @click="changeAllTimeDate(dates.next_start)">Next <i class="fa fa-chevron-right"></i></button>                            
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col text-center">
                            <h3 v-if="dates">{{ dates.start+' - '+dates.end }}</h3>
                            <!-- Excel -->
                            <!-- <download-excel v-if="timetable" :fields="json_fields" :data="timetable" :name="dates.start+ ' - ' + dates.end + ' - ' + $session.get('auth')['lname'] + ', ' + $session.get('auth')['fname']" class="btn btn-success">
                                <i class="fa fa-file-excel-o"></i> Export Excel
                            </download-excel> -->
                            <!-- <a :href="excel_download_link" target="_blank" download="">Download Timesheet</a> -->
                            
                            <a :href="excel_export_link" target="_blank" download="">Download Timesheeet</a>
                            <!-- <form v-on:submit.prevent="downloadExcel(alltime)">
                                <button type="submit" class="btn btn-success">Download Excel</button>
                            </form> -->
                        </div>
                    </div>

                    <div class="row">
                        <!-- Column of legends and info -->
                        <div class="col-md-12 text-right" v-if="profile">
                            <i class="fa fa-info-circle text-info"></i>
                             <small class="text-info">Please click on a data to request for time adjustment</small>                    
                        </div>
                    </div>

                    <!-- is not editing -->
                    <div class="row">
                        <div class="col-md-12 table-responsive" style="border: 0">
                            <table class="table table-hover" v-if="alltime != ''">
                                <thead>
                                    <tr>
                                        <th><strong>Date</strong></th>
                                        <th><strong>Time In</strong></th>
                                        <th><strong>Time Out</strong></th>
                                        <th><strong>Shift</strong></th>
                                        <th><strong>Day Type</strong></th>
                                        <th><strong>Reference</strong></th>
                                        <th><strong>Status</strong></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="time in alltime" class="text-left" :style="[ (new Date() < new Date(time.date_in)) ?  {opacity: 0.5} : {opacity: 1} ]" @click="openModal(time)">
                                        <td>{{ time.date_in }} <small v-if="time.date_in">({{ $store.state.days[new Date(time.date_in).getDay()] }})</small></td>
                                        <td><span v-if="time.time_in">{{ new Date('7/10/2013 '+time.time_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</span></td>
                                        <td>
                                            <span v-if="time.time_out">{{ new Date('7/10/2013 '+time.time_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</span>
                                        </td>
                                        <td>
                                            <span v-if="time.time_in && time.time_out">
                                                <span v-if="time.shift_in">{{ new Date('7/10/2013 '+time.shift_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")+' - '+new Date('7/10/2013 '+time.shift_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</span>
                                            </span>
                                        </td>
                                        <td>
                                            <span v-if="time.day_type">
                                                <span v-if="new Date() > new Date(time.date_in)">{{ time.day_type }}</span><span v-else>{{ time.day_type }}</span>
                                            </span>
                                        </td>
                                        <td>
                                            {{ showBundeeName(time.reference) }}
                                        </td>
                                        <td v-if="time.status">
                                            <!-- Kiosk -->
                                            <span v-if="time.reference != 'web_kiosk'">
                                                <span v-if="time.status == 'pending' && time.day_type == 'REG'" class="text-warning"><i class="fa fa-circle" data-toggle="tooltip" :title="ucfirst(time.status)"></i></span>
                                                <span v-if="time.status == 'approved' && time.day_type == 'REG'" class="text-lime"><i class="fa fa-circle" data-toggle="tooltip" :title="ucfirst(time.status) +' by '+time.checked_by"></i></span>
                                                <span v-if="time.status == 'declined' && time.day_type == 'REG'" class="text-danger"><i class="fa fa-circle" data-toggle="tooltip" :title="ucfirst(time.status) +' by '+time.checked_by+' because of '+time.reason"></i></span>
                                            </span> 
                                            <!-- !Kiosk -->
                                            <span v-else>
                                                <span v-if="time.status == 'approved' && time.day_type == 'REG'" class="text-lime"><i class="fa fa-circle" data-toggle="tooltip" title="Kiosk"></i></span>
                                            </span>
                                            <!-- Other -->
                                            <span v-if="time.day_type == 'VL' || time.day_type == 'SL'"><i class="fa fa-circle text-teal"  data-toggle="tooltip" title="Leave"></i></span>
                                            <span v-if="time.isadjusted == 1"><i class="fa fa-circle text-purple"  data-toggle="tooltip" :title="'Time adjusted by ' + time.checked_by"></i></span>
                                            <span v-if="time.late != 0 && time.late != null"><i class="fa fa-circle text-yellow" data-toggle="tooltip" :title="'Late ' + time.late  + ' minute(s)'"></i></span>                                    
                                            <span v-if="time.undertime != 0 && time.day_type == 'REG' && time.time_out != null"><i class="fa fa-circle text-orange" data-toggle="tooltip" :title="'Undertime ' + time.undertime  + ' minute(s)'"></i></span>
                                            <span v-if="time.day_type == 'RD'"><i class="fa fa-circle text-gray"  data-toggle="tooltip" title="Rest Day"></i></span>
                                            <span v-if="time.overtime['start_time'] != null"><i class="fa fa-circle text-blue"  data-toggle="tooltip" :title="'Overtime '+toHumanTime(time.overtime['start_time'])+' - '+toHumanTime(time.overtime['end_time'])"></i></span>
                                            <!-- ./Other -->
                                        </td>
                                        <td v-else>
                                            <!-- Absent -->
                                            <span v-if="new Date() > new Date(time.date_in)">
                                                <span v-if="time.day_type == 'ABSENT'"><i class="fa fa-circle text-red"  data-toggle="tooltip" title="Absent"></i></span>
                                                <span v-if="time.overtime['start_time'] != null"><i class="fa fa-circle text-blue"  data-toggle="tooltip" :title="'Overtime '+toHumanTime(time.overtime['start_time'])+' - '+toHumanTime(time.overtime['end_time'])"></i></span>
                                            </span>
                                            <span v-else>
                                                <span v-if="time.overtime['start_time'] != null"><i class="fa fa-circle text-blue"  data-toggle="tooltip" :title="'Overtime '+toHumanTime(time.overtime['start_time'])+' - '+toHumanTime(time.overtime['end_time'])"></i></span>
                                            </span>
                                            <!-- ./Absent -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-else class="text-center">
                                No timetable data                                
                            </div>
                        </div>
                    </div>

                    <!-- MODAL FOR ADJUSTMENT -->
                    <div class="modal fade" id="adjustmentModal" >
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form action="" v-on:submit.prevent="sendAdjustmentRequest()">
                                    <div class="modal-header">
                                        <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title">Request Adjustment form</h4>
                                    </div>
                                    <div class="modal-body">

                                        <!-- alert -->
                                        <div class="row">
                                            <div class="col-md-12">
                                                <!-- <div :class="notif.class" class="text-center" v-if="notif.status == true">
                                                    {{ notif.msg }}
                                                </div> -->
                                                <!-- notif -->
                                                <notif :notif="notif"></notif>
                                                <!-- end of notif -->
                                                <br>
                                            </div>
                                        </div>


                                        <div class="row">
                                            <div class="col-md-4">
                                                <label for=""><strong>Date:</strong></label>    
                                                <p>{{ form.date_in }}</p>                                             
                                            </div>
                                            <div class="col-md-4">
                                                <label for=""><strong>Shift:</strong></label>
                                                <p v-if="form.shift_in">{{ toHumanTime(form.shift_in)+' - '+toHumanTime(form.shift_out) }}</p><p v-else>N/A</p>
                                            </div>
                                            <div class="col-md-4">
                                                <label for=""><strong>Reference:</strong></label>
                                                <p v-if="form.reference">{{ form.reference }}</p><p v-else>N/A</p>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-4">
                                                <label for=""><strong>Remarks:</strong></label>
                                                <p v-if="form.remarks">{{ form.remarks }}</p><p v-else>N/A</p>
                                            </div>
                                            <div class="col-md-4">
                                                <label for=""><strong>Grace period:</strong></label>
                                                <p v-if="form.grace_period">{{ form.grace_period }} minutes</p><p v-else>None</p>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6">

                                                <!-- OLD -->
                                                <div class="breadcrumb">
                                                    <h4>Original time data</h4>
                                                    <div class="row">
                                                        <div class="col-md-4"><strong>Time In:</strong></div>
                                                        <div class="col-md-8"><input type="time" class="form-control input-sm" :value="form.time_in" disabled><br></div>
                                                        <div class="col-md-4"><strong>Time out:</strong></div>
                                                        <div class="col-md-8"><input type="time" class="form-control input-sm" :value="form.time_out" disabled><br></div>
                                                        <div class="col-md-4"><strong>Day Type:</strong></div>
                                                        <div class="col-md-8">
                                                            <select class="selectpicker form-control input-sm" v-model="form.day_type" disabled>
                                                                <option value="">Select type</option>    
                                                                <option value="VL">Vacation Leave</option>                                                                                                                  
                                                                <option :value="daytype" v-for="daytype in $store.state.daytype">{{ daytype }}</option>
                                                            </select>
                                                            <br>
                                                        </div>
                                                    </div>  

                                                </div>


                                            </div>
                                            <div class="col-md-6">

                                                <!-- NEW -->
                                                <div class="breadcrumb">
                                                    <h4>Change to</h4>
                                                    <div class="row">
                                                        <div class="col-md-4"><strong>Time In:</strong></div>
                                                        <div class="col-md-8"><input type="time" class="form-control input-sm" v-model="form.new_time_in" :disabled="checkerDayType(form.new_day_type)"><br></div>
                                                        <div class="col-md-4"><strong>Time out:</strong></div>
                                                        <div class="col-md-8"><input type="time" class="form-control input-sm" v-model="form.new_time_out" :disabled="checkerDayType(form.new_day_type)"><br></div>
                                                        <div class="col-md-4"><strong>Day Type:</strong></div>
                                                        <div class="col-md-8">
                                                            <select class="selectpicker form-control input-sm" v-model="form.new_day_type">
                                                                <option value="">Select type</option>
                                                                <option value="ABSENT">ABSENT</option>                                                        
                                                                <option :value="daytype" v-for="daytype in $store.state.daytype">{{ daytype }}</option>
                                                            </select>
                                                            <br>
                                                        </div>
                                                    </div>              
                                                </div>


                                            </div>
                                        </div>                                  

                                        <div class="row">
                                            <div class="col-md-12">
                                                <label for=""><strong>Reason:</strong></label>
                                                <textarea cols="2" rows="2" class="form-control" style="resize: vertical;" v-model="reason" required=""></textarea>
                                            </div>
                                        </div>

                                    </div>
                                    <div class="modal-footer">
                                        <button class="btn btn-default" type="button" data-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-success" v-if="create_request_loading == false">Request adjustment</button>
                                        <button class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <!-- END OF MODAL FOR ADJUSTMENT -->


                <!-- End of all inside(codable component) -->
            </div>
            <div v-else>
                Loading please wait...
            </div>


        </div>
    </div>
</template>

<script>

    import Vue from "vue";
    import JsonExcel from "vue-json-excel";

    Vue.component("downloadExcel", JsonExcel);

    export default {

        props: ['profile', 'enableAdjustment'],

        data () {
            return {

                timetable: '',
                alltime: '',
                dates: '',
                sched: '',
                form: '',
                reason: '',
                notif: '',

                // for export excel
                json_meta: [[{ key: "charset", value: "utf-8" }]],
                json_fields: {
                    "Date": "date_in",
                    "Time In": "time_in",
                    "Time out": "time_out",
                    "Shift In": "shift_in",
                    "Shift Out": "shift_out",
                    "Type": "day_type",
                    "Remarks": "remarks",
                },

                create_request_loading: false,
            }
        },

        created () {
            this.getTimeTable();
            this.getFinalDtr();
        },
        // beforeUpdate() {
        //     // $('[data-toggle="tooltip"]').tooltip('destroy');                        

        // },

        mounted(){
            $('.selectpicker').selectpicker({style: 'btn-sm'});  
        },

        updated () {
            $('.selectpicker').selectpicker({style: 'btn-sm'});             
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

        computed: {
            excel_download_link: function() {
                let filename = this.$session.get('auth')['emp_num'] + '-' + this.$session.get('auth')['lname'] + ' ' + this.$session.get('auth')['fname'] 
                return this.$store.state.excel + '/download?edtr=' + JSON.stringify(this.alltime) + '&filename=' + filename;
            },

            excel_export_link: function() {
                let filen = this.$session.get('auth')['emp_num'] + '-' + this.$session.get('auth')['lname'] + ' ' + this.$session.get('auth')['fname'] 
                let user_id = (this.profile == true ? this.$session.get('auth')['user_id'] : this.$route.params.id);
                let filename = (this.profile == true ? filen : this.$parent.employee.users.lname + ', ' + this.$parent.employee.users.fname);
                return this.$store.state.excel+'/export/'+ user_id + '?&tkey=' + this.$session.get('headers')['t'] + '&dkey=' + this.$session.get('headers')['d'] + '&date=' + this.dates.start + '&filename=' + filename;
            },

        },

        methods: {

            getTimeTable(){

                let user_id = (this.profile == true ? this.$session.get('auth')['user_id'] : this.$route.params.id)                
                this.axiosRequest('get', this.$store.state.clock_api+'/time/final/edtr/' + user_id, null, this.$session.get('headers'))
                .then(res => {                
                    if(res.data.status == "success"){
                        this.alltime = res.data.msg.edtr
                        this.dates = res.data.msg.dates
                    }
                    this.$store.state.loading = false
                    console.log(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
            },

            getFinalDtr() {
                this.$store.state.loading = true
                let user_id = (this.profile == true ? this.$session.get('auth')['user_id'] : this.$route.params.id)
                this.axiosRequest('get', this.$store.state.clock_api+'/time/final/edtr/' + user_id, null, this.$session.get('headers'))
                .then(res => {
                    this.timetable = res.data.msg.edtr
                    this.dates = res.data.msg.dates
                    this.sched = res.data.msg.schedule
                    if(res.data.status = "success"){
                        this.$store.state.loading = false
                    }
                    // console.log(res.data.msg)
                })
                .catch(err => {

                })

            },

            openModal(data){
                if (this.enableAdjustment == true) {
                    this.form = data;
                    if(new Date() > new Date(data.date_in)){
                        // show modal because past and present are aligned
                        if( data.status != 'pending'){
                            $('#adjustmentModal').modal({
                                backdrop: 'static',
                                keyboard: false
                            });
                        }else{
                            alert("Can't request time adjustment if status is pending");
                        }

                    }else{
                        // do not show modal if date not happned yet
                    }
                }
            },

            checkerDayType(daytype){
                // if return true means disable the field
                if(daytype == 'RD'  || daytype == 'ABSENT'){
                    this.form.new_time_in = '';
                    this.form.new_time_out = '';
                    return true;
                }else{
                    return false;
                }
            },

            changeAllTimeDate(datadate){
                this.$store.state.loading = true
                let user_id = (this.profile == true ? this.$session.get('auth')['user_id'] : this.$route.params.id);                
                this.axiosRequest('get', this.$store.state.clock_api+'/time/final/edtr/'+user_id+'?date='+datadate, '', this.$session.get('headers'))
                .then(res => {
                    this.alltime = res.data.msg.edtr
                    this.dates = res.data.msg.dates           
                    
                    if(res.data.status == "success"){
                        this.$store.state.loading = false
                    }
                    console.log(res.data)

                })
                .catch(err => {

                })

            },

            changeTimeTableDate (datadate) {

                this.$store.state.loading = true
                this.axiosRequest('get', this.$store.state.clock_api+'/time/'+this.$session.get('auth')['user_id']+'?date='+datadate, '', this.$session.get('headers'))
                .then(res => {
                    this.timetable = res.data.msg.edtr
                    this.dates = res.data.msg.dates           
                    
                    if(res.data.status == "success"){
                        this.$store.state.loading = false
                    }
                    // console.log(res.data)
                })
                .catch(err => {

                })
            },

            sendAdjustmentRequest(){
                this.create_request_loading = true;

                if(this.form.id){

                    // IF THERE IS AN EXISTING DATA ON TIME SHEET
                    let params = {
                        user_id: this.$session.get('auth')['user_id'],
                        edtr_id: this.form.id,
                        date_in: this.form.date_in,
                        old_time_in: this.form.time_in,
                        old_time_out: this.form.time_out,
                        old_day_type: this.form.day_type,
                        time_in: this.form.new_time_in,
                        time_out: this.form.new_time_out,
                        day_type: this.form.new_day_type,
                        reference: this.form.reference,
                        grace_period: this.form.grace_period,
                        late_threshold: this.form.late_threshold,
                        undertime_threshold: this.form.undertime_threshold,
                        reason: this.reason,
                    }

                    // console.log(params);

                    this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment', params, this.$session.get('headers'))
                    .then(res => {
                        // this.getTimeTable();
                        if(res.data.status == "success"){
                            this.changeAllTimeDate(this.dates.end);
                            this.toastr({ title: 'Success!', message: 'Successfully sent adjustment request on '+ params.date_in +'.'})
                            this.notif = '';
                            this.create_request_loading = false;
                        }else{
                            this.changeAllTimeDate(this.dates.end);
                            this.notif = {
                                status: true,
                                class: 'alert alert-danger',
                                msg: res.data.msg
                            }
                            this.create_request_loading = false;                            
                        }
                        this.$store.state.loading = false
                        // console.log(res.data)
                    })
                    .catch(err => console.log(err))
                    // END IF THERE IS AN EXISTING DATA ON TIME SHEET

                }else{      

                    let params = {
                        user_id: this.$session.get('auth')['user_id'],
                        old_day_type: this.form.day_type,
                        date_in: this.form.date_in,
                        time_in: this.form.new_time_in,
                        time_out: this.form.new_time_out,
                        day_type: this.form.new_day_type,
                        reference: 'edtr',
                        reason: this.reason
                        // shift in & shift out insert through backend
                    }

                    this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment', params, this.$session.get('headers'))
                    .then(res => {
                        // this.getTimeTable();
                        console.log(this.dates);
                        if(res.data.status == "success"){
                            this.changeAllTimeDate(this.dates.end);
                            this.toastr({ title: 'Success!', message: 'Successfully sent adjustment request on '+ params.date_in +'.'})
                            this.notif = '';
                            this.create_request_loading = false;
                        }else{
                            this.changeAllTimeDate(this.dates.end);                            
                            this.notif = {
                                style: 'alert-danger',
                                message: res.data.msg
                            }
                            this.toastr({ title: 'Adjustment Request', message: 'Request sending failed!', type: 'error' })
                            this.create_request_loading = false;
                        }
                        this.$store.state.loading = false
                        // console.log(res.data)
                    })
                    .catch(err => console.log(err))

                }            

            },

            downloadExcel(alltime){

                let params = {
                    'user_id': this.$session.get('auth')['user_id'],
                    // 'alltime': alltime
                }

                // this.$axios.get(this.$store.state.excel+'/export/'+ this.$session.get('auth')['user_id'], {body: params.user_id}).then(res => console.log(res));

                // window.open(this.$store.state.excel+'/export/'+ this.$session.get('auth')['user_id'], '_blank');

                this.axiosRequest('get', this.$store.state.excel+'/export/'+ this.$session.get('auth')['user_id'] + '?&tkey=' + this.$session.get('headers')['t'] + '&dkey=' + this.$session.get('headers')['d'] , null, this.$session.get('headers'))
                    .then(res => {
                        // this.getTimeTable();
                        // var file = new Blob([res.blob()], {type: 'application/xlsx'});
                        // var fileURL = window.URL.createObjectURL(file);
                        // window.open(fileURL);
                        // console.log(res)
                    })
                    .catch(err => console.log(err))

            },


        }

    }

</script>