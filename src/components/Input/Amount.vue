<template>
    <input v-model="amount" type="number"
        class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        placeholder="0.00"  @input="formatAmount" />

</template>

<script>

export default {
    data() {
        return {
            amount: '',
        };
    },
    methods: {
        formatAmount() {
            let amount = this.amount.toString();
            if (amount != null) {
                let formattedAmount = amount.replace(/[^0-9.]/g, '');
                let parts = formattedAmount.split('.');
                if (parts.length > 2) {
                    formattedAmount = parts[0] + '.' + parts.slice(1).join('');
                }

                if (parts.length > 1) {
                    parts[1] = parts[1].substring(0, 2);
                    formattedAmount = parts.join('.');
                }

                this.amount = formattedAmount;
            }
        },
    },
};
</script>