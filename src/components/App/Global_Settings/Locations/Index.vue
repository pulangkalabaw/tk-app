<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li class="active">Locations</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                <div class="col-md-12">
                    <div class="panel panel-danger">
                        <div class="panel-heading">
                            <h3 class="panel-title">
                                Locations
                                <span v-if="index_location_loading">
                                    <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                </span>
                                <span v-else @click="reloadLocations()">
                                    <span class='fa fa-refresh' data-toggle="tooltip" title="Refresh data"></span>
                                </span>
                            </h3>
                        </div>
                        <div class="panel-body" v-if="!index_location_loading">

                            <div class="scrollable scrollbar-macosx">
                                <!-- TABS NAV -->
                                <ul class="nav nav-tabs">
                                    <li class="active"><a data-toggle="tab" href="#locTab">All <span class="label">{{  $store.state.all_locations.length }}</span></a></li>
                                    <li><a data-toggle="tab" href="#newTab"><span class="fa fa-plus"></span> New</a></li>
                                </ul>

                                <!-- TABS CONTENT -->
                                <div class="tab-content">
                                    <div id="locTab" class="tab-pane fade in active">
                                        <table class="table table-hover table-sortable dtlocations">
                                            <thead>
                                                <tr>
                                                    <th>Location</th>
                                                    <th>Bundee</th>
                                                    <th>Schedule</th>
                                                    <th>Change queue</th>
                                                </tr>
                                            </thead>
                                            <tbody v-if="$store.state.all_locations.length != 0">
                                                <tr v-for="loc in $store.state.all_locations" @click="redirect('locations.show', { tenant: $route.params.tenant, id: loc.branch_id})">
                                                    <td>{{ loc.branch_name }}</td>
                                                    <td>
                                                        <span v-for="(bran, index) in loc.timetrack">
                                                            {{ showBundeeName(bran.bundee) }}
                                                            <span v-if="index != loc.timetrack.length - 1">
                                                                <b>,&nbsp;</b>
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td v-if="loc.schedule.length != 0">
                                                        {{ loc.schedule[0].schedule_name }}
                                                    </td>
                                                    <td v-else>None</td>

                                                    <td v-if="loc.change_queue != null">
                                                      {{ loc.change_queue }}
                                                    </td>
                                                    <td v-else>
                                                      - &nbsp; - &nbsp; - &nbsp; -
                                                    </td>
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


                                    <div id="newTab" class="tab-pane fade">
                                        <!-- FORM -->
                                        <div class="alert alert-dismissible" :class="notif.style" v-if="notif">
                                            <div v-if="notif.style == 'alert-danger'">
                                                <div v-if="typeof notif.message === 'object'">
                                                    <div v-for="(mess, index) in notif.message">
                                                        <span class='fa' :class="notif.icon"></span> {{ mess.join() }}
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <span class='fa' :class="notif.icon"></span> {{ notif.message }}
                                                </div>
                                            </div>
                                            <div v-else>
                                                <span class='fa' :class="notif.icon"></span> {{ notif.message }}
                                            </div>
                                        </div><br>

                                        <form class="form locations-new" v-on:submit.prevent="addLocation()">
                                            <div class="container-fluid float-left">
                                                <div class="col-md-8">
                                                    <div class="row">
                                                        <div class="col-md-2">Location</div>
                                                        <div class="col-md-10">
                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-map-marker"></i></div>
                                                                    <input class="form-control" type="text" v-model="locname" placeholder="Location name">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-md-2">Address</div>
                                                        <div class="col-md-10">
                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <div class="input-group-addon"><i class="fa fa-map"></i></div>
                                                                    <input class="form-control" type="text" v-model="locadd" placeholder="Address">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-md-2">Schedule</div>
                                                        <div class="col-md-10">
                                                            <div v-if="!index_schedule_loading">
                                                                <div class="form-group">
                                                                    <div class="input-group">
                                                                        <div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
                                                                        <select class="form-control" v-model="sched_id" required="" data-width="100%">
                                                                            <option v-for="schedule in $store.state.all_schedules"  :value="schedule.sched_id">{{ schedule.sched_name }}</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div v-else>
                                                                Loading please wait..
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="row">
                                                        <div class="col-md-2">Bundee</div>
                                                        <div class="col-md-10">
                                                            <span class="checkbox" v-if="!index_bundees_loading">
                                                                <span v-for="(bun, index) in $store.state.all_bundees" style="margin-right: 25px;">
                                                                    <input v-model="trackers" :id="index + 'c'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" type="checkbox" @change="bundeeResrtrictions(index+'c')">
                                                                    <label :for="index + 'c'" v-if="bun.name == 'kiosk'">Kiosk</label>
                                                                    <label :for="index + 'c'" v-else-if="bun.name == 'edtr'">EDTR</label>
                                                                    <label :for="index + 'c'" v-else-if="bun.name == 'mobile'">Mobile</label>
                                                                    <label :for="index + 'c'" v-else-if="bun.name == 'third_party_biometrics'">Biometrics (Third Party) </label>
                                                                    <label :for="index + 'c'" v-else>Unkown reference</label>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div><br>

                                                    <div class="row">
                                                        <div class="col-md-12 text-right">
                                                            <span v-if="create_location_loading">
                                                                <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                            </span>
                                                            <button type="submit" :disabled="create_location_loading" class="btn btn-xs btn-primary" >Submit <span class='fa fa-plus-circle'></span> </button>
                                                        </div>
                                                    </div><br>
                                                </div>
                                                <!-- col-md-8 -->
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-body" v-else>
                            Loading please wait..
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

    export default {

        data () {
            return {
                locations: '',
                total: 0,
                locname: '',
                sched_id: '',
                locadd: '',
                trackers: [],
                notif: '',
                index_location_loading: true,
                index_bundees_loading: true,
                index_schedule_loading: true,
                create_location_loading: false,
            }
        },


        created () {
            this.init()
        },

        computed: {
            count () {
                return this.index_location_loading
            }
        },

        updated () {
            $(".selectpicker").selectpicker('refresh')
            if (this.$store.state.all_locations.length != 0) {
                if (!$.fn.dataTable.isDataTable( '.dtlocations' )) {
                    $('.dtlocations').DataTable({ ordering: true });
                }
            }
        },

        watch: {
            count: function (val) {
                if (this.$store.state.all_locations.length != 0) {
                    $(".selectpicker").selectpicker('refresh')
                    if (!$.fn.dataTable.isDataTable( '.dtlocations' )) {
                        $('.dtlocations').DataTable({ ordering: true });
                    }
                }
            }
        },

        methods: {

            // For restriction of choosing bundee
            bundeeResrtrictions(id){

                document.getElementById('0c').disabled = false;
                document.getElementById('1c').disabled = false;
                document.getElementById('2c').disabled = false;
                document.getElementById('3c').disabled = false;

                // For Kiosk or Mobile
                if(id == '0c' || id == '3c'){
                    if(!document.getElementById('0c').checked && !document.getElementById('3c').checked){
                        document.getElementById('1c').disabled = false;
                        document.getElementById('2c').disabled = false;
                    }else{
                        document.getElementById('1c').disabled = true;
                        document.getElementById('2c').disabled = true;
                    }
                // For EDTR
                }else if(id == '1c'){
                    if(!document.getElementById('1c').checked){
                        document.getElementById('0c').disabled = false;
                        document.getElementById('2c').disabled = false;
                        document.getElementById('3c').disabled = false;
                    }else{
                        document.getElementById('0c').disabled = true;
                        document.getElementById('2c').disabled = true;
                        document.getElementById('3c').disabled = true;
                    }
                }else if(id == '2c'){
                    if(!document.getElementById('2c').checked){
                        document.getElementById('0c').disabled = false;
                        document.getElementById('1c').disabled = false;
                        document.getElementById('3c').disabled = false;
                    }else{
                        document.getElementById('0c').disabled = true;
                        document.getElementById('1c').disabled = true;
                        document.getElementById('3c').disabled = true;
                    }
                }else{
                    // if(document.getElementById(id).checked){
                    //     document.getElementById('0c').disabled = true;
                    //     document.getElementById('2c').disabled = true;
                    //     document.getElementById('3c').disabled = true;
                    // }else{
                    //     document.getElementById('0c').disabled = false;
                    //     document.getElementById('2c').disabled = false;
                    //     document.getElementById('3c').disabled = false;
                    // }
                }
            },

            reloadLocations () {
                this.$store.state.all_locations = "";
                this.init();
            },

            async init () {

                this.index_location_loading = true

                var requests = [];
                if (this.$store.state.all_locations.length == 0) {
                    requests['getLocations'] = this.getLocations()
                }
                else {
                    this.index_location_loading = false;
                }

                if (this.$store.state.all_bundees.length == 0) {
                    requests['getBundees'] = this.getBundees()
                }else {
                    this.index_bundees_loading = false;
                }

                if (this.$store.state.all_schedules.length == 0) {
                    requests['getSchedules'] = this.getSchedules()
                }
                else {
                    this.index_schedule_loading = false;
                }

                try {

                    const result = await Promise.all([requests])
                    .then(val => {
                        const getLocations = val[0]['getLocations'];
                        const getBundees = val[0]['getBundees'];
                        const getSchedules = val[0]['getSchedules'];

                        if (typeof getLocations !== 'undefined') {
                            getLocations.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_locations = res.data.msg
                                    this.index_location_loading = false
                                    // clearInterval(t)
                                    // let t = setInterval(() => {
                                    //     if (!$.fn.dataTable.isDataTable( '.dtlocations' )) {
                                    //         $('.dtlocations').DataTable({ ordering: true });
                                    //     }
                                    // }, 500)
                                }
                            })
                        }

                        if (typeof getBundees !== 'undefined') {
                            getBundees.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_bundees = res.data.msg
                                    this.index_bundees_loading = false
                                }
                            })
                        }

                        if (typeof getSchedules !== 'undefined') {
                            getSchedules.then(res => {
                                if (res.data.status != "failed") {
                                    this.$store.state.all_schedules = res.data.msg
                                    this.index_schedule_loading = false
                                }
                            }).catch(err => console.log(err))
                        }

                    });

                }
                catch (e) {
                    console.log(e)
                }
            },


            addLocation() {

                this.create_location_loading = true

                // checker for edtr
                let check = this.trackers.filter(x => x.id == 1001);
                if(check.length == 1){
                    // if there is conflicting edtr will be chosen
                    this.trackers = check;
                }
                // end of checker fore edtr

                let params = {
                    branch_name: this.locname,
                    address: this.locadd,
                    timetrack_id: this.trackers,
                    sched_id: this.sched_id,
                }

                this.axiosRequest('post', this.$store.state.application_api + '/location', params, this.$session.get('headers'))
                .then(res => {
                    if(res.data.status == "success"){
                        this.toastr({ title: 'Location Management', message: 'Added new location' })
                        this.notif = ''
                        this.reloadLocations()
                    }
                    else{
                        this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                    }
                    this.create_location_loading = false
                })
                .catch(err => console.log(err))

            }
        },

        notifications: {
            toastr: {
                timeout: 2500,
                title: '',
                message: '',
                type: 'success'
            }
        },

    }

</script>
