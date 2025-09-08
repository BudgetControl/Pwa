<template>
  <BaseEntryForm 
    entry-type="expenses"
    :is-model="isModel"
    :is-planned="isPlanned"
    :currencies="currencies"
    :payment-types="paymentTypes"
    :available-labels="availableLabels"
    :models="models"
    :entry-id="entryId"
    ref="baseForm"
    @validate-and-submit="handleSubmit"
    @entry-loaded="handleEntryLoaded"
    @model-loaded="handleModelLoaded">
    
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
import BaseEntryForm from '../BaseEntryForm.vue';
import WalletSelector from '../../Input/WalletSelector.vue';
import CategorySelector from '../../Input/CategorySelector.vue';

export default {
  name: 'ExpenseForm',
  components: {
    BaseEntryForm,
    WalletSelector,
    CategorySelector
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
    categories: {
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
    },
    availableLabels: {
      type: Array,
      default: () => []
    },
    models: {
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
    handleEntryLoaded(entryData) {
      console.log('ExpenseForm - Entry data received:', entryData)
      
      this.account = entryData.account_id ? entryData.account_id.toString() : "-1"
      this.category = entryData.category_id || 0
      
      console.log('ExpenseForm - Set account:', this.account, 'category:', this.category)
    },
    
    handleModelLoaded(modelData) {
      console.log('ExpenseForm - Model data received:', modelData)
      
      // Popola i campi specifici del form spese dal modello
      this.account = modelData.account_id ? modelData.account_id.toString() : "-1"
      this.category = modelData.category_id || 0
      
      console.log('ExpenseForm - Set from model - account:', this.account, 'category:', this.category)
    },
    
    handleSubmit(baseData) {
      if (!this.validateForm()) {
        return
      }
      
      const expenseData = {
        ...baseData,
        type: "expenses",
        account_id: parseInt(this.account),
        category_id: parseInt(this.category),
        amount: Math.abs(baseData.amount) * -1 // Assicurati che sia negativo
      }
      
      this.$emit('save', expenseData)
      this.resetForm()
    },
    resetForm() {
        this.amount = null,
        this.label = [],
        this.note = null,
        this.model = 0,
        this.newlabel = null,
        this.action.dateUpdated = false
        this.exclude_from_stats = false
        this.time()
    },
  }
}
</script>
