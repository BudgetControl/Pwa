<template>
  <form>
    <div :class="containerClass" class="container relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0 flex-auto p-4">
      
      <!-- Prima riga: campi specifici del tipo -->
      <div class="flex flex-wrap -mx-2">
        <!-- Slot per campi specifici del tipo -->
        <slot name="specific-fields"></slot>
      </div>
      
      <!-- Seconda riga: Amount e Currency -->
      <div class="flex flex-wrap -mx-2">
        <div class="w-full lg:w-6/12 px-2 py-2">
          <Amount 
            v-model="formData.amount" 
            :placeholder="'0'" 
            :min="0.01" />
        </div>

        <div v-if="showDetails" class="w-full lg:w-6/12 px-2 py-2">
          <select v-model="formData.currency_id"
            class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
            <option v-for="item in currencies" :key="item.id" :value="item.id">{{ $t('app.' + item.slug) }}</option>
          </select>
        </div>
      </div>

      <!-- Pulsante show details solo su mobile -->
      <div v-if="!showDetails" class="w-full px-2 py-2">
        <button @click="showDetails = true"
          class="w-full text-xs py-1 bg-yellow-500 text-white active:bg-amber-600 font-bold uppercase rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          type="button">
          {{ $t('labels.show_details') }}
        </button>
      </div>

      <!-- Sezione dettagli -->
      <div v-if="showDetails" class="flex flex-wrap -mx-2 py-3">
        <div v-if="!isModel && !isPlanned" class="w-full lg:w-6/12 px-2 py-2">
          <Calendar 
            v-model="formData.date" 
            :label="''" />
        </div>

        <div class="w-full lg:w-6/12 px-2 py-2">
          <PaymentTypeSelector 
            v-model="formData.payment_type"
            :payment-types="paymentTypes" />
        </div>

        <div class="w-full px-2 py-2">
          <TextNote v-model="formData.note" 
            :placeholder="$t('labels.add_here_your_note')" />
        </div>
      </div>
    </div>

    <div class="w-full px-2">
      <Buttons v-if="!isModel" 
        @set="handleSubmit" />
    </div>
      
    <AlertModal ref="alertModal" />
  </form>
</template>

<script>
import Amount from '../Input/Amount.vue';
import TextNote from '../Input/TextNote.vue';
import Calendar from '../Input/Calendar.vue';
import Buttons from '../Input/Buttons.vue';
import PaymentTypeSelector from '../Input/PaymentTypeSelector.vue';
import AlertModal from '../GenericComponents/AlertModal.vue';

export default {
  name: 'BaseEntryForm',
  components: {
    Amount,
    TextNote,
    Calendar,
    Buttons,
    PaymentTypeSelector,
    AlertModal
  },
  props: {
    entryType: {
      type: String,
      required: true
    },
    isModel: {
      type: Boolean,
      default: false
    },
    isPlanned: {
      type: Boolean,
      default: false
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
      showDetails: false,
      formData: {
        amount: null,
        currency_id: 1,
        payment_type: 1,
        date: null,
        note: null
      }
    }
  },
  computed: {
    containerClass() {
      const classes = {
        'expenses': 'bg-red-200',
        'incoming': 'bg-sky-200',
        'transfer': 'bg-amber-200',
        'debit': 'bg-blueGray-200',
        'saving': 'bg-emerald-200'
      }
      return classes[this.entryType] || 'bg-gray-200'
    },
    isMobile() {
      return window.innerWidth <= 768
    }
  },
  mounted() {
    this.time()
    this.setInitialShowDetails()
  },
  methods: {
    time() {
      let dateTime = new Date()
      this.formData.date = dateTime.toISOString().split('T')[0] + " " + dateTime.toLocaleTimeString()
    },
    setInitialShowDetails() {
      // Su desktop mostra sempre i dettagli, su mobile no
      this.showDetails = !this.isMobile
    },
    showAlert(message, type = 'error') {
      this.$refs.alertModal.show(message, type)
    },
    validateAmount() {
      return this.formData.amount && this.formData.amount > 0
    },
    handleSubmit() {
      if (!this.validateAmount()) {
        this.showAlert(this.$t('messages.validation.insert_amount'), 'error')
        return
      }
      
      // Passa la validazione al componente padre
      this.$emit('validate-and-submit', this.formData)
    }
  }
}
</script>
