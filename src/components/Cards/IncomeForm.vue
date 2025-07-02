<template>
  <BaseEntryForm 
    entry-type="incoming"
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

      <div class="w-full lg:w-6/12 px-2 py-2">
        <CategorySelector 
          v-model="category" 
          :categories="categories"
          :required="true"
          :has-error="validationErrors.category" />
      </div>
    </template>
  </BaseEntryForm>
</template>

<script>
import BaseEntryForm from './BaseEntryForm.vue';
import WalletSelector from '../Input/WalletSelector.vue';
import CategorySelector from '../Input/CategorySelector.vue';

export default {
  name: 'IncomeForm',
  components: {
    BaseEntryForm,
    WalletSelector,
    CategorySelector
  },
  props: {
    isModel: Boolean,
    isPlanned: Boolean,
    accounts: Array,
    categories: Array,
    currencies: Array,
    paymentTypes: Array
  },
  data() {
    return {
      account: "-1",
      category: 0,
      validationErrors: {
        account: false,
        category: false
      }
    }
  },
  methods: {
    validateForm() {
      this.validationErrors = {
        account: this.account === "-1",
        category: this.category === 0
      }
      
      const errors = []
      
      if (this.validationErrors.account) {
        errors.push(this.$t('messages.validation.choose_wallet'))
      }
      
      if (this.validationErrors.category) {
        errors.push(this.$t('messages.validation.choose_category'))
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
      
      const incomeData = {
        ...baseData,
        type: 'income',
        account_id: this.account,
        category_id: this.category
      }
      this.$emit('save', incomeData)
    }
  }
}
</script>
