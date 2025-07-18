<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <div class="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
            <div class="p-8">
                <div class="flex flex-col items-center mb-8">
                    <img :src="logo" width="100" class="mb-4" />
                    (v{{ version }})
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-slate-700" v-html="$t('text.about_us.version')"></span>
                    </div>
                </div>
                <div class="mb-6">
                    <div class="text-base text-gray-700 mb-4" v-html="$t('text.about_us.personal_finance')"></div>
                    <div class="text-base text-gray-700" v-html="$t('text.about_us.information')"></div>
                </div>
                <div class="flex justify-center mt-8">
                    <a href="https://www.budgetcontrol.cloud"
                        class="bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg shadow hover:bg-emerald-600 transition-colors text-center"
                        v-html="$t('text.about_us.visit_our_website')">
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '@vuepic/vue-datepicker/dist/main.css'
import logo from '@/assets/img/icon-192.png'

export default {
    components: {
    },
    data() {
        return {
            logo,
            version: process.env.VUE_APP_VERSION
        };
    },
};
</script>
