<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>Administrator</li>
                <li class="active">Subscription</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- START of Content here -->

                <!-- General Settings -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-info">
                            <div class="panel-heading">
                                <h3 class="panel-title">Subscription Details</h3>
                            </div>
                            <div class="panel-body">
                                <!-- inside general settings -->
                                <div class="row" v-if="subscription">
                                    <div class="col-md-12">

                                        <div class="row">
                                            <div class="col-md-4 col-md-offset-4">
                                                <h3 class="text-center">Your Subscription Details</h3>    
                                                <br><br>                                            
                                            </div>
                                            <div class="col-md-2 col-md-offset-5">
                                                <div v-if="$session.get('auth')['company_image'] == 'Company-Photo.png'">
                                                    <img :src="$store.state.image_url + $session.get('auth')['company_image']" alt="" style="width:100%;">
                                                </div>
                                                <div v-else>
                                                    <img :src="$store.state.image_url + $route.params.tenant +'/images/company/' + $session.get('auth')['company_image']" alt="" style="width:100%;">                        
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-md-offset-4 text-center">
                                                <br>
                                                <p>{{ subscription.owner_email }}</p>
                                                <p>{{ subscription.expires_at }}</p>
                                                <h4>{{ subscription.subscription_type.toUpperCase() }}</h4>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-4 col-md-offset-4 text-center">
                                                <br>
                                                <button class="btn btn-primary">Change Subscription Plan</button><br><br>
                                                <a href="" style="text-decoration: underline;">Learn more about subscription plan</a>
                                            </div>
                                        </div>
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
            subscription: '',
        }
    },

    created(){
        this.getSubscription();
    },

    methods:{

        getSubscription(){

            this.axiosRequest('get', this.$store.state.application_api+'/subscription/' + this.$session.get('auth')['company_id'] , null, this.$session.get('headers'))
            .then(res => {
                this.subscription = res.data.msg;
            })
            .catch(err => console.log(err))

        },

    },
}

</script>