<template>
    <div class="main__cont">
            <div class="main-title">
                <ol class="breadcrumb">
                    <li>Time Info</li>
                    <li class="active">Time Sheet</li>
                </ol>
            </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-md-12">
                        <show-timetable :enableAdjustment="true" :profile="true"></show-timetable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import ShowTimeTable from "@/components/App/Timetable/Extra/_ShowTimeTable"
    export default {

        components: {
            'show-timetable': ShowTimeTable,
        },
        data () {
            return {
                isEditing: false,

                timetable: '',
                dates: '',
            }
        },

    }

</script>