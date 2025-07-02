<template>
  <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg items-center">
    <div class="flex flex-wrap py-3">
      <!-- Navigation Menu -->
      <div class="w-full">
        <nav
          class="relative flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-emerald-500 rounded">
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
                <li class="nav-item" v-if="!isModel && !isPlanned">
                  <a class="border-slate-100 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="javascript:void(0)" @click="toggleTabs('transfer')"
                    :class="{ 'text-emerald-600': action.openTab !== 'transfer', 'text-white bg-emerald-600': action.openTab === 'transfer' }">
                    {{ $t('labels.transfer') }}
                  </a>
                </li>
                <li class="nav-item" v-if="!isModel">
                  <a class="border-slate-100 px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                    href="javascript:void(0)" @click="toggleTabs('debit')"
                    :class="{ 'text-emerald-600': action.openTab !== 'debit', 'text-white bg-emerald-600': action.openTab === 'debit' }">
                    {{ $t('labels.debit') }}
                  </a>
                </li>
                <li class="nav-item" v-if="!isModel">
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
      :is-model="isModel"
      :is-planned="isPlanned"
      :accounts="input.account"
      :categories="input.category"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <IncomeForm v-if="action.openTab === 'incoming'"
      :is-model="isModel"
      :is-planned="isPlanned"
      :accounts="input.account"
      :categories="input.category"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <TransferForm v-if="action.openTab === 'transfer'"
      :is-model="isModel"
      :is-planned="isPlanned"
      :accounts="input.account"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <DebitForm v-if="action.openTab === 'debit'"
      :is-model="isModel"
      :is-planned="isPlanned"
      :accounts="input.account"
      :debits="input.debit"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      @save="handleSave" />

    <SavingForm v-if="action.openTab === 'saving'"
      :is-model="isModel"
      :is-planned="isPlanned"
      :accounts="input.account"
      :goals="input.goals"
      :currencies="input.currency"
      :payment-types="input.payment_type"
      :goal-id="goalId"
      @save="handleSave" />

    <AlertModal ref="alertModal" />
  </div>
</template>

<script>
import { useAppSettings } from '../../storage/settings.store';
import CoreService from '../../services/core.service';
import AlertModal from '../GenericComponents/AlertModal.vue';
import ExpenseForm from './ExpenseForm.vue';
import IncomeForm from './IncomeForm.vue';
import TransferForm from './TransferForm.vue';
import DebitForm from './DebitForm.vue';
import SavingForm from './SavingForm.vue';
import GoalService from '../../services/goal.service';

export default {
  components: {
    ExpenseForm,
    IncomeForm,
    TransferForm,
    DebitForm,
    SavingForm,
    AlertModal
  },
  props: {
    entryId: {
      type: String,
      default: null
    },
    isPlanned: {
      type: Boolean,
      default: false
    },
    isModel: {
      type: Boolean,
      default: false
    },
    typeOfEntry: {
      type: String,
      default: 'expenses'
    },
    goalId: {
      type: String,
      default: null
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
      }
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
    
    if(this.goalId) {
        this.action.openTab = 'saving'
        this.getGoals()
    } else {
        // Carica sempre i goals per controllare se esistono
        this.getGoals()
    }
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
        this.getDebit()
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
    handleSave(data) {
      this.apiService.setEntry(data.type, data, this.isPlanned, this.entryId)
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