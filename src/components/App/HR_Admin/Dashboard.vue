<template>
    <div class="main__cont">
        <div class="main-heading">
            <div class="main-title">
                <ol class="breadcrumb">
                    <li class="active">Dasbboard</li>
                </ol>
            </div>
            <div class="main-filter">
                <form class="main-filter__search">
                    <div class="input-group">
                        <input class="form-control" type="text" placeholder="Search...">
                        <span class="input-group-btn">
                            <button class="btn btn-default" type="button">
                                <div class="fa fa-search"></div>
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">Dasbboard</h3>
                            </div>
                            <div class="panel-body">
                                <pie-employees-bundee></pie-employees-bundee>
                                <div class="clearfix"></div><br>
                                <hr>
                                <graph></graph>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import Graph from '@/components/App/HR_Admin/_DashboardComponents/Graph/Graph.vue'
    import PieEmployeesBundee from '@/components/App/HR_Admin/_DashboardComponents/Pie/PieEmployeesBundee.vue'

    export default {
        components: { 
            'graph': Graph,
            'pieEmployeesBundee': PieEmployeesBundee,
        },
        created () {
        },

        methods: {

        }

    }
</script>