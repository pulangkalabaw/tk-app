<template>
    <div>
        <div class="wrapper" v-if="$session.get('auth')">
            <!-- <setupwizard v-if="!$session.get('auth')['company']['isFinishedSetup']"></setupwizard> -->
            <!-- <div v-else> -->
                <navbar></navbar>
                <div class="dashboard">

                    <!-- Show Sidebar when Finished Setup -->
                    <sidebar v-if="$session.get('setup')['isFinishedSetup'] == 1"></sidebar>

                    <!-- When Finished Setup -->
                    <div class="main" v-if="$session.get('setup')['isFinishedSetup'] == 1">
                        <div class="main__scroll scrollbar-macosx">
                            <router-view/>
                        </div>
                    </div>

                    <!-- When !Finished Setup -->
                    <div class="main" v-if="$session.get('setup')['isFinishedSetup'] == 0" style="padding: 0px; margin-left: 0px;">
                        <div class="main__scroll scrollbar-macosx" style="">
                            <router-view/>
                        </div>
                    </div>
                </div>
                <!-- </div> -->
            </div>

            <div class="wrapper" v-else>
                <!-- When wrong link is inputted on the address bar of browser -->
                <router-view/>
            </div>
        </div>
    </template>

    <script>

        import Sidebar from '@/components/Layouts/Includes/Sidebar'
        import Navbar from '@/components/Layouts/Includes/Nav'
        import SetupWizard from '@/components/Layouts/Extra/SetupWizard'

        export default {
            data () {
                return {
                }
            },

            components: {
                'sidebar': Sidebar,
                'navbar': Navbar,
                'setupwizard': SetupWizard,
            },

            
            created () {
                console.log(this.$store.state.internal_error)
            },

        }
    </script>

    <style>
    .image {
        width: 300px;
        height: 300px;
    }
    a { cursor: pointer }
    .text-xs { font-size: 10px; }
    b { cursor: pointer }

    .text-orange {
        color: #FFA500;
    }
    .text-purple {
        color: #800080;
    }
    .text-yellow {
        color: #FFFF00;
    }
    .text-lime {
        color: #66B032;
    }
    .text-red {
        color: #FF0000;
    }
    .text-gray {
        color: #C0C0C0;
    }
    .text-blue {
        color: #1e50a0;
    }
    .text-teal {
        color: #008080;
    }
</style>