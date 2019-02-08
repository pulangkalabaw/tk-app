<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Employees</label></li>
                <li class="active">Summary Report</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank"> 
                <div class="col-md-12">
                    <div class="panel panel-danger">
                        <div class="panel-heading">
                            <h3 class="panel-title">
                                Summary 
                                <span v-if="summary_loading">
                                    <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                </span>
                            </h3>
                        </div>
                        <div class="panel-body" >

                            <div class="row">

                                <form @submit.prevent ="fetchdata()" method="GET">
                                    <div class='col-md-7'> 
                                        <a class=" btn btn-success" :disabled="summary_loading" :href="excel_download_link" target="_blank" download="">Download</a>
                                    </div>

                                    <div class='col-md-2'>
                                        <input class="form-control text-left" :disabled="summary_loading" v-model='date_start' type="date">
                                    </div>
                                    <div class='col-md-2'> 
                                        <input class="form-control" :disabled="summary_loading" v-model='date_end' type="date">
                                    </div>
                                    <div class='col-md-1'> 
                                       
                                        
                                        <button :disabled="summary_loading" class="btn btn-success btn-xs ">Submit</button>
                                    </div>

                                </form>

                            </div>

                            <br>
                            <span v-if="summary_loading">
                               Loading please wait...
                           </span>
                           
                           <div v-else class="scrollable scrollbar-macosx">
                            <!-- TABS NAV -->
                            <div class="tab-content">
                                <div id="locTab" class="tab-pane fade in active">
                                    <table class="table table-hover table-sortable dtlocations">
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Late</th>
                                                <th>Undertime</th>
                                                <th>Accumulated</th>
                                                <th>Overtime</th>
                                                <th>Leave</th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="datas.length != 0">
                                            <tr v-for="data in datas">
                                                <td>{{data.email}}</td>
                                                <td>{{data.late}}</td>
                                                <td>{{data.undertime}}</td>
                                                <td>{{data.accumulated}}</td>
                                                <td>{{data.overtime}}</td>
                                                <td>{{data.leave}}</td>

                                            </tr>
                                        </tbody>
                                        <tbody v-else>
                                            <tr>
                                                <td colspan="5" class="text-center">
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
</template>
<script>
import Vue from "vue";
import JsonExcel from "vue-json-excel";

Vue.component("downloadExcel", JsonExcel);

export default {

    data () {
        return {
            datas:'',
            date_start:'',
            date_end:'',
            date:'',
            summary_loading:true,
            json_meta: [[{ key: "charset", value: "utf-8" }]],
            json_fields: {
                "Email": "email",
                "Employee Number": "emp_num",
                "Late": "late",
                "Undertime": "undertime",
                "Overtime": "overtime",
                "Leave in Hours":"leave",
                "Leave in Days":"leave_days"
            }
        }
    },


    created () {
        this.fetchdata()
        this.getDate()

    },
    computed:{
        excel_download_link: function() {

            let filename = this.$session.get('auth')['company_name']+'-from-'+this.date_start+'-to-'+this.date_end+'-summary-record' 
            return this.$store.state.excel + '/download-summary-report?summary=' + JSON.stringify(this.datas) + '&filename=' + filename;
        }
    },


    methods: {
        fetchdata(){
            this.summary_loading = true
            this.axiosRequest('GET',this.$store.state.excel + '/summary-report?date_start='+this.date_start+'&date_end='+this.date_end,null,this.$session.get('headers'))
            .then(res => {
                this.datas = res.data.msg.result
                this.date_start = res.data.msg.date_start
                this.date_end = res.data.msg.date_end
                this.summary_loading = false
            })
            .catch(err => {

            })
        },
        getDate () {
          const toTwoDigits = num => num < 10 ? '0' + num : num;
          let today = new Date();
          let year = today.getFullYear();
          let month = toTwoDigits(today.getMonth() + 1);
          let day = toTwoDigits(today.getDate());
          this.date = `${year}-${month}-${day}`;
      }






  },

}

</script>