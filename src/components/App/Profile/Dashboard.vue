<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li>Profile</li>
                <li class="active">Dashboard</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">Dashboard</h3>
                            </div>
                            <div class="panel-body">
                                <!-- <stats :user_id="$session.get('auth')['user_id']"></stats> -->
                                <!-- <attendance-calendar-short :user_id="$session.get('auth')['user_id']"></attendance-calendar-short> -->
                                <late :user_id="$session.get('auth')['user_id']"></late>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Stats from "@/components/App/HR_Admin/Employees/Extra/_Stats";
    import Late from "@/components/App/HR_Admin/_DashboardComponents/Widgets/Late";
    import AttendanceCalendarShort from '@/components/App/HR_Admin/_DashboardComponents/Widgets/AttendanceCalendarShort.vue'

    export default {
        components: { 
            'stats': Stats, 
            'late': Late,
            'attendanceCalendarShort': AttendanceCalendarShort,
        },

    }
</script>