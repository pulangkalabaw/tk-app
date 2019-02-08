<template>
    <div>
        <div class="row" v-if="!pie_loading">   
            <div class="col-md-6">  
                <b>Todays logged in</b><br>
                <vc-donut background="white" foreground="grey":size="200" unit="px" :thickness="30"hasLegend legendPlacement="left":sections="sections" :total="totalPercentage"> <h3>Total: {{ total }}</h3> </vc-donut> 
            </div>
            <div class="col-md-6">
                <b>Employee's Bundee</b><br>
                <br>
                <ul class="nav nav-tabs">
                    <li :class="{ 'active': index == 0}"  v-for="(employee, index) in employees">
                        <a data-toggle="tab" :href="'#' + employee.bundee">{{ showBundeeName(employee.bundee) }} <span class="label">{{ employee.employee.length }}</span></a>
                    </li>
                </ul>
                <!-- TABS CONTENT -->
                <div class="tab-content">
                    <div :id="employee.bundee" class="tab-pane fade" :class="{ 'in active ': index == 0}" v-for="(employee, index) in employees">
                        <table class="table table-hovered table-striped" :class="'a' +employee.bundee" width="100%">
                            <thead>
                                <tr>
                                    <td>Employee name</td>
                                </tr>
                            </thead>
                            <tbody v-for="emp in employee.employee">
                                <tr>
                                    <td>{{ emp.fname + ' ' + emp.lname}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Loading please wait..
        </div>
    </div>
</template>
<script>

    import Vue from 'vue'
    import Donut from 'vue-css-donut-chart';
    import 'vue-css-donut-chart/dist/vcdonut.css';
    Vue.use(Donut);

    export default {
        data() {
            return {
                total: 0,
                totalPercentage: 0,
                pie_loading: true,
                sections: [],
                employees: [],


                // sections: [
                // { label: 'EDTR (' + Math.round(((100 / 850) * 100)) + '%)', value: Math.round(((100 / 850) * 100)), color: '#E7F3EF' }, 
                // { label: 'KIOSK (' + Math.round(((200 / 850) * 100)) + '%)', value: Math.round(((200 / 850) * 100)), color: '#7FBD32' }, 
                // { label: 'WEB LOGIN (' + Math.round(((500 / 850) * 100)) + '%)', value: Math.round(((500 / 850) * 100)), color: '#FDC168' }, 
                // { label: 'MOBILE (' + Math.round(((50 / 850) * 100)) + '%)', value: Math.round(((50 / 850) * 100)), color: '#798EF6' }
                // ]
            };
        },

        computed: {
            employeesTick () {
                return this.pie_loading
            }
        },

        updated () {
            if (!this.pie_loading) {
                this.employees.forEach(function(employee) {
                    if (employee.employee != 0) {
                        if (!$.fn.dataTable.isDataTable('.a' + employee.bundee)) {
                            $('.a' + employee.bundee).DataTable({ ordering: true });
                        }
                    }
                });
            }

        },

        watch: {
            employeesTick: function (val) {
                if (!this.pie_loading) {
                    this.employees.forEach(function(employee) {
                        if (employee.employee != 0) {
                            if (!$.fn.dataTable.isDataTable('.a' + employee.bundee)) {
                                $('.a' + employee.bundee).DataTable({ ordering: true });
                            }
                        }
                    });
                }

            },
        },

        created () {
            this.employeeBundee();
        },

        methods: {
            employeeBundee(type) {
                this.pie_loading = true
                this.axiosRequest('GET', this.$store.state.application_api + '/dashboard-bundeeCount', null, this.$session.get('headers'))
                .then(res => {
                    this.total = res.data.msg.total_count


                    // Employees
                    this.employees = res.data.msg.name


                    let that = this

                    // Total percentage
                    res.data.msg.count.forEach(function(r) {
                        if (that.totalPercentage > 100) {
                            that.totalPercentage = 100
                        }
                        else {
                            that.totalPercentage += parseFloat(Math.round(((r.value / that.total) * 100)))
                        }
                    });

                    // Sections
                    res.data.msg.count.forEach(function(r) {
                        if (r.value > 0) {
                            let color
                            if (r.bundee == "edtr") {
                                color = "#E7F3EF"
                            }
                            else if (r.bundee == "kiosk") {
                                color = "#7FBD32"
                            }
                            else if (r.bundee == "third_party_biometrics") {
                                color = "#FDC168"
                            }
                            else if (r.bundee == "mobile") {
                                color = "#798EF6"
                            }
                            else {
                                color = "#88939C"
                            }
                            that.sections.push({
                                label: r.value + ' ' + that.showBundeeName(r.bundee) + ' (' + ((r.value / that.total) * 100).toFixed(2) + '%)',
                                value: Math.round(((r.value / that.total) * 100)),
                                color: color
                            })
                        }
                    });

                    this.pie_loading = false
                })
                .catch(err => {
                    console.log(err)
                })
            },
        }
    };
</script>
