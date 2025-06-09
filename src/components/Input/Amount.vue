<template>
    <div class="lg:w-4/12 px-2 py-2 w-full">
        <label v-if="label" class="block uppercase text-slate-600 text-xs font-bold mb-2" htmlFor="grid-password">
            {{ label }}
        </label>
        <input :value="modelValue" type="number"
            @input="$emit('update:modelValue', $event.target.value)"
            class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            :placeholder="placeholder" @change="formatAmount" />
    </div>

</template>

<script>

export default {
    props: {
        modelValue: {
            type: Number,
            default: 0
        },
        placeholder: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            amount: '',
        };
    },
    emits: ['update:modelValue'],
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