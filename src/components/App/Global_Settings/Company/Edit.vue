<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li class="active">Company Settings</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- START of Content here -->

                <!-- General Settings -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading panel_heading">
                                <label class="text-left">
                                    <h3 class="panel-title">General Settings</h3>
                                </label>
                                <label class="pull-right">
                                    <label class="btn btn-xs btn-default" @click="redirect('company.index', { tenant: $route.params.tenant})"><span class='fa fa-eye fa-active'></span></label>
                                </label>
                            </div>
                            <div class="panel-body">
                                <!-- inside general settings -->
                                <div class="row">
                                    <div class="col-md-12">

                                        <!-- start of form -->
                                        <form action="" v-on:submit.prevent="updateCompany()">
                                            <!-- alert -->
                                            <notif :notif="notif"></notif>
                                            <!-- end of alert -->

                                            <div class="row">
                                                <div class="col-md-3">
                                                    <center v-if="company_loading == false">
                                                        <div v-if="company.company_image == 'Company-Photo.png'">
                                                            <img :src="$store.state.image_url + company.company_image" alt="" width="100%">
                                                        </div>
                                                        <div v-else>
                                                            <img :src="$store.state.image_url + $route.params.tenant +'/images/company/' + company.company_image" alt="" width="100%">
                                                        </div>
                                                    </center>
                                                    <br>
                                                    <input type="file" v-on:change="handleImage">
                                                    <small><span class='fa fa-info-circle'></span> image format must be .jpg, .png, .jpeg</small>
                                                </div>
                                                <div class="col-md-5">
                                                    <h3>{{ $session.get('auth')['company_name'] }}</h3>                                                    

                                                    <div class="col-md-2">
                                                        <label for=""><strong>Company Email:</strong></label>
                                                    </div>
                                                    <div class="col-md-10">
                                                        <input type="email" v-model="form.email" class="form-control">
                                                    </div>

                                                    <div class="clearfix"></div><br>
                                                    <div class="col-md-2">
                                                        <label for=""><strong>Business Type:</strong></label>
                                                    </div>
                                                    <div class="col-md-10">
                                                        <input type="text" v-model="form.business_type" class="form-control">
                                                    </div>

                                                    <div class="clearfix"></div><br>                                                    
                                                    <div class="col-md-2">
                                                        <label for=""><strong>Address:</strong></label>
                                                    </div>
                                                    <div class="col-md-10">
                                                        <textarea type="text" v-model="form.address" class="form-control"></textarea>
                                                    </div>

                                                    <div class="clearfix"></div><br>                                                    
                                                    <div class="col-md-12 text-right">
                                                        <span v-if="update_company_loading">
                                                            <span class='fa fa-spin' :class="$store.state.page_load_icon"></span> 
                                                        </span>
                                                        <button class="btn btn-success btn-xs" :disabled="update_company_loading" type="submit"><span class='fa fa-edit'></span> Update changes</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </form> 
                                        <!-- end of form -->
                                    </div>
                                </div>
                                <!-- end of inside of general settings -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End of general settings -->
                <!-- END of content here -->
            </div>
        </div>
    </div>

</template>

<script>

    export default{

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
                company: '',
                form: {},
                image: '',
                company_loading: true,
                update_company_loading: false,
                notif: '',
            }
        },

        created(){
            this.getCompanyDetails();
        },

        methods:{

            handleImage (e){
                const file = e.target.files[0];
                this.image = file;
                this.image_preview = URL.createObjectURL(file);
            },

            getCompanyDetails(){

                this.company_loading =  true;

                this.axiosRequest('get', this.$store.state.application_api+'/company/' + this.$session.get('auth')['company_id'], null, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == 'success'){
                        this.company = res.data.msg; 
                        this.form.email = res.data.msg.email;                                   
                        this.form.business_type = res.data.msg.business_type;                                   
                        this.form.address = res.data.msg.address;                                   
                        this.company_loading = false;
                    }else{
                        this.company_loading = false;                    
                    }
                })
                .catch(err => {console.log(err)})

            },

            updateCompany(){

                this.update_company_loading = true
                var fd = new FormData();
                fd.append('_method', "PUT")                
                fd.append('email', this.form.email)
                fd.append('address', this.form.address)
                fd.append('business_type', this.form.business_type)
                fd.append('company_image', this.image)        

                this.axiosRequest('POST', this.$store.state.application_api+'/company/' + this.$session.get('auth')['company_id'], fd, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == 'success'){
                        this.toastr({ message: res.data.msg, title: 'Company' })                    
                        this.company_loading = false;
                    }else{
                        this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }                    
                        this.company_loading = false;                    
                    }
                    this.update_company_loading = false
                })
                .catch(err => {console.log(err)})

            },

        }

    }

</script>