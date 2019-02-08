<template>
    <div>
        <!-- First Row Graph -->
        <div class="row">
            <div class="col-md-5">
                <b>Top 10 lates</b><br>
                <small><span class='fa fa-info-circle'></span> Data shows top 10 employee's late <b>(by month)</b></small>
                <make-graph :chart-data="top_10_late" :options="options"></make-graph>
                <!-- <h1>Making it better. We'll back soon!</h1> -->
            </div>
        </div>
    </div>
</template>
<script>

    import MakeGraph from '@/components/App/HR_Admin/_DashboardComponents/Graph/MakeGraph.vue'
    export default {
        components: { 'make-graph': MakeGraph },
        props: ['from', 'to', 'fetchResult', "team_id"],

        data () {
            return {
                top_10_late: {
                    label: [],
                    backgroundColor: [],
                    data: [],
                },
                graph_last_update: new Date(),
                options: {
                    responsive: true,
                    maintainAspectRatios: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function(value, index, values) {
                                    return `${value}`;
                                },
                            },
                        }],
                    },
                    tooltips: {
                        enabled: true,
                        callbacks: {
                            label:function (tooltipItems, data) {
                                console.log(data)
                                return tooltipItems.yLabel + " hour(s) late"
                            }
                        }
                    }
                }
            }
        },

        created () {
            this.topTenLates('monthly');
        },


        methods: {

            topTenLates(type) {

                let linkType 
                if (type == "today") {
                    linkType = '/dashboard-topTenlate-today'
                }
                else if (type == "monthly"){
                    linkType = '/dashboard-topTenlate-monthly'
                }
                else {
                    linkType = '/dashboard-topTenlate-yearly'
                }

                this.axiosRequest('GET', this.$store.state.application_api + linkType, null, this.$session.get('headers'))
                .then(res => {
                    var labels = [];
                    var data = [];
                    var bcolor = [];
                    var datasets = {
                        label: [],
                        backgroundColor: [],
                        data: [],
                    };

                    for (let i in res.data.msg['late']) {
                        var bc = '#'+Math.floor(Math.random()*16777215).toString(16);
                        labels.push(res.data.msg['late'][i].fname)
                        data.push((res.data.msg['late'][i].late / 60).toFixed(2))
                        bcolor.push(bc);
                    }

                    this.top_10_late.labels = labels;
                    this.top_10_late = { labels: labels, datasets: [{ label: 'Lates',  backgroundColor: "#f87979", data: data }] }

                })
                .catch(err => {
                    console.log(err)
                })
            },

        // fetchGraphResult () {
        //     var data = [];
        //     let route = this.$store.state.api + 'dashboard/graph-application-record?user_id=' + this.$session.get('auth')['id'] + '&api_token=' + this.$session.get('auth')['api_token'] + '&role=' + this.$session.get('auth')['roles'];
        //     this.$http.get(route)
        //     .then(res => {
        //         data = res.data;
        //         this.graph_last_update = this.lastUpdated(new Date());

        //         this.$store.state.approved_year_message = { labels: this.labels, datasets: [ { label: 'Number of application', backgroundColor: '#f87979', data: data.approved, }]}
        //     })
        //     .catch(err => {
        //         // console.log(err)
        //         this.$store.state.alert = { message: this.$store.state.request_error_message + " [code: 404]", style: 'error' }
        //     })
        // },

    }
};

</script>
