<template>

     <div class="main__cont">
        <div class="main-heading">
                <ol class="breadcrumb">
                    <li>Time Info</li>
                    <li class="active">Time approvals</li>
                </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
            <!-- START of Content here -->
            
                <div class="row">
                    <!-- start of column of time approvals -->
                    <div class="col-md-12">
                        <div class="panel panel-primary">
                            <div class="panel-heading">
                                <h3 class="panel-title">Approvals <i class="fa fa-spin" v-if="$store.state.loading" :class="$store.state.page_load_icon"></i></h3>                           
                            </div>
                            <div class="panel-body">
                                
                                <div v-if="approvals">
                                    <!-- start of inside codable(component) -->
                                        
                                        <div class="row" v-if="dates">
                                            <div class="col-md-2 text-left">
                                                <button class="btn btn-secondary" v-if="dates" @click="ChangeDate(dates.prev_start)"><i class="fa fa-chevron-left"></i> Previous</button>
                                            </div>
                                            <div class="col-md-8 text-center">
                                                <!-- <button class="btn btn-info" @click="redirect('profile.timetable', { tenant: $route.params.tenant})">Cancel</button> -->
                                                <h3>{{ dates.start+' - '+dates.end }}</h3>
                                            </div>  
                                            <div class="col-md-2 text-right">
                                                <div v-if="new Date(dates.next_start) <= new Date()">
                                                    <button class="btn btn-secondary" v-if="dates" @click="ChangeDate(dates.next_start)">Next <i class="fa fa-chevron-right"></i></button>                                                                            
                                                </div>
                                            </div>                                
                                        </div>

                                        <!-- alert -->
                                        <div v-if="notif.status">
                                            <div :class="notif.class">
                                                {{ notif.msg }}
                                            </div>
                                        </div>         

                                        <!-- notif -->
                                        <notif :notif="notif"></notif>
                                        <!-- end of notif -->                     

                                        <!-- start of nav tab -->
                                        <ul class="nav nav-tabs">

                                            <li class="active">
                                                <a data-toggle="tab" href="#pendingTab">Pending <span class="label" v-if="haveApprovals">{{ pendingApprovals.length }}</span></a>
                                            </li>
                                            <li >
                                                <a data-toggle="tab" href="#approvedTab">Approved <span class="label" v-if="haveApprovals">{{ approvedApprovals.length }}</span></a>
                                            </li>                                    
                                            <li>
                                                <a data-toggle="tab" href="#declinedTab">Declined <span class="label" v-if="haveApprovals">{{ declinedApprovals.length }}</span></a>
                                            </li>
                                            <li>
                                                <a data-toggle="tab" href="#allTab">All <span class="label" v-if="haveApprovals">{{ approvals.length }}</span></a>
                                            </li>
                                        </ul>
                                        <!-- end of nav tab -->

                                        <div class="tab-content">                                   

                                            <!-- Pending -->
                                            <div id="pendingTab" class="tab-pane fade in active">
                                                <table class="datatable table table-hover" v-if="pendingApprovals != ''">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">Employee</th>
                                                            <th class="text-center">Date</th>
                                                            <th class="text-center">Time in</th>
                                                            <th class="text-center">Time out</th>
                                                            <th class="text-center">Shift</th>
                                                            <th class="text-center">Type</th>
                                                            <th class="text-center">Remarks</th>
                                                            <th class="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="text-center" v-for="(approval,index) in pendingApprovals">
                                                            <td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
                                                            <td>{{ approval.date_in }}</td>
                                                            <td><span v-if="approval.time_in">{{ toHumanTime(approval.time_in) }}</span></td>
                                                            <td><span v-if="approval.time_out">{{ toHumanTime(approval.time_out) }}</span></td>
                                                            <td width="15%""><span v-if="approval.shift_in">{{ toHumanTime(approval.shift_in) + ' - ' + toHumanTime(approval.shift_out) }}</span><span v-else>None</span></td>
                                                            <td>{{ approval.day_type }}</td>
                                                            <td>{{ approval.remarks }}</td>                                                           
                                                            <td v-if="approval.status == 'pending'">                            
                                                                <button class="btn btn-success btn-xs" @click="updateApproval(approval, 'approved')" v-if="isActiveBtn != approval.id + 'btn'"><i class="fa fa-check-circle"></i></button><button type="button" class="btn btn-success btn-xs" v-else><i class="fa fa-refresh fa-spin"></i></button>
                                                                <button class="btn btn-danger btn-xs" type="button" data-toggle="modal" data-target="#modal1" @click="modalBtn('declined' , form = approval)" v-if="isActiveBtn != approval.id + 'btn'"><i class="fa fa-times-circle"></i></button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div v-show="pendingApprovals == ''">
                                                    <center>No Pending Approvals</center>                                           
                                                </div>
                                            </div>

                                            <!-- Approved -->
                                            <div id="approvedTab" class="tab-pane fade">
                                                <table class="datatable table table-hover" v-if="approvedApprovals != ''">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">Employee</th>
                                                            <th class="text-center">Date</th>                                           
                                                            <th class="text-center">Time in</th>
                                                            <th class="text-center">Time out</th>
                                                            <th class="text-center">Shift</th>
                                                            <th class="text-center">Type</th>
                                                            <th class="text-center">Remarks</th>
                                                            <!-- <th class="text-center">Actions</th> -->
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="text-center" v-for="(approval,index) in approvedApprovals">
                                                            <td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
                                                            <td>{{ approval.date_in }}</td>
                                                            <td><span v-if="approval.time_in">{{ toHumanTime(approval.time_in) }}</span></td>
                                                            <td><span v-if="approval.time_out">{{ toHumanTime(approval.time_out) }}</span></td>
                                                            <td width="15%""><span v-if="approval.shift_in">{{ toHumanTime(approval.shift_in) + ' - ' + toHumanTime(approval.shift_out) }}</span><span v-else>None</span></td>
                                                            <td>{{ approval.day_type }}</td>
                                                            <td>{{ approval.remarks }}</td>
                                                            <!-- <td v-if="approval.status == 'approved'">
                                                                <button class="btn btn-danger btn-xs" type="button" data-toggle="modal" data-target="#modal1" @click="modalBtn('declined' , form = approval)"><i class="fa fa-times-circle"></i></button>
                                                            </td> -->
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div v-show="approvedApprovals == ''">
                                                    <center>No approved requests</center>
                                                </div>
                                            </div>

                                            <!-- Declined -->
                                            <div id="declinedTab" class="tab-pane fade">
                                                <table class="datatable table table-hover" v-if="declinedApprovals != ''">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">Employee</th>
                                                            <th class="text-center">Date</th>                                           
                                                            <th class="text-center">Time in</th>
                                                            <th class="text-center">Time out</th>
                                                            <th class="text-center">Schedule</th>
                                                            <th class="text-center">Type</th>
                                                            <th class="text-center">Reason</th>
                                                            <!-- <th class="text-center">Actions</th> -->
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="text-center" v-for="(approval,index) in declinedApprovals">
                                                            <td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
                                                            <td>{{ approval.date_in }}</td>
                                                            <td><span v-if="approval.time_in">{{ toHumanTime(approval.time_in) }}</span></td>
                                                            <td><span v-if="approval.time_out">{{ toHumanTime(approval.time_out) }}</span></td>
                                                            <td width="15%""><span v-if="approval.shift_in">{{ toHumanTime(approval.shift_in) + ' - ' + toHumanTime(approval.shift_out) }}</span><span v-else>None</span></td>
                                                            <td>{{ approval.day_type }}</td>
                                                            <td>{{ approval.reason }}</td>
                                                            <!-- <td v-if="approval.status == 'approved'">
                                                                <button class="btn btn-danger btn-xs" type="button" data-toggle="modal" data-target="#modal1" @click="modalBtn('declined' , form = approval)"><i class="fa fa-times-circle"></i></button>
                                                            </td> -->
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div v-show="declinedApprovals == ''">
                                                    <center>No declined requests</center>
                                                </div>
                                            </div>

                                            <!-- all Approvals -->
                                            <div id="allTab" class="tab-pane fade">
                                                <table class="datatable table table-hover" v-show="approvals != ''">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-center">Employee</th>
                                                            <th class="text-center">Date</th>                                           
                                                            <th class="text-center">Time in</th>
                                                            <th class="text-center">Time out</th>
                                                            <th class="text-center">Schedule</th>
                                                            <th class="text-center">Type</th>
                                                            <th class="text-center">Reason</th>
                                                            <th class="text-center">Status</th>
                                                            <th class="text-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="text-center" v-for="(approval,index) in approvals">
                                                            <td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
                                                            <td>{{ approval.date_in }}</td>
                                                            <td><span v-if="approval.time_in">{{ toHumanTime(approval.time_in) }}</span></td>
                                                            <td><span v-if="approval.time_out">{{ toHumanTime(approval.time_out) }}</span></td>
                                                            <td width="15%""><span v-if="approval.shift_in">{{ toHumanTime(approval.shift_in) + ' - ' + toHumanTime(approval.shift_out) }}</span><span v-else>None</span></td>
                                                            <td>{{ approval.day_type }}</td>
                                                            <td><span v-if="approval.reason">{{ approval.reason }}</span><span v-else>----</span></td>
                                                            <td>
                                                                <i class="fa fa-check-circle text-success" v-if="approval.status == 'approved'" data-toggle="tooltip" :title="approval.status"></i>
                                                                <i class="fa fa-times-circle text-danger" v-if="approval.status == 'declined'" data-toggle="tooltip" :title="approval.status"></i>
                                                                <i class="fa fa-circle-o text-warning" v-if="approval.status == 'pending'" data-toggle="tooltip" :title="approval.status"></i>
                                                            </td>
                                                            <td>                                                                      
                                                                <div v-if="approval.status == 'pending'">
                                                                    <button class="btn btn-success btn-xs" @click="updateApproval(approval, 'approved')" v-if="isActiveBtn != approval.id + 'btn'"><i class="fa fa-check-circle"></i></button><button type="button" class="btn btn-success btn-xs" v-else><i class="fa fa-refresh fa-spin"></i></button>
                                                                    <button class="btn btn-danger btn-xs" type="button" data-toggle="modal" data-target="#modal1" @click="modalBtn('declined' , form = approval)" v-if="isActiveBtn != approval.id + 'btn'"><i class="fa fa-times-circle"></i></button>
                                                                </div>  
                                                                <span v-else>----</span>                                                                    
                                                            </td>
                                                            <!-- <td v-if="approval.status == 'approved'">
                                                                <button class="btn btn-danger btn-xs" type="button" data-toggle="modal" data-target="#modal1" @click="modalBtn('declined' , form = approval)"><i class="fa fa-times-circle"></i></button>
                                                            </td> -->
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <!-- end of all approvals -->
                                        </div>

                                    <!-- end of inside codable(component) -->
                                </div>
                                <div v-else>
                                    Loading please wait...
                                </div>
                                
                                
                            </div>
                        </div>
                    </div>
                    <!-- end of column of time approvals -->
                </div>

                <div class="modal fade" id="modal1">
                    <div class="modal-dialog">
                        <div class="modal-content" v-if="form">
                            <form action="" v-on:submit.prevent="updateApproval(form, form.tostatus, form.reason)">
                            <div class="modal-header">
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <h4 class="modal-title">Decline form</h4>
                            </div>
                            <div class="modal-body" >
                                

                                <div class="row">
                                    <div class="col-md-4" >
                                        <label for=""><strong>Employee:</strong></label>
                                        <p>{{ form.profile.fname+' '+form.profile.lname }}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <label for=""><strong>Date:</strong></label>
                                        <p>{{ form.date_in }}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <label for=""><strong>Schedule:</strong></label>
                                        <p>{{ toHumanTime(form.shift_in) + ' - ' + toHumanTime(form.shift_out) }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <label for=""><strong>Time in:</strong></label>
                                        <p>{{ toHumanTime(form.time_in) }}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <label for=""><strong>Time out:</strong></label>
                                        <p>{{ toHumanTime(form.time_out) }}</p>
                                    </div>
                                    <div class="col-md-4">
                                        <label for=""><strong>Type:</strong></label>
                                        <p>{{ form.day_type }}</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-4">
                                        <label for=""><strong>Remarks:</strong></label>
                                        <div class="col-md-12">
                                            <p v-if="form.remarks">{{ form.remarks }}</p>
                                        </div>                                        
                                    </div>
                                    <div class="col-md-8">
                                        <label for=""><strong>Reason:</strong></label>
                                        <textarea cols="2" rows="2" class="form-control" style="resize: vertical;" v-model="form.reason" required></textarea>
                                    </div>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button class="btn btn-default" type="button" data-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-danger">Decline request</button>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>

            <!-- END of content here -->
            </div>
        </div>
    </div>

</template>

<script>

export default {

    data () {
        return {
            isActiveBtn: '',
            approvals: '',
            dates: '',
            notif: '',
            form: '',
            haveApprovals: false,
            edtr_id: '',
        }
    },

    computed: {
        // filter for pending approvals
        pendingApprovals() {
            if(this.haveApprovals){
                let appr = this.approvals
                return appr.filter(function(val){
                    return val.status == 'pending';
                });
            }
        },

        approvedApprovals() {
            if(this.haveApprovals){
                let appr = this.approvals
                return appr.filter(function(val){
                    return val.status == 'approved';
                });
            }
        },

        declinedApprovals() {
            if(this.haveApprovals){
                let appr = this.approvals
                return appr.filter(function(val){
                    return val.status == 'declined';
                });
            }
        },

        count () {
            return this.$store.state.loading;
        }
    },

    watch: {
        count: function (val) {
            if (this.approvals.length != 0) {
                $('.datatable').DataTable();
                if (!$.fn.dataTable.isDataTable( '.datatable' )) {
                    $('.datatable').DataTable();
                }
            }
        }  
    },

    created () {
        this.getApprovals();
    },

    mounted () {
        // $('.datatable').DataTable();
        if (!$.fn.dataTable.isDataTable( '.datatable' )) {
            $('.datatable').DataTable();
        }
        // console.log(this.declinedApprovals)
    },

    beforeUpdate() {
        $('.datatable').DataTable().destroy();
    },

    updated () {
        if (!$.fn.dataTable.isDataTable( '.datatable' )) {
            $('.datatable').DataTable();
        }
        $('[data-toggle="tooltip"]').tooltip();            
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

        getApprovals() {
            this.$store.state.loading = true;
            this.axiosRequest('get', this.$store.state.clock_api + '/timeapproval/index/' + this.$session.get('auth')['user_id'], '', this.$session.get('headers'))
            .then(res => {
                this.approvals = res.data.msg.approvals
                this.haveApprovals = res.data.msg.approvals
                this.dates = res.data.msg.dates
                if(res.data.status == "success"){
                    this.haveApprovals = true;

                }else{
                    this.haveApprovals = false;
                }
            })
            .catch(err => { console.log(err) })

            this.$store.state.loading = false;
        },

        ChangeDate(datadate){
            this.$store.state.loading = true;
            this.axiosRequest('get', this.$store.state.clock_api + '/timeapproval/index/' + this.$session.get('auth')['user_id'] + '?date='+datadate, '', this.$session.get('headers'))
            .then(res => {
                this.approvals = res.data.msg.approvals
                this.haveApprovals = res.data.msg.approvals
                this.dates = res.data.msg.dates            
                if(res.data.status == "success"){
                    this.haveApprovals = true;
                    this.$store.state.loading = false;
                }else{
                    this.haveApprovals = false;
                    this.$store.state.loading = false;
                }
            })
            .catch(err => { console.log(err) })
        },

        modalBtn (status, requestdata) {
            this.form.tostatus = status;

        },

        updateApproval(rowdata, status, reason){
            this.$store.state.loading = true;

            this.isActiveBtn = rowdata.id + 'btn';
            if( ($("#modal1").data('bs.modal') || {}).isShown  ){
                $('#modal1').modal('toggle');
            }           

            if(status == 'approved'){

                let params = {
                    checked_by: this.$session.get('auth')['email'],
                    session_id: this.$session.get('auth')['user_id'],
                    user_id: rowdata.user_id,
                    id: rowdata.id,
                    status: status,
                }

                // API FOR TIME APPORVAL UPDATE STATUS
                this.axiosRequest('post', this.$store.state.clock_api + '/timeapproval/update', params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){

                        // API FOR PUTTING APPROVALS TO FINAL EDTR
                        let pdata = {
                            user_id: rowdata.user_id,
                            date_in: rowdata.date_in,
                            time_in: rowdata.time_in,
                            time_out: rowdata.time_out,
                            day_type: rowdata.day_type,
                            reference: 'edtr',
                            remarks: rowdata.remarks,
                            status: status,
                            checked_by: this.$session.get('auth')['email']
                        }

                        this.axiosRequest('post', this.$store.state.clock_api + '/time-entry-using-edtr', pdata, this.$session.get('headers'))
                        .then(res => {
                            if(res.data.status == "success"){
                                this.edtr_id = res.data.edtr_id;
                                // this.getApprovals()
                                this.ChangeDate(this.dates.end)
                                this.toastr({ title: 'Success!', message: 'EDTR of '+ rowdata.profile.fname+' '+rowdata.profile.lname +' to '+status+'!'})
                                this.notif = '';  
                                setTimeout(function() { this.isActiveBtn = ''; }, 1000);

                                // this.isActiveBtn = '';
                            }else{
                                this.notif = {
                                    style: 'alert-danger',
                                    message: res.data.msg,
                                    icon: 'fa-times-circle'
                                }
                                this.isActiveBtn = '';                                
                                // this.$store.state.loading = false;

                            }
                            // console.log(res)
                        })
                        .catch(err => {});   
                        // API FOR PUTTING APPROVALS TO FINAL EDTR

                    }else{
                        this.notif = {
                            status: true,
                            class: 'alert alert-danger',
                            msg: 'Error on updating request '+ rowdata.profile.fname+' '+rowdata.profile.lname +' to '+status+', please try again',
                        } 
                    }
                    // console.log(res.data)

                })
                .catch(err => {});
                // END REQUEST


            }else{
                let params = {
                    checked_by: this.$session.get('auth')['email'],
                    session_id: this.$session.get('auth')['user_id'],
                    user_id: rowdata.user_id,
                    id: rowdata.id,
                    reason: this.form.reason,
                    status: status,
                }

                // console.log(params);


                // API FOR TIME APPORVAL UPDATE STATUS
                this.axiosRequest('post', this.$store.state.clock_api + '/timeapproval/update', params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        // this.getApprovals()
                        this.ChangeDate(this.dates.end)                        
                        this.toastr({ title: 'Success!', message: 'EDTR of '+ rowdata.profile.fname+' '+rowdata.profile.lname +' to '+status+'!'})
                        this.notif = '';                                        
                        setTimeout(function() { this.isActiveBtn = ''; }, 1000);
                        // this.isActiveBtn = '';
                        // this.$store.state.loading = false;

                    }else{
                        this.notif = {
                            style: 'alert-danger',
                            message: res.data.msg,
                            icon: 'fa-times-circle'
                        }
                        this.isActiveBtn = '';            
                        // this.$store.state.loading = false;

                    }
                    // console.log(res.data)
                })
                .catch(err => {});
                // END REQUEST
            }                    
           
            this.$store.state.loading = false;

        }

    }

}

</script>