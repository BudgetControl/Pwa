<template>
    <div class="lg:w-4/12 px-2 py-2 w-full">
        <label class="block uppercase text-slate-600 text-xs font-bold mb-2" htmlFor="grid-password">
            {{ label }}
        </label>
        <select 
            :value="modelValue" 
            @change="handleChange"
            class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full">
            <option value="" disabled selected>{{ $t('labels.choose_an_option') }}</option>
            <option v-for="(icon, key) in icons" :key="key" :value="icon.icon">
                {{ $t('labels.icons.' + icon.label) }}
            </option>
        </select>
    </div>
</template>

<script>
import GoalsIcons from '@/assets/goal-icons.json'

export default {
    props: {
        modelValue: {
            type: String,
            default: ''
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
    data() {
        return {
            icons: GoalsIcons
        }
    },
    emits: ['update:modelValue'],
    methods: {
        handleChange(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}
</script>