import Vue from 'vue'
import Router from 'vue-router'
// import ErrorComponent from '@/components/ErrorComponent'

// @Login_Components
import LoginComponent from '@/components/Login'

// **Admin_Components 

// @Dashboard
import Dashboard from '@/components/App/HR_Admin/Dashboard'

// @Employee
import EmployeeIndex from '@/components/App/HR_Admin/Employees/Index'
import EmployeeShow from '@/components/App/HR_Admin/Employees/Show'
import EmployeeEdit from '@/components/App/HR_Admin/Employees/Edit'
//  @Download Excel
import Summary from '@/components/App/HR_Admin/Employees/Excel/Summary_report'


// @Location
import LocationIndex from '@/components/App/Global_Settings/Locations/Index'
import LocationShow from '@/components/App/Global_Settings/Locations/Show'
import LocationEdit from '@/components/App/Global_Settings/Locations/Edit'

// @Schedule
import ScheduleIndex from '@/components/App/Global_Settings/Schedules/Index'
import ScheduleShow from '@/components/App/Global_Settings/Schedules/Show'
import ScheduleEdit from '@/components/App/Global_Settings/Schedules/Edit'

// @Holiday
import HolidayIndex from '@/components/App/Global_Settings/Holiday/Index'

// @Company settings
import CompanyIndex from '@/components/App/Global_Settings/Company/Index'
import CompanyEdit from '@/components/App/Global_Settings/Company/Edit'


// @Profile
import ProfileDashboard from '@/components/App/Profile/Dashboard'
import ProfileInfo from '@/components/App/Profile/Profile'
import ProfileEdit from '@/components/App/Profile/Edit_Profile'

// @Overtime
import OvertimeApprovee from '@/components/App/Timetable/Overtime/ForApprovee'
import OvertimeApprover from '@/components/App/Timetable/Overtime/ForApprover'

// @Time
import TimeTableEdit from '@/components/App/Timetable/Timesheet/Edit'
import Timetable from '@/components/App/Timetable/Timetable'
import TimeapprovalsIndex from '@/components/App/Timetable/Timeapproval/Index'
import TimeadjustmentIndex from '@/components/App/Timetable/TimeAdjustment/Index'
import TimeadjustmentApprover from '@/components/App/Timetable/TimeAdjustment/ForApprover'
// @Leave Types
import LeaveTypes from '@/components/App/Global_Settings/LeaveTypes/Index'
import LeaveTypesEdit from '@/components/App/Global_Settings/LeaveTypes/Edit'

// @Holiday Types
import HolidayTypes from '@/components/App/Global_Settings/HolidayTypes/Index'
import HolidayTypesEdit from '@/components/App/Global_Settings/HolidayTypes/Edit'
// @Approver
import Approver from '@/components/App/Timetable/Approver/Index'
import Approvee from '@/components/App/Timetable/Approver/Show'

// @Leave Request
import VacationSickLeave from '@/components/App/Timetable/LeaveRequest/VacationSickLeave'
import VacationSickApproval from '@/components/App/Timetable/LeaveRequest/VacationSickApproval'

// @Admin
// Subscription
import SubscriptionShow from '@/components/App/Admin/Subscriptions/Show'

// ***
import PageNotFound from '@/components/PageNotFound'
import SetupWizard from '@/components/Layouts/Extra/SetupWizard'
import PasswordReset from '@/components/PasswordReset'
import ForgotPassword from '@/components/ForgotPassword'

import Welcome from '@/components/Welcome'


Vue.use(Router)

// ***********************
//      ALL
//          Routes
// ***********************

