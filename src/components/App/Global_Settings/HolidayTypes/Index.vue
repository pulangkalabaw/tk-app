<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li class="active">Holiday Types Settings</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- Start of content here -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">Holiday Types Settings
                                    <span v-if="index_holiday_types_loading">
                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                    </span>
                                    <span v-else @click="reloadHolidayTypes()">
                                        <span class='fa fa-refresh' data-toggle="tooltip" title="Refresh data"></span>
                                    </span>
                                </h3>
                            </div>
                            <div class="panel-body" v-if="!index_holiday_types_loading">

                                <!-- nav-tabs -->
                                <ul class="nav nav-tabs">
                                    <li class="active">
                                        <a data-toggle="tab" href="#pendingTab">
                                            All
                                            <span v-if="!index_holiday_types_loading">
                                                <span class="label">{{ $store.state.all_holiday_types.length }}</span>
                                            </span> 
                                        </a>
                                    </li>
                                    <li>
                                        <a data-toggle="tab" href="#newTab">New</a>
                                    </li>
                                </ul>
                                <!-- ./nav-tabs -->

                                <!-- tab-content -->
                                <div class="tab-content">                                   

                                    <!-- Holidays -->
                                    <div id="pendingTab" class="tab-pane fade in active">
                                        <table class="table table-hover table-sortable dtht">
                                            <thead>
                                                <tr>
                                                    <th>Holiday Name</th>
                                                    <th>Holiday Code</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="$store.state.all_holiday_types.length != 0">
                                                <tr v-for="ht in $store.state.all_holiday_types">
                                                    <td>
                                                        <a @click="redirect('holiday_types.edit', { tenant: $route.params.tenant, id: ht.id })">
                                                            {{ ht.holiday_type_name }}
                                                        </a>
                                                    </td>
                                                    <td>{{ ht.holiday_type_code }}</td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <tr>
                                                    <td colspan="2" class="text-center">No data</td>
                                                </tr>
                                            </tbody>

                                        </table>

                                    </div>
                                    <!-- ./Holidays -->

                                    <!-- New -->
                                    <div id="newTab" class="tab-pane fade">
                                        <div class="row">

                                            <notif :notif="notif"></notif>

                                            <form action="" v-on:submit.prevent="addHolidayTypes()">
                                                <div class="col-md-6">                                 
                                                    <div>
                                                        <div class="col-md-3">
                                                            <label for=""><strong>Holiday Name</strong></label>
                                                        </div>
                                                        <div class="col-md-9">
                                                            <input type="text" v-model="create_holiday_types.holiday_type_name" class="form-control" required="">  
                                                        </div>
                                                        <div class="clearfix"></div><br>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div>

                                                <div class="col-md-6">                                 
                                                    <div>
                                                        <div class="col-md-3">
                                                            <label for=""><strong>Holiday Code</strong></label>
                                                        </div>
                                                        <div class="col-md-9">
                                                            <input type="text" v-model="create_holiday_types.holiday_type_code" class="form-control" required="">  
                                                        </div>
                                                        <div class="clearfix"></div><br>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div>

                                                <div class="col-md-6">                                 
                                                    <div>
                                                        <div class="col-md-3">
                                                        </div>
                                                        <div class="col-md-9 text-right">
                                                            <button class="btn btn-primary btn-xs" :disabled="create_holidays_loading">
                                                                Submit <span class='fa fa-plus-circle'></span>
                                                            </button>
                                                            <span v-if="create_holidays_loading">
                                                                <span class='fa fa-refresh fa-spin'></span> 
                                                            </span>
                                                        </div>
                                                        <div class="clearfix"></div><br>
                                                    </div>
                                                </div>


                                            </form>
                                        </div>
                                    </div>
                                    <!-- ./New -->

                                </div>
                                <!-- ./tab-content -->
                            </div>
                            <div class="panel-body" v-else>
                                Loading please wait..
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

        data(){
            return {
                index_holiday_types_loading: true,
                create_holidays_loading: false,
                create_holiday_types: {},
                notif: '',
            }
        },

        created(){
            this.init()
        },

        computed: {
            holidayTick () {
                return this.index_holiday_types_loading
            },
        },

        updated () {
            if (this.$store.state.all_holiday_types.length != 0) {
                if (!$.fn.dataTable.isDataTable('.dtht')) {
                    $('.dtht').dataTable({ ordering: true  });
                }
            }
        },

        watch: {
            holidayTick: function() {
                if (this.$store.state.all_holiday_types.length != 0) {
                    if (!$.fn.dataTable.isDataTable('.dtht')) {
                        $('.dtht').dataTable({ ordering: true  });
                    }
                }
            },

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

            reloadHolidayTypes () {
                this.$store.state.all_holiday_types = [];
                this.init();
            },


            async init () {

                this.index_holiday_types_loading = true

                var requests = [];
                if (this.$store.state.all_holiday_types.length == 0) {
                    requests['getHolidayTypes'] = this.getHolidayTypes()
                }
                else {
                    this.index_holiday_types_loading = false;
                }

                try {

                    const result = await Promise.all([requests])
                    .then(val => {
                        const getHolidayTypes = val[0]['getHolidayTypes'];

                        if (typeof getHolidayTypes !== 'undefined') {
                            getHolidayTypes.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_holiday_types = res.data.msg
                                }
                                this.index_holiday_types_loading = false
                            })
                        }
                    });

                }
                catch (e) {
                    console.log(e)
                }
            },

            addHolidayTypes() {

                this.create_holidays_loading = true

                let params = {
                    holiday_type_name: this.create_holiday_types.holiday_type_name,
                    holiday_type_code: this.create_holiday_types.holiday_type_code,
                }

                this.axiosRequest('post', this.$store.state.application_api + '/holiday-type', params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ title: 'Holiday Types Settings', message: 'Added new holiday type' })
                        this.notif = ''
                        this.reloadHolidayTypes()
                    }
                    else{
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }
                    console.log(res)
                    this.create_holidays_loading = false
                })
                .catch(err => console.log(err))

            }

        }

    }



</script>