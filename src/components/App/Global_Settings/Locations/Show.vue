<template>
    <div class="main__cont">
        <div class="main-heading">
            <ol class="breadcrumb">
                <li><label>Global Settings</label></li>
                <li><a style="cursor: pointer;" @click="redirect( 'locations.index', { tenant: $route.params.tenant})">Locations</a></li>
                <li class="active" v-if="!$store.state.loading">{{ location.branch_name }}</li>
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
                                        <span v-if="$store.state.loading">
                                            <span class="fa fa-spin" :class="$store.state.page_load_icon"></span>
                                        </span>
                                    </label>
                                    <label class="pull-right">
                                        <label class="btn btn-xs btn-default" @click="redirect('locations.edit', { tenant: $route.params.tenant, id: location.branch_id })"><span data-toggle="tooltip" title="Edit" class='fa fa-edit fa-active'></span></label>
                                    </label>
                                </h3>
                            </div>
                            <div class="panel-body">

                                <div v-if="!$store.state.loading">
                                    <h2>General Information</h2>
                                    <div class="col-md-8">

                                        <div class="row">
                                            <div class="col-md-3">Location</div>
                                            <div class="col-md-8">
                                                {{ location.branch_name }}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">Address</div>
                                            <div class="col-md-8">
                                                {{ location.address }}
                                            </div>
                                        </div>


                                        <div class="row">
                                            <div class="col-md-3">Description</div>
                                            <div class="col-md-8">
                                                {{ location.description }}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">Bundee</div>
                                            <div class="col-md-8">
                                                <div v-if="location.bundee !='' ">
                                                    <span v-for="(bundee, index) in location.timetrack">
                                                        {{ showBundeeName(bundee.bundee) }}
                                                        <span v-if="index != location.timetrack.length - 1">
                                                            <b>,&nbsp;</b>
                                                        </span>
                                                    </span>
                                                </div>
                                                <div v-else>
                                                    No bundee
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3">Schedule</div>
                                            <div class="col-md-8">
                                                <label v-if="location.branch_sched.length != 0">
                                                    {{ location.branch_sched[0].schedule[0].sched_name }}
                                                </label>
                                                <label v-else>
                                                    None
                                                </label>
                                            </div>
                                        </div>

                                        <!-- <div class="row">
                                            <div class="col-md-3">Schedule Date Start</div>
                                            <div class="col-md-8">
                                                <label v-if="location.branch_sched.length != 0">
                                                    {{ location.branch_sched[0].schedule[0].date_start }}
                                                </label>
                                                <label v-else>
                                                    N/A
                                                </label>
                                            </div>
                                        </div> -->

                                        <div class="row" v-if="location.change_queue != null">
                                          <div class="col-md-3">Location Change</div>
                                          <div class="col-md-9">
                                            {{ location.change_queue }}
                                            <small @click="openChangeQueModal()"><a><span class="fa fa-info-circle"> Info</span></a></small>
                                          </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>

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

        <!-- change queue modal start -->
        <div class="modal fade in"  id="view_change_que" v-if="!location_que_loading">
          <div class="modal-dialog">
            <div class="modal-content">

              <!-- modal header start -->
              <div class="modal-header">
                <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Location Change</h4>
              </div>
              <!-- modal header end -->

              <!-- modal body start -->
              <div class="modal-body">
                <div class="row">
                  <!-- current location start -->
                  <div class="col-md-12">
                    <div class="breadcrumb">
                      <h4>Current Location</h4>
                      <div class="row">

                      <div class="col-md-6">
                        <label><strong>Location Name:</strong></label>
                        <p>{{ location.branch_name }}</p>
                      </div>

                      <div class="col-md-6">
                        <label><strong>Schedule:</strong></label>
                        <p>{{ location.branch_sched[0].schedule[0].sched_name }}</p>
                      </div>

                      <div class="col-md-6">
                        <label><strong>Address:</strong></label>
                        <p>{{ location.address }}</p>
                      </div>

                      <div class="col-md-6" v-if="location.description != null">
                        <label><strong>Description:</strong></label>
                        <p>{{ location.description }}</p>
                      </div>

                      <div class="col-md-6" v-else>
                        <label><strong>Description:</strong></label>
                        <p>N/A</p>
                      </div>

                      <div class="col-md-12">
                        <label><strong>Bundee:</strong></label>
                        <p>
                          <span v-for="(bundee, index) in location.timetrack" v-bind:key="bundee.id">
                            {{ showBundeeName(bundee.bundee) }}
                            <span v-if="index != location.timetrack.length - 1">
                              <b>,&nbsp;</b>
                            </span>
                          </span>
                        </p>
                      </div>

                      </div>
                    </div>
                  </div>
                  <!-- current location end -->

                  <!-- new location start -->
                  <div class="col-md-12" v-if="location_que != null">
                    <div class="breadcrumb">
                      <h4>New Location
                        <small class="pull-right" style="font-size: 12px;">Date Start: {{ location_que.date_start }}</small>
                      </h4>
                      <div class="row">
                        <div class="col-md-6">
                          <label><strong>Location Name:</strong></label>
                          <p>{{ location_que.branch_name }}</p>
                        </div>

                        <div class="col-md-6">
                          <label><strong>Schedule:</strong></label>
                          <p>{{ location_que.sched_name }}</p>
                        </div>

                        <div class="col-md-6">
                          <label><strong>Address:</strong></label>
                          <p>{{ location_que.address }}</p>
                        </div>

                        <div class="col-md-6" v-if="location_que.description != null">
                          <label><strong>Description:</strong></label>
                          <p>{{ location_que.description }}</p>
                        </div>

                        <div class="col-md-6" v-else>
                          <label><strong>Descritpion:</strong></label>
                          <p>N/A</p>
                        </div>

                        <div class="col-md-12">
                          <label><strong>Bundee:</strong></label>
                          <p>
                            <span v-for="(bundee, index) in location_que.timetrack_id" v-bind:key="bundee.id">
                              {{ showBundeeName(bundee.bundee) }}
                              <span v-if="index != location_que.timetrack_id.length - 1">
                                <b>,&nbsp;</b>
                              </span>
                            </span>
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                  <!-- new location end -->

                </div>
              </div>
              <!-- modal body end -->

            </div>
          </div>
        </div>
        <!-- change queue modal end -->
    </div>
