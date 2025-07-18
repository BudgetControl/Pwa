<template>
    <div class="w-full">
        <select :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" :required="required"
            :class="[
                'border-0 px-3 py-3 w-full placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150',
                { 'border-red-300 bg-red-50': hasError }
            ]">
            <option v-for="item in currencies" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}
            </option>
        </select>
    </div>
</template>
<script>
export default {
    props: {
        modelValue: [String, Number],
        currencies: Array,
        required: { type: Boolean, default: false },
        hasError: { type: Boolean, default: false }
    },
    emits: ['update:modelValue']
}
</script>