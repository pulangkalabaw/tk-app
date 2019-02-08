<template>
	<div class="main__cont">
		<div class="main-heading">
			<ol class="breadcrumb">
				<li>Time info</li>
				<li class="active">Time adjustment</li>
			</ol>
		</div>
		<div class="container-fluid half-padding">
			<div class="template template__blank">
				<!-- START of Content here -->
				<div class="row">
					<div class="col-md-12">
						<div class="panel panel-primary">
							<div class="panel-heading">
								<h3 class="panel-title">
									My time adjustments
									<span v-if="index_adjust_loading">
										<span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
									</span>
									<span v-else>
										<span class='fa fa-refresh' data-toggle="tooltip" title="Refresh data" @click="refreshAdjustmentRequests()"></span>
									</span>
								</h3>
							</div>
							<div class="panel-body">

								<div v-if="!index_adjust_loading">
									<!-- start of inside codable(component) -->

									<!-- notif -->
									<notif :notif="notif"></notif>
									<!-- end of notif -->

									<div class="clearfix"></div>

									<div>

										<!-- start of nav tab -->
										<ul class="nav nav-tabs">

											<li class="active">
												<a data-toggle="tab" href="F#pendingTab">Pending <span class="label">{{ pendingApprovals.length }}</span></a>
											</li>
											<li>
												<a data-toggle="tab" href="#approvedTab">Approved <span class="label">{{ approvedApprovals.length }}</span></a>
											</li>
											<li>
												<a data-toggle="tab" href="#declinedTab">Declined <span class="label">{{ declinedApprovals.length }}</span></a>
											</li>
											<li>
												<a data-toggle="tab" href="#requestTab"><i class="fa fa-send"></i> Request Time Adjustment</a>
											</li>
										</ul>
										<!-- end of nav tab -->

										<div class="tab-content">

											<!-- Pending -->
											<div id="pendingTab" class="tab-pane fade in active">
												<div>
													<div class="row">
														<!-- Column for downlaod excel -->
														<div class="col-md-6 text-left"></div>

														<!-- Column of legends and info -->
														<div class="col-md-6 text-right">
															<i class="fa fa-info-circle text-info"></i> <small class="text-info">Please click on a data to see leave info</small>
														</div>
													</div>
													<!-- inside if there is timetable -->
													<table class="datatable table table-hover">
														<thead>
															<tr>
																<th>Date</th>
																<th>Time in</th>
																<th>Time out</th>
																<th>Shift</th>
																<th>Day Type</th>
																<!-- <th class="text-center">Action</th> -->
															</tr>
														</thead>
														<tbody>
															<tr v-for="approval in pendingApprovals" @click="modalBtn(approval)">
																<td>{{ approval.date_in }}</td>
																<td>
																	<span v-if="approval.time_in">
																		{{ toHumanTime(approval.time_in) }}
																	</span>
																	<span v-else>-</span>
																</td>
																<td>
																	<span v-if="approval.time_out">
																		{{ toHumanTime(approval.time_out) }}
																	</span>
																	<span v-else>-</span>
																</td>
																<td><span v-if="approval.shift_in">{{ toHumanTime(approval.shift_in) + ' - ' + toHumanTime(approval.shift_out) }}</span></td>
																<td>{{ approval.day_type }}</td>
															</tr>
														</tbody>
													</table>
													<!-- end of inside if there is approvals -->
												</div>
											</div>

											<!-- Approved -->
											<div id="approvedTab" class="tab-pane fade">
												<div class="row">
													<!-- Column for downlaod excel -->
													<div class="col-md-6 text-left"></div>

													<!-- Column of legends and info -->
													<div class="col-md-6 text-right">
														<i class="fa fa-info-circle text-info"></i> <small class="text-info">Please click on a data to see leave info</small>
													</div>
												</div>
												<!-- inside if there is timetable -->
												<table class="datatable table table-hover">
													<thead>
														<tr>
															<th>Date</th>
															<th>Time in</th>
															<th>Time out</th>
															<th>Shift</th>
															<th>Day Type</th>
														</tr>
													</thead>
													<tbody>
														<tr v-for="approval in approvedApprovals"  @click="modalBtn(approval)">
															<td>{{ approval.date_in }}</td>
															<td>
																<span v-if="approval.time_in">
																	{{ toHumanTime(approval.time_in) }}
																</span>
																<span v-else>-</span>
															</td>
															<td>
																<span v-if="approval.time_out">
																	{{ toHumanTime(approval.time_out) }}
																</span>
																<span v-else>-</span>
															</td>
															<td><span v-if="approval.shift_in">{{ toHumanTime(approval.shift_in) + ' - ' + toHumanTime(approval.shift_out) }}</span></td>
															<td>{{ approval.day_type }}</td>
														</tr>
													</tbody>
												</table>
												<!-- end of inside if there is approvals -->
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
												<!-- inside if there is timetable -->
												<table class="datatable table table-hover">
													<thead>
														<tr>
															<th>Date</th>
															<th>Time in</th>
															<th>Time out</th>
															<th>Shift</th>
															<th>Day Type</th>
															<!-- <th class="text-center">Action</th> -->
														</tr>
													</thead>
													<tbody>
														<tr v-for="approval in declinedApprovals"  @click="modalBtn(approval)">
															<td>{{ approval.date_in }}</td>
															<td>
																<span v-if="approval.time_in">
																	{{ toHumanTime(approval.time_in) }}
																</span>
																<span v-else>-</span>
															</td>
															<td>
																<span v-if="approval.time_out">
																	{{ toHumanTime(approval.time_out) }}
																</span>
																<span v-else>-</span>
															</td>
															<td><span v-if="approval.shift_in">{{ toHumanTime(approval.shift_in) + ' - ' + toHumanTime(approval.shift_out) }}</span></td>
															<td>{{ approval.day_type }}</td>
														</tr>
													</tbody>
												</table>
												<!-- end of inside if there is approvals -->
											</div>

											<!-- Request -->
											<div id="requestTab" class="tab-pane fade">
												<form action="" v-on:submit.prevent="sendNewAdjustmentRequest()">
													<!-- notif -->
													<div class="col-md-12" v-if="notif.status == true">
														<div :class="notif.class" class="text-center">
															{{ notif.msg }}
														</div>
														<br>
													</div>
													<!-- end of notif -->

													<!-- If you searching -->
													<div v-if="!edtr_loading">
														<div class="row">
															<div class="col-md-4" v-if="!edtr_loading">
																<label for=""><strong>Date:</strong></label>
																<input type="date" id="datePickerId" v-model="datepick" @change="getEdtrTimeUsingDate(datepick)" class="form-control">
															</div>
															<div class="col-md-2" v-else>
																<i class="fa fa-refresh fa-spin"></i>
															</div>
															<!-- start of edtr data  -->
															<div v-if="singleEdtr">

																<div class="col-md-4">
																	<label for=""><strong>Shift:</strong></label>
																	<p v-if="singleEdtr.shift_in">{{ toHumanTime(singleEdtr.shift_in) + ' - ' + toHumanTime(singleEdtr.shift_out) }}</p><p v-else>----</p>
																</div>
																<div class="col-md-4">
																	<label for=""><strong>Reference:</strong></label>
																	<p v-if="singleEdtr.reference">{{ showBundeeName(singleEdtr.reference) }}</p><p v-else>----</p>
																</div>

															</div>
															<!-- end of edtr data -->
														</div>
														<br>

														<!-- start of edtr data  -->
														<div v-if="singleEdtr">

															<div class="row">
																<div class="col-md-6">
																	<div class="breadcrumb">
																		<h4>Original time data</h4>
																		<div class="row">
																			<div class="col-md-4"><strong>Time In:</strong></div>
																			<div class="col-md-8"><span v-if="singleEdtr.time_in">{{ toHumanTime(singleEdtr.time_in) }}</span><span v-else>--:--:--</span><br></div>
																			<div class="col-md-4"><strong>Time out:</strong></div>
																			<div class="col-md-8"><span v-if="singleEdtr.time_out">{{ toHumanTime(singleEdtr.time_out) }}</span><span v-else>--:--:--</span><br></div>
																			<div class="col-md-4"><strong>Day Type:</strong></div>
																			<div class="col-md-8">
																				<select class="selectpicker form-control input-sm" v-model="singleEdtr.day_type" disabled>
																					<option value="">Select type</option>
																					<option value="ABSENT">ABSENT</option>
																					<option value="VL">VL</option>
																					<option value="SL">SL</option>
																					<option value="RH">Holiday</option>
																					<option :value="daytype" v-for="daytype in $store.state.daytype">{{ daytype }}</option>
																				</select>
																				<br>
																			</div>
																		</div>
																	</div>
																</div>

																<div class="col-md-6">
																	<div class="breadcrumb">
																		<h4>Adjust to</h4>
																		<div class="row">
																			<div class="col-md-4"><strong>Time In:</strong></div>
																			<div class="col-md-8"><input type="time" class="form-control input-sm" v-model="new_time_in" :disabled="checkerDayType2(new_day_type)"><br></div>
																			<div class="col-md-4"><strong>Time out:</strong></div>
																			<div class="col-md-8"><input type="time" class="form-control input-sm" v-model="new_time_out" :disabled="checkerDayType2(new_day_type)"><br></div>
																			<div class="col-md-4"><strong>Day Type:</strong></div>
																			<div class="col-md-8">
																				<select class="selectpicker form-control input-sm" v-model="new_day_type">
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

														</div>
														<!-- end of edtr data -->

														<div class="row" v-if="singleEdtr">
															<div class="col-md-12">
																<label for=""><strong>Reason:</strong></label>
																<textarea cols="2" rows="2" style="resize: vertical;" v-model="new_reason" required="" class="form-control">{{ new_reason }}</textarea>
															</div>
														</div>

														<br>
														<div class="row">
															<div class="col-md-6 text-left">
															</div>
															<div class="col-md-6 text-right" v-if="singleEdtr">
																<button type="submit" class="btn btn-success" v-if="create_adjust_loading == false">Send adjustment request</button>
																<button type="button" class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>
															</div>
														</div>
													</div>
													<div v-else>
														Loading please wait..
													</div>
													<!-- If you searching -->
												</form>
											</div>
											<!-- end of request tab -->

										</div> <!-- end of tab content -->
									</div>
									<!-- <div class="text-center" v-else>
									<p>No time data found</p>
								</div> -->

								<!-- end of inside codable(component) -->
							</div>
							<div v-else>
								Loading please wait...
							</div>
						</div>

						<!-- MODAL FOR ADJUSTMENT CLICK ON ROW -->
						<div class="modal fad ine" id="adjustmentModal" v-if="!index_adjust_loading"  :class="{ 'show': !hide_adjustment_data }">

							<div class="modal-dialog">
								<div class="modal-content">
									<form action="" v-on:submit.prevent="updateAdjustmentRequest()">
										<div class="modal-header">
											<button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
											<h4 class="modal-title">Time adjustment details</h4>
										</div>
										<div class="modal-body">

											<!-- START OF FORM -->
											<div class="row">
												<div class="col-md-12" v-if="notif.status == true">
													<div :class="notif.class" class="text-center">
														{{ notif.msg }}
													</div>
													<br>
												</div>
												<div class="col-md-12" v-if="form.status == 'pending'">
													<button type="button" class="btn btn-danger" @click="confirmDelete()">Delete Request</button><br><br>
												</div>
											</div>

											<div class="row">
												<div class="col-md-3">
													<label for=""><strong>Date:</strong></label>
													<p>{{ form.date_in}}</p>
												</div>
												<div class="col-md-3">
													<label for=""><strong>Shift:</strong></label>
													<p>{{ new Date('7/10/2013 '+form.shift_in).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") +' - '+ new Date('7/10/2013 '+form.shift_out).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3") }}</p>
												</div>
												<div class="col-md-3">
													<label for=""><strong>Reference:</strong></label>
													<p>
														{{ showBundeeName(form.reference) }}
													</p>
												</div>
												<div class="col-md-3">
													<label for=""><strong>Remarks:</strong></label>
													<p v-if="form.remarks">{{ form.remarks }}</p><p v-else>N/A</p>
												</div>
											</div>

											<div class="row">
												<div class="col-md-4">
													<label for=""><strong>Grace period:</strong></label>
													<p>{{ form.grace_period }} minutes</p>
												</div>
											</div>

											<div class="row">
												<div class="col-md-12 text-left" v-if="form.status == 'pending'">
													<button class="btn btn-default" type="button" v-show="!isEditing" @click="isEditing ^= true">Edit request</button>
													<button class="btn btn-default" type="button" v-show="isEditing" @click="isEditing ^= true">Cancel edit</button>
													<br><br>
												</div>
											</div>

											<!-- Is editing -->
											<div>
												<div class="row">
													<div class="col-md-6">

														<div class="breadcrumb">
															<h4>Original time data</h4>
															<!-- if view only -->
															<div class="row" v-if="!isEditing">
																<div class="col-md-4"><strong>Time In:</strong></div>
																<div class="col-md-8"><span v-if="form.old_time_in">{{ toHumanTime(form.old_time_in) }}</span><span v-else>--:--:--</span><br></div>
																<div class="col-md-4"><strong>Time out:</strong></div>
																<div class="col-md-8"><span v-if="form.old_time_out">{{ toHumanTime(form.old_time_out) }}</span><span v-else>--:--:--</span><br></div>
																<div class="col-md-4"><strong>Day Type:</strong></div>
																<div class="col-md-8">
																	<select class="selectpicker form-control input-sm" v-model="form.old_day_type" disabled>
																		<option value="">Select type</option>
																		<option value="ABSENT">ABSENT</option>
																		<option :value="daytype" v-for="daytype in $store.state.daytype">{{ daytype }}</option>
																	</select>
																	<br>
																</div>
															</div>

															<!-- editing  -->
															<div class="row" v-else>
																<div class="col-md-4"><strong>Time In:</strong></div>
																<div class="col-md-8"><input type="time" class="form-control input-sm" :value="form.old_time_in" disabled><br></div>
																<div class="col-md-4"><strong>Time out:</strong></div>
																<div class="col-md-8"><input type="time" class="form-control input-sm" :value="form.old_time_out" disabled><br></div>
																<div class="col-md-4"><strong>Day Type:</strong></div>
																<div class="col-md-8">
																	<select class="selectpicker form-control input-sm" v-model="form.old_day_type" disabled>
																		<option value="">Select type</option>
																		<option value="ABSENT">ABSENT</option>
																		<option :value="daytype" v-for="daytype in $store.state.daytype">{{ daytype }}</option>
																	</select>
																	<br>
																</div>
															</div>

														</div>


													</div>
													<div class="col-md-6">
														<div class="breadcrumb">
															<h4>Adjust time to</h4>
															<div class="row" v-if="!isEditing">
																<div class="col-md-4"><strong>Time In:</strong></div>
																<div class="col-md-8"><span v-if="form.time_in">{{ toHumanTime(form.time_in) }}</span><span v-else>--:--:--</span><br></div>
																<div class="col-md-4"><strong>Time out:</strong></div>
																<div class="col-md-8"><span v-if="form.time_out">{{ toHumanTime(form.time_out) }}</span><span v-else>--:--:--</span><br></div>
																<div class="col-md-4"><strong>Day Type:</strong></div>
																<div class="col-md-8">
																	<select class="selectpicker form-control input-sm" v-model="form.day_type" disabled>
																		<option value="">Select type</option>
																		<option value="ABSENT">ABSENT</option>
																		<option :value="daytype" v-for="daytype in $store.state.daytype">{{ daytype }}</option>
																	</select>
																	<br>
																</div>
															</div>

															<div class="row" v-else>
																<div class="col-md-4"><strong>Time In:</strong></div>
																<div class="col-md-8"><input type="time" class="form-control input-sm" v-model="form.time_in" :disabled="checkerDayType(form.day_type)"><br></div>
																<div class="col-md-4"><strong>Time out:</strong></div>
																<div class="col-md-8"><input type="time" class="form-control input-sm" v-model="form.time_out" :disabled="checkerDayType(form.day_type)"><br></div>
																<div class="col-md-4"><strong>Day Type:</strong></div>
																<div class="col-md-8">
																	<select class="selectpicker form-control input-sm" v-model="form.day_type" required>
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
												<!-- end of Is editing -->

												<div class="row">
													<div class="col-md-12" v-if="!isEditing">
														<label for=""><strong>Reason:</strong></label>
														<p v-if="form.reason" class="breadcrumb">{{ form.reason }}</p>
													</div>
													<div class="col-md-12" v-if="isEditing">
														<label for=""><strong>Reason:</strong></label>
														<textarea cols="2" rows="2" class="form-control" style="resize: vertical;" v-model="form.reason" required=""></textarea>
													</div>
												</div>
											</div>
											<!-- END OF FORM -->

										</div>
										<div class="modal-footer" data-backdrop="false">
											<div class="row">
												<div class="col-md-6 text-left">
													<button class="btn btn-default" type="button" data-dismiss="modal">Close</button>
												</div>
												<div class="col-md-6 text-right" v-show="isEditing">
													<button type="submit" class="btn btn-success">Update</button>
												</div>
											</div>

										</div>
									</form>
								</div>
							</div>
						</div>
						<!-- END OF MODAL FOR ADJUSTMENT CLICK ON ROW -->

					</div>
				</div>
			</div>

			<!-- END of Content here -->
		</div>
	</div>
