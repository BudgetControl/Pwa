<template>
    <select v-model="selectedPaymentstype"
        class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
        <option v-for="item in paymentstype" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option>
    </select>
</template>

<script>
import CoreService from '../../services/core.service';

export default {
    data() {
        return {
            selectedPaymentstype: this.selected,
            paymentstype: [],
        };
    },
    props: {
        selected: {
            default: null,
        }
    },
    methods: {
        getPaymentType() {
            const apiService = new CoreService()
            apiService.paymentstype().then((res) => {
                this.paymentstype = res;
            })
        },
    },
    
    mounted() {
        this.getPaymentType();
    }
};
</script>