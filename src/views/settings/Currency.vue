<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Currency settings" />

                    <div class="container px-4 mx-auto ">
                        <p class="px-2 mb-2 text-sm font-medium text-gray-400 dark:text-gray-500">Set your default currency
                        </p>
                    </div>
                    <!-- labels -->
                    <div class="container px-4 mx-auto " v-for="(item, k) in currencies" :key="k">

                        <div class="flex border border-dotted m-1">
                            <div class="flex lg:w-2/12 p-2">
                                <input v-on:change="setDefault(item.id)" :id="'currency_' + item.id" type="radio" :value="item.id" v-model="currency_id"
                                    name="disabled-radio"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                                <p class="ml-5"> {{ item.icon }}</p>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <label for="'currency_' + item.id"
                                    class="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500"> {{ item.name
                                    }}</label>
                            </div>

                            <div class="flex lg:w-10/12 p-2">
                                <p>{{ item.exchange_rate }}</p>
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
import ApiService from '@/services/ApiService.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import LocalStorageService from '../../services/LocalStorageService.vue';
import AuthService from '../../services/AuthService.vue';

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            currencies: [],
            currency_id: 1,
        }
    },
    mounted: function () {
        ApiService.currencies().then((res) => {
            res.data.forEach(e => {
                this.currencies.push(e)
            });
            const settings = LocalStorageService.get("user_settings")
            this.currency_id = settings.currency.icon
        })
    },
    methods: {
        setDefault(id) {
            LocalStorageService.deleteItem("user_settings")
            ApiService.setDefaultCurrency(id);
            AuthService.settings().then((res) => {
                LocalStorageService.set('user_settings', res)
            })
        }
    },
};
</script>

<style>
.vacp-color-input-group {
    display: none !important;
}

.vacp-copy-button {
    display: none !important;
}</style>
  