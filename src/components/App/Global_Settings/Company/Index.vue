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
                                    <h3 class="panel-title">General Settings
                                        <span v-if="company_loading">
                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                        </span>
                                    </h3>
                                </label>
                                <label class="pull-right">
                                    <label class="btn btn-xs btn-default" @click="redirect('company.edit', { tenant: $route.params.tenant})"><span class='fa fa-edit fa-active'></span></label>
                                </label>
                            </div>
                            <div class="panel-body">
                                <!-- inside general settings -->
                                <div class="row" v-if="company_loading == false">
                                    <div class="col-md-12">

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
                                            </div>
                                            <div class="col-md-5">
                                                <h1>{{ $session.get('auth')['company_name'] }}</h1>
                                                <span v-if="company_loading == false">
                                                    <h4>
                                                        <span v-if="company.email">Email: {{ company.email }}</span><span v-else>No email company set</span>
                                                    </h4>
                                                    <h5>
                                                        <span v-if="company.business_type">Business type: {{ company.business_type }}</span><span v-else>No business type set</span>
                                                    </h5>
                                                </span>
                                                <p v-if="company.address">Address: {{ company.address }}</p><span v-else>No address yet</span>
                                            </div>
                                        </div>
                                        <!-- <h1>Making it better. We'll back soon!</h1> -->

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

    export default {

        data () {
            return {
                company: '',
                notif: '',

            // loadings
            company_loading: true,
        }
    },

    created(){
        this.getCompanyDetails();
    },

    methods: {

        getCompanyDetails(){

            this.company_loading =  true;
            this.axiosRequest('get', this.$store.state.application_api+'/company/' + this.$session.get('auth')['company_id'], null, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == 'success'){
                    this.company = res.data.msg; 
                    this.company_loading = false;
                }else{
                    this.company_loading = false;
                }
            })
            .catch(err => {console.log(err)})

        }
    }

}

</script>