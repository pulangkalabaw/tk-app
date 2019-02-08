<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>Time Info</a></li>
                <li class="active">Leave Request</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- Start of content -->

                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-primary">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    Leave Request
                                    <span v-if="index_leaves_loading">
                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                    </span>
                                    <span v-else>
                                        <span class='fa fa-refresh' data-toggle="tooltip" title="Refresh data" @click="refreshGetLeaves()"></span>
                                    </span>
                                </h3>
                            </div>
                            <div class="panel-body">

                                <div v-if="index_leaves_loading == false">

                                    <ul class="nav nav-tabs">

                                        <li class="active">
                                            <a data-toggle="tab" href="#allLeaves">Pending requests <span class="label"></span></a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#approvedTab">Approved requests <span class="label"></span></a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#declinedTab">Declined requests <span class="label"></span></a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#vl_sl"><span class="fa fa-send"></span> Request Leave</a>
                                        </li>

                                    </ul>
                                    <!-- end of nav tab -->

                                    <!-- start of tab conent -->
                                    <div class="tab-content">

                                        <!-- ALL -->
                                        <div id="allLeaves" class="tab-pane fade in active">

                                            <div class="row">
                                                <!-- Column for downlaod excel -->
                                                <div class="col-md-6 text-left">

                                                </div>
                                                <!-- Column of legends and info -->
                                                <div class="col-md-6 text-right">
                                                    <i class="fa fa-info-circle text-info"></i> <small class="text-info">Please click on a data to see leave info</small>
                                                </div>
                                            </div>

                                            <table class="datatable table table-hover" width="100%">
                                                <thead>
                                                    <tr class="text-center">
                                                        <td>Leave Type</td>
                                                        <td>Date Start</td>
                                                        <td>Date End</td>
                                                        <td>Time in</td>
                                                        <td>Time out</td>
                                                        <td>Status</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="leave in pendingLeaves" class="text-center" @click="modalBtn(leave)">
                                                        <td>{{ leave.day_type }}</td>
                                                        <td>{{ leave.date_start }}</td>
                                                        <td>{{ leave.date_end }}</td>
                                                        <td>{{ new Date('7/10/2013 '+leave.time_start).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</td>
                                                        <td>{{ new Date('7/10/2013 '+leave.time_end).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</td>
                                                        <td >
                                                            <span v-if="leave.status == 'pending'" class="text-warning"><i class="fa fa-circle-o"></i> </span>
                                                            <span v-if="leave.status == 'approved'" class="text-success"><i class="fa fa-check-circle"></i> </span>
                                                            <span v-if="leave.status == 'declined'" class="text-danger"><i class="fa fa-times-circle"></i> </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <!-- approved -->
                                        <div id="approvedTab" class="tab-pane fade">
                                            <div class="row">
                                                <!-- Column for downlaod excel -->
                                                <div class="col-md-6 text-left"></div>
                                                <!-- Column of legends and info -->
                                                <div class="col-md-6 text-right">
                                                    <i class="fa fa-info-circle text-info"></i> <small class="text-info">Please click on a data to see leave info</small>
                                                </div>
                                            </div>

                                            <table class="datatable table table-hover" width="100%">
                                                <thead>
                                                    <tr class="text-center">
                                                        <td>Leave Type</td>
                                                        <td>Date Start</td>
                                                        <td>Date End</td>
                                                        <td>Time in</td>
                                                        <td>Time out</td>
                                                        <td>Status</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="leave in approvedLeaves" class="text-center" @click="modalBtn(leave)">
                                                        <td>{{ leave.day_type }}</td>
                                                        <td>{{ leave.date_start }}</td>
                                                        <td>{{ leave.date_end }}</td>
                                                        <td>{{ new Date('7/10/2013 '+leave.time_start).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</td>
                                                        <td>{{ new Date('7/10/2013 '+leave.time_end).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</td>
                                                        <td >
                                                            <span v-if="leave.status == 'pending'" class="text-warning"><i class="fa fa-circle-o"></i> </span>
                                                            <span v-if="leave.status == 'approved'" class="text-success"><i class="fa fa-check-circle"></i> </span>
                                                            <span v-if="leave.status == 'declined'" class="text-danger"><i class="fa fa-times-circle"></i> </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <!-- declined -->
                                        <div id="declinedTab" class="tab-pane fade">
                                            <div class="row">
                                                <!-- Column for downlaod excel -->
                                                <div class="col-md-6 text-left"></div>

                                                <!-- Column of legends and info -->
                                                <div class="col-md-6 text-right">
                                                    <i class="fa fa-info-circle text-info"></i> <small class="text-info">Please click on a data to see leave info</small>
                                                </div>
                                            </div>

                                            <table class="datatable table table-hover" width="100%">
                                                <thead>
                                                    <tr class="text-center">
                                                        <td>Leave Type</td>
                                                        <td>Date Start</td>
                                                        <td>Date End</td>
                                                        <td>Time in</td>
                                                        <td>Time out</td>
                                                        <td>Status</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="leave in declinedLeaves" class="text-center" @click="modalBtn(leave)">
                                                        <td>{{ leave.day_type }}</td>
                                                        <td>{{ leave.date_start }}</td>
                                                        <td>{{ leave.date_end }}</td>
                                                        <td>{{ new Date('7/10/2013 '+leave.time_start).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</td>
                                                        <td>{{ new Date('7/10/2013 '+leave.time_end).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</td>
                                                        <td >
                                                            <span v-if="leave.status == 'pending'" class="text-warning"><i class="fa fa-circle-o"></i> </span>
                                                            <span v-if="leave.status == 'approved'" class="text-success"><i class="fa fa-check-circle"></i> </span>
                                                            <span v-if="leave.status == 'declined'" class="text-danger"><i class="fa fa-times-circle"></i> </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <!-- Leaves request -->
                                        <div id="vl_sl" class="tab-pane fade">
                                            <div class="row">
                                                <div class="col-md-12">

                                                    <div class="alert alert-info">
                                                        <span class="fa fa-info-circle"></span>
                                                        Rest day will not be included as your leave
                                                    </div>

                                                    <notif :notif="notif"></notif>
                                                    <br>
                                                </div>

                                                <form method="POST" v-on:submit.prevent="requestLeave()">
                                                    <div class="col-md-6">
                                                        <div>
                                                            <div class="col-md-3">Type</div>
                                                            <div class="col-md-9">
                                                                <select v-model="vlsl_request.day_type" class="selectpicker form-control" required v-if="$store.state.all_leave_types.length != 0">
                                                                    <option value="" disabled="" selected="">-- Please select leave type --</option>
                                                                    <option v-for="lt in $store.state.all_leave_types" :value="lt.leave_code">{{ lt.leave_name }}</option>
                                                                </select>
                                                                <span v-else>
                                                                    <span class='fa fa-refresh fa-spin'></span>
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div class="clearfix"></div><br>

                                                        <div>
                                                            <div class="col-md-3">Shift</div>
                                                            <div class="col-md-9">
                                                                <div class="form-group">
                                                                    <div class="col-sm-10">
                                                                        <div class="radio radio-inline">
                                                                            <input id="r1" type="radio" name="radio" v-model="vlsl_request.leave_type" value="whole" checked="checked" required>
                                                                            <label for="r1">Whole</label>
                                                                        </div>
                                                                        <div class="radio radio-inline">
                                                                            <input id="r2" type="radio" name="radio" v-model="vlsl_request.leave_type" value="first">
                                                                            <label for="r2">1st shift</label>
                                                                        </div>
                                                                        <div class="radio radio-inline">
                                                                            <input id="r3" type="radio" name="radio" v-model="vlsl_request.leave_type" value="second">
                                                                            <label for="r3">2nd shift</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="clearfix"></div><br>

                                                        <div>
                                                            <div class="col-md-3"><p v-if="vlsl_request.leave_type == 'whole'">Date start</p><p v-else>Date</p></div>
                                                            <div class="col-md-9">
                                                                <input type="date" v-model="vlsl_request.date_start" class="form-control" required>
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>

                                                        <div v-if="vlsl_request.leave_type == 'whole'">
                                                            <div class="col-md-3">Date end</div>
                                                            <div class="col-md-9">
                                                                <input type="date" v-model="vlsl_request.date_end" class="form-control" required>
                                                            </div>
                                                            <div class="clearfix"></div><br>
                                                        </div>


                                                        <div>
                                                            <div class="col-md-3"></div>
                                                            <div class="col-md-9 text-right">
                                                                <button type="submit" class="btn btn-success" v-if="create_leave_loading == false">Submit</button>
                                                                <button type="button" class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div><br>


                                                    </div>
                                                    <div class="col-md-6">

                                                        <div class="row">
                                                            <div class="col-md-2">
                                                                <label for="">Reason</label><br>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <div class="col-md-11">
                                                                <textarea rows="7" style="width:100%;resize: vertical;" v-model="vlsl_request.reason" class="form-control"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- end of inside codable(component) -->
                                </div>
                                <div v-else>
                                    Loading please wait...
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- Start of modal -->
                <div class="modal fade" id="viewLeaveModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <form action="" v-on:submit.prevent="updateApproval()">
                                <div class="modal-header">
                                    <button class="close" type="button" data-dismiss="modal" aria-label="Close" @click="closeModalBtn()"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title">Leave approval</h4>
                                </div>
                                <div class="modal-body">
                                    <div class="row" v-if="form.status == 'pending'">
                                        <div class="col-md-12">
                                            <button type="button" class="btn btn-danger" @click="deleteLeave()" v-if="isSendingRequest == false">Delete Data</button>
                                            <button type="button" class="btn btn-default" v-show="false">Edit</button>
                                            <br><br>
                                        </div>
                                    </div>

                                    <!-- alert -->
                                    <!-- <notif :notif="notif"></notif> -->
                                    <!-- end of alert -->

                                    <div class="row">
                                        <div class="col-md-2">
                                            <label for=""><strong>Date start</strong></label>
                                            <p>{{ form.date_start }}</p>
                                        </div>
                                        <div class="col-md-2">
                                            <label for=""><strong>Date end</strong></label>
                                            <p>{{ form.date_end }}</p>
                                        </div>
                                        <div class="col-md-2">
                                            <label for=""><strong>Leave Type</strong></label>
                                            <p>{{ form.day_type }}</p>
                                        </div>
                                        <div class="col-md-3">
                                            <label for=""><strong>Covered time</strong></label>
                                            <p>{{ new Date('7/10/2013 '+form.time_start).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") + ' - ' + new Date('7/10/2013 '+form.time_end).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</p>
                                        </div>
                                        <div class="col-md-3">
                                            <label for=""><strong>Leave status</strong></label>
                                            <p v-if="form.status == 'pending'" class="text-warning"><i class="fa fa-circle-o"></i> {{ form.status }}</p>
                                            <p v-if="form.status == 'approved'" class="text-success"><i class="fa fa-check-circle"></i> {{ form.status }}</p>
                                            <p v-if="form.status == 'declined'" class="text-danger"><i class="fa fa-times-circle"></i> {{ form.status }}</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-12">
                                            <label for=""><strong>Reason</strong></label>
                                            <p class="breadcrumb">{{ form.reason }}</p>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <div class="row">
                                        <div class="col-md-6 text-left">
                                            <button class="btn btn-default" type="button" data-dismiss="modal" @click="closeModalBtn()">Close</button>
                                        </div>
                                        <div class="col-md-6 text-right" v-show="isEditing">
                                            <button class="btn btn-success">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <!-- End of modal -->

                <!-- end of content -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            leaves: '',
            vlsl_request: {},
            notif: '',
            form: '',
            isSendingRequest: false,
            isEditing: false,


            index_leaves_loading: true,
            create_leave_loading: false,

            index_leave_types_loading: true,
        }
    },

    computed: {
        // filter for pending approvals
        pendingLeaves() {
            if(this.$store.state.all_leave_requests){
                let appr = this.$store.state.all_leave_requests
                return appr.filter(function(val){
                    return val.status == 'pending';
                });
            }
        },

        approvedLeaves() {
            if(this.$store.state.all_leave_requests){
                let appr = this.$store.state.all_leave_requests
                return appr.filter(function(val){
                    return val.status == 'approved';
                });
            }
        },

        declinedLeaves() {
            if(this.$store.state.all_leave_requests){
                let appr = this.$store.state.all_leave_requests
                return appr.filter(function(val){
                    return val.status == 'declined';
                });
            }
        },
    },

    created () {
        this.getLeaves();
    },

    mounted(){
        $('.datatable').DataTable();
        $('.selectpicker').selectpicker();
    },

    beforeUpdate() {
        $('.datatable').DataTable().destroy();
    },

    updated () {
        $('.datatable').DataTable();
        $('.selectpicker').selectpicker();
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

        refreshGetLeaves () {
            this.$store.state.all_leave_requests = []
            this.getLeaves()
        },

        getLeaves() {


            this.index_leaves_loading = true;
            this.axiosRequest('get', this.$store.state.application_api+'/leave-request/'+this.$session.get('auth')['user_id'], this.vlsl_request, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    this.$store.state.all_leave_requests = res.data.msg
                }
                this.getLeaveTypesForDropdown()
                this.index_leaves_loading = false;
            })
            .catch(err => console.log(err))

        },

        getLeaveTypesForDropdown () {

            if (this.$store.state.all_leave_types.length == 0) {
                this.getLeaveTypes()
                .then(res => {
                    if (res.data.status != "failed") {
                        this.$store.state.all_leave_types = res.data.msg
                    }
                    this.index_leave_types_loading = false
                })
                .catch(err => console.log(err))
            }
            else {
                this.index_leave_types_loading = false;
            }
        },

        modalBtn(data){
            this.form = data
            $('#viewLeaveModal').modal({
                backdrop: 'static',
                keyboard: false
            });
        },

        closeModalBtn(){
            this.isSendingRequest = false;
            // this.isEditing = false;
        },

        deleteLeave(){
            let conf = confirm("Do you want to delete the leave request?");
            if(conf){
                this.isSendingRequest = true;


                let params = {
                    user_id: this.$session.get('auth')['user_id'],
                    request_id: this.form.request_id
                }

                this.axiosRequest('post', this.$store.state.application_api+'/leave-request/delete', params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ title: 'Success!', message: 'Leave request deleted!'})
                        this.notif = '';
                        this.deleteData(params.request_id);
                        this.isSendingRequest = true;
                    }else{
                        this.notif = '';

                        this.isSendingRequest = false;
                    }
                })
                .catch(err => console.log(err))
            }
        },

        requestLeave(){
            this.create_leave_loading = true;
            this.vlsl_request.user_id = this.$session.get('auth')['user_id'];

            let request_email_params = {
                email: this.$session.get('auth')['email'],
                link: this.$route.params.tenant,
                type: 'le',
                date_start: this.vlsl_request.date_start,
                date_end: this.vlsl_request.date_end,
            };


            this.axiosRequest('post', this.$store.state.application_api+'/leave-request', this.vlsl_request, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    this.refreshGetLeaves();
                    this.toastr({ title: 'Leave', message: 'Leave request successfully sent!'})
                    this.notif = '';
                    
                    // Mailing
                    this.axiosRequest('post', this.$store.state.mail_api + '/request', request_email_params, null, false)

                }else{
                    this.notif = {
                        style: 'alert-danger',
                        message: res.data.msg,
                        icon: 'fa-times-circle'
                    }
                }
                this.create_leave_loading = false;
            })
            .catch(err => console.log(err))
        },

        deleteData(id){
            console.log(this.$store.state.all_leave_requests);
            var indexx = this.$store.state.all_leave_requests.findIndex(x => x.request_id == id);
            this.$store.state.all_leave_requests.splice(indexx, 1);
            console.log(this.$store.state.all_leave_requests);
        },

    }
}
</script>
