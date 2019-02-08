<template>

	<div class="main__cont">
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
								<h3 class="panel-title">Adjustment Approvals
									<i class="fa fa-spin" v-if="$store.state.loading" :class="$store.state.page_load_icon"></i>
								</h3>
							</div>
							<div class="panel-body" v-if="approvals">

								<form @submit.prevent="selectDates()" method="POST" class="form-group">
									<div class="row">
										<div class="col-md-3">
											from: <input type="date" v-model="dates.date_start" class="form-control" required>
										</div>
										<div class="col-md-3">
											to: <input type="date" v-model="dates.date_end" class="form-control" required>
										</div>
										<div class="col-md-3">
											<br>
											<button class="btn btn-default">Submit</button>
										</div>
									</div>
								</form>
								<hr>

							</div>
							<div class="panel-body" v-else>
								<span v-if="$store.state.loading">Loading please wait...</span>
								<span v-else>There is nobody to approve</span>
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
				dates: {},


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

			selectDates () {
				this.search_adjustment_loading = true
				this.axiosRequest('get', this.$store.state.application_api+'/timeadjustment/select-dates/' + this.$session.get('auth')['user_id'], this.dates, this.$session.get('headers'))
	    		.then(res => {
					console.log(res)
					this.search_adjustment_loading = false
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
