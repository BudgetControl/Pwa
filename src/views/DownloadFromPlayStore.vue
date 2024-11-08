<template>
    <div class="container mx-auto px-4 h-full">
        <loading :show="show">
        </loading>
        <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-6/12 px-4">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                    <div class="rounded-t mb-0 px-6 py-6">
                        <div class="text-center mb-3">
                        </div>
                        <hr class="mt-6 border-b-1 border-blueGray-300" />
                    </div>
                    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <div class="text-blueGray-400 text-center mb-3 font-bold">
                            <form action="javascript:void(0)">

                                <div role="alert">
                                    <div class="bg-emerald-500 text-white font-bold rounded-t px-4 py-2">
                                        Download our app now from the App Store to access your invoice and stay updated
                                        with your account
                                        <div class="flex justify-center">
                                            <a :href="androidUrlStore"><img :src="googlePlayBadge" alt="Google Play Badge"
                                                    width="150px" /></a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import googlePlayBadge from '@/assets/img/google-play-badge.png'
import libs from '@/Libs.vue'

export default {
    data() {
        return {
            androidUrlStore: process.env.VUE_APP_ANDORID_STORE_URL,
            googlePlayBadge: googlePlayBadge
        }
    },
    mounted() {
    const isMobile = libs.isMobile();
    const isIos = libs.isIos();
        if (!isMobile) {
        this.$router.push({ path: '/app/auth/login' });
        } else if (isIos) {
        //TODO: will do later
        }
    },
};
</script>