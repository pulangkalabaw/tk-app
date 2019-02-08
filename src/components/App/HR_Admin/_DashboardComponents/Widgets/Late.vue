<template>
    <div>

        <div class="row">
            <!-- Todays Late -->
            <div class="col-md-12" v-if="!late_loading">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class='fa fa-clock-o'></span> Lates</h3>
                    </div>
                    <div class="panel-body">
                        <span class='fa fa-info-circle'></span> Late summary<br>

                        <div class="col-md-6">
                            <div class="ov-widget">
                                <div class="ov-widget__list">
                                    <div class="ov-widget__item ov-widget__item_dec">
                                        <div class="ov-widget__value">
                                            <h1>Today's late: {{ late.today_late }} minute(s)</h1>
                                        </div>
                                        <div class="ov-widget__info">
                                            <div class="ov-widget__title">in hour(s): {{ (late.today_late / 60).toFixed(2) }}</div>
                                        </div>                                    
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="ov-widget">
                                <div class="ov-widget__list">

                                    <div class="ov-widget__item ov-widget__item_inc">
                                        <div class="ov-widget__value">
                                            This month's late: {{ late.monthly_late }} minute(s)
                                        </div>
                                        <div class="ov-widget__info">
                                            <div class="ov-widget__title">in hour(s): {{ (late.monthly_late / 60).toFixed(2) }}</div>
                                        </div>                                    
                                    </div>


                                </div>
                            </div>
                        </div>

                        <div class="col-md-3">
                            <div class="ov-widget">
                                <div class="ov-widget__list">

                                    <div class="ov-widget__item ov-widget__item_warn">
                                        <div class="ov-widget__value">
                                            This year's late: {{ late.yearly_late }} minute(s)
                                        </div>
                                        <div class="ov-widget__info">
                                            <div class="ov-widget__title">in hour(s): {{ (late.yearly_late / 60).toFixed(2) }}</div>
                                        </div>                                    
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div><hr>


                        <div class="row">
                            <div class="col-md-12">
                                <span class='fa fa-info-circle'></span> Filter late using date range <br>
                                <form method="POST" @submit.prevent="searchResultLate()">
                                    <br>
                                    <div>
                                        <div class="ov-widget">
                                            <div class="ov-widget__list">
                                                <div class="ov-widget__item">
                                                    <div class="ov-widget__value">
                                                        <!-- Search Filter -->
                                                        <div class="col-md-3">
                                                            from<input type="date" v-model="date_start" id="" class="form-control">
                                                        </div>
                                                        <div class="col-md-3">
                                                            to<input type="date" v-model="date_end" id="" class="form-control">
                                                        </div>
                                                        <div class="col-md-2">
                                                            <br>
                                                            <button class="btn btn-sm btn-primary">Search <span class='fa fa-search'></span> </button>
                                                        </div>
                                                        <div class="clearfix"></div><br>
                                                        <div class="col-md-12 text-sm">
                                                            Search result: 
                                                            {{ search_result_late }} 
                                                            <span v-if="(typeof search_result_late) == 'number'">
                                                                <small>minute(s), equivalent hour(s) of </small>
                                                                {{ (search_result_late / 60).toFixed(2) }}
                                                                <!-- <small> in hour(s)</small> -->
                                                            </span>
                                                        </div>
                                                        <!-- ./Search Filter -->


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>    
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-md-12" v-else>
                Loading please wait..
            </div>
            <!-- ./Todays Late -->


        </div>
    </div>
</template>
<script>
    export default {
        props: ['user_id'],

        data () {
            return {
                late_loading: true,
                late: [],
                date_start: '',
                date_end: '',
                search_result_late: '-',
                search_result_late_loading: false
            }
        },

        created () {
            this.init();
        },

        methods: {
            async init () {
                var requests = [];

                if (this.late.length == 0) {
                    requests['showLate'] = this.showLate()
                }

                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        const showLate = val[0]['showLate'];

                        if (typeof showLate !== 'undefined') {
                            showLate.then(res => {
                                if(res.data.status != "failed"){
                                    this.late = res.data.msg
                                    this.late_loading = false
                                }
                                else{
                                    this.notif = { message: res.data.msg, style: 'alert-warning', icon: 'fa-warning' }
                                }
                            }).catch(err => console.log(err))
                        }


                    });

                }
                catch (e) {
                    console.log(e)
                }
            },

            showLate () {
                this.late_loading = true
                return this.axiosRequest('GET', this.$store.state.application_api+'/dashboard-daterange/' + this.user_id, null, this.$session.get('headers'))
            },

            searchResultLate() {
                if (this.date_start == '' || this.date_end == '') {
                    alert("Please input date start and date end to filter")
                }
                else {
                    this.search_result_late_loading = true
                    this.search_result_late = "Loading please wait.."

                    let route = this.$store.state.application_api+'/dashboard-daterange/' + this.user_id + '?date_start=' + this.date_start + '&date_end=' + this.date_end
                    let r = this.axiosRequest('GET', route, null, this.$session.get('headers'))
                    r.then(res => {
                        if (res.data.status != "failed") {
                            this.search_result_late = res.data.msg.late // late and undertime
                        }
                        else {
                            this.search_result_late = "-"
                        }
                        this.search_result_late_loading = false
                    })
                    .catch(err => console.log(err))
                }

            },
        }
    }
</script>