let web_routes = [
    // @@Public_Components
    { path: '/', name: 'welcome', component: Welcome, meta: { requiresAuth: false }, }, 
    
    // Password Reset
    { path: '/:tenant/Forgot-Password', name: 'password.forgot', component: ForgotPassword, meta: { requiresAuth: false }, }, 
    { path: '/:tenant/Support/Password-Reset/:ac', name: 'password.reset', component: PasswordReset, meta: { requiresAuth: false }, }, 


    { path: '/:tenant/login', name: 'login', component: LoginComponent, meta: { requiresAuth: false }, }, 
    // @@Admin_Components
    // @Dashboard
    { path: '/:tenant/Dashboard', name: 'dashboard', component: Dashboard, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'hr_admin' }, }, 
    // @Employees
    { path: '/:tenant/Employees', name: 'employees.index', component: EmployeeIndex, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'hr_admin' }, }, 
    { path: '/:tenant/Employee/:id', name: 'employees.show', component: EmployeeShow, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'hr_admin' }, },
    { path: '/:tenant/Employee/:id/edit', name: 'employees.edit', component: EmployeeEdit, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'hr_admin' }, },
    { path: '/:tenant/Summary-report', name: 'employees.summary_report', component: Summary, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'hr_admin' }, },

    // @Locations
    { path: '/:tenant/Location-Management', name: 'locations.index', component: LocationIndex, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'global_settings' }, },
    { path: '/:tenant/Location-Management/:id', name: 'locations.show', component: LocationShow, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'global_settings' }, },
    { path: '/:tenant/Location-Management/:id/Edit', name: 'locations.edit', component: LocationEdit, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'global_settings' }, },
    // @Leave Types
    { path: '/:tenant/Leave-Type/', name: 'leave_types.index', component: LeaveTypes, meta: { roles: ['Admin', 'HR Admin'], requiresAuth: true, menu: 'global_settings' }, },        
    { path: '/:tenant/Leave-Type/:id/Edit', name: 'leave_types.edit', component: LeaveTypesEdit, meta: { roles: ['Admin', 'HR Admin'], requiresAuth: true, menu: 'global_settings' }, },        
    // @Holiday Types
    { path: '/:tenant/Holiday-Type/', name: 'holiday_types.index', component: HolidayTypes, meta: { roles: ['Admin', 'HR Admin'], requiresAuth: true, menu: 'global_settings' }, },        
    { path: '/:tenant/Holiday-Type/:id/Edit', name: 'holiday_types.edit', component: HolidayTypesEdit, meta: { roles: ['Admin', 'HR Admin'], requiresAuth: true, menu: 'global_settings' }, },        
    
    // @Schedule
    { path: '/:tenant/Schedule-Management', name: 'schedules.index', component: ScheduleIndex, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'global_settings' }, },
    { path: '/:tenant/Schedule-Management/:id', name: 'schedules.show', component: ScheduleShow, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'global_settings' }, },
    { path: '/:tenant/Schedule-Management/:id/Edit', name: 'schedules.edit', component: ScheduleEdit, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'global_settings' }, },
    // @Holiday
    { path: '/:tenant/Holiday-management', name: 'holidays.index', component: HolidayIndex, meta: { roles: ['HR Admin', 'Admin'], requiresAuth: true, menu: 'global_settings' }, },        
    // @Company Settings
    { path: '/:tenant/Company-Settings/', name: 'company.index', component: CompanyIndex, meta: { roles: ['Admin'], requiresAuth: true, menu: 'global_settings' }, },        
    { path: '/:tenant/Company-Settings-update/', name: 'company.edit', component: CompanyEdit, meta: { roles: ['Admin'], requiresAuth: true, menu: 'global_settings' }, },        
    // @Overtime
    { path: '/:tenant/Overtime/Approvee', name: 'overtime.approvee', component: OvertimeApprovee, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    { path: '/:tenant/Overtime/Approver', name: 'overtime.approver', component: OvertimeApprover, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    // @Profile 
    { path: '/:tenant/Profile/Dashboard', name: 'profile.index', component: ProfileDashboard, meta: { roles: ['HR Admin', 'Admin', 'Employee', 'Time Keeper'], requiresAuth: true, menu: 'profile' }, },
    { path: '/:tenant/Profile', name: 'profile.info', component: ProfileInfo, meta: { roles: ['HR Admin', 'Admin', 'Employee', 'Time Keeper'], requiresAuth: true, menu: 'profile' }, },
    { path: '/:tenant/Profile/Edit', name: 'profile.edit', component: ProfileEdit, meta: { roles: ['HR Admin', 'Admin', 'Employee', 'Time Keeper'], requiresAuth: true, menu: 'profile' }, },
    { path: '/:tenant/Profile/Approver', name: 'profile.approver', component: Approver, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time' }, },
    { path: '/:tenant/Profile/Approvee/:id', name: 'profile.approvee', component: Approvee, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time' }, },
    // @Time
    { path: '/:tenant/Profile/Timesheet', name: 'profile.timesheet', component: Timetable, meta: { roles: ['HR Admin', 'Admin', 'Employee', 'Time Keeper'], requiresAuth: true, menu: 'time' }, },
    { path: '/:tenant/Profile/Timeentry', name: 'profile.timeentry', component: TimeTableEdit, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    { path: '/:tenant/Profile/Timeapprovals', name: 'profile.timeapprovals', component: TimeapprovalsIndex, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    { path: '/:tenant/Profile/Timeadjustment', name: 'profile.timeadjustment', component: TimeadjustmentIndex, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    { path: '/:tenant/Profile/Checkadjustments', name: 'profile.approveradjustments', component: TimeadjustmentApprover, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    // @Vacation Sick Leave
    { path: '/:tenant/Leave-Request/Vacation-Sick-Leave-Form', name: 'leave.vacation_sick', component: VacationSickLeave, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    { path: '/:tenant/Leave-Request/Approvals', name: 'leave.approvals', component: VacationSickApproval, meta: { roles: ['HR Admin', 'Admin', 'Employee'], requiresAuth: true, menu: 'time'  }, },
    // @Admin
    // Subscription
    { path: '/:tenant/Admin/Subscription', name: 'admin.subscription', component: SubscriptionShow, meta: { roles: ['Admin'], requiresAuth: true, menu: 'admin'  }, },

    // { path: '/:tenant/*', name: 'error', component: ErrorComponent, meta: { requiresAuth: false }, }, 
    { path: '/:tenant/Setup-Wizard', name: 'setupwizard', component: SetupWizard, meta: { roles: ['Admin'], requiresAuth: true, }, }, 
    { path: '/:tenant/*', name: 'pagenotfound', component: PageNotFound, meta: { requiresAuth: false }, }, 

    ];

    let router = new Router({
        routes: web_routes,
        mode: 'history',
    });


// ***********************
//      Route
//          Condition / Guard
// ***********************

router.beforeEach((to, from, next) => {

    if (to.matched.some(web_routes => web_routes.meta.requiresAuth)) {
        // THIS SECTI0N NEEDED TO HAVE SESSION
        if (router.app.$session.exists('auth')) {

            // *****
            // Check if this route is for admin only
            // console.log(to.matched.some(web_routes => web_routes.meta.roles.includes(router.app.$session.get('auth')['role'][0]['role_name'])))

            // If route's role has user's role
            if (to.matched.some(web_routes => web_routes.meta.roles.includes(router.app.$session.get('auth')['role'][0]['role_name']))) {

                // !!!! CHECKPOINTS !!!!
                // **** TIMEENTRY CHECK POINT
                if (to.name == "profile.timeentry") {
                    if (router.app.$session.get('bundee').includes(1001)) {
                        next();
                    }
                    else {
                        router.go(-1)
                    }
                }

                // YOU MAY GO !
                else {
                    next();
                }
            }
            else {
                // Means user's role is not in the list of allowed roles in this route
                router.go(-1)
            }

            // if (to.matched.some(web_routes => web_routes.meta.roles)) {

            //     if (router.app.$session.get('auth')['role'][0]['role_name'] === 'Admin') {
            //         next()  
            //     }
            //     else{
            //         router.go(-1)
            //     }
            // }
            // else {

            //     // This route is for public not only for admin

            //     // !!!! CHECKPOINTS !!!!

            //     // **** TIMEENTRY CHECK POINT
            //     if (to.name == "profile.timeentry") {
            //         if (router.app.$session.get('bundee').includes('1001')) {
            //             next();
            //         }
            //         else {
            //             router.go(-1)
            //         }
            //     }



            //     // YOU MAY GO !
            //     else {
            //         next();
            //     }
            // }
            // *****

        }
        else {

            // IF NOT THROW TO LOGIN SECTION
            router.app.$session.destroy('auth')
            router.push({ name: 'login', params: { tenant: to.params.tenant } });
        }
    }
    else {
        // NO AUTHENTICATION NEEDED IN THIS ROUTE

        // If you already logged in, ill throw you inside
        if (!router.app.$session.exists('auth')) {
            next()
        }else{
            router.push({ name: 'profile.index', params: { tenant: to.params.tenant } });   
        }

    }
});


// ********************
export default router
