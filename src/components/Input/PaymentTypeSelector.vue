<template>
  <div class="w-full">
    <label v-if="label" class="block uppercase text-slate-600 text-xs font-bold mb-2">
      {{ label }}
    </label>
    <select 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
      <option value="">{{ $t('labels.choose_payment_type') }}</option>
      <option v-for="item in paymentTypes" :key="item.id" :value="item.id">
        {{ $t('app.' + item.slug) }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'PaymentTypeSelector',
  props: {
    modelValue: {
      type: [String, Number],
      default: null
    },
    paymentTypes: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
}
</script>
