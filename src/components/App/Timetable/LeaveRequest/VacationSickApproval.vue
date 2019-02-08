<template>

	<div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>Time Info</a></li>
                <li class="active">Leave Approvals</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">

				<div class="row">
					<div class="col-md-12">

						<div class="panel panel-primary">
							<div class="panel-heading">
								<h3 class="panel-title">
									Leave Approvals
									<span v-if="index_approvals_loading">
		                                <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
		                            </span>
								</h3>
							</div>
							<div class="panel-body">
								<!-- start of panel-body -->

								<div v-if="approvals">
									<!-- start of inside codable(component) -->

										<div class="row">
											<div class="col-md-12">

												<!-- notif -->
				                                <notif :notif="notif"></notif>
				                                <!-- end of notif -->

												<!-- start of nav tab -->
					                            <ul class="nav nav-tabs">

					                                <li class="active">
					                                    <a data-toggle="tab" href="#pendingTab">Pending <span class="label">{{ pendingApprovals.length }}</span></a>
					                                </li>
					                                <li>
					                                    <a data-toggle="tab" href="#approvedTab">Approved <span class="label">{{ approvedApprovals.length }}</span></a>
					                                </li>
					                                <li>
					                                    <a data-toggle="tab" href="#declinedTab">Declined <span class="label">{{ declinedApprovals.length }}</span></a>
					                                </li>
					                                <li>
					                                    <a data-toggle="tab" href="#allTab">All <span class="label">{{ approvals.length }}</span></a>
					                                </li>
					                            </ul>
					                            <!-- end of nav tab -->

					                            <div class="tab-content" v-if="approvals">

					                                <!-- Pending -->
					                                <div id="pendingTab" class="tab-pane fade in active">
					                                	<table class="datatable table table-hover" width="100%">
															<thead>
																<tr>
																	<td>Employee name</td>
																	<td>Leave Type</td>
																	<td>Date start</td>
																	<td>Date end</td>
																</tr>
															</thead>
															<tbody>
																<tr v-for="approval in pendingApprovals" @click="modalBtn(approval)">
																	<td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
																	<td>{{ approval.day_type }}</td>
																	<td>{{ approval.date_start }}</td>
																	<td>{{ approval.date_end }}</td>
																</tr>
															</tbody>
														</table>
					                                </div>

					                                <!-- Approved -->
					                                <div id="approvedTab" class="tab-pane fade">
					                                	<table class="datatable table table-hover" width="100%">
															<thead>
																<tr>
																	<td>Employee name</td>
																	<td>Leave Type</td>
																	<td>Date start</td>
																	<td>Date end</td>
																</tr>
															</thead>
															<tbody>
																<tr v-for="approval in approvedApprovals" @click="modalBtn(approval)">
																	<td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
																	<td>{{ approval.day_type }}</td>
																	<td>{{ approval.date_start }}</td>
																	<td>{{ approval.date_end }}</td>
																</tr>
															</tbody>
														</table>
					                                </div>

					                                <!-- Declined -->
					                                <div id="declinedTab" class="tab-pane fade">
					                                	<table class="datatable table table-hover" width="100%">
															<thead>
																<tr>
																	<td>Employee name</td>
																	<td>Leave Type</td>
																	<td>Date start</td>
																	<td>Date end</td>
																</tr>
															</thead>
															<tbody>
																<tr v-for="approval in declinedApprovals" @click="modalBtn(approval)">
																	<td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
																	<td>{{ approval.day_type }}</td>
																	<td>{{ approval.date_start }}</td>
																	<td>{{ approval.date_end }}</td>
																</tr>
															</tbody>
														</table>
					                                </div>

					                                <!-- All -->
					                                <div id="allTab" class="tab-pane fade">
					                                	<table class="datatable table table-hover" width="100%">
															<thead>
																<tr>
																	<th>Employee name</th>
																	<th>Leave Type</th>
																	<th>Date start</th>
																	<th>Date end</th>
																	<th class="text-center">Status</th>
																</tr>
															</thead>
															<tbody>
																<tr v-for="approval in approvals" @click="modalBtn(approval)">
																	<td>{{ approval.profile.fname+' '+approval.profile.lname }}</td>
																	<td>{{ approval.day_type }}</td>
																	<td>{{ approval.date_start }}</td>
																	<td>{{ approval.date_end }}</td>
																	<td class="text-center">
																		<i class="fa fa-check-circle text-success" v-if="approval.status == 'approved'"></i>
																		<i class="fa fa-times-circle text-danger" v-if="approval.status == 'declined'"></i>
																		<i class="fa fa-circle-o text-warning" v-if="approval.status == 'pending'"></i>
																	</td>
																</tr>
															</tbody>
														</table>
					                                </div>
					                            </div>


											</div>
										</div>

									<!-- end of inside codable(component) -->
								</div>
								<div v-else>
									Loading please wait...
								</div>

								<!-- end of panel-body -->
							</div>
						</div>

					</div>
				</div>


				<!-- Start of modal -->
                <div class="modal fade" id="approvalModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <form action="" v-on:submit.prevent="updateApproval()">
                                <div class="modal-header">
                                    <button class="close" type="button" data-dismiss="modal" aria-label="Close" @click="closeModalBtn()"><span aria-hidden="true">&times;</span></button>
                                    <h4 class="modal-title">Leave approval</h4>
                                </div>
                                <div class="modal-body">

									<!-- alert -->
	                                <div class="row">
	                                    <div class="col-md-12">
	                                        <div :class="notif.class" class="text-center" v-if="notif.status == true">
	                                            {{ notif.msg }}
	                                        </div>
	                                        <br>
	                                    </div>
	                                </div>
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
                                            <p>{{ toHumanTime(form.time_start) + ' - ' + toHumanTime(form.time_end) }}</p>
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
                                            <button class="btn btn-xs btn-default" type="button" data-dismiss="modal" @click="closeModalBtn()">Close</button>
                                        </div>
                                        <div class="col-md-6 text-right" v-if="form.status == 'pending'">
                                        	<div v-if="isUpdating == false">
                                        		<div v-if="update_approvals_loading == true">
                                        			<button class="btn btn-xs btn-success"><i class="fa fa-refresh fa-spin"></i></button>
                                        		</div>
                                        		<div v-else>
                                        			<button type="button" class="btn btn-xs btn-danger" @click="updateLeaveRequest(form.request_id, form.user_id,'declined')">
														<i class="fa fa-times-circle"></i> Decline
													</button>
	                                            	<button type="button" class="btn btn-xs btn-success" @click="updateLeaveRequest(form.request_id, form.user_id,'approved')">
														<i class="fa fa-check-circle"></i> Approve
													</button>
                                        		</div>

                                        	</div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <!-- End of modal -->

            </div>
        </div>
    </div>

