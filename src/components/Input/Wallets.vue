<template>
    <div class="lg:w-6/12 px-2 py-2 w-full">
        <label class="block uppercase text-slate-600 text-xs font-bold mb-2" htmlFor="grid-password">
            {{ $t('labels.wallet') }}
        </label>
        <select multiple :value="modelValue" @input="handleChange"
            class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
            <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                {{ wallet.name }}
            </option>
        </select>
    </div>
</template>

<script>
import CoreService from '../../services/core.service';

export default {
    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            wallets: [],
        };
    },
    created() {
        const apiService = new CoreService()
        apiService.accounts('?filters[archived]=false').then((response) => {
            this.wallets = response;
        });
    },
    methods: {
        handleChange(event) {
            const selectedOptions = Array.from(event.target.selectedOptions);
            const selectedValues = selectedOptions.map(option => option.value);
            this.$emit('update:modelValue', selectedValues);
        }
    }
};
</script>