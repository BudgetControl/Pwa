<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div class="px-4 py-5 flex-auto">
            <div class="tab-content tab-space">

                <div class="border p-2 mt-2" v-if="budgets.week.length != 0">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                        {{ $t('labels.weekly') }}
                    </span>

                    <BudgetComponent v-for="budget in budgets.week" :key="budget.budget.uuid" :budget="budget" :currency="currency" />

                </div>


                <div class="border p-2 mt-2" v-if="budgets.month.length != 0">

                    <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                        {{ $t('labels.monthly') }}
                    </span>

                    <BudgetComponent v-for="budget in budgets.month" :key="budget.budget.uuid" :budget="budget" :currency="currency" />
                </div>


                <div class="border p-2 mt-2 mb-2" v-if="budgets.year.length != 0">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                        {{ $t('labels.yearly') }}
                    </span>

                    <BudgetComponent v-for="budget in budgets.year" :key="budget.budget.uuid" :budget="budget" :currency="currency" />
                </div>

                <div class="border p-2 mt-2 mb-2" v-if="budgets.custom.length != 0">
                    <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                        {{ $t('labels.recursive') }}
                    </span>

                    <BudgetComponent v-for="budget in budgets.custom" :key="budget.budget.uuid" :budget="budget" :currency="currency" />
                </div>

            </div>
        </div>
    </div>
</template>
  
<script>
import ChartServiceVue from '@/services/ChartService.vue'
import LocalStorageServiceVue from '@/services/LocalStorageService.vue'
import BudgetComponent from '@/components/GenericComponents/BudgetComponent.vue'

export default {
    data() {
        return {
            budgets: {
                week: [],
                month: [],
                year: [],
                custom: []
            },
            currency: '€'
        }
    },
    components: {
        BudgetComponent
    },
    mounted() {
        this.init()

        try {
            const userconfig = LocalStorageServiceVue.get("user_setting")
            this.currency = userconfig.settings.currency_id
        } catch (e) {
            console.info(e)
        }

    },
    methods: {
        init: function () {
            const _this = this
            ChartServiceVue.getBudgets().then((resp) => {
                resp.forEach((data) => {
                    const period = data.budget.configuration.period
                    data.percentage = data.totalSpentPercentage.replace('%', '')
                    switch (period) {
                        case 'weekly':
                            _this.budgets.week.push(data)
                            break;
                        case 'monthly':
                            _this.budgets.month.push(data)
                            break;
                        case 'yearly':
                            _this.budgets.year.push(data)
                            break;
                        default:
                            _this.budgets.custom.push(data)
                            break;
                    }
                })

            })

        }
    }
}
</script>
  
  