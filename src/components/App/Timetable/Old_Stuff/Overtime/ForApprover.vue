<template>
	<div class="main__cont">
		<div class="main-heading">
			<ol class="breadcrumb">
				<li>Time Info</a></li>
				<li class="active">Overtime Approvals</li>
			</ol>
		</div>
		<div class="container-fluid half-padding">
			<div class="template template__blank">
				<!-- Content here -->

				<div class="row">
					<div class="col-md-12">

						<!-- Start of panel -->
						<div class="panel panel-primary">
							<div class="panel-heading">
								<h3 class="panel-title">
									Overtime Approvals
									<span v-if="index_approvals_loading == true">
										<i class="fa fa-refresh fa-spin"></i>
									</span>
								</h3>
							</div>
							<div class="panel-body">

								<div v-if="index_approvals_loading == false">
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
									</ul>
									<!-- end of nav tab -->

									<div class="tab-content" v-if="approvals">

										<!-- Pending -->
										<div id="pendingTab" class="tab-pane fade in active">
											<table class="datatable table table-hover" v-if="pendingApprovals">
												<thead>
													<tr>
														<th>Employee name</th>
														<th>Date</th>
														<th>Start - End</th>
														<th>Reason</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="appr in pendingApprovals" @click="openModal(appr)">
														<td>{{ appr.fname + ' ' + appr.lname }}</td>
														<td>{{ appr.date }}</td>
														<td>{{ toHumanTime(appr.start_time) + ' - ' + toHumanTime(appr.end_time) }}</td>
														<td>{{ appr.reason }}</td>
													</tr>
												</tbody>
											</table>
										</div>

										<!-- approvedTab -->
										<div id="approvedTab" class="tab-pane fade">
											<table class="datatable table table-hover" v-if="approvedApprovals">
												<thead>
													<tr>
														<th>Employee name</th>
														<th>Date</th>
														<th>Start - End</th>
														<th>Reason</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="appr in approvedApprovals" @click="openModal(appr)">
														<td>{{ appr.fname + ' ' + appr.lname }}</td>
														<td>{{ appr.date }}</td>
														<td>{{ toHumanTime(appr.start_time) + ' - ' + toHumanTime(appr.end_time) }}</td>
														<td>{{ appr.reason }}</td>
													</tr>
												</tbody>
											</table>
										</div>

										<!-- approvedTab -->
										<div id="declinedTab" class="tab-pane fade">
											<table class="datatable table table-hover" v-if="declinedApprovals">
												<thead>
													<tr>
														<th>Employee name</th>
														<th>Date</th>
														<th>Start - End</th>
														<th>Reason</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="appr in declinedApprovals" @click="openModal(appr)">
														<td>{{ appr.fname + ' ' + appr.lname }}</td>
														<td>{{ appr.date }}</td>
														<td>{{ toHumanTime(appr.start_time) + ' - ' + toHumanTime(appr.end_time) }}</td>
														<td>{{ appr.reason }}</td>
													</tr>
												</tbody>
											</table>
										</div>

									</div>

								</div>
								<div v-else>
									Loading please wait...
								</div>
							</div>
						</div>
						<!-- End of panel -->

					</div>
				</div>

				<!-- End of content here -->
			</div>
		</div>

		<!-- Start of modal -->
		<div class="modal fade" id="approvalModal" v-if="approvals">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button class="close" type="button" data-dismiss="modal" aria-label="Close" @click="closeModalBtn()"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">Overtime Approval</h4>
					</div>
					<div class="modal-body">

						<div class="row">
							<div class="col-md-3">
								<label for=""><strong>Employee name</strong></label>
								<p>{{ form.fname + ' ' + form.lname }}</p>
							</div>
							<div class="col-md-3">
								<label for=""><strong>Date</strong></label>
								<p>{{ form.date }}</p>
							</div>
							<div class="col-md-3">
								<label for=""><strong>Start - End</strong></label>
								<p>{{ toHumanTime(form.start_time) + ' - ' + toHumanTime(form.end_time) }}</p>
							</div>
							<div class="col-md-3 text-center">
								<label for=""><strong>Status</strong></label>
								<p v-if="form.status == 'pending'" title="pending"><i class="fa fa-circle-o text-warning"></i></p>
								<p v-else-if="form.status == 'approved'" title="approved"><i class="fa fa-check-circle text-success"></i></p>
								<p v-else-if="form.status == 'declined'" title="declined"><i class="fa fa-times-circle text-danger"></i></p>
							</div>
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
							<div class="col-md-6 text-right">
								<span v-if="update_approvals_loading == false">
									<button type="button" class="btn btn-xs btn-danger" @click="updateApproval(form,'declined')" v-if="form.status == 'pending'">
										<i class="fa fa-times-circle"></i> Decline
									</button>
									<button type="button" class="btn btn-xs btn-success" @click="updateApproval(form,'approved')" v-if="form.status == 'pending'">
										<i class="fa fa-check-circle"></i> Approve
									</button>
								</span>
								<span v-else>
									<button class="btn btn-xs btn-default">
										<i class="fa fa-refresh fa-spin"></i>
									</button>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- End of modal -->

	</div>
