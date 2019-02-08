<template>

	<div class="main__cont">
		<div class="main-heading">
			<ol class="breadcrumb">
				<li>Time info</li>
				<li class="active">Time adjustment approvals</li>
			</ol>
		</div>
		<div class="container-fluid half-padding">
			<div class="template template__blank">
				<!-- START of Content here -->

				<div class="row">
					<div class="col-md-12">
						
						<div class="panel panel-primary">
							<div class="panel-heading">
								<h3 class="panel-title">Adjustment Approvals 
									<i class="fa fa-spin" v-if="$store.state.loading" :class="$store.state.page_load_icon"></i>
								</h3>
							</div>
							<div class="panel-body" v-if="approvals">

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
													<!-- <th class="text-center">Action</th> -->
												</tr>
											</thead>
											<tbody>
												<tr v-for="time in pendingApprovals" class="text-center" @click="modalBtn(time)">
													<td>{{ time.profile.fname+' '+time.profile.lname }}</td>
													<td>{{ time.date_in }}</td>
													<td><span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span></td>
													<td><span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span></td>
													<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
													<td>{{ time.day_type }}</td>
													<td width="30%">{{ time.reason }}</td>
													<!-- <td>
														<button class="btn btn-info btn-xs" title="View filed adjustment request" data-toggle="modal" data-target="#viewModal" @click="modalBtn(time)"><i class="fa fa-folder-open"></i></button>
													</td> -->
												</tr>
											</tbody>
										</table>

									</div>

									<!-- Approved -->
                                    <div id="approvedTab" class="tab-pane fade">
										
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
													<td><span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span></td>
													<td><span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span></td>
													<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
													<td>{{ time.day_type }}</td>
													<td width="30%">{{ time.reason }}</td>
												</tr>
											</tbody>
										</table>

                                	</div>

                                	<!-- Declined -->
                                    <div id="declinedTab"  class="tab-pane fade">
                                    	
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
													<td><span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span></td>
													<td><span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span></td>
													<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
													<td>{{ time.day_type }}</td>
													<td width="30%">{{ time.reason }}</td>
												</tr>
											</tbody>
										</table>

                                    </div>  

                                    <!-- All  -->
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
													<th class="text-center">Status</th>
													<th class="text-center">Reason</th>
												</tr>
											</thead>
											<tbody>
												<tr v-for="time in approvals" class="text-center" @click="modalBtn(time)">
													<td>{{ time.profile.fname+' '+time.profile.lname }}</td>
													<td>{{ time.date_in }}</td>
													<td><span v-if="time.time_in">{{ toHumanTime(time.time_in) }}</span></td>
													<td><span v-if="time.time_out">{{ toHumanTime(time.time_out) }}</span></td>
													<td><span v-if="time.shift_in">{{ toHumanTime(time.shift_in)+' - '+toHumanTime(time.shift_out) }}</span></td>
													<td>{{ time.day_type }}</td>
													<td>
														<i class="fa fa-check-circle text-success" v-if="time.status == 'approved'"></i>
														<i class="fa fa-times-circle text-danger" v-if="time.status == 'declined'"></i>
														<i class="fa fa-circle-o text-warning" v-if="time.status == 'pending'"></i>
													</td>
													<td width="30%">{{ time.reason }}</td>
												</tr>
											</tbody>
										</table>
                                    </div>
                                </div>

								
									
									
									
								<!-- if there is a approval -->
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
													<div class="modal-body" >

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
																<button class="btn btn-default" type="button" data-dismiss="modal" @click="closeModalBtn()">Close</button>
															</div>
															<div class="col-md-8 col-xs-6 text-right" v-if="form.status == 'pending'">
																<div v-if="update_approval_loading == false">
																	<button type="button" class="btn btn-danger" @click="updateAdjustment(form.id, 'declined')" v-if="isActiveBtn != form.id + 'updateBtn'"><i class="fa fa-times-circle" title="decline"></i></button><button class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>						                                
																	<button type="button" class="btn btn-success" @click="updateAdjustment(form.id, 'approved')" v-if="isActiveBtn != form.id + 'updateBtn'"><i class="fa fa-check-circle" title="approve"></i></button>
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
								<!-- if there is no approval -->
								<div v-else class="text-center">
									No time adjustment approvals found
								</div>

							</div>
							<div class="panel-body" v-else>
								<span v-if="$store.state.loading">Loading please wait...</span><span v-else>There is nobody to approve</span>
							</div>
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
				approvals: '',
				form: '',
				notif: '',

				dates: '',
				isActiveBtn: '',
				isUpdating: false,
				update_approval_loading: false,
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
			this.getTimeApprovals();
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
				// $('#viewModal').modal('toggle');
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
				console.log(params)

				this.$store.state.loading = true

				this.axiosRequest('post', this.$store.state.application_api+'/timeadjustment/update/'+ id, params, this.$session.get('headers'))
				.then(res => {
					console.log(res)
					if(res.data.status == "success"){
						$("#viewModal").modal('toggle');
						this.toastr({ title: 'Adjustment', message: 'Adjustment request updated!'})
                        this.notif = '';
						this.isActiveBtn = '';
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
					this.ChangeDate(this.dates.end);
					this.$store.state.loading = false
				})
				.catch(err => console.log(err))
			},

		}

	}

</script>