<template>
	<div class="login" v-if="!get_link_loading">
		<!-- {{ get_link_status }} -->
		<form class="login__form" @submit.prevent="login()" v-if="get_link_status">
			<!-- <div class="login__logo"></div> -->

			<div v-if="image != 'Company-Photo.png'">
				<center>
					<img id="imageid" :src="$store.state.image_url + $route.params.tenant +'/images/company/' + image" alt="" width="50%">
				</center>
				<center v-if="image == null">
					<img id="imageid" :src="$store.state.image_url + 'Company-Photo.png'" alt=""  width="50%">
				</center>
			</div>
			<div v-else>
				<center>
					<img id="imageid" :src="$store.state.image_url + 'Company-Photo.png'" alt=""  width="50%">
				</center>
			</div>
			<div class="clearfix"></div><br>

			<div v-if="announcement.length != 0">
				<div class="alert alert-warning">
					<div v-for="announcement in announcement">
						{{ announcement }} <br />
					</div>
				</div>
			</div>

			<!-- Alert -->
			<div class="alert alert-dismissible" :class="notif.style" v-if="notif">
				<span class='fa' :class="notif.icon"></span> {{ notif.message }}
			</div><br>
			<!-- Alert -->

			<div class="form-group">
				<input class="form-control" type="text" v-model="auth.username" placeholder="Username">
			</div>
			<div class="form-group">
				<input class="form-control" type="password" v-model="auth.password" placeholder="Password">
			</div>
			<div class="form-group login__action">
				<div class="login__submit">
					<a @click="redirect('password.forgot', { tenant: $route.params.tenant })">Forgot password</a>
					&nbsp;|&nbsp;
					<span v-if="login_loading">
						<span class='fa fa-spin' :class="$store.state.page_load_icon"></span>
					</span>
					<button class="btn btn-default" type="submit" :disabled="login_loading">Sign in</button>
				</div>
			</div>
		</form>

		<div v-else>
			<span class="login__form">
				<h2 class="text-warning">No registered company found!</h2>
			</span>
		</div>
	</div>
	<div class="login" v-else>
		<center class="login__form">
			<h2 class="text-warning">We'll getting your company information, please wait.. <span class='fa fa-refresh fa-spin'></span> </h2>
		</center>
	</div>
</template>

<script>
	export default {

		data () {
			return {
				auth: {},
				login_loading: false,
				image: '',
				notif: '',
				get_link_loading: true,
				announcement: [],
				get_link_status: false
			}
		},

		created () {
			this.getLink();
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

			// for link
			getLink(){
				this.get_link_loading = true
				this.axiosRequest('get', this.$store.state.application_api+'/tenantchecker/' + this.$route.params.tenant, null, null, false)
				.then(res => {
					if(res.data.status == 'success'){
						this.announcement = res.data.announcement
						this.image = res.data.msg;
						this.get_link_status = true
					}else{
						this.get_link_status = false
					}
					this.get_link_loading = false
				})
				.catch(err => {console.log(err)})

			},

			login() {

				this.login_loading = true
				this.notif = { message: 'Loading please wait', style: 'alert-info', icon: 'fa-refresh fa-spin' }
				this.auth.link = this.$route.params.tenant;
				let r = this.axiosRequest ('POST', this.$store.state.authentication_api + 'login', this.auth, null, false);
				r.then(res => {
					if (res.data.status != "failed") {
						this.notif = ''
						this.toastr({ message: 'Authenticated', title: 'Login' })
						let setup = {
							isScheduleFinished :res.data.msg.isFinishedSetup,
							isLocationFinished :res.data.msg.isFinishedSetup,
							isFinishedSetup :res.data.msg.isFinishedSetup
						}
						this.$session.set('auth', res.data.msg)
						this.$session.set('setup', setup );
						this.$session.set('bundee', res.data.msg.bundee);
						this.$session.set('headers', {
							'd': res.data.msg.c1,
							't': res.data.msg.c2,
						})
						if (this.$session.get('setup').isFinishedSetup == 0) {

							// Need to finish the setup wizard first!
							window.location.href = this.$store.state.app_url + '/' + this.auth.link + '/Setup-Wizard'
						}
						else {

							// Good to go!
							window.location.href = this.$store.state.app_url + '/' + this.auth.link + '/Profile/Dashboard'
						}
					}
					else {

						if (typeof res.data.msg === 'object') {
							var message = res.data.msg['username'] || res.data.msg['password'];
							this.notif = { message: message.join() || message.join(), style: "alert-danger", icon: 'fa-times-circle' }
						}
						else {
							// this.notif = { message: res.data.msg, style: "alert-danger", icon: 'fa-times-circle' }
							this.notif = ""
							this.toastr({ message: res.data.msg, title: 'Login', type: 'error' })

						}
					}
					this.login_loading = false
				})
				r.catch(error => console.log(error))
			}
		}

	}
</script>
