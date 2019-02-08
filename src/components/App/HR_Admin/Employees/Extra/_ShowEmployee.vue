<template>
    <div class="panel panel-default">
        <div class="panel-heading">
            <div class="panel-title" v-if="!profile">
                <label class="text-left">Employees</label>
                <label class="pull-right">
                    <label class="btn btn-xs btn-default" @click="redirect('employees.edit', { tenant: $route.params.tenant, id: $store.state.employee.users.user_id })"><span data-toggle="tooltip" title="Edit" class='fa fa-edit fa-active'></span></label>
                </label>
            </div>
            <div class="panel-title" v-else>
                <label class="text-left">Profile</label>
            </div>
        </div>
        <!--  <div class="panel-body">
            <div class="container-fluid float-left">
                <div class="row">
                    
                    <div class="col-md-3">
                        <center>
                            <img :src="$store.state.image_url + $store.state.employee.users.image" alt="" width="90%">
                        </center>
                    </div>
                    <div class="col-md-9">
                        <table width="100%">
                            <tbody>
                                <tr>
                                    <td width="25%">Fullname: </td>
                                    <td width="75%">{{ fullname }}</td>
                                </tr>
                                <tr>
                                    <td width="25%">Email: </td>
                                    <td width="75%">{{ $store.state.employee.email }}</td>
                                </tr>
                                <tr>
                                    <td width="25%">Contact number: </td>
                                    <td width="75%">
                                        <label v-if="$store.state.employee.users.cell_num">{{ $store.state.employee.users.cell_num }}</label>
                                        <label v-else>None</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="25%">Word location: </td>
                                    <td width="75%">
                                        <label><span v-for="emp in $store.state.employee.user_branch">{{ emp.branch }}, </span></label>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="25%">Bundee: </td>
                                    <td width="75%">
                                        <label v-for="branch in $store.state.employee.user_branch">
                                            <span v-for="bun in branch.bundee">{{ bun.time_tracking }}, </span>
                                        </label>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="25%">Employee #: </td>
                                    <td width="75%">{{ $store.state.employee.emp_num }}</td>
                                </tr>
                                <tr>
                                    <td width="25%">Approver: </td>
                                    <td width="75%">
                                        <label v-if="$store.state.employee.reports_to.length != 0">{{ $store.state.employee.reports_to[0].fname+' '+$store.state.employee.reports_to[0].lname }}</label>
                                        <label v-else>none</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="25%">Roles: </td>
                                    <td width="75%">
                                        <label v-for="emp in $store.state.employee.user_role">{{ emp.role }}</label>
                                    </td>
                                </tr>
                            </tbody>                                        
                        </table>
                    </div>
                </div>

            </div>
        </div> -->
        <div class="panel-body">
            <span class='fa' :class="$store.state.page_load_icon"></span> 
        </div>
    </div>

</template>

<script>

    export default {
        props: ['profile'],

        computed: {
            fullname: function() {
                return this.$store.state.employee.users.fname + ' ' + this.$store.state.employee.users.lname;
            },
        },

        data () {
            return {
                employee: {},
            }
        },

        created (){
            this.getEmployee();
        },

        methods: {

            getEmployee(){
                this.$store.state.loading = true
                this.$store.state.notif = { message: 'Loading please wait', style: 'alert-info', icon: 'fa-circle-o-notch fa-spin' }
                let user_id;
                if (this.profile == true) {
                    user_id = this.$session.get('auth')['user']['user_id']
                }
                else {
                    user_id = this.$route.params.id
                }
                this.axiosRequest('get', this.$store.state.application_api+'/employee/' + user_id, null, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status != "failed"){
                        this.$store.state.loading = false
                        this.employee = res.data.msg[0]
                    }
                    else{
                        this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                    }
                })
                .catch(err => {
                    this.notif = { message: 'Something went wrong - Please try again', style: 'alert-warning', icon: 'fa-warning' }
                    this.$store.state.loading = false
                })
            },

        }
    }

</script>