</template>

<script>

export default {

	data () {
		return {
			approvals: '',
			form: '',

			notif: '',
			isUpdating: false,


			index_approvals_loading: true,
			update_approvals_loading: false,
		}
	},

	created (){
		this.getApprovals();
	},

	mounted(){
    	$('.datatable').DataTable();
	},

	beforeUpdate() {
    	$('.datatable').DataTable().destroy();
	},

	updated(){
		$('.datatable').DataTable();
	},

	computed: {

		pendingApprovals() {
            if(this.approvals){
                let appr = this.approvals
                return appr.filter(function(val){
                    return val.status == 'pending';
                });
            }
        },

     	approvedApprovals() {
            if(this.approvals){
                let appr = this.approvals
                return appr.filter(function(val){
                    return val.status == 'approved';
                });
            }
        },

        declinedApprovals() {
            if(this.approvals){
                let appr = this.approvals
                return appr.filter(function(val){
                    return val.status == 'declined';
                });
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

		getApprovals(){
			this.index_approvals_loading = true;
			this.axiosRequest('get', this.$store.state.application_api+'/leave-request/index/'+this.$session.get('auth')['user_id'], this.vlsl_request, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.approvals = res.data.msg
                    }else{

                    }
                    this.index_approvals_loading = false
                    // console.log(res.data)
                })
                .catch(err => console.log(err))
		},

		modalBtn(data){
			this.form = data
			$('#approvalModal').modal({
    				backdrop: 'static',
    				keyboard: false
			});
			// $('#approvalModal').modal('toggle');
		},

		closeModalBtn(){
			this.isUpdating = false;
		},

		updateLeaveRequest(request_id, user_id, status){
			this.update_approvals_loading = true;

			let params = {
				user_id: user_id,
				status: status,
				checked_by: this.$session.get('auth')['email'],
				request_id: request_id,
				day_type: this.form.day_type,
			}

			let request_email_params = {
				approvee: this.form.user_id,
				email: this.$session.get('auth')['email'],
				link: this.$route.params.tenant,
				type: 'le',
				date_start: this.form.date_start,
				date_end: this.form.date_end,
				status: status,
				user_id: user_id,
			};


			this.axiosRequest('post', this.$store.state.application_api+'/leave-request/approval', params, this.$session.get('headers'))
                .then(res => {
                    // this.getApprovals();
                    if(res.data.status == "success"){
                    	this.changeStatus(request_id, status)
                        this.toastr({ title: 'Success', message: 'Leave request has been!' + status})
                        this.notif = '';
						this.isUpdating = true;
						this.update_approvals_loading = false;
						this.axiosRequest('post', this.$store.state.mail_api + '/approval', request_email_params, null, false)

                    }
					else{
                        this.notif = {
                            style: 'alert-danger',
                            message: res.data.msg,
                            icon: 'fa-times-circle'
                        }
						this.isUpdating = false;
                    }
                    this.update_approvals_loading = false;
                })
                .catch(err => console.log(err))
		},

		changeStatus(id, status){
            this.approvals.find(x => x.request_id == id).status = status;
            // var indexx = this.approvals.findIndex(x => x.id == id);
        },

	},

}

</script>
