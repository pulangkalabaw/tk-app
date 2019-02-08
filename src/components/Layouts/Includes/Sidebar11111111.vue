<template>
    <!-- SIDEBAR OF ADMIN -->
    <div class="sidebar">
        <!-- THE ICONS NAV -->
        <div class="quickmenu">
            <div class="quickmenu__cont">
                <div class="quickmenu__list">
                    <div class="quickmenu__item" :class="{ 'active': $route.meta.menu == 'profile'}" v-if="(['HR Admin', 'Admin', 'Employee', 'Time Keeping']).includes($session.get('auth')['role'][0]['role_name'])">
                        <div class="fa fa-fw fa-home" title="Profile"></div>
                    </div>
                    <div class="quickmenu__item" :class="{ 'active': $route.meta.menu == 'hr_admin'}" v-if="(['HR Admin', 'Admin']).includes($session.get('auth')['role'][0]['role_name'])">
                        <div class="fa fa-fw fa-user" title="HR Administrator"></div>
                    </div>
                    <div class="quickmenu__item" :class="{ 'active': $route.meta.menu == 'time'}" v-if="(['HR Admin', 'Admin', 'Employee', 'Time Keeping']).includes($session.get('auth')['role'][0]['role_name'])">
                        <div class="fa fa-fw fa-clock-o" title="Time"></div>
                    </div>
                    <div class="quickmenu__item" :class="{ 'active': $route.meta.menu == 'global_settings'}" v-if="(['HR Admin', 'Admin']).includes($session.get('auth')['role'][0]['role_name'])">
                        <div class="fa fa-fw fa-cog" title="Global Settings"></div>
                    </div>
                    <div class="quickmenu__item" :class="{ 'active': $route.meta.menu == 'admin'}" v-if="(['Admin']).includes($session.get('auth')['role'][0]['role_name'])">
                        <div class="fa fa-fw fa-lock" title="Administrator"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- INSIDE MENUS -->
        <div class="scrollable scrollbar-macosx">
            <div class="sidebar__cont">


                <!-- PROFILE -->
                <div class="sidebar__menu">
                    <div class="sidebar__title">Profile</div>
                    <ul class="nav nav-menu">
                        <li :class="{ 'active': $route.name == 'profile.index' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.index', { tenant: $route.params.tenant })"> 
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-dashboard"></i></div>
                                <div class="nav-menu__text"><span>My Dashboard</span></div>
                            </a>
                        </li>
                        <li :class="{ 'active': $route.name == 'profile.info' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.info', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-user"></i></div>
                                <div class="nav-menu__text"><span>My Profile</span></div>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- HR ADMINISTRATOR -->
                <div class="sidebar__menu" v-if="(['HR Admin', 'Admin']).includes($session.get('auth')['role'][0]['role_name'])">
                    <div class="sidebar__title">HR Administrator</div>
                    <ul class="nav nav-menu">
                        <li :class="{ 'active': $route.name == 'dashboard' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('dashboard', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-dashboard"></i></div>
                                <div class="nav-menu__text"><span>Dashboard</span></div>
                            </a>
                        </li>
                        <li :class="{ 'active': $route.name == 'employees.index' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('employees.index', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-users"></i></div>
                                <div class="nav-menu__text"><span>Employees</span></div>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- APPROVER -->
                <div class="sidebar__menu" v-if="(['HR Admin', 'Admin', 'Employee', 'Time Keeping']).includes($session.get('auth')['role'][0]['role_name'])">
                    <div class="sidebar__title">Timesheet</div>
                    <ul class="nav nav-menu">
                        <li :class="{ 'active': $route.name == 'profile.timesheet' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.timesheet', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-clock-o"></i></div>
                                <div class="nav-menu__text"><span>My Time Sheet</span></div>
                            </a>
                        </li>
                    </ul>
                    <div class="sidebar__title">Time Request</div>
                    <ul class="nav nav-menu">
                        <!-- <li :class="{ 'active': $route.name == 'profile.timesheet' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.timesheet', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-clock-o"></i></div>
                                <div class="nav-menu__text"><span>My Time Sheet</span></div>
                            </a>
                        </li> -->
                        <li :class="{ 'active': $route.name == 'profile.timeentry' }" v-if="$session.get('bundee').includes(1001)">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.timeentry', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-calendar-plus-o"></i></div>
                                <div class="nav-menu__text"><span>Time Sheet Entry</span></div>
                            </a>
                        </li>
                        <li :class="{ 'active': $route.name == 'profile.timeadjustment' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.timeadjustment', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-pencil-square"></i></div>
                                <div class="nav-menu__text"><span>Adjustment Requests</span></div>
                            </a>
                        </li>
                        <li :class="{ 'active': $route.name == 'leave.vacation_sick' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('leave.vacation_sick', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-calendar-plus-o"></i></div>
                                <div class="nav-menu__text"><span>Leave Request</span></div>
                            </a>
                        </li>
                    </ul>
                    <div v-if="$session.get('auth')['is_approver'] == 1">
                        <div class="sidebar__title">Time Approvals</div>
                        <ul class="nav nav-menu">
                            <li :class="{ 'active': $route.name == 'profile.timeapprovals' }">
                                <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.timeapprovals', { tenant: $route.params.tenant })">
                                    <div class="nav-menu__ico"><i class="fa fa-fw fa-calendar"></i></div>
                                    <div class="nav-menu__text"><span>Time Sheet Approvals</span></div>
                                </a>
                            </li>
                            <li :class="{ 'active': $route.name == 'profile.approveradjustments' }" >
                                <a class="nav-link" style="cursor: pointer;" @click="redirect('profile.approveradjustments', { tenant: $route.params.tenant })">
                                    <div class="nav-menu__ico"><i class="fa fa-fw fa-check-square"></i></div>
                                    <div class="nav-menu__text"><span>Adjustment Approvals</span></div>
                                </a>
                            </li>
                            <li :class="{ 'active': $route.name == 'leave.approvals' }">
                                <a class="nav-link" style="cursor: pointer;" @click="redirect('leave.approvals', { tenant: $route.params.tenant })">
                                    <div class="nav-menu__ico"><i class="fa fa-fw fa-calendar-check-o"></i></div>
                                    <div class="nav-menu__text"><span>Leave Approvals</span></div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- GLOBAL SETTINGS -->
                <div class="sidebar__menu" v-if="(['HR Admin', 'Admin']).includes($session.get('auth')['role'][0]['role_name'])">
                    <div class="sidebar__title">Global Settings</div>
                    <ul class="nav nav-menu">
                        <li :class="{ 'active': $route.name == 'locations.index' }">
                            <a style="cursor: pointer;" @click="redirect('locations.index', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-map-marker"></i></div>
                                <div class="nav-menu__text"><span>Location Management</span></div>
                            </a>
                        </li>
                        <li :class="{ 'active': $route.name == 'schedules.index' }">
                            <a style="cursor: pointer;" @click="redirect('schedules.index', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-calendar-check-o"></i></div>
                                <div class="nav-menu__text"><span>Schedule Management</span></div>
                            </a>
                        </li>
                        <li :class="{ 'active': $route.name == 'holidays.index' }">
                            <a style="cursor: pointer;" @click="redirect('holidays.index', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-calendar-check-o"></i></div>
                                <div class="nav-menu__text"><span>Holiday Management</span></div>
                            </a>
                        </li>
                        <li :class="{ 'active': $route.name == 'company.index' }" v-if="(['Admin']).includes($session.get('auth')['role'][0]['role_name'])">
                            <a style="cursor: pointer;" @click="redirect('company.index', { tenant: $route.params.tenant })">

                                <div class="nav-menu__ico"><i class="fa fa-fw fa-building"></i></div>
                                <div class="nav-menu__text"><span>Company Settings</span></div>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- ADMINISTRATOR -->
                <div class="sidebar__menu" v-if="(['Admin']).includes($session.get('auth')['role'][0]['role_name'])">
                    <div class="sidebar__title">Administrator</div>
                    <ul class="nav nav-menu">
                        <li :class="{ 'active': $route.name == 'subscription' }">
                            <a class="nav-link" style="cursor: pointer;" @click="redirect('admin.subscription', { tenant: $route.params.tenant })">
                                <div class="nav-menu__ico"><i class="fa fa-fw fa-dashboard"></i></div>
                                <div class="nav-menu__text"><span>Subscription</span></div>
                            </a>
                        </li>
                    </ul>
                </div>

                
            </div>
        </div>
    </div>
</template>

<script>

    export default {

        data () {
            return {

            }
        },

        created () {
            this.getRoles();
            this.getLocations();
        },

        methods: {

            getRoles() {
                this.axiosRequest('get', this.$store.state.application_api+'/role', '', this.$session.get('headers'))
                .then(res => {
                    this.$store.state.roles = res.data.msg
                    if(res.data.status == "success"){
                        this.isFormReady = true
                    }else{
                        this.isFormReady = false                    
                    }
                })
                .catch(err => {

                })
            },

            getLocations() {
                this.axiosRequest('get', this.$store.state.application_api+'/bundee', '', this.$session.get('headers'))
                .then(res => {
                    this.$store.state.bundees = res.data.msg
                    if(res.data.status == "success"){
                        this.isFormReady = true
                    }else{
                        this.isFormReady = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },

        }

    }

</script>