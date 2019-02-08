<template>
  <div>
    <div class="row">
      <div class="col-md-8">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title"><span class='fa fa-calendar'></span> Attendance Calendar</h3>
          </div>
          <div class="panel-body">

            <table class="table table-bordered">
              <thead>
                <tr>
                  <th v-for="header in $store.state.days">{{ header }}</th>
                </tr>
              </thead>
              <tbody v-for="date in dates">
                <tr>
                  <td v-if="$store.state.days[new Date(date.dates).getDay()] == 'Sun'">{{ date.dates }}</td>
                  <td v-else>{{ date.dates }}</td>
                </tr>
              </tbody>
            </table>

            <div class="clearfix"></div><br>
            <!-- <full-calendar :events="events"></full-calendar> -->
            <full-calendar :events="fcEvents" locale="en"></full-calendar>
            <br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import Vue from 'vue';
    // import FullCalendar from 'vue-full-calendar'
    // import { FullCalendar } from 'vue-full-calendar'
    // import 'fullcalendar/dist/fullcalendar.css'
    // Vue.use(FullCalendar)

    import fullCalendar from 'vue-fullcalendar'
    Vue.component('full-calendar', fullCalendar)

    export default {
      props: ['user_id'],

      components: {
        'full-calendar': fullCalendar,
      },

      data () {
        return {
          dates: [],
          fcEvents: [
          {
            title : 'Late',
            start : '2018-12-05',
            end : '2018-12-05',
            cssClass  : 'late',
          },
          {
            title : 'Undertime',
            start : '2018-12-05',
            end : '2018-12-05',
            cssClass  : 'undertime',
          },
          {
            title : 'Absent',
            start : '2018-12-06',
            end : '2018-12-06',
            cssClass  : 'absent',
          }
          ]
        }
      },

      created () {
        this.attendanceCalendarView();
      },

      methods: {

        attendanceCalendarView() {
          this.calendar_loading = true
          let route = this.$store.state.application_api+'/dashboard-calendarView/' + this.user_id
          let r = this.axiosRequest('GET', route, null, this.$session.get('headers'))
          r.then(res => {
            let that = this
            if (res.data.status != "failed") {
              res.data.msg.days.forEach(function(r) {
                that.dates.push({key: r.late, dates: r.day, highlight: {backgroundColor: '#ff8080', }, contentStyle: {color: '#fafafa', }, popover: {label: 'You just hovered over today\'s date!', } })
              })
            }
            this.calendar_loading = false

          })
          .catch(err => console.log(err))
        }
      }
    }
  </script>

  <style>
  .asd {
    color: red;
    backgroundColor: yellow;
  }
  /*.event-item {background-color: red;}*/

</style>