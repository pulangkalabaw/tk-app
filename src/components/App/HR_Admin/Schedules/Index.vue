<template>
    <div class="main__cont">
        <div>
            <div class="main-heading">
                <ol class="breadcrumb">
                    <li><a style="cursor: pointer;" @click="redirect( 'dashboard', { tenant: $route.params.tenant})">HR Administrator</a></li>
                    <li><a style="cursor: pointer;" @click="redirect( 'employees.index', { tenant: $route.params.tenant})">Schedule</a></li>
                    <!-- <li>
                        <span class='fa fa-spinner fa-spin'></span> 
                    </li> -->
                </ol>
            </div>
            <div class="container-fluid half-padding">
                <div class="template template__blank">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="panel panel-danger">
                                <div class="panel-heading">
                                    <h3 class="panel-title">Employees 
                                        <span v-if="loading" class='fa fa-circle-o-notch' :class="{ 'fa-spin': loading }"></span> </h3>
                                </div>
                                <div class="panel-body" v-if="employee_schedule">

                                 <div class="row">
                                    <div class="col-md-12">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Employee</th>
                                                    <th>Schedule name</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="employee_schedule.length != 0">
                                                <tr v-for="es in employee_schedule">
                                                    <td @click="redirect('employees.show', { tenant: $route.params.tenant, id: es.profile[0].user_id })">
                                                        {{ es.profile[0].fname }}
                                                        {{ es.profile[0].lname }}
                                                        {{ es.profile[0].mname }}
                                                    </td>
                                                    <td @click="redirect('schedules.show', { tenant: $route.params.tenant, id: es.schedule[0].sched_id })">
                                                        {{ es.schedule[0].sched_name }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody v-else>
                                                <tr>
                                                    <td colspan="2" class="text-center">
                                                        No data
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
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
                loading: true,
                employee_schedule: '',
            }
        },

        created () {
            this.getEmployeeSchedule();
        },

        methods: {
            getEmployeeSchedule () {
                this.loading = true
                let r = this.axiosRequest('GET', this.$store.state.application_api + '/employee_schedule', null, this.$session.get('headers'))
                r.then(res => {
                    this.loading = false
                    this.employee_schedule = res.data.msg
                })
                r.catch(err => {
                    console.log(err)
                })

            },
        },


    }
</script>