</div>

</template>

<script>

export default {

	data(){
		return {
			// approvals: '',
			dates: '',
			form: '',
			reason: '',
			notif: '',

			datepick: '',
			new_time_in: '',
			new_time_out: '',
			new_day_type: '',
			new_reason: '',
			singleEdtr: '',

			isEditing: false,

			index_adjust_loading: true,
			update_adjust_loading: false,
			delete_adjust_loading: false,
			create_adjust_loading: false,
			edtr_loading: false,

			search_date_loading: false,

			hide_adjustment_data: true
		}
	},

	created(){
		this.getAdjustmentRequests();
	},

	mounted(){
		$('.selectpicker').selectpicker({style: 'btn-sm'});
		$('.datatable').DataTable();
	},

	beforeUpdate() {
		$('.datatable').DataTable().destroy();
	},

	updated(){
		$('.selectpicker').selectpicker({style: 'btn-sm'});
		$('.selectpicker').selectpicker('refresh');
		if (!this.edtr_loading) {
			datePickerId.max = new Date().toISOString().split("T")[0];
		}
		$('.datatable').DataTable();
	},

	computed: {
		// filter for pending approvals
		pendingApprovals() {
			if(this.$store.state.all_adjusted_requests){
				let appr = this.$store.state.all_adjusted_requests
				return appr.filter(function(val){
					return val.status == 'pending';
				});
			}
		},

		approvedApprovals() {
			if(this.$store.state.all_adjusted_requests){
				let appr = this.$store.state.all_adjusted_requests
				return appr.filter(function(val){
					return val.status == 'approved';
				});
			}
		},

		declinedApprovals() {
			if(this.$store.state.all_adjusted_requests){
				let appr = this.$store.state.all_adjusted_requests
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

		refreshAdjustmentRequests () {
			this.$store.state.all_adjusted_requests = []
			this.getAdjustmentRequests()
		},

		getAdjustmentRequests() {

			if (this.$store.state.all_adjusted_requests.length == 0) {
				this.index_adjust_loading = true
				this.axiosRequest('get', this.$store.state.application_api+'/mytimeadjustment/' + this.$session.get('auth')['user_id'], null, this.$session.get('headers'))
				.then(res => {
					if(res.data.status == "success"){
						this.$store.state.all_adjusted_requests = res.data.msg
					}
					this.index_adjust_loading = false
				})
				.catch(err => console.log(err))
			}
			else {
				this.index_adjust_loading = false
			}
		},

		modalBtn(timedata){
			this.form = timedata;
			$('#adjustmentModal').modal({
                backdrop: 'static',
                keyboard: false
            });
		},

		requestAdjustmentBtn(){
			$('#requestAdjustmentModal').modal('toggle');
		},

		getEdtrTimeUsingDate(date_in){

			this.edtr_loading = true;

			let params = {
				user_id: this.$session.get('auth')['user_id'],
				date_in: date_in,
			}

			this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment/showtime-edtr', params, this.$session.get('headers'))
			.then(res => {
				if(res.data.status == "success"){
					this.singleEdtr = res.data.msg;
					this.edtr_loading = false
				}else{
					this.edtr_loading = true
				}
			})
			.catch(err => console.log(err))

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

		checkerDayType2(daytype){
			// if return true means disable the field
			if(daytype == 'RD'  || daytype == 'ABSENT'){
				this.new_time_in = '';
				this.new_time_out = '';
				return true;
			}else{
				return false;
			}
		},

		updateAdjustmentRequest(){
			let params = {
				session_id: this.$session.get('auth')['user_id'],
				time_in: this.form.time_in,
				time_out: this.form.time_out,
				day_type: this.form.day_type,
				reason: this.form.reason,
			}


			this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment/update-request/' + this.form.id, params, this.$session.get('headers'))
			.then(res => {
				this.getAdjustmentRequests();
				if(res.data.status == "success"){
					this.toastr({ title: 'Success!', message: 'Time adjustment updated.'})
					this.notif = '';
					$('#adjustmentModal').modal('toggle');

				}else{
					this.notif = {
						icon: 'fa-times-circle',
						style: 'alert-danger',
						message: res.data.msg
					}
				}
				this.$store.state.loading = false
			})
			.catch(err => console.log(err))

		},

		sendNewAdjustmentRequest(){
			this.create_adjust_loading = true;

			if(this.singleEdtr.id){

				// IF THERE IS AN EXISTING DATA ON TIME SHEET
				let params = {
					user_id: this.$session.get('auth')['user_id'],
					edtr_id: this.singleEdtr.id,
					date_in: this.singleEdtr.date_in,
					old_time_in: this.singleEdtr.time_in,
					old_time_out: this.singleEdtr.time_out,
					old_day_type: this.singleEdtr.day_type,
					time_in: this.new_time_in,
					time_out: this.new_time_out,
					day_type: this.new_day_type,
					reference: this.singleEdtr.reference,
					grace_period: this.singleEdtr.grace_period,
					reason: this.new_reason,
				}

				let request_email_params = {
					email: this.$session.get('auth')['email'],
					link: this.$route.params.tenant,
					type: 'ar',
					date_start: this.singleEdtr.date_in,
					date_end: this.singleEdtr.date_in,
				};

				// console.log(params);

				this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment', params, this.$session.get('headers'))
				.then(res => {
					// this.getAdjustmentRequests();
					if(res.data.status == "success"){
						this.toastr({ title: 'Success!', message: 'Time adjustment request sent.'})
						this.notif = '';
						this.axiosRequest('post', this.$store.state.mail_api + '/request', request_email_params, null, false)
						this.refreshAdjustmentRequests()

					}else{
						this.notif = {
							icon: 'fa-times-circle',
							style: 'alert-danger',
							message: res.data.msg
						}
					}
					this.create_adjust_loading = false;
					this.$store.state.loading = false
				})
				.catch(err => console.log(err))
				// END IF THERE IS AN EXISTING DATA ON TIME SHEET

			}else{

				let params = {
					user_id: this.$session.get('auth')['user_id'],
					old_day_type: this.singleEdtr.day_type,
					date_in: this.singleEdtr.date_in,
					time_in: this.new_time_in,
					time_out: this.new_time_out,
					day_type: this.new_day_type,
					reference: 'edtr',
					reason: this.new_reason
					// shift in & shift out insert through backend
				}

				let request_email_params = {
					email: this.$session.get('auth')['email'],
					link: this.$route.params.tenant,
					type: 'ar',
					date_start: this.singleEdtr.date_in,
					date_end: this.singleEdtr.date_in,
				};

				this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment', params, this.$session.get('headers'))
				.then(res => {
					// this.getAdjustmentRequests();
					if(res.data.status == "success"){
						this.toastr({ title: 'Success!', message: 'Time adjustment request sent.'})
						this.notif = '';
						this.axiosRequest('post', this.$store.state.mail_api + '/request', request_email_params, null, false)
						this.refreshAdjustmentRequests()
					}else{
						this.notif = {
							icon: 'fa-times-circle',
							style: 'alert-danger',
							message: res.data.msg
						}
					}
					this.create_adjust_loading = false;
					this.$store.state.loading = false
				})
				.catch(err => console.log(err))

			}



		},

		confirmDelete(){
			let conf = confirm("Do you really want to cancel this adjustment request?");

			let params = {
				session_id: this.$session.get('auth')['user_id'],
			}

			if(conf){
				// do delete
				this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment/delete-request/' + this.form.id, params, this.$session.get('headers'))
				.then(res => {
					// this.getAdjustmentRequests();
					if(res.data.status == "success"){
						this.toastr({ title: 'Success!', message: 'Time adjustment request deleted.'})
						this.notif = '';
						this.deleteData(this.form.id)
						$('#adjustmentModal').modal('toggle');
					}else{
						this.notif = {
							icon: 'fa-times-circle',
							style: 'alert-danger',
							message: res.data.msg
						}
					}
					this.$store.state.loading = false
				})
				.catch(err => console.log(err))
			}else{
				// do not delete request
			}
		},

		deleteData(id){
			var indexx = this.$store.state.all_adjusted_requests.findIndex(x => x.id == id);
			this.$store.state.all_adjusted_requests.splice(indexx, 1);
		},

	}

}

</script>
