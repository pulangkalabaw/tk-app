<template>
    <div>
        <div class="alert alert-dismissible" :class="notif.style" v-if="notif" style="overflow-wrap:break-word;">
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
        </div>
    </div>
</template>
<script>
    export default {
        props: ['notif']
    }
</script>