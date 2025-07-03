<template>
    <!-- Mostra il form normale solo se ci sono goals -->
    <BaseEntryForm v-if="goals && goals.length > 0"
        entry-type="saving" 
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
                <WalletSelector v-model="account" :accounts="accounts" :required="true" :has-error="validationErrors.account" />
            </div>

            <div class="w-full lg:w-6/12 px-2 py-2">
                <select v-model="goal_id"
                    :class="[
                      'w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150',
                      { 'border-red-300 bg-red-50': validationErrors.goal }
                    ]">
                    <option :value="false">{{ $t('labels.choose_a_goal') }}</option>
                    <option v-for="item in goals" :key="item.id" :value="item.uuid">{{ item.name }}</option>
                </select>
            </div>

            <!-- Radio buttons for saving type -->
            <div class="w-full px-2 py-2">
                <div class="grid grid-cols-2 gap-4 bg-white">
                    <label for="deposit"
                        class="flex items-center justify-center p-3 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                        :class="{ 'border-green-500 bg-green-50': saving_type === '+', 'border-gray-300': saving_type !== '+' }">
                        <input type="radio" id="deposit" value="+" v-model="saving_type" class="mr-2" />
                        <span class="text-slate-600 text-sm font-medium">{{ $t('labels.deposit') }}</span>
                    </label>
                    <label for="withdrawal"
                        class="flex items-center justify-center p-3 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                        :class="{ 'border-red-500 bg-red-50': saving_type === '-', 'border-gray-300': saving_type !== '-' }">
                        <input type="radio" id="withdrawal" value="-" v-model="saving_type" class="mr-2" />
                        <span class="text-slate-600 text-sm font-medium">{{ $t('labels.withdrawal') }}</span>
                    </label>
                </div>
            </div>
        </template>
    </BaseEntryForm>
    
    <!-- Mostra solo il pulsante se non ci sono goals -->
    <div v-else class="bg-emerald-200 container relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0 flex-auto p-4">
        <div class="text-center py-8">
            <div class="mb-6">
                <i class="fas fa-piggy-bank text-6xl text-emerald-600 mb-4"></i>
                <h3 class="text-xl font-bold text-slate-700 mb-2">{{ $t('labels.no_goals_available') }}</h3>
                <p class="text-slate-600 text-sm mb-6">{{ $t('labels.create_goal_to_start_saving') }}</p>
            </div>
            
            <router-link to="/app/goals/new" 
                class="inline-block bg-emerald-500 text-white font-bold py-3 px-6 rounded-full shadow hover:shadow-lg hover:bg-emerald-600 transition-all duration-150">
                <i class="fas fa-plus mr-2"></i>
                {{ $t('labels.create_first_goal') }}
            </router-link>
        </div>
    </div>
</template>

<script>
import BaseEntryForm from './BaseEntryForm.vue';
import WalletSelector from '../Input/WalletSelector.vue';

export default {
    name: 'SavingForm',
    components: {
        BaseEntryForm,
        WalletSelector
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
        goals: {
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
        goalId: {
            type: String,
            default: null
        },
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
            goal_id: false,
            saving_type: '+',
            validationErrors: {
                account: false,
                goal: false
            }
        }
    },
    mounted() {
        if (this.goalId) {
            this.goal_id = this.goalId
        }

        const queryParamsGoalType = this.$route.query.goal_type || null;
        if (queryParamsGoalType) {
            this.saving_type = queryParamsGoalType === 'withdrawal' ? '-' : '+'
        }
    },
    methods: {
        handleEntryLoaded(entryData) {
            console.log('SavingForm - Entry data received:', entryData) // Debug
            
            // Popola i campi specifici del form saving
            this.account = entryData.account_id ? entryData.account_id.toString() : "-1"
            this.goal_id = entryData.goal_id || false
            
            // Determina il tipo di saving dall'amount
            this.saving_type = entryData.amount < 0 ? '-' : '+'
            
            console.log('SavingForm - Set account:', this.account, 'goal_id:', this.goal_id, 'type:', this.saving_type) // Debug
        },
        
        validateForm() {
            // Non validare se non ci sono goals disponibili
            if (!this.goals || this.goals.length === 0) {
                this.$refs.baseForm.showAlert(this.$t('messages.validation.create_goal_first'), 'warning')
                return false
            }

            this.validationErrors = {
                account: this.account === "-1",
                goal: !this.goal_id || this.goal_id === false
            }
            
            const errors = []
            
            if (this.validationErrors.account) {
                errors.push(this.$t('messages.validation.choose_wallet'))
            }
            
            if (this.validationErrors.goal) {
                errors.push(this.$t('messages.validation.choose_goal'))
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
            
            const savingData = {
                ...baseData,
                type: "saving",
                account_id: parseInt(this.account),
                category_id: 62, // Saving non ha categoria
                goal_id: this.goal_id,
                amount: this.saving_type === '-' ? Math.abs(baseData.amount) * -1 : Math.abs(baseData.amount)
            }
            
            this.$emit('save', savingData)
        }
    }
}
</script>
