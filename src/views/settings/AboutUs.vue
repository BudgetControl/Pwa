<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="About Us" />

                    <!-- labels -->
                    <div class="container px-4 mx-auto ">
                        <div class=" border border-dotted m-1">

                            <div class="container px-4 mx-auto">

                                <div class="flex flex-wrap border rounded m-5 bg-gray-100">
                                    <div class="w-full justify-center px-4 flex">
                                        <img :src="logo" width="100" />
                                    </div>
                                    <div class="w-full justify-center flex">
                                        <span
                                            class="text-sm block my-4 p-3 text-blueGray-700 border-blueGray-100" v-html="$t('text.about_us.version')"></span>
                                    </div>
                                </div>

                                <div class="flex flex-wrap">
                                    <div class="w-full px-2 flex-1 text-xs" v-html="$t('text.about_us.personal_finance')">
                                        
                                         </div>
                                </div>

                                <div class="flex flex-wrap mt-5">
                                    <div class="w-full px-2 flex-1 text-xs" v-html="$t('text.about_us.information')">
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-wrap py-3">
                                <div class="flex justify-center px-2 w-full">
                                    <a href="https://www.budgetcontrol.cloud"
                                        class="text-center w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        v-html="$t('text.about_us.visit_our_website')"
                                        >

                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import logo from '@/assets/img/vue.jpg'

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            logo,
            version: process.env.VUE_APP_VERSION
        };
    },
};
</script>
