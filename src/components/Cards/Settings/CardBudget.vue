<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div class="container x-4 mx-auto py-3">

            <div class="container px-4 mx-auto py-3">
                <h3 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">{{ $t('labels.list_of_all_budgets') }} </h3>
            </div>

            <div
                v-if="budgets.week.length == 0 && budgets.month.length == 0 && budgets.year.length == 0 && budgets.custom.length == 0">
                <div class="text-center">
                    <p class="text-blueGray-400 text-lg">{{ $t('labels.no_budgets_found') }}</p>
                </div>
            </div>
            <!--content-->
            <div class="border p-2 mt-2" v-if="budgets.week.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    {{ $t('labels.weekly') }}
                </span>

                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.week"
                    :key="budget.budget.uuid" />
            </div>


            <div class="border p-2 mt-2" v-if="budgets.month.length != 0">

                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    {{ $t('labels.monthly') }}
                </span>

                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.month"
                    :key="budget.budget.uuid" />
            </div>


            <div class="border p-2 mt-2 mb-2" v-if="budgets.year.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    {{ $t('labels.yearly') }}
                </span>

                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.year"
                    :key="budget.budget.uuid" />
            </div>

            <div class="border p-2 mt-2 mb-2" v-if="budgets.custom.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    {{ $t('labels.one_shot') }}
                </span>

                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.custom"
                    :key="budget.budget.uuid" />
            </div>

        </div>
    </div>
</template>
<script>

import LocalStorageServiceVue from '../../../services/LocalStorageService.vue'
import ChartServiceVue from '../../../services/ChartService.vue'
import BudgetComponent from '../../GenericComponents/BudgetComponent.vue'

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
        edit: function (id) {
            console.log(id)
        },
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