</template>


<script>

    export default {

        data () {
            return {
                location: '',
                location_que: [],
                //loading
                location_que_loading: true,
            }
        },

        created (){
            this.init();
        },

        methods: {

            async init () {

                var requests = [];
                requests['getLocationShow'] = this.getLocationShow();

                try {
                    const result = await Promise.all([requests])
                    .then(val => {
                        const getLocationShow = val[0]['getLocationShow'];

                        getLocationShow.then(res => {
                          if (res.data.status != "failed") {
                              this.total = res.data.msg.length
                              this.location = res.data.msg[0]
                              this.$store.state.loading = false
                              this.getLocationQue()
                          }
                        }).catch(err => console.log(err))
                    });
                }
                catch (e) {
                    console.log(e)
                }
            },

            getLocationShow () {
                this.$store.state.loading = true
                return this.axiosRequest('GET', this.$store.state.application_api + '/location/' + this.$route.params.id, null, this.$session.get('headers'))
            },

            getLocationQue() {
              this.location_que_loading = true
              this.axiosRequest('GET', this.$store.state.application_api + '/location_que/' + this.location.que_id, null, this.$session.get('headers'))
              .then(res => {
                if(res.data.status != "failed"){
                  this.location_que = res.data.msg[0]
                  console.log(this.location_que)
                  this.location_que_loading = false
                }
              }).catch(err => console.log(err))
            },

            openChangeQueModal(){
              $('#view_change_que').modal('toggle')
            }
        }

    }

</script>