</template>

<script>

export default{

	notifications: {
		toastr: {
			timeout: 2500,
			title: '',
			message: '',
			type: 'success'
		}
	},

	data(){
		return{
			approvals: {},
			form: '',

			// for loadings and init
			notif: '',
			index_approvals_loading: true,
			update_approvals_loading: false,
		}
	},

	computed:{

		pendingApprovals() {
			if(this.approvals){
				let appr = this.approvals
				return appr.filter(res => res.status == 'pending');
			}
		},

		approvedApprovals() {
			if(this.approvals){
				let appr = this.approvals
				return appr.filter(res => res.status == 'approved');
			}
		},

		declinedApprovals() {
			if(this.approvals){
				let appr = this.approvals
				return appr.filter(res => res.status == 'declined');
			}
		},

	},

	created(){
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

	methods:{

		openModal(data){
			this.form = data;
			$("#approvalModal").modal('toggle');
		},

		closeModalBtn(){
			this.form = '';
		},

		getApprovals(){
			this.axiosRequest('get', this.$store.state.application_api+'/overtime/approver-index/'+this.$session.get('auth')['user_id'], this.vlsl_request, this.$session.get('headers'))
			.then(res => {
				if(res.data.status == "success"){
					this.approvals = res.data.msg
					this.index_approvals_loading = false

				}else{

				}
				console.log(res.data)
			})
			.catch(err => console.log(err))
		},

		updateApproval(data, status){
			let conf = '';
			if(status == 'approved'){
				conf = confirm("Do you want to approve this request?");
			}else{
				conf = confirm("Do you want to decline this request?");
			}

			// If confirmation is okay
			if(conf){

				let request_email_params = {
					approvee: this.form.user_id,
					email: this.$session.get('auth')['email'],
					link: this.$route.params.tenant,
					type: 'ot',
					date_start: this.form.date,
					date_end: this.form.date,
					status: status,
					user_id: this.form.user_id,
				};


				this.update_approvals_loading = true;
				// do axios here
				this.form.status = status;
				this.form.checked_by = this.$session.get('auth')['email'];

				this.axiosRequest('post', this.$store.state.application_api+'/overtime-approval/'+this.$session.get('auth')['user_id'], this.form, this.$session.get('headers'))
				.then(res => {
					if(res.data.status == "success"){
						// this.getApprovals();
						this.changeStatus(data.id, status);
						$("#approvalModal").modal('toggle');
						this.toastr({ title: 'Success', message: status +' of request successful!'})
						this.notif = '';
						this.update_approvals_loading = false;
						this.axiosRequest('post', this.$store.state.mail_api + '/approval', request_email_params, null, false)


					}else{
						$("#approvalModal").modal('toggle');
						this.toastr({ title: 'Failed', message: 'Failure on update of request !' + status})
						this.notif = '';
						this.update_approvals_loading = false;

					}
					console.log(res.data)
				})
				.catch(err => console.log(err))
			}
		},

		changeStatus(id, status){
			this.approvals.find(x => x.id == id).status = status;
			var indexx = this.approvals.findIndex(x => x.id == id);
		},


	}


}

</script>
