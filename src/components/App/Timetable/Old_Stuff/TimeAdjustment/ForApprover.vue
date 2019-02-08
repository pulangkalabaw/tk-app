<template>

	<div class="main__cont">



		<div v-if="approvals">
			<!-- the modal -->
			<div class="modal fade" id="viewModal">
				<div class="modal-dialog">
					<div class="modal-content" v-if="approvals">
						<form action="">
							<div class="modal-header">
								<button class="close" type="button" data-dismiss="modal" aria-label="Close" @click="closeModalBtn()"><span aria-hidden="true">&times;</span></button>
								<h4 class="modal-title">Adjustment</h4>
							</div>
							<div class="modal-body">

								<div class="row">
									<div class="col-md-12">
										<div :class="notif.class" v-if="notif.status">
											{{ notif.msg }}
										</div>
									</div>
								</div>

								<div class="row">
									<div class="col-md-4" >
										<label for=""><strong>Employee:</strong></label>
										<p>{{ form.profile && form.profile.fname }} {{ form.profile && form.profile.lname }}</p>
									</div>
									<div class="col-md-4">
										<label for=""><strong>Date:</strong></label>
										<p>{{ form.date_in }}</p>
									</div>
									<div class="col-md-4">
										<label for=""><strong>Schedule:</strong></label>
										<p>{{ toHumanTime(form.shift_in) +' - '+ toHumanTime(form.shift_out) }}</p>
									</div>
								</div>

								<div class="row">
									<div class="col-md-4">
										<label for=""><strong>Remarks:</strong></label>
										<p v-if="form.remarks">{{ form.remarks }}</p><p v-else>N/A</p>
									</div>
									<div class="col-md-8">
										<label for=""><strong>Reason:</strong></label>
										<p>{{ form.reason }}</p>
									</div>
								</div>

								<div class="row">
									<div class="col-md-6">

										<!-- OLD -->
										<div class="breadcrumb">
											<h4>Original time data</h4>
											<p><strong>Time In:</strong> <span v-if="form.old_time_in">{{ toHumanTime(form.old_time_in) }}</span></p>
											<p><strong>Time Out:</strong> <span v-if="form.old_time_out">{{ toHumanTime(form.old_time_out) }}</span></p>
											<p><strong>Day Type:</strong>  <span v-if="form.old_day_type">{{ form.old_day_type }}</span></p>

										</div>


									</div>
									<div class="col-md-6">

										<!-- NEW -->
										<div class="breadcrumb">
											<h4>Requested time data</h4>
											<p><strong>Time In:</strong> <span v-if="form.time_in">{{ toHumanTime(form.time_in) }}</span></p>
											<p><strong>Time Out:</strong> <span v-if="form.time_out">{{ toHumanTime(form.time_out) }}</span></p>
											<p><strong>Day Type:</strong> {{ form.day_type }}</p>

										</div>


									</div>
								</div>

								<div class="row">
									<div class="col-md-12">
										<label for=""><strong>Reason:</strong></label>
										<p class="breadcrumb">{{ form.reason }}</p>
									</div>
								</div>

							</div>
							<div class="modal-footer">
								<div class="row">
									<div class="col-md-4 col-xs-6 text-left">
										<button class="btn btn-xs btn-default" type="button" data-dismiss="modal" @click="closeModalBtn()">Close</button>
									</div>
									<div class="col-md-8 col-xs-6 text-right" v-if="form.status == 'pending'">
										<div v-if="update_approval_loading == false">
											<button type="button" class="btn btn-xs btn-danger" @click="updateAdjustment(form.id, 'declined')" v-if="isActiveBtn != form.id + 'updateBtn'">
												<i class="fa fa-times-circle" title="decline"></i> Decline
											</button>
											<button class="btn btn-xs btn-success" v-else>
												<i class="fa fa-refresh fa-spin"></i>
											</button>
											<button type="button" class="btn btn-xs btn-success" @click="updateAdjustment(form.id, 'approved')" v-if="isActiveBtn != form.id + 'updateBtn'">
												<i class="fa fa-check-circle" title="approve"></i> Approve
											</button>
										</div>
										<div v-else>
											<button class="btn btn-default btn-xs">
												<i class="fa fa-refresh fa-spin"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<!-- end of the modal -->
		</div>



		<div class="main-heading">
			<ol class="breadcrumb">
				<li>Time info</li>
				<li class="active">Time adjustment approvals</li>
			</ol>
		</div>
		<div class="container-fluid half-padding">
			<div class="template template__blank"> <!-- START of Content here -->

				<div class="row">
					<div class="col-md-12">

						<div class="panel panel-primary">
							<div class="panel-heading">
								<h3 class="panel-title">Adjustment Approvals</h3>
							</div>
							<div class="panel-body">

								<div class="alert alert-info">
									<span class="fa fa-info-circle"></span> get your adjustment approvals by selecting dates
								</div>

								<form @submit.prevent="selectDates()" method="POST" class="form-group">
									<div class="row">
										<div class="col-md-3">
											from: <input type="date" v-model="date_start" class="form-control" required>
										</div>
										<div class="col-md-3">
											to: <input type="date" v-model="date_end" class="form-control" required>
										</div>
										<div class="col-md-3">
											<br>
											<button class="btn btn-default" :disabled="search_adjustment_loading" @click="selectDates()">Submit</button>
											<span v-if="search_adjustment_loading">
												<span class="fa fa-spin fa-refresh"></span>
											</span>
										</div>
									</div>
								</form>
								<hr>

								<div v-if="approvals">
									<b>Result:</b>

									<ul class="nav nav-tabs">
										<li class="active">
											<a data-toggle="tab" href="#pendingTab">
												Pending
												<span class="label">
													{{ pendingApprovals.length }}
												</span>
											</a>
										</li>
										<li>
											<a data-toggle="tab" href="#declineTab">
												Declined
												<span class="label">
													{{ declinedApprovals.length }}
												</span>
											</a>
										</li>
										<li>
											<a data-toggle="tab" href="#approveTab">
												Approved
												<span class="label">
													{{ approvedApprovals.length }}
												</span>
											</a>
										</li>
										<li>
											<a data-toggle="tab" href="#allTab">
												All
												<span class="label">
													{{ approvals.length }}
												</span>
											</a>
										</li>
									</ul>

									<div class="tab-content">
										<div id="allTab" class="tab-pane fade">
											<table class="datatable table table-hover">
												<thead>
													<tr>
														<th class="text-center">Employee</th>
														<th class="text-center">Date</th>
														<th class="text-center">Time in</th>
														<th class="text-center">Time out</th>
														<th class="text-center">Schedule</th>
														<th class="text-center">Day Type</th>
														<th class="text-center">Reason</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="time in approvals" class="text-center" @click="modalBtn(time)">
														<td>{{ time.profile.fname+' '+time.profile.lname }}</td>
														<td>{{ time.date_in }}</td>
														<td>
															<span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span>
															<span v-else>-</span>
														</td>
														<td>
															<span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span>
															<span v-else>-</span>
														</td>
														<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
														<td>{{ time.day_type }}</td>
														<td width="30%">{{ time.reason }}</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div id="pendingTab" class="tab-pane fade in active">
											<table class="datatable table table-hover">
												<thead>
													<tr>
														<th class="text-center">Employee</th>
														<th class="text-center">Date</th>
														<th class="text-center">Time in</th>
														<th class="text-center">Time out</th>
														<th class="text-center">Schedule</th>
														<th class="text-center">Day Type</th>
														<th class="text-center">Reason</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="time in pendingApprovals" class="text-center" @click="modalBtn(time)">
														<td>{{ time.profile.fname+' '+time.profile.lname }}</td>
														<td>{{ time.date_in }}</td>
														<td>
															<span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span>
															<span v-else>-</span>
														</td>
														<td>
															<span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span>
															<span v-else>-</span>
														</td>
														<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
														<td>{{ time.day_type }}</td>
														<td width="30%">{{ time.reason }}</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div id="approveTab" class="tab-pane fade">
											<table class="datatable table table-hover">
												<thead>
													<tr>
														<th class="text-center">Employee</th>
														<th class="text-center">Date</th>
														<th class="text-center">Time in</th>
														<th class="text-center">Time out</th>
														<th class="text-center">Schedule</th>
														<th class="text-center">Day Type</th>
														<th class="text-center">Reason</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="time in approvedApprovals" class="text-center" @click="modalBtn(time)">
														<td>{{ time.profile.fname+' '+time.profile.lname }}</td>
														<td>{{ time.date_in }}</td>
														<td>
															<span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span>
															<span v-else>-</span>
														</td>
														<td>
															<span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span>
															<span v-else>-</span>
														</td>
														<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
														<td>{{ time.day_type }}</td>
														<td width="30%">{{ time.reason }}</td>
													</tr>
												</tbody>
											</table>
										</div>
										<div id="declineTab" class="tab-pane fade">
											<table class="datatable table table-hover">
												<thead>
													<tr>
														<th class="text-center">Employee</th>
														<th class="text-center">Date</th>
														<th class="text-center">Time in</th>
														<th class="text-center">Time out</th>
														<th class="text-center">Schedule</th>
														<th class="text-center">Day Type</th>
														<th class="text-center">Reason</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="time in declinedApprovals" class="text-center" @click="modalBtn(time)">
														<td>{{ time.profile.fname+' '+time.profile.lname }}</td>
														<td>{{ time.date_in }}</td>
														<td>
															<span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span>
															<span v-else>-</span>
														</td>
														<td>
															<span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span>
															<span v-else>-</span>
														</td>
														<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
														<td>{{ time.day_type }}</td>
														<td width="30%">{{ time.reason }}</td>
													</tr>
												</tbody>
											</table>
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
			date_start: '',
			date_end: '',


			approvals: '',
			form: '',
			notif: '',

			dates: '',
			isActiveBtn: '',
			isUpdating: false,
			update_approval_loading: false,

			search_adjustment_loading: false,
		}
	},

	computed: {
		// filter for pending approvals
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

	created() {
		// this.getTimeApprovals();
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

	notifications: {
		toastr: {
			timeout: 2500,
			title: '',
			message: '',
			type: 'success'
		}
	},

	methods: {

		selectDates () {
			let params = {
				date_start: this.date_start,
				date_end: this.date_end,
			}


			this.search_adjustment = false
			this.search_adjustment_loading = true
			this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment/select-dates/' + this.$session.get('auth')['user_id'], params, this.$session.get('headers'))
			.then(res => {
				this.approvals = res.data.msg.adjustments;
				// this.dates = res.data.msg.dates;
				this.search_adjustment_loading = false
				this.search_adjustment = true

			})
			.catch(err => console.log(err))
		},

		getTimeApprovals(){
			this.$store.state.loading = true
			this.axiosRequest('get', this.$store.state.application_api+'/timeadjustment/' + this.$session.get('auth')['user_id'], null, this.$session.get('headers'))
			.then(res => {
				this.approvals = res.data.msg.adjustments;
				this.dates = res.data.msg.dates;
				this.$store.state.loading = false
			})
			.catch(err => console.log(err))

		},

		ChangeDate(datadate){
			this.$store.state.loading = true
			this.axiosRequest('get', this.$store.state.application_api+'/timeadjustment/' + this.$session.get('auth')['user_id'] + '?date=' + datadate, null, this.$session.get('headers'))
			.then(res => {
				this.approvals = res.data.msg.adjustments;
				this.dates = res.data.msg.dates;
				this.$store.state.loading = false
			})
			.catch(err => console.log(err))
		},

		modalBtn(approval){
			this.form = approval;
			$('#viewModal').modal({
				backdrop: 'static',
				keyboard: false
			});
		},

		closeModalBtn(){
			this.isUpdating = false;
		},

		updateAdjustment(id, status){
			
			this.isActiveBtn = id + 'updateBtn';
			this.update_approval_loading = true;

			let params = {
				edtr_id: this.form.edtr_id,
				time_out: this.form.time_out,
				time_in: this.form.time_in,
				day_type: this.form.day_type,
				status: status,
				checked_by: this.$session.get('auth')['email'],
			}

			this.$store.state.loading = true

			this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment/update/'+ id, params, this.$session.get('headers'))
			.then(res => {
				if(res.data.status == "success"){
					$("#viewModal").modal('toggle');
					this.toastr({ title: 'Adjustment', message: 'Adjustment request updated!'})
					this.notif = '';
					this.isActiveBtn = '';
					this.changeStatus(id, status);
					this.update_approval_loading = false;
				}else{
					this.notif = {
						style: 'alert-danger',
						message: res.data.msg,
						icon: 'fa-times-circle'
					}
					this.isActiveBtn = '';
					this.update_approval_loading = false;
				}
				// this.ChangeDate(this.dates.end);
				this.$store.state.loading = false
			})
			.catch(err => console.log(err))
		},

		changeStatus(id, status){
			this.approvals.find(x => x.id == id).status = status;
			var indexx = this.approvals.findIndex(x => x.id == id);
		},

	}

}

</script>
