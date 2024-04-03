<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Assistance" />

                    <!-- labels -->
                    <div class="container px-4 mx-auto ">
                        <div class=" border border-dotted m-1">

                            <p>Write here your question</p>

                            <div class=" flex-wrap py-3">
                                <div class="lg:w-12/12 px-2 w-full">
                                    <textarea type="text" placeholder="Write here your question" v-model="text" rows="12"
                                        class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full"></textarea>
                                </div>
                            </div>

                            <div class=" flex-wrap py-3">
                                <div class="lg:w-12/12 px-2 w-full">
                                    <button
                                        class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        v-on:click="sendRequest()" type="button">
                                        Send a request
                                    </button>
                                </div>
                            </div>


                            <div class="text-white px-6 py-4 border-0 rounded relative mb-4 " :class="alert_color"
                                v-if="alert_message">
                                <span class="text-xl inline-block mr-5 align-middle">
                                    <i class="fas fa-bell"></i>
                                </span>
                                <span class="inline-block align-middle mr-8">
                                    {{ alert_message }}
                                </span>
                                <button v-on:click="closeAlert()"
                                    class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
                                    <span>×</span>
                                </button>
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
import ApiService from '../../services/ApiService.vue';
import LocalStorageService from '../../services/LocalStorageService.vue';

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            text: null,
            alert_message: null,
            alert_color: 'bg-red-500'
        }
    },
    methods: {
        closeAlert: function () {
            this.alert_message = null;
        },
        sendRequest() {
            const userSettings = LocalStorageService.get("settings")
            const _this = this
            const data = {
                "user_id": userSettings.user_profile.id,
                "text": this.text
            }

            ApiService.assistance(data).then(() => {
                _this.alert_message = "Thanks for your message"
                _this.alert_color = "bg-emerald-500"
            }).catch((error) => {
                _this.alert_message = error.message
                console.error(error)
            })
        },
    }
};
</script>
