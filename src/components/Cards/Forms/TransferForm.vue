<template>
  <BaseEntryForm 
    entry-type="transfer"
    :is-model="isModel"
    :is-planned="isPlanned"
    :currencies="currencies"
    :payment-types="paymentTypes"
    :available-labels="availableLabels"
    :entry-id="entryId"
    ref="baseForm"
    @validate-and-submit="handleSubmit"
    @entry-loaded="handleEntryLoaded">
    
    <template #specific-fields>
      <div class="w-full lg:w-6/12 px-2 py-2">
        <WalletSelector 
          v-model="account" 
          :accounts="accounts" 
          :required="true"
          :has-error="validationErrors.account" />
      </div>

      <div class="w-full lg:w-6/12 px-2 py-2">
        <select v-model="transferTo"
          :class="[
            'w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150',
            { 'border-red-300 bg-red-50': validationErrors.transferTo }
          ]">
          <option :value="false">{{ $t('labels.choose_a_wallet_to_transfer_to') }}</option>
          <option value="">{{ $t('labels.out_of_wallet') }}</option>
          <option v-for="item in accounts" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
    </template>
  </BaseEntryForm>
</template>

<script>
import BaseEntryForm from '../BaseEntryForm.vue';
import WalletSelector from '../../Input/WalletSelector.vue';

export default {
  name: 'TransferForm',
  components: {
    BaseEntryForm,
    WalletSelector
  },
  props: {
    isModel: Boolean,
    isPlanned: Boolean,
    accounts: Array,
    currencies: Array,
    paymentTypes: Array,
    availableLabels: {
      type: Array,
      default: () => []
    },
    entryId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      account: "-1",
      transferTo: false,
      validationErrors: {
        account: false,
        transferTo: false
      }
    }
  },
  methods: {
    handleEntryLoaded(entryData) {
      console.log('TransferForm - Entry data received:', entryData) // Debug
      
      // Popola i campi specifici del form trasferimenti
      this.account = entryData.account_id ? entryData.account_id.toString() : "-1"
      this.transferTo = entryData.transfer_id !== undefined ? entryData.transfer_id : false
      
      // Se transfer_id è 0, significa "out of wallet"
      if (entryData.transfer_id === 0) {
        this.transferTo = ""
      }
      
      console.log('TransferForm - Set account:', this.account, 'transferTo:', this.transferTo) // Debug
    },
    
    validateForm() {
      this.validationErrors = {
        account: this.account === "-1",
        transferTo: this.transferTo === false || this.transferTo === "-1"
      }
      
      const errors = []
      
      if (this.validationErrors.account) {
        errors.push(this.$t('messages.validation.choose_wallet'))
      }
      
      if (this.validationErrors.transferTo) {
        errors.push(this.$t('messages.validation.choose_wallet_transfer'))
      }
      
      if (this.account === this.transferTo && this.transferTo !== "") {
        errors.push(this.$t('messages.validation.wallets_must_be_different'))
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
      
      const transferData = {
        ...baseData,
        type: "transfer",
        account_id: parseInt(this.account),
        transfer_id: this.transferTo === "" ? "" : (this.transferTo === false ? false : parseInt(this.transferTo)),
        category_id: 0, // Transfer non ha categoria
        amount: Math.abs(baseData.amount) // Transfer sempre positivo
      }
      
      this.$emit('save', transferData)
    }
  }
}
</script>
