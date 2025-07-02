<template>
    <div class="w-full">
        <label v-if="label" class="block uppercase text-slate-600 text-xs font-bold mb-2">
            {{ label }}
        </label>
        <VueDatePicker 
            :model-value="modelValue"
            @update:model-value="handleUpdate"
            :placeholder="placeholder">
        </VueDatePicker>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    components: {
        VueDatePicker
    },
    props: {
        modelValue: {
            type: String,
            default: () => new Date()
        },
        placeholder: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: 'Select Date'
        }

    },
    emits: ['update:modelValue'],
    mounted() {
        if (!this.modelValue || this.modelValue.length === 0) {
            const currentDate = new Date();
            this.$emit('update:modelValue', currentDate);
        }
    },
    methods: {
        handleUpdate(value) {
            this.$emit('update:modelValue', value);
        },
    }
};
</script>