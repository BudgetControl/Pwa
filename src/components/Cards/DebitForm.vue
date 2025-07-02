<template>
  <BaseEntryForm 
    entry-type="debit"
    :is-model="isModel"
    :is-planned="isPlanned"
    :currencies="currencies"
    :payment-types="paymentTypes"
    ref="baseForm"
    @validate-and-submit="handleSubmit">
    
    <template #specific-fields>
      <div class="w-full lg:w-6/12 px-2 py-2">
        <WalletSelector 
          v-model="account" 
          :accounts="accounts" 
          :required="true"
          :has-error="validationErrors.account" />
      </div>

      <div class="w-full px-2 py-2 lg:w-6/12" >
        <select v-model="debit"
          :class="[
            'w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150',
            { 'border-red-300 bg-red-50': validationErrors.debit }
          ]">
          <option value="0">{{ $t('labels.choose_an_option') }}</option>
          <option value="njn76298fm">{{ $t('labels.create_new_debit') }}</option>
          <option v-for="item in debits" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>

      <div v-if="debit == 'njn76298fm'" class="w-full px-2 py-2 lg:w-12/12">
        <TextInput 
          v-model="debit_name" 
          :placeholder="$t('labels.debit_name')"
          :class="{ 'border-red-300 bg-red-50': validationErrors.debit_name }" />
      </div>

      <!-- Radio buttons for debit type - occupano tutta la larghezza -->
      <div class="w-full px-2 py-2">
        <div class="grid grid-cols-2 gap-4 bg-white">
          <label for="income" class="flex items-center justify-center p-3  rounded cursor-pointer hover:bg-gray-50 transition-colors"
                 :class="{ 'border-green-500 bg-green-50': debit_type === '+', 'border-gray-300': debit_type !== '+' }">
            <input type="radio" id="income" value="+" v-model="debit_type" class="mr-2" />
            <span class="text-slate-600 text-sm font-medium">{{ $t('labels.incoming') }}</span>
          </label>
          <label for="expense" class="flex items-center justify-center p-3  rounded cursor-pointer hover:bg-gray-50 transition-colors"
                 :class="{ 'border-red-500 bg-red-50': debit_type === '-', 'border-gray-300': debit_type !== '-' }">
            <input type="radio" id="expense" value="-" v-model="debit_type" class="mr-2" />
            <span class="text-slate-600 text-sm font-medium">{{ $t('labels.expenses') }}</span>
          </label>
        </div>
      </div>
    </template>
  </BaseEntryForm>
</template>

<script>
import BaseEntryForm from './BaseEntryForm.vue';
import WalletSelector from '../Input/WalletSelector.vue';
import TextInput from '../Input/Text.vue';

export default {
  name: 'DebitForm',
  components: {
    BaseEntryForm,
    WalletSelector,
    TextInput
  },
  props: {
    isModel: {
      type: Boolean,
      default: false
    },
    isPlanned: {
      type: Boolean,
      default: false
    },
    accounts: {
      type: Array,
      default: () => []
    },
    debits: {
      type: Array,
      default: () => []
    },
    currencies: {
      type: Array,
      default: () => []
    },
    paymentTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      account: "-1",
      debit: 0,
      debit_name: null,
      debit_type: '-',
      validationErrors: {
        account: false,
        debit: false,
        debit_name: false
      }
    }
  },
  methods: {
    validateForm() {
      this.validationErrors = {
        account: this.account === "-1",
        debit: !this.debit || this.debit === "0",
        debit_name: this.debit === 'njn76298fm' && (!this.debit_name || this.debit_name.trim() === '')
      }
      
      const errors = []
      
      if (this.validationErrors.account) {
        errors.push(this.$t('messages.validation.choose_wallet'))
      }
      
      if (this.validationErrors.debit) {
        errors.push(this.$t('messages.validation.choose_payee'))
      }
      
      if (this.validationErrors.debit_name) {
        errors.push(this.$t('messages.validation.insert_payee_name'))
      }
      
      if (errors.length > 0) {
        this.$refs.baseForm.showAlert(errors.join(', '), 'error')
        return false
      }
      
      return true
    },
    handleSubmit(baseData) {
      if (!this.validateForm()) {
        return
      }
      
      const debitData = {
        ...baseData,
        type: 'debit',
        account_id: this.account,
        payee_id: (this.debit == 'njn76298fm') ? this.debit_name : this.debit,
        amount: this.debit_type == '-' ? baseData.amount * -1 : baseData.amount
      }
      this.$emit('save', debitData)
    }
  }
}
</script>
