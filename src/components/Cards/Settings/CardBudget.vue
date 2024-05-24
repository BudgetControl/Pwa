<template>
    <div class="block w-full overflow-x-auto mt-10">
        <div class="container x-4 mx-auto py-3">

            <router-link
                class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                to="/app/budgets/new">
                Create new budget
            </router-link>

            <!--content-->
            <div class="border p-2 mt-2" v-if="budgets.week.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    WEEK
                </span>
                
                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.week" :key="budget.budget.uuid" />
            </div>


            <div class="border p-2 mt-2" v-if="budgets.month.length != 0">

                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    MONTH
                </span>
                
                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.month" :key="budget.budget.uuid" />
            </div>


            <div class="border p-2 mt-2 mb-2" v-if="budgets.year.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    YEAR
                </span>
               
                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.year" :key="budget.budget.uuid" />
            </div>

            <div class="border p-2 mt-2 mb-2" v-if="budgets.custom.length != 0">
                <span class="text-xs font-semibold inline-block text-blueGray-400 ">
                    ONE SHOT BUDGET
                </span>
                
                <BudgetComponent :budget="budget" :currency="currency" v-for="budget in budgets.custom" :key="budget.budget.uuid" />
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

  