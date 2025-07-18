<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Intestazione desktop -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ $t('labels.assistance') }}</h1>
                <p class="text-gray-600 mt-1">{{ $t('labels.send_a_request') }}</p>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
                <div class="mb-6" v-html="$t('text.assistance.write_question')"></div>
                
                <div class="mb-4">
                    <textarea 
                        placeholder="Scrivi qui la tua domanda" 
                        v-model="text"
                        rows="8"
                        class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200"
                    ></textarea>
                </div>

                <button
                    class="w-full lg:w-auto bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
                    v-on:click="sendRequest()">
                    <i class="fas fa-paper-plane"></i> {{ $t('labels.send_a_request') }}
                </button>
            </div>
        </div>
        <AlertModal ref="alertModal" />
    </div>
</template>

<script>

import '@vuepic/vue-datepicker/dist/main.css'
import { useAppSettings } from '../../storage/settings.store';
import AlertModal from '../../components/GenericComponents/AlertModal.vue';
import NotificationService from '../../services/notification.service';

export default {
    components: {
       AlertModal
    },
    setup() {
        const apiService = new NotificationService()
        const appSettings = useAppSettings()

        return {
            apiService, appSettings
        }
    },
    data() {
        return {
            text: null,
            alert_message: null,
            alert_color: 'bg-red-500'
        }
    },

    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    methods: {
        sendRequest() {
            const userSettings = this.appSettings.settings.user
            const data = {
                to: userSettings.email,
                subject: "Assistance Request from BudgetControl app",
                message: this.text,
                user_name: userSettings.name,
                email: userSettings.email,
                privacy: true
            }

            this.apiService.contactForm(data).then(() => {
                this.text = null
                alert(this.$t('text.assistance.thanks'), "success")
            }).catch(() => {
                alert(this.$t('labels.generic_error'), "error")
            })
        },
    }
};
</script>