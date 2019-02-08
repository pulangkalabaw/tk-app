<template>
    <div class="main__cont">
        <!-- heading start -->
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>Time Info</li>
                <li class="active">Approvees</li>
            </ol>
        </div>
        <!-- heading end -->

        <!-- template start -->
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <!-- panel heading start -->
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    Approvees
                                    <span v-if="index_employees_loading">
                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                    </span>
                                </h3>
                            </div>
                            <!-- panel heading end -->

                            <!-- panel body start -->
                            <div class="panel-body">

                                <!-- nav tab start -->
                                <div v-if="!index_employees_loading">

                                    <ul class="nav nav-tabs">
                                        <li class="active">
                                            <a data-toggle="tab" href="#allTab">
                                                All
                                            </a>
                                        </li>
                                    </ul>

                                </div>
                                <!-- nav tab end -->

                                <!-- tab contents start -->
                                <div class="tab-content">
                                    <div id="allTab" class="tab-pane fade in active">
                                        <div v-if="!index_employees_loading">
                                            <table class="table table-hover display dtapprovee">
                                                <!-- table header start -->
                                                <thead>
                                                    <tr>
                                                        <th>Full Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Location</th>
                                                        <th>Contact</th>
                                                    </tr>
                                                </thead>
                                                <!-- table header end -->

                                                <!-- table body start -->
                                                <tbody>
                                                    <tr v-for="approvee in approver" v-bind:key="approvee.user_id" @click="redirect('profile.approvee', { tenant: $route.params.tenant, id: approvee.user_id })">
                                                        <td>{{ approvee.fname + " " + approvee.lname }}</td>
                                                        <td>{{ approvee.email }}</td>
                                                        <td v-for="(role, index) in approvee.role" v-bind:key="role.id">
                                                            {{ role }}
                                                            <span v-if="index != approvee.role.length -1">
                                                                <b>, </b>
                                                            </span>
                                                        </td>
                                                        <td>{{ approvee.location }}</td>
                                                        <td>{{ approvee.cell_num }}</td>
                                                    </tr>
                                                </tbody>
                                                <!-- table body end -->
                                            </table>
                                        </div>
                                        <div v-else>
                                            Loading please wait..
                                        </div>

                                    </div>
                                </div>
                                <!-- tab contents end -->

                            </div>
                            <!-- panel body end -->

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- template end -->

    </div>
</template>

<script>
export default {
    data () {
        return {
            approver: [],
            index_employees_loading: true,
        }
    },

    // life cycle hooks start
    created () {
        this.showApproverEmployee()
        /* this.init() */
    },

    updated () {
        if (this.approver.length != 0) {
            if (!$.fn.dataTable.isDataTable( '.dtapprovee' )) {
                $('.dtapprovee').DataTable({ ordering: true });
            }
        }
    },
    // life cycle hooks end

    computed: {
        count () {
            return this.index_employees_loading
        }
    },

    watch: {
        count: function (val) {
            if (this.approver.length != 0) {
                if (!$.fn.dataTable.isDataTable( '.dtapprovee' )) {
                    $('.dtapprovee').DataTable({ ordering: true });
                }
            }
        }
    },

    methods: {
        // GET Approvee
        showApproverEmployee () {
            this.index_employees_loading = true
            this.axiosRequest('GET', this.$store.state.application_api+'/user/approver/'+this.$session.get('auth')['user_id'], null, this.$session.get('headers'))
            .then(res => {
                this.approver = res.data.msg
                this.index_employees_loading = false
                console.log(this.approver)
            })
            .catch(err => console.log(err))
        }

    }
}
</script>
