<template>
	<div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>Time Info</a></li>
                <li class="active">Overtime Requests</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
            	<!-- Content here -->
				
				<div class="row">
					<div class="col-md-12">
						
						<div class="panel panel-primary">
							<div class="panel-heading">
								<h3 class="panel-title">Overtime
									<span v-if="index_request_loading == true">
		                                <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
		                            </span>
								</h3>
							</div>
							<div class="panel-body">
								
								<!-- Checker for overtimedata -->
								<div v-if="index_request_loading == false">
									<!-- start of okay data -->
										<div class="row">
											<div class="col-md-12">
												
												<!-- start of nav tab -->
					                            <ul class="nav nav-tabs">

					                                <li class="active">
					                                    <a data-toggle="tab" href="#pendingTab">Pending <span class="label">{{ pendingOvertime.length }}</span></a>
					                                </li>
					                                <li>
					                                    <a data-toggle="tab" href="#approvedTab">Approved <span class="label">{{ approvedOvertime.length }}</span></a>
					                                </li>
					                                <li>
					                                    <a data-toggle="tab" href="#declinedTab">Declined <span class="label">{{ declinedOvertime.length }}</span></a>
					                                </li>
					                                <li>	                                	
					                                    <a data-toggle="tab" href="#overtimeRequest"><i class="fa fa-send"></i> Request overtime</a>
					                                </li>
					                            </ul>
					                            <!-- end of nav tab -->


					                            <div class="tab-content">                                   

					                                <!-- Pending -->
					                                <div id="pendingTab" class="tab-pane fade in active">
														<table class="datatable table table-hover">
															<thead>
																<tr>
																	<th>Date</th>
																	<th>Time Start</th>
																	<th>Time End</th>
																	<!-- <th>Reason</th> -->
																</tr>
															</thead>
															<tbody>
																<tr v-for="request in pendingOvertime" @click="modalBtn(request)">
																	<td>{{ request.date }}</td>
																	<td>{{ toHumanTime(request.start_time) }}</td>
																	<td>{{ toHumanTime(request.end_time) }}</td>
																	<!-- <td>{{ request.reason }}</td> -->
																</tr>
															</tbody>
														</table>
					                                </div>

					                                <!-- Pending -->
					                                <div id="approvedTab" class="tab-pane fade">
														<table class="datatable table table-hover">
															<thead>
																<tr>
																	<th>Date</th>
																	<th>Time Start</th>
																	<th>Time End</th>
																	<!-- <th>Reason</th> -->
																</tr>
															</thead>
															<tbody>
																<tr v-for="request in approvedOvertime" @click="modalBtn(request)">
																	<td>{{ request.date }}</td>
																	<td>{{ toHumanTime(request.start_time) }}</td>
																	<td>{{ toHumanTime(request.end_time) }}</td>
																	<!-- <td>{{ request.reason }}</td> -->
																</tr>
															</tbody>
														</table>
					                                </div>

					                                <!-- Pending -->
					                                <div id="declinedTab" class="tab-pane fade">
														<table class="datatable table table-hover">
															<thead>
																<tr>
																	<th>Date</th>
																	<th>Time Start</th>
																	<th>Time End</th>
																	<!-- <th>Reason</th> -->
																</tr>
															</thead>
															<tbody>
																<tr v-for="request in declinedOvertime" @click="modalBtn(request)">
																	<td>{{ request.date }}</td>
																	<td>{{ toHumanTime(request.start_time) }}</td>
																	<td>{{ toHumanTime(request.end_time) }}</td>
																	<!-- <td>{{ request.reason }}</td> -->
																</tr>
															</tbody>
														</table>
					                                </div>

					                                <!-- New -->
					                                <div id="overtimeRequest" class="tab-pane fade in">
					                                	
					                                	<!-- Start of form -->
					                                	<form action="" v-on:submit.prevent="requestOvertime(form)">

					                                		<!-- Alert -->
					                                		<div class="row">
					                                			<div class="col-md-12">
					                                				<notif :notif="notif"></notif>
					                                			</div>
					                                		</div>
					                                		<!-- End of alert -->

						                                	<div class="row">	                                		
																<div class="col-md-6">
																	<div class="col-md-3">Date</div>
																	<div class="col-md-9">
																		<input type="date" class="form-control" v-model="form.date" required="">											
																	</div>
																	
																	<div class="clearfix"></div><br>

																	<div class="col-md-3">Time Start</div>
																	<div class="col-md-9">
																		<input type="time" class="form-control" v-model="form.start_time" required="">											
																	</div>

																	<div class="clearfix"></div><br>												

																	<div class="col-md-3">Time End</div>
																	<div class="col-md-9">
																		<input type="time" class="form-control" v-model="form.end_time" required="">											
																	</div>

																	<div class="clearfix"></div><br>																								

																	<div class="col-md-12 text-right">
																		<button type="submit" class="btn btn-success" v-if="create_overtime_loading == false">Submit</button>
																		<button class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>
																	</div>
																</div>
																<div class="col-md-6">
																	<div class="col-md-12">Reason</div>
																	<div class="col-md-12">
																		<textarea cols="30" rows="10" class="form-control" v-model="form.reason" required=""></textarea>											
																	</div>
																</div>
						                                	</div>
					                                	</form>
					                                	<!-- End of form -->

					                                </div>

					                            </div>

											</div>
										</div>
									<!-- end of okay data -->
								</div>
								<!-- End of checker for overtimedata -->
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


		
		<!-- Start of modal -->
        <div class="modal fade" id="approvalModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form action="" v-on:submit.prevent="updateOvertime()">
                        <div class="modal-header">
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close" @click="closeModal()"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">Overtime details</h4>
                        </div>
                        <div class="modal-body">

							<!-- alert -->
							<notif :notif="notif"></notif>
							<div v-if="notif">
                    			<div class="clearfix"></div><br>								
							</div>
                            <!-- end of alert -->
		
                            <div class="row" v-if="modalform.status == 'pending'">
                            	<div class="col-md-12">

                            		<div class="row">
                            			<div class="col-md-6">
                            				<button v-if="isEditing == 0" type="button" class="btn btn-default btn-sm" @click="isEditing ^= true">Edit request</button>
                        					<button v-else type="button" class="btn btn-default btn-sm" @click="isEditing ^= true">Exit edit</button>
                            			</div>
                            			<div class="col-md-6 text-right">
                            				<span v-if="isEditing == 1">
		                            			<button type="button" class="btn btn-danger btn-sm" @click="deleteOvertime()">Delete request</button>		                            			
		                            		</span>
                            			</div>
                            		</div>
                            		                            		
                            		<div class="clearfix"></div><br>
                            	</div>
                            </div>

							<!-- for show only -->
							<div v-if="isEditing == 0">
	                            <div class="row">
	                                <div class="col-md-3">
	                                    <label for=""><strong>Date</strong></label>
	                                    <p>{{ modalform.date }}</p>
	                                </div>
	                                <div class="col-md-3">
	                                    <label for=""><strong>Time Start</strong></label>
	                                    <p>{{ toHumanTime(modalform.start_time) }}</p>
	                                </div>
	                                <div class="col-md-3">
	                                    <label for=""><strong>Time End</strong></label>
	                                    <p>{{ toHumanTime(modalform.end_time) }}</p>
	                                </div>
	                                <div class="col-md-3">
	                                    <label for=""><strong>Hours rendered</strong></label>
	                                    <p>{{ (new Date("Fri, 26 Sep 2014 "+modalform.end_time+" GMT").getHours() - new Date("Fri, 26 Sep 2014 "+modalform.start_time+" GMT").getHours()) }} Hour(s)</p>
	                                </div>
	                            </div>

	                            <div class="row">
	                                <div class="col-md-12">
	                                    <label for=""><strong>Reason</strong></label>
	                                    <p class="breadcrumb">{{ modalform.reason }}</p>
	                                </div>
	                            </div>
                            </div>
                            <!-- end for show only -->

                            <!-- for update -->
							<div v-else>
								<div class="row">
	                                <div class="col-md-4">
	                                    <label for=""><strong>Date</strong></label>
	                                    <input type="date" class="form-control" v-model="modalform.date">
	                                </div>
	                                <div class="col-md-4">
	                                    <label for=""><strong>Time Start</strong></label>
	                                    <input type="time" class="form-control" v-model="modalform.start_time">
	                                </div>
	                                <div class="col-md-4">
	                                    <label for=""><strong>Time End</strong></label>
	                                    <input type="time" class="form-control" v-model="modalform.end_time">
	                                </div>	                                
	                            </div>

	                            <div class="row">
	                                <div class="col-md-12">
	                                    <label for=""><strong>Reason</strong></label>
	                                    <textarea cols="2" rows="2" class="form-control" v-model="modalform.reason" style="resize: vertical;"></textarea>
	                                </div>
	                            </div>
							</div>
                            <!-- end for update -->

                        </div>
                        <div class="modal-footer">
                            <div class="row">
                                <div class="col-md-6 text-left">
                                    <button class="btn btn-default" type="button" data-dismiss="modal" @click="closeModal()">Close</button>                                                           
                                </div>
                                <div class="col-md-6 text-right" v-if="isEditing == 1">
                                	<button type="submit" class="btn btn-success" v-if="update_overtime_loading == false">Update</button>
                                	<button type="button" class="btn btn-success" v-else><i class="fa fa-refresh fa-spin"></i></button>
                        			<!-- <button type="button" class="btn btn-danger" @click="updateLeaveRequest(form.request_id, form.user_id,'declined')"><i class="fa fa-times-circle"></i></button> -->
                                	<!-- <button type="button" class="btn btn-success" @click="updateLeaveRequest(form.request_id, form.user_id,'approved')"><i class="fa fa-check-circle"></i></button> -->
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <!-- End of modal -->




    </div>
