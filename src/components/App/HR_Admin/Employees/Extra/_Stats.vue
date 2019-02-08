<template>
    <div>
        <div class="row">
            <!-- right column -->
            <div class="col-md-4" v-if="!stats_loading">
                <div class="panel panel-danger">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class='fa fa-clock-o'></span> Lates</h3>
                    </div>
                    <div class="panel-body">
                        <div class="ov-widget">
                            <div class="ov-widget__list">
                                <div class="ov-widget__item ov-widget__item_inc">
                                    <div class="ov-widget__value">{{ (stats.today_late / 60).toFixed(2) }} <label class="txt-sm">{{ stats.today_late }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total late hours today</div>                                  
                                    </div>
                                </div>
                                <div class="ov-widget__item ov-widget__item_dec">
                                    <div class="ov-widget__value">{{ (stats.monthly_late / 60).toFixed(2) }} <label class="txt-sm">{{ stats.monthly_late }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total late hours this month</div>
                                    </div>
                                </div>
                                <div class="ov-widget__item ov-widget__item_warn">
                                    <div class="ov-widget__value">{{ (stats.yearly_late / 60).toFixed(2) }} <label class="txt-sm">{{ stats.yearly_late }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total late hours this year</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- end of right column -->

            <!-- right column -->
            <div class="col-md-4" v-if="!stats_loading">
                <div class="panel panel-warning">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class='fa fa-clock-o'></span> Undertime</h3>
                    </div>
                    <div class="panel-body">
                        <div class="ov-widget">
                            <div class="ov-widget__list">
                                <div class="ov-widget__item ov-widget__item_inc">
                                    <div class="ov-widget__value">{{ (stats.today_undertime / 60).toFixed(2) }} <label class="txt-sm">{{ stats.today_undertime }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total undertime hours today</div>                                  
                                    </div>
                                </div>
                                <div class="ov-widget__item ov-widget__item_dec">
                                    <div class="ov-widget__value">{{ (stats.monthly_undertime / 60).toFixed(2) }} <label class="txt-sm">{{ stats.monthly_undertime }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total undertime hours this month</div>
                                    </div>
                                </div>
                                <div class="ov-widget__item ov-widget__item_warn">
                                    <div class="ov-widget__value">{{ (stats.yearly_undertime / 60).toFixed(2) }} <label class="txt-sm">{{ stats.yearly_undertime }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total undertime hours this year</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- end of right column -->

            <!-- right column -->
            <div class="col-md-4" v-if="!stats_loading">
                <div class="panel panel-primary">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class='fa fa-clock-o'></span> Accumulated</h3>
                    </div>
                    <div class="panel-body">
                        <div class="ov-widget">
                            <div class="ov-widget__list">
                                <div class="ov-widget__item ov-widget__item_inc">
                                    <div class="ov-widget__value">{{ (stats.today_accumulated / 60).toFixed(2) }} <label class="txt-sm">{{ stats.today_accumulated }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total accumulated hours today</div>                                  
                                    </div>
                                </div>
                                <div class="ov-widget__item ov-widget__item_dec">
                                    <div class="ov-widget__value">{{ (stats.monthly_accumulated / 60).toFixed(2) }} <label class="txt-sm">{{ stats.monthly_accumulated }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total accumulated hours this month</div>
                                    </div>
                                </div>
                                <div class="ov-widget__item ov-widget__item_warn">
                                    <div class="ov-widget__value">{{ (stats.yearly_accumulated / 60).toFixed(2) }} <label class="txt-sm">{{ stats.yearly_accumulated }} minute(s)</label></div>
                                    <div class="ov-widget__info">
                                        <div class="ov-widget__title">Total accumulated hours this year</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <!-- end of right column -->
        </div>
    </div>
</template>
<script>
    export default {
        props: ['user_id'],

        data () {
            return {
                stats_loading: true,
                stats: [],
            }
        },

        created () {
            this.init();
        },

        methods: {
            async init () {
                var requests = [];
                
                if (this.stats.length == 0) {
                    requests['showStats'] = this.showStats()
                }

                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        const showStats = val[0]['showStats'];

                        if (typeof showStats !== 'undefined') {
                            showStats.then(res => {
                                if(res.data.status != "failed"){
                                    this.stats = res.data.msg
                                    this.stats_loading = false
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

            showStats () {
                this.stats_loading = true
                return this.axiosRequest('GET', this.$store.state.application_api+'/dashboard/' + this.user_id, null, this.$session.get('headers'))
            },
        }
    }
</script>