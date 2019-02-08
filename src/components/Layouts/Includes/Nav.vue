<template>
    <nav class="navbar navbar-static-top header-navbar">
        <div class="header-navbar-mobile">
            <div class="header-navbar-mobile__menu">
                <button class="btn" type="button"><i class="fa fa-bars"></i></button>
            </div>
            <div class="header-navbar-mobile__title"><span @click="redirect('admin.subscription', { tenant: $route.params.tenant })">{{ $session.get('auth')['company_name'].toUpperCase() }}</span>
                <!-- MOBILE LOGIN BUTTON -->
                <span v-if="index_time_loading == false">
                    <span v-if="create_time_loading == false">
                        <button class="btn btn-danger"  data-toggle="modal" data-target="#mobileloginmodal" v-if="mobiletime.msg"><i class="fa fa-clock-o"></i> Time Out</button>
                        <button class="btn btn-success"  data-toggle="modal" data-target="#mobileloginmodal" v-else><i class="fa fa-clock-o"></i> Time in</button>
                    </span>            
                    <span v-else>
                        <button class="btn btn-default" disabled=""><i class="fa fa-refresh fa-spin"></i></button>
                    </span>
                </span>
                <!-- END MOBILE LOGIN BUTTON -->    
            </div>
            <div class="header-navbar-mobile__settings dropdown"><a class="btn dropdown-toggle" href="" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-power-off"></i></a>
                <ul class="dropdown-menu dropdown-menu-right">
                    <li><a @click="logout()">Log Out</a></li>
                </ul>
            </div>
        </div>
        <div class="navbar-header">
            <a class="navbar-brand" @click="redirect('admin.subscription', { tenant: $route.params.tenant })">
                <div class="logo text-nowrap">
                    <div class="logo__img" v-if="$session.get('auth')['company_image'] == 'Company-Photo.png'">
                        <img :src="$store.state.image_url + $session.get('auth')['company_image']" alt="" style="width:300%;">
                    </div>
                    <div class="logo__img" v-else>
                        <img :src="$store.state.image_url + $route.params.tenant +'/images/company/' + $session.get('auth')['company_image']" alt="" style="width:300%;">                        
                    </div>
                    <!-- <div class="logo__img"><i class="fa fa-chevron-right"></i></div> -->
                    <span class="logo__text" style="margin-left:1%;">{{ $session.get('auth')['company_name'].toUpperCase() }}</span>
                </div>
            </a>
        </div>
        <div class="topnavbar">
            <ul class="userbar nav navbar-nav">
                <li class="dropdown"><a class="userbar__settings dropdown-toggle" href="" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-power-off"></i></a>
                    <ul class="dropdown-menu dropdown-menu-right">
                        <li><a @click="logout()">Log Out</a></li>
                    </ul>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li>            
                    <a href="#" style="cursor: context-menu">
                        <span v-if="index_time_loading == false">
                            <span v-if="create_time_loading == false">
                                <button class="btn btn-danger"  data-toggle="modal" data-target="#mobileloginmodal" v-if="mobiletime.msg"><i class="fa fa-clock-o"></i> Time Out</button>
                                <button class="btn btn-success"  data-toggle="modal" data-target="#mobileloginmodal" v-else><i class="fa fa-clock-o"></i> Time in</button>
                            </span>            
                            <span v-else>
                                <button class="btn btn-default" disabled=""><i class="fa fa-refresh fa-spin"></i></button>
                            </span>
                        </span>
                       
                    </a>
                </li>
                <li class="active">            
                    <a href="#"><span>                  
                        {{ $session.get('auth')['fname'] }}
                        {{ $session.get('auth')['lname'] }}
                    </span></a>
                </li>
            </ul>
        </div>

        <!-- Modal -->
        <div id="mobileloginmodal" class="modal fade" role="dialog" data-backdrop="false">
            <div class="modal-dialog modal-sm">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Do you want to clock <span v-if="mobiletime.msg">out</span><span v-else>in</span> now?</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12 col-xs-12 text-center" style="margin-bottom: 10px;">
                                <h4>Time now: {{ toHumanTime(nowtime) }}</h4> 
                                <strong v-if="mobiletime.msg">Clocked in at <span class="text-success">12:00 PM</span><br>Shift end: <span>{{ toHumanTime(mobiletime.msg.shift_out) }}</span></strong>                
                                <strong v-else class="text-warning">Not yet clocked in</strong>                
                            </div>                            
                            <div class="col-lg-6 col-xs-6 text-center">
                                <button class="btn btn-default" data-dismiss="modal"> No</button>                                
                                <!-- <button type="button" @click="checkclockedin"> Clocked in</button>                                 -->
                            </div>
                            <div class="col-lg-6 col-xs-6 text-center">
                                <button class="btn btn-danger" @click="weblogin('Timed Out')" v-if="mobiletime.msg"> Time out</button>
                                <button class="btn btn-success" @click="weblogin('Timed In')" v-else> Time in</button>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div> -->
                </div>

            </div>
        </div>

    </nav>
</template>

<script>
    export default {

        notifications: {
            toastr: {
                timeout: 2500,
                title: '',
                message: '',
                type: 'success',                
            }
        },

        data(){
            return {
                mobiletime: '',
                nowdate: new Date(),
                nowtime: '',

                index_time_loading: true,
                create_time_loading: false,
            }
        },

        created(){
            if(this.$session.get('bundee').includes(1003)){
                this.checkclockedin();
            }            

            // setInterval(function(){
            //         let thisdate = new Date();
            //         this.nowtime = thisdate.getHours()+':'+thisdate.getMinutes()+':'+thisdate.getSeconds();
            //         console.log(this.nowtime);
            // }, 1000);

            const self = this;
                let timee = '';
                setInterval(() => {
                    let thisdate = new Date();
                    self.nowtime = thisdate.getHours()+':'+thisdate.getMinutes()+':'+thisdate.getSeconds();
                }, 1000);
        },

        methods: {
            logout () {
                this.toastr({ message: 'Please wait', title: 'Logout', type: 'info' })
                let r = this.axiosRequest ('POST', this.$store.state.authentication_api + 'logout', { user_id: this.$session.get('auth')['user_id'] } ,this.$session.get('headers'));
                r.then(res => {
                    if (res.data.status != "failed") {
                        this.$session.destroy();
                        this.toastr({ message: 'Logout successful', title: 'Logout', type: 'success' })
                        this.redirect('login', { tenant: this.$route.params.tenant });
                    }
                })
                .catch(err => {
                    console.log(err)
                });
            },

            weblogin(timedata){
                this.create_time_loading = true;
                let date = new Date();
                let time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();                        
                // alert(timedata+' at' +' "'+time+'"');

                let params = {
                    user_id: this.$session.get('auth')['user_id'],
                    date: date,
                    time: time,
                    reference: 'mobile'
                }
                this.axiosRequest('POST', this.$store.state.clock_api + '/time-entry-using-app-kiosk', params ,this.$session.get('headers'))
                .then(res => {
                    this.checkclockedin();
                    this.toastr({ message: timedata, title: 'Mobile', type: 'success' })
                    $('#mobileloginmodal').modal('toggle');
                    this.create_time_loading = false;
                    // window.location.reload();
                })
                .catch(err => console.log(err));
            },

            checkclockedin(){
                this.axiosRequest('POST', this.$store.state.clock_api + '/checkclockedin/'+this.$session.get('auth')['user_id'], { date: new Date() } ,this.$session.get('headers'))
                .then(res => {
                    this.mobiletime = res.data;
                    this.index_time_loading = false;
                })
                .catch(err => console.log(err));
            },

        },
    }
</script>