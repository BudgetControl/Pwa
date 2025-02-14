<template>
    <select v-model="selectedCurrency"
        class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
        <option v-for="item in currencies" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option>
    </select>
</template>

<script>
import CoreService from '../../services/core.service';

export default {
    data() {
        return {
            selectedCurrency: this.selected,
            currencies: [],
        };
    },
    props: {
        selected: {
            default: null,
        }
    },
    methods: {
        getCurrency() {
            const apiService = new CoreService()
            apiService.currencies().then((res) => {
                this.currencies = res;
            }).catch((error) => {
                console.error('Errore durante il recupero delle valute:', error);
            });
        },
    },
    mounted() {
        this.getCurrency();
    },
};
</script>