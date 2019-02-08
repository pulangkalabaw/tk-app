<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li class="active">Leave Types Settings</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <!-- Start of content here -->
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">Leave Types Settings
                                    <span v-if="index_leaves_loading">
                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                    </span>
                                    <span v-else @click="reloadLeaveTypes()">
                                        <span class='fa fa-refresh' data-toggle="tooltip" title="Refresh data"></span>
                                    </span>
                                </h3>
                            </div>
                            <div class="panel-body" v-if="!index_leaves_loading">

                                <!-- nav-tabs -->
                                <ul class="nav nav-tabs">
                                    <li class="active">
                                        <a data-toggle="tab" href="#pendingTab">
                                            All
                                            <span v-if="!index_leaves_loading">
                                                <span class="label">{{ $store.state.all_leave_types.length }}</span>
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
                                        <table class="table table-hover table-sortable dtlt">
                                            <thead>
                                                <tr>
                                                    <th>Leave Name</th>
                                                    <th>Leave Code</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="$store.state.all_leave_types.length != 0">
                                                <tr v-for="lt in $store.state.all_leave_types">
                                                    <td>
                                                        <a @click="redirect('leave_types.edit', { tenant: $route.params.tenant, id: lt.id })">
                                                            {{ lt.leave_name }}
                                                        </a>
                                                    </td>
                                                    <td>{{ lt.leave_code }}</td>
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

                                            <form action="" v-on:submit.prevent="addLeaveTypes()">
                                                <div class="col-md-6">                                 
                                                    <div>
                                                        <div class="col-md-3">
                                                            <label for=""><strong>Leave Name</strong></label>
                                                        </div>
                                                        <div class="col-md-9">
                                                            <input type="text" v-model="create_leave.leave_name" class="form-control" required="">  
                                                        </div>
                                                        <div class="clearfix"></div><br>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div>

                                                <div class="col-md-6">                                 
                                                    <div>
                                                        <div class="col-md-3">
                                                            <label for=""><strong>Leave Code</strong></label>
                                                        </div>
                                                        <div class="col-md-9">
                                                            <input type="text" v-model="create_leave.leave_code" class="form-control" required="">  
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
                                                            <button class="btn btn-primary btn-xs" :disabled="create_leaves_loading">
                                                                Submit <span class='fa fa-plus-circle'></span>
                                                            </button>
                                                            <span v-if="create_leaves_loading">
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
                index_leaves_loading: true,
                create_leaves_loading: false,
                create_leave: {},
                notif: '',
            }
        },

        created(){
            this.init()
        },

        computed: {
            leavesTick () {
                return this.index_leaves_loading
            },
        },

        updated () {
            if (this.$store.state.all_leave_types.length != 0) {
                if (!$.fn.dataTable.isDataTable('.dtlt')) {
                    $('.dtlt').dataTable({ ordering: true  });
                }
            }
        },

        watch: {
            leavesTick: function() {
                if (this.$store.state.all_leave_types.length != 0) {
                    if (!$.fn.dataTable.isDataTable('.dtlt')) {
                        $('.dtlt').dataTable({ ordering: true  });
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

            reloadLeaveTypes () {
                this.$store.state.all_leave_types = [];
                this.init();
            },


            async init () {

                this.index_leaves_loading = true

                var requests = [];
                if (this.$store.state.all_leave_types.length == 0) {
                    requests['getLeaveTypes'] = this.getLeaveTypes()
                }
                else {
                    this.index_leaves_loading = false;
                }

                try {

                    const result = await Promise.all([requests])
                    .then(val => {
                        const getLeaveTypes = val[0]['getLeaveTypes'];

                        if (typeof getLeaveTypes !== 'undefined') {
                            getLeaveTypes.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_leave_types = res.data.msg
                                }
                                this.index_leaves_loading = false
                            })
                        }
                    });

                }
                catch (e) {
                    console.log(e)
                }
            },

            addLeaveTypes() {

                this.create_leaves_loading = true

                let params = {
                    leave_name: this.create_leave.leave_name,
                    leave_code: this.create_leave.leave_code,
                }

                this.axiosRequest('post', this.$store.state.application_api + '/leave', params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ title: 'Leave Types Settings', message: 'Added new leave type' })
                        this.notif = ''
                        this.reloadLeaveTypes()
                    }
                    else{
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }
                    console.log(res)
                    this.create_leaves_loading = false
                })
                .catch(err => console.log(err))

            }


        }

    }



</script>