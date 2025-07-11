<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg items-center">
    <div class="flex flex-wrap py-3">
      <!-- Navigation Menu -->
      <div class="w-full">
        <nav class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500 rounded">
          <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
            <div class="w-full">
              <ul class="flex flex-row list-none ml-auto justify-center">
                <li class="nav-item">
                  <a class="border-slate-100 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="javascript:void(0)" @click="toggleTabs('expenses')"
                    :class="{ 'text-emerald-600': action.openTab !== 'expenses', 'text-white bg-emerald-600': action.openTab === 'expenses' }">
                    {{ $t('labels.expenses') }}
                  </a>
                </li>
                <li class="nav-item">
                  <a class="border-slate-100 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="javascript:void(0)" @click="toggleTabs('incoming')"
                    :class="{ 'text-emerald-600': action.openTab !== 'incoming', 'text-white bg-emerald-600': action.openTab === 'incoming' }">
                    {{ $t('labels.incoming') }}
                  </a>
                </li>
                <li class="nav-item">
                  <a class="border-slate-100 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="javascript:void(0)" @click="toggleTabs('debit')"
                    :class="{ 'text-emerald-600': action.openTab !== 'debit', 'text-white bg-emerald-600': action.openTab === 'debit' }">
                    {{ $t('labels.debit') }}
                  </a>
                </li>
                <li class="nav-item">
                  <a class="border-slate-100 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="javascript:void(0)" @click="toggleTabs('saving')"
                    :class="{ 'text-emerald-600': action.openTab !== 'saving', 'text-white bg-emerald-600': action.openTab === 'saving' }">
                    {{ $t('labels.savings') }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- Dynamic Form Components -->
    <ExpenseForm v-if="action.openTab === 'expenses'"
      :is-planned="true"
      :accounts="input.account"
      :categories="input.category"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <IncomeForm v-if="action.openTab === 'incoming'"
      :is-planned="true"
      :accounts="input.account"
      :categories="input.category"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <DebitForm v-if="action.openTab === 'debit'"
      :is-planned="true"
      :accounts="input.account"
      :debits="input.debit"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <SavingForm v-if="action.openTab === 'saving'"
      :is-planned="true"
      :accounts="input.account"
      :goals="input.goals"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <!-- Planned Entry Specific Fields -->
    <div class="bg-slate-100 container relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0 flex-auto p-4">
      <h3 class="text-slate-600 text-sm font-bold uppercase mb-4">{{ $t('labels.planning_settings') }}</h3>
      
      <div class="flex flex-wrap -mx-2">
        <div class="w-full lg:w-3/12 px-2 py-2">
          <label class="block uppercase text-slate-600 text-xs font-bold mb-2">{{ $t('labels.date_start') }}</label>
          <Calendar v-model="plannedData.start_date" />
        </div>

        <div class="w-full lg:w-3/12 px-2 py-2">
          <label class="block uppercase text-slate-600 text-xs font-bold mb-2">{{ $t('labels.date_end') }}</label>
          <Calendar v-model="plannedData.end_date" />
        </div>

        <div class="w-full lg:w-3/12 px-2 py-2">
          <label class="block uppercase text-slate-600 text-xs font-bold mb-2">{{ $t('labels.choose_frequency') }}</label>
          <select v-model="plannedData.planning"
            class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
            <option v-for="item in planningOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
          </select>
        </div>

        <div class="w-full lg:w-3/12 px-2 py-2">
          <label class="block uppercase text-slate-600 text-xs font-bold mb-2">{{ $t('labels.choose_method') }}</label>
          <PaymentTypeSelector 
            v-model="plannedData.payment_type"
            :payment-types="input.payment_type" />
        </div>
      </div>
    </div>

    <AlertModal ref="alertModal" />
  </div>
</template>

<script>
import { useAppSettings } from '../../../storage/settings.store';
import CoreService from '../../../services/core.service';
import GoalService from '../../../services/goal.service';
import AlertModal from '../../GenericComponents/AlertModal.vue';
import ExpenseForm from './ExpenseForm.vue';
import IncomeForm from './IncomeForm.vue';
import DebitForm from './DebitForm.vue';
import SavingForm from './SavingForm.vue';
import Calendar from '../../Input/Calendar.vue';
import PaymentTypeSelector from '../../Input/PaymentTypeSelector.vue';

export default {
  components: {
    ExpenseForm,
    IncomeForm,
    DebitForm,
    SavingForm,
    AlertModal,
    Calendar,
    PaymentTypeSelector
  },
  props: {
    entryId: {
      type: String,
      default: null
    },
    typeOfEntry: {
      type: String,
      default: 'expenses'
    }
  },
  setup() {
    const settingsStore = useAppSettings()
    const settings = settingsStore.get()
    const apiService = new CoreService()
    const goalService = new GoalService()

    return { settings, apiService, goalService }
  },
  data() {
    return {
      action: {
        openTab: 'expenses'
      },
      input: {
        category: [],
        account: [],
        currency: [],
        payment_type: [],
        debit: [],
        goals: []
      },
      plannedData: {
        start_date: null,
        end_date: null,
        planning: 'monthly',
        payment_type: 1
      },
      planningOptions: [
        { label: this.$t('labels.daily'), value: 'daily' },
        { label: this.$t('labels.weekly'), value: 'weekly' },
        { label: this.$t('labels.monthly'), value: 'monthly' },
        { label: this.$t('labels.yearly'), value: 'yearly' }
      ]
    }
  },
  created() {
    window.alert = (message, type = 'success') => {
      this.$refs.alertModal.show(message, type);
    };
  },
  mounted() {
    this.loadData()
    this.action.openTab = this.typeOfEntry
    this.initializePlannedData()
  },
  methods: {
    toggleTabs(tabType) {
      this.action.openTab = tabType
    },
    async loadData() {
      await Promise.all([
        this.getCategory(),
        this.getCurrency(),
        this.getAccount(),
        this.getPaymentType(),
        this.getDebit(),
        this.getGoals()
      ])
    },
    getCategory() {
      return this.apiService.subCategories().then((res) => {
        this.input.category = res.map(sub => ({
          id: sub.id,
          name: this.$t('app.' + sub.slug)
        })).sort((a, b) => a.name.localeCompare(b.name))
      })
    },
    getCurrency() {
      return this.apiService.currencies().then((res) => {
        this.input.currency = res
      })
    },
    getAccount() {
      return this.apiService.accounts('?order[name]=asc&filters[archived]=false').then((res) => {
        this.input.account = res
      })
    },
    getPaymentType() {
      return this.apiService.paymentstype().then((res) => {
        this.input.payment_type = res
      })
    },
    getDebit() {
      return this.apiService.debt().then((res) => {
        this.input.debit = res
      })
    },
    getGoals() {
      return this.goalService.getAll().then((res) => {
        this.input.goals = res
      })
    },
    initializePlannedData() {
      const now = new Date()
      this.plannedData.start_date = now.toISOString().split('T')[0] + " " + now.toLocaleTimeString()
      this.plannedData.payment_type = this.settings.payment_type_id
    },
    validatePlannedData() {
      if (!this.plannedData.start_date) {
        window.alert(this.$t('messages.validation.choose_start_date'), 'error')
        return false
      }

      if (this.plannedData.end_date && this.plannedData.end_date < this.plannedData.start_date) {
        window.alert(this.$t('messages.validation.end_date_greater_than_start_date'), 'error')
        return false
      }

      return true
    },
    handleSave(data) {
      if (!this.validatePlannedData()) {
        return
      }

      const plannedEntryData = {
        ...data,
        ...this.plannedData,
        date_time: this.plannedData.start_date,
        end_date_time: this.plannedData.end_date,
        planning: this.plannedData.planning
      }

      this.apiService.setEntry(data.type, plannedEntryData, true, this.entryId)
        .then(() => {
          window.alert(this.$t('labels.entry_saved'), "success")
        })
        .catch(() => {
          window.alert(this.$t('messages.generic_error'), "error")
        })
    }
  }
}
</script>
