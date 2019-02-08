<script>

import VueCharts from 'vue-chartjs'
import { Bar, Line } from 'vue-chartjs'

export default {
    extends: Bar,
    props: ['chartData','options'],
    mixins: [VueCharts.mixins.reactiveProp],
    mounted () {
        this.renderChart(this.chartData, this.options)
    }
};
</script>