</template>

<script>

export default{

	// for toaster
	notifications: {
        toastr: {
            timeout: 2500,
            title: '',
            message: '',
            type: 'success'
        }
    },

    // INITIALIZATION OF VARIABLES
	data(){
		return{
			form: {},
			modalform: {},
			overtimedata: '',

			notif: '',
			index_request_loading: true,
			create_overtime_loading: false,
			update_overtime_loading: false,

			isEditing: 0,
		}
	},

	computed:{
		pendingOvertime() {
            if(this.overtimedata){
                let appr = this.overtimedata
                return appr.filter(function(val){
                    return val.status == 'pending';
                });
            }
        },

		approvedOvertime() {
            if(this.overtimedata){
                let appr = this.overtimedata
                return appr.filter(function(val){
                    return val.status == 'approved';
                });
            }
        },

        declinedOvertime() {
            if(this.overtimedata){
                let appr = this.overtimedata
                return appr.filter(function(val){
                    return val.status == 'declined';
                });
            }
        },
	},

	created(){
		this.getOvertime();
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

	// START OF METHODS 
	methods:{

		modalBtn(data){
			this.modalform = data
			$('#approvalModal').modal({
    				backdrop: 'static',
    				keyboard: false
			});
			// $('#approvalModal').modal('toggle');
		},

		closeModal(){
			this.isEditing = 0;
			this.notif = '';
		},

		getOvertime(){

			this.axiosRequest('get', this.$store.state.application_api+'/overtime/' + this.$session.get('auth')['user_id'], null, this.$session.get('headers'))
            .then(res => {
            	this.overtimedata = res.data.msg;
            	if(res.data.status == 'success'){
            		this.index_request_loading = false
            	}else{

            	}
            	console.log(res.data);
            })
            .catch(err => console.log(err))            
		},

		requestOvertime(form){
			this.create_overtime_loading = true;

			this.form.user_id = this.$session.get('auth')['user_id'];

			this.axiosRequest('post', this.$store.state.application_api+'/overtime', form, this.$session.get('headers'))
            .then(res => {
            	if(res.data.status == 'success'){
            		this.getOvertime();
            		this.toastr({ title: 'Success!', message: 'Successfully sent adjustment request.'})
                    this.notif = '';
					this.create_overtime_loading = false;
            	}else{
            		this.notif = {
                        style: 'alert-danger',
                        message: res.data.msg
                    }
            		this.toastr({ title: 'Failed!', message: 'Failure on sending adjustment request.', type: 'error'})
					this.create_overtime_loading = false;            		
            	}
            })
            .catch(err => console.log(err))

		},

		deleteOvertime(){
			// checker for delete of overtiem request
			let conf = confirm("Do you really want to delete your overtime request!");

			if(conf){
				this.modalform.user_id = this.$session.get('auth')['user_id'];

				this.axiosRequest('post', this.$store.state.application_api+'/overtime-request/delete', this.modalform, this.$session.get('headers'))
	            .then(res => {
	            	if(res.data.status == 'success'){
	            		this.getOvertime();
	            		this.toastr({ title: 'Success!', message: 'Successfully deleted adjustment request.'})
	                    this.notif = '';
	                    $("#approvalModal").modal("toggle");
	            	}else{
	            		this.notif = {
	                        style: 'alert-danger',
	                        message: res.data.msg
	                    }
	            		this.toastr({ title: 'Failed!', message: 'Failure on deletion of adjustment request.', type: 'error'})
	            	}
	            	console.log(res.data);
	            })
	            .catch(err => console.log(err))
			}
			
		},

		updateOvertime(){
			this.update_overtime_loading = true;
			this.modalform.user_id = this.$session.get('auth')['user_id'];
			this.modalform.method = "_PUT";

			console.log(this.modalform);

			this.axiosRequest('put', this.$store.state.application_api+'/overtime/' + this.modalform.id, this.modalform, this.$session.get('headers'))
            .then(res => {
            	if(res.data.status == 'success'){
            		this.getOvertime();
            		this.toastr({ title: 'Success!', message: 'Successfully updated adjustment request.'})
                    this.notif = '';
                    this.update_overtime_loading = false;
            	}else{
            		this.notif = {
                        style: 'alert-danger',
                        message: res.data.msg
                    }
            		this.toastr({ title: 'Failed!', message: 'Failure on updating adjustment request.', type: 'error'})
            		this.update_overtime_loading = false;
            	}
            	console.log(res.data);
            })
            .catch(err => console.log(err))
		},

	}

}

</script>