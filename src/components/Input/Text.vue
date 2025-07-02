<template>
    <div class="w-full">
        <label class="block uppercase text-slate-600 text-xs font-bold mb-2" htmlFor="grid-password">
            {{ label }}
        </label>
        <input type="text" @input="$emit('update:modelValue', $event.target.value)" :value="modelValue"
            :placeholder="placeholder"
            class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
    </div>

</template>

<script>

export default {
    props: {
        modelValue: {
            type: Array,
            default: () => []
        },
        placeholder: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue'],
};
</script>