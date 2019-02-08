<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li><a style="cursor: pointer;" @click="redirect( 'locations.index', { tenant: $route.params.tenant})">Locations</a></li>
                <li v-if="!show_location_loading">{{ location.branch_name }}</li>
                <li class="active">Edit</li>
            </ol>
        </div>
        <div class="container-fluid half-padding">
            <div class="template template__blank">
                <div class="row">
                    <div class="col-md-12">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <label class="text-left">Location
                                        <span v-if="show_location_loading">
                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                        </span>
                                    </label>
                                    <label class="pull-right" v-if="!show_location_loading">
                                        <label class="btn btn-xs btn-default" @click="redirect('locations.show', { tenant: $route.params.tenant, id: location.branch_id })"><span data-toggle="tooltip" title="View" class='fa fa-eye fa-active'></span></label>
                                    </label>
                                </h3>
                            </div>
                            <div class="panel-body">

                                <!-- {{ location }} -->
                                <!-- FORM -->
                                <div v-if="!show_location_loading">

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

                                    <form class="form locations-new" v-on:submit.prevent="updateLocation()">
                                        <div class="container-fluid float-left">
                                            <h2>Location Information</h2>
                                            <div class="col-md-8">
                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Location:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <div class="form-group">
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><i class="fa fa-map-marker"></i></div>
                                                                <input class="form-control" type="text" v-model="location.branch_name" placeholder="Location name">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Address:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <div class="form-group">
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><i class="fa fa-map"></i></div>
                                                                <input class="form-control" type="text" v-model="location.address" placeholder="Address">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>  

                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Description:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <div class="form-group">
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><i class="fa fa-text-width"></i></div>
                                                                <input class="form-control" type="text" v-model="location.description" placeholder="Description">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Schedule:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <label v-if="location.branch_sched.length != 0">
                                                            {{ location.branch_sched[0].schedule[0].sched_name }}
                                                        </label>
                                                        <label v-else>
                                                            None
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Bundee:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <label v-if="location.bundee != ''">
                                                         <span v-for="(bundee, index) in location.timetrack">
                                                            {{ showBundeeName(bundee.bundee) }}
                                                            <span v-if="index != location.timetrack.length - 1">
                                                                <b>,&nbsp;</b> 
                                                            </span>
                                                        </span>
                                                    </label>
                                                    <label v-else>
                                                        No bundee available
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div><br>  


                                            <div class="row">
                                                <div class="col-md-9 col-md-offset-3">

                                                    <b v-if="hide_schedule_part">
                                                        <span @click="hide_schedule_part = false"><span class='fa fa-edit'></span> Change Schedule</span>
                                                    </b>
                                                    <b v-if="!hide_schedule_part">
                                                        <span @click="cancelChangeScheduleBtn()"><span class='fa fa-edit'></span> Cancel</span>
                                                    </b>
                                                </div>
                                                <div class="clearfix"></div>
                                            </div>
                                        </div>
                                        <div class="clearfix"></div>


                                        
                                        <div v-if="!hide_schedule_part">
                                            <hr>
                                            <span>
                                                <h2>Schedule <small class="text-xs"><span class='fa fa-info-circle'></span> any update on this part will be queued and will be changed on the <i>Effect date start</i> that you entered</small></h2>

                                            </span>
                                            <div class="col-md-8">
                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">
                                                        Schedule:
                                                    </div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <div class="form-group" v-if="!index_schedule_loading">
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
                                                                <div v-if="location.branch_sched != ''">
                                                                    <select class="form-control" v-model="sched_id" @change="hide_change_sched = false">
                                                                        <option v-for="schedule in $store.state.all_schedules" :value="schedule.sched_id">{{ schedule.sched_name }}</option>
                                                                    </select>
                                                                </div>
                                                                <div v-else>
                                                                    <select class="form-control" v-model="sched_id" @change="hide_change_sched = false">
                                                                        <option v-for="schedule in $store.state.all_schedules" :value="schedule.sched_id">{{ schedule.sched_name }}</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">
                                                        Bundee
                                                    </div>
                                                    <div class="col-md-9 col-xs-9" v-if="!index_bundees_loading">
                                                        <span class="checkbox">
                                                            <span v-for="(bun, index) in $store.state.all_bundees" style="margin-right: 25px;">
                                                                <input v-model="trackers" :id="index + 'c'" :value="{'id': parseInt(bun.timetrack_id), 'bundee': bun.name}" type="checkbox" @change="bundeeRestrictions(index + 'c')">
                                                                <label :for="index + 'c'">
                                                                    {{ showBundeeName(bun.name) }}
                                                                </label>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                                <div class="row">
                                                    <div class="col-md-3 col-xs-3">Effective Date Start:</div>
                                                    <div class="col-md-9 col-xs-9">
                                                        <div class="form-group">
                                                            <div class="input-group">
                                                                <div class="input-group-addon"><i class="fa fa-calendar"></i></div>
                                                                <input class="form-control" type="date" v-model="date_sched_queue" placeholder="Date Start">
                                                            </div>
                                                        </div>
                                                        <small><span class='fa fa-info-circle'></span> if you desired to change Schedule or Bundee you are required to pick a date for <b><i>Effective Date Start</i></b> in order to update employee's schedule that assigned to <b>{{ location.branch_name }}</b></small>
                                                    </div>
                                                </div>
                                                <div class="clearfix"></div><br>

                                            </div>
                                        </div>
                                        <div class="clearfix"></div>

                                        <hr>
                                        <div class="col-md-8">
                                            <div class="row">
                                                <div class="col-md-12 text-right">
                                                    <span v-if="update_location_loading">
                                                        <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                                    </span>
                                                    <button type="submit" :disabled="update_location_loading" class="btn btn-xs btn-success"><span class='fa fa-edit'></span> Update changes</button>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div><br>
                                        </div>
                                        
                                    </div>
                                </form>
                            </div>
                            <div v-else>
                                Loading please wait..
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

    export default {

        data () {
            return {
                location: {},
                hide_change_sched: true,
                notif: '',
                trackers: [],
                sched_id: '',
                hide_change_bundee: true,
                hide_change_bundee: true,

                index_location_loading: true,
                index_bundees_loading: true,
                index_schedule_loading: true,
                show_location_loading: true,
                update_location_loading: false,
                hide_schedule_part: true,

                date_sched_queue: '',
            }
        },

        created () {
            this.init ()
        },

        updated () {
            $(".selectpicker").selectpicker('refresh')
        },

        methods: {

            async init () {

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

                requests['getLocationShow'] = this.getLocationShow();

                try {

                    const result = await Promise.all([requests])
                    .then(val => {
                        const getLocations = val[0]['getLocations'];
                        const getBundees = val[0]['getBundees'];
                        const getSchedules = val[0]['getSchedules']; 
                        const getLocationShow = val[0]['getLocationShow'];

                        getLocationShow.then(res => {
                            if (res.data.status != "failed") {
                                this.total = res.data.msg.length
                                this.show_location_loading = false
                                this.location = res.data.msg[0]
                            }
                        }).catch(err => console.log(err))

                        if (typeof getLocations !== 'undefined') {
                            getLocations.then(res => {
                                if (res.data.status != "failed") {
                                    this.index_location_loading = false
                                    this.$store.state.all_locations = res.data.msg
                                }
                            })
                        }

                        if (typeof getBundees !== 'undefined') {
                            getBundees.then(res => {
                                if (res.data.status != "failed") {
                                    this.index_bundees_loading = false
                                    this.$store.state.all_bundees = res.data.msg
                                }
                            })
                        }

                        if (typeof getSchedules !== 'undefined') {
                            getSchedules.then(res => {
                                if (res.data.status != "failed") {
                                    this.index_schedule_loading = false
                                    this.$store.state.all_schedules = res.data.msg
                                }
                            }).catch(err => console.log(err))
                        }

                    });

                }
                catch (e) {
                    console.log(e)
                }
            },

            getLocationShow () {
                return this.axiosRequest('GET', this.$store.state.application_api + '/location/' + this.$route.params.id, null, this.$session.get('headers'))
            },


            updateLocation() {

                this.update_location_loading = true

                if (this.hide_schedule_part) {
                    var params = {
                       branch_name: this.location.branch_name,
                       address: this.location.address,
                       description: this.location.description,
                       '_method': 'PUT',
                   }
               }
               else {
                var params = this.location
                params.timetrack_id = this.trackers
                params.timetrack_id = this.trackers
                params.sched_id = this.sched_id
                params._method = 'PUT'
                params.date_sched_queue = this.date_sched_queue

            }

            this.axiosRequest('post', this.$store.state.application_api + '/location/' + this.$route.params.id, params, this.$session.get('headers'))
            .then(res => {
                if(res.data.status == "success"){
                    this.toastr({ title: 'Location Management', message: 'Update complete' })
                    this.getLocations()
                    this.notif = ''
                    this.update_location_loading = false
                }
                else{
                    this.notif = { message: res.data.msg, style: 'alert-danger', icon: 'fa-times-circle' }
                }
                this.$store.state.loading = false

            }).catch(err => console.log(err))

        },

        // ALL ABOUT BUNDEE

        cancelChangeScheduleBtn(){

            this.hide_schedule_part = true;
            this.trackers = [];

        },

        bundeeRestrictions(id){
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
        }

        // END OF ALL ABOUT BUNDEE

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
<style>
b { cursor: pointer; }
</style>
