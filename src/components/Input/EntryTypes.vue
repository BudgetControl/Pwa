<template>
    <div class="lg:w-6/12 px-2 py-2 w-full">
        <label class="bl}ock uppercase text-slate-600 text-xs font-bold mb-2" htmlFor="grid-password">
            {{ $t('labels.entry_type') }}
        </label>

        <select :value="modelValue" @input="handleChange" multiple
            class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
            <option
                class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                value="incoming"> {{ $t('labels.incoming') }}
            </option>

            <option
                class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                value="expenses"> {{ $t('labels.expenses') }}
            </option>

            <option
                class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                value="debit"> {{ $t('labels.debit') }}
            </option>

            <option
                class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                value="transfer"> {{ $t('labels.transfer') }}
            </option>
        </select>
    </div>
</template>

<script>

export default {
    props: {
        modelValue: {
            type: Array,
            default: () => []
        }
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