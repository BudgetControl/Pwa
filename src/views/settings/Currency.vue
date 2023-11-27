<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Currency settings" />
                    <!-- labels -->
                    <div class="container px-4 mx-auto " v-for="(item, k) in currencies" :key="k"
                        v-on:click="openModal(item.id)">
                        <div class="flex border border-dotted m-1">
                            <div class="flex lg:w-2/12 p-2">
                                <i :class="'fas fa-solid ' + this.symbol(item.name)"></i>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    {{ item.name }}
                                </p>
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

const SYMBOL = {
    EUR: "fa-euro-sign",
    BTC: "fa-bitcoin-sign",
    USD: "fa-dollar-sign",
    GBD: "fa-sterling-sign",
    CNY: "fa-yandex-international",
    RUB: "fa-ruble-sign"
}

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            currencies: [],
            opentab: null,
            modal: {
                id: null,
                name: null,
                deleted: false,
            }
        }
    },
    mounted: function () {
        ApiService.currencies().then((res) => {
            res.data.forEach(e => {
                this.currencies.push(e)
            });
        })
    },
    methods: {
        openModal() {
            this.$router.push({ path: `/app/settings/currency/add` })
        },
        symbol(value) {
            return SYMBOL[value]
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
}
</style>
  